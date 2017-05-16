var replace = require('gulp-replace');
var config=require("../config.json");
var gulp=require("gulp");
var argv = require('yargs').argv;
var replacetask=function(){
	var modeconfig='';
  	var target1='',dist1='',target2='',dist2='',target3='',dist3='';
  	var evr = argv.p || !argv.t; //生产环境为true，测试环境为false，默认为true
	if(evr){//p
		modeconfig=config.mode.production;
	}else{//t
		modeconfig=config.mode.test;
	  	target1='lcp.lecloud.com',
	  	dist1='lcp-test.lecloud.com';
	  	target2='login.lecloud.com',
	  	dist2='oauthtest.lecloud.com';
		target3='lcp-uc.lecloud.com',
	  	dist3='lcp-uc-test.lecloud.com';
	  	gulp.src([modeconfig+'/**/*','!./'+modeconfig+'/download/**/*','!./'+modeconfig+'/images/**/*','!./'+modeconfig+'/fonts/**/*','!./'+modeconfig+'/stylesheets/**/*'])
		    .pipe(replace(target1,dist1))
		    .pipe(replace(target2,dist2))
		    .pipe(replace(target3,dist3))
		    .pipe(gulp.dest(modeconfig));
	}
}
gulp.task('replace',replacetask);
module.exports=replacetask;

