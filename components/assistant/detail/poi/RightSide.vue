<template>
    <div class="assistant-detail-right">
        <div class="head">
            <Select v-model="city" class="citySelect" filterable>
                <Option
                    v-for="(its2, icity) in cityList"
                    :value="its2.id"
                    :key="icity+'_icity'"
                >{{its2.nameCn}}</Option>
            </Select>
            <!-- 搜索 -->
            <!-- <SearchPoi
                onlyChooes
                :inputChange="getResourses"
                style="width:294px;margin-left:400px"
                ref="resources"
            /> -->
            <input type="text" style="width:294px;height:38px;margin-left:400px;outline:none" v-model="keyWords">
            <div class="button" @click="search">
                <i class="iconfont iconsearch" style="color:#fff;font-size:20px;"></i>
            </div>
        </div>
        <div class="line"></div>
        <div class="child">
            <ul>
                <li
                    v-for="(i,index) in list"
                    :key="index"
                    class="list"
                    :class="{'active':current===index}"
                    :style="newStyle"
                    @click="check(i,index)"
                >{{i.name}}</li>
            </ul>
        </div>
        <div class="line" style="margin-top:-16px;"></div>
        <div class="choice" v-if="show">
            <div class="chooesA">
                <span class="chooesTitle">排序：</span>
                <Select v-model="sort" style="width:110px;">
                    <Option
                        v-for="item in sortList"
                        :value="item.value"
                        :key="item.value"
                    >{{ item.label }}</Option>
                </Select>
            </div>
            <div class="chooesB">
                <span class="chooesTitle">筛选：</span>
                <Query :filterListData="filterListData" />
            </div>
        </div>
        <div class="resList">
            <detailList />
            <Page :total="100" class="pageShow" size="small" />
        </div>
    </div>
</template>

<script>
import detailList from '~/components/assistant/detail/poi/detailList';
import SearchPoi from '@/components/assistant/detail/poi/searchPoi';
import Query from './query';
import { getallCity, getHotelFac, getTags, getHotelData, getPOIData, getPlayData } from './getData';
import { resoursesType } from '@/assets/js/assistant';
import moment from 'moment';

