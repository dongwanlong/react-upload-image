var gulp=require("gulp");
var runSequence=require("run-sequence");
var starttask=function(done){
	runSequence(
        ['clean','copy','watch'],
    done);
}
gulp.task('start',starttask);
module.exports=starttask;