// 有个问题：客户端才能获取sessionStorage,search页是mounted才读取数据再传递启动参数给搜索组件，再传给日历组件
// 有个坑：new Date(2019,9,1),得到的是2019-10-1，new Date(2019,9,0).getDate()得到的是9月的总天数
// 注意每个时间list的事件都是当天0:00:000,new Date().valueOf()在你工作的时候肯定比它大
// new Date(2019,2,1)new Date(2019,2)得到的是2019-2-1 0:00:000,new Date('2019/2/1')或new Date('2019-2-1')或new Date('2019-02-1')得到的是2019-2-1 8:00:000
<template>
    <Dropdown class="hisCalendar" @on-visible-change="changeVisible">
        <div class="input">
            <p><span class="value" v-if="all.timespan">{{all.start | mixin_f_formatDate}}</span><span class="placeholder" v-else>入住日期</span></p>
            <div>
                <div v-if="!all.timespan" class="placeholder">—</div>
                <div v-else class="len">{{all.timespan.length-1}}晚</div>
            </div>
            <p><span class="value" v-if="all.timespan">{{all.end | mixin_f_formatDate}}</span><span class="placeholder" v-else>入住日期</span></p>
        </div>
        <DropdownMenu slot="list">
            <div class="panel">
                <div class="box">
                    <div class="title">
                        <div class="subtract" @click="subtract('start')"></div>
                        <p>{{startYM}}</p>
                        <div class="add" @click="add('start')"></div>
                    </div>
                    <ul class="week">
                        <li>一</li>
                        <li>二</li>
                        <li>三</li>
                        <li>四</li>
                        <li>五</li>
                        <li>六</li>
                        <li>日</li>
                    </ul>
                    <ul class="date">
                        <li v-for="(v,i) in startList" :key="i"
                            :class="[{'active':activeNode(v)},{'middle':middleNode(v)},endpoint(v),disabled(v)]"
                            @click="active('start',v,i)">
                            <p>{{v | getDate}}</p>
                        </li>
                    </ul>
                </div>
                <div class="box">
                    <div class="title">
                        <div class="subtract" @click="subtract('end')"></div>
                        <p>{{endYM}}</p>
                        <div class="add" @click="add('end')"></div>
                    </div>
                    <ul class="week">
                        <li>一</li>
                        <li>二</li>
                        <li>三</li>
                        <li>四</li>
                        <li>五</li>
                        <li>六</li>
                        <li>日</li>
                    </ul>
                    <ul class="date">
                        <li v-for="(v,i) in endList" :key="i" @click="active('end',v,i)"
                            :class="[{'active':activeNode(v)},{'middle':middleNode(v)},endpoint(v),disabled(v)]">
                            <p>{{v | getDate}}</p>
                        </li>
                    </ul>
                </div>
            </div>
        </DropdownMenu>
    </Dropdown>
</template>

