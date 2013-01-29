# Javascript Class Specification 
>version: 1.0

>author: Feng.Chun

>create: 2013-1-7
>update: 2013-1-29


##类的定义
-每个类名**应该**定义为：
```html
projectName.[packageName.]SimpleName
```

-每一个类**应该**保存为一个唯一的文件：
```html
projectDir/[packgeName/]SimpleName.js
```

-每个类**必须**使用如下代码来定义：

```javascript
    JS.define("projectName.[{packageName.]SimpleName", {
        singleton: true|false, //singleton or instance class
    	requires: [..], //need load classes before definition
	    extend: "", //only inherit one super class
	    mixins: [..], //allow inherit many classes's prototypes 
	    constructor: function(){//class system must first execute super class constructor
	  		...
	    },
	    config: {..}, //auto generate getter and setter methods
	    statics: {..}, //static fields and methods
	    "field_name": ..., //instance class's instance field or singleton class's static field
	    "method_name": function(){..} //instance class's instance method or singleton class's static method
    })
```

-JS.Object**必须**是所有类的根父类

  
##类的加载
-类文件可以直接同步方式加载，类文件还可以使用如下代码异步加载：

```javascript
    JS.setPath({
   		"projectName": "/projectDir"
    });
    JS.imports(["projectName.[packageName.]SimpleName", ..], function(){
        //console.log(this===JS.ClassLoader)
        //console.log(this.create("projectName.[packageName.]SimpleName", ..))
    });
```

当未指名类加载器，类系统**应该**使用一个缺省的类加载器(JS.ClassLoader)异步加载所有类。

-也允许自定义一个类加载加载某个package，如下：
   
```javascript
    var loader = new JS.Loader({id:'loaderID',paths:{"projectName": "/projectDir"}});
	JS.imports(["projectName.[packageName.]SimpleName", ..], function(){
    	//console.log(this===loader)
        //console.log(this.create("projectName.[packageName.]SimpleName", ..))
    }, loader);
```

还有一种简写法：
```javascript
    JS.imports(["projectName.[packageName.]SimpleName", ..], function(){
    	....
    }, {"projectName": "/projectDir"});//auto generate a loader with a random id
```

自定义的类加载器**必须**是JS.Loader的实例，如不指定父加载器，则类系统自动指定JS.ClassLoader为其父加载器。

-类加载器可以通过以下代码查找：
   
```javascript
	var loader = JS.Loader.getLoader("loaderID");
```

###多版本类库的加载
类系统**应该**使用多ClassLoader机制来解决类库的多版本同时加载与使用的问题。
先定义两个Loader，分别加载"test"类库的两个版本：

```javascript
	JS.imports(['test.CAT'], function(){
		var cat = this.create('test.CAT', ...);		
	}, {'test': '/v1/source'});
	
	JS.imports(['test.CAT'], function(){
		var cat = this.create('test.CAT', ...);
	}, {'test': '/v2/source'});
```

##类实例的创建
使用以下方式创建一个类实例，前提是类文件已经加载。

-同步加载时

```javascript
	JS.create("projectName.[packageName.]SimpleName", ..) ;
```

-异步加载时

```javascript
	JS.imports(["projectName.[packageName.]SimpleName", ..], function{
    	this.create("projectName.[packageName.]SimpleName", ..) ;
    });
```

##类对象的引用
-同步加载时

```javascript
	var classObject = JS.ns("projectName.[packageName.]SimpleName");
```
-异步加载时

```javascript
	JS.imports(["projectName.[packageName.]SimpleName", ..], function{
    	var classObject = this.ns("projectName.[packageName.]SimpleName");
    });
```

##类的反射
类系统**必须**每一个类对应生成一个JS.Class对象，该对象包含了类的关键信息：
```javascript
	console.log(clazz.getLoader());
	console.log(clazz.isSingleton());
	console.log(clazz.getName());
	console.log(clazz.getPackageName());
	console.log(clazz.getSimpleName());
	console.log(clazz.getSuperName());
	console.log(clazz.getCtor());
	console.log(clazz.getSuperClass());
	console.log(clazz.getStatics());
	console.log(clazz.getFields());
	console.log(clazz.getField());
	console.log(clazz.getMethods());
	console.log(clazz.getMethod());
	console.log(clazz.getConfig());
	console.log(clazz.getConfigProperty());
```

类系统**必须**使用以下方法来获取某个类的JS.Class类对象：
```javascript
    var clazz = JS.Class.forName("projectName.[packageName.]SimpleName"); //by class name
    var clazz = ClassObject.$class; //by class constructor function
    var clazz = classInstance.getClass(); //by a class instance
```

类系统**必须**允许以下方法反射式创建类实例：
```javascript
   var instance = clazz.newInstance('className', ...);
   clazz.invokeMethod(instance, 'method', ...); 
   clazz.setField(instance, 'field', ...); 
```




