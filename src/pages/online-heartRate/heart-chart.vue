<template>
  <div class="chart" ref="chart">
    <div class="echartTop">
      <span>{{$t('components.celiangTime')}}:{{time}}</span>
      <span class="removeDate" v-show="visible" @click="removeDate">{{$t('components.shanchu')}}</span>
    </div>
    <div class="draw_echarts">
      <div class="chart" :id="id"></div>
    </div>
    <p class="chartTip">*{{$t('tag.shipin')}}</p>
    <div class="parameter">
      <ul>
        <li class="item">
          <span :class="['value',top.color]">
            <template v-if="top.value!==''">
            <strong>{{top.value}}</strong>
            <i>bpm</i>
            </template>
            <template v-else>
              --
            </template>
          </span>
          <p class="title">{{$t('tag.xinlv.zuigao')}}</p>
        </li>
        <li class="item">
          <span :class="['value',low.color]">
            <template v-if="low.value!==''">
              <strong>{{low.value}}</strong>
              <i>bpm</i>
            </template>
            <template v-else>
              --
            </template>
          </span>
          <p class="title">{{$t('tag.xinlv.zuidi')}}</p>
        </li>
        <li class="item">
          <span :class="['value',ave.color]">
            <template v-if="ave.value!==''">
              <strong>{{ave.value}}</strong>
              <i>bpm</i>
            </template>
            <template v-else>
              --
            </template>
          </span>
          <p class="title">{{$t('tag.xinlv.pingjun')}}</p>
        </li>
      </ul>
    </div>
    <!-- <modal-tip title="错误提示" :visible.sync="wranTip"> -->
      <!-- <template slot="content">
        <ul class="modal-list">
          <li>
            <span class="p">数据格式错误</span>
          </li>
        </ul>
      </template>
    </modal-tip> -->
  </div>
</template>

<script>
export default {
  name: 'heart-rate',
  data () {
    return {
      wranTip: false,
      xdata: [],
      ydata: [],
      visible: true
    }
  },
  props: {
    heartdata: {
      type: Array,
      default: () => []
    },
    ave: {
      type: Object,
      default: () => {}
    },
    top: {
      type: Object,
      default: () => {}
    },
    low: {
      type: Object,
      default: () => {}
    },
    id: {
      type: Number,
      default: 0
    },
    time: {
      type: String,
      default: ''
    }
  },
  computed: {
    options () {
      return {
        series: {
          type: 'line',
          max: 180,
          sampling: 'average',
          data: this.ydata
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
          start: 0,
          end: 100
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
          data: this.xdata
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
  mounted () {
    if (this.$route.params.friendID !== '0') {
      this.visible = false
    } else if (this.$route.params.friendID === '0') {
      this.visible = true
    }
    this.$nextTick(function () {
      // this.xS()
      this.getEcchartsInffo()
      this.drawChart()
    })
  },
  updated () {
  },
  methods: {
    getEcchartsInffo () {
      for (let i in this.heartdata) {
        this.ydata.push(this.heartdata[i].rate)
        this.xdata.push(this.heartdata[i].time)
      }
      // console.log('y轴' + this.xdata)
    },
    removeDate () {
      let postData = {
        date: this.time,
        userid: this.$route.params.userID,
        friendid: this.$route.params.friendID,
        token: this.$route.params.token
      }
      this.$refs.chart.remove()
      this.$axios.remodeOnlineHeart(postData).then(() => {
        // console.log('删了')
      })
    },
    drawChart () {
      this.init()
      this.setOption(this.options)
    },
    init () {
      let _this = this
      this.chart = this.$echarts.init(document.getElementById(this.id), 'light')
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
    }

  }
}
</script>
<style lang="stylus" scoped>
@import '~styles/variable.styl';
@import '~styles/global.styl'
.chart
  padding-bottom .5rem
  .echartTop
    font-size .26rem
    margin-top .3rem
    display flex
    flex-flow row nowrap
    justify-content space-between
    .removeDate
      color red
  .chartTip
    font-size 0.28rem
    color #ccc
    text-align right
    margin 0 .1rem .1rem
  .draw_echarts
    margin .2rem 0 .1rem
    // background url('~images/bg_Chart.png')
    // background-size 6.04rem 6.22rem
    display flex
    height 4rem
    .chart
      width 100%
      height 100%
  .parameter
    display flex
    flex-flow column
    ul
      padding .3rem 0
      // background-color #ebf0f6
      display flex
      flex-flow row nowrap
      justify-content space-around
      justify-content space-around
      align-items center
      li
        display flex
        flex-flow column nowrap
        align-items center
        .value
          &.red
            color $redText
          &.orange
            color $orangeText

          .iconfont
            font-size .4rem
            color #1afa29
          strong
            font-size 0.4rem
            font-weight bold
          i
            margin 0.14rem 0 0 0.02rem
            font-size 0.24rem
        .title
          font-size 0.26rem
          color #707070
          margin-top .3rem
</style>
