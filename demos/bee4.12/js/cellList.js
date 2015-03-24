define(function(require, exports, module) {
var source=require('./source');
var Cell=require('./cell');
 cellList=function(){
	var cells=[],emptyNum=80,fillingCells=[];
    function _goodNei(hosts,end,finish){//递归
	    	 var result=[];
	    	 var finish=finish||0;
	    	 var path=[];//存储路径结果堆栈，存储由end到start的下一个的ID
	    	// var that=this;
	    	 $.each(hosts,function(i,host){
	    		 $.each(host.neighbor,function(j,item){
				 //此邻居存在&&此邻居还未被计算入内&&此邻居为空&&主cell不是由这个邻居发展而来
	    	  		if(item!==0&&cells[item].parent===0&&cells[item].isEmpty()&&item!==host.parent.id){
	    	  			cells[item].parent=host;
	    	  		   result.push(cells[item]);
	    	  		   if(item===end.id){
	    	  			  var temp=end;
	    	  			  while(temp.parent!==0){
	    	  				  path.push(temp.id);
	    	  				  temp=temp.parent;
	    	  			  }
	    	  			  //path.push(temp.id);
	    	  			   finish=1;	    	  			   
	    	  			   return;
	    	  		   }
	    	  	    }
	    	     });
	  	       if(finish===1){
	  		     return;
	  	       }
	  	    });
	    	if(finish!==1&&result.length>0){
	    		return _goodNei(result,end,finish);
	    	}else{
	    	    return  path;
	    	}
	    }
	   function _same(hosts,result){//计算与hosts颜色相同的相邻小球个数，以hosts为第一层主球，向外层层推出
	    	var result=result||[];
	    	var temp=[];
	    	//var stop=0;
	         //var that=this;
	    	var k=0;
	    	$.each(hosts,function(i,host){
	    		$.each(host.neighbor,function(j,item){
				    //主球不是由这个邻居发展而来&&这个邻居没有被计算入内&&这个邻居非空&&这个邻居的颜色与主球颜色相同
	    			if(item&&item!==host.parent.id&&cells[item].parent===0&&!cells[item].isEmpty()&&cells[item].color===host.color){
	    				cells[item].parent=host;
	    				result.push(cells[item]);
	    				temp.push(cells[item]);
	    				k++;
	    			}
	    		});
	    	});
	    	if(k===0){
	    		return result;
		     }else{
			    return _same(temp,result);
   	         }
	  }
	  function get_same(cell){
	    	var sameArr=_same([cell]);
	    	var that=this;
	    	$.each(sameArr,function(i,item){
	    		item.parent=0;
	    	}); 
            if(sameArr.length>0){
            	sameArr.push(cell);
            }
	    	
	    	return sameArr;
	    }
	  function _fill(){//随机填空
	    	var num=nextList.nexNum();
	    	var color=nextList.nextColors();
	    	var index=0,i=0;
	        var fillArr=[];
	        if(emptyNum<=num){
	        	$.each(cells,function(i,item){
	        		if(typeof item==='object'&&item.isEmpty()){//item==='object'排除cells[0]
	        			fillArr.push(item);
	        		}
	        	});
	        	while(fillArr.length>0){
	        		
	        		index=Math.floor(Math.random()*fillArr.length);//fillArr里的cells做随机排序
	        		fillArr[index].setColor(color.pop());
	        		if(fillingCells.length>0){
	        			fillArr[index].next=fillingCells[fillingCells.length-1];//链表结构
	        		}
	        		fillingCells.push(fillArr[index]);//存入填充栈
	        		
	        		fillArr.splice(index,1);
	        	}
	        }else{
	        	while(i<num){
		    		index=Math.floor(Math.random()*80+1);//1-80
	    	    	if(cells[index].isEmpty()&&!fillArr[index]){
	    	    	  fillArr[index]=1;
	                  cells[index].setColor(color.pop());
	                  fillingCells.push(cells[index]);
	                  if(i!==0){
	                	  cells[index].next=fillingCells[i-1];
	                  }
	                  i++;
	        	    }	
		    	}
	        }
	    	
	    	fillingCells[fillingCells.length-1].fillGradually();
       }
	   function _removeBalls(cells,type,newGame){//消除一组颜色相同小球
	        $.each(cells,function(i,item){
	        	if(typeof item.removeGradually==='function'){
	        		item.removeGradually();
	        	}
	        });
	    	//source.kin_bk.drawStage();
	        drawBk.draw();
	        if(cells[1].radius>.7){
            	setTimeout(function(){
        		    _removeBalls(cells,type,newGame);
        		},1);
            }else{
            	$.each(cells,function(i,item){
            		if(typeof item.clear==='function'){
            		  item.clear();
            		}
       	        });
            
            	emptyNum+=cells.length;
            	Dispacher.notify('removeCompleted',{type:type||'normal',num:cells.length});
            	drawBk.draw();
    	        if(newGame){
    	        	newGame.call();
    	        }
            }
	        
	    }
	return {
		
		   init:function(){
		    	//var that=this;
				cells[0]='temp';
		        emptyNum=80;
		    		var scale=source.scale();
		    		var x=0;
		    		var y=scale.height/2;
		    		var k=1;
		    	    for(var i=0;i<10;i++){
		    	    	for(var j=0;j<8;j++){    	    
		    	    		cells.push(new Cell({id:k,position:{x:x,y:y},type:'main'}));
		    	    		k++;
		    	    		x+=scale.width*3/4;
		    	    		if(k%2){
		    	    			y+=scale.height/2;
		    	    		}else{
		    	    			y-=scale.height/2;
		    	    		}
		    	    	}
		    	    	x=0;
		    	    	y+=scale.height;
		    	    }
					// _a_
				//   f/   \b
			      // e\   /c
				//     -d—
		    	    $.each(cells,function(i,item){
		    	    	if(i!==0){
		    	    		if((item.id+7)%8===0){//左边界
		    	    			item.neighbor[4]=0;//e
		    	    			item.neighbor[5]=0;//f
		    	    		}
		    	    		if(item.id%8===0){//右边界
		    	    			item.neighbor[1]=0;//b
		    	    			item.neighbor[2]=0;//c
		    	    		}
		    	    		if(item.id%2===0){//偶数
		    	    			item.neighbor[0]=((item.id-8)>0&&item.neighbor[0]!==0)?cells[item.id-8].id:0;
		    	    			item.neighbor[1]=((item.id-7)>0&&item.neighbor[1]!==0)?cells[item.id-7].id:0;
		    	    			item.neighbor[2]=((item.id+1)<81&&item.neighbor[2]!==0)?cells[item.id+1].id:0;
		    	    			item.neighbor[3]=((item.id+8)<81&&item.neighbor[3]!==0)?cells[item.id+8].id:0;
		    	    			item.neighbor[4]=((item.id-1)>0&&item.neighbor[4]!==0)?cells[item.id-1].id:0;
		    	    			item.neighbor[5]=((item.id-9)>0&&item.neighbor[5]!==0)?cells[item.id-9].id:0;
		    	    		}else{//奇数
		    	    			item.neighbor[0]=((item.id-8)>0&&item.neighbor[0]!==0)?cells[item.id-8].id:0;
		    	    			item.neighbor[1]=((item.id+1)<81&&item.neighbor[1]!==0)?cells[item.id+1].id:0;
		    	    			item.neighbor[2]=((item.id+9)<81&&item.neighbor[2]!==0)?cells[item.id+9].id:0;
		    	    			item.neighbor[3]=((item.id+8)<81&&item.neighbor[3]!==0)?cells[item.id+8].id:0;
		    	    			item.neighbor[4]=((item.id+7)<81&&item.neighbor[4]!==0)?cells[item.id+7].id:0;
		    	    			item.neighbor[5]=((item.id-1)>0&&item.neighbor[5]!==0)?cells[item.id-1].id:0;
		    	    		}
		    	    	}
		    	    });
		    	    Dispacher.connect('moveCompleted', function(event,args){
		    	    	var sameCells=get_same(args.cell);
		    			if(sameCells.length>=6){
		    				_removeBalls(sameCells);
		    			}else{
		    				_fill();
		    			}
		    	    });
		            Dispacher.connect('fillCompleted', function(event,args){
		            	var same=[],temp=[];
		    	         $.each(fillingCells,function(i,item){
		    	        	 same=get_same(item);
		    	        	 if(same.length>=6){
		    	        		 $.each(same,function(j,item){
		    	        			 item.parent=81;
		    	        		 });
		    	        		 temp.concat(same);
		    	        		 _removeBalls(same,'auto');
		    	        		 
		    	        	 }
		    	         });
		    	         if(temp.length===0&&emptyNum<=0){
		    	        	 Dispacher.notify('gameOver');
		    	         }
		    	         $.each(temp,function(i,item){
		        	        	 item.parent=0;
		        	      });
		    	        fillingCells=[];
		            });
		            Dispacher.connect('gameOver', function(event,args){
		            	_removeBalls(cells,'gameOver',function(){
		            		Dispacher.notify('newGame');
		            	});
		            });
		            Dispacher.connect('newGame',function(event,args){
		            	emptyNum=80;
		            	_fill();
		            });
		          
		      },
				get_cells:function(){return cells;},
			    get_way:function(begin,end){
			    	var path=_goodNei([begin],end);
			    	//var that=this;
			    	$.each(cells,function(i,item){
			    		item.parent=0;
			    	});    	
			       return path;
			    },
			
			 
		        get_emptyNum:function(){
		        	return emptyNum;
		        },
		        addEmpty:function(num){
		        	if(typeof num==='number'){
		        		emptyNum+=num;
		        	}
		        	return emptyNum;
		        },
		        minusEmpty:function(num){
		        	if(typeof num==='number'){
		        		emptyNum-=num;
		        	}
		        	return emptyNum;
		        }
	};
}();
module.exports=cellList;
});