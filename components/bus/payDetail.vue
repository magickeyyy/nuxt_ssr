<template>
    <div class="footer" v-if="orderData">
        <p class="tit tit2">联系人信息</p>
        <div class="order">
            <p class="grey">
                <span class="test">
                    姓&#12288;名：
                    <i></i>
                </span>
                <span class="black">{{orderData.contactName}}</span>
            </p>
            <p class="grey">
                <span class="test">
                    电话号码：
                    <i></i>
                </span>
                <span class="black">{{orderData.contactTelephone}}</span>
            </p>
            <p class="grey">
                <span class="test">
                    邮箱地址：
                    <i></i>
                </span>
                <span class="black">{{orderData.contactMail}}</span>
            </p>
        </div>
        <p class="tit tit2">预定信息</p>
        <div class="order">
            <p class="grey">
                <span class="test">
                    贵司单号：
                    <i></i>
                </span>
                <span class="black">{{orderData.groupNo}}</span>
            </p>
            <p class="grey">
                <span class="test">
                    车辆类型：
                    <i></i>
                </span>
                <span class="black">{{orderData.seatNumberLocal}}</span>
            </p>
            <p class="grey">
                <span class="test">
                    客人人数：
                    <i></i>
                </span>
                <span class="black">{{orderData.passengerNum}}</span>
                <span
                    style="font-size:14px;font-weight:400;color:rgba(153,153,153,1);margin-left:15px"
                >(含领队导游及儿童)</span>
            </p>
        </div>
        <div class="carMes">
            <div
                class="left"
                style="position:relative;background: #fbfbfb;border-top: 1px dashed #ededed;border-bottom: 1px dashed #ededed;"
            >
                <p class="tim">
                    <!-- 起始时间 -->
                    <span style="font-size:14px;font-weight:bold;color:#111;">{{bookingBeginDate}}</span>
                    <span>{{orderData.departureCity}}</span>
                    <span
                        style="margin-left:305px;font-size:14px;font-weight:bold;color:#111;"
                    >{{bookingEndDate}}</span>
                    <span style="margin-right:30px">{{orderData.endCity}}</span>
                </p>
                <!-- <img src="~assets/icon/date.png" alt="" style="width: 155px;position: absolute;top: -28px;left: 260px;color:#111"> -->
                <!-- 总共的天数 -->
                <i
                    class="iconfont icondate1"
                    style="width:155px;height:8px;display:block;font-size: 129px;position: absolute;top:  -6px;left: 274px;color:#111111"
                ></i>
                <span
                    style="position: absolute;top: -13px;left: 276px;font-size:14px;font-weight:400;color:#111;"
                >{{orderData.orderRouteVOS.length}}+1天(空驶费用)</span>
            </div>
        </div>
        <p
            style="margin:49px  auto auto 50px;font-size:18px;font-weight:400;color:rgba(15,15,15,1);"
        >每日包车基础价格</p>
        <div class="priceList">
            <ul>
                <li class="befor option" @click="move(-1)" v-if="orderData.orderRouteVOS.length>8">
                    <i class="iconfont iconriqi_last"></i>
                </li>
                <li v-for="(v,i) in showList" :key="i" style="color:#999999;font-size:14px;" >
                    <div
                        style="border-bottom:1px solid #F0F0F0;height:40px;line-height:40px;text-align:center;overflow: hidden;" :title="v.arrivalCity"
                    >{{v.arrivalCity}}</div>
                    <div
                        style="background:rgba(251,251,251,1);height:144px"
                    >
                        <p style="padding-top:10px;text-align:center">
                            {{v.routeDate.split("-")[1]+"-"+v.routeDate.split("-")[2]}}
                            <span
                                style="margin-left:5px"
                            >{{v.week}}</span>
                        </p>
                        <p
                            style="font-size:20px;font-family:Oswald-Medium;font-weight:500;color:#111;line-height:60px;text-align:center"
                        >￥{{v.basicFee*1+v.otherFee*1}}</p>
                        <p style="text-align: left;padding-left: 5px;">基础费：￥{{parseInt(v.basicFee)}}</p>
                        <p style="text-align: left;padding-left: 5px;">杂&#12288;费：￥{{parseInt(v.otherFee)||0}}</p>
                    </div>
                </li>
                <li
                    class="after option"
                    v-if="orderData.orderRouteVOS.length>8"
                    @click="move(1)"
                    style="border-right:1px solid  #EBEBEB "
                >
                    <i class="iconfont iconriqi_next"></i>
                </li>
            </ul>
        </div>
        <div class="foot">
            <span class="normal">
                （包车基础费用：
                <span class="spicial1">¥{{parseInt(orderData.basicFeeTotal)}}</span> + 杂费：
                <span class="spicial1">¥{{parseInt(orderData.otherFeeTotal)||0}}</span>）
                <span class="all">合计费用:</span>
                <span class="spicial2">
                    <span class="sp">¥</span>
                    {{parseInt(totalAmount)}}
                </span>
            </span>
        </div>
    </div>
</template>


