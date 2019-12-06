<template>
  <article class="cur_con_wrapper">
    <div class="cur_con">
      <header class="header">
        <i class="iconfont">&#xe611;</i>
        <h2>{{$t('title.sports')}}<span>({{ startTime }} -- {{ endTime }})</span></h2>
      </header>
      <div class="charts">
        <div class="data">
          <keep-alive>
            <div class="chart" :id="id"></div>
          </keep-alive>
        </div>
        <p class="tip_txt">*{{$t('tag.shipin')}}</p>
        <div class="cal">
          <div class="value">
            <strong>{{ cal }}</strong>
            <span>大卡</span>
          </div>
          <p class="title">{{$t('tag.sports.kaluli')}}</p>
        </div>
        <ul class="item_list">
            <li>
              <div :class="['value', steps !== '' ? 'normal' : '' ]">
                <template v-if="steps !== ''">
                  <strong>{{steps}}</strong>
                  <i>{{$t('tag.bu')}}</i>
                </template>
                <template v-else>
                  <strong>--</strong>
                </template>
              </div>
              <p class="title">
                {{$t('tag.sports.allStep')}}
              </p>
            </li>
            <li>
              <div :class="['value', ysteps !== '' ? 'normal' : '' ]">
                <template v-if="ysteps !== ''">
                  <strong>{{ysteps}}</strong>
                  <i>{{$t('tag.bu')}}</i>
                </template>
                <template v-else>
                  <strong>--</strong>
                </template>
              </div>
              <p class="title">
                {{$t('tag.sports.yesStep')}}
              </p>
            </li>
        </ul>
        <ul class="item_list">
            <li>
              <div :class="['value', distance !== '' ? 'normal' : '' ]">
                <template v-if="distance !== ''">
                  <strong>{{distance}}</strong>
                  <i>{{$t('tag.mile')}}</i>
                </template>
                <template v-else>
                  <strong>--</strong>
                </template>
              </div>
              <p class="title">
                {{$t('tag.sports.todayMile')}}
              </p>
            </li>
            <li>
              <div :class="['value', ydistance !== '' ? 'normal' : '' ]">
                <template v-if="ydistance !== ''">
                  <strong>{{ydistance}}</strong>
                  <i>{{$t('tag.mile')}}</i>
                </template>
                <template v-else>
                  <strong>--</strong>
                </template>
              </div>
              <p class="title">
                {{$t('tag.sports.yesMlie')}}
              </p>
            </li>
        </ul>
      </div>
      <div class="assessment">
        <header>
          <i class="iconfont">&#xe616;</i>
          <h2>{{$t('tag.sports.allStep')}}</h2>
        </header>
        <ul class="assessment_list">
          <li>
            <div :class="['level',muchColor]">
              <template v-if="muchValue !== ''">
                <!-- <div class="star">
                <template v-if="muchStar === 0"><span>0</span> <i class="iconfont">&#xe6c8;</i><span class="text">未达标</span></template>
                <template v-else-if="muchStar > 5"><span>{{muchStar}}</span> <i class="iconfont">&#xe6c8;</i><span class="text">达标</span></template>
                <template v-else>
                  <i class="iconfont" v-for="(starItem,i) of (parseInt(muchStar))" :key="i">&#xe6c8;</i><i class="iconfont" v-if="!Number.isInteger(muchStar)">&#xe6c9;</i><span class="text">达标</span>
                </template>
                </div> -->
                <div class="star">
                  <i class="iconfont" v-for="(starItem,i) of MstarsNum" :key="i">&#xe6c8;</i>
                  <i class="iconfont" v-if="!Number.isInteger(muchStar)">&#xe6c9;</i>
                  <span class="text">{{muchState}}</span>
                </div>
                <div>
                  <strong>{{muchValue}}</strong>
                  <span> {{$t('tag.bu')}}</span>
                </div>
              </template>
              <template v-else>
                <strong>--</strong>
              </template>
            </div>
            <p class="title">{{$t('tag.sports.todaySteps')}}</p>
          </li>
          <li>
            <div :class="['level',ymuchColor]">
              <template v-if="ymuchValue !== ''">
                <div class="star">
                  <i class="iconfont" v-for="(starItem,i) of YstarsNum" :key="i">&#xe6c8;</i>
                  <i class="iconfont" v-if="!Number.isInteger(ymuchStar)">&#xe6c9;</i>
                  <span class="text">{{ymachState}}</span>
                </div>
                <div>
                  <strong>{{ymuchValue}}</strong>
                  <span> {{$t('tag.bu')}}</span>
                </div>
              </template>
              <template v-else>
                <strong>--</strong>
              </template>
            </div>
            <p class="title">{{$t('tag.sports.yesSteps')}}</p>
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
const LIGHON = 'ON'
export default {
  name: 'CurrentSteps',
  props: {
    current: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      id: 'CurrentSteps',
      todayState: '',
      yState: '',
      halfStar: false,
      stepsTime: [],
      stepsValue: [],
      cal: '0',
      steps: '0',
      distance: '0',
      ysteps: '0',
      ydistance: '0',
      muchValue: '',
      muchColor: '',
      muchStar: 0,
      ymuchValue: '',
      ymuchColor: '',
      ymuchStar: 0,
      startTime: '00:00',
      endTime: '23:59',
      contentShow: false,
      contentRandom: this.$t('tag.canshujieduContent.steps')
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
    muchState () {
      return this.muchColor !== 'normal' ? this.$t('tag.weidabiao') : this.$t('tag.dabiao')
    },
    ymachState () {
      return this.ymuchColor !== 'normal' ? this.$t('tag.weidabiao') : this.$t('tag.dabiao')
    },
    MstarsNum () {
      let result = [] // 整颗的数量
      // let getStarnum = Math.floor(this.star * 2) / 2 // 原数
      let getIntnum = Math.floor(this.muchStar)
      for (let i = 1; i <= getIntnum; i++) {
        result.push(LIGHON)
      }
      return result
    },
    YstarsNum () {
      let result = []
      let getIntnum = Math.floor(this.ymuchStar)
      for (let i = 1; i <= getIntnum; i++) {
        result.push(LIGHON)
      }
      return result
    },
    options () {
      return {
        series: {
          name:this.$t('components.bushu'),
          barCategoryGap: '40%',
          type: 'bar',
          data: this.stepsValue
        },
        color: '#0082d6',
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
          data: this.stepsTime,
          axisLabel: {
            formatter: function (params) {
              return params + ':00'
            }
          }
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
          end: 90
        }],
        tooltip: {
          trigger: 'axis',
          // formatter: function (params) {
          //   let time = params[0].axisValue
          //   let steps = params[0].value
          //   let tip = steps ? time + ':00<br/>' +'总共走了' + steps + '步' : time + ':00<br/>' + '还没步数哦'
          //   return tip
          // }
        }
      }
    },
    randomTitle () {
      return this.contentRandom[Math.round(Math.random() * (this.contentRandom.length - 1))]
    }
  },
  methods: {
    getCurrentDataInfo () {
      // console.log('步数时间===' + this.current)
      let postData = {
        userid: this.$route.params.userID,
        friendid: this.$route.params.friendID,
        token: this.$route.params.token,
        current: this.current
      }
      this.$axios.getCurrentSteps(postData).then(this.getCurrentDataInfoSucc)
    },
    getCurrentDataInfoSucc (res) {
      if (res.code === 0 && res.data) {
        const data = res.data
        this.stepsTime = []
        this.stepsValue = []

        for (let item of data.echarts) {
          this.stepsTime.push(item.time)
          this.stepsValue.push(item.step)
        }
        this.cal = data.outlineData.cal
        this.steps = data.outlineData.steps
        this.ysteps = data.outlineData.ysteps
        this.distance = data.outlineData.distance
        this.ydistance = data.outlineData.ydistance
        this.muchValue = data.outlineData.much.value
        this.muchColor = data.outlineData.much.color
        this.muchStar = data.outlineData.much.star
        this.ymuchValue = data.outlineData.ymuch.value
        this.ymuchColor = data.outlineData.ymuch.color
        this.ymuchStar = data.outlineData.ymuch.star
        this.startTime = data.outlineData.startTime
        this.endTime = data.outlineData.endTime

        this.init()
        this.setOption(this.options)
      }
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
  .cur_con_wrapper
    .cur_con
      .charts
        .cal
          margin .6rem 0 .4rem 0
          text-align center
          .value
            margin 0 auto
            line-height 1.52rem
            border .08rem solid #f39800
            border-radius 1rem
            width 1.52rem
            height 1.52rem
            strong
              font-size .36rem
            span
              font-size .24rem
          .title
            margin-top .2rem
      .assessment
        .assessment_list
          li
            .level
              display flex
              flex-flow column
              padding-top 0.2rem
              &.red,&.red .iconfont
                color $redText
              &.orange,&.orange .iconfont
                color $orangeText
              &.normal,&.normal .iconfont
                color $blueText
              div
                margin-bottom 0.2rem
                strong
                  font-size 0.6rem
              .star
                margin 0 0 .2rem 0
                display flex
                .text
                  margin-left .2rem
                  font-size .24rem
                .iconfont
                  display inline-block
                  margin 0
                  font-size .3rem
</style>
