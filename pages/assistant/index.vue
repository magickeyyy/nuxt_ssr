<template>
    <div :class="isPC?'overview':'mobile'">
        <!-- 分享窗口 -->
         <div class="modal">
            <p>扫描二维码预览/分享</p>
            <div class="img">
                <img src="" title="二维码" alt="加载失败">
            </div>
            <a href="">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#iconxls"></use>
                </svg>
                &nbsp;下载送签专用行程单
            </a>
            <a href="">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#iconpdf"></use>
                </svg>
                &nbsp;下载PDF详细行程单
            </a>
        </div>
        <!-- 封面 -->
        <h1>{{routes.title}}</h1>
        <p class="date">{{routes.itineraryList[0].overview.date | mixin_f_formatDate('xxxx年xx月xx日')}}出发．共{{routes.itineraryList.length}}天</p>
        <div class="name">
            <p>游海旅行社</p>
        </div>
        <div class="img_box cover">
            <img :src="routes.coverImage"
                 title="封面图片"
                 alt="加载失败">
        </div>
        <!-- 行程概览 -->
        <div class="page_title">
            <div>
                <h1>行程概览</h1>
            </div>
        </div>
        <table border="1px"
               cellspacing="0"
               cellpadding="0"
               width="1070">
            <thead>
                <tr>
                    <th width="214">日期</th>
                    <th width="184">城市</th width="214">
                    <th width="390">游览行程</th width="214">
                    <th width="274">住宿</th width="214">
                </tr>
            </thead>
            <tbody>
                <tr v-for="(v,i) in routes.itineraryList"
                    :key="i+'tbody'">
                    <td>
                        <div>
                            <div>D{{i+1}}</div>
                            &nbsp;
                            <p>{{v.overview.date | mixin_f_formatDate('xxxx-xx-xx 周')}}</p>
                        </div>
                    </td>
                    <td>
                        <span v-for="(item,index) in veryDaySite(v.list)"
                            :key="index+'city'">
                            {{item}}<span>&gt;</span>
                        </span>
                    </td>
                    <td>
                        <span v-for="(item,index) in veryDayRes(v.list)"
                            :key="index+'res'">
                            {{item}}<span>&gt;</span>
                        </span>
                    </td>
                    <td>
                        <div v-for="(item, index) in veryDayStayPlace(v.list)">
                            <div>{{item.resourceName}}</div>
                            <p>地址：{{item.address}}</p>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
        <!-- 全程地图 -->
        <div class="page_title">
            <div>
                <h1>全程地图</h1>
            </div>
        </div>
        <div class="img_box all_map">
            <img :src="routes.wholeItinerary.image"
                 title="全程地图"
                 alt="加载失败">
        </div>
        <ul class="destination_list">
            <li v-for="(v,i) in routes.wholeItinerary.routes">
                <div>{{capitals[i]}}</div>{{v}}&gt;
            </li>
        </ul>
        <!-- 某天行程 -->
        <div class="dailylyItinerary"
             v-for="(item,index) in routes.itineraryList"
             :key="index+'day'">
            <!-- 今日概览 -->
            <div class="day_list">
                <div class="top">
                    <div>
                        D{{index+1}}
                    </div>
                    &emsp;
                    <ul>
                        <li v-for="(v, i) in item.overview.destinations"
                            :key="i+'des'">{{v.cityName}}&gt;</li>
                    </ul>
                </div>
                <p class="bottom">{{item.overview.date | mixin_f_formatDate('xxxx年xx月xx日 周')}}</p>
            </div>
            <div class="img_box today_map">
                <img :src="item.overview.image"
                     title="今日行程路线图"
                     alt="加载失败">
            </div>
            <ul class="destination_list">
                <li v-for="(v, i) in item.overview.destinations"
                    :key="i+'des'">
                    <div>{{capitals[i]}}</div>{{v.cityName}}&gt;
                </li>
            </ul>
            <div class="today_title">
                <h3>今日概览</h3>
            </div>
            <div class="overview_today">
                <div class="option">
                    <p>所在城市：</p>
                    <div>
                        <span v-for="(v, i) in item.overview.destinations"
                              :key="i+'des'">{{v.cityName}}&gt;</span>
                    </div>
                </div>
                <div class="option">
                    <p>⾏程安排：</p>
                    <div>
                        <span v-for="(v, i) in item.overview.destinations"
                              :key="i+'des'">{{v.destinationName}}&gt;</span>
                    </div>
                </div class="option">
                <div class="option">
                    <p>住&emsp;&emsp;宿：</p>
                    <div style="flex-direction:column;">
                        <div v-for="(v,i) in item.overview.stay"
                             :key="i+'stay'">{{v}}</div>
                    </div>
                </div>
                <div class="option">
                    <p>行程亮点：</p>
                    <div>{{item.overview.bright}}</div>
                </div class="option">
            </div>
            <!-- 具体行程 -->
            <div v-for="(v,i) in item.list"
                 :key="i+'iti'">
                <!-- 行程间距 -->
                <ul class="mileages">
                    <li></li>
                    <li></li>
                    <li></li>
                    <li class="bar">
                        <svg class="icon"
                             aria-hidden="true">
                            <use xlink:href="#iconxuanzejiaotongzijia"></use>
                        </svg>
                        &emsp;{{v.distance}}km
                    </li>
                    <li></li>
                    <li></li>
                    <li></li>
                </ul>
                <!-- 坐飞机 -->
                <div class="panel"
                     v-if="v.transportType==='aircraft'">
                    <div class="top">
                        <ul class="addr">
                            <li>{{v.startCityName}}</li>
                            <li class="center">
                                <svg class="icon"
                                     aria-hidden="true">
                                    <use xlink:href="#iconfeiji"></use>
                                </svg>
                            </li>
                            <li>{{v.endCityName}}</li>
                        </ul>
                        <div>{{v.flightInfo}}</div>
                    </div>
                    <div class="bottom">
                        <ul class="line">
                            <li>
                                <p>时间</p>
                                <div>{{v.startTime | mixin_f_formatDate('xx:xx')}}</div>
                            </li>
                            <li>
                                <p>出发</p>
                                <h3>{{v.startStationName}}</h3>
                            </li>
                            <li>
                                <p>到达</p>
                                <h3>{{v.arriveStationName}}</h3>
                            </li>
                            <li>
                                <p>到达时间</p>
                                <div>{{v.endTime | mixin_f_formatDate('xx:xx')}}</div>
                            </li>
                        </ul>
                    </div>
                </div>
                <!-- 包车 -->
                <div class="panel"
                     v-if="v.transportType==='charteredBus'">
                    <div class="top">
                        <ul class="addr">
                            <li class="center">
                                <svg class="icon"
                                     aria-hidden="true">
                                    <use xlink:href="#iconcar1"></use>
                                </svg>
                            </li>
                            <li>司导包车</li>
                        </ul>
                    </div>
                    <div class="bottom">
                        <ul class="car">
                            <li class="option">
                                <p>出&emsp;&emsp;发：</p>
                                <div>{{v.startStationName}}</div>
                            </li>
                            <li class="option">
                                <p>包车行程：</p>
                                <div>
                                    <span v-for="(obj, order) in v.routes"
                                          :key="order+'rot'">{{obj}}</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
                <!-- 餐厅、酒店 -->
                <div class="panel"
                     v-if="v.resourceType==='FOOD'||v.resourceType==='HOTEL'">
                    <div class="top">
                        <ul class="addr">
                            <li class="center">
                                <svg class="icon"
                                     aria-hidden="true">
                                    <use :xlink:href="v.resourceType==='FOOD'?'#iconmeishisvg':'#iconzhusu'"></use>
                                </svg>
                            </li>
                            <li>{{v.resourceName}}</li>
                        </ul>
                    </div>
                    <div class="bottom">
                        <div class="dinning">
                            <ul>
                                <li class="option"
                                    v-for="(value,key) in v.extraInfo"
                                    :key="key">
                                    <p v-html="extKey(value,key)"></p>
                                    <div>{{value}}</div>
                                </li>
                            </ul>
                            <div class="img_box dinning_img">
                                <img :src="v.img"
                                     title="资源图片"
                                     alt="加载失败">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="footer">
            <div>
                <img src="~assets/icon/logo.png" title="logo" alt="加载失败">游海旅行&nbsp;&bull;&nbsp;P2</div>
            </div>
        </div>
    </div>
