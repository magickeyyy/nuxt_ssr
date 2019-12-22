<!--
 * @Author: magckeyyy
 * @Date: 2019-12-09 17:30:26
 * @Description: 可以同时加年加月，但是整个时间必须在相邻两个月内。根据date[0]初始化标题和对应日期list，没有值就是当月和下一个月，所以date日期间隔必须在相邻两个月。
                点击选择时间。
 * @Attention: 只选择一个节点再点击外面要恢复的选择的时间，即date
 -->
<template>
    <div class="infinite"
         @mouseleave="clearCurrent">
        <div class="box">
            <div class="title">
                <div>
                    <i class="iconfont iconyear_left"
                       @click="changeMonth(1,-12)"></i>
                    <i class="iconfont iconriqi_last-copy"
                       @click="changeMonth(1,-1)"></i>
                </div>
                <p>{{title1.arr[0]}}年{{title1.arr[1]+1}}月</p>
            </div>
            <ul class="week">
                <li>一</li>
                <li>二</li>
                <li>三</li>
                <li>四</li>
                <li>五</li>
                <li>六</li>
                <li>日</li>
            </ul>
            <ul class="date">
                <li v-for="(v,i) in start"
                    :key="i"
                    :class="curClass(v)"
                    @click="select(v)"
                    @mouseenter="movein(v)">
                    <div v-if="v">{{v.day}}</div>
                </li>
            </ul>
        </div>
        <div class="box">
            <div class="title">
                <p>{{title2.arr[0]}}年{{title2.arr[1]+1}}月</p>
                <div>
                    <i class="iconfont iconriqi_next-copy"
                       @click="changeMonth(2,1)"></i>
                    <i class="iconfont iconyear_r"
                       @click="changeMonth(2,12)"></i>
                </div>
            </div>
            <ul class="week">
                <li>一</li>
                <li>二</li>
                <li>三</li>
                <li>四</li>
                <li>五</li>
                <li>六</li>
                <li>日</li>
            </ul>
            <ul class="date">
                <li v-for="(v,i) in end"
                    :key="i"
                    :class="curClass(v)"
                    @click="select(v)"
                    @mouseenter="movein(v)">
                    <div v-if="v">{{v.day}}</div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        setStart: {
            type: Function,
            required: true,
        },
        decomposeDate: {
            type: Function,
            required: true,
        },
        fillSTM: {
            type: Function,
            required: true,
        },
        date: {
            type: Array,
            required: true,
        },
        visible: {
            type: Boolean,
            required: true,
        },
    },
    data() {
        return {
            title1: {},
            title2: {},
            start: [], // 左边日期list
            end: [], // 右边日期list
            selected: [], // 已选中的，两个节点，同时修改date
            current: [], // 当前选中的一个节点
        };
    },
    created() {
        this.setSelected(this.date);
        this.setTitle();
        this.setDateList(this.title1, this.title2);
    },
    methods: {
        resetDate() {
            // 清空已选项
            this.selected= [];
            this.current = [];
        },
        setTitle() {
            // 只去第一个作为起点月份，终点月份自动选择下一月
            const date1 = this.date[0] ? new Date(this.date[0]) : new Date();
            this.title1 = this.setStart(date1);
            const arr = this.decomposeDate(date1);
            this.title2 = this.setStart(new Date(arr[0], arr[1] + 1));
        },
        setSelected(array) {
            // 组件初始化后根据date设置newDate
            if (!array[0] || !array[1]) {
                this.selected = [];
                return;
            }
            let start = array[0];
            let arr1;
            start = new Date(start);
            arr1 = this.decomposeDate(start);
            start = new Date(arr1[0], arr1[1], arr1[2]); // 防止new出的时间不是当天00:00:00:000,取时间戳才准确
            let end = array[1],
                arr2;
            end = new Date(end);
            arr2 = this.decomposeDate(end);
            end = new Date(arr2[0], arr2[1], arr2[2]);
            this.slected = [
                {
                    disabled: false,
                    day: arr1[2],
                    timespan: start.valueOf(),
                },
                {
                    disabled: false,
                    day: arr2[2],
                    timespan: end.valueOf(),
                },
            ];
        },
        setDateList(title1, title2) {
            // 处理填充后的日期list
            let { start, end } = this.fillSTM(title1.date, title2.date);
            this.start = start.map(v => {
                if (v) {
                    v = {
                        day: v,
                        disabled: false,
                        timespan: new Date(title1.arr[0], title1.arr[1], v).valueOf(),
                    };
                }
                return v;
            });
            this.end = end.map(v => {
                if (v) {
                    v = {
                        day: v,
                        disabled: false,
                        timespan: new Date(title2.arr[0], title2.arr[1], v).valueOf(),
                    };
                }
                return v;
            });
        },
        changeMonth(pos, n) {
            // 要么改变一个月要么改变一年，且左右两边始终是相邻两个月。
            this.title1 = this.setStart(new Date(this.title1.arr[0], this.title1.arr[1] + n));
            this.title2 = this.setStart(new Date(this.title2.arr[0], this.title2.arr[1] + n));
            this.setDateList(this.title1, this.title2);
            if (this.selected.length < 2) {
                this.current = [];
                this.setSelected(this.date);
            }
        },
        select(v) {
            // len===2再选择就是重置日期但不更新date，len===1正常情况要跟新date
            if (!v || v.disabled) return;
            let len = this.selected.length;
            if (len === 1 && v.timespan === this.selected[0].timespan) return;
            if (len === 2) {
                this.selected = [v];
                this.current = [v];
            } else if (len === 1) {
                if (v.timespan < this.selected[0].timespan) {
                    this.selected = [v, this.selected[0]];
                } else {
                    this.selected.push(v);
                }
                this.$emit('onChange', [
                    this.mixin_m_formatDate(this.selected[0].timespan),
                    this.mixin_m_formatDate(this.selected[1].timespan),
                ]);
                this.$emit('update:visible', false);
            } else {
                this.selected.push(v);
            }
        },
        curClass(v) {
            if (!v) return '';
            if (v.disabled) return 'disabled';
            if (this.selected.length === 1 && this.current.length === 2) {
                if (v.timespan === this.current[0].timespan) return 'active start';
                if (v.timespan === this.current[1].timespan) return 'active end';
                if (v.timespan > this.current[0].timespan && v.timespan < this.current[1].timespan) return 'middle';
                if (v.timespan > this.current[0].timespan && v.timespan < this.current[1].timespan) return 'middle';
            }
            if (this.selected.length === 2) {
                if (v.timespan > this.selected[0].timespan && v.timespan < this.selected[1].timespan) return 'middle';
                if (v.timespan === this.selected[0].timespan) return 'active start';
                if (v.timespan === this.selected[1].timespan) return 'active end';
            }
            if (this.selected.length === 1 && v.timespan === this.selected[0].timespan) return 'active';
        },
        movein(v) {
            // hover处理night,增加鼠标滑过样式
            if (!v || v.disabled) return;
            if (this.selected.length !== 1) {
                this.current = [];
                return;
            }
            if (v.timespan > this.selected[0].timespan) {
                this.current = [this.selected[0], v];
            } else if (v.timespan < this.selected[0].timespan) {
                this.current = [v, this.selected[0]];
            } else {
                this.current = [];
            }
        },
        clearCurrent() {
            // 移出面板要处理night和未选择两个节点的情况
            this.current = [];
            if (this.selected.length === 1) {
                this.setSelected(this.date);
            }
            this.$emit('update:visible', false);
        },
    },
};
</script>

