<template>
    <Form ref="form"
          :model="form"
          :rules="rules"
          :label-position="'top'">
        <div class="top">
            <FormItem prop="orderNo"
                      label="订单编号">
                <Input class="his"
                       type="text"
                       v-model="form.orderNo"
                       placeholder="订单编号" />
            </FormItem>
            <FormItem prop="hotelName"
                      label="酒店名称">
                <Input class="his"
                       type="text"
                       v-model="form.hotelName"
                       placeholder="酒店名称" />
            </FormItem>
            <FormItem prop="groupNo"
                      label="贵司团号">
                <Input class="his"
                       type="text"
                       v-model="form.groupNo"
                       placeholder="贵司团号" />
            </FormItem>
            <FormItem prop="contactName"
                      label="联系人姓名">
                <Input class="his"
                       type="text"
                       v-model="form.contactName"
                       placeholder="联系人姓名" />
            </FormItem>
            <AmpleCalender :date="form.checkinDate"
                           ref="checkinDate"
                           :scene="'infinite'"
                           :visible="visible1"
                           trigger="custom"
                           :onChange="(arr) => changeDate('checkinDate', arr)"
                           @onvisiblechange="(visible) => onvisiblechange(visible, 1)">
                <FormItem prop="checkinDate"
                          label="入住日期">
                    <div :class="['timenode',{visible:visible1},{active:form.checkinDate.length>1}]"
                         @click="changeVisible('checkinDate')">
                        <div>{{form.checkinDate[0]?form.checkinDate[0]:'起始日期'}}</div>
                        <div>—</div>
                        <div>{{form.checkinDate[1]?form.checkinDate[1]:'截止日期'}}</div>
                        <Icon :class="{active: visible1}"
                              type="ios-arrow-down" />
                        <i class="iconfont icondel1" @click.stop.self="resetDate('checkinDate')"></i>
                    </div>
                </FormItem>
            </AmpleCalender>
            <AmpleCalender :date="form.orderDate"
                           ref="orderDate"
                           :scene="'infinite'"
                           trigger="custom"
                           :visible="visible2"
                           :onChange="(arr) => changeDate('orderDate', arr)"
                           @onvisiblechange="(visible) => onvisiblechange(visible, 2)">
                <FormItem prop="orderDate"
                          label="预定日期">
                    <div :class="['timenode',{visible:visible2},{active:form.orderDate.length>1}]"
                         @click="changeVisible('orderDate')">
                        <div>{{form.orderDate[0]?form.orderDate[0]:'起始日期'}}</div>
                        <div>—</div>
                        <div>{{form.orderDate[1]?form.orderDate[1]:'截止日期'}}</div>
                        <Icon :class="{active: visible2}"
                              type="ios-arrow-down" />
                        <i class="iconfont icondel1" @click.stop.self="resetDate('orderDate')"></i>
                    </div>
                </FormItem>
            </AmpleCalender>
            <AmpleCalender :date="form.cancelDate"
                           ref="cancelDate"
                           :scene="'infinite'"
                           trigger="custom"
                           :visible="visible3"
                           :onChange="(arr) => changeDate('cancelDate', arr)"
                           @onvisiblechange="(visible) => onvisiblechange(visible, 3)">
                <FormItem prop="checkinDate"
                          label="免费取消">
                    <div :class="['timenode',{visible:visible3},{active:form.cancelDate.length>1}]"
                         @click="changeVisible('cancelDate')">
                        <div>{{form.cancelDate[0]?form.cancelDate[0]:'起始日期'}}</div>
                        <div>—</div>
                        <div>{{form.cancelDate[1]?form.cancelDate[1]:'截止日期'}}</div>
                        <Icon :class="{active: visible3}"
                              type="ios-arrow-down" />
                        <i class="iconfont icondel1" @click.stop.self="resetDate('cancelDate')"></i>
                    </div>
                </FormItem>
            </AmpleCalender>
            <!-- <FormItem prop="checkinDate" label="入住日期">
                <DatePicker v-model="form.checkinDate" type="daterange" @on-change="changeCheckDate" :clearable="true" split-panels placeholder="入住日期"></DatePicker>
            </FormItem> -->
            <!-- <FormItem prop="orderDate"
                      label="预定日期">
                <DatePicker v-model="form.orderDate"
                            type="daterange"
                            @on-change="changeOrderDate"
                            :clearable="true"
                            split-panels
                            placeholder="预定日期"></DatePicker>
            </FormItem>
            <FormItem prop="cancelDate"
                      label="免费取消">
                <DatePicker v-model="form.cancelDate"
                            type="daterange"
                            @on-change="changeCancelDate"
                            :clearable="true"
                            split-panels
                            placeholder="免费取消"></DatePicker>
            </FormItem> -->
            <FormItem prop="orderStatus"
                      label="订单状态">
                <Select class="his"
                        v-model="form.orderStatus"
                        :disabled="type!==0">
                    <Option v-for="(v,i) in orderStatusList"
                            :value="v.value"
                            :key="i">{{ v.label }}</Option>
                </Select>
            </FormItem>
            <FormItem prop="payType"
                      label="付款方式">
                <Select class="his"
                        v-model="form.payType">
                    <Option v-for="(v,i) in payWay"
                            :value="v.value"
                            :key="i">{{ v.label }}</Option>
                </Select>
            </FormItem>
        </div>
        <div class="bottom">
            <Button type="primary"
                    @click="submitForm"
                    style="margin-top:22px;">查询</Button>
            <Button type="default"
                    style="margin-top:22px;"
                    @click="resetForm">重置</Button>
        </div>
    </Form>
