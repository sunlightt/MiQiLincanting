
const app=getApp();

const dateTimePicker = require('../../utils/dateTimePicker.js');


function withData(param) {
    return param < 10 ? '0' + param : '' + param;
}

function get_unix_time(dateStr) {
    var newstr = dateStr.replace(/-/g, '/');
    var date = new Date(newstr);
    var time_str = date.getTime().toString();
    return time_str.substr(0, 10);
}

Page({

    data: {
        date: '2018-10-01',
        time: '12:00',
        dateTimeArray1: null,
        dateTime1: null,
        dateTimeArray2: null,
        dateTime2: null,
        dateTimeArray3: null,
        dateTime3: null,
        startYear: 2000,
        endYear: 2050,

        // 备选时间
        spare_time: false,

        // 用餐人数
        member: 1,

        reserve_inf: null,

        store_id: null,
        //人均
        consumption: 0,
        // 佣金
        commission: 0,
        // 押金
        minimum_consumption:0,
        // 总值
        total: 0,
        // 总共佣金
        total_commission: 0,
        // 总共押金
        total_deposit: 0,

        store_name:null,

        check_status:false

    },

    onLoad: function (options) {

        var that = this;

        // 获取完整的年月日 时分秒，以及默认显示的数组
        var obj1 = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
        var obj2 = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
        var obj3 = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
        // 精确到分的处理，将数组的秒去掉
        var lastArray = obj1.dateTimeArray.splice(obj1.dateTime.length - 1, 1);
        var lastTime = obj1.dateTime.splice(obj1.dateTime.length - 1, 1);

        var lastArray1 = obj2.dateTimeArray.splice(obj2.dateTime.length - 1, 1);
        var lastTime1 = obj2.dateTime.splice(obj2.dateTime.length - 1, 1);

        var lastArray1 = obj3.dateTimeArray.splice(obj3.dateTime.length - 1, 1);
        var lastTime1 = obj3.dateTime.splice(obj3.dateTime.length - 1, 1);

        this.setData({
            dateTimeArray1: obj1.dateTimeArray,
            dateTime1: obj1.dateTime,
            dateTimeArray2: obj2.dateTimeArray,
            dateTime2: obj2.dateTime,
            dateTimeArray3: obj3.dateTimeArray,
            dateTime3: obj3.dateTime,
            store_id: options.storeid,
            consumption: options.consumption,
            commission: options.commission,
            minimum_consumption: options.minimum_consumption,

            store_name: options.name
        });

        that.calcolation();

    },

    calcolation: function (e) {

        //数值计算

        var that = this;

        //人均
        var consumption = that.data.consumption;
        // 佣金
        var commission = that.data.commission;
        // 用餐人数
        var member = that.data.member;
        // 总共佣金
        var total_commission = Number(commission) * Number(member);
        // 总共押金
        var total_deposit = Number(that.data.minimum_consumption);
        // 总值
        var total = (total_commission + total_deposit).toFixed(2);

        that.setData({

            total_commission: total_commission,
            total_deposit: total_deposit,
            total: total
        })
    },
    changeDateTime1(e) {
        this.setData({ dateTime1: e.detail.value });
    },
    changeDateTime2(e) {
        this.setData({ dateTime2: e.detail.value });
    },
    changeDateTime3(e) {
        this.setData({ dateTime3: e.detail.value });
    },
    changeDateTimeColumn1(e) {
        var arr = this.data.dateTime1, dateArr = this.data.dateTimeArray1;
        arr[e.detail.column] = e.detail.value;
        dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);

        this.setData({
            dateTimeArray1: dateArr,
            dateTime1: arr
        });

    },
    changeDateTimeColumn2(e) {
        var arr = this.data.dateTime2, dateArr = this.data.dateTimeArray2;
        arr[e.detail.column] = e.detail.value;
        dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);
        this.setData({
            dateTimeArray2: dateArr,
            dateTime2: arr
        });
    },
    changeDateTimeColumn3(e) {
        var arr = this.data.dateTime3, dateArr = this.data.dateTimeArray3;
        arr[e.detail.column] = e.detail.value;
        dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);
        this.setData({
            dateTimeArray3: dateArr,
            dateTime3: arr
        });
    },
    change_switch: function (e) {

        var that = this;

        if (e.detail.value) {

            that.setData({

                spare_time: true

            });

        } else {

            that.setData({

                spare_time: false

            });

        }

    },
    reduce: function (e) {

        var that = this;

        var val = that.data.member;

        if (val > 1) {

            val--;
        }

        that.setData({

            member: val

        });

        that.calcolation();
    },
    add: function (e) {

        var that = this;

        var val = that.data.member;

        val++;
        if (val > 2) {

            val=2;
        }

        that.setData({

            member: val

        });

        that.calcolation();
    },
    check_change:function(e){

        var that=this;

        that.setData({

            check_status: !that.data.check_status

        });

    },
    input_member: function (e) {

        var val = e.detail.value;

        if (val > 2) {

            val = 2;

        } else if (val == '' || val<1){

            val = 1;

        }
        
        that.setData({

            member: val

        });

        that.calcolation();
    },
    formsubmit: function (e) {

        var that = this;

        var date = new Date();

        var timestamp = parseInt(Date.parse(new Date()) / 1000);

        var now_hours = date.getHours();

        var title = e.detail.value.title;
        var people_num = e.detail.value.num;

        var month1 = withData(Number(that.data.dateTime1[1]) + 1);
        var day1 = withData(Number(that.data.dateTime1[2]) + 1);
        var hour1 = withData(that.data.dateTime1[3]);
        var mint1 = withData(that.data.dateTime1[4]);

        var month2 = withData(Number(that.data.dateTime2[1]) + 1);
        var day2 = withData(Number(that.data.dateTime2[2]) + 1);
        var hour2 = withData(that.data.dateTime2[3]);
        var mint2 = withData(that.data.dateTime2[4]);

        var month3 = withData(Number(that.data.dateTime3[1]) + 1);
        var day3 = withData(Number(that.data.dateTime3[2]) + 1);
        var hour3 = withData(that.data.dateTime3[3]);
        var mint3 = withData(that.data.dateTime3[4]);


        var time1 = '20' + that.data.dateTime1[0] + '-' + month1 + '-' + day1 + ' ' + hour1 + ':' + mint1 + ':' + '00';

        var time2 = '20' + that.data.dateTime2[0] + '-' + month2 + '-' + day2 + ' ' + hour2 + ':' + mint2 + ':' + '00';

        var time3 = '20' + that.data.dateTime3[0] + '-' + month3 + '-' + day3 + ' ' + hour3 + ':' + mint3 + ':' + '00';


        var restaurant_id = that.data.store_id;
        var change_time = e.detail.value.switch == true ? 1 : 0;
        var num = that.data.member;
        var username = e.detail.value.username;
        var territory_phone = e.detail.value.member;
        var abroad_phone = '';
        
        
        var email = e.detail.value.email;
        var wx_number = e.detail.value.weixin;

        // 总共佣金
        var total_commission = that.data.total_commission;

        // 总共押金
        var total_deposit = that.data.total_deposit;

        // 订单合计金额
        var total = that.data.total;

        if (username == '' || territory_phone == '' || email == '' || wx_number == '' ){

            wx.showToast({
                title: '请完善信息',
                icon:'loading',
                duration:1000
            });

            return;
        } 

        if (!that.data.check_status){

            wx.showToast({
                title: '需同意协议',
                icon: 'loading',
                duration: 1000
            });

            return;
        }

        if (Number(get_unix_time(time1)) <= timestamp) {

            that.setData({
                toast_msg: '预订时间需大于当前时间',
                showToast: true
            });

            setTimeout(function () {

                that.setData({
                    showToast: false
                });

            }, 1200);

            return;
        }else if ((Number(get_unix_time(time2)) <= timestamp || Number(get_unix_time(time3)) <= timestamp) && change_time==1){
 
            
            that.setData({
                toast_msg: '预订时间需大于当前时间',
                showToast: true
            });

            setTimeout(function () {

                that.setData({
                    showToast: false
                });

            }, 1200);


        }

        var test_phone =/^1[3|4|5|7|8][0-9]{9}$/;

        var test_email =/^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;

        var wxPattern = /^[a-zA-Z]([-_a-zA-Z0-9]{5,19})+$/;

        if (!test_phone.test(territory_phone) ){

            wx.showToast({
                title: '手机号不合法',
                icon:'loading',
                duration:1000
            });
            return;

        } else if (abroad_phone != '' && (!test_phone.test(abroad_phone) )){

            wx.showToast({
                title: '手机号不合法',
                icon: 'loading',
                duration: 1000
            });
            return;

        } else if (!test_email.test(email) ){

            wx.showToast({
                title: '邮箱不合法',
                icon: 'loading',
                duration: 1000
            });

            return;

        }

        if (e.detail.value.member1 == '') {

            abroad_phone = '';

        } else {

            if (e.detail.value.area_code == '') {

                wx.showToast({
                    title: '请填写区号',
                    icon: 'loading',
                    duration: 1000
                });

                return;
            }

            abroad_phone = e.detail.value.area_code + ',' + e.detail.value.member1;

        }

        var send_data={

            user_id: app.globalData.userid,
            restaurant_id: restaurant_id,
            dinner_time: time1,
            change_time: change_time,
            dinner_time2: time2,
            dinner_time3: time3,
            num: num,
            username: username,
            territory_phone: territory_phone,
            abroad_phone: abroad_phone,
            email: email,
            wx_number: wx_number,
            commission: total_commission,
            deposit: total_deposit,
            total: total
        }

        if (change_time!=1){

            delete send_data['dinner_time2'];

            delete send_data['dinner_time3'];

        }

        wx.request({
            url: app.globalData.url +'/index.php/api/Index/apply_order',
            data: send_data,
            success:function(res){

                if (res.data.status==200){

                    wx.showToast({
                        title: '提交成功',
                        icon:'loading',
                        duration:1000
                    });

                    var order_sn = res.data.data.order_sn;

                    var total = res.data.data.total;

                    wx.request({
                        url: app.globalData.url+'/index.php/api/Pay/goto_pay',
                        data: {
                            openid: app.globalData.openid,
                            order_sn: order_sn,
                            total: total
                        },
                        success: function (reponse) {

                            console.log(reponse.data.status.appId);

                            var appId = reponse.data.status.appId;
                            var nonceStr = reponse.data.status.nonceStr;
                            var package1 = reponse.data.status.package;
                            var paySign = reponse.data.status.paySign;
                            var signType = reponse.data.status.signType;

                            var timeStamp = reponse.data.status.timeStamp;

                            wx.requestPayment({

                                'nonceStr': nonceStr,
                                'package': package1,
                                'signType': signType,
                                'timeStamp': timeStamp,
                                'paySign': paySign,
                                'success': function (res) {
                                     
                                     wx.showToast({ title: '支付成功', icon: 'success', duration: 2000 });

                                     setTimeout(function doHandler() {

                                         wx.reLaunch({
                                             url: '/pages/reserve/index'
                                         })
                                         
                                     }, 2000);
                                    
                                },
                                'fail': function (res) {

                                    wx.showToast({ title: '支付失败', icon: 'loading', duration: 2000 });
                                   
                                }
                            })


                        }
                    });
                    
                }else {

                    app.set_status_tip(res.data.status);

                }
            },
            fail:function(res){

                wx.showToast({
                    title: '提交失败',
                    icon:'loading',
                    duration:1000
                });
            }
        })
    },
    agreement:function(e){


        var that=this;

        that.setData({

            check_status: !that.data.check_status

        });

        wx.navigateTo({
            url: '/pages/agreement/index'
        })

    }
})