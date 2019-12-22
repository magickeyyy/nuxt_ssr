<template>
    <div class="res">
        <!-- trafficInCity -->
        <i class="iconfont iconjiaotong" v-if="item.type==='trafficInCity'"></i>
        <!-- car -->
        <i class="iconfont iconcar1" v-if="item.type==='car'"></i>
        <!-- food -->
        <i class="iconfont iconmeishisvg" v-if="item.type==='food'"></i>
        <!-- hotel -->
        <i class="iconfont iconzhusu" v-if="item.type==='hotel'"></i>
        <!-- view -->
        <i class="iconfont iconjingdian" v-if="item.type==='view'"></i>
        <!-- experience -->
        <i class="iconfont icontiyan" v-if="item.type==='experience'"></i>
        <!-- shop -->
        <i class="iconfont icongouwu" v-if="item.type==='shop'"></i>
        <!-- traffic -->
        <i class="iconfont iconjiaotong" v-if="item.type==='traffic'"></i>
        <!-- Highlights -->
        <i class="iconfont iconliangdian" v-if="item.type==='Highlights'"></i>
        <!-- end -->
        <span class="typeName">{{checkName(item.type)}}</span>
        <span class="typeMessage">
            <!-- trafficInCity -->
            <span class="start" v-if="item.type==='trafficInCity'">大国大国大国</span>
            <i class="iconfont iconjiaotongfeiji" v-if="item.type==='trafficInCity'"></i>
            <span class="end" v-if="item.type==='trafficInCity'">大国大国大国</span>
            <!-- car -->
            <span class="start" v-if="item.type==='car'">{{checkCarType(item.carType)}}</span>
            <span class="number" v-if="item.type==='car'">{{item.number}}</span>
            <!-- end -->
            <span class="name">{{item.name}}</span>
        </span>

        <div class="option">
            <i
                class="iconfont iconmore"
                v-if="!show"
                :data-tag="key+'_showOption'"
                @click="showOption"
            ></i>
            <i class="iconfont iconedit" v-if="show">
                <span style="font-size:14px" @click="edit">编辑</span>
            </i>
            <i class="iconfont iconqingchu" v-if="show" @click="del"></i>
        </div>
    </div>
</template>

<script>
import { classType, carTypes } from '../../../../assets/js/assistant';

export default {
    props: ['item', 'setResKeyTemp', 'delItem'],
    data() {
        return {
            show: false,
            key: Math.floor(Math.random() * 10000000),
        };
    },
    methods: {
        checkName(data) {
            return classType[data];
        },
        checkCarType(data) {
            return carTypes[data];
        },
        showOption() {
            setTimeout(() => {
                this.show = true;
                this.setResKeyTemp(this.key);
            }, 0);
        },
        hideOption() {
            this.show = false;
        },
        edit() {
            window.event ? (window.event.cancelBubble = true) : e.stopPropagation();
        },
        del() {
            window.event ? (window.event.cancelBubble = true) : e.stopPropagation();
            this.$Modal.confirm({
                title: '确认删除该条记录？',
                onOk: () => {
                    this.delItem(this.item.id);
                },
                onCancel: () => {},
            });
        },
    },
};
</script>

<style scoped lang="less">
.res {
    background: #fff;
    padding: 34px;
    margin: 20px 0;
    .option {
        float: right;
        padding-top: 8px;
        font-size: 14px;
        color: #dddddd;
        .iconfont {
            font-size: 20px;
            color: #dddddd;
            &:hover {
                cursor: pointer;
                color: #ed0287;
            }
        }
    }

    .iconjiaotong,
    .iconcar1 {
        font-size: 26px;
        color: #ed0287;
        vertical-align: sub;
    }
    .iconliangdian {
        font-size: 26px;
        color: #55b028;
        vertical-align: sub;
    }
    .icongouwu {
        font-size: 26px;
        color: #20d6a5;
        vertical-align: sub;
    }
    .icontiyan {
        font-size: 26px;
        color: #58cb2b;
        vertical-align: sub;
    }
    .iconjingdian {
        font-size: 26px;
        color: #ff9a2d;
        vertical-align: sub;
    }
    .iconmeishisvg {
        font-size: 26px;
        color: #56bbf5;
        vertical-align: sub;
    }
    .iconzhusu {
        font-size: 26px;
        color: #f252e8;
        vertical-align: sub;
    }
    .typeName {
        display: inline-block;
        color: #999999;
        font-size: 14px;
        margin-left: 10px;
    }
    .typeMessage {
        margin-top: -4px;
        vertical-align: text-top;
        width: 350px;
        color: #111111;
        font-size: 16px;
        display: inline-block;
        position: relative;
        margin-left: 10px;
        .iconjiaotongfeiji,
        .iconjiaotonghuoche {
            margin-left: 10px;
            position: absolute;
            font-size: 120px;
            transform: translateY(-44%);
            color: #bababa;
        }
        .number {
            display: inline-block;
            text-align: center;
        }
        .end {
            margin-left: 144px;
        }
        .name {
            color: #111111;
            font-size: 16px;
        }
    }
}
</style>
