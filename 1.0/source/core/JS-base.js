/*!
 * @project JSDK <a target="_blank" href="http://jsdk2.sourceforge.net/website/index.html">JSDK</a>'s 
 * is a JavaScript Framework, like JDK. Now it has a alias name is JTDK.
 * JSDK have a small core and many extension libraries, support such features: 
 * ClassSystem, Reflect, AOP, Thread, JSUI, AWA, JSGF and Utils. 
 * 
 * @copyright Copyright(c) 2004-2012, Dragonfly.org. All rights reserved.
 * @license LGPLv3
 * @github https://github.com/fch415/jtdk
 * @website http://jsdk2.sourceforge.net/website/index.html
 * 
 * @version 1.0.0
 * @author feng.chun
 * @date 2012-11-21
 * @date 2012-12-20
 * @date 2013-01-04
 * 
 * @version 0.6.2
 * @author feng.chun
 * @date 2012-04-28
 * @date 2012-05-02
 * 
 * @version 0.6.1
 * @author feng.chun
 * @date 2012-04-18
 * 
 * @version 0.6
 * @author feng.chun
 * @date 2011-09-28
 * @date 2011-10-11
 * @date 2012-02-27
 * @date 2012-03-08
 * @date 2012-04-15
 *  
 * @version 0.5
 * @author feng.chun
 * @date 2011-09-19
 * @date 2011-09-26
 * @date 2011-09-27
 * 
 * @version 0.4
 * @author feng.chun
 * @date 2011-09-04
 * 
 * @version 0.3
 * @author feng.chun
 * @date 2011-01-05
 * @date 2011-03-22
 * @date 2011-04-26
 * @date 2011-05-18
 * 
 * @version 0.2
 * @author feng.chun
 * @date 2010-11-15
 * 
 * @version 0.1
 * @author feng.chun
 * @date 2007-7-20
 * @date 2010-8-15
 */
