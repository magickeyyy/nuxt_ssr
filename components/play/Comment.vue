<template>
    <div class="comComment">
        <h3>
            点评
            <span>({{records.length}}条)</span>
        </h3>
        <div class="dining" v-if="resourceType==='RESTAURANT'">
            <div class="left">
                <div>
                    <span>
                        {{rate.yohitripRatings*20}}
                        <span style="font-size: 18px">%</span>
                    </span>&nbsp;
                    <Rate
                        class="comment normal"
                        allow-half
                        disabled
                        :value="Number(rate.yohitripRatings)"
                    />
                </div>
                <p>来自游海{{records.length}}条点评</p>
            </div>
            <div class="right">
                <ul>
                    <li>
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#iconwanlexiangqing_kouwei" />
                        </svg>
                        &emsp;
                        <span class="text">口味</span>
                        &emsp;&emsp;
                        <Rate class="comment small" disabled allow-half v-model="rate.tasteScore" />
                    </li>
                    <li>
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#iconwanlexiangqing_huanjing" />
                        </svg>
                        &emsp;
                        <span class="text">环境</span>
                        &emsp;&emsp;
                        <Rate class="comment small" disabled allow-half v-model="rate.envScore" />
                    </li>
                    <li>
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#iconwanlexiangqing_fuwu" />
                        </svg>
                        &emsp;
                        <span class="text">服务</span>
                        &emsp;&emsp;
                        <Rate class="comment small" disabled allow-half v-model="rate.serveScore" />
                    </li>
                </ul>
            </div>
        </div>
        <div class="other" v-else>
            <span>
                {{rate.yohitripRatings*20}}
                <span>%</span>
            </span>&emsp;
            <Rate class="comment normal" disabled :value="Number(rate.yohitripRatings)" />&emsp;
            <p>来自游海{{records.length}}条点评</p>
        </div>
        <ul class="list">
            <li v-for="(it,i) in records" :key="i">
                <h3>{{it.username}}</h3>
                <div class="comment">
                    <Rate class="comment small" allow-half disabled v-model="it.total" />
                    <p v-if="resourceType==='RESTAURANT'">&emsp;口味：{{it.tasteScore}}&emsp;&emsp;</p>
                    <p v-if="resourceType==='RESTAURANT'">环境：{{it.serveScore}}&emsp;&emsp;</p>
                    <p v-if="resourceType==='RESTAURANT'">服务：{{it.envScore}}</p>
                </div>
                <div class="text">{{it.content}}</div>
                <div class="time">{{it.commentDatetime}}</div>
            </li>
        </ul>
        <Page
            v-if="total>0"
            class="his"
            prev-text="上一页"
            next-text="下一页"
            :total="total"
            @on-change="changePage"
        />
    </div>
</template>

<script>
import { api_play } from '~/service/api';
export default {
    data() {
        return {
            records: [],
            pageNo: 1,
            pageSize: 5,
            total: 0,
        };
    },
    props: {
        resourceId: {
            type: Number,
            required: true,
        },
        rate: {
            yohitripSatisfaction: 5,
            yohitripRatings: 5,
            envScore: 5,
            serveScore: 5,
            tasteScore: 5,
            score: 5,
        },
        resourceType: {
            type: String,
            required: true,
        },
        getNum: {
            type: Function,
            required: true,
        },
    },
    created() {
        this.getRate();
    },
    methods: {
        getRate() {
            let params = {
                resourceId: this.resourceId,
                pageNo: this.pageNo,
                pageSize: this.pageSize,
            };
            this.$axios.post(api_play.commentList, params).then(res => {
                if (res.success) {
                    if (this.resourceType == 'RESTAURANT') {
                        this.records = res.data.records.map(v => {
                            v['total'] =
                                ((v.tasteScore ? v.tasteScore * 1 : 0) +
                                    (v.serveScore ? v.serveScore * 1 : 0) +
                                    (v.envScore ? v.envScore * 1 : 0)) /
                                3;
                            return v;
                        });
                    } else {
                        this.records = res.data.records.map(v => {
                            v['total'] = v.score ? v.score * 1 : 0;
                            return v;
                        });
                    }
                    this.total = res.data.total * 1;
                    this.getNum(this.total);
                }
            });
        },
        changePage(n) {
            this.pageNo = n;
            this.getRate();
        },
    },
};
</script>

<style scoped lang="less">
.comComment {
    > h3 {
        font-size: 28px;
        font-weight: 600;
        color: #222;
        padding-bottom: 50px;
        line-height: 1;
        span {
            color: #999;
            font-weight: lighter;
        }
    }
    .other {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 40px 0;
        > span {
            font-size: 40px;
            font-family: OswaldMedium;
            color: #ed0287;
            > span {
                font-size: 20px;
            }
        }
        > p {
            font-size: 14px;
            color: #999;
        }
    }
    .dining {
        display: flex;
        padding-bottom: 40px;
        border-bottom: 1px dashed rgb(235, 235, 235);
        .left {
            width: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            > div {
                display: flex;
                align-items: center;
                font-size: 40px;
                font-family: OswaldMedium;
                font-weight: 500;
                color: #ed0287;
            }
            > p {
                font-size: 14px;
                color: #999;
                padding-top: 22px;
            }
        }
        .right {
            width: 50%;
            display: flex;
            justify-content: space-around;
            border-left: 1px solid rgb(239, 239, 239);
            li {
                display: flex;
                align-items: center;
            }
            .text {
                font-size: 14px;
                color: #555555;
            }
        }
    }
    .list {
        > li {
            padding: 25px 0 26px;
            border-bottom: 1px dashed rgb(235, 235, 235);
            position: relative;
            > h3 {
                font-size: 18px;
                font-weight: 600;
                color: rgb(34, 34, 34);
            }
            > .comment {
                display: flex;
                color: #999;
                font-size: 14px;
                padding: 10px 0 20px;
                p {
                    line-height: 30px;
                }
            }
            .text {
                font-size: 14px;
                color: #555;
            }
            .time {
                position: absolute;
                right: 34px;
                top: 34px;
                font-size: 12px;
                color: #999;
            }
        }
    }
    .his {
        margin-top: 20px;
    }
}
</style>
