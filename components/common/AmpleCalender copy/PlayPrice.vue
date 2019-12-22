<template>
    <Dropdown trigger="custom" :visible="visible" @on-clickoutside="hide" placement="bottom-start">
        <FormItem :prop="$attrs.prop">
            <Input v-model="value" readonly :placeholder="$attrs.placeholder" @click.native="show"/>
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
                    <li v-for="(v,i) in list" :key="i" :class="[{'active':active(v)},{'disabled':!v.canBooking}]" @click="select(v,i)">
                        <div v-if="v.date">
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
    import { api_play } from '~/service/api'
    export default {
        props: {
            params: {
                type: Object,
                required: true
            },
            price: {
                type: Array,
                required: true
            },
            bookingDate: {
                type: String,
                required: true
            },
            type:{
                type: String,
                default: '1'
            }
        },
        data() {
            return {
                value: '',
                list:[],
                visible: false,
            };
        },
        mounted() {
            this.value = this.bookingDate;
            this.getLinkage(this.params);
        },
        methods: {
            show() {
                if(this.visible) return;
                this.visible = true;
            },
            hide() {
                if(!this.visible) return;
                this.visible = false;
            },
            changeMonth(n) {
                // 如果减1后的时间的那月1号比本地时间1号小，就拦截；如果+1后的请求成功了再修改标题和父级请求参数
                let time = new Date();
                let y = time.getFullYear();
                let m = time.getMonth();
                if(new Date(y,m,1).valueOf() > new Date(this.params.year,this.params.month+n-1,1).valueOf()) return;
                let date = new Date(this.params.year,this.params.month+n-1,1);
                let year = date.getFullYear();
                let month = date.getMonth() + 1;
                let data = {
                    ...this.params,
                    year,
                    month
                }
                this.getLinkage(data)
                    .then(res => {
                        if(res) {
                            this.$emit('update:params',{...this.params,year,month});
                        }
                    })
            },
            active(v) {
                if(v.date && v.canBooking && this.bookingDate === this.mixin_m_formatDate(new Date(this.params.year, this.params.month-1, v.date))) return true;
                return false;
            },
            select(v,i) {
                if(!v.date||!v.canBooking) return;
                let y = this.params.year;
                let m = this.params.month;
                if(m<10) {
                    m = '0'+m;
                }
                let d = v.date;
                if(d<10) {
                    d = '0'+d;
                }
                this.value = y+'-'+m+'-'+d;
                this.$emit('changeDate', v, this.value);
                // this.$emit('update:bookingDate',this.value);
                // this.$emit('update:price',[{...this.price[0],paymentPrice:v.paymentPrice,prepayPrice:v.prepayPrice}]);
                this.visible = false;
            },
            getLinkage(data) {
                // 默认餐厅
                let url = api_play.linkage;
                if(this.type !== '1') {
                    url = api_play.otherLinkage
                }
               return this.$axios.post(url,data,{custom:{token:true}})
                            .then(res=>{
                                if(res.success) {
                                    if(res.data.days) {
                                        this.list = this.formatPrice(res.data.year*1,res.data.month*1,res.data.days || []);
                                        return Promise.resolve(true)
                                    } else {
                                        return Promise.resolve(false)
                                    }
                                } else {
                                    return Promise.resolve(false)
                                }
                            })
            },
            //  目前所有价格都是按先后顺序排列，中间可能断开。每月第一天周几，不足的补齐{date:0}，有的还要转换数字格式
            formatPrice(year = new Date().getFullYear(), month = new Date().getMonth()+1,list = []) {
                let days = new Date(year, month, 0).getDate();
                let first = new Date(year, month-1, 1).getDay()||7;
                let arr = Array.from({ length: days },(v, i) => {
                    if(list.find(item=>item.date*1===i+1)) {
                        v = list.find(item=>item.date*1===i+1);
                        v.date = v.date*1;
                        v.day = v.day*1||7;
                        v.stock = v.stock*1;
                        v.paymentPrice = v.paymentPrice*1;
                        v.prepayPrice= v.prepayPrice*1;
                    } else {
                        v = {
                            date: i+1,
                            day:first+i%7||7
                        }
                    }
                    return v;
                });
                let arr2 = Array.from({length:first-1},v=>{
                    v={
                        date:0
                    }
                    return v;
                })
                arr.unshift(...arr2)
                return arr;
            },
        }
    };
</script>

<style scoped lang="less">
    @deep: ~'>>>';
    svg{
        cursor: pointer;
    }
    .ivu-dropdown{
        width:220px;
        @{deep}.ivu-dropdown-rel{
            .ivu-input{
                width:220px;
                height:40px;
                background:#fff;
                border:1px solid #dfdfdf;
                border-radius:2px;
                padding-right:44px;
                background: url('~assets/icon/icon_calendar_def.png') no-repeat 188px center;
                &:focus,&:hover{
                    box-shadow: inset 0 -1px 0 #E9047B;
                    border-bottom-color:#E9047B;
                    background-image: url('~assets/icon/icon_calendar_active.png');
                    cursor: pointer;
                }
            }
        }
        @{deep}.ivu-select-dropdown{
            background:#fff;
            box-shadow:0px 6px 16px 0px rgba(0, 0, 0, 0.2);
            border-radius:4px;
            width: 502px;
        }
        @{deep}.ivu-input-icon{
            right:30px;
            top:4px;
        }
    }
    .priceCalendar{
        padding: 0 6px;
        .head{
            display: flex;
            justify-content: space-between;
            padding: 0 30px;
            line-height: 50px;
            align-items: center;
            p{
                font-size:18px;
                font-weight:bold;
            }
            svg{
                width: 22px;
                height: 22px;
            }
        }
        .week{
            display: flex;
            justify-content: space-between;
            align-items: center;
            li{
                width: 70px;
                text-align: center;
                font-size: 14px;
                color:#999;
            }
        }
        .price{
            display: flex;
            flex-wrap: wrap;
            >li{
                width:70px;
                height:70px;
                &.active,&:not(.disabled):hover{
                    background:rgba(233,4,123,1);
                    border-radius:8px;
                    cursor: pointer;
                    >div >p{
                        color:#fff;
                        &:last-child span{
                            color:#fff;
                        }
                    }
                }
                &.disabled{
                    cursor: not-allowed;
                    >div>p{
                        color:#DEDEDE;
                        &:nth-child(2){
                            span{
                                color:#DEDEDE; ;
                            }
                        }
                    }
                }
                >div{
                    width: 100%;
                    height: 100%;
                    padding: 10px;
                    >p{
                        max-width: 50px;
                        line-height: 1;
                        overflow: hidden;
                        text-align: center;
                        &:nth-child(1){
                            font-size: 14px;
                            padding-top:4px;
                        }
                        &:nth-child(2){
                            font-size:12px;
                            padding-top:14px;
                            span{
                                color:#EA037C;
                            }
                        }
                    }
                }
            }
        }
    }
</style>
