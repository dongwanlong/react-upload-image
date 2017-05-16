/**
 * Created by jiangfei on 2015/8/19.
 */
define(['./common.service'],function (serviceModule) {
  serviceModule.factory('Utility', ['$timeout','$document','$cookies',
    function ($timeout,$document,$cookies) {
      var service = {};
      service.getRzSliderHack=function(scope){
         return function(){
           $timeout(function() {
             scope.$broadcast('rzSliderForceRender');
           },50);
         };
      };

      service.delayQueueModel = function () {
        var delayQueue = [],
          timeoutPromise = null;
        return function (value, onTimeout) {
          if (delayQueue.length == 0) {
            timeoutPromise = $timeout(function () {
              onTimeout(delayQueue[delayQueue.length - 1]);
              delayQueue.splice(0, delayQueue.length);
            }, 1000);
          }
          delayQueue.push(value);
        };

      };
      var jsonTrans=function(obj,path){
        var patharry=[],_targetobj='',pathtemp='';
        var flag=false;
        if(path.indexOf('.')>0){
          patharry=path.split('.');
          var objtemp='';
          for(var i in patharry){
            objtemp=objtemp?objtemp:obj;
            objtemp=objtemp[patharry[i]];
            pathtemp=patharry[i];
          }
          _targetobj=objtemp;
        }else{
          pathtemp=path;
          _targetobj=obj[path];
        }
        if(_targetobj instanceof Array){
          if(_targetobj.length>0){
            flag=true;
          }
        }else{
          if(_targetobj){
            flag=true;
          }
        }
        return {
          "flag":flag,
          "pathvalue":pathtemp
        };
      };
      service.setOperationBtns=function($scope,objList,productInfo,operationArry,Config){
          var type=productInfo.type;
          var state=productInfo.state;
          var otheraffect=productInfo.other;
          var operaArraytemp=productInfo.operations;
          var operationArraycopy=[];
          var othertemp=1,statetemp='';//暂存数据
          for(var i in objList){
            operationArry[i]=[];
            if(objList[i].checked){
              var objtemp=objList[i];
              statetemp=objtemp[state]?objtemp[state]:'default';
              for(var j in operaArraytemp){
                operationArry[i][j]=operationArry[i][j]?operationArry[i][j]:Config.statusOperations[type][statetemp][operaArraytemp[j]];
                if(otheraffect.length>0){//其他影响因素
                  for(var k in otheraffect){
                    var flag=jsonTrans(objtemp,otheraffect[k]).flag;
                    var pathvalue=jsonTrans(objtemp,otheraffect[k]).pathvalue;
                    if(flag){
                      operationArry[i][j]=operationArry[i][j]*Config.statusOperations[type][pathvalue][operaArraytemp[j]];
                    }else{
                      operationArry[i][j]=operationArry[i][j]*Config.statusOperations[type][pathvalue+'null'][operaArraytemp[j]];
                    }
                    // var otheraffecttemp=objtemp[otheraffect[k]]
                    // if(otheraffecttemp instanceof Array){
                    //   if(otheraffecttemp.length>0){
                    //     operationArry[i][j]=Config.statusOperations[type][statetemp][operaArraytemp[j]]*Config.statusOperations[type][otheraffect[k]][operaArraytemp[j]];
                    //   }else{
                    //     operationArry[i][j]=Config.statusOperations[type][statetemp][operaArraytemp[j]]*Config.statusOperations[type][otheraffect[k]+'null'][operaArraytemp[j]];
                    //   }
                    // }else{
                    //   if(otheraffecttemp){
                    //     operationArry[i][j]=Config.statusOperations[type][statetemp][operaArraytemp[j]]*Config.statusOperations[type][otheraffect[k]][operaArraytemp[j]];
                    //   }else{
                    //     operationArry[i][j]=Config.statusOperations[type][statetemp][operaArraytemp[j]]*Config.statusOperations[type][otheraffect[k]+'null'][operaArraytemp[j]];
                    //   }
                    // }    
                  }
                }else{//无其他因素影响
                  operationArry[i][j]=Config.statusOperations[type][statetemp][operaArraytemp[j]];
                }
                operationArraycopy[j]=1;
              }
            }else{
              operationArry[i]=[1,1,1,1,1,1,1,1,1,1,1,1]
            }   
          }
          for(var i in operationArry){//多记录状态叠加
            for(var j in operationArry[i]){
              operationArraycopy[j]=operationArraycopy[j]*operationArry[i][j];
            }
          }
          return operationArraycopy
      };
      service.encodeUrl = function(str){
        var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        /**
         * base64编码
         * @param {Object} str
         */

          var out, i, len;
          var c1, c2, c3;
          len = str.length;
          i = 0;
          out = "";
          while (i < len) {
            c1 = str.charCodeAt(i++) & 0xff;
            if (i == len) {
              out += base64EncodeChars.charAt(c1 >> 2);
              out += base64EncodeChars.charAt((c1 & 0x3) << 4);
              out += "==";
              break;
            }
            c2 = str.charCodeAt(i++);
            if (i == len) {
              out += base64EncodeChars.charAt(c1 >> 2);
              out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
              out += base64EncodeChars.charAt((c2 & 0xF) << 2);
              out += "=";
              break;
            }
            c3 = str.charCodeAt(i++);
            out += base64EncodeChars.charAt(c1 >> 2);
            out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
            out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
            out += base64EncodeChars.charAt(c3 & 0x3F);
          }
          return out;

      };
      service.decodeUrl = function(str){
        var base64DecodeChars = new Array(-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);
        /**
         * base64解码
         * @param {Object} str
         */

          var c1, c2, c3, c4;
          var i, len, out;
          len = str.length;
          i = 0;
          out = "";
          while (i < len) {
            /* c1 */
            do {
              c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
            }
            while (i < len && c1 == -1);
            if (c1 == -1)
              break;
            /* c2 */
            do {
              c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
            }
            while (i < len && c2 == -1);
            if (c2 == -1)
              break;
            out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));
            /* c3 */
            do {
              c3 = str.charCodeAt(i++) & 0xff;
              if (c3 == 61)
                return out;
              c3 = base64DecodeChars[c3];
            }
            while (i < len && c3 == -1);
            if (c3 == -1)
              break;
            out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));
            /* c4 */
            do {
              c4 = str.charCodeAt(i++) & 0xff;
              if (c4 == 61)
                return out;
              c4 = base64DecodeChars[c4];
            }
            while (i < len && c4 == -1);
            if (c4 == -1)
              break;
            out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
          }
          return out;
        

      };

      service.isServiceReady=function(name) {
        var result = true,
            serviceStatus = $cookies.get(name);
        if (serviceStatus && serviceStatus == 'notready') {
          result = false;
        }
        $cookies.remove(name, {'path': '/'});
        return result;
      };
      service.isInt=function (input) {
        return Number(input) % 1 === 0;
      };

      return service;
    }]);

});
