<template>
    <div class="container searchResult">
        <div class="route">
            您在这里：
            <nuxt-link to="/">首页</nuxt-link>&gt;
            <nuxt-link to="/hotel/search" exact>{{cityName.nameCn}}酒店预定</nuxt-link>
        </div>
        <HisSearchHotel ref="search" @search="search" :cityName.sync="cityName" />
        <div class="box">
            <aside>
                <div class="map">
                    <img
                        :src="`https://ditu.google.cn/maps/api/staticmap?center=${cityName.nameEn}&zoom=10&size=378x290&maptype=roadmap${mapMarks}&key=AIzaSyDOW8NW4egQT4QFsyLzaOlDR95ib12XywM`"
                    />
                </div>
                <h3>缩小搜索范围</h3>
                <ExtraCondition ref="extra" @extra="extraData" />
            </aside>
            <article>
                <h3>
                    找到
                    <span>{{total}}</span>家酒店
                </h3>
                <ul class="options">
                    <li :class="{active: !sidx}" @click="sort('')">
                        <p>智能排序</p>
                    </li>
                    <li :class="{'active': sidx==='lowestPrice'}" @click="sort('lowestPrice')">
                        <p style="padding-right:4px">价格</p>
                        <svg
                            class="icon"
                            aria-hidden="true"
                            v-if="order==='asc'&&sidx==='lowestPrice'"
                        >
                            <use xlink:href="#iconjiagepaixu_di" />
                        </svg>
                        <svg
                            class="icon"
                            aria-hidden="true"
                            v-if="order==='desc'&&sidx==='lowestPrice'"
                        >
                            <use xlink:href="#iconjiagepaixu_gao" />
                        </svg>
                        <svg class="icon" aria-hidden="true" v-if="sidx!=='lowestPrice'">
                            <use xlink:href="#iconjiagepaixu_gao-copy" />
                        </svg>
                    </li>
                    <li :class="{'active': sidx==='ratings'}" @click="sort('ratings')">
                        <p>评分</p>
                    </li>
                </ul>
                <ul class="hotel" v-if="hotelList.length>0">
                    <li v-for="(v,i) in hotelList" :key="i" @click="detail(v)">
                        <div class="img">
                            <img
                                class="left"
                                :src="v.hotelImageUrl"
                                alt="商家未提供图片"
                                v-noimg="'280-180'"
                            />
                        </div>
                        <div class="middle">
                            <div>
                                <h3>{{v.hotelName}}</h3>
                                <p>{{v.hotelNameEn}}</p>
                                <Rate class="his" disabled allow-half v-model="v.star" />
                                <ul class="tags">
                                    <li v-for="(v1,i1) in v.supportFacilities" :key="i1">
                                        <!-- <svg class="icon" aria-hidden="true" v-if="v1.nameEng === 'Free WiFi'">
											<use xlink:href="#iconWi-Fi"></use>
										</svg>
										<svg class="icon" aria-hidden="true" v-if="v1.nameChn === '客房早餐'">
											<use xlink:href="#iconzaocan"></use>
                                        </svg>-->
                                        {{v1}}
                                    </li>
                                </ul>
                                <div class="groupHousing">
                                    <div v-if="v.supportGroupRooms">有团房</div>
                                </div>
                            </div>
                            <div class="address" v-if="v.addressChn">
                                <svg class="icon" aria-hidden="true">
                                    <use xlink:href="#iconCity" />
                                </svg>
                                {{v.addressChn}}
                            </div>
                        </div>
                        <div class="absolute">
                            <div class="right" v-if="logined">
                                <div>
                                    <span class="booking">Booking</span>&nbsp;
                                    <span class="score">{{v.ratings}}</span>
                                    <span class="fullMark">/10</span>
                                </div>
                                <div class="price" v-if="v.lowestPrice">
                                    <div>&yen;</div>
                                    <div>{{v.lowestPrice}}</div>
                                    <p>起</p>
                                </div>
                            </div>
                            <div class="right" v-if="!logined">
                                <div class="bth">请登录以查看价格</div>
                            </div>
                        </div>
                    </li>
                </ul>
                <div class="page">
                    <Page
                        :total="total"
                        :page-size="pageSize"
                        @on-change="byPage"
                        :current.sync="pageNo"
                        prev-text="上一页"
                        next-text="下一页"
                    />
                </div>
            </article>
        </div>
    </div>
