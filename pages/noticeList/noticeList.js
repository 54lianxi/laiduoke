var app=getApp();
var utils=require("../../utils/util.js");
Page({
  data:{
    pageNum:1,
    pageSize:15,
    tab:"unread",
    nodata:false,
    nomore:false,
    active:"",
    active2:'noactive'
  },
  onLoad:function(){
    
  },
  onShow:function(){
    this.setData({
      pageNum:1,
      nodata: false,
      nomore: false
    })
    if (this.data.tab =="unread"){
      this.queryUnreadNoticeList();
    }else{
      this.queryReadedNoticeList();
    }
    
  },

  queryUnreadNoticeList:function(){
    var url = app.globalData.domain +"/scvendor_weixin_user/notice/queryUnreadNoticeList";
    var data={
      openid:wx.getStorageSync("openId"),
      status:0,
      pageNum: this.data.pageNum,
      pageSize: this.data.pageSize
    }
    app.checkLogin(utils.http(url,data,this.listUnreadNotice));

  },
  listUnreadNotice:function(data){
    for (var i = 0; i < data.data.length; i++) {
      data.data[i].createTime = data.data[i].createTime.substring(0, 19);
    }
    if (this.data.pageNum==1){
      if(data.data.length==0){
        this.setData({
          nodata:true
        })
        wx.hideLoading();
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
        wx.hideLoading();
        return;
      }
      
      var list=this.data.list;
      list=list.concat(data.data);
      this.setData({
        list: list
      })

    }
    wx.hideLoading();
    
  },
  queryReadedNoticeList:function(){
    var url = app.globalData.domain + "/scvendor_weixin_user/notice/queryUnreadNoticeList";
    var data = {
      openid: wx.getStorageSync("openId"),
      status: 1,
      pageNum: this.data.pageNum,
      pageSize: this.data.pageSize
    }
    app.checkLogin(utils.http(url, data, this.listreadedNotice));
  },
  listreadedNotice:function(data){
    for (var i = 0; i < data.data.length; i++) {
      data.data[i].createTime = data.data[i].createTime.substring(0, 19);
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
  unreadTap: function () {
    this.setData({
      tab:"unread",
      pageNum: 1,
      nodata: false,
      nomore: false,
      list:[],
      active:"",
      active2:'noactive'
    })
    this.queryUnreadNoticeList();
  },
  readedTap: function () {
    this.setData({
      tab:"readed",
      pageNum: 1,
      nodata: false,
      nomore: false,
      list: [],
      active: "noactive",
      active2: ''
    })
    this.queryReadedNoticeList();
  },
  onReachBottom: function () {
    wx.showLoading({
      title: '加载中',
    })
    this.data.pageNum++;
    if (this.data.tab =="unread"){
      this.queryUnreadNoticeList();
    }
    if (this.data.tab == "readed") {
      this.queryReadedNoticeList();
    }
    this.data.pageNum++;

  },
  onHide:function(){
    this.setData({
      list:[]
    })
  }

})