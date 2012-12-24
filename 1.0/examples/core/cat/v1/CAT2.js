JS.define('my.CAT2',{
	singleton: true,
	color: 'Black',	
	getColor: function(){
		return this.color;
	},
	statics: {
    	TYPE:'2'
    },
    mixins:['my.Sleep']
});