<script>
    export default {
        data() {
            return {
                startDef: null, //  时间起点,当月1号
                endDef: null, // 时间截点,当月1号
                timeNode: [], // 封装的起点结束时间。{i: 头尾所属月份list中的index，type:'start'/'end'左边或者右边面板，v:头尾时间Date,value:Date.valueOf()}
                timeNodeCopy:[], // 只选一个时，不操作timeNode
                all: {}
            };
        },
        props: {
            result: Object,
            start: String,
            end: String,
            disStart: String, // xxxx-xx-xx此时间前禁用
            disEnd:String // xxxx-xx-xx此时间后禁用，没使用场景
        },
        filters: {
            getDate(v) { // 显示当天日期
                if (!v) return '';
                return v.getDate();
            }
        },
        computed: {
            startYM() {
                // 开始时间年月
                return this.title('start');
            },
            endYM() {
                return this.title('end');
            },
            startList() {
                // 开始时间当月日期list
                return this.daysList(this.info('start'));
            },
            endList() {
                return this.daysList(this.info('end'));
            },
            startNode() {
                let len = this.timeNodeCopy.length;
                if (!len) return {};
                if (len === 1) return { ...this.timeNodeCopy[0] };
                if (len === 2) {
                    let min = Math.min(this.timeNodeCopy[0].value, this.timeNodeCopy[1].value);
                    let start = this.timeNodeCopy.find(v => v.value === min);
                    return { ...start };
                }
            },
            endNode() {
                let len = this.timeNodeCopy.length;
                if (len < 2) return {};
                if (len === 2) {
                    let max = Math.max(this.timeNodeCopy[0].value, this.timeNodeCopy[1].value);
                    let end = this.timeNodeCopy.find(v => v.value === max);
                    return { ...end };
                }
            }
        },
        methods: {
            title(type) {
                // 当天年月
                let y = this[type + 'Def'].getFullYear();
                let m = this[type + 'Def'].getMonth() + 1;
                return `${y}年${m}月`;
            },
            info(type) {
                let y = this[type + 'Def'].getFullYear();
                let m = this[type + 'Def'].getMonth();
                return {
                    ym: y + '/' + (m + 1) + '/', // 用于daysList计算
                    days: new Date(y, m+1, 0).getDate(), // 当月总天数
                    weekDayth: new Date(y,m,1).getDay() || 7, // 当月一号周几，周末默认0改为7
                };
            },
            daysList({ ym, days, weekDayth }) {
                // 根据总天数和1号周几返回一个数组：前后不足的为undefine,中间是正常日期
                let weeks = Math.ceil((days - (8 - weekDayth)) / 7) + 1; // 当月总周数
                let arr = Array.from({ length: days }).map((v, i) => {
                    v = i + 1;
                    v = new Date(ym + v);
                    return v;
                });
                let head = weekDayth - 1; // 头部填充数量
                let trail = weeks * 7 - days - head; // 尾部填充数量
                arr.unshift(...Array.from({ length: head }));
                arr.push(...Array.from({ length: trail }));
                return arr;
            },
            setDef() {
                // 初始化起止时间,如果传了起止时间就以传入的初始化，否则是当月和后一个月
                if(this.start&&this.end){
                    let start = this.start.split('-').map(v=>v*1); // [xxxx,x,x]
                    let end = this.end.split('-').map(v=>v*1);
                    this.startDef = new Date(start[0],start[1]-1);  // 不传号数得当月1号
                    let sdays = new Date(start[0],start[1],0).getDate(); // 起点时间当月最后一天
                    let startLastDay = new Date(start[0],start[1]-1,sdays);// 起点时间月末日期
                    if(this.end.valueOf()>=startLastDay.valueOf()){ // 如果截止时间比起点时间月末日期还大，就直接以传入的截止时间月份做右边list
                        this.endDef = new Date(end[0],end[1]-1);
                    } else {
                        this.endDef = new Date(end[0],end[1]); // 实际上起止时间同月，那就下个月做右边list
                    }
                    let diff = ((new Date(this.end)).valueOf() - (new Date(this.start)).valueOf()) / (1000*60*60*24)+1;
                    let timespan = [];
                    for(let i=0;i<diff;i++){
                        timespan[i] = new Date(new Date(start[0],start[1]-1,start[2]).valueOf()+i*1000*60*60*24)
                    }
                    this.all = {
                        start: new Date(start[0],start[1]-1,start[2]),
                        end: new Date(end[0],end[1]-1,end[2]),
                        timespan
                    }
                } else {
                    let t = new Date();
                    let y = t.getFullYear();
                    let m = t.getMonth();
                    let d = t.getDate();
                    this.startDef = new Date(y, m);
                    this.endDef = new Date(y, m + 1);
                    this.all = {
                        start: new Date(y,m,d),
                        end: new Date(y,m,d+1),
                        timespan:[t,new Date(y,m,d+1)]
                    }
                }
            },
            setTimeNode(){ // 设置默认选中时间节点
                let start = this.all.start;
                let end = this.all.end;
                let sy = start.getFullYear();
                let sm = start.getMonth();
                let ey = end.getFullYear();
                let em = end.getMonth();
                function ps(arr){
                    return arr.map(v=>{
                        if(v) return v.valueOf();
                        return v;
                    })
                }
                let m = ps(this.startList),y = ps(this.endList);
                let si = m.indexOf(start.valueOf());
                let ei = m.indexOf(end.valueOf());
                this.timeNode = [{i:si,type:'start',v:start,value:start.valueOf()},{i:ei,type:'start',v:end,value:end.valueOf()}];
                this.timeNodeCopy = [{i:si,type:'start',v:start,value:start.valueOf()},{i:ei,type:'start',v:end,value:end.valueOf()}];
                if(ei<0){
                    ei = y.indexOf(end.valueOf());
                    this.timeNode[1].i = ei;
                    this.timeNodeCopy[1].i = ei;
                    this.timeNode[1].type= 'end';
                    this.timeNodeCopy[1].type= 'end';
                }
            },
            nd(date, n) {
                // 计算日期,加减n个月
                let y = date.getFullYear();
                let m = date.getMonth();
                return new Date(y, m + n);
            },
            subtract(type) {
                // 减一个月
                let y = this[type + 'Def'].getFullYear();
                let m = this[type + 'Def'].getMonth();
                let n = new Date(new Date().getFullYear(), new Date().getMonth()); //本月1号时间
                let n1 = new Date(new Date().getFullYear(), new Date().getMonth() + 1); //本月后一个月1号时间
                if (type === 'start' && this.startDef.valueOf() === n.valueOf()) return; // 左边不能选择当前年月前的时间】
                if (type === 'end' && this.endDef.valueOf() === n1.valueOf()) return; // 如果右边是当前时间后一个月，不减少。
                if (type === 'end' && this.startDef.valueOf() === this.nd(this.endDef, -1).valueOf()) {
                    // 保证右边必左边大一个月
                    this.startDef = this.nd(this[type + 'Def'], -2);
                }
                this[type + 'Def'] = this.nd(this[type + 'Def'], -1);
            },
            add(type) {
                // 加一个月
                let y = this[type + 'Def'].getFullYear();
                let m = this[type + 'Def'].getMonth();
                if (type === 'start' && this.endDef.valueOf() === this.nd(this.startDef, 1).valueOf()) {
                    // 保证右边至少比左边大一个月
                    this.endDef = this.nd(this.startDef, 2);
                }
                this[type + 'Def'] = this.nd(this[type + 'Def'], 1);
            },
            active(type, v, i) {
                // 根据type选中起止日期,type:'start'/'end',v:选中的时间，i：选中的序号
                let today = new Date().valueOf();
                let disStart;
                if(this.disStart){ // 指定禁止时间前
                    let arr = this.disStart.split('-');
                    disStart = new Date(arr[0],arr[1],arr[2]).valueOf();
                } else { // 当天前
                    let t = new Date();
                    let y = t.getFullYear();
                    let m = t.getMonth();
                    let d = t.getDate();
                    disStart = new Date(y,m,d).valueOf();
                }
                if (!v || v.valueOf()<disStart) return; // 空白处
                let timespan = v.valueOf();
                let obj = { type, v, i, value: timespan };
                let value = [];
                let len = this.timeNodeCopy.length;
                if (len > 0) {
                    if (this.timeNodeCopy.find(item => item.value === timespan)) return; // 点击的是已选时间
                }
                if(len===0||len===2){
                    this.timeNodeCopy = [obj]
                } else if (len===1){
                    this.timeNodeCopy.push(obj);
                    this.timeNode=JSON.parse(JSON.stringify(this.timeNodeCopy));
                }
                if (this.timeNodeCopy.length === 2) {
                    let tlen = (this.endNode.value - this.startNode.value) / (1000 * 60 * 60 * 24) + 1;
                    let ty = this.startNode.v.getFullYear();
                    let tm = this.startNode.v.getMonth();
                    let td = this.startNode.v.getDate();
                    let arr = [];
                    for (let i = 0; i < tlen; i++) {
                        arr[i] = new Date(ty, tm, td + i);
                    }
                    this.all = {
                        start: this.startNode.v,
                        end: this.endNode.v,
                        timespan: arr,
                    };
                    this.$emit('update:result', this.all);
                }
                if(this.all.timespan){
                    this.$emit('update:start',this.mixin_m_formatDate(this.all.start));
                    this.$emit('update:end',this.mixin_m_formatDate(this.all.end));
                }
            },
            activeNode(v) {
                // 头尾时间点。选择的起点终点可能是两边各一个或者一遍两个，所以必须全部属性对比
                if (!this.startNode.value || !v) return false; // 必须有起点
                if (v.valueOf() === this.startNode.value || (this.endNode.value && v.valueOf() === this.endNode.value)) return true; // 
                return false;
            },
            middleNode(v) {
                // 头尾中间的时间点加激活类名
                if (this.timeNode.length < 2 || !v) return false;
                if (v.valueOf() > this.startNode.value && v.valueOf() < this.endNode.value) return true;
                return false;
            },
            endpoint(v) {
                if (!this.all || !v) return;
                if (v.valueOf() === this.startNode.value&&this.all.timespan&&this.timeNodeCopy.length===2) return 'start';
                if (v.valueOf() === this.endNode.value&&this.timeNodeCopy.length===2) return 'end';
            },
            disabled(v){
                if(!v) return;
                let n;
                if(this.disStart){
                    let arr = this.disStart.split('-');
                    n = new Date(arr[0],arr[1],arr[2]).valueOf();
                } else {
                    let t = new Date();
                    let y = t.getFullYear();
                    let m = t.getMonth();
                    let d = t.getDate();
                    n = new Date(y,m,d).valueOf();// 这才是xxxx/x/x 0：00:000
                }
                if(v.valueOf()<n) {
                    return 'disabled'
                };
            },
            changeVisible(visible){
                if(!visible&&this.timeNodeCopy.length<2){
                    this.timeNodeCopy = JSON.parse(JSON.stringify(this.timeNode))
                }
            }
        },
        created() {
            this.setDef(); // 1568390400000-1568131200000
            this.setTimeNode();
        }
    };
