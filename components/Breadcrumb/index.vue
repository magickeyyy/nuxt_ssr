<template>
    <div class='blist'>
        <Breadcrumb>
            <BreadcrumbItem to="/">Home</BreadcrumbItem>
            <BreadcrumbItem to="/components/breadcrumb">Components</BreadcrumbItem>
            <BreadcrumbItem>Breadcrumb</BreadcrumbItem>
        </Breadcrumb>
    </div>
</template>

<script>
export default {
    name: 'Breadcrumbs',
    data() {
        return {
            blist: ''
        };
    },
    mounted() {
        this.blist = this.$nuxt.$route.path.split('/').filter(_=>_);
    },
};
</script>

<style scoped lang="less">
.blist a{
}
</style>
