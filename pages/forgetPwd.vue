<template>
    <div class="forgetPwd">
        <Tabs value="name1">
            <TabPane label="通过手机找回密码" name="name1">
                <Form ref="phone" :model="phoneData" :rules="rules">
                    <!-- <FormItem prop="acc">
						<Input class="his" v-model="phoneData.acc" placeholder="请输入您的账号"/>
                    </FormItem>-->
                    <FormItem prop="phoneNo">
                        <Input
                            v-model="phoneData.phoneNo"
                            class="his"
                            type="tel"
                            placeholder="请输入您的手机号"
                        />
                    </FormItem>
                    <ImgYzm
                        ref="imgyzm"
                        prop="imageCaptcha"
                        :value.sync="phoneData.imageCaptcha"
                        :randomStr.sync="phoneData.randomStr"
                        :reset="reset"
                        placeholder="图型验证码"
                    />
                    <SmsYzm
                        ref="smsyzm"
                        text="获取短信验证码"
                        prop="emailCaptcha"
                        :value.sync="phoneData.emailCaptcha"
                        :validateField="validateField"
                        :formName="'phone'"
                        :reset="reset"
                    />
                    <Button type="primary" @click="handleSubmit('phone')">确定</Button>
                    <div class="notice">如果忘记账号相关信息，请联系贵司主账号持有者。如您是主账户请联系我司客服。</div>
                </Form>
            </TabPane>
            <!-- <TabPane label="通过邮箱找回密码" name="name2">
				<Form ref="email" :model="emailData" :rules="rules">
					<FormItem prop="acc">
						<Input class="his" v-model="emailData.acc" placeholder="请输入您的账号"/>
					</FormItem>
					<FormItem prop="email">
						<Input class="his" v-model="emailData.email" type="email" placeholder="请输入您的邮箱"/>
					</FormItem>
					<ImgYzm prop="imgyzm" :value.sync="emailData.imgyzm" :randomStr.sync="emailData.randomStr" placeholder="图型验证码"/>
					<SmsYzm text="发送邮箱验证码" prop="emailyzm" :value.sync="emailData.imgyzm" :validateField="validateField" :formName="'email'"/>
					<Button type="primary" @click="handleSubmit('email')">确定</Button>
					<div class="notice">如果忘记账号相关信息，请联系贵司主账号持有者。如您是主账户请联系 我司客服。</div>
				</Form>
            </TabPane>-->
        </Tabs>
    </div>
</template>

