<template>
    <div>
        <div class="inputGroupBy" :style="contentStyle">
            <div
                id="userTagetSpan"
                class="userText"
                v-if="typeof this.filterable === 'undefined'"
                @click="inputFocus"
            >{{inputVal}}</div>
            <input
                autocomplete="off"
                id="userTagetInput"
                v-if="typeof this.filterable !== 'undefined'"
                class="inputBy"
                v-model="inputVal"
                @click="inputFocus"
                ref="userInput"
            />
            <Icon
                v-if="icon"
                :type="icon"
                class="userIcon"
                :color="iconColorBy"
                :style="iconStyle"
                @click="option"
            />
            <Icon
                v-if="isTextFull"
                type="md-close"
                @click="clearInputVal"
                class="delIcon"
                :style="delIcon"
            />
        </div>
        <ul v-if="isShowSelect" class="listDataBy" :style="{width:itemContentWith || '100%'}">
            <li
                class="listDataItem"
                v-for="(item, index) in listData"
                :key="index"
                @click="chooseItem(item)"
            >
                <div class="itemIcon">
                    <Icon v-if="itemIcon" :type="itemIcon" size="18" color="#A2A2A2" />
                </div>
                <div class="itemData" :style="{maxWidth:itemContentWith-30 || '90%'}">
                    <div class="listTitle">{{ item.title }}</div>
                    <div class="lsitDes" v-if="item.des1">{{ item.des1.join(' ') }}</div>
                    <div class="lsitDes" v-if="item.des2">{{ item.des2.join(' ') }}</div>
                </div>
            </li>
        </ul>
        <ul v-if="baseData" class="baseData" :style="baseDataStyle">
            <li class="baseDataTitle">
                <div class="baseDataTitleTxt">历史搜索</div>
                <div class="deleteIcon">
                    <Icon type="md-beaker" />
                </div>
            </li>
            <li class="history">
                <div v-for="(item, index) in baseData.history" :key="index+'-history'">
                    <span @click="chooseItem2(item)">{{item}}</span>
                </div>
                <div class="dividerContent">
                    <Divider dashed :style="{margin:' 14px 0'}" />
                </div>
            </li>
            <li class="baseDataTitle">
                <div class="baseDataTitleTxt">热门推荐</div>
            </li>
            <li class="history">
                <div v-for="(item, index) in baseData.hots" :key="index+'-hot'">
                    <span @click="chooseItem2(item)">{{item}}</span>
                </div>
            </li>
        </ul>
    </div>
