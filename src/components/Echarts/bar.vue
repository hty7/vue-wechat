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
      default: null
    },
    direction: {
      type: String,
      default: 'x'
    },
    labelRotate: {
      type: String,
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
      let {chart1, direction, labelRotate} = this
      let isDirection = direction === 'x'
      let isLabelRotate = labelRotate
      chart1 = echarts.init(this.$refs.chartDom, 'walden')
      let axis = !this.echartData.axis ? this.echartData.Axis : this.echartData.axis
      let axisData = []
      if (axis) {
        axisData = axis.data
      }
      let showDataZoom = isDirection ? (axisData.length > 8) : false
      let seriesLine = this.echartData.total ? this.echartData.total.map(function (item) {
        return {
          type: 'line',
          name: item.name,
          data: item.data
        }
      }) : []
      let seriesBar = this.echartData.itemData ? this.echartData.itemData.map(function (item) {
        return {
          type: 'bar',
          barMaxWidth: 12,
          label: {
            normal: {
              show: !showDataZoom,
              position: isDirection ? 'top' : 'right'
            }
          },
          name: item.name,
          data: item.data
        }
      }) : []
      let seriesData = seriesLine.concat(seriesBar)
      let legendData = seriesData.map(function (item) {
        return item.name
      })
      let showLegend = legendData.length !== 1
      let gridData = showLegend ? {
        bottom: showDataZoom ? 50 : 30,
        right: 30,
        top: 40
      } : {
        top: 20,
        right: 30,
        bottom: showDataZoom ? 50 : 30
      }
      if (seriesData.length === 0 || seriesData[0].data.length === 0) {
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
            trigger: 'axis',
            axisPointer: {
              type: 'shadow',
              shadowStyle: {
                color: 'rgba(232, 232, 232, 0.54)'
              },
              label: {
                backgroundColor: '#000'
              }
            }
          },
          legend: {
            show: showLegend,
            data: legendData,
            itemWidth: 15,
            itemHeight: 15,
            borderRadius: 15
          },
          grid: gridData,
          dataZoom: showDataZoom ? [{
            type: 'slider',
            height: 10,
            handleIcon: 'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
            start: 1,
            end: 80,
            bottom: 10
          }] : '',
          toolbox: {
            show: false
          },
          xAxis: isDirection ? {
            type: 'category',
            boundaryGap: true,
            axisLabel: isLabelRotate ? {
              rotate: 20,
              fontSize: 10
            } : {},
            data: axisData
          } : {
            type: 'value',
            // scale: true,
            axisLabel: { formatter: '{value}' }
          },
          yAxis: isDirection ? {
            type: 'value',
            // scale: true,
            axisLabel: { formatter: '{value}' }
          } : {
            inverse: true,
            type: 'category',
            boundaryGap: true,
            data: axisData
          },
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
