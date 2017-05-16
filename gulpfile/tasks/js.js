var config=require("../config.json");
var gulp=require("gulp");

var uglify=require("gulp-uglify"),
rev=require("gulp-rev"),
revcollector=require("gulp-rev-collector"),
notify=require("gulp-notify");

var jstask=function(mode){
	var root=config.root.src,
		staticpath=root+"/"+config.tasks.js.staticsrc,
		pagepath=root+"/"+config.tasks.js.pagesrc;
	var revpath=config.root.rev;
	var modeconfig=config.mode[mode];
	gulp.src(staticpath)
		.pipe(uglify())
		.pipe(rev())
		.pipe(gulp.dest(modeconfig+config.tasks.js.staticdest))
		.pipe(rev.manifest({path:'staticjs.json'}))
		.pipe(gulp.dest(revpath))
		.pipe(notify("staticjs is ok"));
	gulp.src(pagepath)
		.pipe(uglify())
		.pipe(rev())
		.pipe(gulp.dest(modeconfig+config.tasks.js.pagedest))
		.pipe(rev.manifest({path:'pagejs.json'}))
		.pipe(gulp.dest(revpath))
		.pipe(notify("pagejs is ok"));	
}

gulp.task('js',jstask);
module.exports=jstask;
