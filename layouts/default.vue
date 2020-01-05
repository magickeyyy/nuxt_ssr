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
export default {
    components: {
        Footer,
        NavLogined,
    },
};
</script>

<style scoped>
</style>
