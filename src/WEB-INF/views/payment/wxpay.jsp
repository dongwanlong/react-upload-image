<%@ page language="java" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<c:set var="ctx" value="${pageContext.request.contextPath}"/>
<!DOCTYPE html>
<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
  <meta name="renderer" content="webkit">
  <title>支付-乐视云平台</title>
  <meta name="Keywords" content="乐视云计算，云计算，VaaS，视频存储，免费空间，企业视频，云主机，开放平台">
  <link rel="shortcut icon" href="http://i3.letvimg.com/lc05_lecloud/201601/12/10/21/favicon.ico">
  <link rel="stylesheet" href="/stylesheets/home/common.css">
  <link rel="stylesheet" href="/stylesheets/home/style.css">
</head>
<body>
<input type="text" class="hide" value="${money}" id="needPay">
<input type="text" class="hide" value="${accountMoney}" id="accountMoney">
<div class="main-body">
  <div class="paycomplete">
    <div class="paytitle">
      <div class="title">乐视云计算支付状态</div>
      <p class="shortline"></p>
    </div>
    <div class="WeChatQR_Buttom" style="border:none">
        <div class="WeChatPay">
            <img src="${ctx}/images/home/WeChatPay_Right.png" ><span>微信支付</span>
        </div>
        <div class="WeChat_Line"><img src="${ctx}/images/home/WeChat_Line.png"></div>
        <div class="WeChat_Money">
            ￥&nbsp;<span>${money}</span>
        </div>
        <div id="WeChat_Box">
            <img alt="二维码" id="qrcodeImage" src="${ctx}/pay/qrcodeImage/${orderNum}?pattern=2&accountMoney=${accountMoney}">
            <div id="WeChatRefresh" style="display:none;">
                <div class="WeChat_mask"></div>
                <div class="WeChat_wrap"><p>二维码已失效<br>请点击刷新</p></div>
            </div>
        </div>
        <input type="hidden" id="corderId" value="${orderNum}">
        <div style="width:220px;height:2px;margin:0 auto;" id="code"></div>
        <div class="WeChat_Line WeChat_Line_MarginTop">
            <img src="${ctx}/images/home/WeChat_Line.png">
        </div>
        <div class="WeChat_PlayCode">
            <img src="${ctx}/images/home/WeChat_Scan.png"><span>请使用微信扫码支付</span>
        </div>
    </div>
  </div>
</div>
<script src="/javascripts/vendor/jquery-1.11.3.js"></script>
<script src="${ctx}/javascripts/page/payment.js"></script>
<script type="text/javascript">
var _timer = null;
var INTERVAL = 3000;
var repeatCount = 0;
function fStartPoll(fFuc){
    _timer = setInterval(function() {
        fFuc && fFuc();
    }, INTERVAL);
}
function fClearPoll(){
    clearInterval(_timer);
    _timer = null;
}
function fFuc(){
  var ordernum=$("#corderId").val();
  var accountM=$('#accountMoney').val();
  var needpay=$('#needPay').val();
  if(repeatCount<20){
    $.ajax({
        type : "GET",
        url : "/pay/queryStat/"+ordernum,
        success : function(data) {  
          if(data.result==1){//已支付
            window.location.href='/payment/success/'+ordernum;//跳转
          }
        }
     });
     repeatCount ++;
  }else{
    fClearPoll();
    $("#WeChatRefresh").css('display', 'block');
    $("#WeChatRefresh").unbind('click').click(function(){
        $("#qrcodeImage").attr("src","${ctx}/pay/qrcodeImage/"+ordernum+"?pattern=2&accountMoney="+accountM+"&"+Math.random());
        $("#WeChatRefresh").css('display','none');
        repeatCount = 0;
        fStartPoll(fFuc);
    });
  }
}
$(function () {
  fStartPoll(fFuc);
});
</script>
</body>
</html>