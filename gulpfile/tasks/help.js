var gulp=require("gulp");
var helptask=function(){
	console.log("命令列表：")
	console.log("1. gulp clean : 清空dest下的目录文件");
	console.log("2. gulp copy : 拷贝project 到 工程下");
	console.log("3. gulp watch : 监听project变化，同步文件到工程下");
	console.log("4. gulp css: 压缩css");
	console.log("5. gulp js: 压缩js");
	console.log("6. gulp rev: 替换html，jsp文件中引用的引用文件。注：需先运行生成json文件的命令");
	console.log("7. gulp start: 集成命令序列，clean、copy、watch");
	console.log("8. gulp build: 集成命令序列，css、js");
	console.log("9. gulp build -p: 集成命令序列，css、js等，生产环境代码");
	console.log("10. gulp build -t: 集成命令序列，css、js等，测试环境代码");

	console.log("to be continuing...")
}
gulp.task("default",helptask);
module.exports=helptask;