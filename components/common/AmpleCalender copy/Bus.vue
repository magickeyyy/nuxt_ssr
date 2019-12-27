<template>
    <div class="bus_price">
        <div class="single_box">
            <div class="title">
                <!-- <svg class="icon" aria-hidden="true">
                    <use xlink:href="#iconriqi_last"></use>
                </svg>-->
                <p>{{startMonth.str}}</p>
                <!-- <svg class="icon" aria-hidden="true">
                    <use xlink:href="#iconriqi_next"></use>
                </svg>-->
            </div>
            <ul class="week">
                <li>一</li>
                <li>二</li>
                <li>三</li>
                <li>四</li>
                <li>五</li>
                <li>六</li>
                <li>七</li>
            </ul>
            <ul class="day_list">
                <li v-for="(v,i) in left" :key="i + 'day'" :class="className(v,0,i)">
                    <div v-if="v" @click="select(v,0,i)">
                        <div class="day" v-if="v.day">{{v.day}}</div>
                        <div class="text" v-if="v.salePrice===undefined">不可订</div>
                        <div class="price" v-if="v.salePrice!==undefined">&yen;{{v.salePrice}}</div>
                    </div>
                </li>
            </ul>
        </div>
        <div class="single_box">
            <div class="title">
                <!-- <svg class="icon" aria-hidden="true">
                    <use xlink:href="#iconriqi_last"></use>
                </svg>-->
                <p>{{endMonth.str}}</p>
                <!-- <svg class="icon" aria-hidden="true">
                    <use xlink:href="#iconriqi_next"></use>
                </svg>-->
            </div>
            <ul class="week">
                <li>一</li>
                <li>二</li>
                <li>三</li>
                <li>四</li>
                <li>五</li>
                <li>六</li>
                <li>七</li>
            </ul>
            <ul class="day_list">
                <li v-for="(v,i) in right" :key="i + 'day'" :class="className(v,1,i)">
                    <div v-if="v" @click="select(v,1,i)">
                        <div class="day">{{v.day}}</div>
                        <div class="text" v-if="v.salePrice===undefined">不可订</div>
                        <div class="price" v-if="v.salePrice!==undefined">&yen;{{v.salePrice}}</div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import { api_bus } from '~/service/api';
