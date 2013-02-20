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
 * @require /core/Base.js
 * @require /core/Object.js
 * @require /core/Class.js
 */
(function() {
JS.setConfig('js.loader.multi', true);
	
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
var _findPathKeyByClassName = function(className, paths){
	var pos = className.lastIndexOf('.'),
		pName = pos>-1?className.slice(0, pos):className;
	if(paths[pName]) return pName;
	if(pos < 0) return null;
	return _findPathKeyByClassName(pName, paths);
}
var _findPathKeyByFile = function(filePath, paths){
	var pos = filePath.indexOf('/'),
		pName = pos>-1?filePath.slice(0, pos):filePath;
	return paths[pName]?pName:null;
}

var _parseURI = function(uri, loader){
	var path = null, type = 'class';
	if(uri.startsWith('js://')){
		type = 'js';
		path = uri.slice(5);
		var pathKey = _findPathKeyByFile(path, loader.getPath());
		path = pathKey?path.replace(pathKey, loader.getPath(pathKey)):path;
	}else if(uri.startsWith('css://')){
		type = 'css';
		path = uri.slice(6);
		var pathKey = _findPathKeyByFile(path, loader.getPath());
		path = pathKey?path.replace(pathKey, loader.getPath(pathKey)):path;
	}else{//single class file
		var className = uri;
		var pathKey = _findPathKeyByClassName(className, loader.getPath());
		className = className.replace(/\./gi, '/');
		className = pathKey?className.replace(pathKey.replace(/\./gi, '/'), loader.getPath(pathKey)):'./' + className;	
		path = className+'.js';
	}
	return {
		type:type,
		path:path,
		uri:uri
	}
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
	this._loadedFiles = {};
	this._paths = config['path']||{};
	this._packages = config['package']||{};
	this._events = {};
}
/**
 * @static
 * @method getLoader
 * @param {String} id
 * @return {JS.Loader|Object}
 */
JS.Loader.getLoader = function(id){
	return id?loaders[id]:loaders;
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
	 * @return {String|Array<String>|Object}
	 */
	getPath: function(key){
		var p = {};
		
		if(this.parent) p = JS.mix(p, this.parent.getPath());
		p = JS.mix(p, this._paths);
		
		return key?p[key]:p;
	},
	/**
	 * @method setPackage
	 * @param {Object} ps 
	 */	
	setPackage: function(ps){
		JS.mix(this._packages, ps);
	},
	/**
	 * @method getPackage
	 * @param {String} key
	 * @return {String|Array<String>|Object}
	 */
	getPackage: function(key){
		var p = {};
		
		if(this.parent) p = JS.mix(p, this.parent.getPackage());
		p = JS.mix(p, this._packages);
		
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
	newFile: function(uri, id){
		var dom = document.getElementById(id);
		if(!dom) return;
		this._loadedFiles[uri] = id;	
	},
	/**
	 * Returns true if the file be loaded successfully.
	 * @param {String} uri
	 * @return {Boolean}
	 */
	hasFile: function(uri){		
		return this.findFile(uri)?true:false;
	},
	/**
	 * Return the loaded file by uri
	 * @param uri
	 * @return {String} file element's id
	 */
	findFile: function(uri){
		if(this.parent){
			var file = this.parent.findFile(uri);
			if(file) return file;
		}
		return this._loadedFiles[uri];
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
	 *         ('"'+ this.getName() + '" Cat eat some ' + food);
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
			depends = this.resolveClassNames(arrayExtend.concat(mixins, requires).uniq());
		
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
			var wait = false;
			depends.forEach(function(a){
				if(a!='JS.Object' && !this.hasClass(a)) {
					wait = true;
					this.loadClass(a);
				}
			},this);
			if(!wait) this._buildClass(name);
		}		
	},
	_buildAll: function(){
		for(var name in this._definedClasses) {
			this._buildClass(name);
		}
	},
	_buildClass: function(className){
		if(this.hasClass(className)) return;
		
		var d = this._definedClasses[className];
		if(!d) return;
		var	info = d['info'],
			data = d['data'];
		
		if(JS.ClassBuilder.build(info, data, this)){
			this.fireEvent('classBuilded', info['className']);
			
			delete this._definedClasses[name];
			this._buildAll();
			return;
		}
		return;
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
		
		names.forEach(function(a){//a is URI 
			var rst = _parseURI(a, this),
			    type = rst['type'],
			    uri = rst['uri']
				path = rst['path'];
			
			if(type=='css'){//load css
				var onloaded = function(){
					this.newFile(uri, this.id+'_'+uri);
					this._buildAll();
				};
				if(this.hasFile(uri)){
					onloaded.call(this);
					return;
				}	
				this._loadCss(uri, path, onloaded);
			}else if(type=='js'){//load js
				var onloaded = function(){
					this._buildAll();
				};
				if(this.hasFile(uri)){
					onloaded.call(this);
					return;
				}	
				this._loadScript(type, uri, path, onloaded);
			}else if(type=='class'){//load class
				var onloaded = function(){
					this._buildClass(a);
				};
				if(this.hasClass(uri)){
					onloaded.call(this);
					return;
				}	
				this._loadScript(type, uri, path, onloaded);
//			}else if(type=='jsb'){//load bundle
//				var onloaded = function(){
//					this._buildClass(a);
//				};
//				if(this.hasClass(uri)){
//					onloaded.call(this);
//					return;
//				}	
//				this._loadBundle(uri, path, onloaded);
			}else{
				throw new Error('An unknown URI found:'+a);
			}		
		},this);		
	},
	resolveClassNames: function(classNames){
		var paths = this.getPackage(),
		    newArray = [];
		
		var hasReplace = false;
		classNames.forEach(function(a, i){
			var cp = paths[a];
			if(cp && JS.isArray(cp)) {
				newArray = newArray.concat(cp);
				hasReplace = true;
			}else{
				newArray.push(a);
			}			
		});		
		if(!hasReplace) {
			return newArray;		
		}else{
			return this.resolveClassNames(newArray);
		}		
	},
	_readTextFile: function(url){
		var xhr = typeof XMLHttpRequest != 'undefined'?new XMLHttpRequest():new ActiveXObject('Microsoft.XMLHTTP');
		try {
            xhr.open('GET', url, false);
            xhr.send(null);
        }
        catch (e) {
            throw new Error('Reading text file failed: '+url+'. Maybe you should use HTTP server for this cross origin request.');
        }
        status = (xhr.status === 1223) ? 204 : xhr.status;

        var txt = xhr.responseText;
        xhr = null;// Maybe IE memory leak
        
        return txt;
	},
	_loadBundle: function(name, src, onloaded){
		var url = src + '?_dt=' + (new Date().getTime());
		var json = eval("("+this._readTextFile(url)+")");
		
		this.setPackage(json['packages']);
		JS.imports(json['name']+'.*',onloaded,this);
	},
	_loadCss: function(name, src, onloaded){
		var css = document.createElement('link'), 
		    scope = this, 
		    onloadFn = function() {	
				if(onloaded) onloaded.call(scope);
				css.onload = css.onreadystatechange = null;
	        };		
		
		css.href = src + '?_dt=' + (new Date().getTime());
		css.rel = 'stylesheet';
		css.type = 'text/css';
		css.id = this.id+'_'+name;	
		
		css.onload = onloadFn;
        css.onerror = function(){throw new Error('Loading css file failed: '+src+'.')};
        css.onreadystatechange = function() {//for IE
        	if (this.readyState === 'loaded' || this.readyState === 'complete') {
                onloadFn();
            }
        };        
		head.appendChild(css);	
	},
	_loadScript: function(type, name, src, onloaded){
		var el = document.createElement('script'),
		    id = this.id+'_'+name,
		    url = src + '?_dt=' + (new Date().getTime()),
		    scope = this, 
        	onloadFn = function() {	
				if(onloaded) onloaded.call(scope);
				// Maybe memory leak in IE
                el.onload = el.onreadystatechange = null;
                if (head && el.parentNode) {
                    head.removeChild(el);
                }
            };

        el.id = id;
		el.type = 'text/javascript';
		el.setAttribute('loaderid', this.id);
		el.setAttribute('uri', name);

		if(JS.getConfig('js.loader.multi')){
			var code = this._readTextFile(url);
			code = code.replace(/JS.define\(/g, 'JS.Loader.getLoader("'+this.id+'").defineClass(');
			
			if(type!='class'){
				code+= 'JS.Loader.getLoader("'+this.id+'").newFile("'+name+'","'+id+'");';							
			}		
			
	    	el.text = code;
	    	head.insertBefore(el, head.firstChild);  
			onloadFn();	
		}else{
			el.src = url;
			el.onload = onloadFn;
	        el.onerror = function(){throw new Error('Loading js file failed: '+src+'.')};
	        el.onreadystatechange = function() {//for IE
	        	if (this.readyState === 'loaded' || this.readyState === 'complete') {
	                onloadFn();
	            }
	        };	        
			head.appendChild(el);
		}		
	}
}

})();

JS.ClassLoader = new JS.Loader({id:'JS.ClassLoader',path:{'JS': '.'}});
JS.ClassLoader.newClass('JS.Object');
