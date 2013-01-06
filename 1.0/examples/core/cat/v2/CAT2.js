JS.define('my.CAT2',{
	singleton: true,
	color: 'Black',	
	getColor: function(){
		return this.color;
	},
	statics: {
		Version: '2.0'
    },
    mixins:['my.Sleep']
});

