<template>
  <div ref="chartDom" style="width: 100%;height: 260px;"></div>
</template>
<script>
import echarts from 'echarts'
import 'echarts/theme/macarons'
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
  methods: {
    drawChart () {
      let {chart1} = this
      chart1 = echarts.init(this.$refs.chartDom, 'walden')
      let angleAxisData = this.echartData.Axis.data
      let legendData = this.echartData.itemData.map(function (item) {
        return item.name
      })
      let showLegend = legendData.length !== 1
      let seriesData = this.echartData.itemData.map(function (item) {
        return {
          type: 'bar',
          data: item.data,
          coordinateSystem: 'polar',
          name: item.name,
          stack: 'a',
          itemStyle: {
            normal: {
              borderWidth: 2,
              borderColor: '#ffffff'
            },
            emphasis: {
              borderWidth: 0,
              shadowBlur: 5,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      })
      chart1.setOption({
        tooltip: {
          trigger: 'item'
        },
        toolbox: {
          show: false
        },
        legend: {
          show: showLegend,
          data: legendData,
          orient: 'vertical',
          left: '5%',
          top: '25%',
          itemWidth: 15,
          itemHeight: 15,
          borderRadius: 15
        },
        radiusAxis: {
          axisLine: {
            show: true
          },
          splitLine: {
            show: true
          },
          splitArea: {
            show: true
          }
        },
        polar: {},
        angleAxis: {
          type: 'category',
          data: angleAxisData,
          axisLine: {
            show: true
          },
          splitLine: {
            show: true
          }
        },
        series: seriesData
      })
      chart1.on('click', (event) => {
        if (event.seriesType === 'bar') this.$emit('setMigrate', event.data)
      })
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
