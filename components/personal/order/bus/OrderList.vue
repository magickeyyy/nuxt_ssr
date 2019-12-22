<!--
 * @Author: magckeyyy
 * @Date: 2019-11-12 11:44:55
 * @Description: 
 * @Attention: 
 -->
<template>
    <div class="orderList">
        <OrderForm :last.sync="last" :submit="submit" :reset="reset" :type="type" />
        <OrderContent
            :toDetail="toDetail"
            :orderList="orderList"
            :refresh="refreshOrderList"
            :cancel="cancel"
        />
        <div class="page">
            <Page
                :total="total"
                :page-size="pageSize"
                :current.sync="pageNo"
                prev-text="上一页"
                next-text="下一页"
                @on-change="changePage"
            />
        </div>
        <Modal
            v-model="vis"
            :closable="false"
            class="modalOrderList"
            :mask-closable="false"
            @on-ok="cancelComfim"
            @on-cancel="closeModal"
        >
            <i class="iconfont icondanchuang_guanbi closeIcon" @click="closeModal"></i>
            <div class="textIn">
                <h2>是否取消该订单？</h2>
                <div>订单免费取消日期为{{cancelData.freeCancellationDate}}</div>
                <div>超过日期{{cancelData.beforeDepartDate}}天，取消费用{{cancelData.damagesAmount}}元</div>
            </div>
        </Modal>
    </div>
</template>

<script>
import OrderForm from './OrderForm';
import OrderContent from './OrderContent';
import { api_bus } from '~/service/api';
export default {
    components: {
        OrderForm,
        OrderContent,
    },
    props: {
        type: {
            type: Number,
            required: true,
            default: 0,
        },
    },
    data() {
        return {
            vis: false,
            last: {},
            total: 0,
            pageSize: 10,
            pageNo: 1,
            orderList: [],
            cancelData: {
                beforeDepartDate: '',
                damagesPercent: '',
                freeCancellationDate: '',
            },
        };
    },
    methods: {
        changePage(n) {
            this.pageNo = n;
            let params = {
                ...this.last,
                pageNo: this.pageNo,
                pageSize: this.pageSize,
            };
            this.getOrderList(params);
        },
        submit(data) {
            this.last = data;
            let params = {
                ...this.last,
                pageNo: this.pageNo,
                pageSize: this.pageSize,
            };
            this.getOrderList(params);
        },
        reset(data) {
            this.last = data;
            let params = {
                ...this.last,
                pageNo: this.pageNo,
                pageSize: this.pageSize,
            };
            this.getOrderList(params);
        },
        toDetail(id, status) {
            let tempOd = '';
            this.$axios.get(api_bus.orderDetail, { params: { orderId: id }, custom: { token: true } }).then(res => {
                if (res.success) {
                    tempOd = res.data;
                    const payData = {
                        basicFeeTotal: tempOd.basicFeeTotal,
                        bookingBeginDate: tempOd.bookingBeginDate,
                        bookingEndDate: tempOd.bookingEndDate,
                        busId: tempOd.bus.id,
                        cityId: tempOd.cityId,
                        confirmTime: tempOd.reconfirmed,
                        contactMail: tempOd.contactMail,
                        contactName: tempOd.contactName,
                        contactTelephone: tempOd.contactTelephone,
                        deadline: tempOd.autoCancelTimeout,
                        departureCity: tempOd.departureCity,
                        departureDetail: tempOd.departureDetail,
                        departureTime: tempOd.departureTime,
                        endCity: tempOd.endCity,
                        groupNo: tempOd.groupNo,
                        orderId: tempOd.orderId,
                        orderNo: tempOd.orderNo,
                        orderRouteVOS: tempOd.orderRouteList,
                        otherFeeTotal: tempOd.otherFeeTotal,
                        passengerNum: tempOd.passengerNum,
                        payAmount: tempOd.payAmount,
                        seatNumberLocal: tempOd.bus.seatNumberLocal,
                        cancelRule: tempOd.cancelRule,
                        bus: tempOd.bus,
                        groupAttachmentUrl: tempOd.groupAttachmentUrl,
                        routeAttachmentUrl: tempOd.routeAttachmentUrl,
                        refundAmount:tempOd.refundAmount,
                        totalAmount:tempOd.totalAmount,
                        finalAttachmentUrl:tempOd.finalAttachmentUrl
                    };
                    // 订单状态分发
                    if (status === 'TO_BE_PAID') {
                        // 跳转 pay
                        this.$router.push({ name: 'bus-pay', params: { datas: payData } });
                    } else if (status === 'TO_BE_CONFIRMED'||status==='PAY_SUCCESS') {
                        // 跳转 wait confirm
                        this.$router.push({ name: 'bus-orderWaitConfirm', params: { datas: payData, status: status } });
                    } else {
                        // 跳转 orderShow
                        this.$router.push({ name: 'bus-showOrder', params: { datas: payData, status: status } });
                    }
                }
            });
        },
        cancel(id) {
            this.$axios
                .get(api_bus.busOrderCancelRul, { params: { orderId: id }, custom: { token: true } })
                .then(res => {
                    if (res.success) {
                        this.vis = true;
                        this.cancelData = res.data;
                        this.cancelData.orderId = id;
                    }
                });
        },
        cancelComfim() {
            this.$axios.post(api_bus.busOrderCancel, { ...this.cancelData }, { custom: { token: true } }).then(res => {
                if (res.success) {
                    this.refreshOrderList(true);
                    this.$Message.success('取消成功');
                }
            });
        },
        refreshOrderList(current = false) {
            let params = {
                ...this.last,
                pageNo: this.pageNo,
                pageSize: this.pageSize,
            };
            this.getOrderList(params);
        },
        getOrderList(params) {
            this.$axios.post(api_bus.listOrder, params, { custom: { token: true } }).then(res => {
                if (res.success) {
                    this.orderList = (res.data.records ? res.data.records : []).map(v => {
                        if (!v.voucherUrl) {
                            v['_disabled'] = true;
                        }
                        return v;
                    });
                    this.total = res.data.total * 1;
                }
            });
        },
        closeModal() {
            this.vis = false;
            this.cancelData = {
                beforeDepartDate: '',
                damagesPercent: '',
                freeCancellationDate: '',
            };
        },
    },
};
</script>

<style lang="less">
.modalOrderList {
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
}
</style>
<style scoped lang="less">
.page {
    height: 104px;
    background-color: #fff;
    display: flex;
    justify-content: flex-end;
    align-self: center;
    border-radius: 0 0 6px 6px;
    border: 1px solid #e8e8e8;
    border-top: none;
    padding: 36px;
}
.textIn {
    text-align: center;
    font-size: 14px;
    line-height: 24px;
    h2 {
        margin-top: 26px;
        margin-bottom: 20px;
        font-size: 20px;
        font-weight: bold;
    }
}
</style>