export default {
    components: { detailList, SearchPoi, Query },
    data() {
        return {
            date: '',
            city: '16568',
            cityList: [],
            list: resoursesType,
            searchValue: '',
            chooesData: [],
            current: 0,
            show: true,
            newStyle: '',
            keyWords:'',
            sortList: [
                { value: '1', label: '推荐排序' },
                { value: '6', label: '评分由高至低' },
                { value: '4', label: '价格由低至高' },
                { value: '5', label: '价格由高至低' },
            ],
            sort: '1',
            filterListData: [],
            listData: [],
            // 各类资源搜索条件
            itemData: {
                HOTEL: [],
                FOOD: [],
                ATTRACTIONS: [],
                CHARACTERISTIC_EXPERIENCE: [],
            },
            hotelQueryData: {},
            poiQueryData: {},
            playQueryData: {},
            pageNo: 1,
            pageSize: 6,
            total: '',
        };
    },
    created() {
        //获取所有城市
        getallCity(this).then(res => {
            if (res.success) {
                this.cityList = res.data.records;
            }
        });
        // 获取查询条件
        // 酒店
        getHotelFac(this).then(res => {
            this.itemData.HOTEL = res;
            this.filterListData = res;
        });
        // 餐厅
        getTags(this, 'RESTAURANT').then(res => {
            this.itemData.FOOD = res;
        });
        // 门票
        getTags(this, 'TICKETS').then(res => {
            this.itemData.ATTRACTIONS = res;
        });
        // 特色
        getTags(this, 'CHARACTERISTIC_EXPERIENCE').then(res => {
            this.itemData.CHARACTERISTIC_EXPERIENCE = res;
        });
    },
    methods: {
        // 父日期改变
        dateChange(date) {
            this.date = date;
            this.getList('init', 'HOTEL');
        },
        //切换选项
        check(i, index) {
            this.current = index;
              //从搜索接口进的时候
            if (this.city !== undefined && this.$refs.resources.data !== undefined) {
                //根据切换请求搜索
                this.$axios
                    .get(api_assistant.search, {
                        params: { cityId: this.city, pageNo: 1, pageSize: 10, resourceType: i.type },
                    })
                    .then(res => {
                    });
            }
            //从点击进入
            else{

            }

            //对象
            if (i.type === 'SHOPPING' || i.type === 'TRAFFIC') {
                this.show = false;
                this.newStyle = {};
                this.filterListData = [];
                return;
            } else {
                this.filterListData = this.itemData[i.type];
                this.show = true;
                this.newStyle = {
                    marginBottom: 0,
                };
            }
            this.getList('init', i.type);
        },
        //搜索框搜索
        search() {},
        getResourses(data) {},
        /*
    init 
        hotel                        null   /web/api/hotel/hotels      
        FOOD                         null   /web/api/travelAssistant/poi/searchInCity
        ATTRACTIONS                  null   /web/api/travelAssistant/poi/searchInCity
        CHARACTERISTIC_EXPERIENCE    null   /web/api/travelAssistant/poi/searchInCity
        SHOPPING                     null   /web/api/travelAssistant/poi/searchInCity
        TRAFFIC                      null   /web/api/travelAssistant/poi/searchInCity
    search
        hotel                        searchValue   /web/api/hotel/hotels      
        FOOD                         searchValue   /web/api/travelAssistant/poi/searchInCity
        ATTRACTIONS                  searchValue   /web/api/travelAssistant/poi/searchInCity
        CHARACTERISTIC_EXPERIENCE    searchValue   /web/api/travelAssistant/poi/searchInCity
        SHOPPING                     searchValue   /web/api/travelAssistant/poi/searchInCity
        TRAFFIC                      searchValue   /web/api/travelAssistant/poi/searchInCity

    itemQuery（selectedLabels， sort）
        hotel                        moreConditionSearchDTO order sidx      /web/api/hotel/hotels
        FOOD                         selectedLabels sort                    /web/api/search/playSearch
        ATTRACTIONS                  selectedLabels sort                    /web/api/search/playSearch
        CHARACTERISTIC_EXPERIENCE    selectedLabels sort                    /web/api/search/playSearch
*/
        // 获取listData
        getList(option, type) {
            if (type === 'HOTEL') {
                let hotelQueryData = {
                    checkInDate: this.date,
                    checkOutDate: moment(this.date)
                        .add(7, 'days')
                        .format('YYYY-MM-DD'),
                    childAge: 0,
                    cityId: this.city,
                    pageNo: 1,
                    pageSize: this.pageSize,
                };
                if (option === 'pageChange') {
                    hotelQueryData = this.hotelQueryData;
                    hotelQueryData.pageNo = this.pageNo;
                }
                if (option === 'search') {
                    hotelQueryData.hotelName = this.searchValue;
                    this.sort = '1';
                    this.pageNo = 1;
                }
                if (option === 'itemQuery') {
                    hotelQueryData.moreConditionSearchDTO = this.chooesData;
                    hotelQueryData.pageNo = 1;
                    this.pageNo = 1;
                    if (this.sort === '6') {
                        hotelQueryData.order = 'desc';
                        hotelQueryData.sidx = 'ratings';
                    }
                    if (this.sort === '5') {
                        hotelQueryData.order = 'desc';
                        hotelQueryData.sidx = 'lowestPrice';
                    }
                    if (this.sort === '4') {
                        hotelQueryData.order = 'asc';
                        hotelQueryData.sidx = 'lowestPrice';
                    }
                }
                const a = getHotelData(this, hotelQueryData);
                a.then(res => {
                    if (res) {
                        this.hotelQueryData = hotelQueryData;
                        this.setListData(res.pageNo, res.total, res.records);
                    }
                });
            } else if (type === 'TRAFFIC' || type === 'SHOPPING') {
                if (option === 'pageChange') {
                    let poiQueryData = this.poiQueryData;
                    poiQueryData.pageNo = this.pageNo;
                    this.getPlayDataFormPoi(poiQueryData);
                }
                if (option === 'search') {
                    const poiQueryData = {
                        cityId: this.city,
                        pageNo: 1,
                        pageSize: this.pageSize,
                        resourceType: type,
                        name: this.searchValue,
                    };
                    this.sort = '1';
                    this.pageNo = 1;
                    this.getPlayDataFormPoi(poiQueryData);
                }
                if (option === 'init') {
                    this.pageNo = 1;
                    this.sort = '1';
                    const poiQueryData = {
                        cityId: this.city,
                        pageNo: 1,
                        pageSize: this.pageSize,
                        resourceType: type,
                    };
                    this.getPlayDataFormPoi(poiQueryData);
                }
            } else {
                let pubType = 'FOOD',
                    pub2 = 'FOOD';
                if (type === 'FOOD') {
                    pubType = 'FOOD';
                    pub2 = 'FOOD';
                } else if (type === 'ATTRACTIONS') {
                    pubType = 'ATTRACTIONS';
                    pub2 = 'TICKETS';
                } else if (type === 'CHARACTERISTIC_EXPERIENCE') {
                    pubType = 'CHARACTERISTIC_EXPERIENCE';
                    pub2 = 'CHARACTERISTIC_EXPERIENCE';
                }
                if (option === 'pageChange') {
                    let playQueryData = this.playQueryData;
                    playQueryData.pageNo = this.pageNo;
                    if (playQueryData.frontType === 'init') {
                        this.getPlayDataFormPoi(playQueryData);
                    } else {
                        this.getPlayDataFormRes(playQueryData);
                    }
                }
                if (option === 'search') {
                    const playQueryData = {
                        cityId: this.city,
                        pageNo: 1,
                        pageSize: this.pageSize,
                        resourceType: pubType,
                        name: this.searchValue,
                        frontType: 'init',
                    };
                    this.sort = '1';
                    this.pageNo = 1;
                    this.getPlayDataFormPoi(playQueryData);
                }
                if (option === 'itemQuery') {
                    this.pageNo = 1;
                    const playQueryData = {
                        cityId: this.city,
                        pageNo: 1,
                        pageSize: this.pageSize,
                        resourceType: pub2,
                        sort: this.sort,
                        selectedLabels: '',
                        frontType: 'res',
                    };
                    this.pageNo = 1;
                    this.getPlayDataFormRes(playQueryData);
                }
                if (option === 'init') {
                    this.pageNo = 1;
                    this.sort = '1';
                    const playQueryData = {
                        cityId: this.city,
                        pageNo: 1,
                        pageSize: this.pageSize,
                        resourceType: pubType,
                        frontType: 'init',
                    };
                    this.getPlayDataFormPoi(playQueryData);
                }
            }
        },
        setListData(pageNo, total, list) {
            this.pageNo = pageNo;
            this.total = total;
            this.listData = list;
        },
        getPlayDataFormPoi(data) {
            getPOIData(this, data).then(res => {
                if (res) {
                    this.poiQueryData = data;
                    this.setListData(res.pageNo, res.total, res.records);
                }
            });
        },
        getPlayDataFormRes(data) {
            getPlayData(this, data).then(res => {
                if (res) {
                    this.poiQueryData = data;
                    this.setListData(res.pageNo, res.total, res.records);
                }
            });
        },
    },
};
</script>


