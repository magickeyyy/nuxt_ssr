<template>
    <div class="ass_location">
        <span v-for="(it, i) in list" :key="i" class="incityList">
            <span class="cityNames">
                {{it.cityName}}
                <i
                    class="iconfont iconshanchu"
                    style="font-size:12px"
                    @click="del(it, i)"
                />
            </span>
            <span v-if="i!==list.length-1">></span>
        </span>
        <span class="addCity" v-show="addCity" @click="addCityF">
            <i class="iconfont iconzengjia_green-copy" style="font-size:12px" />增加城市
        </span>
        <Select
            v-show="!addCity"
            v-model="tempData"
            class="selectStyle"
            placement="bottom-start"
            filterable
            remote
            :loading="loading"
            :label-in-value="true"
            :remote-method="remoteMethod"
            placeholder="请输入城市..."
            @on-change="selectCity"
            @on-open-change="tigex"
        >
            <Option
                v-for="item in cityList"
                :value="item.destinationIdVO.countryId + '_' +item.destinationIdVO.cityId"
                :key="item.destinationIdVO.cityId"
            >{{ item.destinationNameVO.cityName }}（{{item.destinationNameVO.countryName}}）</Option>
        </Select>
    </div>
</template>

<script>
import { api_base } from '~/service/api';
export default {
    name: 'location',
    props: ['listChange'],
    data() {
        return {
            list: [],
            cityList: [],
            tempData: '',
            addCity: true,
            loading: false,
        };
    },
    methods: {
        setCitys(datas) {
            this.list = datas;
        },
        addCityF() {
            this.addCity = false;
            this.tempData = '';
        },
        del(it, index) {
            this.list.splice(index, 1);
            this.cityListChange();
        },
        selectCity(data) {
            if (data) {
                const ch = data.label;
                const ids = data.value;
                const pattern = /（(.+?)）/;
                const d = {
                    countryName: pattern.exec(ch)[1],
                    cityName: ch.replace(pattern, ''),
                    countryId: ids.split('_')[0],
                    cityId: ids.split('_')[1],
                };
                this.list.push(d);
                this.cityListChange();
            }
        },
        cityListChange() {
            // 城市发生变化触发
            this.listChange(this.list);
        },
        remoteMethod(query) {
            if (query !== '') {
                this.loading = true;
                this.$axios
                    .get(api_base.complexSearch, { params: { keywords: query, size: 10, includeTypes: 'city' } })
                    .then(res => {
                        this.loading = false;
                        if (res.success) {
                            this.cityList = res.data[0].destinations || [];
                        }
                    });
            } else {
                this.cityList = [];
            }
        },
        tigex(b) {
            if (!b) {
                this.addCity = true;
            }
        },
    },
};
</script>

<style  lang="less">
.ass_location {
    .selectStyle {
        .ivu-select-selection {
            border: none;
            box-shadow: none;
        }
        .ivu-select-visible {
            outline: none;
        }
        .ivu-select-dropdown {
            .ivu-select-dropdown-list {
                li:hover {
                    color: #ed0287;
                }
            }
        }
    }
}
</style>
<style scoped lang="less">
.ass_location {
    .incityList {
        cursor: pointer;
        .cityNames {
            position: relative;
            .iconshanchu {
                right: 0;
                top: -10px;
                position: absolute;
                color: #ed0287;
                display: none;
            }
        }
        &:hover {
            .iconshanchu {
                display: inline;
            }
        }
    }
    .selectStyle {
        width: 100px;
    }
    .addCity {
        font-size: 14px;
        color: #999999;
        cursor: pointer;
        &:hover {
            color: #ed0287;
        }
    }
}
</style>
