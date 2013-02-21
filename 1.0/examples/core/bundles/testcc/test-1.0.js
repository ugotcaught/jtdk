JS.setPackage({
	'test.*':['test.base.*','test.ext.*'],
	'test.base.*':['test.base.C1','test.base.C2'],
	'test.ext.*':[
	      'test.ext.C3',
	      'test.ext.C4',
	      'test.ext.C5',
	      'test.ext.C6']
});
JS.define('test.base.C1',{
	method: function(){
		return 'C1\'s method';
	}
});
JS.define('test.base.C2',{
	method: function(){
		return 'C2\'s method';
	}
});
JS.define('test.ext.C4',{
	extend: 'test.base.C1',
	requires: 'test.base.C2'
});
JS.define('test.ext.C6',{
	extend: 'test.ext.C4'
});
JS.define('test.ext.C3',{
	extend: 'test.base.C2',
	mixins: 'test.ext.C6',
	method: function(){
		return 'C3\'s method';
	}
});
JS.define('test.ext.C5',{
	requires: ['test.ext.C4','test.ext.C3'],
	method: function(){
		return 'C5\'s method';
	}
});