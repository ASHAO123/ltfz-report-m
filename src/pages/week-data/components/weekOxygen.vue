<template>
  <div class="report_item_wrapper">
    <div class="report_header">
      <div class="item_title">
        <i class="iconfont">&#xe610;</i>
        <span>{{$t('title.bloodoxygen')}}</span>
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
      <div class="parameter">
        <ul>
            <li class="item">
              <span :class="['value',wholeDayAve.value!==''&&wholeDayAve.color!=='normal'?wholeDayAve.color:'normal']">
               <template v-if="wholeDayAve!==''">
                <strong>{{wholeDayAve.value}}</strong>
                <i>%</i>
               </template>
               <template v-else>
                 --
               </template>
              </span>
              <p class="title">{{$t('tag.bloodoxygen.ave')}}</p>
            </li>
            <li class="item">
              <span :class="['value',low.value!==''&&low.color?low.color:'normal']">
                <template v-if="low!==''">
                  <strong>{{low.value}}</strong>
                  <i>%</i>
               </template>
               <template v-else>
                 --
               </template>
              </span>
              <p class="title">{{$t('tag.bloodoxygen.low')}}</p>
            </li>
            <li class="item">
              <span :class="['value',top.value!==''&&top.color?top.color:'normal']">
                <template v-if="top!==''">
                  <strong>{{top.value}}</strong>
                  <i>%</i>
               </template>
               <template v-else>
                 --
               </template>
              </span>
              <p class="title">{{$t('tag.bloodoxygen.top')}}</p>
            </li>
          </ul>
      </div>
      <!-- 健康报告 -->
      <div class="read part-top">
        <div class="header">
          <i class="iconfont">&#xe61d;</i>
          <h2>{{$t('title.secondaryTitle.oxygenReport')}}</h2>
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
    <div class="nodata" v-show="!echartShows">{{$t('tag.bloodoxygen.noweek')}}</div>
  </div>
</template>
<script>
export default {
  name: 'weekOxygen',
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
      id: 'weekOxygen',
      contentShow: false,
      // 图表
      chart_x_time: [],
      oxygenValue: [],
      top: '',
      low: '',
      wholeDayAve: [],
      content: '',
      time: '',
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
      this.$axios.getWeekbloodoxygen(postData)
        .then(this.getEchartsDataInfoSucc)
    },
    getEchartsDataInfoSucc (res) {
      this.emit.code = res.code
      // this.emit.time = this.sendTime
      this.$emit('oxygencode', this.emit)

      if (res.code === 0 && res.data) {
        const getData = res.data
        this.echartShows = true
        let startTime = getData.outlineData.startTime
        let endTime = getData.outlineData.endTime

        // 图
        this.chart_x_time = []
        this.oxygenValue = []
        this.chart_x_time = getData.echarts.time
        this.oxygenValue = getData.echarts.value
        this.wholeDayAve = getData.outlineData.ave
        this.top = getData.outlineData.top
        this.low = getData.outlineData.low

        this.statec=getData.outlineData.statec
        this.content =this.$t('bloodoxygen.week.a1')+this.wholeDayAve.value+this.$t('bloodoxygen.week.'+this.statec)
        // console.log('Oxygen=>' + this.chart_x_time + '<br>' + 'this.bOxygenValue:=>' + this.bOxygenValue)
        this.time = '(' + startTime + '-' + endTime + ')'
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
        series: {
          type: 'bar',
          barCategoryGap: '40%',
          'itemStyle': {
            color: function (params) {
              let colorList
              if (params.data >= 0) {
                colorList = '#00A2FF'
              } else {
                colorList = '#ff9326'
              }
              return colorList
            }
          },
          data: this.oxygenValue
        },
        grid: {
          containLabel: true,
          top: 20,
          bottom: 10,
          left: 0,
          right: 0
        },
        xAxis: {
          type: 'category',
          axisLine: {
            lineStyle: {
              color: '#54657e',
              width: 1
            }
          },
          data: this.chart_x_time
        },
        yAxis: {
          type: 'value',
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
          },
          data: [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4],
          minInterval: 1,
          axisLabel: {
            show: true,
            formatter: function (value, index) {
              var res = 95 + Number(value)
              if (res>=100){
                res=100
                return  res + '%'
              }else{
                return res + '%'
              }
            },
            textStyle: {
              color: function (value, index) {
                if (value <= -5) {
                  return '#fe0000'
                } else if (value <= -1) {
                  return '#ff9326'
                } else {
                  return '#00a0ea'
                }
              }
            }
          }
        },
        dataZoom: [{
          type: 'inside',
          start: 0,
          end: 100
        }],
        tooltip: {
          trigger: 'axis',
          formatter: function (params) {
            var time = params[0].axisValue
            return time
          }
        }
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
