<template>
  <div class="top_list weekList" @click='clickVisible'>
    <div class="list_text" >
      <i></i>
      <span>{{currentTime}}</span>
      <i class="iconfont">&#xe616;</i>
    </div>
  </div>
</template>

<script>
// import {bus} from '../../../../main.js'
export default {
  name: 'listTimeShow',
  props: {
    currentTime: {
      type: String,
      default: '健康报告'
    },
    listValue: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      currenttime: ''
    }
  },
  mounted () {
    // console.log('timeBus:' + bus)
  },
  methods: {
    clickVisible () {
      this.$emit('listVisible', 'clickVisible')
    }
  }
}
</script>
<style lang="stylus" scoped>
.report_wrapper
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
        font-size: 0.4rem;
</style>
