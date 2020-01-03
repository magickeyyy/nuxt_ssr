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
};
</script>

<style scoped>
</style>
