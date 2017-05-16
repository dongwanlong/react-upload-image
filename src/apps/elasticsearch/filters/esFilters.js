/**
 * Created by dongwanlong on 2016/4/7.
 */
define(['./app.filter'], function (filterModule) {

    filterModule.filter('esStatusFilter', ['LanguageService',function (LanguageService) {
        return function (status) {
            if(status=='DEFAULT'){
                return LanguageService.common.filters.esStatusFilter.DEFAULT;//未审核
            }else if(status=='RUNNING'){
                return LanguageService.common.filters.esStatusFilter.RUNNING;//运行中
            }else if(status=='BUILDDING'){
                return LanguageService.common.filters.esStatusFilter.BUILDDING;//创建中
            }else if(status=='BUILDFAIL'){
                return LanguageService.common.filters.esStatusFilter.BUILDFAIL;//创建失败
            }else if(status=='AUDITFAIL'){
                return LanguageService.common.filters.esStatusFilter.AUDITFAIL;//审核失败
            }else if(status=='ABNORMAL'){
                return LanguageService.common.filters.esStatusFilter.ABNORMAL;//异常
            }else if(status=='NORMAL'){
                return LanguageService.common.filters.esStatusFilter.NORMAL;//正常
            }else{
                return status;
            }
        }
    }
    ]);
});