</template>

<script>
import routes from '~/assets/mock/routeList';
export default {
    data() {
        return {
            isPC: true,
            routes,
            wholeRoutes: [],
            capitals: [], // 26个大写字母
        };
    },
    created() {
        this.capitals = this.capitalList();
    },
    mounted() {
        // this.wholeRoutes = this.getWholeRoutes(this.routes.itineraryList);
        window.addEventListener('resize', this.init());
    },
    beforeDestroy() {
        if (!this.isPC) {
            document.documentElement.style.fontSize = '';
        }
        window.removeEventListener('resize', this.init());
    },
    methods: {
        extKey(v, k) {
            // 把介绍的key转成中文
            if (!v) return '';
            const obj = {
                describle: '介&emsp;&emsp;绍：',
                cookingStyle: '菜系类型：',
                address: '地&emsp;&emsp;址：',
                businessHours: '营业时间：',
            };
            return obj[k];
        },
        init() {
            let userAgentInfo = navigator.userAgent;
            let Agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod'];
            for (let v = 0; v < Agents.length; v++) {
                if (userAgentInfo.indexOf(Agents[v]) > 0) {
                    this.isPC = false;
                    break;
                }
            }
            if (this.isPC) return;
            let htmlFontSize = (document.documentElement.clientWidth / 375) * 100 + 'px';
            document.documentElement.style.fontSize = htmlFontSize;
        },
        veryDaySite(arr = []) {
            // 从数组中拆出每天行程的地点
            let list = [];
            arr.map((v, i) => {
                if (v.startCityName && v.endCityName) {
                    list.push(v.startCityName, v.endCityName);
                } else {
                    list.push(v.cityName);
                }
            });
            return list;
        },
        veryDayRes(arr = []) {
            // 从数组中拆出每天行程的资源名
            let list = [];
            arr.map((v, i) => {
                if (v.startCityName && v.endCityName) {
                    list.push(
                        v.startStationName + v.startStationBuilding,
                        v.arriveStationName + v.arriveStationBuilding,
                    );
                } else {
                    list.push(v.resourceName);
                }
            });
            return list;
        },
        veryDayStayPlace(arr = []) {
            // 筛出每天行程中玩乐的资源
            let list = [];
            arr.map((v, i) => {
                if (v.resourceType) {
                    list.push({
                        resourceName: v.resourceName,
                        address: v.address,
                    });
                }
            });
            return list;
        },
        getWholeRoutes(arr = []) {
            // 完整的行程路线，城市间
            let list = [];
            arr.map(item => {
                item.map(v => {
                    if (v.startCityName && v.endCityName) {
                        list.push(
                            {
                                lat: v.startLat,
                                lgn: v.startLng,
                                cityName: v.startCityName,
                            },
                            {
                                lat: v.endLat,
                                lgn: v.endLng,
                                cityName: v.endCityName,
                            },
                        );
                    } else {
                        list.push({
                            lat: v.latitude,
                            lgn: v.longitude,
                            cityName: v.cityName,
                        });
                    }
                });
            });
            return list;
        },
        capitalList() {
            // 生成26个大写字母
            var str = [];
            for (var i = 65; i < 91; i++) {
                str.push(String.fromCharCode(i));
            }
            return str;
        },
    },
};
</script>

