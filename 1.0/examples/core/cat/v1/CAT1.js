JS.define('my.CAT1',{
	constructor: function(color, age){
		this.setColor(color);
		this.setAge(age);
	},
	fields: {
		color: 'unknown',
		get$name: 'CAT1',
		age: 0
	},
	eat: function(v){
		alert(v)
	},
	statics: {
    	TYPE:'1'
    },
	extend: 'my.Sleep',
	changingColor: function(oldValue, newValue){
		alert('Fires on color changing:\noldValue is:'+oldValue+'\nnewValue is:'+newValue+'\ncurrentValue is:'+this.getColor());	
	},
	changedColor: function(oldValue, newValue){
		alert('Fires on color changed:\noldValue is:'+oldValue+'\nnewValue is:'+newValue+'\ncurrentValue is:'+this.getColor());					
	},
	applyColor: function(oldValue, newValue){
		return confirm('Are you sure to change color from "' + oldValue + '" to "' + newValue + '"?')? newValue : oldValue;		
	}
});