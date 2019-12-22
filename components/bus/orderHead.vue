<template>
    <div style="
    padding: 20px 0;">
        <div class="orderInfo">
            <div class="orderMessage">
                <div class="head">
                    <div>订单号：201907180001</div>
                    <div>
                        订单状态：
                        <span></span>
                    </div>
                </div>
                <div class="text">
                    <i class="iconfont icondingdanqueren"></i>
                    <span>
                        <p>
                            您的订单已完成确认，请在出团前7天内尽快上传出团通知书，通知书内容包含途径城市、景点及入住酒店信息。
                            若其中某一项为按规定提交，会影响最终Final的生成，请谨慎操作！
                            <br />有疑问请致电xxx-xxxxxxxx进行联系。
                        </p>
                        <div>距离出发还有10天</div>
                    </span>
                    <span class="uploadBtn">
                        <Upload action="//jsonplaceholder.typicode.com/posts/">
                            <Button>上传出团通知书</Button>
                        </Upload>
                    </span>
                </div>
            </div>
            <div class="orderStep">
                <!-- 大车订单步骤条 传入当前步骤 index(0-3) -->
                <Steps :index="2" />
            </div>
        </div>
    </div>
</template>

<script>
import Steps from '~/components/bus/Step';
export default {
    components: { Steps },
    props: ['detailData'],
};
</script>

<style scoped lang="less">
@import url('~assets/style/variable.less');
.orderInfo {
    padding: 35px 51px;
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
            .uploadBtn {
                button {
                    position: absolute;
                    top: 165px;
                    left: 915px;
                    color: #fff;
                    background: #ed0287;
                    width: 140px;
                    border: 1px solid rgba(237, 2, 135, 1);
                    border-radius: 0;
                    text-align: center;
                    font-size: 14px;
                    line-height: 16px;
                    height: 32px;
                }
            }
        }
    }
}
</style>