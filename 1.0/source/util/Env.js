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
var OSPREFIXES = {
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

var numberify = function(s) {// convert '1.2.3.4' or '1_2_3_4' to 1.234 
    var c = 0;
    s = s.replace(/_/g,'.');
    return parseFloat(s.replace(/\./g, function () {
        return (c++ === 0) ? '.' : '';
    }));
}

JS.define('JS.util.Env', {
	singleton:true,
	
	os: null,
	browser: null,
	
	constructor: function(){
		var UA = navigator.userAgent, ua = UA.toLowerCase()
		, osname = null, osversion = 0;
		
		for (i in OSPREFIXES) {
            if (OSPREFIXES.hasOwnProperty(i)) {
                var prefix = OSPREFIXES[i];
                var match = UA.match(new RegExp('(?:'+prefix+')([^\\s;]+)'));
                
                if (match) {
                    osname = OSNAMES[i];

                    // This is here because some HTC android devices show an OSX Snow Leopard userAgent by default.
                    // And the Kindle Fire doesn't have any indicator of Android as the OS in its User Agent
                    osversion = numberify((match[1] && (match[1] == "HTC_" || match[1] == "Silk/"))?'2.3':match[match.length - 1]);
                    break;
                }
            }
        }
		
		if (!osname) {
			var lowUA = ua;
            osname = OSNAMES[(ua.match(/mac|win|linux/) || ['other'])[0]];
            
            if(osname=='Windows'){
            	var m = ua.match(/nt\s(\d.\d);/);
            	if(m) osversion = numberify(m[m.length - 1]);
            }else if(osname=='MacOSX'){
            	var m = ua.match(/mac\sos\sx\s(\d+_\d+_\d+|\d+_\d+)/);
            	if(m) osversion = numberify(m[m.length - 1]);
            }
        }		
		this.os = {name:osname, version:osversion};
		
		var bsname = null, bsversion = 0;
		for (i in BSREGS) {
            if (BSREGS.hasOwnProperty(i)) {
                var match = UA.match(new RegExp(BSREGS[i]));
                
                if (match) {
                    bsname = BSNAMES[i];
                    bsversion = match[match.length - 1];
                    break;
                }
            }
        }		
		this.browser = {name:bsname, version:bsversion};		
	}
	
})

})();