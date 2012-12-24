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
		this._data = data;
		this._lang = lang;
		this._country = country;		
	},
	fields: {
		/**
		 * @method getData
		 * @return {Object} 
		 */
		get$data:null,
		/**
		 * @method getLang
		 * @return {String} 
		 */
		get$lang:'en',
		/**
		 * @method getCountry
		 * @return {String} 
		 */
		get$country:null
	},
	statics: {
		/**
		 * @method create
		 * @static
		 * @param {String} name
		 * @param {String} lang
		 * @param {String} country
		 * @return {JS.util.ResourceBundle} 
		 */
		create: function(name, lang, country){
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
                obj = new JS.util.ResourceBundle(eval('('+xhr.responseText+')'), lang, country);
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
		return this.getData()[key];
	}
})