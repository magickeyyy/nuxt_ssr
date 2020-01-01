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
    beforeCreate() {
        console.log('before-layout',process.server, process.client)
    },
    created() {
        console.log('ed-layout',process.server, process.client)
    },   
    mounted() {
        let token = sessionStorage.getItem('token');
        if(token) {
            this.SET_LOGIN({ logined: true, token, userInfo: {}});
        }
    },
    methods: {
        ...mapMutations('login', ['SET_LOGIN']),
    }
};
</script>

<style scoped>
</style>
