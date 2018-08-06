<template>
  <div ref="chartDom" style="width: 100%;height: 360px;"></div>
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
      let titleData = []
      let seriesData = this.echartData.itemData ? this.echartData.itemData.map(function (item, i) {
        var offsetLeft = 35 * (i - 1) + 15 + '%'
        var offsetTop = 80 + '%'
        var titleOffsetL = 35 * (i - 1) + 8 + '%'
        var titleOffsetT = 80 + 15 + '%'
        var radius = '30%'
        if (i === 0) {
          offsetLeft = 50 + '%'
          offsetTop = 30 + '%'
          titleOffsetL = 45 + '%'
          titleOffsetT = 55 + '%'
          radius = '50%'
        } else if (i === 3) {
          titleOffsetL = 35 * (i - 1) + 5 + '%'
        }
        titleData.push({
          text: item.name, x: titleOffsetL, y: titleOffsetT, textStyle: { fontSize: 12 }
        })
        return {
          type: 'pie',
          data: item.data,
          radius: radius,
          center: [offsetLeft, offsetTop],
          label: {
            normal: {
              show: true,
              position: 'inside',
              formatter: '{c}'
            }
          }
        }
      }) : []
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
          title: titleData,
          tooltip: {
            trigger: 'item',
            formatter: ' {b} : {c} ({d}%)'
          },
          legend: {
            show: true,
            orient: 'vertical',
            left: '10%',
            top: '25%',
            itemWidth: 15,
            itemHeight: 15,
            borderRadius: 15
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
