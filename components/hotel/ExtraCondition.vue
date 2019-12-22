<template>
    <div class="extraCondition">
        <div class="module">
            <div class="title">
                <h3>已选条件</h3>
                <div @click="clear">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#iconqingchuxuanze" />
                    </svg>
                    <span>清空</span>
                </div>
            </div>
            <Checkbox v-if="form.perNightPrice.checked"
                :class="['his', {checked: form.perNightPrice.checked}]"
                @click.native.prevent="clearPrice"
                v-model="form.perNightPrice.checked">{{form.perNightPrice.label}}</Checkbox>
            <Checkbox v-if="form.star.checked"
                :class="['his', {checked: form.star.value}]"
                v-model="form.star.checked"
                @click.native.prevent="clearStar">{{form.star.label}}</Checkbox>
            <Checkbox v-show="v.checked"
                v-for="(v,i) in form.leastGroupRoomQuality"
                :class="['his', {checked: v.checked}]"
                :key="i"
                @click.native.prevent="clearRoom(v,i)"
                v-model="v.checked">{{v.value}}间起</Checkbox>
            <Checkbox v-for="(v,i) in form.supportFacilities"
                :key="i" :class="['his', {checked: v.checked}]"
                @click.native.prevent="clearSup(v,i)"
                v-model="v.checked">{{v.name}}</Checkbox>
        </div>
        <div class="module">
            <div class="title">
                <h3>每晚价格</h3>
            </div>
            <Checkbox v-for="(v,i) in priceList" :key="i" :class="['his', {checked: v.checked}]" @click.native.prevent="changePrice(v,i)" v-model="v.checked">
                <div v-if="v.label!=='自定义'">{{v.label}}</div>
                <div v-else class="custom">
                    <p style="padding-right:4px;">{{v.label}}</p>
                    <InputNumber class="per" v-model="v.min" @on-blur="numBlur('min')" placeholder="最低价" @click.native.stop="()=>{}"></InputNumber>
                    <p style="padding-left:4px;padding-right:4px;" @click.prevent.stop="()=>{}">-</p>
                    <InputNumber @click.native.stop="()=>{}" @on-blur="numBlur('max')" class="per" v-model="v.max" placeholder="最高价"></InputNumber>
                    <Button type="primary" @click.stop="confirmPrice(v,i)">确定</Button>
                </div>
            </Checkbox>
        </div>
        <div class="module">
            <div class="title">
                <h3>酒店等级</h3>
            </div>
            <Checkbox v-for="(v,i) in starList" :key="i" :class="['his', {checked: v.checked}]" v-model="v.checked" @click.native.prevent="changeStar(v, i)">{{v.label}}</Checkbox>
        </div>
        <div class="module">
            <div class="title">
                <h3>团房房间最低起订数</h3>
            </div>
            <Checkbox v-for="(v,i) in leastGroupRoomQualityList" :key="i" :class="['his', {checked: v.checked}]" v-model="v.checked" @click.native.prevent="changeRoom(v, i)">
                <div v-if="v.label!=='自定义'">{{v.label}}</div>
                <div v-else class="custom">
                    <p style="padding-right:4px;">{{v.label}}</p>
                    <InputNumber class="per" @click.native.stop="()=>{}"  @on-blur="numBlur()" v-model="v.value" placeholder="最低数"></InputNumber>
                </div>
            </Checkbox>
        </div>
        <div class="module">
            <div class="title">
                <h3>设施</h3>
            </div>
            <Checkbox v-for="(v,i) in supportFacilitiesList" :key="i" :class="['his', {checked: v.checked}]" v-model="v.checked" @click.native.prevent="changeSup(v,i)">{{v.name}}</Checkbox>
        </div>
    </div>
</template>

