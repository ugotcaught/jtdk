# Javascript Class Specification 
>version: 1.0

>author: Feng.Chun

>update: 2013-1-7

>update: 2013-1-29

##Define Class
- The class name **SHOULD** be defined as follows: 
```html
projectName.[packageName.]SimpleName
```

- Each class **SHOULD** be saved as a unique file：
```html
projectDir/[packgeName/]SimpleName.js
```

- Each class **MUST** use the following code to define:

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

- "JS.Object" **MUST** is the root class of all classes.

  
##Load Class
- Class files can be loaded synchronously or asynchronously.
When loading asynchronously, **SHOULD** using the following code:

```javascript
    JS.setPath({
   		"projectName": "/projectDir"
    });
    JS.imports(["projectName.[packageName.]SimpleName", ..], function{
        //console.log(this===JS.ClassLoader)
        //console.log(this.create("projectName.[packageName.]SimpleName", ..))
    });
```

When not specified the class loader,  Class-System **SHOULD** use the default class loader (JS.ClassLoader) load all classes asynchronously. 

- Also ALLOWS define a custom class loader to load a package, as follows:
   
```javascript
    var loader = new JS.Loader({id:'loaderID',paths:{"projectName": "/projectDir"}});
	JS.imports(["projectName.[packageName.]SimpleName", ..], function{
    	//console.log(this===loader)
        //console.log(this.create("projectName.[packageName.]SimpleName", ..))
    }, loader);
```

Any custom class loader **MUST** be an instance of "JS.Loader". If you do not specify parent loader for a custom Loader, Class-System **MUST** automatically specified JS.ClassLoader as the parent loader. 

- Any class loader can be found by its ID as follows:
   
```javascript
	var loader = JS.Loader.getLoader("loaderID");
```

###Multi-version library loading
Class-System **SHOULD** use multi Class-Loader to loading  multi-version of class library.
For example, define two Loader, to load two versions of the "test" class library respectively:

```javascript
var loader1 = new JS.Loader({id:'loader1',paths:{'test': '/v1/source'}});
var loader2 = new JS.Loader({id:'loader2',paths:{'test': '/v2/source'}});

	JS.imports(['test.CAT'], function(){
		var cat = this.create('test.CAT', ...);		
	}, loader1);
	
	JS.imports(['test.CAT'], function(){
		var cat = this.create('test.CAT', ...);
	}, loader2);
```

##Class Instance Creation
**MUST** use the following method to create an instance of a class, the premise is the class file was loaded successful.

- Loading synchronously

```javascript
	JS.create("projectName.[packageName.]SimpleName", ..) ;
```

- Loading asynchronously

```javascript
	JS.imports(["projectName.[packageName.]SimpleName", ..], function{
    	this.create("projectName.[packageName.]SimpleName", ..) ;
    });
```

##Class Object Reference

- Loading synchronously

```javascript
	var classObject = JS.ns("projectName.[packageName.]SimpleName");
```
- Loading asynchronously

```javascript
	JS.imports(["projectName.[packageName.]SimpleName", ..], function{
    	var classObject = this.ns("projectName.[packageName.]SimpleName");
    });
```

##Class Reflection
Class-System **MUST** generate a JS.Class object for each JS class when be defined and built, the object contains important informations about the class:
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

Class-System **MUST** allows these fellowing methods to get “JS.Class” instance about a class:
```javascript
    var clazz = JS.Class.forName("projectName.[packageName.]SimpleName"); //by class name
    var clazz = ClassObject.$class; //by class constructor function
    var clazz = classInstance.getClass(); //by a class instance
```

Class-System **MUST** allows create a instance of the class reflectively:
```javascript
   var instance = clazz.newInstance('className', ...);
   clazz.invokeMethod(instance, 'method', ...); 
   clazz.setField(instance, 'field', ...); 
```



