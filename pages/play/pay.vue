<template>
    <div class="pay">
        <div class="process">
            <OrderStep :type="'hotelOrder'" :current="{success: true,value:1}" />
        </div>
        <div class="payMethod">
            <div class="deadtime pd46">
                请在北京时间
                <span>{{payInfo.deadline}}</span>前完成支付，否则订单将自动取消
            </div>
            <p class="pd46">
                付款后将会在<span>{{payInfo.confirmTime}}小时内</span>平台将会与酒店进行预订确认并发送通知相关操作人员, 如果没有符合条件的酒店，资金将原路退回
            </p>
            <div class="title pd46">选择支付方式</div>
            <RadioGroup v-model="payment" class="method pd46">
                <Radio :label="v.value" class="met" v-for="(v,i) in availablePayment" :key="i">
                    <div
                        :class="['item',v.value]"
                    >
                        <div>{{v.label}}</div>
                    </div>
                </Radio>
            </RadioGroup>
        </div>
        <div class="bottom">
            <Button type="primary" @click="pay" :disabled="disabled">确认支付</Button>
            <div v-if="payInfo.payAmount">
                订单金额:
                <span style="font-size: 20px">&yen;&nbsp;</span>
                <span>{{payInfo.payAmount | mixin_f_formatNumber('x,xxx.xx')}}</span>
            </div>
        </div>
        <Modal
            v-model="modal"
            footer-hide
            :mask-closable="false"
            :closable="false"
            :transfer="false"
            @on-visible-change="closeModel"
        >
            <div class="box">
                <div class="code">
                    <div
                        style="font-size:36px;font-weight:500;color:#ED0287;margin-bottom:52px;"
                    >&yen;{{payInfo.payAmount | mixin_f_formatNumber('x,xxx.xx')}}</div>
                    <p style="font-size:20px;font-weight:500;color:#222;">请使用{{payment | tranPayWay}}扫描二维码完成支付</p>
                    <img
                        id="qrcode"
                        :src="qrCode"
                        style="width:258px;height:272px;margin-top:40px;margin-bottom:34px;"
                    />
                    <p style="font-size:20px;font-weight:400;color:#999;">二维码有效期还剩{{time}}分钟</p>
                    <div class="delete" @click="success">
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icondanchuang_guanbi" />
                        </svg>
                    </div>
                </div>
            </div>
        </Modal>
    </div>
</template>

<script>
import { api_play } from '~/service/api';
import OrderStep from '@/components/play/order/OrderStep';
import { mapMutations, mapState } from 'vuex';
import { payTypeDictId } from '~/assets/js/dictionary'
import QRCode from 'qrcode';
export default {
    layout(context) {
        return 'noFooter';
    },
    components: {
        OrderStep,
    },
    data() {
        return {
            payment: '',
            modal: false,
            qrCode: '',
            payNum: 0,
            time: 5, // 二维码有效时间五分钟
            disabled: false,
            id: null,
            availablePayment:[],
        };
    },
    filters: {
        tranPayWay(v) {
            if(v === 'ALIPAY_QRCODE') return '支付宝APP';
            if(v === 'WECHAT_QRCODE') return '微信APP';
            return '';
        }
    },
    created() {
        this.getAvailablePayment();
    },
    beforeDestroy() {
        this.SET_ORDER({})
    },
    computed: {
        ...mapState('play', ['payInfo']),
    },
    methods: {
        ...mapMutations('play', ['SET_ORDER']),
        createQRCode(str) {
            QRCode.toDataURL(str, { type: 'image/jpeg' })
                .then(url => {
                    this.qrCode = '';
                    this.qrCode = url;
                })
                .catch(err => {
                    this.$Message.error('生成二维码失败!');
                });
        },
        getAvailablePayment() {
            // 可用支付方式
            this.payInfo.payment.map(v => {
                this.availablePayment.push({value: v, label: payTypeDictId[v]})
            });
            if(this.availablePayment.length>0) {
                this.payment = this.availablePayment[0].value;
            }
        },
        success() {
            this.modal = false;
        },
        closeModel(flag) {
            if (!flag) {
                // 微信支付，点击X就跳转到首页
                this.modal = false;
                this.$nuxt.$router.replace('/play');
            }
        },
        timeOut() {
            // 每分钟改一下价格
            if (this.id) clearInterval(this.id);
            this.id = setInterval(() => {
                this.time--;
                if (this.time < 1) {
                    this.$nuxt.$router.replace('/play');
                }
            }, 60 * 1000);
        },
        pay() {
            let data = {
                orderId: this.payInfo.orderId * 1,
                payment: this.payment,
            };
            this.disabled = true;
            this.$axios
                .post(api_play.pay, data, { custom: { token: true } })
                .then(res => {
                    if (res.success) {
                        this.modal = true;
                        this.createQRCode(res.data.detla);
                        this.payNum = Number(res.data.totalAmout).toFixed(2);
                        this.timeOut();
                    } else {
                        this.$router.go(-1);
                    }
                })
        },
    },
};
</script>

