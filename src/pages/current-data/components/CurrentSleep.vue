<template>
  <article class="cur_con_wrapper">
    <div class="cur_con">
      <header class="header">
        <i class="iconfont">&#xe775;</i>
        <h2>{{$t('title.sleep')}}<span>({{ startTime }} -- {{ endTime }})</span></h2>
        <div class="level">
          <h3>{{$t('currentBox.usersleep')}}</h3>
          <strong :class="this.sleepColor">{{$t('tag.'+statec)}}</strong>
        </div>
      </header>
      <div class="charts">
        <div class="data">
          <keep-alive>
            <div class="chart" :id="id"></div>
          </keep-alive>
        </div>
        <div class="xA">
          <span>{{startTime}}</span>
          <span>{{endTime}}</span>
        </div>
        <ul class="item_list">
            <li>
              <div class="value">
                <strong>{{deps_hour}}</strong>
                <i>{{$t('tag.xiaoshi')}}</i>
                <strong>{{deps_min}}</strong>
                <i>{{$t('tag.fen')}}</i>
              </div>
              <div class="title">
                <i class="dep"></i>
                <span>{{$t('tag.sleep.deepSleep')}}</span>
              </div>
            </li>
            <li>
              <div class="value">
                <strong>{{lghs_hour}}</strong>
                <i>{{$t('tag.xiaoshi')}}</i>
                <strong>{{lghs_min}}</strong>
                <i>{{$t('tag.fen')}}</i>
              </div>
              <div class="title">
                <i class="lghs"></i>
                <span>{{$t('tag.sleep.lightSleep')}}</span>
              </div>
            </li>
        </ul>
        <ul class="item_list">
            <li>
              <div class="value">
                <strong>{{waks_hour}}</strong>
                <i>{{$t('tag.xiaoshi')}}</i>
                <strong>{{waks_min}}</strong>
                <i>{{$t('tag.fen')}}</i>
              </div>
              <div class="title">
                <i class="waks"></i>
                <span>{{$t('tag.sleep.wakeSleep')}}</span>
              </div>
            </li>
            <li>
              <div class="value">
                <strong>{{tots_hour}}</strong>
                <i>{{$t('tag.xiaoshi')}}</i>
                <strong>{{tots_min}}</strong>
                <i>{{$t('tag.fen')}}</i>
              </div>
              <div class="title">
                <span>{{$t('tag.sleep.allTime')}}</span>
              </div>
            </li>
        </ul>
      </div>
      <div class="read">
        <header>
          <i class="iconfont">&#xe61d;</i>
          <h2>{{$t('title.canshujeidu')}}</h2>
        </header>
        <div class="content">
          <h3>{{randomTitle.title}}</h3>
          <div :class="['article',contentShow ? 'show' : 'hidden']" v-html="randomTitle.content"></div>
          <div :class="['mask',contentShow ? 'show' : 'hidden']" @click="contentToggle">
            <i class="iconfont" v-show="!contentShow">&#xe632;</i>
            <i class="iconfont" v-show="contentShow">&#xe633;</i>
          </div>
        </div>
      </div>
      <div class="silder">
        <i class="iconfont" @click="goBack">&#xe669;</i>
        <i class="iconfont" @click="scrollTop">&#xe634;</i>
      </div>
    </div>
  </article>
