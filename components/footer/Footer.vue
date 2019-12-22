<template>
    <footer>
		    <div>Copyright ©2019 yohitrip.com All Rights Reserved</div>
        <p>{{$t('home.footer[1]')}}</p>
        <img src="~/assets/icon/icon_logo.png" alt="">
        <img src="~/assets/icon/icon_hai.png" alt="">
	</footer>
</template>

<script>
export default {
    name: 'Footer',
}
</script>

<style lang="less" scoped>
    footer{
        // background-color: #f2f2f2;
        background-color: #fff;
        text-align: center;
        position: relative;
        padding: 40px;
        font-size: 12px;
        line-height: 24px;
        letter-spacing: 0px;
        color: #8f8f8f;
        min-width: 1280px;
        width:100%;
        img{
            position: absolute;
            display: block;
            width: 60px;
            height: 60px;
            top: -30px;
            left: 49%;
            z-index: 1000;
        }
        img:first-of-type{
            margin-left: -77px;
        }
        img:last-of-type{
            margin-left: 47px;
        }
    }
</style>

