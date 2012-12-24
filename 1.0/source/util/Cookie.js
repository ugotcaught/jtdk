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
JS.define('JS.util.Cookie', {
	singleton:true,
	
	NAME_SPACE: '',
	EXPIRES_DATETIME: 'Wed, 15 Apr 2099 00:00:00 GMT',
	/**
	 * Write to cookie.
	 * 
	 * @method write
	 * @param {String} key
	 * @param {String|Number} value
	 * @param {String} path:optional
	 * @param {Date} expires:optional
	 */
	write: function(key, value, path, expires){
		if(!key) return;
		var p =  path? path : '/' ; 
		var exp = expires?expires.toGMTString():this.EXPIRES_DATETIME;
		document.cookie = this.NAME_SPACE + key + '=' + escape(''+value) + '; path=' +p+ '; expires=' + exp;
	},
	/**
	 * Read the value of the key.
	 * 
	 * @method read
	 * @param {String} key
	 * @return {String}
	 */
	read: function(key){
		var reg = new RegExp("(^| )" + this.NAME_SPACE + key+"=([^;]*)(;|$)","gi");
			var data = reg.exec(document.cookie);
		return data?unescape(data[2]):null;
	},
	/**
	 * Clear the value of the key.
	 * 
	 * @method clear
	 * @param {String} key
	 */
	clear: function(key){
		this.write(key, '');
	}	
})