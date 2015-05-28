// $(dom).mutiImg([{src:"",pic_id:""},{src:"",pic_id:""}]);
	(function($) {
		$.fn.extend({
			gallery : function(options) {
				return this.each(function(i) {
					if (!$(this).data('gallery')) {
						$(this).data('gallery', new Gallery(options, $(this)));
					}
					var galleryObj = $(this).data('gallery');
					if (typeof options === 'string') {
						if (typeof galleryObj[options] === 'function') {
							(galleryObj[options])();
						}
					}
				});
			}
		});

		function Gallery(options, $obj) {
			this.options = {
				imgs : null,// 图片数组[{src:"",pic_id:""}]
			};
			var config = {
				firstGet : 0,
				focus : 0,// 焦点图片索引
				count : 0,
				shell : $obj,
				trueLength : 0,// gallery真实长度
				cellLength : 59,
				stagLength : 413,// gallery显示长度
				squares : $('<ul class="gallery-squares"></ul>'),// 九宫格
				gallery : $('<div class="gallery"></div'),
				showBox : $('<div class="showBox"></div>'),
				chooseBox : $('<div class="chooseBox"></div'),
				arrowPre : $('<a class="arrow pre">&lt</a>'),
				arrowNext : $('<a class="arrow next">&gt</a>'),
				stagBox : $('<div class="stagBox"><ul></ul></div>'),
				loading : $('<img class="gallery-loading-gif" src="../img/gallery/loading.gif"/>')
			}
			var Dispacher = {
				connect : function(event, fun) {
					config.shell.bind(event, fun);
				},
				notify : function(event, args) {
					config.shell.trigger(event, args);
				}
			};
			init.apply(this);
			function init() {
				initConfigs.apply(this);
				initUI.apply(this);
				initActions.apply(this);
			}
			function initConfigs() {
				// 判断是否为数组
				if (_isArray(options)) {
					this.options.imgs = options;
				}else if(typeof options==='string'){
					if(_isArray(eval(options))){
						this.options.imgs = eval(options);
					}else if(typeof eval(options) === 'object'){
						$.extend(this.options, eval(options));
					}
				} else if (typeof options === 'object') {
					$.extend(this.options, options);
				}
				if (this.options.imgs != null) {
					if (this.options.imgs.length > 9) {
						this.options.imgs.length = 9;
					}
					config.count = this.options.imgs.length;
				}
			}
			function _isArray(obj){
				if (obj && typeof obj == 'object'
					&& typeof obj.length == 'number'
					&& typeof obj.splice == 'function'
					&& !(obj.propertyIsEnumerable('length'))) {
					return true;
				}
				return false;
			}
			function initUI() {
				// ui
				config.shell.addClass('gallery-shell');
				config.shell.append(config.squares).append(config.gallery);
				config.gallery.append(config.showBox).append(config.chooseBox);
				config.chooseBox.append(config.arrowPre).append(config.stagBox)
						.append(config.arrowNext);
				config.showBox.append(config.loading);

				config.stagLength = $('.stagBox', config.shell).width();
				config.trueLength = config.cellLength * config.count;
				var sizeConfig=this.options.imgs.length>1?'width="80" height="80"':'';
				for (var i = 0; i < this.options.imgs.length; i++) {
					config.squares.append('<li><img '+sizeConfig+' src="'+ this.options.imgs[i].src
									+ '" alt="'+ (this.options.imgs[i].alt ? this.options.imgs[i].alt: "") + '"></img></li>');
					$('ul', config.stagBox).append(
									'<li><a href="javascript:void(0);"'
											+ '><img src="'
											+ this.options.imgs[i].src
											+ '" alt="'
											+ (this.options.imgs[i].alt ? this.options.imgs[i].alt
													: "") + '"></img></a></li>')
				}
				$.each($('ul li', config.stagBox), function(i, item) {
					$('a', this).data('index', i);
				});
				$.each($('li', config.squares), function(i, item) {
					$('img', this).data('index', i);
				});
				Dispacher.connect('arrowListener',
						function(event, args) {
							if (parseFloat($('ul', config.stagBox).css(
									'margin-left')) <= config.stagLength
									- config.trueLength) {
								config.arrowNext.addClass('disabled');
							} else {
								config.arrowNext.removeClass('disabled');
							}
							if (parseFloat($('ul', config.stagBox).css(
									'margin-left')) >= 0) {
								config.arrowPre.addClass('disabled');
							} else {
								config.arrowPre.removeClass('disabled');
							}
						});
				Dispacher.connect('imgSlid', function(event, args) {
					$('ul', config.stagBox).clearQueue();
					$('ul', config.stagBox).animate(
							{
								"margin-left" : (args.operator ? args.operator
										+ '=' : '')
										+ args.slid
							}, 500, function() {
								Dispacher.notify('arrowListener');
							});
				});
				Dispacher.notify('arrowListener');

			}

			function initActions() {
				var that = this;
				// 九宫格点击 1.九宫格和gallery切换 2.获取当前图片
				config.squares.delegate('img', 'click', function() {

					$(this).after(config.loading.show());
					changeFocus.apply(that, [ $(this).data('index'),
							function() {
								config.loading.hide();
								toggleModule.apply(that);
							} ]);
				});
				// stagBox点击切换当前图片
				config.stagBox.delegate('a', 'click', function() {
					changeFocus.apply(that, [ $(this).data('index') ]);
				});
				// 后滚
				config.arrowNext
						.click(function() {
							if (parseFloat($('ul', config.stagBox).css(
									'margin-left')) > config.stagLength
									- config.trueLength) {
								var slid = config.stagLength
										- config.trueLength
										- parseFloat($('ul', config.stagBox)
												.css('margin-left'));
								if (Math.abs(slid) > config.stagLength) {
									slid = -config.stagLength;
								}
								Dispacher.notify('imgSlid', {
									operator : '+',
									slid : slid
								});

							}

						});
				// 前滚
				config.arrowPre
						.click(function() {
							if (parseFloat($('ul', config.stagBox).css(
									'margin-left')) < 0) {
								var slid = parseFloat($('ul', config.stagBox)
										.css('margin-left'));
								if (Math.abs(slid) > config.stagLength) {
									slid = -config.stagLength;
								}
								Dispacher.notify('imgSlid', {
									operator : '-',
									slid : slid
								});
							}
						});

				var mouseMoveTimer = null;
				config.showBox.mousemove(function(event) {
					// 函数节流，减少mousemove
					var e = event || window.event, context = this;
					clearTimeout(mouseMoveTimer);
					mouseMoveTimer = setTimeout(function() {
						mouseMoveFunc.call(context, e);
					}, 50);
				});

				var mouseMoveFunc = function(e) {
					if (e.offsetX == undefined) {
						var x = e.pageX - $(this).offset().left;
					} else {
						var x = e.offsetX;
					}

					if (x < $(this).width() / 3.0) {

						if (config.focus != 0) {
							$(this).removeClass('rightCursor').removeClass(
									'smallCursor').addClass('leftCursor');
						} else {
							$(this).removeClass('rightCursor').removeClass(
									'leftCursor').addClass('smallCursor');
						}
						// console.log(1);
					} else if (x >= $(this).width() / 3.0
							&& x <= $(this).width() * 2.0 / 3.0) {

						$(this).removeClass('rightCursor').removeClass(
								'leftCursor').addClass('smallCursor');
						// console.log(2);
					} else {

						if (config.focus == config.count - 1) {
							$(this).removeClass('rightCursor').removeClass(
									'leftCursor').addClass('smallCursor');
						} else {
							$(this).removeClass('smallCursor').removeClass(
									'leftCursor').addClass('rightCursor');
						}
						// console.log(3);
					}
				}
				config.showBox.delegate('img', 'click', function(event) {
					var e = event || window.event;
					// console.log(event);
					if (e.offsetX == undefined) {
						var x = e.pageX - $(this).offset().left;
					} else {
						var x = e.offsetX;
					}
					if (x < $(this).width() / 3.0) {
						if ($(this).data('index') === 0) {
							toggleModule.apply(that);
						} else {
							changeFocus.apply(that,
									[ $(this).data('index') - 1 ]);
						}
					} else if (x >= $(this).width() / 3.0
							&& x <= $(this).width() * 2.0 / 3) {
						toggleModule.apply(that);
					} else {
						if ($(this).data('index') < config.count - 1) {
							changeFocus.apply(that,
									[ $(this).data('index') + 1 ]);
						} else {
							toggleModule.apply(that);
						}
					}
				});
				$(document).keydown(function(event) {
					var e = event || window.event;
					var code = e.keyCode || e.which;
					if (code == 39) {// →
						changeFocus.call(that, config.focus + 1);
					} else if (code == 37) {// ←
						changeFocus.call(that, config.focus - 1);
					}

				});
			}
			function changeFocus(index, callback) {
				var that = this;
				if (index < 0) {
					index = 0;
				} else if (index >= config.count) {
					index = config.count - 1;
				}
				if (config.showBox.is(':visible')) {
					config.showBox.append(config.loading.show());
				}
				showBigImg.apply(that, [ index, callback ]);

			}
			function showBigImg(index, callback) {
				var img = new Image();
				img.src = this.options.imgs[index].target_src;
				var that = this;
				img.onload = function() {
					$(img).addClass('bigImg');
					$(img).attr('alt',that.options.imgs[index].alt ? that.options.imgs[index].alt: "").data('index', index);
					if(img.width>=config.shell.width()){
						$(img).attr('width',config.shell.width());
					}else{
						$(img).attr('width',img.width);
					}
					$('.bigImg', config.showBox).remove();
					config.showBox.prepend(img);

					config.focus = index;// 改变当前焦点
					config.loading.hide();
					if (callback && callback != null
							&& typeof callback == 'function') {
						callback.call(this);
					}
					$('ul li a', config.stagBox).css('border',
							'solid 2px transparent');
					$('ul li:nth-child(' + (index + 1) + ') a', config.stagBox)
							.css('border', 'solid 2px #f00');

					// 居中显示
					var left = index * config.cellLength + config.cellLength
							/ 2.0;
					var center = config.stagLength / 2.0;
					var slid = center - left;
					if (slid > 0 || config.stagLength >= config.trueLength) {
						slid = 0;
					} else if (slid < config.stagLength - config.trueLength) {
						slid = config.stagLength - config.trueLength;
					}
					Dispacher.notify('imgSlid', {
						slid : slid
					});
				}
			}
			function toggleModule() {
				config.squares.toggle();
				config.gallery.toggle();
			}
			if (typeof Gallery._initialized == 'undefined') {
				// prototype public函数
				Gallery.prototype.test = function() {
					alert("test");
				}
			}
			Gallery._initialized = true;
		}
	})(jQuery)
