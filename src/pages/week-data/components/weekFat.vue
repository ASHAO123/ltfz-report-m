<template>
  <div class="report_item_wrapper">
    <div class="report_header">
      <div class="item_title">
        <i class="iconfont">&#xe653;</i>
        <span>{{$t('title.pilao')}}</span>
        <span class="srart_end_time"  v-show="echartShows">{{time}}</span>
      </div>
      <div class="item_warn">
      </div>
    </div>
    <div class="echarts_wrapper" v-show="echartShows">
      <div class="draw_echarts">
        <keep-alive>
          <div class="chart" :id="id"></div>
        </keep-alive>
      </div>
      <p class="chartTip">*{{$t('tag.shipin')}} </p>
      <!-- 健康报告 -->
      <div class="read part-top">
        <div class="header">
          <i class="iconfont">&#xe61d;</i>
          <h2>{{$t('title.secondaryTitle.pilaoReport')}}</h2>
        </div>
        <div class="content">
          <div :class="['article',contentShow ? 'show' : 'hidden']" >
            <p>{{content}}</p>
          </div>
          <div :class="['mask',contentShow ? 'show' : 'hidden']" @click="contentToggle">
            <i class="iconfont" v-show="!contentShow">&#xe632;</i>
            <i class="iconfont" v-show="contentShow">&#xe633;</i>
          </div>
        </div>
      </div>
    </div>
    <div class="nodata" v-show="!echartShows">{{$t('tag.fat.noweek')}}</div>
  </div>
</template>
<script>
export default {
  name: 'weekFat',
  props: {
    sendTime: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      emit: {},
      echartShows: true,
      id: 'weekFat',
      content: '',
      time: '',
      contentShow: false,
      // 图表
      chart_x_time: [],
      weekValue: [],
      statec:''
    }
  },
  mounted () {
    var echartsDom = document.getElementById(this.id)
    var contentHeight = window.getComputedStyle(echartsDom).height
    var contentWidth = window.getComputedStyle(echartsDom).width
    echartsDom.style.height = contentHeight
    echartsDom.style.width = contentWidth
  },
  methods: {
    getEchartsDataInfo () {
      let postData = {
        'week': this.sendTime,
        'userid': this.$route.params.userID,
        'friendid': this.$route.params.friendID,
        'token': this.$route.params.token
      }
      this.$axios.getWeekweary(postData)
        .then(this.getEchartsDataInfoSucc)
    },
    getEchartsDataInfoSucc (res) {
      this.emit.code = res.code
      // this.emit.time = this.sendTime
      this.$emit('fatcode', this.emit)

      if (res.code === 0 && res.data) {
        const getData = res.data
        this.echartShows = true
        let startTime = getData.StartTime
        let endTime = getData.EndTime
        this.time = '(' + startTime + '-' + endTime + ')'
        // 图表
        this.chart_x_time = []
        this.weekValue = []
        this.chart_x_time = getData.date
        this.weekValue = getData.value

        this.statec=getData.statec
        this.content =this.statec==="zhengchang"?(this.$t('fat.week.'+this.statec).d1+getData.rate+this.$t('fat.week.'+this.statec).d2):this.$t('fat.week.'+this.statec)

        this.init()
        this.setOption(this.options)
      } else {
        this.echartShows = false
      }
    },
    init () {
      let _this = this
      this.chart = this.$echarts.init(document.getElementById(this.id))
      window.addEventListener('resize', function () {
        _this.chart && _this.chart.resize()
      })
    },
    setOption (option) {
      if (!this.chart) {
        return
      }
      this.chart.setOption(option)
    },
    contentToggle () {
      this.contentShow = !this.contentShow
    },
    showTip () {
      this.tipShow = true
    },
    dispose () {
      if (!this.chart) {
        return
      }
      this.chart.dispose()
      this.chart = null
    }
  },
  beforeDestroy () {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  computed: {
    options () {
      return {
        grid: {
          containLabel: true,
          top: 20,
          bottom: 10,
          left: 0,
          right: 0
        },
        xAxis: {
          type: 'category',
          // 坐标轴轴线
          axisLine: {
            lineStyle: {
              color: '#54657e',
              width: 1 // 这里是为了突出显示加上的，可以去掉
            }
          },
          data: this.chart_x_time
        },
        yAxis: {
          type: 'value',
          min: 40,
          splitLine: {
            show: false
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#54657e'
            }
          },
          axisTick: {
            show: false
          }
        },
        dataZoom: [{
          type: 'inside',
          disabled: true,
          start: 0,
          end: 100
        }],
        tooltip: {
          trigger: 'axis',
          // formatter: function (params) {
          //   if (params[0].data == null) {
          //     return params[0].axisValue + '<br>' + '未检测到心率值'
          //   } else {
          //     return params[0].axisValue + '<br/>' + '静息心率：' + params[0].value
          //   }
          // }
        },
        series: [
          {
            name: this.$t('components.jingxi'),
            type: 'line',
            data: this.weekValue,
            itemStyle: {
              normal: {
                color: this.color
              }
            }
          }
        ]
      }
    }
  },
  watch: {
    sendTime: function (newval, oldval) {
      this.getEchartsDataInfo()
    }
  }
}
</script>
<style lang="stylus">
@import '~styles/variable.styl'
@import '~styles/global.styl'
</style>
