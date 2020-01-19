<template>
    <div class="infinity">
        <div class="template">
            <li ref="message"
                class="infinity-item">
                <img class="infinity-avatar">
                <div class="infinity-bubble">
                    <h3></h3>
                    <p></p>
                    <div class="first"></div>
                    <div class="second"></div>
                    <div class="third"><span>&yen;</span></div>
                </div>
            </li>
            <li ref="tombstone"
                class="infinity-item tombstone">
                <img class="infinity-avatar"
                     :src="require('../../assets/public_img/no_img320-430.png')">
                <div class="infinity-bubble">
                    <h3></h3>
                    <p></p>
                    <div class="first"></div>
                    <div class="second"></div>
                    <div class="third"><span>&yen;</span></div>
                </div>
            </li>
        </div>
        <div ref="chat"
             class="infinity-timeline">
            <ul>
            </ul>
        </div>
    </div>
</template>

<script>
    import { API_HOTEL } from '~/assets/api/hotel';
    import BScroll from '@better-scroll/core'
import InfinityScroll from '@better-scroll/infinity'

BScroll.use(InfinityScroll)
    export default {
        layout() {
            return 'scroll'
        },
        data() {
            return {
                hotelList: [],
                pageNo: 1,
                total: 0,
                totalPage: 0,
                scroll: null,
            };
        },
        mounted() {
            this.initRootFontSize(true);
            this.getHotelList()
                .then(res => {
                    if(res) {
                        this.createInfinityScroll();
                    }
                })
        },
        beforeDestroy() {
            this.initRootFontSize();
        },
        methods: {
            createInfinityScroll() {
                this.scroll = new BScroll(this.$refs.chat, {
                    infinity: {
                        render: (item, div) => {
                            console.dir(div)
                            div = div || this.$refs.message.cloneNode(true)
                            div.dataset.id = item.hotelId
                            div.querySelector(
                                '.infinity-avatar'
                            ).src = item.hotelImageUrl;
                            div.querySelector('.infinity-bubble h3').textContent = item.hotelName;
                            div.querySelector('.infinity-bubble p').textContent = item.addressChn;
                            div.querySelector('.first').textContent = item.supportFacilities;
                            div.querySelector('.second').textContent = item.addressEng;
                            div.querySelector('.third').textContent = item.lowestPrice;
                            return div
                        },
                        createTombstone: () => {
                            return this.$refs.tombstone.cloneNode(true)
                        },
                        fetch: count => {
                            // Fetch at least 30 or count more objects for display.
                            count = Math.max(100, count)
                            return new Promise((resolve, reject) => {
                                // Assume 50 ms per item.
                                setTimeout(() => {
                                    if (++this.pageNo > this.totalPage) {
                                        resolve(false)
                                    } else {
                                        resolve(Promise.all(this.hotelList))
                                    }
                                }, 2000)
                            })
                        }
                    }
                })
            },
            initRootFontSize(set) {
                if(set) {
                    document.documentElement.style.fontSize = (document.documentElement.clientWidth || document.body.clientWidth) / 375 * 100 + 'px';
                    document.documentElement.style.height = '100%';
                    document.body.style.fontSize = '16px';
                    document.body.style.height = '100%';
                } else {
                    document.documentElement.style.fontSize = '';
                    document.documentElement.style.height = '';
                    document.body.style.fontSize = '';
                    document.body.style.height = '';
                }
            },
             getHotelList() {
                let data = this.formatForm(this.mixin_m_SStorage('get', 'hotel_search'));
                data['pageSize'] = 100;
                return this.$axios({...API_HOTEL.searchHotel, data}).then(res => {
                    if (res.success) {
                        this.hotelList = res.data.records.map(v => {
                            v['supportFacilities'] =
                                v.supportFacilities && v.supportFacilities.length > 0
                                    ? v.supportFacilities.split(',').slice(0, 2)
                                    : [];
                            v.ratings = (v.ratings / 10).toFixed(1);
                            v.star = Number(v.star);
                            this.mapMarks = this.mapMarks + v.latitude + ',' + v.longitude + '|';
                            return v;
                        });
                        this.pageNo = res.data.pageNo * 1 || 1;
                        this.total = res.data.total * 1;
                        this.totalPage = res.data.totalPage * 1;
                        return this.hotelList.length;
                    } else {
                        return 0;
                    }
                });
            },
            formatForm(data) {
                // 按接口格式化参数
                let form = {};
                Object.keys(data).map(v => {
                    if (v !== 'destination') {
                        form[v] = data[v];
                    }
                    if(v === 'childAge') {
                        form[v] = data[v].join(',');
                    }
                });
                form['countryId'] = data.destination[0]*1;
                form['cityId'] = data.destination[1]*1;
                return form;
            },
        }
    };
</script>

<style scoped lang="less">
@rpx: 0.01rem;
.infinity{
    height: 100%;
    padding: 16px;
}
.template{
    display: none;
}
.infinity-item{
    display: flex;
    justify-content: space-between;
    .infinity-avatar{
        width: 120*@rpx;
        height: 110*@rpx;
        border: none;
    }
    .infinity-bubble{
        width: 100%;
        padding-left: 10*@rpx;
        >h3{
            height: 34*@rpx;
            background-color: #ccc;
            margin-bottom: 6*@rpx;
        }
        >p{
            height: 10*@rpx;
            background-color: #ccc;
            margin-bottom: 6*@rpx;
        }
        .first, .second, .third{
            height: 20*@rpx;
            margin-bottom: 6*@rpx;
            background-color: #ccc;
        }
        .third{
            color:#EC0286;
            font-size: 18*@rpx;
            font-family: OswaldMedium;
            text-align: right;
            line-height: 20px;
            span{
                font-size: 12px;
            }
        }
    }
}
</style>
