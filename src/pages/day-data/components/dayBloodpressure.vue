<template>
  <article class="cur_con_wrapper" ref="alerts">
    <div class="cur_con">
      <header class="header">
        <i class="iconfont">&#xe609;</i>
        <h2>{{$t('title.bloodpre')}}<span v-show="showData">({{ startTime }} -- {{ endTime }})</span></h2>
      </header>
      <div v-show="showData">
        <div class="charts">
          <div class="data">
            <keep-alive>
              <div class="chart" :id="id"></div>
            </keep-alive>
          </div>
          <p class="tip_txt">*{{$t('tag.shipin')}}</p>
          <div class="circle">
            <div :class="['value', ave.value !== '' && ave.color !== 'normal' ? ave.color : '' ]">
              <template v-if="ave.value !== ''">
                <strong>{{ave.value}}</strong>
                <i>mmHg</i>
              </template>
              <template v-else>
                --
              </template>
            </div>
            <div class="title">
              {{$t('tag.blood.todatAve')}}
            </div>
          </div>
        </div>
        <div class="assessment">
          <header>
            <i class="iconfont">&#xe616;</i>
            <h2>{{$t('title.secondaryTitle.bloodPG')}}</h2>
          </header>
          <ul class="assessment_list">
            <li>
              <div :class="['level', state.value !== '' ? state.color : '' ]">
                <template v-if="state.value !== ''">
                  <strong>{{$t('tag.blood.'+rating)}}</strong>
                </template>
                <template v-else>
                  --
                </template>
              </div>
              <span>{{$t('tag.blood.todayPG')}}</span>
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
            <h2>{{$t('title.secondaryTitle.bloodReport')}}</h2>
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
      <p v-show="!showData" class="nodata">{{$t('tag.blood.noday')}}</p>
    </div>
  </article>
</template>
<script>
export default {
  name: 'dayBloodpressure',
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
      id: 'dayBloodpressure',
      highPress: [],
      lowPress: [],
      last: {},
      ave: {},
      avePre: {},
      time: [],
      state: {},
      statePre: {},
      startTime: '00:00',
      endTime: '23:59',
      high: {},
      contentShow: false,
      tipShow: false,
      content: '',
      statec:'',
      rating:''
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
            // barWidth: '10%',
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
          data: this.time
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
          //   console.log(params)
          //   if (params[0].data != null && params[0].data.value !== null) {
          //     return `${params[0].axisValue} <br/>收缩压:${params[0].data.value}<br/>舒张压:${params[1].data.value} `
          //   } else {
          //     return `${params[0].axisValue}<br/>未检测到血压数据`
          //   }
          // }
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
      this.$axios.getDaybloodpressure(postData).then(this.getDayDataInfoSucc)
    },
    getDayDataInfoSucc (res) {
      if (res.code === 0 && res.data) {
        this.showData = true
        const data = res.data
        this.highPress = []
        this.lowPress = []
        this.time = []

        this.highPress = data.outlineData.highPress
        this.lowPress = data.outlineData.lowPress
        this.time = data.outlineData.time
        this.ave = data.outlineData.ave
        this.state = data.outlineData.state
        this.startTime = data.outlineData.startTime
        this.endTime = data.outlineData.endTime
        this.statec=data.outlineData.statec
        this.rating=data.outlineData.rating
        let p
        this.content = ''
        for (let item of this.$t('bloodpre.day.'+this.statec)) {
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
      // this.emit.bpFlag = this.showData
      this.$emit('daybloodpressurecode', this.emit)
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
        title:  this.$t('tag.xiaotieshi.blood.title'),
        confirmMsg: this.$t('tag.guanbi'),
        text: this.$t('tag.xiaotieshi.blood.text')
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
        .circle
          text-align center
          margin 0 auto
          .value
            box-sizing border-box
            width 1.8rem
            height 1.8rem
            display flex
            justify-content center
            flex-flow column nowrap
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
            width 2rem
            margin 0.3rem
      .assessment
        .assessment_list
          .level
            &.normal
              color #333
            strong
              font-size0.6rem
              margin-bottom 0.08rem

</style>
