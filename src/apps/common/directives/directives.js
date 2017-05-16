/**
 * Created by jiangfei on 2015/7/22.
 */
define(['./common.directive'],function (directiveModule) {

    directiveModule.directive("passwordVerify", function() {
        return {
            require: "ngModel",
            scope: {
                passwordVerify: '='
            },
            link: function(scope, element, attrs, ctrl) {
                var isInit=true
                scope.$watch(function() {
                    var combined;

                    if (scope.passwordVerify || ctrl.$viewValue) {
                        combined = scope.passwordVerify + '_' + ctrl.$viewValue;
                    }
                    return combined;
                }, function(value) {
                    if(isInit){
                        isInit=false;
                        ctrl.$setValidity("passwordVerify", true);
                        return true;
                    }
                    if (value) {
                        ctrl.$parsers.unshift(function(viewValue) {
                            var origin = scope.passwordVerify;
                            if (origin !== viewValue) {
                                ctrl.$setValidity("passwordVerify", false);
                                return undefined;
                            } else {
                                ctrl.$setValidity("passwordVerify", true);
                                return viewValue;
                            }
                        });
                    }
                });
            }
        };
    });

    directiveModule.directive('nameInputRestrict', ['Config',function(Config) {
        return {
            require: 'ngModel',
            link: function(scope, elm, attrs, ctrl) {
                ctrl.$validators.nameInputRestrict = function(modelValue, viewValue) {
                    if (viewValue && Config.REGEX.NAME_APP_NAME.test(viewValue)) {
                        return true;
                    }
                    return false;
                };
            }
        };
    }]);

    //普通文本输入验证指令
    directiveModule.directive('inputRestrict', function() {
        return {
            require: 'ngModel',
            scope: {
                regex: '=regex',
                min:'=min',
                max:'=max',
                necessary:'=necessary'
            },
            link: function(scope, elm, attrs, ctrl) {

                scope.$watch('necessary', function(value) {
                    ctrl.$setValidity("inputRestrict", validators(ctrl.$modelValue, ctrl.$viewValue));
                });

                ctrl.$validators.inputRestrict = function(modelValue, viewValue) {
                    return validators(modelValue,viewValue);
                };

                function validators(modelValue, viewValue){
                    if((!viewValue ||  viewValue=="")){
                        if(scope.necessary){
                            return false;
                        }else{
                            return true;
                        }
                    }else{
                        if(scope.min && viewValue.length<scope.min)return false;
                        if(scope.max && viewValue.length>scope.max)return false;

                        if(!scope.regex){
                            return true;
                        }

                        return scope.regex.test(viewValue)?true:false;
                    }
                }

            }
        };
    });
    //关联验证指令
    directiveModule.directive('inputCompareRestrict', function() {
        return {
            require: 'ngModel',
            scope: {
                compareValue: '=compareValue',
            },
            link: function(scope, elm, attrs, ctrl) {

                scope.$watch('compareValue', function(value) {
                    if(!value){
                        ctrl.$setValidity("inputCompareRestrict", true);
                    }else{
                        if(ctrl.$viewValue && ctrl.$viewValue!=''){
                            ctrl.$setValidity("inputCompareRestrict", true);
                        }else{
                            ctrl.$setValidity("inputCompareRestrict", false);
                        }
                    }
                });

                ctrl.$validators.inputCompareRestrict = function(modelValue, viewValue) {
                    if(!scope.compareValue && scope.compareValue==''){
                        return true;
                    }else{
                        if(viewValue && viewValue!=''){
                            return true;
                        }else{
                            return false;
                        }
                    }
                };
            }
        };
    });

    //关联+正则 验证指令
    directiveModule.directive('inputCompareAndRegexRestrict', function() {
        return {
            require: 'ngModel',
            scope: {
                compareValue: '=compareValue',
                regex: '=regex',
                necessary:'=necessary'
            },
            link: function(scope, elm, attrs, ctrl) {

                scope.$watch('compareValue', function(value) {
                    if(!value){
                        ctrl.$setValidity("inputCompareAndRegexRestrict", true);
                    }else{
                        if(ctrl.$viewValue && ctrl.$viewValue!=''){
                            ctrl.$setValidity("inputCompareAndRegexRestrict", true);
                        }else{
                            ctrl.$setValidity("inputCompareAndRegexRestrict", false);
                        }
                    }
                });

                ctrl.$validators.inputCompareAndRegexRestrict = function(modelValue, viewValue) {
                    if(!scope.compareValue && scope.compareValue==''){
                        return true;
                    }else{
                        if(!viewValue || viewValue==''){
                            if(scope.necessary){
                                return false;
                            }else{
                                return true;
                            }
                        }else{
                            if(!scope.regex){
                                return true;
                            }
                            return scope.regex.test(viewValue)?true:false;
                        }
                    }
                };

            }
        };
    });

    //关联+最大最小值 验证指令
    directiveModule.directive('inputCompareAndIntegerRestrict', function() {
        return {
            require: 'ngModel',
            scope: {
                compareValue: '=compareValue',
                max: '=max',
                min: '=min'
            },
            link: function(scope, elm, attrs, ctrl) {

                scope.$watch('compareValue', function(value) {
                    if(!value){
                        ctrl.$setValidity("inputCompareAndIntegerRestrict", true);
                    }else{
                        if(ctrl.$viewValue && ctrl.$viewValue!=''){
                            if(!isNaN(ctrl.$viewValue) && (scope.min ? ctrl.$viewValue>=scope.min :true) && (scope.max ? ctrl.$viewValue<=scope.max :true) && (ctrl.$viewValue.toString().indexOf('.')==-1)){
                                ctrl.$setValidity("inputCompareAndIntegerRestrict", true);
                            } else {
                                ctrl.$setValidity("inputCompareAndIntegerRestrict", false);
                            }
                        }else{
                            ctrl.$setValidity("inputCompareAndIntegerRestrict", false);
                        }
                    }
                });

                ctrl.$validators.inputCompareAndIntegerRestrict = function(modelValue, viewValue) {
                    if (scope.compareValue) {
                        if(!isNaN(viewValue) && (scope.min ? viewValue>=scope.min :true) && (scope.max ? viewValue<=scope.max :true) && (viewValue.toString().indexOf('.')==-1)){
                            return true;
                        }else{
                            return false;
                        }

                    }
                };

            }
        };
    });

    //整数输入验证指令
    directiveModule.directive('inputIntegerRestrict', function() {
        return {
            require: 'ngModel',
            scope: {
                max: '=max',
                min: '=min',
                necessary: '=necessary'
            },
            link: function(scope, elm, attrs, ctrl) {
                ctrl.$validators.inputIntegerRestrict = function(modelValue, viewValue) {
                    if((!viewValue ||  viewValue=="")){
                        if(scope.necessary){
                            return false;
                        }else{
                            return true;
                        }
                    } else{
                        if(!isNaN(viewValue) && (scope.min?viewValue>=scope.min:true) && (scope.max?viewValue<=scope.max:true)){
                            return true;
                        }else{
                            return false;
                        }
                    }
                };
            }
        };
    });

    //字符长度范围输入验证指令
    directiveModule.directive('inputLengthRestrict', function() {
        return {
            require: 'ngModel',
            scope: {
                length: '=length',
                necessary: '=necessary',
                minLength: '=minLength'
            },
            link: function(scope, elm, attrs, ctrl) {

                scope.$watch('necessary', function(value) {
                    ctrl.$setValidity("inputLengthRestrict", validators(ctrl.$modelValue, ctrl.$viewValue));
                });

                ctrl.$validators.inputLengthRestrict = function(modelValue, viewValue) {
                    return validators(modelValue, viewValue);
                };

                function validators(modelValue, viewValue){
                    if(scope.necessary && (!viewValue ||  viewValue=="")) {
                        return false;
                    }else{
                        scope.length = parseInt(scope.length);
                        scope.minLength = parseInt(scope.minLength);
                        if(scope.minLength && scope.minLength!=''){
                            if(viewValue){
                                if(viewValue.length < scope.minLength){
                                    return false;
                                }
                            }
                        }
                        if(scope.length && scope.length!=''){
                            if(viewValue){
                                if(viewValue.length > scope.length){
                                    return false;
                                }
                            }
                        }
                        return true;
                    }
                }

            }
        };
    });

    //文本验证指令控件
    directiveModule.directive('leInputText', function () {
        return {
            restrict: 'AE',
            scope: {
                dataModel:'=dataModel',
                form:'=form',
                name:'@name',
                message:'=message',
                regex:'=regex',
                necessary: '=necessary',
                focus:'focus'
            },
            link: function (scope, element, attrs) {
                scope.focus = true;
                scope.input = scope.form[scope.name];
            },
            templateUrl: '/apps/common/directives/le-input-text/template.html'
        };
    });

    //字符长度验证指令控件
    directiveModule.directive('leInputLength', function () {
        return {
            restrict: 'AE',
            scope: {
                dataModel:'=dataModel',
                form:'=form',
                name:'@name',
                message:'=message',
                length:'=length',
                necessary: '=necessary'
            },
            link: function (scope, element, attrs) {
                scope.input = scope.form[scope.name];
            },
            templateUrl: '/apps/common/directives/le-input-length/template.html'
        };
    });


    directiveModule.directive('repertoryNameInputRestrict', ['Config',function(Config) {
        return {
            require: 'ngModel',
            link: function(scope, elm, attrs, ctrl) {
                ctrl.$validators.repertoryNameInputRestrict = function(modelValue, viewValue) {
                    if (viewValue && Config.REGEX.NAME_LE_ENGINE.test(viewValue)) {
                        return true;
                    }
                    return false;
                };
            }
        };
    }]);

    directiveModule.directive('nameInputKeypairRestrict', ['Config',function(Config) {
        return {
            require: 'ngModel',
            link: function(scope, elm, attrs, ctrl) {
                ctrl.$validators.nameInputKeypairRestrict = function(modelValue, viewValue) {
                    if (viewValue && Config.REGEX.NAME_KEYPAIR.test(viewValue)) {
                        return true;
                    }
                    return false;
                };
            }
        };
    }]);

    directiveModule.directive('passwordRestrict', ['Config',function(Config) {
        return {
            require: 'ngModel',
            link: function(scope, elm, attrs, ctrl) {
                ctrl.$validators.passwordRestrict = function(modelValue, viewValue) {
                    if (viewValue && Config.REGEX.PASSWORD.test(viewValue)) {
                        return true;
                    }
                    return false;
                };
            }
        };
    }]);

    directiveModule.directive('passwordConfirm', function() {
        return {
            require: 'ngModel',
            scope: {
                passwordModel: '=passwordModel'
            },
            link: function(scope, elm, attrs, ctrl) {
                var isInit=true
                scope.$watch(function() {
                    var combined;

                    if (scope.passwordModel || ctrl.$viewValue) {
                        combined = scope.passwordModel + '_' + ctrl.$viewValue;
                    }
                    return combined;
                }, function(value) {
                    if(isInit){
                        isInit=false;
                        ctrl.$setValidity("passwordConfirm", true);
                    }
                    if (value) {
                        if (scope.passwordModel !== ctrl.$viewValue) {
                            ctrl.$setValidity("passwordConfirm", false);
                        } else {
                            ctrl.$setValidity("passwordConfirm", true);
                        }
                    }
                });
            }
        };
    });

    directiveModule.directive('vmCreateKeypairValidator', function() {
        return {
            require: 'ngModel',
            link: function(scope, elm, attrs, ctrl) {
                ctrl.$validators.keypairIsNullRestrict = function(modelValue, viewValue) {
                    if (viewValue) {
                        return true;
                    }
                    return false;
                };
                ctrl.$validators.keypairValueRestrict = function(modelValue, viewValue) {
                    if (viewValue && viewValue.value) {
                        return true;
                    }
                    return false;
                };
            }
        };
    });

    directiveModule.directive('numericInput', function () {
        var MAX=10,
          MIN=1;
        return {
            restrict: 'AE',
            scope: {
                externalModel: '=numericModel',
                max: '=numericMax',
                min: '=numericMin',
            },
            link: function (scope, element, attrs) {
                scope.model=scope.externalModel;
                if(scope.max===undefined){
                    scope.max=MAX;
                }
                if(scope.min===undefined){
                    scope.min=MIN;
                }
                scope.up=function(){
                    if(++scope.model>scope.max){
                        --scope.model;
                    }
                };
                scope.down=function(){
                    if(--scope.model<scope.min){
                        ++scope.model;
                    }
                };
                scope.$watch('model',function(value) {
                    if (!isNaN(value)) {
                        var validatedValue = Number(value);
                        if (validatedValue > scope.max) {
                            scope.model = scope.max;
                        }
                        else if (validatedValue < scope.min) {
                            scope.model = scope.min;
                        }
                        else{
                            scope.model = validatedValue;
                        }
                    }
                    else {
                        scope.model = scope.min;
                    }
                    scope.externalModel = scope.model;
                });
            },
            templateUrl: '/apps/common/directives/numeric-input/template.html'
        };
    });

    directiveModule.directive('leSelect', ['$document','$timeout',function ($document,$timeout) {
        return {
            restrict: 'AE',
            scope: {
                model: '=selectModel',
                options:'=selectOptions',
                isOptionLoading:'=isSelectOptionLoading',
                externalEmptyText:'@selectEmptyText',
                disabled:'=disabled'
            },
            link: function (scope, element, attrs) {
                scope.emptyText = !scope.externalEmptyText ? '暂无数据' : scope.externalEmptyText;

                scope.toggleSelect = function (e) {
                    $document.click();
                    if (!scope.disabled && !scope.isOpen) {
                        scope.isOpen = true;
                        e.stopPropagation();
                        $document.bind('click', closeDropdown);
                    }
                };
                scope.selectOption = function (selectedOption) {
                    scope.model = selectedOption;
                };

                var closeDropdown = function (evt) {
                    if (!scope.isOpen) {
                        return;
                    }
                    $document.unbind('click', closeDropdown);
                    scope.isOpen = false;

                    $timeout(function(){
                        scope.isOpen = false;
                    });
                };
            },
            templateUrl: '/apps/common/directives/le-select/template.html'
        };
    }]);

    directiveModule.directive('leSlider', ['Utility',function (Utility) {
        return {
            restrict: 'AE',
            scope: {
                externalModel: '=leSliderModel',
                step:'@leSliderStep',
                min:'=leSliderMin',
                isMinChangeable:'@isSliderMinChangeable',
                max:'@leSliderMax',
                unit:'@leSliderUnit',
            },
            link: function (scope, element, attrs) {
                var delayQueueModelHandler = Utility.delayQueueModel();
                var max = Number(scope.max),
                  min = Number(scope.min);
                  //isExternalModelChangedInDirective=false;
                if(scope.isMinChangeable === 'true'){
                    scope.$watch('min', function (newValue) {
                        min = Number(newValue);
                        scope.model = min;
                    });
                }
                scope.$watch('externalModel', function (newValue) {
                    /*if(isExternalModelChangedInDirective){
                        isExternalModelChangedInDirective=false;
                        return;
                    }*/
                    scope.model = newValue;
                });
                scope.$watch('model', function (newValue) {
                    if (newValue !== null && !isNaN(newValue)) {
                        if(!Utility.isInt(newValue)){
                            newValue = Math.floor(newValue);
                        }
                        if (newValue <= max && newValue >= min) {
                            if(newValue % scope.step!==0) {
                                newValue = Math.ceil(newValue/scope.step) * scope.step;
                            }
                            delayQueueModelHandler(newValue, function (value) {
                                scope.model = Number(value);
                                //isExternalModelChangedInDirective=true;
                                scope.externalModel = scope.model;
                            });
                        }
                        else if (newValue > max) {
                            scope.model = max;
                        }
                        else if (newValue < min) {
                            scope.model = min;
                        }
                        else {
                        }

                    } else {
                        scope.model = min;
                    }
                });
            },
            templateUrl: '/apps/common/directives/le-slider/template.html'
        };
    }]);

    directiveModule.directive('buyPeriodSelector', function () {
        return {
            restrict: 'AE',
            scope: {
                selectedBuyPeriod: '=buyPeriodModel',
                allBuyPeriods:'=buyPeriodOptions'
            },
            link: function (scope, element, attrs) {
                scope.selectBuyPeriod = function (buyPeriod) {
                    scope.selectedBuyPeriod = buyPeriod;
                };
                scope.isSelectedBuyPeriod = function (buyPeriod) {
                    return scope.selectedBuyPeriod === buyPeriod;
                };
            },
            templateUrl: '/apps/common/directives/buy-period-selector/template.html'
        };
    });

    directiveModule.directive('leAutoFocus', ['$timeout',function ($timeout) {
        return {
            restrict: 'AE',
            link: function (scope, element, attrs) {
                if (element && element[0]) {
                    $timeout( function () { element[0].focus(); } );
                }
            }
        };
    }]);

    directiveModule.directive('inputValidationTooltip', function () {
        return {
            restrict: 'AE',
            scope: {
                message: '@validationMessage'
            },
            link: function (scope, element, attrs) {
            },
            templateUrl: '/apps/common/directives/input-validation-tooltip/template.html'
        };
    });

    directiveModule.directive('leRadioSelect', ['$document',function ($document) {
        return {
            restrict: 'E',
            scope: {
                model: '=selectModel',
                options:'=selectOptions',
                radioStyle:'=radioStyle'
            },
            link: function (scope, element, attrs) {
                scope.toggleSelect = function (selectedOption) {
                    scope.model = selectedOption;
                };
            },
            templateUrl: '/apps/common/directives/le-radio-select/template.html'
        };
    }]);
    directiveModule.directive('leCheckboxSelect', ['$document',function ($document) {

        return {
            restrict: 'E',
            scope: {
                model: '=selectModel',
                options:'=selectOptions'
            },
            link: function (scope, element, attrs) {
                scope.model = [];
                scope.toggleSelect = function (selectedOption) {
                    var isExist = true;
                    for(var i = 0,len = scope.model.length;i<len;i++){
                        if(scope.model[i].value == selectedOption.value){
                            scope.model.splice(i,1);
                            isExist = false;
                            break;
                        }
                    }
                    if(isExist){
                        scope.model.push(selectedOption);
                    }
                };
                scope.isSelect = function(selectedOption){
                    var selected = false;
                    for(var i = 0,len = scope.model.length;i<len;i++){
                        if(scope.model[i].value == selectedOption.value) {
                            selected = true;
                            break;
                        }
                    };
                    return selected;
                }
            },
            templateUrl: '/apps/common/directives/le-checkbox-select/template.html'
        };
    }]);

    directiveModule.directive('leCopy', ['$document','$rootScope',function ($document,$rootScope) {
        return {
            restrict: 'A',
            scope: {
                model: '=data',
            },
            link: function (scope, element, attrs) {
                scope.lang = $rootScope.common.directives.leCopy;
                scope.selectAll = function () {
                    if($(".text_copy").length==0)return;
                    var oText = $(".text_copy")[0];
                    oText.focus();
                    oText.select();
                    scope.isCopy = true;
                }

            },
            templateUrl: '/apps/common/directives/le-copy/template.html'
        };
    }]);
    directiveModule.directive('leDatetimepicker', ['$document','$filter', function ($document,$filter) {
        return {
            restrict: 'A',
            scope: {
                model: '=dateModel',
                charId:'@charId',
                lang:'=currentLang',
                options:'=options',
            },
            link: function (scope, element, attrs) {
                if(scope.lang=="zh-cn"){
                    scope.lang = "cn";
                }else if(scope.lang=="en-us"){
                    scope.lang = "en";
                }else{
                    scope.lang = "cn";
                }

                var optionsDefault = {
                    format: 'yyyy-mm-dd',
                    language:  scope.lang,
                    autoclose: 1,
                    forceParse:true,
                    pickerPosition: "bottom-left",
                    minuteStep: 5,
                    format: 'yyyy-mm-dd',
                    minView: 'month',
                    startDate:'1979-01-01',
                    endDate:new Date()
                }

                var optionTarget = scope.options?angular.extend({}, optionsDefault, scope.options):optionsDefault;
                $("#"+scope.charId).datetimepicker(optionTarget);

            }
        };
    }]);

    directiveModule.directive('leSelectFind', ['$document',function ($document) {
        return {
            restrict: 'AE',
            scope: {
                model: '=selectModel',
                options:'=selectOptions'
            },
            link: function (scope, element, attrs) {
                scope.optionsView = scope.options;
                scope.emptyText = !scope.externalEmptyText ? '暂无数据' : scope.externalEmptyText;
                scope.toggleSelect = function (e) {
                    if (!scope.isOpen) {
                        scope.isOpen = true;
                        e.stopPropagation();
                        $document.bind('click', closeDropdown);
                    }
                };

                scope.selectOption = function (selectedOption) {
                    scope.model.text = selectedOption.text;
                };

                scope.$watch('scope.options',function(value) {
                    scope.optionsView = scope.options;
                });

                scope.$watch('model.text',function(value) {
                    if(!scope.options){
                        if(scope.options){
                            scope.optionsView = scope.options.filter(function(item){
                                if(item.text.indexOf(value)!=-1){return true;}
                                return false;
                            });
                        }
                    }
                });

                var closeDropdown = function (evt) {
                    if (!scope.isOpen) {
                        return;
                    }
                    $document.unbind('click', closeDropdown);
                    scope.isOpen = false;
                    if (!scope.$$phase) {
                        scope.$apply();
                    }
                };
            },
            templateUrl: '/apps/common/directives/le-select-find/template.html'
        };
    }]);


});