/*
* 一    进入本页
* 1、   从首页输入内容直接搜索，进入搜索结果页（无国家列表可选）
* 2、   从首页搜索下拉选项点击国家会进入搜索列表页（有国家列表可选）,先重置筛选标签
* 3、   从经常浏览、经常预定、首页搜索下拉选项（资源）、搜索结果页中结果选项进入资源详情页，页头面包屑中间会根据资源类型显示餐厅、门票、特色体验，点击回到 搜索列表页（可选国家城市）
* 4、   页面传值使用sessionStorage,默认数据{cityCn: "",cityId: 0,countryCn: "",countryId: 0,keywords: "",resourceType: 1,showCity: false,sort: 1}。
*       如果直接从首页点击搜索进来，会默认cityCn: "",cityId: 0,countryCn: "",countryId: 0，keywords为搜索关键字。如果是点击下拉项选择国家会根据后台数据填充，但是keywords为空。
* 二    页面交互逻辑
* 1、   选择国家、城市会重置当前资源页码，当前资源类型、输入框关键字、搜索条件不变。
* 2、   选择某个资源的筛选标签，当前资源类型、输入框关键字、其他资源搜索条件不变，重置当前资源页码。
* 3、   排序方式在其他搜索条件变化时不变
*/
<template>
    <div class="playList">
        <div class="top">
            <div class="route">
                您在这里：
                <nuxt-link to="/play">玩乐首页</nuxt-link>&gt;
                <nuxt-link to="/play/list">{{form.cityCn||form.countryCn||'玩乐搜索'}}</nuxt-link>
            </div>
            <Search :search="search" />
        </div>
        <Cities v-if="form.showCity"
                :search="form"
                :changeCity="changeCity" />
        <ul class="nav">
            <li v-for="v in resourceTypes"
                :key="v.value"
                :class="{active: v.value===form.resourceType}"
                @click="changeResource(v.value)">{{v.label}}<span>&nbsp;({{v.total}})</span></li>
        </ul>
        <Query :resourceType="form.resourceType"
               :changeTag="changeTag"
               :tagList="tagList" />
        <Sort @changeSort="changeSort" :sort="form.sort"/>
        <div class="goodsList">
            <div v-if="datas.length<1"
                 style="height:400px;background-color:#fff;width:100%;display:flex;justify-content:center;align-items:center;">暂无数据</div>
            <GoodsPanle :datas="v"
                        v-for="(v,i) in datas"
                        :key="i"
                        @click.native="toDetail(v)" />
        </div>
        <Page v-if="form.total>0"
              :total="form.total"
              :page-size="form.pageSize"
              :current.sync="form.pageNo"
              prev-text="上一页"
              next-text="下一页"
              @on-change="changePage" />
    </div>
</template>

<script>
import Query from '~/components/play/list/Query';
import Sort from '~/components/play/list/Sort';
import { API_PLAY } from '~/assets/api/play';
import GoodsPanle from '~/components/play/list/GoodsPanle';
import Cities from '~/components/play/list/Cities';
import Search from '~/components/play/list/Search';
import { RESOURCE_TYPE_TO_SERVER } from '@/assets/js/play';
import { mapState, mapMutations } from 'vuex'
import Axios from 'axios';

// 获取标签列表
function getTags($axios, resourceType) {
    return $axios({ ...API_PLAY.tags, params: { resourceType } })
}
// 根据已选条件获取对应资源及其总数
function sourceList($axios, data) {
    return $axios({ ...API_PLAY.searchAll, data, headers: { token: true } })
}

