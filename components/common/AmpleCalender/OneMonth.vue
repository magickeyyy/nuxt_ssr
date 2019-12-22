<!--
 * @Author: magckeyyy
 * @Date: 2019-11-07 17:13:48
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2019-12-11 15:47:01
 * @Description:    <AmpleCalender :scene="'one'" :date.sync="form.overbookingTime" placement="bottom-start">
                        <FormItem prop="overbookingTime" label="下单日11期">
                            <Input class="his" type="text" v-model="form.overbookingTime" placeholder="请选择下单日期" readonly />
                        </FormItem>
                    </AmpleCalender>
                    只选择某月某一天的纯日期
 * @Attention: 
 -->

<template>
    <div class="oneMonth">
        <div class="head">
            <svg class="icon" aria-hidden="true" @click="changeMonth(-1)">
                <use xlink:href="#iconlast"></use>
            </svg>
            <p>{{title.year}}年{{title.month}}月</p>
            <svg class="icon" aria-hidden="true" @click="changeMonth(1)">
                <use xlink:href="#iconnext"></use>
            </svg>
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
        <ul class="day">
            <li v-for="(v,i) in list" :key="i" :class="setClass(v)" @click="select(v,i)">
                <div v-if="v">{{v.num}}</div>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        props: {
            params: {
                type: Object,
                default: () => {},
            },
            decomposeDate: {
                type: Function,
                required: true,
            },
            fillMonth: {
                type: Function,
                required: true,
            },
            selectDate: {
                type: Function,
                required: true,
            },
        },
        data() {
            return {
                title: {
                    year: 0,
                    month: 0,
                },
                list: [],
                start: new Date().valueOf(),
                active: {},
            };
        },
        created() {
            this.init();
        },
        methods: {
            init() {
                let arr = this.decomposeDate(new Date());
                this.start = new Date(arr[0], arr[1], arr[2]).valueOf(); // 获取当天00:00:00:00timespan
                this.setOrigin();
                this.setList();
                if(this.origin) {
                    let date = new Date(this.origin);
                    this.active = {
                        date: this.mixin_m_formateDate(date),
                        num: date.getDate(),
                        timespan: date.valueOf(),
                    }
                }
            },
            setOrigin(date = new Date()) {
                let arr =this.decomposeDate(date);
                arr[1] = arr[1] > 9 ? arr[1] + 1: '0' + (arr[1] + 1);
                this.title = {
                    year: arr[0],
                    month: arr[1]
                };
            },
            setList(date = new Date()) {
                this.list = this.fillMonth(date).map(v => {
                    if(v) {
                        let obj = {};
                        obj['num'] = v;
                        obj['date'] = this.title.year + '-' + this.title.month + '-' + (v > 9? v: '0' + v);
                        obj['timespan'] = new Date(this.title.year, this.title.month - 1, v).valueOf();
                        v = obj;
                    }
                    return v;
                })
            },
            setClass(v) {
                if(v&&(v.timespan < this.start)) return 'disabled';
                if(v && v.timespan === this.active.timespan) return 'active';
                if(v) return 'normal';
            },
            changeMonth(n) {
                /**
                 * @Attention:  如果是当月就不能再减
                 * @param {type} n:Number,加一或者减一
                 */
                let cur = this.decomposeDate(new Date());
                if(this.title.year === cur[0] && ((this.title.month*1 + n) === cur[1])) return;
                let date = new Date(this.title.year, this.title.month - 1 + n);
                let arr = this.decomposeDate(date);
                arr[1] = arr[1] > 9 ? arr[1] + 1: '0' + (arr[1] + 1);
                this.title = {
                    year: arr[0],
                    month: arr[1]
                }
                this.setList(date);
            },
            select(v, i) {
                if(!v || (v.timespan < this.start)) return;
                this.active = v;
                this.selectDate(v.date);
            }
        }
    };
</script>

<style scoped lang="less">
    .oneMonth{
        width:42px*7+20;
        height: auto;
        padding:10px;
        .head{
            display: flex;
            justify-content: space-between;
            padding: 16px 0;
            line-height: 18px;
            align-items: center;
            p{
                font-size:18px;
                font-weight:bold;
                user-select: none;
            }
            svg{
                width: 22px;
                height: 22px;
                cursor: pointer;
            }
        }
        .week{
            display: flex;
            justify-content: space-between;
            user-select: none;
            align-items: center;
            li{
                width: 60px;
                text-align: center;
                font-size: 14px;
                line-height: 20px;
                color:#999;
            }
        }
        .day{
            display: flex;
            user-select: none;
            flex-wrap: wrap;
            >li{
                width:42px;
                height:42px;
                text-align: center;
                user-select: none;
                color:#111;
                &.normal:not(.disabled):hover,&.active {
                    background:rgba(233,4,123,1);
                    border-radius:21px;
                    cursor: pointer;
                    color: #fff;
                }
                &.disabled{
                    cursor: not-allowed;
                    color:#DEDEDE;
                }
                >div{
                    line-height: 42px;
                }
            }
        }
    }
</style>
