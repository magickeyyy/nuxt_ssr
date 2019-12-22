<template>
    <div class="playDetailTop">
        <div class="title">
            <h3>{{detail.name}}</h3>
            <!-- <div>
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#iconwanle_shoucangnor" />
                </svg>
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#iconwanle_shoucanghov" />
                </svg>
                <span>收藏</span>
            </div>-->
        </div>
        <div class="reputation">
            <!-- <div class="owl" v-if="rate.tripadvisorRatings">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#iconwanle_maotuyinglogo" />
                    </svg>
                    <span>评分{{rate.tripadvisorRatings}}</span>
                    <Rate disabled allow-half v-model="rate.tripadvisorRatings" />
            </div>-->
            <div class="degree">
                <Rate disabled allow-half :value="Number(rate.yohitripRatings)" class="comment small" />
                <span>&nbsp; 满意度{{rate.yohitripRatings*20||0}}%</span>
            </div>
        </div>
        <div class="position">
            <svg class="icon" aria-hidden="true">
                <use xlink:href="#iconCity" />
            </svg>
            <span>{{detail.address}}</span>
        </div>
        <ul class="table">
            <li class="cell" v-for="(item,index) in detail.labels" :key="index">
                <div class="title">{{item.labelName}}</div>
                <div class="contant" v-if="item.labelContentNames">
                    <p v-for="(v,i) in item.labelContentNames" :key="i">{{v}}</p>
                </div>
            </li>
            <li class="cell" v-if="detail.resourceType=='RESTAURANT'&&detail.seatNo">
                <div class="title">座位数量</div>
                <div class="contant">{{detail.seatNo}}</div>
            </li>
            <li class="cell" v-if="detail.confirmTime">
                <div class="title">确认时效</div>
                <div class="contant" style="color:#EC0286;">{{detail.confirmTime}}</div>
            </li>
            <li
                class="cell"
                v-if="detail.businessHourInfoList&&detail.businessHourInfoList.length>0"
            >
                <div class="title">营业时间</div>
                <div class="contant">
                    <p
                        v-for="(v,i) in detail.businessHourInfoList"
                        :key="i"
                    >周{{v.days=='0'?7:v.days}}&nbsp;{{v.startTime}}-{{v.endTime}}</p>
                </div>
            </li>
        </ul>
        <div class="introduce">
            <!-- <pre>{{detail.description}}</pre> -->
            <p v-for="(v,i) in detail.description" :key="i">{{v}}</p>
        </div>
        <Carousel
            v-if="detail.images&&detail.images.length>0"
            :arrow="detail.images.length>1?'hover':'never'"
            loop
        >
            <CarouselItem v-for="v in detail.images" v-model="carouse" :key="v">
                <div class="imgbox">
                    <img :src="v" alt="暂无图片" v-noimg="'1120-430'" />
                </div>
            </CarouselItem>
        </Carousel>
    </div>
</template>

<script>
import { Confirms } from '~/assets/js/play';
export default {
    name: 'Top',
    props: {
        detail: {
            type: Object,
            required: true,
            default: () => {},
        },
        rate: {
            type: Object,
            required: true,
            default: () => {},
        },
        resourceType: {
            type: [Number, String],
            required: true,
        },
    },
    data() {
        return {
            carouse: 0,
        };
    },
    created() {
    },
};
</script>

<style scoped lang="less">
@deep: ~'>>>';
.playDetailTop {
    padding: 30px;
    background: #fff;
    border: 1px solid rgb(234, 234, 234);
    box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.03);
    .ivu-carousel {
        width: 1120px;
        height: 430px;
    }
    > .title {
        display: flex;
        justify-content: space-between;
        line-height: 28px;
        color: #222;
        padding-bottom: 20px;
        h3 {
            font-size: 28px;
            font-weight: bold;
        }
        div {
            font-size: 16px;
        }
    }
    .reputation {
        display: flex;
        font-size: 12px;
        .owl {
            display: flex;
            align-items: center;
            margin-right: 28px;
            svg {
                width: 25px;
                height: 25px;
            }
            span {
                color: #0caa86;
                font-weight: bold;
                display: block;
                margin: 0 4px;
            }
        }
        .degree {
            display: flex;
            align-items: center;
        }
    }
    .position {
        font-size: 14px;
        color: #777;
        padding: 23px 0 29px;
        display: flex;
        align-items: center;
        border-bottom: 1px dashed rgb(235, 235, 235);
        span {
            display: inline-block;
            padding-left: 6px;
        }
    }
    .table {
        padding-bottom: 30px;
        border-bottom: 1px dashed rgb(235, 235, 235);
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        .cell {
            display: flex;
            justify-content: space-between;
            padding-top: 20px;
            width: 542px;
            font-size: 14px;
            .title {
                margin-right: 20px;
                color: #999999;
                width: 64px;
            }
            .contant {
                width: 542px-84;
                display: flex;
                flex-wrap: wrap;
                p {
                    padding-right: 20px;
                    color: #222;
                }
            }
        }
    }
    .introduce {
        font-size: 14px;
        color: #222;
        line-height: 26px;
        padding: 25px 0 29px;
        text-indent: 28px;
    }
    @{deep}.ivu-carousel-dots {
        display: none;
    }
    .imgbox {
        width: 1120px;
        height: 430px;
        overflow: hidden;
        text-align: center;
        img {
            max-width: 1120px;
        }
    }
}
</style>
