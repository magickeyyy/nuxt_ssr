<!--
 * @Author: magckeyyy
 * @Date: 2019-12-12 11:13:03
 * @Description: 编辑行程助手处日历。
 * @Attention: 
 -->

<template>
    <div class="oneMonth">
        <div class="head">
            <svg class="icon" aria-hidden="true" @click="changeMonth(-1)">
                <use xlink:href="#iconlast" />
            </svg>
            <p>{{title.arr[0]}}年{{title.arr[1] + 1}}月</p>
            <svg class="icon" aria-hidden="true" @click="changeMonth(1)">
                <use xlink:href="#iconnext" />
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
            <li v-for="(v,i) in list" :key="i" :class="curClass(v)" @click="select(v,i)">
                <div v-if="v">{{v.day}}</div>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    props: {
        decomposeDate: {
            type: Function,
            required: true,
        },
        fillCustomMonth: {
            type: Function,
            required: true,
        },
        date: {
            type: [String, Date],
            required: true,
        },
        setStart: {
            type: Function,
            required: true,
        },
        selectDate: {
            type: Function,
            required: true,
        },
        disdate: {
            type: Array,
            required: true,
        },
    },
    data() {
        return {
            title: {},
            list: [],
            start: new Date().valueOf(),
            active: {},
        };
    },
    watch: {
        disdate: {
            handler: function(now, pre) {
                let date = this.date ? new Date(this.date) : new Date();
                let arr = this.decomposeDate(date);
                date = new Date(arr[0], arr[1], arr[2]);
                this.setTitle(date);
                this.setDateList(date, now);
                this.active = {
                    day: date.getDate(),
                    week: date.getDay(),
                    disabled: false,
                    timespan: date.valueOf(),
                };
            },
            deep: true,
        },
    },
    created() {
        this.setTitle(this.date);
        this.setDateList(this.date, this.disdate);
    },
    methods: {
        setTitle(date) {
            date = date ? date : new Date();
            this.title = this.setStart(date);
        },
        setDateList(date, disdate) {
            // 禁用今天或date之前的日期
            date = date ? date : new Date();
            this.list = this.fillCustomMonth(date, [disdate]);
        },
        curClass(v) {
            if (v && v.disabled) return 'disabled';
            if (v && v.timespan === this.active.timespan) return 'active';
            if (v) return 'normal';
        },
        changeMonth(n) {
            /**
             * @Attention:  不能退到禁用时间或当月前一个月
             * @param {type} n:Number,加一或者减一
             */
            let cur = this.decomposeDate(this.date ? new Date(this.date) : new Date());
            if (this.title.arr[0] === cur[0] && this.title.arr[1] === cur[1] && n < 0) return;
            let date = new Date(this.title.arr[0], this.title.arr[1] + n);
            this.setTitle(date);
            this.setDateList(date);
        },
        select(v, i) {
            if (!v || v.disabled) return;
            this.active = v;
            this.selectDate(new Date(v.timespan));
            this.$emit('update:visible', false);
        },
    },
};
</script>

<style scoped lang="less">
.oneMonth {
    width: 42px * 7+20;
    height: auto;
    padding: 10px;
    .head {
        display: flex;
        justify-content: space-between;
        padding: 16px 0;
        line-height: 18px;
        align-items: center;
        p {
            font-size: 18px;
            font-weight: bold;
            user-select: none;
        }
        svg {
            width: 22px;
            height: 22px;
            cursor: pointer;
        }
    }
    .week {
        display: flex;
        justify-content: space-between;
        user-select: none;
        align-items: center;
        li {
            width: 60px;
            text-align: center;
            font-size: 14px;
            line-height: 20px;
            color: #999;
        }
    }
    .day {
        display: flex;
        user-select: none;
        flex-wrap: wrap;
        > li {
            width: 42px;
            height: 42px;
            text-align: center;
            user-select: none;
            color: #111;
            &.normal:not(.disabled):hover,
            &.active {
                background: rgba(233, 4, 123, 1);
                border-radius: 21px;
                cursor: pointer;
                color: #fff;
            }
            &.disabled {
                cursor: not-allowed;
                color: #dedede;
            }
            > div {
                line-height: 42px;
            }
        }
    }
}
</style>