<style scoped lang="less">
@deep: ~'>>>';
@rpx: 0.01rem;

#container{
    img{
        width: 40*@rpx;
    }
}
.img_box {
    margin: 0 auto;
    overflow: hidden;
    img {
        max-width: 100%;
        text-align: center;
        display: block;
        margin: 0 auto;
    }
}
.modal {
    width: 260px;
    padding: 22px 40px;
    height: 420px;
    background: #fff;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.15);
    position: fixed;
    top: 0;
    right: -276px;
    p {
        font-size: 18px;
        color: #777777;
        line-height: 70px;
        text-align: center;
    }
    .img {
        width: 180px;
        height: 180px;
        padding-bottom: 18px;
    }
    a {
        display: flex;
        justify-content: center;
        align-items: center;
        color: #777777;
        font-size: 14px;
        line-height: 36px;
    }
}
.overview {
    width: 1180px;
    background-color: #fff;
    margin: 40px auto;
    padding: 0 54px;
    font-size: 16px;
}
h1 {
    padding-top: 270px;
    padding-bottom: 30px;
    font-size: 56px;
    color: rgba(17, 17, 17, 1);
    line-height: 76px;
    text-align: center;
}

.date {
    font-size: 18px;
    color: #777;
    line-height: 1;
    text-align: center;
}

