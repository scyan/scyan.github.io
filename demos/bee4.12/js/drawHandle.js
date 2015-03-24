define(function(require, exports, module) {
	var source=require('./source');
drawRegion = {
	settings:{
		work:false
	},
	init : function() {
		Dispacher.connect('fillCompleted removeCompleted',function(event,args){
			drawRegion.settings.work=true;
		});
		Dispacher.connect('newGame moveStart',function(event,args){
			drawRegion.settings.work=false;
		});
		var kin_handle = source.kin_handle();
		var canvas = kin_handle.getCanvas();
		var context = kin_handle.getContext();
		var cells = cellList.get_cells();
		var x, y, selectedBall = 0;
		var path;
		kin_handle.setDrawStage(function() {
			kin_handle.clear();
			$.each(cells, function(i, item) {
				if (i !== 0) {
					kin_handle.beginRegion();
					x = item.position.x + source.scale().width / 2;
					y = item.position.y + source.scale().height / 2;

					context.beginPath();
					context.arc(x, y, 15, 0, Math.PI * 2, true);
					context.closePath();
					kin_handle.addRegionEventListener("onmouseover",
							function() {
								document.body.style.cursor = "pointer";
							});
					kin_handle.addRegionEventListener("onmouseout", function() {
						   document.body.style.cursor = "default";
					});
					kin_handle.addRegionEventListener("onmousedown",
					  function() {
						if(drawRegion.settings.work===true){
							if (!item.isEmpty()) {
								selectedBall > 0 ? cells[selectedBall]
										.unSelect() : '';
								selectedBall = i;
								item.select();
								drawBk.draw();//重画
							} else if (selectedBall !== 0) {
								// 计算selectedball到此处最短距离，并存入selectedball
						        path = cellList.get_way(cells[selectedBall], item);
						       if (path.length > 0) {
							      cells[selectedBall].path = path;
							      cells[selectedBall].s = path.length;
							      Dispacher.notify('moveStart');
							      cells[selectedBall].move();
							      selectedBall = 0;
						       }
					      }
						}
					});
					kin_handle.closeRegion();
				}
			});
			
		});
	},
};
module.exports=drawRegion;
});