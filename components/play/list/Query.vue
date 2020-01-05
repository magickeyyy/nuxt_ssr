<template>
    <div class="querys">
        <div class="queryContent">
            <div v-for="(item, index) in tagList"
                 :key="index"
                 class="lines"
                 v-show="showList(index)">
                <div class="lineTitle">{{item.labelName}}</div>
                <!-- 单选 -->
                <div class="lineText"
                     v-if="item.selectType==='SINGLE_SELECT'">
                    <div :class="item.checkAll?'lineActive quan':'quan'"
                         @click="checkItem(item.selectType,1,item,index)">全部</div>
                    <div :class="v.flag?'lineActive quan':'quan'"
                         v-for="(v, i) in item.labelItems"
                         :key="i"
                         @click="checkItem(item.selectType,0,item,index,v,i)">{{v.name}}</div>
                </div>
                <!-- 多选 -->
                <div class="lineBox"
                     v-if="item.selectType==='MULTI_SELECT'">
                    <div :class="item.checkAll?'lineActive ban':'ban'"
                         @click="checkItem(item.selectType,1,item,index)">
                        <svg class="icon"
                             aria-hidden="true"
                             v-show="item.checkAll">
                            <use xlink:href="#iconxuanzhong"></use>
                        </svg>
                        <svg class="icon"
                             aria-hidden="true"
                             v-show="!item.checkAll">
                            <use xlink:href="#iconweixuanzhong"></use>
                        </svg>
                        <span>全部</span>
                    </div>
                    <div :class="v.flag?'lineActive ban':'ban'"
                         v-for="(v, i) in item.labelItems"
                         :key="i"
                         @click="checkItem(item.selectType,0,item,index,v,i)">
                        <svg class="icon"
                             aria-hidden="true"
                             v-show="v.flag">
                            <use xlink:href="#iconxuanzhong"></use>
                        </svg>
                        <svg class="icon"
                             aria-hidden="true"
                             v-show="!v.flag">
                            <use xlink:href="#iconweixuanzhong"></use>
                        </svg>
                        <span>{{v.name}}</span>
                    </div>
                </div>
                <!-- 推广标签 -->
                <div class="lineBox"
                     v-if="item.selectType==='PROMOTION'">
                    <div :class="v.flag?'lineActive ban':'ban'"
                         v-for="(v, i) in item.labelItems"
                         :key="i"
                         @click="checkItem(item.selectType,0,item,index,v,i)">
                        <svg class="icon"
                             aria-hidden="true"
                             v-show="v.flag">
                            <use xlink:href="#iconxuanzhong"></use>
                        </svg>
                        <svg class="icon"
                             aria-hidden="true"
                             v-show="!v.flag">
                            <use xlink:href="#iconweixuanzhong"></use>
                        </svg>
                        <span>{{v.name}}</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="extendContent"
             v-if="tagList.length>3">
            <span @click="isExtend=!isExtend"
                  class="extendBtn">{{isExtend?'收起':'展开'}}更多筛选条件</span>
            <svg class="icon"
                 aria-hidden="true"
                 v-show="!isExtend">
                <use xlink:href="#iconzuocedaohang_open" />
            </svg>
            <svg class="icon"
                 aria-hidden="true"
                 v-show="isExtend">
                <use xlink:href="#iconzuocedaohang_close" />
            </svg>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { TagType, ResTypeToServer } from '@/assets/js/play';

