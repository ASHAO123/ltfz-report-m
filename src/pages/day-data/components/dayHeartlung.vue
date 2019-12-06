<template>
  <div class="report_item_wrapper">
    <div class="report_header">
      <div class="item_title">
        <i class="iconfont">&#xe619;</i>
        <span>{{$t('title.xinfei')}}</span>
        <span class="srart_end_time"  v-show="showData">{{time}}</span>
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
      <div class="assessment part-top">
        <div class="header">
          <i class="iconfont">&#xe616;</i>
          <h2>{{$t('title.secondaryTitle.xinfeipinggu')}}</h2>
        </div>
        <div class="state">
          <div>
            <div :class="['level', state.value !== '' && state.color !== 'normal' ? state.color : '' ]">
              <template v-if="state.value !== ''">
                <strong class='bloodpress'>{{$t('tag.'+rating)}}</strong>
              </template>
              <template v-else>
                --
              </template>
            </div>
            <span>{{$t('tag.xinfei.zhuangtai')}}</span>
          </div>
        </div>
      </div>
      <!-- 健康报告 -->
      <div class="read part-top">
        <div class="header">
          <i class="iconfont">&#xe61d;</i>
          <h2>{{$t('title.secondaryTitle.xinfeiReport')}}</h2>
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
    <p class="nodata" v-show="!showData">{{$t('tag.xinfei.noday')}}</p>
  </div>
</template>
<script>
export default {
  name: 'dayHeartlung',
  props: {
    sendTime: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      id: 'dayHeartlung',
      content: [],
      state: '',
      time: '',
      contentShow: false,
      showData: true,
      emit: {},
      // 图表
      chart_x_time: [],
      heartlungValue: [],
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
        'date': this.sendTime,
        'userid': this.$route.params.userID,
        'friendid': this.$route.params.friendID,
        'token': this.$route.params.token
      }
      this.$axios.getDayheartlung(postData)
        .then(this.getEchartsDataInfoSucc)
    },
    getEchartsDataInfoSucc (res) {
      if (res.code === 0 && res.data) {
        this.showData = true
        const getData = res.data
        this.state = getData.state
        let startTime = getData.startTime
        let endTime = getData.endTime
        this.time = '(' + startTime + ' -- ' + endTime + ')'
        // 图表
        this.chart_x_time = []
        this.heartlungValue = []

        this.rating=getData.rating
        this.statec=getData.statec
        
        this.content = this.$t('xinfei.day.'+this.statec)
        this.chart_x_time = getData.time
        this.heartlungValue = getData.echarts
        this.init()
        this.setOption(this.options)
      } else {
        this.showData = false
      }
      this.emit.code = res.code
      // this.emit.time = this.sendTime
      // this.emit.hlFlag = this.showData
      this.$emit('dayheartlungcode', this.emit)
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
            // console.log(params)
            let s=params[0].seriesName.split(",")
            let data = params[0].value
            let time = params[0].axisValue
            return ((data >= 13000 && data <= 20000) ? `${time}<br />${s[1]}:"${data}"` : `${time}<br />${s[0]}:"${data}"`)
          }
        },
        series: {
          name: this.$t('components.xinfeiS'),
          type: 'bar',
          barWidth: '30%',
          data: this.heartlungValue,
          itemStyle: {
            normal: {
              color: function (params) {
                if (params.data !== null && params.data !== undefined) {
                  if (params.data >= 13000 && params.data <= 20000) {
                    return '#1b8cff'
                  } else {
                    return '#ff7c1b'
                  }
                }
              }
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
<style lang="stylus">
@import '~styles/variable.styl'
@import '~styles/global.styl'
</style>