<style lang="less">
.assistant-detail-right {
    .head {
        .ivu-select-selection {
            height: 38px;
            line-height: 38px;
            div {
                span {
                    height: 38px !important;
                    line-height: 38px !important;
                }
            }
        }
        .ivu-input {
            height: 38px;
            box-shadow: none;
        }
    }
    .chooesA {
        .ivu-select-selection {
            border: none;
            outline: none !important;
            box-shadow: none !important;
        }
    }
}
</style>

<style scoped lang="less">
@deep: ~'>>>';
.assistant-detail-right {
    .citySelect {
        float: left;
        width: 140px;
    }
    .list {
        font-size: 14px;
        font-weight: 400;
        color: #777;
        margin-right: 65px;
        white-space: nowrap;
        cursor: pointer;
        &:hover {
            color: #ec0286;
        }
    }
    .head {
        padding: 14px 24px;
        .button {
            background: #ec0286;
            width: 58px;
            height: 38px;
            border-radius: 0px 4px 4px 0px;
            float: right;
            padding: 5px 19px 9px 19px;
            cursor: pointer;
        }
    }
    .line {
        background: #eee;
        height: 1px;
    }
    .child {
        width: 100%;
        padding: 14px 22px;
        ul {
            width: 100%;
            overflow: auto;
            li {
                float: left;
            }
        }
        .active {
            font-size: 16px;
            font-weight: 600;
            color: #ec0286 !important;
            border-bottom: 3px solid #ec0286;
            height: 41px;
        }
    }
    .choice {
        padding: 16px 0 10px;
        overflow: auto;
        div {
            float: left;
            .chooesTitle {
                float: left;
                display: inline-block;
                padding: 6px 4px 10px 20px;
                color: #999;
            }
        }
        .chooesA {
            margin-right: 76px;
        }
        .chooesB {
        }
    }
    .resList {
        overflow: auto;
    }
    .pageShow {
        float: right;
        margin-right: 10px;
    }

    .btn {
        width: 58px;
        height: 38px;
        background: rgba(237, 2, 135, 1);
        border-radius: 0px 4px 4px 0px;
        position: absolute;
        top: 0;
        right: 44px;
        cursor: pointer;
        svg {
            color: #fff;
            width: 20px;
            height: 20px;
            margin-top: 9px;
        }
    }
    .child {
        font-size: 14px;
        font-weight: 400;
        color: rgba(119, 119, 119, 1);
    }
    .choose {
    }
}
</style>