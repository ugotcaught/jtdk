# Javascript Class Specification 
## version: 1.0
## author: Feng.Chun
## update: 2013-1-7

类的定义
1. 类名应该定义为：projectName.[packageName.]SimpleName

2. 类应该保存为一个唯一的文件：projectDir/[packgeName/]SimpleName.js

3. 类应该使用如下代码来定义：
    JS.define("projectName.[{packageName.]SimpleName", {
    	requires: [..],
	    extend: [..],
	    mixins: [..],
	    constructor: function(){
	  		..
	    },
	    fields: {..},
	    statics: {..},
	    "unknown_method": function(){..}
    })

4. JS.Object是所有类的根父类


类的加载
1. 类文件可以直接同步方式加载: 在HTML页面中手动添加<script>标签。

2. 类文件还可以使用如下代码异步加载：
    JS.setPath({
   		"projectName": "/projectDir"
    });
    JS.require(["projectName.[packageName.]SimpleName", ..], function{
        //console.log(this===JS.ClassLoader)
        //console.log(this.create("projectName.[packageName.]SimpleName", ..))
    });

3. 当未指名类加载器，JS框架使用一个缺省的类加载器(JS.ClassLoader)异步加载所有类。也可以自定义一个类加载加载某个package，如下：
    var loader = new JS.Loader({id:'loaderID',paths:{"projectName": "/projectDir"}});
	JS.require(["projectName.[packageName.]SimpleName", ..], function{
    	//console.log(this===loader)
        //console.log(this.create("projectName.[packageName.]SimpleName", ..))
    }, loader);

 4. 自定义的类加载器必须是JS.Loader的实例，如不指定父加载器，则框架自动指定JS.ClassLoader为其父加载器。类加载器可以通过以下代码查找：
     var loader = JS.Loader.getLoader("loaderID");



类实例的创建
使用以下方式创建一个类实例，前提是类文件已经加载：
1. 同步加载时
	JS.create("projectName.[packageName.]SimpleName", ..) ;

1. 异步加载时
	JS.require(["projectName.[packageName.]SimpleName", ..], function{
    	this.create("projectName.[packageName.]SimpleName", ..) ;
    });



类对象的引用
1. 同步加载时
	var classObject = JS.ns("projectName.[packageName.]SimpleName");

1. 异步加载时
	JS.require(["projectName.[packageName.]SimpleName", ..], function{
    	var classObject = this.ns("projectName.[packageName.]SimpleName");
    });


类的反射
1. 各种方法获取其JS.Class类对象：
    var clazz = JS.Class.forName("projectName.[packageName.]SimpleName"); //从类名获取其Class对象
    var clazz = classObject.$class; //从类对象获取其Class对象
    var clazz = classInstance.getClass(); //从类实例获取其Class类对象

2. 通过JS.Class对象获取类的更多信息：
	console.log(clazz.getLoader());
	console.log(clazz.getName());
	console.log(clazz.getPackageName());
	console.log(clazz.getSimpleName());
	console.log(clazz.getSuperName());
	console.log(clazz.getCtor());
	console.log(clazz.getSuperClass());

3. 反射式生成类实例
   var instance = clazz.newInstance(...);
   clazz.invokeMethod(instance, 'method', ...); //equals: instance.method(...);
   clazz.setFieldValue(instance, 'field', ...); //equals: instance.setField(...);




