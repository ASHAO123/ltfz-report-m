<template>
  <div :class="[headers.daynight =='morning' ? 'morning' : 'night', 'page-header-wrapper']">
    <template v-if="headers.portrait">
      <img :src="headers.portrait"
           class="portrait">
    </template>
    <div class="language">
      <span ref="fan" :class='[isZH===true?"islight":"isgray"]' @click="changeCJ" >{{jian}}</span>
      <span ref="fan" :class='[isZH!==true?"islight":"isgray"]' @click="changeFan">{{fan}}</span>
    </div>
    <div class="swiper">
      <div class="swiper-left">
        <h1 v-text="headers.daynight=='morning' ? $t('header.morning') : $t('header.night')"></h1>
        <div>
          {{$t('header.dataupdate')}}：{{headers.updatetime}}
        </div>
      </div>
      <div class="swiper-right"></div>
    </div>
    <!-- <a class="location-font iconfont" v-if="headers.location === 1" @click="goMap">&#xe61c;</a> -->
  </div>
</template>
<script>
export default {
  name: 'PageHeaderWrapper',
  data () {
    return {
      //   localtion: 'http://test03.lantianfangzhou.com/location/location.html#' + this.$route.params.userID + ',' + this.$route.params.token + ',' + this.$route.params.friendID + ',' + window.location.href
      lang:'中',
      isZH:true,
      jian:this.$t('components.jian'),
      fan:this.$t('components.fan')
    }
  },
  mounted (){
    this.$nextTick(function(){
      if(!localStorage.getItem('locale')){
        this.isZH=true
      }else if(localStorage.getItem('locale')==="zh"){
        this.isZH=true
      }else{
        this.isZH=false
      }
    })

  },
  props: {
    headers: {
      type: Object,
      required: true
    }
  },
  methods: {
    changeCJ(n){
      localStorage.setItem('locale', 'zh')
      this.$i18n.locale = 'zh'
      this.isZH=true
      this.$router.go(0)
    },
    changeFan(n){
      localStorage.setItem('locale', 'tw')
      this.$i18n.locale = 'tw'
      this.isZH=false
      this.$router.go(0)
    }
    // goMap () {
    //   this.$router.push({ path: '/aMap/' + this.$route.params.userID + '/' + this.$route.params.token + '/' + this.$route.params.friendID })
    // }
  }
}
</script>
<style lang="stylus" scoped>
.page-header-wrapper {
  display: flex;
  justify-content: center;
  position: relative;
  height: 3rem;

  &.morning {
    background-color: #3696ea;
  }

  &.night {
    background-color: #45568d;
  }

  &.morning .swiper-right {
    background: url('~images/iconstaiyang.png') center center no-repeat;
    background-size: contain;
  }

  &.night .swiper-right {
    margin-top: -0.1rem;
    background: url('~images/iconsyueliang.png') center center no-repeat;
    background-size: contain;
  }
}
.language{
  position:absolute;
  top:.3rem;
  right:.3rem;
}
.language span{
  display:inline-block;
  font-size:.2rem;
  text-align:center;
  width:.4rem;
  height:.4rem;
  line-height :.4rem;
  border-radius:50%;
  margin-bottom:.2rem;
}
.islight{
  color:#fff;
  border:1px solid #fff;
}
.isgray{
  color:gray;
  border:1px solid gray;
}
.swiper {
  display: flex;
  box-sizing: border-box;
  justify-content: space-around;
  margin-top: 0.9rem;
  width: 5.2rem;
  height: 1.25rem;

  .swiper-left {
    flex: 2;
    padding-top: 0.2rem;
    color: white;

    h1 {
      margin-bottom: 0.15rem;
      font-size: 0.3rem;
      font-weight: bold;
    }

    div {
      font-size: 0.24rem;
    }
  }

  .swiper-right {
    flex: 1;
  }
}

.portrait {
  position: absolute;
  top: 0.3rem;
  left: 0.3rem;
  display: block;
  border-radius: 5rem;
  width: 0.64rem;
  height: 0.64rem;
  background-color: #fff;
}

.location-font {
  position: absolute;
  top: 0.3rem;
  right: 0.3rem;
  display: block;
  font-size: 0.6rem;
  color: #fff;
}
</style>
