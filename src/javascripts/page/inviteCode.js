//点击刷新图片
	function codeimgClick(){
		var _target=$('.vali-codeimg');
		_target.unbind('click').click(function(event) {
			_target.hide()
                .attr('src', '/kaptcha?random='+Math.random()*100)
                .fadeIn();
		});
	}
	function inviteVali(obj){
		var flag=false;
		var reg=/^[a-zA-z0-9]{12}$/;
		if(reg.test(obj.val())){
			flag=true;
			obj.removeClass('has-error')
				.next('.error-msg').addClass('hide');
		}else{
			obj.addClass('has-error')
				.next('.error-msg').removeClass('hide').html('<span>邀请码格式错误</span>');
		}
		return flag;
	}
	function codeVali(obj){
		var flag=false;
		var code=obj.val();
		if(code){
			$.ajax({
				url: '/kaptcha',
				async: false,
				type: 'post',
				data: {'kaptcha':code},
				success:function(data){
					if(data.data){
						flag=true;
						obj.removeClass('has-error')
							.next().next('.error-msg').addClass('hide');
					}else{
						flag=false;
						obj.addClass('has-error')
							.next().next('.error-msg').removeClass('hide').html('<span>验证码错误，请重新输入</span>');
					}
				}
			});
		}else{
			obj.addClass('has-error')
				.next().next('.error-msg').removeClass('hide').html('<span>请输入验证码！</span>');
		}
		return flag;
	}
	function totalValify(){
		var flag=false;
		var inviteresult=inviteVali($('.inviteCode'));
		var coderesult=codeVali($('.valicode-input'));
		if(inviteresult&&coderesult){
			flag=true;
		}else{
		}
		return flag;
	}
	function ifneedcode(){
		return $.ajax({
			url: '/kaptcha/isNeed',
			type: 'get',
			success:function(data){
				var _target=$('#valicode');
				if(data.data){//需要
					_target.removeClass('hide');
				}else{
					_target.addClass('hide')
				}
			}
		});
	}
	function inviteBtnClick(){
		$('.invitebtn').unbind('click').click(function(event){//click事件处理
			var invitecode=$('.inviteCode').val(),code=$('.valicode-input').val();
			var inputdata='';
			var ifneedcodeResult=ifneedcode();
			ifneedcodeResult.done(function(data){
				if(data.data){//需要验证码
					$('#valicode').removeClass('hide');
					$('#idcode').attr('src', '/kaptcha?random='+Math.random()*100);
					if(totalValify()){
						$('.invitebtn').text('正在验证...');
						inputdata={
							'inviteCode':invitecode,
							'kaptcha':code
						}
						inviteajax(inputdata)
					}else{
						return;
					}
				}else{
					$('#valicode').addClass('hide');
					$('#idcode').attr('src', '');
					if(inviteVali($('.inviteCode'))){//只需要验证邀请码
						inputdata={
							'inviteCode':invitecode
						}
						inviteajax(inputdata)
					}
				}	
			});
		});
	}
	function inviteajax(inputdata){
		var time='';
		var _idcode=$('#idcode'),
			_inputcode=$('#input_idcode'),
			_blockInput=$('.blockInputs'),
			_blockSuccess=$('.blockSuccess'),
			_inviteCode=$('.inviteCode');
		$.ajax({
			url:'/inviteCode/verify',
			type:'post',
			data:inputdata,
			success:function(data){
				$('.invitebtn').text('验证');
				if(data.data==0){
					if(_idcode.attr('src')){//有验证码,刷新验证码
						_idcode.attr('src', '../kaptcha');
					}
					_inputcode.val('');
					_blockInput.removeClass('hide');
					_blockSuccess.addClass('hide');
					_inviteCode.addClass('has-error').next('.error-msg').removeClass('hide').html("<span>"+data.msgs+"</span>");
				}else if(data.data==1){//验证通过
					_inviteCode.removeClass('has-error').next('.error-msg').addClass('hide');
					_blockInput.addClass('hide');
					_blockSuccess.removeClass('hide');
					//初始化定时器
					if(time){
						clearTimeout(time)
					}else{
						time=setTimeout(function(){
							window.location.href="/profile";
						},2000);
					}
				}else{
					if(_idcode.attr('src')){//有验证码,刷新验证码
						_idcode.attr('src', '../kaptcha');
					}
					_inputcode.val('');
					_blockInput.removeClass('hide');
					_blockSuccess.addClass('hide');
					_inviteCode.addClass('has-error').next('.error-msg').removeClass('hide').html("<span>"+data.msgs+"</span>");
				}
			}
		})
	}