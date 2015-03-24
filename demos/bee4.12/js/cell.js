define(function(require, exports, module) {
    var source=require('./source');

function Cell(options){
    	$.extend(this,options);
    	var that=this;
    	this.type=options.type||'main';
    	this.ballP=options.ballP||{x:that.position.x+source.scale().width/2,y:that.position.y+source.scale().height/2},
    	this.neighbor=[];
    	this.radius=(this.type==='main')?source.radius().ballRadius:source.radius().nextRadius;
    	this.fixedR=this.radius;
    	this.maxR=(this.type==='main')?source.radius().maxRadius:source.radius().nextRadius;
    	this.empty=true;
    	this.selected=false;
    	this.parent=0;
    	this.next=0;
        this.path=[];
        this.s=0;//路径长度，一个cell到隔壁cell S为1
        this.v={x:0,y:0};//速度矢量
        this.color=options.color||2;
        

    };
    Cell.prototype.isEmpty=function(){
    	return this.empty;
    };
    Cell.prototype.clear=function(){
    	var that=this;
    	this.ballP={x:that.position.x+source.scale().width/2,y:that.position.y+source.scale().height/2};
    	this.empty=true;
    	//this.parent=0;
    };
    Cell.prototype.fill=function(){	
        this.radius=this.fixedR;
    	this.empty=false;
    };
    Cell.prototype.fillGradually=function(that,r){
    	var that=that||this;
        that.empty=false;
        that.radius=r||0.5;
        Dispacher.notify('drawBk.draw');
     //   drawBk.draw();//重画
        if(that.radius<that.fixedR){
          setTimeout(function(){
            that.fillGradually(that,that.radius+velocity.fillSegment());
          },1);
        }else{
        	if(that.type==='main'){
        		cellList.minusEmpty(1);
        			if(that.next===0){
                		Dispacher.notify('fillCompleted');
                	}else{
                		 that.next.fillGradually();
                		 that.next=0;
                	}
        	}
        }    
    };
    Cell.prototype.removeGradually=function(){
    		this.radius-=Math.abs(this.radius/30);
    	//this.radius-=source.fillSegment;
    };
    Cell.prototype.setColor=function(color){
       if(typeof color==='number'&&color>=0&&color<=7){
         this.color=color;
       }
    };
    Cell.prototype.isSelected=function(){
    	return this.selected;
    };
    Cell.prototype.select=function(){
    	this.radius=this.maxR;
    	this.selected=true;
    };
    Cell.prototype.unSelect=function(){
    	this.radius=source.radius().ballRadius;
    	this.selected=false;
    };
    Cell.prototype.stop=function(){
    	this.next=0;
    	this.v={x:0,y:0};
    	this.s=0;
    };
    Cell.prototype.move=function(args){
         var that=args&&args.that||this;
         var segment=args&&args.segment||(velocity.moveSteps()+1);//一个cell到相邻的cell所需步数
         var cells=cellList.get_cells();
         var start,end;
    	if(that.s>0){
    		if(segment===(velocity.moveSteps()+1)){
    			if(that.next===0){
    				start=that;
    			}else{
    				start=cells[that.next];
    			}
    			that.next=that.path.pop();
    			
    			end=cells[that.next];
        		that.getVelocity(start,end);     		
    		}
    		if(segment>1){
    			that.ballP.x+=that.v.x;
    			that.ballP.y+=that.v.y;
    			segment--;
    		}else{
    			segment=velocity.moveSteps()+1;
    			that.s--;
    		}
             Dispacher.notify('drawBk.draw');
    	//	drawBk.draw();//重画
    		setTimeout(function(){
    			that.move({that:that,segment:segment});
    		},1/1000);	
		}else{
			
			var focus=that.next;
			cells[that.next].fill();
			cells[that.next].setColor(that.color);
			that.clear();
			that.unSelect();	
			that.stop();
			Dispacher.notify('moveCompleted', {cell:cells[focus]});
		}
    };
    Cell.prototype.getVelocity=function(start,end){//速度矢量
    	for(var i=0;i<6;i++){
    		if(end.id===start.neighbor[i]){
    			//this.v=source.getVelocity(i);
    			this.v=velocity.getV(i);
    			break;
    		}
    	}
	};
	module.exports=Cell;
});