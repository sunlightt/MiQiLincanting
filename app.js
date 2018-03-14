//app.js
App({
    onLaunch: function () {

        var that = this;

        wx.login({
            success: function (res) {
                wx.request({
                    url: that.globalData.url + '/index.php/api/Api/get_openid_api',
                    data: {
                        code: res.code
                    },
                    success: function (res) {

                        that.globalData.openid = res.data.data.openid;

                        that.globalData.userid = res.data.data.id;

                    }
                })
            }
        })
        wx.getSetting({
            success: res => {
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    wx.getUserInfo({
                        success: res => {
                            // 可以将 res 发送给后台解码出 unionId
                            this.globalData.userInfo = res.userInfo
                            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                            // 所以此处加入 callback 以防止这种情况
                            if (this.userInfoReadyCallback) {
                                this.userInfoReadyCallback(res)
                            }
                        }
                    })
                }
            }
        })
    },
    globalData: {
        url: 'https://safe.yuanchuangyuan.com'
    },
    set_status_tip:function(status){

        var text='';

        if (status==201){

            text='下单失败';

        } else if (status == 202){

            text = '订单不存在';

        } else if (status == 203){

            text = '订单金额不正确';

        } else if (status == 204) {

            text = '订单状态已改变';

        }
        else if (status == 205) {

            text = '已上传凭证';

        }
        else if (status == 206) {

            text = '该订单已取消';

        }
        else if (status == 400) {

            text = '参数错误';

        }

        return ;

    }
})