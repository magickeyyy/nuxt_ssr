<template>
    <div class="dayDetail">
        <div class="head">
            <Button class="primary_bk" size="large">
                <i class="iconfont iconbiaozhunmoshi"></i> 标准模式
            </Button>
            <Button class="btnr" size="large">
                <i class="iconfont iconditumoshi"></i> 地图模式
            </Button>
        </div>
        <div class="spAndDate">
            <div class="top">
                <div class="date">
                    <i class="iconfont iconhangchengriqi" style="float:left" />
                    <AmpleCalender
                        :scene="'assistant'"
                        placement="top-start"
                        trigger="click"
                        :date.sync="newDate"
                        :disdate="[newDate]"
                        ref="date"
                        style="float:left;width: 140px;margin-top:10px"
                    >
                        <span style="color:#999999;cursor:pointer" v-if="newDate===''">
                            &nbsp;选择日期 &nbsp;
                            <i
                                class="iconfont iconrili"
                                style="font-size: 12px;color:#D7D7D7"
                            />
                        </span>
                        <span v-else style="color:#111111">&nbsp; {{newDate | formatDate}}</span>
                    </AmpleCalender>
                </div>
                <div class="option">
                    <Dropdown
                        style="margin-left: 20px"
                        placement="bottom-end"
                        trigger="click"
                        @on-click="addListDataInDay"
                    >
                        <i class="iconfont iconzengjialeibie" />
                        <DropdownMenu slot="list" class="list">
                            <DropdownItem name="highlights">
                                <i class="iconfont iconzengjiahangchengliangdian" /> 添加行程亮点
                            </DropdownItem>
                            <DropdownItem name="car">
                                <i class="iconfont icontianjiabaoche" /> 添加包车
                            </DropdownItem>
                            <DropdownItem name="trafficInCity">
                                <i class="iconfont icontianjiachengjijiaotong" /> 添加城际交通
                            </DropdownItem>
                            <DropdownItem name="del">
                                <i class="iconfont iconqingchu-copy" /> 删除该天行程
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
            </div>
            <div class="citys">
                <Location ref="cityLocation" :listChange="cityListChanges" />
            </div>
        </div>
        <div class="resList">
            <draggable
                class="list-group"
                tag="ul"
                v-model="detailList"
                v-bind="dragOptions"
                @start="isDragging = true"
                @end="isDragging = false"
            >
                <transition-group type="transition" name="flip-list">
                    <li class="list-group-item" v-for="item in detailList" :key="item.id">
                        <ResItem
                            :item="item"
                            ref="RESI"
                            :setResKeyTemp="setResKeyTemp"
                            :delItem="delItem"
                        />
                    </li>
                </transition-group>
            </draggable>
        </div>

        <!-- 行程亮点弹窗 -->
        <Modal
            v-model="highlightsFlags"
            width="500"
            :closable="false"
            class="model_by_XM"
            :scrollable="false"
        >
            <i class="iconfont icondanchuang_guanbi closeIcon" @click="HighlightsCancel"></i>
            <div
                class="addTitle"
                style="font-size:18px;position:relative;left: -163px;top: -17px;font-weight: 600;"
            >新增行程亮点</div>
            <Input
                v-model="highlightsTextarea"
                type="textarea"
                placeholder="请输入本日行程亮点"
                :maxlength="1000"
                show-word-limit
                @on-change="highlightsChange"
                :autosize="{minRows: 8,maxRows: 8}"
                style="position:relative;font-size:14px;font-weight:400;color: #ACACAC"
            />
            <span
                style="position:absolute;bottom:105px;right:45px;font-size:12px;font-weight:400;color:#B5B5B5"
            >{{showLength}}/1000</span>
            <div slot="footer">
                <Button
                    type="primary"
                    style="margin-left:-310px;border-radius:2px;"
                    @click="HighlightsonOk"
                >确认</Button>
            </div>
        </Modal>

        <!-- 包车弹窗 -->
        <Modal
            v-model="carFlags"
            width="700"
            :closable="false"
            class="model_by_XM"
            :scrollable="false"
        >
            <i class="iconfont icondanchuang_guanbi closeIcon" @click="carCancel"></i>
            <div style="font-size:18px;text-align:left">添加包车</div>
            <div style="margin-top: 20px;font-size:14px;color:#555555;overflow:auto">
                <div style="float:left; margin-right: 20px;padding-top: 4px">包车方式</div>
                <div style="float:left; margin-right: 20px;">
                    <Select
                        style="width:170px;text-align:left"
                        placeholder="请选择包车方式"
                        v-model="carType"
                    >
                        <Option
                            v-for="(item, i) in Object.keys(carTypesinT)"
                            :key="i+'_carType'"
                            :value="item"
                        >{{carTypesinT[item]}}</Option>
                    </Select>
                </div>
                <div style="overflow:auto; margin-top: 40px;margin-left: 75px" v-if="carType==='1'">
                    <div style="float:left; margin-right: 20px;">
                        <Select
                            style="width:170px;text-align:left"
                            placeholder="请选择国家"
                            v-model="busCountry"
                        >
                            <Option
                                v-for="(it, i) in busCountryList"
                                :key="i+'_country'"
                                :value="it.value"
                            >{{it.label}}</Option>
                        </Select>
                    </div>
                    <div style="float:left; margin-right: 20px">
                        <Select
                            style="width:170px;text-align:left"
                            placeholder="请选择城市"
                            v-model="busCity"
                        >
                            <Option
                                v-for="(it, i) in busCityList"
                                :key="i+'_city'"
                                :value="it.value"
                            >{{it.label}}</Option>
                        </Select>
                    </div>
                    <div style="float:left;">
                        <Select
                            style="width:170px;text-align:left"
                            placeholder="请选择车型"
                            v-model="busType"
                        >
                            <Option
                                v-for="(it, i) in busTypeList"
                                :key="i+'_busType'"
                                :value="it.value"
                            >{{it.label}}</Option>
                        </Select>
                    </div>
                </div>
            </div>
            <div style="text-align:left; margin-top: 10px;color:#555555">
                <i class="iconfont icontishi" style="font-size: 12px;color:#ED0287"></i> 如行程跨区，则按价格高的区域计算
            </div>
            <div style="font-size:14px;text-align:left; margin-top: 30px;overflow:auto">
                <div style="float:left; margin-right: 20px;color:#555555">参考价格</div>
                <div style="float:left; margin-right: 20px;color:#0F0F0F">
                    <span style="float:left">{{carData.basicPrice}}/天</span>
                    <div
                        @click="goBUS"
                        style="float:left;margin-left: 20px;border: 1px solid #ED0287;padding:0 6px;color:#ED0287;cursor:pointer"
                    >
                        <i
                            class="iconfont iconjiantou-copy"
                            style="float:left;font-size: 18px;color:#ED0287"
                        ></i>
                        <div style="float:left;margin-top: 3px">了解包大车</div>
                    </div>
                </div>
            </div>
            <div
                style="font-size:14px;text-align:left; margin-top:30px;color:#555555;overflow:auto"
            >
                <div style="float:left; margin-right: 7px;color:#555555;padding-top: 4px">参考成本价</div>
                <Input style="float:left; width: 170px" v-model="carData.carBasePrice" />
            </div>
            <div
                style="font-size:14px;text-align:left; margin-top:30px;color:#555555;overflow:auto"
            >
                <div style="float:left; margin-right: 20px;color:#555555;padding-top: 4px">对外报价</div>
                <Input style="float:left; width: 170px" v-model="carData.carOutPrice" />
            </div>
            <div slot="footer" style=" margin-top:30px;text-align:left">
                <Button type="primary" style @click="carOk">确认</Button>
            </div>
        </Modal>

        <!-- 城际交通 -->
        <Modal
            v-model="trafficInCityFlags"
            width="700"
            :closable="false"
            class="model_by_XM"
            :scrollable="false"
        >
            <i class="iconfont icondanchuang_guanbi closeIcon" @click="HighlightsCancel"></i>
            <div
                class="addTitle"
                style="font-size:18px;position:relative;text-align:left;color:#111111"
            >城际交通</div>
            <Row
                style="text-align:left;margin-top: 20px"
                v-for="(item, i) in trafficInCityList"
                :key="i+'_traffic'"
            >
                <div style="margin-bottom: 10px;overflow:auto;padding: 2px 0">
                    <Col span="12">
                        <Col span="5" style="margin-top: 6px">交通方式</Col>
                        <Col span="16">
                            <Select v-model="item.away" :transfer="true" class="selectStyle_by_lxm">
                                <Option
                                    v-for="(item, i) in Object.keys(trafficType)"
                                    :key="i+'_trafficType'"
                                    :value="item"
                                >{{trafficType[item]}}</Option>
                            </Select>
                        </Col>
                    </Col>
                    <Col span="12">
                        <Col span="5" style="margin-top: 6px">班&emsp;&emsp;次</Col>
                        <Col span="16">
                            <Input v-model="item.number" class="selectStyle_by_lxm" />
                        </Col>
                    </Col>
                </div>
                <div style="margin-bottom: 10px;overflow:auto;padding: 2px 0">
                    <Col span="12">
                        <Col span="5" style="margin-top: 6px">出发站</Col>
                        <Col span="16" class="lxmsbContent">
                            <Input
                                style="width: 80px"
                                class="selectStyle_by_lxm lxmsb"
                                v-model="item.startCity"
                            />
                            <span style="color:#E8E8E8;border-left:1px solid #E8E8E8"></span>
                            <Input
                                style="width: 110px"
                                class="selectStyle_by_lxm lxmsb"
                                v-model="item.startLocation"
                            />
                        </Col>
                    </Col>
                    <Col span="12">
                        <Col span="5" style="margin-top: 6px">出发时间</Col>
                        <Col span="16" class="lxmsbContent">
                            <Select
                                v-model="item.startDate"
                                style="width: 110px"
                                :transfer="true"
                                class="selectStyle_by_lxm lxmsb"
                            >
                                <Option
                                    v-for="(item, i) in dayLenght"
                                    :key="i+'_startDate'"
                                    :value="item"
                                >第{{item}}天</Option>
                            </Select>
                            <span style="color:#E8E8E8;border-left:1px solid #E8E8E8"></span>
                            <TimePicker
                                type="time"
                                format="HH:mm"
                                placeholder="请选择时间"
                                class="lxmsb"
                                :transfer="true"
                                :editable="false"
                                style="width: 90px"
                                v-model="item.startTime"
                            ></TimePicker>
                        </Col>
                    </Col>
                </div>
                <div style="margin-bottom: 10px;overflow:auto;padding: 2px 0">
                    <Col span="12">
                        <Col span="5" style="margin-top: 6px">到达站</Col>
                        <Col span="16" class="lxmsbContent">
                            <Input
                                style="width: 80px"
                                class="selectStyle_by_lxm lxmsb"
                                v-model="item.endCity"
                            />
                            <span style="color:#E8E8E8;border-left:1px solid #E8E8E8"></span>
                            <Input
                                style="width: 110px"
                                class="selectStyle_by_lxm lxmsb"
                                v-model="item.endLocation"
                            />
                        </Col>
                    </Col>
                    <Col span="12">
                        <Col span="5" style="margin-top: 6px">到达时间</Col>
                        <Col span="16" class="lxmsbContent">
                            <Select
                                v-model="item.endDate"
                                style="width: 110px"
                                :transfer="true"
                                class="selectStyle_by_lxm lxmsb"
                            >
                                <Option
                                    v-for="(item, i) in dayLenght"
                                    :key="i+'_endDate'"
                                    :value="item"
                                >第{{item}}天</Option>
                            </Select>
                            <span style="color:#E8E8E8;border-left:1px solid #E8E8E8"></span>
                            <TimePicker
                                type="time"
                                format="HH:mm"
                                placeholder="请选择时间"
                                class="lxmsb"
                                :transfer="true"
                                :editable="false"
                                style="width: 90px"
                                v-model="item.endTime"
                            ></TimePicker>
                        </Col>
                    </Col>
                </div>

                <div style="text-align:center; width: 210px;margin: 30px auto; overflow:auto">
                    <div
                        v-if="i!==0"
                        style="float:left;border: 1px dashed #777;color:#777;width:100px;border-radius:2px;padding: 4px 0;cursor:pointer"
                    >x 删除该段</div>
                    <div
                        v-if="i===trafficInCityList.length-1"
                        style="float:right;border: 1px dashed #ED0287;color:#ED0287;width:100px;border-radius:2px;padding: 4px 0;cursor:pointer"
                    >+ 增加中转</div>
                </div>
            </Row>
            <div style="border-top: 1px dashed #EBEBEB;margin-bottom: 30px"></div>
            <Row>
                <Col span="12">
                    <Col span="5" style="margin-top: 6px">参考成本价</Col>
                    <Col span="16">
                        <Input
                            v-model="trafficPrice[0]"
                            class="selectStyle_by_lxm"
                            placeholder="仅用于内部核算成本"
                        />
                    </Col>
                </Col>
                <Col span="12">
                    <Col span="5" style="margin-top: 6px">对外报价</Col>
                    <Col span="16">
                        <Input
                            v-model="trafficPrice[1]"
                            class="selectStyle_by_lxm"
                            placeholder="用于对外单项报价"
                        />
                    </Col>
                </Col>
            </Row>
        </Modal>
    </div>
