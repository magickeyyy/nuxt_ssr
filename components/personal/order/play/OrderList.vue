<!--
 * @Author: magckeyyy
 * @Date: 2019-11-12 11:44:55
 * @Description: 
 * @Attention: 
 -->
<template>
    <div class="orderList">
        <OrderForm ref="form" :last.sync="last" :submit="submit" :reset="reset" :type="type" />
        <OrderContent
            :toDetail="toDetail"
            :orderList="orderList"
            :refresh="refreshOrderList"
            :remove="remove"
            :cancel="cancel"
            :pay="pay"
            :buyAgin="buyAgin"
            :comment="comment"
            :exportVouchers="exportVouchers"
            :resourceType="resourceType"
            :vouchers.sync="vouchers"
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
    </div>
</template>

<script>
import OrderForm from './OrderForm';
import OrderContent from './OrderContent';
import { api_order } from '~/service/api';
import { ResTypeToServer } from '~/assets/js/play';
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
        resourceType: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            last: {},
            total: 0,
            pageSize: 10,
            pageNo: 1,
            orderList: [],
            vouchers: [],
        };
    },
    mounted() {
        this.$refs.form.submitForm();
    },
    methods: {
        changePage(n) {
            this.pageNo = n;
            let params = {
                ...this.last,
                resourceType: this.resourceType,
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
                resourceType: this.resourceType,
                pageNo: this.pageNo,
                pageSize: this.pageSize,
            };
            this.getOrderList(params);
        },
        reset(data) {
            this.last = data;
            let params = {
                ...this.last,
                resourceType: this.resourceType,
                pageNo: this.pageNo,
                pageSize: this.pageSize,
            };
            this.getOrderList(params);
        },
        toDetail(id) {
            let str = ResTypeToServer.find(v => v.value1 === this.resourceType).value2;
            this.$router.push({ name: `personal_center-orderDetail-${str}`, query: { id } });
        },
        exportVouchers() {
            if (this.vouchers.length < 1) return;
            let data = [];
            this.vouchers.map(v => {
                let obj = {
                    orderNo: v.orderNo,
                    url: v.voucherUrl,
                    orderId: v.id * 1,
                };
                data.push(obj);
            });
            this.$axios
                .post(api_order.expPlayVo, data, { responseType: 'blob', custom: { token: true, blob: 'vocher.zip' } })
                .then(res => {
                    if (res.success) {
                        this.$Message.success(res.msg);
                    } else {
                        this.$Message.error('下载失败');
                    }
                });
        },
        buyAgin({ resourceId, countryId, cityId, resourceType }) {
            this.$router.push({
                name: 'play-detail',
                query: { id: resourceId, type: resourceType, countryId, cityId },
            });
        },
        comment(row) {
            let str = ResTypeToServer.find(v => v.value1 === this.resourceType).value2;
            this.$nuxt.$router.push({
                name: `personal_center-comment-${str}`,
                query: { id: row.id * 1 },
            });
        },
        pay(row) {
            http: this.$nuxt.$router.push({
                name: `play-pay`,
                params: { orderId: row.id, deadline: row.deadline, confirmTime: row.confirmTime, payAmount: row.payAmount },
            });
        },
        remove(id) {
            this.$axios.get(api_order.deletePlayOrder, { params: { id }, custom: { token: true } }).then(res => {
                if (res.success) {
                    this.total--;
                    this.refreshOrderList(true);
                    this.$Message.success('删除成功');
                } else {
                    this.$Message.success('删除失败');
                }
            });
        },
        cancel(id) {
            this.$axios.get(api_order.cancelPolicy, { params: { id }, custom: { token: true } }).then(res => {
                if (res.success) {
                    this.$Message.success(res.msg);
                } else {
                    this.$Message.error('下载失败');
                }
            });
        },
        comment(row) {
            let str = ResTypeToServer.find(v => v.value1 === this.resourceType).value2;
            this.$nuxt.$router.push({
                name: `personal_center-comment-${str}`,
                query: { id: row.id * 1 },
            });
        },
        remove(id) {
            this.$axios.get(api_order.deletePlayOrder, { params: { id }, custom: { token: true } }).then(res => {
                if (res.success) {
                    this.total--;
                    this.refreshOrderList(true);
                    this.$Message.success('删除成功');
                }
            });
        },
        cancel(id) {
            this.$axios.get(api_order.cancelPolicy, { params: { id }, custom: { token: true } }).then(res => {
                if (res.success) {
                    this.$axios
                        .post(
                            api_order.cancelPlayOrder,
                            { id, damagesAmount: res.data.damagesAmount * 1 },
                            { custom: { token: true, encode: 'urlencoded' } },
                        )
                        .then(res => {
                            if (res.success) {
                                this.refreshOrderList(true);
                                this.$Message.success('取消成功');
                            } else {
                                this.$Message.error('取消失败');
                            }
                        });
                } else {
                    this.$Message.error('获取违约金失败');
                }
            });
        },
        refreshOrderList(current = false) {
            /**
             * @Description: 刷新当前或者全部页面。
             * @Attention: 在删除订单后也要调用此方法，如果是最后一页且当页只有一个，需要返回上一页(会先this.total--)。
             * @param {type} current：true刷新当前页面,false刷新全部页面
             * @return:
             */
            let num = 1;
            if (current === true) {
                num = this.pageNo;
                let a = this.total % this.pageSize;
                let b = Math.ceil(this.total / this.pageSize);
                if (num > 1 && b > 1 && a === 0) num--; // 删除最后一页最后一条
            }
            let params = { ...this.last, pageNo: num, pageSize: this.pageSize, resourceType: this.resourceType };
            this.$axios.get(api_order.allPlayOrder, { params, custom: { token: true } }).then(res => {
                if (res.success) {
                    this.orderList = (res.data.records ? res.data.records : []).map(v => {
                        if (!v.voucherUrl) {
                            v['_disabled'] = true;
                        }
                        return v;
                    });
                    this.pageNo = res.data.pageNo * 1;
                    this.total = res.data.total * 1;
                } else {
                    this.$Message.error({ content: '刷新订单列表失败', duration: 2 });
                }
            });
        },
        getOrderList(params) {
            return this.$axios.get(api_order.allPlayOrder, { params, custom: { token: true } }).then(res => {
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
    },
};
</script>

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
</style>
