<template>
    <div class="top">
        <div class="detailHead" v-if="!datas.show">
            您在这里：
            <nuxt-link to="/">首页</nuxt-link>&gt;
            <nuxt-link to="/bus">大巴预定</nuxt-link>
            &gt;
            {{detailData.busArea}}大车 &gt;
            <span
                class="nowme"
            >{{datas.seatNumberLocal}}预定</span>
        </div>
        <!-- 大巴包车服务 -->
        <div class="service">
            <div style="width: 480px;height: 276px;overflow: hidden;margin: 27px 32px 27px 29px;">
                <img
                    :src="datas.busImg === ''?'~assets/public_img/img_home_adva2.png':datas.busImg"
                    v-noimg
                    style="max-width:480px"
                />
            </div>

            <div class="words">
                <p class="eup">{{detailData.busArea}}大巴车包车服务</p>
                <div class="context">
                    <p class="dark">座位数：{{datas.seatNumberLocal}}</p>
                    <p class="pp" :title="detailData.facility">车辆设施：{{detailData.facility}}等</p>
                    <p class="pp" :title="detailData.busInfo">车辆：{{detailData.busInfo}}</p>
                    <p>司机语种：{{detailData.driverLanguageLocal}}</p>
                    <p>司机驾龄：{{detailData.drivingExperienceLocal}}</p>
                </div>
            </div>
        </div>

        <div class="order">
            <Anchor :affix="false" class="anchor" @on-select="activeLevel">
                <AnchorLink
                    v-for="(v,i) in list"
                    :key="i"
                    :href="`#level${i}`"
                    :title="v"
                    :class="{'active':currentLevel===i}"
                ></AnchorLink>
            </Anchor>
            <div
                style="width:100%;height:1px;background-color:rgba(237,237,237,1);left:0;top:93px;"
            ></div>
            <p class="tit" id="level0">订单确认</p>
            <p class="grey">预定后将于{{detailData.reconfirmed}}小时内，返回确认信息，若服务商无法安排接单，订单会自动取消并全额退款，敬请谅解</p>
            <p class="tit" id="level1">取消规则</p>
            <Table
                border
                :columns="cancelPr"
                :data="data1"
                style="width:566px;margin:29px auto auto 49px;"
                class="col"
            ></Table>
            <p class="tit" id="level2">预定须知</p>
            <p class="propmpt">若跨区域预定，会按照价格高的区域定价进行费用计算，如：从西欧城市到东欧城市进行预定，东欧城市的包车价格会以西欧为准</p>
            <div class="all">
                <p class="mile">
                    <span class="day">每日里程：</span>每日里程限制在
                    <span class="lim">400KM</span>，若超出司机有权拒绝服务
                </p>
                <p class="mile miles">
                    <span class="day">中途交通工具变更：</span>
                    若中途有交通工具变更，如乘火车、轮船等，后续又有用车需求的，请分别预定各段订单
                </p>
            </div>
            <p class="tit" id="level3">包车建议</p>
            <p class="lugguage">考虑到客人的行李不确定，建议订车时，预留出40%的空位，方便安放多于的行李。</p>
            <div class="people">
                <p>
                    <span class="bol">6-10人：</span>建议选择16-21座车型
                </p>
                <p>
                    <span class="bol">10-15人：</span>建议选择21座或者30座车型
                </p>
                <p>
                    <span class="bol">大于15人</span>：建议选择49座车型
                </p>
            </div>
            <br />
        </div>
    </div>
</template>


