/**
 * Created by dongwanlong on 2016/6/23.
 */
define(['angular'],function(angular){
    var modular = angular.module('common.language', []);
    modular.factory('CommonLanguageService', ['$modal',
        function ($modal) {
            var service = {
                "langPrimary":{
                    "name":"名称",
                    "type":"类型",
                    "title":"标题",
                    "creteTime":"创建时间",
                    "creteUser":"创建者",
                    "operation":"操作",
                    "detail":"详情",
                    "affect":"影响",
                    "basicInfo":"基本信息",
                    "content":"内容",
                    "status":"状态",
                    "memory":"内存",
                    "create":"创建",
                    "region":"区域",
                    "AZ":"可用区",
                    "config":"配置",
                    "start":"启动",
                    "stop":"停止",
                    "delete":"删除",
                    "moreOperation":"更多操作",
                    "success":"成功",
                    "failure":"失败",
                    "view":"查看",
                    "noDataHint":"暂无数据",
                    "error":"错误",
                    "unknown":"未知",
                    "average":"平均值",
                    "times": "1次",
                    "sms": "短信",
                    "voice": "电话",
                    "email": "邮件",
                    "edit": "编辑",
                    "enable": "启用",
                    "disable": "停用",
                    "time": "时间",
                    "search": "搜索",
                },
                "langPassword": {
                    "password":"密码",
                    "passwordSetting":"密码设置",
                    "inputPassword":"输入密码",
                    "confirmPassword":"确认密码",
                    "setNow":"立即设置",
                    "setLater":"稍后设置",
                },
                "langCopywriting":{
                    "ComingSoon":"敬请期待"
                },
                "langHint":{
                    "inputInstanceName":"请输入实例名称"
                },
                "langOrder":{
                    "submitOrder":"提交订单"
                },
                "langDuration": {
                    "days": "天",
                    "hours": "小时",
                    "minutes": "分钟"
                },
                "services":{
                    NAME: '名称须为2-128个字符，支持大小写字母数字或中文以及()（）_-，以大小写字母或中文开头',
                    NAME_KEYPAIR: '名称须为2-128个字符，支持大小写字母数字以及_-，以大小写字母开头',
                    PASSWORD: '8-30个字符，同时包含大小写字母和数字，不支持特殊符号',
                    IP:"请输入正确IP格式，.IP能够增加带%号的对IP段访问授权，如192.168.19.3或192.168.19.%",
                    PHONE:"请输入正确的手机格式"
                },
                "directives":{
                },
                "filters":{
                },
                "pagination":{
                    "total":"共",
                    "nums":"条",
                    "perPage":"每页显示"
                },
                "error": {
                    "requestError": "请求失败：{errorMsg}"
                }
            };

            return service;
    }]);
    return modular;
});