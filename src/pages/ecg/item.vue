<template>
  <div class="ecg">
    <p> {{$t('tag.xindian.time')}}{{time}}</p>
    <div class="draw_echarts">
      <div class="chart" :id="id"></div>
    </div>
    <p class="chartTip">*{{$t('tag.shipin')}}</p>
    <div class="parameter">
      <ul>
        <li class="item">
          <span class="value">
            <template v-if="heart!==''">
            <strong>{{heart}}</strong>
            <i>bpm</i>
            </template>
            <template v-else>
              --
            </template>
          </span>
          <p class="title">{{$t('tag.xindian.xinlv')}}</p>
        </li>
        <li class="item">
          <span class="value">
            <template v-if="ox!==''">
              <strong>{{ox}}</strong>
              <i>%</i>
              <i class="iconfont">&#xe693;</i>
            </template>
            <template v-else>
              --
            </template>
          </span>
          <p class="title">{{$t('tag.xindian.xueyang')}}</p>
        </li>
        <!-- <li class="item">
          <span class="value">
            <template v-if="af!==''">
              <strong>{{af}}</strong>
            </template>
            <template v-else>
              --
            </template>
          </span>
          <p class="title">{{$t('tag.xindian.fangchan')}}</p>
        </li> -->
      </ul>
    </div>
    <modal-tip title="错误提示" :visible.sync="wranTip">
      <template slot="content">
        <ul class="modal-list">
          <li>
            <span class="p">数据格式错误</span>
          </li>
        </ul>
      </template>
    </modal-tip>
  </div>
</template>

<script>
export default {
  name: 'item',
  data () {
    return {
      ecgList: [],
      wranTip: false,
      xdata: []
    }
  },
  props: {
    ecgdata: {
      type: Array,
      default: () => []
    },
    heart: {
      type: String,
      default: ''
    },
    ox: {
      type: String,
      default: ''
    },
    af: {
      type: String,
      default: ''
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
          symbol: 'none',
          // sampling: 'average',
          itemStyle: {
            normal: {
              color: '#3596ea',
              lineStyle: {
                width: 1
              }
            }
          },
          data: this.ecgdata
        },
        color: '#3596ea',
        grid: {
          containLabel: true,
          top: 10,
          bottom: 10,
          left: 10,
          right: 10
        },
        xAxis: {
          type: 'category',
          axisLabel: {
            show: false
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitLine: {
            show: false
          },
          data: this.xdata
        },
        yAxis: [
          {
            type: 'value',
            axisLabel: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLine: {
              show: false
            },
            splitLine: {
              show: false
            }
          }

        ],
        dataZoom: [{
          type: 'inside',
          start: 30,
          // zoomLock: true,
          end: 45
        }]
      }
    }
  },
  created () {
    // this.getEcg()
    // console.log(this.ecgdata)
  },
  mounted () {
    // this.conversionEcgData()
    this.$nextTick(function () {
      this.xS()
      this.drawEcg()
    })
  },
  updated () {
    // this.drawEcg()
  },
  methods: {
    // 心电十六进制转10进制
    // conversionEcgData () {
    //   let len = this.ecgdata.length
    //   // let sub = 0
    //   let sen = ''
    //   let firstArr = []
    //   if (len % 3 !== 0) {
    //     this.wranTip = true
    //   } else {
    //     for (let i = 0; i < len; i += 3) {
    //       let s = this.ecgdata.substr(i, 3)
    //       let last = s.substr(1, 2)
    //       let fir = s.substr(0, 1)
    //       let v = parseInt(last, 16)
    //       if (fir === '0') {
    //         sen = -v / 1000
    //       } else if (fir === '1') {
    //         sen = v / 1000
    //       }
    //       firstArr.push(sen)
    //       this.xdata.push(i)
    //     }
    //   }
    // this.ecgList = firstArr
    // console.log('1000：' + this.ecgList)
    // },
    xS () {
      for (let i = 0; i < this.ecgdata.length; i++) {
        this.xdata.push(i)
      }
    },
    drawEcg () {
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
.ecg
  padding-bottom .5rem
  p
    font-size .26rem
    margin-top .3rem
  .chartTip
    font-size 0.28rem
    color #ccc
    text-align right
    margin 0 .1rem .1rem
  .draw_echarts
    margin .2rem 0 .1rem
    background url('~images/bg_ecg.png')
    background-size 6.04rem 6.22rem
    display flex
    height 2.6rem
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
          // &.normal
          //   color $blueText

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
