<template>
  <div ref="chartDom" style="width: 100%;height: 300px;"></div>
</template>
<script>
import echarts from 'echarts'
export default {
  props: {
    echartData: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      chart1: null,
      debounceTdentify: 0
    }
  },
  watch: {
    echartData (newValue, oldValue) {
      if (JSON.stringify(newValue) !== '{}') {
        this.drawChart()
      }
    }
  },
  // mounted () {
  //   window.addEventListener('resize', this.resizeFu, false)
  // },
  // beforeRouteLeave (to, from, next) {
  //   window.removeEventListener('resize', this.resizeFu, false)
  //   next()
  // },
  methods: {
    drawChart () {
      const {echartData} = this
      let {chart1} = this
      chart1 = echarts.init(this.$refs.chartDom, 'vintage')
      chart1.setOption(Object.assign({
        tooltip: {},
        legend: {}
      }, echartData))
    },
    resizeFu (el) {
      // 重绘，防抖500ms延迟
      this.debounceTdentify && clearTimeout(this.debounceTdentify)
      this.debounceTdentify = setTimeout(() => {
        this.chart1.resize()
      }, 500)
    }
  },
  computed: {
  }
}
</script>
<style lang="scss" scoped>
</style>
