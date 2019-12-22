<template>
    <div class="showContent">
        <div class="topInfo">
            <span :class="`tag${v}`" v-for="(v,i) in datas.uniqueTypeCode" :key="i">{{tagName(v)}}</span>
            <span class="tag_sp" title v-if="datas.promotionLabel">{{datas.promotionLabel}}</span>
        </div>
        <div class="imgContent">
            <img :src="datas.cover" alt="商家未提供图片" v-noimg="'280-180'" />
        </div>
        <div class="messageContent">
            <div class="abroUI">
                <div
                    class="nameText"
                    :title="datas.nameCn||datas.nameEn"
                >{{datas.nameCn||datas.nameEn}}</div>
                <div class="message">
                    <span class="score">
                        <Rate class="comment small" allow-half disabled v-model="datas.score*1" />
                    </span>
                    <span class="type">{{datas.defaultLabel}}</span>
                </div>
            </div>
            <div class="sureDate">
                <span v-if="datas.confirmed">{{datas.confirmed | tranConfirmTime}}</span>
            </div>
            <div class="price" v-if="datas.price>0">
                <span class="yen">&yen;</span>
                <span class="num">{{datas.price}}</span>
                <span class="text">起</span>
            </div>
            <div class="price" v-if="datas.price==0" style="padding-top:4px;">
                <span class="text">暂无价格</span>
            </div>
            <div class="date" v-if="datas.minAdvanceDayStr">最早可订：{{datas.minAdvanceDayStr}}</div>
        </div>
    </div>
</template>

<script>
import { goodsType, resType } from '~/assets/js/play';
export default {
    name: 'GoodsPanle',
    props: ['datas'],
    data() {
        return {
        };
    },
    created() {
    },
    methods: {
        // 转义tagName
        tagName(v) {
            if (this.datas.resourceType === 'RESTAURANT') {
                switch (v) {
                    case '1':
                        return '团餐';
                    case '2':
                        return '套餐';
                    case '3':
                        return '订座';
                }
            } else {
                switch (v) {
                    case '1':
                        return '电子票';
                    case '2':
                        return '纸质票';
                    case '3':
                        return '邮寄票';
                }
            }
        },
    },
    filters: {
        // 转义确认小时
        tranConfirmTime(str) {
            let n = parseFloat(str);
            return n == 0 ? '立即确认' : n + '小时确认';
        },
    },
};
</script>

<style scoped lang="less">
.showContent {
    cursor: pointer;
    width: 283px;
    height: 366px;
    background: #fff;
    border: 1px solid rgb(224, 224, 224);
    position: relative;
    margin-bottom: 30px;
    &:hover {
        box-shadow: 0px 2px 16px 0px rgba(0, 0, 0, 0.15);
    }
    .topInfo {
        top: 0;
        width: 100%;
        position: absolute;
        color: #fff;
        background-image: linear-gradient(180deg, rgba(0, 0, 0, 0.34), rgba(0, 0, 0, 0));
        span {
            padding: 6px 7px;
            display: inline-block;
            margin-right: 4px;
        }
        .tag1 {
            background: #ea037c;
        }
        .tag2 {
            background: #ae50ff;
        }
        .tag3 {
            background: #00aaff;
        }
        .tag_sp {
            float: right;
            max-width: 154px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }
    .imgContent {
        width: 280px;
        height: 180px;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        img {
            max-width: 280px;
        }
    }
    .messageContent {
        padding: 6px 20px;
        .nameText {
            font-size: 14px;
            font-weight: 600;
            color: rgba(34, 34, 34, 1);
            line-height: 20px;
            height: 40px;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
        }
        .sureDate {
            span {
                background: rgba(0, 170, 255, 0.15);
                border-radius: 12px;
                padding: 4px 9px;
                color: #0196e0;
                display: inline-block;
                margin-bottom: 16px;
            }
        }
        .message {
            display: flex;
            align-items: center;
            height: 32px;
            .score {
                display: flex;
                align-items: center;
                .icon {
                    font-size: 20px;
                }
            }
            .type {
                display: inline-block;
                padding-left: 20px;
                color: #999;
            }
        }

        .price {
            color: #222;
            height: 27px;
            .yen {
                font-size: 16px;
                font-weight: bold;
                font-family: OswaldMedium;
            }
            .num {
                font-weight: bold;
                font-size: 18px;
                font-family: OswaldMedium;
            }
            .text {
                font-size: 14px;
                color: #777;
            }
        }
        .date {
            margin-top: 6px;
            color: #2fa600;
            font-size: 12px;
            font-weight: 400;
        }
    }
}
.showContent:hover {
    box-shadow: 0px 2px 16px 0px rgba(0, 0, 0, 0.15);
}
</style>
