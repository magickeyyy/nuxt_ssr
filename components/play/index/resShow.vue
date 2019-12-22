<template>
    <div class="showContent" @click="toDdetail">
        <div class="topInfo" v-if="datas.types||datas.type||datas.promotionTag">
            <span :class="[tagClass(v),'tag']" v-for="(v,i) in list" :key="'tag'+i">{{tagLabel(v)}}</span>
            <span class="tag_sp" v-if="datas.promotionTag">{{datas.promotionTag}}</span>
        </div>
        <div class="imgContent">
            <img :src="datas.coverImg" alt="加载失败" v-noimg="'280-180'" />
        </div>
        <div class="messageContent">
            <div class="abroUI">
                <div class="nameText" :title="datas.name">{{datas.name}}</div>
                <div class="message">
                    <span class="score">
                        <Rate
                            class="comment small"
                            allow-half
                            disabled
                            :value="Number(datas.rating)"
                        />
                    </span>
                    <span class="type">{{datas.tag}}</span>
                </div>
            </div>
            <span class="sureDate" v-if="datas.confirmTime !=='0'">{{datas.confirmTime}}小时确认</span>
            <span class="sureDate" v-if="datas.confirmTime ==='0'">立即确认</span>
            <div class="price" v-if="datas.lowestPrice&&datas.lowestPrice>0">
                <span class="yen">&yen;</span>
                <span class="num">{{datas.lowestPrice}}</span>
                <span class="text">起</span>
            </div>
            <div
                class="price"
                v-if="!datas.lowestPrice||datas.lowestPrice==0"
                style="padding-top:4px;"
            >
                <span class="text">暂无价格</span>
            </div>
            <div
                class="date"
                v-if="datas.earliestCanBookDatetime"
            >最早可订：{{mixin_m_formatDate(datas.earliestCanBookDatetime.split(' ')[0], 'xxxx年xx月xx日')}}</div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'resShow',
    props: {
        datas: {
            type: Object,
            required: true,
        },
        type: {
            type: Number,
            required: true,
        },
    },
    computed: {
        list() {
            if (this.type === 1) return this.datas.type ? this.datas.type.split(',') : [];
            return this.datas.types || [];
        },
    },
    data() {
        return {
            resourceLabel: {
                ticket: {
                    E_TICKET: '电子票',
                    PAPER_TICKET: '纸质票',
                    POSTAL_TICKET: '邮寄票',
                    '1': '电子票',
                    '2': '纸质票',
                    '3': '邮寄票',
                },
                restaruant: {
                    TEAM_MEAL: '团餐',
                    SET_MEAL: '套餐',
                    SUBSTITUTION_SEATS: '订座',
                    '1': '团餐',
                    '2': '套餐',
                    '3': '代订座',
                },
            },
            resourceClass: {
                ticket: {
                    E_TICKET: 'tag1',
                    PAPER_TICKET: 'tag2',
                    POSTAL_TICKET: 'tag3',
                    '1': 'tag1',
                    '2': 'tag2',
                    '3': 'tag3',
                },
                restaruant: {
                    TEAM_MEAL: 'tag1',
                    SET_MEAL: 'tag2',
                    SUBSTITUTION_SEATS: 'tag3',
                    '1': 'tag1',
                    '2': 'tag2',
                    '3': 'tag3',
                },
            },
        };
    },
    methods: {
        toDdetail() {
            this.$nuxt.$router.push({
                name: 'play-detail',
                query: {
                    id: this.datas.id * 1,
                    type: this.datas.resourceType,
                    cityId: this.datas.cityId,
                    countryId: this.datas.countryId,
                },
            });
        },
        tagLabel(key) {
            if (!key) return '';
            if (this.datas.resourceType === 'RESTAURANT') {
                return this.resourceLabel.restaruant[key];
            } else {
                return this.resourceLabel.ticket[key];
            }
        },
        tagClass(key) {
            if (!key) return '';
            if (this.datas.resourceType === 'RESTAURANT') {
                return this.resourceClass.restaruant[key];
            } else {
                return this.resourceClass.ticket[key];
            }
        },
    },
};
</script>

<style scoped lang="less">
.showContent {
    cursor: pointer;
    width: 283px;
    height: 366px;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(224, 224, 224, 1);
    position: relative;
    margin-bottom: 30px;
    .topInfo {
        background: linear-gradient(180deg, rgba(0, 0, 0, 0.34), rgba(0, 0, 0, 0));
        top: 0;
        width: 100%;
        position: absolute;
        color: #fff;
        span {
            padding: 6px 7px;
            display: inline-block;
        }
        .tag {
            margin-right: 2px;
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
        height: 180px;
        overflow: hidden;
        img {
            width: 100%;
        }
    }
    .messageContent {
        padding: 6px 20px;
        .abroUI {
            height: 72px;
        }
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
            background: rgba(0, 170, 255, 0.15);
            border-radius: 12px;
            padding: 4px 9px;
            color: #0196e0;
            display: inline-block;
            margin-bottom: 10px;
        }
        .message {
            .score {
                .icon {
                    font-size: 20px;
                }
            }
            .type {
                color: #999;
                vertical-align: middle;
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
