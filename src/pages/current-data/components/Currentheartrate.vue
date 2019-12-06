<template>
  <article class="cur_con_wrapper"
           ref="alerts">
    <div class="cur_con">
      <header class="header">
        <i class="iconfont">&#xe655;</i>
        <h2>{{$t('currentBox.heartrate')}}</h2>
        <div :class="['warning',warnstate]"
             :style="{'border-width':'1px'}"
             @click="showWran(warnings)">
          <i class="iconfont">&#xe601;</i>
          <span class="text">{{$t('tag.yujingjilu')}}</span>
          <span class="num">{{warnings}}</span>
          <!-- <span class="num" v-if="warnings > 0"></span> -->
        </div>
      </header>
      <p class="time">({{ startTime }} -- {{ endTime }})</p>
      <div class="charts">
        <div class="data">
          <keep-alive>
            <div class="chart"
                 :id="id"></div>
          </keep-alive>
        </div>
        <p class="tip_txt">*{{$t('tag.shipin')}}</p>
        <ul class="item_list">
          <li>
            <div :class="['value', lastRate.value !== '' && lastRate.color !== 'normal' ? lastRate.color : '' ]">
              <template v-if="lastRate.value !== ''">
                <strong>{{lastRate.value}}</strong>
                <i>bpm</i>
              </template>
              <template v-else>
                <strong>--</strong>
              </template>
            </div>
            <p class="title">
              {{$t('currentBox.heartrate')}}
            </p>
          </li>
          <li>
            <div :class="['value', aveHeartRate.value !== '' && aveHeartRate.color !== 'normal' ? aveHeartRate.color : '' ]">
              <template v-if="aveHeartRate.value !== ''">
                <strong>{{aveHeartRate.value}}</strong>
                <i>bpm</i>
              </template>
              <template v-else>
                <strong>--</strong>
              </template>
            </div>
            <div class="title">{{$t('tag.xinlv.pingjun')}}</div>
          </li>
          <li>
            <div :class="['value', topRate.value !== '' && topRate.color !== 'normal' ? topRate.color : '' ]">
              <template v-if="topRate.value !== ''">
                <strong>{{topRate.value}}</strong>
                <i>bpm</i>
              </template>
              <template v-else>
                <strong>--</strong>
              </template>
            </div>
            <p class="title">
              {{$t('tag.xinlv.jinrizuigao')}}
            </p>
          </li>
        </ul>
        <ul class="item_list">
          <li>
            <div :class="['value', lowRate.value !== '' && lowRate.color !== 'normal' ? lowRate.color : '' ]">
              <template v-if="lowRate.value !== ''">
                <strong>{{lowRate.value}}</strong>
                <i>bpm</i>
              </template>
              <template v-else>
                <strong>--</strong>
              </template>
            </div>
            <p class="title">{{$t('tag.xinlv.jinrizuidi')}}</p>
          </li>
          <li>
            <div :class="['value', topRatePre.value !== '' && topRatePre.color !== 'normal' ? topRatePre.color : '' ]">
              <template v-if="topRatePre.value !== ''">
                <strong>{{topRatePre.value}}</strong>
                <i>bpm</i>
              </template>
              <template v-else>
                <strong>--</strong>
              </template>
            </div>
            <p class="title">{{$t('tag.xinlv.zuorizuigao')}}</p>
          </li>
          <li>
            <div :class="['value', lowRatePre.value !== '' && lowRatePre.color !== 'normal' ? lowRatePre.color : '' ]">
              <template v-if="lowRatePre.value !== ''">
                <strong>{{lowRatePre.value}}</strong>
                <i>bpm</i>
              </template>
              <template v-else>
                <strong>--</strong>
              </template>
            </div>
            <p class="title">{{$t('tag.xinlv.zuorizuidi')}}</p>
          </li>
        </ul>
      </div>
      <div class="assessment">
        <header>
          <i class="iconfont">&#xe616;</i>
          <h2>{{$t('tag.xinlv.xinlvpinggu')}}</h2>
        </header>
        <ul class="assessment_list">
          <li>
            <div :class="['level', rateState.state !== '' && rateState.color !== 'normal' ? rateState.color : '' ]">
              <template v-if="rateState.state !== ''">
                <strong>{{rateState.state}}</strong>
                <span>{{$t('tag.ji')}}</span>
              </template>
              <template v-else>
                <strong>--</strong>
              </template>
            </div>
            <span>{{$t('tag.xinlv.jinrixinlvpinggu')}}</span>
          </li>
          <li>
            <div :class="['level', rateStatePre.state !== '' && rateStatePre.color !== 'normal' ? rateStatePre.color : '' ]">
              <template v-if="rateStatePre.state !== ''">
                <strong>{{rateStatePre.state}}</strong>
                <span>{{$t('tag.ji')}}</span>
              </template>
              <template v-else>
                <strong>--</strong>
              </template>
            </div>
            <span>{{$t('tag.xinlv.zuorixinlvpinggu')}}</span>
          </li>
        </ul>
      </div>
      <div class="read">
        <header>
          <i class="iconfont">&#xe61d;</i>
          <h2>{{$t('tag.canshujiedu')}}</h2>
        </header>
        <div class="content">
          <h3>{{randomTitle.title}}</h3>
          <div :class="['article',contentShow ? 'show' : 'hidden']"
               v-html="randomTitle.content"></div>
          <div :class="['mask',contentShow ? 'show' : 'hidden']"
               @click="contentToggle">
            <i class="iconfont"
               v-show="!contentShow">&#xe632;</i>
            <i class="iconfont"
               v-show="contentShow">&#xe633;</i>
          </div>
        </div>
      </div>
      <div class="silder">
        <i class="iconfont"
           @click="goBack">&#xe669;</i>
        <i class="iconfont tip"
           @click="showTip">&#xe6ca;</i>
        <i class="iconfont"
           @click="scrollTop">&#xe634;</i>
      </div>
    </div>
    <!-- <modal-tip title="心率评级小贴士" :visible.sync="tipShow">
      <template slot="content">
        <div class="modal-box">
          <p>
          心率健康从A级到E级递减，A级最健康，也是推荐健康人群最好要达到的级别，而E级则是最危险的心率。心率到达C级或更低就一定要进行心率管理了。大量临床观察证实，如果患者的心率达标，不仅能大大减少猝死、心肌梗死、脑卒中等恶性事件的发生，还能有效提高患者的生活质量。
          </p>
          <p>
            一般建议，普通高血压患者，心率超过每分钟70次就必须考虑进行心率管理，适当降低心率。高血压合并冠心病或心力衰竭的患者，最佳心率为55-70次/分，有利于患者的长期预后。
          </p>
        </div>
      </template>
    </modal-tip> -->
    <!-- <modal-tip title="预警次数" :visible.sync="wranTip">
      <template slot="content">
        <ul class="modal-list">
          <li>
            <span class="time">预警时间</span>
            <span>预警心率</span>
          </li>
          <li v-for="item of wranList" :key="item.time" :class="item.color">
            <span class="time">{{item.time}}</span>
            <span>{{item.rate}}</span>
          </li>
        </ul>
      </template>
    </modal-tip> -->
  </article>
