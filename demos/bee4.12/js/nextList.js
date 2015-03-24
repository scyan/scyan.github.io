define(function(require, exports, module) {
var Cell=require('./cell');

nextList=function(){
		
        var cells=[],num=3,color=[];

        function clear(){
     		for(var i=0;i<6;i++){
 	    		cells[i].clear();
 	    	}
        }
        function changeNext(){
     	    clear();
     	    var score=scoreBoard.getScore();
     	    var emptyNum=cellList.get_emptyNum();
     	    if(score>=0&&score<39){
     	    	num=3;
     	    }else if(score<119){
     	    	num=(emptyNum>4)?4:3;
     	    }else if(score<325){
			    if(emptyNum<=5){
				    num=3;
				}else if(emptyNum<=7){
				    num=4;
				}else{
				    num=5;
				}
			}else{
     	    	if(emptyNum<=5){
     	    		num=3;
     	    	}else if(emptyNum<=7){
     	    		num=4;
     	    	}else if(emptyNum<=17){
     	    		num=5;
     	    	}else{
				    num=6;
				}
     	    }
     	    color=[];
     	    var tempColor,a;
 	    	for(var i=0;i<num;i++){
 	    		a=Math.floor(Math.random()*2+1);
 	    		if(a===1){
 	    			tempColor=Math.floor(Math.random()*8);
 	    			//tempColor=Math.floor(Math.random()*7);
 	    		}else{
 	    			tempColor=Math.floor(Math.random()*6);
 	    			//tempColor=Math.floor(Math.random()*5);
 	    		}
 	    		color.push(tempColor);
 	    		cells[i].color=tempColor;
 	    		cells[i].fillGradually();
 	    	}
        }
        return{
        	init:function(){
     	       var x=480,y=20;
     	       num=3;
     	       for(var i=0;i<6;i++){
     	    	 cells.push(new Cell({id:i,position:{x:x,y:y},type:'next'}));
     	    	 x-=22;
     	       }
     	       Dispacher.connect('newGame fillCompleted', function(evnet,args){
     	    	   changeNext();
     	       });
     	     
            },
            get_cells:function(){
         	   return cells;
            },
            nextColors:function(){
            	return color;
            },
            nexNum:function(){
         	   return num;
            },
   
        };
	
}();
module.exports=nextList;
});