export default {
    name: 'Query',
    props: {
        // 1餐厅2门票3特色体验
        resourceType: {
            type: String,
            required: true,
        },
        changeTag: {
            type: Function,
            required: true,
        },
        tagList: {
            type: Array,
            required: true,
        },
    },
    data() {
        return {
            isExtend: false,
        };
    },
    methods: {
        showList(index) {
            if (this.isExtend) return true;
            if (!this.isExtend && index < 3) return true;
            return false;
        },
        checkItem(selectType, e, item, index, v, i) {
            // 标签选择事件
            let tagList = this.tagList;
            let _this =this;
            switch (selectType) {
                case 'SINGLE_SELECT': // 单选
                    if (e) {
                        // e===1,点击全部
                        let res = tagList[index].labelItems.find(cell => cell.flag === true);
                        if (item.checkAll && !res) return;
                        // 已经全选且没有选中项，不动作
                        else {
                            tagList[index].checkAll = true;
                            tagList[index].labelItems.forEach(cell => {
                                if (cell.flag) {
                                    cell.flag = false;
                                }
                            });
                        }
                    } else {
                        // 单选时：默认选择全部，选中一项去除全部，去除选中项恢复全部
                        let cur = tagList[index].labelItems;
                        cur[i].flag = !cur[i].flag;
                        cur.map((cell, id) => {
                            if (id !== i) {
                                cell.flag = false;
                            }
                        });
                        tagList[index].checkAll = false;
                    }
                    break;
                case 'MULTI_SELECT': // 多选,有全部
                    if (e) {
                        // 点击全部
                        tagList[index].checkAll = !tagList[index].checkAll;
                        tagList[index].labelItems.map(cell => {
                            cell.flag = tagList[index].checkAll;
                        });
                    } else {
                        // 单选时：默认选择全部，选中一项去除全部，去除选中项恢复全部
                        let cur = tagList[index].labelItems;
                        cur[i].flag = !cur[i].flag;
                        let n = 0;
                        cur.map(cell => {
                            if (cell.flag) {
                                n++;
                            }
                        });
                        if (n === cur.length) {
                            tagList[index].checkAll = true;
                        } else {
                            tagList[index].checkAll = false;
                        }
                    }
                    break;
                case 'PROMOTION': // 推广标签，无全部
                    let cur = tagList[index].labelItems;
                    cur[i].flag = !cur[i].flag;
                    break;
            }
            let list = [];
            tagList.map((it, i) => {
                if (it.checkAll) return;
                it.labelItems.map((ij, i2) => {
                    if (ij.flag) {
                        list.push(_this.resourceType + '/' + it.labelId + '/' + ij.id);
                    }
                });
            });
            this.changeTag(list);
        },
    },
};
</script>

<style scoped lang="less">
.querys {
    background-color: #fff;
    .queryContent {
        font-size: 14px;
        .lines {
            padding: 10px 16px;
            line-height: 24px;
            border-bottom: 1px dashed #e8e8e8;
            display: flex;
            &:last-child {
                border-bottom: none;
            }
            .lineTitle {
                padding: 0 16px;
                color: #999999;
                display: inline-block;
                margin-right: 30px;
                flex-shrink: 0;
            }

            .lineText {
                color: #222222;
                font-size: 14px;
                display: flex;
                flex-wrap: wrap;
                svg {
                    width: 18px;
                    height: 18px;
                }
                > div,
                > ul > li {
                    padding: 0 8px;
                    margin-right: 40px;
                    &:hover {
                        cursor: pointer;
                        color: #ea037c;
                    }
                }
                > ul {
                    display: flex;
                }
                .lineActive,
                .lineActive:hover {
                    border-radius: 12px;
                    background-color: #e9047b;
                    color: #fff;
                }
            }
            .lineBox {
                color: #222222;
                font-size: 14px;
                display: flex;
                flex-wrap: wrap;
                svg {
                    width: 18px;
                    height: 18px;
                }
                .quan {
                    padding: 0 10px;
                }
                .ban {
                    padding-right: 10px;
                }
                > div,
                > ul > li {
                    margin-right: 50px;
                    display: flex;
                    align-items: center;
                    &:hover {
                        cursor: pointer;
                        color: #ea037c;
                    }
                    span {
                        display: inline-block;
                        padding-left: 10px;
                    }
                }
                > ul {
                    display: flex;
                    flex-wrap: wrap;
                }
            }
        }
    }
}
.extendContent {
    margin-top: -1px;
    border-top: 1px solid #e8e8e8;
    color: #999;
    height: 54px;
    line-height: 54px;
    text-align: center;
    .extendBtn {
        &:hover {
            cursor: pointer;
        }
    }
}
</style>