<style scoped lang="less">
@deep: ~'>>>';
.pay {
    max-width: 1880px;
    .process {
        background-color: #fff;
        height: 160px;
        border-radius: 6px;
        display: flex;
        align-items: center;
        margin: 20px 20px 0;
        @{deep}.hisSteps {
            .step {
                width: 204px;
                div::after {
                    width: 153px;
                }
            }
        }
    }
    .payMethod {
        border-radius: 6px 6px 0 0;
        margin: 12px 20px 0;
        padding-top: 41px;
        padding-bottom: 78px;
        background-color: #fff;
        color: #111;
        box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.03);
        .pd46 {
            padding-left: 46px;
            padding-right: 46px;
        }
        .deadtime {
            font-size: 20px;
            font-weight: bold;
            padding-bottom: 10px;
            span {
                color: #e9047b;
            }
        }
        > p {
            font-size: 16px;
            color: rgba(108, 108, 108, 1);
            line-height: 24px;
            padding-bottom: 44px;
            border-bottom: 1px dotted rgba(245, 243, 245, 1);
            span {
                color: #e9047b;
            }
        }
        .title {
            font-size: 18px;
            padding-top: 46px;
            padding-bottom: 14px;
        }
    }
    .bottom {
        height: 90px;
        padding: 0 50px;
        background: rgba(249, 249, 249, 1);
        box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.03);
        border-radius: 0 0 6px 6px;
        display: flex;
        align-items: center;
        margin: 0 20px;
        button {
            width: 230px;
            height: 48px;
            font-size: 16px;
        }
        div {
            padding-left: 10px;
            font-size: 16px;
            display: flex;
            align-items: center;
            span {
                color: #e9047b;
                font-family: OswaldMedium;
                font-weight: bold;
            }
            span:last-child {
                font-size: 28px;
                display: block;
                margin-top: -6px;
            }
        }
    }
    .orderInfo {
        padding: 17px 50px;
        background-color: #fff;
        margin: 12px 20px 0;
        color: #111;
        > h3 {
            font-size: 24px;
            line-height: 90px;
        }
        > p {
            font-size: 14px;
            color: #8e8e8e;
            span {
                color: #111;
            }
        }
        .table {
            max-width: 1323px;
            border-top: 1px solid #f2f2f2;
            border-left: 1px solid #f2f2f2;
            margin: 24px 0;
            .thead {
                background-color: #f9f9f9;
                color: #999999;
                .ivu-col {
                    height: 48px;
                    padding: 6px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    align-content: center;
                    border-right: 1px solid #f2f2f2;
                    border-bottom: 1px solid #f2f2f2;
                }
            }
            .tbody {
                .ivu-col {
                    height: 92px;
                    padding: 6px;
                    background-color: #fff;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    align-content: center;
                    border-right: 1px solid #f2f2f2;
                    border-bottom: 1px solid #f2f2f2;
                }
            }
        }
    }
    @{deep}.method.ivu-radio-group {
        display: flex;
        .ivu-radio-wrapper {
            margin-right: 142px;
        }
    }
    @{deep}.met.ivu-radio-wrapper {
        display: flex;
        align-items: center;
        margin-bottom: 38px;
        .item {
            width: 210px;
            height: 60px;
            margin-left: 12px;
            padding-left: 70px;
            border: 1px solid rgba(234, 234, 234, 1);
            background-position: 15px center;
            background-repeat: no-repeat;
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: center;
            div {
                color: #111;
                font-size: 16px;
            }
            p {
                font-size: 12px;
                color: #6c6c6c;
            }
        }
        .sx {
            background-image: url('~assets/icon/icon_sx_def.png');
        }
        .ALIPAY_QRCODE {
            background-image: url('~assets/icon/icon_zfb_def.png');
        }
        .WECHAT_QRCODE {
            background-image: url('~assets/icon/icon_wx_def.png');
        }
    }
    @{deep}.met.ivu-radio-wrapper-checked {
        .item {
            border: 2px solid #e9047b;
            background-color: rgba(255, 250, 233, 1);
        }
        .item::after {
            content: '';
            display: block;
            width: 24px;
            height: 24px;
            background: url('~assets/public_img/img_pay_met.png') no-repeat center;
            position: absolute;
            bottom: 0;
            right: 0;
        }
    }
}
@{deep}.ivu-modal{
    width: 680px !important;
    height: 620px !important;
    .ivu-modal-content {
        .ivu-modal-body{
            padding: 0;
        }
    }
}
.box {
    display: flex;
    justify-content: center;
    align-items: center;
}
.code {
    width: 680px;
    height: 620px;
    background-image: linear-gradient(180deg, #ed0287 0, #ed0287 6px, #fff 6px, #fff 100%);
    box-shadow: 0px -4px 16px 0px rgba(0, 0, 0, 0.3);
    border-radius: 2px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 20px;
    position: relative;
    .delete {
        position: absolute;
        width: 32px;
        height: 32px;
        top: -10px;
        right: -40px;
        svg {
            width: 32px;
            height: 32px;
        }
    }
}
</style>
