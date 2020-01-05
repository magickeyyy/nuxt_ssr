/*
    自己获取手机号前缀，默认中国大陆86；需要自己写label
    <PhoneAndPrexfix
        prop="phone"
        placeholder="请输入联系人电话"
        :phone.sync="phone"
        :prex.sync="prefix"
        @changePrex=""
    />
*/
<template>
    <FormItem class="prex" :prop="$attrs.prop">
        <Select v-model="form.prex" @on-change="changePrex">
            <Option v-for="(item,index) in prexList" :value="item.prefix" :key="index">{{ item.region }}+{{item.prefix}}</Option>
        </Select>
        <Input v-model="form.num" :maxlength="20" :placeholder="$attrs.placeholder" @on-change="changePhone" />
    </FormItem>
</template>

<script>
    import { API_BASE } from '~/assets/api/public'
    export default {
        name:'PhoneAndPrexfix', // 待手机号前缀，表单验证
        data() {
            return {
                prexList:[],
                form:{
                    prex: '',
                    num: ''
                }
            };
        },
        props:{
            phone:String,
            prex:String
        },
        methods:{
            getPrex(){
                this.$axios({...API_BASE.phonePrex})
                    .then(res=>{
                        if(res.success){
                            this.prexList=res.data;
                        }
                    })
            },
            changePhone(){
                this.$emit('update:phone',this.form.num);
            },
            changePrex(){
                this.$emit('update:prex',this.form.prex);
                this.$emit('changePrex', this.form.prex);
            }
        },
        created(){
            this.getPrex();
            this.form.prex = this.prex || '86';
            this.$emit('update:prex',this.form.prex);
            this.changePrex();
            this.form.num = this.phone || '';
        }
    };
</script>

<style scoped lang="less">
    @deep: ~'>>>';
    // IE下flex布局伸缩有问题
    .prex.ivu-form-item-error {
        @{deep}.ivu-select-visible .ivu-select-selection{
            box-shadow: none;
        }
    }
    .prex.ivu-form-item{
        width:340px;
        height:40px;
        @{deep}.ivu-form-item-content{
            display: flex;
            width:340px;
            height:40px;
            border-radius:2px;
        }
        @{deep}.ivu-select-visible .ivu-select-selection{
            box-shadow: none;
        }
        @{deep}.ivu-select{
            width: 140px;
            .ivu-select-selection{
                width: 140px;
                height:40px;
                border: 1px solid rgb(223, 223, 223);
                border-right: none;
                border-radius: 2px 0 0 2px;
                >div{
                    height: 100%;
                    .ivu-select-selected-value{
                        width: 140px;
                        height:100%;
                        line-height:40px;
                        color:#111;
                        font-size:14px;
                    }
                }
            }
            .ivu-select-selection-focused{
                box-shadow: none!important;
            }
            .ivu-select-dropdown-list{
                width: 140px;
                overflow-x: hidden;
            }
            .ivu-select-not-found{
                width: 140px; 
                li{
                   width: 140px; 
                }
            }
            .ivu-select-item{
                width: 140px;
                color:#111;
                font-size:14px;
                margin-right: 0;
            }
            .ivu-select-item-selected{
                color:#EA037C;
            }
        }
        @{deep}.ivu-input-wrapper{
            width: 200px;
            .ivu-input {
                width: 200px;
                height: 40px;
                border-radius: 0 2px 2px 0;
                border: 1px solid rgb(223, 223, 223)
            }
            .ivu-input:focus{
                box-shadow: none;
            }
        }
    }
    .prex.ivu-form-item-error{
        @{deep}.ivu-select-arrow{
            color:#999
        }
    }
</style>
