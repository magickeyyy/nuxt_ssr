<template>
  <div>
    <header class="nav_no">
      <section class="view">
        <div @click="toHome"></div>
      </section>
    </header>
  </div>
</template>

<script>
export default {
  name: "NavRegist",
  methods:{
    toHome(){
      this.$nuxt.$router.push("/");
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
    section{
      box-sizing: border-box;
      height: 78px;
      padding: 0 117px;
      background-color: #000;
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
  }
  .en{
    .nav_no{
      section{
        >div{
          background-image: url('~@/assets/public_img/sign_en.png');
        }
      }
    }
  }
</style>
