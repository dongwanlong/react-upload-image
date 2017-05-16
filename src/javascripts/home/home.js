(function init(){

    toTop();
    customerToolInit();
})();
var timeInterval='';
//  common:监测浏览器版本
function browerversion(obj){
    var _browser=obj.getBrowserInfor();
    if(_browser.ie&&_browser.ver<9.0){
        window.location.replace="/browserError";
    }else if(_browser.firefox&&_browser.ver< 5.0){
        window.location.replace="/browserError";
    }else if(_browser.chrome&&_browser.ver< 7.0){
        window.location.replace="/browserError";
    }else if(_browser.safari&&_browser.ver<4.0){
        window.location.replace="/browserError";
    }
}
function toTop() {
    var scrollEle = clientEle = document.documentElement, toTopBtn = document.getElementById("toTop"), compatMode = document.compatMode, isChrome = window.navigator.userAgent.indexOf("Chrome") === -1 ? false : true;
    //不同渲染模式以及Chrome的预处理
    if (compatMode === "BackCompat" || isChrome) {
        scrollEle = document.body;
    }
    if (compatMode === "BackCompat") {
        clientEle = document.body;
    }
    //返回顶部按钮的点击响应（注册函数），时间间隔和高度缩减率可以调节
    toTopBtn.onclick = function() {
        var moveInterval = setInterval(moveScroll, 10);
        function moveScroll() {
            setScrollTop(getScrollTop() / 1.2);
            if (getScrollTop() === 0) {
                clearInterval(moveInterval);
            }
        }
    }
    //滚动时判断是否显示返回顶部按钮（注册函数）
    window.onscroll = function() {
        var display = toTopBtn.style.display;
        if (getScrollTop() > getClientHeight()) {
            if (display === "none" || display === "") {
                toTopBtn.style.display = "block";
            }
        } else {
            if (display === "block" || display === "") {
                toTopBtn.style.display = "none";
            }
        }
    }
    //获取和设置scrollTop
    function getScrollTop() {
        return scrollEle.scrollTop;
    }
    function setScrollTop(value) {
        scrollEle.scrollTop = value;
    }
    //获取当前网页的展示高度（第一屏高度），此处Chrome正常
    function getClientHeight() {
        return clientEle.clientHeight;
    }
};
// common:top-nav-hover
function topNavHover(){
    var _navUl=$('.nav-uls');var time='';
    var helpcenter=$('.body-helpcenter');
    $('.item-product').unbind('hover').hover(function(){ //top-nav 滑过效果
        time=setTimeout(function(){
            _navUl.slideDown('400', function() {
                if(_navUl.is(':visible')){
                    $('.item-product').children('div').removeClass('hide');
                }
                if(helpcenter.length>0){
                    helpcenter.css('height', '225px');
                }
            });
        },200);
    },function(){
        clearTimeout(time);
        if(helpcenter.length>0){
            helpcenter.css('height', '75px');
        }
        $('.item-product').children('div').addClass('hide');
        _navUl.hide();
    });
}
//common:nav-more
function navMore(){
    $('.more').unbind('hover').hover(function() {
        $(this).css({
            color: '#088ac2',
            background: '#fff'
        });
        $(this).find('a').css('color', '#088ac2');
    }, function() {
        $(this).css({
            color: '#fff',
            background: 'transparent'
        });
        $(this).find('a').css('color', '#fff');
    });
}
// index:carousels
function carousels(){
    timeInterval='';
    if(timeInterval){
    }else{
        timeInterval=setInterval(function(){
            var _targetParent=$('.carousels');
            var _target=_targetParent.children(':first');
            _target.addClass('hide').find('.carousel-content .col-md-5').removeClass('fadeIn');
            _target.find('.carousel-content .col-md-7').removeClass('slideR');
            //carousel-control change
            var preIndex=_target.attr('self-carousel-id');
            $('.carousel-control img:eq('+preIndex+')').addClass('control-short');
            _targetParent.append(_target);
            var nxtIndex=_targetParent.children(':first').attr('self-carousel-id');
            $('.carousel-control img:eq('+nxtIndex+')').removeClass('control-short');
            _targetParent.children(':first').removeClass('hide').find('.carousel-content .col-md-5').addClass('fadeIn')
            _targetParent.children(':first').find('.carousel-content .col-md-7').addClass('slideR');
        },3000);
    }
    //轮播control
    $('.carousel-control').unbind('click').click(function(event) {
        var _eTarget=event.target||event.srcElemnet;//ff && ie
        var _img='';
        if(_eTarget){
            _img=$(_eTarget)
        }else{
            _img=$(_eTarget).closest('img');
        }
        var index=_img.attr('self-carousel-id');
        var _targetParent=$('.carousels');
        var _target=_targetParent.children('.top-carousel[self-carousel-id='+index+']');
        var _targetBehindIndex=$('.top-carousel').index(_target);
        var _targetBehind=_targetParent.children('.top-carousel:gt('+_targetBehindIndex+')');
        _target.addClass('hide').find('.carousel-content .col-md-5').addClass('fadeIn');
        _target.find('.carousel-content .col-md-7').addClass('slideR');
        $('.carousel-control img:eq('+index+')').removeClass('control-short').siblings().addClass('control-short');
        _target.removeClass('hide').siblings().addClass('hide');
        _targetParent.prepend(_targetBehind);
        _targetParent.prepend(_target);
        if(timeInterval){
            clearInterval(timeInterval);
        }
        // timeInterval=setInterval(function(){
        // 	var _targetF=_targetParent.children(':first');
        // 	_targetF.addClass('hide').find('.carousel-content .col-md-5').removeClass('fadeIn');
        // 	_targetF.find('.carousel-content .col-md-7').removeClass('slideR');
        // 	//carousel-control change
        // 	var preIndex2=_targetF.attr('self-carousel-id');
        // 	$('.carousel-control img:eq('+preIndex2+')').addClass('control-short');
        // 	_targetParent.append(_targetF);
        // 	var nxtIndex=_targetParent.children(':first').attr('self-carousel-id');
        // 	$('.carousel-control img:eq('+nxtIndex+')').removeClass('control-short');
        // 	_targetParent.children(':first').removeClass('hide').find('.carousel-content .col-md-5').addClass('fadeIn')
        // 	_targetParent.children(':first').find('.carousel-content .col-md-7').addClass('slideR');
        // },2000);
    });
}
function carouselFocus(){
    $('.carousel-control img').mouseenter(function() {
        clearInterval(timeInterval);
    }).mouseleave(function() {
        //打开定时器-自动
        carousels()
    });
    $('.carousels').mouseenter(function(event) {
        clearInterval(timeInterval);
    }).mouseleave(function(event) {
        carousels()
    });
    carousels()
}
// products:scroll-nav
function scrollNav(sheight){
    var scrollh=document.body.scrollHeight;
    // var scrollh=$(document).height();
    $(window).scroll(function(){
        var vtop=$(this).scrollTop();
        var height=$(this).height();
        var _target=$('.tab-fixed')
        if(vtop>=sheight){
            $('.tab-layout').addClass('hide');
            var _tabClone=$('.tab-layout').children().clone();
            if(_target.children().length>0){
            }else{
                _target.append(_tabClone)
            }
            _target.removeClass('hide');
            var tempH=vtop+height;
            if(tempH+232>=scrollh){//到底部
                _target.children().children('div:eq(3)').addClass('active-item').siblings().removeClass('active-item');
            }else{
                if(vtop>=2077){
                    _target.children().children('div:eq(2)').addClass('active-item').siblings().removeClass('active-item');
                }else if(vtop>=1097){
                    _target.children().children('div:eq(1)').addClass('active-item').siblings().removeClass('active-item');
                }else{
                    _target.children().children('div:eq(0)').addClass('active-item').siblings().removeClass('active-item');
                }

            }
        }else{
            var _tabClone='';
            if(_target.children().length>0){
                _tabClone=_target.children().clone();
                $('.tab-layout').html(_tabClone);
            }
            $('.tab-layout').removeClass('hide');
            _target.addClass('hide');
            _target.children().remove();
        }
    });
}
// helpcenter:scroll-nav
function helpScrollNav(sheight){
    var scrollh=document.body.scrollHeight;
    $(window).scroll(function(){
        var vtop=$(this).scrollTop();
        var height=$(this).height();
        var _target=$('.tab-fixed');
        if(vtop>=sheight){
            $('.tab-layout').addClass('hide');
            var _tabClone=$('.tab-layout').children().clone();
            if(_target.children().length>0){
            }else{
                _target.append(_tabClone)
            }
            _target.removeClass('hide');
            var tempH=vtop+height;
            if(tempH+90>=scrollh||vtop>=1700){//到底部
                _target.children('div:eq(5)').addClass('active-item').siblings().removeClass('active-item');
            }else{
                if(vtop>=1380){
                    _target.children('div:eq(4)').addClass('active-item').siblings().removeClass('active-item');
                }else if(vtop>=1000){
                    _target.children('div:eq(3)').addClass('active-item').siblings().removeClass('active-item');
                }else if(vtop>=800){
                    _target.children('div:eq(2)').addClass('active-item').siblings().removeClass('active-item');
                }else if(vtop>=570){
                    _target.children('div:eq(1)').addClass('active-item').siblings().removeClass('active-item');
                }else{
                    _target.children('div:eq(0)').addClass('active-item').siblings().removeClass('active-item');
                }

            }
        }else{
            var _tabClone='';
            if(_target.children().length>0){
                _tabClone=_target.children().clone();
                $('.tab-layout').html(_tabClone);
            }
            $('.tab-layout').removeClass('hide');
            _target.addClass('hide');
            _target.children().remove();
        }
    });
}
//products:tab-click
function tabClick(){
    $('.top-product-tab').unbind('click').click(function(event) {
        event.preventDefault();
        var _etarget=event.target||event.srcElement;
        var _target=$(_etarget).closest('.tab-item');
        _target.addClass('active-item').siblings().removeClass('active-item');
        var _tabClone=$(this).children().clone();
        if($('.tab-fixed').children().length>0){
        }else{
            $('.tab-fixed').append(_tabClone);
        }
        var _anchor=_target.children('a').attr('href');
        var _top=$(_anchor).offset();
        if(_top){
            // $('html, body').animate({
            // 	scrollTop:$(_anchor).offset().top
            // },500);
            $('html, body').scrollTop($(_anchor).offset().top)
            return false;
        }else{
            window.location.hash='#anchor-andvantage';
            // $('body').animate({
            // 	scrollTop:720
            // }, 500)
            $('html, body').scrollTop(720)
        }
    });
}
//获取浏览器缓存
function getCookie(name){
    var arr=document.cookie.split('; ');

    for(var i=0; i<arr.length; i++){
        var arr2=arr[i].split('=');
        if(arr2[0]==name){
            return arr2[1];
        }
    }
    return '';
}
//home&product logged
function iflogged(){
    var _target=$('.nav-more');
    var matrix_cookie=getCookie('matrix_uc_cookie');
    if(matrix_cookie){//logged
        var username=getCookie('userName');
        $('.logged').removeClass('hide').find('.logged-name').text(username);
        var userimg=getCookie('headPortrait');
        if(userimg){//has img
            $(".logged .icon-my").addClass('hide').next().children('img').attr('src',userimg).removeClass('hide')
        }else{
            $.ajax({
                url:'/user',
                type:'get',
                cache:false,
                success:function(data){
                    if(data.result==0){//未登录
                        _target.removeClass('hide');
                        $('.logged').addClass('hide');
                    }else{
                        _target.addClass('hide');
                        if(data.data.userAvatar){
                            $(".logged .icon-my").addClass('hide').next().children('img').attr('src',data.data.userAvatar).removeClass('hide')
                        }else{
                            $(".logged .account-img").addClass('hide').parent().prev().removeClass('hide');
                        }
                    }
                }
            }); 
        }
    }else{//not logged
        _target.removeClass('hide');
        $('.logged').addClass('hide');
    }   
}
function customerToolInit() {
    var brands={
        'lantv':'中国蓝提供广电云服务，助力浙广向新媒体转型/;乐视云计算为中国蓝TV提供一体化新媒体服务，提高工作效率，节省带宽成本。',
        'huashutv':'致力于打造新媒体平台/;CDN解决方案，为华数提供流畅、稳定、快速的网络加速保障以及安全保障，使用户无论在何时何地都能观看流畅高清视频。乐视云以稳定充足的带宽保障，快速有效运维保障，提高了服务质量，节省了各类维护成本。',
        'JD':'打造专业的综合网上购物商城/;乐视云计算是一个专业的平台，是京东商城值得信赖的合作伙伴。',
        'TB':'中国最大的个人网上交易社区(C2C),作为专业的购物网站拥有全球时尚前沿的消费者购物集市/;使用乐视云计算云视频解决方案，乐视云作为淘宝服务商，为天猫及淘宝广大卖家提供视频上传、存储、转码以及播放的服务。通过视频的展示，丰富的卖家店铺，也提升了商品销量。',
        'DD':'知名的综合性网上购物商城/;使用乐视云计算云视频解决方案，乐视云为当当提供集拍摄、上传、转码、存储、分发、播放等全流程一体化的技术服务。同时视频的真实拍摄，为用户的选择提供真实参考，更好表现商品，提高商品转化率。',
        'lemall':'乐视TV自营的B2C电视垂直类购物网站/;使用乐视云计算关系型数据库服务，多主架构、稳定高效，节约成本，提高商品转化率。',
        'BW':'中国儿童成长第一门户/;乐视云视频助力贝瓦网，为亿万儿童提供多姿多彩的快乐童年，提高了自产内容的衍生价值，节省了技术和人员的成本投入，视频的全景呈现，提升了用户体验，专注视频内容的极致清晰流畅体验，为用户的观赏更加真实。',
        'JH':'京翰教育是K12中小学教育，目前处于线下转线上的阶段/;乐视云服务既满足现有业务需求的情况下，又满足防盗链、视频加密又未来对点播业务的需求。乐视云视频，使用播放器定制，自主品牌LOGO及水印，API上传及管理功能，防盗链功能，提升品牌价值，实现多终端播放。',
        'GSX':'跟谁学是一个O2O找好老师学习服务教育平台/;乐视云视频从上传、转码、存储及分发的整套视频解决方案节省技术投入成本，API接口快速实现视频的上传及管理功能。提供流畅，清晰的视频播放体验。',
        'DJ':'党建网/;共青团中央需要稳定快速的一体化的视频平台，试用乐视云一体化的云视频解决方案，解决传转存发播的一系列题。提高工作效率，节省各类成本。',
        'ledisk':'乐视云盘是乐视网用户精心打造的一项智能云服务/;乐视云计算为云盘用户提供数据存储服务，多主架构、稳定高效，节约成本，数据安全可靠。'
    };
    (function tooltip(){
        $(".customer-logos div.logo").click(function() {
            $(".customer-logos div.logo").removeClass('logo-focus');
            $(this).addClass("logo-focus");
            var img=$(this).find('img').attr('src');
            $(this).siblings('div.customer-hoverTip').find('.tipImg').find('img').attr('src',img);
            var brand=$(this).attr('self-customer-brand');
            var branddesc=brands[brand];
            var branddescArray=branddesc.split('/;');
            $(this).siblings('div.customer-hoverTip').find('.hoverTip-title').text(branddescArray[0]);
            $(this).siblings('div.customer-hoverTip').find('.hoverTip-desc').text(branddescArray[1]);
        });
    })();
    (function tabinit(){
        $(".customer-tab div").click(function() {
            $(".customer-tab div").removeClass('active');
            $(this).addClass("active");
            var customerType=$(this).attr('self-customer-tab');
            $('.customer-logos[self-customer-type='+customerType+']').removeClass('hide').siblings('.customer-logos').addClass('hide');
            $('.customer-logos[self-customer-type='+customerType+']').children('.logo:first').addClass('logo-focus').siblings('.logo').removeClass('logo-focus');
            var _target=$('.logo.logo-focus:visible');
            var img=_target.find('img').attr('src');
            var brand=_target.attr('self-customer-brand');
            var _change=_target.siblings('.customer-hoverTip');
            var branddesc=brands[brand];
            var branddescArray=branddesc.split('/;');
            _change.find('img').attr('src',img);
            _change.find('.hoverTip-title').text(branddescArray[0]);
            _change.find('.hoverTip-desc').text(branddescArray[1]);
        });
    })();
}
// help:帮助中心初始化事件
function helpInite(){
    var minheight=document.documentElement.clientHeight-275;
    $('.helpcenter-center').css('min-height',minheight);
    // 菜单事件
    $('.menu-parent').unbind('click').click(function(event) {
        if($(this).hasClass('open')){
            $(this).removeClass('open').children('i').css({
                transform: 'rotate(-90deg)',
                transition: 'transform .2s ease-in'
            });
        }else{
            $(this).addClass('open').children('i').css({
                transform: 'rotate(0deg)',
                transition: 'transform .2s ease-in'
            });
        }
        var submenu=$(this).attr('self-menulink');
        var _subtarget=$('.menu-sub.'+submenu);
        if(_subtarget.is(':visible')){
            _subtarget.addClass('hide')
        }else{
            _subtarget.removeClass('hide')
        }
    });
    //子菜单点击
    // $('.menu-sub').unbind('click').click(function(event) {
    // 	var _target=$(event.target||event.srcElement).closest('li');
    // 	if(_target.hasClass('active')){

    // 	}else{
    // 		_target.addClass('active').siblings().removeClass('active')
    // 	}
    // 	var _targetPage=_target.attr('self-menu-detailPage');
    // 	$('.helpcenter-center').load(_targetPage+'.html');
    // });
}
//index:canvas
function clock(){
    var canvas=document.getElementById('canvas');
    canvas.height=54;
    canvas.width=54;
    var ctx=canvas.getContext("2d");

    ctx.lineWidth=4;
    ctx.shadowBlur=3;
    ctx.shadowOffsetX=3;
    ctx.shadowColor="rgba(0,0,0,.2)";
    ctx.strokeStyle="#f5c131";
    ctx.beginPath();
    ctx.arc(canvas.width/2,canvas.height/2,22,0,2*Math.PI);
    ctx.stroke();
    ctx.save();

    var date=new Date();
    var min=date.getMinutes();
    var sec=date.getSeconds();

    ctx.translate(canvas.width/2,canvas.height/2);
    ctx.lineCap="round";
    ctx.rotate(min*(Math.PI/30)+(Math.PI/1800)*sec);
    ctx.beginPath();
    ctx.moveTo(-5,0);
    ctx.lineTo(12,0);
    ctx.stroke();
    ctx.restore();
    ctx.save();

    ctx.translate(canvas.width/2,canvas.height/2);
    ctx.lineCap="round";
    ctx.rotate(sec*(Math.PI/30));
    ctx.beginPath();
    ctx.moveTo(-5,0);
    ctx.lineTo(15,0);
    ctx.stroke();
    ctx.restore();
    ctx.save();
}