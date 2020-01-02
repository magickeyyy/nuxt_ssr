<template>
    <header :class="['nav', {'fixed':fixed}]">
        <section class="view">
            <div @click="toHome" class="sing">
                <img src="~assets/public_img/sign.png" alt />
            </div>
            <nav>
                <div class="dropList">
                    <Dropdown v-for="(v,i) in nav" :key="i" placement="bottom">
                        <nuxt-link tag="div" :to="v.link" class="item">{{v.title}}</nuxt-link>
                        <DropdownMenu slot="list" v-if="v.item">
                            <DropdownItem v-for="(item,index) in v.item" :key="index">
                                <nuxt-link
                                    :to="item.link"
                                    @click.native="extralClick(item, index)"
                                >{{item.text}}</nuxt-link>
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
                <div class="def square">
                    <nuxt-link to="/assistant"><i class="iconfont iconhangchengzhushou"></i>&emsp;行程助手</nuxt-link>
                </div>
                <div class="def lan">
                    <a href="javascript:;">EN</a>
                </div>
                <div class="state">
                    <Dropdown v-if="logined" placement="bottom-end" class="personal" key="ssdd" @on-visible-change="changeSvg">
                        <div :class="['yohi', {active: visible2}]">
                            游海旅行&nbsp;<i class="iconfont iconopen1"></i>
                        </div>
                        <DropdownMenu slot="list">
                            <DropdownItem
                                v-for="(v,i) in personList"
                                :key="i"
                                @click.native="handleClick(v,i)"
                            >
                                <Badge dot :count="v.count">
                                    <svg class="icon" aria-hidden="true">
                                        <use :xlink:href="v.svg" />
                                    </svg>
                                    <nuxt-link :to="v.link">{{v.text}}</nuxt-link>
                                </Badge>
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                    <Dropdown
                        placement="bottom-end"
                        trigger="custom"
                        :visible="visible"
                        key="1122"
                        v-if="!logined"
                        class="login"
                        style="margin-right:18px;"
                        @on-clickoutside="visible=false"
                    >
                        <div @click="showLogin">登录</div>
                        <DropdownMenu slot="list">
                            <Form ref="form" :model="form" :rules="rule" class="form">
                                <h3>欢迎回来</h3>
                                <FormItem prop="phoneNo" label="手机号">
                                    <Dropdown class="nameList" trigger="custom" :visible="true">
                                        <Input
                                            class="his"
                                            type="text"
                                            v-model="form.phoneNo"
                                            placeholder="请输入手机号"
                                            :autofocus="true"
                                            autocomplete="on"
                                            :maxlength="30"
                                        />
                                        <DropdownMenu slot="list" v-if="nameList.length>0">
                                            <DropdownItem
                                                @click.native="checkName(v)"
                                                v-for="(v,i) in nameList"
                                                :key="i"
                                            >{{v}}</DropdownItem>
                                        </DropdownMenu>
                                    </Dropdown>
                                </FormItem>
                                <FormItem prop="password" label="密码">
                                    <Input
                                        class="his pwd"
                                        :type="pwdType"
                                        v-model="form.password"
                                        placeholder="请输入密码"
                                        :maxlength="30"
                                    >
                                        <div class="eyes" slot="suffix" @click="hiddePwd=!hiddePwd"></div>
                                    </Input>
                                </FormItem>
                                <FormItem>
                                    <Button type="primary" @click="handleSubmit">登录</Button>
                                </FormItem>
                                <div class="link" @click="visible=false;">
                                    <p>
                                        还没有账号？
                                        <nuxt-link to="/register/step1">去注册</nuxt-link>
                                    </p>
                                    <nuxt-link to="/forgetPwd">忘记密码?</nuxt-link>
                                </div>
                                <div class="radio">
                                    <Checkbox class="his" v-model="saveAcc">记住账户</Checkbox>
                                </div>
                            </Form>
                        </DropdownMenu>
                    </Dropdown>
                    <nuxt-link to="/register/step1" v-if="!logined">注册</nuxt-link>
                </div>
            </nav>
        </section>
    </header>
</template>

