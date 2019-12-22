<template>
    <div>
        <div class="orderState">
            <div class="top">
                <p>订单号：{{detail.orderNo}}</p>
                <p>
                    订单状态：
                    <span
                        :style="{color:color(detail.orderState)}"
                    >{{detail.orderState | orderStateText}}</span>
                </p>
            </div>
            <div class="bottom" v-if="tranStae(detail.orderState)==2">
                <div>
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#iconzhifuchenggong" />
                    </svg>
                </div>
                <div class="msg">
                    <p>订单支付成功！正在为您确认资源</p>
                    <div v-if="detail.reconfirmed>0">将在支付成功后{{detail.reconfirmed}}小时内，反馈确认结果</div>
                    <div v-else>支付成功后将立即确认并反馈确认结果</div>
                </div>
            </div>
            <div class="bottom" v-if="tranStae(detail.orderState)==4">
                <div>
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#iconzhifushibai" />
                    </svg>
                </div>
                <div class="msg">
                    <p>很抱歉，您的订单暂时没有资源可供安排，已付款项会在3个工作日内原路退回</p>
                    <div>
                        您也可以尝试其他资源或者日期&emsp;
                        <nuxt-link to="/play">重新预定</nuxt-link>
                    </div>
                </div>
            </div>
            <div class="bottom" v-if="tranStae(detail.orderState)==5">
                <div>
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#iconquxiaodingdan" />
                    </svg>
                </div>
                <div class="msg">
                    <p v-if="detail.payType==='SPOT'">订单已取消</p>
                    <p v-if="detail.payType==='ADVANCE'">订单已取消，应退款项会在3个工作日内原路退回</p>
                    <div v-if="detail.payType==='ADVANCE'&&detail.refundAmount">
                        根据退款规则，应退金额：
                        <span>&yen;{{detail.refundAmount}}</span>
                    </div>
                    <div v-if="!detail.refundAmount&&detail.payType==='ADVANCE'">获取退款金额失败，请联系客服。</div>
                </div>
            </div>
            <div class="bottom" v-if="tranStae(detail.orderState)==7">
                <div>
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#iconquxiaodingdan" />
                    </svg>
                </div>
                <div class="msg">
                    <p>您的订单超过30分钟未支付已自动取消</p>
                </div>
            </div>
            <div
                class="bottom"
                v-if="tranStae(detail.orderState)==6||tranStae(detail.orderState)==3"
            >
                <div>
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#iconyudingchenggong" />
                    </svg>
                </div>
                <div class="msg">
                    <p>确认成功，Voucher已发送至您的邮箱：{{detail.contactMail}}</p>
                    <div>请携带电子Voucher到店使用即可</div>
                </div>
            </div>
        </div>
        <div class="orderStep">
            <OrderStep
                :type="'hotelOrder'"
                :current="{success: true, value:tranStae(detail.orderState)*1}"
            />
        </div>
        <div class="info">
            <h3>预定信息</h3>
            <div class="box">
                <div class="left">预定类型：</div>
                <div class="right">
                    <p>{{detail.reserveType | reserveType}}</p>
                </div>
            </div>
            <div class="box" v-if="detail.groupNo">
                <div class="left">贵司团号：</div>
                <div class="right">
                    <p>{{detail.groupNo}}</p>
                </div>
            </div>
            <div class="box" style="margin-top:22px;">
                <div class="left" style="margin-top:10px;">{{detail.reserveType | reserveType}}详情：</div>
                <div class="right">
                    <div class="table">
                        <Row class="thead">
                            <Col span="8">{{detail.reserveType | reserveType}}名称</Col>
                            <Col span="16">详情</Col>
                        </Row>
                        <Row class="tbody">
                            <Col span="8">{{detail.skuName}}</Col>
                            <Col span="16">{{detail.skuDetail}}</Col>
                        </Row>
                    </div>
                </div>
            </div>
            <div class="box" v-if="detail.otherRequired">
                <div class="left">其他需求：</div>
                <div class="right">
                    <p>{{detail.otherRequired}}</p>
                </div>
            </div>
            <h3 style="margin-top:48px;">联系人信息</h3>
            <div class="box">
                <div class="left">联系人：</div>
                <div class="right">
                    <p>{{detail.contactName}}</p>
                </div>
            </div>
            <div class="box">
                <div class="left">手机号码：</div>
                <div class="right">
                    <p>{{detail.contactTelephone}}</p>
                </div>
            </div>
            <div class="box">
                <div class="left">Email：</div>
                <div class="right">
                    <p>{{detail.contactMail}}</p>
                </div>
            </div>
            <h3 style="margin-top:48px;">预定须知</h3>
            <div class="boxes" v-if="detail.reconfirmed">
                <div class="left">二次确认：</div>
                <div class="right">
                    <p>{{detail.reconfirmed>0?`${detail.reconfirmed}小时内`:'立即确认'}}</p>
                </div>
            </div>
            <div class="boxes" v-if="columns.length>0">
                <div class="left">退改规则：</div>
                <div class="right">
                    <Table
                        v-if="cancelRule.length>0"
                        border
                        :columns="columns"
                        :data="cancelRule"
                        style="width:566px;"
                    ></Table>
                    <p v-else>该资源一经预订不支持退改</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import OrderStep from '~/components/play/order/OrderStep';
