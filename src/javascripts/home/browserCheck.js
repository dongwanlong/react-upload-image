function ClientInfor(){
  this.engine={
    ie: 0,
    gecko: 0,
    webkit: 0,
    khtml: 0,
    opera: 0,

    // 具体的版本
    ver: null
  };
  this.browser = {
    ie: 0,
    firefox: 0,
    safari: 0,
    konq: 0,
    opera: 0,
    chrome: 0,

    // 具体的版本
    ver: null
  };
  this.system = {
    win: false,
    mac: false,
    xll: false,

    // 移动设备
    iphone: false,
    ipod: false,
    ipad: false,
    ios: false,
    android: false,
    nokiaN: false,
    winMobile: false,

    // 游戏系统
    wii: false,
    ps: false
  }
  this.ua=window.navigator.userAgent;
  this.p=window.navigator.platform;
  this.getSystemInfor=function(){
    this.system.win=this.p.indexOf('Win') == 0;
    this.system.mac=this.p.indexOf('Mac') == 0;
    this.system.xll=(this.p.indexOf('Linux') == 0 || this.p.indexOf('Xll') == 0);

    this.system.iphone = this.ua.indexOf('iPhone') > -1;
    this.system.ipod = this.ua.indexOf('iPod') > -1;
    this.system.ipad = this.ua.indexOf('iPad') > -1;
    // ios
    if (this.system.mac && this.ua.indexOf('Mobile') > -1) {
      if (/CPU (?:iPhone )?OS (\d+_\d+)/.test(this.ua)) {
        this.system.ios = parseFloat(RegExp.$1.replace('_', '.'));
      } else {
          this.system.ios = 2;
      }
    }
      // android
      if (/Android (\d+\.\d+)/.test(this.ua)) {
        this.system.android = parseFloat(RegExp.$1);
      }
      // nokia
      this.system.nokiaN=this.ua.indexOf('NokiaN') > -1;

      // windows mobile
      if (this.system.win == 'CE') {
        this.system.winMobile = this.system.win;
      } else if (this.system.win == 'Ph') {
        if (/Windows Phone OS (\d+.\d+)/.test(this.ua)) {
            this.system.win = 'Phone';
            this.system.winMobile = parseFloat(RegExp['$1']);
        }
      }

      // game system
      this.system.wii = this.ua.indexOf('Wii') > -1;
      this.system.ps = /playstation/i.test(this.ua);
      if (this.system.win){
        if (/Win(?:dows )?([^do]{2})\s?(\d+\.\d+)?/.test(this.ua)){
          if (RegExp['$1'] == 'NT'){
            switch(RegExp['$2']) {
                case '5.0': this.system.win = '2000'; break;
                case '5.1': this.system.win = 'XP'; break;
                case '6.0': this.system.win = 'Vista'; break;
                case '6.1': this.system.win = '7'; break;
                case '6.2': this.system.win = '8'; break;
                default: this.system.win = 'NT'; break;
            }
          }else if(RegExp['$1'] == '9x'){
            // 检测windows ME
            this.system.win = 'ME';
          }else {
            // 检测windows 95、windows 98
            this.system.win = RegExp['$1'];
          }
      }
    }
    return this.system;
  }
  this.getBrowserInfor=function(){
    if(window.opera){
      this.engine.ver = this.browser.ver = window.opera.version();
      this.engine.opera = this.browser.opera = parseFloat(this.engine.ver);
    }else if(/AppleWebKit\/(\S+)/i.test(this.ua)) {
      this.engine.ver = this.browser.ver = RegExp['$1'];
      this.engine.webkit = parseFloat(this.engine.ver);

      // 确定是chrome 还是 safari
      if(/Chrome\/(\S+)/i.test(this.ua)) {
          this.browser.chrome = parseFloat(this.engine.ver);
      }else if(/Version\/(\S+)/i.test(this.ua)) {
        this.browser.safari = parseFloat(this.engine.ver);
      }else{
          // 近似的确认版本号，早期版本的safari版本中userAgent没有Version
          var safariVersion = 1;
          if(this.engine.webkit<100){
            safariVersion=1;
          }else if(this.engine.webkit<312){
            safariVersion=1.2;
          }else if(this.engine.webkit<412){                     
            safariVersion=1.3;
          }else{                     
            safariVersion=2;
          }
          this.browser.safari=this.browser.ver=safariVersion;
      }
    }else if(/KHTML\/(\S+)/i.test(this.ua)||/Konqueror\/([^;]+)/i.test(this.ua)){
      this.engine.ver = this.browser.ver = RegExp['$1'];
      this.engine.khtml = this.browser.konq = parseFloat(this.engine.ver);
    }else if(/rv:([^\)]+)\) Gecko\/\d{8}/i.test(this.ua)){
      this.engine.ver = RegExp['$1'];
      this.engine.gecko = parseFloat(this.engine.ver);

      // 确定是不是Firefox浏览器
      if(/Firefox\/(\S+)/i.test(this.ua)) {
        this.browser.ver = RegExp['$1'];
        this.browser.firefox = parseFloat(this.browser.ver);
      }
    }else if(/MSIE\s([^;]+)/i.test(this.ua)) {
      this.engine.ver = this.browser.ver = RegExp['$1'];
      this.engine.ie = this.browser.ie = parseFloat(this.engine.ver);
    }else if (/trident.*rv:([^)]+)/i.test(this.ua)) {
      this.engine.ver = this.browser.ver = RegExp['$1'];
      this.engine.ie = this.browser.ie = parseFloat(this.engine.ver);
    }
    return this.browser;
  }
  this.getEngineInfor=function(){
    if(window.opera){
      this.engine.ver = this.browser.ver = window.opera.version();
      this.engine.opera = this.browser.opera = parseFloat(this.engine.ver);
    }else if(/AppleWebKit\/(\S+)/i.test(this.ua)) {
      this.engine.ver = this.browser.ver = RegExp['$1'];
      this.engine.webkit = parseFloat(this.engine.ver);

      // 确定是chrome 还是 safari
      if(/Chrome\/(\S+)/i.test(this.ua)) {
          this.browser.chrome = parseFloat(this.engine.ver);
      }else if(/Version\/(\S+)/i.test(this.ua)) {
        this.browser.safari = parseFloat(this.engine.ver);
      }else{
          // 近似的确认版本号，早期版本的safari版本中userAgent没有Version
          var safariVersion = 1;
          if(this.engine.webkit<100){
            safariVersion=1;
          }else if(this.engine.webkit<312){
            safariVersion=1.2;
          }else if(this.engine.webkit<412){                     
            safariVersion=1.3;
          }else{                     
            safariVersion=2;
          }
          this.browser.safari=this.browser.ver=safariVersion;
      }
    }else if(/KHTML\/(\S+)/i.test(this.ua)||/Konqueror\/([^;]+)/i.test(this.ua)){
      this.engine.ver = this.browser.ver = RegExp['$1'];
      this.engine.khtml = this.browser.konq = parseFloat(this.engine.ver);
    }else if(/rv:([^\)]+)\) Gecko\/\d{8}/i.test(this.ua)){
      this.engine.ver = RegExp['$1'];
      this.engine.gecko = parseFloat(this.engine.ver);

      // 确定是不是Firefox浏览器
      if(/Firefox\/(\S+)/i.test(this.ua)) {
        this.browser.ver = RegExp['$1'];
        this.browser.firefox = parseFloat(this.browser.ver);
      }
    }else if(/MSIE\s([^;]+)/i.test(this.ua)) {
      this.engine.ver = this.browser.ver = RegExp['$1'];
      this.engine.ie = this.browser.ie = parseFloat(this.engine.ver);
    }else if (/trident.*rv:([^)]+)/i.test(this.ua)) {
      this.engine.ver = this.browser.ver = RegExp['$1'];
      this.engine.ie = this.browser.ie = parseFloat(this.engine.ver);
    }
    return this.engine;
  }
}