<!--
 * @Author: magckeyyy
 * @Date: 2019-11-07 17:05:49
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2019-12-16 13:04:05
 * @Description: 只负责下拉显示部分，表单控件使用slot方便表单验证等。
 * @Attention: 兼容问题：如果字符串间隔符是-且有时(:分:秒)有兼容问题,间隔符要替换成/。时间与日期英文空格隔开，时分秒以:隔开。2019-01-01 00:,2019/01/01 00:00:00(没有场景，暂未处理)
 -->

<template>
    <Dropdown :trigger="trigger"
              :placement="$attrs.placement"
              @on-visible-change="onvisiblechange"
              @on-clickoutside="clickoutside"
              :visible="visible">
        <slot></slot>
        <DropdownMenu slot="list">
            <OneMonth v-if="scene==='one'"
                      :origin="origin"
                      ref="oneMonth"
                      :decomposeDate="decomposeDate"
                      :fillMonth="fillMonth"
                      :selectDate="selectDate" />
            <Assistant v-if="scene==='assistant'"
                       :origin="origin"
                       ref="assistant"
                       :date.sync="date"
                       :decomposeDate="decomposeDate"
                       :fillCustomMonth="fillCustomMonth"
                       :setStart="setStart"
                       :disdate="disdate"
                       :visible.sync="visible"
                       :selectDate="selectDate" />
            <TimeNode v-if="scene==='timeNode'"
                      ref="timeNode"
                      :onChange="onChange"
                      :decomposeDate="decomposeDate"
                      :fillSTM="fillSTM"
                      :date="date"
                      :origin="origin" />
            <BookHotel v-if="scene==='hotel'"
                       ref="hotel"
                       :onChange="onChange"
                       :decomposeDate="decomposeDate"
                       :fillSTM="fillSTM"
                       :date.sync="date"
                       @onChange="onChange"
                       @changeVisible="onvisiblechange" />
            <Infinite v-if="scene==='infinite'"
                      ref="infinite"
                      :decomposeDate="decomposeDate"
                      :fillSTM="fillSTM"
                      :setStart="setStart"
                      @onChange="onChange"
                      :date="date"
                      :visible.sync="visible" />
        </DropdownMenu>
    </Dropdown>
</template>

