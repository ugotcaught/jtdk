/**
 * @project JSDK JavaScript Development Kit
 * @copyright Copyright(c) 2004-2012, Dragonfly.org. All rights reserved.
 * @license LGPLv3
 * @website http://jsdk2.sourceforge.net/website/index.html
 * 
 * @version 1.0.0
 * @author feng.chun
 * @date 2012-11-21
 * @date 2012-12-03
 * @date 2012-12-19
 * 
 * @require /core/JS-base.js
 * @require /core/Object.js
 * @require /core/Class.js
 */
(function() {
var head = document.head||document.getElementsByTagName('head')[0];
var ns = function(pkg, namespace) {
	if(!pkg) return namespace||window;
	
	var win = namespace||window
		,p = pkg.split('.')
    	,len = p.length
    	,p0 = p[0];
	if(typeof win[p0]=="undefined") win[p0] = {};
	
	var b = win[p0];
    for (var i=1; i<len; i++) {
		var pi = p[i]; if(!pi) break;	             
		b[pi] = b[pi]||{};
		b = b[pi];
    }
    return b;
}		
var _getClassInfo = function(className){
	var p = className.lastIndexOf('.'),
		packageName = p<=0?'':className.slice(0, p),
		simpleName = p<=0?className:className.slice(p+1, className.length);
	return {
		className: className,
		packageName: packageName,
		simpleName: simpleName
	}
}
var _findClassPathKey = function(className, paths){
	var pos = className.lastIndexOf('.'),
		pName = className.slice(0, pos);
	if(!pName) return null;
	if(paths[pName]) return pName;
	
	return _findClassPathKey(pName, paths);
}

var loaders = {}; 
/**
 * JS class dynamic loader.
 * App can customize a new loader. If app do not specify a parent loader, 
 * then JS.ClassLoader automatically become the default parent loader.
 * 
 * @class JS.Loader
 * @constructor
 * @param {Object} config has properties: "id", "parent", "path"
 */
JS.Loader = function(config){
	this.id = config['id'];
	this.parent = config['parent'];
	if(this.id!='JS.ClassLoader' && !this.parent) this.parent = JS.ClassLoader;
	
	loaders[this.id] = this;	
	this._definedClasses = {};
	this._loadedClasses = {};
	this._paths = config['path']||{};
	this._events = {};
}
/**
 * @static
 * @method getLoader
 * @param {String} id
 * @returns
 */
JS.Loader.getLoader = function(id){
	return loaders[id];
}

JS.Loader.prototype = {
	/**
	 * @method setPath
	 * @param {Object} ps 
	 */	
	setPath: function(ps){
		JS.mix(this._paths, ps);
	},
	/**
	 * @method getPath
	 * @param {String} key
	 * @return {String}
	 */
	getPath: function(key){
		var p = {};
		
		if(this.parent) p = JS.mix(p, this.parent.getPath());
		p = JS.mix(p, this._paths);
		
		return key?p[key]:p;
	},
	/**
	 * namespace's alias.
	 * @method ns
	 * @param {String} name
	 * @return {Object}
	 */
	ns: function(name){
		return ns(name, this);
	},
	/**
	 * Returns true if the class be loaded successfully.
	 * @param {String} name
	 * @return {Boolean}
	 */
	hasClass: function(name){
		if(JS.isArray(name)) return name.every(function(a){return this.hasClass(a)},this);		
		return this.findClass(name)?true:false;
	},
	/**
	 * Return the loaded class by name
	 * @param name
	 * @return {JS.Class}
	 */
	findClass: function(name){
		if(this.parent){
			var clazz = this.parent.findClass(name);
			if(clazz) return clazz;
		}
		return this._loadedClasses[name];
	},
	/**
	 * @method getClasses
	 * @return {Array<JS.Object>}
	 */
	getClasses: function(){
		return this._loadedClasses;
	},
	/**
	 * Build a new Class instance with the current loader.
	 * 
	 * @method create
	 * @param {String} className
	 * @param {Object..} arguments[1..n]
	 * @return {Object}
	 * @throws {Error} the class was not loaded or is singleton
	 */
	create: function(){
		var className = arguments[0],
		clazz = this.findClass(className);
		if(!clazz) throw new Error('Create a class instance:<'+className+'> failed.');
		if(clazz.isSingleton()) throw new Error('Instantiate a singleton class:<'+className+'> failed.');
		
		return JS.Class.prototype.newInstance.apply(clazz, [].slice.call(arguments,1));
	},
	/**
	 * Define a class and load all depended classes.
	 * For example:
	 * JS.define('JS.test.CAT',{
	 *     constructor: function(name, color){
	 *         this.setName(name);
	 *         this.setColor(color);
	 *     },
	 *     config: {
	 *         color: null,
	 *         name: null
	 *     },
	 *     eat: function(food){
	 *         JS.log('"'+ this.getName() + '" Cat eat some ' + food);
	 *     }
	 * });
	 * 
	 * @method defineClass
	 * @param {String} name the class name
	 * @param {Object} data has properties: extend, mixins, requires, constructor, statics, config...
	 */
	defineClass: function(name, data){
		if(this.hasClass(name)) return;
		
		var extend = data['extend'];
		if(extend) extend = extend.toString();
		
		var arrayExtend = extend?[extend]:[],
			mixins = Array.toArray(data['mixins']||[]),
			requires = Array.toArray(data['requires']||[]),
			depends = arrayExtend.concat(mixins, requires).uniq();
		
		var info = _getClassInfo(name);
		info['depends'] = depends;
		info['extend'] = extend;
		info['mixins'] = mixins;
		
		this._definedClasses[name] = {
				data: data,
				info: info
			};
		
		if(JS.isEmpty(depends)){
			this._buildClass(name);
		}else{
			depends.forEach(function(a){
				if(a!='JS.Object') this.loadClass(a);
			},this);
		}		
	},
	_buildAll: function(){
		for(var name in this._definedClasses) {
			this._buildClass(name);
		}
	},
	_buildClass: function(className){
		var d = this._definedClasses[className];
		if(!d) return false;
		var	info = d['info'],
			data = d['data'];
		
		if(JS.ClassBuilder.build(info, data, this)){	
			this.fireEvent('classBuilded', info['className']);
			
			delete this._definedClasses[name];
			this._buildAll();
			return true;
		}
		return false;
	},
	onEvent: function(name, fn){
		var fns = this._events[name];
		if(!fns) fns = [];
		fns.push(fn);
		this._events[name] = fns;
	},
	fireEvent: function(name, data){
		var fns = this._events[name];
		if(fns) fns.forEach(function(fn){
			fn.call(this, data);
		},this);		
	},
	newClass: function(name){
		var data = JS.isString(name)?_getClassInfo(name):name;
		if(this.hasClass(data.className)) return;
		
		var clazz = new JS.Class(data, this);
		this._loadedClasses[data.className] = clazz;	
	},
	loadClass: function(name){
		var names = Array.toArray(name);
		
		names.forEach(function(a){
			if(this.hasClass(a)) return;
			
			this._loadJS(a,function(){
					this._buildClass(a);
				},this);			
		},this);		
	},
	resolvePath: function(className){
		var pathKey = _findClassPathKey(className, this.getPath());
		    
		if(pathKey){
			className = className.replace(/\./gi, '/');
			className = className.replace(pathKey.replace(/\./gi, '/'), this.getPath(pathKey));			
		}else{
			className = className.replace(/\./gi, '/');	
			className = './' + className;	
		}
		return className+'.js';
	},
	_loadJS: function(className, onloaded, scope){
//		var isLib = className.startsWith('lib:'),
//			id = isLib?className.slice(4):className,
			isLoaded = false;		
		
		if(this.hasClass(className)){
			isLoaded = true;
		}else if(document.getElementById(this.id+'_'+className)){
			isLoaded = true;	
		}	
			
		if(isLoaded){
			if(onloaded) onloaded.call(scope);
			return;
		}	
        
		var src = this.resolvePath(className);
        this._loadScript(className, src, onloaded, scope);
	},
	_readJS: function(url){
		var xhr = null;
		if (typeof XMLHttpRequest != 'undefined') {
            xhr = new XMLHttpRequest();
        } else {
            xhr = new ActiveXObject('Microsoft.XMLHTTP');
        }

        try {
            xhr.open('GET', url, false);
            xhr.send(null);
        }
        catch (e) {
            throw new Error('Read file<'+url+'> failed. Maybe you should use HTTP server for this cross origin request.');
        }
        status = (xhr.status === 1223) ? 204 : xhr.status;

        var txt = xhr.responseText;
        xhr = null;// Maybe IE memory leak
        
        return txt;
	},
	_loadScript: function(name, src, onloaded, scope){
		var script = document.createElement('script'),
        	onloadFn = function() {	
				if(onloaded) onloaded.call(scope);				
            };

        script.id = this.id+'_'+name;
		script.type = 'text/javascript';
		script.setAttribute('loaderid', this.id);
		script.setAttribute('classname', name);

		var code = this._readJS(src + '?_dt=' + (new Date().getTime()));
		code = code.replace(/JS.define\(/g, 'JS.Loader.getLoader("'+this.id+'").defineClass(');
		
    	script.text = code;
    	head.insertBefore(script, head.firstChild);  
		onloadFn();	
	}
}

})();

JS.ClassLoader = new JS.Loader({id:'JS.ClassLoader',path:{'JS': '.'}});
JS.ClassLoader.newClass('JS.Object');
