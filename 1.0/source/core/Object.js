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
};

JS.mix(JS.Object.prototype, {
	/**
	 * Returns the self class.
	 * 
	 * @method getClass
	 * @return {JS.Class}
	 */
	getClass: function(){
		return JS.Object.$class;
	},
	/**
	 * Returns the super class.
	 * 
	 * @method getSuperClass
	 * @return {JS.Class}
	 */
	getSuperClass: function(){
		return this.getClass().getSuperClass();	
	},
	/**
	 * Returns the name of class or package.
	 * 
	 * @method ns
	 * @param {String} name
	 * @return {Object}
	 */
	ns: function(name){
		return this.getClass().getLoader().ns(name);	
	}
});

})();