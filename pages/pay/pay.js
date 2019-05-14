var utilMd5 = require("../../utils/md5.js");
var app = getApp();
var utils = require("../../utils/util.js");
Page({
  data: {
    deviceId: '',
    timestamp: 0, //时间戳
    sign: '', // 二维码传过来的sign
    signKey: '', //拉取后台接口获取的私有签名密钥
    isPay:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log("这里是onload");
    console.log("op" + options);
    if (options.op != undefined) {
      options = options.op;
      options = JSON.parse(options);
    }
    var that = this;
    var para;
    console.log("para参数：" + options.para);
    if ('null' == options.para) {
      wx.redirectTo({
        url: '../illegalRequest/illegalRequest?title=非法请求，请重新扫码！',
      });
      return;
    }
    para = JSON.parse(options.para);

    console.log("para.d:" + para.d);
    console.log("para.t:" + para.t);
    console.log("para.s:" + para.s);
    this.setData({
      orderId: para.o,
      op: options
    })

    if (undefined == para.d || null == para.d || '' == para.d ||
      undefined == para.t || null == para.t || '' == para.t ||
      undefined == para.s || null == para.s || '' == para.s) {
      wx.redirectTo({
        url: '../illegalRequest/illegalRequest?title=非法请求，请重新扫码！',
      });
      return;
    }
    that.setData({
      deviceId: para.d,
      timestamp: para.t, //二维码生成时间
      sign: para.s,
    });

    //测试时注释时间戳5分钟限制
    var date = new Date();
    var currentTime = parseInt(date.getTime() / 1000);
    console.log("that.time.timestamp" + that.data.timestamp);
    console.log("currentTime" + currentTime);
    if (that.data.timestamp < currentTime - 100000000 || that.data.timestamp > currentTime + 100000000) {
      console.log("时间戳5分钟限制");
      wx.redirectTo({
        url: '../illegalRequest/illegalRequest?title=二维码已过期，请重新生成二维码！',
      });
      return;
    }

    // if (null != app.globalData.userInfo && '' != app.globalData.userInfo) {
    //   app.checkLogin(this.queryCoupon);

    // } else {
    //   app.checkLogin(app.getUserInfo, this.queryCoupon, this);
    // }
    
    


  }, //onLoad()函数
  onShow: function() {
    console.log("这里是show");
    if(this.data.isPay==false){
      if (null != app.globalData.userInfo && '' != app.globalData.userInfo) {
        app.checkLogin(this.queryCoupon);
        console.log("one");
      } else {
        app.checkLogin(app.getUserInfo, this.queryCoupon, this);
        console.log("two");
      }

    }
    
    
  },
  onReady:function(){
     console.log("onReady");
  },
  queryCoupon: function() {
    console.log("这里是queryCoupon");
    this.queryOrderAndCoupon();
  },
  queryOrderAndCoupon: function() {
    console.log("这里是queryOrderAndCoupon");
    var orderId = this.data.orderId;
    var url = app.globalData.domain + "/scvendor_weixin_user/pay/queryOrderAndCoupon";
    var data = {
      openid: wx.getStorageSync("openId"),
      orderId: orderId
    }
    app.checkLogin(utils.http(url, data, this.result));
  },
  result: function(data) {
    console.log("result");
    if (data.couponInfo.length == 0) {
      this.getSignKey();
    } else {
      data = JSON.stringify(data);
      wx.redirectTo({
        url: '/pages/queryOrderCoupon/queryOrderCoupon?data=' + data + "&&orderId=" + this.data.orderId,
      })
    }
  },
  getSignKey: function() {
    console.log("getSignKey");
    //拉取接口获取私钥校验签名
    var that = this;
    //获取当前时间戳
    var nowTimeStamp = parseInt(new Date().getTime() / 1000);
    var connectSign = utilMd5.hexMD5("deviceId=" + that.data.deviceId + "&timestamp=" + nowTimeStamp + "&key=vmc3x9jxEbhUfbI3Uv8qbPtXsKolE9h6");
    wx.request({
      url: app.globalData.domain + '/scvendor_client/device/getSignkey',
      data: {
        "deviceId": that.data.deviceId,
        "timestamp": nowTimeStamp,
        "sign": connectSign,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: "POST",
      dataType: "json",
      success: function(res) {
        if (res.data.retCode == 0) {
          that.setData({
            signKey: res.data.signKey
          });
          var newSign = utilMd5.hexMD5("d=" + that.data.deviceId + "&o=" + that.data.orderId + "&t=" + that.data.timestamp + "&key=" + that.data.signKey);
          //测试时注释校验签名
          newSign = newSign.substr(0, 6);
          if (newSign != that.data.sign) {
            console.log("a非法请求！");
            wx.showModal({
              title: '提示',
              content: 'a非法请求！',
              showCancel: false,
              success: function(res) {
                if (res.confirm) {
                  wx.redirectTo({
                    url: '../illegalRequest/illegalRequest?title=非法请求，请重新扫码',
                  });
                }
              }
            });
            return;
          }
          console.log("pay");
          app.checkLogin(that.pay);
          // app.checkLogin(app.getUserInfo, that.pay, that);
        } else {
          wx.showModal({
            title: '提示',
            content: '[' + res.data.retCode + ']' + res.data.retMsg,
            showCancel: false,
          });
        }

      },
      fail: function(res) {
        wx.showModal({
          title: '提示',
          content: '[10004]系统繁忙，请稍后再试！',
          showCancel: false,
        });
      },
    })
  },

  pay: function() {
    this.setData({
      isPay:true
    })
    console.log("pay");
    wx.request({
      url: app.globalData.domain + '/scvendor_weixin_user/pay/payOrder',
      data: {
        openid: wx.getStorageSync("openId"),
        weixinNickname: app.globalData.userInfo.nickName,
        weixinHead: app.globalData.userInfo.avatarUrl,
        orderId: this.data.orderId
      },
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        switch (res.data.retCode) {
          case 0:
            console.log("package>>>>" + res.data.package);
            wx.requestPayment({
              timeStamp: res.data.timeStamp,
              nonceStr: res.data.nonceStr,
              package: res.data.package,
              signType: 'MD5',
              paySign: res.data.paySign,
              success: function(res) {
                // console.log("付款成功");
                // wx.reLaunch({
                //   url: '/pages/index/index',
                // })
                 wx.showToast({
                   title: '付款成功，请在售货机上领取商品',
                   complete: function () {
                     console.log("跳到首页");
                     wx.reLaunch({
                       url: '/pages/index/index',
                     })

                   }
                  });
              },
              fail: function(res) {
                console.log(res);
                console.log("付款失败");
              }
            })
            break;
          case 21400:
            wx.showModal({
              title: '提示',
              content: '[21400]系统繁忙',
              showCancel: false,
            });
            break;
          case 21411:
            wx.showModal({
              title: '提示',
              content: '[21411]openid号错误',
              showCancel: false,
            });
            break;
          case 21412:
            wx.showModal({
              title: '提示',
              content: '[21412]微信昵称错误',
              showCancel: false,
            });
            break;
          case 21413:
            wx.showModal({
              title: '提示',
              content: '[21413]微信头像错误',
              showCancel: false,
            });
            break;
          case 21416:
            wx.showModal({
              title: '提示',
              content: '[21416]订单号错误',
              showCancel: false,
            });
            break;
          case 21417:
            wx.showModal({
              title: '提示',
              content: '[21417]订单号不存在',
              showCancel: false,
            });
            break;
          case 21418:
            wx.showModal({
              title: '提示',
              content: '[21418]订单已经支付',
              showCancel: false,
            });
            break;
          case 21419:
            wx.showModal({
              title: '提示',
              content: '[21419]商户类型错误',
              showCancel: false,
            });
            break;
          default:
            wx.showModal({
              title: '提示',
              content: '系统繁忙，请稍后再试！',
              showCancel: false,
            });
            break;
        }

      },
      fail: function() {
        wx.showModal({
          title: '提示',
          content: '系统繁忙，请稍后再试！',
        })
      }
    })


  },


})
                                                        