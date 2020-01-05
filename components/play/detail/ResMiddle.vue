<template>
    <div class="middle">
        <div class="module" id="level0">
            <h3>预定</h3>
            <div class="goods tuancan" v-if="detail.teamMealList&&detail.teamMealList.length>0">
                <div class="title">团队餐</div>
                <div class="contant">
                    <Row v-for="(item,index) in detail.teamMealList" :key="index">
                        <Col span="15">
                            <h3>{{item.name}}</h3>
                            <p>{{item.detail}}</p>
                            <ul class="tags">
                                <li v-if="item.minQuantity">起订人数：{{item.minQuantity}}</li>
                                <li v-if="item.maxQuantity">最大人数：{{item.maxQuantity}}</li>
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
                            <Button type="primary" @click="book(item, 0)">预定</Button>
                        </Col>
                    </Row>
                </div>
            </div>
            <div class="goods taocan" v-if="detail.ratSetMealList&&detail.ratSetMealList.length>0">
                <div class="title">套餐</div>
                <div class="contant">
                    <Row v-for="(item,index) in detail.ratSetMealList" :key="index">
                        <Col span="3" class="img">
                            <img
                                style="width:100px;height:100px;"
                                :src="item.imageUrl"
                                alt="暂无图片"
                                onerror="this.src='https://dummyimage.com/100x100/eeeeee?text=no image'"
                            />
                        </Col>
                        <Col span="12">
                            <ul>
                                <li>
                                    <h3>{{item.name}}</h3>
                                    <p>{{item.detail}}</p>
                                </li>
                            </ul>
                            <p v-if="item.adviseQuantity">建议人数：{{item.adviseQuantity}}</p>
                        </Col>
                        <Col span="6">
                            <div class="prePay" v-if="item.prepayPrice&&item.prepayPrice>0">
                                <div>预付价格：</div>
                                <div>
                                    <span>&yen;</span>
                                    {{item.prepayPrice | mixin_f_formatNumber('x.',2)}}
                                </div>
                                <div>&nbsp;/份</div>
                            </div>
                            <div class="presentPay" v-if="item.paymentPrice&&item.paymentPrice>0">
                                <div>现付价格：</div>
                                <div>
                                    <span>&yen;</span>
                                    {{item.paymentPrice | mixin_f_formatNumber('x.',2)}}
                                </div>
                                <div>&nbsp;/份</div>
                            </div>
                        </Col>
                        <Col span="3">
                            <Button type="primary" @click="book(item,1)">预定</Button>
                        </Col>
                    </Row>
                </div>
            </div>
            <div
                class="goods zuowei"
                v-if="detail.agentBookingMealList&&detail.agentBookingMealList.length>0"
            >
                <div class="title">代订座</div>
                <div class="contant">
                    <Row v-for="(v,i) in detail.agentBookingMealList" :key="i">
                        <Col span="15">
                            <h3>{{v.name}}</h3>
                            <p>{{v.detail}}</p>
                        </Col>
                        <Col span="6">
                            <div class="prePay">
                                <div>预付价格：</div>
                                <div>
                                    <span>&yen;</span>
                                    {{v.prepayPrice | mixin_f_formatNumber('x.',2)}}
                                </div>
                                <div>&nbsp;/次</div>
                            </div>
                        </Col>
                        <Col span="3">
                            <Button type="primary" @click="book(v,2)">预定</Button>
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
            <h3>预定须知</h3>
            <div class="notice" v-if="detail.reserveKnows">
                <h3>注意事项</h3>
                <div class="pre">
                    <p v-for="(v,i) in detail.reserveKnows" :key="i">{{v}}</p>
                </div>
            </div>
            <div class="notice" v-if="tuancanCancle">
                <h3>团餐退款规则</h3>
                <Table
                    v-if="tuancanCancle.length>0"
                    border
                    :columns="columns"
                    :data="tuancanCancle"
                    style="width:566px;"
                ></Table>
                <p v-else>该资源一经预定不可取消</p>
            </div>
            <div class="notice">
                <h3>套餐退款规则</h3>
                <Table
                    v-if="taocanCancle.length>0"
                    border
                    :columns="columns"
                    :data="taocanCancle"
                    style="width:566px;"
                ></Table>
                <p v-else>该资源一经预定不可取消</p>
            </div>
            <div class="notice">
                <h3>代订座退款规则</h3>
                <p>{{dingzuoCancle?dingzuoCancle:'该资源一经预定不可取消'}}</p>
            </div>
        </div>
        <div class="module" id="level2">
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
import { ResMealType } from '~/assets/js/play';
export default {
    name: 'ResMiddle',
    props: {
        detail: {
            type: Object,
            required: true,
            default: () => {},
        },
    },
    data() {
        return {
            // 代订座不可取消
            taocanCancle: [],
            tuancanCancle: [],
            dingzuoCancle: '',
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
        // 目前是有SKU才会返退改规则，每种类型的退改规则都是一样的,都取第一个，代订座没有remarkExplain就不可取消
        if (
            this.detail.teamMealList &&
            this.detail.teamMealList.length > 0 &&
            this.detail.teamMealList[0].isCancel !== undefined &&
            this.detail.teamMealList[0].cancelPolicy.length > 0
        ) {
            const td = this.detail.teamMealList[0].cancelPolicy;
            this.tuancanCancle = this.checkCancleNUm(td);
        }
        if (
            this.detail.ratSetMealList &&
            this.detail.ratSetMealList.length > 0 &&
            this.detail.teamMealList[0].isCancel &&
            this.detail.ratSetMealList[0].cancelPolicy.length > 0
        ) {
            const td = this.detail.ratSetMealList[0].cancelPolicy;
            this.taocanCancle = this.checkCancleNUm(td);
        }
        if (
            this.detail.agentBookingMealList &&
            this.detail.agentBookingMealList.length > 0 &&
            this.detail.agentBookingMealList[0].remarkExplain
        ) {
            this.dingzuoCancle = this.detail.agentBookingMealList[0].remarkExplain;
        }
    },
    methods: {
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
                            damagesPercent: 100 - Number(it.damagesPercent) + '%',
                        };
                    }
                    if (i < sort.length) {
                        return {
                            beforeBookingDate: it.beforeBookingDate + '-' + sort[i - 1].beforeBookingDate + '天',
                            damagesPercent: 100 - Number(it.damagesPercent) + '%',
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
        book(item, n) {
            // 代订座最多只有个remarkExplain，没有就不可取消。
            let reserveType = ResMealType[n].value;
            let data = {
                cancelPolicy: {},
                cityId: item.cityId * 1,
                reserveType,
                resourceId: item.resourceId * 1,
                skuId: item.id * 1,
            };
            if (item.remarkExplain) {
                data.cancelPolicy['remarkExplain'] = item.remarkExplain;
            }
            data.cancelPolicy['canCancel'] = item.isCancel ? item.isCancel : false;
            if (item.cancelPolicy) {
                data.cancelPolicy['ladders'] = item.cancelPolicy.map(v => {
                    v.beforeBookingDate = v.beforeBookingDate * 1;
                    v.damagesPercent = v.damagesPercent * 1;
                    return v;
                });
            }
            this.$axios({...API_PLAY.restaurant, data }).then(res => {
                if (res.success) {
                    let play_orderInfo = {};
                    if (reserveType === 'TEAM_MEAL') {
                        play_orderInfo = {
                            ...res.data,
                            rightInfo: {
                                resourceImage: this.detail.images[0],
                                resourceName: this.detail.name,
                                resourceAddr: this.detail.address,
                                reserveType,
                                reserveDate: '',
                                reserveTime: '',
                                payType: '',
                                adultNum: 0,
                                childNum: 0,
                                directorNum: 0,
                                unitPrice: '',
                                childUnitPrice: '',
                                totalAmount: 0,
                                skuName: res.data.ratTerm.name,
                            },
                        };
                    } else {
                        play_orderInfo = {
                            ...res.data,
                            rightInfo: {
                                resourceImage: this.detail.images[0],
                                resourceName: this.detail.name,
                                resourceAddr: this.detail.address,
                                reserveType,
                                reserveDate: '',
                                reserveTime: '',
                                quantity: 1,
                                payType: '',
                                unitPrice: '',
                                totalAmount: 0,
                                skuName: res.data.ratTerm.name,
                            },
                        };
                    }
                    sessionStorage.setItem('play_orderInfo', JSON.stringify(play_orderInfo));
                    his.$router.push({ name: 'play-resOrder', query: { type: RESOURCE_TYPE_TO_SERVER[0].value}});
                }
            });
        },
    },
};
</script>

<style scoped lang="less">
</style>
