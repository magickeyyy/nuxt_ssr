<!--
 * @Author: magckeyyy
 * @Date: 2019-11-12 19:56:01
 * @Description: <AmpleCalender
                    ref="check"
                    :scene="'timeNode'"
                    :onChange="changeCheckDate"
                    :date="[form.checkinStartDate,form.checkinEndDate]"
                    @onvisiblechange="onvisiblechange1"
                >
 * @Attention: 左右都可以改变月份但不能改变年份，只能选今天以前
 -->
<template>
    <div class="timeNode">
        <div class="timeBox left">
            <div class="head">
                <div>
                    <svg class="icon" aria-hidden="true" @click="changeMonth(0,-1)">
                        <use xlink:href="#iconlast"></use>
                    </svg>
                </div>
                <p>{{title1.year}}年{{title1.month}}月</p>
                <div>
                    <svg class="icon" aria-hidden="true" @click="changeMonth(0,1)" v-if="separate">
                        <use xlink:href="#iconnext"></use>
                    </svg>
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
            <ul class="month">
                <li v-for="(v,i) in start" :key="i" :class="{normal:v,disabled:v&&v.disabled,active:active(v)}" 
                @click="select(title1,v)" @mouseenter="move(v)">
                    <div v-if="v">{{v.day}}</div>
                </li>
            </ul>
        </div>
        <div class="timeBox right">
            <div class="head">
                <div>
                    <svg class="icon" aria-hidden="true" @click="changeMonth(1,-1)" v-if="separate">
                        <use xlink:href="#iconlast"></use>
                    </svg>
                </div>
                <p>{{title2.year}}年{{title2.month}}月</p>
                <div>
                    <svg class="icon" aria-hidden="true" @click="changeMonth(1,1)">
                        <use xlink:href="#iconnext"></use>
                    </svg>
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
            <ul class="month">
                <li v-for="(v,i) in end" :key="i" :class="{normal:v,disabled:v&&v.disabled,active:active(v)}" 
                @click="select(title2,v)" @mouseenter="move(v)">
                    <div v-if="v">{{v.day}}</div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            fillSTM: {
                type: Function,
                required: true
            },
            decomposeDate: {
                type: Function,
                required: true
            },
            separate: {
                type: Boolean,
                default: false
            },
            date: {
                // 最终输出,每项都是Date或者可转的字符串
                type: [ Array ],
                required: true
            },
            onChange: {
                type: Function,
            }
        },
        data() {
            return {
                title1: {
                    year: 0,
                    month: 0,
                    date: null
                },
                title2: {
                    year: 0,
                    month: 0,
                    date: null
                },
                start: [],
                end: [],
                result: [],
            };
        },
        created() {
            this.init();
        },
        mounted() {
        },
        methods: {
            move(v) {
                let len = this.result.length;
                if(len!==1||!v||!v.disabled) return;
            },
            active(item) {
                // 激活样式
                if(!item) return;
                if(this.result.find(v => v.value === item.value)) return true;
                return false;
            },
            changeMonth(m, n) {
                if(this.separate) {

                } else {
                    this.linkChangeMonth(n);
                }
            },
            select(title,v) {
                if(!v||v.disabled) return;
                let len = this.result.length;
                // 必须跨天
                if(len === 1&&v.value === this.result[0].value) return;
                if(len < 2){
                    this.result.push({ ...v, date: [title.year, title.month, v.day].join('-')});
                } else {
                    this.result = [{ ...v, date: [title.year, title.month, v.day].join('-')}];
                }
                if(this.result.length === 2) {
                    this.onChange(this.result);
                }
            },
            linkChangeMonth(n) {
                // 月份是连续两个月，改一个就要一起联动,起始月份不能早过当月
                let cy = this.decomposeDate()[0];
                let cm = this.decomposeDate()[1];
                if(cy === this.title1.year && cm === this.title1.month - 1 && n < 0) return;
                let y = this.title1.year;
                let m = this.title1.month - 1 + n;
                let d1 = new Date(y, m);
                let d2 = new Date(y, m + 1);
                let arr1 = this.decomposeDate(d1);
                let arr2 = this.decomposeDate(d2);
                // 设置标题部分年月
                this.title1.year = arr1[0];
                this.title1.month = arr1[1] + 1;
                this.title1.date = d1;
                this.title2.year = arr2[0];
                this.title2.month = arr2[1] + 1;
                this.title2.date = d2;
                // 设置日期列表
                let { start, end } = this.formatDate(d1, d2);
                this.start = start;
                this.end = end;
            },
            init() {
                // 从本月开始至下一个月的两个月的list
                let arr = [], start, end, earr, arr1, arr2;
                start = this.date[0]? new Date(this.date[0]): new Date();
                arr.push(start);
                if(!this.date[1]) {
                    earr = this.decomposeDate(start)
                    arr.push(new Date(earr[0], earr[1] + 1));
                } else {
                    arr.push(new Date(this.date[1]));
                }
                end = arr[1];
                arr1 = this.decomposeDate(start);
                this.title1.year = arr1[0];
                this.title1.month = arr1[1]+1;
                this.title1.date = start;
                arr2 = this.decomposeDate(end);
                this.title2.year = arr2[0];
                this.title2.month = arr2[1]+1;
                this.title2.date = end;
                let init = this.formatDate(start, end);
                this.start = init.start;
                this.end = init.end;
            },
            formatDate(m, n) {
                let { start, end } = this.fillSTM(m, n);
                let stime = this.decomposeDate(new Date(m));
                let etime = this.decomposeDate(new Date(n));
                let now = this.decomposeDate(new Date());
                now = new Date(now[0], now[1], now[2], 0, 0, 0).valueOf();
                start = start.map(v => {
                    if(v) {
                        let d = v;
                        let date = new Date(stime[0],stime[1],d,0,0,0);
                        v = {};
                        v['day'] = d;
                        v['value'] = date.valueOf();
                        if(v.value < now) {
                            v['disabled'] = true;
                        }
                    }
                    return v;
                })
                end = end.map(v => {
                    if(v) {
                        let d = v;
                        let date = new Date(etime[0],etime[1],d,0,0,0);
                        v = {};
                        v['day'] = d;
                        v['value'] = date.valueOf();
                        if(v.value < now) {
                            v['disabled'] = true;
                        }
                    }
                    return v;
                })
                return { start, end };
            }
        }
    };
