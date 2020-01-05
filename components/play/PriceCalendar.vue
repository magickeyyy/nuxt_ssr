<template>
    <Dropdown trigger="custom" :visible="visible" @on-clickoutside="hide" placement="bottom-start">
        <FormItem :prop="$attrs.prop">
            <Input v-model="value" readonly :placeholder="$attrs.placeholder" @click.native="show" />
        </FormItem>
        <DropdownMenu slot="list" :visible="visible">
            <div class="priceCalendar">
                <div class="head">
                    <svg class="icon" aria-hidden="true" @click="changeMonth(-1)">
                        <use xlink:href="#iconlast"></use>
                    </svg>
                    <p>{{params.year}}年{{params.month}}月</p>
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
                    <li>七</li>
                </ul>
                <ul class="price">
                    <!-- <li v-for="(v,i) in list" :key="i" :class="[{'active':active(v)},{'disabled':!v.canBooking||v.stock<=0}]" @click="select(v,i)"> -->
                    <li v-for="(v,i) in list" :key="i" :class="curClass(v)" @click="select(v,i)">
                        <div v-if="v">
                            <p>{{v.date}}</p>
                            <p v-if="v.prepayPrice"><span>&yen;{{v.prepayPrice}}</span>起</p>
                        </div>
                    </li>
                </ul>
            </div>
        </DropdownMenu>
    </Dropdown>
</template>

<script>
import { API_PLAY } from '~/assets/api/play';
export default {
    props: {
        params: {
            type: Object,
            required: true,
        },
        price: {
            type: Array,
            required: true,
        },
        bookingDate: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            default: '1',
        },
        disWeek: {
            type: Array,
            default: _ => []
        }
    },
    data() {
        return {
            value: '',
            list: [],
            visible: false,
        };
    },
    mounted() {
        this.value = this.bookingDate;
        this.getLinkage(this.params);
    },
    methods: {
        show() {
            if (this.visible) return;
            this.visible = true;
        },
        hide() {
            if (!this.visible) return;
            this.visible = false;
        },
        curClass(v) {
            if(!v) return;
            if(v.disabled) return 'disabled';
            if(this.bookingDate === this.mixin_m_formatDate(new Date(this.params.year, this.params.month - 1, v.date))) return 'active normal';
            return 'normal'
        },
        changeMonth(n) {
            // 如果减1后的时间的那月1号比本地时间1号小，就拦截；如果+1后的请求成功了再修改标题和父级请求参数
            let time = new Date();
            let y = time.getFullYear();
            let m = time.getMonth();
            if (new Date(y, m, 1).valueOf() > new Date(this.params.year, this.params.month + n - 1, 1).valueOf())
                return;
            let date = new Date(this.params.year, this.params.month + n - 1, 1);
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            let data = {
                ...this.params,
                year,
                month,
            };
            this.getLinkage(data)
                .then(res => {
                    this.$emit('update:params', { ...this.params, year, month });
                });
        },
        select(v, i) {
            if (!v || v.disabled) return;
            let y = this.params.year;
            let m = this.params.month;
            if (m < 10) {
                m = '0' + m;
            }
            let d = v.date;
            if (d < 10) {
                d = '0' + d;
            }
            this.value = y + '-' + m + '-' + d;
            this.$emit('changeDate', v, this.value);
            this.visible = false;
        },
        getLinkage(data) {
            // 默认餐厅
            let url = API_PLAY.linkage;
            if (this.type !== '1') {
                url = API_PLAY.otherLinkage;
            }
            return this.$axios({ ...url, data })
                        .then(res => {
                            let arr = [];
                            if(res.success && res.data.days && res.data.days.length > 0) arr = res.data.days;
                            this.list = this.formatPrice(data.year * 1, data.month - 1, arr);
                        });
        },
        //  目前所有价格都是按先后顺序排列，中间可能断开。每月第一天周几，不足的补齐{date:0}，有的还要转换数字格式
        formatPrice(year = new Date().getFullYear(), month = new Date().getMonth() + 1, list = []) {
            // 当月天数
            let days = new Date(year, month + 1, 0).getDate();
            // 第一天周几
            let first = new Date(year, month, 1).getDay() || 7;
            let arr = Array.from({ length: days + first - 1 }, (v, i) => {
                if(i >= first - 1) {
                    let available = list.find(item => item.date * 1 === (i - first + 2));
                    if (available) {
                        v = available;
                        v['disabled'] = false;
                        if(!v.canBooking||v.stock<=0) v.disabled = true;
                        if(this.disWeek.indexOf(v.day * 1) > -1) {
                            v.disabled = true;
                        }
                        v.date = v.date * 1;
                        v.day = v.day * 1 || 7;
                        v.stock = v.stock * 1;
                        v.paymentPrice = v.paymentPrice * 1;
                        v.prepayPrice = v.prepayPrice * 1;
                        let day = v.day === 7? 0: v.day;
                    } else {
                        v = {
                            date: i - first + 2,
                            day: ((i -first + 1) % 7) || 7,
                            disabled: true,
                        };
                    }
                }
                return v;
            });
            return arr;
        },
    },
};
</script>

