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
                "headerEsPage":{
                    "return":"返回旧版",
                    "help":"帮助中心",
                    "exit":"退出",
                    "tipSwitchSuccess":"你已经切换到",
                    "tipSwitchFailed":"切换地域失败",
                    "tipAreaListGetFailed":"地域列表加载失败"
                },
                "sideMenuPage":{
                    "esView":"ES概览",
                    "esList":"ES列表",
                    "return":"return",
                    "caseInfo":"详细信息",
                    "esMenuTitle":"ES数据"
                },
                "esDashboardPage":{
                    "title":"敬请期待"
                },
                "esListPage":{
                    "createEsBtn":"创建ES",
                    "inputEsName":"输入ES名称",
                    "tableTrName":"实例名称",
                    "tableTrState":"状态",
                    "tableTrCreateTime":"创建时间",
                    "tableTrMark":"备注",
                    "goToCreateEs":"去创建ES吧",
                    "orderCreateSuccess":"你的ES订单已提交",
                    "orderCreateFail":"你的ES创建失败"
                },
                "esCreateModalPage":{
                    "title":"创建ES",
                    "stepBaseSelect":"基本信息",
                    "stepBuySelect":"购买选择",
                    "esName":"ES名称",
                    "inputEsName":"请输入ES名称",
                    "esMark":"ES备注",
                    "esMemorySize":"内存大小",
                    "esNodeCount":"节点数",
                    "esStorageSize":"存储大小",
                    "esHcluster":"物理机集群",
                    "orderTitle":"ES创建详情",
                    "memorySize":"内存",
                    "storageSize":"存储",
                    "total":"合计",
                    "CNY":"元",
                    "submitOrderBtn":"订单提交",
                    "submitOrdering":"订单提交中...",
                    "priceCalculating":"价格计算中"
                },
                "esCaseInfoPage":{
                    "baseInfoTitle":"基本信息",
                    "baseInfoName":"名称",
                    "baseInfoArea":"地域",
                    "statusTitle":"运行状态",
                    "statusStatus":"运行状态",
                    "settingTitle":"配置信息",
                    "settingMemory":"数据库内存",
                    "settingStorage":"数据库空间",
                    "settingNodeCounts":"节点数量",
                    "cycleTitle":"运行周期",
                    "cycleCreateTime":"创建时间",
                    "connectTitle":"连接服务",
                    "connectIpList":"IP列表"
                }
                };
            return service;
    }]);
    return modular;
});