
var app=getApp();
var style_arr = ['active', ''];

var doning_data_onoff = true;
var complete_data_onoff = true;

Page({

    data: {
        style_arr: style_arr,
        tab_index:0,

        doing_order_list:[],
        doing_page: 1,
        doing_page_size: 3,
        doing_totalpage: 0,

        complete_order_list: [],
        complete_page: 1,
        complete_page_size: 3,
        complete_totalpage: 0
    },
    onLoad:function(options){

        var that=this;

        // 进行中
        that.get_doing_order_list();

        // 已完成
        // that.get_complete_order_list();

    },
    onReachBottom:function(e){

        var that = this;

        var doing_page = null;

        var complete_page = null;

        console.log(that.data.doing_totalpage);

        if (that.data.tab_index == 0) {

            doing_page = that.data.doing_page + 1;

        } else {

            complete_page = that.data.complete_page + 1;
        }

        if ((that.data.tab_index == 0) && (doing_page <= that.data.doing_totalpage)) {

            // wx.showToast({
            //     title: '加载中！',
            //     icon: 'loading'
            // });

            that.get_doing_order_list(doing_page);


        } else if (that.data.tab_index == 0 && (doing_page > that.data.doing_totalpage)) {
            wx.showToast({
                title: '数据已加载完',
                icon: 'loading',
                duration: 1000
            });
            return;
        } else if ((that.data.tab_index == 1) && (complete_page < that.data.complete_totalpage)) {

            // wx.showToast({
            //     title: '加载中！',
            //     icon: 'loading'
            // });

            that.get_complete_order_list(complete_page);

        } else if ((that.data.tab_index == 1) && (complete_page > that.data.complete_totalpage)) {
            wx.showToast({
                title: '数据已加载完',
                icon: 'loading',
                duration: 1000
            });
            return;
        }

        that.setData({
            doing_page: doing_page,
            complete_page: complete_page
        });

    },
    tabnav:function(e){
        var that=this;
        
        var style_arr = that.data.style_arr;

        var index = e.currentTarget.dataset.index

        for (var i = 0; i < style_arr.length;i++){
            
            style_arr[i]='';
        }

        style_arr[index] = 'active';

        that.setData({
            style_arr:style_arr,
            tab_index:index
        });

        if (e.currentTarget.dataset.index == 0 && doning_data_onoff) {

            doning_data_onoff = false;

            that.get_doing_order_list();

        } else if (e.currentTarget.dataset.index == 1 && complete_data_onoff) {

            complete_data_onoff = false;

            that.get_complete_order_list();
        }
    
    },
    get_doing_order_list:function(page){

        var that=this;

        if (!page) {

            page = 1;

        }

        wx.showLoading({
            title: '加载中'
        });

        wx.request({
            url: app.globalData.url +'/index.php/api/Users/my_order',
            data:{
                uid: app.globalData.userid,
                state:1,
                page: page,
                page_size: that.data.doing_page_size   
            },
            success:function(res){

                // console.log(res);

                wx.hideLoading();

                if (res.data.status == 200) {

                    var store_list = res.data.data.res;

                    var doing_order_list = that.data.doing_order_list;

                    if (page==1){

                        that.setData({

                            doing_order_list: store_list,
                            doing_totalpage: res.data.data.totalpage

                        });


                    }else{

                        for (var i = 0; i < store_list.length; i++) {

                            doing_order_list.push(store_list[i]);

                        }

                        that.setData({

                            doing_order_list: doing_order_list,

                        });

                    }

                    
                }
            },
            fail:function(res){

                wx.showToast({
                    title: '获取数据失败',
                    icon:'loading',
                    duration:1000
                });
            }
        })

    },
    get_complete_order_list: function (page) {

        var that = this;

        if (!page) {

            page = 1;

        }

        wx.showLoading({
            title: '加载中'
        });

        wx.request({
            url: app.globalData.url + '/index.php/api/Users/my_order',
            data: {
                uid: app.globalData.userid,
                state: 2,
                page: page,
                page_size: that.data.complete_page_size
            },
            success: function (res) {

                // console.log(res);

                wx.hideLoading();

                if (res.data.status == 200) {

                    var store_list = res.data.data.res;

                    var complete_order_list = that.data.complete_order_list;

                    if (page == 1) {

                        that.setData({

                            complete_order_list: store_list,
                            complete_totalpage: res.data.data.totalpage

                        });

                    } else {

                        for (var i = 0; i < store_list.length; i++) {

                            complete_order_list.push(store_list[i]);

                        }

                        that.setData({

                            doing_order_list: complete_order_list,

                        });

                    }

                }

            },
            fail: function (res) {

                wx.showToast({
                    title: '获取数据失败',
                    icon: 'loading',
                    duration: 1000
                });
            }
        })

    },
    reserve_details:function(e){

         wx.navigateTo({
             url: '/pages/order_details/index?order_sn=' + e.currentTarget.dataset.order_sn
         });

    },
    onPullDownRefresh:function(e){

        var that=this;


        wx.stopPullDownRefresh();

        if (that.data.tab_index == 0 && that.data.doing_order_list.length==0){

            return;

        } else if (that.data.tab_index == 1 && that.data.complete_order_list.length == 0){

            return;
        
        }

        if (that.data.tab_index==0){

            that.setData({
                doing_order_list: [],
                doing_page: 1,
                doing_page_size: 3,
                doing_totalpage: 0
            });

            that.get_doing_order_list();

            

        } else if (that.data.tab_index == 1){

            that.setData({

                complete_order_list: [],
                complete_page: 1,
                complete_page_size: 3,
                complete_totalpage: 0
            });

            that.get_complete_order_list();

        }
    }
    
});