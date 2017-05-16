var redirects={
    '2':'/cvm/#/vm',
    '3':'/cvm/#/vm-disk',
    '4':'/cvm/#/vm-floatIP',
    '5':'/cvm/#/vm-router',
    'renew':'https://lcp-uc.letvcloud.com/uc/renew/getRenewView.do'
};
//余额选择
function remainChose(){
    $('.self-checkbox').unbind('click').click(function(event) {
        var _target=$(this);
        if(_target.hasClass('active')){
            // $('.remainInput').addClass('hide');
            $('.remainInput').css({
                transform:'translateY(-40px)',
                opacity:0,
                position:'absolute',
                transition:'all .5s ease-in',
            });
            _target.removeClass('active');
        }else{
            _target.addClass('active');
            // $('.remainInput').removeClass('hide')
            $('.remainInput').css({
                transform:'translateY(0px)',
                opacity:1,
                position:'relative',
                transition:'all .5s ease-in',
            });
        }
        alloptionsHandle();
    });
};
//余额支付金额校验，非负、不可大于订单金额，不可大于余额金额
function moneyInputVali(){//老方法
    var flag=false;
    var _target=$('.remainPay');
    var _paybtn=$('#pay');
    var _errordesc=$('.error-desc');
    var reg=/^-?\d+(\.\d{1,2})?$/;
    var remain=orderDetail();
    remain.done(function(){
        // var orderPaynum=Number($('#orderpay').text().substring(1));//订单金额
        var orderPaynum=$('#orderpay').text();
        var remain=$('.remain').text().substring(1);
        var compare=(orderPaynum>remain)?remain:orderPaynum;
        _target.unbind('change').change(function(event){
            var money=_target.val();
            if(money){
                if(reg.test(money)){
                    if(money<0){
                        _target.addClass('has-error');
                        _errordesc.text('输入不合法数字！请输入两位小数');
                        _errordesc.removeClass('hide');
                        _paybtn.attr('disabled', 'true');
                    }else{
                        if(money>compare){
                            _target.addClass('has-error');
                            _errordesc.text('支付金额有问题！');
                            _errordesc.removeClass('hide');
                            _paybtn.attr('disabled', 'true');
                        }else{
                            if(money==compare&&money==orderPaynum){//fit
                                $('.payoption').removeClass('active');
                            }else{
                                $('.payoption:eq(0)').addClass('active'); 
                            }
                            _target.removeClass('has-error');
                            _errordesc.addClass('hide');
                            _paybtn.removeAttr('disabled');
                            flag=true;
                        }
                    }
                }else{//不是数字
                    _target.addClass('has-error');
                    _errordesc.text('输入不合法数字！请输入两位小数');
                    _errordesc.removeClass('hide');
                    _paybtn.attr('disabled', 'true');
                }
            }else{
                if($('.self-checkbox').hasClass('active')){
                    _target.addClass('has-error');
                    _errordesc.text('输入不合法数字！请输入两位小数');
                    _errordesc.removeClass('hide');
                    _paybtn.attr('disabled', 'true'); 
                }else{
                    flag=true;
                    _target.removeClass('has-error');
                    _errordesc.addClass('hide');
                    _paybtn.removeAttr('disabled')
                }
            } 
            return flag;
        });
    })
};
function moneyInput(){
    var flag=false;
    var _target=$('.remainPay');
    var _paybtn=$('#pay');
    var _errordesc=$('.error-desc');
    var reg=/(^([1-9]\d*)(\.\d{1,2})?$)|(^0\.0[1-9]$)|(^0\.[1-9]\d*$)/;
    // var orderPaynum=Number($('#orderpay').text().substring(1));//订单金额
    var orderPaynum=Number($('#orderpay').text());
    var remain=Number($('.remain').text().substring(1));
    var compare=(orderPaynum>remain)?remain:orderPaynum;
    var money=_target.val();
    if(money){
        if(reg.test(money)){
            if(money<0){
                _target.addClass('has-error');
                _errordesc.text('输入不合法数字！请输入两位小数');
                _errordesc.removeClass('hide');
                $('.payoption').removeClass('active');
                _paybtn.attr('disabled', 'true');
            }else{
                if(money>compare){
                    _target.addClass('has-error');
                    _errordesc.text('支付金额有问题！');
                    _errordesc.removeClass('hide');
                    $('.payoption').removeClass('active');
                    _paybtn.attr('disabled', 'true');
                }else {
                    if (money.indexOf('.') === -1) {
                        _target.val(money + '.00');
                    }
                    else if(/\.\d$/.test(money)) {
                        _target.val(money + '0');
                    }
                    if (money == compare && money == orderPaynum) {//fit
                        $('.payoption').removeClass('active');
                    } else {
                        $('.payoption:eq(0)').addClass('active');
                    }
                    _target.removeClass('has-error');
                    _errordesc.addClass('hide');
                    _paybtn.removeAttr('disabled');
                    flag = true;
                }
            }
        }else{//不是数字
            _target.addClass('has-error');
            _errordesc.removeClass('hide');
            $('.payoption').removeClass('active');
            _paybtn.attr('disabled', 'true');
            if(Number(money)==0){
                _errordesc.text('余额为0，无法用余额进行支付！');
            }else{
                _errordesc.text('输入不合法数字！请输入两位小数');
            } 
        }  
    }else{
        if($('.self-checkbox').hasClass('active')){
            _target.addClass('has-error');
            _errordesc.text('输入不合法数字！请输入两位小数');
            _errordesc.removeClass('hide');
            $('.payoption').removeClass('active');
            _paybtn.attr('disabled', 'true'); 
        }else{
            flag=true;
            _target.removeClass('has-error');
            _errordesc.addClass('hide');
            _paybtn.removeAttr('disabled')
        }
    } 
    return flag;
};

