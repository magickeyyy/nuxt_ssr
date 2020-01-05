<!--
 * @Author: magckeyyy
 * @Date: 2019-12-13 10:11:22
 * @Description: 搜索框
 * @Attention: 
 -->
<template>
    <div class="search">
        <AutoComplete icon="ios-search"
                      :clearable="true"
                      v-model="keywords"
                      :transfer="true"
                      @on-change="changeValue"
                      placeholder="搜索目的地/餐厅/门票/特色体验">
            <Option v-for="(option,index) in list"
                    :value="option.type==='city'?option.cityName:option.resourceName"
                    :key="index">
                <div class="option" @click="select(option)">
                    <i :class="['iconfont', iconType(option.type)]"></i>
                    <p class="text" v-html="`${option.type==='city'?option.cityName:option.resourceName}，${option.countryName}`"></p>
                </div>
            </Option>
        </AutoComplete>
        <Button type="primary"
                @click="submit">搜索</Button>
    </div>
</template>

<script>
import { RESOURCE_TYPE_TO_SERVER, TagType, ResTypeToServer } from '@/assets/js/play';
import { API_PLAY } from '~/assets/api/play';
export default {
    props: {
        search: {
            type: Function,
            required: true,
        }
    },
    data() {
        return {
            timeid: null,
            keywords: '',
            list: [],
        };
    },
    methods: {
        // 搜索按钮点击事件
        submit() {
            if(!this.keywords) return;
            if (this.timeid) clearTimeout(this.timeid);
            this.timeid = setTimeout(this.search({ 
                keywords: this.keywords,
                cityId: 0, 
                countryId: 0,
                resourceType: RESOURCE_TYPE_TO_SERVER[0].value,
            }), 300);
        },
        // 搜索框change
        changeValue(value) {
            if(!value) {
                this.list = [];
                return;
            };
            if (this.timeid) clearTimeout(this.timeid);
            this.timeid = setTimeout(() => {
                let params = {
                    keywords: value,
                    size: 10,
                    includeTypes: 'city,restaurant,ticket,experience',
                };
                this.getData(params);
            }, 300);
        },
        // 选项选择事件
        select({ cityId, countryId, resourceId, type }) {
            switch (type) {
                case 'experience':
                    type = RESOURCE_TYPE_TO_SERVER[2].value;
                    break;
                case 'ticket':
                    type = RESOURCE_TYPE_TO_SERVER[1].value;
                    break;
                case 'restaurant':
                    type = RESOURCE_TYPE_TO_SERVER[0].value;
                    break;
            }
            this.search({ 
                keywords: '', 
                cityId: cityId * 1 || 0, 
                countryId: countryId * 1 || 0,
                resourceId: resourceId || '',
                resourceType: type,
            },)
        },
        getData(params) {
            return this.$axios({...API_PLAY.listForType, params }).then(res => {
                if (res.success) {
                    this.list = this.formatList(res.data);
                } else {
                    this.list = [];
                }
            });
        },
        formatList(arr) {
            if (!arr || arr.length === 0) return [];
            let list = [];
            arr.map(item => {
                item.destinations.map(v => {
                    list.push({
                        type: item.type,
                        ...v.destinationIdVO,
                        ...v.destinationNameVO,
                    });
                    return v;
                });
                return item;
            });
            return list;
        },
        iconType(type) {
            switch (type) {
                case 'city':
                    return 'iconwanle_search_city';
                case 'hotel':
                    return 'iconhotel1';
                case 'restaurant':
                    return 'iconcanting1';
                case 'experience':
                    return 'icontesetiyan';
                case 'ticket':
                    return 'iconmenpiao';
                default:
                    return '';
            }
        },
    },
};
</script>

<style scoped lang="less">
@deep: ~'>>>';
.ivu-select {
    width: 400px;
    height: 38px;
    margin-right: 12px;
}
.ivu-input-icon-normal + .ivu-input {
    padding-right: 12px;
}
@{deep}.ivu-input {
    border: 1px solid #dadada;
    border-radius: 2px;
    height: 38px;
    padding-left: 12px;
    font-size: 14px;
    &:focus,
    &:hover {
        box-shadow: 0 1px #e9047b !important;
        outline: 0;
        border-bottom-color: #e9047b;
    }
}
@{deep}.ivu-input-icon {
    display: none;
}
@{deep}.ivu-icon-ios-close {
    height: 38px;
    line-height: 38px;
    cursor: pointer;
}
@{deep}.ivu-btn-primary {
    width: 90px;
    height: 38px;
    box-shadow: 0px 0px 3px 0px rgba(0, 0, 0, 0.15);
    border-radius: 2px;
    span {
        font-size: 14px;
    }
}
@{deep}.ivu-select-dropdown {
    margin-top: 2px;
    padding: 16px 0;
    box-shadow: 0px 6px 8px 0px rgba(0, 0, 0, 0.1);
    border-radius: 0;
}
.ivu-select-item{
    padding: 0px;
}
.option{
    height: 48px;
    padding: 6px 24px;
    display: flex;
    align-items: center;
}
.text {
    font-size: 16px;
    color: #222;
    display: inline-block;
    padding-left: 10px;
    width: 330px;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    letter-spacing:1px;
}
.iconfont {
    font-size: 16px;
    color:#989898;
    font-weight:bold;
}
.search {
    display: table;
    word-spacing: -1em;
}
</style>
