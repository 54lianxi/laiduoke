// pages/orderCenter/orderCenter.js
var app=getApp();
var utils=require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageNum:1,
    nodata:false,
    nomore:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    app.checkLogin(this.queryOrderList);
  },
  queryOrderList:function(){
    var url = app.globalData.domain + '/scvendor_weixin_user/order/queryOrderList';
    var data={
      openid: wx.getStorageSync("openId"),
      pageNum: this.data.pageNum,
      pageSize:10,
    }
    app.checkLogin(utils.http(url, data, this.listData,'',this.hidden));
  },
  hidden:function(){
    wx.hideLoading();
  },
  listData: function (data) {
    wx.hideLoading();
    for (var i = 0; i < data.data.length; i++) {
      data.data[i].goodsDetail1 = JSON.parse(data.data[i].goodsDetail);
      data.data[i].goodsDetail = data.data[i].goodsDetail1[0];
      data.data[i].createTime = data.data[i].createTime.substring(0,19);
      data.data[i].status=false
      // data.data[i].height = 50;
    }
    if (this.data.pageNum == 1) {
      if (data.data.length == 0) {
        this.setData({
          nodata: true
        })
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
        return;
      }
      var list = this.data.list
      list = list.concat(data.data);
      this.setData({
        list: list
      })
    }
  },
  detail:function(e){
    console.log("e"+JSON.stringify(e));
    var index=e.currentTarget.dataset.index;
    var sta = e.currentTarget.dataset.status
    var status = 'list[' + index + '].status';
    if (this.data.list[index].goodsDetail1.length>1){
      this.setData({
        [status]:!sta
      })
    }
    
  },
  onReachBottom: function () {
    wx.showLoading({
      title: '加载中',
    })
    console.log("触底了，加载下一页");
    this.setData({
      pageNum: this.data.pageNum + 1,
    })
    this.queryOrderList();
    wx.hideLoading();
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})