<script>
import moment from 'moment';
import 'moment/locale/zh-cn';
export default {
    props: ['orderData'],
    data() {
        return {
            // payload: 'PAY_WECHAT_NATIVE',
            single: true,
            showPriceList: [],
            bookingBeginDate: moment(this.orderData.bookingBeginDate).format('YYYY-MM-DD'),
            bookingEndDate: moment(this.orderData.bookingEndDate).format('YYYY-MM-DD'),
            week: '', //星期
            showStartIndex: 0, //开始日期下标
            showEndIndex: 8, //结束日期下标
            showList: [], //显示的数组
            totalAmount:''
        }; 
    },
    created() {
        this.orderData.orderRouteVOS.map((item, index) => {
            item.week = moment(item.routeDate).format('dddd');
            this.showList = this.orderData.orderRouteVOS.slice(0, 8);
        });
        if(this.orderData.totalAmount===undefined){
            this.totalAmount=this.orderData.payAmount
        }else{
            this.totalAmount=this.orderData.totalAmount
        }
        
    },
    methods: {
        //切换
        move(data) {
            if (data > 0 && this.showEndIndex >= this.orderData.orderRouteVOS.length) {
                return false;
            } else if (data < 0 && this.showStartIndex <= 0) {
                return false;
            }
            this.showStartIndex += data;
            this.showEndIndex += data;
            this.showList = this.orderData.orderRouteVOS.slice(this.showStartIndex, this.showEndIndex);
        },
    },
};
</script>

<style lang="less">
.modal {
    position: relative;
    .closeIcon {
        position: absolute;
        right: -34px;
        top: -14px;
        color: #fff;
        font-size: 30px;
        &:hover {
            color: #ed0287;
            cursor: pointer;
        }
    }
    .ivu-modal-footer {
        border-top: 1px solid #fff !important;
    }
    .ivu-modal-content {
        border-top: 6px solid #ed0287;
    }
    .grey {
        font-size: 14px;
        font-weight: 400;
        color: rgba(119, 119, 119, 1);
        line-height: 30px;
    }
    .icondate1:before {
        font-size: 155px;
        position: absolute;
        top: -4px;
        left: 260px;
        color: #111111;
    }
}
</style>

<style scoped lang="less">
@import url('~assets/style/variable.less');
.footer {
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(237, 237, 237, 1);
    box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.03);
    border-radius: 6px;
    // margin:auto;
    .tit {
        color: #0f0f0f;
        font-size: 24px;
        font-weight: bold;
        // margin-left: 51px;
    }
    .tit1 {
        margin: 52px auto 37px 51px;
    }
    .order {
        margin: 37px auto 12px 52px;
        font-size: 14px;
        font-weight: 400;
        .grey {
            color: #999999;
            .test {
                width: 70px;
                height: 18px;
                line-height: 24px;
                text-align: justify;
                display: inline-block;
                overflow: hidden;
                vertical-align: top;
                margin-bottom: 12px;
                i {
                    display: inline-block;
                    width: 100%;
                    height: 0;
                }
            }
        }
        .black {
            color: #0f0f0f;
        }
    }
    .tit2 {
        margin: 70px auto 37px 51px;
    }
    .tit3 {
        margin: 71px auto 44px 51px;
    }
    .carMes {
        margin-left: 54px;
        margin-top: 45px;
        display: flex;

        height: 110px;
        line-height: 110px;

        .left {
            .tim {
                margin-bottom: 22px;
                margin-left: 33px;
                font-size: 18px;
                font-weight: bold;
                color: rgba(17, 17, 17, 1);
                .bgc {
                    padding: 0 4px;
                    color: #fff;
                    font-size: 14px;
                    background: rgba(123, 123, 123, 1);
                    margin-right: 12px;
                }
            }
            .address {
                .bgc {
                    padding: 0 4px;
                    color: #fff;
                    font-size: 14px;
                    background: rgba(123, 123, 123, 1);
                }
                .up {
                    color: #111111;
                    font-size: 14px;
                    font-weight: 400;
                    margin: 23px 62px auto 12px;
                }
            }
        }
        .right {
            .word {
                font-size: 14px;
                font-weight: bold;
                color: rgba(17, 17, 17, 1);
                margin-right: 11px;
            }
            .yan {
                font-size: 18px;
                color: #ed0287;
                font-weight: 400;
                font-family: OswaldMedium;
            }
            .num {
                font-size: 28px;
                color: #ed0287;
                font-weight: 400;
                font-family: OswaldMedium;
            }
        }
    }
    .tit4 {
        margin: 89px auto 39px 51px;
    }
    // 杂费
    .zafei {
        width: 1400px;
        height: 288px;
        background: rgba(250, 250, 250, 1);
        margin: 33px auto 55px 50px;
        padding-top: 36px;
        .container {
            font-size: 14px;
            color: #555555;
            font-weight: 400;
            margin: 0 auto 36px 26px;
            .imp {
                color: #ec0286;
            }
            .sj {
                margin-left: 30px;
            }
        }
    }
    .foot {
        width: 100%;
        margin-bottom: 54px;
        background: rgba(250, 250, 250, 1);
        height: 84px;
        line-height: 84px;
        .normal {
            color: #555555;
            font-size: 18px;
            margin: 55px 50px;
            font-weight: 500;
            .spicial1 {
                color: #ec0286;
            }
            .all {
                font-size: 14px;
                font-weight: 400;
                margin-left: 46px;
            }
            .spicial2 {
                color: #ec0286;
                font-size: 28px;
                font-family: OswaldMedium;
                margin-right: 13px;
                .sp {
                    font-size: 18px !important;
                }
            }
        }
    }
    .priceList {
        overflow: auto;
        margin: 40px 50px;
        width: 1080px;
        ul {
            max-width: 1080px;
            height: 186px;
            display: flex;
            li {
                height: 186px;
                border: 1px solid #ebebeb;
                width: 125px;
                border-right: none;
            }
            li:last-of-type {
                border-right: 1px solid #ebebeb;
            }
            .option {
                line-height: 186px;
                width: 39px;
                height: 186px;
                cursor: pointer;
                text-align: center;
                i {
                    font-size: 24px;
                    color: #e3e3e3;
                    &:hover {
                        color: #ec0286;
                    }
                }
            }
        }
    }
}
</style>