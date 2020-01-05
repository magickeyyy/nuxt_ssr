<template>
    <div class="cities"
         @mouseleave="hide">
        <Dropdown class="left countryDrop"
                  placement="right-start"
                  trigger="custom"
                  :visible="visible">
            <div class="red"
                 @mouseover="visible=true">目的地：{{destination}}&nbsp;&gt;</div>
            <DropdownMenu slot="list">
                <ul class="countries">
                    <li v-for="(v,i) in zoneList"
                        :key="i">
                        <h3>{{v.nameCn}}</h3>
                        <div :class="{'active':item.id==activeCounId}"
                             v-for="(item,index) in v.children"
                             :key="index"
                             @click="changeCountry(item)">
                            {{item.nameCn}}
                        </div>
                    </li>
                </ul>
            </DropdownMenu>
        </Dropdown>
        <div :class="['middle',{'hidden':hidden}]">
            <div :class="{'checked':checked}"
                 @click="checkAll">全部</div>
            <div :class="{'active':v.id==activeCityId}"
                 v-for="(v, i) in cityList "
                 :key="i"
                 @click="selectCity(v)">
                {{v.nameCn}}
            </div>
        </div>
        <div class="right">
            <span @click="unfold">{{hidden?'展开':'收起'}}</span>
            <svg class="icon"
                 aria-hidden="true"
                 v-show="hidden">
                <use xlink:href="#iconzuocedaohang_open-copy" />
            </svg>
            <svg class="icon"
                 aria-hidden="true"
                 v-show="!hidden">
                <use xlink:href="#iconzuocedaohang_close-copy" />
            </svg>
        </div>
    </div>
</template>

<script>
import { API_LOCATION } from '~/assets/api/public';
import { mapState, mapMutations } from 'vuex';
// 6056,6603
export default {
    name: 'Citys',
    props: {
        search: {
            type: Object,
            required: true,
        },
        changeCity: {
            type: Function,
            required: true,
        },
    },
    data() {
        return {
            hidden: true, // 展开
            checked: false, // 全选
            nowSP: '',
            cityList: [],
            zoneList: [],
            activeCityId: '',
            activeCounId: '',
            destination: '',
            visible: false,
        };
    },
    created() {
        this.getCountries();
        this.getCities(this.activeCounId * 1);
    },
    methods: {
        unfold() {
            if (this.visible) return;
            this.hidden = !this.hidden;
        },
        checkAll() {
            if (!this.checked) {
                this.checked = true;
                this.activeCityId = 0;
                let item;
                let arr = this.zoneList;
                for (let i = 0; i < arr.length; i++) {
                    if (item) break;
                    for (let j = 0; j < arr[i].children.length; j++) {
                        if (arr[i].children[j].id == this.activeCounId) {
                            item = arr[i].children[j];
                            break;
                        }
                    }
                }
                let search = { ...this.search, cityId: 0, cityCn: '' };
                this.changeCity({
                    countryId: this.search.countryId, 
                    countryCn: this.search.countryCn, 
                    cityId: '', 
                    cityCn: '',
                })
                this.hidden = true;
            }
        },
        changeCountry(item) {
            this.getCities(item.id * 1);
            this.activeCounId = item.id;
            this.destination = item.nameCn;
            this.checked = true;
            this.changeCity({
                countryId: item.id, 
                countryCn: item.nameCn, 
                cityId: '', 
                cityCn: ''
            });
            this.hidden = true;
            this.visible = false;
        },
        selectCity(item) {
            this.activeCityId = item.id;
            this.checked = false;
            this.changeCity({
                countryId: this.search.countryId, 
                countryCn: this.search.countryCn, 
                cityId: item.id, 
                cityCn: item.nameCn
            });
            this.hidden = true;
        },
        getCountries() {
            // 获取国家列表，并从结果中筛选选中的国家、城市没有就激活全部
            this.activeCounId = this.search.countryId;
            this.$axios({ ...API_LOCATION.zone }).then(res => {
                if (res.success) {
                    let list = res.data.trees;
                    this.zoneList = list;
                    if (this.search.cityId) {
                        this.activeCityId = this.search.cityId;
                    } else {
                        this.checked = true;
                    }
                    let m = true;
                    for (let i = 0; i < list.length; i++) {
                        if (!m) break;
                        if (list[i].children && list[i].children.length > 0) {
                            for (let j = 0; j < list[i].children.length; j++) {
                                if (list[i].children[j].id == this.search.countryId) {
                                    this.destination = list[i].children[j].nameCn;
                                    m = false;
                                    break;
                                }
                            }
                        }
                    }
                }
            });
        },
        getCities(countryId) {
            this.$axios({ ...API_LOCATION.treeByCountry, params: { countryId } }).then(res => {
                if (res.success) {
                    this.cityList = res.data.trees;
                }
            });
        },
        hide() {
            if (this.visible) this.visible = false;
        },
    },
};
</script>

<style scoped lang="less">
@deep: ~'>>>';
.cities {
    background-color: #fff;
    padding: 0 16px;
    display: flex;
    justify-content: space-between;
    user-select: none;
    .right {
        width: 50px;
        flex-shrink: 0;
        display: flex;
        justify-content: flex-end;
        padding-top: 14px;
        height: 40px;
        span {
            cursor: pointer;
            font-size: 14px;
        }
        svg {
            display: inline-block;
            margin-top: 6px;
            cursor: pointer;
        }
    }
    .left {
        flex-shrink: 0;
        text-align: left;
        .red {
            color: #ea037c;
            cursor: pointer;
            font-size: 14px;
            padding-top: 14px;
            padding-bottom: 17px;
        }
        @{deep}.ivu-select-dropdown {
            box-shadow: none;
            border-radius: 0;
            padding: 0;
            margin: 0 0 0 20px;
        }
        .countries {
            width: 900px;
            background: #fff;
            box-shadow: 0px 6px 16px 0px rgba(0, 0, 0, 0.2);
            border-radius: 4px;
            padding: 8px 34px 22px;
            li {
                border-bottom: 1px dashed #e6e6e6;
                display: flex;
                flex-wrap: wrap;
                padding-bottom: 15px;
                h3 {
                    font-size: 16px;
                    color: #ea037c;
                    width: 100%;
                    padding: 16px 0 8px;
                }
                div {
                    line-height: 24px;
                    margin: 3px 54px 3px 0;
                    font-size: 14px;
                    font-weight: 400;
                    color: #4b4b4b;
                    cursor: pointer;
                }
                .active {
                    padding: 0 12px;
                    border-radius: 12px;
                    background-color: #ea037c;
                    color: #fff;
                }
            }
            li:last-child {
                border-bottom: none;
            }
        }
    }
    .middle {
        width: 1180px-16 * 2-50;
        display: flex;
        flex-wrap: wrap;
        padding: 14px 20px 0;
        div {
            line-height: 24px;
            margin-bottom: 14px;
            color: #222;
            font-size: 14px;
            margin-right: 28px;
            cursor: pointer;
        }
        > div:first-child {
            padding: 0 10px;
            margin-right: 18px;
        }
        > div:first-child.checked {
            background-color: #ea037c;
            color: #fff;
            border-radius: 12px;
            font-weight: 400;
        }
        .active {
            color: #ea037c;
        }
    }
    .hidden {
        height: 40px;
        overflow-y: hidden;
    }
    .city {
        display: inline-block;
        padding: 0 15px 20px;
        span:hover {
            color: #ea037c;
            cursor: pointer;
        }
    }
}
</style>
