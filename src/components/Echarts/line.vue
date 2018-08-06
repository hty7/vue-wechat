<template>
  <div ref="chartDom" style="width: 100%;height: 260px;"></div>
</template>
<script>
import echarts from 'echarts'
import '../../../static/js/walden'
export default {
  props: {
    echartData: {
      type: Object,
      default: function () {
        return null
      }
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
      if (newValue !== null) {
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
      let {chart1} = this
      chart1 = echarts.init(this.$refs.chartDom, 'walden')
      let axisData = !this.echartData.axis ? this.echartData.Axis.data : this.echartData.axis.data
      let showDataZoom = false
      let seriesData = this.echartData.itemData ? this.echartData.itemData.map(function (item) {
        return {
          type: 'line',
          label: {
            normal: {
              show: true,
              position: 'top'
            }
          },
          name: item.name,
          data: item.data
        }
      }) : []
      let legendData = seriesData.map(function (item) {
        return item.name
      })
      let showLegend = legendData.length !== 1
      let gridData = showLegend ? {
        bottom: showDataZoom ? 50 : 40,
        right: 30,
        top: 50
      } : {
        top: 30,
        right: 30,
        bottom: showDataZoom ? 50 : 40
      }
      if (seriesData.length === 0) {
        chart1.setOption({
          backgroundColor: 'rgba(232, 232, 232, 0.34)',
          title: {
            text: '暂无数据',
            left: 'center',
            top: 'middle'
          }
        })
      } else {
        chart1.setOption({
          tooltip: {
            trigger: 'axis'
          },
          grid: gridData,
          legend: {
            show: showLegend,
            data: legendData,
            itemWidth: 15,
            itemHeight: 15,
            borderRadius: 15
          },
          toolbox: {
            show: false
          },
          xAxis: {type: 'category', boundaryGap: false, data: axisData},
          yAxis: {type: 'value', axisLabel: {formatter: '{value}'}},
          series: seriesData
        })
      }
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
