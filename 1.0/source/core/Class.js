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
 */
(function() {
/**
 * Only JSDK can creates Class objects.
 * @class JS.Class
 * @private
 * @constructor
 * @param {String} className
 * @throws {Error} when not found the class 
 */
JS.Class = function(classInfo, loader){
	if(!classInfo['extend'] && classInfo['className']!='JS.Object'){
		classInfo['extend'] = 'JS.Object';
	}
	
	this._info = classInfo;
	this._loader = loader;
	
	if(classInfo['className']=='JS.Object'){
		var pkg = loader.ns(this._info['packageName']);
		pkg[this._info['simpleName']] = JS.Object;
	}
	this._ctor = loader.ns(this._info['packageName'])[this._info['simpleName']];
	
	if(!this._ctor) throw new Error('Not found the class:<'+className+'> by loader.');
	this._ctor.$class = this;
	
	var me = this, o = this._ctor.prototype?this._ctor.prototype:this._ctor;
	o.getClass = function(){
		return me;
	}
};

JS.mix(JS.Class.prototype, {
	/**
	 * Returns the class's loader.
	 * 
	 * @method getLoader
	 * @return {JS.Loader} 
	 */
	getLoader: function(){
		return this._loader;
	},
	/**
	 * Returns the class full name.
	 * 
	 * @method getName
	 * @return {String} full name
	 */
	getName: function(){
		return this._info['className']
	},
	/**
	 * Returns the class's package name.
	 * 
	 * @method getPackageName
	 * @return {String} package name
	 */
	getPackageName: function(){
		return this._info['packageName']
	},
	/**
	 * Returns the class's short name.
	 * 
	 * @method getSimpleName
	 * @return {String} short name
	 */
	getSimpleName: function(){
		return this._info['simpleName']
	},
	/**
	 * Returns the super class's full name.
	 * 
	 * @method getSuperName
	 * @return {String} super class name
	 */
	getSuperName: function(){
		return this._info['extend']
	},
	/**
	 * Returns True if the class is singleton, false otherwise.
	 * 
	 * @method isSingleton
	 * @return {Boolean} 
	 */
	isSingleton: function(){
		return !this._ctor.prototype;
	},
	/**
	 * Returns the class constructor function.
	 * 
	 * @method getCtor
	 * @return {Function} constructor function
	 */
	getCtor: function(){
		return this._ctor;
	},
	/**
	 * Returns the super class.
	 * 
	 * @method getSuperClass
	 * @return {JS.Class}
	 */
	getSuperClass: function(){
		return this._loader.findClass(this.getSuperName());
	},
	/**
	 * Returns a new instance of the class.
	 * 
	 * @method newInstance
	 * @param {Object..} arguments
	 * @return {Object}
	 */
	newInstance: function(){		
		var f = function(){};
		f.prototype = this._ctor.prototype;
		var obj = new f();
		this._ctor.apply(obj, arguments);
		return obj;
	},
	/**
	 * Returns True if two classes's name and loader are equals, false otherwise.
	 * 
	 * @method equals
	 * @param {JS.Class} clazz
	 * @return {Boolean}
	 */
	equals: function(clazz){
		return clazz && this.getName()===clazz.getName();
	},
	/**
	 * Returns the classe's all statics properties.
	 * 
	 * @method getStatics
	 * @return {Object}
	 */
	getStatics: function(){
		var ctor = this._ctor,
		    statics = undefined;
		
		JS.forIn(ctor, function(k){
			if(!statics) statics = {};
			statics[k] = ctor[k];
		})
		
		return statics;
	},
	/**
	 * Returns the classe's all methods, exclude constructor, include static methods.
	 * 
	 * @method getMethods
	 * @return {Object}
	 */
	getMethods: function(){
		var members = {};
	
		JS.forIn(this._ctor, function(k){
			if(JS.isFunction(this[k])) members[k] = this[k];
		})		
		if(this.isSingleton()) return members;		
		 
		JS.forIn(this._ctor.prototype, function(k){
			if(k!='constructor' && JS.isFunction(this[k])) members[k] = this[k];
		})
		return members;
	},
	/**
	 * Returns the method by the name.
	 * 
	 * @method getMethod
	 * @param {String} name the method name
	 * @return {Function}
	 */
	getMethod: function(name){
		var mds = this.getMethods();
		return mds?mds[name]:undefined;
	},
	/**
	 * Returns all fields, include static fields.
	 * 
	 * @method getFields
	 * @param {Object} obj:optional the class instance
	 * @return {Object}
	 */
	getFields: function(obj){
		var members = {};
		
		JS.forIn(this._ctor, function(k){
			if(!JS.isFunction(this[k])) members[k] = this[k];
		})		
		if(this.isSingleton()) return members;		
		 
		JS.forIn(obj, function(k){
			if(!JS.isFunction(this[k])) members[k] = this[k];
		})
		return members;
	},
	/**
	 * Returns a field by name, exclude statics and config.
	 * 
	 * @method getField
	 * @param {Object} obj the class instance.If this field is static, pass a NULL
	 * @param {String} name:optional the field name
	 * @return {Object}
	 */
	getField: function(obj, name){
		var fs = this.getFields(obj);
		return fs?fs[name]:undefined;
	},
	/**
	 * Returns the classe's a config property.
	 * 
	 * @method getConfigProperty
	 * @param {Object} obj the class instance
	 * @param {String} name:optional the property name
	 * @return {Object}
	 */
	getConfigProperty: function(obj, name){
		if(this.isSingleton()) return undefined;
			
		var config = this._info['config'];
		if(config && name && JS.hasOwnProperty(config,name)) return {defaultValue: config[name], value: obj[name]};		
		return undefined;
	},
	/**
	 * Returns the classe's all config properties.
	 * 
	 * @method getConfig
	 * @param {Object} obj:optional the class instance
	 * @return {Object}
	 */
	getConfig: function(obj){
		if(this.isSingleton()) return undefined;
			
		var config = this._info['config'],
			rst = undefined;
		if(config){
			rst = {};
			for(var k in config){
				rst[k] = {
					defaultValue: config[k],
					value: obj?obj[k]:null	
				}
			}
		}
		
		return rst;
	},
	/**
	 * Set a new value to a field.
	 * 
	 * @method setField
	 * @param {Object} obj the class instance.If this field is static, pass a NULL
	 * @param {String} fieldName the field name
	 * @param {Object} newValue the field name
	 * @throws {Error} If update a static field, then throw a Error.
	 */
	setField: function(obj, name, newValue){
		var field = this.getField(obj, name);
		if(!field) throw new Error('This field named "'+name+'" is not exist!');
		if(field.isStatic){
			throw new Error('Update a static field value is not allowed!');
		}else{
			obj[name] = newValue;
		}
	},
	/**
	 * Set a new value to a config property.
	 * 
	 * @method setConfigProperty
	 * @param {Object} obj the class instance
	 * @param {String} fieldName the property name
	 * @param {Object} newValue the field name
	 */
	setConfigProperty: function(obj, name, newValue){
		if(this.isSingleton()) throw new Error('This is a singleton class without config!');
		var fn = obj['set'+(name.substring(0,1).toUpperCase()+name.slice(1))];
		if(!fn) throw new Error('This class has not a config property named "'+name+'".');	
		fn.call(obj, newValue);
	},
	/**
	 * Reflective invoke a method.
	 * 
	 * @method invokeMethod
	 * @param {Object} obj the class instance.If this method is static, pass a NULL
	 * @param {String} methodName the field name
	 * @param {Object..} args arguments for the method
	 */
	invokeMethod: function(obj, methodName, args){
		var md = this.getMethod(methodName);
		if(!md) throw new Error('This class has not a method named "'+methodName+'".');
		
		var sts = this.getStatics(), isStatic = sts && sts[methodName]?true:false;
		return md.apply(isStatic?this._ctor:obj, [].slice.call(arguments, 2));
	}	
});

JS.mix(JS.Class, {
	/**
	 * @method getClasses
	 * @param {String|JS.Loader} loader:optional loader'id or instance
	 * @return {Array<JS.Class>}
	 */
	getClasses: function(loader){
		var loaders = {};
		if(loader){
			var loader = JS.isString(loader)?JS.Loader.getLoader(loader):loader;
			loaders[loader['id']] = loader;
		}else{
			loaders = JS.Loader.getLoader();
		}
		
		var classes = [];
		for(var k in loaders){
			classes = classes.concat(loaders[k].getClasses());
		}
		return classes;
	},	
	/**
	 * Find Class for name.
	 * 
	 * @method forName
	 * @static
	 * @param {String} className
	 * @param {JS.Loader} loader:optional
	 * @return {JS.Class}
	 */
	forName: function(className, loader){
		var l = loader||JS.ClassLoader;
		return l.findClass(className);
	},
	/**
	 * Returns true if the test object is a jsdk class, false otherwise.
	 * 
	 * @method isClass
	 * @static
	 * @param {String|Object} clazz
	 * @param {JS.Loader} loader:optional
	 * @return {Boolean}
	 */
	isClass: function(clazz, loader){
		if(JS.isString(clazz)) return this.forName(clazz,loader)?true:false;		
		return JS.hasOwnProperty(clazz, '$class');
	},
	/**
	 * Returns true if the test object is a instance of the class, false otherwise.
	 * 
	 * @method isInstanceOf
	 * @static
	 * @param {Object} obj
	 * @param {String|JS.Class} clazz
	 * @param {JS.Loader} loader:optional
	 * @return {Boolean}
	 */
	isInstanceOf: function(obj, clazz, loader){
		if(!obj || !clazz) return false;
		
		var cls = clazz;
		if(JS.isString(clazz)){
			var clsCtor = JS.ns(clazz, loader);
			cls = clsCtor?clsCtor.$class:null;
		}
		
		return obj.getClass()===cls;
	}
});

JS.ClassBuilder = {
	_extend: function(subc, superc) {
	    var F = function() {};
        F.prototype = superc.prototype;
        subc.prototype = new F();
        subc.prototype.constructor = subc;
        subc.superclass = superc.prototype;
        if (superc != Object && superc.prototype.constructor == Object.prototype.constructor) {
            superc.prototype.constructor = superc;
        }
	},
	_prehandleData: function(data){
		var rst = {
				'requires':[],
				'constructor':function(){},
				'extend':'JS.Object',
				'singleton':false,
				'statics':{},
				'mixins':[],
				'methods':{},
				'fields':{},
				'config':{}
				};
		
		for(key in data) {
			if(key=='requires'){
				rst[key] = Array.toArray(data[key])||[];
			}else if(key=='constructor'){
				rst[key] = data[key]||function(){};
			}else if(key=='extend'){
				rst[key] = data[key]||'JS.Object';
			}else if(key=='singleton'){
				rst[key] = data[key]||false;
			}else if(key=='statics'){
				rst[key] = data[key]||{};
			}else if(key=='mixins'){
				rst[key] = Array.toArray(data[key])||[];
			}else if(key=='config'){
				rst[key] = data[key]||{};
			}else if(JS.isFunction(data[key])){
				rst['methods'][key] = data[key];
			}else{
				rst['fields'][key] = data[key];
			}	
		}
		
		if(rst['singleton']){
			rst['statics'] = JS.mix(rst['statics'], rst['methods']);
			rst['statics'] = JS.mix(rst['statics'], rst['fields']);			
		}else{
			var config = rst['config'], configMethods = {};
			if(config){
				for(var k in config){
					var uName = this._upper(k);					
					configMethods['get'+uName] = this._getterFn(k);
					configMethods['set'+uName] = this._setterFn(k);
				}
			}		
			
			//mix all methods
			rst['methods'] = JS.mix(configMethods, rst['methods']);
		}
		
		return rst;
	},
	_upper: function(str){
		return str.substring(0,1).toUpperCase()+str.slice(1);
	},
	_initFields: function(fields, thisp){
		for(var k in fields){
			thisp[k] = fields[k];
		}
	},
	_initConfigFields: function(config, thisp){
		for(var k in config){
			thisp['_'+k] = config[k];
		}
	},
	_getterFn: function(key){
		return function(v){
			return this['_'+key];
		}
	},
	_setterFn: function(key){
		var me = this;
		
		return function(newV){			
			var methods = this.getClass().getMethods(),
				oldV = this['_'+key],
				isChanged = oldV===newV?false:true,
				upperKey = me._upper(key),		
				changingFn = methods['changing'+upperKey],
				changedFn = methods['changed'+upperKey],
				applyFn = methods['apply'+upperKey];
			
			if(isChanged && changingFn){
				changingFn.call(this, newV, oldV);
			}			
			
			if(applyFn){
				this['_'+key] = applyFn.call(this, newV, oldV);
			}else{
				this['_'+key] = newV;
			}			
			
			if(isChanged && changedFn){
				changedFn.call(this, this['_'+key], oldV);
			}	
		}
	},
	_mixs: function(classp, mixs, loader){
		for ( var i = 0; i < mixs.length; i++) {
			var ctor = loader.findClass(mixs[i]).getCtor();			
			JS.mix(classp.prototype, ctor.prototype);
		}
	},
	build: function(classInfo, data, loader){
		if(loader.hasClass(classInfo['className'])) return false;
		
		var depends = classInfo['depends'];
		for ( var i = 0; i < depends.length; i++) {
			if(!loader.hasClass(depends[i])) return false;
		}
		
		return this._build(classInfo, data, loader);
	},
	_build: function(classInfo, data, loader){
		var pkg = loader.ns(classInfo.packageName),
			sname = classInfo.simpleName,
		    fname = classInfo.className,
		    rst = this._prehandleData(data);
		
		var subc = null, superCtor = loader.findClass(rst['extend']).getCtor();
		if(rst['singleton']){
			pkg[sname] = {
				superclass: JS.Object.prototype	
			};
			subc = pkg[sname];
			JS.mix(subc, JS.Object.prototype);			
			// add statics
		    JS.mix(subc, rst['statics']);			
		}else{
			var me = this;
			pkg[sname] = function(){
				pkg[sname].superclass.constructor.apply(this, arguments);				
				
				me._initFields(rst['fields'], this);
				me._initConfigFields(rst['config'], this);
				rst['constructor'].apply(this, arguments);				
			}
			subc = pkg[sname];
			
			this._extend(subc, superCtor);
			this._mixs(subc, rst['mixins'], loader);
			// add methods
		    JS.mix(subc.prototype, rst['methods']);
		    // add statics
		    JS.mix(subc, rst['statics']);		    
		}
		//new class
		classInfo['config'] = rst['config'];
		loader.newClass(classInfo);
		
		return true;
	}
}

})();