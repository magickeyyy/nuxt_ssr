// sessionstorage.play_search:{keywords,countryId: 0,countryCn: '',cityId: 0,cityCn: '',resourceType: 1,sort: 1,showCity: false}默认参数。
<template>
    <div class="pageContent">
        <div class="banner">
            <div class="banner_text">吃喝玩乐 一站获取</div>
            <div class="search">
                <BigSearch :getData="handelSearch" :type="'play'" />
            </div>
            <ChooseCountry />
            <!-- <Position_C :listData="citysListData" /> -->
        </div>
        <div class="listContent">
            <div class="group">
                <ul>
                    <li :class="{'active':group===1}" @click="handleGroupChange(1)">
                        <i v-show="group===1" class="iconfont iconquanquan"></i>
                        <p>最近浏览</p>
                        <i v-show="group===1" class="iconfont iconquanquan"></i>
                    </li>
                    <li :class="{'active':group===2}" @click="handleGroupChange(2)">
                        <i v-show="group===2" class="iconfont iconquanquan"></i>
                        <p>经常预订</p>
                        <i v-show="group===2" class="iconfont iconquanquan"></i>
                    </li>
                </ul>
            </div>
            <div class="option">
                <ul>
                    <li v-for="(v, i) in resourceType" :key="i" 
                    :class="{active: option===v.value}"
                    @click="changeResourceType(v.value)">{{v.label}}</li>
                </ul>
            </div>
            <div class="contentList" v-if="group===1">
                <div v-if="listDatas.length === 0" class="noData">暂无数据</div>
                <RES
                    v-for="(it, i) in listDatas"
                    :datas="it.browseResource"
                    :key="'1'+i"
                    :type="1"
                />
            </div>
            <div class="contentList" v-if="group!==1">
                <div v-if="listDatas2.length === 0" class="noData">暂无数据</div>
                <RES v-for="(it, i) in listDatas2" :datas="it" :key="'2'+i" :type="2"/>
            </div>
        </div>
    </div>
</template>

<script>
// import Position_C from '@/components/play/index/positionChooes';
import ChooseCountry from '~/components/play/index/ChooseCountry';
import RES from '@/components/play/index/resShow';
import BigSearch from '@/components/play/index/BigSearch';
import { API_PLAY } from '@/assets/api/play';
import { API_BASE } from '@/assets/api/public';
import { RESOURCE_TYPE_TO_SERVER } from '@/assets/js/play'

