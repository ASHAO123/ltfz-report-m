<template>
  <div class="current-data-wrapper">
    <current-data-box
      v-for="(item, index) of data"
      :item="item"
      :index="index"
      :key="item.key"
    ></current-data-box>
    <transition
      :duration="2000"
      appear
      enter-active-class="animated bounceInUp"
      leave-active-class="animated bounceOutDown"
    >
      <keep-alive>
      <router-view  class="child" :current="current"></router-view>
      </keep-alive>
    </transition>
  </div>
</template>
<script>
import CurrentDataBox from './components/CurrentDataBox'
export default {
  name: 'CurrentData',
  props: {
    current: {
      type: String,
      default: ''
    }
  },
  components: { CurrentDataBox },
  data () {
    return {
      data: [],
      transitionName: 'slide-right'
    }
  },
  mounted () {
    this.getCurrentDataInfo()
  },
  methods: {
    getCurrentDataInfo () {
      // console.log('shijian==' + this.current)
      let postData = {
        userid: this.$route.params.userID,
        friendid: this.$route.params.friendID,
        token: this.$route.params.token,
        device: this.$route.params.device,
        current: this.current
      }
      this.$axios.getCurrentHomePage(postData).then(this.getCurrentDataInfoSucc)
    },
    getCurrentDataInfoSucc (res) {
      if (res.code === 0 && res.data) {
        const data = res.data
        this.data = data
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
  .current-data-wrapper
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    box-sizing: border-box;
    padding: .23rem .1rem 0 .1rem
  .child
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: #ffffff;
    top: 0;
    left:0;
</style>
