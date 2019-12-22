<template>
    <div class="orderContainer">
        <div class="btn">
            <div class="left">
                <Button style="margin-right:20px;" @click="exportVouchers">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icondaochuquerenhan" />
                    </svg>
                    导出确认函
                </Button>
            </div>
            <div class="right">
                <Button @click="refresh(true)">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#iconshuaxin" />
                    </svg>
                    刷新订单状态
                </Button>
            </div>
        </div>
        <div class="table">
            <Table
                ref="table"
                border
                :columns="columns"
                :data="orderList"
                :loading="loading"
                @on-selection-change="exportVoucher"
            ></Table>
        </div>
    </div>
</template>

<script>
import { POS_TO_CLIENT, POS_TO_SERVER, RESTYPE_TO_CLIENT, TICKET_TO_CLIENT, ResTypeToServer } from '~/assets/js/play';
import { api_order } from '~/service/api';
export default {
    props: {
        toDetail: {
            type: Function,
            required: true,
        },
        buyAgin: {
            type: Function,
            required: true,
        },
        cancel: {
            type: Function,
            required: true,
        },
        comment: {
            type: Function,
            required: true,
        },
        remove: {
            type: Function,
            required: true,
        },
        refresh: {
            type: Function,
            required: true,
        },
        exportVouchers: {
            type: Function,
            required: true,
        },
        orderList: {
            type: Array,
            default: () => [],
            required: true,
        },
        loading: {
            default: false,
        },
        vouchers: {
            required: true,
            type: Array,
        },
        resourceType: {
            type: String,
            required: true,
        },
        pay: {
            type: Function,
            required: true,
        },
    },
    data() {
        return {
            // orderTimeType: 0,
            // sortCheckType: 0,
            columns: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center',
                },
                {
                    title: '订单号',
                    width: 158,
                    align: 'center',
                    render: (h, { row }) => {
                        return <div style="width:100%;height:100%;" onClick={this.toDetail.bind(this, row.id * 1)}>{row.orderNo}</div>;
                    },
                },
                {
                    title: '贵司团号',
                    key: 'groupNo',
                    align: 'center',
                    render: (h, { row }) => {
                        return <div style="width:100%;height:100%;" onClick={this.toDetail.bind(this, row.id * 1)}>{row.groupNo}</div>;
                    },
                },
                {
                    align: 'center',
                    renderHeader: (h, { row, column, index }) => {
                        return (
                            <div style="width:100%;height:100%;">
                                <span>下单时间</span>
                                {/*<span onClick={this.changeSort.bind(this,{k:'orderTimeType',v:0})}>下单时间</span>
                                <svg class={['icon']} aria-hidden="true" onClick={this.changeSort.bind(this,{k:'orderTimeType'})}>
                                    <use xlinkHref={this.changeSvg('orderTimeType')}></use>
                                </svg>*/}
                            </div>
                        );
                    },
                    render: (h, { row }) => {
                        return (
                            <div style="width:100%;height:100%;" onClick={this.toDetail.bind(this, row.id * 1)}>{row.overbookingTime.slice(0, 16)}</div>
                        );
                    },
                },
                {
                    align: 'center',
                    renderHeader: (h, { row, column, index }) => {
                        return (
                            <div style="width:100%;height:100%;">
                                <span>预定时间</span>
                                {/*<span onClick={this.changeSort.bind(this,{k:'sortCheckType',v:0})}>预定时间</span>
                                <svg class={['icon']} aria-hidden="true" onClick={this.changeSort.bind(this,{k:'sortCheckType'})}>
                                    <use xlinkHref={this.changeSvg('sortCheckType')}></use>
                                </svg>*/}
                            </div>
                        );
                    },
                    render: (h, { row }) => {
                        return <div style="width:100%;height:100%;" onClick={this.toDetail.bind(this, row.id * 1)}>{row.reserveDate.slice(0, 16)}</div>;
                    },
                },
                {
                    title: '预定类型',
                    align: 'center',
                    render: (h, { row }) => {
                        return (
                            <div style="width:100%;height:100%;" onClick={this.toDetail.bind(this, row.id * 1)}>
                                {this.resourceType === ResTypeToServer[0].value1
                                    ? RESTYPE_TO_CLIENT[row.reserveType]
                                    : TICKET_TO_CLIENT[row.voucherType]}
                            </div>
                        );
                    },
                },
                {
                    title: '餐厅名称',
                    align: 'center',
                    render: (h, { row }) => {
                        return <div style="width:100%;height:100%;" onClick={this.toDetail.bind(this, row.id * 1)}>{row.resourceName}</div>;
                    },
                },
                {
                    title: '产品名称',
                    align: 'center',
                    render: (h, { row }) => {
                        return <div style="width:100%;height:100%;" onClick={this.toDetail.bind(this, row.id * 1)}>{row.productName}</div>;
                    },
                },
                {
                    title: '数量',
                    align: 'center',
                    render: (h, { row }) => {
                        return (
                            <div style="width:100%;height:100%;" onClick={this.toDetail.bind(this, row.id * 1)}>
                                {row.reserveType == 1 ? row.reserveNum : row.quantity}
                            </div>
                        );
                    },
                },
                {
                    title: '订单状态',
                    align: 'center',
                    key: 'orderState',
                    render: (h, { row }) => {
                        function color(v) {
                            if (v < 3) {
                                return '#EA037C';
                            } else if (
                                POS_TO_CLIENT[row.orderState].value === 3 ||
                                POS_TO_CLIENT[row.orderState].value === 6
                            ) {
                                return '#222';
                            } else {
                                return '#999';
                            }
                        }
                        return (
                            <div
                                style={[{ color: color(POS_TO_CLIENT[row.orderState].value) }]}
                                onClick={this.toDetail.bind(this, row.id * 1)}
                            >
                                {POS_TO_CLIENT[row.orderState].label}
                            </div>
                        );
                    },
                },
                {
                    title: '操作',
                    key: 'address',
                    align: 'center',
                    render: (h, { row, column, index }) => {
                        switch (POS_TO_CLIENT[row.orderState].value * 1) {
                            case 1:
                                return (
                                    <div>
                                        <div style="color:#EA037C;" onClick={this.pay.bind(this, row)}>去支付</div>
                                    </div>
                                );
                            case 2:
                                return (
                                    <div style="color:#999;" onClick={this.cancel.bind(this, row.id * 1)}>
                                        取消订单
                                    </div>
                                );
                            case 3:
                                return (
                                    <div>
                                        {row.canCancel ? (
                                            <div style="color:#999;" onClick={this.cancel.bind(this, row.id * 1)}>
                                                取消订单
                                            </div>
                                        ) : null}
                                    </div>
                                );
                            case 4:
                                return (
                                    <div>
                                        <div onClick={this.remove.bind(this, row.id)}>删除订单</div>
                                    </div>
                                );
                            case 5:
                                return (
                                    <div>
                                        <div onClick={this.buyAgin.bind(this, row)}>再订一次</div>
                                        <div style="color:#999;" onClick={this.remove.bind(this, row.id)}>
                                            删除订单
                                        </div>
                                    </div>
                                );
                            case 6:
                                return (
                                    <div>
                                        <div onClick={this.buyAgin.bind(this, row)}>再订一次</div>
                                        {row.isCommented === 'NOT_COMMENT' ? (
                                            <div style="color:#EA037C;" onClick={this.comment.bind(this, row)}>
                                                评价
                                            </div>
                                        ) : null}
                                    </div>
                                );
                            case 7:
                                return (
                                    <div>
                                        <div onClick={this.buyAgin.bind(this, row)}>再订一次</div>
                                        <div style="color:#999;" onClick={this.remove.bind(this, row.id)}>
                                            删除订单
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
        // 需求变更：不要下单等时间切换排序，暂留
        // changeSvg(key) {
        //     switch (this[key]) {
        //         case 0:
        //             return '#iconjiagepaixu_gao-copy';
        //         case 1:
        //             return '#iconjiagepaixu_gao';
        //         case 2:
        //             return '#iconjiagepaixu_di';
        //     }
        // },
        // changeSort({k,v}){
        //     if(v===0) {
        //         this[k] = v;
        //     } else {
        //         if(this[k]===1||this[k]===0){
        //             this[k]=2;
        //         } else {
        //             this[k]=1;
        //         }
        //     }
        // },
        detail(id) {
            this.$nuxt.$router.push({ name: 'personal_center-detail', query: { id } });
        },
        submit() {
            this.$emit('submit', null, true);
        },
        exportVoucher(data) {
            this.$emit('update:vouchers', data);
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
