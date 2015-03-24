define(function() {
	var Dispacher={
			connect : function(event,fun){
				$("body").bind(event,fun);
			},
	        notify : function(event,args){
	        	$("body").trigger(event,args);
	        }
	};

	window.Dispacher=Dispacher;
	/*function getOs()
{
	   if(navigator.userAgent.indexOf("MSIE")>0) {
	        return "MSIE";
	   }
	   if(navigator.userAgent.indexOf("Firefox")>0){
	        return "Firefox";
	   }
	   if(navigator.userAgent.indexOf("Safari")>0) {
	        return "Safari";
	   } 
	   if(navigator.userAgent.indexOf("Camino")>0){
	        return "Camino";
	   }
	   if(navigator.userAgent.indexOf("Gecko/")>0){
	        return "Gecko";
	   }
	  
}*/

function getOs(){
    var browserName=navigator.userAgent.toLowerCase();
    if(/msie/i.test(browserName) && !/opera/.test(browserName)){
        return "IE";
    }else if(/firefox/i.test(browserName)){
        return "Firefox";
    }else if(/chrome/i.test(browserName) && /webkit/i.test(browserName) && /mozilla/i.test(browserName)){
        return "Chrome";
    }else if(/opera/i.test(browserName)){
        return "Opera";
    }else if(/webkit/i.test(browserName) &&!(/chrome/i.test(browserName) && /webkit/i.test(browserName) && /mozilla/i.test(browserName))){
        return "Safari";
    }else{
        return "unKnow";
    }
}
window.getOs=getOs;
});