</template>
<script>
export default {
  name: 'CurrentHeartrate',
  props: {
    current: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      id: 'CurrentHeartrate',
      heartrateTime: [],
      heartrateValue: [],
      warnings: 0,
      warnstate: '',
      rateState: {},
      rateStatePre: {},
      lastRate: {},
      aveHeartRate: {},
      topRate: {},
      lowRate: {},
      topRatePre: {},
      lowRatePre: {},
      startTime: '00:00',
      endTime: '23:59',
      contentShow: false,
      tipShow: false,
      wranTip: false,
      wranList: [],
      contentRandom: this.$t('tag.canshujieduContent.xinlv'),
      plugValue: {
        warnList: [],
        title:this.$t('components.warnTitle'),
        time:this.$t('components.warnTime'),
        rate:this.$t('components.warnRate')
      }
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
    },
    randomTitle () {
      return this.contentRandom[Math.round(Math.random() * (this.contentRandom.length - 1))]
    }
  },
  methods: {
    getCurrentDataInfo () {
      console.log('心率时间===' + this.current)
      let postData = {
        userid: this.$route.params.userID,
        friendid: this.$route.params.friendID,
        token: this.$route.params.token,
        current: this.current
      }
      this.$axios.getCurrentHeartrate(postData).then(this.getCurrentDataInfoSucc)
    },
    getCurrentDataInfoSucc (res) {
      if (res.code === 0 && res.data) {
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
        this.rateStatePre = data.outlineData.rateStatePre
        this.lastRate = data.outlineData.lastRate
        this.aveHeartRate = data.outlineData.aveHeartRate
        this.topRate = data.outlineData.topRate
        this.lowRate = data.outlineData.lowRate
        this.topRatePre = data.outlineData.topRatePre
        this.lowRatePre = data.outlineData.lowRatePre
        this.startTime = data.outlineData.startTime
        this.endTime = data.outlineData.endTime
        this.init()
        this.setOption(this.options)
      }
    },
    getwarnsList () {
      // console.log('警告时间===' + this.current)
      let postData = {
        date: this.sendTime,
        userid: this.$route.params.userID,
        friendid: this.$route.params.friendID,
        token: this.$route.params.token,
        current: this.current
      }
      this.$axios.getCurrentWarn(postData).then((res) => {
        if (res.code === 0 && res.data) {
          const data = res.data
          this.plugValue.warnList = data.List
        }
      })
    },
    showWran (wranings) {
      this.getwarnsList()
      if (wranings > 0) {
        this.$alertPl.show({
          // el: this.$refs.alerts,
          comp: 'warnList',
          plugVal: this.plugValue,
          confirmMsg: this.$t('tag.guanbi')
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
    goBack () {
      this.$router.go(-1)
    },
    scrollTop () {
      window.scrollTo(0, 0)
    },
    showTip () {
      this.$alertPl.show({
        // el: this.$refs.alerts,
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
@import '~styles/variable.styl';
@import '~styles/CurrentData.styl';

.modal-list {
  li {
    color: #333;
    padding: 0.1rem 0.2rem 0.1rem 0;
    margin: 0;
    display: flex;

    &:nth-of-type(odd) {
      background: #efefef;
    }

    &:nth-of-type(even) {
      background: #fff;
    }

    span {
      display: block;
      flex: 1;
      text-align: center;
      font-size: 0.24rem;

      &.time {
        flex: 2;
      }
    }
  }

  .red {
    color: $redText;
  }

  .normal {
    color: #333;
  }
}

.cur_con_wrapper {
  .cur_con {
    .time {
      font-size: 0.26rem;
      text-indent: 0.8rem;
      margin-top: -0.1rem;
    }

    .header {
      display: flex;
      margin-bottom: 0.2rem;

      .warning {
        display: flex;
        box-sizing: border-box;
        justify-content: space-around;
        border: solid $grayText;
        border-radius: 0.1rem;
        position: absolute;
        display: block;
        padding: 0.05rem 0.1rem;
        top: 0.4rem;
        right: 0.1rem;
        color: $grayText;

        .text {
          vertical-align: middle;
          font-size: 0.24rem;
        }

        .iconfont {
          font-size: 0.3rem;
          margin: 0;
          color: $grayText;
        }

        .num {
          font-size: 0.24rem;
          line-height: 0.3rem;
          display: inline-block;
          border-radius: 0.03rem;
          padding: 0 0.08rem;
          height: 0.3rem;
          color: #ffffff;
          text-align: center;
          background: $grayText;
        }

        &.red {
          color: $redText;
          border: solid $redText;

          .num {
            background: $redText;
          }

          .iconfont {
            color: $redText;
          }
        }

        &.orange {
          color: $orangeText;
          border: solid $orangeText;

          .num {
            background: $orangeText;
          }

          .iconfont {
            color: $orangeText;
          }
        }
      }
    }

    .charts {
      .item_list {
        width: 100%;

        li {
          width: 33.33%;
          // margin 0.3rem 0.2rem
        }
      }
    }

    .assessment {
      .assessment_list {
        .level {
          &.normal {
            color: #333;
          }

          strong {
            font-size: 0.6rem;
            margin-bottom: 0.08rem;
          }
        }
      }
    }
  }
}
</style>
