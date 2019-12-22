// 默认注册步骤、当前在第一步且成功
<template>
    <div class="hisSteps">
        <div :class="['step',currentClass(i)]" v-for="(v,i) in steps" :key="i">
            <p>{{v.text}}</p>
            <div>{{i+1}}</div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        // 当前步骤
        current: {
            type: Object,
            required: true,
            default: 0
        }
    },
    data() {
        return {
            steps1: [
                {
                    text: '填写订单',
                    value: [0],

                },
                {
                    text: '支付订单',
                    value: [1],
                },
                {
                    text: '确认订单',
                    value: [2,4,5],
                },
                {
                    text: '获得voucher',
                    value: [6],
                },
            ],
            steps2: [
                {
                    text: '填写订单',
                    value: [0],
                },
                {
                    text: '支付订单',
                    value: [1],
                },
                {
                    text: '等待确认',
                    value: [2,4,5],
                },
                {
                    text: '获得voucher',
                    value: [6],
                },
            ],
            steps3: [
                {
                    text: '填写订单',
                    value: [0],
                },
                {
                    text: '支付订单',
                    value: [1],
                },
                {
                    text: '确认失败',
                    value: [2,4,5],
                },
                {
                    text: '获得voucher',
                    value: [3,6],
                },
            ],
        };
    },
    computed: {
        steps() {
            let current = this.current.value * 1;
            if(current < 2 || current == 6) {
                return this.steps1;
            } else if(current == 4 || current == 5 || current == 7) {
                return this.steps3;
            } else {
                return this.steps2;
            }
        },
    },
    methods: {
        currentClass(i) {
            let current = this.current.value * 1;
            if(current === 0 || current === 1) {
                if(i < current) return 'old';
                if(i === current) return 'current';
            } else if(current < 6 && current > 1 && current !== 3) {
                if(i < 2) return 'old';
                if(i === 2) {
                    if(current <4) return 'current';
                    return 'failed';
                };
            } else if(current === 6 || current === 3) {
                if(i < 3) return 'old';
                if(i === 3) return 'current';
            } else if(current === 7) {
                if(i < 2) return 'old';
                if(i === 2) return 'failed';
            }
        },
    },
};
</script>

<style scoped lang="less">
.hisSteps {
    // 步骤 <div class="steps"> <div class="step active"><p>填写订单</p><div>1</div></div></div>
    display: flex;
    justify-content: center;

    .step {
        display: flex;
        width: 210px;
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
            content: '';
            display: block;
            width: 160px;
            max-width: 160px;
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

    .step.current {
        div {
            background-color: #ea037c;
        }

        p {
            background-color: #ea037c;
            color: #fff;
        }

        p::after {
            content: '';
            display: block;
            border-top: 6px solid #ea037c;
            border-left: 6px solid transparent;
            border-right: 6px solid transparent;
            border-bottom: 6px solid transparent;
            position: absolute;
            left: 50%;
            margin-left: -6px;
            bottom: -12px;
        }

        div::after {
            border-color: #ea037c;
        }
    }
    .step.old {
        p {
            color: #ea037c;
        }
        div {
            background-color: #ea037c;
        }
        div::after {
            border-color: #ea037c;
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
            content: '';
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

    > div:last-child {
        div:after {
            display: none;
        }
    }
}
</style>
