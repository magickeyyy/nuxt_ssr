// 供应商
<template>
    <div class="detail">
        <div class="route">
            您在这里：
            <nuxt-link to="/">首页</nuxt-link>&gt;
            <nuxt-link to="/hotel/search">{{$nuxt.$route.query.hotelName}}酒店预定</nuxt-link>&gt;
            <nuxt-link v-if="detail"
                       :to="{name:'hotel-detail',query:{hotelId:$nuxt.$route.query.hotelId}}"
                       exact
                       style="color:#e9047b">{{detail.nameChn}}预定</nuxt-link>
        </div>
        <div class="hotelInfo"
             v-if="detail">
            <div class="left">
                <div class="name">
                    <h3>{{detail.nameChn}}</h3>
                    <Rate disabled
                          allow-half
                          :value="detail.star*1"
                          class="his" />
                </div>
                <p>{{detail.nameEng}}</p>
                <div class="local">{{detail.addressEng}}</div>
                <div class="img"
                     v-if="detail.imageList">
                    <img :src="detail.imageList[0].imgUrl"
                         alt="加载失败"
                         v-noimg="'1120-430'" />
                    <div @click="modal = true"
                         v-if="detail.imageList[0].imgUrl!=='ssxxcc'">共{{detail.imageList.length}}张照片</div>
                </div>
            </div>
            <div class="right">
                <div class="rate">
                    <div>
                        <span>{{detail.commentScore}}</span>分
                    </div>
                    <div>
                        <p>评分</p>
                        <div>/10</div>
                    </div>
                </div>
                <div class="map">
                    <img :src="`https://ditu.google.cn/maps/api/staticmap?zoom=16&size=380x320&maptype=roadmap&markers=color:red%7Clabel:P%7C${detail.latitude},${detail.longitude}&key=AIzaSyDOW8NW4egQT4QFsyLzaOlDR95ib12XywM`" />
                </div>
            </div>
            <Modal v-model="modal"
                   footer-hide
                   :width="980"
                   v-if="detail.imageList">
                <div class="showImgs">
                    <Carousel v-model="imgOrder"
                              loop>
                        <CarouselItem v-for="(v,i) in detail.imageList"
                                      :key="i"
                                      style="width:792px;">
                            <img :src="v.imgUrl"
                                 alt="加载失败"
                                 v-noimg="'1120-430'" />
                        </CarouselItem>
                    </Carousel>
                    <ul>
                        <li v-for="(v,i) in detail.imageList"
                            :key="i"
                            :class="{'active': imgOrder===i}">
                            <img :src="v.imgUrl"
                                 alt="加载失败"
                                 v-noimg="'480-276'" />
                        </li>
                    </ul>
                </div>
            </Modal>
        </div>
        <div class="hotelDetail">
            <Anchor :affix="false"
                    class="anchor"
                    @on-select="activeLevel">
                <AnchorLink v-for="(v,i) in anchor"
                            :href="`?${urlData}#level${i}`"
                            :title="v"
                            :class="{'active':currentLevel===i}"
                            :key="i" />
            </Anchor>
            <!-- 团房 -->
            <div class="teamRoom"
                 v-if="login&&HiseasRoomRate.RoomList.length>0">
                <div class="title"></div>
                <div class="roomInfo">
                    <div class="item"
                         v-for="(item,index) in HiseasRoomRate.RoomList"
                         :key="index">
                        <div class="name">
                            <div>{{item.RoomTypeName}}</div>
                        </div>
                        <div class="bedList"
                             v-for="(v,i) in [item.RateInfoList[0]]"
                             :key="i">
                            <div class="left">
                                <div>
                                    适合住人数&emsp;
                                    <span>成人&le;{{v.PeopleNumber}}人</span>
                                </div>
                                <div>
                                    &emsp;|&emsp;早餐&emsp;
                                    <span>{{v.HasBreakfast?'免费':'付费'}}</span>
                                </div>
                                <!-- <div>&emsp;|&emsp;宽带&emsp;<span>{{v.Internet | nettype}}</span></div> -->
                            </div>
                            <div class="price">
                                <div>
                                    <span>&yen;</span>
                                    {{item.SaleTotalAmount}}
                                </div>
                            </div>
                            <div class="btn">
                                <Button type="primary"
                                        @click="bookingTeam(item,HiseasRoomRate.SupplierId)">预定</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 好巧房源:散客酒店 -->
            <h3 id="level0"
                class="title">全部房型</h3>
            <div>
                <div class="total"
                     v-for="(item,index) in HaoQiaoRoomRate.RoomList"
                     :key="index">
                    <ul class="thead">
                        <li class="w220">房型信息</li>
                        <li class="w188">床型及房间描述</li>
                        <li class="w140">餐食</li>
                        <li class="w208">政策</li>
                        <li class="w216">均价/房/晚</li>
                    </ul>
                    <div v-for="(v1,i1) in item.RateInfoList"
                         :key="i1">
                        <div class="tbody">
                            <div class="left w220">
                                <div class="img">
                                    <img :src="v1.ImageList[0]||'error'"
                                         alt=""
                                         v-noimg="''">
                                </div>
                                <div class="name">{{v1.RateNameChn}}</div>
                                <p>{{v1.RateNameEng}}</p>
                            </div>
                            <ul class="right">
                                <li v-for="(v2,i2) in v1.BedList"
                                    :key="i2">
                                    <div class="w188">
                                        <p style="font-weight:bold;">{{v2.Name}}</p>
                                        <div>{{v2.Desc}}</div>
                                    </div>
                                    <div class="w140"
                                         :style="{color:v1.Breakfast.NumBreakfasts==0?'#999999':''}">{{v1.Breakfast.BreakfastDesc}}</div>
                                    <div class="w208">
                                        <p v-for="(v3,i3) in v1.CancelPolicy"
                                           :key="i3">{{v3 | tranCancelPolicy}}</p>
                                        <p v-if="!v1.CancelPolicy||v1.CancelPolicy.length===0">不可退改</p>
                                    </div>
                                    <div class="w216">
                                        <div>
                                            <p>
                                                <span>&yen;</span>
                                                {{v1.NightlyRates[0].SaleRate}}
                                            </p>
                                        </div>
                                        <p>总价：&yen;{{v1.SaleTotalAmount}}</p>
                                    </div>
                                    <div>
                                        <Button type="primary"
                                                @click="booking(v1,HaoQiaoRoomRate.SessionId,HaoQiaoRoomRate.SupplierId)">预定</Button>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="login"
                     v-if="!login">
                    <Button type="primary"
                            @click="tohome">请登录以查看价格</Button>
                </div>
                <div v-if="login&&!HaoQiaoRoomRate.RoomList.length===0"
                     class="login">暂无数据</div>
            </div>
            <h3 id="level1"
                class="title">酒店介绍</h3>
            <div id="hotelInfo"
                 v-if="detail">
                <p>{{detail.introductionChn}}</p>
            </div>
            <h3 id="level2"
                class="title">酒店设施</h3>
            <div id="hotelFacility">
                <div>设施</div>
                <ul>
                    <li v-for="(v,i) in facility"
                        :key="i">{{v.nameChn}}</li>
                </ul>
            </div>
            <h3 id="level3"
                class="title">条款</h3>
            <div id="hotelClause">
                <div v-if="detail.checkInTime">
                    <div>
                        <span>入住时间</span><span>:&nbsp;</span>
                    </div>
                    <div>
                        <p>{{detail.checkInTime}}之后</p>
                    </div>
                </div>
                <div v-if="detail.checkOutTime">
                    <div>
                        <span>入住时间</span><span>:&nbsp;</span>
                    </div>
                    <div>
                        <p>{{detail.checkOutTime}}之后</p>
                    </div>
                </div>
                <div>
                    <div>
                        <span>儿童政策</span><span>:&nbsp;</span>
                    </div>
                    <div>
                        <p>所有额外入住的2岁以下的儿童，加婴儿床不收费。每间客房最多容纳1张加床</p>
                    </div>
                </div>
                <div v-if="detail.remarksChn">
                    <div><span>额外说明</span><span>:&nbsp;</span></div>
                    <div>
                        <p>{{detail.remarksChn}}</p>
                    </div>
                </div>
                <div>
                    <div>
                        <span>其他</span><span>:&nbsp;</span>
                    </div>
                    <div>
                        <p>禁止宠物及其他服务类动物入内</p>
                    </div>
                </div>
                <div>
                    <div v-if="detail&&checkIn.facilityDes">{{checkIn.nameChn}}：</div>
                    <p>{{checkIn.facilityDes}}</p>
                </div>
                <div>
                    <div v-if="detail&&checkOut.facilityDes">{{checkOut.nameChn}}：</div>
                    <p>{{checkOut.facilityDes}}</p>
                </div>
                <div v-for="(v,i) in clause"
                     :key="i">
                    <div v-if="v">{{v.nameChn}}：</div>
                    <p>{{v.facilityDes}}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { resType } from '~/assets/js/dictionary'
