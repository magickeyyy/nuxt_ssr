<template>
    <Dropdown
        trigger="click"
        :visible="visible"
        class="SelectContent"
        :style="contentStyle"
        @on-click="checkData"
        @on-clickoutside="clearData"
    >
        <input class="inputStyel" v-model="inputVal" @focus="handelFocus" />
        <i class="iconfont icondel1" v-if="inputVal.length != 0" @click="delInputV" />
        <DropdownMenu slot="list" class="dpm" v-for="(item,index) in dataList" :key="index">
            <DropdownItem
                :name="it.destinationNameVO.resourceName"
                class="item"
                v-for="(it, i) in item.destinations"
                :key="i"
            >
                <div class="text">{{it.destinationNameVO.resourceName}}</div>
            </DropdownItem>
            <DropdownItem disabled v-if="dataList.length<=0">暂无数据</DropdownItem>
        </DropdownMenu>
    </Dropdown>
</template>
<script>
export default {
    name: 'searchPoi',
    props: ['inputChange', 'onlyChooes', 'checkdata'],
    data() {
        return {
            contentStyle: '',
            inputVal: '',
            visible: false,
            dataList: [],
        };
    },
    created() {},
    watch: {
        inputVal: function(v, ov) {
            if (v.length > 0) {
                const a = this.inputChange(v);
                a.then(res => {
                    this.dataList = res;
                });
            } else {
                this.dataList = [];
            }
        },
    },
    mounted() {},
    methods: {
        delInputV() {
            this.inputVal = '';
        },
        // 选择某个项
        checkData(data) {
            console.log('data :', data);
            if (data) {
                const [name, id] = data.split(',');
                this.inputVal = name;
                this.clearData();
                this.$emit('update:checkdata', data);
            }
        },
        clearData() {
            this.checkValInList();
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
        //输入内容检测
        checkValInList() {
            if (this.onlyChooes === undefined) {
                // 允许输入值保留
            } else {
                // // 禁止输入值保留
                const tl = this.dataList.filter(r =>
                    r.destinations.filter(s => s.destinationNameVO.cityName === this.inputVal),
                );
                if (tl.length === 0) {
                    //未通过选中
                    this.inputVal = '';
                    this.dataList = [];
                }
            }
        },
    },
};
</script>
<style lang="less">
.SelectContent {
    .ivu-dropdown-item {
        width: 296px;
    }
}
</style>
<style lang="less" scoped>
.SelectContent {
    border-radius: 2px;
    height: 40px;
    width: inherit;
    border: 1px solid #dfdfdf;
    .inputStyel {
        border: none;
        height: 37px;
        width: 93%;
        padding-left: 5px;
        outline: none;
        font-size: 14px;
    }
    .icondel1 {
        color: #a3a3a3;
        width: 7%;
        text-align: center;
        &:hover {
            cursor: pointer;
            color: #ed0287;
        }
    }
    .dpm {
        overflow: auto;
        width: 400px;
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