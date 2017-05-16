/**
 * Created by dongwanlong on 2016/8/5.
 */
define(['./app.service'], function (serviceModule) {
    serviceModule.factory('rdsConfig', ['LanguageService',function (LanguageService) {

        var lang = LanguageService.common.services;

        var config = {};

        config.urls = {
            rds_list:'/db',
            rds_area_list:'/area',
            rds_switch_area:'/hcluster/{areaId}/rds',
            rds_bulid:'/build/db/{dbId}',
            rdsinfo_baseinfo:'/db/{dbId}',
            rdsinfo_gbconfig:'/db/gbConfig/{dbId}',
            rdsinfo_user_ip:'/dbIp/{dbId}/{username}',
            rdsinfo_user_ip_modify:'/dbIp',
            rdsinfo_user_ip_check:'/dbIp/checkIp',
            rdsinfo_user_modify:'/dbUser/authority/{username}',
            rdsinfo_user_create:'/dbUser',
            rdsinfo_user_descn:'/dbUser/descn/{username}',
            rdsinfo_user_security:'/dbUser/security/{username}',
            rdsinfo_user_delete:'/dbUser/{dbId}/{username}',
            rdsinfo_user_list:'/dbUser/{dbId}',
            rdsinfo_monitor_init_comdml:'/monitor/index/23',
            rdsinfo_monitor_init_innodb:'/monitor/index/18',
            rdsinfo_monitor_init_qpstps:'/monitor/index/19',
            rdsinfo_monitor_data_comdml:'/monitor/{dbId}/23/{timeType}/true',
            rdsinfo_monitor_data_innodb:'/monitor/{dbId}/18/{timeType}/false',
            rdsinfo_monitor_data_qpstps:'/monitor/{dbId}/19/{timeType}/false',
            rdsinfo_backup_list:'/backup',
            rdsinfo_backup_seting:'/backup/strategy',
            rdsinfo_backup_file_info:'/backup/dump/{dbId}/status',
            rdsinfo_backup_file_export:'/backup/dump/export',
            rdsinfo_backup_full:'/backup/full',
            rdsinfo_backup_incr:'/backup/incr',
            rdsinfo_backup_detail:'/backup/check',
            rdsinfo_sql_audit_list:'/sql/{type}',
            rdsinfo_sql_audit_detail:'/sql/{type}/{sqlId}',
            rdsinfo_sql_analyse:'/sql/{type}/validate',
            rdsinfo_sql_execute:'/sql/{type}/execute',
            rdsinfo_sql_to_DBA:'/sql/{type}/approval',
        };
        config.REGEX = {
            RDS_USER_PASSWORD:/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z@#$%^&*!~_-]{6,32}$/,
            DB_USER_NAME:/^((?!(^monitor$|^backup$|^root$|^sstuser$))([a-zA-Z_][a-zA-Z_0-9]{0,15}))$/,
            NAME_RDS:/^((?!(^monitor$))([a-zA-Z_][a-zA-Z_0-9]{0,15}))$/,
        };
        config.REGEX_MESSAGE= {
            RDS_USER_PASSWORD:lang.RDS_USER_PASSWORD,
            MAX_QUERIES:lang.MAX_QUERIES,
            REMARK:lang.REMARK,
            DB_USER_NAME:lang.DB_USER_NAME,
            NAME_RDS:lang.NAME_RDS
        };

        return config;
    }]);
});