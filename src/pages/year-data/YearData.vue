<template>
  <div class="report_wrapper year" ref="alerts">
    <listTime :listValue='plugValue' @listVisible="clickVisible" :currentTime="currentTime"></listTime>

    <div v-show="datashow">
      <!-- 心率 -->
      <yearHeartrate :sendTime="currentTime" @heareatcode="hasheareat"></yearHeartrate>
      <!-- 血压 -->
      <yearBlood :sendTime="currentTime" @bloodcode="hasbloodpre"></yearBlood>
      <!-- 血糖 -->
      <yearSugar :sendTime="currentTime" @sugarcode="hassugar"></yearSugar>
      <!-- 血氧 -->
      <yearOxygen :sendTime="currentTime" @oxygencode="hasoxygen"></yearOxygen>
      <!-- 体温 -->
      <yearTemperature :sendTime="currentTime" @tempcode="hastemp"></yearTemperature>
      <!-- 脏腑 -->
      <yearViscera  :sendTime="currentTime" @viceracode="hasvis"></yearViscera>
      <!-- 心肺 -->
      <yearCardiopulmonary  :sendTime="currentTime" @cdplycode="hascsby"></yearCardiopulmonary>
      <!-- 睡眠 -->
      <yearSleep  :sendTime="currentTime" @sleepcode="hassleep"></yearSleep>
        <!-- 疲劳 -->
      <yearFat  :sendTime="currentTime" @fatcode="hasfat"></yearFat>
      <!-- 运动管理-->
      <yearSteps  :sendTime="currentTime" @stepcode="hassteps"></yearSteps>
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
import yearBlood from './components/yearBlood'
import yearCardiopulmonary from './components/yearCardiopulmonary'
import yearHeartrate from './components/yearHeartrate'
import yearOxygen from './components/yearOxygen'
import yearSleep from './components/yearSleep'
import yearSteps from './components/yearSteps'
import yearSugar from './components/yearSugar'
import yearTemperature from './components/yearTemperature'
import yearViscera from './components/yearViscera'
import yearFat from './components/yearFat'
export default {
  name: 'YearData',
  data () {
    return {
      navtype: '年',
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
      visData: true.data,
      msg: '',
      plugValue: {
        listType: '年',
        reportList: [],
        hasList: false,
        type: 'year',
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
    this.getCurrentTime()
  },
  methods: {
    getCurrentTime () {
      // 接收列表中选择的日期
      let _this = this
      bus.$on('currentYeVal', (data) => {
        _this.currentTime = data
      })
    },
    getReportListInfo () {
      let postdata = {
        userid: this.$route.params.userID,
        friendid: this.$route.params.friendID
      }
      this.$axios.getYeardefault(postdata).then(this.getReportListInfoSucc)
    },
    getReportListInfoSucc (res) {
      if (res.code === 0 && res.data) {
        this.currentTime = res.data
        // 方便listPlug取
        bus.$emit('defaultDate', this.currentTime)
        this.getList()
      }
    },
    getList () {
      let postdata = {
        userid: this.$route.params.userID,
        friendid: this.$route.params.friendID,
        token: this.$route.params.token
      }
      this.$axios.getYearlist(postdata).then((res) => {
        if (res.code === 0 && res.data) {
          this.plugValue.reportList = res.data
        } else {
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
    yearHeartrate,
    yearBlood,
    yearCardiopulmonary,
    yearOxygen,
    yearSleep,
    yearSteps,
    yearSugar,
    yearTemperature,
    yearViscera,
    yearFat,
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
