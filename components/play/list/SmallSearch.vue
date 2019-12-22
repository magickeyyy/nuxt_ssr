<template>
    <div class="smallSearch" @mouseover="inputFocus" @mouseleave="visible=false">
        <Dropdown ref="search" placement="bottom-start" trigger="custom" :visible="visible">
            <Input class="searchInput" autofocus v-model="keywords" placeholder="搜索目的地/餐厅/门票/特色体验" 
                @on-change="handleInput" @on-blur="visible=false;" />
            <DropdownMenu slot="list">
                <DropdownItem v-for="(item,index) in searchList" :key="index" @click.native="clickItem(item)">
                    <svg class="icon" aria-hidden="true" v-if="item.type==='city'">
                        <use xlink:href="#iconwanle_search_city" />
                    </svg>
                    <svg class="icon" aria-hidden="true" v-if="item.type==='hotel'">
                        <use xlink:href="#iconhotel" />
                    </svg>
                    <svg class="icon" aria-hidden="true"  v-if="item.type==='restaurant'">
                        <use xlink:href="#iconcanting1" />
                    </svg>
                    <svg class="icon" aria-hidden="true"  v-if="item.type==='experience'">
                        <use xlink:href="#icontesetiyan" />
                    </svg>
                    <svg class="icon" aria-hidden="true"  v-if="item.type==='ticket'">
                        <use xlink:href="#iconmenpiao" />
                    </svg>
                    <p v-if="item.type==='city'" :key="index">{{item.destinationNameVO.cityName}},{{item.destinationNameVO.countryName}}</p>
                    <p v-if="item.type!=='city'" :key="index">{{item.destinationNameVO.resourceName}},{{item.destinationNameVO.countryName}}</p>
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>
        <Button type="primary" @click="submit">搜索</Button>
    </div>
</template>

<script>
import {api_base} from '~/service/api'
import { TagType, ResTypeToServer } from '@/assets/js/play'
export default {
    name: 'SmallSearch',
    props: {
        search: {
            type: Object,
            required: true
        },
    },
    data() {
        return {
            searching: false, // 是否搜索中
            foure: false,
            showClear: false,
            showRes: false,
            visible:false,
            keywords: '',
            searchList: [],
            isMounted: false,
        };
    },
    created() {
        this.keywords = this.mixin_m_SStorage('get','play_search').keywords;
        this.handleInput();
    },
    mounted() {
        this.isMounted = true;
    },
    methods: {
        formatList(list){
            let arr = [];
            list.map(v => {
                if(v.destinations.length > 0) {
                    v.destinations.map(item => {
                        item['type'] = v.type;
                        arr.push(item);
                        return item;
                    });
                }
                return v;
            })
            return arr;
        },
        getDataList(params) { // 获取搜索结果
            return this.$axios.get(api_base.complexSearch,{ params })
                    .then(res=>{
                        if(res.success){
                            this.searchList = this.formatList(res.data);
                            return this.searchList.length>0?true:false;
                        } else {
                            return false;
                        }
                    })
        },
        inputFocus() { // 聚焦且有搜索结果显示
            if(this.keywords !== '' && this.searchList.length>0){
                this.visible = true;
            } else {
                this.visible = false;
            }
        },
        submit(){ // 直接点击搜索
            let data = {...this.search,keywords:this.keywords}
            this.mixin_m_SStorage('set','play_search', data);
            this.$emit('update:search', data)
            TagType.map(v => {
                this.mixin_m_SStorage('remove',v)
            })
            this.$emit('initTotal');
        },
        clickItem(item) {
            if(item.type === 'city') {
                let data = { 
                    cityId: item.destinationIdVO.cityId*1, 
                    cityCn: item.destinationNameVO.cityName,
                    countryId: item.destinationIdVO.countryId*1, 
                    countryCn: item.destinationNameVO.countryName,
                    showCity: true,
                    sort: 1,
                    keywords:"",
                    resourceType: '1',
                }
                // 先手动清除tagsList再——>父组件——>tagTab——>Query组件获取新tagLIst
                TagType.map(v => {
                    this.mixin_m_SStorage('remove',v);
                })
                this.$emit('clearAllTags');
                this.$emit('update:search', data);
                this.mixin_m_SStorage('set', 'play_search', data);
                this.$emit('initTotal');
            } else {
                let type;
                type = ResTypeToServer.find(v => v.value2 === item.type).value1
                this.$router.push({ name: 'play-detail',  query: { id: item.destinationIdVO.resourceId, type, cityId: item.destinationIdVO.cityId, countryId: item.destinationIdVO.countryId } })
            }
        },
        handleInput() {
            // 在created中给keywords赋值会触发此方法，但是list页会根据sessionStorage中的搜索条件搜索，增加isMounted避免冲突
            if(!this.isMounted) return;
            if (this.keywords !== '') {
                let params = {
                    keywords:this.keywords,
                    size: 10,
                    includeTypes:'city,restaurant,ticket,experience'
                }
                this.getDataList(params)
                    .then( res => {
                        this.visible = res;
                        if(!res) this.searchList = [];
                    })
            } else {
                this.visible = false;
                this.searchList = [];
            }
        },
    },
};
</script>

<style lang="less" scoped>
    @deep: ~'>>>';
    .smallSearch{
        @{deep}.ivu-input-wrapper{
            .ivu-input{
                width: 400px;
                height: 38px; 
                background-color: #fff;
                background-color:rgba(255,255,255,0.85);
                font-size:14px;
                border-radius: 0;
                border-color: #dfdfdf;
            }
            .ivu-input:focus{
                border-color: #dfdfdf;
                box-shadow: none;
            }
            .ivu-input:hover{
                border-color: #dfdfdf;
                box-shadow: none;
            }
            .btn{
                width: 90px;
                height: 56px;
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                background-color: #ea037c;
                svg{
                    color:#fff;
                    width: 34px;
                    height: 34px;
                }
            }
        }
        @{deep}.ivu-select-dropdown{
            padding:0;
            width: 400px;
            border-radius: 0;
            .ivu-dropdown-item{
                padding:10px 24px;
                height: 48px;
                line-height: 28px;
                font-size:14px!important;
                font-weight:bold;
                color:#222;
                display: flex;
                align-items: center;
                p{
                    padding-left: 10px;
                    overflow: hidden;
                    text-overflow:ellipsis;
                    white-space: nowrap;
                }
            }
            .ivu-dropdown-item:empty{
                display: none;
            }
    }
        .ivu-btn-primary{
            width:90px;
            height:38px;
            box-shadow:0px 0px 3px 0px rgba(0, 0, 0, 0.15);
            border-radius:2px;
        }
    }
</style>