</template>

<script>
import AmpleCalender from '@/components/common/AmpleCalender/index';
import { api_bus } from '~/service/api';
import { carTypes, trafficTypes } from '@/assets/js/assistant/index';
import Location from './location';
import ResItem from './dayResItem';
import draggable from 'vuedraggable';
import moment from 'moment';
moment.locale('zh-cn');

export default {
    name: '',
    components: { ResItem, draggable, AmpleCalender, Location },
    props: ['cityListChange', 'dateChanged', 'delDay', 'getListLenght'],
    created() {
        document.body.ondrop = function(event) {
            event.preventDefault();
            event.stopPropagation();
        };
        this.getBusCountries();
    },
    computed: {
        dragOptions() {
            return {
                animation: 0,
                group: 'description2',
                disabled: false,
                ghostClass: 'ghost',
            };
        },
    },
    watch: {
        newDate(n, o) {
            this.dateChange(n);
        },
        busCountry(n, o) {
            this.getBusCity();
        },
        busCity(n, o) {
            this.getBusType();
        },
        busType(n, o) {
            this.carData = this.busTypeList.filter(it => it.value === n)[0];
            this.carData.carBasePrice = this.carData.basicPrice;
        },
    },
    data() {
        return {
            dayLenght: 0,
            detailList: [
                {
                    type: 'trafficInCity',
                    id: 1,
                },
                {
                    type: 'car',
                    carType: '1',
                    number: '48',
                    id: 2,
                },
                {
                    type: 'hotel',
                    name: '巴黎苏格兰牛排餐厅(临河街店) 拷贝1',
                    id: 3,
                },
                {
                    type: 'food',
                    name: '巴黎苏格兰牛排餐厅(临河街店) 拷贝2',
                    id: 4,
                },
                {
                    type: 'view',
                    name: '巴黎苏格兰牛排餐厅(临河街店) 拷贝3',
                    id: 5,
                },
                {
                    type: 'experience',
                    name: '巴黎苏格兰牛排餐厅(临河街店) 拷贝4',
                    id: 6,
                },
                {
                    type: 'shop',
                    name: '巴黎苏格兰牛排餐厅(临河街店) 拷贝5',
                    id: 7,
                },
                {
                    type: 'traffic',
                    name: '巴黎苏格兰牛排餐厅(临河街店) 拷贝6',
                    id: 8,
                },
                {
                    type: 'Highlights',
                    id: 9,
                    name:
                        '巴黎苏格兰牛排餐厅(临河街店) 拷贝巴黎苏格兰牛排餐厅(临河街店) 拷贝巴黎苏格兰牛排餐厅(临河街店) 拷贝巴黎苏格兰牛排餐厅(临河街店) 拷贝',
                },
            ],
            newDate: '',
            resKeyTemp: '', // 用于暂存RESItem组件 的key

            showLength: 0,
            highlightsTextarea: '',
            highlightsFlags: false,

            carTypesinT: carTypes,
            carFlags: false,
            carData: { basicPrice: '暂无价格', carBasePrice: '', carOutPrice: '' },
            carType: '1',
            busCountry: '',
            busCountryList: [],
            busCity: '',
            busCityList: [],
            busType: '',
            busTypeList: [],

            trafficInCityFlags: false,
            trafficType: trafficTypes,
            trafficPrice: [2333, 4344],
            trafficInCityList: [
                {
                    away: '1',
                    number: '3U12323',
                    startCity: '重庆',
                    startLocation: '重庆江北机场',
                    endCity: '成都',
                    endLocation: '成都双流机场',
                    startDate: 1,
                    startTime: '15:30',
                    endDate: 2,
                    endTime: '16:30',
                },
            ],
        };
    },
    mounted() {
        document.addEventListener('click', e => {
            if (e.target.dataset.tag === undefined || e.target.dataset.tag !== this.resKeyTemp) {
                this.$refs.RESI.map(it => it.hideOption());
            }
        });
    },
    filters: {
        formatDate(date) {
            return (
                moment(date).format('YYYY年MM月DD日') +
                ' 周' +
                moment(date).format('dddd')[moment(date).format('dddd').length - 1]
            );
        },
    },
    methods: {
        goBUS() {
            this.$nuxt.$router.push({ name: 'bus' });
        },
        setResKeyTemp(key) {
            this.resKeyTemp = key;
        },
        delItem(id) {
            // 删除某个资源
            this.detailList = this.detailList.filter(it => it.id !== id);
        },
        getDayData(data) {
            // 传递 城市列表
            this.$refs.cityLocation.setCitys(data.citys);
            // 修改日期（如果有）
            if (data.date !== undefined && data.date !== '') {
                this.newDate = data.date;
            } else {
                this.newDate = moment().format('YYYY-MM-DD');
            }
        },
        cityListChanges(cityList) {
            // location中城市列表发送改变 (父)
            this.cityListChange(cityList);
        },
        dateChange(date) {
            // 修改日期后触发 (父)
            this.dateChanged(date);
        },
        addListDataInDay(name) {
            if (name === 'del') {
                // 触发行程删除
                this.$Modal.confirm({
                    title: '确认删除该日行程？',
                    onOk: () => {
                        this.delDay();
                    },
                    onCancel: () => {},
                });
            }
            if (name === 'highlights') {
                this.highlightsFlags = true;
            }
            if (name === 'car') {
                if (this.detailList.filter(it => it.type === 'car').length > 0) {
                    return false;
                }
                this.carFlags = true;
            }
            if (name === 'trafficInCity') {
                this.trafficInCityFlags = true;
                this.dayLenght = this.getListLenght();
            }
        },
        HighlightsCancel() {
            // 取消亮点
            this.highlightsFlags = false;
            this.showLength = 0;
            this.highlightsTextarea = '';
        },
        HighlightsonOk() {
            if (this.highlightsTextarea === '') {
                this.$Message.warning('请填写行程亮点');
                return false;
            }
            // 添加亮点
            this.detailList.push({
                type: 'Highlights',
                id: Math.floor(Math.random() * 10000),
                name: this.highlightsTextarea,
            });
            this.highlightsFlags = false;
            this.showLength = 0;
            this.highlightsTextarea = '';
        },
        highlightsChange() {
            // 亮点字数监听
            this.showLength = this.highlightsTextarea.length;
        },
        carCancel() {
            this.carFlags = false;
            this.carData.basicPrice = '';
            this.carData.carBasePrice = '';
            this.carData.carOutPrice = '';
        },
        carOk() {
            if (this.carData.carBasePrice === '' || this.carData.carOutPrice === '') {
                return false;
            }
            const n = this.busTypeList.filter(it => (it.value = this.busType))[0].label;
            this.detailList.push({
                type: 'car',
                carType: this.carType,
                id: Math.floor(Math.random() * 10000),
                number: n,
            });
            this.carData.basicPrice = '';
            this.carData.carBasePrice = '';
            this.carData.carOutPrice = '';
            this.carFlags = false;
        },
        getBusCountries() {
            this.$axios.get(api_bus.busCountry, { custom: { token: true } }).then(res => {
                if (res.code === '200') {
                    this.busCountryList = res.data.map((v, i) => {
                        v['value'] = v.locationId;
                        v['label'] = v.locationNameCn;
                        return v;
                    });
                }
            });
        },
        getBusCity() {
            this.$axios
                .post(
                    api_bus.busCity,
                    { pageNo: 1, pageSize: 500, locationId: this.busCountry },
                    { custom: { token: true } },
                )
                .then(res => {
                    if (res.success) {
                        this.busCityList = res.data.records.map((item, index) => {
                            return {
                                value: item.cityId,
                                label: item.cityNameCn,
                            };
                        });
                    }
                });
        },
        getBusType() {
            this.$axios.post(api_bus.busList, { cityId: this.busCity }, { custom: { token: true } }).then(res => {
                this.busTypeList = res.data.map((item, index) => {
                    return {
                        value: item.busId,
                        label: item.seatNumberLocal,
                        basicPrice: item.basicPrice,
                    };
                });
            });
        },
    },
};
</script>