<script>
    import {api_hotel} from '~/service/api';
    export default {
        name:'ExtraCondition',
        data() {
            return {
                priceList:[ // 价格筛选条件
                    {
                        label:'<300元',
                        min: 0,
                        max: 300,
                        checked: false,
                        custom: false,
                    },
                    {
                        label:'300-500',
                        min: 300,
                        max: 500,
                        checked: false,
                        custom: false,
                    },
                    {
                        label:'500-800',
                        min: 500,
                        max: 800,
                        checked: false,
                        custom: false,
                    },
                    {
                        label:'自定义',
                        min: 0,
                        max: 0,
                        checked: false,
                        custom: true,
                    }
                ],
                starList:[ // 星级筛选条件
                    {
                        value:0,
                        label:'经济型',
                        checked: false,
                    },
                    {
                        value:3,
                        label:'三星/舒适型',
                        checked: false,
                    },
                    {
                        value:4,
                        label:'四星/高档型',
                        checked: false,
                    },
                    {
                        value:5,
                        label:'五星/豪华型',
                        checked: false,
                    }
                ],
                leastGroupRoomQualityList:[ // 房间数筛选条件
                    {
                        value:5,
                        label:'5间起',
                        checked: false,
                        custom: false,
                    },
                    {
                        value:8,
                        label:'8间起',
                        checked: false,
                        custom: false,
                    },
                    {
                        value:10,
                        label:'10间起',
                        checked: false,
                        custom: false,
                    },
                    {
                        value:1,
                        label:'自定义',
                        checked: false,
                        custom: true,
                    }
                ], 
                supportFacilitiesList:[],
                form: {
                    leastGroupRoomQuality: [],
                    perNightPrice: {},
                    star: {
                        value: 0,
                        label: '',
                        checked: false,
                    },
                    supportFacilities: []
                },
            };
        },
        created(){
            this.getFacilities();
        },
        methods:{
            clearPrice() {
                this.priceList.forEach(item => {
                    item.checked = false;
                })
                this.form.perNightPrice = {};
                this.postData();
            },
            changePrice(v, i) {
                /**
                 * @Description: 点击每晚价格选项（非确定按钮）
                 * @Attention: 事件绑定在组件上，要阻止事件冒泡捕获 
                 */
                if(v.checked) {
                    this.priceList.forEach(item => {
                        item.checked = false;
                    })
                    this.form.perNightPrice = {}
                    this.postData();
                    return;
                }
                if(i < 3) {
                    this.priceList.forEach(item => {
                        item.checked = false;
                    })
                    this.priceList[i].checked = true;
                    this.priceList = JSON.parse(JSON.stringify(this.priceList));
                    this.form.perNightPrice = this.priceList.find(item => item.checked);
                } else if(i === 3 && (v.max>0 || v.min>0)) {
                    this.priceList.forEach(item => {
                        item.checked = false;
                    })
                    let max = Math.max(v.max, v.min);
                    let min = Math.min(v.max, v.min);
                    this.priceList[i].checked = true;
                    this.priceList = JSON.parse(JSON.stringify(this.priceList));
                    this.form.perNightPrice.max = max;
                    this.form.perNightPrice.min = min;
                    this.form.perNightPrice.label = `${min==0?'<':min+'-'}${max}`;
                    this.form.perNightPrice.checked = true;
                } else if(i === 3 && !v.max && !v.min) {
                    this.priceList.forEach(item => {
                        item.checked = false;
                    })
                    this.form.perNightPrice = {}
                }
                this.postData();
            },
            confirmPrice(v, i) {
                /**
                 * @Description: 点击确定按钮
                 * @Attention: 
                 * @param {type} 
                 * @return: 
                 */
                let max = Math.max(v.max, v.min);
                let min = Math.min(v.max, v.min);
                if(max <= 0) return;
                this.priceList.forEach(item => {
                    item.checked = false;
                })
                this.form.perNightPrice.max = max;
                this.form.perNightPrice.min = min;
                this.form.perNightPrice.label = `${min==0?'<':min+'-'}${max}`;
                this.form.perNightPrice.checked = true;
                this.priceList[i].checked = !this.priceList[i].checked;
                this.priceList = JSON.parse(JSON.stringify(this.priceList));
                this.postData();
            },
            changeStar(v, i) {
                /**
                 * @Description: 点击酒店等级
                 * @Attention: 
                 */ 
                this.starList.forEach((item, index) => {
                    if(index !== i) {
                        item.checked = false;
                    } else {
                        item.checked = !item.checked;
                        this.form.star = { ...item };
                    }
                })
                this.postData();
            },
            clearStar() {
                /**
                 * @Description: 点击已选条件中的酒店等级
                 * @Attention: 
                 */
                this.starList.forEach(v => {
                    v.checked = false;
                })
                this.form.star.checked = false;
                this.postData();
            },
            changeRoom(v, i) {
                // 多选
                if(i < 3){
                    this.leastGroupRoomQualityList[i].checked = !this.leastGroupRoomQualityList[i].checked;
                    if(this.leastGroupRoomQualityList[i].checked) {
                        this.form.leastGroupRoomQuality.push(v);
                    } else {
                        this.form.leastGroupRoomQuality = this.form.leastGroupRoomQuality.filter(item => item.value!== v.value);
                    }
                } else {
                    if(this.leastGroupRoomQualityList[i].value < 1) {
                        this.form.leastGroupRoomQuality = this.form.leastGroupRoomQuality.filter(item => !item.custom)
                    } else {
                        this.leastGroupRoomQualityList[i].checked = !this.leastGroupRoomQualityList[i].checked;
                        if(this.leastGroupRoomQualityList[i].checked) {
                            let index = this.form.leastGroupRoomQuality.findIndex(item => item.custom);
                            if(index > -1) {
                                this.form.leastGroupRoomQuality[index] = this.leastGroupRoomQualityList[i];
                            } else {
                                this.form.leastGroupRoomQuality.push(this.leastGroupRoomQualityList[i]);
                            }
                        } else {
                            this.form.leastGroupRoomQuality = this.form.leastGroupRoomQuality.filter(item => !item.custom);
                        }
                    }
                }
                this.postData();
            },
            clearRoom(v, i) {
                if(v.checked) {
                    this.form.leastGroupRoomQuality.splice(i,1);
                    this.leastGroupRoomQualityList.forEach(item => {
                        if(!item.custom && item.value === v.value) {
                            item.checked = false;
                        } else if(item.custom&&v.custom) {
                            item.checked = false;
                        }
                    })
                }
                this.postData();
            },
            numBlur(key) {
                /**
                 * @Description: 数字输入框有BUG，再手动处理下数据
                 * @Attention:
                 */
                let c = key?key:'value';
                let p = key?'priceList':'leastGroupRoomQualityList';
                if(!this[p][3][c] || this[p][3][c] < 0){
                    this[p][3][c] = 0;
                } else if(this[p][3][c] > 1000) {
                    this[p][3][c] = 999;
                } else {
                    this[p][3][c] = Math.floor(this[p][3][c]);
                }
            },
            clearSup(v,i) {
                this.form.supportFacilities.splice(i,1);
                this.supportFacilitiesList = this.supportFacilitiesList.filter(item => item.id !== v.id);
                this.postData();
            },
            changeSup(v, i) {
                /**
                 * @Description: 点击设施 
                 * @Attention: 
                 */
                this.supportFacilitiesList = this.supportFacilitiesList.map((item, index) => {
                    if(index === i) {
                        item.checked = !item.checked;
                        if(item.checked){
                            this.form.supportFacilities.push(item)
                        } else {
                            this.form.supportFacilities = this.form.supportFacilities.filter(j => j.id !== item.id);
                        }
                    }
                    return item;
                });
                this.postData();
            },
            clear(){ 
                // 完全重置全部条件
                this.form = {
                    leastGroupRoomQuality: [],
                    perNightPrice: {},
                    star: {
                        value: 0,
                        label: '',
                        checked: false,
                    },
                    supportFacilities: []
                }
                this.priceList.forEach(item => {
                    item.checked = false;
                })
                this.starList.forEach((item, index) => {
                    item.checked = false;
                })
                this.leastGroupRoomQualityList.forEach((item, index) => {
                    item.checked = false;
                })
                this.supportFacilitiesList = this.supportFacilitiesList.map((item, index) => {
                    item.checked = false;
                    return item;
                });
                this.postData();
            },
            getFacilities(){ // 获取查询附加列表
                this.$axios.get(api_hotel.facilities)
                    .then(res=>{
                        if(res.success) {
                            this.supportFacilitiesList = res.data.map(v=>{
                                v.id = v.id*1;
                                v['checked'] = false;
                                return v;
                            });
                        }
                    })
            },
            formatData(){
                // 封装最终请求参数
                let obj = {}
                Object.keys(this.form).map(v => {
                    switch(v) {
                        case 'leastGroupRoomQuality':
                            let arr = [];
                            this.form[v].map( item => {
                                if(item.checked) {
                                    arr.push(item.value)
                                }
                            })
                            obj['leastGroupRoomQuality'] = arr;
                            break;
                        case 'perNightPrice':
                            if(this.form[v].checked) {
                                obj['perNightPrice'] = {
                                    max: this.form[v].max,
                                    min: this.form[v].min,
                                };
                            }
                            break;
                        case 'star':
                            if(this.form[v].checked) {
                                if(this.form[v].checked) {
                                    obj['star'] = this.form[v].value;
                                }
                            }
                            break;
                        case 'supportFacilities':
                            obj['supportFacilities'] = this.form.supportFacilities
                                .filter(item => item.checked)
                                .map(j => {
                                    j = j.id;
                                    return j;
                                })
                    }
                })
                return obj;
            },
            postData() {
                // 每次修改条件都要触发搜索任务
                const data = this.formatData();
                this.$emit('extra', data)
            }
        },
    };
