<template>
  <div class="day-wrapper">
    <div class="date-picker-stage">
      <div class="date-picker-title">
        <input type="text" :value="regularDate"  readonly>
        <i class="iconfont" @click="openDatePicker">&#xe616;</i>
      </div>
      <transition name="calendar-fade">
        <keep-alive>
          <date-picker
            v-if="datePickerShow"
            @close="datePickerShow = false"
            v-model="regularDate"
            :max="nowDay"
            :min="minDay"
          ></date-picker>
        </keep-alive>
      </transition>
    </div>
    <div>
      <!--如果一组数据都没有，则页面显示的是无数据-->
      <div  v-show="!alldataFlag">
          <no-data @openPicker="datePickerShow = true" :sendNavtype="navtype"></no-data>
      </div>
       <!--如果存在至少一组数据，则页面显示的是各类图表数据-->
      <div  class="datasDiv" v-show="alldataFlag">

        <!-- 今日心率 -->
          <day-heartrate :sendTime="regularDate"   @dayheartratecode="ifHthasdata"></day-heartrate>
          <!-- 今日血压 -->
          <day-bloodpressure :sendTime="regularDate"  @daybloodpressurecode="ifBphasdata"></day-bloodpressure>
          <!-- 今日血糖 -->
          <day-bloodsugar :sendTime="regularDate" @daybloodsugarcode="ifBshasdata"></day-bloodsugar>
          <!-- 今日血氧 -->
          <day-bloodoxygen :sendTime="regularDate"  @daybloodoxygencode="ifBohasdata"></day-bloodoxygen>
          <!-- 今日体温 -->
          <day-bodytempera :sendTime="regularDate"  @daybodytemperacode="ifBthasdata"></day-bodytempera>
          <!-- 今日脏腑 -->
          <day-viscera :sendTime="regularDate"  @dayvisceracode="ifVihasdata"></day-viscera>
          <!-- 今日心肺 -->
          <day-heartlung :sendTime="regularDate"  @dayheartlungcode="ifHlhasdata"></day-heartlung>
          <!-- 今日睡眠 -->
          <day-sleep :sendTime="regularDate"  @daysleepcode="ifSlhasdata"></day-sleep>
          <!-- 今日疲劳 -->
          <day-weary :sendTime="regularDate" :showData="weFlag" @daywearycode="ifWehasdata"></day-weary>
          <!-- 今日运动 -->
          <day-sports :sendTime="regularDate" :showData="spFlag" @daysportscode="ifSphasdata"></day-sports>

      </div>
    </div>
  </div>