function moneyInputFocus(){
    var _target=$('.remainPay');
    var _paybtn=$('#pay');
    var _errordesc=$('.error-desc');
    _target.removeClass('has-error');
    _errordesc.addClass('hide');
    _paybtn.removeAttr('disabled');
};
//支付方式选择
function payOptionChose(){
    $('.payoption').unbind('click').click(function(event) {
        var _target=$(this);
        if(_target.hasClass('active')){
            _target.removeClass('active');
        }else{
            _target.addClass('active').siblings().removeClass('active');
        }
        alloptionsHandle();
    });
};
//展开&收起
function rollup(){
	$('.title-rollup').unbind('click').click(function(){
		var _target=$('.ordertable');
		var _targetI=$('.icon-arrow01');
		var _targetTxt=$('.rollup-text');
		if(_target.hasClass('opacity')){
			_target.removeClass('opacity')
			_target.css({
				opacity: '0',
				transition: 'opacity .2s ease-in'
			});
			_targetI.css({
				transform:'rotate(0deg)',
				transition:'transform .2s ease-in'
			});
			_targetTxt.text('展开');
		}else{
			_target.css({
				opacity: '1',
				transition: 'opacity .2s ease-in'
			});
			_target.addClass('opacity');
			_targetI.css({
				transform:'rotate(180deg)',
				transition:'transform .2s ease-in'
			});
			_targetTxt.text('收起');
		}
	});
};
//获取用户账号信息
function userInfo(){
    var payurl="/user";
    $.ajax({
        url:payurl,
        cache:false,
        type: 'get',
        success:function(data){
            var _data=data.data;
            if(data.result==0){//error
                toastr.warning('','获取账户信息失败!');
            }else{
                $('.account').text(_data.email);
            }
        }
    });
};
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
};
// 获取用户账号余额
function userRemainInfo(){
    var remainurl="/userAccount/balance";
    return $.ajax({
        url:remainurl,
        cache:false,
        type: 'get',
        success:function(data){
            var _data=data.data;
            if(data.result==0){//error
                toastr.warning('','获取账户余额失败!');
            }else{
                $('.remain').text('¥'+_data);
            }
        }
    });
};
//订单详情
function orderDetail(){

    var orderNum=$('#orderNum').val();
    var orderurl='/order/'+orderNum
    return $.ajax({
    url:orderurl,
    cache:false,
    type: 'get',
    success:function(data){
         if(data.result==0){//error
            toastr.warning('','获取订单详情失败!');
         }else{
            var _target=$('#order-tbody');
            _target.html('');
            var orderArray=data.data;
            var totalprice=0;
            var order,orderHtml='',productnum=0,params='',paramsArray='';
            var index='',title='',desc='';
            for(var i in orderArray){
                var paramsHtml='';
                order=orderArray[i];
                totalprice=totalprice+order.price;
                paramsArray=order.params.split("/;");
                for(var j in paramsArray){
                    params=paramsArray[j];
                    index=params.indexOf('/:');
                    title=params.substring(0,index);
                    desc=params.substring(index+2);
                    paramsHtml=paramsHtml+'<div class="payitem clearfix">'
                                                +'<div class="text-right">'+title+'&nbsp;:</div><div class="payitem-desc">&nbsp;'+desc+'</div>'
                                        +'</div>'
                }
                productnum=productnum+order.orderNum
                orderHtml=orderHtml+'<tr>'
                                         +'<td></td>'
                                         +'<td><div style="width:50%;text-align:right;">'+order.productName+'</div></td>'
                                         +'<td>'+order.orderNum+'</td>'
                                         +'<td>'+order.orderTime+'个月</td>'
                                         +'<td class="price">¥'+order.price+'</td>'
                                     +'</tr>'
                                    +'<tr>'
                                     +'<td></td>'
                                     +'<td>'
                                         +'<div class="payitems">'
                                            +paramsHtml
                                         +'</div>'
                                     +'</td>'
                                     +'<td></td>'
                                     +'<td></td>'
                                     +'<td></td>'
                                 +'</tr>';
            }
            var temphtml='<tr>'
                             +'<td>'+orderArray[0].orderNumber+'</td>'
                             +'<td><div style="width:50%;text-align:right;">云服务产品</div></td>'
                             +'<td>'+productnum+'</td>'
                             +'<td>'+orderArray[0].orderTime+'个月</td>'
                             +'<td class="price">¥'+orderArray[0].totalPrice+'</td>'
                        +'</tr>';
            _target.append(temphtml);
            // $('#orderpay').text('¥'+totalprice);
            $('#orderpay').text(totalprice.toFixed(2));
            var userRemain=userRemainInfo();
            userRemain.done(function(data){
                if(Number(data.data)>=Number(totalprice)){
                    $('.remainPay').val(totalprice.toFixed(2));
                }else{
                    $('.remainPay').val(data.data);
                    $('.payoption:eq(0)').addClass('active'); 
                }
                $('.remainPay').blur();
            });
            _target.append(orderHtml);
         }
     }
    });
};
//支付按钮状态
function alloptionsHandle(){
    var _paybtn=$('#pay');
    var orderPaynum=Number($('#orderpay').text());
    var remainpay=$('.remainPay').val();
    // 检查当前的支付方式
    var _alloption=$('.alloption.active');
    if(_alloption.length>0){
        if($('.self-checkbox').hasClass('active')){
            if($('.remainPay').hasClass('has-error')){//输入的金额有问题，不能支付
                _paybtn.attr('disabled','true');
            }
        }else{
            if(_alloption.length>1){
                _paybtn.removeAttr('disabled');
            }else{
                if(_alloption.hasClass('self-checkbox')){
                    if(remainpay==orderPaynum){
                        _paybtn.removeAttr('disabled'); 
                    }else{
                        _paybtn.attr('disabled','true');
                    }
                }else{//单种支付
                    _paybtn.removeAttr('disabled');
                }
                 
            }
        }
    }else{//未选择支付方式
        _paybtn.attr('disabled','true');
    }
};
//窗口&跳转支付
function goPay(){
    var width=document.body.scrollWidth;
    var orderNum=$('#orderNum').val();
    var redirect=$('#redirect').val();
    var remain=orderDetail();
    $('#pay').unbind('click').click(function(event){//窗口&跳转支付
        remain.done(function(){
            var orderPaynum=Number($('#orderpay').text());//订单金额
            var remainPaynum=$('.remainPay').val();
            var money=orderPaynum-remainPaynum;
            // 检查当前的支付方式
            var _alloption=$('.alloption.active');
            var alloptions={
                '0':'/pay/'+orderNum+'?accountMoney='+remainPaynum,//余额支付
                '1':'/pay/'+orderNum+'?pattern=1',//支付宝
                '2':'/payment/wxpay?orderNum='+orderNum+'&money='+orderPaynum+'&accountMoney=0',//微信
                '01':'/pay/'+orderNum+'?pattern=1&accountMoney='+remainPaynum,//余额&支付宝
                '02':'/payment/wxpay?orderNum='+orderNum+'&money='+money.toFixed(2)+'&accountMoney='+remainPaynum//余额&微信
            }
            var option='';
            if(_alloption.length>0){
                $.ajax({
                    url: '/order/pay/'+orderNum,
                    cache:false,
                    type: 'get',
                    success:function(data){
                        var height=document.body.scrollHeight;
                        if(data.result==0){//error
                            toastr.warning('','获取订单信息失败!');
                        }else{
                            var status=data.data.status;
                            if(status==2){//支付已成功
                                $('.modal-container').find('.modal-title .title').text('温馨提示');
                                $('.modal-container').find('.modal-content .content-desc').text('订单已支付成功，请勿重复操作');
                                $('.modal-container').find('.modal-content .paybtns').html('<button class="btn btn-le-blue paybtn">确定</button>')
                                $('.modal-container').css({
                                    width:width,
                                    height:height
                                }).removeClass('hide');
                            }else{
                                if(status==1){//已失效
                                    $('.modal-container').find('.modal-title .title').text('温馨提示');
                                    $('.modal-container').find('.modal-content .content-desc').text('长时间未支付，订单已失效');
                                    $('.modal-container').find('.modal-content .paybtns').html('<button class="btn btn-le-blue paybtn">确定</button>')
                                    $('.modal-container').css({
                                        width:width,
                                        height:height
                                    }).removeClass('hide');
                                }else if(status==0||status==3){//未支付
                                    if(_alloption.length>1){//组合支付
                                        if(money==0){//默认支付宝全额付
                                            option='0';
                                        }else{
                                           option='0'+$('.payoption.active').attr('self-payoption'); 
                                        }
                                    }else{//一种支付方式
                                        option=$('.alloption.active').attr('self-payoption');
                                    }
                                    var payoption=alloptions[option];
                                    window.open(payoption);
                                    $('.modal-container').css({
                                        width:width,
                                        height:height
                                    }).removeClass('hide');
                                }
                            }
                        }
                    }
                });
            }else{//未选择支付方式
            }
        });   
    });
    $('.paybtns').unbind('click').click(function(event) {//隐藏窗口
        var _etarget=event.target||event.srcElement;
        var _target=$(_etarget);
        if(_target.hasClass('paybtn')){
            $.ajax({
                url: '/order/pay/'+orderNum,
                cache:false,
                type: 'get',
                success:function(data){
                    var url='/cvm/#/vm';
                    if(data.result==0){//error
                        toastr.warning('','获取订单信息失败!');
                    }else{
                        if(data.data.status==2){//已付款
                            //服务状态
                            $.ajax({
                                url: '/order/serviceStatus/'+orderNum,
                                type: 'get',
                                cache:false,
                                success:function(data){
                                    if(data.result==0){//error
                                        toastr.warning('','获取服务创建信息失败!');
                                    }else{
                                        if(data.data){//all service ready
                                        }else {
                                            document.cookie = 'serviceStatus' + redirect + '=notready; path=/';
                                        }
                                        if(redirects[redirect]){
                                            url=redirects[redirect]
                                        }
                                        window.location.href=url;
                                        $('.modal-container').addClass('hide');
                                    }

                                }
                            });
                        }else if(data.data.status==1){//订单已失效
                            if(redirects[redirect]){
                                url=redirects[redirect]
                            }
                            window.location.href=url;
                            $('.modal-container').addClass('hide');
                        }else{//订单未付款
                            $('.modal-container').addClass('hide');
                        }
                    }
                }
            });
        }
    });
    $('.icon-add').unbind('click').click(function(event) {
        $('.modal-container').addClass('hide');
    });
};
//订单支付状态api
function queryStatus(){
    var ordernum=$('#orderNum').val();
    var _tip=$('.desc-tip');
    var _paynum=$('#payNum');
    var _tiphtml='';
    return $.ajax({
        url: '/order/pay/'+ordernum,
        cache:false,
        type: 'get',
        success:function(data){
            _tip.html('');
            if(data.result==0){//error
                var errmsg=data.msgs?data.msgs:'获取订单支付信息失败';
                toastr.warning('',errmsg);
            }else{
                var _target=data.data;
                if(_target.status==2){//支付成功
                    _tiphtml='<div class="successicon"></div>'
                            +'<div  class="desc-success">支付成功</div>'
                            +'<div class="desc-pay">恭喜您成功支付¥<span class="price">'+_target.totalPrice+'</span>元</div>';
                    _paynum.text('支付订单号：'+_target.payNumber);
                }else{
                    if(_target.status==1){
                        _tiphtml='<div class="successicon fail"></div>'
                            +'<div  class="desc-success">订单已失效</div>';
                    }else{
                        _tiphtml='<div class="successicon fail"></div>'
                            +'<div  class="desc-success">支付处理中...</div>';
                    }
                }
                _tip.append(_tiphtml);
            }
        }
    })
};
//订单支付状态定时查询
function timeStatus(){
    var _tip=$('.desc-tip');
    var paystatus=queryStatus();       
    paystatus.done(function(data) {
        var timenum=0,time='';
        if(data.data.status!=2){//支付不成功
            time=setInterval(function(){
                paystatus=queryStatus();
                paystatus.done(function(data){
                    timenum=timenum+4;
                    if(data.data.status==2){//支付已成功
                        _tip.html('');
                        var _tiphtml='<div class="successicon"></div>'
                            +'<div  class="desc-success">支付成功</div>'
                            +'<div class="desc-pay">恭喜您成功支付¥<span class="price">'+data.data.totalPrice+'</span>元</div>';
                        clearInterval(time);
                        _tip.append(_tiphtml);
                    }else{//0,1,3 支付不成功
                        if(timenum>=10){
                            _tip.children('div:eq(1)').text('支付不成功！');
                            clearInterval(time);
                        }
                    }
                });
            },3000);
        }else{
        }
    });
};