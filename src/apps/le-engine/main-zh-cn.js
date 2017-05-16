/**
 * Created by dongwanlong on 2016/4/6.
 */
require.config({
    paths: {
        //vendor
        'jquery':'../../javascripts/vendor/jquery-1.11.3',
        'highcharts':'../../javascripts/vendor/highcharts',
        'bootstrap-datetimepicker':'../../javascripts/vendor/bootstrap-datetimepicker',
        'bootstrap':'../../javascripts/vendor/bootstrap',
        'common': '../../javascripts/common',
        'browserCheck': '../../javascripts/home/browserCheck',
        'angular':'../../javascripts/vendor/angular',
        'angular-animate': '../../javascripts/vendor/angular-animate',
        'angular-route': '../../javascripts/vendor/angular-route',
        'angular-cookies': '../../javascripts/vendor/angular-cookies',
        'angular-sanitize': '../../javascripts/vendor/angular-sanitize',
        'infinite-scroll': '../../javascripts/vendor/ng-infinite-scroll',
        'ui-bootstrap': '../../javascripts/vendor/ui-bootstrap-tpls-0.13.3',
        'ng-toaster': '../../javascripts/vendor/toaster',
        'ng-rzslider': '../../javascripts/vendor/rzslider',
        'ace':'../../javascripts/vendor/ace',
        'ui-ace':'../../javascripts/vendor/ui-ace',
        'mode-dockerfile':'../../javascripts/vendor/mode-dockerfile',
        'mode-dockerfile':'../../javascripts/vendor/theme-ambiance',
        //js文件
        'app': './app',
        'app.router': './app.route',
        'language': './languages/language.zh-cn',
        'common-language': '../common/languages/language.zh-cn'
    },
    shim: {
        'bootstrap-datetimepicker':{
            deps: ['bootstrap'],
            exports:'bootstrap-datetimepicker'
        },
        'highcharts':{
            deps: ['jquery'],
            exports:'highcharts'
        },
        'browserCheck':{
            deps: ['jquery'],
            exports:'browserCheck'
        },
        'angular': {
            deps: [],
            exports: 'angular'
        },
        'angular-animate': {
            deps: ['angular'],
            exports: 'angular-animate'
        },
        'angular-route': {
            deps: ['angular'],
            exports: 'angular-route'
        },
        'angular-cookies': {
            deps: ['angular'],
            exports: 'angular-cookies'
        },
        'angular-sanitize': {
            deps: ['angular'],
            exports: 'angular-sanitize'
        },
        'infinite-scroll': {
            deps: ['angular'],
            exports: 'infinite-scroll'
        },
        'ui-bootstrap': {
            deps: ['angular'],
            exports: 'ui-bootstrap'
        },
        'ng-toaster': {
            deps: ['angular', 'angular-animate'],
            exports: 'ng-toaster'
        },
        'ng-rzslider': {
            deps: ['angular'],
            exports: 'ng-rzslider'
        },
        'bootstrap': {
            deps: ['jquery'],
            exports: 'bootstrap'
        },
        'ui-ace':{
            deps:['ace','angular'],
            exports:'ace'
        }

    }
});

require(['jquery', 'angular', 'common','bootstrap','highcharts', 'bootstrap-datetimepicker', 'app','app.router', 'mode-dockerfile'],
    function (jquery, angular) {
        angular.bootstrap(document, ['myApp']);
    }
);