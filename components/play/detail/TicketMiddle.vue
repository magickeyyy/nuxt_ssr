<template>
    <div class="middle">
        <div class="module" id="level0">
            <h3>预定</h3>
            <!-- <div class="goods tuancan" v-if="detail.skuList&&detail.skuList.length>0"> -->
            <div class="goods tuancan" v-for="(v, i) in skuList" :key="i">
                <div class="title">{{v[0].type}}</div>
                <div class="contant">
                    <Row v-for="(item,index) in v" :key="index">
                        <Col span="15">
                            <h3>{{item.name}}</h3>
                            <ul class="tags" style="color:#999;">
                                <li
                                    v-if="item.confirmTime"
                                >预计确认时间：{{item.confirmTime>0?`${item.confirmTime}小时内`:'立即确认'}}</li>
                                <li v-if="item.availableDate">可订时间：{{item.availableDate}}</li>
                            </ul>
                        </Col>
                        <Col span="6">
                            <div class="prePay" v-if="item.prepayPrice&&item.prepayPrice>0">
                                <div>预付价格：</div>
                                <div>
                                    <span>&yen;</span>
                                    {{item.prepayPrice | mixin_f_formatNumber('x.',2)}}
                                </div>
                                <div>&nbsp;/人</div>
                            </div>
                            <div class="presentPay" v-if="item.paymentPrice&&item.paymentPrice>0">
                                <div>现付价格：</div>
                                <div>
                                    <span>&yen;</span>
                                    {{item.paymentPrice | mixin_f_formatNumber('x.',2)}}
                                </div>
                                <div>&nbsp;/人</div>
                            </div>
                        </Col>
                        <Col span="3">
                            <Button type="primary" @click="booking(item)">预定</Button>
                        </Col>
                    </Row>
                </div>
            </div>
        </div>
        <br />
        <br />
        <br />
        <br />
        <br />
        <div class="module" id="level1">
            <h3>详情</h3>
            <div class="images" v-html="detail.introduceDetail"></div>
        </div>
        <div class="module" id="level2">
            <h3 v-if="detail.reserveKnows">预定须知</h3>
            <div class="notice" v-if="detail.reserveKnows">
                <h3>注意事项</h3>
                <div class="pre">
                    <p v-for="(v,i) in detail.reserveKnows" :key="i">{{v}}</p>
                </div>
            </div>
            <div class="notice">
                <h3>退款规则</h3>
                <Table
                    v-if="cancleRule.length>0"
                    border
                    :columns="columns"
                    :data="cancleRule"
                    style="width:566px;"
                ></Table>
                <p v-else>该资源一经预定不可取消</p>
            </div>
        </div>
        <div class="module" id="level3">
            <h3>交通指南</h3>
            <div class="google">
                <img
                    onerror="this.src='https://dummyimage.com/730x400/eeeeee?text=no image'"
                    :src="`https://ditu.google.cn/maps/api/staticmap?zoom=16&size=730x400&maptype=roadmap&markers=color:red%7Clabel:P%7C${detail.latitude},${detail.longitude}&key=AIzaSyDOW8NW4egQT4QFsyLzaOlDR95ib12XywM`"
                />
            </div>
            <div class="trancText">
                <h4 style="font-size:16px;margin-bottom:40px">如何前往</h4>
                <p v-for="(v,i) in detail.transportationGuide" :key="i">{{v}}</p>
            </div>
        </div>
    </div>
</template>

