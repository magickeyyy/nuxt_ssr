/**
 * @Description: 团组酒店预定
 * @Attention: 
 * @param {type} 
 * @return: 
 */
<template v-if="orderInfo">
    <div class="his_oder">
        <div class="left">
            <div class="process">
                <OrderStep :module="'hotel'"
                           :scene="'GROUP'"
                           :step="[1]" />
            </div>
            <Form ref="form"
                  :model="form"
                  :rules="rules">
                <h3 style="padding: 0 46px 30px;">预定信息</h3>
                <div class="row"
                     style="padding-bottom: 4px">
                    <div class="left">房型信息</div>&nbsp;：
                    <div class="right">{{YHOrderpre.rateName}}</div>
                </div>
                <div class="row"
                     style="padding-bottom: 4px">
                    <div class="left">预定类型</div>&nbsp;：
                    <div class="right">{{YHOrderpre.group?'团组酒店':'散客酒店'}}</div>
                </div>
                <div class="row">
                    <div class="left">房间数</div>&nbsp;：
                    <div class="roomNum">
                        <FormItem prop="roomNum">
                            <InputNumber disabled
                                         :min="1"
                                         v-model="roomNum"></InputNumber>
                        </FormItem>
                        <p v-if="YHOrderpre.maxCheckIn>0">每间最多入住{{YHOrderpre.maxCheckIn}}人</p>
                    </div>
                </div>
                <div class="row"
                     style="padding-bottom: 20px">
                    <div class="left">入离时间</div>&nbsp;：
                    <div class="right">{{YHOrderpre.checkInDate}} 至 {{YHOrderpre.checkOutDate}}</div>
                    <span style="color:#A3A3A3">&nbsp;&nbsp;&nbsp;共{{YHOrderpre.stay}}晚</span>
                </div>
                <div class="row">
                    <div class="left">房费详情</div>&nbsp;：
                    <div class="cost">
                        <div class="list"
                             v-for="(v,i) in YHOrderpre.nightlyRates"
                             :key="i">
                            <div class="cell">
                                <div class="thead">{{v.date | mixin_f_formatDate('xx-xx')}}</div>
                                <div class="tbody">
                                    <span>&yen;</span>
                                    {{v.rate}}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row"
                     style="padding-bottom:20px;">
                    <div class="left">退改规则</div>&nbsp;：
                    <div class="right"
                         v-if="YHOrderpre.cancelPolicy&&YHOrderpre.cancelPolicy.length>0">
                        <p v-for="(v,i) in YHOrderpre.cancelPolicy"
                           :key="i">{{v.str}}</p>
                    </div>
                    <div class="right"
                         v-else>
                        <p>不支持退改</p>
                    </div>
                </div>
                <div class="row"
                     style="padding-bottom:20px;"
                     v-if="YHOrderpre.group">
                    <div class="left">贵司团号</div>：
                    <div>
                        <FormItem prop="groupNo">
                            <Input class="his"
                                   :maxlength="20"
                                   v-model="form.groupNo"
                                   placeholder="团号" />
                        </FormItem>
                    </div>
                </div>
                <div class="row"
                     style="padding-bottom:20px;">
                    <div class="left">联系人</div>&nbsp;：
                    <div>
                        <FormItem prop="name">
                            <Input class="his"
                                   :maxlength="20"
                                   v-model="form.name"
                                   placeholder="联系人" />
                        </FormItem>
                    </div>
                </div>
                <div class="row"
                     style="padding-bottom:20px;">
                    <div class="left">手机号</div>&nbsp;：
                    <div class="phone">
                        <PhoneAndPrexfix @changePrex="changePrex"
                                         prop="mobileNo"
                                         :prex.sync="form.mobileNoPrefix"
                                         :phone.sync="form.mobileNo" />
                    </div>
                </div>
                <div class="row"
                     style="padding-bottom:20px;">
                    <div class="left">邮箱</div>&nbsp;：
                    <div>
                        <FormItem prop="email">
                            <Input class="his"
                                   :maxlength="40"
                                   v-model="form.email"
                                   placeholder="邮箱" />
                        </FormItem>
                    </div>
                </div>
                <h3 style="padding: 45px 46px 22px;">注意事项</h3>
                <div class="attention">
                    <div v-if="YHOrderpre.checkInTime&&YHOrderpre.checkOutTime">
                        <div class="title">出行提示：</div>
                        <ul>
                            <li>
                                <div>·&nbsp;入住退房时间</div>
                                <p>入住时间{{YHOrderpre.checkInTime}}，退房时间{{YHOrderpre.checkOutTime}}</p>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <div class="title">未到店或晚至：</div>
                        <ul>
                            <li>
                                <div>·&nbsp;如订单首晚未到店(NO SHOW)或延迟入住请务必联系游海网，否则酒店可能不会以任何方式通知客人，并直接取消整单不退费。</div>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="bottom">
                    <div class="agreement">
                        <Checkbox v-model="agreement"
                                  class="his">
                            <div style="padding-left:10px;">
                                我已阅读并同意&nbsp;
                                <nuxt-link to="/clause">服务条款</nuxt-link>&nbsp;和&nbsp;
                                <nuxt-link to="/privacy">隐私政策</nuxt-link>
                            </div>
                        </Checkbox>
                    </div>
                    <div class="right">
                        <p>
                            应付总价：
                            <span>&yen;</span>
                            <span>{{YHOrderpre.totalAmount | mixin_f_formatNumber}}</span>
                        </p>
                        <FormItem>
                            <Button type="primary"
                                    @click="toPay">提交订单</Button>
                        </FormItem>
                    </div>
                </div>
            </Form>
        </div>
        <div class="right">
            <HotelOrderRight :info="YHOrderpre" />
        </div>
    </div>
