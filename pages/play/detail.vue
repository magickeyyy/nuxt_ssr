<template>
    <div class="detailView" v-if="detail">
        <div class="navMessage">
            您在这里：
            <nuxt-link to="/play">玩乐首页</nuxt-link>&gt;
            <p @click="toList">{{goback()}}</p>&gt;
            <span style="color:#EC0286">{{detail.name}}</span>
        </div>
        <Top v-if="detail&&rate" :detail="detail" :rate="rate" :resourceType="$route.query.type*1" />
        <div class="moreInfo">
            <div class="anchorBox" v-sticky="{zIndex: 1000, stickyTop: 78}">
                <div ref="anchorBox">
                    <Anchor
                        :affix="false"
                        class="his anchor"
                        style="margin: 0 auto"
                        @on-select="activeLevel"
                    >
                        <AnchorLink
                            v-for="(v,i) in anchor"
                            :href="`?id=${$route.query.id}&type=${$route.query.type}&cityId=${$route.query.cityId}&countryId=${$route.query.countryId}#level${i}`"
                            :title="v==='点评'?v+'('+lengths+')':v"
                            :key="i"
                            :class="{'active':currentLevel===i}"
                        />
                    </Anchor>
                </div>
            </div>
            <component :is="curMiddle" :detail="detail" v-if="detail" />
            <div
                class="module"
                :id="detailInfo.resourceType==='RESTAURANT'?'level3':'level4'"
                v-if="detail&&rate"
            >
                <Comment
                    :resourceType="detailInfo.resourceType"
                    :resourceId="detailInfo.resourceId*1"
                    :rate="rate"
                    :getNum="setCoNum"
                />
            </div>
        </div>
    </div>
</template>

<script>
import Comment from '~/components/play/Comment';
import { API_PLAY } from '~/assets/api/play';
import { resType } from '~/assets/js/dictionary';
import Top from '~/components/play/detail/Top';
import TicketMiddle from '~/components/play/detail/TicketMiddle';
import ResMiddle from '~/components/play/detail/ResMiddle';
import ExpMiddle from '~/components/play/detail/ExpMiddle';
import { RESOURCE_TYPE } from '~/assets/js/play/index';

