<template>
  <div class="alert-mask" @click.self="close" v-show="show">
    <!-- <transition
      :duration="1588"
      appear
      enter-active-class="animated bounceIn"
      leave-active-class="animated bounceOut"
    > -->
      <div class="alert animated bounceIn">
        <div :class="[title?'title':'']">{{title}}</div>
        <div class="body">
          <div :class="[text?'text':'']" v-html="text"></div>
          <component  v-bind:is="comp" :visible.sync="show" :plugValue='plugVal' ></component>
        </div>
        <div :class="[confirmMsg?'footer':'']" @click="close">{{confirmMsg}}</div>
      </div>
    <!-- </transition> -->
  </div>
</template>
<script>
import listPlug from '../listplugin/listPlug'
import nodata from '../../noData.vue'
import warnList from '../warnList/warnList'
export default {
  props: {
    name: 'alertplug',
    comp: {
      type: Object,
      default: () => {}
    },
    title: {
      type: String,
      default: ''
    },
    confirmMsg: {
      type: String,
      default: ''
    },
    text: {
      type: String,
      default: ''
    },
    plugVal: {
      type: Object,
      dafalult: () => {}
    }
  },
  components: {listPlug, nodata, warnList},
  data () {
    return {
      msg: '',
      text1: '<h1>标题</h1>',
      show: false
    }
  },
  mounted () {
    // document.body.appendChild(this.$el)
  },
  methods: {
    close () {
      this.show = false
    }
  }
}
</script>
<style lang="stylus" scoped>

.alert-mask
  position fixed
  top 0
  left 0
  right 0
  bottom 0
  background rgba(0, 0, 0, 0.4)
  z-index 1000
  display flex
  justify-content center
  align-items center
  .alert
    box-sizing border-box;
    background #fff
    width 6rem
    border-radius 0.08rem
    display flex
    flex-flow column
    justify-content center
    align-items center
    .animated
      -webkit-animation-duration 1s
      animation-duration 1s
      -webkit-animation-fill-mode both
      animation-fill-mode both
    .title
      width 100%
      text-align center
      padding .2rem 0
      font-size .36rem
      font-weight bold
      color #5d5d5a
      border-bottom .01rem solid #dfdfdf
    .body
      // padding .2rem 0
      font-size .3rem
      p,.text
        font-size .28rem
        padding 0.16rem .36rem
        text-indent 25px
        line-height .36rem
    .footer
      text-align center
      width 100%
      color #fff
      background-color rgba(53,150,234,0.8)
      border-radius 0 0 0.08rem 0.08rem
      padding .2rem 0
</style>
