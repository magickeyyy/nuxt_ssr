<!--
 * @Author: magckeyyy
 * @Date: 2019-11-12 11:44:55
 * @Description: 
 * @Attention: 
 -->
<template>
    <div class="orderList">
        <OrderForm ref="form"
                   :last.sync="last"
                   :submit="submit"
                   :reset="reset"
                   :type="type" />
        <OrderContent :toDetail="toDetail"
                      :orderList="orderList"
                      :refresh="refreshAllList"
                      :cancel="cancel"
                      :buyAgin="buyAgin"
                      :reset="reset"
                      :exportVouchers="exportVouchers" />
        <div class="page">
            <Page :total="total"
                  :page-size="pageSize"
                  :current.sync="pageNo"
                  prev-text="上一页"
                  next-text="下一页"
                  @on-change="changePage" />
        </div>
        <Modal v-model="modal"
               footer-hide
               :closable="false"
               @on-cancel="cancelModal">
            <div class="modal">
                <div class="title">是否取消该订单？</div>
                <div class="text">
                    <p>订单免费取消日期为{{cancelFreeEndTime}}，取消费用{{damagesAmount}}元</p>
                </div>
                <div class="btn">
                    <Button @click.native="cancelModal">取消</Button>
                    <Button @click.native="confirm"
                            type="primary">确认</Button>
                </div>
            </div>
        </Modal>
    </div>
</template>

<script>
import OrderForm from './OrderForm';
import OrderContent from './OrderContent';
import { api_order, api_pay } from '~/service/api';
import { mapMutations } from 'vuex'

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
            last: {},
            total: 0,
            pageSize: 10,
            pageNo: 1,
            orderList: [],
            modal: false,
            damagesAmount: 0,
            cancelFreeEndTime: '',
            orderId: null,
        };
    },
    watch: {
        $route(n, o) {
            if (n) {
                this.$forceUpdate();
            }
        },
    },
    mounted() {
        this.$refs.form.submitForm();
    },
    methods: {
        ...mapMutations('hotel', [ 'SET_ORDER' ]),
        confirm() {
            this.$axios
                .post(
                    api_order.cancelHotelOrder,
                    { orderId: this.orderId, damagesAmount: this.damagesAmount },
                    { custom: { token: true, encode: 'urlencoded' } },
                )
                .then(res => {
                    this.modal = false;
                    if (res.success) {
                        this.refreshCurList();
                        this.$Message.success('取消成功');
                    }
                });
        },
        cancelModal() {
            this.modal = false;
        },
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
            this.pageNo = 1;
            let params = {
                ...data,
                pageNo: this.pageNo,
                pageSize: this.pageSize,
            };
            this.getOrderList(params);
        },
        reset(data) {
            this.last = data;
            this.pageNo = 1;
            let params = {
                ...this.last,
                pageNo: this.pageNo,
                pageSize: this.pageSize,
            };
            this.getOrderList(params);
        },
        toDetail(id) {
            this.$router.push({ name: 'personal_center-orderDetail-hotel', query: { id } });
        },
        exportVouchers(src) {
            if (!src) this.$Message.error('当前订单不支持该操作');
            let a = document.createElement('a');
            a.href = src;
            a.download = 'VOUCHER.docx';
            a.click();
        },
        buyAgin({ id, orderNo, confirmTime, totalAmount, autoCancelTimeout }) {
            this.$axios.get(api_pay.payWay,{ token: true })
                .then(res => {
                    if(res.success) {
                        this.SET_ORDER({
                            confirmTime,
                            deadline: autoCancelTimeout,
                            orderId: id * 1,
                            orderNo,
                            payAmount: totalAmount,
                            payment: res.data
                        });
                        this.$router.push({ name: 'play-pay' });
                    }
                })
        },
        cancel(orderId, cancelFreeEndTime) {
            this.$axios
                .get(api_order.getHotelDamages, { params: { orderId: orderId * 1 }, custom: { token: true } })
                .then(res => {
                    if (res.success) {
                        this.damagesAmount = res.data.damagesAmount;
                        this.cancelFreeEndTime = this.mixin_m_formatDate(cancelFreeEndTime * 1);
                        this.orderId = orderId;
                        this.modal = true;
                    }
                });
        },
        refreshCurList() {
            // 刷新当前列表
            let params = {
                ...this.last,
                pageNo: this.pageNo,
                pageSize: this.pageSize,
            };
            this.$axios.get(api_order.allHotelOrder, { params, custom: { token: true } }).then(res => {
                if (res.success) {
                    this.orderList = res.data.records ? res.data.records : [];
                    this.pageNo = res.data.pageNo * 1;
                    this.total = res.data.total * 1;
                } else {
                    this.$Message.error({ content: '刷新订单列表失败', duration: 2 });
                }
            });
        },
        refreshAllList() {
            this.pageNo = 1;
            let params = { ...this.last, pageNo: this.pageNo, pageSize: this.pageSize };
            this.$axios.get(api_order.allHotelOrder, { params, custom: { token: true } }).then(res => {
                if (res.success) {
                    this.orderList = res.data.records ? res.data.records : [];
                    this.pageNo = res.data.pageNo * 1;
                    this.total = res.data.total * 1;
                }
            });
        },
        getOrderList(params) {
            return this.$axios.get(api_order.allHotelOrder, { params, custom: { token: true } }).then(res => {
                if (res.success) {
                    this.orderList = res.data.records;
                    this.total = res.data.total * 1;
                }
            });
        },
    },
};
</script>

<style scoped lang="less">
@deep: ~'>>>';
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
.modal {
    .title {
        font-size: 20px;
        font-weight: bold;
        color: #111;
        text-align: center;
        padding-top: 20px;
    }
    .text {
        font-size: 14px;
        color: #000;
        padding-top: 20px;
        height: 80px;
        overflow: hidden;
        text-align: center;
    }
    .btn {
        display: flex;
        justify-content: center;
        @{deep}.ivu-btn {
            border-radius: 2px;
            width: 120px;
            height: 46px;
            span {
                font-size: 14px;
            }
        }
        @{deep}.ivu-btn-default {
            border: 2px solid rgba(239, 239, 239, 1);
            color: #6c6c6c;
            margin-right: 32px;
            background-color: #fff;
            &:hover {
                box-shadow: none;
                color: #6c6c6c;
            }
        }
    }
}
@{deep}.ivu-modal-body {
    background-image: linear-gradient(180deg, #ed0287 0, #ed0287 6px, #fff 6px, #fff 100%);
    border-radius: 0;
    padding: 32px;
    margin: 0;
}
@{deep}.ivu-modal {
    border-radius: 0;
    width: 500px !important;
    height: 260px;
}
</style>
