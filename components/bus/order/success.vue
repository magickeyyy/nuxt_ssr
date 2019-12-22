<template>
    <div class="orderInfo" v-if="orderStatus!==''">
        <div class="orderMessage">
            <div class="head">
                <div>订单号：{{orderData.orderNo}}</div>
                <div style="margin-right:94px">
                    订单状态：
                    <span v-if="orderStatus==='CONFIRMED'">已确认</span>
                    <span v-if="orderStatus==='GROUP_PUSHED'">已推送出团通知书</span>
                    <span v-if="orderStatus==='GOT_FINAL'">获取final</span>
                </div>
                <div class="file" v-if="fileSrc!==''">
                    <i class="iconfont iconfujian" style="color:#ED0287;" />
                    <span>出团通知书.doc</span>
                    <button class="download" @click="downladFile">下载</button>
                </div>
            </div>
            <div class="text" style="position:relative">
                <i class="iconfont icondingdanqueren"></i>
                <span>
                    <p>
                        您的订单已完成确认，请在出团前7天内尽快上传出团通知书，通知书内容包含途径城市、景点及入住酒店信息。
                        若其中某一项未按规定提交，会影响最终Final的生成，请谨慎操作！
                        <br />有疑问请致电400 117 9517进行联系。
                    </p>
                    <div>距离出发还有{{lastDay+1}}天</div>
                </span>
                <Upload
                    v-if="orderStatus==='CONFIRMED' &&fileSrc===''"
                    :headers="uploadHeaders"
                    :action="wordUpload"
                    class="uploadBtn"
                    :show-upload-list="false"
                    accept=".doc, docx"
                    :on-success="handleSuccess"
                    :on-exceeded-size="sizeError"
                >
                    <Button>上传出团通知书</Button>
                </Upload>
            </div>
        </div>
        <div class="orderStep">
            <!-- 大车订单步骤条 传入当前步骤 index(0-3) -->
            <Steps :index="2" :orderStatus="orderStatus" v-if="orderStatus!=='GOT_FINAL'" />
            <Steps :index="3" :orderStatus="orderStatus" v-if="orderStatus==='GOT_FINAL'" />
        </div>
    </div>
</template>

<script>
import Steps from '~/components/bus/Step';
import { BusOrderStateToCilent } from '~/assets/js/bus';
import { api_bus, api_base } from '~/service/api';

import moment from 'moment';
export default {
    components: { Steps },
    props: ['orderStatus', 'orderData'],
    data() {
        return {
            lastDay: '0',
            fileSrc: '',
            wordUpload: api_base.wordLoad, //action的地址
            uploadHeaders: {
                Authorization: sessionStorage.getItem('token'),
            },
            order: '',
            urlName: '',
        };
    },
    created() {
        if (this.orderData !== '') {
            this.lastDay = parseInt((moment(this.orderData.bookingBeginDate) - moment()) / (1000 * 3600 * 24));
            if (this.orderData.groupAttachmentUrl !== '') {
                this.fileSrc = this.orderData.groupAttachmentUrl;
            }
            if (this.orderData.finalAttachmentUrl !== '') {
                this.fileSrc = this.orderData.finalAttachmentUrl;
            }
        }
    },
    methods: {
        downladFile() {
            window.open(this.fileSrc);
        },
        handleSuccess(res, file) {
            if (res.code === '200') {
                this.$axios
                    .post(
                        api_bus.busChangorder,
                        {
                            groupAttachmentUrl: res.data,
                            orderId: this.orderData.orderId,
                        },
                        { params: { customerId: sessionStorage.getItem('userID') }, custom: { token: true } },
                    )
                    .then(res => {
                        if (res.code === '200') {
                            this.$Message.success('上传成功');
                        } else {
                            this.$Message.error(res.msg);
                        }
                    });
                this.fileSrc = res.data;
            }
        },
        sizeError(file, fileList) {
            this.$Message.error('文件大小不能5M');
        },
    },
};
</script>

<style lang="less" scoped>
.orderInfo {
    padding: 35px 51px;
    // width: 100%;
    height: 440px;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(237, 237, 237, 1);
    box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.03);
    border-radius: 6px;
    margin-bottom: 12px;
    .orderMessage {
        margin: 0 auto;
        height: 220px;
        background: rgba(250, 250, 250, 1);
        border: 1px solid rgba(237, 237, 237, 1);
        .head {
            padding: 18px 57px;
            font-weight: bold;
            color: #0f0f0f;
            border-bottom: 1px dashed #ededed;
            overflow: auto;
            padding-bottom: 20px;
            div {
                float: left;
                margin-right: 285px;
                span {
                    color: #ed0287;
                }
            }
            .download {
                background-color: #ed0287;
                font-size: 14px;
                color: #fff;
                border: none;
                padding: 3px 14px;
                font-weight: 400;
                border-radius: 2px;
                cursor: pointer;
                margin-left: 14px;
            }
        }
        .text {
            padding: 25px 57px 32px;
            i {
                color: #ed0287;
                font-size: 50px;
                margin-right: 33px;
                &::before {
                    vertical-align: top;
                }
            }
            span {
                display: inline-block;
                width: 685px;
                color: #828282;
                div {
                    color: #0f0f0f;
                    font-size: 24px;
                    font-weight: bold;
                    margin-top: 6px;
                }
            }
            .uploadBtn button {
                background: rgba(237, 2, 135, 1);
                border-radius: 2px;
                color: #fff;
                font-size: 14px;
                font-weight: bold;
                text-align: center;
                line-height: 22px;
                position: absolute;
                top: 50px;
                left: 889px;
            }
        }
    }
}
</style>