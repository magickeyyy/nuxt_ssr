<template>
    <FormItem :prop="$attrs.prop">
        <Input class="his img" v-model="yzm" :maxlength="4" :placeholder="$attrs.placeholder" @on-change="input">
            <p slot="suffix" @click="getYzm" class="yzm">
                <img :src="'/client/web/api/auth/image/captcha?randomStr='+randomStr" alt="图型验证码">
            </p>
        </Input>
    </FormItem>
</template>

<script>
    export default {
        props: {
            randomStr: {
                type: Number
            },
        },
        data() {
            return {
                yzm: '',
            };
        },
        methods: {
            getYzm() {
                this.$emit('update:randomStr', new Date().valueOf());
            },
            input(data) {
                this.$emit('update:value',this.yzm);
            },
            resetYzm() {
                this.$emit('update:randomStr', new Date().valueOf());
                this.yzm = '';
                this.$emit('update:value',this.yzm);
            },
        }
    };
</script>

<style scoped lang="less">
    @deep: ~'>>>';
    @{deep}.ivu-input-suffix{
        width: auto;
    }
    .yzm{
        height: 100%;
        width:160px;
        font-size:14px;
        font-weight:400;
        color:#EA037C; 
        display: flex;
        justify-content: center;
        align-items:center;
        // background-color:#EA037C;
        cursor: pointer;
    }
</style>
