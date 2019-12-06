<template>
  <div class="report_item_wrapper">
    <div class="report_header">
      <div class="item_title">
        <i class="iconfont">&#xe60b;</i>
        <span>{{$t('title.temperature')}}</span>
        <span class="srart_end_time" v-show="echartShows">{{time}}</span>
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
                <i>℃</i>
               </template>
               <template v-else>
                 --
               </template>
              </span>
              <p class="title">{{$t('tag.temperature.ave')}}</p>
            </li>
            <li class="item">
              <span :class="['value',low.value!==''&&low.color?low.color:'normal']">
                <template v-if="low!==''">
                  <strong>{{low.value}}</strong>
                  <i>℃</i>
               </template>
               <template v-else>
                 --
               </template>
              </span>
              <p class="title">{{$t('tag.temperature.low')}}</p>
            </li>
            <li class="item">
              <span :class="['value',top.value!==''&&top.color?top.color:'normal']">
                <template v-if="top!==''">
                  <strong>{{top.value}}</strong>
                  <i>℃</i>
               </template>
               <template v-else>
                 --
               </template>
              </span>
              <p class="title">{{$t('tag.temperature.top')}}</p>
            </li>
          </ul>
      </div>
      <!-- 健康报告 -->
      <div class="read part-top">
        <div class="header">
          <i class="iconfont">&#xe61d;</i>
          <h2>{{$t('title.secondaryTitle.temperatureReport')}}</h2>
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
    <div class="nodata" v-show="!echartShows">{{$t('tag.temperature.noyear')}}</div>
  </div>
</template>
<script>
export default {
  name: 'yearTemperature',
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
      id: 'yearTemperature',
      contentShow: false,
      // 图表
      chart_x_time: [],
      temperature: [],
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
        'year': this.sendTime,
        'userid': this.$route.params.userID,
        'friendid': this.$route.params.friendID,
        'token': this.$route.params.token
      }
      this.$axios.getYearbodytempera(postData)
        .then(this.getEchartsDataInfoSucc)
    },
    getEchartsDataInfoSucc (res) {
      this.emit.code = res.code
      this.$emit('tempcode', this.emit)
      if (res.code === 0 && res.data) {
        this.echartShows = true
        const getData = res.data
        let startTime = getData.startTime
        let endTime = getData.endTime
        // 图
        this.chart_x_time = []
        this.temperature = []
        this.chart_x_time = getData.time
        this.temperature = getData.temperature
        this.wholeDayAve = getData.ave
        this.top = getData.top
        this.low = getData.low

        this.statec=getData.statec
        this.content = this.$t('temperature.year.a1')+this.wholeDayAve.value+this.$t('temperature.year.'+this.statec)
       
        // console.log('Temperature=>' + this.chart_x_time + '<br>' + 'this.bTemperatureValue:=>' + this.bTemperatureValue)
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
          name:this.$t('components.tiwen'),
          type: 'line',
          sampling: 'average',
          color: '#ff7c1b',
          data: this.temperature
        },
        color: '#3596ea',
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
              type: 'solid',
              color: '#54657e',
              width: 1
            }
          },
          axisTick: {
            show: true
          },
          data: this.chart_x_time
        },
        yAxis: [
          {
            type: 'value',
            min: 33,
            axisLabel: {
              show: true,
              formatter: function (value, index) {
                return value + '℃'
              }
            },
            axisTick: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: '#54657e'
              }
            },
            splitLine: {
              show: false
            }
          }
        ],
        dataZoom: [{
          type: 'inside',
          start: 0,
          end: 100
        }],
        tooltip: {
          trigger: 'axis',
          formatter:"{a}: {c} ℃"
          // formatter: function (params) {
          //   if (params[0].value != null) {
          //     return params[0].axisValue + '<br/>' + '体温:' + params[0].value + '℃'
          //   } else {
          //     return params[0].axisValue + '<br/>' + '未检测到体温数据'
          //   }
          // }
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
