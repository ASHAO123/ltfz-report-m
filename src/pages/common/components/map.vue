<template>
  <div class="amap-page-container" >
    <el-amap  vid="amap" :zoom="zoom" class="amap-demo" :center="center" id="map"  :dragEnable="dragEnable">
      <div class="friendInf-warp">
        <img class="myImg" :src="headImg"/>
        <ul>
          <li>
            <h3>{{name}}</h3>
          </li>
          <li>
            <p>{{address}}</p>
          </li>
          <li>
            <p>{{$t('components.laseUpdate')}}：{{Time}}</p>
          </li>
      </ul>
      </div>
      <el-amap-marker vid="component-marker"  :position="center"></el-amap-marker>
    </el-amap>
</div>
</template>

<script>
export default {
  name: 'Map',
  data () {
    return {
      center: [121.59996, 31.197646],
      zoom: 15,
      Lng: 0,
      Lat: 0,
      dragEnable: true,
      address: '',
      Time: '',
      headImg: '',
      name: ''

    }
  },
  mounted () {
    let clientWidth = `${document.documentElement.clientWidth}`
    let headerH = clientWidth / 750 * 100 * 3.5
    this.clientHeight = `${document.documentElement.clientHeight}`
    let mapH = this.clientHeight - headerH
    document.getElementById('map').style.height = mapH + 'px'
    this.getLocationDataInfo()
  },
  methods: {
    // 百度地图坐标转换为高德坐标
    convertFrom (data1, data2) {
      AMap.convertFrom([data1, data2], 'baidu', (status, result) => {
        let lnglats = result.locations
        let ra = lnglats.join(',').split(',')
        this.center = [ra[0], ra[1]]
      })
    },
    getLocationDataInfo () {
      let postData = {
        userid: this.$route.params.userID,
        friendid: this.$route.params.friendID,
        token: this.$route.params.token,
        current:new Date().format("yyyy-MM-dd hh:mm:ss")
      }
      this.$axios.getMap(postData).then(this.getLocationDataInfoSucc)
    },
    getLocationDataInfoSucc (res) {
      if (res.code === 0 && res.data) {
        const data = res.data
        this.Lng = data.address.Lng
        this.Lat = data.address.Lat
        this.center = [this.Lng, this.Lat]
        this.address = data.address.address
        this.Time = data.address.Time
        this.headImg = data.address.headImg
        this.name = data.address.name
        this.convertFrom(this.Lng, this.Lat)
      }
    }
  },
  format(fmt){
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
}
</script>
<style lang="stylus" scoped>
.amap-page-container
  width 100%
  margin 0 auto
  .amap-demo
    .friendInf-warp
      width 96%
      padding .2rem 0
      background #fff
      // background rgba(206,221,239,0.7)
      -webkit-box-shadow 0 3px 8px rgba(53,150,234,0.4);
      box-shadow: 0 3px 8px rgba(53,150,234,0.4);
      position absolute
      top 0.2rem
      left 2%
      display flex
      flex-flow row nowrap
      justify-content space-around
      align-items center
      background #fff;
      border-radius: 0.1rem;
      .myImg
        width 1.4rem
        height 1.4rem
        border-radius 50%
      ul
        width 75%
        li
          padding .1rem 0
          &:nth-child(3)
            p
              color #929aab
          h3
            margin-top .2rem
            font-size .3rem
            font-weight bold
          p
            font-size .26rem

</style>
