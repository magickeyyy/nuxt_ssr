<template>
    <div class="detail" v-if="detailData">
        <div class="basic">
            <div class="basicMes">
                <div class="basicMes_icon" style="margin-left:147px">
                    <i class="iconfont iconicon-test"></i>
                    <span class="text">填写基础信息</span>
                </div>
                <div
                    style="border:1px dashed #DFDFE1;width:51px;height:1px;margin-top:71px;margin-right:10px"
                ></div>
                <div class="basicMes_icon">
                    <i class="iconfont iconicon-test2"></i>
                    <span class="text">提交行程概要</span>
                </div>
                <div
                    style="border:1px dashed #DFDFE1;width:51px;height:1px;margin:71px 10px auto 10px;"
                ></div>
                <div class="basicMes_icon">
                    <i class="iconfont iconicon-test3"></i>
                    <span class="text">确定杂费代交</span>
                </div>
                <div
                    style="border:1px dashed #DFDFE1;width:51px;height:1px;margin-top:71px;margin-right:10px"
                ></div>
                <div class="basicMes_icon">
                    <i class="iconfont iconicon-test1"></i>
                    <span class="text">计算用车费用</span>
                </div>
            </div>
            <p class="bigTit">1.基础信息</p>
            <!-- 基础信息的表格 -->
            <Form ref="form" :model="form" :rules="rules">
                <div class="module formItem">
                    <p class="middleTit first">包车信息</p>
                    <div class="bigForm">
                        <FormItem label="开始日期:" prop="startDate" style="margin-right:93px">
                            <DatePicker
                                type="date"
                                placeholder="请选择日期"
                                v-model="form.startDate"
                                style="width:240px;"
                                :options="options1"
                                @on-change="changeTimes"
                            ></DatePicker>
                        </FormItem>
                        <FormItem label="结束日期:" prop="endDate">
                            <DatePicker
                                type="date"
                                placeholder="请选择日期"
                                v-model="form.endDate"
                                style="width:240px;"
                                :options="options2"
                                @on-change="changeTimes2"
                                :disabled="form.startDate==''"
                            ></DatePicker>
                        </FormItem>
                        <div
                            style="position:absolute;top:10px;left:785px;white-space: nowrap;font-size:14px;font-weight:400;color:rgba(236,2,134,1);"
                            v-if="dates!==0"
                        >共{{dates}}天</div>

                        <!-- 出发城市，上一页获取 -->
                        <FormItem
                            label="出发城市:"
                            prop="goUpCity"
                            style="margin-left:8px;margin-right:93px"
                        >
                            <Input
                                disabled
                                style="width:240px;height:40px;margin-left:5px;"
                                v-model="datas.cityNameCn"
                            />
                        </FormItem>
                        <FormItem label="车辆类型:" prop="seatNumberLocal">
                            <Input
                                style="width:240px;height:40px"
                                v-model="datas.seatNumberLocal"
                                disabled
                            />
                        </FormItem>

                        <FormItem
                            label="贵司单号:"
                            prop="groupNo"
                            style="margin-left:8px;margin-right:93px"
                        >
                            <Input
                                placeholder
                                v-model="form.groupNo"
                                style="width:240px;height:40px;margin-left:5px;"
                            />
                        </FormItem>
                        <FormItem label="客人人数:" prop="passengerNum">
                            <Input
                                placeholder
                                v-model="form.passengerNum"
                                style="width:240px;height:40px"
                                :pnum.sync="form.passengerNum"
                            />
                        </FormItem>
                        <div class="fix">
                            <i class="iconfont icontishi" style="color: #ec0286;font-size:14px;"></i>
                            <span class="purple">客人人数(含领队导游及儿童)：关系到杂费计算，若未按照实际人数填写，发生纠纷，自行处理！</span>
                        </div>
                    </div>
                    <p class="middleTit second">公司联系人(OP)</p>
                    <div class="bigForm special">
                        <FormItem
                            label="姓名:"
                            prop="contactName"
                            style="margin-left:8px;margin-right:93px"
                        >
                            <Input
                                v-model="form.contactName"
                                placeholder="请输入姓名"
                                style="width:240px;height:40px;margin-left:5px;"
                                :contactName.sync="form.contactName"
                            />
                        </FormItem>
                        <FormItem
                            label="电话:"
                            prop="contactTelephone"
                            style="margin-left:8px;margin-right:93px"
                        >
                            <Input
                                v-model="form.contactTelephone"
                                placeholder="请输入联系人电话"
                                style="width:240px;height:40px;margin-left:5px;"
                                :phone.sync="form.contactTelephone"
                            />
                        </FormItem>
                        <FormItem
                            label="邮箱:"
                            prop="contactMail"
                            style="margin-left:8px;margin-right:93px"
                        >
                            <Input
                                v-model="form.contactMail"
                                placeholder="请输入邮箱"
                                style="width:240px;height:40px;margin-left:5px;"
                            />
                        </FormItem>
                    </div>
                </div>
            </Form>
        </div>
        <div class="trival">
            <div class="trivalList">
                <p class="bigTit">2.行程概要</p>
                <div class="aa">
                    <p>
                        <span class="dot"></span>
                        <span class="tt">请妥善填写行程，每天只填写最终到达点即可，我们会根据昨日到达，与本日到达城市进行价格计算</span>
                    </p>
                    <p style="margin-bottom:29px">
                        <span class="dot"></span>
                        <span class="tt">
                            车辆费用计算包含
                            <span style="color:#111">（包车基础价格+杂费）</span>，我们会根据您填写的具体行程，生成对应的费用报价方案
                        </span>
                    </p>
                </div>
                <p class="smallTit">行程附件</p>
                <div class="uploadBtn" style="position:relative">
                    <Upload
                        :headers="uploadHeaders"
                        :action="wordUpload"
                        name="file"
                        :on-success="handleSuccess"
                        :on-exceeded-size="sizeError"
                        ref="upload"
                        :max-size="5120"
                        :show-upload-list="false"
                    >
                        <Button v-if="routeAttachmentUrl==''">
                            <i class="iconfont iconshangchuanfujian"></i> 请上传行程附件（word格式）-方便核对景点信息
                        </Button>
                    </Upload>
                    <div
                        style="color:#ec0682;font-size:18px; margin-top: 20px;margin-bottom: 40px;"
                        v-if="routeAttachmentUrl!==''"
                    >
                        <i class="iconfont iconfujian_red" style="margin-right:20px"></i>
                        <span style="margin-right:360px">{{uploadName}}</span>
                        <i class="iconfont icondel1" style="cursor:pointer;" @click="del"></i>
                    </div>
                </div>
                <p class="smallTit">行程规划</p>
                <div class="xc">
                    <div class="xcHead">
                        <div class="contentBlock" style="float:left;margin-right:20px;width:310px">
                            <div class="messages title">上车时间</div>
                            <div
                                class="jfi"
                                style="border:1px solid rgba(227, 227, 227, 1);border-radius:2px;"
                            >
                                <Input class="dateC" v-model="start" disabled />
                                <TimePicker
                                    type="time"
                                    format="HH:mm"
                                    placeholder="请选择时间"
                                    class="timeC"
                                    :editable="false"
                                    v-model="startTime"
                                ></TimePicker>
                            </div>
                        </div>
                        <div class="contentBlock" style="float:left;margin-right:20px">
                            <div class="messages title">上车地点</div>
                            <Input
                                v-model="datas.locationNameCn"
                                class="sone"
                                style="float:left;width:127px;height:40px"
                                disabled
                            />
                            <Input
                                v-model="datas.cityNameCn"
                                class="sones"
                                style="float:left;width:192px;height:40px"
                                disabled
                            />
                        </div>
                        <div class="contentBlock" style="float:left">
                            <div class="messages title">详细地址</div>
                            <div class="jfi">
                                <Input class="address" v-model="detailAddress" />
                            </div>
                        </div>
                    </div>
                    <div
                        class="fix"
                        style="margin:-14px auto auto 670px;background:rgba(255,239,248,1);border-radius:1px;width:350px;height:28px;line-height:28px;color: #EC0286 "
                    >
                        <i class="iconfont icontishi" style="color: #ec0286;font-size:14px;"></i>
                        <span class="purple">请妥善填写详细地址，防止出现司机无法接到游客的问题！</span>
                    </div>
                    <!-- 行程列表 -->
                    <div class="xcContent">
                        <!-- 单条行程 -->
                        <div class="planContent" v-for="(it, index) in routineDTOS" :key="index">
                            <div class="planHead">
                                <span class="day">D{{index+1}}</span>
                                <span class="planDate">{{it.routeDate}} {{it.week}}</span>
                                <!-- <span class="aways" v-if="false">小计里程:{{it.rollingMileage}}km</span> -->
                            </div>
                            <div class="planText">
                                <div style="overflow:auto; padding-bottom:30px">
                                    <!-- 国家城市 -->
                                    <div
                                        class="contentBlock"
                                        style="float:left;margin-right:20px;margin-top:20px"
                                    >
                                        <div class="messages title">国家城市</div>
                                        <div
                                            class="jfi"
                                            style="border:1px solid rgba(227, 227, 227, 1);border-radius:2px;overflow:auto"
                                        >
                                            <Location
                                                :setData="setData"
                                                :index="index"
                                                ref="location"
                                                :busId="datas.busId"
                                            />
                                        </div>
                                    </div>
                                    <div
                                        class="contentBlock"
                                        style="clear: both;width:590px;padding-top:20px"
                                    >
                                        <div class="messages title">浏览内容</div>
                                        <div
                                            class="jfi"
                                            style="border:1px solid rgba(227, 227, 227, 1);border-radius:2px;overflow:auto"
                                        >
                                            <div class="textarea">
                                                <textarea maxlength="200" v-model="it.tourContent"></textarea>
                                                <div class="textCount">{{it.tourContent.length}}/200</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- 初始 放在末尾 -->
                        <div class="planContent" v-if="routineDTOS.length !== 0">
                            <div class="planHead">
                                <span class="day">End</span>
                                <span
                                    class="planDate"
                                    style="font-size:16px;font-weight:bold;color:rgba(237,2,135,1)"
                                >行程结束</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="bottom">
            <div class="title">杂费代交</div>
            <div class="zafei">
                <Checkbox
                    v-model="zafei"
                    style="font-size:16px;font-weight:600;color:rgba(17,17,17,1);margin:51px 76px 54px 26px"
                >同意杂费代交</Checkbox>
                <div class="right">
                    <p>
                        <span class="dot"></span>
                        <span>包车基础费用只为车辆租赁以及邮费，不包含在欧洲行驶时产生的其他各种杂费。</span>
                    </p>
                    <p>
                        <span class="dot"></span>
                        <span>杂费可选择由平台支付，支付部分包含：司机餐补、高速费、停车费。</span>
                    </p>
                    <p>
                        <span class="dot"></span>
                        <span>若不选择杂费项，行程中所产生的的各类费用由用户自行缴纳。</span>
                    </p>
                </div>
            </div>
            <div class="btn">
                <Button class="giveUp" @click="giveUp">放弃填写</Button>
                <Button type="primary" class="next" @click="next('form')">下一步，费用计算</Button>
            </div>
        </div>
    </div>