export default {
    components: {
        Query,
        GoodsPanle,
        Cities,
        Sort,
        Search,
    },
    async asyncData({isStatic, isDev, redirect, store, $axios, app}) {
        const resourceType = 'RESTAURANT';
        const form = {
                pageNo: 1,
                pageSize: 16,
                total: 0,
                resourceType,
                ...store.state.play.play_search,
                keywords: '',
                sort: 1,
                selectedLabels: [], // 已选择的标签
            }
        // 存储三种资源数量
        let resourceTypes = RESOURCE_TYPE_TO_SERVER.map(v => {
                                v['total'] = 0;
                                return v;
                            })
        let tagList = []; // 标签列表
        let datas = []; // 当前已选资源列表，默认餐厅
        await getTags($axios, resourceType)
            .then(tags => {
                if(tags.success) {
                    tagList = tags.data.map(item => {
                        // defaultOption是APP用的
                        if (item.selectType === 'SINGLE_SELECT') {
                            // 单选
                            item['checkAll'] = true;
                        } else if (item.selectType === 'MULTI_SELECT') {
                            // 多选
                            item['checkAll'] = false;
                        }
                        item.labelItems.map(v => {
                            if (!v.flag) {
                                v['flag'] = false;
                            }
                            return v;
                        });
                        return item;
                    });
                }
            })
        await sourceList($axios, form)
            .then(res => {
                if (res.success) {
                    resourceTypes[0].total = res.data.total * 1;
                    datas = res.data.records.map(v => {
                        v.uniqueTypeCode = v.uniqueTypeCode.split('/');
                        return v;
                    });
                }
            })
        await sourceList($axios, {...form, resourceType: 'TICKETS'})
            .then(tickts => {
                if (tickts.success) {
                    resourceTypes[1].total = tickts.data.total * 1;
                }
            })
        await sourceList($axios, {...form, resourceType: 'CHARACTERISTIC_EXPERIENCE'})
            .then(exp => {
                if (exp.success) {
                    resourceTypes[2].total = exp.data.total * 1;
                }
            })
        return {
            datas,
            resourceTypes,
            tagList,
            form
        }
    },
    computed: {
        ...mapState('play', ['play_search'])
    },
    mounted() {
        // debugger
        if(this.tagList.length === 0) {
            this.getTags(this.form.resourceType)
        }
        // store中play_search是初始值,这就说明是刷新过或者不是从玩乐首页过来的或玩乐从详情页过来的
        if((!this.play_search || !this.play_search.countryId) && this.mixin_m_SStorage('has', 'play_search')) {
            let play_search = this.mixin_m_SStorage('get', 'play_search');
            this.SET_PLAY_SEARCH(play_search); // 恢复store
            this.form = { ...this.form, ...play_search };
            this.initTotal();
            this.getSourceList(this.form);
        }
    },
    methods: {
        ...mapMutations('play', ['SET_PLAY_SEARCH']),
        // 修改排序方式事件
        changeSort(n) {
            this.form.sort = n;
            this.form.pageNo = 1;
            this.getSourceList(this.form);
        },
        // 修改城市事件
        changeCity(data) {
            this.form = { ...this.form, ...data, pageNo: 1 };
            this.initTotal();
        },
        // 点击导航栏切换资源类型
        changeResource(type) {
            this.form.resourceType = type;
            this.getTags(type);
            this.form.selectedLabels = [];
            this.form.sort = 1;
            this.form.pageNo = 1;
            this.getSourceList(this.form);
        },
        // 点击搜索框的搜索、option或者输入中
        search(data) {
            if (data.resourceType === 'city') {
                this.form.selectedLabels = [];
                this.form.sort = 1;
                this.form.pageNo = 1;
                this.getTags(RESOURCE_TYPE_TO_SERVER[0].value);
            } else {
                this.$router.push({
                    name: 'play-detail',
                    query: {
                        id: data.resourceId,
                        type: data.resourceType,
                        cityId: data.cityId,
                        countryId: data.countryId,
                    },
                });
            }
        },
        // 获取修改后的附加条件
        changeTag(tags) {
            this.form.selectedLabels = tags;
            this.form.pageNo = 1;
            this.getSourceList(this.form);
        },
        // 获取搜索附加条件
        getTags(resourceType) {
            this.$axios({ ...API_PLAY.tags, params: { resourceType } })
                .then(res => {
                    if (res.success) {
                        this.tagList = res.data.map(item => {
                            // defaultOption是APP用的
                            if (item.selectType === 'SINGLE_SELECT') {
                                // 单选
                                item['checkAll'] = true;
                            } else if (item.selectType === 'MULTI_SELECT') {
                                // 多选
                                item['checkAll'] = false;
                            }
                            item.labelItems.map(v => {
                                if (!v.flag) {
                                    v['flag'] = false;
                                }
                                return v;
                            });
                            return item;
                        });
                    } else this.tagList = [];
                });
        },
        // 切换价格排序图标
        priceType(n) {
            switch (n) {
                case 4:
                    return '#iconjiagepaixu_gao';
                case 5:
                    return '#iconjiagepaixu_di';
                default:
                    return '#iconjiagepaixu_gao-copy';
            }
        },
        // 获取资源列表
        getSourceList(data) {
            let obj = {};
            // 剔除不必要参数
            Object.keys(data).map(v => {
                if(v !== 'showCity' && v !== 'countryCn' && v !== 'cityCn' && v !== 'total') {
                    obj[v] = data[v];
                }
            });
            // 如果不是当前种类资源，还要重置条件中的附加条件
            if(this.form.resourceType !== data.resourceType) obj.selectedLabels = [];
            this.$axios({ ...API_PLAY.searchAll, data: obj, headers: { token: true } })
                .then(res => {
                    let n = this.resourceTypes.findIndex(v => v.value === data.resourceType)
                    if (res.success) {
                        this.resourceTypes[n].total = res.data.total * 1;
                        if(this.form.resourceType === data.resourceType) {
                            this.datas = res.data.records.map(v => {
                                v.uniqueTypeCode = v.uniqueTypeCode.split('/');
                                return v;
                            });
                        }
                    } else {
                        if(this.form.resourceType === data.resourceType) {
                            this.datas = [];
                            this.form.pageNo = 1;
                            this.resourceTypes[n].total = 0;
                        }
                    }
                });
        },
        // 搜索三个资源类型的总数,并且重置当前资源列表
        initTotal() {
            for (let i = 0; i < 3; i++) {
                let data = {
                    ...this.form,
                    resourceType: RESOURCE_TYPE_TO_SERVER[i].value,
                };
                this.getSourceList(data);
            }
        },
        changePage(n) {
            this.form.pageNo = n;
            this.getSourceList(this.form);
        },
        toDetail(v) {
            this.$nuxt.$router.push({
                name: 'play-detail',
                query: { id: v.id * 1, type: v.resourceType, cityId: v.cityId, countryId: v.countryId },
            });
        },
    },
};
</script>

