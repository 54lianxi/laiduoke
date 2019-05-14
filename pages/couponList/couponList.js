// pages/CouponList/CouponList.js
var app=getApp();
var utils=require("../../utils/util.js");
Page({
  data: {
    nodata:false,
    onmore:false,
    mchid:'',
    couponId:'',
    pageNum:1,
    pageSize:10

  },

  onLoad: function (options) {
    console.log("c>>>>>"+JSON.stringify(options));
    if (options.m == 'null' || options.m == '' || options.m == undefined){
      console.log("m");
      this.setData({
        mchid: '',
        couponId: options.c,
      })
      return;
    }
    
    else if (options.c == 'null' || options.c == '' || options.c==undefined ) {
      this.setData({
        couponId: '',
        mchid: options.m,
      })
      return;
    }else{
      this.setData({
        mchid: options.m,
        couponId: options.c,
      })
    }
    // console.log(JSON.stringify(options));
    
    
  },


  onShow: function () {
    var that = this;
    if (app.globalData.userInfo == null || app.globalData.userInfo == '') {
      console.log("没有用户信息")
      app.checkLogin(app.getUserInfo, that.queryCouponList, that);
    }else{
      app.checkLogin(that.queryCouponList);
    } 
  },

  queryCouponList:function(){
    app.checkLogin(this.couponList);
    
  },
  couponList:function(){
    var url = app.globalData.domain + "/scvendor_weixin_user/coupon/queryCouponList";
    var data = {
      openid:wx.getStorageSync("openId"),
      mchid: this.data.mchid,
      couponId: this.data.couponId,
      pageNum: this.data.pageNum,
      pageSize: this.data.pageSize
    }
    app.checkLogin(utils.http(url, data, this.listCoupon));
  },
  listCoupon:function(data){
    for(var i=0;i<data.data.length;i++){
      // console.log(typeof(data.data[i].deadline));
      data.data[i].deadline = data.data[i].deadline.substring(0,19);
    }
    if(this.data.pageNum==1){
      if(data.data.length==0){
        this.setData({
          nodata:true
        })
        return;
      }
      this.setData({
        list: data.data
      })
    }else{
      if(data.data.length==0){
        this.setData({
          nomore:true
        })
      }
      var list=this.data.list;
      list=list.concat(data.data);
      this.setData({
        list:list
      })
    }
    wx.hideLoading();
    
  },
  onReachBottom:function(){
    console.log("加载下一页"); 
    this.data.pageNum++;
    this.couponList();
    wx.showLoading({
      title: '加载中',
    })


  },
  getCoupon:function(e){  
    var index=e.currentTarget.dataset.index;
    var disabled = "list[" + index + "].getStatus";
    this.setData({
      [disabled]:1
    })
    console.log(JSON.stringify(this.data.couponInfo));
    var url = app.globalData.domain + "/scvendor_weixin_user/coupon/getCoupon";
    var data={
      openid:wx.getStorageSync("openId"),
      weixinNickname: app.globalData.userInfo.nickName,
      weixinHead: app.globalData.userInfo.avatarUrl,
      couponId: this.data.list[index].couponId
    }
    app.checkLogin(utils.http(url, data, this.getSuccess));
  },
  getSuccess:function(data){
    var that = this;
    wx.showToast({
      title: '领取成功',
      icon:"success",
      duration:1000,
      complete:function(){
        that.queryCouponList();
      }
    })

  },
  toIndex:function(){
    wx.redirectTo({
      url: '../index/index',
    })
  }


})