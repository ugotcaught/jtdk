JS.define('my.Sleepable',{
	sleep: function(){
		var clazz = this.getClass(),
			className = clazz.getName(),
			version = clazz.getCtor().Version;
		
		return 'This is ' + className + '#' + version + ' sleeping....';
	}
});

