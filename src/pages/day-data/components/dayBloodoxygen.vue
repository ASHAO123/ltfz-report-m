<template>
  <article class="cur_con_wrapper">
    <div class="cur_con" >
      <header class="header">
        <i class="iconfont">&#xe610;</i>
        <h2>{{$t('title.bloodoxygen')}}<span v-show="showData">({{ startTime }} -- {{ endTime }})</span></h2>
      </header>
      <div v-show="showData">
        <div class="charts">
          <div class="data">
            <keep-alive>
              <div class="chart" :id="id"></div>
            </keep-alive>
          </div>
          <p class="tip_txt">*{{$t('tag.shipin')}}</p>
          <ul class="item_list">
              <li>
                <div :class="['value', ave.value !== '' && ave.color !== 'normal' ? ave.color : '' ]">
                  <template v-if="ave.value !== ''">
                    <strong>{{ave.value}}</strong>
                    <i>%</i>
                  </template>
                  <template v-else>
                    --
                  </template>
                </div>
                <div class="title">{{$t('tag.bloodoxygen.ave')}}</div>
              </li>
              <li>
                <div :class="['value', top.value !== '' && top.color !== 'normal' ? top.color : '' ]">
                  <template v-if="top.value !== ''">
                    <strong>{{top.value}}</strong>
                    <i>%</i>
                  </template>
                  <template v-else>
                    --
                  </template>
                </div>
                <p class="title">
                  {{$t('tag.bloodoxygen.top')}}
                </p>
              </li>
              <li>
                <div :class="['value', low.value !== '' && low.color !== 'normal' ? low.color : '' ]">
                  <template v-if="low.value !== ''">
                    <strong>{{low.value}}</strong>
                    <i>%</i>
                  </template>
                  <template v-else>
                    --
                  </template>
                </div>
                <p class="title">{{$t('tag.bloodoxygen.low')}}</p>
              </li>
          </ul>
        </div>
        <div class="read">
          <header>
            <i class="iconfont">&#xe61d;</i>
            <h2>{{$t('title.secondaryTitle.oxygenReport')}}</h2>
          </header>
          <div class="content">
            <h3></h3>
            <div :class="['article',contentShow ? 'show' : 'hidden']" v-html="content"></div>
            <div :class="['mask',contentShow ? 'show' : 'hidden']" @click="contentToggle">
              <i class="iconfont" v-show="!contentShow">&#xe632;</i>
              <i class="iconfont" v-show="contentShow">&#xe633;</i>
            </div>
          </div>
        </div>
      </div>
      <p v-show="!showData" class="nodata">{{$t('tag.bloodoxygen.noday')}}</p>
    </div>
  </article>
</template>
<script>
export default {
  name: 'dayBloodoxygen',
  props: {
    sendTime: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      showData: true,
      emit: {},
      id: 'dayBloodoxygen',
      timeData: [],
      lastData: [],
      last: {},
      ave: {},
      top: {},
      low: {},
      topPre: {},
      lowPre: {},
      startTime: '00:00',
      endTime: '23:59',
      content: '',
      contentShow: false,
      tipShow: false,
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
          data: this.lastData
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
          data: this.timeData
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
          end: 70
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
  methods: {
    getDayDataInfo () {
      let postData = {
        date: this.sendTime,
        userid: this.$route.params.userID,
        friendid: this.$route.params.friendID,
        token: this.$route.params.token
      }
      this.$axios.getDaybloodoxygen(postData).then(this.getDayDataInfoSucc)
    },
    getDayDataInfoSucc (res) {
      if (res.code === 0 && res.data) {
        this.showData = true
        const data = res.data
        this.timeData = []
        this.lastData = []

        this.timeData = data.echarts.time
        this.lastData = data.echarts.value
        this.last = data.outlineData.last
        this.ave = data.outlineData.ave
        this.top = data.outlineData.top
        this.low = data.outlineData.low
        this.topPre = data.outlineData.topPre
        this.lowPre = data.outlineData.lowPre
        this.startTime = data.outlineData.startTime
        this.endTime = data.outlineData.endTime
        this.statec=data.outlineData.statec
        let p
        this.content = ''
        for (let item of this.$t('bloodoxygen.day.'+this.statec)) {
          p = '<p>' + item + '</p>'
          this.content += p
        }
        this.init()
        this.setOption(this.options)
      } else {
        this.showData = false
      }
      this.emit.code = res.code
      // this.emit.time = this.sendTime
      this.$emit('daybloodoxygencode', this.emit)
    },
    init () {
      let _this = this
      this.chart = this.$echarts.init(document.getElementById(this.id))
      window.addEventListener('resize', function () {
        _this.chart = _this.chart.resize()
      })
    },
    setOption (option) {
      if (!this.chart) {
        return
      }
      this.chart.setOption(option)
    },
    dispose () {
      if (!this.chart) {
        return
      }
      this.chart.dispose()
      this.chart = null
    },
    contentToggle () {
      this.contentShow = !this.contentShow
    }
  },
  watch: {
    sendTime: function () {
      this.getDayDataInfo()
    }
  },
  beforeDestroy () {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  }
}
</script>
<style lang="stylus" scoped>
  @import '~styles/variable.styl'
  @import '~styles/CurrentData.styl'
  .cur_con_wrapper
    .cur_con
      .nodata
        text-indent 0.8rem
        margin-top 0.3rem
      .header
        display flex
        margin-bottom .2rem
        .warning
          display flex
          box-sizing border-box
          border 0.01rem solid $blueText
          border-radius .5rem
          position absolute
          display block
          padding .05rem .2rem
          top .4rem
          right .4rem
          .text
            font-size .3rem
            color $blueText
          .iconfont
            font-size .4rem
            color $blueText
          .num
            position absolute
            top -0.1rem
            right .2rem
            display block
            border-radius 1rem
            width .18rem
            height .18rem
            color #ffffff
            &.red
             background-color $redText
            &.orange
             background-color $orangeText
      .charts
        .item_list
          margin-bottom 0.4rem
          li
            // width 1.6rem
            // margin 0.3rem 0.2rem
      .assessment
        .assessment_list
          .level
            strong
              font-size0.6rem
              margin-bottom 0.08rem

</style>
