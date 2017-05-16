/**
 * Created by dongwanlong on 2016/6/23.
 */
define(['angular'],function(angular){
    var modular = angular.module('app.language', []);
    modular.factory('LanguageService', ['$modal',
        function ($modal) {
            var service = {
                "common":{
                    "services":{
                        NAME_ES: '内容必须以字母开头，允许字母数字下划线，长度在2-16位内,同一用户下名称不许重复',
                        MARK_ES: '最大长度50位'
                    },
                    "directives":{
                    },
                    "filters":{
                        "esStatusFilter":{
                            "DEFAULT":"未审核",
                            "RUNNING":"运行中",
                            "BUILDDING":"创建中",
                            "BUILDFAIL":"创建失败",
                            "AUDITFAIL":"审核失败",
                            "ABNORMAL":"异常",
                            "NORMAL":"正常"
                        }
                    }
                },
                "langRedisHeader":{
                    "return":"返回旧版",
                    "help":"帮助中心",
                    "exit":"退出",
                    "tipSwitchSuccess":"你已经切换到",
                    "tipSwitchFailed":"切换地域失败",
                    "tipAreaListGetFailed":"地域列表加载失败"
                },
                "langRedisListPage":{
                },
                "langRedisCreateModal": {
                    "configFile": "配置文件"
                },
                "langRedisDetailPage": {
                    "domainAndPort": "域名和端口"
                },
                "langRedisStatus": {
                    "BUILDDING":"创建中",
                    "BUILDFAIL":"创建失败",
                    "STARTING":"启动中",
                    "STARTFAIL":"启动失败",
                    "RUNNING":"运行中",
                    "STOPPING":"停止中",
                    "STOPED":"已停止",
                    "DANGER":"危险",
                    "CRISIS":"宕机",
                    "DESTROYING":"集群删除中",
                    "DESTROYED":"集群已删除",
                    "DESTROYFAILED":"集群删除失败",
        }
            };
            return service;
    }]);
    return modular;
});