.name {
    font-size: 18px;
    color: #777;
    line-height: 1;
    text-align: center;
    display: flex;
    justify-content: center;
    padding-top: 26px;
    padding-bottom: 180px;
    p {
        position: relative;
        margin: 0 auto;
        padding: 0 12px;
        &::before,
        &::after {
            content: '';
            display: block;
            width: 84px;
            height: 1px;
            background-color: #999;
            position: absolute;
            top: 50%;
        }
        &::before {
            left: -84px;
        }
        &::after {
            right: -84px;
        }
    }
}

.cover {
    width: 960px;
    height: 600px;
}

.page_title {
    display: flex;
    justify-content: center;
    padding-top: 40px;
    padding-bottom: 56px;
    div {
        padding: 0 56px;
        border-bottom: 1px solid rgba(17, 17, 17, 1);
        h1 {
            font-size: 28px;
            color: rgba(17, 17, 17, 1);
            line-height: 52px;
            padding: 0 18px;
            border-bottom: 4px solid rgba(17, 17, 17, 1);
        }
    }
}

table {
    margin: 0 auto;
    border-collapse: collapse;
    font-size: 16px;
    line-height: 24px;
    color: #111;
    border: 1px solid #e1e1e1;
    tr {
        text-align: left;
        th {
            background: rgba(245, 245, 245, 1);
            height: 50px;
            font-weight: normal;
            padding: 0 18px;
            line-height: 50px;
        }
        td {
            padding: 26px 18px 32px;
            &:first-child {
                > div {
                    display: flex;
                    width: 100%;
                    height: 100%;
                    div {
                        font-size: 32px;
                        line-height: 1;
                        font-weight: bold;
                        font-family: OswaldMedium;
                    }
                    p {
                        line-height: 32px;
                    }
                }
            }
            &:last-child {
                p {
                    padding-top: 4px;
                    color: #777777;
                }
            }
        }
    }
}

.all_map {
    width: 1070px;
    height: 738px;
}

.destination_list {
    width: 1070px;
    margin: 0 auto;
    display: flex;
    flex-wrap: wrap;
    padding: 30px 0;
    li {
        padding-left: 42px;
        background: url('~assets/icon/loction_map.png') no-repeat 0 center;
        background-size: 40px;
        line-height: 40px;
        position: relative;
        padding-bottom: 10px;
        div {
            position: absolute;
            color: #fff;
            left: 14px;
            font-size: 18px;
            height: 40px;
            line-height: 40px;
        }
    }
}

