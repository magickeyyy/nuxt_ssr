<template>
    <div id="app">
        <NavLogined/>
        <nuxt class='main' />
    </div>
</template>
<script>
import '@/assets/style/common.less';
import NavLogined from '@/components/nav/NavLogined';
export default {
    components: {
        NavLogined,
    },
};
</script>

<style scoped>

</style>
