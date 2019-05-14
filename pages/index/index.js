// pages/index/index.js
const app = getApp();
var utils=require("../../utils/util.js");
var utilMd5 = require("../../utils/md5.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wxHeadPic: '',
    wxName: '',
    province: '',
    city: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    

    
  },
  onShow:function(){
    this.setData({
      deviceId:''
    })
    var that = this;
    //当用户从别的入口进来（不是绑定入口）
    if (null == app.globalData.userInfo || " " == app.globalData.userInfo) {
      console.log("当前没有获取到微信头像和昵称");
      app.checkLogin(app.getUserInfo, that.user);
    } else {
      console.log("当前已经获取到微信头像和昵称");
      that.setData({
        wxHeadPic: app.globalData.userInfo.avatarUrl,
        wxName: app.globalData.userInfo.nickName,
        province: app.globalData.userInfo.province,
        city: app.globalData.userInfo.city
      });
      console.log("微信头像url：" + that.data.wxHeadPic);
      console.log("微信name：" + that.data.wxName);
      console.log("省份：" + that.data.province);
      console.log("市：" + that.data.city);
      app.checkLogin(app.getUserInfo);

    }
    app.checkLogin(this.queryUnreadNoticeNum);
    // this.user();

  },
  showBox:function(){
    this.setData({
      boxShow:true
    })
  },
  close:function(){
    this.setData({
      boxShow:false,
      deviceId:''
    })
  },
  mallInput:function(e){
    this.setData({
      deviceId:e.detail.value
    })
  },
  search:function(){
    this.setData({
      dis:true
    })
    var that=this;
    setTimeout(function(){
      that.setData({
        dis:false
      })
    },1000)
    if (this.data.deviceId == undefined || this.data.deviceId  ==null || this.data.deviceId==''){
      wx.showModal({
        title: '提示',
        content: '设备编号不能为空',
        showCancel:false
      })
      return;
    }
    
    app.checkLogin(this.getSignKey)

  },
  getSignKey: function () {
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
      success: function (res) {
        if (res.data.retCode == 0) {
          // that.setData({
          //   signKey: res.data.signKey
          // });
          // var newSign = utilMd5.hexMD5("d=" + that.data.deviceId + "&o=" + that.data.orderId + "&t=" + that.data.timestamp + "&key=" + that.data.signKey);
          // newSign = newSign.substr(0, 6);
          // if (newSign != that.data.sign) {
          //   console.log("a非法请求！");
          //   wx.showModal({
          //     title: '提示',
          //     content: 'a非法请求！',
          //     showCancel: false,
          //     success: function (res) {
          //       if (res.confirm) {
          //         wx.redirectTo({
          //           url: '../illegalRequest/illegalRequest?title=非法请求，请重新扫码',
          //         });
          //       }
          //     }
          //   });
    
          // }
          app.checkLogin(that.toMall);
          
        } else {
          wx.showModal({
            title: '提示',
            content:  res.data.retMsg,
            showCancel: false,
          });
        }

      },
      fail: function (res) {
        wx.showModal({
          title: '提示',
          content: '[10004]系统繁忙，请稍后再试！',
          showCancel: false,
        });
      },
    })
  },
  toMall:function(){
    this.setData({
      boxShow: false,
    })
    wx.navigateTo({
      url: '/pages/mall/mall?deviceId='+this.data.deviceId,
    })
  },
  toTicket:function(){
    wx.navigateTo({
      url: '/pages/ticketCenter/ticketCenter',
    })
  },
  user:function(){
     this.setData({
       wxHeadPic: app.globalData.userInfo.avatarUrl,
       wxName: app.globalData.userInfo.nickName,
       province: app.globalData.userInfo.province,
       city: app.globalData.userInfo.city
     })
  },
  toNoticeList: function () {
    wx.navigateTo({
      url: '/pages/noticeList/noticeList',
    })
  },
  queryUnreadNoticeNum: function () {
    var url = app.globalData.domain + "/scvendor_weixin_user/notice/queryUnreadNoticeNum";
    var data = {
      openid: wx.getStorageSync("openId")
    }
    app.checkLogin(utils.http(url, data, this.getNoticeNum));

  },
  getNoticeNum: function (data) {
    var that = this;
    this.setData({
      noticeNum: data.unreadNoticeNum
    })
  },
  scanCodeLogin: function () {
    wx.scanCode({
      success: function (res) {
        console.log("--result:" + res.result + "--scanType:" + res.scanType + "--charSet:" + res.charSet + "--path:" + res.path);
        var src;
        if (undefined != res.result && null != res.result && '' != res.result) {
          console.log("获取扫描结果：" + res.result);
          src = encodeURIComponent(res.result);
          console.log("获取扫描结果encode：" + src);
          wx.redirectTo({
            url: '../scanCodeToPage/scanCodeToPage?q=' + src,
          });
        }
      },
      fail: function () {
        wx.showModal({
          title: '提示',
          content: '扫描二维码失败',
          showCancel: false,
        });
      }
    })
  },
  orderCenter:function(){
    wx.navigateTo({
      url: '/pages/orderCenter/orderCenter',
    })
  }

})