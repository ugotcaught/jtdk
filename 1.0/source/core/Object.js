/**
 * @project JSDK JavaScript Development Kit
 * @copyright Copyright(c) 2004-2012, Dragonfly.org. All rights reserved.
 * @license LGPLv3
 * @website http://jsdk2.sourceforge.net/website/index.html
 * 
 * @version 1.0.0
 * @author feng.chun
 * @date 2012-11-21
 * 
 * @requires /core/JS-base.js
 */
(function() {
/**
 * @class JS.Object
 * @constructor
 */
JS.Object = function(){
	/**
	 * @field {String} $className 
	 */
	this.$className = 'JS.Object';
	/**
	 * @field {String} $classLoader 
	 */
	this.$classLoader = JS.BootLoader;
};

JS.mix(JS.Object.prototype, {
	/**
	 * Returns the self class.
	 * 
	 * @method getClass
	 * @return {JS.Class}
	 */
	getClass: function(){
		return this.$classLoader.findClass(this.$className);
	},
	/**
	 * Returns the super class.
	 * 
	 * @method getSuperClass
	 * @return {JS.Class}
	 */
	getSuperClass: function(){
		return this.getClass().getSuperClass();	
	}
});

})();