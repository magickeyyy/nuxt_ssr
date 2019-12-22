<template>
    <ul class="hotelOrderInfo" v-if="info&&info.hotel">
        <li class="hotel">
            <img :src="info.hotel.imgs[0]" alt />
            <h3>{{info.hotel.nameChn}}</h3>
            <p>{{info.hotel.nameEng}}</p>
            <Rate :value="star" class="his" disabled v-if="star" />
            <p>{{info.hotel.address}}</p>
        </li>
        <li class="order">
            <h4>订单信息</h4>
            <p>
                <span>入住日期：</span>
                {{this.mixin_m_formatDate(info.checkInDate, 'xxxx-xx-xx()')}}
            </p>
            <p>
                <span>退房日期：</span>
                {{this.mixin_m_formatDate(info.checkOutDate, 'xxxx-xx-xx()')}}
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
        <li class="cost">
            <p>
                <span>房费（含税）：</span>
                &yen;{{this.$formatPrice(info.totalAmount)}}
            </p>
        </li>
        <li class="money">
            <p>实付金额</p>
            <div>
                <span style='font-size: 16px'>&yen;</span>
                {{this.$formatPrice(info.totalAmount)}}
            </div>
        </li>
    </ul>
    <ul class="hotelOrderInfo" v-else-if="info&&info.order">
        <li class="hotel">
            <img :src="info.order.imageList[0].imgUrl" alt />
            <h3>{{info.order.nameChn}}</h3>
            <p>{{info.order.nameEng}}</p>
            <Rate :value="star" class="his" disabled v-if="star" />
            <p>{{info.order.addressChn}}</p>
        </li>
        <li class="order" style="border:none;">
            <h4>订单信息</h4>
            <p>
                <span>入住日期：</span>
                {{info.checkinTime}}
            </p>
            <p>
                <span>退房日期：</span>
                {{info.checkoutTime}}
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
                <span>&yen;</span>
                {{this.$formatPrice(info.totalAmount)}}
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
            background: url('~assets/icon/icon_local_def.png') no-repeat 0 3px;
            background-size: 12px;
            padding-bottom: 34px;
        }
        border-bottom: 1px dotted #c5c5c5;
    }
    .order {
        color: #111;
        padding: 30px 0 18px;
        margin: 0 20px;
        border-bottom: 1px dotted #c5c5c5;
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