</template>

<script>
import { weekList } from '~/assets/js/dictionary';
import pattern from '~/assets/js/pattern';
import Location from '~/components/bus/Location';
import moment from 'moment';
import { api_location, api_bus, api_base } from '~/service/api';
import { mapActions } from 'vuex';
moment.locale('zh-cn');
export default {
    name: 'detaiShow',
    components: {
        Location,
    },
    props: ['detailData', 'datas'],
    data() {
        return {
            uploadUrl: '',
            uploadHeaders: {
                Authorization: sessionStorage.getItem('token'),
            },
            single: true,
            zafei: true,
            countryList: [],
            cityList: [],
            detailAddress: '',
            startTime: '',
            routineDTOS: [],
            dates: 0,
            form: {
                groupNo: 'csz', //贵司单号
                passengerNum: '2', //客人人数
                contactName: 'zhangsan', //姓名
                contactTelephone: '15858787878', //电话
                contactMail: 'ds@qq.com', //邮箱
                startDate: '', //开始日期
                endDate: '', //结束日期
                downBus: '', //下车城市
                goUpCity: '', //上车城市
                seatNumberLocal: '', //车辆类型
            },
            // 是否必须
            rules: {
                passengerNum: [
                    { required: true, message: '请正确输入客人人数', trigger: 'blur', pattern: pattern.pnum },
                ],
                contactName: [
                    {
                        required: true,
                        message: '请输入20位以内以中文或字母组成的字符',
                        trigger: 'blur',
                        pattern: pattern.contactName,
                    },
                ],
                contactTelephone: [
                    { required: true, message: '请输入11位手机号', trigger: 'blur', pattern: pattern.phone },
                ],
                contactMail: [
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    { type: 'email', message: '请输入正确格式的邮箱', trigger: 'blur' },
                ],
                startDate: [{ required: true, type: 'date', message: '请输入开始时间', trigger: 'change' }],
                endDate: [{ required: true, type: 'date', message: '请输入结束时间', trigger: 'change' }],
                groupNo: [
                    { pattern: pattern.groupNo, message: '请输入20位以内以数字或字母组成的字符', trigger: 'blur' },
                ],
            },
            chartcar_mes: ['包车基本信息', '公司联系人', '预定信息', '每日价格', '杂费'],
            showPriceList: [],
            priceList: [],
            showStartIndex: 0,
            showEndIndex: 10,
            basrPrice: 0,
            zaPrice: 0,
            start: '', //上车时间回填
            routeAttachmentUrl: '',
            options2: {
                disabledDate(date) {
                    return date && date.valueOf() < Date.now() - 86400000;
                },
            },
            // 日期
            options1: {},
            wordUpload: api_base.wordLoad, //action的地址
            uploadName: '', //上传文件名称
        };
    },
    created() {
        if (this.datas.startDate !== undefined && this.datas.endDate !== undefined) {
            this.form.startDate = this.datas.startDate;
            this.form.endDate = this.datas.endDate;
            this.start = moment(this.datas.startDate).format('YYYY-MM-DD');
            this.dates = (moment(this.form.endDate) - moment(this.form.startDate)) / (24 * 60 * 60 * 1000) + 1;
            this.addPlan();
        }
    },
    watch: {
        //结束时间的范围最晚为同一天
        'form.startDate': function(val) {
            this.options2 = {
                disabledDate: date => {
                    return date && date.valueOf() < new Date(moment(this.form.startDate)).getTime();
                },
            };
        },
    },
    mounted() {
        if (this.detailData !== '') {
            // const de = moment(this.detailData.earliestBookingDate);
            this.options1 = {
                disabledDate(date) {
                    // return date && date.valueOf() < de-86400000;
                    return date && date.valueOf() < Date.now() - 86400000;
                },
            };
        }
    },

    methods: {
        ...mapActions('bus',['ASYNC_SET_DATA']),
        //放弃填写,跳转首页
        giveUp() {
            var r = confirm('确认放弃填写吗？');
            if (r) {
                this.$nuxt.$router.push({ name: 'bus' });
            } else {
            }
        },
        changeTimes(a) {
            this.start = a;
            this.form.endDate = '';
        },
        changeTimes2(a) {
            this.routineDTOS = [];
            if (this.$refs.location) {
                this.$refs.location.map(it => it.reset());
            }
            // this.$refs.location.reset();
            this.addPlan();
        },
        //上传成功
        handleSuccess(res, file) {
            if (res.code === '200') {
                this.routeAttachmentUrl = res.data;
                this.uploadName = file.name;
                this.$Message.success('上传成功');
            } else {
                this.$Message.error(res.msg);
            }
        },
        sizeError(file, fileList) {
            this.$Message.error('文件大小不能5M');
        },
        //关闭文件上传
        del() {
            this.routeAttachmentUrl = ''; //清空上传数据
        },

        //点击表单校验
        next(name) {
            this.$refs[name].validate(valid => {
                if (valid) {
                    let t = this.routineDTOS.filter(
                        (it, i) => it.arrivalCity === '' || it.arrivalCityId === '' || it.arrivalLocation === '',
                    );
                    if (t.length > 0 || this.startTime === '' || this.detailAddress === '') {
                        this.$Message.error('请填写完整行程信息');
                        return false;
                    }
                    if (this.routeAttachmentUrl === '') {
                        this.$Message.error('请上传行程附件');
                        return false;
                    }
                    if (moment(this.form.startDate).format('YYYY-MM-DD') < this.detailData.earliestBookingDate) {
                        this.$Message.error('最早可订时间' + this.detailData.earliestBookingDate);
                        return false;
                    }
                    // 请求预订接口
                    const busBookingDTO = {
                        bookingBeginDate: moment(this.form.startDate).format('YYYY-MM-DD'),
                        bookingEndDate: moment(this.form.endDate).format('YYYY-MM-DD'),
                        busCancelPolicyDTOS: this.detailData.busCancelPolicyVOS,
                        busId: this.detailData.busId,
                        cityId: this.detailData.cityId,
                        contactMail: this.form.contactMail,
                        contactName: this.form.contactName,
                        contactTelephone: this.form.contactTelephone,
                        customerId: sessionStorage.getItem('userID'),
                        departureCity: this.datas.cityNameCn,
                        departureDetail: this.datas.locationNameCn + this.datas.cityNameCn + this.detailAddress,
                        departureTime: moment(this.form.startDate).format('YYYY-MM-DD') + ' ' + this.startTime,
                        earliestBookingDate: this.detailData.earliestBookingDate,
                        groupNo: this.form.groupNo,
                        isIncludeOtherFee: this.zafei,
                        passengerNum: this.form.passengerNum,
                        reconfirmed: this.detailData.reconfirmed,
                        routeAttachmentUrl: this.routeAttachmentUrl,
                        routineDTOS: this.routineDTOS,
                        seatNumberLocal: this.detailData.seatNumberLocal,
                    };
                    this.$axios
                        .post(api_bus.busBooking, busBookingDTO, { custom: { token: true } })
                        .then(res => {
                            if (res.success) {
                                this.ASYNC_SET_DATA(res.data).then(res=>{
                                    this.$nuxt.$router.push({
                                        name: 'bus-preOrder',
                                        query:{isIncludeOtherFee: this.zafei}
                                    })
                                })
                            } else {
                                // this.$nuxt.$router.push({ name: 'bus' });
                            }
                        })
                        .catch(error => {
                        });
                } else {
                    this.$Message.error('请填写完整信息');
                }
            });
        },

        addPlan() {
            if (this.form.startDate !== '' && this.form.endDate !== '') {
                this.dates = (moment(this.form.endDate) - moment(this.form.startDate)) / (24 * 60 * 60 * 1000) + 1;
                for (let i = 0; i < this.dates; i++) {
                    const date = moment(this.form.startDate).add(i, 'days');
                    this.date = date;
                    const week = date.format('dddd');
                    this.routineDTOS.push({
                        routeDate: date.format('YYYY-MM-DD'),
                        week: week,
                        tourContent: '',
                        arrivalCity: '',
                        arrivalCityId: '',
                        arrivalLocation: '',
                        rollingMileage: 0,
                    });
                }
            }
        },
        setData(country, city, cityId, index) {
            this.routineDTOS[index].arrivalCity = city;
            this.routineDTOS[index].arrivalCityId = cityId;
            this.routineDTOS[index].arrivalLocation = country;
        },
    },
};
</script>

