define(['./app.directive'],function (directiveModule) {
    directiveModule.directive('heightchar', ['$document','HttpService', 'rdsConfig', 'WidgetService', '$filter', function ($document, HttpService, rdsConfig, WidgetService, $filter) {
        return {
            restrict: 'A',
            scope: {
                mType: '=monitorType',
                tType:'=timeType',
                dbId:'=dbId',
                charId:'@charId'
            },
            link: function (scope, element, attrs) {

                scope.$watch(function() {
                    var combined;
                    if (scope.mType || scope.tType) {
                        combined = scope.mType + '_' + scope.tType;
                    }
                    return combined;
                }, function(value) {
                    refreshMonitor();
                });

                scope.$watch('mType', function (newValue) {
                    refreshMonitor();
                });

                var refreshMonitor = function(){
                    var urlObj = getMonitorUrls(scope.mType, scope.tType, scope.dbId);
                    if(!urlObj.initUrl || !urlObj.dataUrl)return;
                    HttpService.doGet(urlObj.initUrl, {}).then(function (data, status, headers, config) {
                        if(data.result===1){
                            initCharts(data);
                        }else{
                            WidgetService.notifyError(data.msgs[0]||'操作出错了！');
                        }
                    });

                    HttpService.doGet(urlObj.dataUrl, {}).then(function (data, status, headers, config) {
                        if(data.result===1){
                            setChartData(data);
                        }else{
                            WidgetService.notifyError(data.msgs[0]||'操作出错了！');
                        }
                    });
                }

                var getMonitorUrls = function( monitorType, timeType, dbId){
                    var monitorInitUrl = "";
                    var monitorDataUrl = "";
                    if(monitorType=="comdml"){
                        monitorInitUrl = rdsConfig.urls.rdsinfo_monitor_init_comdml;
                        monitorDataUrl = rdsConfig.urls.rdsinfo_monitor_data_comdml.replace("{dbId}",dbId).replace("{timeType}",timeType);
                    }else if(monitorType=="innodb"){
                        monitorInitUrl = rdsConfig.urls.rdsinfo_monitor_init_innodb;
                        monitorDataUrl = rdsConfig.urls.rdsinfo_monitor_data_innodb.replace("{dbId}",dbId).replace("{timeType}",timeType);
                    }else if(monitorType=="qps-tps"){
                        monitorInitUrl = rdsConfig.urls.rdsinfo_monitor_init_qpstps;
                        monitorDataUrl = rdsConfig.urls.rdsinfo_monitor_data_qpstps.replace("{dbId}",dbId).replace("{timeType}",timeType);
                    }
                    var url = {
                        initUrl:monitorInitUrl,
                        dataUrl:monitorDataUrl
                    }
                    return url;
                }

                var setChartData = function(data){
                    var chart = $("#chart-container").highcharts();
                    var ydata = data.data;
                    for(var i=chart.series.length-1;i>=0;i--){
                        chart.series[i].remove(false);
                    }
                    for(var i=0;i<ydata.length;i++){
                        ydata[i].name = $filter('rdsMonitorFilter')(ydata[i].name);
                        ydata[i]. marker = {
                            symbol: 'circle'
                        };
                        chart.addSeries(ydata[i],false);
                    }
                    chart.redraw();
                }

                var initCharts = function (data){
                    var div = $("#"+scope.charId);
                    initChart(div,data.titleText,data.yAxisText,data.tooltipSuffix);
                };

                var initChart = function(obj,title,ytitle,unit){
                    $(obj).highcharts({
                        chart: {
                            type:'line',
                            zoomType: 'x',
                            spacingRight: 20
                        },
                        colors: ['#FFD700','#3936EA','#ff0081','#87CEFA'],
                        title: {
                            text: title
                        },
                        legend :{
                            borderColor: '#000000',
                            backgroundColor: '#f9f9f9',
                            symbolRadius: '2px',
                            borderRadius: '5px',
                            itemHoverStyle: {
                                Color: '#000000'
                            }
                        },
                        xAxis: {
                            type: 'datetime',
                            tickPixelInterval:150,
                            gridLineWidth:1,
                            labels:{
                                rotation:0,
                                align:'right'
                            },
                            dateTimeLabelFormats:{
                                millisecond: '%H:%M:%S.%L',
                                second: '%H:%M:%S',
                                minute: '%H:%M',
                                hour: '%H:%M',
                                day: '%e. %b',
                                week: '%e. %b',
                                month: '%b \'%y',
                                year: '%Y'
                            }
                        },
                        plotOptions: {
                            lineWidth: 0.1,
                            fillOpacity: 0.1,
                            series:{
                                lineWidth:2,
                                fillOpacity: 0.5,
                                states:{
                                    hover:{
                                        lineWidthPlus:0
                                    }
                                }
                            }
                        },
                        credits:{
                            enabled: false
                        },
                        yAxis: {
                            title: {
                                text: ytitle
                            }
                        },
                        tooltip: {
                            valueSuffix: unit,
                            shared: true,
                            backgroundColor: 'rgba(127, 127, 127, 0.8)',
                            borderWidth: 0,
                            headerFormat: '<span style="font-size: 10px">{point.key}</span><br/>',
                            pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.y}</b><br/>',
                            xDateFormat: '%Y-%m-%d %H:%M:%S',
                        }
                    });
                }

            }
        }
    }]);
});