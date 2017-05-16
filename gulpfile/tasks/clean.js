var config=require("../config.json");
var gulp=require("gulp");
var clean=require("gulp-clean"),
notify=require("gulp-notify");
var cleantask=function(){
	gulp.src(config.tasks.clean.src,{read:false})
		.pipe(clean({force: true}))
		.pipe(notify("clean is ok"));
}
gulp.task('clean',cleantask);
module.exports=cleantask;