</template>
<script>
import noData from '../common/components/noData'
import { Loading } from 'element-ui'
import datePicker from './components/datePicker'
import dayHeartrate from './components/dayHeartrate'
import dayBloodpressure from './components/dayBloodpressure'
import dayBloodsugar from './components/dayBloodsugar'
import dayBloodoxygen from './components/dayBloodoxygen'
import dayBodytempera from './components/dayBodytempera'
import dayViscera from './components/dayViscera'
import dayHeartlung from './components/dayHeartlung'
import daySleep from './components/daySleep'
import dayWeary from './components/dayWeary'
import daySports from './components/daySports'
export default {
  name: 'dayData',
  props: {
    current: {
      type: String,
      default: ''
    }
  },
  components: {
    noData,
    datePicker,
    dayHeartrate,
    dayBloodpressure,
    dayBloodsugar,
    dayBloodoxygen,
    dayBodytempera,
    dayViscera,
    dayHeartlung,
    dayWeary,
    daySleep,
    daySports
  },
  data () {
    return {
      navtype: '日',
      options: {
        lock: true,
        text: '加载中...'
      },
      /**
         * 当所有flag全为false时，alldataFlag也为false，此时显示的是'无数据'页面
         * 当flag只要有一项为true时，alldataFlag就为true,此时显示的是数据图表
         */

      htFlag: true, // 心率
      bpFlag: true, // 血压
      bsFlag: true, // 血糖
      boFlag: true, // 血氧
      btFlag: true, // 体温
      viFlag: true, // 肺腑
      hlFlag: true, // 心肺
      slFlag: true, // 睡眠
      weFlag: true, // 疲劳
      spFlag: true, // 运动

      // 日历
      minDay: '',
      nowDay: '',
      maxDay: '',
      regularDate: '',
      datePickerShow: false
    }
  },
  beforecreate () {
    // 在这个地方进行loading 事件
    Loading.service(this.options)
  },
  created () {
    /**
     * 在这结束loading，做一些初始化，实现函数自执行
     * 比如请求昨天日期，上周日期，本月日期
     */
    let loadingInstance = Loading.service(this.options)
    this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
      loadingInstance.close()
    })

    this.getNowday()
    this.getDayDataInfo()
  },
  methods: {
    getNowday () { // 获取默认昨天日期，若是未能成功接收到后端maxDay,则最大值为this.nowDay
      let year = new Date().getFullYear()
      let month = Number(new Date().getMonth()) + 1
      month = month > 9 ? month : '0' + month
      let day = new Date().getDate() - 1
      this.nowDay = year + '-' + month + '-' + day
    },
    getDayDataInfo () {
      let postData = {
        userid: this.$route.params.userID,
        friendid: this.$route.params.friendID,
        token: this.$route.params.token,
        current: this.current
      }
      this.$axios.getDayDateStart(postData).then(this.getDayDataInfoSucc)
    },
    getDayDataInfoSucc (res) {
      if (res.code === 0 && res.data) {
        const data = res.data
        this.minDay = data.start
        this.maxDay = data.end
      }
      //console.log(this.maxDay)
      if (!this.maxDay) {
        this.maxDay = this.nowDay
      }
      let d1 = new Date(this.maxDay.replace(/\-/g, '\/')) // 最大日期
      let d2 = new Date(this.nowDay.replace(/\-/g, '\/')) // 昨天日期
      //console.log(d1)
      //console.log(d2)
      if (d1 - d2 > 0) {
        this.htFlag = false // 心率
        this.bpFlag = false // 血压
        this.bsFlag = false // 血糖
        this.boFlag = false // 血氧
        this.btFlag = false // 体温
        this.viFlag = false // 肺腑
        this.hlFlag = false // 心肺
        this.slFlag = false // 睡眠
        this.weFlag = false // 疲劳
        this.spFlag = false // 运动
        this.regularDate = this.nowDay
      } else {
        this.regularDate = this.maxDay
      }
    },
    openDatePicker () {
      this.datePickerShow = true
    },
    ifHthasdata (obj) {
      //console.log('日报心率code:' + obj.code)
      if (obj.code === 999) {
        this.htFlag = false
      } else if (obj.code === 0) {
        this.htFlag = true
      }
      // this.regularDate = obj.time
    },

    ifBphasdata (obj) {
      //console.log('日报血压code:' + obj.code)
      if (obj.code === 999) {
        this.bpFlag = false
      } else if (obj.code === 0) {
        this.bpFlag = true
      }
      // this.regularDate = obj.time
    },
    ifBshasdata (obj) {
      //console.log('日报血糖code:' + obj.code)
      if (obj.code === 999) {
        this.bsFlag = false
      } else if (obj.code === 0) {
        this.bsFlag = true
      }
      // this.regularDate = obj.time
    },
    ifBohasdata (obj) {
      //console.log('日报血氧code:' + obj.code)
      if (obj.code === 999) {
        this.boFlag = false
      } else if (obj.code === 0) {
        this.boFlag = true
      }
      // this.regularDate = obj.time
    },
    ifBthasdata (obj) {
      //console.log('日报体温code:' + obj.code)
      if (obj.code === 999) {
        this.btFlag = false
      } else if (obj.code === 0) {
        this.btFlag = true
      }
      // this.regularDate = obj.time
    },
    ifVihasdata (obj) {
      //console.log('日报脏腑code:' + obj.code)
      if (obj.code === 999) {
        this.viFlag = false
      } else if (obj.code === 0) {
        this.viFlag = true
      }
      // this.regularDate = obj.time
    },
    ifHlhasdata (obj) {
      //console.log('日报心肺code:' + obj.code)
      if (obj.code === 999) {
        this.hlFlag = false
      } else if (obj.code === 0) {
        this.hlFlag = true
      }
      // this.regularDate = obj.time
    },
    ifSlhasdata (obj) {
      //console.log('日报睡眠code:' + obj.code)
      if (obj.code === 999) {
        this.slFlag = false
      } else if (obj.code === 0) {
        this.slFlag = true
      }
      // this.regularDate = obj.time
    },
    ifWehasdata (obj) {
      //console.log('日报疲劳code:' + obj.code)
      if (obj.code === 999) {
        this.weFlag = false
      } else if (obj.code === 0) {
        this.weFlag = true
      }
      // this.regularDate = obj.time
    },
    ifSphasdata (obj) {
      //console.log('日报运动code:' + obj.code)
      if (obj.code === 999) {
        this.spFlag = false
      } else if (obj.code === 0) {
        this.spFlag = true
      }
      // this.regularDate = obj.time
    }
  },
  computed: {

    alldataFlag: function () {
      return !((!this.htFlag) &&
                (!this.bpFlag) &&
                (!this.bsFlag) &&
                (!this.boFlag) &&
                (!this.btFlag) &&
                (!this.viFlag) &&
                (!this.hlFlag) &&
                (!this.slFlag) &&
                (!this.weFlag) &&
                (!this.spFlag))
    }
  }
}
</script>
<style lang="stylus" scoped>
@import '~styles/variable.styl';
.date-picker-stage
  margin-bottom 0.26rem
  .date-picker-title {
    box-sizing: border-box;
    position: border-box;
    padding: 0.25rem;
    margin: 0 auto;
    border: 1px solid $blueBorder;
    box-shadow: 0px 2px 5px $blueBorder;
    border-radius: 0.08rem;
    width: 96%;
    height: 1rem;
    font-size: 0.3rem;

    input {
      width: 100%;
      color: $blueText;
      line-height: 0.5rem;
      text-align: center;
      letter-spacing: 2px;
      font-weight: bold;
    }

    .iconfont {
      position: absolute;
      line-height: 0.5rem;
      right: 6%;
      top: 0.25rem;
      font-size: 0.4rem;
      color: $blueText;
    }
  }
  .datasDiv {
    .nodataInfo {
      box-sizing: border-box;
      position: border-box;
      padding: 0.4rem 0.25rem;
      margin: 0.2rem auto;
      border: 1px solid $blueBorder;
      box-shadow: 0px 2px 5px $blueBorder;
      border-radius: 0.08rem;
      width: 96%;
      font-size: 0.3rem;

      .header {
        display: flex;
        margin-bottom: 0.2rem;

        .iconfont {
          margin: -0.16rem 0.2rem 0 0;
          font-size: 0.6rem;
          color: $redText;
        }

        h2 {
          font-size: 0.36rem;
          font-weight: bold;
        }
      }

      p {
        text-align: center;
        font-size: 0.36rem;
      }
    }
  }
</style>
