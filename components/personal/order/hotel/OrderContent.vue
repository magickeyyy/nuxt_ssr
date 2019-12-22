<template>
    <div class="orderContainer">
        <div class="btn">
            <div class="left"></div>
            <div class="right">
                <Button @click.native="refresh">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#iconshuaxin" />
                    </svg>
                    刷新订单状态
                </Button>
            </div>
        </div>
        <div class="table">
            <Table border :columns="columns" :data="orderList"></Table>
        </div>
    </div>
</template>

<script>
import { api_order } from '~/service/api';
import { HotelOrderType, HotelOrderStatus } from '~/assets/js/hotel';
export default {
    name: 'OrderContent',
    props: {
        orderList: {
            type: Array,
            default: () => [],
        },
        type: {
            type: String,
            default: 'hotel',
        },
        toDetail: {
            type: Function,
            required: true,
        },
        cancel: {
            type: Function,
            required: true,
        },
        exportVouchers: {
            type: Function,
            required: true,
        },
        refresh: {
            type: Function,
            required: true,
        },
        buyAgin: {
            type: Function,
            required: true,
        }
    },
    data() {
        return {
            sortCheckTime: true,
            sortOrderTime: true,
            HotelOrderStatus: HotelOrderStatus,
            hotelColumns: [
                // {
                //     type: 'selection',
                //     width: 60,
                //     align: 'center',
                // },
                {
                    title: '订单号',
                    key: 'orderNo',
                    width: 200,
                    align: 'center',
                },
                {
                    title: '贵司团号',
                    key: 'groupNo',
                    align: 'center',
                },
                {
                    align: 'center',
                    title: '下单时间',
                    render: (h, { row }) => {
                        return h('div', [h('div', {}, this.mixin_m_formatDate(row.orderTime * 1))]);
                    },
                },
                {
                    title: '预定类型',
                    align: 'center',
                    render: (h, { row }) => {
                        return <div>{HotelOrderType[row.orderType]}</div>;
                    },
                },
                {
                    title: '酒店名称',
                    align: 'center',
                    width: 200,
                    key: 'hotelName',
                },
                {
                    title: '房型',
                    align: 'center',
                    key: 'roomType',
                },
                {
                    title: '房数',
                    align: 'center',
                    key: 'roomNumber',
                },
                {
                    title: '入住时间',
                    align: 'center',
                    render: (h, { row }) => {
                        return h('div', [h('div', {}, this.mixin_m_formatDate(row.checkinTime * 1))]);
                    },
                },
                {
                    title: '离开时间',
                    align: 'center',
                    render: (h, { row }) => {
                        return h('div', [h('div', {}, this.mixin_m_formatDate(row.checkoutTime * 1))]);
                    },
                },
                {
                    title: '免费取消截止日期',
                    width: 160,
                    align: 'center',
                    render: (h, { row }) => {
                        return (
                            <div>{row.cancelFreeEndTime?this.mixin_m_formatDate(row.cancelFreeEndTime * 1):''}</div>
                        )
                    },
                },
                {
                    title: '订单金额',
                    align: 'center',
                    render: (h, { row }) => {
                        return h('div', [h('div', {}, this.mixin_m_formatNumber(row.totalAmount * 1))]);
                    },
                },
                {
                    title: '订单状态',
                    align: 'center',
                    render: (h, { row }) => {
                        return h('div',{
                                style: {
                                    color: row.orderStatus === 'CONFIRMED'?'#ec1e8a':''
                                },
                            },
                            [HotelOrderStatus.find(v => v.value === row.orderStatus).label]
                        )
                    },
                },
                {
                    title: '操作',
                    key: 'address',
                    width: 120,
                    align: 'center',
                    render: (h, { row, column, index }) => {
                        const num = HotelOrderStatus.findIndex(v => v.value === row.orderStatus);
                        let vnode1, vnode2, vnode3, vnode4;
                        vnode1 = (
                            <div onClick={this.toDetail.bind(this, row.id)}>
                                查看详情
                            </div>
                        );
                        // 已确认待出单/已出单或预定成功/退款失败可取消
                        if (row.canCancel && (num === 2 || num === 3 || num === 8)) {
                            vnode2 = (
                                <div
                                    onClick={this.cancel.bind(this, row.id, row.cancelFreeEndTime)}
                                >
                                    取消订单
                                </div>
                            );
                        }
                        // 待支付的去支付
                        if (num === 0) {
                            vnode3 = <div class="table_option" onClick={this.buyAgin.bind(this, row)}>支付&nbsp;</div>;
                        }
                        // 如果有voucherDownload就可以下载voucherDownload
                        if (row.voucherDownload) {
                            vnode4 = (
                                <div
                                    onClick={this.exportVouchers.bind(this, row.voucherDownload)}
                                >
                                    下载VOUCHER
                                </div>
                            );
                        }
                        return (
                            <div>
                                {vnode3}
                                {vnode1}
                                {vnode2}
                                {vnode4}
                            </div>
                        );
                    },
                },
            ],
            data: [{ orderNo: 1, groupNo: 3434 }],
        };
    },
    computed: {
        columns() {
            switch (this.type) {
                default:
                    return this.hotelColumns;
            }
        },
    },
    methods: {
        remove(orderId, index) {
            this.$axios
                .post(
                    api_order.delHotelOrder,
                    { orderId: orderId * 1 },
                    { custom: { token: true, encode: 'urlencoded' } },
                )
                .then(res => {
                    if (res.success) {
                        this.orderList.splice(index, 1);
                    }
                });
        },
    },
};
</script>

<style scoped lang="less">
@deep: ~'>>>';
@{deep}.ivu-table-cell {
    cursor: pointer;
    svg {
        display: inline-block;
        margin-left: 6px;
    }
}
.orderContainer {
    border: 1px solid #e8e8e8;
    border-bottom: none;
    box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.03);
    border-radius: 6px 6px 0 0;
    margin-top: 12px;
    min-height: 546px;
    background: #fff;
    padding: 20px 36px;
    display: flex;
    flex-direction: column;
    .btn {
        padding: 6px 0 28px;
        display: flex;
        justify-content: space-between;
        .ivu-btn-default {
            border: 1px solid rgb(232, 232, 232);
            border-radius: 2px;
            font-size: 14px;
            font-weight: 400;
            @{deep}span {
                display: flex;
                align-items: center;
                justify-content: center;
            }
        }
        .ivu-btn-default:active,
        .ivu-btn-default:hover {
            color: #111;
        }
        .ivu-btn-default:focus {
            box-shadow: 0 0 0 2px rgba(232, 232, 232, 0.2);
        }
        .left .ivu-btn-default {
            color: #111;
        }
        .right .ivu-btn-default {
            color: #ec1e8a;
        }
        svg {
            width: 18px;
            height: 18px;
        }
    }
    .table {
        overflow-x: auto;
        .ivu-table-wrapper {
            border-color: #f0f0f0;
            width: 1566px;
        }
    }
    @{deep}.ivu-table-border td {
        border-color: #f0f0f0;
    }
}
</style>
