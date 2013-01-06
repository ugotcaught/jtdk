JS.define('my.CAT1',{
	extend: 'my.Sleep',
	requires:'JS.util.Random',
	constructor: function(color, age){
		this.setColor(color);
		this.setAge(age);
	},
	fields: {
		color: 'unknown',
		get$name: 'CAT1',
		age: 0
	},
	statics: {
    	Version: '1.0'
    },
    changingColor: function(oldValue, newValue){
		JS.log('Color changing-> oldValue is:'+oldValue+' newValue is:'+newValue+' currentValue is:'+this.getColor());	
	},
	changedColor: function(oldValue, newValue){
		JS.log('Color changed-> oldValue is:'+oldValue+' newValue is:'+newValue+' currentValue is:'+this.getColor());					
	},
	applyColor: function(oldValue, newValue){
		var R = this.ns('JS.util.Random'), rColor = R.randomColor();
		JS.log('Color apply-> oldValue is:'+oldValue+' newValue is:'+newValue+' applyValue is a random:'+rColor);		
		return rColor;		
	}
});