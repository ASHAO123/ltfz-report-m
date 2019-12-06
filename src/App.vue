<template>
  <div id="app">
    <page-header id="header" :headers="{daynight: daynight, portrait: portrait, updatetime: updatetime, location: location}"></page-header>
   <transition
      :duration="2000"
      enter-active-class="animated bounceInRight"
      leave-active-class="animated bounceOutLeft"
    >
      <keep-alive>
      <router-view class="child-box" :current="current"></router-view>
      </keep-alive>
    </transition>
  </div>
</template>
<script>
window.onload = function() {
  document.addEventListener('touchstart', function(event) {
    if (event.touches.length > 1) {
      event.preventDefault()
    }
  })
  document.addEventListener('gesturestart', function(event) {
    event.preventDefault()
  })
}
</script>
<script>
import PageHeader from '@/pages/common/PageHeader.vue'
export default {
  name: 'App',
  components: { PageHeader },
  data () {
    return {
      daynight: '',
      portrait: '',
      updatetime: '1970-01-01 00:00',
      location: 0,
      current: ''
    }
  },
  created () {
    Date.prototype.format = function(fmt) { 
     var o = { 
        "M+" : this.getMonth()+1,                 //月份 
        "d+" : this.getDate(),                    //日 
        "h+" : this.getHours(),                   //小时 
        "m+" : this.getMinutes(),                 //分 
        "s+" : this.getSeconds(),                 //秒 
        "q+" : Math.floor((this.getMonth()+3)/3), //季度 
        "S"  : this.getMilliseconds()             //毫秒 
    }; 
    if(/(y+)/.test(fmt)) {
            fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
    }
     for(var k in o) {
        if(new RegExp("("+ k +")").test(fmt)){
             fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
         }
     }
    return fmt; 
}

    // let current = Date.parse(new Date('Y-m-d H:i:s')).toString()
    // this.current = current.substr(0, 10)
    this.current = new Date().format("yyyy-MM-dd hh:mm:ss");

    console.log(this.current)
  },
  mounted () {
    this.getCurrentDataInfo()
  },
  methods: {
    getCurrentDataInfo () {
      let postData = {
        userid: this.$route.params.userID,
        friendid: this.$route.params.friendID,
        token: this.$route.params.token,
        current: this.current
      }
      this.$axios.getCurrentInit(postData).then(this.getCurrentDataInfoSucc)
    },
    getCurrentDataInfoSucc (res) {
      if (res.code === 0 && res.data) {
        const data = res.data
        this.daynight = data.basic.daynight
        this.portrait = data.basic.portrait
        this.updatetime = data.basic.updatetime
        this.location = data.basic.location
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
  .child-box
    position: absolute;
    width: 100%;
    background-color: #ffffff;
    top: 3.5rem;
    left: 0;
</style>