(function() {
var OP = Object.prototype,
	toString = OP.toString,
	logTypes = {'undefined':1,'null':1,'string':1,'number':1,'boolean':1,'date':1,'array':1};

JS = {
	version: '1.0.0',
	/**
	 * Print the object on Console.
	 * 
	 * @method log
	 * @param {Object} obj
	 */
	log: function(obj){
		var s = (JS.typeOf(obj)) in logTypes?JS.stringify(obj):obj;
		if(window.console) {
			console.log(s);
		}else if(window.opera) {
			opera.postError(s);
		}else {
			window.statusbar = s;
		}
	},
	/**
     * Returns true if the passed value is empty, false otherwise. The value is deemed to be empty if it is either:
     *
     * - `null`
     * - `undefined`
     * - a zero-length array
     * - a zero-length string (Unless the `allowEmptyString` parameter is set to `true`)
     *
     * @method isEmpty
     * @param {Object} value The value to test
     * @param {Boolean} allowEmptyString (optional) true to allow empty strings (defaults to false)
     * @return {Boolean}
     */
    isEmpty: function(value, allowEmptyString) {
        return (value === null) || (value === undefined) || (!allowEmptyString ? value === '' : false) || (this.isArray(value) && value.length === 0);
    },
    /**
     * Returns true if the passed value is a JavaScript Array, false otherwise.
     *
     * @method isArray
     * @param {Object} target The target to test
     * @return {Boolean}
     */
    isArray: ('isArray' in Array) ? Array.isArray : function(value) {
    	return toString.call(value) === '[object Array]';
    },
    /**
     * Returns true if the passed value is a JavaScript Date object, false otherwise.
     * 
     * @method isDate
     * @param {Object} object The object to test
     * @return {Boolean}
     */
    isDate: function(value) {
        return toString.call(value) === '[object Date]';
    },
    /**
     * Returns true if the passed value is a JavaScript Object, false otherwise.
     * 
     * @method isObject
     * @param {Object} value The value to test
     * @return {Boolean}
     */
    isObject: function(value) {
        return value instanceof Object && value.constructor === Object;
    },
    /**
     * Returns true if the passed value is a JavaScript 'primitive', a string, number or boolean.
     * 
     * @method isPrimitive
     * @param {Object} value The value to test
     * @return {Boolean}
     */
    isPrimitive: function(value) {
        var type = typeof value;
        return type === 'string' || type === 'number' || type === 'boolean';
    },
    /**
     * Returns true if the passed value is a JavaScript Function, false otherwise.
     * 
     * @method isFunction
     * @param {Object} value The value to test
     * @return {Boolean}
     */
    isFunction:
    (typeof document !== 'undefined' && typeof document.getElementsByTagName('body') === 'function') ? function(value) {
        return toString.call(value) === '[object Function]';
    } : function(value) {
        return typeof value === 'function';
    },
    /**
     * Returns true if the passed value is a number. Returns false for non-finite numbers.
     * 
     * @method isNumber
     * @param {Object} value The value to test
     * @return {Boolean}
     */
    isNumber: function(value) {
        return typeof value === 'number' && isFinite(value);
    },
    /**
     * Validates that a value is numeric.
     * 
     * @method isNumeric
     * @param {Object} value Examples: 1, '1', '2.34'
     * @return {Boolean} True if numeric, false otherwise
     */
    isNumeric: function(value) {
        return !isNaN(parseFloat(value)) && isFinite(value);
    },
    /**
     * Returns true if the passed value is a string.
     * 
     * @method isString
     * @param {Object} value The value to test
     * @return {Boolean}
     */
    isString: function(value) {
        return typeof value === 'string';
    },
    /**
     * Returns true if the passed value is a boolean.
     *
     * @method isBoolean
     * @param {Object} value The value to test
     * @return {Boolean}
     */
    isBoolean: function(value) {
        return typeof value === 'boolean';
    },
    /**
     * Returns true if the passed value is an HTMLElement
     * 
     * @method isElement
     * @param {Object} value The value to test
     * @return {Boolean}
     */
    isElement: function(value) {
        return value ? value.nodeType === 1 : false;
    },
    /**
     * Returns true if the passed value is a TextNode
     * 
     * @method isTextNode
     * @param {Object} value The value to test
     * @return {Boolean}
     */
    isTextNode: function(value) {
        return value ? value.nodeName === "#text" : false;
    },
    /**
     * Returns true if the passed value is defined.
     * 
     * @method isDefined
     * @param {Object} value The value to test
     * @return {Boolean}
     */
    isDefined: function(value) {
        return typeof value !== 'undefined';
    },
    /**
     * Returns true if the passed value is iterable, false otherwise
     * 
     * @method isIterable
     * @param {Object} value The value to test
     * @return {Boolean}
     */
    isIterable: function(value) {
        return (value && typeof value !== 'string') ? value.length !== undefined : false;
    },
    /**
     * Returns true if the property key is exist in the object, false otherwise
     * 
     * @method hasOwnProperty
     * @param {Object} o The object to test
     * @param {String} prop The property key
     * @return {Boolean}
     */
    hasOwnProperty: (OP.hasOwnProperty) ?
    function(o, prop) {
        return o && o.hasOwnProperty(prop);
    } : function(o, prop) {
        return JS.isDefined(o[prop]) && 
                o.constructor.prototype[prop] !== o[prop];
    },
    ns: function(name, loader){
    	var l = loader||JS.ClassLoader;
		return l.ns(name);
	},
    /**
     * @method setPath
     * @param {Object} kvs
     * @param {JS.Loader} loader:optional
     */
    setPath: function(kvs, loader){
    	var l = loader||JS.ClassLoader;
    	l.setPath(kvs);
	},
    /**
	 * @method define
	 * @param {String} className
	 * @param {Object} data
	 */
    define: function(className, data){    	
    	JS.ClassLoader.defineClass(className, data);
	},
	/**
	 * @method create
	 * @param {String} className
	 * @param {Object..} arguments[1..n]
	 * @return {Object}
	 */
	create: function(){
		return JS.Loader.prototype.create.apply(JS.ClassLoader, arguments);
	},
	/**
	 * @method factory
	 * @param {Array} args
	 * @param {String} className
	 * @param {Object} instance:optional
	 * @param {JS.Loader} loader:optional
	 * @return {Object}
	 */
	factory: function(args, className, instance, loader){
		var l = loader||JS.ClassLoader, clazz = l.findClass(className);
		if(!clazz) throw new Error('Create the class:<'+className+'> failed.');
		
		var ctor = clazz.$class.getCtor(), obj = null;
		if(instance) {
			obj = instance;
		}else{
			var f = function(){};
			f.prototype = ctor.prototype;
			obj = new f();						
		}		
		ctor.apply(obj, args);
		return obj;
	}
}

var _requireCallbacks = {};
var _callback4Requires= function(name){
	for(k in _requireCallbacks) {
		if((k+',').indexOf(name+',')>=0){
			var me = this, names = _requireCallbacks[k]['names'];
			if(me.hasClass(names)) {
				var	fns = _requireCallbacks[k]['fns'];
				fns.forEach(function(fn){
					fn.call(me);
				});
				delete _requireCallbacks[k];				
				return;
			}
		}
	}
}
/**
 * @method requires
 * @param {String|String[]} classNames
 * @param {Function} onFinished
 * @param {ClassLoader} loader:optional
 */
JS.require = function(classNames, onFinished, loader){
	var names = Array.toArray(classNames);
	if(JS.isEmpty(names)) return;
	
	var l = loader||JS.ClassLoader;
	if(l.hasClass(names)){
		if(JS.isFunction(onFinished)) onFinished.call(l);
	}else{
		var key = names.join(',');		
		if(JS.isFunction(onFinished)){
			if(_requireCallbacks[key]) {
				_requireCallbacks[key]['fns'].push(onFinished);
			}else{
				_requireCallbacks[key] = {
					names: names, fns: [onFinished]
				}
			}
		}
		
		l.onEvent('classBuilded', _callback4Requires);
		l.loadClass(names);			
	}			
}

var TYPES = {
   'undefined'        : 'undefined',
   'number'           : 'number',
   'boolean'          : 'boolean',
   'string'           : 'string',
   '[object Function]': 'function',
   '[object RegExp]'  : 'regexp',
   '[object Array]'   : 'array',
   '[object Date]'    : 'date',
   '[object Error]'   : 'error'
}
/**
* Returns the type of the given variable in string format. List of possible values are:
* - undefined
* - null
* - string
* - number
* - boolean
* - date
* - function
* - object
* - array
* - regexp
* - error 
* - element
* - textnode
* - whitespace
* 
* @method typeOf
* @param {Object} o
* @return {String}
*/
JS.typeOf = function(o) {
	if (o === null) return 'null';
	    
    var type = typeof o;
   
    if (type === 'object') {
        if (o.nodeType !== undefined) {
           if (o.nodeType === 3) {
               return (/\S/).test(o.nodeValue) ? 'textnode' : 'whitespace';
           } else {
               return 'element';
           }
        }
        return 'object';
   }
   
   return TYPES[type] || TYPES[toString.call(o)];
}

var _hasEnumBug = !{valueOf: 0}.propertyIsEnumerable('valueOf');
var _enumerables = ['hasOwnProperty', 'valueOf', 'isPrototypeOf', 'propertyIsEnumerable', 'toLocaleString', 'toString'];
/**
 * Copies all the properties of supplier to receiver.
 * 
 * @method mix
 * @param {Object} receiver The object to receive the mixed properties.
 * @param {Object} supplier The object supplying the properties to be mixed.
 * @param {Boolean} unoverwrite If `true`, properties that is not exist 
 * on the receiver will be overwritten with properties from the supplier.
 * @return {Object} returns obj
 */
JS.mix = function(receiver, supplier, unoverwrite) {
    if (supplier) {
        for (var property in supplier) {
            if (!unoverwrite) {
            	receiver[property] = supplier[property];
            }else if(receiver[property] === undefined){
            	receiver[property] = supplier[property];
            }
        }
        
        //IE doesn't enumerate in for..in loops, it's necessary to manually enumerate these properties.
        if(_hasEnumBug) {
        	for (var j = _enumerables.length; j--;) {
                var k = _enumerables[j];
                if (supplier.hasOwnProperty(k)) {
                	receiver[k] = supplier[k];
                }
            }
        }        
    }

    return receiver;
}

var hasNativeJSON = function(){
	return window.JSON && JSON.toString() == '[object JSON]';
}	
	
var	encode = function(o){
	if (!JS.isDefined(o) || o === null) {
        return "null";
    } else if (JS.isArray(o)) {
        return encodeArray(o);
    } else if (JS.isDate(o)) {
        return encodeDate(o);
    } else if (JS.isString(o)) {
        return encodeString(o);
    } else if (typeof o == "number") {
        return isFinite(o) ? String(o) : "null";
    } else if (JS.isBoolean(o)) {
        return String(o);
    } else if (JS.isObject(o)) {
        return encodeObject(o);
    } else if (typeof o === "function") {
        return "null";
    }
    return 'undefined';
}	
	
var encodeString = function(s){
	if (/["\\\x00-\x1f]/.test(s)) {
        return '"' + s.replace(/([\x00-\x1f\\"])/g, function(a, b) {
            var c = {
		        "\b": '\\b',
		        "\t": '\\t',
		        "\n": '\\n',
		        "\f": '\\f',
		        "\r": '\\r',
		        '"' : '\\"',
		        "\\": '\\\\'
		    }[b];
            if(c){
                return c;
            }
            c = b.charCodeAt();
            return "\\u00" +
                Math.floor(c / 16).toString(16) +
                (c % 16).toString(16);
        }) + '"';
    }
    return '"' + s + '"';
}

var encodeArray = function(o){
	var a = ["[", ""],
    len = o.length,
    i;
    for (i = 0; i < len; i += 1) {
        a.push(encode(o[i]), ',');
    }
    a[a.length - 1] = ']';
    return a.join("");
}

var fix2 = function(n) {
    return n < 10 ? '0' + n : n;
},  fix3 = function(n) {
	if(n > 99) return n;
	return n < 10 ? '00' + n : '0' + n;
},
encodeDate = function(o) {
    return '"' + o.getFullYear() + '-' 
    + fix2(o.getMonth() + 1) + '-'
    + fix2(o.getDate()) + 'T'
    + fix2(o.getHours()) + ':'
    + fix2(o.getMinutes()) + ':'
    + fix2(o.getSeconds()) + '.'
    + fix3(o.getMilliseconds())  + 'Z"';
};

var useHasOwn = !! {}.hasOwnProperty, encodeObject = function(o) {
    var a = ["{", ""], i;
    for (i in o) {
        if (!useHasOwn || o.hasOwnProperty(i)) {
            a.push(encode(i), ":", encode(o[i]), ',');
        }
    }
    a[a.length - 1] = '}';
    return a.join("");
};
/**
 * @method parseJSON
 * @param {String} json 
 * @param {Boolean} silence:optional True means return null when has exception. The default value is false.
 * @return {Object} a new JSON Object
 */
JS.parseJSON = hasNativeJSON()? JSON.parse : function(json, silence){
	try {
		return eval('(' + json + ')');
	}catch(e){
		if(silence) {
			return null;
		}
		throw new Error('JSON decode failed.'+e);
	}		
},
/**
 * @method stringify
 * @param {Object} json 
 * @return {String} a new JSON String
 */
JS.stringify = hasNativeJSON()? JSON.stringify : encode

JS.merge = function(){
	
}


/**********************************************
 * The Native Object Extension
 * 
 * Note:
 * 1: Don't expand "Object"
 * 
 * 2: Traversal a Array using "for in...", should write like this:
 * 	    for (k in arr){	
 * 			if (arr.hasOwnProperty(k)) {...}
 * 		}
 *    Or use the "forEach" function.
 *  
 *********************************************/

/**
 * @native String 
 */
var __WHITESPACE = ' \n\r\t\f\x0b\xa0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000';
/**
 * Trim the String's left and right empty chars.
 * 
 * @method trim
 * @see http://blog.stevenlevithan.com/archives/faster-trim-javascript
 * @return {String}
 */
String.prototype.trim = String.prototype.trim || function() {		
    var str = this.trimLeft();
	str = this.trimRight();
    return __WHITESPACE.indexOf(str.charAt(0)) === -1 ? str : '';
}
/**
 * Trim the String's left empty chars.
 * 
 * @method trimLeft
 * @return {String}
 */
String.prototype.trimLeft = String.prototype.trimLeft || function() {		
	var str = this;
	for (var i = 0,len = str.length; i < len; i++) {
      if (__WHITESPACE.indexOf(str.charAt(i)) === -1) {
        str = str.substring(i);
        break;
      }
    }
    return str;
}
/**
 * Trim the String's right empty chars.
 * 
 * @method trimRight
 * @return {String}
 */
String.prototype.trimRight = String.prototype.trimRight || function() {		
	var str = this;
	for (i = str.length - 1; i >= 0; i--) {
      if (__WHITESPACE.indexOf(str.charAt(i)) === -1) {
        str = str.substring(0, i + 1);
        break;
      }
    }
    return str;
}
/**
 * Returns the text between start word and end word.
 * 
 * @method between
 * @param {String} startWord:optional
 * @param {String} endWord:optional
 * @return {String}
 */	
String.prototype.between = function(startWord, endWord) {		
	var pos1 = 0, pos2 = this.length;
	
	if(startWord){
		var p1 = this.indexOf(startWord);
		if (p1 >= 0) {			
			pos1 = p1 + startWord.length;
		}
	}
	
	if(endWord){
		var p2 = this.indexOf(endWord);
		if (p2 >= 0) {			
			pos2 = p2;
		}
	}
	
    return this.substring(pos1,pos2);
}	
/**
 * Ends with the string.
 * 
 * @method endsWith
 * @param {String} str
 * @return {Boolean}
 */
String.prototype.endsWith = function(str){	
	if(this.length==0 || !str || typeof str !='string') return false;
	if(str.length > this.length) return false;
	
  	return (this.substring(this.length-str.length)==str)?true:false;
}
/**
 * Starts with the string.
 * 
 * @method startsWith
 * @param {String} str
 * @return {Boolean}
 */
String.prototype.startsWith = function(str){	
	if(this.length==0 || !str || typeof str !='string') return false;
	if(str.length > this.length) return false;
	
  	return this.substr(0,str.length)==str?true:false;  
}
/**
 * Returns the byte length in UTF-8 encoding. If the byteSize is null then the default byteSize is 3. 
 * 
 * UTF-8  
 * The 8-bit encoding of Unicode. It is a variable-width encoding. 
 * One Unicode character can be 1 byte, 2 bytes, 3 bytes, or 4 bytes in UTF-8 encoding. 
 * Characters from the European scripts are represented in either 1 or 2 bytes. 
 * Characters from most Asian scripts are represented in 3 bytes. 
 * Supplementary characters are represented in 4 bytes.
 * 
 * @method byteLength
 * @param {Int} byteSize:optional
 * @return {Int}
 */
String.prototype.byteLength = function(byteSize){
	if(this.length==0) return 0; 
	if(!byteSize || byteSize<=0 || byteSize>4) byteSize = 3;
	return this.replace(/[^\x00-\xff]/g, ''+Math.pow(10,byteSize-1)).length;
};
/**
 * Transfer the string to a number. The default number is Zero when failed. 
 * 
 * @method toNumber
 * @param {Number} defaultNum:optional
 * @return {Number}
 */
String.prototype.toNumber = function(defaultNum){	
	return isNaN(this)?(defaultNum?Number(defaultNum):0):Number(this);
};

/**
 * @native Array 
 */
/**
 * Convert to a Array.
 * 
 * @static
 * @method toArray
 * @param {Object} a
 * @return {Array}
 */
Array.toArray = function(a){
	return JS.isArray(a)?a:[a];
}

/**
 * Returns the index of a item in the array by asc order. 
 * 
 * @method indexOf
 * @param {Object} elt
 * @param {Int} from:optional The default is Zero
 * @param {Function} fn:optional The compare function
 * @param {Object} thisp:optional The function's this
 * @return {Int} returns -1 when not found
 */
Array.prototype.indexOf = function(elt, from, fn, thisp) {   
    var len = this.length >>> 0, thisP = thisp||this, fun = (fn && typeof fn == "function")?fn:null;   
  
    from = isNaN(from)? 0:Math.round(from); 
    if (from < 0) {
		from += len;
	}else if(from > len){
		from = len;
	}   
  
    for (; from < len; from++){
		if(fun){
			if(fun.call(thisP, elt, this[from], this, from)) return from;
		}else{
			if(this[from] === elt) return from;
		}
    }   
    return -1;     
};  
/**
 * Returns the index of a item in the array by desc order. 
 * 
 * @method lastIndexOf
 * @param {Object} elt
 * @param {Int} from:optional The default is length-1
 * @param {Function} fn:optional The equals function
 * @param {Object} thisp:optional The function's this
 * @return {Int} returns -1 when not found
 */
Array.prototype.lastIndexOf = function(elt, from, fn, thisp){
    var len = this.length, thisP = thisp||this, fun = (fn && typeof fn == "function")?fn:null;

    from = isNaN(from)? len-1:Math.round(from);
	if (from < 0) {
		from = Math.abs(from);
	}else if(from > len){
		from = len;
	}
    
    for (; from > -1; from--){
      	if(fun){
			if(fun.call(thisP, elt, this[from], this, from)) return from;
		}else{
			if(this[from] === elt) return from;
		}
    }
    return -1;
};
/**
 * Execute the callback function for every item.
 * 
 * @method forEach
 * @param {Function} fn
 * @param {Object}   thisp:optional the function's this
 * @throws {TypeError} The argument<fn> is not function
 */
Array.prototype.forEach = Array.prototype.forEach || function(fn, thisp){
	if (typeof fn !== "function") throw new TypeError(fn + "is not a function.");
	  
	var len = this.length >>> 0, thisP = thisp||this;
    
    for (var i = 0; i < len; i++){
    	fn.call(thisP, this[i], i, this);
    }	
};
/**
 * Returns a new array.
 * 
 * @method map
 * @param {Function} fn returns a array like [key,value]
 * @param {Object} thisp:optional the function's this
 * @return {Array}
 * @throws {TypeError} The argument<fn> is not function
 */
Array.prototype.map = Array.prototype.map || function(fn, thisp){
	if (typeof fn !== "function") throw new TypeError(fn + "is not a function.");
	
	var len = this.length >>> 0, 
		thisP = thisp||this, 
		obj = Object(this),
		newArray = new Array(len),
		k = 0;

	while(k < len) {
	  var kValue, mappedValue;
	  if (k in obj) {
	    kValue = obj[k];
	    mappedValue = callback.call(thisP, kValue, k, obj);
	    newArray[k] = mappedValue;
	  }
	  k++;
	}
	
	return newArray;
}

/**
 * If all items passed the function's test, then return true.
 * 
 * @method every
 * @param {Function} fn
 * @param {Object} thisp:optional the function's this
 * @return {Boolean}
 * @throws {TypeError} The argument<fn> is not function
 */
Array.prototype.every = Array.prototype.every || function(fn, thisp){   
	if (typeof fn !== "function") throw new TypeError(fn + "is not a function.");
	
	var len = this.length >>> 0, thisP = thisp||this;   
    for (var i = 0; i < len; i++) {   
        if (!fn.call(thisP, this[i], i, this)) return false;   
    }        
  
    return true;   
};   

/**
 * If one item passed the function's test, then return true.
 * 
 * @method some
 * @param {Function} fn
 * @param {Object} thisp:optional the function's this
 * @return {Boolean}
 * @throws {TypeError} The argument<fn> is not function
 */
Array.prototype.some = Array.prototype.some || function(fn, thisp){
	if (typeof fn !== "function") throw new TypeError(fn + "is not a function.");
	
	var len = this.length >>> 0, thisP = thisp||this;
    for (var i = 0; i < len; i++){
      if (fn.call(thisP, this[i], i, this))
        return true;
    }   

    return false;
};

/**
 * Filter all items to a new Array by the function's test.
 * 
 * @method filter
 * @param {Function} fn
 * @param {Object} thisp:optional the function's this
 * @return {Array}
 * @throws {TypeError} The argument<fn> is not function
 */
Array.prototype.filter = Array.prototype.filter || function(fn, thisp){   
	if (typeof fn !== "function") throw new TypeError(fn + "is not a function.");
	   
	var len = this.length >>> 0, thisP = thisp||this, res = [];  
	for (var i = 0; i < len; i++){   
      var val = this[i];   
      if (fn.call(thisP, val, i, this)) res.push(val);  
    }       
  
    return res;   
};   
/**
 * Clear all items to empty.
 * 
 * @method clear
 */
Array.prototype.clear = function() {   
    this.length = 0;
}
/**
 * Clone to a new Array.
 * 
 * @method clone
 * @return {Array}
 */  
Array.prototype.clone = function() {   
    return this.slice(0);;   
}
/**
 * Determines whether or not the item be contains in the array.
 * 
 * @method contains
 * @param {Object} item
 * @param {Int} from:optional the from index
 * @param {Function} fn:optional the compare function
 * @param {Object} thisp:optional the function's this
 * @return {Boolean}
 */
Array.prototype.contains = function(item, from, fn, thisp) {  
	return this.indexOf(item, from, fn, thisp)==-1?false:true;
}
/**
 * Insert some items after the position.
 * 
 * @method splice
 * @param {Object} index
 * @param {Object...} items
 */
Array.prototype.insertAt = function(index){
    Array.prototype.splice.apply(this, [index,0].concat([].slice.call(arguments,1)));
}
/**
 * If contains the item in the array, then removes it.
 * 
 * @method remove
 * @param {Object} item
 * @param {Int} from:optional the from index
 * @param {Function} fn:optional the compare function
 * @param {Object} thisp:optional the function's this
 * @return {Boolean}
 */
Array.prototype.remove = function(item, from, fn, thisp) {
	var index = this.indexOf(item, from, fn, thisp);
	if (index >= 0) {
		this.splice(index, 1);
		return true;
	}
	return false;
}
/**
 * Removes one item on the index position.
 * 
 * @method removeAt
 * @param {Int} index
 * @return {Boolean}
 */
Array.prototype.removeAt = function(index) {   
    if (index >= 0 && index < this.length) {
		this.splice(index, 1);
		return true;
	}
	return false;
} 
/**
 * Returns a new version of the array, without any null/undefined values.
 * 
 * @method compact
 * @return {Array}
 */
Array.prototype.compact = function() {   
    return this.filter(function(v){
		return !(v==null || typeof v=="undefined"); 
	});   
}     
/**
 * Returns a new array without repeat items.
 * 
 * @method uniq
 * @param {Function} fn:optional the equals function
 * @param {Object} thisp:optional the function's this
 * @return {Array}
 */
Array.prototype.uniq = function(fn, thisp) {   
    if(this.length < 2) return this.clone();
	
	var temp = this.clone(), thisp = thisp||this;   
    for(var i=0;i < temp.length;i++){   
		for(var j=i+1;j < temp.length;){   
			if(fn && fn.call(thisp, temp[i], temp[j], this)){
				temp.splice(j,1);
			}else if(temp[i] === temp[j]) {
				temp.splice(j,1);
			} else{j++;} 
		}   
	}   
	return temp;
}

/**
 * Apply a function against an accumulator and each value of the array (from left-to-right)
 *  as to reduce it to a single value.
 * 
 * @method reduce
 * @param {accumulator} accumulator
 * @param {Object} initialValue:optional 
 * @return {Object}
 */
Array.prototype.reduce = Array.prototype.reduce || function(accumulator/*, initialValue */){
    var i = 0, l = this.length >> 0, curr;
 
    if(typeof accumulator !== "function") throw new TypeError("First argument is not callable");
 
    if(arguments.length < 2) {
        if (l === 0) throw new TypeError("Array length is 0 and no initial value.");
        curr = this[0];
        i = 1; // start accumulating at the second element
    }else{curr = arguments[1];}      
 
    while (i < l) {
        if(i in this) curr = accumulator.call(undefined, curr, this[i], i, this);
        ++i;
    }
 
    return curr;
}
/**
 * Apply a function against an accumulator and each value of the array (from right-to-left)
 *  as to reduce it to a single value.
 * 
 * @method reduceRight
 * @param {callbackfn} callbackfn
 * @param {Object} initialValue:optional 
 * @return {Object}
 */
Array.prototype.reduceRight = Array.prototype.reduceRight || function(callbackfn/*, initialValue */){
	if (typeof callbackfn != "function") throw new TypeError();
	 
    var t = Object(this);
    var len = t.length >>> 0;
    
    // no value to return if no initial value, empty array
    if (len === 0 && arguments.length === 1) throw new TypeError('Array length is 0 and no initial value.');
 
    var k = len - 1;
    var currentValue;
    if (arguments.length >= 2){
        currentValue = arguments[1];
    }else{
    	do{
	        if (k in this){
	          currentValue = this[k--];
	          break;
	        }
	 
	        // if array contains no values, no initial value to return
	        if (--k < 0) throw new TypeError('no values and no initial value.');
      	}while (true);
    }
 
    while (k >= 0){
    	if (k in t) currentValue = callbackfn.call(undefined, currentValue, t[k], k, t);
    	k--;
    }
 
    return currentValue;
}

/**
 * @native Number  
 */
/**
 * Determines whether or not the object is a number. 
 * 
 * @static
 * @method isNumber
 * @param {String|Number} s
 * @return {Boolean}
 */
Number.isNumber = function(s){
	if(s==null || typeof s == 'undefined') return false;
	if(typeof s == 'number'){
		return true;
	}else if(typeof s == 'string'){
		var n = s.replace(/,/g, '');
		return (!n || isNaN(n))?false:true;
	}
	return false;
}

/**
 * Transfer a number. The default number is Zero.
 * 
 * @static
 * @method toNumber
 * @param {String|Number} s
 * @return {Number} 
 */
Number.toNumber = function(s){
	if(!Number.isNumber(s)) return 0;
	if(typeof s == 'string') {
		var f = parseFloat(s.replace(/,/g, ''));
		return isNaN(f)?0:f;
	}else{
		return Number(s);
	}		
}

/**
 * Transfer a integer. The default number is Zero.
 *
 * @static
 * @method toInt
 * @param {String|Number} s
 * @param {Int} mode:optional rounding mode: (default)0 is round down; 1 is ceil; 2 is floor
 * @return {Int}
 */
Number.toInt = function(s, mode){
	if(this.isInt(s)) return s;
	if(!mode) mode = 0;
	
	switch(mode){
		case 0: return Math.round(Number.toNumber(s));break;
		case 1: return Math.ceil(Number.toNumber(s));break;
		case 2: return Math.floor(Number.toNumber(s));break;
	} 		
}

/**
 * Determines whether or not the object is a float.
 * 
 * @static
 * @method isFloat
 * @param {String|Number} s
 * @return {Boolean}
 */
Number.isFloat = function(s){
	if(!Number.isNumber(s)) return false;
	var n = Number.toNumber(s).toString();		
	return n.indexOf('.') >= 0;
}
/**
 * Determines whether or not the object is a Integer.
 * 
 * @static
 * @method isInt
 * @param {String|Number} s
 * @return {Boolean}
 */
Number.isInt = function(){
	if(!Number.isNumber(s)) return false;
	var n = Number.toNumber(s).toString();		
	return n.indexOf('.') < 0;
}

/**
 * Determines whether or not the object is a negative number, excludes Zero.
 * 
 * @static
 * @method isNegative
 * @param {String|Number} s
 * @return {Boolean}
 */
Number.isNegative = function(s){
	if(!this.isNumber(s)) return false;
	var n = Number.toNumber(s);
	return n!==0 && Math.abs(n)!=n;
},
/**
 * Determines whether or not the object is a positive number, excludes Zero.
 * 
 * @static
 * @method isPositive
 * @param {String|Number} s
 * @return {Boolean}
 */
Number.isPositive = function(s){
	if(!this.isNumber(s)) return false;
	var n = Number.toNumber(s);
	return n!==0 && Math.abs(n)==n;
}

/**
 * Returns the length of decimal bit.
 * 
 * @method decLength
 * @return {Int}
 */
Number.prototype.decLength = function(){
	var s = Math.abs(this).toString();	
	var p = s.indexOf('.');
	
	return (p<0||p>s.length-1)?0:s.length-p-1;
}
/**
 * Returns the length of integer bit.
 * 
 * @method intLength
 * @return {Int}
 */
Number.prototype.intLength = function(){
	var s = Math.abs(this).toString();		
	var p = s.indexOf('.');
	
	return p<0?s.length:p;
}
/**
 * Precision multiplication.
 * 
 * @method mul
 * @param {Number|String} s 
 * @return {Number} 
 * @throws {TypeError} when The argument is null or not a number
 */
Number.prototype.mul = function(s){
	if(s==null || isNaN(s)) {
		throw new TypeError('[Number#mul]The argument is null or not a number.');
	}
	var n = (typeof s == 'string')?s.toNumber():s;
	
	if(n==0) return 0;
	if(n==1) return Number(this);
	
	if(this.isInt() && n.isInt()) {
		return Number(this*n);
	}
	
	var n1=Number(this.toString().replace('.','')), n2=Number(n.toString().replace('.',''));
	return n1*n2/Math.pow(10,this.decLength()+n.decLength());		
}
/**
 * Precision division.
 * 
 * @method div
 * @param {Number|String} s but Zero
 * @return {Number} 
 * @throws {TypeError} when The argument is zero or not a number
 */
Number.prototype.div = function(s){
	if(s==null || s==0 || isNaN(s)) {
		throw new TypeError('[Number#div]The argument is zero or not a number.');
	}
	
	if(this==0) return 0;
	var n = (typeof s == 'string')?s.toNumber():s;
	
	var n1 = Number(this.toString().replace('.','')), n2 = Number(n.toString().replace('.',''));	
	return Math.pow(10,n.decLength()-this.decLength()).mul(n1/n2);		
},	
/**
 * Precision addition.
 * 
 * @method add
 * @param {Number|String} s 
 * @return {Number}
 * @throws {TypeError} when The argument is not a number
 */
Number.prototype.add = function(s){
	if(s==null || isNaN(s)) {
		throw new TypeError('[Number#add]The argument is not a number.');
	}
	
	var n = (typeof s == 'string')?s.toNumber():s;
	
	if(n==0) return Number(this);
	if(this.isInt() && n.isInt()) {
		return Number(this+n);
	}
	
	var m = Math.pow(10,Math.max(this.decLength(),n.decLength()));	
	var n1=this.mul(m), n2=n.mul(m);		
	
	return (n1+n2)/m;
}
/**
 * Precision subtraction.
 * 
 * @method sub
 * @param {Number|String} s 
 * @return {Number} 
 * @throws {TypeError} when The argument is not a number
 */
Number.prototype.sub = function(s){
	if(s==null || isNaN(s)) {
		throw new TypeError('[Number#sub]The argument is not a number.');
	}
	
	var n = (typeof s == 'string')?s.toNumber():s;
	if(n==0) return Number(this);
	if(this.isInt() && n.isInt()) {
		return Number(this-n);
	}
	
	var m = Math.pow(10,Math.max(this.decLength(),n.decLength()));
	var n1=this.mul(m), n2=n.mul(m);		
	
	return (n1-n2)/m;
}

/**
 * @native Date 
 */
/**
 * Determines whether or not a year is leap year.
 * 
 * @static
 * @method isLeapYear
 * @param {Int} year
 * @return {Boolean}
 */
Date.isLeapYear = function(year){return (((year%4===0)&&(year%100!==0))||(year%400===0));};
/**
 * Returns the max day number in the month and the year.
 * 
 * @static
 * @method getMonthDays
 * @param {Int} year
 * @param {Int} month 0~11
 * @return {Int}
 */
Date.getMonthDays = function(year, month){
	return new Date(year, month + 1, 0).getDate();
}
/**
 * Parse a String to a Date.
 * 
 * @static
 * @method parseDate
 * @param {String} sDate
 * @return {Date}
 * @throws {TypeError} when Arguments is null or bad-format
 */
Date.parseDate = function(sDate){
	if(!JS.isString(sDate)) throw new TypeError("[Date#parseDate]Arguments is null or bad-format.");
	
	var ms = Date.parse(sDate);
	if (ms) {
		var d1970 = new Date(1970, 1, 1, 0, 0, 0, 000);
		d1970.setTime(ms);
		return d1970;
	}
	return null;
}

/**
 * Determines whether or not a day equals this day.
 * 
 * @method equals
 * @param {Date} date
 * @param {String} type:optional values: "y"|"m"|"d"|"ymd"|"t"; the default value is "t"
 * @return {Boolean} 
 * @throws {TypeError} when Arguments is not date
 */
Date.prototype.equals = function(date,type){return this.compare(date,type)==0;};
/**
 * Add one day or month or year to this date.
 * 
 * @method add
 * @param {Int} n
 * @param {String} type values:"y"|"m"|"w"|"d"|"h"|"mi"|"s"|"ms"; the default value is "d"
 * @throws {TypeError} when The argument<n> is not integer
 */
Date.prototype.add = function(n, type){
	if(n.isFloat()) throw new TypeError('[Date#add]The argument<n> is not integer.');
	
	switch (type) {
		case 'y':
			this.add(n*12, 'm');break;
		case 'm':
			var d = this.getDate();
			this.setDate(1);
			this.setMonth(this.getMonth()+n);
			this.setDate(Math.min(d, Date.getMonthDays(this.getFullYear(),this.getMonth())));
			break;
		case 'd':
			this.add(n*86400000, 'ms');break;
		case 'h':
			this.add(n*3600000, 'ms');break;	
		case 'mi':
			this.add(n*60000, 'ms');break;	
		case 's':
			this.add(n*1000, 'ms');break;	
		case 'ms':
			this.setMilliseconds(this.getMilliseconds()+n);break;	
		case 'w':
			this.add(n*604800000, 'ms');break;
		default:
			this.add(n,'d');
	}
};

var _compare = function(a,b){return (a>b)?1:(a<b?-1:0)};
var _compareYear = function(a,b){return _compare(a.getFullYear(), b.getFullYear())};
var _compareMonth = function(a,b){return _compare(a.getMonth(), b.getMonth())};
var _compareDate = function(a,b){return _compare(a.getDate(), b.getDate())};
/**
 * Compare this date with a date.
 * 
 * @method compare
 * @param {Date} date
 * @param {String} type:optional values: "y"|"m"|"d"|"ymd"|"t"; the default value is "t"
 * @return {Number} values: -1 is before the date; 0 is equals the date; 1 is after the date
 * @throws {TypeError} when The argument<date> is not date
 */	
Date.prototype.compare = function(date, type){
	if(!date || !(date instanceof Date)) throw new TypeError('[Date#compare]The argument<date> is not date.');
	
	switch (type) {
		case 'y':
			return _compareYear(this,date);
		case 'm':
			return _compareMonth(this,date);
		case 'd':
			return _compareDate(this,date);
		case 'ymd':
			var i = _compareYear(this,date);
			if(i!=0) return i;
			i = _compareMonth(this,date);
			if(i!=0) return i;
			i = _compareDate(this,date);
			return i;
		default:
			return _compare(this.getTime(), date.getTime());
	}		
}	
	
var _format = function(i){
    var str = i.toString();
    return (str.length < 2) ? '0' + str : str;
}
var _ymdString = function(date, split){
    return date.getFullYear() + split + _format(date.getMonth() + 1) + split + _format(date.getDate());
}
var _hmsString = function(date, split){
    return _format(date.getHours()) + split + _format(date.getMinutes()) + split + _format(date.getSeconds());
}  

/** 
 * Format the date to a String.
 * 
 * @method format
 * @param {String|Function} a String values: "hh:mm:ss"|"yyyy-MM-dd"|"yyyy-MM-dd hh:mm:ss"|"yyyy/MM/dd"|"yyyy/MM/dd hh:mm:ss"; or a function with arguments this date
 * @param {Object} thisP:optional the callback function's "this"
 * @return {String} 
 */	
Date.prototype.format = function(arg, thisP){
	if(!arg || JS.isString(arg)){
		switch(arg){
			case 'hh:mm:ss': return _hmsString(this, ':');
			case 'yyyy-MM-dd': return _ymdString(this, '-');
			case 'yyyy-MM-dd hh:mm:ss': return _ymdString(this, '-')+' '+_hmsString(this, ':');
			case 'yyyy/MM/dd': return _ymdString(this, '/');
			case 'yyyy/MM/dd hh:mm:ss': return _ymdString(this, '/')+' '+_hmsString(this, ':');
			default: return _ymdString(this, '-');
		}
	}else if(JS.isFunction(arg)){
		try{
			return arg.apply(thisP, [this]);
		}catch(e){return this.toLocaleString();}
	}else {
		return this.toLocaleString();
	}	
}

})();

