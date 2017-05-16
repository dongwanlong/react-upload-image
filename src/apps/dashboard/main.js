require.config({
  paths: {
    //vendor
    'jquery':'../../javascripts/vendor/jquery-1.11.3',
    'bootstrap':'../../javascripts/vendor/bootstrap',
    'common': '../../javascripts/common',
    'browserCheck': '../../javascripts/home/browserCheck',
    'angular':'../../javascripts/vendor/angular',
    'angular-animate': '../../javascripts/vendor/angular-animate',
    'angular-route': '../../javascripts/vendor/angular-route',
    'ui-bootstrap': '../../javascripts/vendor/ui-bootstrap-tpls-0.13.3',
    'ng-toaster': '../../javascripts/vendor/toaster',
    'ng-rzslider': '../../javascripts/vendor/rzslider',
    //js文件
    'app': './app',
    'app.router': './app.route'
  },
  shim: {
    'browserCheck':{
      deps: ['jquery'],
      exports:'browserCheck'
    },
    'angular': {
      deps: ['common'],
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
    }
  }
});

require(['jquery', 'angular', 'common', 'bootstrap', 'app', 'app.router'],
  function (jquery, angular) {
    angular.bootstrap(document, ['myApp']);
  }
);