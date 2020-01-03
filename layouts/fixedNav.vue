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
import { mapMutations } from 'vuex'
export default {
    components: {
        Footer,
        NavLogined,
    },
    mounted() {
        this.SET_SS(12)
    },
    methods: {
        ...mapMutations(['SET_SS']),
    }
};
</script>

<style scoped>
</style>
