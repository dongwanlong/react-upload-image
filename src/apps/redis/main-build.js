require.config({
  paths: {
    //vendor
    'jquery':'../../javascripts/dist/jquery.min',
    'bootstrap':'../../javascripts/dist/bootstrap.min',
    'bootstrap-datetimepicker':'../../javascripts/dist/bootstrap-datetimepicker.min',
    'highcharts':'../../javascripts/dist/highcharts.min',
    'angular':'../../javascripts/dist/angular-package.min',
    'common': '../../javascripts/common',
    'browserCheck': '../../javascripts/home/browserCheck',
    //js文件
    'app': './app-build',
    'app.router': './app.route'
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
    'bootstrap': {
      deps: ['jquery'],
      exports: 'bootstrap'
    },
    'angular': {
      deps: ['common'],
      exports: 'angular'
    }
  }
});

require(['jquery', 'angular', 'common', 'bootstrap','highcharts', 'bootstrap-datetimepicker', 'app', 'app.router'],
  function (jquery,angular) {
    angular.bootstrap(document, ['myApp']);
  }
);