<template>
  <article class="cur_con_wrapper">
    <div class="cur_con">
      <header class="header">
        <i class="iconfont">&#xe7c0;</i>
        <h2>
          {{$t('title.zangfu')}}
          <span v-show="showData">({{ startTime }} -- {{ endTime }})</span>
        </h2>
      </header>
      <div v-show="showData">
        <div class="box">
          <div class="box-item" v-for="item in hour" :key="item.id">
            <i :class="['value', item.color !== ''? item.color : '']" >{{item.title}}</i>
            <span>{{item.sub}}</span>
          </div>
        </div>
        <div class="reference" v-show="showData">
          <div class="warnState">
            <ul v-for="(item,index) in riskData"
              :key="index"
              @click="clickWarnData(index)">
              <li class="stateTitle">
                <p>{{$t('tag.zangfu.today')}}
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
        <div class="read">
          <header>
            <i class="iconfont">&#xe61d;</i>
            <h2>{{$t('title.secondaryTitle.zangfuReport')}}</h2>
          </header>
          <div class="content">
            <div :class="['article',contentShow ? 'show' : 'hidden']" v-html="content"></div>
            <div :class="['mask',contentShow ? 'show' : 'hidden']" @click="contentToggle">
              <i class="iconfont" v-show="!contentShow">&#xe632;</i>
              <i class="iconfont" v-show="contentShow">&#xe633;</i>
            </div>
          </div>
        </div>
      </div>
      <p v-show="!showData" class="nodata">{{$t('tag.zangfu.noday')}}</p>
    </div>
  </article>
</template>

<script>
// import Vue from 'vue'
import warnData from '@/pages/common/components/warnData.vue'
// import { Collapse, CollapseItem } from 'element-ui'
// Vue.use(Collapse)
// Vue.use(CollapseItem)
export default {
  name: 'dayViscera',
  props: {
    sendTime: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      showData: true,
      emit: {},
      startTime: '',
      endTime: '',
      rateData: [],
      contentShow: false,
      titles: '丑时',
      content: '',
      riskData: [],
      ifshow: true,
      statec:'',
      hour: this.$t('tag.canshujieduContent.hour')
    }
  },
  watch: {
    sendTime: function () {
      this.getDayDataInfo()
    }
  },
  mounted () {
  },

  methods: {
    getDayDataInfo () {
      let postData = {
        date: this.sendTime,
        userid: this.$route.params.userID,
        friendid: this.$route.params.friendID,
        token: this.$route.params.token
      }
      this.$axios.getDayviscera(postData).then(this.getDayDataInfoSucc)
    },
    getDayDataInfoSucc (res) {
      if (res.code === 0 && res.data) {
        this.showData = true
        const data = res.data
        this.rateData = data.rateData
        this.riskData = data.riskData
        this.startTime = data.startTime
        this.endTime = data.endTime
        this.statec=data.statec
        let p
        this.content = ''
        for (let item of this.$t('zangfu.day.'+this.statec)) {
          p = '<p>' + item + '</p>'
          this.content += p
        }

        let visceraList = data.rateData
        let color = []
        for (let i in visceraList) {
          // 将颜色存在color中
          color.push(visceraList[i].state)
        }
        for (let j in this.hour) {
          // 遍历 给this.hour添加一个color属性
          this.hour[j].color = color[j]
        }
      } else {
        this.showData = false
      }
      this.emit.code = res.code
      // this.emit.time = this.sendTime
      // this.emit.viFlag = this.showData
      this.$emit('dayvisceracode', this.emit)
    },
    contentToggle () {
      this.contentShow = !this.contentShow
    },
    clickWarnData (index) {
      this.riskData[index].ifshow = !this.riskData[index].ifshow
      this.$set(this.riskData, index, this.riskData[index])
    }
    // 折叠菜单
    // menuToggle: function (item, ind) {
    //   if (item.show) {
    //     Vue.set(item, 'show', false)// 为item添加不存在的属性，需要使用vue提供的Vue.set( object, key, value )方法。
    //   } else {
    //     Vue.set(item, 'show', true)
    //   }
    // }
  },
  components: {
    'v-warnData': warnData
  }
}
</script>
<style lang="stylus" scoped>
@import '~styles/variable.styl'
@import '~styles/CurrentData.styl'
@import '~styles/viscera.styl'
  .cur_con_wrapper
    .cur_con
      .nodata
        text-indent 0.8rem
        margin-top 0.3rem
      .box
          display flex
          // width 5.8rem
          // margin 0 auto
          margin-top .4rem
          flex-wrap wrap
          justify-content space-around
          align-items center
          .box-item
            margin 0 .12rem .3rem .12rem
            width 20%
            text-align center
            font-size .24rem
            i,span
              display block
            .value
              color:#fff
              border-radius: .1rem
              padding: .14rem 0
              background-color #ddd
              &.red
                background-color $redText
              &.orange
                background-color $orangeText
              &.normal
                background $blueText
            span
              color #b5b5b5
              margin-top .1rem
      .item_list
        box-sizing border-box
        display flex
        justify-content center
        flex-wrap wrap
        margin-top .3rem
        li
          align-items center
          width 33.33%
          // margin .3rem 0.2rem
          text-align center
          .value
            display flex
            justify-content center
            height .4rem
            margin-bottom .2rem
            &.red
              color $redText
            &.orange
              color $orangeText
            &.purple
              color $purpleText
            strong
              font-size 0.4rem
              font-weight bold
            i
              margin 0.14rem 0 0 0.02rem
              font-size 0.24rem
          p.title
            border-bottom none!important

                

</style>
