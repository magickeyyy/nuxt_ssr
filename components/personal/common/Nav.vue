<!--
 * @Author: magckeyyy
 * @Date: 2019-11-12 10:14:10
 * @Description: 
 * @Attention: 
 -->
<template>
    <ul class="personalNav">
        <li :class="{active: active===i}" v-for="(v,i) in nav" :key="i" @click="toPage(v,i)">
            {{v.text}}
        </li>
    </ul>
</template>

<script>
    export default {
        props: {
            nav: {
                type: Array,
                required: true
            }
        },
        data() {
            return {
                navList: [],
                active: 0
            };
        },
        created() {
            this.navList = JSON.parse(JSON.stringify(this.nav));
            this.active = this.$route.query.type * 1;
        },
        methods: {
            toPage(v,i) {
                this.active = i;
                this.$router.push(v);
            }
        }
    };
</script>

<style scoped lang="less">
    .personalNav{
        display: flex;
        line-height: 60px;
        background:rgb(249,249,249);
        border:1px solid #e8e8e8;
        border-radius: 6px 6px 0 0;
        box-shadow:0px 1px 5px 0px rgba(0, 0, 0, 0.03);
        overflow: hidden;
        li{
            padding:0 54px;
            font-size: 16px;
            color:#111;
            cursor: pointer;
            border-left: 1px solid transparent;
            border-right: 1px solid transparent;
            user-select: none;
            &.active{
                background-image: linear-gradient(180deg, #EA037C 0, #EA037C 4px, #fff 4px, #fff 100%);
                border-left: 1px solid #e8e8e8;
                border-right: 1px solid #e8e8e8;
            }
        }
        li.active:first-child{
            border-left: none;
        }
    }
</style>