<script>
import OneMonth from './OneMonth';
import Assistant from './Assistant';
import TimeNode from './TimeNode';
import BookHotel from './BookHotel';
import Infinite from './Infinite';
export default {
    components: {
        OneMonth,
        TimeNode,
        BookHotel,
        Infinite,
        Assistant,
    },
    props: {
        origin: {
            type: [Date, String], // 日起对象或者能生成日期的字符串
            default: () => new Date(),
        },
        scene: {
            type: String,
            default: 'one',
            validator: v => {
                const arr = ['one', 'timeNode', 'hotel', 'infinite', 'assistant'];
                return arr.find(m => m == v);
            },
        },
        date: {
            // 最终输出,每项都是Date或者可转的字符串
            type: [Array, String, Date],
            required: true,
        },
        onChange: {
            // 在选完时间后触发
            type: Function,
        },
        forbidYesterday: {
            // 是否禁用今天以前
            type: Boolean,
        },
        disdate: {
            // 禁用时间节点
            type: Array,
            default: () => [ new Date() ]
        }
    },
    data() {
        return {
            visible: false,
            trigger: 'hover',
        };
    },
    created() {
        if (this.$attrs.trigger) {
            this.trigger = this.$attrs.trigger;
        }
        if (this.$attrs.trigger === 'custom') {
            this.visible = this.$attrs.visible;
        }
    },
    methods: {
        clickoutside(e) {
            this.visible = false;
            this.$emit('onvisiblechange', false);
        },
        onvisiblechange(visible) {
            this.visible = visible;
            this.$emit('onvisiblechange', visible);
        },
        decomposeDate(date = new Date(), type = 'ymd') {
            // 公共方法，根据type返回date拆分后的ymd等,至少返回ymdw，且w必定在第四位
            const time = new Date(date);
            const y = time.getFullYear();
            const m = time.getMonth();
            const d = time.getDate();
            const h = time.getHours();
            const f = time.getMinutes();
            const s = time.getSeconds();
            const w = time.getDay() || 7;
            switch (type) {
                default:
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
        // 补齐本月和下一月的两个月。UI要求日期从周一开始，每月1号前可能有空白，需要补足前面的空白。补足相邻两个月
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
        // 填充指定两个月的list，默认是本月和下一个月。
        fillSTM(cur, next) {
            /**
             * @Description:
             * @Attention: 如果参数带时分秒的字符串
             * @param {type} cur:起始月份，next：截止月份。可以是时间对象、时间字符串。
             * @return:
             */
            cur = cur ? new Date(cur) : new Date();
            let c_arr = this.decomposeDate(cur);
            next = next ? new Date(next) : new Date(c_arr[0], c_arr[1] + 1);
            const start = this.fillMonth(cur);
            const end = this.fillMonth(next);
            return { start, end };
        },
        fillCustomMonth(date, disdate = [], type = 'before', disweek = []) {
            /**
             * @Description: 可以禁用某个时间前的日期
             * @param {type} disdate{Array{}数组里每个元素是可以生成date的字符串或date,
             * @param {type} disweek{Array}禁用周几[0,1,2,3,4,5,6],
             * @param {type} date{Date}可生成时间的字符串或date
             * @param {type} type{String}'before'就根据disable[0]禁用之前的，'behind'就根据disable[0]禁用之后的，
             *              'besides'禁用disable[0]、disable[1]之外的,'among'禁用disable[0]、disable[1]之间的，
             * @return:
             */
            date = date ? new Date(date) : new Date();
            let disstart,
                disend,
                dateList = [];
            if (disdate[0]) {
                // 禁用时间起点
                let startarr = this.decomposeDate(disdate[0]);
                disstart = new Date(startarr[0], startarr[1], startarr[2]).valueOf();
            }
            if (disdate[1]) {
                // 禁用时间终点
                let endarr = this.decomposeDate(disdate[0]);
                disend = new Date(endarr[0], endarr[1], endarr[2]).valueOf();
            }
            // 把日期拆分成[年，月，日，周]
            const spread = this.decomposeDate(date);
            // 当月长度
            const monthLength = new Date(spread[0], spread[1] + 1, 0).getDate();
            // 当月第一天周几
            const firstDay = new Date(spread[0], spread[1], 1).getDay() || 7;
            dateList.length = monthLength + firstDay - 1;
            switch (type) {
                default:
                    return Array.from({ length: monthLength + firstDay - 1 }, (v, i) => {
                        if(i >= firstDay - 1) {
                            let obj = {};
                            obj['day'] = i - firstDay + 2;
                            obj['week'] = (i + 1) % 7;
                            obj['timespan'] = new Date(spread[0], spread[1], i - firstDay + 2).valueOf();
                            obj['disabled'] = false;
                            // 禁用disdate[0]之前
                            if(disstart && obj.timespan < disstart) obj.disabled = true;
                            // 禁用周几
                            if(disweek.find(item => item === obj.week)) obj.disabled = true;
                            v = obj;
                        }
                        return v;
                    });
            }
        },
        setStart(date) {
            // 取当月1号00:00:00:000,有些组件需要比较时间大小
            date = date ? date : new Date();
            const arr = this.decomposeDate(date);
            return {
                str: arr[0] + '年' + (arr[1] > 9 ? arr[1] + 1 : '0' + (arr[1] + 1)) + '月',
                date: new Date(arr[0], arr[1]),
                arr: [arr[0], arr[1], 1, arr[3]],
            };
        },
        selectDate(data) {
            this.$emit('update:date', data);
            this.$emit('onChange', data);
        },
        reset() {
            Object.keys(this.$refs).map(v => {
                this.$refs[v].init();
            });
        },
        resetDate() {
            // 重置已选时间
            Object.keys(this.$refs).map(v => {
                this.$refs[v].resetDate();
            });
        },
        onChangeTime(time) {
            this.onChange(time);
        },
    },
};
</script>

<style scoped lang="less">
@deep: ~'>>>';
.ivu-dropdown {
    width: 100%;
}
@{deep}.ivu-select-dropdown {
    padding: 0;
    background: #fff;
    box-shadow: 0px 6px 16px 0px rgba(0, 0, 0, 0.2);
    border-radius: 4px;
    width: auto;
}
</style>
