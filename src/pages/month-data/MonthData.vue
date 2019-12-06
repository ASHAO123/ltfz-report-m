<template>
  <div class="report_wrapper month" ref="alerts">
    <listTime :listValue='plugValue' @listVisible="clickVisible" :currentTime="currentTime"></listTime>

    <div v-show="datashow">
      <!-- 心率 -->
      <monthHeartrate :sendTime="currentTime" @heareatcode="hasheareat"></monthHeartrate>
      <!-- 血压 -->
      <monthBlood :sendTime="currentTime" @bloodcode="hasbloodpre"></monthBlood>
      <!-- 血糖 -->
      <monthSugar :sendTime="currentTime" @sugarcode="hassugar"></monthSugar>
      <!-- 血氧 -->
      <monthOxygen :sendTime="currentTime" @oxygencode="hasoxygen"></monthOxygen>
      <!-- 体温 -->
      <monthTemperature :sendTime="currentTime" @tempcode="hastemp"></monthTemperature>
      <!-- 脏腑 -->
      <monthViscera  :sendTime="currentTime"  @viceracode="hasvis"></monthViscera>
      <!-- 心肺 -->
      <monthCardiopulmonary  :sendTime="currentTime" @cdplycode="hascsby"></monthCardiopulmonary>
      <!-- 睡眠 -->
      <monthSleep  :sendTime="currentTime" @sleepcode="hassleep"></monthSleep>
        <!-- 疲劳 -->
      <monthFat  :sendTime="currentTime" @fatcode="hasfat"></monthFat>
      <!-- 运动管理-->
      <monthSteps  :sendTime="currentTime" @stepcode="hassteps"></monthSteps>
    </div>
    <div v-show="!datashow">
      <no-data @openPicker="clickVisible" :sendNavtype="navtype"></no-data>
    </div>
  </div>
</template>
<script>
import listTime from '../common/components/mixins/listTimeShow'
import {bus} from '../../main.js'
import noData from '../common/components/noData'
import monthBlood from './components/monthBlood'
import monthCardiopulmonary from './components/monthCardiopulmonary'
import monthHeartrate from './components/monthHeartrate'
import monthOxygen from './components/monthOxygen'
import monthSleep from './components/monthSleep'
import monthSteps from './components/monthSteps'
import monthSugar from './components/monthSugar'
import monthTemperature from './components/monthTemperature'
import monthViscera from './components/monthViscera'
import monthFat from './components/monthFat'
export default {
  name: 'MonthData',
  data () {
    return {
      navtype: '月',
      currentTime: '',
      dialogTableVisible: false,
      bldData: true,
      carpyData: true,
      fatData: true,
      hrateData: true,
      oygData: true,
      slepData: true,
      stepData: true,
      sugData: true,
      tempData: true,
      visData: true,
      msg: '',
      plugValue: {
        listType: '月',
        reportList: [],
        hasList: false,
        type: 'month',
        title:this.$t('components.reportList'),
        nodata:this.$t('components.zanwu'),
        reset:this.$t('components.quxiao'),
        sub:this.$t('components.queding')
      }
    }
  },
  computed: {
    datashow: function () {
      // 如果全部为false成立
      return !(!this.bldData &&
              !this.carpyData &&
              !this.fatData &&
              !this.hrateData &&
              !this.oygData &&
              !this.slepData &&
              !this.stepData &&
              !this.sugData &&
              !this.tempData &&
              !this.visData)
    }
    // })
  },
  mounted () {
    this.getReportListInfo()
    bus.$emit('defaultDate', this.currentTime)
  },
  methods: {
    getCurrentTime () {
      // 接收列表中选择的日期
      let _this = this
      bus.$on('currentMhVal', (data) => {
        _this.currentTime = data
        //console.log('monthdata：' + data)
      })
    },
    getReportListInfo () {
      let postdata = {
        userid: this.$route.params.userID,
        friendid: this.$route.params.friendID
      }
      this.$axios.getMonthdefault(postdata).then(this.getReportListInfoSucc)
    },
    getReportListInfoSucc (res) {
      if (res.code === 0 && res.data) {
        this.currentTime = res.data
        this.getList()
      }
    },
    getList () {
      let postdata = {
        userid: this.$route.params.userID,
        friendid: this.$route.params.friendID,
        token: this.$route.params.token
      }
      this.$axios.getMonthlist(postdata).then((res) => {
        if (res.code === 0 && res.data) {
          this.plugValue.reportList = res.data
        } else {
          this.msg = res.message
          this.plugValue.hasList = true
        }
      })
    },
    clickVisible () {
      // 点击读取月报列表
      this.$alertPl.show({
        el: this.$refs.alerts,
        title: '',
        comp: 'listPlug',
        plugVal: this.plugValue
      })
      this.getCurrentTime()
    },
    hasheareat (obj) {
      if (obj.code === 999) {
        this.hrateData = false
      } else if (obj.code === 0) {
        this.hrateData = true
      }
      //console.log('心率：' + obj.code)
      // this.currentWeek = obj.time
    },
    hasbloodpre (obj) {
      if (obj.code === 999) {
        this.bldData = false
      } else if (obj.code === 0) {
        this.bldData = true
      }
      //console.log('血压：' + obj.code)
      // this.currentWeek = obj.time
    },
    hassugar (obj) {
      if (obj.code === 999) {
        this.sugData = false
      } else if (obj.code === 0) {
        this.sugData = true
      }
      //console.log('血糖：' + obj.code)
      // this.currentWeek = obj.time
    },
    hasoxygen (obj) {
      if (obj.code === 999) {
        this.oygData = false
      } else if (obj.code === 0) {
        this.oygData = true
      }
      //console.log('血样：' + obj.code)
      // this.currentWeek = obj.time
    },

    hastemp (obj) {
      if (obj.code === 999) {
        this.tempData = false
      } else if (obj.code === 0) {
        this.tempData = true
      }
      //console.log('体温：' + obj.code)
      // this.currentWeek = obj.time
    },

    hasvis (obj) {
      if (obj.code === 999) {
        this.visData = false
      } else if (obj.code === 0) {
        this.visData = true
      }
      //console.log('疲劳：' + obj.code)
      // this.currentWeek = obj.time
    },

    hascsby (obj) {
      if (obj.code === 999) {
        this.carpyData = false
      } else if (obj.code === 0) {
        this.carpyData = true
      }
      //console.log('心肺：' + obj.code)
      // this.currentWeek = obj.time
    },

    hassleep (obj) {
      if (obj.code === 999) {
        this.slepData = false
      } else if (obj.code === 0) {
        this.slepData = true
      }
      //console.log('睡眠：' + obj.code)
      // this.currentWeek = obj.time
    },

    hasfat (obj) {
      if (obj.code === 999) {
        this.fatData = false
      } else if (obj.code === 0) {
        this.fatData = true
      }
      //console.log('疲劳：' + obj.code)
      // this.currentWeek = obj.time
    },
    hassteps (obj) {
      if (obj.code === 999) {
        this.stepData = false
      } else if (obj.code === 0) {
        this.stepData = true
      }
      //console.log('步数：' + obj.code)
      // this.currentWeek = obj.time
    }
  },
  components: {
    listTime,
    monthHeartrate,
    monthBlood,
    monthCardiopulmonary,
    monthOxygen,
    monthSleep,
    monthSteps,
    monthSugar,
    monthTemperature,
    monthViscera,
    monthFat,
    noData
  }
}
</script>
<style lang="stylus" scoped>
// @import '~styles/alertPlugin.styl'

</style>
