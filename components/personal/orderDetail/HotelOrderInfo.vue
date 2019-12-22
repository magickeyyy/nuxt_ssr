<template>
    <ul class="hotelOrderInfo" v-if="info">
        <li class="hotel">
            <img :src="info.hotelImg" alt="加载失败" v-noimg="'320-430'" />
            <h3>{{info.hotelName}}</h3>
            <p v-if="info.hotelNameEng">{{info.hotelNameEng}}</p>
            <Rate :value="info.star*1" class="his" disabled v-if="info.star" />
            <p>{{info.hotelAddress}}</p>
        </li>
        <li class="order">
            <h4>订单信息</h4>
            <p>
                <span>入住日期：</span>
                {{mixin_m_formatDate(info.checkinTime*1,'xxxx年xx月xx日')}}
            </p>
            <p>
                <span>退房日期：</span>
                {{mixin_m_formatDate(info.checkoutTime*1, 'xxxx年xx月xx日')}}
            </p>
            <p>
                <span>入住时间：</span>
                {{info.nightNumber}}晚
            </p>
            <p>
                <span>入住房型：</span>
                {{info.roomType}}
            </p>
            <p>
                <span>房间数量：</span>
                {{info.roomNumber}}间
            </p>
        </li>
        <li class="money">
            <p>实付金额</p>
            <div>
                <span style='font-size: 16px'>&yen;</span>
                {{info.totalAmount | mixin_f_formatNumber}}
            </div>
        </li>
    </ul>
</template>

<script>
export default {
    name: 'HotelOrderInfo', // 酒店预订信息展示，如订单支付和查询右侧
    data() {
        return {};
    },
    props: {
        info: Object,
    },
};
</script>

<style scoped lang="less">
.hotelOrderInfo {
    width: 356px;
    padding-top: 20px;
    color: #222;
    border-radius: 6px 6px 0px 0px;
    background-color: #fff;
    box-shadow: 0px 0px 30px 1px rgba(0, 0, 0, 0.03);
    .hotel {
        margin: 0 20px;
        img {
            width: 320px;
            margin-bottom: 20px;
        }
        h3 {
            font-size: 18px;
        }
        p:first-of-type {
            font-size: 14px;
            color: #777777;
            line-height: 26px;
        }
        p:last-of-type {
            font-size: 12px;
            color: #777777;
            padding-left: 16px;
            background: url('~assets/icon/icon_local_def.png') no-repeat 0 7px;
            background-size: 12px;
            padding-bottom: 34px;
        }
        border-bottom: 1px dotted #c5c5c5;
    }
    .order {
        color: #111;
        padding: 30px 0 18px;
        margin: 0 20px;
        h4 {
            font-size: 16px;
        }
        p {
            font-size: 14px;
            padding: 8px 0;
            span {
                color: #8e8e8e;
            }
        }
    }
    .cost {
        padding: 18px 0;
        margin: 0 20px;
        p {
            font-size: 14px;
            padding: 8px 0;
            span {
                color: #8e8e8e;
            }
        }
    }
    .money {
        height: 90px;
        padding: 0 20px;
        background: #f9f9f9 url('~assets/public_img/border_bottom.png') no-repeat left bottom;
        display: flex;
        justify-content: space-between;
        align-items: center;
        p {
            font-size: 18px;
            font-weight: bold;
            color: #111;
        }
        div {
            font-size: 22px;
            font-family: OswaldMedium;
            font-weight: bold;
            color: #ea037c;
            span {
                font-size: 14px;
            }
        }
    }
}
</style>
