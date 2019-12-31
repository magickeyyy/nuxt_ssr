<template>
    <div class="hotel">
        <HisSearchHotel ref="search" @search="searchHotel" />
        <div class="browsed" v-if="logined&&hotelHistory.length>0">
            <h3>浏览历史</h3>
            <Carousel :dots="'none'">
                <CarouselItem v-for="(item,index) in hotelHistory" :key="index">
                    <div class="item" v-for="(v,i) in item" :key="i">
                        <h3 @click="searchById(v)">{{v.hotelName}}</h3>
                        <p @click="searchById(v)">{{v.checkInDate}}—{{v.checkOutDate}}</p>
                        <p
                            @click="searchById(v)"
                        >{{v.bookingQuantity}}间客房·{{v.adultsQuantity}}成人·{{v.childQuantity}}儿童</p>
                        <img src="~assets/icon/icon_cha_active.png" @click.self="remove(index, i)" />
                    </div>
                </CarouselItem>
            </Carousel>
        </div>
    </div>
</template>

<script>
import HisSearchHotel from '~/components/hotel/HisSearchHotel';
import { mapState, mapMutations } from 'vuex';
import { api_hotel } from '~/service/api';
export default {
    layout: 'fixedNav',
    components: {
        HisSearchHotel,
    },
    data() {
        return {
            hotelHistory: [],
        };
    },
    created() {
        this.getHistory();
    },
    computed: {
        ...mapState('login', [ 'logined' ]),
        ...mapState('hotel', [ 'search', 'history' ]),
        splitReservedHotel() {
            return this.splitArry(this.reservedHotel, 3);
        },
    },
    methods: {
        ...mapMutations('hotel', [ 'SET_SEARCH', 'SET_HISTORY' ]),
        splitArry(list = [], cl) {
            const len = Math.ceil(list.length / cl);
            let arr = [];
            for(let i = 0; i < len; i++) {
                arr.push(list.splice(0,cl))
            }
            return arr;
        },
        searchHotel(form) {
            this.SET_SEARCH(form);
            this.mixin_m_SStorage('set', 'hotel_search', form);
            this.$router.push({ name: 'hotel-search' });
        },
        getHistory() {
             const arr = this.history;
            this.hotelHistory = this.splitArry(arr, 5);
        },
        remove(index, i) {
            let arr = this.history;
            const position = index * 5 + i;
            arr.splice(position,1);
            this.SET_HISTORY('hotel_history', arr);
            this.hotelHistory = this.splitArry(arr, 5);

        },
        async searchById(data) {
            // 重置记录的时间为今明天
            let time = new Date();
            let y = time.getFullYear();
            let m = time.getMonth();
            let d = time.getDate();
            let mt = new Date(y, m, d + 1);
            data.checkInDate = this.mixin_m_formatDate(time);
            data.checkOutDate = this.mixin_m_formatDate(mt);
            this.SET_SEARCH(data);
            this.$nuxt.$router.push({ name: 'hotel-search' });
        },
        getSearchLogs() {
            // 搜索历史，接口待优化
            let token = sessionStorage.token;
            if (!token) return;
            this.$axios.post(api_hotel.searchLogs, {}, { custom: { token: true, encode: 'urlencoded' } }).then(res => {
                if (res.success && res.data.length > 0) {
                    this.hotelHistory = res.data;
                }
            });
        },
    },
};
</script>

