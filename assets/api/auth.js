import PREFIX from './prefix'

export const API_AUTH = {
    // 用户认证接口
    register:'/auth/register',
    getSms:'/auth/sms/register',
    checkSms:'/auth/sms/register/check',
    buyer:'/auth/register/buyer',
    login: {
        url: PREFIX + '/auth/login/username',
        method: 'post'
    },
    // 忘记密码发送邮箱验证码
    getEmailYzm:'/auth/email/forgetPassword',
    // 忘记密码发送邮箱
    getPwdEmail:'/auth/forgetPassword/email',
    // 忘记密码发送手机
    getPwdPhone:'/auth/forgetPassword/mobile',
    // 忘记密码发送手机验证码
    getSmsYzm:'/auth/sms/forgetPassword',
    // 退出
    userExist:'/auth/userExist',
    signUpStepInfo:'/auth/signUpStepInfo',
    logout: {
        url: PREFIX + '/customer/logout',
        headers: {
            token: true,
        }
    },
    changePassword:'/customer/changePassword',
};