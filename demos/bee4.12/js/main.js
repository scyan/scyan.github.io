define(function(require, exports, module) {
require('./base');
var source=require('./source');
require('./velocity');
require('./cellList');
require('./nextList');
require('./scoreBoard');
var cell=require('./cell');
require('./drawBackground');
require('./drawHandle');


	$('#handleCanvas').css('top',$('#bkCanvas').position.top);
	$('#handleCanvas').css('left',$('#bkCanvas').position.left);
function loadImages(sources, callback){
	//var images={};
	var num=0;//资源数
	var loadNum=0;//已加载资源数
	for(var src in sources){
		num++;//所有资源数目
	}
	for(var src in sources){
		source.images[src]=new Image();
		source.images[src].onload=function(){
			loadNum++;
			if(loadNum>=num){
				callback();
			}
		};
		source.images[src].src=sources[src];
	}
}
/*var T={
	init:function(){
	  source.init();
	  
    }
};*/

$(function(){
	source.init();
	velocity.init();
	scoreBoard.init();
	nextList.init();
	cellList.init();
    source.loadImages(function(){

    	  drawBk.init();
    	  drawRegion.init();
    });
	$('#speed').html(velocity.getSpeed());

	$('[action-type=speedUp]').click(function(){
		 var speed=velocity.speedUp();
    	  if(speed){
	   	 	$('#speed').html(speed);
   		 }
	});
	$('[action-type=slowDown]').click(function(){
		 var speed=velocity.slowDown();
		if(speed){
	    	$('#speed').html(speed);
		}
	});
/*    loadImages(source.files,function(){
    	  drawBk.init();
     	  drawRegion.init();
    });*/

});
});