<script>
import { RESOURCE_TYPE_TO_SERVER } from '~/assets/js/play'
import { API_PLAY } from '~/assets/api/play';
export default {
    name: 'TicketMiddle',
    props: {
        detail: {
            type: Object,
            required: true,
            default: () => {},
        },
    },
    data() {
        return {
            skuList: {},
            cancleRule: [],
            columns: [
                {
                    title: '提前取消天数',
                    key: 'beforeBookingDate',
                    align: 'center',
                },
                {
                    title: '退款比例',
                    key: 'damagesPercent',
                    align: 'center',
                },
            ],
        };
    },
    created() {
        if (this.detail.skuList) this.skuList = this.classifySku(this.detail.skuList);
        if (
            this.detail.skuList &&
            this.detail.skuList.length > 0 &&
            this.detail.skuList[0].cancelable &&
            this.detail.skuList[0].cancelPolicy.length > 0
        ) {
            this.cancleRule = this.checkCancleNUm(this.detail.skuList[0].cancelPolicy);
        }
    },
    methods: {
        booking(v) {
            let cancelPolicy = {};
            if (v.cancelPolicy && v.cancelPolicy.length > 0) {
                cancelPolicy['ladders'] = v.cancelPolicy.map(v => {
                    if (v.beforeBookingDate) v.beforeBookingDate = v.beforeBookingDate * 1;
                    if (v.damagesPercent) v.damagesPercent = v.damagesPercent * 1;
                    return v;
                });
            } else {
                cancelPolicy['ladders'] = [];
            }
            if (v.cancelable !== undefined || v.cancelable !== null) {
                cancelPolicy['canCancel'] = v.cancelable;
            }
            let data = {
                cancelPolicy,
                cityId: this.detail.cityId * 1,
                resourceId: this.detail.id * 1,
                skuId: v.id * 1,
            };
            this.$axios({...API_PLAY.resource, data }).then(res => {
                if (res.success) {
                    this.mixin_m_SStorage('set', 'play_orderInfo', {
                        pre: res.data,
                        info: {
                            ...v,
                            resourceName: this.detail.name,
                            resourceAddr: this.detail.address,
                            resourceId: this.detail.id * 1,
                        },
                        rightInfo: {
                            resourceImage:
                                this.detail.images && this.detail.images.length > 0 ? this.detail.images[0] : '',
                            resourceName: this.detail.name,
                            resourceAddr: this.detail.address,
                            type: v.type,
                            name: v.name,
                            availableDate: '',
                            bookingNum: v.minimumOrderQuantity ? v.minimumOrderQuantity * 1 : 0,
                            payType: '',
                            unitPrice: '',
                            price: '',
                        },
                        resourceType: 'TICKETS',
                    });
                    his.$router.push({ name: 'play-ticketOrder', query: { type: RESOURCE_TYPE_TO_SERVER[1].value}});
                }
            });
        },
        classifySku(list) {
            let obj = {};
            list.map(v => {
                if (obj[v.type] === undefined) {
                    obj[v.type] = [];
                    obj[v.type].push(v);
                } else {
                    obj[v.type].push(v);
                }
            });
            return obj;
        },
        // 格式化退款规则
        checkCancleNUm(td) {
            let sort = td.sort((a, b) => b.beforeBookingDate - a.beforeBookingDate);
            const t = sort.filter(it => it.beforeBookingDate === null || it.damagesPercent === null);
            if (t.length > 0) {
                return [];
            }
            if (td.length > 0) {
                sort = sort.map((it, i) => {
                    if (i === 0) {
                        return {
                            beforeBookingDate: '≥' + it.beforeBookingDate + '天',
                            damagesPercent: 100 - it.damagesPercent + '%',
                        };
                    }
                    if (i < sort.length) {
                        return {
                            beforeBookingDate: it.beforeBookingDate + '-' + sort[i - 1].beforeBookingDate + '天',
                            damagesPercent: 100 - it.damagesPercent + '%',
                        };
                    }
                });
                sort.push({
                    beforeBookingDate: '<' + td[td.length - 1].beforeBookingDate + '天',
                    damagesPercent: '0%',
                });
            }
            return sort;
        },
    },
};
</script>

<style scoped lang="less">
.images {
    display: flex;
    flex-direction: column;
    // align-items: center;
    // align-content: center;
    img {
        max-width: 900px;
        margin-bottom: 20px;
        text-align: center;
    }
}
</style>