<style scoped lang="less">
@deep: ~'>>>';
@import url('~assets/style/variable.less');
.container {
    width: 1180px;
}
.hotel {
    background-image: url('~assets/banner/banner_hotel.png');
    padding-top: 378px;
    .back;
    background-position: center 0;
    .search {
        // 搜索表单
        padding: 0 44px 0 40px;
        background-color: #fff;
        border-radius: 4px;
        height: 250px;
        box-shadow: 0px 6px 15px 0px rgba(0, 0, 0, 0.15);
        margin-bottom: 25px;
        .title {
            line-height: 82px;
            padding-bottom: 2px;
            font-size: 18px;
            color: #999;
            span {
                font-size: 34px;
                color: #e9047b;
            }
        }
        .form {
            display: flex;
            flex-wrap: wrap;
            @{deep}.ivu-input-wrapper {
                width: 378px;
                height: 54px;
                .ivu-input {
                    height: 100%;
                    border: 1px solid #ccc;
                    padding-left: 40px;
                    border-radius: 4px;
                    color: #222;
                    font-size: 14px;
                    background-color: transparent;
                }
                .ivu-input:focus {
                    border-color: #e9047b;
                }
                .ivu-input-icon {
                    top: 12px;
                }
            }
            .member {
                // 预定成员
                .result {
                    width: 300px;
                    height: 54px;
                    line-height: 54px;
                    border: 1px solid rgb(204, 204, 204);
                    border-radius: 4px;
                    color: #222;
                    display: flex;
                    justify-content: space-between;
                    p {
                        height: 100%;
                    }
                    div {
                        text-align: center;
                    }
                    p:first-of-type {
                        width: 36px;
                        background: url('~assets/icon/icon_user_def.png') no-repeat 13px center;
                    }
                    p:last-of-type {
                        width: 30px;
                        background: url('~assets/icon/icon_shangxia_def.png') no-repeat 0 center;
                    }
                }
                .options {
                    width: 300px;
                    height: 225px;
                    background: rgba(255, 255, 255, 1);
                    box-shadow: 0px 6px 16px 0px rgba(0, 0, 0, 0.2);
                    border-radius: 4px;
                    padding: 34px 0 10px;
                    .item {
                        width: 100%;
                        height: 32px+ 28;
                        display: flex;
                        justify-content: flex-end;
                        padding: 0 26px 28px;
                        position: relative;
                        div {
                            width: 32px;
                            height: 32px;
                            background-size: 32px;
                            flex-shrink: 0;
                        }
                        p {
                            white-space: nowrap;
                            position: absolute;
                            color: #222;
                            top: 0;
                            left: 26px;
                            line-height: 32px;
                        }
                        .add {
                            background: url('~assets/icon/icon_circle_add_def.png') no-repeat center;
                        }
                        .add:hover {
                            background-image: url('~assets/icon/icon_circle_add_active.png');
                        }
                        .subtract {
                            background: url('~assets/icon/icon_circle_del_def.png') no-repeat center;
                        }
                        .subtract:hover {
                            background-image: url('~assets/icon/icon_circle_del_active.png');
                        }
                        .subtract.disable,
                        .subtract.disable:hover {
                            background-image: url('~assets/icon/icon_circle_del_dis.png');
                        }
                        input {
                            font-size: 18px;
                            color: #222;
                            border: none;
                            outline: none;
                            width: 60px;
                            line-height: 32px;
                            background-color: transparent;
                            flex-shrink: 0;
                            text-align: center;
                        }
                    }
                }
                @{deep}.ivu-select-dropdown {
                    box-shadow: none;
                }
                @{deep}.ivu-select-dropdown {
                    border-radius: 0px;
                }
            }
            .member.ivu-dropdown:hover {
                .result {
                    border-bottom: 2px solid #e9047b;
                    p:first-of-type {
                        background: url('~assets/icon/icon_user_active.png') no-repeat 13px center;
                    }
                    p:last-of-type {
                        background: url('~assets/icon/icon_shangxia_active.png') no-repeat 0 center;
                    }
                }
            }
            .nation {
                // 选择国籍
                width: 378px;
                height: 54px;
                border-radius: 4px;
                @{deep}.ivu-select-selection {
                    height: 100%;
                    border: 1px solid rgb(204, 204, 204);
                    span {
                        padding-left: 40px;
                        height: 54px;
                        line-height: 54px;
                        background: url('~assets/icon/icon_nation_def.png') no-repeat 10px center;
                    }
                }
            }
            @{deep}.ivu-select-visible .ivu-select-selection {
                box-shadow: none;
                span {
                    background-image: url('~assets/icon/icon_nation_active.png');
                }
            }
            @{deep}.ivu-select-dropdown {
                box-shadow: 0px 6px 16px 0px rgba(0, 0, 0, 0.2);
                border-radius: 4px;
                max-height: 340px;
                .ivu-select-dropdown-list {
                    .ivu-select-item {
                        padding: 0 42px;
                        line-height: 36px;
                        color: #222;
                    }
                    .ivu-select-item:hover {
                        color: #e9047b;
                        background-color: #f9f9f9;
                    }
                }
            }
            .input {
                background-repeat: no-repeat;
                background-position: 12px center;
                margin-bottom: 20px;
            }
            .area {
                margin-bottom: 20px;
            }
            .startEnd {
                background-image: url('~assets/icon/icon_calendar_def.png');
                margin: 0 18px 20px 22px;
            }
            .room {
                background-image: url('~assets/icon/icon_user_def.png');
                width: 300px;
            }
            .addition {
                width: 378px;
                height: 54px;
                margin: 0 18px 0 22px;
                display: flex;
                align-items: center;
            }
            .ivu-btn-primary {
                width: 300px;
                height: 54px;
            }
        }
    }
    .browsed {
        // 浏览历史
        width: 1200px;
        margin: 0 auto;
        > h3 {
            line-height: 68px;
            font-size: 24px;
            color: #222;
            padding-left: 10px;
        }
        @{deep}.ivu-carousel {
            margin-left: -10px;
            .ivu-carousel-item {
                display: flex;
                padding: 0 0 20px 20px;
                .item {
                    width: 228px;
                    height: 102px;
                    padding: 16px 10px 20px 30px;
                    flex-shrink: 0;
                    border: 1px solid rgba(224, 224, 224, 1);
                    margin-right: 10px;
                    position: relative;
                    background: #fff url('~assets/icon/icon_hotel_def.png') no-repeat 8px 20px;
                    box-shadow: 0px 6px 8px 0px rgba(0, 0, 0, 0.15);
                    cursor: pointer;
                    h3 {
                        font-size: 14px;
                        color: #222;
                        font-weight: bold;
                        line-height: 30px;
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                    }
                    p {
                        line-height: 18px;
                        color: #999;
                        font-size: 13px !important;
                        letter-spacing: 0px;
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                    }
                    img {
                        position: absolute;
                        top: 10px;
                        right: 10px;
                        display: none;
                    }
                }
                .item:hover {
                    box-shadow: 0px 6px 8px 0px rgba(0, 0, 0, 0.15);
                    img {
                        display: block;
                    }
                }
                .item:nth-child(5n) {
                    margin-right: 0;
                }
            }
            .ivu-carousel-arrow {
                // display: none;
                background: transparent url('~assets/icon/icon_toleft_def.png') no-repeat center;
                top: 50px;
            }
            .ivu-carousel-arrow.left {
                left: -20px;
            }
            .ivu-carousel-arrow.right {
                background-image: url('~assets/icon/icon_toright_def.png');
                right: -30px;
            }
            .ivu-carousel-dots-inside {
                display: none;
            }
        }
    }
}
.area {
    width: 900px;
    padding: 3px 40px 14px;
    border-radius: 4px;
    background-color: #fff;
    list-style: none;
    h3 {
        font-size: 16px;
        color: #222;
        line-height: 1;
        padding-top: 30px;
    }
    ul {
        display: flex;
        flex-wrap: wrap;
        border-bottom: 1px solid #fff;
        padding-bottom: 36px;
        border-image: url('~assets/public_img/repeat_border.png') 6 repeat;
        li {
            line-height: 1;
            padding-top: 30px;
            margin-right: 68px;
            color: #666;
        }
        li:hover {
            color: #e9047b;
        }
    }
    .searchHistory {
        font-size: 16px;
        color: #666;
        position: relative;
        border-bottom: 1px dashed #ebebeb;
        .delete {
            width: 18px;
            height: 18px;
            background: url('~assets/icon/icon_trash_def.png') no-repeat center;
            background-size: 18px;
            position: absolute;
            right: 0;
            top: 30px;
        }
        .delete:hover {
            background-image: url('~assets/icon/icon_trash_active.png');
        }
    }
    .hot {
        h3 {
            padding-bottom: 10px;
        }
    }
}
.cities {
    width: 900px;
    padding: 12px 40px 35px;
    background-color: #fff;
    list-style: none;
    .city {
        padding-top: 16px;
        div {
            font-size: 16px;
            color: #222;
            line-height: 26px;
        }
        p {
            font-size: 14px;
            color: #999;
            line-height: 24px;
        }
    }
}
</style>
