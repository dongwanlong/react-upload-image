/**
 * Created by chenxiaoxiao3 on 2016/7/27.
 */
define(['./app.controller'], function (controllerModule) {
    controllerModule.controller('staticInformation', ['$timeout','$window','$q','$scope','$modalInstance','transData','$interval','$modal','$timeout','$httpParamSerializerJQLike','$sce', 'leEngineConfig', 'leEngineHttpService','ModelService','WidgetService','CurrentContext','LanguageService',
        function ($timeout,$window,$q,$scope, $modalInstance,transData,$interval,$modal,$timeout,$httpParamSerializerJQLike,$sce, leEngineConfig, leEngineHttpService,ModelService,WidgetService,CurrentContext,LanguageService) {
            $scope.title = transData.title;
            $scope.isListLoading = true;
            $scope.closeModal = function () {
                $interval.cancel(stringTimer);
                $modalInstance.close();

            };
            var content = "";
            var offsetString=0;
            var offsetRefresh=0;
            var stringTimer;


            if(transData.Data){
                $scope.isListLoading = false;
                $scope.content = LanguageService.activityListPage.AuthorName+":"+transData.Data.AuthorName+"\n"+
                                    LanguageService.activityListPage.CreatedAt+":"+transData.Data.CreatedAt+"\n"+
                                    LanguageService.activityListPage.activityName+":"+transData.Data.Title+"\n"+
                                    LanguageService.activityListPage.Url+":"+transData.Data.Url+"\n"+
                                    LanguageService.activityListPage.RequestBody+":"+formatJson($.parseJSON(transData.Data.RequestBody))+"\n"+
                                    LanguageService.activityListPage.Params+":"+transData.Data.Params+"\n";


            }else if(transData.UniqueIdentification){
                stringTimer = $interval(function(){
                    getContent(offsetRefresh,offsetRefresh+10000000,function (curContent) {
                        $scope.content=content;
                        if (curContent.length != 1) {
                            content = content + curContent;
                        }
                        offsetRefresh = offsetRefresh + curContent.length - 1;
                    });
                }, 1000);

            }else {
                leEngineHttpService.doGet(leEngineConfig.urls.ci_details.replace('{ciid}', transData.ciid)).then(function (data, status, headers, config) {
                    // 根据imageid获取buildtoken
                    if (data.data.Code === 200) {
                        if (data.data.Details) {
                            $scope.gitAddress = data.data.Details.Git;
                            return data.data.Details.BuildToken
                        }else {
                            WidgetService.notifyWarning(data.data.Message);
                        }
                    }
                    else {
                        WidgetService.notifyWarning(data.data.Message);
                    }
                }).then(function (buildToken) {
                    // 从node获取leengine服务地址/域名
                    leEngineHttpService.doGet("/backendhost", {}).then(function (data, status, headers, config) {
                        if (data.result == 1) {
                            return {"buildToken": buildToken, "backendHost": data.data.backendhost}
                        }
                    }).then(function (objParams) {
                        // 组装整个URL
                        $scope.isListLoading = false;
                        $scope.wholeUrl = objParams["backendHost"] + leEngineConfig.urls.ci_historys_create.replace('{ciid}',transData.ciid).replace('{buildtoken}',objParams["buildToken"]).replace('{nocache}',true).replace("{mvncache}",true).replace('&tag={tag}','');;

                    });
                });
            }

            function getContent(start,offset,callback){
                var curContent;
                leEngineHttpService.doGet(leEngineConfig.urls.ci_historys_log.replace('{start}',start).replace('{offset}',offset).replace('{UniqueIdentification}', transData.UniqueIdentification)).then(function (data, status, headers, config) {
                    $scope.isListLoading = false;

                    if (data.data.Code === 200) {
                        if (data.data.Details) {
                            if(data.data.Details.BuildResult != 0){
                                $scope.content=data.data.Details.Content;
                                $interval.cancel(stringTimer);
                            }else{
                                curContent =data.data.Details.Content;
                                callback(curContent);
                            }
                            $timeout(function(){
                                $("#scrolldIV").scrollTop($("#scrolldIV")[0].scrollHeight);
                                //document.getElementById('scrolldIV').scrollTop = Number.MAX_VALUE;
                            },500);
                        }
                    } else {
                        WidgetService.notifyWarning(data.data.Message);
                        $interval.cancel(stringTimer);
                    }
                });
            }

            function formatJson(json, options) {
                var reg = null,
                    formatted = '',
                    pad = 0,
                    PADDING = '    '; // one can also use '\t' or a different number of spaces

                // optional settings
                options = options || {};
                // remove newline where '{' or '[' follows ':'
                options.newlineAfterColonIfBeforeBraceOrBracket = (options.newlineAfterColonIfBeforeBraceOrBracket === true) ? true : false;
                // use a space after a colon
                options.spaceAfterColon = (options.spaceAfterColon === false) ? false : true;

                // begin formatting...
                if (typeof json !== 'string') {
                    // make sure we start with the JSON as a string
                    json = JSON.stringify(json);
                } else {
                    // is already a string, so parse and re-stringify in order to remove extra whitespace
                    json = JSON.parse(json);
                    json = JSON.stringify(json);
                }

                // add newline before and after curly braces
                reg = /([\{\}])/g;
                json = json.replace(reg, '\r\n$1\r\n');

                // add newline before and after square brackets
                reg = /([\[\]])/g;
                json = json.replace(reg, '\r\n$1\r\n');

                // add newline after comma
                reg = /(\,)/g;
                json = json.replace(reg, '$1\r\n');

                // remove multiple newlines
                reg = /(\r\n\r\n)/g;
                json = json.replace(reg, '\r\n');

                // remove newlines before commas
                reg = /\r\n\,/g;
                json = json.replace(reg, ',');

                // optional formatting...
                if (!options.newlineAfterColonIfBeforeBraceOrBracket) {
                    reg = /\:\r\n\{/g;
                    json = json.replace(reg, ':{');
                    reg = /\:\r\n\[/g;
                    json = json.replace(reg, ':[');
                }
                if (options.spaceAfterColon) {
                    reg = /\:/g;
                    json = json.replace(reg, ':');
                }

                $.each(json.split('\r\n'), function(index, node) {
                    var i = 0,
                        indent = 0,
                        padding = '';

                    if (node.match(/\{$/) || node.match(/\[$/)) {
                        indent = 1;
                    } else if (node.match(/\}/) || node.match(/\]/)) {
                        if (pad !== 0) {
                            pad -= 1;
                        }
                    } else {
                        indent = 0;
                    }

                    for (i = 0; i < pad; i++) {
                        padding += PADDING;
                    }

                    formatted += padding + node + '\r\n';
                    pad += indent;
                });

                return formatted;
            };

            $scope.$on('$destroy', function() {
                if(stringTimer)$interval.cancel(stringTimer);
            });

        }]);


});