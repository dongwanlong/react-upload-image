var config=require("../config.json");
var gulp=require("gulp");

var cssmini=require("gulp-minify-css"),
rev=require("gulp-rev"),
revcollector=require("gulp-rev-collector"),
notify=require("gulp-notify"),
concat=require("gulp-concat"),
path=require("path");

var csstask=function(mode){
	var root=config.root.src,
		staticpath=root+"/"+config.tasks.css.staticsrc,
		concatpath=root+"/"+config.tasks.css.concatsrc,
		md5path=root+"/"+config.tasks.css.md5src;
	var revpath=config.root.rev;
	var modeconfig=config.mode[mode];
	gulp.src(staticpath)
		.pipe(cssmini())
		.pipe(rev())
		.pipe(gulp.dest(modeconfig+config.tasks.css.staticdest))
		.pipe(rev.manifest({path:'staticcss.json'}))
		.pipe(gulp.dest(revpath))
		.pipe(notify("static css is ok"));
	gulp.src(md5path)
		.pipe(cssmini())
		.pipe(rev())
		.pipe(gulp.dest(modeconfig+config.tasks.css.md5dest))
		.pipe(rev.manifest({path:'md5css.json'}))
		.pipe(gulp.dest(revpath))
		.pipe(notify("console md5css css is ok"));
	gulp.src(concatpath)
		.pipe(cssmini())
		.pipe(concat('vendor.css'))
		.pipe(cssmini())
		.pipe(rev())
		.pipe(gulp.dest(modeconfig+config.tasks.css.concatdest))
		.pipe(rev.manifest({path:'concatcss.json'}))
		.pipe(gulp.dest(revpath))
		.pipe(notify("console concatcss css is ok"));
}

gulp.task('css',csstask);
module.exports=csstask;
