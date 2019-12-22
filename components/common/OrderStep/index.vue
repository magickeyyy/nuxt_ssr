<!--
 * @Author: magckeyyy
 * @Date: 2019-11-29 15:05:26
 * @Description: 
 * @Attention: 
 -->
<template>
    <components :is="comp" :scene="scene" :step="step"/>
</template>

<script>
    import Hotel from './Hotel'
    export default {
        name: 'HisSteps',
        components: {
            Hotel
        },
        props: {
            module: {
                // 酒店:hotel、玩乐:play、大车:bus
                type: String,
                required: true,
                default: 'hotel'
            },
            scene: {
                // 酒店分团组:team和散客:scattered
                type: String,
                required: true,
                default: 'team'
            },
            step: {
                type: Array,
                required: true
            }
        },
        data() {
            return {

            };
        },
        computed: {
            comp() {
                switch(this.module) {
                    default:
                        return Hotel;
                }
            }
        }
    };
</script>

<style scoped lang="less">

</style>
