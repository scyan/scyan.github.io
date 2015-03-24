define(function(require, exports, module) {
/**
 * 
 */
 var source=require('./source');
 velocity=function(){
		var moveSteps,fillSegment;
		var maxMoveSteps=50,minMoveSteps=5,levels=10;//最大步数25 最小步数5 速度分10档
		var seg=(maxMoveSteps-minMoveSteps)/(levels-1);
		var v=[];
		function _calcVelocity(moveSteps){
		     var h=source.scale().height;
		     var seg=h/moveSteps;
			 for(i=0;i<6;i++){
			     	switch(i){
		    		case 0:
					    v[i]={x:0,y:-seg};
						break;
		    		case 1:
					    v[i]={x:seg*Math.sqrt(3)/2,y:-seg/2};
						break;
		    		case 2:
					    v[i]={x:seg*Math.sqrt(3)/2,y:seg/2};
						break;
		    		case 3:
					   v[i]= {x:0,y:seg};
					   break;
		    		case 4:
					   v[i]= {x:-seg*Math.sqrt(3)/2,y:seg/2};
					   break;
		    		case 5:
					    v[i]={x:-seg*Math.sqrt(3)/2,y:-seg/2};
						break;
		    		default:
					   break;
		    	}
			 }
			 
		}
		return {
			init:function(){
			   moveSteps=0;
			   fillSegment=0;
			   if(getOs()==='Chrome'){
			    	moveSteps=25;
				    fillSegment=0.5;
			    }else{
			    	moveSteps=15;
				    fillSegment=0.5;
			    }
		        _calcVelocity(moveSteps);
		    },
		    fillSegment:function(){
		    	return fillSegment;
		    },
		    moveSteps:function(){
		    	return moveSteps;
		    },
			getV:function(i){
				if(typeof i==='number'&&i>=0&&i<=5){
					return v[i];
				}else{
					return {x:0,y:0};
				}
			},
			speedUp:function(){
			  if(moveSteps>minMoveSteps){
			    moveSteps-=seg;
				 _calcVelocity(moveSteps);
				 return (maxMoveSteps-moveSteps)/seg+1;

			  }
				return false;
			},
			slowDown:function(){
			  if(moveSteps<maxMoveSteps){
			    moveSteps+=seg;
				 _calcVelocity(moveSteps);
				  return (maxMoveSteps-moveSteps)/seg+1;
			  }
			  return false;
			},
			getSpeed:function(){
			  return (maxMoveSteps-moveSteps)/seg+1;
			}
		};
}();
module.exports=velocity;
});