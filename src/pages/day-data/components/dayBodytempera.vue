<template>
  <div class="report_item_wrapper">
    <div class="report_header">
      <div class="item_title">
        <i class="iconfont">&#xe60b;</i>
        <span>{{$t('title.temperature')}}</span>
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
            <span :class="['value',ave.value!==''&&ave.color!=='normal'?ave.color:'normal']">
              <template v-if="ave!==''">
              <strong>{{ave.value}}</strong>
              <i>℃</i>
              </template>
              <template v-else>
                --
              </template>
            </span>
            <p class="title">{{$t('tag.temperature.ave')}}</p>
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
            <p v-for="(item,index) in content" :key=index>{{item}}</p>
          </div>
          <div :class="['mask',contentShow ? 'show' : 'hidden']" @click="contentToggle">
            <i class="iconfont" v-show="!contentShow">&#xe632;</i>
            <i class="iconfont" v-show="contentShow">&#xe633;</i>
          </div>
        </div>
      </div>
    </div>
    <div class="nodata" v-show="!showData">{{$t('tag.temperature.noday')}}</div>
  </div>
</template>
<script>
export default {
  name: 'dayBodytempera',
  props: {
    sendTime: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      id: 'dayBodytempera',
      content: [],
      time: '',
      contentShow: false,
      ave: [],
      top: [],
      low: [],
      showData: true,
      emit: {},
      // 图表
      chart_x_time: [],
      tempValue: [],
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
      this.$axios.getDaybodytempera(postData)
        .then(this.getEchartsDataInfoSucc)
    },
    getEchartsDataInfoSucc (res) {
      if (res.code === 0 && res.data) {
        this.showData = true
        const getData = res.data
        this.ave = getData.outlineData.ave
        this.top = getData.outlineData.top
        this.low = getData.outlineData.low

        this.statec=getData.outlineData.statec
        this.content = this.$t('temperature.day.'+this.statec)
        let startTime = getData.outlineData.startTime
        let endTime = getData.outlineData.endTime
        this.time = '(' + startTime + ' -- ' + endTime + ')'
        // 图表
        let chart = getData.echarts
        this.chart_x_time = []
        this.tempValue = []

        for (let i in chart) {
          this.chart_x_time.push(chart[i].time)
          this.tempValue.push(chart[i].value)
        }
        this.init()
        this.setOption(this.options)
      } else {
        this.showData = false
      }
      this.emit.code = res.code
      // this.emit.time = this.sendTime
      // this.emit.btFlag = this.showData
      this.$emit('daybodytemperacode', this.emit)
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
        series: {
          name:this.$t('components.tiwen'),
          type: 'line',
          sampling: 'average',
          color: '#ff7c1b',
          data: this.tempValue
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
          end: 70
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
<style lang="stylus" scoped>
@import '~styles/variable.styl'
@import '~styles/global.styl'
</style>
