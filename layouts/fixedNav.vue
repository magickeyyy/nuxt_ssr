<template>
    <div id="app">
        <NavLogined :fixed="true" />
        <nuxt class='main' />
        <Footer />
    </div>
</template>
<script>
import '@/assets/style/common.less';
import Footer from '@/components/footer/Footer';
import NavLogined from '@/components/nav/NavLogined';
export default {
    components: {
        Footer,
        NavLogined,
    },
};
</script>

<style scoped>
</style>
