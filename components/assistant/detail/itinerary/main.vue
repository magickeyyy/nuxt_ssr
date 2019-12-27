<template>
    <div class="itinerary" :style="listGroup_S">
        <div class="title">
            <span class="lineIn">&nbsp;</span> 行程安排
        </div>
        <draggable class="list-group" tag="ul" v-model="list" v-bind="dragOptions" @end="checkMove">
            <transition-group type="transition" name="flip-list">
                <li
                    v-for="(element, index) in list"
                    :key="element.sort"
                    :class="listIndex === index ? 'list-group-item dayActive':'list-group-item'"
                    @click="checkItem(element,index)"
                >
                    <div
                        :class="listIndex === index ? 'itemDate itemDate_active':'itemDate'"
                    >D{{index+1}}</div>
                    <div class="itemInfo">
                        <div class="dateI">{{ element.planDate || '暂无出发日期' }}</div>
                        <div class="cityName" v-if="element.desCityName !== ''">
                            <span
                                v-for="(it, i) in element.desCityName.split(',')"
                                :key="i+'_cityInListDay'"
                            >
                                {{ it }}
                                <span v-if="i!==element.desCityName.split(',').length-1">></span>
                            </span>
                        </div>
                        <div class="cityName" v-if="element.desCityName === ''">暂无安排</div>
                    </div>
                    <div class="sgdpointer">
                        <Dropdown
                            trigger="click"
                            placement="bottom-end"
                            @on-click="(name) => showDetail(name, element, index)"
                        >
                            <i class="iconfont iconmore"></i>
                            <DropdownMenu slot="list" class="optionList">
                                <DropdownItem class="dd_items" name="addbefor">
                                    <i class="iconfont iconadd1"></i> 之前插入一天
                                </DropdownItem>
                                <DropdownItem class="dd_items" name="addafter">
                                    <i class="iconfont iconadd1"></i> 之后插入一天
                                </DropdownItem>
                                <DropdownItem class="dd_items" name="delday">
                                    <i class="iconfont iconadd1"></i> 删除该日
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                </li>
            </transition-group>
        </draggable>
    </div>
</template>

<script>
import draggable from 'vuedraggable';
import moment from 'moment';
export default {
    name: '',
    components: {
        draggable,
    },
    props: ['itineraryDayChange'],
    created() {
        document.body.ondrop = function(event) {
            event.preventDefault();
            event.stopPropagation();
        };
    },
    data() {
        return {
            isDragging: false,
            showOption: false,
            listIndex: 0,
            startDate: '',
            listGroup_S: {
                width: '300px',
            },
            list: [],
        };
    },
    methods: {
        setListData(data) {
            this.list = data;
            this.resetDate(data[0].planDate);
        },

        checkItem(element, index) {
            // 选择中单日，传输当日数据到 dayDetail
            this.listIndex = index;
            this.itineraryDayChange(element, index);
        },
        cityListChange(cityList) {
            // 父 调用，修改 单日城市列表
            this.list[this.listIndex].desCityName = cityList;
        },
        dateChange(date) {
            // 父 调用，修改 单日日期
            this.list[this.listIndex].planDate = date;
            // 计算第一天日期
            const startDate = moment(date).subtract(this.listIndex, 'days');
            this.resetDate(startDate);
        },
        checkMove: function(e) {
            // 日程拖动时计算
            // 日期计算
            if (e.oldDraggableIndex !== 0 && e.newDraggableIndex !== 0) {
                this.resetDate(this.list[0].planDate);
            } else {
                if (e.oldDraggableIndex === 0) {
                    this.resetDate(this.list[e.newDraggableIndex].planDate);
                }
                if (e.newDraggableIndex === 0) {
                    this.resetDate(this.list[1].planDate);
                }
            }

            if (
                (e.oldDraggableIndex < this.listIndex && e.newDraggableIndex < this.listIndex) ||
                (e.oldDraggableIndex > this.listIndex && e.newDraggableIndex > this.listIndex)
            ) {
                return false;
            }

            //  active计算
            if (this.listIndex === e.oldDraggableIndex) {
                this.listIndex = e.newDraggableIndex;
                this.itineraryDayChange(this.list[this.listIndex], this.listIndex);
                return false;
            }
            if (e.newDraggableIndex > this.listIndex) {
                this.listIndex -= 1;
            } else if (e.newDraggableIndex < this.listIndex) {
                this.listIndex += 1;
            } else {
                if (e.oldDraggableIndex < this.listIndex) {
                    this.listIndex -= 1;
                }
                if (e.oldDraggableIndex > this.listIndex) {
                    this.listIndex += 1;
                }
            }
            this.itineraryDayChange(this.list[this.listIndex], this.listIndex);
        },
        resetDate(startDate) {
            this.list.map((it, i) => {
                it.planDate = moment(startDate)
                    .add(i, 'day')
                    .format('YYYY-MM-DD');
                it.sort = i;
            });
        },
        delDay() {
            // 父 调用，删除当前 listIndex
            if (this.list.length > 1) {
                this.list.splice(this.listIndex, 1);
                this.listIndex = 0;
                this.itineraryDayChange(this.list[this.listIndex], this.listIndex);
            }
        },
        showDetail(name, element, index) {
            // 日程操作
            try {
                const event = window.event || arguments.callee.caller.arguments[0];
                event.stopPropagation();
            } catch (e) {
                return false;
            }
            if (name === 'delday') {
                if (this.list.length > 1) {
                    this.list.splice(index, 1);
                    if (index === this.listIndex) {
                        this.listIndex = 0;
                    }
                    if (index < this.listIndex) {
                        this.listIndex -= 1;
                    }
                    this.itineraryDayChange(this.list[this.listIndex], this.listIndex);
                }
            } else if (name === 'addbefor') {
                if (index === 0) {
                    return false;
                }
                this.list.splice(index, 0, { desCityName: '', id: '', planDate: '', sort: 2 });
                this.listIndex = index + 1;
            } else {
                if (index === this.list.length - 1) {
                    return false;
                }
                this.list.splice(index + 1, 0, { desCityName: '', id: '', planDate: '', sort: 2 });
            }
            this.resetDate(this.list[0].planDate);
        },
        getLength() {
            return this.list.length;
        },
    },
    computed: {
        dragOptions() {
            return {
                animation: 0,
                group: 'description',
                disabled: false,
                ghostClass: 'ghost',
            };
        },
    },
};
</script>