</template>
<script>
export default {
  name: 'CurrentSleep',
  props: {
    current: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      id: 'CurrentSleep',
      timeData: [],
      lastData: [],
      startTime: '00:00',
      endTime: '00:00',
      lghs_hour: '00',
      lghs_min: '00',
      tots_hour: '00',
      tots_min: '00',
      deps_hour: '00',
      deps_min: '00',
      waks_hour: '00',
      waks_min: '00',
      sleepState: 3,
      sleepLevel: '',
      sleepColor: '',
      contentShow: false,
      tipShow: false,
      statec:'',
      contentRandom:this.$t('tag.canshujieduContent.sleep') ,
      // name:
    }
  },
  mounted () {
    this.getCurrentDataInfo()
    var echartsDom = document.getElementById(this.id)
    var contentHeight = window.getComputedStyle(echartsDom).height
    var contentWidth = window.getComputedStyle(echartsDom).width
    echartsDom.style.height = contentHeight
    echartsDom.style.width = contentWidth
  },
  computed: {
    options () {
      return {
        grid: {
          containLabel: true,
          top: 30,
          bottom: 10,
          left: -30,
          right: 0
        },
        color: ['#e2e5fd', '#9da8ff', '#5f6fd0'],
        xAxis: {
          type: 'category',
          data: this.timeData,
          show: false
        },
        yAxis: {
          show: false
        },
        tooltip: {
          trigger: 'axis',
          formatter:'{b}(min)',
          formatter: function (params) {
            // console.log(params)
            switch (params[0].value) {
              case '2': // 深睡
                return params[0].axisValue + '<br />' + params[0].seriesName.split(",")[0]
              case '1.5': // 浅睡
                return params[0].axisValue + '<br />' + params[0].seriesName.split(",")[1]
              case '1': // 清醒
              case '0':
                return params[0].axisValue + '<br />' + params[0].seriesName.split(",")[2]
            }
          },
          axisPointer: {
            animation: true
          }
        },
        series: [{
          name:this.$t('components.sleepname'),
          type: 'bar',
          barCategoryGap: '-3%',
          data: this.lastData,
          itemStyle: {
            color: function (params) {
              switch (params.data) {
                case '2':
                  return '#5f6fd0'
                case '1.5':
                  return '#9da8ff'
                default:
                  return '#e2e5fd'
              }
            }
          }

        }]
      }
    },
    randomTitle () {
      return this.contentRandom[Math.round(Math.random() * (this.contentRandom.length - 1))]
    }
  },
  methods: {
    // getSleepDataStyle (sq) {
    //   let data = null
    //   if (sq === 3) {
    //     data = {
    //       value: 1,
    //       itemStyle: {
    //         normal: {
    //           color: '#e2e5fd'
    //         }
    //       }
    //     }
    //   } else if (sq === 2) {
    //     data = {
    //       value: 2,
    //       itemStyle: {
    //         normal: {
    //           color: '#5f6fd0'
    //         }
    //       }
    //     }
    //   } else if (sq === 1) {
    //     data = {
    //       value: 1.5,
    //       itemStyle: {
    //         normal: {
    //           color: '#9da8ff'
    //         }
    //       }
    //     }
    //   }
    //   return data
    // },
    getCurrentDataInfo () {
      // console.log('睡眠时间===' + this.current)
      let postData = {
        userid: this.$route.params.userID,
        friendid: this.$route.params.friendID,
        token: this.$route.params.token,
        current: this.current
      }
      this.$axios.getCurrentUsersleep(postData).then(this.getCurrentDataInfoSucc)
    },
    getCurrentDataInfoSucc (res) {
      if (res.code === 0 && res.data) {
        const data = res.data
        this.timeData = []
        this.lastData = []

        for (let item of data.echarts) {
          this.timeData.push(item.time)
          this.lastData.push(item.sq)
          // console.log(this.lastData)
        }
        this.lghs_hour = data.outlineData.lghs_hour
        this.lghs_min = data.outlineData.lghs_min
        this.tots_hour = data.outlineData.tots_hour
        this.tots_min = data.outlineData.tots_min
        this.deps_hour = data.outlineData.deps_hour
        this.deps_min = data.outlineData.deps_min
        this.waks_hour = data.outlineData.waks_hour
        this.waks_min = data.outlineData.waks_min
        this.sleepState = data.outlineData.sleepState
        this.sleepLevel = data.outlineData.sleepLevel
        this.sleepColor = data.outlineData.sleepColor
        this.startTime = data.outlineData.startTime
        this.endTime = data.outlineData.endTime
        this.statec=data.outlineData.statec
        this.init()
        this.setOption(this.options)
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
    goBack () {
      this.$router.go(-1)
    },
    scrollTop () {
      window.scrollTo(0, 0)
    },
    showTip () {
      this.tipShow = true
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
      .header
        .level
          position: absolute;
          top: .48rem;
          right: .4rem;
          h3
            font-size: .34rem;
            margin-bottom: .1rem;
            font-weight: bold;
            margin-bottom: .2rem;
          strong
            display: flex;
            justify-content: flex-end;
            font-size: 0.34rem;
            font-weight: bold;
            &.normal
              color: $blueText
            &.orange
              color: $orangeText
            &.red
              color: $redText
          span
            font-size: 0.24rem;
            color: #707070;
      .charts
        .xA
          display: flex
          justify-content: space-between
          margin-top -.5rem
          margin-bottom .5rem
          font-size .24rem
          span
            display block
            color: $blueText
        .read
          // margin-top 0.4rem
        .item_list
          li
            .value
              color $blueText
            .title
              justify-content: center
              font-size 0.26rem
              color: #707070
              i
                display: inline-block
                margin-right .1rem
                width: .18rem
                height: .18rem
                &.dep
                  background-color #5f6fd0
                &.lghs
                  background-color #9da8ff
                &.waks
                  background-color #e2e5fd
</style>