</script>

<style scoped lang="less">
    .timeNode{
        background:#fff;
        box-shadow:0px 6px 16px 0px rgba(0, 0, 0, 0.2);
        border-radius:4px;
        display: flex;
        user-select: none;
        .timeBox{
            padding: 0 12px 10px;
            .head{
                display: flex;
                justify-content: space-between;
                padding: 26px 0;
                font-size: 18px;
                line-height: 1;
                color:#222;
                font-weight: bold;
                div{
                    width: 18px;
                    height: 18px;
                    overflow: hidden;
                    cursor: pointer;
                }
            }
            .week{
                display: flex;
                justify-content: space-between;
                text-align: center;
                font-size: 14px;
                color:#999;
                line-height: 1;
                padding: 5px 0;
                li{
                    width: 42px;
                }
            }
            .month{
                display: flex;
                width: 294px;
                flex-wrap: wrap;
                li{
                    width: 42px;
                    height: 42px;
                    line-height: 42px;
                    text-align: center;
                    color:#222;
                    font-size: 14px;
                    position: relative;
                    &::before,&::after{
                        content: "";
                        display: none;
                        width: 50%;
                        height: 100%;
                        position: absolute;
                        top:0;
                        background-color: rgb(251, 206, 230);
                        z-index: 899;
                    }
                    &::before{
                        left: 0;
                    }
                    &::after{
                        right: 0;
                    }
                    >div{
                        width: 100%;
                        height: 100%;
                        position: absolute;
                        left: 0;
                        top:0;
                        z-index: 900;
                    }
                }
                .normal:not(.disabled){
                    &:hover>div{
                        background-color: #EA027C;
                        color:#fff;
                        cursor: pointer;
                        border-radius: 50%;
                    }
                }
                .disabled{
                    cursor: not-allowed;
                    color: #e2e2e2;
                    >div{
                        pointer-events: none;
                    }
                }
                .active>div{
                    background-color: #EA027C;
                    color:#fff;
                    cursor: pointer;
                    border-radius: 50%;
                }
                .middle{
                    &::before,&::after{
                        display: block;
                    }
                }
            }
        }
    }
</style>
