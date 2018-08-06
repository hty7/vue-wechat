<template>
  <div class="chart-box">
    <div class="chart-box-header">
      <span class="chart-box-header-t">|</span>
      {{title}}
    </div>
    <div class="chart-box-body">
      <slot name="body"></slot>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: '图表展示'
    }
  }
}
</script>
<style lang="scss" scoped>
.chart-box {
  cursor: pointer;
  margin-bottom: 10px;
  border-radius: 6px 6px 0 0;
  overflow: hidden;
  box-shadow: 0px 2px 6px rgba(204, 204, 204, 0.5);
  &-header {
    text-align: left;
    font-size: 14px;
    padding: 10px 5px;
    border-bottom: 1px #ccc solid;
    color: #000;
    background: rgba(232, 232, 232, 0.34);
    &-t {
      background: #2196F3;
      color: #2196F3;
      margin-right: 10px;
    }
  }
  &-body {
    background: rgba(173, 173, 173, 0.01);
    padding: 5px;
  }
}
</style>
