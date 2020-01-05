// 如果是点击下拉选项且是城市跳转list，如果是点击下拉选项不是城市去相应详情页，直接点击按钮且有搜索结果去list页:直接点击搜索按钮
<template>
    <Dropdown ref="search" placement="bottom-start" trigger="custom" :visible="visible">
        <Input autofocus v-model="searchVal" placeholder="搜索目的地/餐厅/门票/特色体验" 
            @on-change="handleInput" @on-blur="visible=false;" @on-focus="inputFocus" >
            <div slot="suffix" class="btn" @click="toList">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#iconwanle_search" />
                </svg>
            </div>
        </Input>
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
</template>

<script>
import {API_BASE} from '~/assets/api/public'
export default {
    props: {
        getData: {
            type: Function, // return { keywords: this.searchVal, list: this.searchList, item }
            required: true
        },
        type:{ // 搜索场景
            type: String,
            default: 'play',
            required: true
        }
    },
    data() {
        return {
            searching: false, // 是否搜索中
            foure: false,
            showClear: false,
            showRes: false,
            visible:false,
            searchVal: '',
            searchList: [],
        };
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
            return this.$axios({ ...API_BASE.complexSearch, params })
                    .then(res=>{
                        if(res.success){
                            this.searchList = this.formatList(res.data);
                            return Promise.resolve(this.searchList.length>0?true:false);
                        } else {
                            return Promise.resolve(false)
                        }
                    })
        },
        inputFocus() { // 聚焦且有搜索结果显示
            if(this.searchVal !== '' && this.searchList.length>0){
                this.visible = true;
            } else {
                this.visible = false;
            }
        },
        toList(){ // 直接点击搜索
            if (this.searchVal !== '') {
                this.getData({keywords: this.searchVal, showCity: false})
            }
        },
        clickItem(item) {
            this.getData({ keywords: this.searchVal, list: this.searchList, item });
        },
        handleInput() {
            if (this.searchVal !== '') {
                let params = {
                    keywords:this.searchVal,
                    size: 10,
                    includeTypes:''
                }
                switch (this.type){ // 默认玩乐首页搜索模式
                    default:
                        params.includeTypes = 'city,restaurant,ticket,experience';
                        break;
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
    @{deep}.ivu-input-wrapper{
        .ivu-input{
            width: 800px;
            height: 56px; 
            background-color: #fff;
            background-color:rgba(255,255,255,0.85);
            font-size:20px;
            border-radius: 0;
            border-color: #dfdfdf;
            padding: 4px 10px;
            border: none;
        }
        .ivu-input:focus{
            border-color: #dfdfdf;
            box-shadow: none;
        }
        .ivu-input:hover{
            border-color: #dfdfdf;
            box-shadow: none;
        }
        .ivu-input::-webkit-input-placeholder { /* WebKit browsers */
            color: #999;
            font-size: 20px;
            font-weight:600;
        }

        .ivu-input::-moz-placeholder { /* Mozilla Firefox 19+ */
            color: #999;
            font-size: 20px;
            font-weight:600;
        }

        .ivu-input:-ms-input-placeholder { /* Internet Explorer 10+ */
            color: #999;
            font-size: 20px;
            font-weight:600;
        }
        .ivu-input-suffix{
            width: 90px;
            background-color: #ea037c;
            display: flex;
            align-items: center;
            justify-content: center;
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
        width: 800px;
        border-radius: 0;
        .ivu-dropdown-item{
            padding:10px 24px;
            height: 48px;
            line-height: 28px;
            font-size:16px!important;
            font-weight:bold;
            color:#222;
            display: flex;
            align-items: center;
            p{
                padding-left: 10px;
            }
        }
        .ivu-dropdown-item:empty{
            display: none;
        }
    }
</style>