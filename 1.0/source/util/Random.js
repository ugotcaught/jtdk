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
     * @method randomID
     * @return {String} The id value
     */
    randomID: function(){
    	var t = new Date().getTime();
    	return t+''+Math.floor(Math.random()*t);
    },
    /**
     * Returns a random number in [min,max).
     * 
     * @method random
     * @param {Number} min
     * @param {Number} max
     * @param {Boolean} isFloat:optional
     * @return {Number} The default is Integer
     */
    randomNumber: function(n, m, isFloat){
    		var x = Math.random()*(m-n)+n;
    		return isFloat?x:Math.floor(x);
    },
    /**
     * Returns a random item in a array.
     * 
     * @method randomEnum
     * @param {Array} array
     * @return {Object}
     */
    randomEnum: function(array){
    	if(!array || array.length<=0) return null;
    	if(array.length < 2) return array[0];
    	
    	return array[this.randomNumber(0, array.length)];
    },
    /**
     * Returns a random True or False.
     * 
     * @method randomBoolean
     * @return {Boolean}
     */
    randomBoolean: function(){
    	return this.randomEnum([true, false]);
    },
    /**
     * Returns a random color RGB value.
     * 
     * @method randomColor
     * @return {String}
     */
    randomColor: function(){
    	var a = '0123456789abcdef'.split('');
    	var c = [];
    	for ( var i=0; i < 6; ++i ) {
    		c.push(this.randomEnum(a));
    	}	
    	return '#'+c.join('');
    }
	
});