export default {
    layout(context) {
        return 'fixedNav';
    },
    components: {
        Comment,
        Top,
    },
    data() {
        return {
            //评论数量
            currentLevel: 0,
            lengths: 0,
            rate: {
                envScore: '5.0',
                serveScore: '5.0',
                tasteScore: '5.0',
                yohitripRatings: '5',
                yohitripSatisfaction: '0',
            },
            detail: null,
            urlQuery: '',
            owlRate: 4,
            degreeRate: 5,
            carouse: 0,
            anchor1: ['预定', '须知', '交通', '点评'],
            anchor2: ['预定', '详情', '须知', '交通', '点评'],
            detailInfo: {},
        };
    },
    computed: {
        curMiddle() {
            let type = this.$route.query.type;
            if (type == 'RESTAURANT') return ResMiddle;
            if (type == 'TICKETS') return TicketMiddle;
            if (type == 'CHARACTERISTIC_EXPERIENCE') return ExpMiddle;
            return ResMiddle;
        },
        anchor() {
            let type = this.$route.query.type;
            if (type == 'RESTAURANT') return this.anchor1;
            return this.anchor2;
        },
    },
    created() {
        this.getDetailInfo();
    },
    updated() {
        // this.fiexdAnchor();
    },
    methods: {
        activeLevel(i) {
            // 锚点激活
            let NUM = i.split('#')[1].replace(/level/gi, '');
            this.currentLevel = Number(NUM);
        },
        goback() {
            return RESOURCE_TYPE[this.$route.query.type];
        },
        fiexdAnchor() {
            this.$nextTick(() => {
                let a = this.$refs.anchorBox;
            });
        },
        // 去list页,要解决回去后资源类型相同
        toList() {
            this.mixin_m_SStorage('set', 'play_search', {
                cityCn: '',
                cityId: '',
                countryCn: '',
                countryId: this.$route.query.countryId,
                keywords: '',
                resourceType: this.$route.query.type,
                showCity: true,
                sort: 1,
            });
            this.$router.push({ name: 'play-list' });
        },
        setCoNum(data) {
            this.lengths = data;
        },
        getDetailInfo() {
            // 查询参数：资源ID、资源类型
            const list = ['餐厅', '门票', '特色体验'];
            this.detailInfo = {
                resourceId: this.$route.query.id,
                resourceType: this.$route.query.type,
                resourceTypeName: list[this.$route.query.type - 1],
            };
            this.getRate();
            this.getDetail();
        },
        getDetail() {
            let url = this.$route.query.type === 'RESTAURANT' ? API_PLAY.resDetail : API_PLAY.otherDetail;
            let resourceId = this.detailInfo.resourceId * 1;
            this.$axios({ ...url, params: { resourceId }, headers: { token: true } }).then(res => {
                if (res.success) {
                    if (res.data.description && res.data.description.length > 0) {
                        res.data.description = res.data.description.split(/[↵\f\n\r]/).filter(v => v);
                    } else {
                        res.data.descriptio = [];
                    }
                    if (res.data.reserveKnows && res.data.reserveKnows.length > 0) {
                        res.data.reserveKnows = res.data.reserveKnows.split(/[↵\f\n\r]/).filter(v => v);
                    } else {
                        res.data.reserveKnows = [];
                    }
                    if (res.data.transportationGuide && res.data.transportationGuide.length > 0) {
                        res.data.transportationGuide = res.data.transportationGuide.split(/[↵\f\n\r]/).filter(v => v);
                    } else {
                        res.data.transportationGuide = [];
                    }
                    this.detail = res.data;
                }
            });
        },
        getRate() {
            let resourceId = this.detailInfo.resourceId;
            this.$axios({ ...API_PLAY.rate, params: { resourceId } }).then(res => {
                if (res.success) {
                    this.rate = {};
                    Object.keys(res.data).map(v => {
                        this.rate[v] = res.data[v] * 1;
                    });
                }
            });
        },
    },
};
</script>

