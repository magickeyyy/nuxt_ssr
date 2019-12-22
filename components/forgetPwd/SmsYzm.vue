<!--
 * @Author: magckeyyy
 * @Date: 2019-10-28 16:31:16
 * @Description: 
 * @Attention: 
 -->
<template>
    <FormItem :prop="$attrs.prop">
        <Input
            :maxlength="8"
            :type="$attrs.type"
            class="his sms"
            v-model="yzm"
            :placeholder="$attrs.placeholder"
            @on-change="input"
        >
            <p slot="suffix" @click="getSms" :class="[{'disabled':sec<biao&&sec>0},'yzm']">
                <span v-if="sec<biao&&sec>0">{{sec}}s后重新获取</span>
                <span v-else>{{$attrs.text}}</span>
            </p>
        </Input>
    </FormItem>
</template>

<script>
const COUNT_DOWN = 60; // 倒计时周期
import { api_auth } from '~/service/api';
export default {
    props: {
        // 短信验证码sms？邮箱验证码email
        kind: {
            type: String,
            default: 'sms',
        },
        formName: {
            // 父级表单ref值
            type: String,
            required: true,
        },
        validateField: {
            type: Function,
        },
        reset: {
            type: Function,
        },
    },
    data() {
        return {
            yzm: '',
            sec: COUNT_DOWN,
            biao: COUNT_DOWN,
            td: null,
        };
    },
    methods: {
        getSms() {
            this.validateField(this.formName).then(res => {
                if (res) {
                    if (this.td) return;
                    let url = this.kind === 'sms' ? api_auth.getSmsYzm : api_auth.getEmailYzm;
                    this.$axios.post(url, res, { custom: { encode: 'urlencoded' } }).then(res => {
                        if (res.success) {
                            this.$Message.success('验证码发送成功');
                        } else {
                            this.reset();
                        }
                    });
                    this.td = setInterval(() => {
                        if (this.sec <= 0) {
                            clearInterval(this.td);
                            this.resetYzm();
                        } else {
                            this.sec--;
                        }
                    }, 1000);
                } else {
                    this.$Message.warning('请填写手机号和图形验证码');
                }
            });
        },
        input() {
            this.$emit('update:value', this.yzm);
        },
        resetYzm() {
            this.yzm = '';
            this.$emit('update:value', this.yzm);
            clearInterval(this.td);
            this.sec = COUNT_DOWN;
            this.td = '';
        },
    },
};
</script>

<style scoped lang="less">
@deep: ~'>>>';
@{deep}.ivu-input-suffix {
    width: auto;
}
.yzm {
    height: 100%;
    font-size: 14px;
    font-weight: 400;
    color: #ea037c;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 16px;
    cursor: pointer;
    user-select: none;
}
.disabled.yzm {
    cursor: not-allowed !important;
    color: #a3a3a3;
}
</style>
