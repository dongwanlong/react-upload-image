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
                        NAME: 'The name must be 2-128 characters, letters or numbers to support Chinese and () () _-, by letters or at the beginning of Chinese',
                        NAME_KEYPAIR: 'The name must be 2-128 characters, letters and numbers to support _-, with small letters at the beginning',
                        PASSWORD: '8-30 characters, including the size of the write letters and numbers, do not support special symbols',
                        RDS_USER_PASSWORD:'By letters, numbers or special characters such as: @#$%^&*! ~_-, must contain Upper and lower case letters and numbers,must length 6~32 bit',
                        MAX_QUERIES:'Please enter an integer of 1 to 2000',
                        REMARK:'Input length is no more than 100 characters!',
                        DB_USER_NAME:"Consists of letters, numbers, underline, can not start with a number, the name can not be named monitor, backup, root, sstuser, no more than 16 characters",
                        IP:"Please enter the correct IP format,.IP can increase the number of the number of the IP segment access authorization, such as 192.168.19.3 or 192.168.19.%",
                        NAME_RDS:"Please enter a number or letter ', database name cannot start with a number, and the name of the database cannot be named monitor, not more than 16 characters",
                        
                    },
                    "directives":{
                        "leCopy":{
                            "copyBtn":"Copy",
                            "copyAction":"Press Ctrl+C to copy code"
                        }
                    },
                    "filters":{
                        "rdsBackupTypesFilter":{
                            "full":"FULL",
                            "incr":"INCR"
                        },
                        "rdsStatusFilter":{
                            "unaudit":"not audited",//未审核
                            "running":"running",//运行中
                            "creating":"creating",//创建中
                            "createFailed":"create failed",//创建失败
                            "auditFailed":"audit failure",//审核失败
                            "unusual":"unusual",//异常
                            "usual":"usual",//正常
                            "starting":"starting",//启动中...
                            "stoping":"stoping",//停止中...
                            "stoped":"stoped",//已停止
                            "deleting":"deleting",//删除中...
                            "deleted":"deleted",//已删除
                            "deleteFailed":"delete failed",
                            "nonExistent":"non-existent",//不存在
                            "danger":"danger",//危险
                            "seriousDanger":"serious danger",//严重危险
                            "disable":"disable",//禁用
                            "backupFailed":"backup failed",//备份失败
                            "backupSuccess":"backup success",//备份成功
                            "backuping":"backuping",//备份中...
                            "backupException":"backup exception"//备份异常
                        },
                        "rdsCreateProgressFilter": {
                            "environmentReadying":"environmental preparation",//环境准备中
                            "environmentChecking":"environment checking",//环境检查中
                            "initService":"Initialization service",//初始化服务
                            "createDb":"create database",//创建数据库
                            "createDbComplete":"create complete",
                            "createFailed":"create failed"//创建失败
                        },
                        "rdsMonitorFilter": {
                            "numInserts":"average number of affected rows per second insert statement",
                            "numDeletes":"average number of affected rows per second delete statement",
                            "numUpdates":"average number of affected rows per second update statement",
                            "numReads":"average number of rows per second select statement",

                            "bufPoolHitRate":"read hit rate of buffer pool",//缓冲池的读命中率
                            "bufFree":"buffer pool residual space",//缓冲池剩余空间
                            "bufPoolSize":"buffer pool total space",//缓冲池总空间

                            "commitPs":"average number of transactions per second",//平均每秒事务数
                            "qps":"average execution times per second SQL statement",//平均每秒SQL语句执行次数
                            "opensPs":"average number of open tables per second",//平均每秒打开表数
                            "threadsPs":"average number of connections per second"//平均每秒创建连接数
                        },
                        "rdsTransDbUserFilter": {
                            "manage":"manage",//管理
                            "onlyRead":"only read",//只读
                            "readWirte":"read and wirte"//读写
                        },
                        "rdsBackupSetDateNextTimeFilter":{
                            "year":"year",
                            "month":"month",
                            "day":"day"
                        },
                        "rdsBackupSetDateWeekFilter":{
                            "monday":"Monday",
                            "tuesday":"Tuesday",
                            "wednesday":"Wednesday",
                            "thursday":"Thursday",
                            "friday":"Friday",
                            "saturday":"Saturday",
                            "sunday":"Sunday"
                        }
                    }
                },
                "rdsListPage":{
                    "exampleName":"Instance Name",
                    "state":"State",
                    "exampleType":"Instance Type",
                    "Type":"Database Type",
                    "usableAreaType":"Usable Area Type",
                    "usableArea":"Usable Area",
                    "serviceCluster":"Service Cluster",
                    "payType":"Pay Type",
                    "vip":"VIP",
                    "singleUsableArea":"single usable area",
                    "packYears":"pack years ",
                    "daysAfterMaturity":" days after maturity",
                    "goToCreateRds":"no RDS,go to create",
                    "createRdsBtn":"Create RDS",
                    "inputRdsName":"please input rds name",
                    "orderCreateSuccess":"RDS order creation success",
                    "orderCreateFail":"RDS order creation fail",
                    "owner":"owner",
                },
                "rdsCreateModalPage":{
                    "title":"Create RDS",
                    "step1":"Basic",
                    "step2":"RDS",
                    "step3":"Buy",
                    "rdsName":"Name",
                    "usableArea":"Usable",
                    "inputRdsName":"please input rds name",
                    "nextStep":"Next Step",
                    "preStep":"Prev Step",
                    "submitOrderBtn":"Place Order",
                    "dataBaseType":"Type",
                    "linkType":"Link Type",
                    "defaultUser":"Default User",
                    "storageSpace":"Disk",
                    "memory":"RAM",
                    "longLink":"Long Link",
                    "shortLink":"Short Link",
                    "create":"Create",
                    "noCreate":"No Create",
                    "buyYears":"Years",
                    "buyCounts":"Counts",
                    "orderTitle":"RDS create info",
                    "orderStorage":"Disk",
                    "orderType":"Type",
                    "orderLink":"Link",
                    "total":"Total",
                    "CNY":"CNY",
                    "submitOrdering":"Order submissioning",
                    "priceCalculating":"price calculating",
                    "year":"Year",
                },
                "rdsDashboardPage":{
                    "title":"Please look forward to"
                },
                "RdsinfoBasePage":{
                    "baseInfoTitle":"Basic Info",
                    "dbId":"Database ID",
                    "dbName":"Database Name",
                    "innerNetAddr":"Inner Network Address",
                    "area":"Area",
                    "usableArea":"Usable Area",
                    "port":"Port",
                    "innerNetAddrTip":"（This IP is only used for debugging, to prohibit the use of the production environment！）",
                    "areaTip":"[Migration usable area]",
                    "portTip1":"How to connect RDS",
                    "portTip2":"How to set the white list",
                    "runStateTitle":"Running State",
                    "runState":"Running State",
                    "lockModal":"Lock Mode",
                    "usability":"Usability",
                    "usedSpace":"Used Space",
                    "configurationInfoTitle":"Configure Info",
                    "vip":"VIP",
                    "dbMemory":"RAM",
                    "dbSpace":"Disk",
                    "instanceType":"Instance Type",
                    "dbType":"DB Type",
                    "maxLink":"Maximum Connection",
                    "maxIOPS":"Max IOPS",
                    "OperationPeriodTitle":"Operation Period",
                    "createTime":"Create Time",
                    "payTime":"Payment Type",
                    "pacYears":"pack years",
                    "daysAfterMaturity":" days after maturity",
                    "timeAvailableTitle":"Time Available",
                    "timeAvailable":"Time Available for Maintenance",
                    "unSet":"un set"
                },
                "RdsinfoOptioninfoPage":{
                    "title":"Configure Info"
                },
                "RdsinfoUsermangerPage":{
                    "createUserBtn":"Create",
                    "moreBtn":"More",
                    "ipVisterBtn":"IP Access",
                    "resetPassWordBtn":"Reset Password",
                    "resetMarkBtn":"Modify Mark",
                    "resetPowerBtn":"Modify Power",
                    "deleteUserBtn":"Delete",
                    "userTh":"Account Number",
                    "stateTh":"State",
                    "maxTh":"Maximum Concurrency",
                    "mark":"Mark",
                    "listTip":"No account to create",
                    "rdsCreateSuccessTip":"RDS users create success",
                    "rdsCreateFailedTip":"RDS users create successful failure",
                    "markModifySuccessTip":"Remark modification success",
                    "markModifyFailedTip":"Remark modification failed",
                    "rdsDeleteSuccessTip":"RDS users delete success",
                    "rdsDeleteFailedTip":"RDS user delete failed",
                    "rdsModifyFailedTip":"RDS user modification failed",
                    "rdsModifySuccessTip":"RDS users modify successfully",
                    "rdsDeleteFailedTip":"RDS user delete failed",
                    "selectTip":"Please select an account"
                },
                "RdsInfoOptionPage":{
                    "nullIpTip":"Unauthorized IP list cannot be empty",
                    "usingIpTip":"The current IP is used",
                    "unSelectIpTip":"Modify please select authorization IP",
                    "userExistTip":"User name already exists",
                    "ipExistTip":"You add the IP already exists",
                    "ipAddSuccessTip":"Add IP success",
                    "ipAddFaildTip":"Add IP failed",
                    "ipDeleteSuccessTip":"Delete IP success",
                    "ipDeleteFaildTip":"Delete IP failed",
                    "title":"Database Account",
                    "dbUserName":"Account",
                    "authorizeIp":"Authorized IP",
                    "unAuthorizeIpTitle":"Unauthorized Ip",
                    "unAuthorizeIpDelBtn":"Delete",
                    "authorizeIpTitle":"Authorized IP",
                    "authorizeSwitchBtn":"Full Access Switch",
                    "authorizeAllBtn":"RW",
                    "authorizeReadBtn":"R",
                    "authorizeWriteBtn":"W",
                    "authorizeAddBtn":"Add",
                    "authorizeRemoveBtn":"RM",
                    "maxConcurrent":"Max Concurrency",
                    "passWord":"Password",
                    "passWordSure":"Confirm",
                    "mark":"Mark",
                    "create":"Create User",
                    "passWordTip":"Two times the password is not consistent",
                    "userCreateUser":"Create",
                    "userCreating":"Creating User.",
                    "powerModify":"Modify",
                    "powerModifying":"Power Modifying"
                },
                "RdsInfoIpModalPage":{
                    "title":"Database account",
                    "power":"Authority"
                },
                "RdsInfoResetPassWordModalPage":{
                    "titlePart1":"Rearrange Accounts",
                    "titlePart2":"Password",
                    "newPassword":"New",
                    "passwordSure":"Confirm",
                    "passwordTip":"Two times the password is not consistent",
                    "modify":"Modify",
                    "modifying":"Modify Execution",
                    "passwordModifyFailedTip":"Password modification success",
                    "passwordModifySuccessTip":"Password modification failed"
                },
                "RdsInfoIpModalPage":{
                    "title":"Database Account",
                    "power":"Authority"
                },
                "RdsinfoRemarkPage":{
                    "title":"Database Account",
                    "mark":"Mark",
                    "modifyBtn":"Modify",
                    "modifyingBtn":"Modifying"
                },
                "RdsInfoDeleteUserPage":{
                    "title":"If delete user ",
                    "ok":"Ok",
                    "cancel":"Cancel"
                },
                "RdsinfoResMonitorPage":{
                    "tab2":"InnoDB Cache",
                    "hour":"hour",
                    "oneHour":"One Hour",
                    "threeHours":"Three Hours",
                    "oneDay":"One Day",
                    "sevenDay":"Seven Days",
                    "oneMonth":"One Month"
                },
                "RdsInfoBackupsPage": {
                    "doBackup":"execute backup",
                    "backupListTab": "Backup List",
                    "backupConfigTab": "Backup Settings",
                    "saveDays": "Retention Days",
                    "backupcCycle": "Backup Cycle",
                    "backupTimes": "Backup Time",
                    "nextBackup": "Next Backup Time",
                    "day": "Day",
                    "tip":"The starting time is not greater than the end time",
                    "backupListSelect":"Select Time Range",
                    "backupListTo":"To",
                    "backupListFind":"Query",
                    "tableTime":"Start/End",
                    "tableStrategy":"Backup Strategy",
                    "tableSize":"Backup Size",
                    "tableFunction":"Backup Function",
                    "tableType":"Backup Type",
                    "tableModal":"Working Mode",
                    "tableStatus":"Status",
                    "tableTip":"No data, to create",
                    "exportBackup":"export",
                    "lastExportTime":"last export time",
                    "downloadBackupFile":"download backup file",
                    "rebuildBackupFile":"rebuild",
                    "notifyExportBackupFileSuccess":"backup file is downloading,please execute export in {time}.(you could execute export {count} times today)",
                    "notifyExportBackupFileDoing":"since backup file is  downloading, please retry later",
                    "notifyDoBackupSuccess":"backup success",
                },
                "langRdsInfoSqlAuditPage":{
                    "DML":"DML",
                    "DDL":"DDL",
                    "sql":"sql",
                    "analyseSql":"analyse sql",
                    "createSqlAudit":"create",
                    "executeSql":"execute sql",
                    "sendToDBA":"send to DBA",
                    "notifySqlExecuteSuccess":"sql execute successfully",
                    "executeUser":"executer",
                    "executeTime":"execute time",
                    "errorMsgTitleInvalid":"value of title is invalid",
                    "sqlAuditDetail":"sql audit detail",
                    "sqlAuditScript":"sql script",
                    "sqlAnalysisResult":"analysis result",
                    "notifySqlSendToDBASuccess":"send to DBA successfully",
                    "auditFailMsg":"reject reason"
                },
                "sideMenuPage":{
                    "rdsView":"RDS Overview",
                    "rdsList":"RDS List",
                    "return":"return",
                    "baseInfo":"Base Info",
                    "userManger":"Account",
                    "resMonitor":"Res Monitor",
                    "backup":"Backup",
                    "rdsMenuTitle":"RDS Data",
                    "sqlAudit": "sql audit"
                },
                "headerRdsPage":{
                    "return":"Return Old",
                    "help":"Help Center",
                    "exit":"Exit",
                    "tipSwitchSuccess":"You have switched to",
                    "tipSwitchFailed":"Switch area failed",
                    "tipAreaListGetFailed":"Area list loading failed"
                },
                "RdsinfoIpAlert":{
                    "titleAdd":"Add IP",
                    "titleDelete":"If delete IP",
                    "cancel":"Cancel",
                    "ok":"OK",
                    "delete":"Delete"
                }
            }
            return service;
    }]);
    return modular;
});