<style scoped lang="less">
@deep: ~'>>>';
.anchorBox, .anchorBox>div {
    background-color: #fafafa;
}
.anchorBox{
    height: 60px;
    border-bottom: 1px solid #ebebeb;
    margin: 0 auto;
}
.anchorBox>div{
    width: 1178px;
    margin: 0 auto;
}
.detailView {
    width: 1180px;
    max-width: 1180px;
    min-width: 1180px;
    margin: 118px auto 78px;
    .navMessage {
        display: flex;
        align-items: center;
        font-size: 14px;
        margin-bottom: 24px;
        a,
        p {
            color: #262626;
            cursor: pointer;
        }
        span {
            cursor: pointer;
        }
    }
    .moreInfo {
        background-color: #fff;
        margin-top: 16px;
        border: 1px solid #eaeaea;
        box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.03);
        .his.anchor {
            height: 58px;
            background-color: #fafafa;
            border: none;
            // border-top: 1px solid rgb(235, 235, 235);
            // border-bottom: 1px solid #ebebeb;
            @{deep}.ivu-anchor {
                display: flex;
                padding-left: 0;
                .ivu-anchor-link {
                    height: 58px;
                    width: 172px;
                    padding: 10px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    a {
                        color: #222;
                        font-size: 16px;
                        line-height: 20px;
                    }
                }
                .ivu-anchor-link.active {
                    background-image: linear-gradient(180deg, #ed0287 0, #ed0287 3px, #fff 3px, #fff 100%);
                    a {
                        color: #ed0287;
                    }
                }
                .ivu-anchor-ink:before {
                    display: none;
                }
            }
        }
        @{deep}.module {
            padding: 30px;
            overflow: auto;
            .ivu-btn-primary {
                width: 100px;
                height: 36px;
                border-radius: 4px;
                span {
                    border-radius: 4px;
                    font-size: 14px;
                    font-weight: bold;
                }
            }
            > h3 {
                font-size: 28px;
                font-weight: 600;
                color: #222;
                line-height: 108px;
                padding-top: 10px;
                span {
                    color: #999;
                }
            }
            .goods {
                margin: 16px 0;
                border: 1px solid rgb(247, 247, 247);
                .title {
                    background-color: rgb(250, 250, 250);
                    height: 50px;
                    border: 1px solid rgb(241, 242, 242);
                    padding-left: 34px;
                    font-size: 16px;
                    font-weight: bold;
                    color: #222;
                    line-height: 48px;
                }
                .contant {
                    padding: 0 30px;
                    .ivu-row {
                        padding: 30px 0;
                        display: flex;
                        align-items: center;
                        border-bottom: 1px dashed rgb(235, 235, 235);
                        .ivu-col-span-16,
                        .ivu-col-span-15 {
                            padding-right: 20px;
                            h3 {
                                font-size: 16px;
                                font-weight: bold;
                                color: #222;
                                line-height: 1;
                                padding-bottom: 10px;
                            }
                            p {
                                font-size: 14px;
                                color: #777;
                            }
                            .tags {
                                display: flex;
                                font-size: 14px;
                                color: #ec0286;
                                padding-top: 4px;
                                flex-wrap: wrap;
                                li {
                                    margin-right: 70px;
                                }
                            }
                        }
                        .ivu-col-span-12 {
                            padding: 0 20px;
                            > h3 {
                                font-size: 16px;
                                font-weight: bold;
                                color: #222;
                                line-height: 1;
                                padding-bottom: 10px;
                            }
                            > p {
                                font-size: 14px;
                                line-height: 24px;
                                color: #ec0286;
                                padding-top: 10px;
                            }
                            > ul li {
                                padding-bottom: 5px;
                                h3 {
                                    color: #222;
                                    font-weight: bold;
                                    font-size: 14px;
                                    line-height: 24px;
                                }
                                p {
                                    color: #777;
                                    font-size: 14px;
                                    line-height: 24px;
                                }
                            }
                        }
                        .img.ivu-col-span-3 {
                            flex-direction: row;
                            overflow-y: hidden;
                            img {
                                max-width: 130px;
                            }
                        }
                        .ivu-col-span-6 {
                            > div {
                                display: flex;
                            }
                            .prePay {
                                font-size: 14px;
                                color: #ec0286;
                                display: flex;
                                align-items: center;
                                div:nth-child(2) {
                                    font-size: 24px;
                                    font-family: OswaldMedium;
                                    font-weight: bold;
                                    span {
                                        font-size: 16px;
                                    }
                                }
                                div:last-child {
                                    color: #777;
                                }
                            }
                            .presentPay {
                                font-size: 14px;
                                color: #777;
                                display: flex;
                                align-items: center;
                            }
                        }
                        .ivu-col-span-3 {
                            display: flex;
                            flex-direction: row-reverse;
                            align-items: center;
                        }
                    }
                    .ivu-row:last-child {
                        border-bottom: none;
                    }
                }
            }
            .notice {
                margin-bottom: 28px;
                > h3 {
                    font-size: 16px;
                    color: #222;
                    line-height: 36px;
                    padding-bottom: 10px;
                }
                > p {
                    font-size: 14px;
                    color: #777;
                }
                .pre {
                    pre {
                        font-size: 14px;
                        color: #777;
                        line-height: 24px;
                    }
                }
                @{deep}.ivu-table-wrapper {
                    margin-top: 0px;
                    .ivu-table {
                        th {
                            background-color: rgb(250, 250, 250);
                            .ivu-table-cell {
                                width: 100%;
                                display: flex;
                                justify-content: center;
                                font-size: 14px;
                                color: #a3a3a3;
                            }
                        }
                    }
                    .ivu-table-border td {
                        .ivu-table-cell {
                            text-align: center;
                            font-size: 14px;
                            color: #222;
                        }
                    }
                    .ivu-table-body {
                        .ivu-table-row-hover td {
                            background-color: #fff;
                        }
                    }
                }
            }
            .google {
                float: left;
            }
            .trancText {
                max-width: 340px;
                float: left;
                margin-left: 92px;
                p {
                    font-size: 14px;
                    color: rgba(85, 85, 85, 1);
                }
            }
        }
    }
}
</style>
