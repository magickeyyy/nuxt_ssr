/**
 * @Description: 搜索酒店表头部分。就不传初始值了，全部从sessionstorage中hotel_search获取启动参数，暴露出submit方法并传递格式化后的form
 * @Attention: 
 */
<template>
    <Form ref="form" :model="form" inline class="hisSearchHotel">
        <h3 v-if="$route.name==='hotel'">
            <span>游海</span>&nbsp;让酒店资源轻松获得
        </h3>
        <div style="width:100%;display:flex;padding-top:28px;">
            <FormItem prop="destination" style="margin:0;padding-right:20px;">
                <Cascader
                    placeholder="请选择目的地国家、城市"
                    class="his destination"
                    v-model="form.destination"
                    :data="destinationList"
                    :load-data="loadCity"
                    :clearable="false"
                    @on-change="changeDestination"
                ></Cascader>
            </FormItem>
            <BookHotel ref="date" :scene="'hotel'" :date="[form.checkInDate,form.checkOutDate]" trigger="custom" :onChange="changeDate">
                <div class="bookDate" @click="changeVisible">
                    <div :class="['time',{active:form.checkInDate}]">{{form.checkInDate?form.checkInDate:'入住日期'}}</div>
                    <div :class="['sepreat',{active:nightNum}]">{{nightNum?`${nightNum}晚`:'—'}}</div>
                    <div :class="['time',{active:form.checkOutDate}]">{{form.checkOutDate?form.checkOutDate:'入住日期'}}</div>
                </div>
            </BookHotel>
            <FormItem prop="room" style="margin:0;padding:0 10px 0 20px;">
                <InputNumber
                    class="roomNum"
                    :min="1"
                    v-model="form.bookingQuantity"
                    placeholder="房间数"
                ></InputNumber>
            </FormItem>
            <FormItem prop="member" style="margin:0;">
                <Dropdown ref="sss" class="his memberInfo" trigger="custom" :visible="visible" @on-clickoutside="visible=false">
                    <div :class="[{'active':visible},'member']" @click="visible=!visible;">
                        <div
                            :class="{'active':form.adultsQuantity||form.childQuantity}"
                        >{{form.adultsQuantity}}成人&nbsp;·&nbsp;{{form.childQuantity}}儿童</div>
                        <Icon type="ios-arrow-down" />
                    </div>
                    <DropdownMenu slot="list">
                        <div class="setMember">
                            <div class="top">
                                <div>
                                    <p>每间入住成人</p>
                                    <div class="change">
                                        <div :class="['jian',{disabled:form.adultsQuantity<=1}]" @click="addQuantity(-1, 'adultsQuantity')"><i class="iconfont iconjianshao"></i></div>
                                        <p>{{form.adultsQuantity}}成人</p>
                                        <div :class="['jia',{disabled:form.adultsQuantity>=9}]" @click="addQuantity(1, 'adultsQuantity')"><i class="iconfont iconzengjia"></i></div>
                                    </div>
                                </div>
                                <div>
                                    <p>每间入住儿童</p>
                                    <div class="change">
                                        <div :class="['jian',{disabled:form.childQuantity<=0}]" @click="addQuantity(-1, 'childQuantity')"><i class="iconfont iconjianshao"></i></div>
                                        <p>{{form.childQuantity}}儿童</p>
                                        <div :class="['jia',{disabled:form.childQuantity>=9}]" @click="addQuantity(1, 'childQuantity')"><i class="iconfont iconzengjia"></i></div>
                                    </div>
                                </div>
                            </div>
                            <div class="middle" v-show="form.childQuantity">
                                <p>请选择入住时儿童年龄</p>
                                <Select
                                    v-for="(v,i) in form.childAge"
                                    :key="i"
                                    v-model="form.childAge[i]"
                                >
                                    <Option
                                        v-for="(item,index) in ageList"
                                        :value="index"
                                        :key="index"
                                    >{{ item }}</Option>
                                </Select>
                            </div>
                            <div class="bottom">
                                <Button type="primary" @click="visible=false;">确认</Button>
                                <Button @click="cancelRoom">取消</Button>
                            </div>
                        </div>
                    </DropdownMenu>
                </Dropdown>
            </FormItem>
        </div>
        <div style="width:100%;display:flex;padding-top:20px;">
            <FormItem prop="hotelName" style="margin:0;padding-right:20px;">
                <Input
                    class="his hotelName"
                    v-model="form.hotelName"
                    placeholder="搜索酒店"
                    style="width: 360px"
                    clearable
                    @on-clear="removeHotelId"
                    @on-focus="removeHotelId"
                />
            </FormItem>
            <FormItem style="margin:0;padding-right:20px;">
                <Select v-model="form.nationality" class="his nation" placeholder="请选择国籍">
                    <Option v-for="(v,i) in nationList" :value="v.twoCharCode" :key="i">{{ v.locationNameChn }}</Option>
                </Select>
            </FormItem>
            <FormItem class="seeOnlyGroupRooms">
                <Checkbox :class="['his', {checked: form.seeOnlyGroupRooms}]" v-model="form.seeOnlyGroupRooms">只看团房</Checkbox>
            </FormItem>
            <Button type="primary" class="searchBtn" @click="submit">查询</Button>
        </div>
    </Form>
