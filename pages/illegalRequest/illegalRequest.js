// pages/illegalRequest/illegalRequest.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    errorMsg:'',
    src:'',
  },
  rescan:function (){
    wx.scanCode ({
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //调用checkLogin()函数检查登录态
    // app.checkLogin();
    var errorMsg = options.title;
    this.setData({
      errorMsg: errorMsg,
    });
  },

  
})