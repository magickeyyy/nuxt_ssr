<!--
 * @Author: magckeyyy
 * @Date: 2019-12-20 15:03:28
 * @Description: 
 * @Attention: 
 -->
<template>
  <div id="app">
    <NavNo/>
    <nuxt class='main'/>
    <Footer/>
  </div>
</template>
<script>
import '@/assets/style/common.less';
import Footer from "@/components/footer/Footer";
import NavNo from "@/components/nav/NavNo";
export default {
  name: "app",
  components: {
    Footer,
    NavNo
  }
};
</script>

<style scoped>
  .main{
    /* max-width: 1920px; */
    margin: 0 auto;
  }
</style>
