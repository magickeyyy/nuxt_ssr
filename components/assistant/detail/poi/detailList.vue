<template>
    <div class="contents">
        <div class="pois" v-for="(item,index) in list" :key="index">
            <div class="img">
                <img
                    :src="item.poiImg===''?require('../../../../assets/public_img/no_img320-430.png'):item.poiImg"
                />
            </div>
            <div class="middle">
                <p class="title">{{item.poiTitle}}</p>
                <i class="iconfont iconweizhi iconColor"></i>
                <span class="location">{{item.poiLocation}}</span>
                <div class="expinfo">
                    <i class="iconfont iconster star"></i>
                    <span class="level">{{item.starLevel}} | 9.20分</span>
                    <span class="canShop">可采购</span>
                    <i class="iconfont iconbiaoqian"></i>
                </div>
                <div>
                    <span style="color: #111111;font-size:16px;font-family:OswaldMedium ;font-weight:500;">
                        ¥
                        <span class="special">{{item.poiPrice}}</span>
                    </span>
                    <span class="go">起</span>
                </div>
            </div>
            <div class="foots" @click="addAssistant">
                <span>
                    <i class="iconfont iconzengjia"></i>添加到行程
                </span>
            </div>
        </div>

        <NoData v-if="list.length <=0" />
    </div>
</template>


<script>
import NoData from '~/components/bus/noData';
export default {
    components: {
        NoData,
    },
    data() {
        return {
            show: false,
            textarea: '',
            showLength: 0,
            list: [
                {
                    poiImg: '',
                    poiTitle: '布格克劳斯塔普肯餐厅酒店',
                    poiLocation: '61 Quai De Grenelle',
                    poiStar: '',
                    poiPrice: 2998,
                    starLevel: '三星级',
                },
                {
                    poiImg: '',
                    poiTitle: '布格克劳斯塔普肯餐厅酒店',
                    poiLocation: '61 Quai De Grenelle',
                    poiStar: '',
                    poiPrice: 2998,
                    starLevel: '四星级',
                },
                {
                    poiImg: '',
                    poiTitle:
                        '布格克劳斯塔普肯餐厅酒店布格克劳斯塔普肯餐厅酒店布格克劳斯塔普肯餐厅酒店布格克劳斯塔普肯餐厅酒店',
                    poiLocation: '61 Quai De Grenelle',
                    poiStar: '',
                    poiPrice: 2998,
                    starLevel: '二星级',
                },
                {
                    poiImg: '',
                    poiTitle:
                        '布格克劳斯塔普肯餐厅酒店布格克劳斯塔普肯餐厅酒店布格克劳斯塔普肯餐厅酒店布格克劳斯塔普肯餐厅酒店',
                    poiLocation: '61 Quai De Grenelle',
                    poiStar: '',
                    poiPrice: 2998,
                    starLevel: '二星级',
                },
                
            ],
        };
    },
    methods: {
        addAssistant() {
            this.show = true;
        },
        cancel() {
            this.show = false;
            this.textarea = '';
            this.showLength = 0;
        },
        onOk() {},
        //textarea输入长度判断
        inputs(e) {
            this.showLength = e.length;
        },
    },
};
</script>

<style scoped lang="less">
.contents {
    width: 900px;
    margin: 0 auto;
    overflow: auto;

    .pois {
        float: left;
        width: 286px;
        height: 366px;
        background: rgba(255, 255, 255, 1);
        cursor: pointer;
        margin-bottom: 20px;
        margin-right: 18px;
        border: 1px solid rgba(228, 228, 228, 1);
        overflow: hidden;
        &:hover {
            box-shadow: 0px 2px 16px 0px rgba(0, 0, 0, 0.15);
        }
        &:nth-child(3n) {
            margin-right: 0px;
        }
        .img {
            width: 100%;
            height: 184px;
            overflow: hidden;
            text-align: center;
            background: #eee;
            img {
                width: 286px;
            }
        }
        .middle {
            padding: 10px;
            .title {
                font-size: 16px;
                font-weight: 600;
                color: rgba(34, 34, 34, 1);
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .location {
                font-size: 12px;
                font-weight: 400;
                color: rgba(130, 130, 130, 1);
            }
            .iconColor {
                color: #a3a3a3;
                width: 10px;
                height: 12px;
            }
            .expinfo {
                position: relative;
                .level {
                    font-size: 12px;
                    font-weight: 400;
                    color: rgba(153, 153, 153, 1);
                }
                .star {
                    width: 58px;
                    height: 12px;
                    color: #ec0286;
                }
                .canShop {
                    position: absolute;
                    color: #fff;
                    right: 0;
                    z-index: 10;
                    top: 6px;
                }
                .iconbiaoqian {
                    position: absolute;
                    color: #ec0286;
                    font-size: 64px;
                    right: -10px;
                    transform: translateY(-35%);
                }
            }

            .special {
                font-size: 26px !important;
            }
            .go {
                font-size: 14px;
                font-weight: 400;
                color: rgba(130, 130, 130, 1);
            }
        }
        .foots {
            margin-top: 10px;
            height: 38px;
            line-height: 38px;
            text-align: center;
            border-top: 1px dashed #eee;
            font-size: 16px;
            color: #afafaf;
            span {
                cursor: pointer;
                &:hover {
                    color: #ec0286;
                }
            }
            i {
                width: 12px;
                height: 12px;
            }
        }
    }
}
</style>