</template>

<script>
import HisSearchHotel from '~/components/hotel/HisSearchHotel';
import { api_hotel } from '~/service/api';
import { API_HOTEL } from '~/assets/api/hotel';
import ExtraCondition from '~/components/hotel/ExtraCondition';
import { mapState, mapMutations } from 'vuex';
export default {
    components: {
        HisSearchHotel,
        ExtraCondition,
    },
    async asyncData({isStatic, isDev, redirect, store, $axios, app}) {
        let hotelList = [];
        let pageNo = 1;
        let pageSize = 10;
        let total = 0;
        let form = {};
        let mapMarks = '&markers=size:tiny%color:red%7Clabel:P%7C';
        Object.keys(store.state.hotel.hotel_search).map(v => {
            if (v !== 'destination') {
                form[v] = store.state.hotel.hotel_search[v];
            } else {
                form['countryId'] = store.state.hotel.hotel_search.destination[0]*1;
                form['cityId'] = store.state.hotel.hotel_search.destination[1]*1;
            }
            if(v === 'childAge') {
                form[v] = store.state.hotel.hotel_search[v].join(',');
            }
        });
        form['pageNo'] = pageNo;
        form['pageSize'] = pageSize;
        if(JSON.stringify(store.state.hotel.hotel_search) !== "{}") {
            await $axios({...API_HOTEL.searchHotel, data: form}).then(res => {
                if (res.success) {
                    total = res.data.total * 1;
                    hotelList = res.data.records.map(v => {
                        v['supportFacilities'] =
                            v.supportFacilities && v.supportFacilities.length > 0
                                ? v.supportFacilities.split(',').slice(0, 2)
                                : [];
                        v.ratings = (v.ratings / 10).toFixed(1);
                        v.star = Number(v.star);
                        mapMarks = mapMarks + v.latitude + ',' + v.longitude + '|';
                        return v;
                    });
                }
            });
        }
        return {
            hotelList, // 搜索结果
            pageNo,
            pageSize,
            order: 'asc', // asc：lowestPrice或ratings从低到高，desc从高到低
            sidx: '', //'':智能排序，lowestPrice以价格排序，ratings以星级/评分排序
            total, // 搜索结果总数
            // 通过query接收的参数再传给搜索组件
            searchInit: {}, // 从sessionStorage中取值
            selected: ['', '', ''],
            sel: null,
            priceOrder: true, // 价格高低排序标志
            cityName: {}, // 搜索地城市，面包屑、地图中心
            extra: {}, // 左侧额外搜索条件
            form: store.state.hotel.hotel_search, // 表单
            mapMarks,
        }
    },
    computed: {
        ...mapState('hotel', ['hotel_search']),
        ...mapState('login', ['logined']),
    },
    mounted() {
        // 为了可刷新
        if(JSON.stringify(this.form) === '{}' && this.mixin_m_SStorage('has', 'hotel_search') && this.hotelList.length === 0 ) {
            let hotel_search = this.mixin_m_SStorage('get', 'hotel_search');
            this.form = hotel_search;
            this.getHotelList(hotel_search);
            this.SET_SEARCH(hotel_search);
        }
    },
    methods: {
        ...mapMutations('hotel', ['SET_SEARCH']),
        sort(type) {
            // 选择酒店列表排序方式
            this.sidx = type;
            if (type === 'lowestPrice') {
                switch (this.order) {
                    case 'asc':
                        this.order = 'desc';
                        break;
                    case 'desc':
                        this.order = 'asc';
                        break;
                    default:
                        this.order = 'desc';
                }
            } else if (type === 'ratings') {
                this.order = 'desc';
            } else {
                this.order = '';
            }
            this.pageNo = 1;
            let data = {
                ...this.form,
                moreConditionSearchDTO: { ...this.extra },
                pageNo: this.pageNo,
                pageSize: this.pageSize,
                order: this.order,
                sidx: this.sidx,
            };
            this.getHotelList(data);
        },
        changePriceSorrt() {
            // 改变价格高低顺序
            this.priceOrder = !this.priceOrder;
            if (this.priceOrder) {
                this.order = 'desc';
            } else {
                this.order = 'asc';
            }
        },
        detail(data) {
            this.$nuxt.$router.push({ name: 'hotel-detail', query: { hotelId: data.hotelId, hotelName: this.text } });
        },
        extraData(data) {
            this.mapMarks = '&markers=size:tiny%color:red%7Clabel:P%7C';
            this.extra = data;
            this.pageNo = 1;
            let form = {
                ...this.form,
                moreConditionSearchDTO: { ...data },
                pageNo: this.pageNo,
                pageSize: this.pageSize,
                order: this.order,
                sidx: this.sidx,
            };
            this.getHotelList(form);
        },
        search(data, n = 1) {
            // 要把附加条件合并,第二个参数再选择价格或者评价排序是默认第一页
            this.mapMarks = '&markers=size:tiny%color:red%7Clabel:P%7C';
            this.SET_SEARCH(data);
            // 更新表单
            this.form = data;
            this.pageNo = n;
            let form = {
                ...data,
                moreConditionSearchDTO: { ...this.extra },
                pageNo: this.pageNo,
                pageSize: this.pageSize,
                order: this.order,
                sidx: this.sidx,
            };
            this.getHotelList(form);
        },
        formatForm(data) {
            // 按接口格式化参数
            let form = {};
            Object.keys(data).map(v => {
                if (v !== 'destination') {
                    form[v] = data[v];
                }
                if(v === 'childAge') {
                    form[v] = data[v].join(',');
                }
            });
            form['countryId'] = data.destination[0]*1;
            form['cityId'] = data.destination[1]*1;
            return form;
        },
        getHotelList(data) {
            data = this.formatForm(data)
            this.$axios({...API_HOTEL.searchHotel, data}).then(res => {
                if (res.success) {
                    this.hotelList = res.data.records.map(v => {
                        v['supportFacilities'] =
                            v.supportFacilities && v.supportFacilities.length > 0
                                ? v.supportFacilities.split(',').slice(0, 2)
                                : [];
                        v.ratings = (v.ratings / 10).toFixed(1);
                        v.star = Number(v.star);
                        this.mapMarks = this.mapMarks + v.latitude + ',' + v.longitude + '|';
                        return v;
                    });
                    this.pageNo = res.data.pageNo * 1 || 1;
                    this.total = Number(res.data.total);
                }
            });
        },
        setDestination() {
            // 注意剔除额外搜索条件
            let search = this.mixin_m_SStorage('get', 'hotel_search');
            if (search) {
                let init = {};
                const arr = ['moreConditionSearchDTO', 'cityId', 'countryId', 'pageNo', 'pageSize', 'pageSize', 'sidx'];
                Object.keys(search).forEach(v => {
                    if (arr.indexOf(v) < 0) {
                        init[v] = search[v];
                    }
                });
                init['destination'] = [search.countryId + '', search.cityId + ''];
                this.searchInit = init;
            }
        },
        byPage(n) {
            // 切换页数刷新数据
            this.mapMarks = '&markers=size:tiny%color:red%7Clabel:P%7C';
            this.pageNo = n;
            let data = {
                ...this.form,
                moreConditionSearchDTO: { ...this.extra },
                pageNo: this.pageNo,
                pageSize: this.pageSize,
                order: this.order,
                sidx: this.sidx,
            };
            this.getHotelList(data);
        },
    },
};
</script>

