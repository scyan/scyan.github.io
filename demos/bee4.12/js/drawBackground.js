define(function(require, exports, module) {
	var source=require('./source');

drawBk = {
	settings:{
	kin_bk:null,
	//canvas:null,
	context:null
},
	init : function() {
		var bkContent=document.getElementById("bkCanvas");
		this.settings.context=bkContent.getContext("2d");
        this.draw();
		Dispacher.notify('newGame');
		var that=this;
		Dispacher.connect('drawBk.draw',function(){
			that.draw();
		});
		
	},
	draw:function(){
		var that=this;
		var cells = cellList.get_cells();
		var nextCells=nextList.get_cells();
		this.settings.context.clearRect(0, 0, 500, 550);
		that.drawNextArea();
		that.drawScoreBoard();
		$.each(cells, function(i, item) {
			if (i !== 0){
				that.settings.context.drawImage(source.images().cell, item.position.x,
						item.position.y);
		    }
		});
		$.each(cells, function(i, item) {
			if (i !== 0&&!item.isEmpty()) {
					that.settings.context.fillStyle = source.color(item.color);
					that.settings.context.beginPath();
					that.settings.context.arc(item.ballP.x, item.ballP.y, item.radius, 0,Math.PI * 2, true);
					that.settings.context.fill();
					that.settings. context.closePath();
		   }
	   });
		
	   $.each(nextCells,function(i,item){
		   if (!item.isEmpty()) {
			   that.settings.context.fillStyle = source.color(item.color);
			   that.settings.context.beginPath();
			   that.settings.context.arc(item.position.x, item.position.y, item.radius, 0,Math.PI * 2, true);
			   that.settings.context.fill();
			   that.settings.context.closePath();
		   }
	   });
	},
    drawNextArea:function(){
    	this.settings.context.fillStyle = "#444444";//#444444
		this.settings.context.beginPath();
		this.settings.context.fillRect(350,8,150,25); 
		this.settings.context.closePath();
	},
	drawScoreBoard:function(){
		this.settings.context.fillStyle = "#444444";
		this.settings.context.beginPath();
		this.settings.context.fillRect(350,50,150,25); 
		this.settings.context.fillRect(350,80,150,25); 
		this.settings.context.closePath();
		this.settings.context.fillStyle    = '#fff';
		this.settings.context.font         = 'italic 15px sans-serif';
		this.settings.context.textBaseline = 'top';
		this.settings.context.fillText  ('得分：'+scoreBoard.getScore(), 350, 55);
		this.settings.context.fillText  ('最高分：'+scoreBoard.getHeighest(), 350, 85);

		//this.settings.context.font         = 'bold 30px sans-serif';
		//this.settings.context.strokeText('Hello world!', 0, 50);
	}
	
	
};
module.exports=drawBk;
});