</script>

<style scoped lang="less">
    .input {
        width: 360px;
        height: 54px;
        background: #fff;
        border: 1px solid #cdcdcd;
        border-radius: 4px;
        padding-left: 40px;
        display: flex;
        align-items: center;
        justify-content: space-around;
        background: url('~assets/icon/icon_calendar_def.png') no-repeat 13px center;
        >p{
            font-size: 16px;
            .placeholder{
                color:#ACACAC;
            }
            .value{
                color:#222;
            }
        }
        >div{
            .len{
                height: 20px;
                font-size:12px;
                line-height: 1;
                color:#fff;
                background-color: #E9047B;
                padding: 0 8px;
                border-radius: 10px;
                display: flex;
                justify-content: center;
                align-items: center;
            }
        }
    }
    .hisCalendar:hover .input{
        border-bottom-color: #ea037c !important;
        box-shadow: 0 1px #ea037c;
        background-image: url('~assets/icon/icon_calendar_active.png')
    }
    /deep/.ivu-dropdown{
       .ivu-select-dropdown{
            padding: 0;
            margin-top: 10px;
        } 
    }
    /deep/.ivu-select-dropdown{
            padding: 0;
            margin-top: 10px;
            box-shadow:0px 6px 16px 0px rgba(0, 0, 0, 0.2);
        }
    .panel {
        width: 696px;
        background-color: #fff;
        box-shadow: 0px 6px 16px 0px rgba(0, 0, 0, 0.2);
        border-radius: 4px;
        display: flex;
        justify-content: space-between;
        padding: 26px 18px;
        .box {
            width: 310px;
            .title {
                display: flex;
                justify-content: space-between;
                color: #222;
                font-size: 18px;
                line-height: 30px;
                font-weight: bold;
                div {
                    background-position: center;
                    background-repeat: no-repeat;
                    background-size: 14px;
                    height: 30px;
                    width: 30px;
                    cursor: pointer;
                }
                .subtract {
                    background-image: url('~assets/icon/icon_toleft_def.png');
                }
                .add {
                    background-image: url('~assets/icon/icon_toright_def.png');
                }
                .subtract:hover {
                    background-image: url('~assets/icon/icon_toleft_active.png');
                }
                .add:hover {
                    background-image: url('~assets/icon/icon_toright_active.png');
                }
            }
            .week {
                display: flex;
                li {
                    width: 42px;
                    line-height: 28px;
                    color: #999999;
                    font-size: 14px;
                    text-align: center;
                }
            }
            .date {
                display: flex;
                flex-wrap: wrap;
                li {
                    width: 42px;
                    height: 42px;
                    margin-bottom: 4px;
                    position: relative;
                    p {
                        line-height: 42px;
                        width: 42px;
                        text-align: center;
                        border-radius: 50%;
                        cursor: pointer;
                        position: absolute;
                        z-index: 10;
                    }
                }
                .disabled p{
                    color: #DEDEDE;
                }
                .active p,li:not(.disabled):hover p {
                    background-color: #e9047b;
                    color: #fff;
                }
                .middle{
                    background-color: rgb(251, 206, 230);
                }
                .active.start::after {
                    content: '';
                    display: block;
                    width: 21px;
                    height: 42px;
                    background-color: rgb(251, 206, 230);
                    position: absolute;
                    top: 0;
                    right: 0;
                }
                .active.end::before {
                    content: '';
                    display: block;
                    width: 21px;
                    height: 42px;
                    background-color: rgb(251, 206, 230);
                    position: absolute;
                    top: 0;
                    left: 0;
                }
            }
        }
    }
</style>
