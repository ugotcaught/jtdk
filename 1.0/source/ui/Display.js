(function() {
var document = window.document,     
	documentElement = document.documentElement,
	KEY_ATTRIBUTES = {},
	DOT_ATTRIBUTES = {};
	
var toEl = function(id){
	return JS.isString(id)?document.getElementById(id):id;
}
var toEls = function(id){
	var el = toEl(id);
	return Array.toArray(el);	
}
var reCache = [], getCSSRegex = function(className) {
    var re;
    if (className !== undefined) { // allow empty string to pass
        if (className.exec) { // already a RegExp
            re = className;
        } else {
            re = reCache[className];
            if (!re) {
                // escape special chars (".", "[", etc.)
                className = className.replace(/([\.\(\)\^\$\*\+\?\|\[\]\{\}\\])/g, '\\$1');
                re = reCache[className] = new RegExp('(?:^|\\s)' + className + '(?= |$)', 'g');
            }
        }
    }
    return re;
}, _regexCache = {}, getRegExp = function(str, flags) {
    flags = flags || '';
    _regexCache = _regexCache || {};
    if (!_regexCache[str + flags]) {
        _regexCache[str + flags] = new RegExp(str, flags);
    }
    return _regexCache[str + flags];
};
var propertyCache = {}, toCamel = function(property) {
    var c = propertyCache;    
    return c[property] || (c[property] = property.indexOf('-') === -1 ? 
                            property :
                            property.replace( /-([a-z])/gi, function(x,l){
                                return l.toUpperCase();
                            } ));
}, STYLE_PROPERTIES = {
	'x':'left',
	'y':'top',
	'visible':'visibility',
	'marginX':'marginLeft',
	'marginY':'marginTop',
	'paddingX':'paddingLeft',
	'paddingY':'paddingTop'
}, PX_PROPERTIES = {
	'left':true,
	'top':true,
	'marginLeft':true,
	'marginTop':true,
	'paddingLeft':true,
	'paddingTop':true,
	'width':true,
	'height':true
};
var setSize = function(node, prop, val) {
    val = (val > 0) ? val : 0;
    var size = 0;

    node.style[prop] = val + 'px';
    size = (prop === 'height') ? node.offsetHeight : node.offsetWidth;

    if (size > val) {
        val = val - (size - val);

        if (val < 0) {
            val = 0;
        }

        node.style[prop] = val + 'px';
    }
};
var isSupportTextNode = false, isContainsNode = function(el, needle) {
    while (needle) {
        if (el === needle) {
            return true;
        }
        needle = needle.parentNode;
    }
    return false;
};
	
JS.define('JS.ui.Display', {
	singleton:true,
	requires:['JS.util.System'],
		
	constructor: function(){
		KEY_ATTRIBUTES = { // ie8:w3c
		    'htmlFor': !documentElement.hasAttribute?'htmlFor':'for',
		    'className': !documentElement.hasAttribute?'className':'class'
		};
		var SYS = this.ns('JS.util.System'), browser = SYS.browser;
		if (browser.name=='IE'){ 
			// IE 8 errors on input.setAttribute('type')
		    if(browser.versionNumber >= 8 && document.documentElement.hasAttribute) { 
		    	DOT_ATTRIBUTES.type = true; 
		    };
		    // IE < 8 throws on node.contains(textNode)
		    var node = document.createElement('div'),
	        textNode = node.appendChild(document.createTextNode('')),
	        result = false;	    
		    try {
		        result = node.contains(textNode);
		    } catch(e) {}	
		    isSupportTextNode = result?true:false;
		}
	},
	/**
     * Find the element by the given id.
     * @method byId
     * @param {String | HTMLElement} id The html element.
     * @param {HTMLElement} doc The contained document.
     * @return {HTMLElement} The matching element or null if none found.
     */
	byId: function(id, doc){
		var d = doc||document;
		return JS.isString(id)?d.getElementById(id):id;
	},
	/**
     * Find all elements by the given name.
     * @method byName
     * @param {String | HTMLElement} name The html element.
     * @param {HTMLElement} doc The contained document.
     * @return {HTMLElement[]} The matching element or null if none found.
     */
	byName: function(name, doc){
		var d = doc||document;
		return JS.isString(name)?d.getElementsByName(name):name;
	},
	byQuery: function(query, doc){
		var d = doc||document;
		//todo
	},
	/**
     * Find the element by the given keyword for the first matching element.
     * @method findBy
     * @param {HTMLElement} node The html element.
     * @param {String} key The keyword to search (parentNode, nextSibling, previousSibling).
     * @param {Function} testFn:optional An optional boolean test to apply.
     * @param {Boolean} all:optional Whether all node types should be returned, or just element nodes.
     * @param {Function} stopAt:optional The optional function is passed the current HTMLElement being tested as its only argument.
     * If no function is given, the first element is returned.
     * @return {HTMLElement} The matching element or null if none found.
     */
    findBy: function(node, key, testFn, all, stopAt) {
        while (node && (node = node[key])) { 
            if ( (all || node[TAG_NAME]) && (!testFn || testFn(node)) ) return node;
            if (stopAt && stopAt(node)) return null;
        }
        return null;
    },
    /**
     * Determines whether or not one HTMLElement is or contains another HTMLElement.
     * @method contains
     * @param {HTMLElement} node The containing html element.
     * @param {HTMLElement} needle The html element that may be contained.
     * @return {Boolean} Whether or not the element is or contains the needle.
     */
    contains: function(node, needle) {
    	if ( !needle || !node || !needle['nodeType'] || !node['nodeType']) return false;

        if (node['contains'] &&
            // IE < 8 throws on node.contains(textNode) so fall back to brute.
            // Falling back for other nodeTypes as well.
            (needle['nodeType'] === 1 || isSupportTextNode)) {
            return node['contains'](needle);
        } else if (node['compareDocumentPosition']) {
            // Match contains behavior (node.contains(node) === true).
            // Needed for Firefox < 4.
            if (node === needle || !!(node['compareDocumentPosition'](needle) & 16)) { 
                return true;
            }
        } else {
            return isContainsNode(node, needle);
        }

        return false;
    },
    /**
     * Determines whether or not the HTMLElement is part of the document.
     * @method inDoc
     * @param {HTMLElement} node The containing html element.
     * @param {HTMLElement} doc optional The document to check.
     * @return {Boolean} Whether or not the element is attached to the document. 
     */
    inDoc: function(node, doc) {
        var d = doc||node['ownerDocument'];
        if (node && node.nodeType) {
            var rootNode = d['documentElement'];
            if (rootNode && rootNode.contains && node.tagName) {
                return rootNode.contains(node);
            } else {
                return this.contains(rootNode, node);
            }
        }
        return false;
    },
    getValue: function(el) {
        if(!el) return null;
        
        var node = this.byId(el), 
        	tagName = node['tagName'].toLowerCase(),
        	isById = el===node.id;

        if (tagName == 'select') {
        	var v = null;
        	if(node.type=='select-one'){
        		if (node.selectedIndex!=-1) v = node.options[node.selectedIndex].value;
        	}else{
        		v = [];
				for (var i=0;i<node.length ;i++){
					if(node[i].selected) v[v.length] = node[i].value;
				}
        	}
        	return v;
        }else if (node) {//todo
        	
        }
        return node.value;
    },
    
	getAttr: function(el, attr) {
		var node = this.byId(el);
		if(!node || !attr) return null;
		
		return node.getAttribute(KEY_ATTRIBUTES[attr] || attr, 2);// 2 is used for IE
    },
    setAttr: function(el, attr, val) {
    	if(!el || !attr) return;
		var nodes = toEls(el);
		
		if (DOT_ATTRIBUTES[attr]) {
			nodes.forEach(function(node){
				node[attr] = val;
			});
		}else{
			nodes.forEach(function(node){
				node.setAttribute(KEY_ATTRIBUTES[attr] || attr, val);
			});
		}
    },
    /**
     * Determines whether a DOM element has the given className.
     * @method hasCSS
     * @param {HTMLElement} element The DOM element. 
     * @param {String} className the class name to search for
     * @return {Boolean} Whether or not the element has the given class. 
     */
    hasCSS: function(node, className) {
        var re = getRegExp('(?:^|\\s+)' + className + '(?:\\s+|$)');
        return re.test(node.className);
    },
    /**
     * Adds a class name to a given DOM element.
     * @method addCSS
     * @param {HTMLElement} element The DOM element. 
     * @param {String} className the class name to add to the class attribute
     */
    addCSS: function(node, className) {
        if (!this.hasCSS(node, className)) { // skip if already present 
            node.className = ([node.className, className].join(' ')).trim();
        }
    },
    /**
     * Removes a class name from a given element.
     * @method removeCSS         
     * @param {HTMLElement} element The DOM element. 
     * @param {String} className the class name to remove from the class attribute
     */
    removeCSS: function(node, className) {
        if (className && this.hasCSS(node, className)) {
            node.className = (node.className.replace(getRegExp('(?:^|\\s+)' +
                            className + '(?:\\s+|$)'), ' ')).trim();

            if ( this.hasCSS(node, className) ) { //multiple remove
                this.removeCSS(node, className);
            }
        }                 
    },
    /**
     * Replace a class with another class for a given element or collection of elements.
     * If no oldClassName is present, the newClassName is simply added.
     * @method replaceCSS  
     * @param {String | HTMLElement | Array} node The element or collection to remove the class from
     * @param {String} oldClassName the class name to be replaced
     * @param {String} newClassName the class name that will be replacing the old class name
     * @return {Boolean} 
     */
    replaceCSS: function(node, oldClassName, newClassName) {
    	if(!node || !newClassName) return false;
    	
    	var className,
        ret = false,
        current;

        if (!oldClassName) { // just add
            ret = this.addCSS(node, newClassName);
        } else if (oldClassName !== newClassName) { 
            current = this.getAttr(node, 'className') || '';
            className = (' ' + current.replace(getCSSRegex(oldClassName), ' ' + newClassName)).split(getCSSRegex(newClassName));
            className.splice(1, 0, ' ' + newClassName);
            this.setAttr(node, 'className', className.join('').trim());
            ret = true;
        }
        
        return ret;
    },
    /**
     * If the className exists on the node it is removed, if it doesn't exist it is added.
     * @method toggleCSS
     * @param {HTMLElement} element The DOM element
     * @param {String} className the class name to be toggled
     * @param {Boolean} addClass optional boolean to indicate whether class
     * should be added or removed regardless of current state
     */
    toggleCSS: function(node, className, force) {
        var add = (force !== undefined) ? force : !(hasCSS(node, className));

        if (add) {
            addCSS(node, className);
        } else {
            removeCSS(node, className);
        }
    },
    /**
     * Wrapper for setting style properties of HTMLElements.  
     * @method setStyle
     * @param {String | HTMLElement | Array} el Accepts a string to use as an ID, an actual DOM reference, or an Array of IDs and/or HTMLElements.
     * @param {String} property The style property to be set.
     * @param {String} val The value to apply to the given property.
     */
    setStyle: function(el, property, val) {
    	if(!el || !property) return;
    	
        var els = toEls(el),p = toCamel(property), p = STYLE_PROPERTIES[p]||p,
        	Sys = this.ns('JS.util.System'),
        	isIE = Sys.browser.name=='IE';
        
        if(PX_PROPERTIES[p]){
        	if (JS.isNumber(val)) val+= 'px';
        }else if(p=='visibility'){
        	k = 'visibility';
        	if (JS.isBoolean(val)) val = val?'visible':'hidden';
        }
        
        els.forEach(function(node){
        	if(isIE){
        		switch (p) {
	                case 'opacity':
	                    if (JS.isString(node.style.filter)) { // in case not appended
	                        node.style.filter = 'alpha(opacity=' + val * 100 + ')';
	                        
	                        if (!node['currentStyle'] || !node['currentStyle'].hasLayout) {
	                            node.style.zoom = 1; // when no layout or cant tell
	                        }
	                    }else{
	                    	node.style[p] = val;
	                    }
	                    break;
	                case 'float':
	                    p = 'styleFloat';
	                default:
	                node.style[p] = val;
	            }
        	}else{
        		if (p == 'float') p = 'cssFloat';
                node.style[p] = val;
        	}        	
        },this);
    },
    /**
     * Sets the width of the element to the given size, regardless
     * of box model, border, padding, etc.
     * @method setWidth
     * @param {HTMLElement} element The DOM element. 
     * @param {String|Int} size The pixel height to size to
     */
    setWidth: function(node, size) {
        setSize(node, 'width', size);
    },

    /**
     * Sets the height of the element to the given size, regardless
     * of box model, border, padding, etc.
     * @method setHeight
     * @param {HTMLElement} element The DOM element. 
     * @param {String|Int} size The pixel height to size to
     */
    setHeight: function(node, size) {
        setSize(node, 'height', size);
    },
    
    
	info: function(key, nWin){
		var Sys = this.ns('JS.util.System'),
    	    br = Sys.browser,
    	    win = nWin?nWin:window,
    	    doc = win.document,
    	    body = doc.body,
    		docEl = doc.documentElement;    		

		if(key=='innerHeight'||key=='height') {
			var innerHeight = win?win.innerHeight:self.innerHeight // Safari, Opera
				, mode = doc['compatMode'];

		    if ((mode || br.name=='IE') && br.name!='Opera') { // IE, Gecko
		    	innerHeight = (mode == 'CSS1Compat') ?
		                docEl.clientHeight : // Standards
		                body.clientHeight; // Quirks
		    }
		    if(key=='innerHeight') return innerHeight;	

		    var scrollHeight = (mode != 'CSS1Compat' || br.engine=='webkit') ? body.scrollHeight : docEl.scrollHeight
	    		, height = Math.max(scrollHeight, innerHeight);
	    	return height;			
		};
		if(key=='innerWidth'||key=='width') {
			var innerWidth = win?win.innerWidth:self.innerWidth // Safari
				, mode = doc['compatMode'];

		    if (mode || br.name=='IE') { // IE, Gecko, Opera
		    	innerWidth = (mode == 'CSS1Compat') ?
		                docEl.clientWidth : // Standards
		                body.clientWidth; // Quirks
		    }
		    if(key=='innerWidth') return innerWidth;	

		    var scrollWidth = (mode != 'CSS1Compat' || br.engine=='webkit') ? body.scrollWidth : docEl.scrollWidth
	    		, width = Math.max(scrollWidth, innerWidth);
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
		case 'screenX':			
			return br.name=='IE'||br.name=='Opera'?win.screenLeft:win.screenX;
		case 'scrollX':			
			var dv = doc.defaultView, pageOffset = (dv) ? dv.pageXOffset : 0;
	        return Math.max(docEl.scrollLeft, body.scrollLeft, pageOffset);	
		case 'scrollY':			
			var dv = doc.defaultView, pageOffset = (dv) ? dv.pageYOffset : 0;
	        return Math.max(docEl.scrollTop, body.scrollTop, pageOffset);	    
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