<template>
  <div class="report_item_wrapper">
    <div class="report_header">
      <div class="item_title">
        <i class="iconfont">&#xe7c0;</i>
        <span>{{$t('title.zangfu')}}</span>
        <span class="srart_end_time" v-show="echartShows">{{time}}</span>
      </div>
      <div class="item_warn">
      </div>
    </div>
    <div class="echarts_wrapper" v-show="echartShows">
      <div class="viscera_item" v-for="item in hour" :key="item.id">
        <i :class="['value', item.color !== ''? item.color : '']" >{{item.title}}</i>
        <span>{{item.sub}}</span>
      </div>
    </div>
    <div class="reference" v-show="echartShows">
      <div class="warnState">
        <ul v-for="(item,index) in riskData"
          :key="index"
          @click="clickWarnData(index)">
          <li class="stateTitle">
            <p>{{$t('tag.zangfu.thisyear')}}
              <strong>{{$t('tag.zangfu.'+item.statec)}}</strong>
              <span>{{$t('tag.zangfu.'+item.text)}}</span>
            </p>
            <p :class="[item.ifshow ?'up' :'down']"></p>
          </li>
          <transition name="slide-fade">
            <v-warnData :item="item" v-show="item.ifshow"></v-warnData>
          </transition>
        </ul>
      </div>
    </div>
    <div class="read part-top"  v-show="echartShows">
      <div class="header">
        <i class="iconfont">&#xe61d;</i>
        <h2>{{$t('title.secondaryTitle.zangfuReport')}}</h2>
      </div>
      <div class="content">
        <div :class="['article',contentShow ? 'show' : 'hidden']" >
          <p>{{content}}</p>
        </div>
        <div :class="['mask',contentShow ? 'show' : 'hidden']" @click="contentToggle">
          <i class="iconfont" v-show="!contentShow">&#xe632;</i>
          <i class="iconfont" v-show="contentShow">&#xe633;</i>
        </div>
      </div>
    </div>
    <div class="nodata" v-show="!echartShows">{{$t('tag.zangfu.noyear')}}</div>
  </div>
</template>
<script>
import warnData from '@/pages/common/components/warnData.vue'
export default {
  name: 'yearViscera',
  props: {
    sendTime: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      emit: {},
      echartShows: true,
      id: 'yearViscera',
      time: '',
      visceraList: [],
      statec:'',
      content: '',
      contentShow: false,
      riskData: [],
      ifshow: true,
      hour: this.$t('tag.canshujieduContent.hour')
    }
  },
  methods: {
    getEchartsDataInfo () {
      let postData = {
        'year': this.sendTime,
        'userid': this.$route.params.userID,
        'friendid': this.$route.params.friendID,
        'token': this.$route.params.token
      }
      this.$axios.getYearviscera(postData)
        .then(this.getEchartsDataInfoSucc)
    },
    getEchartsDataInfoSucc (res) {
      this.emit.code = res.code
      this.$emit('viceracode', this.emit)
      if (res.code === 0 && res.data) {
        this.echartShows = true
        const getData = res.data
        let startTime = getData.startTime
        let endTime = getData.endTime
        this.time = '(' + startTime + '-' + endTime + ')'
        this.statec=getData.statec

        this.content = this.$t('zangfu.year.'+this.statec)
        this.riskData = getData.riskData
        // 图
        let visceraList = getData.rateData
        let color = []
        for (let i in visceraList) {
          // 将颜色存在color中
          color.push(visceraList[i].color)
        }
        for (let j in this.hour) {
          // 遍历 给this.hour添加一个color属性
          this.hour[j].color = color[j]
        }
        // console.log('color=>' + this.hour)
      } else {
        this.echartShows = false
      }
    },
    contentToggle () {
      this.contentShow = !this.contentShow
    },
    clickWarnData (index) {
      this.riskData[index].ifshow = !this.riskData[index].ifshow
      this.$set(this.riskData, index, this.riskData[index])
    }
  },
  components: {
    'v-warnData': warnData
  },
  watch: {
    sendTime: function (newval, oldval) {
      this.getEchartsDataInfo()
    }
  }
}
</script>
<style lang="stylus" scoped>
@import '~styles/variable.styl'
@import '~styles/global.styl'
@import '~styles/viscera.styl'
</style>
