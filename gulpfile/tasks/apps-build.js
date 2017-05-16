var path = require('path');
var stream = require('stream');
var gulp=require("gulp");
var shell = require('gulp-shell');
var replace = require('gulp-replace');
var clean = require('gulp-clean');
var cssMinify=require("gulp-minify-css");
var concat=require("gulp-concat");
var eventStream = require('event-stream');
var rename = require("gulp-rename");
var uglify=require("gulp-uglify");
var os = require("os");
var process = require('child_process');

var allPackages = [
    {"app":"le-engine","lang":"zh-cn"},
    {"app":"le-engine","lang":"en-us"}
];

var allApps=[
        "rds",
        "le-engine"
    ],
    angularFiles=['angular.js',
        'angular-animate.js',
        'angular-route.js',
        'angular-cookies.js',
        'angular-sanitize.js',
        'rzslider.js',
        'toaster.js',
        'ui-bootstrap-tpls-0.13.3.js',
        'ng-infinite-scroll.js'
    ],

jsTargetDir='./build/production/javascripts/dist',
    cssTargetDir='./build/production/stylesheets/dist';

var timestamp = 'v0-init';

gulp.task("require-git-commit-tag", function(){
    process.exec('git describe --tags', function (error, stdout, stderr) {
        if (error !== null) {
            console.log('exec error: ' + error);
        }
        console.log("#################################");
        console.log(stdout);
        timestamp= stdout.replace('\n','');
    });
});

gulp.task("require-optimze", shell.task(allPackages.map(function(item){
        return 'node ./src/javascripts/vendor/r.js -o ./src/apps/{app}/build-config-{lang}.json'.replace('{app}',item.app).replace('{lang}',item.lang);
    })
));

gulp.task("js-build",["require-optimze", "require-git-commit-tag"], function() {
    return eventStream.merge(
        gulp.src(allPackages.map(function (item) {
            return './src/apps/{app}_{lang}_dist/main-build.js'.replace('{app}', item.app).replace('{lang}', item.lang);
        })).pipe((function () {
            var streamObj = new stream.Transform({objectMode: true});
            streamObj._transform = function (file, unused, callback) {
                if(os.type()=="Linux"){
                    var newPath = file.path.replace(/apps\/(.*)_(.*)_dist\/(main-build.js)$/, "apps\/$1_$2_dist/$1-$2-main-build-" + timestamp + ".js");
                }else{
                    var newPath = file.path.replace(/apps\\(.*)_(.*)_dist\\(main-build.js)$/, "apps\\$1_$2_dist\\$1-$2-main-build-" + timestamp + ".js");
                }
                file.path = newPath;
                callback(null, file);
            };
            return streamObj;
        })()).pipe(gulp.dest(jsTargetDir)),
        gulp.src(angularFiles.map(function (angularFile) {
            return './src/javascripts/vendor/'+angularFile;
        })).pipe(concat('angular-package.min.js'))
            .pipe(uglify())
            .pipe(gulp.dest(jsTargetDir)),
        gulp.src('./src/javascripts/dist/*.js')
            .pipe(gulp.dest(jsTargetDir))

    );
});

gulp.task("js-build-done", ["js-build"],function() {
    return gulp.src(allPackages.map(function (item) {
        return './src/apps/{app}_{lang}_dist'.replace('{app}',item.app).replace('{lang}',item.lang);
    }), {read: false})
        .pipe(clean());
});

gulp.task("css-build", ["js-build-done"],function() {
    return eventStream.merge(
        gulp.src('./src/stylesheets/vendor/*.css')
            .pipe(concat('vendor.css'))
            .pipe(cssMinify())
            .pipe(gulp.dest(cssTargetDir)),
        gulp.src('./src/stylesheets/*.css')
            .pipe(cssMinify())
            .pipe(rename(function (path) {
                path.basename += '-' + timestamp.toString();
            }))
            .pipe(gulp.dest(cssTargetDir))
    );
});

gulp.task("html-copy",["css-build"], function(){
    return gulp.src(['./src/apps/**/*.html'])
        .pipe(gulp.dest('./build/production/apps'));
});

gulp.task("image-copy",["html-copy"], function(){
    return gulp.src(['./src/images/**/*'])
        .pipe(gulp.dest('./build/production/images'));
});

gulp.task("font-copy",["image-copy"], function(){
    return gulp.src(['./src/fonts/**/*'])
        .pipe(gulp.dest('./build/production/fonts'));
});

gulp.task("replace-ref",["font-copy"], function(){
        return gulp.src(allApps.map(function (app) {
            return './src/indexs/{app}/index.*'.replace('{app}',app);
        }),{ base: './src' })
            .pipe(replace(/(<link rel="stylesheet" href="\/stylesheets\/vendor\/bootstrap\.css">)[\s\S]+(<link rel="stylesheet" href="\/stylesheets\/vendor\/rzslider\.css">)/,'<link rel="stylesheet" href="/stylesheets/dist/vendor.css">'))
            .pipe(replace('/stylesheets/common.css','/stylesheets/dist/common-{version}.css'.replace('{version}',timestamp)))
            .pipe(replace(/stylesheets\/style-(.*).css/,"stylesheets/dist/style-$1-{version}.css".replace('{version}',timestamp)))
            .pipe(replace(/apps\/(.+)\/main-(.*).js/, "javascripts/dist/$1-$2-main-build-"+timestamp+".js"))
            .pipe(gulp.dest('./build/production'));
});


gulp.task("apps-build",["replace-ref"], function(){

});
