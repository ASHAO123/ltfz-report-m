<template>
  <article class="cur_con_wrapper">
    <div class="cur_con">
      <header class="header">
        <i class="iconfont">&#xe653;</i>
        <h2>{{$t('title.pilao')}}<span>({{ startTime }} -- {{ endTime }})</span></h2>
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
              <div :class="['value', today.value !== '' && today.color !== 'normal' ? today.color : '' ]">
                <template v-if="today.value !== ''">
                  <strong>{{today.value}}</strong>
                  <i>bpm</i>
                </template>
                <template v-else>
                  <strong>--</strong>
                </template>
              </div>
              <p class="title">
                {{$t('tag.xinlv.jinrijingxi')}}
              </p>
            </li>
            <li>
              <div :class="['value', yes.value !== '' && yes.color !== 'normal' ? yes.color : '' ]">
                <template v-if="yes.value !== ''">
                  <strong>{{yes.value}}</strong>
                  <i>bpm</i>
                </template>
                <template v-else>
                  <strong>--</strong>
                </template>
              </div>
              <p class="title">
                {{$t('tag.xinlv.zuorijingxi')}}
              </p>
            </li>
            <li>
              <div :class="['value', byes.value !== '' && byes.color !== 'normal' ? byes.color : '' ]">
                <template v-if="byes.value !== ''">
                  <strong>{{byes.value}}</strong>
                  <i>bpm</i>
                </template>
                <template v-else>
                  <strong>--</strong>
                </template>
              </div>
              <p class="title">
                {{$t('tag.xinlv.qiantianjingxi')}}
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
          <div class="msg" v-for="(item,index) in msg" :key=index>{{item}}</div>
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
  name: 'CurrentFat',
  props: {
    current: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      id: 'CurrentFat',
      timeData: '',
      rateLeft: [],
      rateRight: [],
      leftColor: '#d2e6ff',
      rightColor: '',
      today: '',
      yes: '',
      byes: '',
      msg: [],
      startTime: '12/01',
      endTime: '12/31',
      contentShow: false,
      contentRandom: this.$t('tag.canshujieduContent.fat'),
      statec:''
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
          data: this.timeData
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
    },
    randomTitle () {
      return this.contentRandom[Math.round(Math.random() * (this.contentRandom.length - 1))]
    }
  },
  methods: {
    getCurrentDataInfo () {
      console.log('疲劳时间===' + this.current)
      let postData = {
        userid: this.$route.params.userID,
        friendid: this.$route.params.friendID,
        token: this.$route.params.token,
        current: this.current
      }
      this.$axios.getCurrentFatiguemonitoring(postData).then(this.getCurrentDataInfoSucc)
    },
    getCurrentDataInfoSucc (res) {
      if (res.code === 0 && res.data) {
        const data = res.data
        this.timeData = []
        this.rateLeft = []
        this.rateRight = []

        this.today = data.outlineData.today
        this.yes = data.outlineData.yes
        this.byes = data.outlineData.byes

        this.statec=data.outlineData.statec
        this.msg = this.$t('fat.day.'+this.statec)
        this.startTime = data.outlineData.startTime
        this.endTime = data.outlineData.endTime
        this.rightColor = data.echarts.rateRight.color
        this.timeData = data.echarts.date
        this.rateLeft = data.echarts.rateLeft
        this.rateRight = data.echarts.rateRight.rate
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
  .content
    .msg
        margin: .2rem 0;
        text-indent: 0.6rem;
        text-align: justify;
        color: #707070;
        font-size: .3rem;
</style>
