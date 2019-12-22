<template>
    <Tabs :value="search.resourceType+''" :animated="false" type="card" @on-click="changeTab">
        <TabPane :label="`餐厅(${total[0]})`" name="1">
            <Query ref="query1" :resourceType="1"  @getSourceList="getSourceList" />
        </TabPane>
        <TabPane :label="`门票(${total[1]})`" name="2">
            <Query ref="query2" :resourceType="2" @getSourceList="getSourceList" />
        </TabPane>
        <TabPane :label="`特色体验(${total[2]})`" name="3">
            <Query ref="query3" :resourceType="3" @getSourceList="getSourceList" />
        </TabPane>
    </Tabs>
</template>

<script>
import Query from './Query';
import { mapState, mapMutations } from 'vuex'
import { api_play } from '~/service/api'

export default {
    name: 'TagTab',
    components: { Query },
    props: { 
        search: {
            type: Object,
            required: true
        },
        total: {
            type: Array,
            required: true
        },
    },
    data() {
        return {};
    },
    methods: {
        changeTab(str) {
            let obj = {...this.search, resourceType: str,sort: 1};
            this.mixin_m_SStorage('set','play_search',obj);
            this.$emit('update:search',obj);
            this.$emit('getSourceList', str);
        },
        getSourceList(type) {
            this.$emit('getSourceList', type)
        },
        clearAllTags() {
            this.$refs.query1.getTags();
            this.$refs.query2.getTags();
            this.$refs.query3.getTags();
        }
    },
};
</script>

<style scoped lang="less">
    @deep: ~'>>>';
    .ivu-tabs{
        background-color:#fff;
        border:1px solid rgb(234, 234, 234);
        box-shadow:0px 1px 5px 0px rgba(0, 0, 0, 0.03);
        @{deep}.ivu-tabs-bar{
            background-color:#f9f9f9;
            border-bottom: 1px solid #e8e8e8;
        }
        @{deep}.ivu-tabs-nav-container{
            height: 52px!important;
        }
        @{deep}.ivu-tabs-tab{
            height: 50px!important;
            line-height: 50px!important;
            margin-right: 0px!important;
            border:none!important;
            padding: 0 50px!important;
            font-size: 16px;
            border-radius: 0!important;
            &:hover{
                color:#E9047C;
            }
        }
        @{deep}.ivu-tabs-tab-active{
            background-color: #fff;
            background-image: linear-gradient(180deg,#EA037C 0,#EA037C 4px,#fff 4px,#fff 100%)!important;
        }
    }
</style>
