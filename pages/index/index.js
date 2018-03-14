
const app = getApp()
Page({

    data:{

         mark_off:false,
         select_area_stats:false,
         area_arr:[],
         area_inf:'全部地区',
         area_id:0,
        //  类型
         type_arr:[],
         type_inf:'全部餐厅',
         type_id:0,
         page:1,
         page_size:4,
         totalpage:0,
         store_list:[]
    },

    onLoad:function(options){

        var that=this;

        that.get_area_list();

    },
    onReachBottom:function(e){

        var that = this;

        var current_page = that.data.page;

        current_page++;

        var totalpage = that.data.totalpage;

        if (current_page <= totalpage){

            that.get_store_list(current_page); 

        }else{
            
            wx.showToast({
                title: '已加载完',
                icon:'loading',
                duration:1000
            });

            return;

        }

        that.setData({

            page: current_page

        });

    },
    store_details:function(e){

        wx.navigateTo({
            url: '/pages/store_details/index?id=' + e.currentTarget.dataset.id
        });

    },
    filter:function(e){

        var that=this;
        var type = e.currentTarget.dataset.type;
        var flag = type === "false" ? false : true; 
        
        if (flag){

            that.setData({

                select_area_stats:true

            });


        }else{
            that.setData({

                select_area_stats: false

            });
        }

        that.setData({
            mark_off: !that.data.mark_off
        });
    
    },
    check_area:function(e){

        var that=this;
        that.setData({
            store_list: [],
            mark_off: false,
            area_id:e.currentTarget.dataset.id,
            area_inf: e.currentTarget.dataset.val,
            page: 1
        }); 

        that.get_store_list(); 

    },
    check_type:function(e){

        var that = this;

        var type_id = e.currentTarget.dataset.id;
        
        // if (type_id==0){

           
        // }

        that.setData({
            store_list:[],
            mark_off: false,
            type_id: e.currentTarget.dataset.id,
            type_inf: e.currentTarget.dataset.val,
            page:1
        });

        that.get_store_list(); 
    },
    get_area_list:function(e){

        var that=this;
 
        wx.request({
            url: app.globalData.url +'/index.php/api/Index/get_region',
            success:function(res){

                if (res.data.status==200){

                    var area_arr = res.data.data;
                    area_arr.unshift({
                        id: '0',
                        name: '全部地区'
                    });

                    that.setData({
                        area_arr: area_arr,
                        // area_id: area_arr[0].id,
                        // area_inf: area_arr[0].name
                    });

                    that.get_type_list();
                }
            }
        });
    },
    get_type_list:function(e){

        var that = this;
        wx.request({
            url: app.globalData.url + '/index.php/api/Index/get_brand',
            success: function (res) {

                if (res.data.status == 200) {

                    var type_arr = res.data.data;

                    type_arr.unshift({
                        id:'0',
                        name:'全部餐厅'
                    });

                    that.setData({

                        type_arr: type_arr,

                    });

                    that.get_store_list();
                }
            }
        });

    },
    get_store_list: function (page){

        if (!page){

            page=1;

        }
        var that = this;
    
        wx.showLoading({
            title: '加载中'
        });

        wx.request({
            url: app.globalData.url + '/index.php/api/Index/sy',
            data:{

                region:that.data.area_id,
                brand:that.data.type_id,
                page: page,
                page_size: that.data.page_size

            },
            success: function (res) {

                if (res.data.status == 200) {

                    var store_list = res.data.data.res;

                    var old_store_list= that.data.store_list;

                    console.log(page);

                    if (page == 1) {

                        that.setData({

                            store_list: store_list,
                            totalpage: res.data.data.totalpage

                        });

                    } else {

                        for (var i = 0; i < store_list.length; i++) {

                            old_store_list.push(store_list[i]);

                        }

                        that.setData({

                            store_list: old_store_list,

                        });

                    }

                    wx.hideLoading();
                }
            }
        });
    },
    onPullDownRefresh:function(e){

        var that=this;

        wx.stopPullDownRefresh();

        that.setData({

            mark_off: false,
            select_area_stats: false,
            area_arr: [],
            area_inf: '全部地区',
            area_id: 0,
            //  类型
            type_arr: [],
            type_inf: '餐厅种类',
            type_id: 0,
            page: 1,
            page_size: 2,
            totalpage: 0,
            store_list: []

        });

        that.get_area_list();
    },
    onShareAppMessage:function(e){
        var that = this;
        return {
            title: '米其林餐厅',
            path: '/pages/index/index',
            success: function (res) {
                wx.showToast({
                    title: '分享成功',
                    icon: 'loading',
                    duration: 1000
                });
            }
        }
    }
    
})
