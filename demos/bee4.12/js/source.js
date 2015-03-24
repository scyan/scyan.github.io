define(function(require, exports, module) {
var source=function(){
	    var scale;
	    var kin_handle;
	    var files;
	    var images;
	    var ballRadius;
	    var maxRadius;
	    var nextRadius;
	    var color;
	    return {
	    	init:function(){
		       scale={width:53,height:49};
			   kin_handle=new Kinetic_2d("handleCanvas");
			 
			    files={
			    	      cell:'./images/cell.png'
		        };
			    images={};
			    ballRadius=16;
			    maxRadius=20;
			    nextRadius=10;
			    color=[
							"#FF0000",//red
							"#FFFF33",//yellow:
							"#99FF33",//green:
							"#33FFFF",//blue:
							"#0000FF",//scyan:
							"#FFB7DD",//pink:
							"#FF8800",//orange:
							"#FFFFFF"//white:
                         /*						
                            "#FF0000 ",//red
							"#FFFF00",//yellow
							"#00FFFF",//cyan
							"#0000AA",//scyan
							"#cc00ff",//purple
							"#FFFFFF",//white
							"#000000"//black
*/					       ];
	    },
	    scale:function(){return scale;},
		kin_handle:function(){return kin_handle;},
		radius:function(){return {ballRadius:ballRadius,maxRadius:maxRadius,nextRadius:nextRadius};},
		color:function(i){return color[i];},
		images:function(){return images;},
		loadImages:function(callback){
			var num=0;//资源数
			var loadNum=0;//已加载资源数
			for(var src in files){
				num++;//所有资源数目
			}
			for(var src in files){
				images[src]=new Image();
				images[src].onload=function(){
					loadNum++;
					if(loadNum>=num){
						callback();
					}
				};
				images[src].src=files[src];
			}
		}
	    };
}();
module.exports=source;
});