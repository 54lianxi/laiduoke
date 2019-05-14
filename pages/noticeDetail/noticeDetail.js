// pages/noticeDeatil/noticeDeatil.js
var app=getApp();
var utils=require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     this.setData({
       noticeId: options.noticeId,
       subject: options.subject,
       content: options.content,
       createTime: options.createTime,
     })
    if (options.status==0){
      var url = app.globalData.domain + "/scvendor_weixin_user/notice/readNotice";
      var data = {
        openid: wx.getStorageSync("openId"),
        noticeId: options.noticeId
      }
      app.checkLogin(utils.http(url, data, this.listData));
    }
    

  },
  listData:function(data){
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