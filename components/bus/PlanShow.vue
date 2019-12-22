<template>
    <div class="planlists">
        <div class="item" v-for="(it, i) in showList" :key="i">
            <div class="head">
                <span class="day">D{{i+1}}</span>
                <span class="date">{{it.routeDate}} &nbsp;&nbsp;&nbsp; {{it.week}}</span>
            </div>
            <div class="content">
                <div class="country">国&#12288;&#12288;家：{{it.arrivalLocation}}</div>
                <div class="city">城&#12288;&#12288;市：{{it.arrivalCity}}</div>
                <div class="contentText">
                    游览内容：
                    <span>{{it.tourContent}}</span>
                </div>
            </div>
        </div>
        <div class="item" v-if="listData.length <=2 || isExport">
            <div class="head">
                <span class="day">END</span>
            </div>
        </div>
        <div class="item" v-if="listData.length >2 && !isExport">
            <div class="head">
                <span class="day">
                    <i
                        class="iconfont iconzhankai"
                        style="font-size: 12px;vertical-align: text-top"
                    />
                </span>
                <span class="exportMore" @click="exportBtn">展开更多行程</span>
            </div>
        </div>
    </div>
</template>

<script>
import moment from 'moment';
moment.locale('zh-cn');
export default {
    name: '',
    props: ['orderRouteVOS'],
    data() {
        return {
            isExport: false,
            showList: [],
            listData: [],
        };
    },
    created() {
        this.listData = this.orderRouteVOS;
        this.listData.map((item, index) => {
            item.week = moment(item.routeDate).format('dddd');
        });
        if (this.listData.length > 2) {
            this.showList = this.listData.slice(0, 2);
        } else {
            this.showList = this.listData;
        }
    },
    methods: {
        exportBtn() {
            this.isExport = true;
            this.showList = this.listData;
        },
    },
};
</script>

<style scoped lang="less">
.planlists {
    .item {
        .head {
            .day {
                text-align: center;
                display: inline-block;
                width: 48px;
                height: 26px;
                background: rgba(237, 2, 135, 1);
                border-radius: 13px;
                font-size: 18px;
                font-family: OswaldMedium;
                font-weight: 500;
                color: rgba(255, 255, 255, 1);
                line-height: 25px;
            }
            .date {
                font-family: OswaldMedium;
                margin-left: 11px;
                margin-right: 20px;
                display: inline-block;
                font-size: 16px;
                font-weight: bold;
                color: rgba(17, 17, 17, 1);
                line-height: 24px;
            }
            .exportMore {
                font-weight: bold;
                color: rgba(237, 2, 135, 1);
                font-size: 14px;
                margin-left: 11px;
                cursor: pointer;
            }
        }
        .content {
            width: 970px;
            border-left: 2px dashed #e7e7e7;
            margin-left: 24px;
            padding-left: 35px;
            padding-top: 20px;
            padding-bottom: 40px;
            color: #555;
            .country {
                margin-bottom: 20px;
            }
            .city {
                margin-bottom: 20px;
            }
            .contentText {
            }
        }
    }
}
</style>
