<template>
    <div class="setpsContent">
        <div :class="['busSteps',currentClass(i)]" v-for="(it, i) in step" :key="i">
            <div class="text">{{it}}</div>
            <div class="number">{{i+1}}</div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Steps',
    props: ['index',"orderStatus"],
    data() {
        return {
            step: ['填写订单', '支付订单', this.orderStatus!==undefined?'确认完成':'等待确认', '获得Final'],
        };
    },
    methods: {
        currentClass(i) {
            if (i < this.index) {
                return 'busSteps_over';
            }
            if (i === this.index) {
                return 'busSteps_active';
            }
        },
    },
};
</script>

<style scoped lang="less">
.setpsContent {
    width: 900px;
    margin: 39px auto 53px 89px;
    
    .busSteps {
        float: left;
        width: 194px;
        .text {
            font-size: 16px;
            color: #dbdbdb;
        }
        .number {
            margin-top: 14px;
            transform: translateX(50%);
            font-size: 14px;
            font-weight: bold;
            width: 32px;
            height: 32px;
            font-family: OswaldMedium;
            background: #dbdbdb;
            border-radius: 50%;
            color: #fff;
            line-height: 32px;
            text-align: center;
            position: relative;
            &::after {
                content: ' ';
                width: 153px;
                height: 1px;
                display: block;
                border-bottom: 2px dashed #dbdbdb;
                position: absolute;
                margin-top: -50%;
                left: 36px;
            }
        }
    }
    .busSteps:last-child {
        .number {
            &::after {
                display: none;
            }
        }
    }
    .busSteps_active {
        .text {
            font-size: 16px;
            color: #fff;
            z-index: 10;
            position: relative;
            
            &::after {
                content: ' ';
                width: 102px;
                height: 30px;
                position: absolute;
                background: #ed0287;
                display: inline-block;
                border-radius: 15px;
                left: 0;
                margin-left: -10%;
                margin-top: -3px;
                z-index: -1;
                
            }
            &:before {
                content: '';
                display: block;
                border-top: 6px solid #ea037c;
                border-left: 6px solid transparent;
                border-right: 6px solid transparent;
                border-bottom: 6px solid transparent;
                position: absolute;
                left: 32px;
                margin-left: -6px;
                bottom: -15px;
            }
        }
        .number {
            background: #ed0287;
            &::after {
                border-bottom: 2px dashed #ed0287;
            }
        }
    }
    .busSteps_over {
        // padding-bottom: 53px;
        .text {
            font-size: 16px;
            color: #ed0287;
            font-weight: bold;
        }
        .number {
            background: #ed0287;
            &::after {
                border-bottom: 2px dashed #ed0287;
            }
        }
    }
}
</style>
