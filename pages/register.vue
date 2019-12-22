<!--
 * @Author: magckeyyy
 * @Date: 2019-10-28 16:31:16
 * @Description: 
 * @Attention: 
 -->
<template>
    <div class="pageContent register">
        <div class="steps">
            <HisSteps :current="{success: true,index: step}" />
        </div>
        <div class="box">
            <nuxt-child></nuxt-child>
        </div>
    </div>
</template>

<script>
import HisSteps from '~/components/HisSteps';
import { mapState } from 'vuex'
export default {
    name: 'regist',
    layout: 'regist',
    components: {
        HisSteps,
    },
    data() {
        return {};
    },
    computed: {
        ...mapState('register', [ 'step' ])
    },
};
</script>

<style scoped lang="less">
.register {
    background-color: #f6f5f6;
    .steps {
        margin: 60px auto 78px;
    }
    .box {
        width: 1180px;
        margin: 0 auto;
        background-color: #fff;
    }
}
</style>
