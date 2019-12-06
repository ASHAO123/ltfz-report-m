<template>
  <article class="cur_con_wrapper" ref="alerts">
    <div class="cur_con">
      <header class="header">
        <i class="iconfont">&#xe655;</i>
        <h2>{{$t('title.heartrate')}}</h2>
        <div v-show="showData" :style="{'border-width':'1px'}" :class="['warning',warnstate]" @click="showWarn(warnings)">
          <i class="iconfont">&#xe601;</i>
          <span class="text">{{$t('tag.yujingjilu')}}</span>
          <span class="num">{{warnings}}</span>
        </div>
      </header>
      <p class="time" v-show="showData">({{ startTime }} -- {{ endTime }})</p>
      <div v-show="showData">
        <div class="charts">
          <div class="data">
            <keep-alive>
              <div class="chart" :id="id"></div>
            </keep-alive>
          </div>
          <p class="tip_txt">*{{$t('tag.shipin')}}</p>
          <div class="circle">
            <div :class="['value', aveHeartRate.value !== '' && aveHeartRate.color !== 'normal' ? aveHeartRate.color : '' ]">
              <template v-if="aveHeartRate.value !== ''">
                <strong>{{aveHeartRate.value}}</strong>
                <i>bpm</i>
              </template>
              <template v-else>
                --
              </template>
            </div>
            <div class="title">
              {{$t('tag.xinlv.quantianpingjun')}}
            </div>
          </div>
          <ul class="item_list">
              <li>
                <div :class="['value', topRate.value !== '' && topRate.color !== 'normal' ? topRate.color : '' ]">
                  <template v-if="topRate.value !== ''">
                    <strong>{{topRate.value}}</strong>
                    <i>bpm</i>
                  </template>
                  <template v-else>
                    --
                  </template>
                </div>
                <p class="title">{{$t('tag.xinlv.zuigao')}}</p>
              </li>
              <li>
                <div :class="['value', lowRate.value !== '' && lowRate.color !== 'normal' ? lowRate.color : '' ]">
                  <template v-if="lowRate.value !== ''">
                    <strong>{{lowRate.value}}</strong>
                    <i>bpm</i>
                  </template>
                  <template v-else>
                    --
                  </template>
                </div>
                <p class="title">{{$t('tag.xinlv.zuidi')}}</p>
              </li>
          </ul>
          <ul class="item_list">
              <li>
                <div :class="['value', nightAveHeartRate.value !== '' && nightAveHeartRate.color !== 'normal' ? nightAveHeartRate.color : '' ]">
                  <template v-if="nightAveHeartRate.value !== ''">
                    <strong>{{nightAveHeartRate.value}}</strong>
                    <i>bpm</i>
                  </template>
                  <template v-else>
                    --
                  </template>
                </div>
                <p class="title">{{$t('tag.xinlv.yejianpingjun')}}</p>
              </li>
              <li>
                <div :class="['value', dayAveHeartRate.value !== '' && dayAveHeartRate.color !== 'normal' ? dayAveHeartRate.color : '' ]">
                  <template v-if="dayAveHeartRate.value !== ''">
                    <strong>{{dayAveHeartRate.value}}</strong>
                    <i>bpm</i>
                  </template>
                  <template v-else>
                    --
                  </template>
                </div>
                <div class="title">{{$t('tag.xinlv.rijianpingjun')}}</div>
              </li>
          </ul>
        </div>
        <div class="assessment">
          <header>
            <i class="iconfont">&#xe616;</i>
            <h2>{{$t('title.secondaryTitle.xinlvPG')}}</h2>
          </header>
          <ul class="assessment_list">
            <li>
              <div :class="['level', rateState.state !== '' && rateState.color !== 'normal' ? rateState.color : '' ]">
                <template v-if="rateState.state !== ''">
                  <strong>{{rateState.state}}</strong>
                  <span>{{$t('tag.ji')}}</span>
                </template>
                <template v-else>
                  --
                </template>
              </div>
              <span>{{$t('tag.xinlv.jinrixinlvpinggu')}}</span>
            </li>
            <li>
              <div class="smalltips">
                <i class="iconfont tip" @click="showTip">&#xe6ca;</i>
                <span>{{$t('tag.tieshi')}}</span>
              </div>
            </li>
          </ul>
        </div>
        <div class="read">
          <header>
            <i class="iconfont">&#xe61d;</i>
            <h2>{{$t('title.secondaryTitle.xinlvReport')}}</h2>
          </header>
          <div class="content">
            <div :class="['article',contentShow ? 'show' : 'hidden']" v-html="content"></div>
            <div :class="['mask',contentShow ? 'show' : 'hidden']" @click="contentToggle">
              <i class="iconfont" v-show="!contentShow">&#xe632;</i>
              <i class="iconfont" v-show="contentShow">&#xe633;</i>
            </div>
          </div>
        </div>
      </div>
      <p v-show="!showData" class="nodata">{{$t('tag.xinlv.noday')}}</p>
    </div>
  </article>
