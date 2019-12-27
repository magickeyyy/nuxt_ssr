<!--
 * @Author: magckeyyy
 * @Date: 2019-12-09 17:35:14
 * @Description: 
 * @Attention: 
 -->
<template>
    <div class="dropDown">
        <div class="trigger" @click.stop="changeVisible">
            <slot></slot>
        </div>
        <transition name="flex">
            <div classs="dropBox" v-if="currentVisible">
                <slot name="list"></slot>
            </div>
        </transition>
    </div>
</template>

<script>
    export default {
        props: {
            visible: {
                // 是否展示下拉部分
                type: Boolean,
                default: false
            },
            trigger: {
                type: String,
                default: 'hover',
                validator: (v)=>{
                    const arr = [ 'hover', 'click', 'custom', 'contextMenu' ];
                    return arr.find(m => m === v);
                }
            },
            placement: {
                type: String,
                default: 'bottom',
                validator: (v)=>{
                    const arr = [ 'bottom-start', 'bottom-end', 'bottom' ];
                    return arr.find(m => m === v);
                }
            }
        },
        data() {
            return {
                currentVisible: false
            };
        },
        created() {
            this.init();
        },
        methods: {
            init() {
                if(this.trigger === 'custom') {
                    this.currentVisible = this.visible;
                }
            },
            changeVisible() {
                this.currentVisible = !this.currentVisible;
                if(this.trigger === 'custom') {
                    this.$emit('update:visible', this.currentVisible);
                }
            }
        }
    };
</script>

<style scoped lang="less">
    .dropDown{
        position: relative;
    }
    .dropBox{
        height: 300px;
        width: 300px;
        background-color:#ccc;
        box-shadow:0px 6px 16px 0px rgba(0, 0, 0, 0.2);
        border-radius:4px;
        transition: all 3s linear;
        // position: absolute;
        // bottom: 0;
        // left: 0;
    }
    // 过度动效
    // .flex-enter,.flex-leave-to{
    //     display: none;
    // }
    .flex-enter-active,.flex-leave-active{
        transition: all 3s linear;
    }
    .flex-enter-to,.flex-leave{
        height: 300px;
    }
</style>
