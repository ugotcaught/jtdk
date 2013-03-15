/**
 * @project JSDK JavaScript Development Kit
 * @copyright Copyright(c) 2004-2012, Dragonfly.org. All rights reserved.
 * @license LGPLv3
 * 
 * @version 1.0.0
 * @author feng.chun
 * @date 2012-12-19
 * 
 * @version 0.1
 * @author feng.chun
 * @date 2007-8-30
 */
JS.define('JS.util.Random', {
	singleton:true,
	
	/**
     * Returns a random id.
     * 
     * @method id
     * @return {String} The id value
     */
    id: function(){
    	var t = new Date().getTime();
    	return t+''+Math.floor(Math.random()*t);
    },
    /**
     * Returns a random number in [min,max).
     * 
     * @method number
     * @param {Number} min
     * @param {Number} max
     * @param {Boolean} isFloat:optional
     * @return {Number} The default is Integer
     */
    number: function(n, m, isFloat){
    		var x = Math.random()*(m-n)+n;
    		return isFloat?x:Math.floor(x);
    },
    /**
     * Returns a random item in a array.
     * 
     * @method select
     * @param {Array} array
     * @return {Object}
     */
    select: function(array){
    	if(array.length < 2) return array[0];    	
    	return array[this.number(0, array.length)];
    },
    /**
     * Returns a random True or False.
     * 
     * @method bool
     * @return {Boolean}
     */
    bool: function(){
    	return this.select([true, false]);
    },
    /**
     * Returns a random color RGB value.
     * 
     * @method color
     * @return {String}
     */
    color: function(){
    	var a = '0123456789abcdef'.split(''),c = [];
    	for ( var i=0; i < 6; ++i ) {
    		c.push(this.select(a));
    	}	
    	return '#'+c.join('');
    }	
});