<!--
 * @Author: magckeyyy
 * @Date: 2019-10-29 20:02:35
 * @Description: 
 * @Attention: 
 -->
<template>
    <div class="error">
        <div class="notFound" v-if="error.statusCode===404">404:页面不存在！</div>
        <div v-else>客户端异常！{{error.message}}</div>
    </div>
</template>

<script>
export default {
     name: 'NuxtError',
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  head() {
    return {
      title: this.message,
      meta: [
        {
          name: 'viewport',
          content: 'width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no'
        }
      ]
    }
  },
  created() {
      console.log(this.error);
  },
  computed: {
    statusCode() {
      return (this.error && this.error.statusCode) || 500
    },
    message() {
      return this.error.message || `<%= messages.client_error %>`
    }
  }
};
</script>

<style scoped lang="less">
.error {
    min-width: 1180px;
    max-width: 1920px;
    min-height: 800px;
    background-color: #fff;
    text-align: center;
    margin: 20px auto !important;
    padding: 40px 20px;
    .notFound {
        font-size: 40px;
        font-weight: bold;
    }
}
</style>
