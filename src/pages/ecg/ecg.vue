<template>
  <article class="con_wrap">
    <!-- 日历 -->
    <div class="top_list">
      <div class="list_text" @click="dialogVisible">
        <i></i>
        <span>{{regularDate}}</span>
        <i class="iconfont">&#xe616;</i>
      </div>
      <transition name="calendar-fade">
        <keep-alive>
          <date-picker
            v-if="datePickerShow"
            @close="datePickerShow = false"
            v-model="regularDate"
          ></date-picker>
        </keep-alive>
      </transition>
    </div>
    <div class="report_item_wrapper">
      <div class="report_header">
        <div class="item_title">
          <i class="iconfont">&#xe6ce;</i>
          <span>{{$t('tag.xindian.title')}}</span>
          <span class="srart_end_time"></span>
        </div>
        <div class="others">
        </div>
      </div>
      <div v-show="ecgShow">
        <v-ecg
          v-for="(item, index) in list"
          :ecgdata="item.ecg"
          :key="index"
          :heart="item.heart"
          :ox="item.ox"
          :af="item.af"
          :time="item.time"
          :id="index"
          >
        </v-ecg>
      </div>
      <div  class="noEcgChart" v-show="!ecgShow">
        <p>
          <strong>{{regularDate}}</strong>
          {{$t('tag.xindian.text')}}
        </p>
      </div>
    </div>
  </article>
</template>
<script>
import item from './item.vue'
import datePicker from './datePicker'
export default {
  name: 'heartEcg',
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
      regularDate: '',
      ecgShow: true
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
      console.log(this.regularDate)
    },
    getCurrentDataInfo () {
      let postData = {
        date: this.regularDate,
        userid: this.$route.params.userID,
        friendid: this.$route.params.friendID,
        token: this.$route.params.token,
        current: this.current
      }
      this.$axios.getEcg(postData).then(this.getCurrentDataInfoSucc)
    },
    getCurrentDataInfoSucc (res) {
      if (res.code === 0 && res.data) {
        this.ecgShow = true
        const data = res.data
        this.list = data
        console.log(this.list)
      } else if (res.code === 999) {
        this.ecgShow = false
      }
    }
  },
  components: {
    'v-ecg': item,
    datePicker
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
  .top_list
    width: 95%;
    font-size:0.3rem;
    color:#3596ea;
    box-sizing: border-box;
    padding: .3rem .86rem;
    margin: 0 auto .26rem auto;
    box-shadow: 0 3px 8px rgba(53, 150, 234, 0.27);
    border-radius: .1rem;
    background-color: #fff;
    .list_text
      display :flex;
      flex-flow:row nowrap;
      justify-content :space-between
      align-items :center;
      span
        font-size 0.3rem
        font-weight bold
      .iconfont
        font-size 0.4rem;
  .report_item_wrapper
    .report_header .item_title .iconfont
      color $blueText
    .noEcgChart
      margin .4rem 0
      display flex
      justify-content center
      align-items center
      p
        font-size .32rem
        strong
          font-weight bold

</style>
