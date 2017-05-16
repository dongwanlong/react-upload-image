define(['./app.directive'],function (directiveModule) {
    directiveModule.directive('heightchar', ['$document', 'WidgetService', '$filter','leEngineHttpService','leEngineConfig','$filter',function ($document, WidgetService, $filter, leEngineHttpService,leEngineConfig,$filter) {
        return {
            restrict: 'A',
            scope: {
                charOption:'=charOption',
                timeType:'=timeType',
                refreshTag:'=refreshTag',
                loading:'=loading'
            },
            link: function (scope, element, attrs) {
                scope.$watch(function() {
                    var combined;
                    if (scope.timeType || scope.refreshTag) {
                        combined = scope.timeType + '_' + scope.refreshTag;
                    }
                    return combined;
                }, function(value) {
                    refreshMonitor();
                });

                function refreshMonitor(){
                    var timeObj = getTimeParameter(scope.timeType);
                    if(scope.charOption.monitorType==='app'){
                        var url = leEngineConfig.urls.monitor_app.replace('{appid}',scope.charOption.appId).replace('{type}',scope.charOption.subType).replace('{lasttime}',timeObj.lasttime).replace('{grouptime}',timeObj.grouptime);
                    }else if(scope.charOption.monitorType==='pod'){
                        var url = leEngineConfig.urls.monitor_pod.replace('{appid}',scope.charOption.appId).replace('{podname}',scope.charOption.podName).replace('{type}',scope.charOption.subType).replace('{lasttime}',timeObj.lasttime).replace('{grouptime}',timeObj.grouptime);
                    }else{
                    }

                    leEngineHttpService.doGet(url).then(function (data, status, headers, config) {
                        if(data.data.Code === 200 && data.data.Details){
                            scope.loading = false;
                            setChartData(data.data.Details);
                        }
                    });
                }

                function getTimeParameter(timeType){
                    if(timeType==='real'){
                        return {
                            lasttime:3600,
                            grouptime:60
                        }
                    }else if(timeType==='day'){
                        return {
                            lasttime:24*3600,
                            grouptime:300
                        }
                    }else if(timeType==='two-day'){
                        return {
                            lasttime:24*3600*2,
                            grouptime:600
                        }
                    }else if(timeType==='week'){
                        return {
                            lasttime:24*3600*7,
                            grouptime:1800
                        }
                    }else if(timeType==='month'){
                        return {
                            lasttime:24*3600*30,
                            grouptime:7200
                        }
                    }else{
                        return {}
                    }
                }

                function setChartData(data){
                    var chart = $("#"+scope.charOption.charId).highcharts();
                    var ydata = data;
                    for(var i=chart.series.length-1;i>=0;i--){
                        chart.series[i].remove(false);
                    }
                    for(var i=0;i<ydata.length;i++){
                        ydata[i].name = $filter('monitorFilter')(ydata[i].name);
                        ydata[i].marker = {
                            symbol: 'circle'
                        };
                        chart.addSeries(ydata[i],false);
                    }
                    chart.redraw();
                }

                function initChart(obj,title,ytitle,unit){
                    $(obj).highcharts({
                        chart: {
                            type:'line',
                            zoomType: 'x',
                            spacingRight: 20
                        },
                        colors: ['#FFD700','#3936EA'],
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
                            },
                            //tickPositions: [0, 20, 50, 100],
                            labels: {
                                formatter:function(){
                                    return getUnitByMonitorPoint(this.value);
                                }
                            }
                        },

                        tooltip: {
                            valueSuffix: unit,
                            shared: true,
                            backgroundColor: 'rgba(127, 127, 127, 0.8)',
                            borderWidth: 0,
                            headerFormat: '<span style="font-size: 10px">{point.key}</span><br/>',
                            xDateFormat: '%Y-%m-%d %H:%M:%S',
                            formatter: function() {
                                var pointArray = this.points;
                                var pointStr = '<span>'+$filter('date')(this.x,'yyyy-MM-dd HH:mm:ss') + '</span><br/>';
                                pointArray.forEach(function(item){
                                    var color = item.series.color;
                                    var name = item.series.name;
                                    var y = item.y;
                                    pointStr += '<span style="color:'+color+'">\u25CF</span> '+name+': <b>'+getUnitByMonitorPoint(y)+'</b><br/>'
                                });
                                return pointStr;
                            }
                        }
                    });
                }

                function getUnitByMonitorPoint(data){
                    if(scope.charOption.subType==='cpu'){
                        return data.toFixed(2)+"%";
                    }else if(scope.charOption.subType==='memory'){
                        return $filter('gTransMemoryFilter')(data);
                    }else if(scope.charOption.subType==='network'){
                        return $filter('gTransMemoryFilter')(data)+"/s";
                    }else{
                        return ""
                    }
                }

                initChart($("#"+scope.charOption.charId),$filter('monitorFilter')(scope.charOption.subType),"","");
            }
        }
    }]);
});