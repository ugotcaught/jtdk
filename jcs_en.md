# Javascript Class Specification 
>version: 1.0

>author: Feng.Chun

>update: 2013-1-7


##Define Class
1.The class name SHOULD be defined as follows: 
```html
projectName.[packageName.]SimpleName
```

2.Each class SHOULD be saved as a unique file：
```html
projectDir/[packgeName/]SimpleName.js
```

3.Each class SHOULD use the following code to define:

```javascript
    JS.define("projectName.[packageName.]SimpleName", {
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

4."JS.Object" is the root class of all classes.

  
##Load Class
Class files can be loaded synchronously or asynchronously.
When loading asynchronously, SHOULD using the following code:

```javascript
    JS.setPath({
   		"projectName": "/projectDir"
    });
    JS.require(["projectName.[packageName.]SimpleName", ..], function{
        //console.log(this===JS.ClassLoader)
        //console.log(this.create("projectName.[packageName.]SimpleName", ..))
    });
```

When not specified the class loader,  the JS framework SHOULD use the default class loader (JS.ClassLoader) load all classes asynchronously. Also ALLOWS define a custom class loader to load a package, as follows:
   
```javascript
    var loader = new JS.Loader({id:'loaderID',paths:{"projectName": "/projectDir"}});
	JS.require(["projectName.[packageName.]SimpleName", ..], function{
    	//console.log(this===loader)
        //console.log(this.create("projectName.[packageName.]SimpleName", ..))
    }, loader);
```

Any custom class loader MUST be an instance of "JS.Loader". If you do not specify parent loader for a custom Loader, the framework MUST automatically specified JS.ClassLoader as the parent loader. Any class loader can be found by its ID as follows:
   
```javascript
	var loader = JS.Loader.getLoader("loaderID");
```

###Multi-version library loading
JS framework SHOULD use multi Class-Loader to loading  multi-version of class library.
For example, define two Loader, to load two versions of the "test" class library respectively:

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

##Class Instance Creation
SHOULD use the following method to create an instance of a class, the premise is the class file was loaded successful.

Loading synchronously

```javascript
	JS.create("projectName.[packageName.]SimpleName", ..) ;
```

Loading asynchronously

```javascript
	JS.require(["projectName.[packageName.]SimpleName", ..], function{
    	this.create("projectName.[packageName.]SimpleName", ..) ;
    });
```

##Class Object Reference

Loading synchronously

```javascript
	var classObject = JS.ns("projectName.[packageName.]SimpleName");
```
Loading asynchronously

```javascript
	JS.require(["projectName.[packageName.]SimpleName", ..], function{
    	var classObject = this.ns("projectName.[packageName.]SimpleName");
    });
```

##Class Reflection
A variety of methods to get its “JS.Class” instance:
```javascript
    var clazz = JS.Class.forName("projectName.[packageName.]SimpleName"); //by the class name
    var clazz = classObject.$class; //by the class object
    var clazz = classInstance.getClass(); //by a class instance
```

Obtain more information on a class by its "JS.Class" instance:
```javascript
	console.log(clazz.getLoader());
	console.log(clazz.getName());
	console.log(clazz.getPackageName());
	console.log(clazz.getSimpleName());
	console.log(clazz.getSuperName());
	console.log(clazz.getCtor());
	console.log(clazz.getSuperClass());
```

Create a instance of the class reflectively:
```javascript
   var instance = clazz.newInstance(...);
   clazz.invokeMethod(instance, 'method', ...); //equals: instance.method(...);
   clazz.setFieldValue(instance, 'field', ...); //equals: instance.setField(...);
```