.day_list {
    padding: 70px 0 24px;
    .top {
        display: flex;
        div {
            height: 56px;
            width: 56px;
            color: #fff;
            font-size: 26px;
            font-weight: bold;
            text-align: center;
            line-height: 56px;
            background: rgba(236, 2, 134, 1);
            border-radius: 50%;
            font-family: OswaldMedium;
        }
        ul {
            display: flex;
            flex-wrap: wrap;
            li {
                line-height: 56px;
                font-size: 26px;
                font-weight: 600;
                color: rgba(17, 17, 17, 1);
                line-height: 48px;
            }
        }
    }
    .bottom {
        line-height: 1;
        font-size: 18px;
        color: rgba(119, 119, 119, 1);
        padding-left: 72px;
    }
}

.today_map {
    height: 535px;
}

.today_title {
    width: 202px;
    border-bottom: 1px solid #111;
    padding-top: 82px;
    margin-bottom: 64px;
    h3 {
        display: inline-block;
        margin-right: 98px;
        font-size: 26px;
        font-weight: bold;
        color: rgba(17, 17, 17, 1);
        line-height: 50px;
        border-bottom: 4px solid #111;
    }
}

.option {
    display: flex;
    line-height: 24px;
    padding-bottom: 18px;
    padding-top: 4px;
    p {
        color: #777777;
        padding-right: 20px;
        flex-shrink: 0;
    }
    div {
        display: flex;
        flex-wrap: wrap;
    }
}

.mileages {
    li {
        width: 2px;
        height: 6px;
        background-color: rgba(222, 222, 222, 1);
        margin-bottom: 6px;
        margin-left: 20px;
        &:first-child {
            margin-top: 6px;
        }
        &:last-child {
            margin-bottom: 6px;
        }
        &:nth-child(3) {
            margin-bottom: 12px;
        }
        &:nth-child(5) {
            margin-top: 12px;
        }
    }
    .bar {
        height: 52px;
        background: rgba(247, 247, 247, 1);
        border-radius: 1px;
        margin: 0;
        width: 100%;
        display: flex;
        align-items: center;
        padding-left: 20px;
        color: #b9b9b9;
    }
}
.panel {
    border: 1px solid rgba(240, 240, 240, 1);
    padding: 0 40px;
    .top {
        height: 94px;
        border-bottom: 1px solid rgba(240, 240, 240, 1);
        display: flex;
        justify-content: space-between;
        align-items: center;
        .addr {
            display: flex;
            font-size: 26px;
            font-weight: 600;
            color: rgba(17, 17, 17, 1);
            li {
                padding-right: 10px;
            }
        }
        .center {
            display: flex;
            justify-content: center;
            align-items: center;
        }
        div {
            font-size: 16px;
            color: rgba(119, 119, 119, 1);
        }
    }
    .bottom {
        .line {
            display: flex;
            padding: 32px 0 28px;
            li {
                border-right: 1px solid rgba(240, 240, 240, 1);
                width: 330px;
                text-align: center;
                &:first-child {
                    width: 166px;
                }
                &:last-child {
                    width: 202px;
                    border-right: none;
                }
                p {
                    line-height: 1;
                    color: #999;
                    padding-bottom: 50px;
                }
                h3 {
                    font-size: 28px;
                    padding-bottom: 24px;
                    line-height: 1;
                    color: #ec0286;
                }
                div {
                    font-size: 18px;
                    padding-bottom: 24px;
                    line-height: 28px;
                    color: #111;
                    font-weight: bold;
                }
            }
        }
    }
    .car {
        padding: 34px 0 60px;
    }
    .dinning {
        display: flex;
        padding: 36px 0 40px;
        ul {
            width: 570px;
        }
    }
    .dinning_img {
        width: 420px;
        height: 261px;
        padding-left: 30px;
    }
}
.footer {
    padding: 30px 0 40px;
    text-align: center;
    font-size: 26px;
    line-height: 26px;
    color: rgb(58, 58, 123);
    img {
        height: 26px;
    }
    > div {
        display: flex;
        justify-content: center;
        align-items: center;
    }
}
</style>