export default {
    name: 'play',
    layout(context) {
        return 'fixedNav';
    },
    components: { ChooseCountry, RES, BigSearch },
    data() {
        return {
            group: 1,
            option: 'RESTAURANT',
            listDatas: [], // 历史记录
            listDatas2: [], // 经常浏览
            resourceType: [
                { value: 'RESTAURANT', label: '餐厅' }, 
                { value: 'TICKETS', label: '门票' }, 
                { value: 'CHARACTERISTIC_EXPERIENCE', label: '特色体验' }
            ],
        };
    },
    created() {
        this.getList();
    },
    methods: {
        getList() {
            // 浏览历史是数组最多24条，每个类型最多八条
            let type = this.option;
            if (this.group === 1) {
                // 获取最近浏览（包含三种类型）
                this.$axios({ ...API_PLAY.listBrowseLog, headers: { token: true } }).then(res => {
                    if (res.success) {
                        res.data = res.data?res.data:[];
                        this.listDatas = res.data.filter(v => v.browseResource.resourceType === type)
                    } else {
                        this.listDatas = [];
                    }
                });
            } else {
                // 获取经常预订（单独类型）
                this.$axios
                    .get(API_PLAY.resourceReserve, { params: { limit: 8, type, state: 'ENABLE' }, custom: { token: true } })
                    .then(res => {
                        if (res.success) {
                            this.listDatas2 = res.data?res.data:[];
                        } else {
                            this.listDatas2 = [];
                        }
                    });
            }
        },
        handleGroupChange(n) {
            if (this.group === n) return;
            this.group = n;
            this.getList();
        },
        changeResourceType(value) {
            if(this.option === value) return;
            this.option = value;
            this.getList();
        },
        handelSearch({ keywords, item, list }) {
            // 首页搜索逻辑：在BigSearch点击搜索和点击下拉选项
            // 如果是点击下拉选项且是城市跳转list，如果是点击下拉选项不是城市去相应详情页，直接点击按钮去list页,默认搜索餐厅
            // 选择搜索结果的城市选项
            if (item) {
                // 选择下拉选项
                const type = item.type;
                if (type === 'city') {
                    this.mixin_m_SStorage('set', 'play_search', {
                        countryId: item.destinationIdVO.countryId ? item.destinationIdVO.countryId : '',
                        countryCn: item.destinationNameVO.countryName ? item.destinationNameVO.countryName : '',
                        cityId: item.destinationIdVO.cityId ? item.destinationIdVO.cityId : '',
                        cityCn: item.destinationNameVO.cityName ? item.destinationNameVO.cityName : '',
                        showCity: true,
                    });
                    this.$router.push({ name: 'play-list' });
                } else {
                    let resourceId = item.destinationIdVO.resourceId * 1;
                    let type;
                    switch(item.type) {
                        case 'restaurant':
                            type = RESOURCE_TYPE_TO_SERVER[0].value;
                            break;
                        case 'ticket':
                            type = RESOURCE_TYPE_TO_SERVER[1].value;
                            break;
                        case 'experience':
                            type = RESOURCE_TYPE_TO_SERVER[2].value;
                            break;
                    }
                    this.$router.push({ name: 'play-detail', query: { id: resourceId, type, cityId: item.destinationIdVO.cityId, countryId: item.destinationIdVO.countryId } });
                }
            } else {
                // 点击搜索按钮
                this.mixin_m_SStorage('set', 'play_search', {
                    keywords, // 搜索关键字
                    countryId: '',
                    countryCn: '',
                    cityId: '',
                    cityCn: '',
                    showCity: false,
                });
                this.$nuxt.$router.push({ name: 'play-list' });
            }
        },
    },
};
</script>

<style scoped lang="less">
.pageContent {
    padding: 0;
}
.banner {
    background-repeat: no-repeat;
    background-position: center 0;
    background-image: url('~assets/banner/banner_play.png');
    position: relative;
    width: 100%;
    height: 700px;
    // overflow: hidden;
    .banner_text {
        color: #fff;
        font-size: 72px;
        font-family: PingFang SC;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
        text-shadow: 0px 4px 12px rgba(0, 0, 0, 0.4);
        text-align: center;
        padding-top: 160px;
    }
    .search {
        width: 800px;
        margin: 50px auto;
    }
}
.listContent {
    .group {
        margin: 50px auto;
        ul {
            display: flex;
            justify-content: center;
            li {
                color: rgba(153, 153, 153, 1);
                cursor: pointer;
                display: flex;
                align-items: center;
                margin-right: 24px;
                .iconfont {
                    font-size: 16px;
                    transform: scale(0.5);
                }
                p {
                    font-size: 28px;
                    font-weight: normal;
                }
            }
            .active {
                color: rgba(34, 34, 34, 1);
                p {
                    padding: 0 28px;
                    font-size: 32px;
                    font-weight: bold;
                }
            }
        }
    }
    .option {
        margin: 0 auto 55px auto;
        width: 500px;
        ul {
            display: -webkit-flex;
            display: flex;
            align-content: flex-start;
            flex-flow: row wrap;
            justify-content: space-around;
            li {
                list-style: none;
                font-size: 20px;
                border: 1px solid rgba(230, 230, 230, 1);
                font-family: PingFang SC;
                color: rgba(153, 153, 153, 1);
                padding: 8px 49px;
                cursor: pointer;
            }
            li:hover {
                border: 1px solid #ea037c;
                color: #ea037c;
            }
            .active {
                border: 1px solid #ea037c;
                color: #ea037c;
            }
            .sp {
                padding: 8px 29px;
            }
        }
    }
    .contentList {
        margin: 0 auto 80px;
        width: 1180px;
        display: flex;
        flex-wrap: wrap;
        > div {
            margin-right: 16px;
            &:nth-child(4n) {
                margin-right: 0px;
            }
        }
        .noData {
            width: 100%;
            text-align: center;
        }
    }
}
</style>
