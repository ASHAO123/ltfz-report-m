<template>
  <article class="cur_con_wrapper" ref="alerts">
    <div class="cur_con">
      <header class="header">
        <i class="iconfont">&#xe609;</i>
        <h2>{{$t('title.bloodpre')}}<span>({{ startTime }} -- {{ endTime }})</span></h2>
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
                  <strong>{{last.value}}</strong>
                  <i>mmHg</i>
                </template>
                <template v-else>
                  <strong>--</strong>
                </template>
              </div>
              <p class="title">
                {{$t('tag.blood.current')}}
              </p>
            </li>
            <li>
              <div :class="['value', high.value !== '' && high.color !== 'normal' ? high.color : '' ]">
                <template v-if="high.value !== ''">
                  <strong>{{high.value}}</strong>
                  <i>mmHg</i>
                </template>
                <template v-else>
                  <strong>--</strong>
                </template>
              </div>
              <p class="title">
                {{$t('tag.blood.todayTop')}}
              </p>
            </li>
        </ul>
        <ul class="item_list">
            <li>
              <div :class="['value', ave.value !== '' && ave.color !== 'normal' ? ave.color : '' ]">
                <template v-if="ave.value !== ''">
                  <strong>{{ave.value}}</strong>
                  <i>mmHg</i>
                </template>
                <template v-else>
                  <strong>--</strong>
                </template>
              </div>
              <p class="title">
                {{$t('tag.blood.todatAve')}}
              </p>
            </li>
            <li>
              <div :class="['value', avePre.value !== '' && avePre.color !== 'normal' ? avePre.color : '' ]">
                <template v-if="avePre.value !== ''">
                  <strong>{{avePre.value}}</strong>
                  <i>mmHg</i>
                </template>
                <template v-else>
                  <strong>--</strong>
                </template>
              </div>
              <p class="title">
                {{$t('tag.blood.yesAve')}}
              </p>
            </li>
        </ul>
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
                <strong>{{$t('tag.blood.'+statec)}}</strong>
              </template>
              <template v-else>
                <strong>--</strong>
              </template>
            </div>
            <span>{{$t('tag.blood.todayPG')}}</span>
          </li>
          <li>
            <div :class="['level', statePre.value !== '' ? statePre.color : '' ]">
              <template v-if="statePre.value !== ''">
                <strong>{{$t('tag.blood.'+perstatec)}}</strong>
              </template>
              <template v-else>
                <strong>--</strong>
              </template>
            </div>
            <span>{{$t('tag.blood.yesPG')}}</span>
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
        <i class="iconfont tip" @click="showTip">&#xe6ca;</i>
        <i class="iconfont" @click="scrollTop">&#xe634;</i>
      </div>
    </div>
    <!-- <modal-tip title="血压评级小贴士" :visible.sync="tipShow">
      <template slot="content">
        <div class="modal-box">
          <p>
            高血压病的分级，主要是依据血压的水平来进行分级。从一级到第三级逐渐递增，三级最最高。
          </p>
        </div>
      </template>
    </modal-tip> -->
  </article>
</template>
<script>
export default {
  name: 'CurrentBlood',
  props: {
    current: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      id: 'blood',
      highPress: [],
      lowPress: [],
      perstatec:'',
      statec:'',
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
      contentRandom: this.$t('tag.canshujieduContent.blood'),
      shousuoya:'收缩压',
      shuzhangya:this.$t('components.shuzhangya')
    }
  },
  mounted () {
    // this.$t('components.shousuoya')
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
          //   // console.log(this.shousuoya );
          //   if (params[0].data != null && params[0].data.value !== null) {
          //     return params[0].axisValue + '<br/>' +'收缩压：' + params[0].data.value + '<br/>' + '舒张压：' + params[1].data.value
          //   } else {
          //     return `${params[0].axisValue}<br/>未检测到血压数据`
          //   }
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
      // console.log('血压时间===' + this.current)
      let postData = {
        userid: this.$route.params.userID,
        friendid: this.$route.params.friendID,
        token: this.$route.params.token,
        current: this.current
      }
      this.$axios.getCurrentBloodpressure(postData).then(this.getCurrentDataInfoSucc)
    },
    getCurrentDataInfoSucc (res) {
      if (res.code === 0 && res.data) {
        const data = res.data
        this.highPress = []
        this.lowPress = []
        this.time = []

        this.highPress = data.outlineData.highPress
        this.lowPress = data.outlineData.lowPress
        this.time = data.outlineData.time
        this.last = data.outlineData.last
        this.ave = data.outlineData.ave
        this.avePre = data.outlineData.avePre
        this.state = data.outlineData.state
        this.statePre = data.outlineData.statePre
        this.startTime = data.outlineData.startTime
        this.endTime = data.outlineData.endTime
        this.high = data.outlineData.high
        this.perstatec=data.outlineData.perstatec
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
      this.$alertPl.show({
        // el: this.$refs.alerts,
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
        .assessment
          .assessment_list
            .level
              &.normal
                color #333
</style>