<script>
import ImgYzm from '~/components/forgetPwd/ImgYzm';
import SmsYzm from '~/components/forgetPwd/SmsYzm';
import REG from '~/assets/js/pattern';
import { api_auth } from '~/service/api';
export default {
    name: 'forgetPwd',
    layout: 'regist',
    components: {
        ImgYzm,
        SmsYzm,
    },
    data() {
        return {
            phonemsg: '', // phoneNo的校验结果传给SmsInput
            emailmsg: '', // email的校验结果传给EmailInput
            pimgyzmmsg: '', // 电话的图片验证码验证结果
            eimgyzmmsg: '', // 邮箱的图片验证码验证结果
            phoneData: {
                imageCaptcha: '',
                phonePrefix: '86',
                phoneNo: '',
                randomStr: new Date().valueOf(),
            },
            emailData: {
                acc: '',
                emailyzm: '',
                email: '',
                imgyzm: '',
                randomStr: new Date().valueOf(),
            },
            rules: {
                acc: [
                    { required: true, message: '必填', trigger: 'blur' },
                    { pattern: REG.userName, message: '用户名格式错误', trigger: 'blur' },
                ],
                sms: [
                    { required: true, message: '必填', trigger: 'blur' },
                    { pattern: /^\d{6}$/g, message: '请输入六位数字验证码', trigger: 'blur' },
                ],
                phoneNo: [
                    { required: true, message: '必填', trigger: 'blur' },
                    { pattern: REG.phone, message: '手机号码格式有误', trigger: 'blur' },
                ],
                email: [{ required: true, message: '必填', trigger: 'blur', type: 'email' }],
                emailyzm: [
                    { required: true, message: '必填', trigger: 'blur' },
                    { pattern: /^\d{6}$/g, message: '请输入六位数字验证码', trigger: 'blur' },
                ],
                imageCaptcha: [
                    { required: true, message: '必填', trigger: 'blur' },
                    { pattern: REG.imgyzm, message: '请输入四位数字验证码', trigger: 'blur' },
                ],
            },
        };
    },
    methods: {
        validateField(type) {
            let n = 0;
            const arr = type === 'phone' ? ['imageCaptcha','phoneNo'] : ['acc', 'email', 'imgyzm'];
            arr.map(v => {
                this.$refs[type].validateField(v, str => {
                    if (!str) n++;
                });
            });
            if (n == 2) {
                let key = type === 'phone' ? 'phoneData' : 'emailData';
                return Promise.resolve({
                    imageCaptcha: this[key].imageCaptcha,
                    phoneNo: this[key].phoneNo,
                    phonePrefix: this[key].phonePrefix,
                    randomStr: this[key].randomStr + '',
                });
            } else {
                return Promise.resolve(false);
            }
        },
        handleSubmit(ref) {
            this.$refs[ref].validate(res => {
                if (res) {
                    let url = ref === 'phone' ? api_auth.getPwdPhone : api_auth.getPwdEmail;
                    let data = {
                        emailCaptcha: this.phoneData.emailCaptcha,
                        phonePrefix: '86',
                        phoneNo: this.phoneData.phoneNo,
                    };
                    if (ref === 'email') {
                        data = {
                            emailCaptcha: this.emailData.emailyzm,
                            loginName: this.emailData.acc,
                            email: this.emailData.email,
                        };
                    }
                    this.$axios.post(url, data, { custom: { encode: 'urlencoded' } }).then(res => {
                        if (res.success) {
                            this.$Message.success('密码发送成功，请注意查收');
                            this.$router.push('/');
                        } else {
                            this.reset();
                        }
                    });
                }
            });
        },
        reset() {
            this.$refs.smsyzm.resetYzm();
            this.$refs.imgyzm.resetYzm();
        }
    },
};
</script>

<style scoped lang="less">
.forgetPwd {
    margin: 100px auto 50px;
    width: 1180px;
    padding: 48px 390px 156px;
    background-color: #fff;
    /deep/.ivu-tabs {
        width: 400px;
        margin: 0 auto;
        .ivu-tabs-bar {
            margin-bottom: 30px;
            .ivu-tabs-nav {
                .ivu-tabs-tab {
                    font-size: 18px;
                    line-height: 38px;
                    color: #777;
                    padding-left: 0;
                    padding-right: 0;
                }
                .ivu-tabs-ink-bar {
                    display: none;
                }
                .ivu-tabs-tab:nth-of-type(2) {
                    margin-right: 110px;
                }
                .ivu-tabs-tab:nth-of-type(3) {
                    margin-right: 0px;
                }
                .ivu-tabs-tab-focused {
                    color: #ea037c;
                    position: relative;
                    font-weight: 600;
                }
                .ivu-tabs-tab-focused:after {
                    content: '';
                    display: block;
                    width: 145px;
                    height: 3px;
                    background: rgba(234, 3, 124, 1);
                    border-radius: 2px;
                    position: absolute;
                    bottom: 0;
                    left: 0;
                }
            }
            .ivu-tabs-nav-prev,
            .ivu-tabs-nav-next {
                display: none;
            }
        }
    }
    /deep/.ivu-input-wrapper {
        .ivu-input {
            width: 400px;
            height: 44px;
            border: 1px solid rgb(223, 223, 223);
            border-radius: 2px;
            padding-left: 16px;
        }
    }
    .ivu-form-item {
        margin-bottom: 30px;
    }
    .ivu-btn-primary {
        width: 400px;
        height: 44px;
        border-radius: 2px;
        margin: 10px 0;
    }
    .notice {
        font-size: 12px;
        line-height: 18px;
        color: #a3a3a3;
    }
}
</style>