<script>
import { api_auth, api_customer } from '@/service/api';
import { API_AUTH } from '~/assets/api/auth'
import { RESOURCE_TYPE_TO_SERVER } from '@/assets/js/play';
import { mapMutations, mapState } from 'vuex';
import REG from '~/assets/js/pattern';
export default {
    name: 'NavLogined',
    props: {
        fixed: {
            // 是否绝对定位
            type: Boolean,
        },
    },
    data() {
        return {
            saveAcc: true, // 记住账户
            hiddePwd: true, // 切换密码框type
            visible: false, // 登录下拉是否显示
            visible2: false, // 游海旅行后svg旋转
            nav: [
                { title: '机票预定', link: '/airTicket' },
                { title: '酒店预定', link: '/hotel' },
                { title: '旅游大巴预定', link: '/bus' },
                {
                    title: '司导预定',
                    link: '/sd',
                    item: [
                        { text: '按天包车游', link: '/' },
                        { text: '接送机', link: '/' },
                        { text: '单次用车', link: '/' },
                    ],
                },
                {
                    title: '玩乐产品',
                    link: '/play',
                    item: [
                        { text: '餐厅', link: '/play/chooesCity?type=' + RESOURCE_TYPE_TO_SERVER[0].value },
                        { text: '门票', link: '/play/chooesCity?type=' + RESOURCE_TYPE_TO_SERVER[1].value },
                        { text: '特色体验', link: '/play/chooesCity?type=' + RESOURCE_TYPE_TO_SERVER[2].value },
                    ],
                },
            ],
            personList: [
                { text: '我的账户', link: '/personal_center/account', svg: '#iconzhanghuguanli', count: 0 },
                { text: '订单中心', link: '/personal_center/order', svg: '#iconwodedingdan', count: 0 },
                { text: '资金账户', link: '/personal_center', svg: '#iconzijinzhanghu', count: 0 },
                { text: '发票管理', link: '/personal_center', svg: '#iconfapiaoguanli', count: 0 },
                { text: '消息中心', link: '/personal_center', svg: '#iconxiaoxizhongxin', count: 0 },
                { text: '修改密码', link: '/personal_center', svg: '#iconxiugaimima', count: 0 },
                { text: '退出登录', link: '/', svg: '#icontuichudenglu', count: 0 },
            ],
            form: {
                loginType: 'phone',
                phonePrefix: '86',
                phoneNo: '',
                password: '',
            },
            rule: {
                phoneNo: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { pattern: REG.phone, message: '用户名格式错误', trigger: 'blur' },
                ],
                password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
            },
            nameList: [], // 本地存储的用户名
        };
    },
    computed: {
        ...mapState('login', ['logined']),
        pwdType() {
            if (this.hiddePwd) return 'password';
            return 'text';
        },
    },
    created() {
        this.checkLogin();
        this.getNameList();
    },
    methods: {
        ...mapMutations('login', ['SET_LOGIN']),
        checkName(v) {
            this.form.phoneNo = v;
        },
        changeSvg(visible) {
            this.visible2 = visible;
        },
        checkLogin() {
            if(!this.logined) {
                this.SET_LOGIN({ logined: false, token: null, userInfo: {} })
            }
        },
        handleClick(v, i) {
            switch (i) {
                case 6:
                    this.logout();
                    break;
            }
        },
        getNameList() {
            // 从localStorage中获取用户名并复制
            // let list = this.mixin_m_SStorage('get', 'phone');
            // if (list && list.length > 0) {
            //     this.form.phoneNo = list[list.length - 1];
            //     this.nameList = list;
            // }
        },
        toHome() {
            this.$nuxt.$router.push('/');
        },
        showLogin() {
            this.getNameList();
            this.visible = !this.visible;
        },
        saveUsername() {
            // 记住用户名，默认最多五个吧
            if (this.saveAcc) {
                let phone = localStorage.getItem('phone');
                if (phone) {
                    phone = JSON.parse(phone);
                    let res = phone.find(v => v === this.form.phoneNo);
                    if (!res) {
                        if (phone.length < 6) {
                            phone.push(this.form.phoneNo);
                            localStorage.setItem('phone', JSON.stringify(phone));
                        } else {
                            phone.shift();
                            phone.push(this.form.phoneNo);
                            localStorage.setItem('phone', JSON.stringify(phone));
                        }
                    }
                } else {
                    localStorage.setItem('phone', JSON.stringify([this.form.phoneNo]));
                }
            }
        },
        handleSubmit() {
            this.$refs.form.validate(valid => {
                if (valid) {
                    this.$axios({...API_AUTH.login, data: this.form}).then(res => {
                        if (res.success) {
                            this.SET_LOGIN({ token: res.data.token, logined: true, userInfo: res.data.customer || {} });
                            this.$cookies.set('token', res.data.token);
                            this.$cookies.set('logined', true);
                            this.$router.push('/');
                            this.$Message.success('登录成功!');
                            sessionStorage.setItem('token', res.data.token);
                            sessionStorage.setItem('userID', res.data.customer.id);

                            this.saveUsername();
                            this.visible = false;
                        } else {
                            this.SET_LOGIN({ token: null, logined: false, userInfo: {} });
                            sessionStorage.clear();
                            localStorage.clear();
                        }
                    });
                }
            });
        },
        logout() {
            this.$axios({ ...API_AUTH.logout }).then(res => {
                this.SET_LOGIN({ token: null, logined: false, userInfo: {} });
                sessionStorage.removeItem('token');
                sessionStorage.removeItem('userID');
                this.$nuxt.$router.push('/');
            });
        },
        extralClick(item, index) {
            // 点击子页面的额外逻辑
            if (item === '餐厅' || item === '门票' || item === '特色体验') {
                // let country = sessionStorage.getItem('play_selectedCountry');
            }
        },
    },
};
</script>

