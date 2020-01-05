// 团餐计价规则：预定总人数可能会有最低、最高限制，限制成人数量+付费司导数量和必须≤最高和≥最低（儿童人数不收限制数量限制），儿童优惠人数最多4人，优惠的按优惠比率计价。
// 套餐和代订座价格按预订数量和单价计算总和
<template>
    <div class="his_oder">
        <div class="left">
            <div class="process">
                <OrderStep :type="'playOrder'"
                           :current="{success: true,value:0}" />
            </div>
            <Form ref="form"
                  :model="form"
                  :rules="rules">
                <div class="module formItem">
                    <h3>预订信息</h3>
                    <ul>
                        <li>
                            <div class="label">
                                <span>预定类型：</span>
                            </div>
                            <div class="item">
                                <p>餐厅（{{orderInfo.reserveType | getReserveType}}）</p>
                            </div>
                        </li>
                        <li>
                            <div class="label">
                                <span>到店时间：</span>
                            </div>
                            <div class="item twoTime">
                                <PriceCalendar :params.sync="priceCalendar"
                                               v-if="priceCalendar"
                                               :bookingDate.sync="form.bookingDate"
                                               :price.sync="preOptions"
                                               prop="bookingDate"
                                               :disWeek="disWeek"
                                               placeholder="请选择使用日期"
                                               @changeDate="changeDate" />
                                <FormItem prop="useTime"
                                          class="useTime"
                                          style="margin-left:20px;">
                                    <Select class="his"
                                            placeholder="选择到店时间"
                                            v-model="form.useTime"
                                            :disabled="!form.bookingDate"
                                            @on-change="changeUseTime">
                                        <Option v-for="item in arrivalTimes"
                                                :value="item"
                                                :key="item">{{ item }}</Option>
                                    </Select>
                                </FormItem>
                            </div>
                        </li>
                        <li>
                            <div class="label">
                                <span>预定选择：</span>
                            </div>
                            <div class="item">
                                <Table class="tables"
                                       border
                                       :columns="columns"
                                       :data="preOptions"></Table>
                            </div>
                        </li>
                        <li>
                            <div class="label">
                                <span>支付方式：</span>
                            </div>
                            <div class="item payMethod">
                                <FormItem prop="payType">
                                    <RadioGroup v-model="form.payType"
                                                @on-change="changePayType">
                                        <Radio class="met"
                                               label="ADVANCE"
                                               :disabled="preOptions[0].prepayPrice*1<=0">
                                            <p style="font-size: 14px;">
                                                预付&nbsp;
                                                <span>&yen;{{preOptions[0].prepayPrice}}</span>/人
                                            </p>
                                        </Radio>
                                        <Radio class="met"
                                               label="SPOT"
                                               v-if="orderInfo.reserveType!=='SUBSTITUTION_SEATS'&&preOptions[0].paymentPrice*1>0">
                                            <p style="font-size: 14px;">
                                                现付&nbsp;
                                                <span>&yen;{{preOptions[0].paymentPrice}}</span>/人
                                            </p>
                                        </Radio>
                                    </RadioGroup>
                                </FormItem>
                            </div>
                        </li>
                        <li>
                            <div class="label required">
                                <span>预定数量：</span>
                            </div>
                            <div :class="['item','inputs',{'margin130':orderInfo.reserveType==='TEAM_MEAL'}]"
                                 v-if="orderInfo.reserveType==='TEAM_MEAL'">
                                <FormItem prop="adultNum"
                                          :rules="{required: true, min: 1, type: 'number', message: '成人游客数量必填', trigger: 'blur'}">
                                    <p>&emsp;&emsp;&emsp;&emsp;成人游客</p>
                                    <InputNumber v-model="form.adultNum"
                                                 placeholder="请输入数字"
                                                 :formatter="value => value===0?'':value"
                                                 @on-blur="hadleBlur('adultNum')"
                                                 @on-change="changeAdultNum"></InputNumber>
                                    <p>人</p>
                                    <div>
                                        <span>成人+非免费司导总数</span><span v-if="orderInfo.minQuantity">最少{{orderInfo.minQuantity}}人，</span><span v-if="orderInfo.maxQuantity">最多{{orderInfo.maxQuantity}}人</span>
                                    </div>
                                </FormItem>
                                <FormItem>
                                    <p>&emsp;&emsp;&emsp;&emsp;儿童游客</p>
                                    <InputNumber :min="0"
                                                 v-model="form.childNum"
                                                 placeholder="请输入数字"
                                                 :formatter="value => value===0?'':value"
                                                 @on-blur="hadleBlur('childNum')"
                                                 @on-change="changeChildtNum"></InputNumber>
                                    <p>人</p>
                                    <div v-if="orderInfo.childSalePolicy&&orderInfo.childSalePolicy.preferential">
                                        {{orderInfo.childSalePolicy.minChildAge}}-{{orderInfo.childSalePolicy.maxChildAge}}岁，收取成人价的{{orderInfo.childSalePolicy.discountPercent}}%，最多优惠4人
                                    </div>
                                    <div v-else>儿童与成人同价</div>
                                </FormItem>
                                <FormItem>
                                    <p>&emsp;&emsp;&emsp;&emsp;司导人数</p>
                                    <InputNumber :min="0"
                                                 v-model="form.directorNum"
                                                 placeholder="请输入数字"
                                                 :formatter="value => value===0?'':value"
                                                 @on-blur="hadleBlur('directorNum')"
                                                 @on-change="changeDirectorNum"></InputNumber>
                                    <p>人</p>
                                    <div v-if="orderInfo.driverGuideSalePolicy&&orderInfo.driverGuideSalePolicy.preferential">每满{{orderInfo.driverGuideSalePolicy.eachFullNum}}个成人可免{{orderInfo.driverGuideSalePolicy.minusNum}}个司导</div>
                                </FormItem>
                            </div>
                            <div class="item inputs"
                                 v-if="orderInfo.reserveType!=='TEAM_MEAL'">
                                <FormItem prop="quantity"
                                          :rules="{required: true, type: 'number', message: '预定数量必填', trigger: 'blur'}">
                                    <InputNumber :min="1"
                                                 v-model="form.quantity"
                                                 placeholder="请输入预定数量"
                                                 @on-blur="hadleBlur('quantity')"
                                                 @on-change="changeQuanity"></InputNumber>
                                </FormItem>
                            </div>
                        </li>
                        <li v-if="orderInfo.reserveType==='TEAM_MEAL'">
                            <div class="label">
                                <span>贵司团号：</span>
                            </div>
                            <div class="item">
                                <FormItem prop="groupNo">
                                    <Input class="his large"
                                           v-model="form.groupNo"
                                           placeholder="请输入团号" />
                                </FormItem>
                            </div>
                        </li>
                        <li style="margin-left:-20px;">
                            <div class="label required">
                                <span>联系人姓名：</span>
                            </div>
                            <div class="item">
                                <FormItem prop="contactName">
                                    <Input class="his large"
                                           v-model="form.contactName"
                                           placeholder="请输入联系人姓名" />
                                </FormItem>
                            </div>
                        </li>
                        <li>
                            <div class="label required">
                                &nbsp;
                                <span>手机号：</span>
                            </div>
                            <div class="item">
                                <PhoneAndPrexfix prop="contactTelephone"
                                                 placeholder="请输入联系人电话"
                                                 :phone.sync="form.contactTelephone"
                                                 :prex.sync="form.contactTelPrefix"
                                                 @changePrex="changePrex" />
                            </div>
                        </li>
                        <li>
                            <div class="label required">
                                &emsp;
                                <span>邮箱：</span>
                            </div>
                            <div class="item">
                                <FormItem prop="contactMail">
                                    <Input class="his large"
                                           v-model="form.contactMail"
                                           placeholder="请输入邮箱" />
                                </FormItem>
                            </div>
                        </li>
                        <li>
                            <div class="label">
                                <span>其他要求：</span>
                            </div>
                            <div class="item textarea">
                                <FormItem prop="otherRequired">
                                    <Input class="otherRequired"
                                           v-model="form.otherRequired"
                                           type="textarea"
                                           :maxlength="50"
                                           placeholder="我们会转告餐厅您的合理要求" />
                                    <div class="length">{{form.otherRequired.length}}/50</div>
                                </FormItem>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="module notice">
                    <h3>预定须知</h3>
                    <div class="box"
                         v-if="orderInfo.confirmTime">
                        <div class="left">二次确认时间：</div>
                        <div class="right">{{orderInfo.confirmTime>0?`${orderInfo.confirmTime}小时内`:'立即确认'}}</div>
                    </div>
                    <div class="tuigai"
                         v-if="cancelable()">
                        <div class="left">退改规则：</div>
                        <Table border
                               :columns="columns1"
                               :data="cancelPolicy"
                               style="width:566px;"></Table>
                    </div>
                    <div class="tuigai"
                         style="display:flex;"
                         v-if="!cancelable()">
                        <div class="left">退改规则：</div>
                        <div class="right">该资源一经预订不支持退改</div>
                    </div>
                </div>
                <div class="bottom">
                    <Checkbox class="his"
                              v-model="agreement">
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
                        <Button type="primary"
                                @click="submitForm">提交订单</Button>
                    </div>
                </div>
            </Form>
        </div>
        <div class="right">
            <ResOrderRight :detail="rightInfo" />
        </div>
    </div>