<script>
export default {
    name: 'detaiHead',
    props: ['detailData', 'datas', 'noborder'],
    data() {
        return {
            list: ['订单确认', '取消规则', '预定须知', '包车建议'],
            urlData: this.$route.fullPath.split('?')[1],
            currentLevel: 0,
            cancelPr: [
                { title: '提前取消天数', key: 'beforeDepartDate' },
                { title: '退款比例', key: 'damagesPercent' },
            ],
            data1: [],
        };
    },
    mounted() {
        if (this.detailData !== '') {
            this.data1 = this.checkCancleNUm(this.detailData.busCancelPolicyVOS);
        }
    },
    methods: {
        activeLevel(i) {
            // 锚点激活
            this.currentLevel = Number(i.replace(/#level/gi, ''));
        },
        // 取消政策排序
        checkCancleNUm(td) {
            let sort = [];
            if (td.length > 0) {
                sort = td.sort((a, b) => b.beforeDepartDate - a.beforeDepartDate);
                sort = sort.map((it, i) => {
                    if (i === 0) {
                        return {
                            beforeDepartDate: '≥' + it.beforeDepartDate + '天',
                            damagesPercent: 100 - it.damagesPercent + '%',
                        };
                    }
                    if (i < sort.length) {
                        return {
                            beforeDepartDate: it.beforeDepartDate + '-' + sort[i - 1].beforeDepartDate + '天',
                            damagesPercent: 100 - it.damagesPercent + '%',
                        };
                    }
                });
                sort.push({
                    beforeDepartDate: '≤' + td[td.length - 1].beforeDepartDate + '天',
                    damagesPercent: '0%',
                });
            }
            return sort;
        },
    },
};
</script>

<style lang="less">
.top {
    .order {
        .ivu-anchor-ink {
            display: none;
        }
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
    }
}
</style>
<style scoped lang="less">
@import url('~assets/style/variable.less');
@deep: ~'>>>';
.top {
    .order {
        position: relative;
        background: rgba(255, 255, 255, 1);
        margin-top: 12px;
        .fgx {
            width: 100%;
            height: 12px;
            background: #f6f6f6;
        }
        .anchor {
            margin: 0 530px 0 49px;
        }

        @{deep}.ivu-anchor-link {
            font-size: 16px;
            margin-left: -16px;
            margin-right: 100px;
            padding: 25px 0 0;
        }
        @{deep}.ivu-anchor {
            position: relative;
            display: flex;
        }
        @{deep} .ivu-anchor-wrapper {
            overflow: inherit;
        }
        .tit {
            font-size: 24px;
            font-family: PingFang SC;
            font-weight: bold;
            color: rgba(17, 17, 17, 1);
            margin: 39px auto auto 50px;
        }
        .grey {
            font-size: 14px;
            font-family: PingFang SC;
            font-weight: 400;
            color: rgba(119, 119, 119, 1);
            white-space: nowrap;
            margin: 20px 513px auto 48px;
        }
        .propmpt {
            font-size: 14px;
            font-family: PingFang SC;
            font-weight: 400;
            color: #ec0286;
            line-height: 30px;
            margin: 33px 334px auto 48px;
            white-space: nowrap;
        }
        .all {
            margin: 24px auto auto 49px;
            .mile {
                color: #777777;
                font-size: 14px;
                .day {
                    font-weight: bold;
                    color: #111111;
                }
                .lim {
                    color: #ec0286 !important;
                }
            }
        }
        .lugguage {
            font-size: 14px;
            font-family: PingFang SC;
            font-weight: 400;
            color: rgba(119, 119, 119, 1);
            line-height: 30px;
            margin: 17px 620px auto 48px;
            white-space: nowrap;
        }
        .people {
            overflow: auto;
            font-size: 14px;
            color: #777777;
            // line-height: 30px;
            margin: 0 50px 20px;
            white-space: nowrap;
            .bol {
                color: #111111;
                font-weight: bold;
            }
        }
        .price {
            position: absolute;
            right: -140px;
            margin-top: 25px;
            width: 85px;
            .money {
                color: #ec0286;
                font-family: OswaldMedium;
                font-size: 24px;
                .rn {
                    font-size: 16px !important;
                }
            }
        }
        .dateAndPrice {
            position: absolute;
            margin-top: 33px;
            left: 390px;
            font-size: 14px;
            color: #ec0286;
            font-weight: bold;
            font-family: OswaldMedium;
            text-align: center;
            span {
                font-weight: 400;
                color: #999999;
            }
            img {
                position: absolute;
                width: 200px;
                top: -80px;
                left: -30px;
            }
        }
        @{deep} th .ivu-table-cell {
            color: #a3a3a3;
        }
        @{deep}.ivu-anchor-link {
            font-size: 16px;
            margin-left: -16px;
            margin-right: 100px;
            padding: 25px 0 0;
        }
        @{deep}.ivu-anchor {
            position: relative;
            display: flex;
        }
        @{deep} .ivu-page {
            margin: 41px 51px auto 50px;
        }
        //表单样式
        @{deep} .ivu-input {
            width: 260px;
            height: 40px;
        }
        @{deep} .ivu-select-single .ivu-select-selection {
            width: 260px;
            height: 40px;
        }
        // 文字设置
        @{deep} .ivu-form .ivu-form-item-label {
            color: #999999 !important;
            white-space: nowrap !important;
        }
        @{deep} .ivu-form .ivu-form-label-right {
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            width: 800px;
            margin-top: 30px;
            margin-left: 49px;
        }
        @{deep} .ivu-anchor-wrapper {
            overflow: inherit;
        }
        @{deep} .ivu-checkbox-wrapper {
            margin-left: 50px;
            margin-top: 45px;
        }
        .fix {
            padding-left: 10px;
            width: 640px;
            position: absolute;
            top: 130px;
            left: 366px;
            height: 38px;
            line-height: 38px;
            background: rgba(255, 239, 248, 1);
            border-radius: 1px;
            white-space: pre-wrap;
            i {
                color: #ed0287;
                font-size: 14px;
                &::before {
                    vertical-align: top;
                }
            }
            .img1 {
                width: 14px;
                height: 14px;
            }
            .purple {
                font-size: 14px;
                font-weight: 400;
                color: #ec0286;
                white-space: nowrap;
            }
        }
        .zafei {
            width: 1080px;
            height: 288px;
            background: rgba(250, 250, 250, 1);
            padding: 28px 37px 27px 26px;
            margin: 33px 50px 52px 50px;
            .container {
                color: #555;
                width: 1017px;
                height: 233px;
                font-size: 14px;
                font-weight: 400;
                .imp {
                    color: #ec0286;
                }
                .sj {
                    margin-left: 30px;
                }
            }
        }
    }

    .detailHead {
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: 400;
        color: rgba(17, 17, 17, 1);
        white-space: nowrap;
        margin: 27px 0;
        a {
            color: #222;
            display: inline-block;
            padding: 0 6px;
        }
        .nuxt-link-exact-active {
            color: #e9047b;
        }
        .nowme {
            color: #ed0287;
        }
    }
    .service {
        height: 330px;
        background: rgba(255, 255, 255, 1);
        display: flex;
        .imgShow {
            width: 480px;
            height: 276px;
            margin: 27px 32px 27px 29px;
            border: 1px solid #fafafa;
        }
        //包车服务
        .eup {
            width: 286px;
            height: 31px;
            font-size: 32px;
            font-family: PingFang SC;
            font-weight: 600;
            color: rgba(17, 17, 17, 1);
            white-space: nowrap;
            margin: 59px 353px auto auto;
        }
        .context {
            width: 390px;
            height: 134px;
            font-size: 14px;
            font-family: PingFang SC;
            font-weight: bold;
            color: #777777;
            line-height: 30px;
            margin-top: 29px;
            white-space: nowrap;
            .dark {
                color: #111111;
            }
            .pp {
                overflow: hidden;
                text-overflow: ellipsis;
            }
        }
    }
}
</style>