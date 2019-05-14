// pages/queryOrderCoupon/queryOrderCoupon.js
var app=getApp();
var utils=require("../../utils/util.js");
Page({
  data: {
    couponId:'',
  },

  onLoad: function (options) {
    console.log("options"+JSON.stringify(options));
    var data=JSON.parse(options.data);
    for (var i = 0; i < data.couponInfo.length; i++) {
      data.couponInfo[i].deadline = data.couponInfo[i].deadline.substring(0,19);
      data.couponInfo[i].checked=false;
    }
    this.setData({
      orderId: options.orderId,
      totalFee: data.orderInfo.totalFee,
      couponInfo: data.couponInfo,
      totalPrice: data.orderInfo.totalFee
    })
  },
  change:function(e){
    // console.log("change");
    //  var index=e.detail.value;
    //  console.log("index"+index);
    //  this.setData({
    //    totalPrice: this.data.totalFee - this.data.couponInfo[index].amount,
    //    couponId: this.data.couponInfo[index].couponId,
    //  })
  },
  tapRadio:function(e){
    var id=e.currentTarget.dataset.id;
    var checked = this.data.couponInfo[id].checked;
    var toggle ="couponInfo["+id+"].checked"
    this.setData({
      [toggle]:!checked
    })
    if(checked==false){
      this.setData({
        totalPrice: this.data.totalFee - this.data.couponInfo[id].amount,
        couponId: this.data.couponInfo[id].couponId,
      })
    }else{
      this.setData({
        totalPrice: this.data.totalFee,
        couponId: ''
      })
      
    }
  },
  Disabled:function(){
    this.setData({
      disabled: true
    })
  },
  noDisabled:function(){
    this.setData({
      disabled: false
    })
  },
  order: function (data) { 
    // this.Disabled(); 
    this.setData({
      disabled: true
    })
    var orderId = this.data.orderId;
    var url = app.globalData.domain + "/scvendor_weixin_user/pay/payOrder";
    var data = {
      openid: wx.getStorageSync("openId"),
      weixinNickname: app.globalData.userInfo.nickName,
      weixinHead: app.globalData.userInfo.avatarUrl,
      orderId: orderId,
      couponId: this.data.couponId,
    }
    app.checkLogin(utils.http(url, data, this.pay, this.noDisabled));
  },
  pay: function (data) {
    this.setData({
      isPay:true
    })
    var that = this;
    wx.requestPayment({
      timeStamp: data.timeStamp,
      nonceStr: data.nonceStr,
      package: data.package,
      signType: 'MD5',
      paySign: data.paySign,
      success: function (res) {
        wx.showModal({
          title: '提示',
          content: '付款成功,请在售货机上领取商品',
          showCancel: false,
          success:function(res){
            if(res.confirm){
              wx.reLaunch({
                url: '../index/index',
              })
            }
          }
        })
        
      },
      fail: function (res) {
        console.log("付款失败");
        // that.isDisabled();
      }
    })
  },








})