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
 * @requires /core/JS-base.js
 * @requires /core/Object.js
 * @requires /core/Class.js
 */
(function() {
var head = document.head||document.getElementsByTagName('head')[0];
	
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

var _requireCallbacks = {}, _definedClasses = {};

var _buildAll = function(){
	for(var name in _definedClasses) {
		_buildClass(name);
	}
}
var _buildClass = function(className){
	var d = _definedClasses[className];
	if(!d) return false;
	var	info = d['info'],
		data = d['data'],
		loader = className.startsWith('JS.')?JS.BootLoader:JS.AppLoader;
	
	if(JS.ClassBuilder.build(info, data, loader)){	
		loader.newClass(info);
		_callback4Requires(info['className']);
		
		delete _definedClasses[name];
		_buildAll(loader);
		return true;
	}
	return false;
}

var _check4Requires= function(key){
	var names = _requireCallbacks[key]['names'],
		fns = _requireCallbacks[key]['fns'];
	if(names.every(function(a){return JS.AppLoader.hasClass(a)},this)) {
		fns.forEach(function(fn){
			fn.call();
		});
		delete _requireCallbacks[key];
		return true;
	}
	return false;
}
var _callback4Requires= function(name){
	for(k in _requireCallbacks) {
		if((k+',').indexOf(name+',')>=0){
			if(_check4Requires(k)) return;
		}
	}
}
	
/**
 * @class JS.ClassLoader
 */
JS.ClassLoader = function(id, parent){
	this._id = id;
	this._parent = parent;	
	this._classes = {};
	
}

var _paths = {};	
var _findClassPathKey = function(className){
	var pos = className.lastIndexOf('.'),
		pName = className.slice(0, pos);
	if(!pName) return null;
	if(_paths[pName]) return pName;
	
	return _findClassPathKey(pName);
}
var _getScriptPath = function(className){
	var pathKey = _findClassPathKey(className);
	    
	if(pathKey){
		className = className.replace(/\./gi, '/');
		className = className.replace(pathKey.replace(/\./gi, '/'), _paths[pathKey]);			
	}else{
		className = className.replace(/\./gi, '/');	
		className = './' + className;	
	}
	return className+'.js';
}
/**
 * @method setPath
 * @param {Object} pathKV
 * @public
 */
JS.ClassLoader.setPath = function(ps){
	JS.mix(_paths, ps);
}
JS.ClassLoader.getPath = function(key){
	return _paths[key];
}

JS.ClassLoader.require = function(classNames, onFinished){
	var names = Array.toArray(classNames);
	if(JS.isEmpty(names)) return;
	
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
	if(!_check4Requires(key)){
		names.forEach(function(a){
			if(a!='JS.Object') JS.AppLoader.loadClass(a);
		},this);
	}		
}

JS.ClassLoader.prototype = {
	hasClass: function(name){
		return this.findClass(name)?true:false;
	},	
	findClass: function(name){
		if(!name) return null;
		
		var clazz = this._classes[name];
		if(clazz) return clazz;
		
		if(this._parent) {
			clazz = this._parent.findClass(name);
			if(clazz) return clazz;
		}
		
		return null;
	},
	getPackage: function(packageName){
		return JS.ns(packageName, window);
	},
	getClasses: function(){
		return this._classes;
	},
	/**
	 * @method create
	 * @param {String} className
	 * @param {Object..} arguments[1..n]
	 * @return {Object}
	 */
	create: function(){
		var className = arguments[0],
			clazz = this.findClass(className);
		if(!clazz) throw new Error('Create the class:<'+className+'> failed by loader.');
			
		return JS.Class.prototype.newInstance.apply(clazz, [].slice.call(arguments,1));
	},
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
		
		_definedClasses[name] = {
				data: data,
				info: info
			};
		
		if(JS.isEmpty(depends)){
			_buildClass(name);
		}else{
			depends.forEach(function(a){
				if(a!='JS.Object') this.loadClass(a);
			},this);
		}		
	},
	newClass: function(name){
		var data = JS.isString(name)?_getClassInfo(name):name;
		if(this.hasClass(data.className)) return;
		
		var clazz = new JS.Class(data, this);
		this._classes[data.className] = clazz;	
	},
	loadClass: function(name){
		if(this.hasClass(name)) return;
		
		if(name.startsWith('JS.') && this._parent!=null) {
			JS.BootLoader.loadClass(name);
		}else{
			this._loadJS(name,function(){
					_buildClass(name);
				},this
			)
		}
	},
	_loadJS: function(className, onloaded, scope){
		var isLib = className.startsWith('lib:'),
			id = isLib?className.slice(4):className,
			isLoaded = false;		
		
		if(isLib){
			if(this.hasLib(id)) isLoaded = true;
		}else if(this.hasClass(className)){
			isLoaded = true;
		}else if(document.getElementById(id)){
			isLoaded = true;	
		}	
			
		if(isLoaded){
			if(onloaded) onloaded.call(scope);
			return;
		}	
        
		var src = isLib?id:_getScriptPath(className);
        this._loadScript(id, src, onloaded, scope);
	},
	_loadScript: function(id, src, onloaded, scope){
		var script = document.createElement('script'),
        	onloadFn = function() {	
				if(onloaded) onloaded.call(scope);
            },
            onerrorFn = function(){throw new Error('Load js file failed: '+src+'.')};

        script.id = id;
		script.type = 'text/javascript';
        script.src = src + '?_dt=' + (new Date().getTime());
        script.onload = onloadFn;
        script.onerror = onerrorFn;
        script.onreadystatechange = function() {//for IE
        	if (this.readyState === 'loaded' || this.readyState === 'complete') {
                onloadFn();
            }
        };
		
		head.appendChild(script);			
	}
}

})();

JS.setPath({'JS': '.'});
JS.BootLoader = new JS.ClassLoader('JS.BootLoader');
JS.BootLoader.newClass('JS.Object');

JS.AppLoader = new JS.ClassLoader('JS.AppLoader',JS.BootLoader);
