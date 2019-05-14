// pages/trackPay/trackPay.js
var app=getApp();
var utils=require("../../utils/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPay:false,
    saleSprice:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      deviceId: options.deviceId,
      trackNo: options.trackNo,
      trackNo1:options.trackNo.substring(3)
    })

  },


  onShow: function () {
    if (this.data.isPay == false) {
      if (null != app.globalData.userInfo && '' != app.globalData.userInfo) {
        app.checkLogin(this.placeOrderForTrack);

      } else {
        app.checkLogin(app.getUserInfo, this.placeOrderForTrack, this);
      }
    }
  },
  placeOrderForTrack: function () {
    var that=this;
    var url = app.globalData.domain +"/scvendor_weixin_user/pay/placeOrderForTrack"
    var data={
      deviceId: this.data.deviceId,
      trackNo: this.data.trackNo,
      openid: wx.getStorageSync("openId"),
    }
    wx.request({
      url: url,
      data:data,
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success:function(res){
        switch(res.data.retCode){
          case 0:
          that.setData({
            orderId: res.data.orderId,
            name: res.data.name,
            picture: res.data.image,
            saleSprice: res.data.saleSprice
          })
            // that.getOrderId(res.data);
          break;
          case 21400:
          wx.showModal({
            title: '提示',
            content: '[21400]系统繁忙，请稍后再试',
            showCancel:false,
            success:function(res){
               if(res.confirm){
                 that.toIndex();
               }
            }
          })
          break;
          case 21414:
            wx.showModal({
              title: '提示',
              content: '[21414]设备id号错误',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  that.toIndex();
                }
              }
            })
            break;
          case 21422:
            wx.showModal({
              title: '提示',
              content: '[21422]超过购买限制',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  that.toIndex();
                }
              }
            })
            break;
          case 21423:
            wx.showModal({
              title: '提示',
              content: '[21423]当前货道库存不足',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  that.toIndex();
                }
              }
            })
            break;
          case 21444:
            wx.showModal({
              title: '提示',
              content: '[21444]货道号错误',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  that.toIndex();
                }
              }
            })
            break;
          case 21445:
            wx.showModal({
              title: '提示',
              content: '[21445]货道号不存在',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  that.toIndex();
                }
              }
            })
            break;
          case 21446:
            wx.showModal({
              title: '提示',
              content: '[21446]设备因掉线暂停服务，敬请谅解！',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  that.toIndex();
                }
              }
            })
            break;
          default:
            wx.showModal({
              title: '提示',
              content: '系统繁忙，请稍后再试',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  that.toIndex();
                }
              }
            })
            break;
        }
      },
      fail:function(){
        wx.showModal({
          title: '提示',
          content: '系统繁忙，请稍后再试',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              that.toIndex();
            }
          }
        })
      }
    })
    // app.checkLogin(utils.http(url,data,this.getOrderId,this.toIndex));
  },
  toIndex:function(){
    wx.reLaunch({
      url: '/pages/index/index',
    })
  },
  // getOrderId:function(data){
  //   this.setData({
  //     orderId:data.orderId
  //   })
  //   this.queryOrderAndCoupon();
  // },
  dis:function(){
    this.setData({
      disabled:false
    })
  },
  queryOrderAndCoupon: function () {
    this.setData({
      disabled:true
    })
    console.log("这里是queryOrderAndCoupon");
    var orderId = this.data.orderId;
    var url = app.globalData.domain + "/scvendor_weixin_user/pay/queryOrderAndCoupon";
    var data = {
      openid: wx.getStorageSync("openId"),
      orderId: orderId
    }
    app.checkLogin(utils.http(url, data, this.result, this.dis));
  },
  result: function (data) {
    console.log("result");
    if (data.couponInfo.length == 0) {
      this.pay();
    } else {
      data = JSON.stringify(data);
      wx.redirectTo({
        url: '/pages/queryOrderCoupon/queryOrderCoupon?data=' + data + "&&orderId=" + this.data.orderId,
      })
    }
  },

  pay: function () {
    this.setData({
      isPay: true
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
      success: function (res) {
        switch (res.data.retCode) {
          case 0:
            console.log("package>>>>" + res.data.package);
            wx.requestPayment({
              timeStamp: res.data.timeStamp,
              nonceStr: res.data.nonceStr,
              package: res.data.package,
              signType: 'MD5',
              paySign: res.data.paySign,
              success: function (res) {
                wx.showModal({
                  title: '提示',
                  content: '付款成功，请在售货机上领取商品',
                  showCancel:false,
                  success:function(res){
                    if(res.confirm){
                      console.log("跳到首页");
                      wx.reLaunch({
                        url: '/pages/index/index',
                      })
                    }
                  }
                })
              },
              fail: function (res) {
                wx.showModal({
                  title: '提示',
                  content: '您已取消支付',
                  showCancel: false,
                  success: function (res) {
                    if (res.confirm) {
                      console.log("跳到首页");
                      wx.reLaunch({
                        url: '/pages/index/index',
                      })
                    }
                  }
                })
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
              success: function (res) {
                if (res.confirm) {
                  console.log("跳到首页");
                  wx.reLaunch({
                    url: '/pages/index/index',
                  })
                }
              }
            });
            break;
          case 21411:
            wx.showModal({
              title: '提示',
              content: '[21411]openid号错误',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  console.log("跳到首页");
                  wx.reLaunch({
                    url: '/pages/index/index',
                  })
                }
              }
            });
            break;
          case 21412:
            wx.showModal({
              title: '提示',
              content: '[21412]微信昵称错误',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  console.log("跳到首页");
                  wx.reLaunch({
                    url: '/pages/index/index',
                  })
                }
              }
            });
            break;
          case 21413:
            wx.showModal({
              title: '提示',
              content: '[21413]微信头像错误',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  console.log("跳到首页");
                  wx.reLaunch({
                    url: '/pages/index/index',
                  })
                }
              }
            });
            break;
          case 21416:
            wx.showModal({
              title: '提示',
              content: '[21416]订单号错误',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  console.log("跳到首页");
                  wx.reLaunch({
                    url: '/pages/index/index',
                  })
                }
              }
            });
            break;
          case 21417:
            wx.showModal({
              title: '提示',
              content: '[21417]订单号不存在',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  console.log("跳到首页");
                  wx.reLaunch({
                    url: '/pages/index/index',
                  })
                }
              }
            });
            break;
          case 21418:
            wx.showModal({
              title: '提示',
              content: '[21418]订单已经支付',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  console.log("跳到首页");
                  wx.reLaunch({
                    url: '/pages/index/index',
                  })
                }
              }
            });
            break;
          case 21419:
            wx.showModal({
              title: '提示',
              content: '[21419]商户类型错误',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  console.log("跳到首页");
                  wx.reLaunch({
                    url: '/pages/index/index',
                  })
                }
              }
            });
            break;
          default:
            wx.showModal({
              title: '提示',
              content: '系统繁忙，请稍后再试！',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  console.log("跳到首页");
                  wx.reLaunch({
                    url: '/pages/index/index',
                  })
                }
              }
            });
            break;
        }

      },
      fail: function () {
        wx.showModal({
          title: '提示',
          content: '系统繁忙，请稍后再试！',
        })
      }
    })


  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})