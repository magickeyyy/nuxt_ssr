<template>
    <Dropdown
        trigger="custom"
        :visible="visible"
        class="SelectContent"
        :style="contentStyle"
        @on-click="checkData"
        @on-clickoutside="clearData"
    >
        <div class="inputStyel" @click="handelFocus">
            {{inputVal}}
            <i class="iconfont iconopen"  style="float:right"/>
        </div>
        <DropdownMenu slot="list" class="dpm">
            <DropdownItem :name="it" class="item" v-for="(it, i) in dataList" :key="i">
                <div class="text">{{it}}</div>
            </DropdownItem>
            <DropdownItem disabled v-if="dataList.length <=0">暂无数据</DropdownItem>
        </DropdownMenu>
    </Dropdown>
</template>
<script>
export default {
    props: ['inputChange', 'listData', 'checkdata'],
    data() {
        return {
            contentStyle: '',
            inputVal: '',
            visible: false,
            dataList: [],
        };
    },
    mounted() {
        this.dataList = this.listData;
    },
    methods: {
        // 选择某个项
        checkData(data) {
            if (data) {
                this.inputVal = data;
                this.clearData();
                this.$emit('update:checkdata', data);
            }
        },
        clearData() {
            this.visible = false;
            this.contentStyle = {
                borderBottom: '1px solid #dfdfdf',
            };
        },
        handelFocus() {
            this.visible = true;
            this.contentStyle = {
                borderBottom: '2px solid #ED0287',
            };
        },
    },
};
</script>
<style lang="less" scoped>
.SelectContent {
    border-radius: 2px;
    height: 40px;
    width: inherit;
    border: 1px solid #dfdfdf;
    overflow: hidden;
    .inputStyel {
        border: none;
        height: 38px;
        width: 100%;
        padding-left: 5px;
        outline: none;
        font-size: 14px;
        line-height: 40px;
    }
    .dpm {
        max-height: 200px;
        overflow: auto;
        font-size: 14px;
        font-weight: bold;
        color: rgba(38, 38, 38, 1);
        .item {
            overflow: auto;
        }
        .iconwanle_search_city {
            font-size: 24px;
            color: #a2a2a2;
            float: left;
            font-weight: 400;
        }
        .text {
            padding-left: 10px;
            line-height: 30px;
            float: left;
        }
    }
}
</style>