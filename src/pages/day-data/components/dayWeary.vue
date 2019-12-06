<template>
  <div class="report_item_wrapper">
    <div class="report_header">
      <div class="item_title">
        <i class="iconfont">&#xe653;</i>
        <span>{{$t('title.pilao')}}</span>
        <span class="srart_end_time" v-show="showData">{{time}}</span>
      </div>
      <div class="item_warn">
      </div>
    </div>
    <div class="echarts_wrapper" v-show="showData">
      <div class="draw_echarts">
        <keep-alive>
          <div class="chart" :id="id"></div>
        </keep-alive>
      </div>
      <p class="chartTip">*{{$t('tag.shipin')}} </p>
      <div class="parameter">
        <ul>
          <li class="item">
            <span :class="['value',today.value!==''&&today.color!=='normal'?today.color:'normal']">
              <template v-if="today!==''">
              <strong>{{today.value}}</strong>
              <i>bpm</i>
              </template>
              <template v-else>
                --
              </template>
            </span>
            <p class="title">{{$t('tag.xinlv.jinrijingxi')}}</p>
          </li>
          <li class="item">
            <span :class="['value',yes.value!==''&&yes.color?yes.color:'normal']">
              <template v-if="yes!==''">
                <strong>{{yes.value}}</strong>
                <i>bpm</i>
              </template>
              <template v-else>
                --
              </template>
            </span>
            <p class="title">{{$t('tag.xinlv.zuorijingxi')}}</p>
          </li>
          <li class="item">
            <span :class="['value',byes.value!==''&&byes.color?byes.color:'normal']">
              <template v-if="byes!==''">
                <strong>{{byes.value}}</strong>
                <i>bpm</i>
              </template>
              <template v-else>
                --
              </template>
            </span>
            <p class="title">{{$t('tag.xinlv.qiantianjingxi')}}</p>
          </li>
        </ul>
      </div>
      <!-- 健康报告 -->
      <div class="read part-top">
        <div class="header">
          <i class="iconfont">&#xe61d;</i>
          <h2>{{$t('title.secondaryTitle.pilaoReport')}}</h2>
        </div>
        <div class="content">
          <div :class="['article',contentShow ? 'show' : 'hidden']" >
            <p v-for="(item,index) in content" :key=index>{{item}}</p>
          </div>
          <div :class="['mask',contentShow ? 'show' : 'hidden']" @click="contentToggle">
            <i class="iconfont" v-show="!contentShow">&#xe632;</i>
            <i class="iconfont" v-show="contentShow">&#xe633;</i>
          </div>
        </div>
      </div>
    </div>
    <div class="nodata" v-show="!showData">{{$t('tag.fat.noday')}}</div>
  </div>
</template>
<script>
export default {
  name: 'dayWeary',
  props: {
    sendTime: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      id: 'dayWeary',
      content: [],
      time: '',
      contentShow: false,
      today: [],
      yes: [],
      byes: [],
      showData: true,
      emit: {},
      // 图表
      chart_x_time: [],
      rateLeft: [],
      rateRight: [],
      leftColor: '#d2e6ff',
      rightColor: '',
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
        'date': this.sendTime,
        'userid': this.$route.params.userID,
        'friendid': this.$route.params.friendID,
        'token': this.$route.params.token
      }
      this.$axios.getDayweary(postData)
        .then(this.getEchartsDataInfoSucc)
    },
    getEchartsDataInfoSucc (res) {
      if (res.code === 0 && res.data) {
        this.showData = true
        const getData = res.data
        this.today = getData.outlineData.today
        this.yes = getData.outlineData.yes
        this.byes = getData.outlineData.byes

        this.statec=getData.outlineData.statec
        this.content = this.$t('fat.day.'+this.statec)
        let startTime = getData.outlineData.startTime
        let endTime = getData.outlineData.endTime
        this.time = '(' + startTime + ' -- ' + endTime + ')'
        // 图表
        this.rateLeft = []
        this.rateRight = []
        this.chart_x_time = []

        this.rightColor = getData.echarts.rateRight.color
        this.rateLeft = getData.echarts.rateLeft
        this.rateRight = getData.echarts.rateRight.rate
        this.chart_x_time = getData.echarts.date

        this.init()
        this.setOption(this.options)
      } else {
        this.showData = false
      }
      this.emit.code = res.code
      // this.emit.time = this.sendTime
      // this.emit.weFlag = this.showData
      this.$emit('daywearycode', this.emit)
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
        series: [
          {
            name: this.$t('components.jingxi'),
            type: 'line',
            data: this.rateLeft,
            itemStyle: {
              normal: {
                color: this.leftColor
              }
            }
          },
          {
            name: this.$t('components.jingxi'),
            type: 'line',
            data: this.rateRight,
            itemStyle: {
              normal: {
                color: this.rightColor
              }
            }
          }
        ],
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
          formatter: function (params) {
            console.log(params);
            if (params[0].data != null) {
              return `${params[0].axisValue}<br/>${params[0].seriesName}：${params[0].value}`
            } else if (params[0].data == null && params[1] && params[1].data != null) {
              return `${params[1].axisValue}<br/>${params[0].seriesName}：${params[1].value}`
            } else {
            //   return `${params[0].axisValue}<br/>未检测到心率值`
            }
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
<style lang="stylus" scoped>
@import '~styles/variable.styl'
@import '~styles/global.styl'
</style>