</template>

<script>
import { HotelOrderStatus } from '~/assets/js/hotel';
import { payTypeDictId } from '~/assets/js/dictionary';
import AmpleCalender from '~/components/common/AmpleCalender';
import DrowpDown from '~/components/common/DrowpDown';
export default {
    components: {
        AmpleCalender,
        'his-dropdown': DrowpDown,
    },
    props: {
        submit: {
            type: Function,
            required: true,
        },
        type: {
            type: Number,
            required: true,
        },
        reset: {
            type: Function,
            required: true,
        },
    },
    data() {
        return {
            form: {
                orderNo: '',
                hotelName: '',
                groupNo: '',
                contactName: '',
                checkinDate: [],
                orderDate: [],
                cancelDate: [],
                orderStatus: '',
                payType: '',
            },
            rules: {},
            orderStatusList: HotelOrderStatus,
            visible1: false,
            visible2: false,
            visible3: false,
        };
    },
    computed: {
        payWay() {
            let arr = [];
            Object.keys(payTypeDictId).map(v => {
                if(v !== 'null') {
                    arr.push({ value: v, label: payTypeDictId[v] });
                }
            });
            return arr;
        },
    },
    created() {
        if (this.type === 1) {
            this.form.orderStatus = 'COMPLETED';
        } else if (this.type === 2) {
            this.form.orderStatus = 'CANCELED';
        }
    },
    methods: {
        changeVisible(ref) {
            this.$refs[ref].visible = !this.$refs[ref].visible;
        },
        onvisiblechange(visible, n) {
            this['visible' + n] = visible;
        },
        changeDate(key,arr) {
            // 不然是date类型，要自己转换
            this.form[key] = arr;
        },
        resetDate(key) {
            this.form[key] = [];
            this.$refs[key].resetDate();
        },
        submitForm() {
            let form = this.formatForm();
            this.submit(form);
        },
        async resetForm() {
            await this.$refs.form.resetFields();
            if (this.type === 1) {
                this.form.orderStatus = 'COMPLETED';
            } else if (this.type === 2) {
                this.form.orderStatus = 'CANCELED';
            }
            await this.resetDate('checkinDate');
            await this.resetDate('orderDate');
            await this.resetDate('cancelDate');
            let form = await this.formatForm();
            this.reset(form);
        },
        formatForm() {
            let form = {};
            Object.keys(this.form).map(v => {
                switch (v) {
                    case 'checkinDate':
                        form['checkinStartDate'] = this.form[v][0] ? this.form[v][0] : '';
                        form['checkinEndDate'] = this.form[v][1] ? this.form[v][1] : '';
                        break;
                    case 'orderDate':
                        form['orderStartDate'] = this.form[v][0] ? this.form[v][0] : '';
                        form['orderEndDate'] = this.form[v][1] ? this.form[v][1] : '';
                        break;
                    case 'cancelDate':
                        form['cancelFreeStartDate'] = this.form[v][0] ? this.form[v][0] : '';
                        form['cancelFreeEndDate'] = this.form[v][1] ? this.form[v][1] : '';
                        break;
                    default:
                        form[v] = this.form[v];
                }
            });
            return form;
        },
    },
};
</script>

<style scoped lang="less">
@deep: ~'>>>';
.ivu-form {
    padding: 42px 0 30px 36px;
    background-color: #fff;
    box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.03);
    border-radius: 0 0 6px 6px;
    border: 1px solid #e8e8e8;
    border-top: none;
    > div {
        display: flex;
        flex-wrap: wrap;
        .ivu-form-item,
        > .ivu-dropdown {
            width: 280px;
            margin-right: 30px;
        }
        .ivu-btn-primary {
            width: 140px;
            height: 40px;
            background: rgb(234, 3, 124);
            border-radius: 2px;
            margin-right: 20px;
            font-size: 16px;
        }
        .ivu-btn-default {
            width: 140px;
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
    .ivu-date-picker,
    .ivu-select {
        width: 100%;
        height: 40px;
        border-radius: 2px;
    }
    @{deep}.ivu-input {
        width: 100%;
        height: 40px;
        border-radius: 2px;
    }
    @{deep}.ivu-select-single .ivu-select-selection {
        height: 40px;
        .ivu-select-placeholder,
        .ivu-select-selected-value {
            height: 40px;
            line-height: 40px;
        }
    }
    @{deep}.ivu-input-suffix {
        display: flex;
        justify-content: center;
        align-items: center;
    }
}
@{deep}.ivu-cascader {
    .ivu-input {
        &:focus,
        &:hover {
            border-color: #dfdfdf;
            border-bottom: 1px solid #ea037c;
            box-shadow: 0 1px #ea037c;
        }
    }
}
.timenode {
    width: 100%;
    height: 40px;
    color: #acacac;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
    border: 1px solid rgba(223, 223, 223, 1);
    border-radius: 2px;
    user-select: none;
    .ivu-icon {
        color: #222;
        transform: rotate(-360deg);
        transition: transform 0.3s;
    }
    .ivu-icon.active {
        transform: rotate(-180deg);
        transition: transform 0.3s;
    }
    .iconfont{
        color:#ea037c;
        display: none;
        font-size: 12px;
    }
    &:hover{
       .iconfont{
           display: inline-block;
       }
       .ivu-icon{
           display: none;
       }
    }
}
.timenode.active {
    color: #222;
    .ivu-icon {
        transform: rotate(-180deg);
        transition: transform 0.3s;
    }
}
.timenode.visible,
.timenode:hover {
    border-bottom-color: #ea037c;
    box-shadow: 0 1px #ea037c;
}
</style>