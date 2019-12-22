<template>
    <div>
        <div class="orderInfo">
            <div class="orderMessage">
                <div class="head">
                    <div>订单号：{{orderData.orderNo}}</div>
                    <div style="margin-right:94px">
                        订单状态：
                        <span>{{statusI}}</span>
                    </div>
                </div>
                <div class="text">
                    <i class="iconfont iconquxiaodingdan"></i>
                    <span>
                        <div>
                            {{
                            orderStatus==='CANCELING'?'订单取消中，请耐心等待':' 订单已取消，应退款项会在3个工作日内退回原账户'
                            }}
                        </div>
                        <p style="margin-top:16px">
                            根据退款规则，应退金额：
                            <span
                                style="color:#ED0287;font-size:14px;font-weight:bold;width:80px; "
                            >¥{{orderData.refundAmount?orderData.refundAmount:'暂无数据'}}</span>
                        </p>
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { BusOrderStateToCilent } from '~/assets/js/bus';
export default {
    props: ['orderData', 'orderStatus'],
    data() {
        return {
            statusI: '',
        };
    },
    created() {
        this.statusI = BusOrderStateToCilent[this.orderStatus];
    },
};
</script>


<style lang="less" scoped>
.orderInfo {
    padding: 35px 51px;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(237, 237, 237, 1);
    box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.03);
    border-radius: 6px;
    margin-bottom: 12px;
    .orderMessage {
        margin: 0 auto;
        height: 220px;
        background: rgba(250, 250, 250, 1);
        border: 1px solid rgba(237, 237, 237, 1);
        .head {
            padding: 18px 57px;
            font-weight: bold;
            color: #0f0f0f;
            border-bottom: 1px dashed #ededed;
            overflow: auto;
            padding-bottom: 20px;
            div {
                float: left;
                margin-right: 285px;
                span {
                    color: #ed0287;
                }
            }
        }
        .text {
            padding: 25px 57px 32px;
            i {
                font-size: 50px;
                margin-right: 33px;
                &::before {
                    vertical-align: top;
                }
            }
            span {
                display: inline-block;
                width: 685px;
                color: #828282;
                div {
                    color: #0f0f0f;
                    font-size: 24px;
                    font-weight: bold;
                    margin-top: 6px;
                }
            }
            .uploadBtn {
                button {
                    margin-left: 95px;
                    margin-top: -80px;
                    color: #fff;
                    background: #ed0287;
                    width: 140px;
                    border: 1px solid rgba(237, 2, 135, 1);
                    border-radius: 0;
                    text-align: center;
                    font-size: 14px;
                    line-height: 16px;
                    height: 32px;
                }
            }
        }
    }
}
</style>