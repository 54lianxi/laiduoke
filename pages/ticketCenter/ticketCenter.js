// pages/ticketCenter/ticketCenter.js
var app=getApp();
var utils=require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageNum:1,
    pageSize:10
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.checkLogin(this.queryHasGetCouponList);
  },
  queryHasGetCouponList:function(){
    var url = app.globalData.domain +"/scvendor_weixin_user/coupon/queryHasGetCouponList";
    var data={
      openid:wx.getStorageSync("openId"),
      pageNum:this.data.pageNum,
      pageSize: this.data.pageSize
    }
    app.checkLogin(utils.http(url, data, this.listCoupon));
  },
  listCoupon:function(data){
    for (var i = 0; i < data.data.length; i++) {
      data.data[i].deadline = data.data[i].deadline.substring(0, 19);
    }
    if (this.data.pageNum == 1) {
      if (data.data.length == 0) {
        this.setData({
          nodata: true
        })
        wx.hideLoading();
        return;
      }

      this.setData({
        list: data.data
      })

    } else {
      if (data.data.length == 0) {
        this.setData({
          nomore: true
        })
        wx.hideLoading();
        return;
      }

      var list = this.data.list;
      list = list.concat(data.data);
      this.setData({
        list: list
      })

    }
    wx.hideLoading();
  },
  onReachBottom:function(){
    console.log("触底了");
    wx.showLoading({
      title: '加载中',
    })
    this.data.pageNum++;
    app.checkLogin(this.queryHasGetCouponList);

  },
  

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },



})