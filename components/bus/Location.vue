<template>
    <div class="rmns">
        <Select
            style="float:left;width:127px"
            class="sone"
            @on-change="changeDestination"
            :label-in-value="true"
            v-model="tempcountry"
        >
            <Option
                :value="its.locationId"
                v-for="(its, icountry) in countryList"
                :key="icountry+'_country'"
            >{{its.locationNameCn}}</Option>
        </Select>
        <Select
            style="float:left;width:192px"
            :disabled="cityList.length === 0"
            @on-change="changeCity"
            :label-in-value="true"
            v-model="tempcity"
        >
            <Option
                :value="its2.cityId"
                v-for="(its2, icity) in cityList"
                :key="icity+'_icity'"
            >{{its2.cityNameCn}}</Option>
        </Select>
    </div>
</template>

<script>
import { api_location, api_bus } from '~/service/api';
export default {
    name: '',
    props: ['setData', 'index','busId'],
    data() {
        return {
            countryList: [],
            cityList: [],
            country: '',
            city: '',
            cityId: '',
            tempcountry: '',
            tempcity: '',
        };
    },
    created() {
        this.getCountry();
    },
    methods: {
        getCountry() {
            this.$axios.get(api_bus.busCountry, { params:{busId:this.busId},custom: { token: true } }).then(res => {
                const { data } = res;
                this.countryList = data || [];
            });
            this.$axios.get(api_bus.busCountry, { custom: { token: true } }).then(res => {
                const { data } = res;
                this.countryList = data || [];
            });
        },
        changeDestination(data) {
            if (data) {
                const { value, label } = data;
                this.country = label;
                this.cityList = [];
                this.$axios
                    .post(api_bus.busCity, { locationId: value, pageNo: 1, pageSize: 500 ,busId:this.busId}, { custom: { token: true } })
                    .then(res => {
                        const { data } = res;
                        this.cityList = data.records;
                    });
                this.city = '';
                this.cityId = '';
                this.tempcity = '';
                this.setData(this.country, '', '', this.index);
            }
        },
        changeCity(data) {
            if (data) {
                const { value, label } = data;
                this.city = label;
                this.cityId = value;
                this.setData(this.country, this.city, this.cityId, this.index);
            }
        },
        reset() {
            this.$forceUpdate();
            this.tempcountry = '';
            this.tempcity = '';
        },
    },
};
</script>

<style scoped lang="less">
.rmns {
    overflow: hidden;
    .ivu-select-selection {
        border: none !important;
        border-radius: 0;
        box-shadow: none;
        height: 40px;
        &:focus {
            border-bottom: 1px solid #ed0287 !important;
        }
        .ivu-select-placeholder {
            font-size: 14px;
            height: 40px;
            line-height: 40px;
        }
        .ivu-select-selected-value {
            font-size: 14px;
            height: 40px;
            line-height: 40px;
        }
    }
    .sone {
        .ivu-select-selection {
            border-right: 1px solid #e3e3e3 !important;
        }
    }
}
</style>
