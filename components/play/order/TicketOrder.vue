<template>
    <div class="his_oder">
        <div class="left">
            <div class="process">
                <OrderStep :type="'playOrder'" :current="{success: true,value:0}" />
            </div>
            <Form ref="form" :model="form" :rules="rules">
                <div class="module formItem">
                    <h3>预订信息</h3>
                    <ul>
                        <li>
                            <div class="label">
                                <span>预定类型：</span>
                            </div>
                            <div class="item">
                                <p>门票（{{orderInfo.documentType | ticketType}}）</p>
                            </div>
                        </li>
                        <li>
                            <div class="label">
                                <span>使用日期：</span>
                            </div>
                            <div class="item twoTime">
                                <PriceCalendar
                                    :params.sync="priceCalendar"
                                    v-if="priceCalendar"
                                    :bookingDate.sync="form.bookingDate"
                                    :price.sync="preOptions"
                                    :type="'2'"
                                    prop="bookingDate"
                                    @changeDate="changeDate"
                                    placeholder="请选择使用日期"
                                />
                                <FormItem
                                    prop="useTime"
                                    v-if="orderPre.chooseTime"
                                    :rules="{ required: true, message: '请选择到店时间', trigger: 'blur' }"
                                >
                                    <Select
                                        class="his"
                                        placeholder="选择到店时间"
                                        v-model="form.useTime"
                                        :disabled="!form.bookingDate"
                                        @on-change="changeUseTime"
                                    >
                                        <Option
                                            v-for="item in arrivalTimes"
                                            :value="item"
                                            :key="item"
                                        >{{ item }}</Option>
                                    </Select>
                                </FormItem>
                            </div>
                        </li>
                        <li>
                            <div class="label">
                                <span>预定选择：</span>
                            </div>
                            <div class="item">
                                <Table class="tables" border :columns="columns" :data="preOptions"></Table>
                            </div>
                        </li>
                        <li>
                            <div class="label">
                                <span>支付方式：</span>
                            </div>
                            <div class="item payMethod">
                                <FormItem prop="payType">
                                    <RadioGroup v-model="form.payType" @on-change="changePayType">
                                        <Radio
                                            class="met"
                                            label="ADVANCE"
                                            :disabled="preOptions[0].prepayPrice*1<=0"
                                        >
                                            <p>
                                                预付&nbsp;
                                                <span>&yen;{{preOptions[0].prepayPrice}}</span>/人
                                            </p>
                                        </Radio>
                                        <Radio
                                            class="met"
                                            label="SPOT"
                                            v-if="preOptions[0].paymentPrice*1>0"
                                        >
                                            <p>
                                                现付&nbsp;
                                                <span>&yen;{{preOptions[0].paymentPrice}}</span>/人
                                            </p>
                                        </Radio>
                                    </RadioGroup>
                                </FormItem>
                            </div>
                        </li>
                        <li style="margin-left: -6px;">
                            <div class="label required">
                                <span>预定数量：</span>
                            </div>
                            <div class="item inputs">
                                <FormItem>
                                    <InputNumber
                                        v-model="form.bookingNum"
                                        placeholder="请输入数字"
                                        :formatter="value => value===0?'':value"
                                        @on-blur="hadleBlur('bookingNum')"
                                        @on-change="changeBookingNum"
                                    ></InputNumber>
                                    <p>人</p>
                                    <div>
                                        <span
                                            v-if="orderInfo.minimumOrderQuantity"
                                        >{{orderInfo.minimumOrderQuantity}}人起订</span>
                                        <span
                                            v-if="orderInfo.maximumOrderQuantity"
                                        >最多{{orderInfo.maximumOrderQuantity}}人</span>
                                    </div>
                                </FormItem>
                            </div>
                        </li>
                        <li>
                            <div class="label">
                                <span>贵司团号：</span>
                            </div>
                            <div class="item">
                                <FormItem prop="groupNo">
                                    <Input
                                        class="his large"
                                        v-model="form.groupNo"
                                        placeholder="请输入团号"
                                    />
                                </FormItem>
                            </div>
                        </li>
                        <li style="margin-left:-20px;">
                            <div class="label required">
                                <span>联系人姓名：</span>
                            </div>
                            <div class="item">
                                <FormItem prop="contactName">
                                    <Input
                                        class="his large"
                                        v-model="form.contactName"
                                        placeholder="请输入联系人姓名"
                                    />
                                </FormItem>
                            </div>
                        </li>
                        <li>
                            <div class="label required">
                                &nbsp;
                                <span>手机号：</span>
                            </div>
                            <div class="item">
                                <PhoneAndPrexfix
                                    prop="contactTelephone"
                                    placeholder="请输入联系人电话"
                                    :phone.sync="form.contactTelephone"
                                    :prex.sync="form.contactTelPrefix"
                                    @changePrex="changePrex"
                                />
                            </div>
                        </li>
                        <li>
                            <div class="label required">
                                &emsp;&nbsp;
                                <span>邮箱：</span>
                            </div>
                            <div class="item">
                                <FormItem prop="contactMail">
                                    <Input
                                        class="his large"
                                        v-model="form.contactMail"
                                        placeholder="请输入邮箱"
                                    />
                                </FormItem>
                            </div>
                        </li>
                        <li v-if="orderInfo.documentType!=='E_TICKET'" style="margin-left:-8px;">
                            <div class="label required">
                                <span v-if="orderInfo.documentType==='POSTAL_TICKET'">邮寄地址：</span>
                                <span v-if="orderInfo.documentType==='PAPER_TICKET'">送票地址：</span>
                            </div>
                            <div class="item">
                                <FormItem
                                    prop="contactAddr"
                                    :rules="{ required: true, pattern: pattern.contactAddr, message: '请输入60位以内字符', trigger: 'blur' }"
                                >
                                    <Input
                                        class="his large"
                                        v-model="form.contactAddr"
                                        :placeholder="orderInfo.documentType==='PAPER_TICKET'?'请输入您的酒店地址，我们将为您送票':'请输入您国内的门票收货地址'"
                                    />
                                </FormItem>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="module notice">
                    <h3>预定须知</h3>
                    <div class="box" v-if="orderInfo.confirmTime">
                        <div class="left">二次确认时间：</div>
                        <div
                            class="right"
                        >{{orderInfo.confirmTime>0?`${orderInfo.confirmTime}小时内`:'立即确认'}}</div>
                    </div>
                    <div class="tuigai" v-if="cancelable()">
                        <div class="left">退改规则：</div>
                        <Table border :columns="columns4" :data="cancelRule" style="width:566px;"></Table>
                    </div>
                    <div class="tuigai" style="display:flex;" v-if="!cancelable()">
                        <div class="left">退改规则：</div>
                        <div class="right">该资源一经预订不支持退改</div>
                    </div>
                </div>
                <div class="bottom">
                    <Checkbox class="his" v-model="agreement">
                        <span class="agreement">
                            我已阅读并同意
                            <nuxt-link to="/clause">服务条款</nuxt-link>和
                            <nuxt-link to="/privacy">隐私政策</nuxt-link>
                        </span>
                    </Checkbox>
                    <div class="submit">
                        <p>
                            应付总价:
                            <span>&yen;</span>
                            <span>{{totalAmount | mixin_f_formatNumber}}</span>
                        </p>&emsp;&emsp;
                        <Button type="primary" @click="submitForm">提交订单</Button>
                    </div>
                </div>
            </Form>
        </div>
        <div class="right">
            <TicketOrderRight :detail="rightInfo" />
        </div>
    </div>