</template>

<script>
import HotelOrderRight from '~/components/personal/orderDetail/HotelOrderRight';
import { api_hotel, api_base } from '~/service/api';
import { mapMutations, mapState } from 'vuex';
import PhoneAndPrexfix from '~/components/PhoneAndPrexfix';
import REG from '~/assets/js/pattern';
import OrderStep from '~/components/common/OrderStep/index';
export default {
    layout: 'noFooter',
    components: {
        HotelOrderRight,
        PhoneAndPrexfix,
        OrderStep,
    },
    data() {
        return {
            form: {
                // 入住成员信息：第一个必须是成人，必须有姓、名，其他可以不填
                email: '',
                name: '',
                mobileNo: '',
                mobileNoPrefix: '86',
                groupNo: '', // 团组订单团号
            },
            rules: {
                email: [
                    { required: true, message: '请填写联系人邮箱', trigger: 'blur' },
                    { required: true, message: '请填写正确格式的邮箱', trigger: 'blur', type: 'email' },
                ],
                name: [
                    { required: true, message: '请填写联系人姓名', trigger: 'blur' },
                    { pattern: REG.contactName, message: '请输入20位以内中文或英文字符', trigger: 'blur' },
                ],
                groupNo: [
                    { required: true, message: '请填写贵司团号', trigger: 'blur' },
                    { pattern: REG.groupNo, message: '请输入20位以内数字或英文字符', trigger: 'blur' },
                ],
                mobileNo: [
                    { required: true, message: '请填写联系人手机号', trigger: 'blur' },
                    { pattern: REG.phone, message: '请输入正确格式的手机号', trigger: 'blur' },
                ],
            },
            orderInfo: {},
            roomNum: 1,
            roomNumList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            prexList: [],
            agreement: true,
        };
    },
    computed: {
        ...mapState('hotel', ['YHOrderpre', 'member']),
    },
    created() {
        if (!this.YHOrderpre || !this.member) {
            this.$router.go(-1);
        }
        this.roomNum = this.YHOrderpre.roomCount * 1;
    },
    mounted() {
        // this.postQuery();
    },
    methods: {
        ...mapMutations('hotel', ['SET_ORDER']),
        changePrex(prex) {
            if (prex === '86') {
                this.rules.mobileNo[1].pattern = REG.phone;
            } else {
                this.rules.mobileNo[1].pattern = REG.otherPhone;
            }
            if (this.$refs.form) this.$refs.form.validateField('mobileNo');
        },
        toPay() {
            if (!this.agreement) {
                this.$Message.error('请阅读并同意服务条款和隐私政策');
                return;
            }
            let form = this.form;
            this.$refs.form.validate(res => {
                if (res) {
                    let data = {
                        contact: { ...this.form },
                        orderDraftId: this.YHOrderpre.orderDraftId * 1,
                        groupNo: this.form.groupNo,
                    };
                    this.$axios.post(api_hotel.booking, data, { custom: { token: true } }).then(res => {
                        if (res.success) {
                            this.SET_ORDER(res.data);
                            this.$nuxt.$router.push({ name: 'hotel-pay' });
                        }
                    });
                }
            });
            // this.$nuxt.$router.push({ path: '/pay' });
        },
    },
};
</script>

