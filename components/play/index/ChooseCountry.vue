<!--
 * @Author: magckeyyy
 * @Date: 2019-11-08 17:39:54
 * @Description: 
 * @Attention: 
 -->
<template>
    <div class="chooseCountry">
        <div>
            <div class="box"
                 v-for="(item, index) in cities"
                 :key="'p'+index">
                <div class="section">
                    <p>{{item.nameCn}}</p>
                </div>
                <ul>
                    <li v-for="(v,i) in item.children"
                        :key="'c'+i"
                        @click="toListPage(v)">{{v.nameCn}}</li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import { api_base } from '@/service/api';
import { RESOURCE_TYPE_TO_SERVER } from '@/assets/js/play';
export default {
    data() {
        return {
            cities: [],
        };
    },
    mounted() {
        this.getCities();
    },
    methods: {
        getCities() {
            this.$axios.get(api_base.listAllCountryWithContinentPartition, { custom: { token: false } }).then(res => {
                if (res.success) {
                    this.cities = res.data.trees;
                }
            });
        },
        toListPage(v) {
            this.mixin_m_SStorage('set', 'play_search', {
                keywords: '', // 搜索关键字
                countryId: v.id,
                countryCn: v.nameCn,
                cityId: '',
                cityCn: '',
                resourceType: RESOURCE_TYPE_TO_SERVER[0].value,
                sort: 1,
                showCity: true,
            });
            this.$router.push('/play/list');
        },
    },
};
</script>

<style scoped lang="less">
.chooseCountry {
    width: 1180px;
    height: 110px;
    position: absolute;
    bottom: 0;
    left: 50%;
    margin-left: -590px;
    background: #fff;
    z-index: 10;
    > div {
        display: flex;
        position: relative;
    }
    .box {
        width: 25%;
        position: absolute;
        top: 0;
        padding: 32px 56px;
        &:first-child {
            left: 0;
        }
        &:nth-child(2) {
            left: 295px;
        }
        &:nth-child(3) {
            right: 295px;
        }
        &:nth-child(4) {
            right: 0;
        }
        &:hover {
            background-image: linear-gradient(180deg, #ea037c 0, #ea037c 6px, #fff 6px, #fff 100%);
            padding-bottom: 27px;
            .section {
                padding-bottom: 0;
            }
            ul {
                height: auto;
                line-height: 40px;
            }
        }
        .section {
            font-size: 14px;
            color: #ea037c;
            line-height: 16px;
            padding-bottom: 12px;
        }
        ul {
            font-size: 14px;
            color: #222;
            display: flex;
            flex-wrap: wrap;
            height: 16px;
            line-height: 16px;
            overflow: hidden;
            li {
                margin-right: 18px;
                position: relative;
                &:hover {
                    cursor: pointer;
                    color: #ea037c;
                    text-decoration: underline;
                }
            }
        }
    }
}
</style>
