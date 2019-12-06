<template>
  <div class="report_item_wrapper">
    <div class="report_header">
      <div class="item_title">
        <i class="iconfont">&#xe60e;</i>
        <span>{{$t('title.bloodsugar')}}</span>
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
              <span :class="['value',wholeDayAve.value!==''&&wholeDayAve.color!=='normal'?wholeDayAve.color:'normal']">
               <template v-if="wholeDayAve!==''">
                <strong>{{wholeDayAve.value}}</strong>
                <i>mmol/L</i>
               </template>
               <template v-else>
                 --
               </template>
              </span>
              <p class="title">{{$t('tag.bloodsugar.ave')}}</p>
            </li>
            <li class="item">
              <span :class="['value',low.value!==''&&low.color?low.color:'normal']">
                <template v-if="low!==''">
                  <strong>{{low.value}}</strong>
                  <i>mmol/L</i>
               </template>
               <template v-else>
                 --
               </template>
              </span>
              <p class="title">{{$t('tag.bloodsugar.lowest')}}</p>
            </li>
            <li class="item">
              <span :class="['value',top.value!==''&&top.color?top.color:'normal']">
                <template v-if="top!==''">
                  <strong>{{top.value}}</strong>
                  <i>mmol/L</i>
               </template>
               <template v-else>
                 --
               </template>
              </span>
              <p class="title">{{$t('tag.bloodsugar.height')}}</p>
            </li>
          </ul>
      </div>
      <!-- 健康报告 -->
      <div class="read part-top">
        <div class="header">
          <i class="iconfont">&#xe61d;</i>
          <h2>{{$t('title.secondaryTitle.sugarReport')}}</h2>
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
    <p v-show="!showData" class="nodata">{{$t('tag.bloodsugar.noday')}}</p>
  </div>
</template>
<script>
export default {
  name: 'dayBloodsugar',
  props: {
    sendTime: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      id: 'dayBloodsugar',
      contentShow: false,
      showData: true,
      emit: {},
      // 图表
      chart_x_time: [],
      bsugarValue: [],
      top: '',
      low: '',
      wholeDayAve: [],
      content: [],
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
        'date': this.sendTime,
        'userid': this.$route.params.userID,
        'friendid': this.$route.params.friendID,
        'token': this.$route.params.token
      }
      this.$axios.getDaybloodsugar(postData)
        .then(this.getEchartsDataInfoSucc)
    },
    getEchartsDataInfoSucc (res) {
      if (res.code === 0 && res.data) {
        this.showData = true
        const getData = res.data
        this.bsugarValue = []
        this.chart_x_time = []

        for (let i in getData.echarts) {
          this.bsugarValue.push(getData.echarts[i].value)
          this.chart_x_time.push(getData.echarts[i].time)
        }
        this.statec=getData.outlineData.statec
        this.content = this.$t('bloodsugar.day.'+this.statec)
        let startTime = getData.outlineData.startTime
        let endTime = getData.outlineData.endTime
        this.time = '(' + startTime + ' -- ' + endTime + ')'
        // 图表
        this.wholeDayAve = getData.outlineData.ave
        this.top = getData.outlineData.top
        this.low = getData.outlineData.low
        this.init()
        this.setOption(this.options)
      } else {
        this.showData = false
      }
      this.emit.code = res.code
      // this.emit.time = this.sendTime
      // this.emit.bsFlag = this.showData
      this.$emit('daybloodsugarcode', this.emit)
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
          name:this.$t('components.xuetang'),
          type: 'line',
          sampling: 'average',
          color: '#FB79B6',
          data: this.bsugarValue
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
            axisLabel: {
              show: true,
              formatter: function (value, index) {
                return value + 'mmol/L'
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
          formatter:"{a}: {c} mmol/L"
          // formatter: function (params) {
          //   if (params[0].value != null) {
          //     return params[0].axisValue + '<br/>' + '血糖:' + params[0].value + 'mmol/L'
          //   } else {
          //     return params[0].axisValue + '<br/>' + '未检测到血糖数据'
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
