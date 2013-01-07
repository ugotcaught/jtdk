# Javascript Class Specification 
>version: 1.0

>author: Feng.Chun

>update: 2013-1-7


##类的定义
1.类名应该定义为：projectName.[packageName.]SimpleName

2.类应该保存为一个唯一的文件：projectDir/[packgeName/]SimpleName.js

3.类应该使用如下代码来定义：

```javascript
    JS.define("projectName.[{packageName.]SimpleName", {
    	    requires: [..], //need load classes before definition
	    extend: "", //only inherit one class
	    mixins: [..], //allow inherit many classes's prototypes 
	    constructor: function(){
	  		...
	    },
	    fields: {..}, //auto generate getter and setter methods
	    statics: {..},
	    "unknown_method": function(){..}
    })
```

4.JS.Object是所有类的根父类

  
##类的加载
类文件可以直接同步方式加载，类文件还可以使用如下代码异步加载：

```javascript
    JS.setPath({
   		"projectName": "/projectDir"
    });
    JS.require(["projectName.[packageName.]SimpleName", ..], function{
        //console.log(this===JS.ClassLoader)
        //console.log(this.create("projectName.[packageName.]SimpleName", ..))
    });
```

当未指名类加载器，JS框架应使用一个缺省的类加载器(JS.ClassLoader)异步加载所有类。

也允许自定义一个类加载加载某个package，如下：
   
```javascript
    var loader = new JS.Loader({id:'loaderID',paths:{"projectName": "/projectDir"}});
	JS.require(["projectName.[packageName.]SimpleName", ..], function{
    	//console.log(this===loader)
        //console.log(this.create("projectName.[packageName.]SimpleName", ..))
    }, loader);
```

自定义的类加载器必须是JS.Loader的实例，如不指定父加载器，则框架自动指定JS.ClassLoader为其父加载器。

类加载器可以通过以下代码查找：
   
```javascript
	var loader = JS.Loader.getLoader("loaderID");
```

###多版本类库的加载
JS框架应使用多ClassLoader机制来解决类库的多版本同时加载与使用的问题。
先定义两个Loader，分别加载"test"类库的两个版本：

```javascript
var loader1 = new JS.Loader({id:'loader1',paths:{'test': '/v1/source'}});
var loader2 = new JS.Loader({id:'loader2',paths:{'test': '/v2/source'}});

	JS.require(['test.CAT'], function(){
		var cat = this.create('test.CAT', ...);		
	}, loader1);
	
	JS.require(['test.CAT'], function(){
		var cat = this.create('test.CAT', ...);
	}, loader2);
```

##类实例的创建
使用以下方式创建一个类实例，前提是类文件已经加载。

同步加载时

```javascript
	JS.create("projectName.[packageName.]SimpleName", ..) ;
```

异步加载时

```javascript
	JS.require(["projectName.[packageName.]SimpleName", ..], function{
    	this.create("projectName.[packageName.]SimpleName", ..) ;
    });
```

##类对象的引用
同步加载时

```javascript
	var classObject = JS.ns("projectName.[packageName.]SimpleName");
```
异步加载时

```javascript
	JS.require(["projectName.[packageName.]SimpleName", ..], function{
    	var classObject = this.ns("projectName.[packageName.]SimpleName");
    });
```

##类的反射
各种方法获取其JS.Class类对象：
```javascript
    var clazz = JS.Class.forName("projectName.[packageName.]SimpleName"); //从类名获取其Class对象
    var clazz = classObject.$class; //从类对象获取其Class对象
    var clazz = classInstance.getClass(); //从类实例获取其Class类对象
```

通过JS.Class对象获取类的更多信息：
```javascript
	console.log(clazz.getLoader());
	console.log(clazz.getName());
	console.log(clazz.getPackageName());
	console.log(clazz.getSimpleName());
	console.log(clazz.getSuperName());
	console.log(clazz.getCtor());
	console.log(clazz.getSuperClass());
```

反射式生成类实例
```javascript
   var instance = clazz.newInstance(...);
   clazz.invokeMethod(instance, 'method', ...); //equals: instance.method(...);
   clazz.setFieldValue(instance, 'field', ...); //equals: instance.setField(...);
```




