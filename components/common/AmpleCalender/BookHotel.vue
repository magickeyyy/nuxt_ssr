<!--
 * @Author: magckeyyy
 * @Date: 2019-12-31 14:34:21
 * @Description: 当天之前不可预订，起止时间跨度不能超过两个月：选择1月份为起点，终点就只能是2月；起点是二月终点就必须是3月；起点是月末就只能最长选择32天。
                注意只选择起点关闭控件要恢复上一个日期(date)。
 * @Attention: 因为要比较时间大小，所以取的时间戳必须是new Date(年，月，日),不能是new Date('xxxx-xx-xx')
 -->
<template>
    <div class="panel" @mouseleave="clearNight">
        <div class="box">
            <div class="title">
                <div class="jian" @click="addList(-1)"><i class="iconfont iconriqi_last"></i></div>
                <p>{{startTitle.str}}</p>
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
                <li v-for="(v,i) in startList" :key="i" :class="curClass(v)" @click="add(v)" @mouseenter="movein(v)">
                    <p v-if="v">{{v.day}}</p>
                </li>
            </ul>
        </div>
        <div class="box">
            <div class="title">
                <p>{{endTitle.str}}</p>
                <div class="jia" @click="addList(1)"><i class="iconfont iconriqi_next"></i></div>
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
                <li v-for="(v,i) in endList" :key="i" :class="curClass(v)" @click="add(v)" @mouseenter="movein(v)">
                    <p v-if="v">{{v.day}}</p>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        date: {
            // 第一个是起点，第二个是终点，一定是相邻两个月
            type: [Array],
            required: true,
        },
        decomposeDate: {
            /**
             * @Description:
             * @Attention:
             * @param {type}
             * @return: [年，月，日，周几]
             */
            type: Function,
            required: true,
        },
        fillSTM: {
            /**
             * @Description: 填充指定两个月份的日期列表
             * @Attention:
             * @param {type}
             * @return:
             */
            type: Function,
            required: true,
        },
        // onChange: {
        //     // 在选中两个节点后触发
        //     type: Function,
        //     required: true,
        // },
    },
    data() {
        return {
            startList: [], // 开始时间列表
            endList: [], // 结束时间列表
            startTitle: {}, // 开始标题，取当月1号
            endTitle: {}, // 结束标题，取当月1号
            newDate: [], // 根据date生成初始值，当newDate.length===2时修改date。如果只选择一个就放弃再把newDate置为date
            night: [], // 选择了一个点，鼠标hover时，把起止点push进去
        };
    },
    created() {
        this.setNewDate(this.date);
        this.setTitle(this.date);
        this.setList(this.startTitle, this.endTitle);
    },
    methods: {
        setNewDate(array) {
            // 组件初始化后根据date设置newDate
            if (!array[0] || !array[1]) {
                this.newDate = [];
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
            this.newDate = [
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
        setTitle(array) {
            // 根据date中起点计算起止月份
            let start = array[0], startArr, end, endArr;
            start = start?new Date(start): new Date();
            startArr = this.decomposeDate(start);
            start = new Date(startArr[0], startArr[1]); // 必须去当月第一天，后面要用来做时长的起点
            startArr = this.decomposeDate(start);
            end = new Date(startArr[0], startArr[1] + 1);
            endArr = this.decomposeDate(end);
            this.startTitle = {
                str: `${startArr[0]}年${startArr[1] > 9 ? startArr[1] + 1 : '0' + (startArr[1] + 1)}月`,
                arr: startArr,
                date: start,
            };
            this.endTitle = {
                str: `${endArr[0]}年${endArr[1] > 9 ? endArr[1] + 1 : '0' + (endArr[1] + 1)}月`,
                arr: endArr,
                date: end,
            };
        },
        setList(startTitle, endTitle) {
            // 根据title生成日期列表
            let { start, end } = this.fillSTM(startTitle.date, endTitle.date);
            let current = new Date().valueOf();
            this.startList = start.map(v => {
                if (v) {
                    let timespan = new Date(startTitle.arr[0], startTitle.arr[1], v).valueOf();
                    let disabled = false;
                    if (current - timespan >= 86400000) {
                        disabled = true;
                    }
                    v = {
                        day: v,
                        timespan,
                        disabled,
                    };
                }
                return v;
            });
            this.endList = end.map(v => {
                if (v) {
                    let timespan = new Date(endTitle.arr[0], endTitle.arr[1], v).valueOf();
                    let disabled = false;
                    if (current - timespan >= 86400000) {
                        disabled = true;
                    }
                    v = {
                        day: v,
                        timespan,
                        disabled,
                    };
                }
                return v;
            });
        },
        addList(n) {
            // 增减当前时间list，选择时间段最长两个月，即当月及下一月。还要清除night和newDate。
            let start, end, date, arr;
            if (n === 1) {
                start = this.endTitle;
                date = new Date(start.arr[0], start.arr[1] + n);
                arr = this.decomposeDate(date);
                end = {
                    arr,
                    str: `${arr[0]}年${arr[1] + 1}月`,
                    date,
                };
                this.startTitle = start;
                this.endTitle = end;
            } else {
                start = this.startTitle;
                date = new Date(start.arr[0], start.arr[1] + n);
                arr = this.decomposeDate(date);
                end = {
                    arr,
                    str: `${arr[0]}年${arr[1] + 1}月`,
                    date,
                };
                let arr2 = this.decomposeDate(new Date());
                if(arr2[0] === start.arr[0] && arr2[1] === start.arr[1]) return;
                this.startTitle = end;
                this.endTitle = start;
            }
            this.setList(this.startTitle, this.endTitle);
        },
        clearNight() {
            // 移出面板要处理night和未选择两个节点的情况
            this.night = [];
            if (this.newDate.length === 1) {
                this.setNewDate(this.date);
            }
            this.$emit('changeVisible', false);
        },
        movein(v) {
            // hover处理night,增加鼠标滑过样式
            if (!v || v.disabled) return;
            if (this.newDate.length !== 1) {
                this.night = [];
                return;
            }
            if (v.timespan > this.newDate[0].timespan) {
                this.night = [this.newDate[0], v];
            } else if (v.timespan < this.newDate[0].timespan) {
                this.night = [v, this.newDate[0]];
            } else {
                this.night = [];
            }
        },
        curClass(v) {
            if (!v) return '';
            if (v.disabled) return 'disabled';
            if (this.newDate.length === 1 && this.night.length === 2) {
                if (v.timespan === this.night[0].timespan) return 'active start';
                if (v.timespan === this.night[1].timespan) return 'active end';
                if (v.timespan > this.night[0].timespan && v.timespan < this.night[1].timespan) return 'middle';
                if (v.timespan > this.night[0].timespan && v.timespan < this.night[1].timespan) return 'middle';
            }
            if (this.newDate.length === 2) {
                if (v.timespan > this.newDate[0].timespan && v.timespan < this.newDate[1].timespan) return 'middle';
                if (v.timespan === this.newDate[0].timespan) return 'active start';
                if (v.timespan === this.newDate[1].timespan) return 'active end';
            }
            if (this.newDate.length === 1 && v.timespan === this.newDate[0].timespan) return 'active';
        },
        add(v) {
            // len===2再选择就是重置日期但不更新date，len===1正常情况要跟新date
            if (!v || v.disabled) return;
            let len = this.newDate.length;
            if (len === 2) {
                this.newDate = [v];
            } else if (len === 1) {
                if (v.timespan === this.newDate[0].timespan) return;
                this.newDate.push(v);
                // 保证起止时间不超过两个月。
                if (this.newDate.length === 2 && this.newDate[0].timespan > this.newDate[1].timespan) {
                    let space = this.newDate[0];
                    this.newDate[0] = this.newDate[1];
                    this.newDate[1] = space;
                }
                let start = this.startTitle.date.valueOf();
                let end = new Date(this.endTitle.arr[0],this.endTitle.arr[1] + 1,0).valueOf();
                if(this.newDate[0].timespan < start || this.newDate[1].timespan > end) {
                    this.setNewDate(this.date);
                    return this.$Message.error('时间跨度不能超过两个月')
                }
                this.$emit('onChange',this.newDate.map(item =>{
                    item = this.mixin_m_formatDate(new Date(item.timespan));
                    return item;
                }));
                this.$emit('changeVisible', false);
            } else {
                this.newDate.push(v);
            }
        },
    },
};
</script>

<style scoped lang="less">
.panel {
    width: 696px;
    background-color: #fff;
    box-shadow: 0px 6px 16px 0px rgba(0, 0, 0, 0.2);
    border-radius: 4px;
    display: flex;
    justify-content: space-between;
    padding: 26px 18px;
    .box {
        width: 310px;
        .title {
            color: #222;
            font-size: 18px;
            line-height: 30px;
            font-weight: bold;
            position: relative;
            div {
                width: 30px;
                cursor: pointer;
                position: absolute;
                top: 0;
                i {
                    color: #999;
                }
                &.jia {
                    right: 14px;
                }
                &.jian {
                    left: 10px;
                }
            }
            p {
                text-align: center;
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
                p {
                    line-height: 42px;
                    width: 42px;
                    text-align: center;
                    border-radius: 50%;
                    cursor: pointer;
                    position: absolute;
                    z-index: 10;
                }
            }
            .disabled p {
                color: #dedede;
                cursor: not-allowed;
            }
            .active p,
            li:not(.disabled):hover p {
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
