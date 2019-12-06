<template>
  <div class="wrapper" v-show="show" @click.self="close">
    <div class="warn-container">
      <div class="warn-title">
        <h1>{{plugValue.title}}</h1>
      </div>
      <div class="warn-body">
        <ul>
          <li>
            <p>{{plugValue.time}}</p>
            <p>{{plugValue.rate}}</p>
          </li>
          <li v-for="item of plugValue.warnList" :key="item.time" :class="item.color">
           <!-- <span></span> -->
            <span class="time">{{item.time}}</span>
            <span>{{item.rate}}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'warnList',
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
  mounted () {
    // console.log(this.plugValue)
  }
}
</script>
<style lang="stylus" scoped>
.wrapper
  box-sizing border-box
  position border-box
  border 1px solid $blueBorder
  box-shadow 0px 2px 5px $blueBorder
  border-radius 0.08rem
  width 6rem
  font-size 0.3rem
  text-align: center;
  background-color #fff
  .warn-container
    background-color #fff
    .warn-title
      text-align center
      margin:.3rem
    .warn-body
      height:5rem;
      overflow-y: scroll;
      padding 0 .1rem
      ul
        display:flex
        flex-flow:column
        justify-content:center
        li
          padding .18rem 0
          &:nth-of-type(odd)
            background #efefef
          &:nth-of-type(even)
            background #fafafa
          span
            display inline-block
            width 45%
            font-size .26rem
          p
            width 45%
            font-size .26rem
            display inline-block
        .red
          color: #ea3535;
        .normal
          color: #333;

</style>
