<!--
 * @Author: magckeyyy
 * @Date: 2019-11-11 11:44:34
 * @Description: 
 * @Attention: 
 -->

// 1-推荐权重值降序，2-销量降序，3-发布创建时间升序，4-最低价升序，5-最低价降序,6-评分值降序。缺省为1
<template>
    <ul class="listSort" unselectable="on" style="-moz-user-select:none;" onselectstart="return false;">
        <li v-for="(v,i) in list" :key="i" :class="{'active':active(i,sort)}">
            <p @click="changeSort(i)">{{v}}</p>
            <div v-if="i===3" @click="changeSort(i)">
                <svg class="icon" aria-hidden="true" v-show="sort===5">
                    <use xlink:href="#iconjiagepaixu_gao" />
                </svg>
                <svg class="icon" aria-hidden="true" v-show="sort===4">
                    <use xlink:href="#iconjiagepaixu_di" />
                </svg>
                <svg class="icon" aria-hidden="true" v-show="sort!==4&&sort!==5">
                    <use xlink:href="#iconjiagepaixu_gao-copy" />
                </svg>
            </div>
        </li>
    </ul>
</template>

<script>
    export default {
        name:'Sort',
        props: {
            sort: {
                type: Number,
                required: true,
            },
        },
        data() {
            return {
                list: ['推荐','销量','最新','价格','好评'],
            };
        },
        methods: {
            active(index,type) {
                if(index===3&&(type===4||type===5)) {
                    return true
                } else if(index === 4&&type===6){
                    return true
                } else if(type===index+1&&index<3) {
                    return true
                } else {
                    return false
                }
            },
            changeSort(index) {
                let sort;
                if(index === 3) {
                    if(this.sort !== 4 && this.sort !== 5) {
                        sort =4;
                    } else {
                        sort = (this.sort===4?5:4);
                    }
                } else if(index === 4){
                    sort = 6;
                } else {
                    sort = index + 1;
                }
                this.$emit('changeSort', sort)
            }
        }
    };
</script>

<style scoped lang="less">
    .listSort{
        height: 56px;
        margin-top:16px;
        background-color: #fff;
        border:1px solid rgba(234, 234, 234, 1);
        border-radius:2px;
        display: flex;
        align-items: center;
        li{
            font-size: 12px;
            line-height: 1;
            display: flex;
            align-items: center;
            padding: 0 20px;
            border-right:  1px solid #222;
            &:last-child{
                border:none;
            }
            &.active{
                color:#EA037C;
            }
            p{
                cursor: pointer;
            }
            svg{
                cursor: pointer;
                width: 16px;
                height: 16px;
            }
        }
    }
</style>