</template>

<script>
import HotelCalendar from '~/components/hotel/HotelCalendar';
import BookHotel from '~/components/common/AmpleCalender';
import { ChildrenAgeList } from '~/assets/js/hotel'
import { api_location, api_hotel } from '~/service/api'; 
import { API_LOCATION } from 'assets/api/public'
import { mapState, mapMutations } from 'vuex';
export default {
    name: 'HisSearchHotel',
    components: {
        HotelCalendar,
        BookHotel
    },
    props: {
        list: Array, // 酒店数组，
        cityName: Object, // 城市、国家名，面包屑使用
    },
    computed: {
        ...mapState('hotel', [ 'search' ]),
        nightNum() {
            // 入住多少晚
            if(this.form.checkInDate && this.form.checkOutDate) {
                return (new Date(this.form.checkOutDate).valueOf() - new Date(this.form.checkInDate).valueOf()) / 86400000;
            } else {
                return 0;
            }
        }
    },
    data() {
        const validateDestination = (rule, value, callback) => {
            if (value.length < 1) {
                callback(new Error('请选择国家和城市'));
            } else {
                callback();
            }
        };
        return {
            visible: false, // 入住人员drowpdown
            allCitylist: [],
            ageList: ChildrenAgeList, // 0≤age≤17
            countryList: [], // 国家列表
            nationList: [], // 国籍列表
            destinationList: [], // 目的地国家、城市列表
            form: {
                bookingQuantity: 1, // 预订房间数量
                checkInDate: '', // 入住时间xxxx-xx-xx
                checkOutDate: '', // 退房时间xxxx-xx-xx
                destination: [], // 目的地国家id及城市id,提交时要转成countryId：Number，cityId：Number
                hotelName: '', // 酒店名
                hotelId: '', // 酒店id，提交时转数字
                nationality: 'CN', // 入住者国籍二字码,中国
                seeOnlyGroupRooms: false, // 是否只看团房,
                adultsQuantity: 1, // 每间房入住成人数
                childQuantity: 0, // 每间房入住儿童数
                childAge: [], // 儿童年龄
            },
        };
    },
    mounted() {
        this.initForm();
        this.getCountryList();
        this.getNationList();
    },
    methods: {
        ...mapMutations('hotel', [ 'SET_SEARCH' ]),
        changeVisible() {
            this.$refs.date.visible = !this.$refs.date.visible;
        },
        addQuantity(n, key) {
            // 改变成人或儿童数量
            if((this.form[key] + n) > 9 || (this.form[key] + n) < (key==='adultsQuantity'?1:0)) return;
            this.form[key] = this.form[key] + n;
            if(key==='childQuantity' && n === -1) this.form.childAge.pop();
            if(key==='childQuantity' && n === 1) this.form.childAge.push(6);
        },
        cancelRoom() {
            // 取消添加每个房间入住成员情况
            this.form.adultsQuantity = 1;
            this.form.childQuantity = 0;
            this.form.childAge = [];
            this.visible = !this.visible;
        },
        submit() {
            // 点击搜索
            if (this.form.destination.length < 2) {
                this.$Message.error({ content: '请选择国家和城市', duration: 1.5 });
                return;
            }
            if (!this.form.checkInDate||!this.form.checkOutDate) {
                this.$Message.error({ content: '请选择入住日期', duration: 1.5 });
                return;
            }
            this.SET_SEARCH(this.form);
            let form = this.formatForm();
            this.$emit('search', form);
        },
        formatForm() {
            // 按接口格式化参数
            let form = {};
            let _this = this;
            Object.keys(this.form).map(v => {
                if (v !== 'destination') {
                    form[v] = _this.form[v];
                }
                if(v === 'childAge') {
                    form[v] = _this.form[v].join(',');
                }
            });
            form['countryId'] = this.form.destination[0]*1;
            form['cityId'] = this.form.destination[1]*1;
            return form;
        },
        changeDate(arr) {
            // 修改入住离开日期
            this.form.checkInDate = arr[0];
            this.form.checkOutDate = arr[1];
        },
        getCountryList() {
            this.$axios({...API_LOCATION.allCountry})
                .then(res => {
                    if (res.success) {
                        this.countryList = res.data.list;
                        let arr = []
                        res.data.list.map((v, i) => {
                            if(v.nameCn && v.id) {
                                v['children'] = [];
                                v['value'] = v.id * 1;
                                v['label'] = v.nameCn;
                                v['loading'] = false;
                                v['index'] = i;
                                v.id = v.id * 1;
                                arr.push(v);
                            }
                            return v;
                        });
                        this.destinationList = arr;
                    }
                })
        },
        getNationList(){
            this.$axios({...API_LOCATION.nationList, params: {id:333}})
                .then(res=>{
                    if(res.success){
                        this.nationList = res.data;
                        if(this.search && search.nationality) {
                            this.form.nationality = search.nationality;
                        }
                    }
                })
        },
        loadCity(item, callback) {
            // 动态加载国家下城市列表
            // 只要初始值this.form.destination[0]有值就会自动执行此方法
            item.loading = true;
            this.$axios.get(api_location.treeByCountry, { params: { countryId: item.id } }).then(res => {
                if (res.success) {
                    let citys = res.data.trees.map((v, i) => {
                        return {
                            value: v.id * 1,
                            label: v.nameCn,
                            nameEn: v.nameEn
                        };
                    });
                    // 某些国家即城市，就在城市栏回填国家
                    if(citys.length === 0) {
                        citys = [{
                            value: item.id * 1,
                            label: item.nameCn,
                            nameEn: item.nameEn
                        }]
                    }
                    this.destinationList[item.index].children = citys;
                    // 如果加载的城市列表中有搜索历史中的城市就说明要回填
                    // this.form.destination会在created中初始化
                    let selectedCity = citys.find(v => v.value === this.form.destination[1]);
                    if(selectedCity) {
                        // 必须重设一次，不然不回显
                        this.form.destination = [item.value, selectedCity.value]
                    }
                }
                item.loading = false;
                callback();
            });
        },
        initForm() {
            if (this.search) {
                // 必须初始化数据避免过多表单验证
                this.form = { ...this.search };
            }
        },
        removeHotelId(){ // 避免从sessionStorage初始化后一直存在
            this.form.hotelId = '';
            this.form.hotelName = "";
        },
        changeDestination(value, selectedData){
            let cityName = {
                    nameCn: selectedData[1].label,
                    nameEn: selectedData[1].nameEn
                }
            this.$emit('update:cityName',cityName)
        }
    },
};
</script>

