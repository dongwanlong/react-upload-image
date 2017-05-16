var config=require("../config.json");
var gulp=require("gulp");
var runSequence=require("run-sequence");
var argv = require('yargs').argv;
var css=require("../tasks/css.js")
js=require("../tasks/js.js"),

gulp.task('buildmode', function(done) {
	var evr = argv.p || !argv.t; //生产环境为true，测试环境为false，默认为true
	var src=['src/download/**/*','src/fonts/**/*','src/images/**/*','src/stylesheets/home/img/**/*','src/javascripts/dist/**/*','src/javascripts/vendor/**/*'];
	if(evr){//true for production
		gulp.src(src,{base:'./src'})
        	.pipe(gulp.dest(config.mode.production));
		css("production");
		js("production");
	}else{
		gulp.src(src,{base:'./src'})
        	.pipe(gulp.dest(config.mode.test));
		css("test");
		js("test");
	}
	// gulp.src(src,{base:'./src'})
 //        .pipe(gulp.dest('build/production/'));
 //    runSequence(
 //        ['css','js'],
 //        'rev',
 //    done);
});
gulp.task('build', ['buildmode','apps-build']); 
// gulp.task('build', ['buildmode']); 