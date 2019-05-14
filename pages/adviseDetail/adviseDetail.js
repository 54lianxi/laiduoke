// pages/adviseDetail/adviseDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },


  onLoad: function (options) {
    this.setData({
      adviseType: options.adviseType,
      adviseSubject: options.adviseSubject,
      adviseContent: options.adviseContent,
      adviseImages: JSON.parse(options.adviseImages),
      deviceId: options.deviceId,
      deviceName: options.deviceName,
      name: options.name,
      mobile: options.mobile,
      replyName: options.replyName,
      replyContent: options.replyContent,
      replyTime: options.replyTime,
      status: options.status,
      modifyTime: options.modifyTime,
      createTime: options.createTime,
    })
  },
  imgDetail:function(e){
    var index=e.target.dataset.index;
    this.setData({
      picDetailShow:true,
      picUrl: this.data.adviseImages[index]
    })
  },
  close:function(){
    this.setData({
      picDetailShow: false
    })
  }




})