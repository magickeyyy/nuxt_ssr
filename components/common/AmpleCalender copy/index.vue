/*
*   日历组件
*
*
*
*
*
*/ 
<template>
    <Dropdown
        :trigger="$attrs.trigger"
        :visible="visible"
        @on-clickoutside="hidde"
        placement="bottom-start"
    >
        <FormItem :prop="$attrs.prop" :label="$attrs.label">
            <Input
                class="his single"
                :placeholder="$attrs.placeholder"
                :value="vstr"
                readonly
                @click.native="show"
            ></Input>
        </FormItem>
        <DropdownMenu slot="list">
            <Bus
                ref="bus"
                :query="query"
                :fillTwoMonth="fillTwoMonth"
                v-if="!disabled"
                :decomposeDate="decomposeDate"
                :chooseTime="chooseBusTime"
                :visible.sync="visible"
            />
        </DropdownMenu>
    </Dropdown>
</template>

<script>
import Bus from './Bus';
export default {
    name: 'AmpleCalender',
    components: {
        Bus,
    },
    props: {
        // 时间起点
        begin: {
            type: [String, Number, Object, Date],
            default: () => new Date(),
        },
        // 请求数据需要的参数
        query: {
            type: Object,
        },
        // 是否禁止选择时间
        disabled: {
            type: Boolean,
        },
        chooseBusTime: {
            type: Function,
        },
        vstr: {
            type: String,
            default: '',
        },
    },
    data() {
        return {
            visible: false,
            price:0
        };
    },
    created() {
        
    },
    methods: {
        show() {
            if (this.disabled) return;
            if (this.visible) return;
            this.visible = true;
        },
        hidde() {
            if (!this.visible) return;
            if (this.$refs.bus.during1.length < 2) {
                this.$refs.bus.during1 = [];
            }
            this.visible = false;
        },
        // 根据传入的需求返回一个Date对象的年、月、日、周几（周日0改7）,第二个参数是否需要不足位补0
        decomposeDate(date = new Date(), fill = false) {
            if (fill) {
                let y = date.getFullYear() + '';
                let m = date.getMonth() + 1 + '';
                m = m.length === 1 ? '0' + m : m;
                let d = date.getDate() + '';
                d = d.length === 1 ? '0' + d : d;
                let w = (date.getDay() || 7) + '';
                return [y, m, d, w];
            } else {
                let y = date.getFullYear();
                let m = date.getMonth();
                let d = date.getDate();
                let w = date.getDay() || 7;
                return [y, m, d, w];
            }
        },
        // UI要求日期从周一开始，每月1号前可能有空白，需要补足前面的空白。补足一个月
        fillMonth(date = new Date()) {
            let dateArr = this.decomposeDate(date);
            let monthLength = new Date(dateArr[0], dateArr[1] + 1, 0).getDate();
            let firstDay = new Date(dateArr[0], dateArr[1], 1).getDay() || 7;
            return Array.from({ length: monthLength + firstDay - 1 }, (v, i) => {
                if (i >= firstDay - 1) {
                    v = i - firstDay + 2;
                }
                return v;
            });
        },
        // UI要求日期从周一开始，每月1号前可能有空白，需要补足前面的空白。补足相邻两个月
        fillTwoMonth(date = new Date()) {
            let curArr = this.decomposeDate(date);
            let next = new Date(curArr[0], curArr[1] + 1);
            let netxArr = this.decomposeDate(next);
            let curMonthLength = new Date(curArr[0], curArr[1] + 1, 0).getDate();
            let nextMonthLength = new Date(netxArr[0], netxArr[1] + 1, 0).getDate();
            let curFirstDay = new Date(curArr[0], curArr[1]).getDay() || 7;
            let nextFirstDay = new Date(netxArr[0], netxArr[1]).getDay() || 7;
            const length1 = Math.ceil((curFirstDay - 1 + curMonthLength) / 7) * 7;
            const length2 = Math.ceil((nextFirstDay - 1 + nextMonthLength) / 7) * 7;
            const a0 = curFirstDay - 1;
            const a1 = a0 + curMonthLength - 1;
            const b0 = length1 - 1 + nextFirstDay;
            const b1 = b0 + nextMonthLength - 1;
            return Array.from({ length: length1 + length2 }, (v, i) => {
                if (i >= a0 && i <= a1) {
                    v = {
                        day: i - a0 + 1,
                        month: curArr[1] + 1,
                        index: i,
                    };
                } else if (i >= b0 && i <= b1) {
                    v = {
                        day: i - b0 + 1,
                        month: netxArr[1] + 1,
                        index: i,
                    };
                }
                return v;
            });
        },
    },
};
</script>

<style scoped lang="less">
@deep: ~'>>>';
.single {
    height: 40px;
    @{deep}.ivu-input {
        cursor: pointer;
        width: 260px !important;
        height: 40px;
        border-radius: 2px;
        border: 1px solid rgb(210, 210, 210);
        padding-right: 42px;
        font-size: 16px;
        background: #fff url('~assets/icon/icon_calendar_def.png') no-repeat 208px center;
        &:hover,
        &:focus {
            background-image: url('~assets/icon/icon_calendar_active.png');
        }
    }
}
.ivu-dropdown {
    @{deep}.ivu-select-dropdown {
        padding: 0;
        margin-top: 10px;
        box-shadow: 0px 6px 16px 0px rgba(0, 0, 0, 0.2);
        border-radius: 4px;
    }
}
</style>