<style scoped lang="less">
@deep: ~'>>>';
.cancelale {
    li {
        display: flex;
        height: 40px;
    }
}
.container {
    width: 1180px !important;
    min-width: 1180px !important;
}
.w378 {
    width: 378px;
    height: 54px;
}
.w300 {
    width: 300px;
    height: 54px;
}
.input {
    border: 1px solid rgb(204, 204, 204);
    border-radius: 4px;
    padding-left: 40px;
}
.hidden {
    // 空白的已选条件
    display: none !important;
}
.route {
    // 页头链接
    line-height: 74px;
    font-size: 14px;
    padding-top: 10px;
    a {
        color: #222 !important;
        display: inline-block;
        padding: 0 6px;
    }
    .nuxt-link-exact-active {
        color: #e9047b !important;
    }
}
@{deep}.per.ivu-input-number {
    .ivu-input-number-handler-wrap {
        display: none;
    }
    .ivu-input-number-input-wrap {
        .ivu-input-number-input {
            text-align: center;
        }
    }
}
@{deep}.per.ivu-input-number-focused {
    box-shadow: none;
}
.search {
    // 搜索表单
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    height: 190px;
    background-color: #fff;
    border-radius: 4px;
    .title {
        width: 100%;
    }
    .periodInput {
        // 选择入住日期
        display: flex;
        justify-content: space-around;
        align-items: center;
        background: url('~assets/icon/icon_calendar_def.png') no-repeat 20px;
        background-position: 14px 17px;
        p {
            color: #acacac;
            font-size: 14px;
        }
        p.active {
            color: #222;
        }
    }
    .periodInput:hover {
        background-image: url('~assets/icon/icon_calendar_active.png');
        border-bottom: 2px solid #ea037c;
        background-position: 15px 17px;
    }
    .memberInput {
        // 选择入住成员
        border: 1px solid rgb(204, 204, 204);
        border-radius: 4px;
        color: #222;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0 40px;
        background: url('~assets/icon/icon_user_def.png'), url('~assets/icon/icon_shangxia_def.png');
        background-position: 20px;
        background-repeat: no-repeat;
        background-position: 12px 17px, 270px 17px;
    }
    .memberInput:hover {
        border-bottom: 2px solid #e9047b;
        background-image: url('~assets/icon/icon_user_active.png'), url('~assets/icon/icon_shangxia_active.png');
    }
    .options {
        // 选择成员选项列表
        width: 300px;
        height: 225px;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 6px 16px 0px rgba(0, 0, 0, 0.2);
        border-radius: 4px;
        padding: 34px 0 10px;
        .item {
            width: 100%;
            height: 32px+ 28;
            display: flex;
            justify-content: flex-end;
            padding: 0 26px 28px;
            position: relative;
            div {
                width: 32px;
                height: 32px;
                background-size: 32px;
                flex-shrink: 0;
            }
            p {
                white-space: nowrap;
                position: absolute;
                color: #222;
                top: 0;
                left: 26px;
                line-height: 32px;
            }
            .add {
                background: url('~assets/icon/icon_circle_add_def.png') no-repeat center;
            }
            .add:hover {
                background-image: url('~assets/icon/icon_circle_add_active.png');
            }
            .subtract {
                background: url('~assets/icon/icon_circle_del_def.png') no-repeat center;
            }
            .subtract:hover {
                background-image: url('~assets/icon/icon_circle_del_active.png');
            }
            .subtract.disable,
            .subtract.disable:hover {
                background-image: url('~assets/icon/icon_circle_del_dis.png');
            }
            input {
                font-size: 18px;
                color: #222;
                border: none;
                outline: none;
                width: 60px;
                line-height: 32px;
                background-color: transparent;
                flex-shrink: 0;
                text-align: center;
            }
        }
    }
}
.searchResult {
    .route {
        color: #222;
    }
}
.box {
    width: 100%;
    display: flex;
    justify-content: space-between;
    color: #222;
    padding: 28px 0 96px;
    aside {
        width: 380px;
        background-color: #fff;
        padding-bottom: 186px;
        border: 1px solid rgba(234, 234, 234, 1);
        box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.03);
        .map {
            height: 290px;
            background-color: #000;
        }
        > h3 {
            font-size: 18px;
            line-height: 50px;
            padding: 20px 20px 0 20px;
            border-bottom: 1px solid rgb(233, 233, 233);
        }
        .kind {
            margin-bottom: 22px;
            padding: 0 20px;
            > .title {
                font-size: 16px;
                line-height: 68px;
                font-weight: bold;
                border-top: 1px solid rgb(233, 233, 233);
            }
            .his.ivu-radio-wrapper {
                display: flex;
                align-items: center;
                font-size: 14px;
                margin-bottom: 16px;
                @{deep}.ivu-radio {
                    margin-right: 10px;
                }
            }
            .his.ivu-checkbox-wrapper {
                display: flex;
                align-items: center;
                font-size: 14px;
                margin-bottom: 16px;
                @{deep}.ivu-checkbox {
                    margin-right: 10px;
                }
            }
            .custorm {
                display: flex;
                align-items: center;
                > p:first-of-type {
                    margin-right: 10px;
                }
                > p:nth-of-type(2) {
                    margin: 0 6px;
                }
                input {
                    outline: none;
                    width: 56px;
                    height: 22px;
                    background: rgba(255, 255, 255, 1);
                    border: 1px solid rgba(232, 232, 232, 1);
                    border-radius: 2px;
                    line-height: 14px;
                    vertical-align: middle;
                    text-align: center;
                    padding: 2px;
                }
                .ivu-btn {
                    width: 44px;
                    height: 22px;
                    padding: 0;
                    margin-left: 10px;
                    border-radius: 0;
                }
            }
        }
        .kind.price {
            > .title {
                border-top: none;
            }
        }
    }
    article {
        width: 780px;
        border: 1px solid rgba(234, 234, 234, 1);
        box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.03);
        > h3 {
            font-size: 20px;
            line-height: 80px;
            padding: 0 20px;
            background-color: #fff;
            span {
                color: #e9047b;
            }
        }
        .options {
            // 筛选标签
            display: flex;
            padding: 0 20px;
            font-size: 12px;
            line-height: 1;
            padding-bottom: 18px;
            border-bottom: 1px solid rgb(237, 237, 237);
            background-color: #fff;
            li {
                text-align: center;
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
            }
            .active p {
                color: #e9047b;
            }
            li:nth-child(2) {
                border-left: 1px solid #222;
                border-right: 1px solid #222;
                padding: 0 10px 0 15px;
                margin: 0 15px;
            }
        }
        .hotel {
            // 酒店列表
            padding: 0 20px 56px;
            background-color: #fff;
            > li {
                display: flex;
                padding: 25px 0 26px;
                border-bottom: 1px solid rgb(237, 237, 237);
                position: relative;
                .img {
                    width: 260px;
                    height: 200px;
                    overflow: hidden;
                    flex-shrink: 0;
                    img {
                        max-width: 260px;
                    }
                }
                .middle {
                    width: 478px;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    padding: 0 20px;
                    @{deep}.his.ivu-rate {
                        width: 100%;
                    }
                    h3,
                    p {
                        width: 380px-40;
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                    }
                    h3 {
                        font-size: 18px;
                        color: #111;
                    }
                    .groupHousing {
                        height: 24px;
                        > div {
                            padding: 0 10px;
                            margin-top: 4px;
                            background-color: rgba(49, 186, 255, 0.2);
                            border-radius: 13px;
                            font-size: 12px;
                            line-height: 24px;
                            font-weight: bold;
                            color: #0190eb;
                            display: inline-block;
                        }
                    }
                    .tags {
                        display: flex;
                        min-height: 36px;
                        li {
                            color: #777;
                            font-size: 12px;
                            display: flex;
                            align-items: center;
                            padding-right: 20px;
                        }
                        svg {
                            width: 20px;
                            height: 20px;
                        }
                    }
                    .address {
                        font-size: 12px;
                        width: 300px;
                        color: #777;
                        svg {
                            width: 12px;
                            height: 12px;
                        }
                    }
                }
                .absolute {
                    position: absolute;
                    right: 10px;
                    top: 50%;
                    height: 64px;
                    margin-top: -32px;
                }
                .right {
                    padding-right: 6px;
                    font-size: 12px;
                    font-weight: bold;
                    display: flex;
                    flex-direction: column;
                    > div {
                        align-self: flex-end;
                    }
                    .booking {
                        color: #033177;
                    }
                    .score {
                        color: #222;
                    }
                    .fullMark {
                        color: #999;
                    }
                    .price {
                        color: #222;
                        font-size: 16px;
                        align-self: flex-end;
                        display: flex;
                        align-items: baseline;
                        div {
                            color: #e9047b;
                            font-weight: 500;
                            font-family: OswaldMedium;
                        }
                        div:first-child {
                            font-size: 18px;
                        }
                        div:nth-child(2) {
                            font-size: 30px;
                        }
                        p {
                            font-style: normal;
                        }
                    }
                }
            }
            > li:hover {
                background-color: #fafafa;
            }
        }
        .page {
            height: 56px;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            padding: 0 27px;
        }
    }
}
</style>
