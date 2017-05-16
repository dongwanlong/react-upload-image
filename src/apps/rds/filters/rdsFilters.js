/**
 * Created by dongwanlong on 2016/4/7.
 */
define(['./app.filter'], function (filterModule) {
    var TranslateStatus = function(status,LanguageService){
        var out = '';
        if (status == 0){
            return LanguageService.common.filters.rdsStatusFilter.unaudit;//未审核
        }else if(status == 1){
            return LanguageService.common.filters.rdsStatusFilter.running;//运行中
        }else if(status == 2){
            return LanguageService.common.filters.rdsStatusFilter.creating;//创建中
        }else if(status == 3){
            return LanguageService.common.filters.rdsStatusFilter.createFailed;//创建失败
        }else if(status == 4){
            return LanguageService.common.filters.rdsStatusFilter.auditFailed;//审核失败
        }else if(status == 5){
            return LanguageService.common.filters.rdsStatusFilter.unusual;//异常
        }else if(status == 6){
            return LanguageService.common.filters.rdsStatusFilter.usual;//正常
        }else if(status == 7){
            return LanguageService.common.filters.rdsStatusFilter.starting;//启动中
        }else if(status == 8){
            return LanguageService.common.filters.rdsStatusFilter.stoping;//停止中
        }else if(status == 9){
            return LanguageService.common.filters.rdsStatusFilter.stoped;//已停止
        }else if(status == 10){
            return LanguageService.common.filters.rdsStatusFilter.deleting;//删除中
        }else if(status == 11){
            return LanguageService.common.filters.rdsStatusFilter.deleted;//已删除
        }else if(status == 12){
            return LanguageService.common.filters.rdsStatusFilter.nonExistent;//不存在
        }else if(status == 13){
            return LanguageService.common.filters.rdsStatusFilter.danger;//危险
        }else if(status == 14){
            return LanguageService.common.filters.rdsStatusFilter.seriousDanger;//严重危险
        }else if(status == 15){
            return LanguageService.common.filters.rdsStatusFilter.disable;//禁用
        }else if(status == 19){
            return LanguageService.common.filters.rdsStatusFilter.deleteFailed;//删除失败
        }else if(status == 'FAILD'){
            return LanguageService.common.filters.rdsStatusFilter.backupFailed;//备份失败
        }else if(status == 'SUCCESS'){
            return LanguageService.common.filters.rdsStatusFilter.backupSuccess;//备份成功
        }else if(status == 'BUILDING'){
            return LanguageService.common.filters.rdsStatusFilter.backuping;//备份中
        }else if(status == 'ABNORMAL'){
            return LanguageService.common.filters.rdsStatusFilter.backupException;//备份异常
        }
        //cvm status
        else if(status == 'ACTIVE'){
            return '活跃';
        }
        else if(status == 'BUILD'){
            return '创建'
        }
        else if(status == 'PAUSED'){
            return '已暂停';
        }
        else if(status == 'SUSPENDED'){
            return '已挂起'
        }
        else if(status == 'DELETED'){
            return '已删除'
        }
        else if(status == 'SHUTOFF'){
            return '已停止'
        }
        //disk status
        else if(status == 'creating'){
            return '创建中'
        }
        else if(status == 'available'){
            return '可用的';
        }
        else if(status == 'attaching'){
            return '挂载中'
        }
        else if(status == 'in-use'){
            return '使用中'
        }
        else if(status == 'deleting'){
            return '删除中'
        }
        else if(status == 'error'){
            return '异常'
        }
        else{
            return status;
        }
        return out;
    }

    filterModule.filter('rdsStatusFilter', ['LanguageService',function (LanguageService) {
            return function (status) {
                return TranslateStatus(status,LanguageService);
            }
        }
    ]);

    filterModule.filter('rdsBackupTypesFilter', ['LanguageService',function (LanguageService) {
        return function (value) {
            if(value=="FULL"){
                return LanguageService.common.filters.rdsBackupTypesFilter.full;
            }else if(value=="INCR"){
                return LanguageService.common.filters.rdsBackupTypesFilter.incr;
            }else{
                return "";
            }
        }
    }
    ]);

    filterModule.filter('rdsLinkTypeFilter', function () {
        return function (value) {
            return value=="long"?0:1;
        }
    });

    filterModule.filter('rdsCreateProgressFilter',['LanguageService',function (LanguageService) {
        return function (value) {
                if( value == 1){
                    return LanguageService.common.filters.rdsCreateProgressFilter.environmentReadying;//环境准备中
                }else if (value > 1 && value <= 3){
                    return LanguageService.common.filters.rdsCreateProgressFilter.environmentChecking;//环境检查中
                }else if (value > 3 && value <= 6){
                    return LanguageService.common.filters.rdsCreateProgressFilter.initService;//初始化服务
                }else if (value > 6 && value < 10){
                    return LanguageService.common.filters.rdsCreateProgressFilter.createDb;//创建数据库
                }else if (value == 0 || value >= 10){
                    return LanguageService.common.filters.rdsCreateProgressFilter.createDbComplete;//创建完成
                }else if(value == -1){
                    return LanguageService.common.filters.rdsCreateProgressFilter.createFailed;//创建失败
                }else{
                    return "";
                }
            }
        }
    ]);

    filterModule.filter('rdsTransDateDifFilter', function () {
        return function (value) {
            var dateLater = new Date(value);
            dateLater.setFullYear(dateLater.getFullYear()+1);
            var timeLater = dateLater.getTime();
            var timeNow = new Date().getTime();
            return Math.floor((timeLater-timeNow)/(1000*3600*24));
        }
    });

    filterModule.filter('rdsMonitorFilter', ['LanguageService',function (LanguageService) {
        return function (value) {
                //COMDML
                if(value == "num_inserts"){
                    return LanguageService.common.filters.rdsMonitorFilter.numInserts;//平均每秒insert语句执行次数
                }else if(value == "num_deletes"){
                    return LanguageService.common.filters.rdsMonitorFilter.numDeletes;//平均每秒delete语句执行次数
                }else if(value == "num_updates"){
                    return LanguageService.common.filters.rdsMonitorFilter.numUpdates;//平均每秒update语句执行次数
                }else if(value=="num_reads"){
                    return LanguageService.common.filters.rdsMonitorFilter.numReads;//平均每秒select语句执行次数
                }
                //InnoDB
                if(value == "buf_pool_hit_rate"){
                    return LanguageService.common.filters.rdsMonitorFilter.bufPoolHitRate;//缓冲池的读命中率
                }else if(value == "buf_free"){
                    return LanguageService.common.filters.rdsMonitorFilter.bufFree;//缓冲池剩余空间
                }else if(value == "buf_pool_size"){
                    return LanguageService.common.filters.rdsMonitorFilter.bufPoolSize;//缓冲池总空间
                }
                //qps-tps
                if(value == "Commit_PS"){
                    return LanguageService.common.filters.rdsMonitorFilter.commitPs;//平均每秒事务数
                }else if(value == "QPS"){
                    return LanguageService.common.filters.rdsMonitorFilter.qps;//平均每秒SQL语句执行次数
                }else if(value == "Opens_PS"){
                    return LanguageService.common.filters.rdsMonitorFilter.opensPs;//平均每秒打开表数
                }else if(value=="Threads_PS"){
                    return LanguageService.common.filters.rdsMonitorFilter.threadsPs;//平均每秒创建连接数
                }
                else{
                    return this.name;
                }

            }
        }
    ]);
    filterModule.filter('rdsTransDbUserFilter', ['LanguageService',function (LanguageService) {
        return function (value) {
                if(value == 1){
                    return LanguageService.common.filters.rdsTransDbUserFilter.manage;//管理
                }else if(value == 2){
                    return LanguageService.common.filters.rdsTransDbUserFilter.onlyRead;//只读
                }else if(value == 3){
                    return LanguageService.common.filters.rdsTransDbUserFilter.readWirte;//读写
                }
            }
        }
    ]);

    filterModule.filter('rdsTransLastDateFilter', function () {
        return function (value) {
            var timestamp = Date.parse(new Date());
            var differDays = parseInt((timestamp-value)/(1000 * 60 * 60 * 24));
            var remainDays = 365 - differDays;
            return remainDays<0?0:remainDays;
        }
    });

    filterModule.filter('rdsBackupSetDateTimeFilter', function () {
        return function (value) {
            if(!value)return "0:00AM";
            var date = new Date(value);
            var hour = date.getHours();
            var mintue = date.getMinutes();
            if(mintue<10){mintue="0"+mintue;}
            if(hour>12){
                hour -= 12;
                return hour+":"+mintue+"PM";
            }else{
                return hour+":"+mintue+"AM";
            }
        }
    });

    filterModule.filter('rdsBackupSetDateNextTimeFilter', ['LanguageService',function (LanguageService) {
        return function (value) {
                var date = new Date(value);
                var year = date.getFullYear();
                var month = date.getMonth()+1;
                var day = date.getDate();
                var hour = date.getHours();
                var mintue = date.getMinutes();

                var lang = LanguageService.common.filters.rdsBackupSetDateNextTimeFilter;

                if(mintue<10){mintue="0"+mintue;}

                if(hour>12){
                    hour -= 12;
                    return year+lang.year+" "+month+lang.month+" "+day+lang.day+" "+hour+":"+mintue+"PM";
                }else{
                    return year+lang.year+" "+month+lang.month+" "+day+lang.day+" "+hour+":"+mintue+"AM";
                }
            }
        }
    ]);

    filterModule.filter('rdsBackupSetDateWeekFilter', ['LanguageService',function (LanguageService) {
        return function (value) {
                if(!value)return "";
                var ar = value.split(",");
                if(ar.length<=0)return "";
                var formatedArray = [];
                var lang = LanguageService.common.filters.rdsBackupSetDateWeekFilter;
                ar.forEach(function(item,index,ar){
                    if(item=="1"){
                        formatedArray.push(lang.monday);
                    }else if(item=="2"){
                        formatedArray.push(lang.tuesday);
                    }else if(item=="3"){
                        formatedArray.push(lang.wednesday);
                    }else if(item=="4"){
                        formatedArray.push(lang.thursday);
                    }else if(item=="5"){
                        formatedArray.push(lang.friday);
                    }else if(item=="6"){
                        formatedArray.push(lang.saturday);
                    }else if(item=="7"){
                        formatedArray.push(lang.sunday);
                    }else{
                    }
                });
                return formatedArray.join(",");
            }
        }
    ]);

    filterModule.filter('rdsSqlAuditAffectFilter', function () {
        return function (sqlMeta, sqlType) {
            return (sqlType === 'DML' && (sqlMeta.type === 'UPDATE' || sqlMeta.type === 'DELETE'))
            || (sqlType === 'DDL' && (sqlMeta.type === 'DROP' || sqlMeta.type === 'ALTER'))
                ? sqlMeta.tableConses.map(function (item) {
                return item.table + ': ' + item.consequence;
            }).join('; ') : '';
        }
    });

    filterModule.filter('rdsSqlAuditStatusFilter', function () {
        return function (value) {
            var status = value;
            if(status=='DEFAULT'){
                return '已保存';
            }else if(status=='EXECUTING'){
                return '执行中';
            }else if(status=='SUCCESS'){
                return '执行成功';
            }else if(status=='ERROR'){
                return '执行失败';
            }else if(status=='AUDITING'){//跟后端同学协商翻译为待审核
                return '待审核';
            }else if(status=='AUDITFAIL'){
                return '审核失败';
            }else{
                return '未知';
            }
        }
    });
});