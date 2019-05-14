//index.js
//获取应用实例
const app = getApp();
var timer;
var progressTimer;
var progressDown;
var countDown;
var resultMusic;
var backgroundMusic;

Page({
  data: {
    result:1,//1代表赢,2代表输，3平局
    leftImg: 'leftImg1.png',
    rightImg:'problem.png',
    count:0,
    count2:0,
    hasClick:false,
    go:'go.gif'
  },
  onLoad:function(){

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
    console.log('num'+(num % 3 + 1));
    //转到第一张图
    if (num % 3 + 1 == 1) {
      console.log("转到第一张图")
      this.setData({
        time: 476
      })
    } else if (num % 3 + 1 == 2) {
      //转到第二张图
      console.log("转到第二张图")
      this.setData({
        time: 526
      })
    } else {
      console.log("转到第三张");
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
    // countDown.onPlay(function goShow(){

    // }) 
    if (that.data.count != 0) {
      return;
    }
    console.log("播放");
    that.setData({
      goShow: true,
      count: 1
    })
    setTimeout(function () {
      that.setData({
        // goShow: false,
        leftImg: 'left.gif',
        rightImg: 'problem.gif',
        chooseShow: true
      })
      progressDown.src = 'https://dev.sichang.com.cn/vendor_admin_front/music/progressDown.mp3';

      if (that.data.count2 != 0) {
        return;
      }     
      that.setData({
        fistShow: true,
        scissorsShow: true,
        clothShow: true,
        count2: 1
      })
      that.progressInterval();
      that.Interval();
      setTimeout(function () {
        if (that.data.hasClick == true) {
          return;
        }
        
        that.setData({
          fistShow: false,
          scissorsShow: false,
          clothShow: false
        })
        if (that.data.result == 2) {
          console.log('this.data.time'+this.data.time);
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
            chooseShow: false,
            btnShow: true
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
            chooseShow: false,
            btnShow: true
          })
          resultMusic.src = 'https://dev.sichang.com.cn/vendor_admin_front/music/success.mp3';
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
            leftImg: 'leftImg1.png',
            rightImg: 'rightImg1.png',
            dogfallShow: true,
            chooseShow: false,
            btnShow:true
          })
          resultMusic.src = 'https://dev.sichang.com.cn/vendor_admin_front/music/dogfall.mp3';
        }
        // clearInterval(timer);
      }, 10000)

    }, 5000)
      
    // })   
  },
  onHide:function(){
    progressDown.stop();
    countDown.stop();
    resultMusic.stop();
    backgroundMusic.stop();   
  },
  onUnload:function(){
    progressDown.stop();
    countDown.stop();
    resultMusic.stop();
    backgroundMusic.stop();
  },
  Interval:function(){
    var a=2; 
    var that=this;
    var num=1;   
    timer=setInterval(function(){
      if(that.data.time==500){
        //第三张图
        if(num>20){
          console.log('num'+num);
          clearInterval(timer);
          return;
        }
      }else if(that.data.time===526){
        if (num >19) {
          // 第二张
          console.log("num"+num);
          clearInterval(timer);
          return;
        }
      }else{
        if(num>21){
          //第一张
          console.log("num" + num);
          clearInterval(timer);
          return;
        }
      }
      console.log(a+">>>>"+(new Date()).getTime());
      if(a==1){
        that.setData({
          left:47
        })
        a++;
      } else if (a == 2){
    
        that.setData({
            left: 240
          })
          a++;
        
      }else{
        that.setData({
          left: 440
        })
        a=1;
      }
      num++;
    },this.data.time)
  },
  clickFist:function(){
    this.setData({
      fistShow: false,
      scissorsShow: false,
      clothShow: false,
      hasClick:true
    })
    progressDown.stop();  
    clearInterval(timer);
    clearInterval(progressTimer);
    
    progressDown.src = 'https://dev.sichang.com.cn/vendor_admin_front/music/click.mp3';
    if(this.data.result==2){
      this.setData({
        leftImg:'leftImg2.png',
        failShow:true
      })
      resultMusic.src = 'https://dev.sichang.com.cn/vendor_admin_front/music/fail.mp3';
    }else if(this.data.result==1){
      this.setData({
        leftImg: 'leftImg1.png',
        successShow:true,     
      })
      resultMusic.src = 'https://dev.sichang.com.cn/vendor_admin_front/music/success.mp3';
    }else{
      this.setData({
        leftImg: 'leftImg3.png',
        dogfallShow: true,
      })
      resultMusic.src = 'https://dev.sichang.com.cn/vendor_admin_front/music/dogfall.mp3';
    }
    this.setData({
      left: 53,
      clickShow:true,
      clickLeft: 98,
      rightImg: 'rightImg3.png',
      chooseShow: false
    })
    var that=this;
    setTimeout(function(){
      that.setData({
        clickShow:false
      })
    },2000)
  },
  clickScissors:function(){ 
    this.setData({
      hasClick: true,
      fistShow: false,
      scissorsShow: false,
      clothShow: false
    })
    progressDown.stop();  
    console.log("您点击了剪刀");
    clearInterval(timer);
    clearInterval(progressTimer);
    progressDown.src = 'https://dev.sichang.com.cn/vendor_admin_front/music/click.mp3';
    if (this.data.result == 2) {
      this.setData({
        leftImg: 'leftImg3.png',
        failShow:true
      })
      resultMusic.src = 'https://dev.sichang.com.cn/vendor_admin_front/music/fail.mp3';
    } else if(this.data.result==1) {
      this.setData({
        leftImg: 'leftImg2.png',
        successShow:true
      })
      resultMusic.src = 'https://dev.sichang.com.cn/vendor_admin_front/music/success.mp3';
    }else{
      this.setData({
        leftImg: 'leftImg1.png',
        dodfallShow: true
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
  clickCloth:function(){
    this.setData({
      hasClick: true,
      fistShow: false,
      scissorsShow: false,
      clothShow: false
    })  
    progressDown.stop();  
    clearInterval(timer);
    clearInterval(progressTimer);
    progressDown.src = 'https://dev.sichang.com.cn/vendor_admin_front/music/click.mp3';
    if (this.data.result == 2) {
      this.setData({
        leftImg: 'leftImg1.png',
        failShow:true
      })
      resultMusic.src = 'https://dev.sichang.com.cn/vendor_admin_front/music/fail.mp3';
    } else if(this.data.result==1) {
      this.setData({
        leftImg: 'leftImg3.png',
        success:true
      })
      resultMusic.src = 'https://dev.sichang.com.cn/vendor_admin_front/music/success.mp3';
    }else{
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
      clickLeft: 500,
      rightImg: 'rightImg2.png',
    })
    var that = this;
    setTimeout(function () {
      that.setData({
        clickShow: false
      })
    }, 2000)
  },

  progressInterval:function(){
    var a=1;
    var that=this;
    progressTimer=setInterval(function(){     
      that.setData({
        proRight: a
      })
      a++;
      if(a>100){
        clearInterval(progressTimer);
      }
    },100  )
  },


})