<style scoped lang="less">
.infinite {
    width: 634px;
    background-color: #fff;
    box-shadow: 0px 6px 16px 0px rgba(0, 0, 0, 0.2);
    border-radius: 4px;
    display: flex;
    justify-content: space-between;
    padding: 0 8px 26px;
    user-select: none;
    .box {
        width: 294px;
        .title {
            line-height: 18px;
            display: flex;
            padding: 26px 14px 22px;
            div {
                width: 40px;
                i {
                    color: #999;
                    font-size: 12px;
                    cursor: pointer;
                }
            }
            p {
                color: #222;
                font-size: 18px;
                text-align: center;
                font-weight: bold;
                width: 226px;
            }
        }
        .week {
            display: flex;
            li {
                width: 42px;
                line-height: 28px;
                color: #999999;
                font-size: 14px;
                text-align: center;
            }
        }
        .date {
            display: flex;
            flex-wrap: wrap;
            li {
                width: 42px;
                height: 42px;
                margin-bottom: 4px;
                position: relative;
                div {
                    line-height: 42px;
                    width: 42px;
                    text-align: center;
                    border-radius: 50%;
                    cursor: pointer;
                    position: absolute;
                    z-index: 10;
                }
            }
            .disabled div {
                color: #dedede;
                cursor: not-allowed;
            }
            .active div,
            li:not(.disabled):hover div {
                background-color: #e9047b;
                color: #fff;
            }
            .middle {
                background-color: #fbcee6;
            }
            .active.start::after {
                content: '';
                display: block;
                width: 21px;
                height: 42px;
                background-color: #fbcee6;
                position: absolute;
                top: 0;
                right: 0;
            }
            .active.end::before {
                content: '';
                display: block;
                width: 21px;
                height: 42px;
                background-color: #fbcee6;
                position: absolute;
                top: 0;
                left: 0;
            }
        }
    }
}
</style>