<style scoped lang="less">
.itinerary {
    height: 1010px;
    border: 1px solid rgba(237, 237, 237, 1);
    box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.03);
    background: #fff;
    border-radius: 4px;
    .title {
        font-size: 20px;
        padding: 18px 24px;
        border-bottom: 1px solid rgba(237, 237, 237, 1);
        .lineIn {
            vertical-align: sub;
            width: 5px;
            height: 20px;
            background: rgba(237, 2, 135, 1);
            border-radius: 3px;
            display: inline-block;
        }
    }
    .list-group {
        height: 940px;
        overflow: auto;
        &::-webkit-scrollbar {
            /*滚动条整体样式*/
            width: 4px; /*高宽分别对应横竖滚动条的尺寸*/
            height: 4px;
        }
        &::-webkit-scrollbar-thumb {
            /*滚动条里面小方块*/
            border-radius: 5px;
            -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
            background: rgba(0, 0, 0, 0.2);
        }
        &::-webkit-scrollbar-track {
            /*滚动条里面轨道*/
            -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
            border-radius: 0;
            background: rgba(0, 0, 0, 0.1);
        }
        .list-group-item {
            cursor: pointer;
            min-height: 100px;
            padding: 36px 20px;
            overflow: hidden;
            &:hover {
                background: #ededed;
            }
            i {
                cursor: pointer;
            }
        }
        .flip-list-move {
            transition: transform 0.5s;
        }
        .no-move {
            transition: transform 0s;
        }
        .ghost {
            opacity: 0.5;
            background: #c8ebfb;
        }
        .dayActive {
            border-left: 2px solid #ed0287;
            background: #f9f9f9;
        }
        .itemDate {
            width: 48px;
            height: 26px;
            border-radius: 13px;
            font-size: 18px;
            font-family: OswaldMedium;
            font-weight: bold;
            color: rgba(255, 255, 255, 1);
            line-height: 26px;
            text-align: center;
            float: left;
            margin-right: 11px;
            background: #e5e5e5;
        }
        .itemDate_active {
            background: #ed0287;
        }
        .itemInfo {
            float: left;
            font-size: 14px;
            width: 160px;
            .dateI {
                color: #111111;
                line-height: 26px;
            }
            .cityName {
                margin-top: 8px;
                color: #777777;
            }
        }
        .sgdpointer {
            float: right;
            color: #dddddd;
            // position: relative;
            .optionList {
                position: absolute;
                right: 0;
                background: #fff;
                background: rgba(255, 255, 255, 1);
                border: 1px solid rgba(217, 217, 217, 1);
                box-shadow: 0px 6px 16px 0px rgba(0, 0, 0, 0.2);
                border-radius: 4px;
                z-index: 10;
                .dd_items {
                    height: 40px;
                    line-height: 40px;
                    padding: 0 30px;
                    color: #747474;
                    .iconadd1 {
                        margin-right: 10px;
                        font-size: 12px;
                    }
                    &:hover {
                        color: #ec0286;
                    }
                }
            }
        }
    }
}
</style>