<style scoped lang="less">
@import url('~@/assets/style/variable.less');
@deep: ~'>>>';
.fixed {
    position: fixed;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.8) !important;
    z-index: 1000;
}
.nav {
    width: 100%;
    min-width: 1280px;
    background-color: rgba(0, 0, 0, 0.8);
    section {
        height: 78px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-sizing: border-box;
        padding: 0 50px;
        .sing {
            width: 206px;
            height: 78px;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
        }
        nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
            // margin-right: 40px;
            .dropList {
                .ivu-dropdown {
                    margin-right: 30px;
                    position: relative;
                    .ivu-dropdown-rel {
                        .item {
                            position: relative;
                            font-size: 16px;
                            padding: 0 3px;
                            line-height: 78px;
                            color: #f2f2f2;
                            cursor: pointer;
                        }
                        .item:hover,
                        .item.nuxt-link-active {
                            color: #ea037c;
                            font-weight: bold;
                        }
                        .item::after {
                            content: '';
                            display: none;
                            width: 100%;
                            position: absolute;
                            left: 50%;
                            bottom: 14px;
                            padding: 0 6px;
                            transform: translateX(-50%);
                            border-bottom: 1px solid #e9047b;
                            z-index: 1011;
                        }
                        .item:hover::after,
                        .item.nuxt-link-active::after {
                            display: block;
                        }
                    }
                    @{deep}.ivu-select-dropdown {
                        border-radius: 0 0 4px 4px;
                        padding: 0;
                        margin: 0;
                        left: 0 !important;
                        .ivu-dropdown-menu {
                            padding: 10px 0;
                            .ivu-dropdown-item {
                                padding: 10px 24px;
                                line-height: 22px;
                                a {
                                    color: #222;
                                    font-size: 14px;
                                }
                                .nuxt-link-exact-active {
                                    color: #ec0286;
                                }
                            }
                            .ivu-dropdown-item:hover {
                                a {
                                    color: #ec0286;
                                }
                            }
                        }
                    }
                }
            }
            > .def {
                display: flex;
                align-items: center;
                height: 78px;
                padding: 0 10px;
                a {
                    font-size: 16px;
                    color: #fff;
                }
            }
            > .def:hover {
                a, i{
                    color: #e9047b;
                }
            }
            .square {
                display: flex;
                align-content: center;
                align-items: center;
                margin: 0 38px 0 75px;
                a i{
                    color: #fff;
                }
                .nuxt-link-active,.nuxt-link-active i{
                    color: #e9047b;
                }
            }
            .lan {
                margin-right: 30px;
            }
            .yohi>.iconfont{
                font-size: 16px;
                transform: rotate(-360deg);
                transition: transform 0.3s;
            }
            .yohi.active>.iconfont{
                transform: rotate(-180deg);
                transition: transform 0.3s;
            }
            .user {
                display: flex;
                justify-items: center;
                img {
                    width: 21px;
                    height: 21px;
                    align-self: center;
                }
                i {
                    align-self: center;
                }
            }
            .state {
                // 右边登录、注册、个人中心
                display: flex;
                justify-content: space-between;
                align-items: center;
                > a {
                    color: #fff;
                    font-size: 16px;
                    &:hover {
                        color: #e9047b;
                        cursor: pointer;
                    }
                }
                .personal.ivu-dropdown {
                    @{deep}.ivu-dropdown-rel {
                        div {
                            line-height: 78px;
                            display: flex;
                            align-items: center;
                            cursor: pointer;
                            color: #fff;
                            font-size: 16px;
                            .icon {
                                fill: #fff;
                                overflow: hidden;
                                width: 20px;
                                height: 20px;
                            }
                        }
                    }
                    @{deep}.ivu-select-dropdown {
                        margin: 0;
                        border-radius: 0 0 4px 4px;
                        padding: 0;
                        .ivu-dropdown-menu {
                            padding: 10px 0;
                            .ivu-dropdown-item {
                                padding: 10px 30px 10px 20px;
                                line-height: 22px;
                                .ivu-badge {
                                    display: flex;
                                    align-items: center;
                                    .icon {
                                        width: 22px;
                                        height: 22px;
                                    }
                                    a {
                                        display: inline-block;
                                        margin-left: 16px;
                                        color: #777;
                                        font-size: 14px;
                                        &:hover {
                                            color: #777;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                @{deep}.login.ivu-dropdown {
                    & > .ivu-dropdown-rel > div {
                        line-height: 78px;
                        padding: 0 10px;
                        color: #fff;
                        font-size: 16px;
                        cursor: pointer;
                        &:hover {
                            color: #e9047b;
                        }
                    }
                    .form {
                        cursor: auto;
                        padding: 28px 30px;
                        color: #111;
                        > h3 {
                            font-size: 24px;
                            line-height: 48px;
                        }
                        .ivu-form-item-required .ivu-form-item-label:before {
                            display: none;
                        }
                        .ivu-input-wrapper {
                            .ivu-input {
                                height: 40px;
                                border: 1px solid rgb(223, 223, 223);
                                border-radius: 2px;
                            }
                        }
                        .ivu-btn-primary {
                            width: 100%;
                            height: 40px;
                            font-size: 16px;
                        }
                        .link {
                            display: flex;
                            justify-content: space-between;
                            font-size: 14px;
                            line-height: 1;
                            a {
                                color: #e9047b !important;
                            }
                        }
                        .radio {
                            padding-top: 28px;
                            line-height: 16px;
                            font-size: 14px;
                            color: #777777;
                        }
                        .eyes {
                            background: url('~assets/icon/icon_eyes_def.png') no-repeat center;
                            background-size: 24px 24px;
                            width: 50px;
                            height: 100%;
                        }
                        .ivu-input-suffix {
                            width: 50px;
                        }
                        .eyes:hover {
                            background-image: url('~assets/icon/icon_eyes_active.png');
                        }
                        .pwd {
                            @{deep}.ivu-input-suffix {
                                display: block;
                                width: 50px;
                            }
                            @{deep}.ivu-input {
                                padding-right: 50px;
                            }
                        }
                    }
                }
                @{deep}.login.ivu-dropdown {
                    > .ivu-select-dropdown {
                        top: 96px !important;
                        padding: 0;
                        box-shadow: none;
                        width: 400px;
                        height: 440px;
                        background: #fff;
                        box-shadow: 0px 6px 12px 0px rgba(0, 0, 0, 0.2);
                        border-radius: 6px;
                        background-image: linear-gradient(180deg, #ea037c 0, #ea037c 6px, #fff 6px, #fff 100%);
                    }
                }
                @{deep}.nameList.ivu-dropdown {
                    .ivu-select-dropdown {
                        display: none !important;
                    }
                    .ivu-select-dropdown:empty {
                        display: none;
                    }
                }
            }
        }
    }
}
</style>