<style scoped lang="less">
.dayDetail {
    width: 620px;
    background: #f8f8f8;
    .head {
        background: #fff;
        text-align: right;
        height: 67px;
        border-bottom: 1px solid #eee;
        padding: 14px 24px;
        .primary_bk {
            color: #fff;
        }
        .btnr {
            color: #777777;
        }
    }
    .spAndDate {
        padding-top: 20px;
        padding-bottom: 30px;
        background: #fff;
        box-shadow: inset 0 -1px 2px #eee;
        z-index: 10;
        position: relative;
        .top {
            padding: 8px 34px;
            overflow: auto;
            .date {
                float: left;
                .iconhangchengriqi {
                    color: #ed0287;
                    font-size: 24px;
                }
            }
            .option {
                float: right;
                cursor: pointer;
                .iconzengjialeibie {
                    color: #ed0287;
                    font-size: 20px;
                }
                .list {
                    li {
                        line-height: 20px;
                        color: #262626;
                        margin: 10px 0;
                        .iconfont {
                            font-size: 12px;
                            color: #747474;
                        }
                        &:hover {
                            color: #ed0287;
                            .iconfont {
                                color: #ed0287;
                            }
                        }
                    }
                }
            }
        }
        .citys {
            padding: 8px 34px;
            font-size: 14px;
            color: #777777;
        }
    }
    .resList {
        overflow-y: scroll;
        overflow-x: hidden;
        height: 800px;
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
        .flip-list-move {
            transition: transform 0.5s;
        }
        .no-move {
            transition: transform 0s;
        }
    }
}
</style>

<style lang="less">
.selectStyle_by_lxm {
    .ivu-select-selection,
    .ivu-input {
        border-radius: 2px !important;
        box-shadow: none !important;
    }
}
.lxmsb {
    .ivu-select-selection,
    .ivu-input {
        border: none;
        box-shadow: none !important;
    }
}
.lxmsbContent {
    border-radius: 2px;
    border: 1px solid #dcdee2;
}
</style>