</template>

<script>
import OrderStep from '~/components/play/order/OrderStep';
import PhoneAndPrexfix from '~/components/PhoneAndPrexfix';
import pattern from '~/assets/js/pattern';
import { API_PLAY } from '~/assets/api/play';
import PriceCalendar from '~/components/play/PriceCalendar';
import ResOrderRight from '~/components/personal/orderDetail/ResOrderRight';
import { mapMutations, mapState } from 'vuex';
import REG from '~/assets/js/pattern';
import { BookingError, ResMealType } from '~/assets/js/play/index';
export default {
    components: {
        OrderStep,
        PhoneAndPrexfix,
        PriceCalendar,
        ResOrderRight,
    },
    data() {
        return {
            orderInfo: {},
            rightInfo: {},
            agreement: true,
            priceCalendar: null, // 获取价格日历的参数
            arrivalTimes: [], // 可选到店时间
            disWeek: [], // 根据arrivalTimes找出每周哪几天要禁止选价格
            totalAmount: 0,
            reserveType: '', // 团餐？套餐？代订座
            form: {
                payType: '',
                bookingDate: '',
                useTime: '',
                adultNum: 0,
                childNum: 0,
                directorNum: 0,
                groupNo: '',
                contactName: '',
                contactTelephone: '',
                contactTelPrefix: '',
                contactMail: '',
                otherRequired: '',
                quantity: 1,
            },
            // 现付预付价格，需要初始化
            preOptions: [{ detail: '', name: '', paymentPrice: null, prepayPrice: null, reserveType: '' }],
            rules: {
                contactTelephone: [
                    { required: true, message: '请输入联系人手机号码', trigger: 'blur' },
                    { pattern: pattern.phone, message: '手机号码格式错误', trigger: 'blur' },
                ],
                bookingDate: [{ required: true, message: '请选择到店日期', trigger: 'blur' }],
                payType: [{ required: true, message: '请选择支付方式', trigger: 'blur' }],
                useTime: [{ required: true, type: 'string', message: '请选择到店时间', trigger: 'blur' }],
                contactName: [
                    { required: true, message: '请输入联系人姓名', trigger: 'blur' },
                    { pattern: pattern.contactName, message: '请输入20位以下的中文或英文字符', trigger: 'blur' },
                ],
                contactMail: [{ required: true, message: '请输入正确格式的邮箱', type: 'email', trigger: 'blur' }],
                otherRequired: [{ message: '不能超过50个字符', pattern: REG.otherRequired, trigger: 'blur' }],
                groupNo: [{ message: '请输入20位以内以数字或字母组成的字符', pattern: REG.groupNo, trigger: 'blur' }],
            },
            columns: [],
            columns1: [
                {
                    title: '提前取消天数',
                    key: 'beforeBookingDate',
                },
                {
                    title: '退款比例',
                    key: 'damagesPercent',
                },
            ],
            columns2: [
                {
                    title: '名称',
                    key: 'name',
                    width: 144,
                    align: 'center',
                },
                {
                    title: '详情',
                    key: 'detail',
                    width: 444,
                    align: 'center',
                },
                {
                    title: '预付价格',
                    width: 144,
                    align: 'center',
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
                    width: 144,
                    align: 'center',
                    render: (h, { row }) => {
                        return <div>&yen;{this.mixin_m_formatNumber(row.paymentPrice, 'x,xxx.xx')}/人</div>;
                    },
                },
            ],
            columns3: [
                {
                    title: '名称',
                    key: 'name',
                    width: 144,
                    align: 'center',
                },
                {
                    title: '详情',
                    key: 'detail',
                    width: 444,
                    align: 'center',
                },
                {
                    title: '预付价格',
                    width: 144,
                    align: 'center',
                    render: (h, { row }) => {
                        return (
                            <div style="color:#EA037C;">
                                &yen;{this.mixin_m_formatNumber(row.prepayPrice, 'x,xxx.xx')}/人
                            </div>
                        );
                    },
                },
            ],
        };
    },
    watch: {
        useTime(n, o) {
            if (n !== undefined && n !== null) {
                this.rightInfo.reserveTime = n;
            }
        },
    },
    computed: {
        ...mapState('play', ['npp']),
        cancelPolicy() {
            if (this.orderInfo.cancelPolicy && this.orderInfo.cancelPolicy.ladders) {
                return this.checkCancleNUm(this.orderInfo.cancelPolicy.ladders);
            } else {
                return [];
            }
        },
        useTime() {
            return this.form.useTime;
        },
    },
    filters: {
        getReserveType(str) {
            if (!str) return;
            if (str === ResMealType[0].value) return '团队餐';
            if (str === ResMealType[1].value) return '套餐';
            if (str === ResMealType[2].value) return '订座';
        },
    },
    created() {
        // 回填上次提交的联系人信息
        this.form.contactName = this.npp.contactName;
        this.form.contactTelPrefix = this.npp.contactTelPrefix;
        this.form.contactTelephone = this.npp.contactTelephone;
        this.getOrderInfo();
        this.getDisWeek();
    },
    methods: {
        ...mapMutations('play', ['SET_ORDER', 'SET_NPP']),
        // 到店时间中没有给的就要禁用
        getDisWeek() {
            let all = [0, 1, 2, 3, 4, 5, 6];
            let arrivalTimes = this.mixin_m_SStorage('get', 'play_orderInfo').arrivalTimes.map(v => {
                v.day = v.day * 1;
                let index = all.indexOf(v.day);
                if (index > -1) {
                    all.splice(index, 1);
                }
                return v;
            });
            this.disWeek = all;
        },
        changePrex(prex) {
            if (prex === '86') {
                this.rules.contactTelephone[1].pattern = REG.phone;
            } else {
                this.rules.contactTelephone[1].pattern = REG.otherPhone;
            }
            // 可能会存在初始化时this.$refs.form还不存在
            if(this.form.contactTelephone && this.$refs.form) this.$refs.form.validateField('contactTelephone');
        },
        cancelable() {
            // 是否显示取消政策
            if (this.orderInfo.cancelPolicy && this.orderInfo.cancelPolicy.canCancel && this.cancelPolicy.length > 0)
                return true;
            return false;
        },
        changeUseTime(str) {
            // 先触发报错后再选择依然报错
            this.$refs.form.validateField('useTime');
        },
        changeAdultNum(n) {
            this.rightInfo.adultNum = n || 0;
            if (this.form.directorNum) {
                let num = this.form.directorNum;
                let all = (n || 0) + (this.form.directorNum || 0);
                if (this.orderInfo.driverGuideSalePolicy && this.orderInfo.driverGuideSalePolicy.preferential) {
                    num =
                        num -
                        Math.floor(all / this.orderInfo.driverGuideSalePolicy.eachFullNum) *
                            this.orderInfo.driverGuideSalePolicy.minusNum;
                }
                this.rightInfo.directorNum = num > 0 ? num : 0;
            }
            this.totalPrice();
        },
        changeChildtNum(n) {
            this.rightInfo.childNum = n || 0;
            this.totalPrice();
        },
        changeDirectorNum(n) {
            let num = n;
            if (this.orderInfo.driverGuideSalePolicy && this.orderInfo.driverGuideSalePolicy.preferential) {
                let all = this.form.adultNum + n;
                num =
                    n -
                    Math.floor(all / this.orderInfo.driverGuideSalePolicy.eachFullNum) *
                        this.orderInfo.driverGuideSalePolicy.minusNum;
            }
            this.rightInfo.directorNum = num > 0 ? num : 0;
            this.totalPrice();
        },
        changeQuanity(n) {
            this.rightInfo.quantity = n || 0;
            this.totalPrice();
        },
        changeDate(obj, str) {
            // 餐厅选择的到店时间不是全周都有
            this.form.useTime = '';
            let arrivalTimes = this.mixin_m_SStorage('get', 'play_orderInfo').arrivalTimes.find(
                v => v.day == (obj.day === 7 ? 0 : obj.day),
            );
            if (arrivalTimes) {
                this.arrivalTimes = arrivalTimes.ladders.map(v => {
                    v = v.startTime + '~' + v.endTime;
                    return v;
                });
            } else {
                this.arrivalTimes = [];
            }
            this.form.bookingDate = str;
            this.preOptions = [{ ...this.preOptions[0], paymentPrice: obj.paymentPrice, prepayPrice: obj.prepayPrice }];
            if (this.orderInfo.reserveType === ResMealType[2].value) {
                this.columns = this.columns3;
            } else {
                if (this.preOptions[0].paymentPrice > 0) {
                    this.columns = this.columns2;
                } else {
                    this.columns = this.columns3;
                }
            }
            this.rightInfo.reserveDate = str;
            this.totalPrice();
            this.$refs.form.validateField('bookingDate');
        },
        hadleBlur(key) {
            // 数字输入框不输入任何值有BUG，不是置最小值而是null
            if (key === 'quantity' && !this.form[key]) {
                this.form[key] = 1;
                this.rightInfo.quantity = 1;
                return;
            }
            this.form[key] = !this.form[key] ? 0 : this.form[key];
        },
        getOrderInfo() {
            let info = this.mixin_m_SStorage('get', 'play_orderInfo');
            if (!info) this.$router.go(-1);
            this.orderInfo = info;
            this.rightInfo = info.rightInfo;
            let date = new Date();
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            this.priceCalendar = {
                cityId: this.orderInfo.cityId * 1,
                month,
                reserveType: this.orderInfo.reserveType,
                resourceId: this.orderInfo.resourceId * 1,
                skuId: this.orderInfo.ratTerm.skuId * 1,
                year,
            };
            if (info.reserveType === ResMealType[2].value) {
                this.columns = this.columns3;
            } else {
                if (this.preOptions[0].paymentPrice > 0) {
                    this.columns = this.columns2;
                } else {
                    this.columns = this.columns3;
                }
            }
            this.preOptions[0].name = this.orderInfo.ratTerm.name;
            this.preOptions[0].detail = this.orderInfo.ratTerm.detail;
        },
        // 计算价格并提交
        // 提交订单
        submitForm() {
            if (!this.agreement) {
                this.$Message.error('请阅读并同意服务条款和隐私政策');
                return;
            }
            this.$refs.form.validate(res => {
                if (res) {
                    let cancelPolicy = {
                        canCancel: this.orderInfo.cancelPolicy.canCancel,
                        remarkExplain: this.orderInfo.cancelPolicy.remarkExplain,
                    };
                    if (this.orderInfo.cancelPolicy.ladders && this.orderInfo.cancelPolicy.ladders.length > 0) {
                        cancelPolicy['ladders'] = this.orderInfo.cancelPolicy.ladders.map(v => {
                            v.beforeBookingDate = v.beforeBookingDate * 1;
                            v.damagesPercent = v.damagesPercent * 1;
                            return v;
                        });
                    }
                    let data = {};
                    if (this.orderInfo.reserveType === 'TEAM_MEAL') {
                        let freeDirectorNum = 0;
                        // 如果有司导优惠政策
                        if (this.orderInfo.driverGuideSalePolicy && this.orderInfo.driverGuideSalePolicy.preferential) {
                            // 如果有司导优惠政策，填了司导又分司导人数满足全免和非全免
                            let freeDirectorNumLimit =
                                Math.floor(this.form.adultNum / this.orderInfo.driverGuideSalePolicy.eachFullNum) *
                                this.orderInfo.driverGuideSalePolicy.minusNum;
                            freeDirectorNum =
                                this.form.directorNum - freeDirectorNumLimit >= 0
                                    ? freeDirectorNumLimit
                                    : this.form.directorNum;
                        }
                        let allNum = this.form.adultNum + this.form.directorNum - freeDirectorNum;
                        if (this.orderInfo.minQuantity && allNum < this.orderInfo.minQuantity) {
                            this.$Message.error(`成人游客和付费司导游客人数和不能低于${this.orderInfo.minQuantity}人`);
                            return;
                        }
                        if (this.orderInfo.maxQuantity && allNum > this.orderInfo.maxQuantity) {
                            this.$Message.error(`成人游客和付费司导游客人数和不能高于${this.orderInfo.maxQuantity}人`);
                            return;
                        }
                        data = {
                            cancelPolicy,
                            cityId: this.orderInfo.cityId * 1,
                            reserveType: this.orderInfo.reserveType,
                            resourceId: this.orderInfo.resourceId * 1,
                            skuId: this.orderInfo.ratTerm.skuId * 1,
                            ...this.form,
                            quantity: 0,
                            ...this.totalPrice(),
                        };
                    } else {
                        data = {
                            cancelPolicy,
                            cityId: this.orderInfo.cityId * 1,
                            reserveType: this.orderInfo.reserveType,
                            resourceId: this.orderInfo.resourceId * 1,
                            skuId: this.orderInfo.ratTerm.skuId * 1,
                            totalAmount: this.totalAmount * 1,
                            freeDirectorNum: 0,
                            ...this.form,
                            ...this.totalPrice(),
                        };
                    }
                    this.$axios({...API_PLAY.booking, data }).then(res => {
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
                                    name: 'personal_center-orderDetail-restaurant',
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
            this.$refs.form.validateField('payType');
            this.totalPrice();
            this.rightInfo.payType = v === 'ADVANCE' ? '预付' : '现付';
            let unitPrice =
                this.form.payType === 'ADVANCE'
                    ? this.preOptions[0].prepayPrice * 1
                    : this.preOptions[0].paymentPrice * 1;
            let childUnitPrice = unitPrice;
            if (
                this.orderInfo.childSalePolicy &&
                this.orderInfo.childSalePolicy.preferential &&
                this.orderInfo.childSalePolicy.discountPercent
            ) {
                childUnitPrice = (unitPrice * this.orderInfo.childSalePolicy.discountPercent) / 100;
            }
            this.rightInfo.unitPrice =
                this.form.payType === 'ADVANCE'
                    ? this.preOptions[0].prepayPrice * 1
                    : this.preOptions[0].paymentPrice * 1;
            if (this.orderInfo.reserveType === 'TEAM_MEAL') {
                this.rightInfo.childUnitPrice = childUnitPrice;
            }
        },
        // 计算总价
        totalPrice() {
            if (this.form.bookingDate && this.form.payType) {
                if (this.orderInfo.reserveType === 'TEAM_MEAL') {
                    // 团餐会有成人、儿童、司导数量。
                    // 成人数量可能有最低、可能有最高限制。司导可能有优惠政策：根据成人游客数量每满n个减免m个。预定人数可能有限制，但是是根据成人数+费免司导和计算的，注意：没有填司导的时候。
                    // 儿童可能有优惠政策，此时最多优惠4个，这是前后台根据需求约定的，优惠儿童按给的优惠比列计算价格，其余按成人价计算。
                    // iview的数字输入框有个问题是清空value可以为null，已经在blur时加了处理：赋0,但是在input事件中总价会有null
                    // null<0:false,null>0:false,null<Infinity:true,null<-Infinity:false
                    let unitPrice =
                        this.form.payType === 'ADVANCE'
                            ? this.preOptions[0].prepayPrice * 1
                            : this.preOptions[0].paymentPrice * 1;
                    let childUnitPrice = unitPrice;
                    // 成人价儿童数、优惠儿童数
                    let childNum = 0,
                        freeChildrenNum = 0;
                    if (
                        this.orderInfo.childSalePolicy &&
                        this.orderInfo.childSalePolicy.preferential &&
                        this.orderInfo.childSalePolicy.discountPercent
                    ) {
                        childUnitPrice = (unitPrice * this.orderInfo.childSalePolicy.discountPercent) / 100;
                        if (this.form.childNum <= 4) {
                            freeChildrenNum = this.form.childNum;
                        } else {
                            freeChildrenNum = 4;
                            childNum = this.form.childNum - 4;
                        }
                    } else {
                        childNum = this.form.childNum || 0;
                    }
                    let freeDirectorNum = 0;
                    if (
                        this.form.directorNum > 0 &&
                        this.orderInfo.driverGuideSalePolicy &&
                        this.orderInfo.driverGuideSalePolicy.preferential
                    ) {
                        let freeDirectorNumLimit =
                            Math.floor(this.form.adultNum / this.orderInfo.driverGuideSalePolicy.eachFullNum) *
                            this.orderInfo.driverGuideSalePolicy.minusNum;
                        freeDirectorNum =
                            this.form.directorNum - freeDirectorNumLimit >= 0
                                ? freeDirectorNumLimit
                                : this.form.directorNum;
                    }
                    let totalAmount =
                        ((this.form.adultNum || 0) + childNum + (this.form.directorNum || 0) - freeDirectorNum) *
                            unitPrice +
                        freeChildrenNum * childUnitPrice;
                    this.totalAmount = totalAmount;
                    this.rightInfo.totalAmount = totalAmount;
                    return {
                        unitPrice,
                        childUnitPrice,
                        freeDirectorNum,
                        totalAmount,
                    };
                } else {
                    let unitPrice =
                        this.form.payType === 'ADVANCE'
                            ? this.preOptions[0].prepayPrice * 1
                            : this.preOptions[0].paymentPrice * 1;
                    this.totalAmount = (this.form.quantity || 0) * unitPrice;
                    this.rightInfo.totalAmount = this.totalAmount;
                    return {
                        unitPrice,
                        totalAmount: this.totalAmount,
                    };
                }
            }
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
    .ivu-form-item-error .ivu-select-selection {
        border-color: #8e8e8e;
    }
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
                text-align: right;
                position: relative;
                span {
                    white-space: nowrap;
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
                    .ivu-select-selection {
                        height: 40px;
                        .ivu-select-selected-value,
                        .ivu-select-placeholder {
                            height: 40px;
                            line-height: 40px;
                        }
                    }
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
