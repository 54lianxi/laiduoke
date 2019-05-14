const app = getApp();
Page({
  data:{
    page:null
  },
  onLoad:function(options){
    console.log(JSON.stringify(options));
    var that=this;
    //  if(options.p!=null){
    //    that.setData({
    //      page:options.p
    //    })
    //  }
    //  if (options.deviceId!=null){
    //    console.log("带了deviceId过来");
    //    that.setData({
    //      deviceId: options.deviceId
    //    })
    //  }
    // if (options.page == "customerService") {
    //   console.log("customerService");
    //   that.setData({
    //     b: options.page
    //   })
    // }
  },
  bindGetUserInfo: function () {
    var that=this;
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.navigateBack({
            delta: 1,
          })
          //  if(that.data.page!=null){
          //    console.log("跳到支付界面");
          //    wx.redirectTo({
          //      url: '/pages/pay/pay?op='+that.data.page,
          //    })
          //  } else if (that.data.deviceId != null && that.data.deviceId != undefined){
          //    console.log("跳到商城界面");
          //    console.log(that.data.deviceId);
          //    wx.redirectTo({
          //      url: '/pages/machineMall/list/list?deviceId=' + that.data.deviceId,
          //    })
          //  } 
          //  else if (that.data.b != null && that.data.b != undefined) {
          //    console.log("客服反馈页面");
          //    wx.redirectTo({
          //      url: '/pages/customerService/customerService',
          //    })
          //  }         
          //  else{
          //    console.log("跳到首页");
          //    wx.redirectTo({               
          //      url: '/pages/index/index',
          //    })
          //  }
           
          
        }
      }
    })
  }
})