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
    	Version: '2.0'
    }
});