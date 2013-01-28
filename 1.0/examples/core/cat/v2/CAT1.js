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
    	Version: '2.0'
    }
});