<template>
  <article class="cur_con_wrapper">
    <div class="cur_con">
      <header class="header">
        <i class="iconfont">&#xe7c0;</i>
        <h2>{{$t('title.zangfu')}}</h2>
      </header>
      <div class="box">
        <div class="box-item" v-for="item of hour" :key="item.id"  :class="[item.id === hourId?'current':'']" @click="showTip(item.content)">
          <i :class="[item.color? item.color : '']" >{{item.title}}</i>
          <span>{{item.sub}}</span>
        </div>
      </div>
      <p class="info">*{{$t('tag.zangfu.tip')}}</p>
      <div class="reference">
        <div class="hour">
          <p>{{$t('tag.zangfu.jiancetitle')}}<strong>{{$t('tag.zangfu.'+statec)}}</strong>{{$t('tag.zangfu.shijianduan')}}</p>
        </div>
        <div class="ref-rate">
          <div class="rate">
            <strong>{{range}}</strong><i>{{$t('tag.xinlv.danwei')}}</i>
            <p>{{$t('tag.zangfu.cankao')}}</p>
          </div>
          <i class="iconfont">&#xe62e;</i>
        </div>
      </div>
      <div class="parameter">
        <div class="item">
          <div :class="['value', maxRate.value !== '' && maxRate.color !== 'normal' ? maxRate.color : '' ]">
            <template v-if="maxRate.value !== ''">
              <strong>{{maxRate.value}}</strong>
              <i>bpm</i>
            </template>
            <template v-else>
              <strong>--</strong>
            </template>
          </div>
          <div class="title">{{$t('tag.zangfu.hight')}}</div>
        </div>
        <div class="item">
          <div :class="['value', minRate.value !== '' && minRate.color !== 'normal' ? minRate.color : '' ]">
            <template v-if="minRate.value !== ''">
              <strong>{{minRate.value}}</strong>
              <i>bpm</i>
            </template>
            <template v-else>
              <strong>--</strong>
            </template>
          </div>
          <div class="title">{{$t('tag.zangfu.low')}}</div>
        </div>
        <div class="item">
          <div :class="['value', aveRate.value !== '' && aveRate.color !== 'normal' ? aveRate.color : '' ]">
            <template v-if="aveRate.value !== ''">
              <strong>{{aveRate.value}}</strong>
              <i>bpm</i>
            </template>
            <template v-else>
              <strong>--</strong>
            </template>
          </div>
          <div class="title">{{$t('tag.zangfu.ave')}}</div>
        </div>
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
        <i class="iconfont" @click="scrollTop">&#xe634;</i>
      </div>
    </div>
  </article>
</template>
<script>
export default {
  name: 'CurrentViscera',
  props: {
    current: {
      type: String,
      default: ''
    }
  },
  mounted () {
    this.getCurrentDataInfo()
  },
  computed: {
    randomTitle () {
      return this.contentRandom[Math.round(Math.random() * (this.contentRandom.length - 1))]
    }
  },
  methods: {
    getCurrentDataInfo () {
      console.log('脏腑时间===' + this.current)
      let postData = {
        userid: this.$route.params.userID,
        friendid: this.$route.params.friendID,
        token: this.$route.params.token,
        current: this.current
      }
      this.$axios.getCurrentViscera(postData).then(this.getCurrentDataInfoSucc)
    },
    getCurrentDataInfoSucc (res) {
      if (res.code === 0 && res.data) {
        const data = res.data
        this.hourId = data.id
        this.range = data.range
        this.CN_Time = data.CN_Time
        this.maxRate = data.maxHeartRate
        this.minRate = data.minHeartRate
        this.aveRate = data.averageHeartRate
        this.statec=data.statec

        let visceraList =data.border
        let color = []
        for (let i in visceraList) {
          color.push(visceraList[i].state)
        }
        for (let j in this.hour) {
          this.hour[j].color = color[j]
        }
        console.log(this.hour)
      }
    },
    contentToggle () {
      this.contentShow = !this.contentShow
    },
    goBack () {
      this.$router.go(-1)
    },
    showTip (content) {
      this.tipContent = content
      this.$alertPl.show({
        title: '健康解读',
        text: this.tipContent,
        confirmMsg: '关闭'
      })
      // this.tipShow = true
    },
    scrollTop () {
      window.scrollTo(0, 0)
    }
  },
  data () {
    return {
      id: 'viscera',
      contentShow: false,
      tipShow: false,
      tipContent: {},
      hourId: 0,
      CN_Time: '',
      range: '',
      maxRate: {},
      minRate: {},
      aveRate: {},
      statec:'',
      contentRandom: this.$t('tag.canshujieduContent.zangfu'),
      hour: this.$t('tag.canshujieduContent.hour')
    }
  }
}
</script>
<style lang="stylus" scoped>
  @import '~styles/variable.styl'
  @import '~styles/CurrentData.styl'
  .cur_con_wrapper
    .cur_con
      .reference
        margin: .2rem 0 .3rem 0;
        text-align: center;
        .hour
          margin-bottom: .2rem;
          font-size: .3rem;
          strong
            color: $blueText;
            font-size: .32rem;
            font-weight: bold;
        .ref-rate
          margin-top: .5rem;
          display: flex;
          justify-content: space-around;
          .rate
            color: $blueText;
            text-align: left;
            strong
              font-size: .35rem;
            i
              font-size: .24rem;
            p
              font-size: .28rem;
              color: #333;
          .iconfont
            color: $blueText;
            padding-top: .1rem;
            font-size: .6rem;
            font-weight: bold;
      .box
        display: flex;
        // width: 5.8rem;
        // margin: 0 auto;
        margin-top .4rem
        flex-wrap wrap
        justify-content space-around
        align-items center
        .box-item
          margin: 0 .12rem .3rem .12rem;
          width: 20%;
          text-align: center;
          font-size: .24rem;
          &.current i
            border: 1px solid $blueText;
            box-shadow: 0px 3px 8px $blueText;
          &.current span
            color: $blueText;
          i,span
            display: block;
          i
            border-radius: .1rem;
            padding: .14rem 0;
            margin-bottom: .1rem;
            background:#ddd;
            color: #fff;
            &.red
              background:$redText;
            &.normal
              background:$blueText; 
            &.orange
              background:$orangeText; 
            &.gray
              background:#ddd; 
          span
            color: #b5b5b5;
      p.info
        padding: .2rem .2rem .4rem 0;
        font-size: 0.28rem;
        color: #ccc;
        text-align: right;
      .parameter
          box-sizing: border-box;
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          margin: 0 0 .4rem 0;
          .item
            align-items: center;
            width: 1.6rem;
            // margin: .3rem .2rem;
            text-align: center;
            .value
              display: flex;
              justify-content: center;
              height: .4rem;
              margin-bottom: .2rem;
              &.red
                color: $redText;
              &.orange
                color: $orangeText;
              strong
                font-size: 0.4rem;
                font-weight: bold;
              i
                margin: 0.14rem 0 0 0.02rem;
                font-size: 0.24rem;
            .title
              font-size: 0.26rem;
              color: #707070;

</style>
