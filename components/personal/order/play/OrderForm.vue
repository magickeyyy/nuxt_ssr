<template>
    <Form ref="form" :model="form" :rules="rules" :label-position="'top'">
        <Row :gutter="20">
            <Col :xl="6" :xxl="3">
                <FormItem prop="orderNo" label="订单编号">
                    <Input class="his" type="text" v-model="form.orderNo" placeholder="订单编号" />
                </FormItem>
            </Col>
            <Col :xl="6" :xxl="3">
                <FormItem prop="groupNo" label="贵司团号">
                    <Input class="his" type="text" v-model="form.groupNo" placeholder="贵司团号" />
                </FormItem>
            </Col>
            <Col :xl="6" :xxl="3">
                <FormItem prop="resourceName" label="资源名称">
                    <Input class="his" type="text" v-model="form.resourceName" placeholder="资源名称" />
                </FormItem>
            </Col>
            <Col :xl="6" :xxl="3">
                <FormItem prop="contactTelephone" label="电话">
                    <Input class="his" type="text" v-model="form.contactTelephone" placeholder="电话" />
                </FormItem>
            </Col>
            <Col :xl="6" :xxl="3">
                <AmpleCalender ref="overbookingTime" :scene="'one'" :date.sync="form.overbookingTime" placement="bottom-start">
                    <FormItem prop="overbookingTime" label="下单日期">
                        <Input class="his" type="text" v-model="form.overbookingTime" placeholder="请选择下单日期" readonly />
                    </FormItem>
                </AmpleCalender>
            </Col>
            <Col :xl="6" :xxl="3">
                <AmpleCalender ref="reserveDate" :scene="'one'" :date.sync="form.reserveDate" placement="bottom-start">
                    <FormItem prop="reserveDate" label="预定日期">
                        <Input class="his" type="text" v-model="form.reserveDate" placeholder="请选择预定日期" readonly />
                    </FormItem>
                </AmpleCalender>
            </Col>
            <Col :xl="6" :xxl="3">
                <FormItem prop="areaId" label="地区">
                    <Cascader
                        :transfer="true"
                        placeholder="地区"
                        v-model="form.areaId"
                        :data="areaList"
                        :load-data="loadData"
                    ></Cascader>
                </FormItem>
            </Col>
            <Col :xl="6" :xxl="3">
                <FormItem prop="orderState" label="订单状态">
                    <Select class="his" v-model="form.orderState" :transfer="true" :disabled="disSelect">
                        <Option v-for="item in orderState" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
            </Col>
        </Row>
        <Row :gutter="20" type="flex" justify="end">
            <Col :xl="6" :xxl="3" class="btn">
                <Button type="primary" @click="submitForm">查询</Button>
            </Col>
            <Col :xl="6" :xxl="3" class="btn">
                <Button type="default" @click="restForm">重置</Button>
            </Col>
        </Row>
    </Form>
</template>

