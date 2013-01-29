/**
 * @project JSDK JavaScript Development Kit
 * @copyright Copyright(c) 2004-2012, Dragonfly.org. All rights reserved.
 * @license LGPLv3
 * 
 * @version 1.0.0
 * @author feng.chun
 * @date 2012-12-19
 */
JS.define('JS.util.ResourceBundle', {
	constructor: function(data, lang, country){
		this.data = data;
		this.lang = lang;
		this.country = country;		
	},
	/**
	 * @field {Object} data
	 */
	data:null,
	/**
	 * @field {String} lang
	 */
	lang:'en',
	/**
	 * @field {String} country
	 */
	country:null,
	statics: {
		/**
		 * @method load
		 * @static
		 * @param {String} name
		 * @param {String} lang
		 * @param {String} country
		 * @return {JS.util.ResourceBundle} 
		 */
		load: function(name, lang, country){
			var locale = (lang||'') + '_' + (country||''),
				url = name + (locale?'_'+locale:'')+'.json';
			
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
                throw new Error('Load bundle file<'+url+'> failed');
            }
            status = (xhr.status === 1223) ? 204 : xhr.status;

            var obj = null;
            if (status === 0 || (status >= 200 && status < 300)) {
                obj = JS.create('JS.util.ResourceBundle', eval('('+xhr.responseText+')'), lang, country);
            }

            // Maybe IE memory leak
            xhr = null;
            return obj;
		}
	},
	/**
	 * @method getValue
	 * @param {String} key
	 * @return {Object} 
	 */
	getValue: function(key){
		return this.data?this.data[key]:null;
	}
})