</template>
<script>
export default {
    props: [
        'inputStyle',
        'height',
        'inputIcon',
        'iconFullColor',
        'icon',
        'iconColor',
        'itemIcon',
        'itemContentWith',
        'listDataPro',
        'baseData',
        'onSelect',
        'filterable',
        'iconCallback',
        'getInputdata',
    ],
    data() {
        return {
            isTextFull: false,
            isShowSelect: false,
            iconColorBy: this.iconColor[0],
            inputVal: '',
            delIcon: '',
            iconStyle: '',
            listData: [],
            contentStyle: '',
            baseDataStyle: '',
        };
    },
    watch: {
        inputVal: function(Val, oldVal) {
            if (Val.length === 0) {
                this.isTextFull = false;
                this.isShowSelect = false;
            } else {
                this.isTextFull = true;
                this.isShowSelect = true;
                this.iconColorBy = this.iconColor[1];
                if (!this.listDataPro) {
                    this.getListData(Val);
                }
                this.baseDataStyle = {
                    display: 'none',
                };
            }
        },
    },
    mounted() {
        if (this.iconFullColor) {
            this.iconStyle = {
                background: this.iconFullColor,
            };
        }
        if (this.inputStyle) {
            this.contentStyle = this.inputStyle;
            this.iconStyle = Object.assign(this.iconStyle, {
                lineHeight: this.inputStyle.height,
            });
            this.delIcon = {
                lineHeight: this.inputStyle.height,
            };
        }
        try {
            document.addEventListener('click', event => {
                event = event || window.event;
                if (event.target.id !== 'userTagetSpan' && event.target.id !== 'userTagetInput') {
                    setTimeout(() => {
                        this.inputBlur();
                    }, 0);
                }
                event.stopPropagation();
            });
        } catch (error) {}
    },
    methods: {
        clearInputVal() {
            this.inputVal = '';
            this.isShowSelect = false;
            this.isTextFull = false;
        },
        //失去焦点
        inputBlur() {
            setTimeout(() => {
                this.isShowSelect = false;
                this.iconColorBy = this.iconColor[0];
            }, 0);
            this.contentStyle = Object.assign(this.contentStyle, {
                borderBottom: '1px solid #ededed',
            });
            this.baseDataStyle = {
                display: 'none',
            };
        },
        inputFocus() {
            if (this.listDataPro) {
                this.listData = this.listDataPro;
                this.isShowSelect = true;
                this.iconColorBy = this.iconColor[1];
            }
            if (this.baseData && this.inputVal === '') {
                this.baseDataStyle = {
                    display: 'block',
                };
            }
            this.contentStyle = Object.assign(this.contentStyle, {
                borderBottom: '1px solid #ED0287',
            });
        },
        chooseItem(data) {
            this.inputVal = data.title;
            if (this.onSelect) {
                this.onSelect(data);
            }
            setTimeout(() => {
                this.isShowSelect = false;
                this.iconColorBy = this.iconColor[0];
            }, 0);
        },
        chooseItem2(data) {
            this.inputVal = data;
            if (this.onSelect) {
                this.onSelect(data);
            }
            setTimeout(() => {
                this.isShowSelect = true;
                this.baseDataStyle = {
                    display: 'none',
                };
            }, 0);
        },
        getListData(val) {
            const Mock = require('mockjs');
            const data = Mock.mock({
                'list|10-30': [
                    {
                        'id|+1': 1,
                        title: '@first',
                        'des1|1-10': ['@first'],
                        'des2|1-10': ['@first'],
                    },
                ],
            });
            this.listData = data.list;
        },
        option() {
            if (this.iconCallback) {
                this.iconCallback(this.inputVal);
            }
        },
        getInputData() {
            if (this.getInputdata) {
                this.getInputdata(this.inputVal);
            }
        },
    },
};
</script>
<style lang="less" scoped>
.inputGroupBy {
    max-height: 50px;
    line-height: 0;
    box-sizing: border-box;
    font-size: 16px;
    border: 1px solid #ededed;
    border-radius: 4px;
    max-width: 600px;
    padding: 0 0 0 10px;
    overflow: hidden;
    .inputBy {
        color: #262626;
        width: 76%;
        border: none;
        padding: 2%;
        outline: none;
    }
    .delIcon {
        float: right;
        width: 40px;
        text-align: center;
        line-height: 3;
    }
    .userIcon {
        float: right;
        width: 40px;
        height: 100%;
        text-align: center;
        line-height: 3;
    }
    .userText {
        float: left;
        width: 78%;
        height: 40px;
        line-height: 48px;
    }
}
.listDataBy {
    position: absolute;
    background: #fff;
    z-index: 999;
    max-width: 600px;
    width: 100%;
    border-radius: 4px;
    min-height: 80px;
    max-height: 400px;
    overflow: auto;
    box-shadow: rgba(0, 0, 0, 0.12) 0 0 10px;
    .listDataItem {
        padding: 13px;
        overflow: auto;
    }
    .listDataItem:hover {
        background: rgba(250, 250, 250, 1);
        cursor: pointer;
    }
    .listTitle {
        color: #262626;
        font-size: 16px;
        font-family: PingFangSC-Regular;
        font-weight: bold;
    }
    .lsitDes {
        color: #a3a3a3;
        font-size: 14px;
        font-family: PingFangSC-Regular;
    }
    .itemIcon {
        float: left;
        width: 30px;
        padding-top: 4px;
    }
    .itemData {
        float: left;
        line-height: 30px;
    }
}
.listDataBy::-webkit-scrollbar {
    width: 6px;
}
.listDataBy::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
}
.baseData {
    display: none;
    max-width: 900px;
    padding: 33px 0 4px 0;
    position: absolute;
    background: #fff;
    z-index: 999;
    width: 840px;
    border-radius: 4px;
    min-height: 80px;
    overflow: auto;
    font-size: 16px;
    box-shadow: rgba(0, 0, 0, 0.12) 0 0 10px;
    li {
        padding: 0 0 18px 36px;
    }
    .baseDataTitle {
        font-size: 16px;
        font-family: PingFangSC-Regular;
        font-weight: bold;
        color: rgba(38, 38, 38, 1);
        overflow: auto;
        .baseDataTitleTxt {
            float: left;
        }
        .deleteIcon {
            padding: 0 70px;
            float: right;
        }
    }
    .history {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        div {
            width: 100px;
            color: #717171;
            padding: 16px 0 0 0;
            span:hover {
                cursor: pointer;
                color: #ed0287;
            }
        }
        .dividerContent {
            width: 100%;
            padding: 0 36px;
        }
    }
}
</style>