<template>
  <div class="wrapper" v-show="show" @click.self="close">
    <div class="alert-container">
      <div class="alert-title">
        <i class="iconfont">&#xe616;</i>
        <h1>{{plugValue.listType}}{{plugValue.title}}</h1>
      </div>
      <div class="alert-body">
        <div class="listShow" v-show="!plugValue.hasList">
          <ul
            v-for="(item,index) of plugValue.reportList"
            :key="index"
            @click="chooseDate(index)"
            :class="{current: index===weeklistIndex}"
            >
            <li>
              <!-- <i>{{item.num}}</i> -->
              <span>第{{item.num}}<span>{{plugValue.listType}}</span></span>
            </li>
            <li>
              <span>{{item.date}}</span>
            </li>
          </ul>
        </div>
        <div class="noList" v-show="plugValue.hasList">{{plugValue.nodata}}</div>
      </div>
      <div class="alert-footer">
        <a  :style="{'border-width':'1px'}"  @click.self="close">{{plugValue.reset}}</a>
        <a  :style="{'border-width':'1px'}"  @click="formVisible">{{plugValue.sub}}</a>
      </div>
    </div>
  </div>
</template>
<script>
import {bus} from '../../../../../main.js'
export default {
  name: 'listPlug',
  props: {
    plugValue: {
      type: Object,
      dafalult: () => {}
    },
    show: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      // hasList: false,
      msg: '',
      weeklistIndex: 0,
      currentSelect: '',
      currentTm: '',
      type: ''
    }
  },
  mounted () {
    this.defaultCurrentTm()
  },
  methods: {
    defaultCurrentTm () {
      if (this.plugValue.reportList.length !== 0) {
        this.currentTm = this.plugValue.reportList[0].date
      }
    },
    close () {
      this.$alertPl.hide()
    },
    chooseDate (index) {
      // 选择周
      this.weeklistIndex = index
      this.currentSelect = this.plugValue.reportList[index].date
    },
    formVisible () {
      // 确认
      if (this.plugValue.reportList.length !== 0) {
        this.defaultCurrentTm()
        this.currentTm = this.currentSelect ? this.currentSelect : this.currentTm
        this.type = this.plugValue.type
        if (this.type === 'week') {
          bus.$emit('currentWkVal', this.currentTm)
        } else if (this.type === 'month') {
          bus.$emit('currentMhVal', this.currentTm)
        } else if (this.type === 'year') {
          bus.$emit('currentYeVal', this.currentTm)
        }
        // console.log('确定this.currentTm:： ' + this.currentTm)
      }
      this.$alertPl.hide()
    }
  }
}
</script>
<style lang="stylus" scoped>
.wrapper
  box-sizing border-box
  position border-box
  border solid $blueBorder
  box-shadow 0px 2px 5px $blueBorder
  border-radius 0.08rem
  width 6rem
  font-size 0.3rem
  text-align: center;
  background-color #fff
  .alert-container
    background-color #fff
    .alert-title
      display:flex
      flex-flow:row nowrap
      align-items:center
      margin:.4rem
      i
        color:#3596ea
        font-size .4rem
    .alert-body .listShow
      box-sizing: border-box;
      height:5rem;
      overflow-y: scroll;
      padding 0 .1rem
      ul
        display:flex
        flex-flow:row nowrap
        justify-content:space-between
        padding:.18rem .2rem;
        border-bottom:1px solid #ddd
        li
          display:flex
          flex-flow:row nowrap
          align-items:center
          &:nth-child(1)
            i
              color:white
              display:flex
              justify-content :center
              align-items:center
              width:.5rem
              height:.5rem
              border-radius:50%
              background-color:#3598e9
            span
              // letter-spacing :-0.1px
          &:nth-child(2)
            span
              float:right
              letter-spacing :-0.1px
              font-size:.22rem
      .current
        background-color #f3f8ff
        margin-left .2rem
    .noList
      text-align center
      margin .5rem 0
    .alert-footer
      margin .2rem
      box-sizing: border-box;
      display flex
      flex-flow row nowrap
      justify-content flex-end
      a
        padding 0.2rem .5rem
        margin-left .4rem
        border-radius .1rem
        &:nth-child(1)
          color #606266
          border  solid #DCDFE6
        &:nth-child(2)
          color #fff
          border  solid #409EFF
          background-color #409EFF
</style>
