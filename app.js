//app.js
App({
  onLaunch: function () {
    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调

      console.log(res.hasUpdate)
    })

    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })

    })

    updateManager.onUpdateFailed(function () {
      // 新的版本下载失败
      wx.showModal({
        title: '更新提示',
        content: '新版本下载失败',
        showCancel: false
      })
    })
  },
  globalData: {
    userInfo: null,
    domain: 'https://dev.sichang.com.cn'
  },
  checkLogin: function (func1, func2, vari,vari2) {
    console.log("checkLogin函数");
    var that = this;
    var openId = wx.getStorageSync('openId');
    console.log("openId"+openId);
    if (openId) {
      console.log("openid缓存还在");
      if (undefined != func1) {
        console.log("执行函数1");
        func1(func2, vari,vari2);
      }
      return;
    }
      console.log("openid缓存不在");
      wx.login({
        success: function (res) {
          console.log("loginsucess");
          var appid = 'wx75adde265eea9c0e'; //填写微信小程序appid  
          var secret = 'd71a8558676be1810ef5a3a3a8026da7'; //填写微信小程序secret 
          //调用request请求api转换登录凭证  
          if (res.code) {
            wx.request({
              url: that.globalData.domain + '/scvendor_weixin_user/user/queryOpenid',
              data: {
                code: res.code
              },
              method: "POST",
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              success: function (res) {
                console.log("sucess");
                switch (res.data.retCode) {
                  case 0:
                    console.log("openid为:" + res.data.openid) //获取openid
                    var openId = res.data.openid;
                    wx.setStorageSync('openId', openId);

                    if (undefined != func1) {
                      console.log("执行函数2");
                      func1(func2, vari, vari2);
                      console.log("执行回调");
                    }
                    break;
                  case 20400:
                    wx.showModal({
                      title: '提示',
                      content: '[20400]系统繁忙！请稍后再试',
                      showCancel: false,
                    });
                    break;
                  case 20422:
                    wx.showModal({
                      title: '提示',
                      content: '[20422]授权码错误！',
                      showCancel: false,
                    });
                    break;
                  default:
                    wx.showModal({
                      title: '提示',
                      content: '系统繁忙，请稍后再试！',
                      showCancel: false,
                    });
                    break;
                }
              },
              fail: function (errMsg) {
                console.log("获取openid失败") //获取openid
                wx.showModal({
                  title: '提示',
                  content: '系统繁忙，请稍后再试！',
                  showCancel: false,
                });
              }
            }) //getOpenid接口
          } //如果登录凭证存在
          else {
            console.log('获取用户登录态失败！' + res.errMsg);
            wx.showModal({
              title: '提示',
              content: '获取用户登录态失败',
              showCancel: false,
            });
          }
        },
        fail: function (error) {
          console.info("获取用户openId失败");
          console.info(error);
        },
      })
    
    
  },//checkLogin函数

  getUserInfo: function (func, vari,vari2) {
    console.log("app.getUserInfo");
    var that = this;
    if (that.globalData.userInfo) {
      console.log("已经有用户信息");
      if (undefined != vari) {
        vari.setData({
          wxHeadPic: that.globalData.userInfo.avatarUrl,
          wxName: that.globalData.userInfo.nickName,
          province: that.globalData.userInfo.province,
          city: that.globalData.userInfo.city
        });
      }
      if (undefined != func) {
        func(vari);
      }
      return;
      
    }
    wx.getUserInfo({
      lang: 'zh_CN',
      success: function (res) {
        var info = res.userInfo;
        that.globalData.userInfo = info;
        console.log("用户信息:");
        console.log(res.userInfo);
        if (undefined != vari) {
          vari.setData({
            wxHeadPic: that.globalData.userInfo.avatarUrl,
            wxName: that.globalData.userInfo.nickName,
            province: that.globalData.userInfo.province,
            city: that.globalData.userInfo.city
          });
          console.log("主页wxName:" + vari.data.wxName);
          console.log("主页头像:" + vari.data.wxHeadPic);
        }
        if (undefined != func) {
          func(vari);
        }
      },
      fail: function (res) {
        wx.navigateTo({
          url: '/pages/authorization/authorization',
        })
        // console.log("跳到授权");
        // if(vari2!=undefined){
        //   console.log("有第四个参数");
        //   if(vari!=null){
        //     var a=JSON.stringify(vari);
        //     console.log(a);
        //     var path = vari.__route__;
        //     if (path == "pages/machineMall/list/list"){
        //       console.log("list");
        //       console.log(vari2);
        //       wx.redirectTo({
        //         url: '/pages/authorization/authorization?deviceId=' + vari2,
        //       })
        //       return;
        //     }
        //     else if (path == "pages/customerService/customerService") {
        //       console.log("list");
        //       console.log(vari2);
        //       wx.redirectTo({
        //         url: '/pages/authorization/authorization?page=customerService',
        //       })
        //       return;
        //     }else{
        //       console.log("else");
        //       var op = JSON.stringify(vari2);
        //       console.log("vari2" + JSON.stringify(vari2));
        //       wx.redirectTo({
        //         url: '/pages/authorization/authorization?p=' + op,
        //       })
        //     }
            
        //   }
          
        // }else{
        //   wx.redirectTo({
        //     url: '/pages/authorization/authorization',
        //   })
        // }
        
      },
    })
  },
  getUserSetting: function (func, vari) {
    var that = this;
    wx.openSetting({
      success: (res) => {
        console.log("openSetting ...." + res.authSetting["scope.userInfo"]);
        if (res.authSetting["scope.userInfo"] == true) {
          console.log("authSetting true");
          that.getUserInfo(func, vari);
        }
        else {
          that.getUserInfo(func, vari);
        }
      }
    })
  },

  GetQueryString(src, name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = src.substr(1).match(reg);
    if (r != null) {
      return r[2];
    }
    return null;
  },

})