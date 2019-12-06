<template>
  <div class="noData-wrapper">
    <i class="iconfont">&#xe653;</i>
    <p>本{{ sendNavtype }}{{$t('components.zanwu')}}</p>
    <button @click="openThepicker">{{$t('components.chakan')}}{{ sendNavtype }}{{$t('components.jiankangbaogao')}}</button>
  </div>
</template>

<script>
export default {
  name: 'noData',
  props: {
    sendNavtype: {
      type: String,
      required: true
    }
  },
  data () {
    return {

    }
  },
  methods: {
    openThepicker () {
      this.$emit('openPicker')
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import '~styles/variable.styl'
  .noData-wrapper
    box-sizing border-box
    position border-box
    padding .25rem
    margin .2rem auto
    border 0.01rem solid $blueBorder
    box-shadow 0px 2px 5px $blueBorder
    border-radius 0.08rem
    width 96%
    font-size 0.3rem
    text-align: center;
    .iconfont
      font-size 4rem
      color #ddd
      vertical-align: middle;
      display:inline-block;
      margin .2rem 0
    p
      font-size .36rem
      line-height .4rem
      color #555
    button
      background $blueText
      border-radius 5px
      color #fff
      font-size .32rem
      margin .5rem 0
      padding .1rem .6rem
      line-height .8rem
</style>
