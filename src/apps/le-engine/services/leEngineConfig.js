/**
 * Created by dongwanlong on 2016/7/28.
 */
define(['./app.service'], function (serviceModule) {
    serviceModule.factory('leEngineConfig', ['LanguageService',function (LanguageService) {
        var config = {};
        var lang = LanguageService.common.services;
        config.urls = {
            repertory_create:'/v1/cloud/imagegroups',
            repertory_list:'/v1/cloud/imagegroups?type={type}&pageindex={pageindex}&pagecap={pagecap}',
            repertory_single:'/v1/cloud/imagegroups/{imagegroupid}',
            repertory_search:'/v1/cloud/imagegroups/search?type={type}&pageindex={pageindex}&pagecap={pagecap}&key={key}',
            repertory_permissions:'/v1/cloud/imagegroups/{imagegroupid}/mypermissions/list',

            mirror_create:'/v1/cloud/images?imagegroupid={imageGroupId}',
            mirror_list:'/v1/cloud/images?imagegroupid={imageGroupId}&type={type}&pageindex={pageindex}&pagecap={pagecap}',
            mirror_list_all:'/v1/cloud/images?imagegroupid={imageGroupId}&type=all&pageindex=0&pagecap=1',
            mirror_list_edit:'/v1/cloud/imagegroups/{imageGroupId}',
            mirror_details:'/v1/cloud/images/{imageid}',
            mirror_tag_list:'/v1/cloud/images/{imageid}/tags?limit=-1&list={list}',
            mirror_edit:"/v1/cloud/images/{imageid}",
            mirror_tag_history:"/v1/cloud/images/tags/{tagid}/historys",
            mirror_tag_unique:'/v1/cloud/images/tags/historys/{UniqueIdentification}/logs?start={start}&offset={offset}',
            mirror_tag_create:"/v1/companion/images/{imageid}/build?buildtoken={buildtoken}&nocache={nocache}&mvncache={mvncache}",
            mirror_activity:"/v1/cloud/activitys?sourcetype=1&sourceid=1&pageindex=1&pagecap=20",
            mirror_search:'/v1/cloud/images/search?imagegroupid={imageGroupId}&type={type}&pageindex={pageindex}&pagecap={pagecap}&key={key}',
            mirror_delete:'/v1/cloud/images/{imageid}',

            users_list:'/v1/cloud/users/list',
            user_info:'/v1/cloud/users?username={username}',

            ci_details:'/v1/cloud/ci/{ciid}',
            ci_delete:'/v1/cloud/ci/{ciid}',
            ci_historys_list:'/v1/cloud/ci/{ciid}/historys',
            ci_historys_create:'/v1/companion/ci/{ciid}/build?buildtoken={buildtoken}&nocache={nocache}&mvncache={mvncache}&tag={tag}',
            ci_historys_log:'/v1/cloud/ci/historys/{UniqueIdentification}/logs?start={start}&offset={offset}',


            // 仓库成员url
            imagegroup_member_list:'/v1/cloud/imagegroups/{imagegroupid}/members/list',
            imagegroup_member_add:'/v1/cloud/imagegroups/{imagegroupid}/members/add',
            imagegroup_member_auth_edit:'/v1/cloud/imagegroups/{imagegroupid}/members/set',
            imagegroup_member_delete:'/v1/cloud/imagegroups/{imagegroupid}/members/remove?userid={userid}',
            imagegroup_member_leave:'/v1/cloud/imagegroups/{imagegroupid}/members/leave',

            // 镜像成员url
            image_member_list:'/v1/cloud/images/{imageid}/members/list',
            image_member_add:'/v1/cloud/images/{imageid}/members/add',
            image_member_auth_edit:'/v1/cloud/images/{imageid}/members/set',
            image_member_delete:'/v1/cloud/images/{imageid}/members/remove?userid={userid}',
            image_member_leave:'/v1/cloud/images/{imageid}/members/leave',

            // 应用成员url
            app_member_list:'/v1/cloud/apps/{appid}/members/list',
            app_member_add:'/v1/cloud/apps/{appid}/members/add',
            app_member_auth_edit:'/v1/cloud/apps/{appid}/members/set',
            app_member_delete:'/v1/cloud/apps/{appid}/members/remove?userid={userid}',
            app_member_leave:'/v1/cloud/apps/{appid}/members/leave',

            // CI成员url
            ci_member_list:'/v1/cloud/ci/{ciid}/members/list',
            ci_member_add:'/v1/cloud/ci/{ciid}/members/add',
            ci_member_auth_edit:'/v1/cloud/ci/{ciid}/members/set',
            ci_member_delete:'/v1/cloud/ci/{ciid}/members/remove?userid={userid}',
            ci_member_leave:'/v1/cloud/ci/{ciid}/members/leave',

            repertory_activity_list:'/v1/cloud/imagegroups/{imagegroupid}/activitys?pageindex={pageindex}&pagecap={pagecap}',
            mirror_activity_list:'/v1/cloud/images/{imageid}/activitys?pageindex={pageindex}&pagecap={pagecap}',
            app_activity_list:'/v1/cloud/apps/{appid}/activitys?pageindex={pageindex}&pagecap={pagecap}',
            ci_activity_list:'/v1/cloud/ci/{ciid}/activitys?pageindex={pageindex}&pagecap={pagecap}',

            app_search:'/v1/cloud/apps/search?type={type}&pageindex={pageindex}&pagecap={pagecap}&key={key}',
            app_list:'v1/cloud/apps?type={type}&pageindex={pageindex}&pagecap={pagecap}',
            app_create:'v1/cloud/apps',
            app_delete:'v1/cloud/apps/{appid}',
            app_edit:'v1/cloud/apps/{appid}',
            app_cell_list:'v1/cloud/apps/{appid}/cells',
            app_apply:'v1/cloud/apps/apply?version={version}&cellid={cellid}&appid={appid}&force={force}',
            apper_list:'v1/cloud/apps/{appid}/versions/list?cellid={cellid}&pageindex={pageindex}&pagecap={pagecap}',
            apper_delete:'v1/cloud/apps/versions/{versionid}',
            apper_detail:'v1/cloud/apps/versions/{versionid}?detail={detail}',
            apper_create:'v1/cloud/apps/{appid}/versions/{versionname}/apply?cellid={cellid}&podcount={podcount}&force={force}',
            pod_list:'v1/cloud/apps/versions/{versionid}/pods/list',
            pod_list_cell:'/v1/cloud/apps/{appid}/pods/list?cellid={cellid}',
            pod_count:'v1/cloud/apps/versions/{versionid}/podscale?count={count}',
            pod_detail:'v1/cloud/apps/versions/{versionid}/pods/{podname}/detail',
            pod_log:'v1/cloud/apps/{appid}/pods/{podname}/logs?cellid={cellid}&timestamp=0&limit=1024',
            pod_delete:'/v1/cloud/apps/{appid}/pods/{podname}?cellid={cellid}',
            services:'v1/cloud/apps/{appid}/services?cellid={cellid}',
            services_delete:'v1/cloud/apps/{appid}/services/{servicename}?cellid={cellid}',
            app_event_list:'v1/cloud/apps/{appid}/events?type={type}&kind={kind}&name={name}&limit={limit}',
            slb_list:'v1/cloud/apps/{appid}/loadbalance/status',
            slb_group_list:'v1/cloud/loadbalance/groups/list',
            app_slb_log:'v1/cloud/apps/{appid}/loadbalance/info',
            app_alert_rules:'/v1/cloud/alert/apps/{appid}/list?pageindex={pageindex}&pagecap={pagecap}',
            app_alert_search_rules:'/v1/cloud/alert/apps/{appid}/search?pageindex={pageindex}&pagecap={pagecap}&name={name}',
            app_alert_create:'/v1/cloud/alert/apps/{appid}',
            app_alert_update:'/v1/cloud/alert/apps/{appid}/alert/{alertid}',
            app_alert_delete:'/v1/cloud/alert/apps/{appid}/alert/{alertid}',
            app_alert_history:'/v1/cloud/alert/apps/{appid}/history?pageindex={pageindex}&pagecap={pagecap}&starttime={starttime}&endtime={endtime}&name={name}',

            //监控
            monitor_app:'/v1/cloud/monitor/apps/{appid}/?type={type}&lasttime={lasttime}&grouptime={grouptime}',
            monitor_pod:'/v1/cloud/monitor/apps/{appid}/pod/{podname}/?type={type}&lasttime={lasttime}&grouptime={grouptime}',

            //permissions
            imagegroup_permissions:'/v1/cloud/imagegroups/{imagegroupid}/mypermissions/list',
            image_permissions:'/v1/cloud/images/{imageid}/mypermissions/list',
            app_permissions:'v1/cloud/apps/{appid}/mypermissions/list',
            ci_permissions:'/v1/cloud/ci/{ciid}/mypermissions/list',

            //ci
            ci_list:'/v1/cloud/ci?type={type}&pageindex={pageindex}&pagecap={pagecap}',
            ci_create:'/v1/cloud/ci',
            ci_edit:'/v1/cloud/ci/{ciid}',
            ci_search:'/v1/cloud/ci/search?type={type}&pageindex={pageindex}&pagecap={pagecap}&key={key}',

            help_info:'/v1/cloud/helper/permissions?type={type}',

            //third party
            region_list: '/v1/companion/regions/list?boss={boss}',
            company_list: '/v1/companion/company/list'
        };
        config.REGEX = {
            NAME_LE_ENGINE:/^[a-z0-9](?:-*[a-z0-9])*(?:[._][a-z0-9](?:-*[a-z0-9])*)*$/,
            NAME_MIRROR_NAME:/^[a-z0-9](?:-*[a-z0-9])*(?:[._][a-z0-9](?:-*[a-z0-9])*)*$/,
            NAME_CI:/^[\S]{4,64}$/,
            NAME_APP_NAMESPACE :/^[a-z0-9]([-a-z0-9]{0,60}[a-z0-9]|)$/,
            NAME_LE_ENGINE_NECESSARY :/^[\s\S]{1,255}$/,
            NAME_APP_SSHPASSWORD:/^((?=.*[0-9].*)(?=.*[A-Z].*)(?=.*[a-z].*)(?=.*[-!@#$%^&*_].*))[-!@#$%^&*_0-9A-Za-z]{6,255}$/,
            NAME_APP_HTTPS:/[a-zA-z]+:\/[^\s]* /,
            VERSION_APPER:/^[a-z0-9]([-a-z0-9]*[a-z0-9])?$/,
            APPER_EVN:/^((?!LEENGINE))[A-Za-z_][A-Za-z0-9_]*$/,
            DOMAIN_NAME:/^[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+$/,
            TAG_CI:/^[A-Za-z0-9_][A-Za-z0-9_.-]{0,127}$/,
            NAME_ALERT:/^[-\._a-zA-Z0-9]+$/,
        };
        config.REGEX_MESSAGE= {
            NAME_LE_ENGINE:lang.NAME_LE_ENGINE,
            NAME_MIRROR_NAME:lang.NAME_MIRROR_NAME,
            NAME_LE_ENGINE_NECESSARY:lang.NAME_LE_ENGINE_NECESSARY,
            NAME_APP_NAMESPACE:lang.NAME_APP_NAMESPACE,
            NAME_APP_DESCRIPTION:lang.NAME_APP_DESCRIPTION,
            NAME_APP_PORT :lang.NAME_APP_PORT,
            NAME_APP_HTTPS:lang.NAME_APP_HTTPS,
            NAME_APP_COMPANY:lang.NAME_APP_COMPANY,
            NAME_APP_SSHPASSWORD:lang.NAME_APP_SSHPASSWORD,
            NAME_APPER_VERSIONNAME:lang.NAME_APPER_VERSIONNAME,
            NAME_SLB_GROUP_SET:lang.NAME_SLB_GROUP_SET,
            VERSION_APPER:lang.VERSION_APPER,
            PODCOUNT_APPER:lang.PODCOUNT_APPER,
            DELAY_APPER:lang.DELAY_APPER,
            MEMORY_APPER:lang.MEMORY_APPER,
            SELECT_APP_MIRROR:lang.SELECT_APP_MIRROR,
            SELECT_HTTPS:lang.SELECT_HTTPS,
            SELECT_SLB_GROUP:lang.SELECT_SLB_GROUP,
            APPER_EVN:lang.APPER_EVN,
            DOMAIN_NAME:lang.DOMAIN_NAME,
            TIP_MIRROR_NAME:lang.TIP_MIRROR_NAME,
            TIP_GIT:lang.TIP_GIT,
            TIP_BRANCH:lang.TIP_BRANCH,
            TIP_MIRROR_DESCRIBE:lang.TIP_MIRROR_DESCRIBE,
            TIP_CI_DESCRIBE:lang.TIP_CI_DESCRIBE,
            TIP_MIRROR_COMPILE:lang.TIP_MIRROR_COMPILE,
            TIP_DOCKERFILE_PATH:lang.TIP_DOCKERFILE_PATH,
            TIP_CI_NAME:lang.TIP_CI_NAME,
            TIP_COMPILEFILE_PATH:lang.TIP_COMPILEFILE_PATH,
            TIP_COMPILE_PATH:lang.TIP_COMPILE_PATH,
            USER_WEXIN:lang.USER_WEXIN,
            USER_QQ:lang.USER_QQ,
            CI_DESCRIPTION:lang.CI_DESCRIPTION,
            CI_TAG:lang.CI_TAG,
            CI_CREATE_NAME:lang.CI_CREATE_NAME,
            STRING_256:lang.STRING_256,
            IMAGE_TAG_REQUIRED:lang.IMAGE_TAG_REQUIRED,
            TIP_APP_DESCRIBE:lang.TIP_APP_DESCRIBE,
            NAME_ALERT:lang.NAME_ALERT
        };


        //资源类型
        config.sourceTypes = {
            'SourceTypeActivitys':1,
            'SourceTypeCells':2,
            'SourceTypeApps':4,
            'SourceTypeAppVersions':5,
            'SourceTypeImageGroups':6,
            'SourceTypeImages':7,
            'SourceTypeMembers':10,
            'SourceTypeUsers':12,
            'SourceTypeImageTags':13,
            'SourceTypeImageTagBuildHistorys':14,
            'SourceTypeCis':15
        };

        //成员角色
        config.userLevel = {
            'AccessLevelOwner':0,
            'AccessLevelMaster':1,
            'AccessLevelDeveloper':2,
            'AccessLevelReporter':3,
            'AccessLevelGuest':4
        }

        //全部角色
        config.allRoles = [
            'Owner',
            'Master',
            'Developer',
            'Reporter',
            'Guest'
        ];

        //镜像可视级别: 0 private 1 public
        config.visibilityLevel = {
            'Private':0,
            'Public':1
        }

        //镜像创建, 初始化脚本: 
        function heredoc(fn) {
            return fn.toString().split('\n').slice(1,-1).join('\n') + '\n'
        }

        config.alertMetricOptions = {
            percent:{
                unit:'%',
                min:1,
                max:10000,
                limit:0, //输入数字精度，即保留小数点位数
                helpTxt:LanguageService.langAlertSettingModalPage.helpPercent,
            },
            memory:{
                unit:'M',
                min:1,
                max:128*1024,
                rate:1,
                limit:0, //输入数字精度，即保留小数点位数
                helpTxt:LanguageService.langAlertSettingModalPage.helpMemory,
            },
            traffic:{
                unit:'KB',
                min:1,
                limit:0, //输入数字精度，即保留小数点位数
                rate:1024,
                helpTxt:LanguageService.langAlertSettingModalPage.helpTraffic,
            },
            times:{
                min:0
            }
        }

        return config;
    }]);
});