<style lang='less' scoped>
@deep: ~'>>>';
.hisSearchHotel {
    width: 1180px;
    margin: 0 auto;
    background-color: #fff;
    box-shadow: 0px 6px 15px 0px rgba(0, 0, 0, 0.15);
    border-radius: 4px;
    padding: 3px 40px 34px 44px;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    > h3 {
        width: 100%;
        height: 54px;
        font-size: 18px;
        color: #999;
        padding-top: 16px;
        font-weight: 200;
        display: flex;
        align-items: center;
        span {
            font-size: 28px;
            color: #e9047b;
            font-weight: bold;
        }
    }
    // 预定时间
    .bookDate{
        width:360px;
        height:54px;
        border:1px solid #ccc;
        border-radius:4px;
        padding: 0 34px 0 66px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: #fff url('~assets/icon/icon_calendar_def.png') no-repeat 12px center;
        cursor: pointer;
        &:hover{
            background-image: url('~assets/icon/icon_calendar_active.png');
            border-bottom-color: #e9047b;
            box-shadow: 0 1px #e9047b;
        }
        .time{
            color: #ACACAC;
            font-size: 14px;
            &.active{
                color:#111;
            }
        }
        .sepreat{
            color: #ACACAC;
            &.active{
                line-height: 20px;
                padding: 0 6px;
                border-radius: 10px;
                background-color: #e9047b;
                color:#fff;
            }
        }
    }
    @{deep}.ivu-input-wrapper {
        .ivu-input {
            height: 54px;
            border: 1px solid rgb(204, 204, 204);
            border-radius: 4px;
            padding-left: 40px;
            font-size: 16px;
        }
        .ivu-input-icon {
            top: 11px;
            right: 9px;
            background-color: #fff;
        }
    }
    .destination {
        @{deep}.ivu-input-wrapper {
            width: 360px;
            .ivu-input {
                padding-right: 40px;
                background: url('~assets/icon/icon_local_def.png') no-repeat 10px center;
            }
            .ivu-input:focus,.ivu-input:hover {
                background-image: url('~assets/icon/icon_local_active.png');
                border-bottom-color: #e9047b;
                box-shadow: 0 1px #ea037c !important;
            }
        }
        @{deep}.ivu-select-dropdown {
            box-shadow: 0px 6px 16px 0px rgba(0, 0, 0, 0.2);
            padding: 0;
            margin-top: 10px;
            border-radius: 4px;
            height: 340px;
            max-height: 340px;
        }
        @{deep}.ivu-cascader-menu{
            width: 180px;
            height: 340px;
            overflow-x: hidden;
        }
        .box {
            width: 700px;
            padding: 2px 0 24px 40px;
            .history {
                font-size: 16px;
                .title {
                    line-height: 76px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding-right: 70px;
                    font-weight: bold;
                    div:hover {
                        background: url('~assets/icon/icon_trash_active.png') no-repeat center;
                    }
                    div {
                        width: 40px;
                        height: 76px;
                        cursor: pointer;
                        background: url('~assets/icon/icon_trash_def.png') no-repeat center;
                    }
                }
                ul {
                    display: flex;
                    flex-wrap: wrap;
                    li {
                        width: 100px;
                        color: #666666;
                        line-height: 22px;
                        padding-right: 10px;
                        padding-bottom: 24px;
                        cursor: pointer;
                    }
                    li:hover {
                        color: #e9047b;
                    }
                    li:nth-child(6n) {
                        padding-right: 0;
                    }
                }
            }
            .results {
                padding: 26px 0 18px;
                li {
                    padding-bottom: 22px;
                    p {
                        line-height: 32px;
                        font-size: 16px;
                        font-weight: bold;
                    }
                    div {
                        font-size: 14px;
                        color: #999;
                        line-height: 22px;
                    }
                }
            }
        }
    }
    @{deep}.roomNum {
        width: 150px;
        height: 54px;
        padding-left: 40px;
        background: url('~assets/icon/icon_room_def.png') no-repeat 10px center;
        border: 1px solid rgba(204, 204, 204, 1);
        border-radius: 4px;
        .ivu-input-number-input-wrap {
            height: 100%;
            .ivu-input-number-input {
                height: 100%;
                font-size: 16px;
            }
        }
        .ivu-input-number-handler-wrap {
            display: none;
        }
    }
    .roomNum.ivu-input-number-focused {
        border-color: rgba(204, 204, 204, 1);
        border-bottom-color: #e9047b;
        box-shadow: 0 1px #ea037c;
        background-image: url('~assets/icon/icon_room_active.png');
    }
    .roomNum:hover {
        border-bottom-color: #e9047b;
        box-shadow: 0 1px #ea037c;
    }
    // 每间房入住成员信息
    @{deep}.memberInfo {
        > .ivu-select-dropdown {
            left: -204px !important;
        }
    }
    .member {
        width: 174px;
        height: 54px;
        border: 1px solid rgb(204, 204, 204);
        border-radius: 4px;
        display: flex;
        align-items: center;
        cursor: pointer;
        &:hover{
            border-bottom-color: #ea037c;
            box-shadow: 0 1px #ea037c;
        }
        > div {
            width: 150px;
            padding: 10px;
            line-height: 30px;
            text-align: center;
            font-size: 16px;
            overflow: hidden;
            color: #acacac;
        }
        .active {
            color: #111;
        }
        .ivu-icon{
            transform: rotate(-360deg);
            transition: transform 0.3s;
        }
    }
    .member.active {
        border-bottom-color: #ea037c;
        box-shadow: 0 1px #ea037c;
        .ivu-icon{
            transform: rotate(-180deg);
            transition: transform 0.3s;
        }
    }
    // 设置入住成员信息面板
    .setMember {
        width: 380px;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 6px 16px 0px rgba(0, 0, 0, 0.2);
        border-radius: 4px;
        padding: 0 30px;
        p {
            font-size: 14px;
            color: #222;
        }
        .top {
            padding-bottom: 16px;
            border-bottom: 1px dashed rgb(240, 240, 240);
            border-radius:2px;
            > div {
                padding-top: 18px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                .change{
                    display: flex;
                    line-height: 28px;
                    color:#111;
                    font-size: 12px;
                    border:1px solid rgba(223, 223, 223, 1);
                    text-align: center;
                    >div{
                        width: 28px;
                        height: 100%;
                    }
                    .jia{
                        border-left: 1px solid rgba(223, 223, 223, 1);
                    }
                    .disabled{
                        color:#ccc;
                        background:rgba(249,249,249,1);
                    }
                    .jian{
                        border-right: 1px solid rgba(223, 223, 223, 1);
                    }
                    p{
                        width: 64px;
                    }
                }
            }
        }
        .middle {
            padding: 12px 0;
            border-bottom: 1px dashed rgb(240, 240, 240);
            @{deep}.ivu-select {
                width: 100px;
                .ivu-select-selection {
                    border: 1px solid rgba(204, 204, 204, 1);
                    border-radius: 2px;
                    height: 30px;
                }
                .ivu-select-dropdown {
                    background: rgba(255, 255, 255, 1);
                    box-shadow: 0px 6px 16px 0px rgba(0, 0, 0, 0.2);
                    border-radius: 4px;
                    max-height: 330px;
                    overflow-y: scroll;
                }
            }
            @{deep}.ivu-select-visible .ivu-select-selection {
                box-shadow: none;
            }
            > div:nth-of-type(3n + 2) {
                padding: 0 10px 10px;
            }
            > div {
                padding-bottom: 10px;
            }
        }
        .bottom {
            padding: 12px 0 16px;
            display: flex;
            justify-content: flex-end;
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
    .hotelName{
        @{deep}.ivu-input{
            background: url('~assets/icon/icon_hotel_def_999.png') no-repeat 10px center;
            background-size: 22px;
        }
        @{deep}.ivu-input:hover,@{deep}.ivu-input:focus{
            background-image: url('~assets/icon/icon_hotel_active.png');
        }
    }
    @{deep}.nation {
        font-size: 16px;
        .ivu-select-dropdown{
            max-height: 340px;
            height: 340px;
        }
        .ivu-select-selection {
            height: 54px;
            width: 360px;
            border: 1px solid rgba(204, 204, 204, 1);
            border-radius: 4px;
            &:hover{
                box-shadow: 0 1px #ea037c;
                border-bottom-color: #e9047b;
                >div{
                    background-image: url('~assets/icon/icon_nation_active.png');
                    background-repeat: no-repeat;
                    background-position: 11px center;
                }
            }
            > div {
                height: 54px;
                line-height: 54px;
                padding-left: 40px;
                background: url('~assets/icon/icon_nation_def.png') no-repeat 10px center;
            }
            .ivu-select-placeholder {
                line-height: 54px;
                height: 54px;
                font-size: 16px;
            }
            .ivu-select-selected-value {
                font-size: 16px;
            }
        }
        .ivu-select-selection-focused{
            >div{
                background-image: url('~assets/icon/icon_nation_active.png');
                background-repeat: no-repeat;
                background-position: 11px center;
            }
        }
    }
    @{deep}.seeOnlyGroupRooms {
        margin: 0;
        padding-right: 20px;
        width: 150px;
        .ivu-form-item-content {
            height: 54px;
            display: flex;
            align-items: center;
            .his.ivu-checkbox-wrapper {
                color: #a9a9a9;
            }
        }
    }
    .searchBtn {
        width: 174px;
        height: 54px;
        font-size: 16px;
        margin-left: 10px;
    }
    // 搜索目的地
    @{deep}.searchInput {
        .ivu-input {
            width: 360px;
            background: url('~assets/icon/icon_local_def.png') no-repeat 10px center;
        }
        .ivu-input:focus {
            border-bottom-color: #e9047b;
            box-shadow: 0 1px #ea037c;
            background-image: url('~assets/icon/icon_local_active.png');
        }
        .ivu-select-dropdown {
            left: 0px !important;
            padding: 0;

            .ivu-select-dropdown-list {
                > div {
                    width: 700px;
                }
            }
        }
        .default {
            font-size: 16px;
            padding: 0 36px 0 40px;
            .title {
                line-height: 76px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding-right: 60px;
                font-weight: bold;
                div:hover {
                    background: url('~assets/icon/icon_trash_active.png') no-repeat center;
                }
                div {
                    width: 40px;
                    height: 76px;
                    cursor: pointer;
                    background: url('~assets/icon/icon_trash_def.png') no-repeat center;
                }
            }
            .options {
                display: flex;
                flex-wrap: wrap;
                .ivu-select-item {
                    width: 100px;
                    color: #666666;
                    line-height: 22px;
                    padding-right: 10px;
                    padding-bottom: 24px;
                    padding: 4px 10px 24px;
                    cursor: pointer;
                }
                .ivu-select-item:hover {
                    color: #e9047b;
                    background-color: transparent;
                }
                .ivu-select-item:nth-child(6n) {
                    padding-right: 0;
                }
                .ivu-select-item:nth-child(6n + 1) {
                    padding-left: 0;
                }
            }
            .history {
                padding-bottom: 12px;
                border-bottom: 1px dashed #e6e6e6;
            }
            .recommend {
                padding-bottom: 26px;
            }
        }
        .searchResult {
            padding: 6px 30px 18px;
            .ivu-select-item {
                margin-top: 26px;
                padding: 0 10px;
                div {
                    line-height: 32px;
                    font-size: 16px;
                    font-weight: bold;
                }
                p {
                    font-size: 14px;
                    color: #999;
                    line-height: 22px;
                }
            }
        }
    }
}
</style>
