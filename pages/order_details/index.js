
var app = getApp();

function upload(page, path) {
    wx.showToast({
        icon: "loading",
        title: "正在上传"
    }),
        wx.uploadFile({
            url: app.globalData.url + '/index.php/api/Users/upload_receipt',
            filePath: path[0],
            name: 'file',
            formData: {
                'order_sn': page.data.order_sn
            },
            success: function (res) {

                if (res.statusCode == 200) {

                    console.log(JSON.parse(res.data).status);

                    console.log(JSON.parse(res.data));


                    if (JSON.parse(res.data).status == 205) {

                        wx.showToast({
                            title: '已上传凭证',
                            icon: 'loading',
                            duration: 1000
                        });

                        return;

                    } else {

                        wx.showToast({
                            title: '上传成功',
                            icon: 'loading',
                            duration: 1000
                        });

                        page.setData({

                            img_src: JSON.parse(res.data).data

                        })

                    }

                   
                }else{

                    app.set_status_tip(res.data.status);

                }
            },
            fail: function (e) {
                console.log(e);
                wx.showModal({
                    title: '提示',
                    content: '上传失败',
                    showCancel: false
                })
            }
        });
}

Page({

    data: {

        showToast: false,

        order_sn: null,

        order_inf: null,

        img_src:null
    },
    onLoad: function (options) {

        var that = this;

        that.setData({
            order_sn: options.order_sn
        });

        that.get_order_inf();

    },
    get_order_inf: function (e) {

        var that = this;

        wx.request({
            url: app.globalData.url + '/index.php/api/Users/order_detail',
            data: {
                order_sn: that.data.order_sn
            },
            success: function (res) {

                console.log(res);
                if (res.data.status == 200) {

                    that.setData({

                        order_inf: res.data.data

                    });
                }

            }
        })
    },
    unsubcribe: function (e) {

        var that = this;

        var order_sn = e.currentTarget.dataset.order_sn;

        wx.request({
            url: app.globalData.url + '/index.php/api/Users/qx_order',
            data: {
                order_sn: order_sn
            },
            success: function (res) {

                if (res.data.status == 200) {

                    wx.showToast({
                        title: '取消成功',
                        icon: 'loading',
                        duration: 1000

                    });

                    setTimeout(function(){

                        wx.reLaunch({
                            url: '/pages/reserve/index'
                        })

                    },1000);

                } else {

                    app.set_status_tip(res.data.status);
                }

            }
        })

    },
    up_img: function (e) {

        var that = this;
        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['compressed'],
            sourceType: ['album', 'camera'],
            success: function (res) {
                var tempFilePaths = res.tempFilePaths;
                upload(that, tempFilePaths);
            }
        })

    },
    previewImage:function(e){

        var src=e.currentTarget.dataset.src;

        wx.previewImage({
            current: src,
            urls: [src]
        });
    },
    onPullDownRefresh:function(e){

        var that = this;

        wx.stopPullDownRefresh();

        that.setData({
            
            showToast: false,

            order_inf: null,

            img_src: null

        });

        that.get_order_inf();
    }

})