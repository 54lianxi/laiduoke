var app = getApp();
var utils = require("../../utils/util.js");
Page({
  data: {
    totalnum: 0,
    cartShow: false,
    detailShow: false,
    navActive: 0,
    totalPrice: 0,
    left: '20%',
    leftShow: true,
    lastActive: 0,
    dotsShow:true,
    noticeheight:0,
    isPay:false

  },
  onLoad: function(options) {
    var that = this;
    that.setData({
      deviceId: options.deviceId,
      goodnum: wx.getStorageSync("good" + [options.deviceId])
    })
    
    this.setData({
      totalnum: this.getTotalNum(),
    })    
    
    


  },
  onShow:function(){
    console.log("onshow");
    var that = this;
    if(this.data.isPay==false){
      if (app.globalData.userInfo == null || app.globalData.userInfo == '') {
        console.log("没有用户信息")
        app.checkLogin(app.getUserInfo, that.load, that);
      } else {
        console.log("有用户信息");
        this.user();
        this.load();
      }
      console.log("开始执行别的函数啦")

      this.setData({
        totalnum: this.getTotalNum(),
      })
    }


  },
  queryDeviceInfo:function(){
    var url = app.globalData.domain +'/scvendor_weixin_user/deviceMall/queryDeviceInfo';
    var data={
      deviceId:this.data.deviceId,  
    }
    app.checkLogin(utils.http(url,data,this.game));
  },
  game:function(data){
    wx.setNavigationBarTitle({
      title: data.name+"（" + this.data.deviceId + ")"
    })
    if (data.gameFlag==1){
      this.setData({
        gameFlag:true,
        deviceName:data.name
      })
    }
  },

  load:function(){
    this.queryUnreadNoticeNum();
    this.isDisabled();
    this.queryCategory();
    this.queryDeviceInfo();
    // this.getAd();
  },
  toNoticeList:function(){
    wx.navigateTo({
      url: '/pages/noticeList/noticeList',
    })
  },
  queryUnreadNoticeNum:function(){
    var url = app.globalData.domain +"/scvendor_weixin_user/notice/queryUnreadNoticeNum";
    var data={
      openid:wx.getStorageSync("openId")
    }
    app.checkLogin(utils.http(url,data,this.getNoticeNum));

  },
  getNoticeNum:function(data){
    var that=this;
    if (data.unreadNoticeNum>0){
      this.setData({
        noticeheight:30
      })
    }else{
      this.setData({
        noticeheight:0
      })
    }
    // wx.getSystemInfo({
    //   success: function (res) {
    //     var windowWidth = res.windowWidth;
    //     that.setData({
    //       adtop: 50 + that.data.noticeheight,
    //       height: res.windowHeight - 50 - that.data.adheight - that.data.noticeheight,
    //       detailheight: res.windowHeight - 160,
    //       contenttop: 50 + that.data.adheight + that.data.noticeheight,
    //       adheight: that.data.adheight
    //     })
    //   },
    // })
    this.setData({
      noticeNum:data.unreadNoticeNum
    })
    this.getAd();
  },
  user: function() {
    this.setData({
      wxHeadPic: app.globalData.userInfo.avatarUrl,
      wxName: app.globalData.userInfo.nickName,
      province: app.globalData.userInfo.province,
      city: app.globalData.userInfo.city
    })
  },
  //绑定在第一张图片上，当有广告时获取图片大小和其他页面布局的宽高
  imgInfo:function(e){
    console.log("bindload>>>>>>>>");
    var that=this;
    var imgHeight=e.detail.height;
    var imgWidth=e.detail.width;
    console.log("imgWidth"+imgWidth);
    wx.getSystemInfo({
      success: function (res) {
        var windowWidth = res.windowWidth;
        var ratio = windowWidth / imgWidth;
        var adheight=ratio*imgHeight;
        that.setData({
          adtop: 50 + that.data.noticeheight,
          height: res.windowHeight - 50 - adheight - that.data.noticeheight,
          detailheight: res.windowHeight - 160,
          contenttop: 50 + adheight + that.data.noticeheight,
          adheight: adheight
        })
      },
    })
  },
  //发送请求给广告接口，拉取广告
  getAd:function(){
    var deviceId = this.data.deviceId;
    var url = app.globalData.domain + '/scvendor_weixin_user/deviceMall/queryAdvertInfo';
    var data = {
      deviceId: deviceId
    };
    app.checkLogin(utils.http(url, data, this.listAd));
  },
  //广告的排列展示
  listAd:function(data){
    var that=this;
    console.log("data"+data.data);
    if (data.data != "" && data.data != [] && data.data != null && data.data != "[]"){
      console.log("有广告");
      data = JSON.parse(data.data);
      
      if(data.length==1){
        this.setData({
          dotsShow:false
        })
      }
      console.log(JSON.stringify(data));
      this.setData({
        adList: data,
        adShow: true
      })
    }else{
      console.log("没有广告");
      this.setData({
        adShow: false
      })
      //当判断没有广告时，设置各种页面布局的宽高
      wx.getSystemInfo({
        success: function (res) {
          var windowWidth = res.windowWidth;
          that.setData({
            height: res.windowHeight - 50 - that.data.noticeheight,
            detailheight: res.windowHeight - 160,
            contenttop: 50+that.data.noticeheight,
          })
        },
      })

    }
    
  },
  //点击购物车按钮显示时间
  onCart: function() {
    if (this.data.totalnum == 0) {
      wx.showModal({
        title: '提示',
        content: '购物车里暂时还没有任何商品，请先添加商品',
        showCancel:false,
      })
      return;
    }
    var cartShow = this.data.cartShow;
    this.setData({
      cartShow: !cartShow
    })
    this.getCart();
  },
  //获取购物车内的商品，更新数据
  getCart: function() {
    var good = wx.getStorageSync("good" + [this.data.deviceId]);
    var cartDetail = [];
    var detail_length = this.data.detail.length;
    for (var idx in good) {
      for (var i = 0; i < detail_length; i++) {
        var good_detail = this.data.detail[i];
        for (var j = 0; j < good_detail.length; j++) {
          var b = good_detail[j].barcode;
          if (idx == b) {
            var temp = {
              id: b,
              num: good[idx],
              goodname: good_detail[j].name,
              price: good_detail[j].salePrice,
            };
            cartDetail.push(temp)
          }
        }
      }
    }
    this.setData({
      cartDetail: cartDetail
    })
    this.getTotalPrice();
  },
  //点击清空购物车
  reset: function() {
    wx.removeStorageSync("good" + [this.data.deviceId]);
    this.setData({
      totalnum: this.getTotalNum(),
      // totalPrice:this.getTotalPrice(),
      cartDetail: [],
      goodnum: []
    })
    this.close();
    this.getTotalPrice();
    this.isDisabled();
  },
  //操纵购物车关闭
  close: function() {
    this.setData({
      cartShow: false
    })
  },
  //发送请求给查询设备分类的接口
  queryCategory: function() {
    var deviceId = this.data.deviceId;
    var url = app.globalData.domain + '/scvendor_weixin_user/deviceMall/queryCategory';
    var data = {
      deviceId: deviceId
    };
    app.checkLogin(utils.http(url, data, this.listCategory));
  },
  //将查询分类结果排列好，渲染界面
  listCategory: function(data) {
    this.setData({
      category1: data.data //暂时存放分类，绑定等和商品一起绑定
    })
    this.queryProductList();
  },
  scanCodeLogin: function() {
    wx.scanCode({
      success: function(res) {
        console.log("--result:" + res.result + "--scanType:" + res.scanType + "--charSet:" + res.charSet + "--path:" + res.path);
        var src;
        if (undefined != res.result && null != res.result && '' != res.result) {
          console.log("获取扫描结果：" + res.result);
          src = encodeURIComponent(res.result);
          console.log("获取扫描结果encode：" + src);
          wx.redirectTo({
            url: '../../scanCodeToPage/scanCodeToPage?q=' + src,
          });
        }
      },
      fail: function() {
        wx.showModal({
          title: '提示',
          content: '扫描二维码失败',
          showCancel: false,
        });
      }
    })
  },
  //向查询在售商品的界面发送请求
  queryProductList: function() {
    var deviceId = this.data.deviceId;
    var url = app.globalData.domain + '/scvendor_weixin_user/deviceMall/queryProductList';
    var data = {
      deviceId: deviceId,
      openid:wx.getStorageSync("openId")
    };
    app.checkLogin(utils.http(url, data, this.listProduct));
  },
  //将所有商品排列，渲染界面
  listProduct: function(data) {
    this.setData({
      productList: data.data
    })
    //只得到当前分类的ID成为一个数组
    var arr = [];
    for (var i = 0; i < this.data.category1.length; i++) {
      arr.push(this.data.category1[i].categoryId);
    }
     console.log('arr'+arr);
    var arra = []; //用来保存商品分类在当前分类里的数组
    var arrb = []; //用来保存商品分类不在点钱分类里的数组
    for (var i = 0; i < data.data.length; i++) {
      // if(data.data[i].name.length>5){
      //   data.data[i].name = data.data[i].name.substring(0,5)+"...";        
      // }
      var b = arr.indexOf(data.data[i].categoryId);
      //商品分类在分类数组里
      if (b != -1) {
        arra.push(data.data[i]); //得到有分类的数组
      } else {
        if (data.data[i].canBuyNum>0){
          arrb.unshift(data.data[i])
        }else{
          arrb.push(data.data[i]); 
        }
        //得到没有分类的数组
      }
    }
    console.log("arra"+JSON.stringify(arra));
    console.log("arrb"+arrb);
    var arrc = [];
    for (var i = 0; i < arr.length; i++) {
      arrc[i] = [];
      for (var j = 0; j < arra.length; j++) {
        if (arr[i] == arra[j].categoryId) {
          if (arra[j].canBuyNum>0){
            arrc[i].unshift(arra[j]);
          }else{
            arrc[i].push(arra[j]);
          }
          // console.log("arrc[i]"+JSON.stringify(arrc[i]));
          
        }
      }

    }
    console.log("arrc"+JSON.stringify(arrc));
    var category = this.data.category1;
    if (arrb != [] && arrb != "" && arrb !=null) {
      arrc = arrc.concat([arrb]);
      var s = {
        cartgoryId: -1,
        categoryName: "其他"
      }
      category = category.concat(s);
    }
    if (arrc.length <= 1) {
      this.setData({
        left: '0%',
        leftShow: false
      })
    }
    this.setData({
      detail: arrc,
      category: category,
    })
    this.getCart();
    //获得每个分类的高，方便后面滚动时左边的分类变化
    var height = 0;
    var heightArr = [];
    for (var i = 0; i < this.data.detail.length; i++) {
      height = height + 34 + this.data.detail[i].length * 90;
      heightArr.push(height);
    }
    // console.log(heightArr);
    this.setData({
      heightArr: heightArr
    })
    
   
    

  },
  //判断买单按钮是否显示
  isDisabled: function() {
    if (this.data.totalnum > 0) {
      this.setData({
        disabled: false
      })
    } else {
      this.setData({
        disabled: true
      })
    }
  },
  //获得当前购物车里总商品数
  getTotalNum: function() {
    var good = wx.getStorageSync("good" + [this.data.deviceId]);
    var num = 0;
    for (var key in good) {
      num = num + good[key];
    }
    return (num);
  },
  getTotalPrice: function() {
    var price = 0;
    for (var i = 0; i < this.data.cartDetail.length; i++) {
      price = price + this.data.cartDetail[i].price * this.data.cartDetail[i].num;
    }
    this.setData({
      totalPrice: price
    })
  },
  //左边分类的点击事件
  tap: function(e) {
    var id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    this.setData({
      toView: id,
      navActive: index
    });


  },
  //添加商品按钮的点击事件
  add: function(e) {
    if (this.getTotalNum() >= 5) {
      wx.showModal({
        title: '提示',
        content: '您购物车里的宝贝已到达上限：5个',
        showCancel:false,
      })
      return;
    }
    var barcode = e.currentTarget.dataset.barcode;
    for (var j = 0; j < this.data.productList.length; j++) {
      if (this.data.productList[j].barcode == barcode) {
        var canBuyNum = this.data.productList[j].canBuyNum;
        var stock = this.data.productList[j].stock;
      }
    }
    var isExist = wx.getStorageSync("good" + [this.data.deviceId]);
    if (isExist != '') {
      console.log("good的缓存已存在");
      var good = wx.getStorageSync("good" + [this.data.deviceId]);
      if (good[barcode]) {
        console.log("该商品已存在");
        var i = parseInt(good[barcode]);
        if (i >= canBuyNum && canBuyNum==stock) {
          wx.showModal({
            title: '提示',
            content: '该商品的库存不足,不能再增加更多,请选择其他商品',
            showCancel: false,
          })
          return;
        } else if (i >= canBuyNum && canBuyNum < stock){
          wx.showModal({
            title: '提示',
            content: '购买数量已达上限，请选择其他商品',
            showCancel: false,
          })
          return;
        }
         else {
          good[barcode] = i + 1;
        }
      } else {
        console.log("该商品还不存在");
        if (canBuyNum >= 1) {
          good[barcode] = 1;
        } else if (canBuyNum < stock){
          wx.showModal({
            title: '提示',
            content: '购买数量已达上限，请选择其他商品',
            showCancel: false,
          })
          return;
        }
        else {
          console.log("库存为0");
          wx.showModal({
            title: "提示",
            content: '该商品的库存不足，请选择其他商品',
            showCancel: false,
          })
          return;
        }
      }
      wx.setStorageSync("good" + [this.data.deviceId], good);
      this.setData({
        goodnum: good,
        totalnum: this.getTotalNum()
      })
    } else {
      console.log("good的缓存还不存在");
      wx.setStorageSync("good" + [this.data.deviceId], good);
      var good = {};
      if (canBuyNum >= 1) {
        good[barcode] = 1;
      }
      else if (canBuyNum < stock) {
        wx.showModal({
          title: '提示',
          content: '购买数量已达上限，请选择其他商品',
          showCancel: false,
        })
        return;
      }
      else{
        console.log("库存为0");
        wx.showModal({
          title: "提示",
          content: '该商品的库存不足，请选择其他商品',
          showCancel: false,
        })
        return;
      }
      // good[barcode] = 1;
      wx.setStorageSync("good" + [this.data.deviceId], good);
      this.setData({
        goodnum: good,
        totalnum: 1
      })

    }
    this.isDisabled();
    this.getCart();

  },
  //减少商品按钮的点击事件
  reduce: function(e) {
    var barcode = e.currentTarget.dataset.barcode;
    var good = wx.getStorageSync("good" + [this.data.deviceId]);
    var i = parseInt(good[barcode]);
    good[barcode] = i - 1;
    if (good[barcode] == 0) {
      delete(good[barcode]);
    }
    wx.setStorageSync("good" + [this.data.deviceId], good);
    this.setData({
      goodnum: good,
      totalnum: this.getTotalNum()
    })
    this.isDisabled();
    this.getCart();
    if (this.data.cartDetail.length == 0) {
      this.close();
      return;
    }
  },
  closeDetail: function() {
    this.setData({
      detailShow: false
    })
    this.data.goodDetail = null;
  },
  toDetail: function(e) {
    var barcode = e.currentTarget.dataset.barcode;
    // console.log("barcode" + barcode);
    this.setData({
      detailShow: true
    })
    var productList = this.data.productList;
    var goodDetail = {}
    for (var i = 0; i < productList.length; i++) {
      if (productList[i].barcode == barcode) {
        goodDetail.name = productList[i].name;
        if (productList[i].introduce != '' && productList[i].introduce != null) {
          goodDetail.description = JSON.parse(productList[i].introduce).description;
          goodDetail.imgList = JSON.parse(productList[i].introduce).imgList;
        } else {
          goodDetail.description = '';
          goodDetail.imgList = '';

        }
        this.setData({
          goodDetail: goodDetail
        })
        return;
      }
    }

  },
  paymoney: function(e) { 
    this.setData({
      disabled:true
    })
    var that = this;
    var url = app.globalData.domain + "/scvendor_weixin_user/pay/placeOrder";
    var cartDetail = this.data.cartDetail;
    var value = [];
    for (var i = 0; i < cartDetail.length; i++) {
      var temp = {
        "barcode": cartDetail[i].id,
        "salePrice": cartDetail[i].price,
        "number": cartDetail[i].num
      }
      value.push(temp);
    }
    var data = {
      deviceId: that.data.deviceId,
      totalFee: that.data.totalPrice,
      goodsDetail: JSON.stringify(value)
    }
    app.checkLogin(utils.http(url, data, that.queryOrderAndCoupon,that.reset));

  },
  queryOrderAndCoupon:function(data){
    var orderId = data.orderId;
    this.setData({
      orderId: orderId
    })
    var url = app.globalData.domain + "/scvendor_weixin_user/pay/queryOrderAndCoupon";
    var data = {
      openid:wx.getStorageSync("openId"),
      orderId: orderId
    }
    app.checkLogin(utils.http(url, data, this.result));
  },
  result:function(data){
    if (data.couponInfo.length==0){
       this.order();
    }else{
      var data=JSON.stringify(data);
      console.log(data);
      wx.navigateTo({
        url: '/pages/queryOrderCoupon/queryOrderCoupon?data='+data+'&&orderId='+this.data.orderId,
      })
      this.reset();
    }
  },
  order: function(data) {
    var orderId = this.data.orderId;
    var url = app.globalData.domain + "/scvendor_weixin_user/pay/payOrder";
    var data = {
      openid: wx.getStorageSync("openId"),
      weixinNickname: this.data.wxName,
      weixinHead: this.data.wxHeadPic,
      orderId: orderId
    }
    // app.checkLogin(utils.http(url, data, this.pay));
    app.checkLogin(utils.http(url, data, this.pay,this.isDisabled));
  },
  pay: function(data) {
    this.setData({
      isPay:true
    })
    var that=this;
    wx.requestPayment({
      timeStamp: data.timeStamp,
      nonceStr: data.nonceStr,
      package: data.package,
      signType: 'MD5',
      paySign: data.paySign,
      success: function(res) {
        wx.showModal({
          title: '提示',
          content: '付款成功,请在售货机上领取商品',
          showCancel:false,
        })
        that.setData({
          disabled: false
        })
        that.setData({
          totalnum: that.getTotalNum(),
        })
        that.reset();
        that.isDisabled();
        that.queryCategory();
      },
      fail: function(res) {
        console.log("付款失败");
        that.isDisabled();
        // that.setData({
        //   disabled: false
        // })
      }
    })
  },
  scroll: function(e) {
    var scrollTop = e.detail.scrollTop;
    var scrollArr = this.data.heightArr;
    var that = this;
    if (scrollTop > scrollArr[scrollArr.length - 1] - this.data.height) {
      return;
    } else {
      for (var i = 0; i < scrollArr.length; i++) {
        if (scrollTop >= 0 && scrollTop < scrollArr[0]) {
          if (0 != this.data.lastActive) {
            this.setData({
              navActive: 0,
              lastActive: 0
            })
          }

        } else if (scrollTop >= scrollArr[i - 1] && scrollTop <= scrollArr[i]) {
          if (i != this.data.lastActive) {
            that.setData({
              navActive: i,
              lastActive: i

            })
          }

        }
      }
    }
  },
  onPullDownRefresh:function(){
    this.setData({
      totalnum: this.getTotalNum(),
    })
    this.queryUnreadNoticeNum();
    this.isDisabled();
    this.queryCategory();
    wx.stopPullDownRefresh();
  }



})