</template>
<script>
export default {
  name: 'dayHeartrate',
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
      id: 'dayHeartrate',
      heartrateTime: [],
      heartrateValue: [],
      warnings: 0,
      warnstate: '',
      rateState: {},
      lastRate: {},
      aveHeartRate: {},
      topRate: {},
      lowRate: {},
      nightAveHeartRate: {},
      dayAveHeartRate: {},
      startTime: '00:00',
      endTime: '23:59',
      contentShow: false,
      tipShow: false,
      warnTip: false,
      content: '',
      plugValue: {
        warnList: [],
        title:this.$t('components.warnTitle'),
        time:this.$t('components.warnTime'),
        rate:this.$t('components.warnRate')
      },
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
  watch: {
    sendTime: function () {
      this.getDayDataInfo()
    }
  },
  computed: {
    options () {
      return {
        series: {
          type: 'line',
          sampling: 'average',
          data: this.heartrateValue
        },
        color: '#3596ea',
        grid: {
          containLabel: true,
          top: 20,
          bottom: 10,
          left: 0,
          right: 0
        },
        dataZoom: [{
          type: 'inside',
          start: 10,
          end: 70
        }],
        tooltip: {
          trigger: 'axis',
          formatter: function (params) {
            let val = Number(params[0].value)
            let time = params[0].axisValue
            let res = ` ${time}<br/> ${val} bpm`
            return res
          }
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
          data: this.heartrateTime
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
            show: false
          },
          axisTick: {
            show: false
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
      this.$axios.getDayheartrate(postData).then(this.getDayDataInfoSucc)
    },
    getDayDataInfoSucc (res) {
      if (res.code === 0 && res.data) {
        this.showData = true
        const data = res.data
        this.heartrateTime = []
        this.heartrateValue = []
        for (let item of data.echarts) {
          this.heartrateTime.push(item.time)
          this.heartrateValue.push(item.rate)
        }
        this.warnings = data.outlineData.warnings
        this.warnstate = data.outlineData.warnstate
        this.rateState = data.outlineData.rateState
        this.aveHeartRate = data.outlineData.aveHeartRate
        this.topRate = data.outlineData.topRate
        this.lowRate = data.outlineData.lowRate
        this.nightAveHeartRate = data.outlineData.nightAveHeartRate
        this.dayAveHeartRate = data.outlineData.dayAveHeartRate
        this.startTime = data.outlineData.startTime
        this.endTime = data.outlineData.endTime
        this.statec=data.outlineData.statec
        let p
        this.content = ''
        for (let item of this.$t('heartrate.day.'+this.statec)) {
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
      // this.emit.htFlag = this.showData
      this.$emit('dayheartratecode', this.emit)
    },
    getwarnsList () {
      let postData = {
        date: this.sendTime,
        userid: this.$route.params.userID,
        friendid: this.$route.params.friendID,
        token: this.$route.params.token
      }
      this.$axios.getDaywarn(postData).then((res) => {
        if (res.code === 0 && res.data) {
          const data = res.data
          this.plugValue.warnList = data.List
        }
      })
    },
    showWarn (warnings) {
      this.getwarnsList()
      if (warnings > 0) {
        this.$alertPl.show({
          comp: 'warnList',
          plugVal: this.plugValue,
          confirmMsg: this.$t('tag.guanbi'),
        })
      }
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
    },
    showTip () {
      this.$alertPl.show({
        title: this.$t('tag.xiaotieshi.xinlv.title'),
        confirmMsg: this.$t('tag.guanbi'),
        text: this.$t('tag.xiaotieshi.xinlv.text')
      })
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
  .modal-list
    li
      color: #333;
      padding: .1rem .2rem .1rem 0;
      margin: 0;
      display: flex;
      &:nth-of-type(odd){ background:#efefef;}
      &:nth-of-type(even){ background:#fff;}
      span
        display: block;
        flex: 1;
        text-align: center;
        font-size: .24rem;
        &.time
          flex: 2
    .red
      color: $redText;
    .normal
      color: #333;
  .cur_con_wrapper
    .cur_con
      .nodata
        text-indent 0.8rem
        margin-top 0.3rem
      .time
        font-size 0.26rem
        text-indent 0.8rem
        margin-top -0.1rem
      .header
        display: flex;
        margin-bottom: .2rem;
        .warning
          display: flex;
          box-sizing: border-box;
          justify-content space-around
          border:solid $grayText;
          border-radius: .1rem;
          position: absolute;
          display: block;
          padding: .05rem .1rem;
          top: .4rem;
          right: .1rem;
          color $grayText
          .text
            vertical-align: middle;
            font-size .24rem
          .iconfont
            font-size .3rem
            margin 0
            color $grayText
          .num
            font-size 0.24rem
            line-height .3rem
            display: inline-block;
            border-radius: 0.03rem;
            padding:0 0.08rem
            height: .3rem;
            color: #ffffff;
            text-align center
            background $grayText
          &.red
            color: $redText;
            border solid $redText
            .num
              background $redText
            .iconfont
              color: $redText;
          &.orange
            color: $orangeText
            border solid $orangeText
            .num
              background $orangeText
            .iconfont
              color: $orangeText;
      .charts
        .circle
          text-align center
          margin 0 auto
          .value
            box-sizing border-box
            width 1.8rem
            height 1.8rem
            line-height 1.8rem
            border-radius 50%
            border 4px solid #ff9a48
            margin .3rem auto .2rem
            &.red
              color $redText
            &.orange
              color $orangeText
            &.light-red
              color $lightRedText
            strong
              font-size 0.4rem
              font-weight bold
            i
              margin 0.14rem 0 0 0.02rem
              font-size 0.26rem
        .item_list
          li
            // width 2rem
            // margin 0.3rem
      .assessment
        .assessment_list
          .level
            &.normal
              color #333
            strong
              font-size 0.6rem
              margin-bottom 0.08rem

</style>
