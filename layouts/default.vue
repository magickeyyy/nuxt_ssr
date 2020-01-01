<template>
    <div id="app">
        <NavLogined/>
        <nuxt class='main' />
        <Footer />
    </div>
</template>
<script>
import Footer from '@/components/footer/Footer';
import NavLogined from '@/components/nav/NavLogined';
import { mapMutations } from 'vuex'
export default {
    components: {
        Footer,
        NavLogined,
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