<style lang="less">
.detail {
    .ivu-icon {
        line-height: 40px;
    }
    .ivu-select-selected-value {
        height: 40px !important;
        line-height: 40px !important;
    }
    position: relative;
    .active {
        a {
            color: #ec0286 !important;
            border-bottom: 2px solid #ec0286;
        }
    }
    a {
        height: 35px;
    }
    a:hover {
        color: #ec0286;
    }
    a:visited {
        color: #262626;
    }
    a:focus {
        color: #ec0286;
        position: relative;
        &::after {
            content: ' ';
            position: absolute;
            height: 10px;
            width: 100%;
            left: 0;
            top: 25px;
            border-bottom: 2px solid #ec0286;
        }
    }
    .basicMes {
        i {
            &::before {
                font-size: 53px;
                display: inline-block;
                color: #4e4e54;
            }
        }
    }
    .basic {
        .bigForm {
            .ivu-form-item-content {
                display: flex;
            }
            .ivu-input {
                height: 40px;
            }
        }
    }
    .trival {
        .dateC {
            input {
                height: 40px;
                font-size: 14px;
                border: none !important;
                border-radius: 0;
                border-right: 1px solid #e3e3e3 !important;
                box-shadow: none;
                &:focus {
                    border-bottom: 1px solid #ed0287 !important;
                }
            }
        }
        .timeC {
            input {
                height: 40px;
                font-size: 14px;
                border: none !important;
                border-radius: 0;
                box-shadow: none;
                &:focus {
                    border-bottom: 1px solid #ed0287 !important;
                }
            }
        }
        .ivu-select-selection {
            border: none !important;
            border-radius: 0;
            box-shadow: none;
            height: 40px;
            &:focus {
                border-bottom: 1px solid #ed0287 !important;
            }
            .ivu-select-placeholder {
                font-size: 14px;
                height: 40px;
                line-height: 40px;
            }
            .ivu-select-selected-value {
                font-size: 14px;
                height: 40px;
                line-height: 40px;
            }
        }
        .sone {
            .ivu-input {
                height: 42px;
                border-right: none;
                border-top-right-radius: 0;
                border-bottom-right-radius: 0;
            }
        }
        .sones {
            .ivu-input {
                height: 42px;
                border-top-left-radius: 0;
                border-bottom-left-radius: 0;
            }
        }
        .address {
            input {
                height: 40px;
                border: none !important;
                font-size: 14px;
                border-radius: 0;
                box-shadow: none;
                &:focus {
                    border-bottom: 1px solid #ed0287 !important;
                }
            }
        }
        .textarea {
            textarea {
                border: none !important;
                font-size: 14px;
                outline: none;
            }
        }
    }
    .ivu-icon-md-document:before {
        content: '';
        // background: url("../../assets/public_img/red.png");
        // display:block;
    }
    .ivu-upload-list-file > span {
        margin-left: 100px;
        font-size: 20px;
        line-height: 38px;
    }
    .ivu-upload-list {
        margin-top: -29px;
    }
    .ivu-upload-list-file {
        overflow: none;
        position: static;
    }
}
</style>
<style scoped lang="less">
@import url('~assets/style/variable.less');
@deep: ~'>>>';
.detail {
    .basic {
        width: 1180px;
        margin: 12px auto 12px auto;
        background: rgba(255, 255, 255, 1);
        border: 1px solid rgba(237, 237, 237, 1);
        box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.03);
        .basicMes {
            display: flex;
            .basicMes_icon {
                width: 159px;
                height: 38px;
                margin-top: 33px;
                margin-bottom: 78px;
                .text {
                    font-size: 16px;
                    font-weight: 600;
                    color: #111111;
                    margin-top: -52px;
                    display: block;
                    margin-left: 60px;
                }
            }
        }
        .bigTit {
            font-size: 24px;
            font-weight: bold;
            color: rgba(17, 17, 17, 1);
            margin-left: 51px;
        }
        .module {
            margin: 0 51px;
            .middleTit {
                font-size: 18px;
                font-weight: 600;
                color: rgba(15, 15, 15, 1);
            }
            .first {
                margin: 49px auto 40px 0;
            }
            .bigForm {
                display: flex;
                justify-content: space-between;
                flex-wrap: wrap;
                width: 770px;
                margin-right: 93px;
                position: relative;
                .fix {
                    padding-left: 10px;
                    width: 550px;
                    position: absolute;
                    top: 187px;
                    left: 530px;
                    height: 28px;
                    line-height: 28px;
                    background: rgba(255, 239, 248, 1);
                    border-radius: 1px;
                    white-space: pre-wrap;
                    .purple {
                        font-size: 12px;
                        font-weight: 400;
                        color: #ec0286;
                    }
                }
            }
            .second {
                margin-bottom: 46px;
                margin-top: 32px;
            }
            .special {
                width: 845px !important;
            }
        }
    }
    .trival {
        width: 1180px;
        margin: 12px auto;
        background: rgba(255, 255, 255, 1);
        border: 1px solid rgba(237, 237, 237, 1);
        box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.03);
        .trivalList {
            margin-left: 51px;
            .bigTit {
                font-size: 24px;
                font-weight: bold;
                color: rgba(17, 17, 17, 1);
                margin: 49px auto 33px auto;
            }
            .aa {
                width: 1069px;
                margin-bottom: 45px;
                background: #fbfbfb;
                border: 1px solid rgba(237, 237, 237, 1);
                box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.03);
                > p .dot {
                    background: rgb(119, 119, 119);
                    width: 7px;
                    height: 7px;
                    border-radius: 50%;
                    display: inline-block;
                    margin: 32px 5px 12px 34px;
                }
                .tt {
                    margin-top: -32px;
                    display: block;
                    margin-left: 49px;
                    font-size: 14px;
                    font-weight: 400;
                    color: rgba(119, 119, 119, 1);
                }
            }
            .smallTit {
                font-size: 18px;
                font-weight: 600;
                color: rgba(17, 17, 17, 1);
            }
            .uploadBtn {
                button {
                    color: #ed0287;
                    width: 360px;
                    height: 40px;
                    border: 1px solid rgba(237, 2, 135, 1);
                    border-radius: 0;
                    text-align: center;
                    font-size: 14px;
                    margin-top: 28px;
                    margin-bottom: 40px;
                }
            }
            .xc {
                overflow: auto;
                margin-top: 40px;
                padding-bottom: 80px;
                .xcHead {
                    overflow: auto;
                    padding-bottom: 30px;
                    // position: relative;
                }
                .xcContent {
                    overflow: auto;
                }
                .messages {
                    font-size: 14px;
                    color: #999;
                }
                .contentBlock {
                    .title {
                        margin-bottom: 10px;
                    }
                    .jfi {
                        .dateC {
                            width: 182px;
                        }
                        .timeC {
                            width: 122px;
                        }
                        .address {
                            width: 380px;
                            border: 1px solid rgba(227, 227, 227, 1);
                            border-radius: 2px;
                        }
                        .textarea {
                            padding: 6px;
                            width: 100%;
                            textarea {
                                width: 100%;
                                height: 84px;
                                resize: none;
                            }
                            .textCount {
                                color: #c7c7c7;
                                text-align: right;
                            }
                        }
                    }
                }
                .planContent {
                    .planHead {
                        .day {
                            text-align: center;
                            display: inline-block;
                            width: 48px;
                            height: 26px;
                            background: rgba(237, 2, 135, 1);
                            border-radius: 13px;
                            font-size: 18px;
                            font-family: OswaldMedium;
                            font-weight: 500;
                            color: rgba(255, 255, 255, 1);
                            line-height: 25px;
                        }
                        .planDate {
                            margin-left: 11px;
                            margin-right: 20px;
                            display: inline-block;
                            font-size: 16px;
                            font-weight: bold;
                            color: rgba(17, 17, 17, 1);
                            line-height: 24px;
                        }
                        .aways {
                            margin-right: 27px;
                            font-size: 14px;
                            color: rgba(153, 153, 153, 1);
                        }
                        .delICON {
                            i {
                                color: #d9d9d9;
                                font-size: 24px;
                                &:hover {
                                    color: #ed0287;
                                    cursor: pointer;
                                    &:after {
                                        content: '删除该天行程';
                                        font-size: 14px;
                                    }
                                }
                            }
                        }
                    }
                    .planText {
                        border-left: 2px dashed #e7e7e7;
                        margin-left: 24px;
                        padding-left: 35px;
                        .warning_es {
                            margin-top: 56px;
                            float: left;
                            font-size: 14px;
                            width: 470px;
                            height: 32px;
                            background: rgba(255, 239, 248, 1);
                            border-radius: 1px;
                            padding: 5px 13px;
                            color: rgba(236, 2, 134, 1);
                        }
                    }
                }
            }
        }
    }
}
.foot {
    width: 1179px;
    height: 85px;
    background: rgba(250, 250, 250, 1);
    margin: auto auto 13px;
    .normal {
        color: #555555;
        font-size: 18px;
        margin: 34px auto 33px 338px;
        .spicial1 {
            color: #ec0286;
        }
        .spicial2 {
            color: #ec0286;
            font-size: 28px;
            font-family: OswaldMedium;
            margin-right: 13px;
            .sp {
                font-size: 18px !important;
            }
        }
    }
    .btn {
        width: 230px;
        height: 48px;
        background: #ec0286;
        border-radius: 4px;
        border: none;
        margin: 18px 50px 19px auto;
        cursor: pointer;
        .plan {
            font-size: 16px;
            font-weight: 400;
            color: rgba(255, 255, 255, 1);
        }
    }
}
.bottom {
    width: 1180px;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(237, 237, 237, 1);
    box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.03);
    margin: 0 auto 19px auto;
    .title {
        font-size: 24px;
        font-weight: bold;
        color: rgba(17, 17, 17, 1);
        margin: 12px auto 19px 51px;
    }
    .zafei {
        display: flex;
        width: 1069px;
        // height: 123px;
        background: rgba(251, 251, 251, 1);
        margin: 30px 61px 38px 50px;
        .right {
            margin: 26px auto 24px 0;
            > p {
                font-weight: 400;
                color: rgba(119, 119, 119, 1);
                font-size: 14px;
                margin-bottom: 14px;
                .dot {
                    width: 7px;
                    height: 7px;
                    background: rgba(119, 119, 119, 1);
                    border-radius: 50%;
                    display: inline-block;
                    margin-right: 4px;
                }
            }
        }
    }
    .btn {
        margin: 0 auto 42px 50px;
        .giveUp {
            width: 200px;
            height: 48px;
            background: rgba(255, 255, 255, 1);
            border: 1px solid rgba(210, 210, 210, 1);
            border-radius: 4px;
            margin-right: 24px;
            color: rgba(85, 85, 85, 1);
            font-size: 16px;
            font-weight: 400;
        }
        .next {
            width: 200px;
            height: 48px;
            background: rgba(236, 2, 134, 1);
            border-radius: 4px;
            font-size: 16px;
            font-weight: 400;
        }
    }
}

@{deep} .ivu-modal-footer {
    border-top: 1px solid #fff !important;
}
@{deep} .ivu-modal-content {
    border-top: 6px solid #ed0287;
}
</style>