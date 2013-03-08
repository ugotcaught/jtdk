(function() {

JS.define('JS.ui.Display', {
	singleton:true,
	requires:['JS.util.System'],
		
	constructor: function(){	
		
	},
	getNode: function(id){
		return JS.isString(id)?document.getElementById(id):id;
	},
	getInfo: function(key, nWin){
		var Sys = this.ns('JS.util.System'),
    	    br = Sys.browser,
    	    win = nWin?nWin:window,
    	    doc = win.document,
    	    body = doc.body,
    		docEl = doc.documentElement;    		

		if(key=='viewHeight'||key=='height') {
			var viewHeight = win?win.innerHeight:self.innerHeight // Safari, Opera
				, mode = doc['compatMode'];

		    if ((mode || br.name=='IE') && br.name!='Opera') { // IE, Gecko
		    	viewHeight = (mode == 'CSS1Compat') ?
		                docEl.clientHeight : // Standards
		                body.clientHeight; // Quirks
		    }
		    if(key=='viewHeight') return viewHeight;	

		    var scrollHeight = (mode != 'CSS1Compat' || br.engine=='webkit') ? body.scrollHeight : docEl.scrollHeight
	    		, height = Math.max(scrollHeight, viewHeight);
	    	return height;			
		};
		if(key=='viewWidth'||key=='width') {
			var viewWidth = win?win.innerWidth:self.innerWidth // Safari
				, mode = doc['compatMode'];

		    if (mode || br.name=='IE') { // IE, Gecko, Opera
		    	viewWidth = (mode == 'CSS1Compat') ?
		                docEl.clientWidth : // Standards
		                body.clientWidth; // Quirks
		    }
		    if(key=='viewWidth') return viewWidth;	

		    var scrollWidth = (mode != 'CSS1Compat' || br.engine=='webkit') ? body.scrollWidth : docEl.scrollWidth
	    		, width = Math.max(scrollWidth, viewWidth);
	    	return width;			
		};
		
		switch (key) {
		case 'screenX':			
			return br.name=='IE'||br.name=='Opera'?win.screenLeft:win.screenX;
		case 'screenY':
			return br.name=='IE'||br.name=='Opera'?win.screenTop:win.screenY;	
		case 'outerWidth':
			return win.outerWidth||null;	
		case 'outerHeight':
			return win.outerHeight||null;
		default:
			return null;
		}	
	},	
	createNode: function(){
		
	},
	/**
	 * Better performance than "innerHTML".
	 * 
	 * @method replaceHtml
	 * @param {String|HTMLElement} el
	 * @param {String} html
	 * @return {HTMLElement}
	 */
	replaceHtml: function(el, html) {   
	    var oldEl = typeof el === "string" ? document.getElementById(el) : el;
	    
	    var Sys = this.ns('JS.util.System'),
	        br = Sys.browser;
	    if(br.name=='IE' || !oldEl.parentNode){// Pure innerHTML is slightly faster in IE 
			oldEl.innerHTML = html;  
	        return oldEl;
		}else{
			var newEl = oldEl.cloneNode(false);   
	    	newEl.innerHTML = html;   
	    	oldEl.parentNode.replaceChild(newEl, oldEl);   
	    	return newEl;	
		}      
	}
})

})();