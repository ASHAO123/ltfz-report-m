<template>
  <div class="b-wrapper">
    <ul class="flx-row">
      <li>
        <p>
          <strong>{{item.range}}</strong>
          <i>{{$t('tag.xinlv.danwei')}}</i>
        </p>
        <p>{{$t('tag.zangfu.cankao')}}</p>
      </li>
      <li>
        <i class="iconfont">&#xe62e;</i>
      </li>
    </ul>
    <ul class="flx-row">
      <li>
        <p :class="item.maxHeartRate.color">
          <strong>{{item.maxHeartRate.value}}</strong>
          <i>bpm</i>
        </p>
        <p>{{$t('tag.zangfu.hight')}}</p>
      </li>
      <li>
        <p :class="item.minHeartRate.color">
          <strong>{{item.minHeartRate.value}}</strong>
          <i>bpm</i>
        </p>
        <p>{{$t('tag.zangfu.low')}}</p>
      </li>
      <li>
        <p :class="item.averageHeartRate.color">
          <strong>{{item.averageHeartRate.value}}</strong>
          <i>bpm</i>
        </p>
        <p>{{$t('tag.zangfu.ave')}}</p>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: 'warnData',
  props: ['item']
}
</script>

<style lang="stylus" scoped>
.b-wrapper
  margin .2rem 0
  display flex
  flex-flow column
  .flx-row
    display flex
    flex-flow row nowrap
    justify-content space-around
    align-items center
    margin .2rem 0
    font-size .26rem
    li
      display flex
      flex-flow column
      .orange
        color orange
      .red
        color red
      &:nth-child(2)
        .iconfont
          color #3596ea
          font-size .6rem
          font-weight bold
      p
        &:nth-child(2)
          margin-top .3rem
        strong
          font-size .4rem
          font-weight bold
    &:nth-child(1)
      li
        &:nth-child(1)
          p
            &:nth-child(1)
              color #3596ea
</style>
