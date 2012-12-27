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
(function() {

var RULES = {
	full_numbers: /^\d+$/,
	full_letters: /^[A-Za-z]+$/,
	letters_or_numbers: /^[A-Za-z\d]+$/,
	date: /^(\d{2,4})(-|\/)(\d{1,2})(-|\/)(\d{1,2})$/,
	time: /^(\d{1,2}):(\d{1,2}):(\d{1,2})(\.\d{1,3})*Z*$/,
	email: /^\w+(((-|&)\w*)|(\.\w+))*\@[A-Za-z0-9]+((\-)[A-Za-z0-9]*|(\.)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/,
	email_domain: /^@[A-Za-z0-9]+((\-)[A-Za-z0-9]*|(\.)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/,
	ip: /^(([01]?[\d]{1,2})|(2[0-4][\d])|(25[0-5]))(\.(([01]?[\d]{1,2})|(2[0-4][\d])|(25[0-5]))){3}$/,	
	half_angle: /^[\u0000-\u00FF]+$/,
	entire_angle: /^[\u0391-\uFFE5]+$/
};

JS.define('JS.util.Validator', {
	singleton:true,
	/**
	 * @method is
	 * @param {String} rule
	 * @param {String} str
	 * @param {Boolean} emptyOK:optional True means return true when str is empty. The default value is false.
	 */
	is: function (rule, str, emptyOK){
		if(JS.isEmpty(str)) return emptyOK?true:false;		
		return new RegExp(rule).test(str);;
	},
	/**
	 * @method isFullNumbers
	 * @param {String} str
	 * @param {Boolean} emptyOK:optional True means return true when str is empty. The default value is false.
	 */
	isFullNumbers: function(s, emptyOK){
		return this.is(RULES['full_numbers'], s, emptyOK);
	},
	/**
	 * @method isFullLetters
	 * @param {String} str
	 * @param {Boolean} emptyOK:optional True means return true when str is empty. The default value is false.
	 */
	isFullLetters: function(s, emptyOK){
		return this.is(RULES['full_letters'], s, emptyOK);
	},
	/**
	 * @method isLettersOrNumbers
	 * @param {String} str
	 * @param {Boolean} emptyOK:optional True means return true when str is empty. The default value is false.
	 */
	isLettersOrNumbers: function(s, emptyOK){
		return this.is(RULES['letters_or_numbers'], s, emptyOK);
	},
	/**
	 * These formats are right:
	 * yy-mm-dd
	 * yy/mm/dd
	 * yyyy-mm-dd
	 * yyyy/mm/dd
	 * 
	 * @method isDate
	 * @param {String} str 
	 * @param {Boolean} emptyOK:optional True means return true when str is empty. The default value is false.
	 */
	isDate: function(s, emptyOK){
		if(JS.isEmpty(s)) return emptyOK?true:false;
		
		var reg = RULES['date'], result = s.match(reg);
	    if(!result || result[1].length==3){return false};
	    
	    var dt = new Date(result[1],result[3]-1,result[5]);
	    var year = dt.getFullYear()+'';
	    if(result[1].length <= 2){
	    	year = Number(year.slice(2));		    
	    }
	    if(Number(year)!=Number(result[1])) return false;   
	    if((dt.getMonth()+1)!=Number(result[3])) return false;   
	    if(dt.getDate()!=Number(result[5])) return false;
	    return true;		
	},
	/**
	 * These formats are right:
	 * hh:mm:ss
	 * hh:mm:ss.xxx
	 * hh:mm:ss.xxxZ
	 * 
	 * @method isTime
	 * @param {String} str 
	 * @param {Boolean} emptyOK:optional True means return true when str is empty. The default value is false.
	 */
	isTime: function(s, emptyOK){
		if(JS.isEmpty(s)) return emptyOK?true:false;
		
		var reg = RULES['time'], result = s.match(reg);
	    if(!result){return false};
	    
	    if(!result[4]) result[4] = '000';
	    if(result[4].startsWith('.')) result[4] = result[4].slice(1);
	    
	    var dt = new Date(1970,0,1,result[1],result[2],result[3],result[4]);
	    if(dt.getHours()!=Number(result[1])) return false;   
	    if(dt.getMinutes()!=Number(result[2])) return false;   
	    if(dt.getSeconds()!=Number(result[3])) return false;
	    if(dt.getMilliseconds()!=Number(result[4])) return false;
	    return true;
	},
	/**
	 * These formats are right:
	 * yyyy-mm-dd hh:mm:ss.xxxZ
	 * yyyy/mm/dd hh:mm:ss.xxxZ
	 * 
	 * @method isDateTime
	 * @param {String} str 
	 * @param {Boolean} emptyOK:optional True means return true when str is empty. The default value is false.
	 */
	isDateTime: function(s, emptyOK){
		if(JS.isEmpty(s)) return emptyOK?true:false;
		
		if(s.indexOf('T') > 0){
			var arr = s.split('T');
			return this.isDate(arr[0]) && this.isTime(arr[1]);
		}else if(s.indexOf(' ') > 0){
			var arr = s.split(' ');
			return this.isDate(arr[0]) && this.isTime(arr[1]);
		}
		
		return false;
	},
	/**
	 * @method isEmail
	 * @param {String} str 
	 * @param {Boolean} emptyOK:optional True means return true when str is empty. The default value is false.
	 */
	isEmail: function(s, emptyOK){
		return this.is(RULES['email'], s, emptyOK);
	},
	/**
	 * @method isEmailDomain
	 * @param {String} str 
	 * @param {Boolean} emptyOK:optional True means return true when str is empty. The default value is false.
	 */
	isEmailDomain: function(s, emptyOK){
		return this.is(RULES['email_domain'], s, emptyOK);
	},
	/**
	 * @method isIP
	 * @param {String} str xxx.xxx.xxx.xxx. "xxx" in [0,256].
	 * @param {Boolean} emptyOK:optional True means return true when str is empty. The default value is false.
	 */
	isIP: function(s, emptyOK){
		return this.is(RULES['ip'], s, emptyOK);
	},
	/**
	 * @method isHalfAngleAlphabet
	 * @param {String} str 
	 * @param {Boolean} emptyOK:optional True means return true when str is empty. The default value is false.
	 */
	isHalfAngleAlphabet: function(s, emptyOK){
		return this.is(RULES['half_angle'], s, emptyOK);
	},
	/**
	 * @method isEntireAngleAlphabet
	 * @param {String} str 
	 * @param {Boolean} emptyOK:optional True means return true when str is empty. The default value is false.
	 */
	isEntireAngleAlphabet: function(s, emptyOK){
		return this.is(RULES['entire_angle'], s, emptyOK);
	}
})

})();