// pages/queryAdviseList/queryAdviseList.js
var utils=require("../../utils/util.js");
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageNum: 1,
    pageSize: 12,
    nomore:false,
    nodata:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.queryAdviseList();
  },
  queryAdviseList:function(){
    var url = app.globalData.domain +'/scvendor_weixin_user/advise/queryAdviseList';
    var data={
      openid:wx.getStorageSync("openId"),
      pageNum: this.data.pageNum,
      pageSize: this.data.pageSize
    }
    app.checkLogin(utils.http(url,data,this.listAdvice));    
  },
  listAdvice:function(data){
    

    for (var i = 0; i < data.data.length; i++) {
      data.data[i].createTime = data.data[i].createTime.substring(0,19);
      data.data[i].replyTime = data.data[i].replyTime.substring(0, 19);
    }
    if(this.data.list==undefined){
      if(data.data.length==0){
        this.setData({
          nodata:true
        })
      }
      this.setData({
        list: data.data
      })
    }else{
      if (data.data.length == 0) {
        this.setData({
          nomore: true
        })
        return;
      }
      var list=this.data.list
      console.log(list.length);
      list=list.concat(data.data);
      console.log(list.length);
      this.setData({
        list: list
      })
    }
  },
  onReachBottom:function(){
    wx.showLoading({
      title: '加载中',
    })
    console.log("触底了，加载下一页");
    this.setData({
      pageNum: this.data.pageNum+1,
    })
    this.queryAdviseList();
    wx.hideLoading();
    
  }
  





})