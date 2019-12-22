<!--
 * @Author: magckeyyy
 * @Date: 2019-12-20 15:03:28
 * @Description: 
 * @Attention: 
 -->
<template>
    <div id="app">
        <NavRegist />
        <nuxt class='main' />
        <Footer />
    </div>
</template>
<script>
import '@/assets/style/common.less';
import Footer from '@/components/footer/Footer';
import NavRegist from '@/components/nav/NavRegist';
export default {
    name: 'app',
    components: {
        Footer,
        NavRegist,
    },
};
</script>

<style scoped>
.main {
    /* max-width: 1920px; */
    margin: 0 auto;
}
</style>
