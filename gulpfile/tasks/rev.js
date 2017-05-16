var config=require("../config.json");
var gulp=require("gulp");
var revcollector=require("gulp-rev-collector"),
notify=require("gulp-notify"),
replace=require("gulp-replace");
var argv = require('yargs').argv;
var revtask=function(){
	var modeconfig='';
	var evr = argv.p || !argv.t; //生产环境为true，测试环境为false，默认为true
	if(evr){
		modeconfig=config.mode.production;
	}else{
		modeconfig=config.mode.test;
	}
	var staticpath=(config.tasks.rev.staticrev).concat(config.tasks.rev.staticsrc),
		pageinvite=(config.tasks.rev.pagerev).concat(config.tasks.rev.invitesrc),
		pagepay=(config.tasks.rev.pagerev).concat(config.tasks.rev.paysrc),
		vmrev=(config.tasks.rev.consolerev).concat(config.tasks.rev.vmsrc),
		dashboardrev=(config.tasks.rev.consolerev).concat(config.tasks.rev.dashboardsrc);
	gulp.src(staticpath)
		.pipe(revcollector({replaceReved:true}))
		.pipe(gulp.dest(modeconfig+config.tasks.rev.staticdest))
		.pipe(notify('static path replace is ok!'));
	gulp.src(pageinvite)
		.pipe(revcollector({replaceReved:true}))
		.pipe(gulp.dest(modeconfig+config.tasks.rev.invitedest))
		.pipe(notify('invite path replace is ok!'));
	gulp.src(pagepay)
		.pipe(revcollector({replaceReved:true}))
		.pipe(gulp.dest(modeconfig+config.tasks.rev.paydest))
		.pipe(notify('payment path replace is ok!'));
	var vmreplace=config.tasks.css.vmreplace;
	var vmreg=/(<link rel="stylesheet" href="\/stylesheets\/vendor\/bootstrap\.css">)[\s\S]+(<link rel="stylesheet" href="\/stylesheets\/vendor\/rzslider\.css">)/;
	gulp.src(vmrev)
		.pipe(replace(vmreg,vmreplace))
		.pipe(revcollector({replaceReved:true}))
		.pipe(gulp.dest(modeconfig+config.tasks.rev.vmdest))
		.pipe(notify('vm path replace is ok!'));
	var dashreplace=config.tasks.css.dashreplace;
	var dashreg=/(<link rel="stylesheet" href="\/stylesheets\/vendor\/bootstrap\.css">)[\s\S]+(<link rel="stylesheet" href="\/stylesheets\/vendor\/toaster\.css">)/;
	gulp.src(dashboardrev)
		.pipe(replace(dashreg,dashreplace))
		.pipe(revcollector({replaceReved:true}))
		.pipe(gulp.dest(modeconfig+config.tasks.rev.dashdest))
		.pipe(notify('dashboard path replace is ok!'));
}

gulp.task('rev',revtask);
module.exports=revtask;