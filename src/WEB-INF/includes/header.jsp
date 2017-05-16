    <%@ page language="java" pageEncoding="UTF-8"%>
    <div class="header">
        <a href="/index.html" class="header-brand pull-left">
            <!-- <img src="/static/images/brand-logo.png" class="brand-logo" /> -->
            <img class="brand-logo" src="http://i3.letvimg.com/lc04_lecloud/201601/12/10/22/letvcloud-logo.png">
        </a>
        <div class="header-region dropdown pull-left ">
            <a id="drop1" href="javascript:void(0);" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
                <span>北京一区</span>
                <!-- <span class="caret"></span> -->
                <input type="hidden" id="region_id" value="cn-beijing-1" />
            </a>
            <!-- <ul class="dropdown-menu" aria-labelledby="drop1">
                <li><a href="javascript:void(0);" class="active">北京一区</a></li>
                <li><a href="javascript:void(0);">北京二区</a></li>
                <li><a href="javascript:void(0);">北京三区</a></li>
                <li><a href="javascript:void(0);">北京四区</a></li>
            </ul> -->
        </div>
        <a href="/account/logout" class="header-logout pull-right">
            <span>退出</span>
        </a>
        <div class="header-separator pull-right">
            <i class="separator"></i>
        </div>
        <a href="https://lcp-uc.lecloud.com/userView/ucOverview.do" class="header-account pull-right">
            <img src="/images/nav-account.png" class="account-icon" />
            <span class="header-username"></span>
        </a>
        <a href="/helpcenter.html" class="header-help pull-right">
            <img src="/images/nav-help.png" class="help-icon" />
            <span>帮助中心</span>
        </a>
    </div>
    <input id="userId" type="text" class="hide" value="${cookie.userId.value}">
