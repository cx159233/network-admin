<template>
  <div class="tips">
    已选择<span> {{ chosedNum }} </span>项
  </div>
</template>
<script>
export default {
  props: {
    chosedNum: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {};
  },
};
</script>
<style scoped lang="scss">
.tips {
  font-size: 12px;
  height: 32px;
  line-height: 32px;
  border-radius: 3px;
  padding: 0 10px;
  color:#687080;
  display: inline-block;
  // .el-icon-info {
  //   color: #1890ff;
  //   margin-right: 4px;
  //   font-size: 14px;
  // }
  span {
    // color: #1890ff;
    margin: 0 2px;
  }
}
</style>
