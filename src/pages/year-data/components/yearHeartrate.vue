<template>
  <div class="report_item_wrapper" ref="alerts">
    <div class="report_header">
      <div class="item_title">
        <i class="iconfont">&#xe655;</i>
        <span>{{$t('title.heartrate')}}</span>
        <span class="srart_end_time" v-show="echartShows">{{time}}</span>
      </div>
      <div class="item_warn" v-show="echartShows">
        <i class="iconfont">&#xe601;</i>
        <span>{{$t('tag.zongyujing')}}</span>
        <span :class="['num', warnings>0 ? 'red': '']">{{warnings}}次</span>
      </div>
    </div>
    <div class="echarts_wrapper" v-show="echartShows">
        <!-- 图表数据 -->
        <div class="draw_echarts">
          <keep-alive>
            <div class="chart" ref="chart" :id="id"></div>
          </keep-alive>
        </div>
        <p class="chartTip">*{{$t('tag.shipin')}}  </p>
        <div class="parameter">
          <div class="cal" >
            <div :class="['value',wholeDayAve.value !=='' &&wholeDayAve.color!=='normal'?wholeDayAve.color:'normal']">
              <template v-if="wholeDayAve!==''">
                <strong>{{wholeDayAve.value}}</strong>
                <i>bpm</i>
              </template>
              <template v-else>
                --
              </template>
            </div>
            <p class="title">{{$t('tag.xinlv.quantianpingjun')}}</p>
          </div>
          <!-- 平均、最高、最低值 -->
          <ul>
            <li class="item">
              <span :class="['value',nightAveHeartRate.value!==''&&nightAveHeartRate.color!=='normal'?nightAveHeartRate.color:'normal']">
               <template v-if="nightAveHeartRate!==''">
                <strong>{{nightAveHeartRate.value}}</strong>
                <i>bpm</i>
               </template>
               <template v-else>
                 --
               </template>
              </span>
              <p class="title">{{$t('tag.xinlv.yejianpingjun')}}</p>
            </li>
            <li class="item">
              <span :class="['value',dayAveHeartRate.value!==''&&dayAveHeartRate.color?dayAveHeartRate.color:'normal']">
                <template v-if="dayAveHeartRate!==''">
                  <strong>{{dayAveHeartRate.value}}</strong>
                  <i>bpm</i>
               </template>
               <template v-else>
                 --
               </template>
              </span>
              <p class="title">{{$t('tag.xinlv.rijianpingjun')}}</p>
            </li>
            <li class="item">
              <span class="value">
                <template v-if="yearWarnDays!==''">
                  <strong>{{yearWarnDays}}</strong>
                  <i>天</i>
               </template>
               <template v-else>
                 --
               </template>
              </span>
              <p class="title">{{$t('tag.xinlv.nianbaojing')}}</p>
            </li>
          </ul>
        </div>
        <!-- 健康等级评估 -->
        <div class="assessment part-top">
          <div class="header">
            <i class="iconfont">&#xe616;</i>
            <h2>{{$t('title.secondaryTitle.xinlvPG')}}</h2>
          </div>
          <div class="state">
            <div>
              <div :class="['level', rateState.state !== '' && rateState.color !== 'normal' ? rateState.color : '' ]">
                <template v-if="rateState.state !== ''">
                  <strong>{{rateState.state}}</strong>
                  <span>{{$t('tag.ji')}}</span>
                </template>
                <template v-else>
                  --
                </template>
              </div>
              <span>{{$t('tag.xinlv.yearPG')}}</span>
            </div>
            <div class="tips">
              <i class="iconfont tip" @click="showTip">&#xe6ca;</i>
              <span>{{$t('tag.tieshi')}}</span>
            </div>
          </div>
        </div>
        <!-- 健康报告 -->
        <div class="read part-top">
          <div class="header">
            <i class="iconfont">&#xe61d;</i>
            <h2>{{$t('title.secondaryTitle.xinlvReport')}}</h2>
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
    <!-- 暂无数据 -->
    <div class="nodata" v-show="!echartShows">{{$t('tag.xinlv.noyear')}}</div>

  </div>