import { POS_TO_CLIENT, POS_TO_SERVER, RESTYPE_TO_CLIENT } from '~/assets/js/play';
import { api_order } from '~/service/api';
export default {
    components: {
        OrderStep,
    },
    props: {
        detail: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            columns: [
                {
                    title: '提前取消天数',
                    key: 'beforeBookingDate',
                    align: 'center',
                },
                {
                    title: '退款比例',
                    key: 'damagesPercent',
                    align: 'center',
                },
            ],
        };
    },
    filters: {
        orderStateText(n) {
            if (!n) return '';
            return POS_TO_CLIENT[n].label1;
        },
        reserveType(v) {
            if (!v) return '';
            return RESTYPE_TO_CLIENT[v];
        },
    },
    computed: {
        cancelRule() {
            if (!this.detail.cancelRule) return [];
            let cancelRule = this.detail.cancelRule;
            if (!cancelRule.canCancel || !cancelRule.ladders || !cancelRule.ladders.length) return [];
            return this.checkCancleNUm(cancelRule.ladders);
        },
    },
    mounted() {
    },
    methods: {
        color(n) {
            n = n ? POS_TO_CLIENT[n].value * 1 : 1;
            if (n === 4 || n === 5 || n === 7) {
                return '#999';
            } else if (n < 3) {
                return '#EC0286';
            } else {
                return '#222';
            }
        },
        tranStae(n) {
            if (!n) return 1;
            return POS_TO_CLIENT[n].value;
        },
        // 格式化退款规则
        checkCancleNUm(td) {
            let sort = td.sort((a, b) => b.beforeBookingDate - a.beforeBookingDate);
            if (td.length > 0) {
                sort = sort.map((it, i) => {
                    if (i === 0) {
                        return {
                            beforeBookingDate: '≥' + it.beforeBookingDate + '天',
                            damagesPercent: 100 - it.damagesPercent + '%',
                        };
                    }
                    if (i < sort.length) {
                        return {
                            beforeBookingDate: it.beforeBookingDate + '-' + sort[i - 1].beforeBookingDate + '天',
                            damagesPercent: 100 - it.damagesPercent + '%',
                        };
                    }
                });
                sort.push({
                    beforeBookingDate: '<' + td[td.length - 1].beforeBookingDate + '天',
                    damagesPercent: '0%',
                });
            }
            return sort;
        },
    },
};
</script>

<style scoped lang="less">
.orderState {
    background: rgba(249, 249, 249, 1);
    border: 1px solid rgba(234, 234, 234, 1);
    padding-top: 22px;
    .top {
        display: flex;
        color: #111;
        font-size: 14px;
        font-weight: bold;
        padding: 0 57px 18px;
        border-bottom: 1px dashed #dadada;
        p {
            margin-right: 230px;
            flex-shrink: 0;
        }
    }
    .bottom {
        padding: 0 57px;
        display: flex;
        align-items: center;
        .icon {
            width: 40px;
            height: 40px;
        }
        .msg {
            padding: 30px;
            p {
                font-size: 24px;
                font-weight: bold;
                color: rgba(17, 17, 17, 1);
            }
            div {
                font-size: 14px;
                font-weight: 400;
                color: rgba(119, 119, 119, 1);
                a {
                    color: #ea037c;
                }
            }
        }
    }
}
.orderStep {
    height: 200px;
    display: flex;
    align-items: center;
}
.info {
    > h3 {
        font-size: 24px;
        font-weight: bold;
        color: rgba(17, 17, 17, 1);
        padding-bottom: 36px;
    }
    .box {
        display: flex;
        padding-bottom: 10px;
        .left {
            font-size: 14px;
            color: #8e8e8e;
            width: 80px;
        }
        .right {
            p {
                font-size: 14px;
                color: #111111;
            }
        }
    }
    .boxes {
        display: flex;
        padding-bottom: 10px;
        .left {
            font-size: 14px;
            color: #111;
            width: 80px;
        }
        .right {
            p {
                font-size: 14px;
                color: #999;
            }
        }
    }
    .table {
        width: 784px;
        border-top: 1px solid rgb(245, 245, 245);
        border-left: 1px solid rgb(245, 245, 245);
        .ivu-row {
            border-bottom: 1px solid rgb(245, 245, 245);
            .ivu-col {
                border-right: 1px solid rgb(245, 245, 245);
            }
        }
        .thead .ivu-col {
            height: 48px;
            background: rgb(249, 249, 249);
            display: flex;
            justify-content: center;
            align-items: center;
            align-content: center;
            color: #999;
            font-size: 14px;
        }
        .tbody .ivu-col {
            padding: 20px 6px;
            text-align: center;
            color: #111;
            font-size: 14px;
        }
    }
}
</style>
