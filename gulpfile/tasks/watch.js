var config=require("../config.json");
var gulp=require("gulp");
var path=require('path');
var watch=require('gulp-watch');
var notify=require('gulp-notify');
var changecopy=function(src,dest){
  gulp.src(src)
      .pipe(gulp.dest(dest))
      .pipe(notify('copy is ok'))
}
var watchTask = function() {
  var globs=config.tasks.copy.src;
  var dest=config.tasks.copy.dest;
  gulp.watch(globs)
      .on("change",function(event){
        var projectname=config.root.projectname;
        var path=event.path;
        var pathtemp=path.replace(/\\/g,'/');

        var pathdest=path.substring(0,path.indexOf(config.root.src))+path.substring(path.indexOf(config.root.src)+4);
        var start=pathdest.indexOf(projectname)+projectname.length+1;
        var end=pathdest.lastIndexOf("\\");
        
        var copydir="";
        if(start>=end){
          copydir=dest+"/";
        }else{
          copydir=dest+"/"+pathdest.substring(start,end);
        }
        var copydirtemp=copydir.replace(/\\/g,'/');
        changecopy(pathtemp,copydirtemp);
      })
      .on("error",function(event){
        watch.end();
      })
}

gulp.task('watch',watchTask)
module.exports=watchTask