JS.define('my.Sleepable',{
	requires:'JS.util.Random',
	sleep: function(){
		return this.getColor()+'...'+JS.util.Random.randomColor();
	}
});