</script>

<style scoped lang="less">
    @deep: ~'>>>';
    .extraCondition{
        padding:0 22px;
        .his.ivu-checkbox-wrapper{
            display: flex;
            align-items: center;
        }
        .custom{
            display: flex;
            p{
                font-size: 14px;
                color:#222;
                cursor: pointer;
            }
            @{deep}.ivu-input-number{
                width:56px;
                height:22px;
                border:1px solid rgba(232, 232, 232, 1);
                border-radius:2px;
                .ivu-input-number-input-wrap,.ivu-input-number-input{
                    height:22px;
                    line-height: 22px;
                }
            }
            .ivu-btn-primary{
                width:44px;
                height:22px;
                padding: 0;
                border-radius:2px;
                display: flex;
                justify-content: center;
                align-items: center;
                margin-left:8px;
            }
        }
        .module{
            .title{
                display: flex;
                justify-content: space-between;
                align-items: center;
                &:hover{
                    div{
                        display: flex;
                    }
                }
                h3{ 
                    font-size:16px;
                    font-weight:600;
                    color:#222;
                    padding: 26px 0;
                }
                div{
                    display: flex;
                    align-items: center;
                    font-size: 14px;
                    color:#787878;
                    display: none;
                    cursor: pointer;
                }
            }
            .ivu-checkbox-wrapper{
                margin-bottom: 14px;
                user-select: none;
                height: 22px;
                line-height: 22px;
            }
        }
    }
</style>
