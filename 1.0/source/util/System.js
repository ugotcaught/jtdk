(function() {
var OSNAMES = {
    ios: 'iOS',
    android: 'Android',
    webos: 'webOS',
    blackberry: 'BlackBerry',
    rimTablet: 'RIMTablet',
    mac: 'MacOSX',
    win: 'Windows',
    linux: 'Linux',
    bada: 'Bada',
    other: 'Other'
};
var OSREGS = {
    ios: 'i(?:Pad|Phone|Pod)(?:.*)CPU(?: iPhone)? OS ',
    android: '(Android |HTC_|Silk/)', 
    blackberry: 'BlackBerry(?:.*)Version\/',
    rimTablet: 'RIM Tablet OS ',
    webos: '(?:webOS|hpwOS)\/',
    bada: 'Bada\/'
};
var BSNAMES = {
    ie: 'IE',
    firefox: 'Firefox',
    chrome: 'Chrome',
    opera: 'Opera',
    safari: 'Safari'
};
var BSREGS = {
    ie: /msie ([\d.]+)/,
    firefox: /firefox\/([\d.]+)/,
    chrome: /chrome\/([\d.]+)/,
    opera: /opera.([\d.]+)/,
    safari: /version\/([\d.]+).*safari/
};

var dot = function(s){
	return s.replace(/_/g,'.');
}
var numberify = function(s) {//convert '1.2.3.4' to 1.234 
	if(!s) return 0;
	
    var c = 0;
    return parseFloat(s.replace(/\./g, function () {
        return (c++ === 0) ? '.' : '';
    }));
}

JS.define('JS.util.System', {
	singleton:true,
	
	ua: null,
	os: null,
	browser: null,
	device: null,
	locale: null,
	orient: 'portrait',
	
	constructor: function(){
		var UA = navigator.userAgent
		, ua = UA.toLowerCase()
		, osname = null, osversion = 0
		, deviceName = null, isMobile = false;
		
		for (i in OSREGS) {
            if (OSREGS.hasOwnProperty(i)) {
                var prefix = OSREGS[i];
                var match = UA.match(new RegExp('(?:'+prefix+')([^\\s;]+)'));
                
                if (match) {
                    osname = OSNAMES[i];
                    if(osname=='iOS') {
                    	deviceName = 'i'+match[1];
                    	isMobile = true;
                    }

                    // This is here because some HTC android devices show an OSX Snow Leopard userAgent by default.
                    // And the Kindle Fire doesn't have any indicator of Android as the OS in its User Agent
                    osversion = dot((match[1] && (match[1] == "HTC_" || match[1] == "Silk/"))?'2.3':match[match.length - 1]);
                    break;
                }
            }
        }
		
		if (!osname) {
			var osname = OSNAMES[(ua.match(/mac|win|linux/) || ['other'])[0]];
            
            if(osname=='Windows'){
            	var m = ua.match(/(nt|phone\sos)\s(\d.\d)/);
            	if(m) {
            		osversion = m[m.length - 1];
            		if(m[m.length - 2]=='phone os') {
            			isMobile = true;
            		}
            	}
            }else if(osname=='MacOSX'){
            	var m = ua.match(/mac\sos\sx\s(\d+_\d+_\d+|\d+_\d+)/);
            	if(m) osversion = dot(m[m.length - 1]);
            }
        }		
		this.os = {name:osname, version:osversion, numberVersion:numberify(osversion)};
		
		var bsname = null, bsversion = 0;
		for (i in BSREGS) {
            if (BSREGS.hasOwnProperty(i)) {
                var match = ua.match(new RegExp(BSREGS[i]));
                
                if (match) {
                    bsname = BSNAMES[i];
                    bsversion = match[match.length - 1];
                    break;
                }
            }
        }		
		this.browser = {name:bsname, version:bsversion, numberVersion:numberify(bsversion)};	
		this.ua = ua;
		
		//locale
		var locale = (navigator.language || navigator.browserLanguage).toLowerCase()
		, language = 'en', country = '';
		if(locale) {
			var match = locale.match(/([A-Za-z]+)(-([A-Za-z]+))*/);
			if(match){
				language = match[1];
				country = match[match.length-1];
			}
		}	
		this.locale = {language:language,country:country,localString:locale};
		
		//device
		if(!deviceName){
			if(ua.match(/mobile|mobi\//)) isMobile = true;
		}
		this.device = {name: deviceName, isMobile: isMobile, width: screen.width, height: screen.height};
		
		//orientation
		if('orientation' in window){
			if(Math.abs(window.orientation)==90) {
				this.orient = osname=='iOS'?'landscape':'portrait';				
			}else{
				this.orient = osname=='iOS'?'portrait':'landscape';
			}
		}else{//todo:compare screen's width and height
			
		}
	}
	
})

})();