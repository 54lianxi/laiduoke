// pages/scanCodeToPage/scanCodeToPage.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    action: '',
    para: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var action;
    var para;
    var that = this;
    if (undefined != options.q) {
      var src = decodeURIComponent(options.q);
      src = src.substr(src.indexOf('?'));
      action = app.GetQueryString(src, "a");
      if (undefined == action || null == action || '' == action) {
        wx.redirectTo({
          url: '../illegalRequest/illegalRequest?title=非法请求，请重新扫码！',
        });
        return;
      }
      para = app.GetQueryString(src, "para");
      if (undefined != para && '' != para && null != para) {
        wx.redirectTo({
          url: '../' + action + '/' + action + '?para=' + para,
        });
        return;
      }
      console.log("para" + para);
      var q = src.substring(src.indexOf('&') + 1);

      // that.setData({
      //   action: action,
      //   para: para,
      // });
      wx.redirectTo({
        url: '../' + action + '/' + action + '?' + q || para,
      });

      // }


    } else {
      wx.redirectTo({
        url: '../illegalRequest/illegalRequest?title=非法请求，请重新扫码！',
      });
    }
  },

})