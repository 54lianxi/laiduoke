   // pages/gameRule/gameRule.js
const app = getApp();
var utils=require("../../utils/util.js")
var timer;
var progressTimer;
var progressDown;
var countDown;
var resultMusic;
var backgroundMusic;
var timeOut5;
var timeOut10;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    leftImg: 'leftImg1.png',
    rightImg: 'problem.png',
    go:'3.png',
    // count: 0,
    // count2: 0,
    hasClick: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var gameOrderId = String(options.deviceId)+(new Date()).getTime();
    console.log('gameOrderId' + gameOrderId);
    this.setData({
      price:options.price,
      name:options.name,
      image:options.image,
      gameOrderId: gameOrderId,
      deviceId: options.deviceId,
      weixinNickname: options.weixinNickname,
      weixinHead: options.weixinHead,
      goodsBarcode: options.goodsBarcode,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  placeOrderForGame:function(){
    this.setData({
      disabled:true
    })
    var that=this;
    setTimeout(function(){
      that.setData({
        disabled:false
      })
    },2000)
    var url = app.globalData.domain +'/scvendor_weixin_user/game/placeOrderForGame';
    var data={
      deviceId: this.data.deviceId,
      openid: wx.getStorageSync("openId"),
      weixinNickname: this.data.weixinNickname,
      weixinHead: this.data.weixinHead,
      gameOrderId: this.data.gameOrderId,
      payAmount:100,
      goodsAmount:100,
      goodsBarcode: this.data.goodsBarcode,
      goodsName:this.data.name,
      goodsPrice:this.data.price,
      goodsNumber:1
    }
    app.checkLogin(utils.http(url,data,this.getOrderId));
  },
  // noDisabled:function(){
  //    this.setData({
  //      disabled:false
  //    })
  // },
  getOrderId:function(data){
    if(data.orderId!=null&&data.orderId!=undefined){
       this.setData({
         orderId: data.orderId
       })
       app.checkLogin(this.payOrder());
    }
  },
  payOrder:function(){
    var url = app.globalData.domain + '/scvendor_weixin_user/game/payOrder';
    var data={
      openid:wx.getStorageSync("openId"),
      orderId: this.data.orderId,
      weixinNickname: this.data.weixinNickname,
      weixinHead: this.data.weixinHead,
    }
    app.checkLogin(utils.http(url,data,this.pay));
  },
  pay:function(data){
    var that=this;
    wx.requestPayment({
      timeStamp: data.timeStamp,
      nonceStr: data.nonceStr,
      package: data.package,
      signType: 'MD5',
      paySign: data.paySign,
      success:function(){
        that.setData({
          gameShow:true,
          beginShow:true
        })
      }
    })
  },
  queryGameResult:function(){
    var num=Math.random();
    console.log("num"+num);
    if (parseInt(num * 10)>=8){
      if(this.data.result!=3){
        this.setData({
          // beginShow: true
        })
      }
      this.setData({
        result:3,
        gameShow:true,
        
      })
      this.beginGame();
      return;
    }
    var url=app.globalData.domain + '/scvendor_weixin_user/game/queryGameResult';
    var data={
      openid:wx.getStorageSync('openId'),
      orderId: this.data.orderId,
    }
    app.checkLogin(utils.http(url,data,this.gameResult));
  },
  begin:function(){
     this.setData({
       beginShow:false,
       boxShow:true
     })
    this.queryGameResult();
  },
  beginGame:function(){
    progressDown = wx.createInnerAudioContext()
    progressDown.autoplay = true
    countDown = wx.createInnerAudioContext()
    countDown.autoplay = true
    resultMusic = wx.createInnerAudioContext()
    resultMusic.autoplay = true
    backgroundMusic = wx.createInnerAudioContext()
    backgroundMusic.autoplay = true
    backgroundMusic.loop = true
    var that = this;
    var num = parseInt(Math.random() * 1000);
    console.log(num % 3 + 1);
    //转到第一张图
    if (num % 3 + 1 == 1) {
      this.setData({
        time: 476
      })
    } else if (num % 3 + 1 == 2) {
      //转到第二张图
      this.setData({
        time: 526
      })
    } else {
      //转到第三张图
      this.setData({
        time: 500
      })
    }
    resultMusic.onEnded(function b() {
      backgroundMusic.src = 'https://dev.sichang.com.cn/vendor_admin_front/music/background.mp3';
    })
    // 设置了 src 之后会自动播放
    countDown.src = 'https://dev.sichang.com.cn/vendor_admin_front/music/countDown.mp3';
    var that = this;
    console.log("播放");
    that.setData({
      goShow: true,
      // go: 'go.gif?' + (new Date()).getTime()
      
    })
    var c = 2;
    var t=setInterval(function(){
      if(c<0){
        
        clearInterval(t);
        return;
      }     
       that.setData({
         go:c+'.png'
       })
       c--;

    },1000)
    timeOut5=setTimeout(function () {
      that.setData({
        goShow: false,
        leftImg: 'left.gif',
        rightImg: 'problem.gif',
        chooseShow: true
      })


      progressDown.src = 'https://dev.sichang.com.cn/vendor_admin_front/music/progressDown.mp3';

      // if (that.data.count2 != 0) {
      //   return;
      // }
      that.progressInterval();
      that.Interval();
      that.setData({
        fistShow: true,
        scissorsShow: true,
        clothShow: true,
      })


      timeOut10 =setTimeout(function () {
        if (that.data.hasClick == true) {
          return;
        }

        that.setData({
          fistShow: false,
          scissorsShow: false,
          clothShow: false,
          btnShow: true
        })
        if (that.data.result == 2) {
          // console.log('this.data.time' + this.data.time);
          if (that.data.time == 476) {
            that.setData({
              rightImg: 'rightImg3.png',
              leftImg: 'leftImg2.png'
            })
          } else if (that.data.time == 526) {
            that.setData({
              rightImg: 'rightImg1.png',
              leftImg: 'leftImg3.png'
            })
          } else {
            that.setData({
              rightImg: 'rightImg2.png',
              leftImg: 'leftImg1.png'
            })
          }
          that.setData({
            failShow: true,
            chooseShow: false
          })
          resultMusic.src = 'https://dev.sichang.com.cn/vendor_admin_front/music/fail.mp3';
        } else if (that.data.result == 1) {
          if (that.data.time == 476) {
            that.setData({
              rightImg: 'rightImg3.png',
              leftImg: 'leftImg1.png'
            })
          } else if (that.data.time == 526) {
            that.setData({
              rightImg: 'rightImg1.png',
              leftImg: 'leftImg2.png'
            })
          } else {
            that.setData({
              rightImg: 'rightImg2.png',
              leftImg: 'leftImg3.png'
            })
          }
          that.setData({
            successShow: true,
            chooseShow: false
          })
          resultMusic.src = 'https://dev.sichang.com.cn/vendor_admin_front/music/success.mp3';
          app.checkLogin(that.notifyPushGoods);
        } else {
          if (that.data.time == 476) {
            that.setData({
              rightImg: 'rightImg3.png',
              leftImg: 'leftImg3.png'
            })
          } else if (that.data.time == 526) {
            that.setData({
              rightImg: 'rightImg1.png',
              leftImg: 'leftImg1.png'
            })
          } else {
            that.setData({
              rightImg: 'rightImg2.png',
              leftImg: 'leftImg2.png'
            })
          }
          that.setData({
            dogfallShow: true,
            chooseShow: false
          })
          resultMusic.src = 'https://dev.sichang.com.cn/vendor_admin_front/music/dogfall.mp3';
        }
      }, 10000)

    }, 5000)
  },
  gameResult:function(data){
    // if (this.data.result != 3) {
    //   this.setData({
    //     // beginShow: true
    //   })
    // }
    this.setData({
      result: data.gameResult,
      gameShow:true,
    })
    this.beginGame();
  },
  notifyPushGoods:function(){
    var url = app.globalData.domain + '/scvendor_weixin_user/game/notifyPushGoods'
    var data={
      openid: wx.getStorageSync('openId'),
      orderId: this.data.orderId
    }
    app.checkLogin(utils.http(url, data, this.PushGoods));
    
   
  },
  PushGoods:function(){
   setTimeout(function(){
     wx.showModal({
       title: '提示',
       content: '商品即将出货，请及时取走商品',
       showCancel:false
     })
   },2000)
   
  },
  Interval: function () {
    console.log("Interval");
    var a = 2;
    var that = this;
    var num = 1;
    timer = setInterval(function () {
      if (that.data.time == 500) {
        //第三张图
        if (num > 20) {
          console.log('num' + num);
          clearInterval(timer);
          return;
        }
      } else if (that.data.time === 526) {
        if (num > 19) {
          // 第二张
          console.log("num" + num);
          clearInterval(timer);
          return;
        }
      } else {
        if (num > 21) {
          //第一张
          console.log("num" + num);
          clearInterval(timer);
          return;
        }
      }
      console.log(a + ">>>>" + (new Date()).getTime());
      if (a == 1) {
        that.setData({
          left: 47
        })
        a++;
      } else if (a == 2) {

        that.setData({
          left: 240
        })
        a++;

      } else {
        that.setData({
          left: 440
        })
        a = 1;
      }
      num++;
    }, this.data.time)
  },
  clickFist: function () {
    this.setData({
      fistShow: false,
      scissorsShow: false,
      clothShow: false,
      hasClick: true,
      btnShow: true
    })
    progressDown.stop();
    clearInterval(timer);
    clearInterval(progressTimer);
    clearInterval(timeOut10);

    progressDown.src = 'https://dev.sichang.com.cn/vendor_admin_front/music/click.mp3';
    if (this.data.result == 2) {
      this.setData({
        leftImg: 'leftImg2.png',
        failShow: true
      })
      resultMusic.src = 'https://dev.sichang.com.cn/vendor_admin_front/music/fail.mp3';
    } else if (this.data.result == 1) {
      this.setData({
        leftImg: 'leftImg1.png',
        successShow: true,
      })
      resultMusic.src = 'https://dev.sichang.com.cn/vendor_admin_front/music/success.mp3';
      app.checkLogin(this.notifyPushGoods);
    } else {
      this.setData({
        leftImg: 'leftImg3.png',
        dogfallShow: true,
      })
      resultMusic.src = 'https://dev.sichang.com.cn/vendor_admin_front/music/dogfall.mp3';
    }
    this.setData({
      left: 53,
      clickShow: true,
      clickLeft: 98,
      rightImg: 'rightImg3.png',
      chooseShow: false
    })
    var that = this;
    setTimeout(function () {
      that.setData({
        clickShow: false
      })
    }, 2000)
  },
  clickScissors: function () {
    this.setData({
      hasClick: true,
      fistShow: false,
      scissorsShow: false,
      clothShow: false,
      btnShow: true
    })
    progressDown.stop();
    console.log("您点击了剪刀");
    clearInterval(timer);
    clearInterval(progressTimer);
    clearInterval(timeOut10);
    progressDown.src = 'https://dev.sichang.com.cn/vendor_admin_front/music/click.mp3';
    if (this.data.result == 2) {
      this.setData({
        leftImg: 'leftImg3.png',
        failShow: true
      })
      resultMusic.src = 'https://dev.sichang.com.cn/vendor_admin_front/music/fail.mp3';
    } else if (this.data.result == 1) {
      this.setData({
        leftImg: 'leftImg2.png',
        successShow: true
      })
      resultMusic.src = 'https://dev.sichang.com.cn/vendor_admin_front/music/success.mp3';
      app.checkLogin(this.notifyPushGoods);
    } else {
      this.setData({
        leftImg: 'leftImg1.png',
        dogfallShow: true
      })
      resultMusic.src = 'https://dev.sichang.com.cn/vendor_admin_front/music/dogfall.mp3';
    }
    this.setData({
      chooseShow: false,
      left: 246,
      clickShow: true,
      clickLeft: 295,
      rightImg: 'rightImg1.png',
    })
    var that = this;
    setTimeout(function () {
      that.setData({
        clickShow: false
      })
    }, 2000)
  },
  clickCloth: function () {
    this.setData({
      hasClick: true,
      fistShow: false,
      scissorsShow: false,
      clothShow: false,
      btnShow: true
    })
    progressDown.stop();
    clearInterval(timer);
    clearInterval(progressTimer);
    clearInterval(timeOut10);
    progressDown.src = 'https://dev.sichang.com.cn/vendor_admin_front/music/click.mp3';
    if (this.data.result == 2) {
      this.setData({
        leftImg: 'leftImg1.png',
        failShow: true
      })
      resultMusic.src = 'https://dev.sichang.com.cn/vendor_admin_front/music/fail.mp3';
    } else if (this.data.result == 1) {
      this.setData({
        leftImg: 'leftImg3.png',
        successShow: true
      })
      resultMusic.src = 'https://dev.sichang.com.cn/vendor_admin_front/music/success.mp3';
      app.checkLogin(this.notifyPushGoods);  
    } else {
      this.setData({
        leftImg: 'leftImg2.png',
        dogfallShow: true
      })
      resultMusic.src = 'https://dev.sichang.com.cn/vendor_admin_front/music/dogfall.mp3';
    }
    this.setData({
      chooseShow: false,
      left: 440,
      clickShow: true,
      clickLeft: 476,
      rightImg: 'rightImg2.png',
    })
    var that = this;
    setTimeout(function () {
      that.setData({
        clickShow: false
      })
    }, 2000)
  },

  progressInterval: function () {
    var a = 1;
    var that = this;
    progressTimer = setInterval(function () {
      that.setData({
        proRight: a
      })
      a++;
      if (a > 100) {
        clearInterval(progressTimer);
      }
    }, 100)
  },
  return:function(){
    progressDown.stop();
    countDown.stop();
    resultMusic.stop();
    backgroundMusic.stop();
    wx.navigateBack({
      delta:1
    })
  },
  continue:function(){
    progressDown.stop();
    countDown.stop();
    resultMusic.stop();
    backgroundMusic.stop();
    this.setData({
      leftImg: 'leftImg1.png',
      rightImg: 'problem.png',
      // count: 0,
      // count2: 0,
      hasClick: false,
      failShow: false,
      successShow: false,
      dogfallShow: false,
      btnShow: false,
      left:47,
      proRight:0,
      go:'3.png',
      beginShow:false,

    })
     if(this.data.result==3){
       this.setData({
         leftImg: 'leftImg1.png',
         rightImg: 'problem.png',
        //  count: 0,
        //  count2: 0,
         hasClick: false,
         failShow: false,
         successShow: false,
         dogfallShow: false,
         btnShow: false

       })
       this.queryGameResult();
     }else{
       this.setData({
         gameShow:false,
         boxShow:false

       })
     }
  },

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
    console.log("onHIde");
    if (backgroundMusic){
      console.log("停音乐");
      progressDown.stop();
      countDown.stop();
      resultMusic.stop();
      backgroundMusic.stop();
    }
    
  },
  onUnload: function () {
    console.log("onUnload");
    if (backgroundMusic) {
      console.log("销毁音乐");
      progressDown.destroy();
      countDown.destroy();
      resultMusic.destroy();
      backgroundMusic.destroy();
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})