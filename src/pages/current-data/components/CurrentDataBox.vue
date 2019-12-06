<template>
  <router-link :to="item.key!=='ecg'&&(item.levelColor === 'gray' || (item.key === 'viscera' && item.valueColor === 'gray')) ? '' : '/report/' + item.key  + '/' + $route.params.device + '/' + $route.params.userID + '/' + $route.params.token + '/' + $route.params.friendID +  '?page=current'"
               :class="['cur_data_box', item.levelColor]">
    <template v-if="item.levelColor === 'gray'">
      <h2>{{$t('currentBox.' + item.key)}}</h2>
      <div class="value">
        <template v-if="(item.key === 'viscera')">
          <span>{{$t('tag.' + item.valuelanguage)}}</span>
          <span v-if="item.valueSuffix"
                class="valueSuffix">{{$t('tag.suffix.' + item.suffixlanguage)}}</span>
        </template>
        <template v-else>
          <span>--</span>
        </template>
      </div>
    </template>
    <template v-else>
      <h2>{{$t('currentBox.' + item.key)}}</h2>
      <div v-if="(item.key !== 'usersleep') && (item.key !== 'fatiguemonitoring') && (item.key !== 'ecg')&&(item.key !== 'hrhy')"
           class="level_value">{{$t('tag.' + item.levellanguage)}}</div>
      <div v-if="item.star !=='' && item.star >= 0"
           :class="['star', item.levelColor]">
        <!-- <template v-if="item.star === 0"><span>0</span> <i class="iconfont">&#xe6c8;</i></template> -->
        <!-- <template v-else-if="item.star > 5"><span>{{item.star}}</span> <i class="iconfont">&#xe6c8;</i></template> -->
        <!-- <template> -->
        <i class="iconfont"
           v-for="(star,index) of (parseInt(Number(item.star)))"
           :key="index">&#xe6c8;</i>
        <i class="iconfont"
           v-if="!Number.isInteger(item.star)">&#xe6c9;</i>
        <!-- </template> -->
      </div>
      <div :class="[{ sport: item.key === 'steps' }, 'value', item.valueColor]">
        <span v-if="((item.key === 'viscera') || (item.key === 'fatiguemonitoring') || (item.key === 'cardiopulmonary') || (item.key === 'usersleep'))">
          {{$t('tag.' + item.valuelanguage)}}
        </span>
        <span v-else>{{item.value}}</span>
        <span v-if="item.valueSuffix"
              :class="[{ sport: item.key === 'steps' }, 'valueSuffix']">{{$t('tag.suffix.' + item.suffixlanguage)}}</span>
      </div>
      <div v-if="item.trend"
           class="trend">
        <i v-if="item.trend === 'up'"
           class="up iconfont">&#xe630;</i>
        <i v-if="item.trend === 'down'"
           class="down iconfont">&#xe631;</i>
      </div>
    </template>
  </router-link>
</template>
<script>
export default {
  name: 'CurrentDataBox',
  props: {
    item: {
      type: Object,
      default: function () {
        return {
          'key': '',
          'title': '',
          'value': '',
          'valueSuffix': '',
          'trend': '',
          'star': 0,
          'vHeartrate': '',
          'levelValue': '',
          'levelColor': ''
        }
      }
    }
  }
}

</script>
<style lang="stylus" scoped>
@import '~styles/variable.styl';

.cur_data_box {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  box-sizing: border-box;
  padding-left: 0.1rem;
  margin: 0.2rem 1%;
  box-sizing: border-box;
  border-radius: 0.08rem;
  width: 48%;
  height: 1.5rem;

  &.gray {
    border: 1px solid $grayBorder;
    box-shadow: 0px 2px 5px $grayBorder;

    h2 {
      background-color: $grayText;
    }

    .value, .valueSuffix, .star, .level_value {
      color: $grayText;
    }
  }

  &.blue {
    border: 1px solid $blueBorder;
    box-shadow: 0px 2px 5px $blueBorder;

    h2 {
      background-color: $blueText;
    }

    .star, .level_value {
      color: $blueText;
    }
  }

  &.orange {
    border: 1px solid $orangeBorder;
    box-shadow: 0px 2px 5px $orangeBorder;

    h2 {
      background-color: $orangeText;
    }

    .star, .level_value {
      color: $orangeText;
    }
  }

  &.light-red {
    border: 1px solid $lightRedBorder;
    box-shadow: 0px 2px 5px $lightRedBorder;

    h2 {
      background-color: $lightRedText;
    }

    .star, .level_value {
      color: $lightRedText;
    }
  }

  &.red {
    border: 1px solid $redBorder;
    box-shadow: 0px 2px 5px $redBorder;

    h2 {
      background-color: $redText;
    }

    .star, .level_value {
      color: $redText;
    }
  }

  &.purple {
    border: 1px solid $purpleBorder;
    box-shadow: 0px 2px 5px $purpleBorder;

    h2 {
      background-color: $purpleText;
    }

    .star, .level_value {
      color: $purpleText;
    }
  }

  h2 {
    position: absolute;
    top: -0.25rem;
    left: 0.1rem;
    padding: 0.12rem 0.15rem 0.1rem 0.15rem;
    border-radius: 0.1rem;
    font-size: 0.25rem;
    font-weight: bold;
    color: #ffffff;
  }

  .value {
    display: flex;
    font-size: 0.42rem;

    .valueSuffix {
      margin: 0.1rem 0 0 0.1rem;
      font-size: 0.3rem;
    }

    &.blue {
      color: $blueText;
    }

    &.orange {
      color: $orangeText;
    }

    &.light-red {
      color: $lightRedText;
    }

    &.red {
      color: $redText;
    }

    &.purple {
      color: $purpleText;
    }

    &.gray {
      color: $grayText;
    }
  }

  .trend {
    .up {
      color: #00d900;
    }

    .down {
      color: #ea3535;
    }
  }

  .sport.value {
    display: flex;
    margin-top: 0.45rem;
    font-size: 0.38rem;
  }

  .sport.valueSuffix {
    margin-top: 0.1rem;
  }

  .star {
    display: flex;
    position: absolute;
    top: 0.4rem;

    span {
      font-size: 0.24rem;
      margin-right: 0.1rem;
    }

    .iconfont {
      font-size: 0.2rem;
    }

    &.blue span, &.blue .iconfont {
      color: $blueText;
    }

    &.orange span, &.orange .iconfont {
      color: $orangeText;
    }

    &.red span, &.red .iconfont {
      color: $redText;
    }
  }

  .level_value {
    position: absolute;
    top: 0.2rem;
    right: 0.2rem;
    font-size: 0.28rem;
  }
}
</style>
