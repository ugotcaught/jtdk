JS.setPackage({
	'Blackbird.*': 'Blackbird.Logger'
});
JS.define('Blackbird.Logger', {
	requires: [
	    'css://Blackbird/blackbird-min.css',
	    'js://Blackbird/blackbird.js'
	],
	constructor: function(){
		log.setup();
	},
	singleton: true,
	/**
	 * Hide or show.
	 * @method toggle
	 */
	toggle:function(){
		log.toggle();
	},
	/**
	 * Print the info message.
	 * @method info
	 * @param {String} msg
	 */
	info: function(msg){
		log.info(msg);
	}
});