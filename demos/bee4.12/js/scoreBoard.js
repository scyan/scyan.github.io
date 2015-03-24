define(function(require, exports, module) {
scoreBoard=function(){
	
    var score=0,heighestScore=0;
    function _clear(){
    	score=0;
    }
    function _add(num){
    	//if(typeof num==='Number'){
    		score+=Number(num);
    	//}
    }
    function _record(){
    	heighestScore=score;
		 Cookie.set('heighestscore',score,20);
    }
    return{
    	init:function(){
		    score=0;
			if(Cookie.check('heighestscore')){
			   heighestScore=Cookie.get('heighestscore');
			}else{
			   Cookie.set('heighestscore',0);
			   heightestScore=0;
			}
      
        	Dispacher.connect('newGame', function(){
        		_clear();
        	});
        	Dispacher.connect('removeCompleted', function(event,args){
        		if(args.type&&args.type==='auto'){
            		_add(1);
            	}else if(args.type&&args.type==='gameOver'){
            	}else{
            		_add(args.num);
            	}
            	
            	if(scoreBoard.getScore()>scoreBoard.getHeighest()){
            		_record();
            	}
        	});
        },
     
        getScore:function(){
        	return score;
        },
        getHeighest:function(){
        	return heighestScore;
        }
    };
}();

var Cookie={
    set:function(name,value,expiredays){
	   $.jStorage.set(name, value);
	 /*  var exdate=new Date();
       exdate.setDate(exdate.getDate()+expiredays);
       document.cookie=name+'='+escape(value)+
	                   ((expiredays==null)?"":";expires="+exdate.toGMTString())+'path="/"';*/
					   
	},
	get:function(name){
	   /*var t_cookie=document.cookie;
	   //console.log(t_cookie);
	   if(t_cookie.length>0&&name!=null){
	       c_start=t_cookie.indexOf(name+'=');
		   if(c_start!=-1){
		      c_start=c_start+name.length+1;
			  c_end=t_cookie.indexOf(";",c_start);
			  if(c_end==-1){
			    c_end=t_cookie.length;
			  }
			  return unescape(t_cookie.substring(c_start,c_end));
		   }
	   }
	   return "";*/
	    return $.jStorage.get(name);
	},
	check:function(name){
	   var value=this.get(name);
	   if(value==""||value==null){
	      return false;
	   }else{
	      return true;
	   }
	},
	remove:function(name){
	   /* var exp=new Date();
		exp.setTime(exp.getTime()-1);
		var t_cookie=this.get(name);
		if(t_cookie!=""||t_cookie!=null){
		    document.cookie=name+"="+t_cookie+";expires="+exp.toGMTString();
		}*/
		$.jStorage.deleteKey(name);
	}
};
module.exports=scoreBoard;
});