</template>
<script>
export default {
  name: 'yearHeartrate',
  props: {
    sendTime: {
      type: String,
      require: true,
      default: ''
    }
  },
  data () {
    return {
      emit: {},
      echartShows: true,
      id: 'yearHeartrate',
      tipShow: false,
      contentShow: false,
      wranTip: false,
      // 图表
      wranList: [],
      threeseries: [],
      names: this.$t('components.weekRateName'),
      chart_x_time: [],
      weekHeartrateValue: [],
      nightAveHeartRate: '',
      dayAveHeartRate: '',
      wholeDayAve: '',
      warnings: '0',
      content: '',
      statec:'',
      rateState: '',
      time: '',
      yearWarnDays: ''
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
      this.$axios.getYearheartrate(postData)
        .then(this.getEchartsDataInfoSucc)
    },
    getEchartsDataInfoSucc (res) {
      this.emit.code = res.code
      this.$emit('heareatcode', this.emit)
      if (res.code === 0 && res.data) {
        this.echartShows = true
        this.warnings = 0
        const getData = res.data
        this.nightAveHeartRate = getData.outlineData.nightAveHeartRate
        this.dayAveHeartRate = getData.outlineData.dayAveHeartRate
        this.wholeDayAve = getData.outlineData.aveHeartRate
        this.warnings = getData.outlineData.warnings

        this.statec=getData.outlineData.statec
        this.content = this.$t('heartrate.year.a1')+this.wholeDayAve.value+ this.$t('heartrate.year.'+this.statec) + this.warnings + this.$t('tag.xinlv.ci') 
        
        let startTime = getData.outlineData.startTime
        let endTime = getData.outlineData.endTime
        this.time = '(' + startTime + '-' + endTime + ')'
        this.yearWarnDays = getData.outlineData.yearWarnDays
        // 图表数据
        this.chart_x_time = []
        this.rateState = getData.outlineData.rateState
        this.chart_x_time = getData.outlineData.time
        this.weekHeartrateValue = []
        this.threeseries = []
        let averate = []
        let dayrate = []
        let nightrate = []
        for (let item of getData.echarts) {
          averate.push(item.averate)
          dayrate.push(item.dayrate)
          nightrate.push(item.nightrate)
        }
        this.weekHeartrateValue.push(averate, dayrate, nightrate)
        for (let i in this.weekHeartrateValue) {
          this.threeseries.push({
            name: this.names[i],
            type: 'line',
            data: this.weekHeartrateValue[i]
          })
        }
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
      this.$alertPl.show({
        // el: this.$refs.alerts,
        title: this.$t('tag.xiaotieshi.xinlv.title'),
        confirmMsg: this.$t('tag.guanbi'),
        text: this.$t('tag.xiaotieshi.xinlv.text')
      })
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
        series: this.threeseries,
        color: ['#0082d6', '#29cc71', '#a747de'],
        grid: {
          containLabel: true,
          top: 30,
          bottom: 10,
          left: 0,
          right: 0
        },
        dataZoom: [{
          type: 'inside',
          start: 0,
          end: 100
        }],
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: this.names
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
          data: this.chart_x_time
        },
        yAxis: {
          type: 'value',
          min: 0,
          interval: 20,
          splitLine: {
            show: true,
            lineStyle: {
              type: 'dashed',
              color: '#cad3df',
              width: 1
            }
          },
          axisLine: {
            show: false,
            lineStyle: {
              color: '#54657e'
            }
          },
          axisTick: {
            show: false
          },
          data: this.weekHeartrateValue
        }
      }
    }
  },
  components: {
  },
  watch: {
    sendTime: function (newval, oldval) {
      this.getEchartsDataInfo()
    }
  }
}
</script>
<style lang="stylus" scoped>
@import '~styles/variable.styl'
@import '~styles/global.styl'
</style>
