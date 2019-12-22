<template>
    <div id="map">
        <GoogleMap/>
    </div>
</template>

<script>
    import GoogleMap from '~/components/GoogleMap'
    export default {
        components:{
            GoogleMap
        },
        data() {
            return {

            };
        },
    };
</script>

<style scoped lang="less">
    #map{
        margin: 20px auto;
    }
</style>
