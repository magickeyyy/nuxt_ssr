<template>
    <div class="peopleTotal">
        <Dropdown
            trigger="custom"
            class="memberInfo"
            :visible="visible"
            @on-clickoutside="visible=false"
        >
            <div :class="[{'active':visible},'member']" @click="visible=!visible;">
                <div
                    :class="{'active':roomInfo.adultsQuantity||roomInfo.childQuantity}"
                >{{roomInfo.adultsQuantity}}成人&nbsp;·&nbsp;{{roomInfo.childQuantity}}儿童</div>
                <i class="iconfont iconopen" style="float:right" />
            </div>
            <DropdownMenu slot="list">
                <div class="setMember">
                    <div class="top">
                        <div>
                            <p>每间入住成人</p>
                            <InputNumber class="his" :min="1" v-model="roomInfo.adultsQuantity"></InputNumber>
                        </div>
                        <div>
                            <p>每间入住儿童</p>
                            <InputNumber
                                class="his"
                                :min="0"
                                v-model="roomInfo.childQuantity"
                                @on-change="changeChild"
                            ></InputNumber>
                        </div>
                    </div>
                    <div class="middle" v-show="roomInfo.childQuantity">
                        <p>请选择入住时儿童年龄</p>
                        <br />
                        <Select
                            style="width: 100px"
                            v-for="(v,i) in roomInfo.childQuantity"
                            :key="i"
                            v-model="roomInfo.childAge[i]"
                        >
                            <Option
                                v-for="(item,index) in ageList"
                                :value="index"
                                :key="index"
                            >{{ item }}岁</Option>
                        </Select>
                    </div>
                    <div class="bottom">
                        <Button type="primary" @click="setRoomInfo">确认</Button>
                        <Button @click="cancelRoom">取消</Button>
                    </div>
                </div>
            </DropdownMenu>
        </Dropdown>
    </div>
</template>

<script>
export default {
    name: '',
    data() {
        return {
            visible: false,
            roomInfo: {
                // 每间住房成员情况，脱离出form保证只有在确认时才修改form数据
                adultsQuantity: 1, // 每间房入住成人数
                childQuantity: 0, // 每间房入住儿童数
                childAge: [], // 儿童年龄
            },
            ageList: Array.from({ length: 16 }, (v, k) => k),
        };
    },
    methods: {
        changeChild(v) {
            const len = this.roomInfo.childAge.length - v;
            if (len > 1) {
            } else {
                this.roomInfo.childAge.push(0);
            }
        },
        setRoomInfo() {
            this.visible = !this.visible;
            this.$emit('update:checkdata', this.roomInfo);
        },
        cancelRoom() {
            this.visible = !this.visible;
            this.roomInfo = {
                adultsQuantity: 1,
                childQuantity: 0,
                childAge: [],
            };
        },
    },
};
</script>

<style scoped lang="less">
.peopleTotal {
    height: 40px;
    overflow: hidden;
    width: inherit;
    .memberInfo {
        height: 40px;
        width: inherit;
        .member {
            width: inherit;
            height: 40px;
            border: 1px solid #dfdfdf;
            border-radius: 2px;
            display: flex;
            align-items: center;
            > div {
                width: 96%;
                padding: 5px;
                line-height: 30px;
                font-size: 16px;
                overflow: hidden;
                color: #acacac;
            }
            .active {
                color: #111;
            }
        }
        .member.active {
            border-bottom: 2px solid #ea037c;
            box-shadow: 0 1px #ea037c;
        }
        .setMember {
            width: 380px;
            background: rgba(255, 255, 255, 1);
            border-radius: 2px;
            padding: 0 30px;
            p {
                font-size: 14px;
                color: #222;
            }
            .top {
                padding-bottom: 16px;
                border-bottom: 1px dashed rgb(240, 240, 240);
                > div {
                    padding-top: 18px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
            }
            .middle {
                padding: 12px 0;
                border-bottom: 1px dashed rgb(240, 240, 240);
                /deep/.ivu-select {
                    width: 100px;
                    .ivu-select-selection {
                        border: 1px solid rgba(204, 204, 204, 1);
                        border-radius: 2px;
                        height: 30px;
                    }
                    .ivu-select-dropdown {
                        background: rgba(255, 255, 255, 1);
                        box-shadow: 0px 6px 16px 0px rgba(0, 0, 0, 0.2);
                        border-radius: 2px;
                        max-height: 330px;
                        overflow-y: scroll;
                    }
                }
                /deep/.ivu-select-visible .ivu-select-selection {
                    box-shadow: none;
                }
                > div:nth-of-type(3n + 2) {
                    margin: 0 10px;
                }
                > div {
                    padding-bottom: 10px;
                }
            }
            .bottom {
                padding: 12px 0 16px;
                display: flex;
                justify-content: center;
                .ivu-btn {
                    width: 100px;
                    height: 36px;
                    margin-left: 10px;
                    font-size: 16px;
                    border-radius: 2px;
                }
                .ivu-btn-default,
                .ivu-btn-default:hover {
                    border: 1px solid rgba(239, 239, 239, 1);
                    color: #6c6c6c;
                    box-shadow: none;
                }
            }
        }
    }
}
</style>
