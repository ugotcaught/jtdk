JS.define('my.CAT1',{
	extend: 'my.Sleep',
	requires:'JS.util.Random',
	constructor: function(color, age){
		this.setColor(color);
		this.age = age;
	},
	age: 0,
	getAge: function(){return this.age;},
	config: {
		color: 'unknown',
		name: 'CAT1'
	},
	statics: {
    	Version: '1.0'
    },
    changingColor: function(newValue, oldValue){
		JS.print('Color changing-> oldValue is:'+oldValue+' newValue is:'+newValue+' currentValue is:'+this.getColor());	
	},
	changedColor: function(newValue, oldValue){
		JS.print('Color changed-> oldValue is:'+oldValue+' newValue is:'+newValue+' currentValue is:'+this.getColor());					
	},
	applyColor: function(newValue, oldValue){
		var R = this.ns('JS.util.Random'), rColor = R.randomColor();
		JS.print('Color apply-> oldValue is:'+oldValue+' newValue is:'+newValue+' applyValue is a random:'+rColor);		
		return rColor;		
	}
});