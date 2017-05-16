var config=require("../config.json");
var gulp=require("gulp");

var copytask=function(){
	return gulp.src(config.tasks.copy.src,{base:'./src'})
                .pipe(gulp.dest(config.tasks.copy.dest));
}
gulp.task("copy",copytask);
module.exports=copytask;