// pages/customerService/customerService.js
var app=getApp();
var utils=require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type:"出货失败",
    key:[10,20,30],
    range: ["出货失败", "设备无法使用","其它"],
    picture:[],
    change_index:0,
    deviceId:'',
    name:'',
    phone:'',
    // disabled:false,
    deviceIdShow: false,
    addShow:true,
    picDetailShow:false,
    dis:false,
    disabled2:false

  },

  onLoad: function (options) {
    console.log(options);
  
  },
  onShow:function(){
    if (app.globalData.userInfo == null || app.globalData.userInfo == '') {
      console.log("有昵称");
      app.checkLogin(app.getUserInfo, this.user, this);
    } else {
      console.log("无昵称");
      this.user();
    }
  },
  user: function () {
    this.setData({
      wxHeadPic: app.globalData.userInfo.avatarUrl,
      wxName: app.globalData.userInfo.nickName,
      province: app.globalData.userInfo.province,
      city: app.globalData.userInfo.city
    })
  },
  change:function(e){
    if (e.detail.value == 0){
      this.setData({
        deviceIdShow:false
      })
    }else{
      this.setData({
        deviceIdShow: true
      })
    }
    this.setData({
      change_index: e.detail.value,
      type: this.data.range[e.detail.value]
    })

  },
  subject:function(e){
    this.setData({
      subject:e.detail.value
    })
  },
  content: function (e) {
    this.setData({
      content: e.detail.value
    })
  },
  deviceId: function (e) {
    this.setData({
      deviceId: e.detail.value
    })
  },
  name: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  phone: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },

  addpic: function () {//点击事件
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        console.log("tempFilePaths" + tempFilePaths);
        that.setData({
          pictrue: tempFilePaths
        })
        wx.uploadFile({
          url: app.globalData.domain + '/scvendor_weixin_user/advise/uploadProductImage',
          //method: 'post',
          filePath: tempFilePaths[0],
          name: "file",
          formData: { "imageFile": tempFilePaths, },
          header: {
            'Content-Type': ' multipart/form-data'
          },
          success: function (res) {
            console.log(res);
            var data = JSON.parse(res.data);
            if (data.retCode == 0) {
              var imageUrl = data.url;
              console.log("imageUrl:" + imageUrl);
              var pic=that.data.picture;
              pic.push(imageUrl);
              console.log("pic"+typeof(pic));
              that.setData({
                picture: pic
              })
              if(pic.length==4){
                that.setData({
                  addShow: false
                })
                
              }
              wx.showToast({
                title: '上传成功',
                icon: 'success',
                duration: 2000
              })
            }
            if (data.retCode == 21300) {
              wx.showModal({
                title: '提示',
                content: '[21300]系统繁忙，请稍后再试！',
                showCancel: false,
                confirmText: '知道了',
              })
            }
            if (data.retCode == 21301) {
              wx.showModal({
                title: '提示',
                content: '[21301]请登录！',
                showCancel: false,
                confirmText: '知道了',
              })

            }

          },
          fail: function (res) {
            wx.showToast({
              title: '系统繁忙，请稍后再试！',
              duration: 2000
            });
          },
        });
      }
    })
  },
  submit:function(){
    this.setData({
      disabled2:true
    })
    if (null == this.data.content || '' == this.data.content){
      wx.showModal({
        title: '提示',
        content: '建议内容不能为空',
        showCancel: false
      })
      this.setData({
        disabled2: false
      })
      return;
    } else if ((null == this.data.deviceId ||'' == this.data.deviceId)&& this.data.change_index !=0) {
      console.log()
      wx.showModal({
        title: '提示',
        content: '建议设备号不能为空',
        showCancel: false
      })
      this.setData({
        disabled2: false
      })
      return;
    } else if (null != this.data.phone && '' != this.data.phone && this.data.phone.length != 11){
      wx.showModal({
        title: '提示',
        content: '您的手机号格式有误，请重新输入',
        showCancel:false
      })
      this.setData({
        disabled2: false
      })
      return;
    }

    var url = app.globalData.domain + '/scvendor_weixin_user/advise/commitAdvise';
    var data={
      openid:wx.getStorageSync("openId"),
      weixinNickname: app.globalData.userInfo.nickName,
      weixinHead: app.globalData.userInfo.avatarUrl,
      adviseType: this.data.key[this.data.change_index],
      adviseSubject: this.data.range[this.data.change_index],
      adviseContent:this.data.content,
      adviseImages:JSON.stringify(this.data.picture),
      deviceId:this.data.deviceId,
      name:this.data.name,
      mobile:this.data.phone
    }
    app.checkLogin(utils.http(url, data, this.success, this.disabled));

  },
  disabled:function(){
    this.setData({
      disabled2: false
    })
  },
  success:function(){
    wx.redirectTo({
      url: '/pages/messagesuccess/messagesuccess',
    })
  },
  picDetail:function(e){
    var index=e.target.dataset.index;
    console.log(index);
    this.setData({
      alldis:true,
      index:index,
      picDetailShow:true,
      picUrl:this.data.picture[index],
      
    })
  },
  close:function(){
    this.setData({
      picDetailShow:false,
      alldis: false,
    })
    
  },
  delete:function(){
    var picture = this.data.picture;
    picture.splice(this.data.index,1);
    this.close();
    this.setData({
      picture:picture,
      addShow: true
    })
    
  }




})