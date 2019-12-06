<template>
  <article class="con_wrap">
    <div class="report_item_wrapper">
      <div class="report_header">
        <div class="item_title">
          <i class="iconfont">&#xe655;</i>
          <span>{{$t('currentBox.hrhy')}}</span>
          <span class="srart_end_time"></span>
        </div>
        <div class="others">
        </div>
      </div>
      <div v-show="heartShow">
        <heart-rate
          v-for="(item, index) in list"
          :heartdata="item.echarts"
          :key="index"
          :top="item.top"
          :low="item.low"
          :ave="item.ave"
          :time="item.start"
          :id="index"
          >
        </heart-rate>
      </div>
      <div  class="noheartChart" v-show="!heartShow">
        <p>
          {{$t('components.wuxinlv')}}
        </p>
      </div>
    </div>
  </article>
</template>
<script>
import heartRate from './heart-chart.vue'
export default {
  name: 'onlineheart',
  props: {
    current: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      list: [],
      datePickerShow: false,
      heartShow: true,
      regularDate: ''

    }
  },
  mounted () {
    // this.getCurrentDataInfo()
    this.newdate()
  },
  methods: {
    dialogVisible () {
      this.datePickerShow = true
    },
    newdate () {
      let dt = new Date()
      let y = dt.getFullYear()
      let m = (dt.getMonth() + 1)
      let d = dt.getDate()
      m = m > 9 ? m : '0' + m
      this.regularDate = y + '-' + m + '-' + d
      // console.log(this.regularDate)
    },
    getCurrentDataInfo () {
      let postData = {
        date: this.regularDate,
        userid: this.$route.params.userID,
        friendid: this.$route.params.friendID,
        token: this.$route.params.token,
        current: this.current
      }
      // 心律接口
      this.$axios.getOnlineHeartRate(postData).then(this.getCurrentDataInfoSucc)
    },
    getCurrentDataInfoSucc (res) {
      if (res.code === 0 && res.data) {
        this.heartShow = true
        const data = res.data
        this.list = data
        // console.log(this.list)
      } else if (res.code === 999) {
        this.heartShow = false
      }
    }
  },
  components: {
    'heart-rate': heartRate
  },
  watch: {
    regularDate: function () {
      this.getCurrentDataInfo()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
@import '~styles/variable.styl';
@import '~styles/global.styl'

.con_wrap
  width 100%
  height 100%
  .report_item_wrapper
    .report_header .item_title .iconfont
      font-size 0.5rem;
      color $blueText
    .noheartChart
      margin .4rem 0
      display flex
      justify-content center
      align-items center
      p
        font-size .32rem
        strong
          font-weight bold
</style>