<style scoped lang="less">
@deep: ~'>>>';
.icon {
    width: 22px;
    height: 22px;
}
.process {
    // 步骤条
    height: 180px;
    background: #fff;
    display: flex;
    align-items: center;
    @{deep}.hisSteps {
        .step {
            width: 153px;
            div::after {
                width: 100px;
            }
        }
    }
}
.ivu-form {
    // 表单
    background-color: #fff;
    margin: 12px 0;
    padding-top: 46px;
    > h3 {
        line-height: 1;
        font-size: 24px;
        color: #111;
    }
    .ivu-form-item {
        margin-bottom: 0;
    }
    .row {
        display: flex;
        font-size: 14px;
        line-height: 28px;
        color: #8e8e8e;
        padding: 0 46px;
        .left {
            flex-shrink: 0;
            line-height: 28px;
            width: 60px;
            text-align-last: justify;
            text-align: justify;
        }
        .right {
            line-height: 28px;
            color: #111;
        }
        @{deep}.ivu-input-wrapper {
            width: 340px;
            height: 40px;
            .ivu-input {
                height: 100%;
                border-radius: 2px;
                border: 1px solid rgb(223, 223, 223);
            }
            .ivu-input:focus {
                box-shadow: none;
                border: 1px solid #ea037c;
            }
        }
        .cost {
            // 酒店房费
            border-top: 1px solid #f0f0f0;
            border-left: 1px solid #f0f0f0;
            margin-bottom: 20px;
            display: flex;
            flex-wrap: wrap;
            .list {
                display: flex;
                flex-wrap: wrap;
                .cell {
                    > div {
                        width: 140px;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }
                }
            }
            .thead {
                background-color: #f9f9f9;
                height: 42px;
                border-right: 1px solid #f0f0f0;
                border-bottom: 1px solid #f0f0f0;
                font-size: 14px;
                color: #999;
            }
            .tbody {
                height: 46px;
                border-right: 1px solid #f0f0f0;
                border-bottom: 1px solid #f0f0f0;
                font-size: 18px;
                color: #e9047b;
                font-family: OswaldMedium;
                span {
                    font-size: 12px;
                    display: block;
                    margin-bottom: -4px;
                }
            }
        }
        .phone {
            @{deep}.ivu-form-item {
                height: 40px;
                width: 340px;
                .ivu-form-item-content {
                    display: flex;
                    .ivu-select {
                        .ivu-select-selection {
                            height: 40px;
                            width: 140px;
                            box-shadow: none;
                            border: 1px solid rgb(225, 225, 225);
                            border-right: none;
                            border-radius: 2px 0 0 2px;
                            .ivu-select-selected-value {
                                line-height: 40px;
                            }
                        }
                        .ivu-select-selection:hover,
                        .ivu-select-selection-focused {
                            border-color: rgb(225, 225, 225);
                        }
                    }
                    .ivu-input-wrapper {
                        margin-bottom: 0;
                        width: 200px;
                        .ivu-input {
                            width: 200px;
                            border-radius: 0 2px 2px 0;
                        }
                    }
                }
            }
        }
    }
    .roomNum {
        //选择房间数
        padding-bottom: 24px;
        @{deep}.ivu-input-number {
            width: 340px;
            height: 40px;
            border-radius: 2px;
            box-shadow: none;
            border: 1px solid rgb(223, 223, 223);
            .ivu-input-number-input-wrap {
                height: 40px;
                .ivu-input-number-input {
                    height: inherit;
                }
            }
        }
        p {
            font-size: 12px;
            color: #a3a3a3;
            line-height: 24px;
        }
    }
    .roomInfo {
        margin: 0 46px 20px;
        border: solid 1px #dfdfdf;
        max-width: 1043px;
        ul {
            display: flex;
            li:first-child {
                width: 246px;
                text-align: center;
                flex-shrink: 0;
            }
            li:last-child {
                padding-left: 42px;
                display: flex;
                align-items: center;
            }
        }
        .thead {
            max-width: 1043px;
            line-height: 50px;
            background: rgba(249, 249, 249, 1);
            display: flex;
            color: #999;
            font-size: 14px;
            border-bottom: solid 1px #dfdfdf;
        }
        .tbody {
            ul {
                height: 76px;
                display: flex;
                li:first-child {
                    line-height: 76px;
                    text-align: center;
                    span {
                        color: #e9047b;
                        font-weight: bold;
                    }
                }
                li:last-child {
                    padding-left: 0;
                    width: 100%;
                    .ivu-row {
                        width: 100%;
                        display: flex;
                        align-items: center;
                        .ivu-form-item {
                            max-width: 250px;
                        }
                        .ivu-col-span-5 {
                            margin-right: 20px;
                        }
                    }
                    @{deep}.ivu-select-dropdown {
                        width: 120px !important;
                        .ivu-select-dropdown-list {
                            width: 120px !important;
                            .ivu-select-item {
                                width: 120px !important;
                                line-height: 1;
                                padding-left: 10px;
                                margin: 0;
                                text-align: left;
                            }
                        }
                    }
                }
            }
        }
    }
    .attention {
        // 注意事项
        padding: 0 46px;
        > div {
            padding-bottom: 35px;
            line-height: 28px;
            font-size: 14px;
            .title {
                color: #111;
                font-weight: bold;
            }
            li {
                color: #6c6c6c;
            }
        }
    }
    .bottom {
        height: 95px;
        padding: 0 50px 0 30px;
        background-color: #f9f9f9;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .agreement {
            font-size: 12px;
            color: #111;
            font-weight: bold;
            .ivu-checkbox-wrapper {
                display: flex;
            }
            a {
                color: #e9047b !important;
                font-weight: bold;
            }
        }
        .right {
            display: flex;
            align-items: center;
            .ivu-form-item {
                margin: 0;
            }
            .ivu-btn-primary {
                width: 230px;
                height: 48px;
                font-size: 16px;
            }
            p {
                font-size: 16px;
                padding-right: 28px;
                span {
                    color: #ea037c;
                    font-family: OswaldMedium;
                    font-weight: bold;
                }
                span:last-child {
                    font-size: 28px;
                }
            }
        }
    }
}
</style>
