<template>
    <div class="orderContainer">
        <div class="btn">
            <div class="left">
                <Button @click="refresh(true)">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#iconshuaxin" />
                    </svg>
                    刷新订单状态
                </Button>
            </div>
        </div>
        <div class="table">
            <Table ref="table" border :columns="columns" :data="orderList"></Table>
        </div>
    </div>
</template>

<script>
import { BusOrderStateToCilent } from '~/assets/js/bus';
import { payTypeDictId } from '~/assets/js/dictionary';
import { api_order } from '~/service/api';
export default {
    props: {
        toDetail: {
            type: Function,
            required: true,
        },
        cancel: {
            type: Function,
            required: true,
        },
        refresh: {
            type: Function,
            required: true,
        },
        orderList: {
            type: Array,
            default: () => [],
            required: true,
        },
    },
    data() {
        return {
            columns: [
                {
                    title: '订单号',
                    width: 158,
                    align: 'center',
                    key: 'orderNo',
                },
                {
                    title: '贵司团号',
                    align: 'center',
                    key: 'groupNo',
                },
                {
                    title: '下单时间',
                    align: 'center',
                    render: (h, { row }) => {
                        return <div>{row.overbookingTime.slice(0, 16)}</div>;
                    },
                },
                {
                    title: '开始时间',
                    align: 'center',
                    render: (h, { row }) => {
                        return <div>{row.bookingBeginDate.slice(0, 16)}</div>;
                    },
                },
                {
                    title: '上车地点',
                    align: 'center',
                    key: 'departureCity',
                },
                {
                    title: '结束时间',
                    align: 'center',
                    key: 'bookingEndDate',
                },
                {
                    title: '下车地点',
                    align: 'center',
                    key: 'endCity',
                },
                {
                    title: '用车天数',
                    align: 'center',
                    key: 'useDays',
                },
                {
                    title: '支付方式',
                    align: 'center',
                    render: (h, { row }) => {
                        return <div>{payTypeDictId[row.paymentGateway]}</div>;
                    },
                },
                {
                    title: '订单状态',
                    align: 'center',
                    key: 'orderState',
                    render: (h, { row }) => {
                        function color(v) {
                            if (v === 'TO_BE_PAID' || v === 'TO_BE_CONFIRMED'||v==='GROUP_PUSHED'||v==='PAY_SUCCESS'||v==='COMPLETED') {
                                return '#EA037C';
                            } else if (v === 'CONFIRMED' || v === 'GOT_FINAL') {
                                return '#222';
                            } else {
                                return '#999';
                            }
                        }
                        return (
                            <div style={[{ color: color(row.orderState) }]}>
                                {BusOrderStateToCilent[row.orderState]}
                            </div>
                        );
                    },
                },
                {
                    title: '操作',
                    key: 'address',
                    align: 'center',
                    render: (h, { row, column, index }) => {
                        if (
                            row.orderState === 'CANCELING' ||
                            row.orderState === 'CANCELED' ||
                            row.orderState === 'COMPLETED'
                        ) {
                            return (
                                <div
                                    style="color:#EA037C;"
                                    onClick={this.toDetail.bind(this, row.orderId * 1, row.orderState)}
                                >
                                    查看详情
                                </div>
                            );
                        } else if (
                            row.orderState === 'TO_BE_CONFIRMED' ||
                            row.orderState === 'CONFIRMED' ||
                            row.orderState === 'GOT_FINAL'||
                            row.orderState==='GROUP_PUSHED'||
                            row.orderState==='PAY_SUCCESS'
                        ) {
                            return (
                                <div>
                                    <div style="color:#999;" onClick={this.cancel.bind(this, row.orderId * 1)}>
                                        取消订单
                                    </div>
                                    <div
                                        style="color:#EA037C;"
                                        onClick={this.toDetail.bind(this, row.orderId * 1, row.orderState)}
                                    >
                                        查看详情
                                    </div>
                                </div>
                            );
                        } else if (row.orderState === 'AUTO_CANCELED') {
                            <div></div>;
                        } else {
                            return (
                                <div>
                                    <div
                                        style="color:#999;"
                                        onClick={this.toDetail.bind(this, row.orderId * 1, row.orderState)}
                                    >
                                        支付
                                    </div>
                                </div>
                            );
                        }
                    },
                },
            ],
        };
    },
    methods: {
        detail(id) {
            this.$nuxt.$router.push({ name: 'bus-showOrder', query: { id } });
        },
        submit() {
            this.$emit('submit', null, true);
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