export default {
    props: {
        query: {
            type: Object,
            required: true,
        },
        fillTwoMonth: {
            type: Function,
            required: true,
        },
        decomposeDate: {
            type: Function,
            required: true,
        },
        chooseTime: {
            type: Function,
            required: true,
        },
    },
    data() {
        return {
            dayList: [],
            priceList: [],
            startMonth: { str: '', date: null },
            endMonth: { str: '', date: null },
            during0: [],
            during1: [],
            left: [],
            right: [],
            leftLiLen: 0,
            salePrice:0
        };
    },
    created() {
        this.leftLi();
        this.setDef();
    },
    mounted() {
        this.init();
    },
    watch: {
        during0: {
            handler: function(n, o) {
            },
            deep: true,
        },
    },
    methods: {
        init() {
            this.dayList = this.fillTwoMonth();
            this.getLinkage(this.query);
        },
        // 计算类名
        className(v, pos, index) {
            if (v && v.salePrice === undefined) return 'disabled';
            if (v && this.during1.length > 0) {
                if (this.during1.length === 1 && v.index === this.during1[0].index) return 'active';
                if (this.during1.length === 2 && this.during0.length === 2) {
                    if (v.index === this.during0[0].index && v.index === this.during0[1].index) return 'active';
                    if (v.index === this.during0[0].index) return 'active after';
                    if (v.index === this.during0[1].index) return 'active before';
                }
            }
            if (
                v &&
                this.during0.length === 2 &&
                this.during1.length === 2 &&
                v.index > this.during0[0].index &&
                v.index < this.during0[1].index
            )
                return 'middle';
        },
        // 计算左边一共多少个li
        leftLi() {
            let arr = this.decomposeDate();
            let mlen = new Date(arr[0], arr[1] + 1, 0).getDate();
            let margin = new Date(arr[0], arr[1], 1).getDay() || 7;
            this.leftLiLen = Math.ceil((margin - 1 + mlen) / 7) * 7;
        },
        // 选中事件
        select(v, pos, index) {
            if (v.salePrice === undefined) return;
            if (this.during1.length === 0) {
                this.during1.push({ value: v.executionDate, pos, index: v.index });
            } else if (this.during1.length === 1) {
                let max = Math.max(v.index, this.during1[0].index);
                let min = Math.min(v.index, this.during1[0].index);
                for (let j = min; j <= max; j++) {
                    if (this.priceList[j] !== undefined && this.priceList[j].salePrice === undefined) {
                        this.$Message.error('使用日期必须连续');
                        return;
                    }
                }
                this.during1.push({ value: v.executionDate, pos, index: v.index });
            } else {
                this.during1 = [{ value: v.executionDate, pos, index: v.index }];
            }
            if (this.during1.length === 2) {
                let sec0 = this.during1[0];
                let sec1 = this.during1[1];
                if (sec0.index > sec1.index) {
                    this.during0 = [sec1, sec0];
                } else {
                    this.during0 = [sec0, sec1];
                }
                let list = this.priceList.slice(sec0.index, sec1.index + 1);
                list = list.filter(_ => _);
                this.chooseTime(list);
                this.$emit('update:visible', false);
            }
        },
        // 设置起止月份
        setDef(str) {
            str = str ? new Date(str) : new Date();
            this.startMonth = {
                str: this.mixin_m_formatDate(str, 'xxxx年xx月'),
                date: this.mixin_m_formatDate(str, 'date01'),
            };
            let strArr = this.decomposeDate(str);
            let next = new Date(strArr[0], strArr[1] + 1);
            this.endMonth = {
                str: this.mixin_m_formatDate(next, 'xxxx年xx月'),
                date: next,
            };
        },
        // 获取价格日历并封装数据, key1 价格list，key2日期list
        getLinkage(data) {
            this.$axios.post(api_bus.linkage, data, { custom: { token: true } }).then(res => {
                if (res.success && res.data !== null && res.data.days !== null) {
                    let arr = res.data.days.map(v => {
                        v.day = v.day * 1;
                        v.salePrice = v.salePrice * 1;
                        v.week = v.week * 1;
                        v.month = v.month * 1;
                        return v;
                    });
                    arr.map((item,index,x)=>{
                    sessionStorage.setItem(('salePrice'),JSON.stringify(x));
                    })
                    this.dayList;
                    this.priceList = this.dayList.map(v => {
                        if (v) {
                            let cur = arr.find(item => item.day === v.day && item.month === v.month);
                            if (cur) {
                                v = { ...cur, index: v.index };
                            }
                        }
                        return v;
                    });
                }
                
                let narr = this.decomposeDate(new Date());
                let len = new Date(narr[0], narr[1] + 1, 0).getDate();
                let first = new Date(narr[0], narr[1], 1).getDay() || 7;
                let max = Math.ceil((first - 1 + len) / 7) * 7;
                this.priceList.map((v, i) => {
                    if (i < max) {
                        this.left.push(v);
                    } else {
                        this.right.push(v);
                    }
                });
            });
        },
        
    },
};
</script>

<style scoped lang="less">
.bus_price {
    display: flex;
    padding: 16px 21px 0;
    .single_box {
        width: 448px;
        &:first-child {
            margin-right: 21px;
        }
        .title {
            display: flex;
            justify-content: space-around;
            align-items: center;
            color: #222;
            font-size: 18px;
            line-height: 30px;
            font-weight: bold;
            padding: 16px 24px;
            svg {
                cursor: pointer;
                width: 20px;
                height: 20px;
            }
        }
        .week {
            display: flex;
            padding-bottom: 3px;
            li {
                width: 64px;
                line-height: 28px;
                color: #999999;
                font-size: 14px;
                text-align: center;
            }
        }
        .day_list {
            display: flex;
            flex-wrap: wrap;
            li {
                width: 64px;
                height: 64px;
                position: relative;
                margin-bottom: 10px;
                &::before,
                &::after {
                    content: '';
                    width: 32px;
                    height: 64px;
                    background-color: #fbcce7;
                    position: absolute;
                    top: 0;
                    z-index: 901;
                    display: none;
                }
                &::before {
                    left: 0;
                }
                &::after {
                    right: 0;
                }
                &.disabled {
                    // pointer-events:none;
                    cursor: not-allowed;
                    color: #e2e2e2;
                }
                &.active {
                    > div {
                        border-radius: 50%;
                        background-color: #ec0286;
                        .day,
                        .price {
                            color: #fff;
                        }
                    }
                }
                > div {
                    height: 100%;
                    width: 100%;
                    position: absolute;
                    left: 0;
                    top: 0;
                    z-index: 902;
                    text-align: center;
                    font-size: 14px;
                    line-height: 1;
                    cursor: pointer;
                    .day {
                        padding: 10px 0;
                        color: #222;
                    }
                    .price {
                        color: #ec0286;
                    }
                }
            }
            .middle {
                &::before,
                &::after {
                    display: block;
                }
            }
            .after::after,
            .before::before {
                display: block;
            }
        }
    }
}
</style>