</template>

<script>
import OrderStep from '~/components/play/order/OrderStep';
import PhoneAndPrexfix from '~/components/PhoneAndPrexfix';
import { api_order, api_play } from '~/service/api';
import PriceCalendar from '~/components/play/PriceCalendar';
import TicketOrderRight from '~/components/personal/orderDetail/TicketOrderRight';
import { mapState, mapMutations } from 'vuex';
import { TICKET_TO_CLIENT } from '~/assets/js/play';
import REG from '~/assets/js/pattern';
import { BookingError } from '~/assets/js/play/index';
export default {
    components: {
        OrderStep,
        PhoneAndPrexfix,
        PriceCalendar,
        TicketOrderRight,
    },
    data() {
        return {
            pattern: REG,
            // 传给右侧
            rightInfo: {},
            // 上页传过来的商品信息
            orderInfo: {},
            // 上页传过来的产品sku等信息
            orderPre: {},
            agreement: true,
            priceCalendar: null,
            arrivalTimes: [],
            totalAmount: 0,
            form: {
                payType: '',
                bookingDate: '',
                useTime: '',
                bookingNum: 0,
                groupNo: '',
                contactName: '',
                contactTelephone: '',
                contactTelPrefix: '',
                contactMail: '',
                contactAddr: '',
            },
            // 现付预付价格，需要初始化
            preOptions: [],
            rules: {
                contactTelephone: [
                    { required: true, message: '请输入联系人手机号码', trigger: 'blur' },
                    { pattern: REG.phone, message: '手机号码格式错误', trigger: 'blur' },
                ],
                payType: [{ required: true, message: '请选择支付方式', trigger: 'blur' }],
                bookingDate: [{ required: true, message: '请选择到店日期', trigger: 'blur' }],
                contactName: [
                    { required: true, message: '请输入联系人姓名', trigger: 'blur' },
                    {required: true,pattern: REG.contactName,message: '请输入20位以下的中文或英文字符',trigger: 'blur',},
                ],
                bookingNum: [{ required: true, type: 'number', message: '请输入联系人姓名', trigger: 'blur' }],
                contactMail: [{ required: true, message: '请输入正确格式的邮箱', type: 'email', trigger: 'blur' }],
                groupNo: [{ pattern: REG.groupNo, message: '请输入20位以内以数字或字母组成的字符', trigger: 'blur' }],
            },
            columns: [],
            columns2: [
                {
                    title: '类型',
                    key: 'type',
                    align: 'center',
                    width: 140,
                },
                {
                    title: '名称',
                    key: 'name',
                    align: 'center',
                    width: 320,
                },
                {
                    title: '预计确认时间',
                    width: 140,
                    align: 'center',
                    render: (h, { row }) => {
                        return (
                            <div>
                                {(row.confirmTime && row.confirmTime) > 0 ? `${row.confirmTime}小时内` : '立即确认'}
                            </div>
                        );
                    },
                },
                {
                    title: '可订时间',
                    key: 'availableDate',
                    align: 'center',
                    width: 140,
                },
                {
                    title: '预付价格',
                    align: 'center',
                    width: 140,
                    render: (h, { row }) => {
                        return (
                            <div style="color:#EA037C;">
                                &yen;{this.mixin_m_formatNumber(row.prepayPrice, 'x,xxx.xx')}/人
                            </div>
                        );
                    },
                },
                {
                    title: '现付价格',
                    align: 'center',
                    width: 140,
                    render: (h, { row }) => {
                        return <div>&yen;{this.mixin_m_formatNumber(row.paymentPrice, 'x,xxx.xx')}/人</div>;
                    },
                },
            ],
            columns3: [
                {
                    title: '类型',
                    key: 'type',
                    align: 'center',
                    width: 140,
                },
                {
                    title: '名称',
                    key: 'name',
                    align: 'center',
                    width: 320,
                },
                {
                    title: '预计确认时间',
                    width: 140,
                    align: 'center',
                    render: (h, { row }) => {
                        return (
                            <div>
                                {(row.confirmTime && row.confirmTime) > 0 ? `${row.confirmTime}小时内` : '立即确认'}
                            </div>
                        );
                    },
                },
                {
                    title: '可订时间',
                    key: 'availableDate',
                    align: 'center',
                    width: 140,
                },
                {
                    title: '预付价格',
                    align: 'center',
                    width: 140,
                    render: (h, { row }) => {
                        return (
                            <div style="color:#EA037C;">
                                &yen;{this.mixin_m_formatNumber(row.prepayPrice, 'x,xxx.xx')}/人
                            </div>
                        );
                    },
                },
            ],
            columns4: [
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
    computed: {
        ...mapState('play', ['npp']),
        cancelRule() {
            if (!this.orderInfo.cancelPolicy || this.orderInfo.cancelPolicy.length === 0) return [];
            return this.checkCancleNUm(this.orderInfo.cancelPolicy);
        },
    },
    created() {
        // 回填上次提交的联系人信息
        (this.form.contactName = this.npp.contactName),
            (this.form.contactTelPrefix = this.npp.contactTelPrefix),
            (this.form.contactTelephone = this.npp.contactTelephone),
            this.getOrderInfo();
    },
    filters: {
        ticketType(v) {
            if (!v) return '';
            return TICKET_TO_CLIENT[v];
        },
    },
    methods: {
        ...mapMutations('play', ['SET_ORDER', 'SET_NPP']),
        changePrex(prex) {
            if(prex === '86') {
                this.rules.contactTelephone[1].pattern = REG.phone
            } else {
                this.rules.contactTelephone[1].pattern = REG.otherPhone
            }
            // 可能会存在初始化时this.$refs.form还不存在
            if(this.form.contactTelephone && this.$refs.form) this.$refs.form.validateField('contactTelephone');
        },
        cancelable() {
            // 是否显示取消政策
            if (this.orderInfo.cancelPolicy && this.orderInfo.cancelable && this.cancelRule.length > 0) return true;
            return false;
        },
        placeholder(type) {
            // 邮寄、纸质票有不同placeholder
            if (type === '2') return '请输入您国内的门票收货地址';
            return '请输入您的酒店地址，我们将为您送票';
        },
        changeDate(obj, str) {
            this.form.bookingDate = str;
            this.form.useTime = '';
            this.arrivalTimes = this.orderPre.chooseTimePeriod.split(',');
            this.preOptions = [{ ...this.preOptions[0], paymentPrice: obj.paymentPrice, prepayPrice: obj.prepayPrice }];
            if(this.preOptions[0].paymentPrice>0) {
                this.columns = this.columns2;
            } else {
                this.columns = this.columns3;
            }
            this.rightInfo.availableDate = str;
            if(this.form.payType === 'ADVANCE') {
                this.rightInfo.unitPrice = obj.prepayPrice;
            } else if(this.form.payType === 'ADVANCE') {
                this.rightInfo.unitPrice = obj.paymentPrice;
            }
            this.totalPrice();
            this.$refs.form.validateField('bookingDate');
        },
        hadleBlur(key) {
            let min = 1;
            if (this.orderInfo.minimumOrderQuantity) {
                min = this.orderInfo.minimumOrderQuantity * 1;
            }
            if (this.form.bookingNum < min) {
                this.form[key] = min;
            }
            if (this.orderInfo.maximumOrderQuantity && this.form[key] > this.orderInfo.maximumOrderQuantity) {
                this.$Message.error('超过限定数量');
                this.form[key] = this.orderInfo.maximumOrderQuantity * 1;
            }
            this.totalPrice();
        },
        getOrderInfo() {
            let all = this.mixin_m_SStorage('get', 'play_orderInfo');
            if (!all) this.$router.go(-1);
            this.orderInfo = all.info;
            this.orderPre = all.pre;
            this.form.bookingNum = all.info.minimumOrderQuantity ? all.info.minimumOrderQuantity * 1 : 0;
            let date = new Date(this.orderInfo.availableDate);
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            this.priceCalendar = {
                cityId: this.orderPre.cityId * 1,
                month,
                resourceId: this.orderPre.resourceId * 1,
                skuId: this.orderPre.skuId * 1,
                year,
            };
            let { type, name, confirmTime, availableDate, resourceAddr } = {
                ...this.orderInfo,
            };
            this.preOptions[0] = {
                type,
                name,
                confirmTime,
                availableDate,
                paymentPrice: null,
                prepayPrice: null,
            };
            if(this.preOptions[0].paymentPrice) {
                this.columns = this.columns2;
            } else {
                this.columns = this.columns3;
            }
            this.rightInfo = all.rightInfo;
            this.totalPrice();
        },
        // 提交订单
        submitForm() {
            // 门票特色有可能有最大最小预定数量
            if (!this.agreement) {
                return this.$Message.error('请阅读并同意服务条款和隐私政策');
            }
            this.$refs.form.validate(res => {
                if (res) {
                    if (
                        this.orderInfo.maximumOrderQuantity &&
                        this.form.bookingNum > this.orderInfo.maximumOrderQuantity
                    ) {
                        return this.$Message.error('超过限定数量');
                    }
                    let data = {
                        ...this.form,
                        cancelPolicy: this.orderPre.resourceCancelPolicyVO,
                        cityId: this.orderPre.cityId * 1,
                        skuId: this.orderPre.skuId * 1,
                        resourceId: this.orderInfo.resourceId * 1,
                        totalAmount: this.totalAmount,
                        resourceType: 'TICKETS',
                    };
                    this.$axios.post(api_play.bokingOther, data, { custom: { token: true } }).then(res => {
                        if (res.success) {
                            this.SET_NPP({
                                contactName: this.form.contactName,
                                contactTelephone: this.form.contactTelephone,
                                contactTelPrefix: this.form.contactTelPrefix,
                            });
                            if (this.form.payType === 'ADVANCE') {
                                this.SET_ORDER(res.data);
                                this.$nuxt.$router.push('/play/pay');
                            } else if (this.form.payType === 'SPOT') {
                                this.$nuxt.$router.push({
                                    name: 'personal_center-orderDetail-ticket',
                                    query: { id: res.data.orderId * 1 },
                                });
                            }
                        } else {
                            if (BookingError.find(v => v.value == res.code)) {
                                this.$router.go(-1);
                            }
                        }
                    });
                }
            });
        },
        changePayType(v) {
            this.rightInfo.payType = v;
            if(this.form.bookingDate) {
                this.totalPrice();
                this.rightInfo.unitPrice =
                    this.form.payType === 'ADVANCE'
                    ? this.preOptions[0].prepayPrice * 1
                    : this.preOptions[0].paymentPrice * 1;
            }
        },
        changeBookingNum(n) {
            let i = n ? n : 0;
            this.totalPrice();
            this.rightInfo.bookingNum = i;
        },
        // 计算总价
        totalPrice() {
            if(this.form.bookingDate && this.form.payType) {
                let unitPrice =
                this.form.payType === 'ADVANCE'
                        ? this.preOptions[0].prepayPrice * 1
                        : this.preOptions[0].paymentPrice * 1;
                this.totalAmount = unitPrice * this.form.bookingNum;
                this.rightInfo.price = this.totalAmount;
            }
        },
        changeUseTime(str) {
            // this.$refs.form.validateField('useTime', res =>{
            //     if(res.length === 0){}
            // })
            // 先触发报错后再选择依然报错
            this.$refs.form.validateField('useTime');
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
@deep: ~'>>>';
.process {
    height: 160px;
    background: rgb(255, 255, 255);
    border: 1px solid rgb(234, 234, 234);
    box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.03);
    border-radius: 6px;
    margin: 20px 0 12px;
    padding-top: 42px;
}
.ivu-form {
    background: rgb(255, 255, 255);
    border: 1px solid rgb(234, 234, 234);
    box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.03);
    border-radius: 6px;
    padding-top: 40px;
    .module {
        padding: 0 46px;
        > h3 {
            font-size: 24px;
            color: #111;
            font-weight: bold;
            padding-bottom: 12px;
        }
    }
    .notice {
        margin-bottom: 40px;
        max-width: 566px;
        > h3 {
            margin-bottom: 32px;
        }
        .box {
            margin-bottom: 34px;
            font-size: 14px;
            display: flex;
            .left {
                color: #111;
                flex-shrink: 0;
            }
            .right {
                color: #6c6c6c;
            }
        }
        .tuigai {
            margin-bottom: 34px;
            .left {
                color: #111;
                flex-shrink: 0;
                margin-bottom: 30px;
                font-size: 14px;
            }
            .right {
                color: #6c6c6c;
                font-size: 14px;
            }
        }
    }
    .formItem {
        > ul > li {
            padding-bottom: 20px;
            font-size: 14px;
            display: flex;
            .label {
                color: #8e8e8e;
                height: 40px;
                line-height: 40px;
                position: relative;
                span {
                    white-space: nowrap;
                    text-align: right;
                }
            }
            .label.required {
                & > span {
                    display: inline-block;
                    position: relative;
                    padding-left: 8px;
                    &::before {
                        content: '*';
                        display: inline-block;
                        color: #ea037c;
                        position: absolute;
                        left: 0;
                        top: 3px;
                    }
                }
            }
            .item {
                min-width: 600px;
                > p {
                    color: #111;
                    font-weight: bold;
                    line-height: 40px;
                }
            }
            .textarea {
                position: relative;
                .length {
                    position: absolute;
                    bottom: -6px;
                    left: 306px;
                    color: #acacac;
                }
            }
            .payMethod {
                .ivu-form-item {
                    margin-bottom: 0px;
                    margin-top: 6px;
                }
            }
            .twoTime {
                display: flex;
                @{deep}.ivu-select {
                    width: 220px;
                    padding-left: 20px;
                    .ivu-select-selection {
                        height: 40px;
                        .ivu-select-placeholder {
                            height: 40px;
                            line-height: 40px;
                        }
                    }
                }
                .useTime @{deep}.ivu-form-item-error-tip {
                    left: 20px !important;
                }
            }
            @{deep}.margin130 {
                .ivu-form-item-error-tip {
                    margin-left: 130px;
                }
            }
            @{deep}.inputs {
                .ivu-form-item-content {
                    height: 40px;
                    display: flex;
                    align-items: center;
                    > p {
                        font-size: 14px;
                        font-weight: bold;
                        color: #111;
                    }
                    > p:first-of-type {
                        margin-right: 14px;
                    }
                    > p:last-of-type {
                        margin: 0 14px;
                    }
                    > div:last-of-type {
                        color: #a3a3a3;
                        font-size: 12px;
                    }
                }
                .ivu-input-number {
                    width: 230px;
                    height: 40px;
                    border: 1px solid rgb(223, 223, 223);
                    border-radius: 2px;
                    .ivu-input-number-handler-wrap {
                        display: none;
                    }
                    .ivu-input-number-input {
                        height: 40px;
                    }
                }
                .ivu-input-number-focused {
                    box-shadow: none;
                }
            }
            .ivu-radio-group {
                display: flex;
            }
            .met.ivu-radio-wrapper {
                display: flex;
                align-items: center;
            }
            @{deep}.ivu-input-wrapper.large {
                width: 340px;
                height: 40px;
                border-radius: 2px;
                .ivu-input {
                    width: 340px;
                    height: 40px;
                    border: 1px solid rgb(223, 223, 223);
                }
            }
            .otherRequired {
                height: 90px;
                width: 340px;
                border-radius: 2px;
                @{deep}.ivu-input {
                    height: 90px;
                    width: 340px;
                    resize: none;
                    border-radius: 2px;
                    &:hover {
                        border-color: #dfdfdf;
                    }
                    &:focus {
                        box-shadow: none;
                    }
                }
            }
        }
    }
    // .tables{
    //     @{deep}.ivu-table{
    //         table{
    //             width: 144px*3+444px!important;
    //         }
    //         th{
    //             width: 144px;
    //         }
    //         th:nth-child(2){
    //             width: 444px;
    //         }
    //     }
    // }
}
.bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 96px;
    padding: 0 48px 0 30px;
    background: rgb(249, 249, 249);
    .agreement {
        font-size: 14px;
        color: #111;
        font-weight: 500;
        a {
            color: #ea037c;
            font-size: 14px;
            font-weight: 500;
        }
    }
    .submit {
        display: flex;
        align-items: center;
        p {
            font-size: 14px;
            color: #111;
            span {
                color: #ea037c;
                font-family: OswaldMedium;
                font-weight: bold;
            }
            span:first-child {
                font-size: 18px;
            }
            span:last-child {
                font-size: 28px;
            }
        }
        @{deep}.ivu-btn-primary {
            width: 230px;
            height: 48px;
            border-radius: 6px;
            span {
                font-size: 16px;
                font-weight: 400;
                color: #fff;
            }
        }
    }
}
</style>
