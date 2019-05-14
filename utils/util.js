const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
function http(url, data,fun,fun2,fun3){
  var that = this;
  wx.showLoading({
    title: '加载中',
  })
  wx.request({
    url: url,
    data: data,
    method: "POST",
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    success: function (res) {
      wx.hideLoading();
      if (fun3!=null&&fun3!=undefined){
        fun3();
      }
      if (res.data.retCode == 0) {
        return fun(res.data);
      } else if (res.data.retCode == 21446){
          wx.showModal({
            title: '提示',
            content: '[21446]设备因掉线暂停服务，敬请谅解',
            showCancel:false
          })
      } else {
        wx.showModal({
          title: '提示',
          content: '[' + res.data.retCode + ']' + res.data.retMsg,
          showCancel:false,
          success:function(res){
            if(res.confirm){
              console.log("点击了确定");
              if(undefined!=fun2 && ''!=fun2){
                  fun2();
              }
              
            }
          }
        })
      }
    },
    fail: function () {
      wx.hideLoading();
      wx.showModal({
        title: '提示',
        content: '系统繁忙，请稍后再试！',
        showCancel: false,
      })
    }
  })
}

module.exports = {
  formatTime: formatTime,
  http:http
}
