<template>
  <div>
    <header class="nav_no">
      <section class="view" :style="{backgroundColor:bc}">
        <div @click="toHome"></div>
        <nav v-if="!isRegister">
          <div @click="level(0)">{{$t('nav_no[0]')}}</div>
          <div @click="level(1)">{{$t('nav_no[1]')}}</div>
          <div @click="level(2)">{{$t('nav_no[2]')}}</div>
          <div @click="level(3)">{{$t('nav_no[3]')}}</div>
          <div @click="level(4)">{{$t('nav_no[4]')}}</div>
          <div @click="level(5)">{{$t('nav_no[5]')}}</div>
          <div @click="changeLang">{{$t('lang')}}</div>
        </nav>
      </section>
    </header>
    <section class="view banner level" v-if="!isRegister">
      <h1 v-html="$t('desc')"></h1>
      <h3 v-html="$t('vice-desc')"></h3>
    </section>
  </div>
</template>

<script>
export default {
  name: "NavNo",
  data() {
    return {
      bc: 'transparent',
    }
  },
  computed: {
    routeName() {
      return $nuxt.$route.name;
    },
    isRegister(){
      const reg = /^\/register/i
      if(reg.test(this.$nuxt.$route.path)){
        return true;
      } else {
        return false;
      }
    }
  },
  methods:{
    changeLang(){ // 语言切换
      if(this.$i18n.locale === 'zh') {
        this.$i18n.locale = 'en';
        this.$store.dispatch('ASYNC_SET_LANG', 'en');
        document.querySelector('#app').className = 'en';
      } else {
        this.$i18n.locale = "zh";
        localStorage.setItem("lang", "zh");
        this.$store.dispatch('ASYNC_SET_LANG', 'zh');
        document.querySelector("#app").className = "zh";
      }
    },
    level(n){ // 锚点
      if(this.routeName==="index"){
        document.querySelectorAll('.level')[n].scrollIntoView({block: "end", behavior: "smooth"});
      } else {
        $nuxt.$router.push("/");
      }
    },
    toHome(){
      this.$nuxt.$router.push("/");
    }
  },
  mounted(){
    window.onscroll = () => { // 导航栏背景色
      let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      if(scrollTop) {
        this.bc = 'rgba(0,0,0,0.8)';
      } else {
        this.bc = 'transparent';
      }
    }
  }
};
</script>

<style scoped lang="less">
@import url('~@/assets/style/variable.less');
  *{
    box-sizing: content-box;
  }
  .nav_no{
    width: 100%;
    position: fixed;
    top:0;
    left:0;
    z-index: 10;
    section{
      box-sizing: border-box;
      height: 78px;
      padding: 0 117px;
      >div{
        height: 100%;
        width: 206px;
        background-image: url("~@/assets/public_img/sign.png");
        background-size: 206px auto;
        background-repeat: no-repeat;
        background-position: 0px center;
      }
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    nav {
      display: flex;
      justify-content: space-between;
      align-items: center;
      div {
        margin-right: 28px;
        font-size: 14px;
        position: relative;
        color: #f2f2f2;
        cursor: pointer;
        padding: 0 6px;
        position: relative;
      }
      div:hover::after{
        content: "";
        display: block;
        width: 100%;
        position: absolute;
        bottom: -14px;
        left: 0;
        z-index: 11;
        border-bottom: 1px solid #ED0287;
      }
    }
  }
  // banner
  .banner{
    height: 850px;
    background-color: #0e2839;
    background-image: url('~@/assets/banner/banner1.png');
    color: #f2f2f2;
    text-align: center;
    .back;
    h1{
      font-size: 48px;
      line-height: 72px;
      padding: 323px 0 26px;
    }
    h3{
      font-size: 30px;
      line-height: 36px;
      font-weight: 200;
    }
  }
  .en{
    .nav_no{
      section{
        >div{
          background-image: url('~@/assets/public_img/sign_en.png');
        }
      }
    }
    .banner{
      font-family: OswaldMedium;
      h1{
          padding-top:274px;
          font-size: 40px;
          letter-spacing: 0px;
          line-height: 50px;
      }
      h3{
          font-family: HelveticaLight;
          font-weight: 200;
          font-size: 26px;
          color: #f4f4f4;
      }
    }
  }
</style>
