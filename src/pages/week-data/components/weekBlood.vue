<template>
  <div class="report_item_wrapper" ref="alerts">
    <div class="report_header">
      <div class="item_title">
        <i class="iconfont">&#xe609;</i>
        <span>{{$t('title.bloodpre')}}</span>
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
        <div class="cal" >
          <div :class="['column',wholeDayAve.value !=='' &&wholeDayAve.color!=='normal'?wholeDayAve.color:'normal']">
            <template v-if="wholeDayAve!==''">
              <strong>{{wholeDayAve.value}}</strong>
              <i>mmHg</i>
            </template>
            <template v-else>
              --
            </template>
          </div>
          <p class="title">{{$t('tag.blood.allave')}}</p>
        </div>
      </div>
      <div class="assessment part-top">
        <div class="header">
          <i class="iconfont">&#xe616;</i>
          <h2>{{$t('title.secondaryTitle.bloodPG')}}</h2>
        </div>
        <div class="state">
          <div>
            <div :class="['level', rateState.value !== '' && rateState.color !== 'normal' ? rateState.color : '' ]">
              <template v-if="rateState.value !== ''">
                <strong class='bloodpress'>{{$t('tag.blood.'+rating)}}</strong>
              </template>
              <template v-else>
                --
              </template>
            </div>
            <span>{{$t('tag.blood.weekPG')}}</span>
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
          <h2>{{$t('title.secondaryTitle.bloodReport')}}</h2>
        </div>
        <div class="content">
          <div :class="['article',contentShow ? 'show' : 'hidden']" >
            <p >{{content}}</p>
          </div>
          <div :class="['mask',contentShow ? 'show' : 'hidden']" @click="contentToggle">
            <i class="iconfont" v-show="!contentShow">&#xe632;</i>
            <i class="iconfont" v-show="contentShow">&#xe633;</i>
          </div>
        </div>
      </div>
    </div>
    <div class="nodata" v-show="!echartShows">{{$t('tag.blood.noweek')}}</div>

  </div>
</template>
<script>
export default {
  name: 'weekBlood',
  props: {
    sendTime: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      id: 'weekBlood',
      emit: {},
      echartShows: true,
      wholeDayAve: '',
      warnings: '0',
      content: '',
      rateState: '',
      time: '',
      tipShow: false,
      contentShow: false,
      wranTip: false,
      // 图表
      highPress: [],
      lowPress: [],
      chart_x_time: [],
      rating:'',
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
      this.$axios.getWeekbloodpressure(postData)
        .then(this.getEchartsDataInfoSucc)
    },
    getEchartsDataInfoSucc (res) {
      this.emit.code = res.code
      // this.emit.time = this.sendTime
      this.$emit('bloodcode', this.emit)
      if (res.code === 0 && res.data) {
        this.echartShows = true
        const getData = res.data
        this.wholeDayAve = getData.outlineData.ave

        this.rating=getData.outlineData.rating
        this.statec=getData.outlineData.statec
        this.content = this.$t('bloodpre.week.a1')+getData.outlineData.hightc+ this.$t('bloodpre.week.a2') +getData.outlineData.lowc + this.$t('bloodpre.week.'+this.statec)
        
        this.rateState = getData.outlineData.state
        let startTime = getData.outlineData.startTime
        let endTime = getData.outlineData.endTime

        // 图表
        this.highPress = []
        this.chart_x_time = []
        this.lowPress = []
        this.highPress = getData.outlineData.highPress
        this.lowPress = getData.outlineData.lowPress
        this.chart_x_time = getData.outlineData.time
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
    showTip () {
      this.$alertPl.show({
        // el: this.$refs.alerts,
        title:  this.$t('tag.xiaotieshi.blood.title'),
        confirmMsg: this.$t('tag.guanbi'),
        text: this.$t('tag.xiaotieshi.blood.text')
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
        dataZoom: [{
          type: 'inside',
          filter: 'empty',
          start: 0,
          end: 100,
          animation: 100,
          minSpan: '90%'
        }],
        series: [
          {
            name: this.$t('components.shousuoya'),
            type: 'bar',
            stack: '血压值',
            data: this.highPress,
            barCategoryGap: '40%',
            itemStyle: {
              color: function (params) {
                return params.data['color']
              }
            }
          },
          {
            name: this.$t('components.shuzhangya'),
            type: 'bar',
            stack: '血压值',
            data: this.lowPress,
            barCategoryGap: '40%',
            itemStyle: {
              color: function (params) {
                return params.data['color']
              }
            }
          }
        ],
        grid: {
          containLabel: true,
          top: 20,
          bottom: 10,
          left: 15,
          right: 10
        },
        xAxis: {
          type: 'category',
          axisLine: {
            lineStyle: {
              type: 'solid',
              width: 1
            }
          },
          data: this.chart_x_time
        },
        yAxis: {
          type: 'value',
          min: 0,
          interval: 20,
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            show: false
          },
          splitLine: {
            show: false
          }
        },
        tooltip: {
          trigger: 'axis',
          // axisPointer: {
          //   type: 'none'
          // },
          // formatter: function (params) {
          //   if (params[0].data != null && params[0].data.value !== null) {
          //     return params[0].axisValue + '<br/>' + '收缩压:' + params[0].data.value + '<br/>' + '舒张压:' + params[1].data.value
          //   } else {
          //     return params[0].axisValue + '<br/>' + '未检测到血压数据'
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
.modal-box
  padding .3rem
</style>
