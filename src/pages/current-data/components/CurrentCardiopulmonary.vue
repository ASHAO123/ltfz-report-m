<template>
  <article class="cur_con_wrapper">
    <div class="cur_con">
      <header class="header">
        <i class="iconfont">&#xe619;</i>
        <h2>{{$t('title.xinfei')}}<span>({{ startTime }} -- {{ endTime }})</span></h2>
      </header>
      <div class="charts">
        <div class="data">
          <keep-alive>
            <div class="chart" :id="id"></div>
          </keep-alive>
        </div>
        <p class="tip_txt">*{{$t('tag.shipin')}}</p>
        <ul class="item_list">
            <li>
              <div :class="['value', last.value !== '' && last.color !== 'normal' ? last.color : '' ]">
                <template v-if="last.value !== ''">
                  <strong>{{$t('tag.'+statec)}}</strong>
                </template>
                <template v-else>
                  <strong>--</strong>
                </template>
              </div>
              <p class="title">
                {{$t('tag.xinfei.todayxinfei')}}
              </p>
            </li>
            <li>
              <div :class="['value', pre.value !== '' && pre.color !== 'normal' ? pre.color : '' ]">
                <template v-if="pre.value !== ''">
                  <strong>{{$t('tag.'+perstatec )}}</strong>
                </template>
                <template v-else>
                  <strong>--</strong>
                </template>
              </div>
              <p class="title">
                {{$t('tag.xinfei.yesxinfei')}}
              </p>
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
  name: 'CurrentCardiopulmonary',
  props: {
    current: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      id: 'cardiopulmonary',
      timeData: [],
      lastData: [],
      last: {},
      pre: {},
      statec:'',
      perstatec :'',
      startTime: '00:00',
      endTime: '23:59',
      contentShow: false,
      contentRandom:this.$t('tag.canshujieduContent.xinfei') 
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
          }
        },
        dataZoom: [{
          type: 'inside',
          start: 0,
          end: 70
        }],
        tooltip: {
          trigger: 'axis',
          // formatter:'{b0}<br /> {c0}'
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
          data: this.lastData,
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
    },
    randomTitle () {
      return this.contentRandom[Math.round(Math.random() * (this.contentRandom.length - 1))]
    }
  },
  methods: {
    getCurrentDataInfo () {
      console.log('心肺时间===' + this.current)
      let postData = {
        userid: this.$route.params.userID,
        friendid: this.$route.params.friendID,
        token: this.$route.params.token,
        current: this.current
      }
      this.$axios.getCurrentCardiopulmonary(postData).then(this.getCurrentDataInfoSucc)
    },
    getCurrentDataInfoSucc (res) {
      if (res.code === 0 && res.data) {
        const data = res.data
        this.timeData = []
        this.lastData = []

        this.timeData = data.time
        this.lastData = data.echarts
        this.last = data.last
        this.pre = data.pre
        this.startTime = data.startTime
        this.endTime = data.endTime

        this.statec=data.statec
        this.perstatec =data.perstatec 
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
  // .cur_con_wrapper
  //   .cur_con
  //     .read
  //       margin-top 0.4rem
</style>
