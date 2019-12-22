<template>
    <ul class="hotelOrderInfo" v-if="info">
        <li class="hotel">
            <img :src="info.img" alt="加载失败" v-noimg="'320-430'"/>
            <h3>{{info.nameChn}}</h3>
            <p>{{info.nameEng}}</p>
            <Rate class="his" disabled allow-half v-model="info.star" />
            <p>{{info.addressChn}}</p>
        </li>
        <li class="order">
            <h4>订单信息</h4>
            <p>
                <span>入住日期：</span>
                {{info.checkOutDate | mixin_f_formatDate('xxxx年xx月xx日（）')}}
            </p>
            <p>
                <span>退房日期：</span>
                {{info.checkInDate | mixin_f_formatDate('xxxx年xx月xx日（）')}}
            </p>
            <p>
                <span>入住时间：</span>
                {{info.stay}}晚
            </p>
            <p>
                <span>入住房型：</span>
                {{info.rateName}}
            </p>
            <p>
                <span>房间数量：</span>
                {{info.roomCount}}间
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
        info: {
            type: Object,
            required: true,
        },
    },
    computed: {
        star() {
            if (this.info && this.info.hotel) {
                return Number(this.info.hotel.star);
            } else if (this.info && this.info.order) {
                return this.info.order.star * 1;
            }
            return 0;
        },
    },
};
</script>

<style scoped lang="less">
.hotelOrderInfo {
    width: 356px;
    color: #222;
    border-radius: 6px 6px 0px 0px;
    background-color: #fff;
    box-shadow: 0px 0px 30px 1px rgba(0, 0, 0, 0.03);
    .hotel {
        margin: 0 18px;
        padding-top:16px;
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
            background: url('~assets/icon/icon_local_def.png') no-repeat 0 3px;
            background-size: 12px;
            padding-bottom: 34px;
        }
        border-bottom: 1px dotted #c5c5c5;
    }
    .order {
        color: #111;
        padding: 30px 0 18px;
        margin: 0 18px;
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