<style scoped lang="less">
@deep: ~'>>>';
svg {
    cursor: pointer;
}
.ivu-dropdown {
    width: 220px;
    @{deep}.ivu-dropdown-rel {
        .ivu-input {
            width: 220px;
            height: 40px;
            background: #fff;
            border: 1px solid #dfdfdf;
            border-radius: 2px;
            padding-right: 44px;
            background: url('~assets/icon/icon_calendar_def.png') no-repeat 188px center;
            &:focus,
            &:hover {
                box-shadow: inset 0 -1px 0 #e9047b;
                border-bottom-color: #e9047b;
                background-image: url('~assets/icon/icon_calendar_active.png');
                cursor: pointer;
            }
        }
    }
    @{deep}.ivu-select-dropdown {
        background: #fff;
        box-shadow: 0px 6px 16px 0px rgba(0, 0, 0, 0.2);
        border-radius: 4px;
        width: 502px;
    }
    @{deep}.ivu-input-icon {
        right: 30px;
        top: 4px;
    }
}
.priceCalendar {
    padding: 0 6px;
    user-select: none;
    .head {
        display: flex;
        justify-content: space-between;
        padding: 0 30px;
        line-height: 50px;
        align-items: center;
        user-select: none;
        p {
            font-size: 18px;
            font-weight: bold;
        }
        svg {
            width: 22px;
            height: 22px;
        }
    }
    .week {
        display: flex;
        justify-content: space-between;
        align-items: center;
        li {
            width: 70px;
            text-align: center;
            font-size: 14px;
            color: #999;
        }
    }
    .price {
        display: flex;
        flex-wrap: wrap;
        > li {
            width: 70px;
            height: 70px;
            &.active,
            &.normal:hover {
                background: rgba(233, 4, 123, 1);
                border-radius: 8px;
                cursor: pointer;
                > div > p {
                    color: #fff;
                    &:last-child span {
                        color: #fff;
                    }
                }
            }
            &.disabled {
                cursor: not-allowed;
                > div > p {
                    color: #dedede;
                    &:nth-child(2) {
                        span {
                            color: #dedede;
                        }
                    }
                }
            }
            > div {
                width: 100%;
                height: 100%;
                padding: 10px;
                > p {
                    max-width: 50px;
                    line-height: 1;
                    overflow: hidden;
                    text-align: center;
                    &:nth-child(1) {
                        font-size: 14px;
                        padding-top: 4px;
                    }
                    &:nth-child(2) {
                        font-size: 12px;
                        padding-top: 14px;
                        span {
                            color: #ea037c;
                        }
                    }
                }
            }
        }
    }
}
</style>
