<template>
  <div class="report_wrapper week" ref="alerts">
    <listTime :listValue='plugValue' ref="weekTim" @listVisible="clickVisible" :currentTime="currentTime"></listTime>
    <div v-show="datashow">
      <!-- 心率 -->
      <weekHeartrate :sendTime="currentTime" @heareatcode="hasheareat"></weekHeartrate>
      <!-- 血压 -->
      <weekBlood :sendTime="currentTime" @bloodcode="hasbloodpre"></weekBlood>
      <!-- 血糖 -->
      <weekSugar :sendTime="currentTime" @sugarcode="hassugar"></weekSugar>
      <!-- 血氧 -->
      <weekOxygen :sendTime="currentTime"  @oxygencode="hasoxygen"></weekOxygen>
      <!-- 体温 -->
      <weekTemperature :sendTime="currentTime"  @tempcode="hastemp"></weekTemperature>
      <!-- 脏腑 -->
      <weekViscera  :sendTime="currentTime"  @viceracode="hasvis"></weekViscera>
      <!-- 心肺 -->
      <weekCardiopulmonary  :sendTime="currentTime"  @cdplycode="hascsby"></weekCardiopulmonary>
      <!-- 睡眠 -->
      <weekSleep  :sendTime="currentTime" @sleepcode="hassleep"></weekSleep>
        <!-- 疲劳 -->
      <weekFat  :sendTime="currentTime" @fatcode="hasfat"></weekFat>
      <!-- 运动管理-->
      <weekSteps  :sendTime="currentTime" @stepcode="hassteps"></weekSteps>
    </div>
    <div v-show="!datashow">
      <no-data @openPicker="clickVisible" :sendNavtype="navtype"></no-data>
    </div>
  </div>
</template>
<script>
import {bus} from '../../main.js'
import listTime from '../common/components/mixins/listTimeShow'
import noData from '../common/components/noData'
import weekBlood from './components/weekBlood'
import weekCardiopulmonary from './components/weekCardiopulmonary'
import weekHeartrate from './components/weekHeartrate'
import weekOxygen from './components/weekOxygen'
import weekSleep from './components/weekSleep'
import weekSteps from './components/weekSteps'
import weekSugar from './components/weekSugar'
import weekTemperature from './components/weekTemperature'
import weekViscera from './components/weekViscera'
import weekFat from './components/weekFat'
export default {
  name: 'WeekData',
  data () {
    return {
      navtype: '周',
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
        listType: '周',
        reportList: [],
        type: 'week',
        hasList: false,
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
  },
  mounted () {
    this.getReportListInfo()
    this.$nextTick(() => {
      this.getCurrentTime()
    })
  },
  methods: {
    getCurrentTime () {
      // 接收列表中选择的日期
      let _this = this
      bus.$on('currentWkVal', (data) => {
        _this.currentTime = data
      })
      //console.log(bus)
    },
    getReportListInfo () {
      let postdata = {
        userid: this.$route.params.userID,
        friendid: this.$route.params.friendID
      }
      this.$axios.getWeekdefault(postdata).then(this.getReportListInfoSucc)
    },
    getReportListInfoSucc (res) {
      if (res.code === 0 && res.data) {
        this.currentTime = res.data
        this.getList()
      }
    },
    getList () {
      // 获取列表
      let postdata = {
        userid: this.$route.params.userID,
        friendid: this.$route.params.friendID,
        token: this.$route.params.token
      }
      this.$axios.getWeeklist(postdata).then((res) => {
        if (res.code === 0 && res.data) {
          this.plugValue.reportList = res.data
        } else if (res.code === 999) {
          this.plugValue.hasList = true
        }
      })
      // 接收
    },
    clickVisible () {
      // 点击读取周报列表
      this.$alertPl.show({
        el: this.$refs.alerts,
        title: '',
        comp: 'listPlug',
        plugVal: this.plugValue
      })
      // this.getCurrentTime()
    },
    hasheareat (obj) {
      if (obj.code === 999) {
        this.hrateData = false
      } else if (obj.code === 0) {
        this.hrateData = true
      }
      // //console.log('心率：' + obj.code)
      // this.currentTime = obj.time
    },
    hasbloodpre (obj) {
      if (obj.code === 999) {
        this.bldData = false
      } else if (obj.code === 0) {
        this.bldData = true
      }
    },
    hassugar (obj) {
      if (obj.code === 999) {
        this.sugData = false
      } else if (obj.code === 0) {
        this.sugData = true
      }
    },
    hasoxygen (obj) {
      if (obj.code === 999) {
        this.oygData = false
      } else if (obj.code === 0) {
        this.oygData = true
      }
    },

    hastemp (obj) {
      if (obj.code === 999) {
        this.tempData = false
      } else if (obj.code === 0) {
        this.tempData = true
      }
    },

    hasvis (obj) {
      if (obj.code === 999) {
        this.visData = false
      } else if (obj.code === 0) {
        this.visData = true
      }
    },

    hascsby (obj) {
      if (obj.code === 999) {
        this.carpyData = false
      } else if (obj.code === 0) {
        this.carpyData = true
      }
    },

    hassleep (obj) {
      if (obj.code === 999) {
        this.slepData = false
      } else if (obj.code === 0) {
        this.slepData = true
      }
    },

    hasfat (obj) {
      if (obj.code === 999) {
        this.fatData = false
      } else if (obj.code === 0) {
        this.fatData = true
      }
    },
    hassteps (obj) {
      if (obj.code === 999) {
        this.stepData = false
      } else if (obj.code === 0) {
        this.stepData = true
      }
    }
  },
  components: {
    listTime,
    weekHeartrate,
    weekBlood,
    weekCardiopulmonary,
    weekOxygen,
    weekSleep,
    weekSteps,
    weekSugar,
    weekTemperature,
    weekViscera,
    weekFat,
    noData
  }
}
</script>
<style lang="stylus" scoped>
// @import '~styles/alertPlugin.styl'
.noList
  text-align center
  margin .4rem 0
</style>