import { API_HOTEL } from '~/assets/api/hotel'
import { mapState, mapMutations } from 'vuex'
import { YHInternetType } from '~/assets/js/hotel'

export default {
    async asyncData({ store, $axios, route, redirect }) {
        let detail = {}
        // 获取酒店详情
        await $axios({
            ...API_HOTEL.hotelDetail,
            data: { hotelId: route.query.hotelId, $axios }
        })
            .then(res => {
                if (res.success) {
                    if (!res.data.imageList || res.data.imageList.length < 1) {
                        res.data.imageList = [{ imgUrl: 'ssxxcc' }]
                    }
                    res.data.commentScore = (
                        res.data.commentScore / 10
                    ).toFixed(1)
                    return res.data
                } else {
                    redirect(200, '/hotel')
                }
                return false
            })
            .then(res => {
                res ? (detail = res) : null
            })
        return {
            detail
        }
    },
    data() {
        return {
            urlData: this.$route.fullPath.split('?')[1],
            login: false, // 是否已登录
            modal: false, // 弹出酒店图片展示对话框
            imgOrder: 0,
            HaoQiaoRoomRate: {
                // 好巧售卖计划列表
                RoomList: []
            },
            HiseasRoomRate: {
                // 游海团房售卖计划列表
                RoomList: []
            },
            anchor: ['房型价格', '酒店介绍', '设施/服务', '条款'],
            currentLevel: 0 // 锚点激活序号
        }
    },
    filters: {
        nettype(v) {
            // 翻译游海团房网络介绍
            if (!v) return ''
            return YHInternetType[v]
        },
        tranCancelPolicy(v) {
            // 把每个房型的每条取消政策转成文本
            if (!v) return '不支持退改'
            return (
                new Date(v.cancelPolicyDate * 1).toLocaleDateString() +
                '前退改收费' +
                (v.cancelPolicyCancelCharge * 1).toFixed(2) +
                '元'
            )
        }
    },
    computed: {
        ...mapState('hotel', ['hotel_search']),
        ...mapState('login', ['logined']),
        showRoomRateList() {
            let arr = this.roomRateList
            if (arr.length && arr.find(v => v && v.RoomList.length > 0))
                return true
            else return false
        },
        facility() {
            // 设施
            if (this.detail && this.detail.facilities) {
                return this.detail.facilities.filter(
                    v => v.facilityDes === '有'
                )
            } else {
                return [{}]
            }
        },
        clause() {
            // 条款
            if (this.detail && this.detail.facilities) {
                return this.detail.facilities.filter(
                    v =>
                        v.facilityDes !== '有' &&
                        v.nameEng !== 'Check-in' &&
                        v.nameEng !== 'Check-out' &&
                        v.facilityDes !== '-'
                )
            } else {
                return [{}]
            }
        },
        checkIn() {
            // 入住时间
            const reg = /^\d+:\d+$/g
            if (this.detail && this.detail.facilities) {
                return (
                    this.detail.facilities.find(
                        v => v.nameEng === 'Check-in'
                    ) || {}
                )
            } else {
                return {}
            }
        },
        checkOut() {
            // 退房时间
            const reg = /^\d+:\d+$/g
            if (this.detail && this.detail.facilities) {
                return (
                    this.detail.facilities.find(
                        v => v.nameEng === 'Check-out'
                    ) || {}
                )
            } else {
                return {}
            }
        }
    },
    created() {
        if (this.logined && this.hotel_search) {
            this.login = true;
            this.getRoomList(this.$route.query.hotelId, this.hotel_search);
        }
    },
    mounted() {
        if(!this.mixin_m_SStorage('has', 'hotel_search')) this.$router.replace('/hotel');
        this.saveHistory(this.detail.nameEng);
        if(this.mixin_m_SStorage('has', 'token')) {
            this.login = true;
        }
        if(this.login && (!this.hotel_search || JSON.stringify(this.hotel_search) === '{}')) {
            let hotel_search = this.mixin_m_SStorage('get', 'hotel_search');
            this.SET_SEARCH(hotel_search);
            this.getRoomList(this.$route.query.hotelId, hotel_search);
        }
    },
    methods: {
        ...mapMutations('hotel', ['SET_ORDERPRE', 'SET_SEARCH']),
        ...mapMutations('login', ['SET_LOGIN']),
        bookingTeam(item, supplierId) {
            // 游海团组酒店预定
            let hotelId = this.$route.query.hotelId * 1
            let search = this.hotel_search;
            let rateCode = [];
            item.RateInfoList.map(v => {
                rateCode.push(v.RateCode)
            })
            let params = {
                adultsNum: search.adultsQuantity * 1,
                checkInDate: search.checkInDate,
                checkOutDate: search.checkOutDate,
                cancelPolicy: item.CancelPolicy,
                childrenAge: search.childAge.join(','),
                childrenNum: search.childQuantity,
                cityId: search.destination[1],
                hotelId: hotelId,
                nationality: search.nationality,
                rateCode: rateCode.join(), // 团组是吧每天的rateCode用逗号拼接成字符串
                roomCount: search.bookingQuantity,
                supplierId: supplierId * 1,
                totalAmount: item.SaleTotalAmount * 1 // 售卖计划中总房价
            }
            let member = this.getAllotment()
            this.$axios({ ...API_HOTEL.bookingPre, params }).then(res => {
                if (res.success) {
                    let result = res.data
                    result.cancelPolicy = this.cancelPolicy2(
                        JSON.parse(result.cancelPolicy)
                    )
                    this.SET_ORDERPRE({
                        type: 'YH',
                        pre: {
                            ...result,
                            img: this.detail.imageList[0].imgUrl,
                            nameChn: this.detail.nameChn,
                            nameEng: this.detail.nameEng,
                            addressChn: this.detail.addressChn,
                            addressEng: this.detail.addressEng,
                            star: this.detail.star * 1
                        },
                        member
                    })
                    this.$router.push({ name: 'hotel-team' })
                }
            })
        },
        booking(item, sessionId, supplierId) {
            // 好巧酒店预定
            let hotelId = this.$route.query.hotelId * 1
            let search = this.mixin_m_SStorage('get', 'hotel_search');
            let params = {
                adultsNum: search.adultsQuantity * 1,
                checkInDate: search.checkInDate,
                checkOutDate: search.checkOutDate,
                cancelPolicy: item.CancelPolicy,
                childrenAge: search.childAge.join(','),
                childrenNum: search.childQuantity,
                cityId: search.destination[1],
                hotelId: hotelId,
                nationality: search.nationality,
                rateCode: item.RateCode, // 对应好巧是价格套餐编码,对ERP是售卖计划id
                roomCount: search.bookingQuantity,
                sessionId,
                supplierId: supplierId * 1,
                totalAmount: item.SaleTotalAmount * 1 // 售卖计划中总房价
            }
            let member = this.getAllotment()
            this.$axios({ ...API_HOTEL.bookingPre, params }).then(res => {
                if (res.success) {
                    let result = res.data
                    result.cancelPolicy = this.cancelPolicy(
                        JSON.parse(result.cancelPolicy)
                    )
                    this.SET_ORDERPRE({
                        type: 'HQ',
                        pre: {
                            ...res.data,
                            img: this.detail.imageList[0].imgUrl,
                            nameChn: this.detail.nameChn,
                            nameEng: this.detail.nameEng,
                            addressChn: this.detail.addressChn,
                            addressEng: this.detail.addressEng,
                            star: this.detail.star * 1
                        },
                        member
                    })
                    this.$router.push({ name: 'hotel-scattered' })
                }
            })
        },
        getAllotment() {
            /**
             * @Description: 根据搜索条件中预定数量、每间房成人、儿童数量的生成一个数组，在订单页面填写入住成员信息
             * @Attention: 第一个房间第一个必须是成人且是主主入住人。iview select组件不能使用boolean做value
             */

            let search = this.mixin_m_SStorage('get', 'hotel_search')
            let arr = []
            if (search) {
                let {
                    bookingQuantity,
                    adultsQuantity,
                    childAge,
                    childQuantity
                } = { ...search }
                for (let i = 0; i < bookingQuantity; i++) {
                    arr[i] = []
                    for (let j = 0; j < adultsQuantity + childQuantity; j++) {
                        arr[i][j] = { lastName: '', firstName: '', adult: true }
                        if (j > adultsQuantity - 1) {
                            arr[i][j].adult = false
                            arr[i][j]['childAge'] =
                                childAge[j - adultsQuantity] * 1
                        }
                    }
                }
            }
            return arr
        },
        tohome() {
            this.$nuxt.$router.push({ name: 'hotel' })
        },
        activeLevel(i) {
            // 锚点激活
            this.currentLevel = Number(i.replace(/#level/gi, ''))
        },
        // 好巧取消政策
        cancelPolicy(arr) {
            if (!arr || arr.length === 0) return []
            return arr.map(v => {
                v.cancelPolicyDate = this.mixin_m_formatDate(
                    v.cancelPolicyDate * 1
                )
                v[
                    'str'
                ] = `${v.cancelPolicyDate}前取消收费${v.cancelPolicyCancelCharge}`
                return v
            })
        },
        // 团组取消政策
        cancelPolicy2(arr) {
            if (!arr || arr.length === 0) return []
            return arr.map(v => {
                v.cancelPolicyDate = this.mixin_m_formatDate(
                    v.cancelPolicyDate * 1
                )
                v[
                    'str'
                ] = `${v.cancelPolicyDate}后取消收费${v.cancelPolicyCancelCharge}`
                return v
            })
        },
        getRoomList(hotelId, search) {
            // 房间详情、售卖计划
            let data = {
                adult: search.adultsQuantity,
                checkInDate: search.checkInDate,
                checkOutDate: search.checkOutDate,
                children: search.childQuantity,
                childrenAge: search.childAge.join(','),
                cityID: search.destination[1],
                hotelID: hotelId,
                nationality: search.nationality,
                roomCount: search.bookingQuantity
            }
            this.$axios({ ...API_HOTEL.roomRateList, data }).then(res => {
                if (res.success) {
                    if (
                        res.data.HaoQiaoRoomRate &&
                        res.data.HaoQiaoRoomRate.RoomList.length > 0
                    ) {
                        this.HaoQiaoRoomRate = res.data.HaoQiaoRoomRate
                    }
                    if (
                        res.data.HiseasRoomRate &&
                        res.data.HiseasRoomRate.RoomList.length > 0
                    ) {
                        this.HiseasRoomRate = res.data.HiseasRoomRate
                    }
                }
            })
        },
        saveHistory(hotelName) {
            // 浏览历史
            let search = this.mixin_m_SStorage('get', 'hotel_search')
            let hotelId = this.$nuxt.$route.query.hotelId
            let his = this.mixin_m_LStorage('get', 'hotel_history')
            if (!his) this.mixin_m_LStorage('set', 'hotel_history', [])
            let a = his.find(v => v.hotelId === hotelId * 1)
            if (a) return
            let len = his.length
            let obj = { ...search, hotelId: hotelId * 1, hotelName }
            if (len < 10) {
                his.unshift(obj)
            } else {
                his.shift()
                his.unshift(obj)
            }
            this.mixin_m_LStorage('set', 'hotel_history', his)
        }
    }
}
</script>

<style scoped lang="less">
@deep: ~'>>>';
.detail {
    width: 1180px;
    max-width: 1180px;
    min-width: 1180px;
    margin-bottom: 100px;
}
.route {
    // 页头链接
    line-height: 64px;
    font-size: 14px;
    padding-top: 14px;
    a {
        color: #222;
        display: inline-block;
        padding: 0 6px;
    }
    .nuxt-link-exact-active {
        color: #e9047b;
    }
}
// 团房列表
.teamRoom {
    margin: 24px 20px 22px;
    border: 2px solid #e9047b;
    position: relative;
    padding: 40px 20px 0;
    > .title {
        width: 56px;
        height: 35px;
        background: url('~assets/public_img/img_bg3.png') no-repeat 0;
        position: absolute;
        top: 0;
        left: 0;
    }
    .roomInfo .item {
        padding: 25px 0 34px;
        border-bottom: 1px dashed #dfdfdf;
        &:last-child {
            border-bottom: none;
        }
        .name {
            display: flex;
            align-items: center;
            height: 30px;
            div {
                color: #111;
                font-size: 18px;
                font-weight: bold;
                margin-right: 10px;
            }
            p {
                font-size: 14px;
                color: #6c6c6c;
            }
        }
        .bedList {
            display: flex;
            height: 46px;
            align-items: center;
            padding-bottom: 6px;
            .left {
                width: 756px;
                padding-right: 20px;
                display: flex;
                font-size: 14px;
                div {
                    color: #999;
                }
                span {
                    color: #111;
                }
            }
            .price {
                width: 220px;
                > div {
                    color: #e9047b;
                    font-size: 24px;
                    font-family: OswaldMedium;
                    font-weight: bold;
                    span {
                        font-size: 14px;
                    }
                }
            }
            .btn {
                width: 120px;
                display: flex;
                justify-content: center;
                .ivu-btn-primary {
                    width: 100px;
                    height: 36px;
                    border-radius: 4px;
                    font-size: 14px;
                }
            }
        }
    }
}
.hotelInfo {
    // 简洁酒店信息
    border: 1px solid rgba(231, 231, 231, 1);
    box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.03);
    background-color: #fff;
    padding: 28px 20px;
    display: flex;
    justify-content: space-between;
    .left {
        width: 750px;
        .name {
            display: flex;
            h3 {
                font-size: 20px;
                line-height: 32px;
                padding-right: 10px;
            }
        }
        > p {
            font-size: 16px;
            line-height: 28px;
        }
        .local {
            // 地标
            font-size: 14px;
            padding-left: 16px;
            color: #6c6c6c;
            line-height: 58px;
            padding-bottom: 10px;
            background: url('~assets/icon/icon_local_def.png') no-repeat 0 22px;
            background-size: 14px 14px;
        }
        .img {
            width: 750px;
            height: 320px;
            position: relative;
            overflow: hidden;
            img {
                display: block;
                margin: 0 auto;
                max-width: 750px;
            }
            div {
                padding: 0 16px;
                line-height: 36px;
                background-color: rgba(0, 0, 0, 0.7);
                font-size: 14px;
                color: #fff;
                position: absolute;
                right: 10px;
                bottom: 10px;
                cursor: pointer;
            }
        }
    }
    .right {
        width: 378px;
        .rate {
            height: 46px+26+55;
            display: flex;
            padding: 26px 0 50px;
            > div:first-child {
                width: 70px;
                border-radius: 0 0 50% 0;
                background-color: #e9047b;
                text-align: center;
                line-height: 46px;
                font-size: 16px;
                color: #fff;
                margin-right: 2px;
                span {
                    font-size: 28px;
                    font-family: OswaldMedium;
                }
            }
            > div:last-child {
                color: #6c6c6c;
                p {
                    font-size: 24px;
                    line-height: 1;
                }
                div {
                    color: #999;
                    font-size: 14px;
                    line-height: 26px;
                }
            }
        }
        .map {
            width: 378px;
            height: 320px;
        }
    }
}
.hotelDetail {
    // 酒店详细信息
    background-color: #fff;
    margin-top: 12px;
    box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.03);
    > .ivu-btn {
        width: 90px;
        height: 36px;
        font-size: 14px;
    }
    > .title {
        padding: 10px 20px;
        font-size: 16px;
        color: #111;
        font-weight: bold;
        line-height: 32px;
    }
    .total {
        // 全部房间信息
        width: 1140px;
        margin: 10px 20px 0;
        border: 1px solid #f2f2f2;
        border-bottom: none;
        display: flex;
        flex-direction: column;
        .w220 {
            width: 220px;
        }
        .w188 {
            width: 188px;
        }
        .w140 {
            width: 140px;
        }
        .w208 {
            width: 208px;
        }
        .w216 {
            width: 216px;
        }
        .thead {
            height: 58px;
            background-color: #f9f9f9;
            color: #999;
            font-size: 14px;
            border-bottom: 1px solid #ededed;
            display: flex;
            line-height: 58px;
            li {
                padding-left: 28px;
            }
            li:first-child {
                padding-left: 20px;
            }
        }
        .tbody {
            flex: 1;
            display: flex;
            .left {
                border-right: 1px solid #f2f2f2;
                border-bottom: 1px solid #f2f2f2;
                padding: 20px;
                .img {
                    width: 180px;
                    img {
                        max-width: 180px;
                    }
                }
                .name {
                    font-weight: bold;
                    font-size: 16px;
                    padding-top: 7px;
                }
                p {
                    padding-top: 2px;
                    font-size: 13px;
                    color: #6c6c6c;
                }
            }
            .right {
                width: 918px;
                li {
                    display: flex;
                    border-bottom: 1px dotted #dfdfdf;
                    overflow: hidden;
                    height: 100%;
                    > div {
                        padding-left: 28px;
                        display: flex;
                        align-items: center;
                    }
                    > .disable {
                        color: #8e8e8e;
                    }
                    > div:nth-child(4) {
                        flex-direction: column;
                        justify-content: center;
                        align-items: flex-start;
                        div {
                            font-size: 24px;
                            font-family: OswaldMedium;
                            color: #e9047b;
                            font-weight: bold;
                            line-height: 1;
                            p {
                                span {
                                    font-size: 14px;
                                }
                            }
                        }
                        > p {
                            color: #999999;
                            font-size: 14px;
                        }
                    }
                    > div:last-child {
                        padding-left: 34px;
                        .ivu-btn-primary {
                            width: 100px;
                            height: 36px;
                            border-radius: 4px;
                            font-size: 14px;
                        }
                    }
                }
            }
        }
    }
    .login {
        margin: 0 20px;
        padding: 22px 0 58px;
        border-top: 1px dotted #dfdfdf;
        line-height: 22px;
        height: 300px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 16px;
        .ivu-btn-primary {
            border-radius: 4px;
            height: 40px;
            font-size: 16px;
        }
    }
    #hotelInfo {
        // 酒店介绍
        margin: 0 20px;
        padding: 22px 0 58px;
        border-top: 1px dotted #dfdfdf;
        font-size: 14px;
        color: #6c6c6c;
        line-height: 22px;
        p:nth-child(2) {
            padding: 8px 0;
        }
        p:nth-child(4) {
            padding: 8px 0;
        }
        p:nth-child(5) {
            padding: 26px 0;
        }
    }
    #hotelFacility {
        // 设施
        padding-top: 20px;
        margin: 0 20px 56px;
        border-top: 1px dotted #dfdfdf;
        > div {
            line-height: 80px;
            font-size: 14px;
            color: #111;
            font-weight: bold;
        }
        > ul {
            line-height: 36px;
            font-size: 14px;
            color: #6c6c6c;
            display: flex;
            flex-wrap: wrap;
            li {
                width: 190px;
                padding-left: 20px;
                background: url('~assets/icon/icon_correct_active.png')
                    no-repeat 0;
                color: #6c6c6c;
            }
        }
    }
    #hotelClause {
        //条款
        border-top: 1px dotted #dfdfdf;
        margin: 0 20px;
        padding-top: 20px;
        > div {
            font-size: 14px;
            line-height: 22px;
            padding: 4px 0;
            display: flex;
            div {
                color: #8e8e8e;
                flex-shrink: 0;
                &:first-child {
                    span:first-child {
                        display: inline-block;
                        min-width: 60px;
                        text-align: justify;
                        text-align-last: justify;
                    }
                }
                &:last-child {
                    color: #111;
                }
            }
        }
    }
}
@{deep}.anchor {
    background-color: rgba(249, 249, 249, 1);
    .ivu-anchor {
        padding-left: 0;
        display: flex;
        border-top: 1px solid rgba(232, 232, 232, 1);
        border-bottom: 1px solid rgba(232, 232, 232, 1);
        .ivu-anchor-link {
            padding: 0;
            width: 172px;
            height: 58px;
            display: flex;
            justify-content: center;
            align-items: center;
            a {
                color: #111111 !important;
                font-size: 16px;
            }
        }
        .ivu-anchor-link.active {
            border-right: 1px solid rgba(232, 232, 232, 1);
            border-left: 1px solid rgba(232, 232, 232, 1);
            border-top: 2px solid #ea037c;
            background: #fff;
        }
        .ivu-anchor-ink:before {
            display: none;
        }
    }
}
@{deep}.ivu-modal-content {
    border-radius: 0;
    .ivu-modal-body {
        padding: 0;
        .showImgs {
            height: 500px;
            background-image: linear-gradient(
                180deg,
                #ea037c 6px,
                #fff 6px,
                #fff 100%
            );
            box-shadow: 0px -4px 16px 0px rgba(0, 0, 0, 0.3);
            border-radius: 2px;
            padding: 32px 20px 26px;
            display: flex;
            justify-content: space-between;
            .ivu-carousel {
                width: 792px;
                height: 440px;
                .ivu-carousel-list {
                    height: 100%;
                    .ivu-carousel-item {
                        img {
                            width: 792px;
                            height: 440px;
                        }
                    }
                }
                .ivu-carousel-arrow-hover {
                    opacity: 1;
                }
                .ivu-carousel-arrow {
                    width: 30px;
                    height: 60px;
                    border-radius: 0;
                    background-size: 30px 60px;
                    background-repeat: no-repeat;
                    background-position: center;
                    i {
                        display: none;
                    }
                }
                .left.ivu-carousel-arrow {
                    background-image: url('~assets/icon/icon_arrowLeft_def.png');
                    left: 0;
                }
                .right.ivu-carousel-arrow {
                    background-image: url('~assets/icon/icon_arrowRight_def.png');
                    right: 0;
                }
                .left.ivu-carousel-arrow:hover {
                    background-image: url('~assets/icon/icon_arrowLeft_active.png');
                }
                .right.ivu-carousel-arrow:hover {
                    background-image: url('~assets/icon/icon_arrowRight_active.png');
                }
            }
            > ul {
                width: 120px;
                overflow-y: auto;
                li {
                    width: 100%;
                    height: 80px;
                    position: relative;
                    margin-bottom: 10px;
                    img {
                        width: 100%;
                        height: 100%;
                    }
                }
                li::after {
                    content: '';
                    display: block;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(255, 255, 255, 0.8);
                    position: absolute;
                    top: 0;
                    left: 0;
                }
                li.active::after {
                    display: none;
                }
            }
        }
    }
}
@{deep}.ivu-modal-close {
    display: block;
    width: 32px;
    height: 32px;
    background-image: url('~assets/icon/icon_del_def.png');
    right: -40px;
    i {
        display: none;
    }
}
</style>
