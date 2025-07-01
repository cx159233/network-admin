<!--
 * @Author: error: git config user.name && git config user.email & please set dead value or install git
 * @Date: 2022-04-29 14:30:11
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @LastEditTime: 2022-07-15 14:23:42
 * @FilePath: \uuc-services-front\src\views\cmdb\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="iframe_container" style="height: calc(100vh - 50px); width: 100%">
    <iframe
      ref="myIframe"
      class="cmdb_iframe"
      :src="url"
      frameborder="0"
      scrolling="auto"
      allowfullscreen="true"
    ></iframe>
  </div>
</template>
<script>

  export default {
    name: "CommonIframe",
    data() {
      return {
        url: this.$route.query.url,
      };
    },
    created() {
    },

    methods: {
    }
  };
</script>
<style scoped>
  .cmdb_iframe {
    height: 100%;
    width: 100%;
  }
</style>
