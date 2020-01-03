<template>
    <component :is="currComp"/>
</template>

<script>
import ResOrder from '@/components/play/order/ResOrder'
import TicketOrder from '@/components/play/order/TicketOrder'
import ExpOrder from '@/components/play/order/ExpOrder'
export default {
    data() {
        return {
            currComp: null
        };
    },
    created() {
        this.changeType();
    },
    methods: {
        // 根据sessionsTorage中resourceType选择组件：餐厅、门票、特色体验
        changeType() {
            let type = this.mixin_m_SStorage('get','play_orderInfo');
            if(!type) this.$router.replace('/play');
            if(type.resourceType === 'TICKETS') {
                this.currComp = TicketOrder;
            } else if(type.resourceType === 'CHARACTERISTIC_EXPERIENCE') {
                this.currComp = ExpOrder;
            } else {
                this.currComp = ResOrder;
            }
        }
    },
};
</script>

<style scoped lang="less">
@deep: ~'>>>';
.process {
    height: 160px;
    background: rgb(255, 255, 255);
    border: 1px solid rgb(234, 234, 234);
    box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.03);
    border-radius: 6px;
    margin: 20px 0 12px;
    padding-top: 42px;
}
.ivu-form {
    background: rgb(255, 255, 255);
    border: 1px solid rgb(234, 234, 234);
    box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.03);
    border-radius: 6px;
    padding-top: 40px;
    .module {
        padding: 0 48px;
        > h3 {
            font-size: 24px;
            color: #111;
            font-weight: bold;
            padding-bottom: 12px;
        }
    }
    .notice {
        margin-bottom: 40px;
        max-width: 566px;
        .noticeList {
            font-size: 14px;
            color: #6c6c6c;
            margin-bottom: 20px;
        }
        .title {
            font-size: 14px;
            color: #111;
            font-weight: bold;
            padding-bottom: 20px;
        }
    }
    .formItem {
        > ul > li {
            padding-bottom: 20px;
            font-size: 14px;
            display: flex;
            .label {
                color: #8e8e8e;
                height: 40px;
                line-height: 40px;
                width: 100px;
                text-align: justify;
                position: relative;
                span {
                    display: inline-block;
                    width: 100%;
                }
            }
            .label.required {
                padding-left: 8px;
            }
            .label.required::before {
                content: '*';
                display: inline-block;
                color: #ea037c;
                position: absolute;
                left: 0;
                top: 3px;
            }
            .item {
                > p {
                    color: #111;
                    font-weight: bold;
                    line-height: 40px;
                }
            }
            /deep/.inputs {
                .ivu-form-item-content {
                    height: 40px;
                    display: flex;
                    align-items: center;
                    > p {
                        font-size: 14px;
                        font-weight: bold;
                        color: #111;
                    }
                    > p:first-of-type {
                        margin-right: 14px;
                    }
                    > p:last-of-type {
                        margin: 0 14px;
                    }
                    > div:last-of-type {
                        color: #a3a3a3;
                        font-size: 12px;
                    }
                }
                .ivu-input-number {
                    width: 230px;
                    height: 40px;
                    border: 1px solid rgb(223, 223, 223);
                    border-radius: 2px;
                    .ivu-input-number-handler-wrap {
                        display: none;
                    }
                    .ivu-input-number-input {
                        height: 40px;
                    }
                }
                .ivu-input-number-focused {
                    box-shadow: none;
                }
            }
            .ivu-radio-group {
                display: flex;
            }
            .met.ivu-radio-wrapper {
                display: flex;
                align-items: center;
            }
            /deep/.ivu-input-wrapper.large {
                width: 340px;
                height: 40px;
                border-radius: 2px;
                .ivu-input {
                    width: 340px;
                    height: 40px;
                    border: 1px solid rgb(223, 223, 223);
                }
            }
        }
    }
    // .tables{
    //     @{deep}.ivu-table{
    //         table{
    //             width: 144px*3+444px!important;
    //         }
    //         th{
    //             width: 144px;
    //         }
    //         th:nth-child(2){
    //             width: 444px;
    //         }
    //     }
    // }
}
.bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 96px;
    padding: 0 48px 0 30px;
    background: rgb(249, 249, 249);
    .agreement {
        font-size: 14px;
        color: #111;
        font-weight: 500;
        a {
            color: #ea037c;
            font-size: 14px;
            font-weight: 500;
        }
    }
    .submit {
        display: flex;
        align-items: center;
        p {
            font-size: 14px;
            color: #111;
            span {
                color: #ea037c;
                font-family: OswaldMedium;
                font-weight: bold;
            }
            span:first-child {
                font-size: 18px;
            }
            span:last-child {
                font-size: 28px;
            }
        }
        /deep/.ivu-btn-primary {
            width: 230px;
            height: 48px;
            border-radius: 6px;
            span {
                font-size: 16px;
                font-weight: 400;
                color: #fff;
            }
        }
    }
}
</style>