<style scoped lang="less">
.playList {
    width: 1180px !important;
    min-width: 1180px;
    .top {
        height: 88px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .route {
        // 页头链接
        line-height: 1;
        font-size: 14px;
        padding-top: 40px;
        padding-bottom: 34px;
        a {
            color: #222;
            display: inline-block;
            padding: 0 6px;
        }
        .nuxt-link-exact-active {
            color: #e9047b;
        }
    }
    .goodsList {
        display: flex;
        flex-wrap: wrap;
        margin: 20px 0 54px;
        .showContent {
            margin-right: 16px;
        }
        .showContent:nth-child(4n) {
            margin-right: 0px;
        }
    }
    .ivu-page {
        margin: 0 auto 76px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .nav {
        height: 52px;
        background: #f9f9f9;
        border-top: 1px solid #e8e8e8;
        border-bottom: 1px solid #e8e8e8;
        display: flex;
        li {
            width: 180px;
            line-height: 50px;
            font-size: 16px;
            text-align: center;
            overflow: hidden;
            color: #111;
            cursor: pointer;
            &.active {
                background-color: #fff;
                color: #e9047b;
                border-right: 1px solid #e8e8e8;
                border-left: 1px solid #e8e8e8;
                span {
                    color: #e9047b;
                }
            }
            &:first-child.active{
                border-left: none;
            }
            span {
                color: #999;
            }
        }
    }
}
</style>
