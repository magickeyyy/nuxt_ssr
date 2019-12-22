<template>
    <div class="strangeContent">
        <div class="nodata" v-if="showinput===0" @click="showInputContent">
            <i class="iconfont iconzengjia" />
            增加目的地城市
        </div>
        <Dropdown
            v-if="showinput===1"
            trigger="custom"
            :visible="visible"
            class="SelectContent"
            :style="contentStyle"
            @on-click="checkData"
        >
            <input class="inputStyel" v-model="inputVal" @focus="handelFocus" autofocus />
            <i class="iconfont icondel1 delIcon" v-if="inputVal.length != 0" @click="delInputV" />
            <DropdownMenu slot="list" class="dpm">
                <div class="cityLists" v-if="ckCitylist.length > 0">
                    <span v-for="(it, i) in ckCitylist" :key="i">
                        {{it.name}}
                        <i class="iconfont icondel1" @click="delCkCityList(it.id)" />
                    </span>
                </div>
                <DropdownItem
                    :name="it.destinationNameVO.cityName+','+it.destinationIdVO.cityId"
                    class="item"
                    v-for="(it, i) in dataList"
                    :key="i"
                >
                    <i class="iconfont iconwanle_search_city" />
                    <div
                        class="text"
                    >{{it.destinationNameVO.countryName}}，{{it.destinationNameVO.cityName}}</div>
                </DropdownItem>
                <DropdownItem disabled v-if="dataList.length <=0">暂无数据</DropdownItem>
                <div class="btnContent">
                    <Button type="primary" class="comfimBtn" @click="closeContent">确认</Button>
                </div>
            </DropdownMenu>
        </Dropdown>
        <div class="showCityList" v-if="showinput===2">
            <span v-for="(it, i) in ckCitylist" :key="i" class="ssp">
                {{it.name}}
                <i class="iconfont icondel1" @click="delCkCityList(it.id)" />
            </span>
            <span class="addRmn" @click="changePP">
                <i class="iconfont iconzengjia" />
                增加
            </span>
        </div>
    </div>
</template>
<script>
export default {
    name: 'selectAndSearch',
    props: ['inputChange', 'onlyChooes', 'checkdata'],
    data() {
        return {
            contentStyle: '',
            inputVal: '',
            visible: false,
            dataList: [],
            ckCitylist: [],
            showinput: 0,
        };
    },
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
        ckCitylist: function(v, ov) {
            this.$emit('update:checkdata', v);
        },
    },
    mounted() {},
    methods: {
        showInputContent() {
            this.showinput = 1;
        },
        delInputV() {
            this.inputVal = '';
        },
        // 删除选择某个项
        delCkCityList(id) {
            this.ckCitylist = this.ckCitylist.filter(it => it.id !== id);
            if (this.ckCitylist.length > 0) {
                this.showinput = 2;
            } else {
                this.showinput = 0;
                this.clearData();
            }
        },
        checkData(data) {
            if (data) {
                const [name, id] = data.split(',');
                const list = this.ckCitylist.filter(it => it.id === id);
                if (list.length > 0) {
                    this.ckCitylist = this.ckCitylist.filter(it => it.id !== id);
                } else {
                    this.ckCitylist.push({
                        name: name,
                        id: id,
                    });
                }
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
        closeContent() {
            if (this.ckCitylist.length > 0) {
                this.showinput = 2;
            } else {
                this.showinput = 0;
            }
        },
        changePP() {
            this.inputVal = '';
            this.showinput = 1;
            this.dataList = [];
        },
        //输入内容检测
        checkValInList() {
            if (this.onlyChooes === undefined) {
                // 允许输入值保留
            } else {
                // 禁止输入值保留
                const tl = this.dataList.filter(r => r.destinationNameVO.cityName === this.inputVal);
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
<style lang="less" scoped>
.strangeContent {
    width: inherit;
    .nodata {
        border-radius: 2px;
        height: 40px;
        width: inherit;
        border: 1px dashed #ed0287;
        font-size: 14px;
        color: #ed0287;
        line-height: 38px;
        text-align: center;
        cursor: pointer;
    }
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
        .delIcon {
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
            .cityLists {
                font-size: 14px;
                color: #777777;
                font-weight: normal;
                overflow: auto;
                min-height: 35px;
                padding-left: 16px;
                span {
                    display: inline-block;
                    margin: 4px;
                    background: #f6f6f6;
                    border-radius: 15px;
                    padding: 5px 19px;
                    &:hover {
                        i {
                            display: inherit;
                        }
                    }
                    i {
                        cursor: pointer;
                        margin-left: 10px;
                        font-size: 14px;
                        display: none;
                    }
                }
            }
            .btnContent {
                border-top: 1px solid #eee;
                padding: 10px 16px;
                .comfimBtn {
                    width: 74px;
                    height: 30px;
                    background: rgba(237, 2, 135, 1);
                    border: 1px solid rgba(237, 2, 135, 1);
                    border-radius: 15px;
                    font-size: 14px;
                    line-height: 14px;
                }
            }
        }
    }
    .showCityList {
        .ssp {
            display: inline-block;
            margin: 4px;
            background: #f6f6f6;
            border-radius: 15px;
            padding: 5px 19px;
            color: #777777;
            &:hover {
                i {
                    display: inherit;
                }
            }
            i {
                cursor: pointer;
                line-height: 10px;
                margin-left: 10px;
                font-size: 14px;
                display: none;
            }
        }
        .addRmn {
            display: inline-block;
            color: #ed0287;
            border: 1px dashed #ed0287;
            border-radius: 15px;
            padding: 1px 18px;
            cursor: pointer;
        }
    }
}
</style>