<script>
import { api_location } from '~/service/api'
import { POS_TO_SERVER } from '~/assets/js/play'
import AmpleCalender from '@/components/common/AmpleCalender/index'
export default {
    name: 'OrderForm',
    components: {
        AmpleCalender
    },
    data() {
        return {
            form: {
                orderNo: '',
                groupNo: '',
                resourceName: '',
                contactTelephone: '',
                overbookingTime: '',
                reserveDate: '',
                areaId: [],
                orderState: ''
            },
            orderState: [],
            rules: {},
            areaList:[],
            disSelect: false
        };
    },
    props: {
        type: { // 0所有订单，1已确认，2已取消
            type: Number,
            required: true
        },
        submit: {
            type: Function,
            required: true,
        },
        reset: {
            type: Function,
            required: true,
        },
    },
    created() {
        // 两个状态展示为已取消5/7，值取5,
        this.orderState = POS_TO_SERVER.slice(0, 6);
        if(this.type === 1) {
           this.form.orderState = POS_TO_SERVER[2].value;
           this.disSelect = true;
        }
        if(this.type === 2) {
           this.form.orderState = POS_TO_SERVER[4].value;
           this.disSelect = true;
        }
        this.getCountry();
    },
    methods: {
        async restForm() {
            await this.$refs.form.resetFields();
            this.$refs.overbookingTime.reset();
            this.$refs.reserveDate.reset();
            if(this.type === 1) {
                this.form.orderState = POS_TO_SERVER[2].value;
            }
            if(this.type === 2) {
                this.form.orderState = POS_TO_SERVER[4].value;
            }
            let obj = {};
            if(this.form.orderState) {
                obj['orderState'] = this.form.orderState;
            }
            this.reset(obj);
        },
        loadData(item, callback) {
            item.loading = true;
            this.$axios.get(api_location.treeByCountry,{ params: { countryId: item.id } })
                .then(res => {
                    if(res.success && res.data.trees.length > 0) {
                        item.children = res.data.trees.map(v=>{
                            v['value'] = v.id * 1;
                            v['label'] = v.nameCn;
                            return v;
                        })
                        item.loading = false;
                        callback();
                    } else {
                        item.children = [{ value: item.id * 1, label: item.nameCn}];
                        item.loading = false;
                        callback();
                    }
                })
        },
        submitForm() {
            let obj = {};
            let data = this.form;
            Object.keys(data).map(v => {
                        if (v === 'areaId' && data[v].length > 0) {
                            obj['areaId'] = data[v][1] || data[v][0];
                        } else if ((v === 'overbookingTime' || v === 'reserveDate') && data[v]) {
                            obj[v] = this.mixin_m_formatDate(data[v]);
                        } else if (v !== 'areaId' && data[v]) {
                            obj[v] = data[v];
                        }
                    });
            this.submit(obj);
        },
        getCountry() {
            this.$axios.get(api_location.zone)
                .then(res => {
                    if(res.success) {
                        let list = [];
                        res.data.trees.map(v => {
                            v.children.map(item => {
                                item.children = [];
                                item['value'] = item.id * 1;
                                item['label'] = item.nameCn;
                                item['loading'] = false;
                                list.push(item);
                                return item;
                            });
                            return v;
                        })
                        this.areaList = list;
                    }
                })
        },
    },
};
</script>

<style scoped lang="less">
    @deep: ~'>>>';
    .ivu-form {
        padding: 42px 36px 30px;
        background-color: #fff;
        box-shadow:0px 1px 5px 0px rgba(0, 0, 0, 0.03);
        border-radius: 0 0 6px 6px;
        border:1px solid #e8e8e8;
        border-top: none;
        .btn {
            .ivu-btn-primary {
                width: 100%;
                height: 40px;
                background: rgb(234, 3, 124);
                border-radius: 2px;
                margin-right: 20px;
                font-size: 16px;
            }
            .ivu-btn-default {
                width: 100%;
                height: 40px;
                font-size: 16px;
                border-radius: 2px;
                color: #8e8e8e;
                border: 1px solid rgb(232, 232, 232);
            }
            .ivu-btn-default:active,
            .ivu-btn-default:hover {
                color: #8e8e8e;
            }
            .ivu-btn-default:focus {
                box-shadow: 0 0 0 2px rgba(232, 232, 232, 0.2);
            }
        }
        @{deep}.ivu-form-item-label {
            font-size: 14px;
            color: #777;
        }
        .ivu-date-picker,.ivu-select{
            width: 100%;
            height: 40px;
            border-radius: 2px;
        }
        @{deep}.ivu-input{
            width: 100%;
            height: 40px;
            border-radius: 2px;
        }
        @{deep}.ivu-select-single .ivu-select-selection{
            height: 40px;
            .ivu-select-placeholder,.ivu-select-selected-value{
                height: 40px;
                line-height: 40px;
            }
        }
        @{deep}.ivu-input-suffix{
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }
    @{deep}.ivu-cascader{
        .ivu-input{
            &:focus,&:hover{
                border-color: #DFDFDF;
                border-bottom: 1px solid #EA037C;
                box-shadow: 0 1px #ea037c;
            }
        }
    }
</style>
