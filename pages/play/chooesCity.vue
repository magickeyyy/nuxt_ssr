<template>
    <div class="pageContent">
        <div class="cityContent">
            <div class="title">请选择目的地</div>
            <div class="citys" v-for="(it, i) in citysList" :key="i+'-area'">
                <div class="area">
                    <span class="areaName">{{it.nameCn}}</span>
                    <span class="line"></span>
                </div>
                <div>
                    <span class="city" v-for="(ij, i2) in it.children" :key="i2+'-city'">
                        <span @click="checkCiyt(ij)">{{ij.nameCn}}</span>
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { api_base } from '~/service/api';
import { RESOURCE_TYPE_TO_SERVER } from '@/assets/js/play';
export default {
    name: 'ChooesCity',
    data() {
        return {
            citysList: [],
        };
    },
    created() {
        this.redirect();
        this.getCityListWithArea();
    },
    methods: {
        redirect() {
            let country = this.mixin_m_SStorage('get', 'play_search');
            if(country && country.countryId) {
                this.mixin_m_SStorage('set', 'play_search', {
                    keywords: '',
                    countryId: country.countryId,
                    countryCn: country.countryCn || '',
                    cityId: '',
                    cityCn: '',
                    resourceType: this.$route.query.type?this.$route.query.type:RESOURCE_TYPE_TO_SERVER[0].value,
                    showCity: true,
                    sort: 1,
                })
                this.$router.replace('/play/list')
            }
        },
        checkCiyt(city) {
            this.mixin_m_SStorage('set','play_search',{
                keywords: '',
                countryId: city.id,
                countryCn: city.nameCn,
                cityId: '',
                cityCn: '',
                resourceType: this.$route.query.type?this.$route.query.type:RESOURCE_TYPE_TO_SERVER[0].value,
                showCity: true,
                sort: 1,
            });
            this.$nuxt.$router.push({name:'play-list'});
        },
        getCityListWithArea() {
            this.$axios.get(api_base.listAllCountryWithContinentPartition, { custom: { token: false } }).then(res => {
                if (res.success) {
                    this.citysList = res.data.trees;
                }
            });
        },
    },
};
</script>

<style scoped lang="less">
.cityContent {
    width: 1180px;
    min-height: 800px;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(224, 224, 224, 1);
    border-radius: 4px;
    padding: 50px;
    margin: 0 auto;
    .title {
        color: #222222;
        font-size: 24px;
        font-family: PingFang SC;
        font-weight: 600;
        color: rgba(34, 34, 34, 1);
        margin-bottom: 50px;
    }
    .citys {
        margin-top: 34px;
        .area {
            margin-bottom: 10px;
            .areaName {
                font-size: 20px;
                font-weight: bold;
                color: rgba(237, 2, 135, 1);
                padding-right: 40px;
            }
            .line {
                width: 90%;
                display: inline-block;
                height: 5px;
                border-top: 1px dashed #dfdfdf;
            }
        }
        .city {
            display: inline-block;
            width: 179px;
            overflow: hidden;
            color: #555555;
            font-size: 14px;
            line-height: 40px;
            & > span:hover {
                cursor: pointer;
                color: rgba(237, 2, 135, 1);
            }
        }
    }
}
</style>
