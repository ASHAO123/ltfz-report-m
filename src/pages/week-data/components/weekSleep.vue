/* eslint-disable no-unused-expressions */
/* eslint-disable no-labels */
<template>
  <div class="report_item_wrapper">
    <div class="report_header">
      <div class="item_title">
        <i class="iconfont">&#xe775;</i>
        <span>{{$t('title.sleep')}}</span>
        <span class="srart_end_time"  v-show="echartShows">{{time}}</span>
      </div>
      <div class="sleep">
        <strong>{{$t('title.zhiliang')}}</strong>
        <span :class="this.sleepcolor" v-show="echartShows">{{$t('tag.'+statec)}}</span>
      </div>
    </div>
    <div class="echarts_wrapper" v-show="echartShows">
      <div class="draw_echarts">
        <keep-alive>
          <div class="chart" :id="id"></div>
        </keep-alive>
      </div>
      <p class="chartTip">*{{$t('tag.shipin')}}</p>
      <div class="parameter">
        <!-- 平均、最高、最低值 -->
        <ul>
          <li class="item">
            <span class="value sleepValue">
              <strong>{{aveSleepTime_hour}}</strong>
              <i>{{$t('tag.xiaoshi')}}</i>
              <strong>{{aveSleepTime_min}}</strong>
              <i>{{$t('tag.fen')}}</i>
            </span>
            <p class="title">
              <i class="ave"></i>{{$t('tag.sleep.dayave')}}
            </p>
          </li>
          <li class="item">
            <span class="value sleepValue">
              <strong>{{aveDeepSleepTime_hour}}</strong>
              <i>{{$t('tag.xiaoshi')}}</i>
              <strong>{{aveDeepSleepTime_min}}</strong>
              <i>{{$t('tag.fen')}}</i>
            </span>
            <p class="title">{{$t('tag.sleep.daydeepave')}}</p>
          </li>
        </ul>
      </div>
      <!-- 健康报告 -->
      <div class="read part-top">
        <div class="header">
          <i class="iconfont">&#xe61d;</i>
          <h2>{{$t('title.secondaryTitle.sleepReport')}}</h2>
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
    <div class="nodata" v-show="!echartShows">{{$t('tag.sleep.noweek')}}</div>
  </div>
</template>
<script>
export default {
  name: 'weekSleep',
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
      id: 'weekSleep', // 图表挂载处id，对应dom，不能写错
      wholeDayAve: '',
      content: '',
      time: '',
      contentShow: false,
      aveDeepSleepTime_hour: '',
      aveDeepSleepTime_min: '',
      aveSleepTime_hour: '',
      aveSleepTime_min: '',
      sleepState: '',
      sleepcolor: '',
      // 图表
      wakeClr: '#e2e5fd',
      lightClr: '#9da8ff',
      deepClr: '#5f6fd0',
      chart_x_time: [],
      threeseries: [],
      lightslp: [],
      wakaslp: [],
      deepslp: [],
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
    getWeekSleep (echarts) {
      this.threeseries = []
      // 数据格式[{value:'',color:''}]
      for (let i in echarts) {
        let data = []
        let obj = null
        let name = ''
        let echartsData = echarts[i].data
        for (let j in echartsData) {
          if (echarts[i].sq === '1') {
            name = this.$t('components.qingxing')
            data.push({
              value: echartsData[j],
              itemStyle: {
                normal: {
                  color: this.wakeClr
                }
              }
            })
          } else if (echarts[i].sq === '1.5') {
            name = this.$t('components.qianshui')
            data.push({
              value: echartsData[j],
              itemStyle: {
                normal: {
                  color: this.lightClr
                }
              }
            })
          } else {
            name = this.$t('components.shenshui')
            data.push({
              value: echartsData[j],
              itemStyle: {
                normal: {
                  color: this.deepClr
                }
              }
            })
          }
        }
        obj = {
          barCategoryGap: '30%',
          name: name,
          type: 'bar',
          stack: 'data',
          data: data
        }
        this.threeseries.push(obj)
        // console.log(this.threeseries)
      }
    },
    getEchartsDataInfo () {
      let postData = {
        'week': this.sendTime,
        'userid': this.$route.params.userID,
        'friendid': this.$route.params.friendID,
        'token': this.$route.params.token
      }
      this.$axios.getWeeksleep(postData)
        .then(this.getEchartsDataInfoSucc)
    },
    getEchartsDataInfoSucc (res) {
      this.emit.code = res.code
      // this.emit.time = this.sendTime
      this.$emit('sleepcode', this.emit)
      if (res.code === 0 && res.data) {
        this.echartShows = true
        const getData = res.data
        this.wholeDayAve = getData.outlineData.ave
        this.content = getData.outlineData.content
        let startTime = getData.outlineData.startTime
        let endTime = getData.outlineData.endTime
        this.time = '(' + startTime + '-' + endTime + ')'
        // 数据
        this.chart_x_time = []
        this.aveDeepSleepTime_hour = getData.outlineData.aveDeepSleepTime_hour
        this.aveDeepSleepTime_min = getData.outlineData.aveDeepSleepTime_min
        this.aveSleepTime_hour = getData.outlineData.aveSleepTime_hour
        this.aveSleepTime_min = getData.outlineData.aveSleepTime_min
        this.sleepState = getData.outlineData.sleepState
        this.sleepcolor = getData.outlineData.sleepcolor

        this.statec=getData.outlineData.statec
        this.content = this.$t('sleep.week.a1')+this.aveSleepTime_hour+ this.$t("tag.xiaoshi")+this.aveSleepTime_min + this.$t("tag.fen")+ this.$t('sleep.week.a2')+this.aveDeepSleepTime_hour+ this.$t("tag.xiaoshi")+this.aveDeepSleepTime_min+ this.$t("tag.fen")+ this.$t('sleep.week.'+this.statec)
        
        // 图表
        this.chart_x_time = getData.time
        this.getWeekSleep(getData.echarts)

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
        color: ['#f54291', '#9da8ff', '#5f6fd0'],
        grid: {
          containLabel: true,
          top: 30,
          bottom: 10,
          left: -30,
          right: 0
        },
        xAxis: {
          type: 'category',
          data: this.chart_x_time,
          show: true
        },
        yAxis: {
          show: false,
          type: 'value'
        },
        dataZoom: {
          // 区域缩放
          type: 'inside',
          filter: 'empty',
          start: 0,
          end: 100,
          minSpan: '90%',
          animation: 100
        },
        tooltip: {
          trigger: 'axis'
        },
        series: this.threeseries
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
<style lang="stylus" scoped>
@import '~styles/variable.styl';
@import '~styles/global.styl'
.sleepValue
  color $blueText;
</style>
