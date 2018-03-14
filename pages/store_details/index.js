
const app=getApp();

Page({

    data:{

        store_id:null,
        store_inf:null
    },
    onLoad:function(options){

        var that=this;

        that.setData({
       
            store_id: options.id
        });


        that.get_store_inf();

    },
    get_store_inf:function(e){

        var that=this;

        wx.request({
            url: app.globalData.url +'/index.php/api/Index/restaurant_detail',
            data:{
                id: that.data.store_id
            },
            success:function(res){

                if (res.data.status == 200) {

                    
                    var data_inf = res.data.data;

                    that.setData({

                        store_inf: data_inf

                    });
                    
                }

            }
        })

    },
    reserve:function(e){
        

        // 人均
        var consumption = e.currentTarget.dataset.consumption;
        // 佣金
        var commission = e.currentTarget.dataset.commission;

        // 最低消费 押金
        var minimum_consumption = e.currentTarget.dataset.minimum_consumption;

        wx.navigateTo({
            url: '/pages/reserve_details/index?storeid=' + e.currentTarget.dataset.storeid + '&consumption=' + consumption + '&commission=' + commission + '&minimum_consumption=' + minimum_consumption + '&name=' + e.currentTarget.dataset.name
        });
    }
  
})