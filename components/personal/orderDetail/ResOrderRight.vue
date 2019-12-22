<template>
    <div class="orderInfoRight">
        <div class="top">
            <div class="first">
                <div class="img">
                    <img :src="detail.resourceImage" alt="获取图片失败" v-noimg="'320-430'">
                </div>
                <h3>{{detail.resourceName}}</h3>
                <div class="address">
                    <div class="svg">
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#iconmap"></use>
                        </svg>
                    </div>
                    <p>{{detail.resourceAddr}}</p>
                </div>
            </div>
            <div class="cell">
                <h3>订单信息</h3>
                <ul>
                    <li>
                        <div>{{detail.reserveType | reserveType}}名称：</div>
                        <p>{{detail.skuName}}</p>
                    </li>
                    <li>
                        <div>使用日期：</div>
                        <p>{{detail.reserveDate | mixin_f_formatDate('xxxx年xx月xx日')}}</p>
                    </li>
                    <li>
                        <div>到店时间：</div>
                        <p>{{detail.reserveTime}}</p>
                    </li>
                    <li>
                        <div>支付方式：</div>
                        <p>{{detail.payType | payType}}</p>
                    </li>
                </ul>
            </div>
            <div class="cell" v-if="detail.reserveType==='TEAM_MEAL'||detail.reserveType*1===1">
                <ul>
                    <li>
                        <div>成人游客：</div>
                        <p>{{detail.adultNum}}</p>
                    </li>
                    <li>
                        <div>儿童游客：</div>
                        <p>{{detail.childNum}}</p>
                    </li>
                    <li>
                        <div>非免司导数：</div>
                        <p>{{detail.directorNum}}</p>
                    </li>
                    <li>
                        <div>单&emsp;&emsp;价：</div>
                        <p>&yen;{{detail.unitPrice | mixin_f_formatNumber}}/人</p>
                    </li>
                    <li>
                        <div>儿童单价：</div>
                        <p>&yen;{{detail.childUnitPrice | mixin_f_formatNumber}}/人</p>
                    </li>
                </ul>
            </div>
            <div class="cell" v-else>
                <ul>
                    <li>
                        <div>数&emsp;&emsp;量：</div>
                        <p>{{detail.reserveNum}}</p>
                    </li>
                    <li>
                        <div>单&emsp;&emsp;价：</div>
                        <p>&yen;{{detail.unitPrice | mixin_f_formatNumber}}/人</p>
                    </li>
                </ul>
            </div>
        </div>
        <div class="bottom">
            <p>订单总额</p>
            <div><span>&yen;</span>{{detail.totalAmount | mixin_f_formatNumber}}</div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            detail: {
                type: Object,
                required: true,
                default: () => {},
            }
        },
        data() {
            return {

            };
        },
        filters: {
            reserveType(v) {
                if(v*1===1 || v ==='TEAM_MEAL') return '团餐';
                if(v*1===2 || v ==='SET_MEAL') return '套餐';
                if(v*1===3 || v === 'SUBSTITUTION_SEATS') return '代订座';
                return '';
            },
            payType(v) {
                if(v*1===1 || v === 'ADVANCE' || v === '预付') return '预付';
                if(v*1===2 || v === 'SPOT' || v === '现付') return '现付';
                return '';
            }
        },
    };
</script>

<style scoped lang="less">
    .orderInfoRight{
        width: 356px;
        background-color: rgb(246, 246, 246);
        border-radius:6px 6px 0px 0px;
        .top{
            background-color: #fff;
            padding: 16px 18px 18px;
            div:last-child{
                border-bottom: none!important;
            }
            .first{
                border-bottom: 1px dashed #dadada;
                padding-bottom: 18px;
                .img{
                    width:320px;
                    height:230px;
                    display: flex;
                    justify-content: center;
                    overflow: hidden;
                    img{
                        max-width: 320px;
                    }
                }
                h3{
                    font-size: 18px;
                    color:#222;
                    line-height: 32px;
                    font-weight:600;
                    padding-top:18px;
                }
                .address{
                    display: flex;
                    padding-top: 6px;
                    .svg {
                        margin-left: -4px;
                        margin-top: -2px;
                        svg{
                            width: 22px;
                            height: 22px;
                        }
                    }
                    p{
                        font-size: 12px;
                        line-height: 18px;
                        padding: 0 4px;
                        color:#999;
                    }
                }
            }
            .cell{
                padding:26px 0 24px;
                border-bottom: 1px dashed #dadada;
                h3{
                    line-height: 1;
                    font-size: 16px;
                    font-weight: 600;
                    color:#222;
                    padding-bottom: 8px;
                }
                ul{
                    li{
                        display: flex;
                        font-size:14px;
                        line-height: 30px;
                        div{
                            flex-shrink: 0;
                            color:#8E8E8E;
                        }
                        p{
                            word-wrap: break-word;
                            word-break: break-all;
                            color:#222;
                        }
                    }
                }
            }
        }
        .bottom {
            height: 90px;
            padding: 0 20px;
            background: #f9f9f9 url('~assets/public_img/border_bottom.png') no-repeat left bottom;
            display: flex;
            justify-content: space-between;
            align-items: center;
            p {
                font-size: 18px;
                font-weight: bold;
                color: #111;
            }
            div {
                font-size: 22px;
                font-family: OswaldMedium;
                font-weight: bold;
                color: #ea037c;
                span {
                    font-size: 14px;
                }
            }
        }
    }
</style>
