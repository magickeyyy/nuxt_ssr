<template>
    <div :class="['orderSteps',{team:scene==='GROUP'&&!this.step[1]},{scattered:scene!=='GROUP'&&!this.step[1]},{default:this.step[1]}]"
         v-if="visible">
        <div :class="['step',currentClass(v.state, i)]" v-for="(v,i) in steps" :key="i">
            <p>{{v.text}}</p>
            <div>{{v.index}}</div>
        </div>
    </div>
</template>

<script>
    import { HotelOrderStatus } from '~/assets/js/hotel'
    export default {
        props: {
            scene: {
                // 酒店分团组:GROUP和散客:
                type: String,
                required: true,
            },
            step: {
                // 第一个是订单状态，第二个是进度条可能在订单详情样式不一样
                type: Array,
                required: true
            }
        },
        data() {
            return {
                // 部分订单状态好巧是没有的，退款相关状态不要步骤条
                visible: true,
                // 远海、团房
                steps: [],
                steps1:[
                    {
                        text: '填写订单',
                        state: 1,
                        index: 1,
                    },
                    {
                        text: '支付订单',
                        state: 1,  
                        index: 2,
                    },
                    {
                        text: '确认成功',
                        state: 1,
                        index: 3,
                    },
                    {   
                        text: '提交分房名单',
                        state: 1,
                        index: 4,
                    },
                    {
                        text: '获得voucher',
                        state: 1,
                        index: 5,
                    }
                ],
                // 好巧、散客酒店
                steps2: [
                    {
                        text: '填写订单',
                        state: 1,
                        index: 1,
                    },
                    {
                        text: '支付订单',
                        state: 1,  
                        index: 2,
                    },
                    {   
                        text: '预定成功',
                        state: 1,
                        index: 3,
                    },
                    {
                        text: '获得voucher',
                        state: 1,
                        index: 4,
                    },
                ]
            }
        },
        created() {
            this.formatStep();
        },
        methods: {
            formatStep() {
                if(this.scene === 'GROUP') {
                    switch(this.step[0]) {
                        case HotelOrderStatus[0].value:
                            break;
                        case HotelOrderStatus[1].value:
                            this.steps1[1].text = "支付成功";
                            break;
                        case HotelOrderStatus[2].value:
                            this.steps1[1].text = "支付成功";
                            break;
                        case HotelOrderStatus[3].value:
                            this.steps1[1].text = "支付成功";
                            break;
                        case HotelOrderStatus[4].value:
                            this.steps1[1].text = "支付成功";
                            break;
                        case HotelOrderStatus[10].value:
                            this.steps1[1].text = "支付失败";
                            break;
                        case 1:
                            break;
                        default:
                            this.visible = false;
                    }
                    this.steps = this.steps1;
                } else {
                    switch(this.step[0]) {
                        case HotelOrderStatus[0].value:
                            break;
                        case HotelOrderStatus[1].value:
                            this.steps2[1].text = "支付成功";
                            break;
                        case HotelOrderStatus[3].value:
                            this.steps2[1].text = "支付成功";
                            break;
                        case HotelOrderStatus[4].value:
                            this.steps2[1].text = "支付成功";
                            break;
                        case HotelOrderStatus[10].value:
                            this.steps2[1].text = "支付失败";
                            break;
                        default:
                            this.visible = false;
                    }
                    this.steps = this.steps2;
                }
            },
            currentClass(n, i) {
                if(this.scene === 'GROUP') {
                    switch(this.step[0]) {
                        case 1:
                            if(i === 0) {
                                return 'success';
                            }
                            break;
                        case 2:
                            if(i < 2) {
                                return 'success';
                            }
                            break;
                        case HotelOrderStatus[0].value:
                            if(i < 2) {
                                return 'success';
                            }
                            break;
                        case HotelOrderStatus[1].value:
                            if(i < 2) {
                                return 'success';
                            }
                            break;
                        case HotelOrderStatus[2].value:
                            if(i < 3) {
                                return 'success';
                            }
                            break;
                        case HotelOrderStatus[3].value:
                            return 'success';
                        case HotelOrderStatus[4].value:
                            return 'success';
                        case HotelOrderStatus[10].value:
                            if(i === 0) {
                                return 'success';
                            } else if( i === 1) {
                                return 'failed';
                            }
                            break;
                    }
                } else {
                    switch(this.step[0]) {
                        case 1:
                            if(i === 0) {
                                return 'success';
                            }
                            break;
                        case 2:
                            if(i < 2) {
                                return 'success';
                            }
                            break;
                        case HotelOrderStatus[0].value:
                            if(i < 2) {
                                return 'success';
                            }
                            break;
                        case HotelOrderStatus[1].value:
                            if(i < 2) {
                                return 'success';
                            }
                            break;
                        case HotelOrderStatus[3].value:
                            return 'success';
                        case HotelOrderStatus[4].value:
                            return 'success';
                        case HotelOrderStatus[10].value:
                            if(i === 0) {
                                return 'success';
                            } else if( i === 1) {
                                return 'failed';
                            }
                            break;
                    }
                }
            }
        }
    };
</script>

<style scoped lang="less">
    .scattered{
        box-shadow:0px 1px 5px 0px rgba(0, 0, 0, 0.03);
        border-radius:6px;
    }
    .team{
        box-shadow:0px 1px 5px 0px rgba(0, 0, 0, 0.03);
        border-radius:6px;
    }
    .default{
        justify-content: center;
        height:160px;
    }
    .orderSteps {
        display: flex;
        align-items: center;
        height:160px;
        background:#fff;
        .step {
            display: flex;
            width: 180px;
            flex-direction: column;
            align-items: center;

            div {
                line-height: 32px;
                width: 32px;
                border-radius: 50%;
                color: #fff;
                text-align: center;
                background-color: rgb(215, 215, 215);
                position: relative;
            }

            div::after {
                content: "";
                display: block;
                width: 130px;
                max-width: 180px;
                min-width: 100px;
                border-bottom: 2px dashed rgb(215, 215, 215);
                position: absolute;
                top: 50%;
                left: 42px;
            }

            p {
                line-height: 32px;
                border-radius: 16px;
                font-size: 16px;
                padding: 0 18px;
                color: rgb(215, 215, 215);
                position: relative;
                margin-bottom: 12px;
            }
        }

        .step.success {
            div {
                background-color: #EA037C;
            }

            p {
                background-color: #EA037C;
                color: #fff;
            }

            p::after {
                content: "";
                display: block;
                border-top: 6px solid #EA037C;
                border-left: 6px solid transparent;
                border-right: 6px solid transparent;
                border-bottom: 6px solid transparent;
                position: absolute;
                left: 50%;
                margin-left: -6px;
                bottom: -12px;
            }

            div::after {
                border-color: #EA037C;
            }
        }
        .step.def{
            p {
                color: #EA037C;
            }
            div {
                background-color: #EA037C;
            }
            div::after {
                border-color: #EA037C;
            }
        }
        .step.failed {
            div {
                background-color: #333;
            }

            p {
                background-color: #333;
                color: #fff;
            }

            p::after {
                content: "";
                display: block;
                border-top: 6px solid #333;
                border-left: 6px solid transparent;
                border-right: 6px solid transparent;
                border-bottom: 6px solid transparent;
                position: absolute;
                left: 50%;
                margin-left: -6px;
                bottom: -12px;
            }

            div::after {
                border-color: #333;
            }
        }

        >div:last-child {
            div:after {
                display: none;
            }
        }
    }
</style>
