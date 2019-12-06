<template>
  <div class="report_item_wrapper">
    <div class="report_header">
      <div class="item_title">
        <i class="iconfont">&#xe611;</i>
        <span>{{$t('title.sports')}}</span>
        <span class="srart_end_time" v-show="showData">{{time}}</span>
      </div>
      <div class="item_warn"></div>
    </div>
    <div class="echarts_wrapper" v-show="showData">
      <!-- 图表数据 -->
      <div class="draw_echarts">
        <keep-alive>
          <div class="chart" ref="chart" :id="id"></div>
        </keep-alive>
      </div>
      <p class="chartTip">*{{$t('tag.shipin')}}</p>
      <div class="parameter">
        <div class="cal">
          <div class="value">
            <template v-if="cal!==''">
              <strong>{{cal}}</strong>
              <i>{{$t('tag.cal')}}</i>
            </template>
            <template v-else>--</template>
          </div>
          <p class="title">{{$t('tag.sports.kaluli')}}</p>
        </div>
        <!-- 平均、最高、最低值 -->
        <ul>
          <li class="item">
            <span class="value">
              <template v-if="steps!==''">
                <strong>{{steps}}</strong>
                <i>{{$t('tag.bu')}}</i>
              </template>
              <template v-else>--</template>
            </span>
            <p class="title">{{$t('tag.sports.jinristep')}}</p>
          </li>
          <li class="item">
            <span class="value">
              <template v-if="distance!==''">
                <strong>{{distance}}</strong>
                <i>{{$t('tag.mile')}}</i>
              </template>
              <template v-else>--</template>
            </span>
            <p class="title">{{$t('tag.sports.leiji')}}</p>
          </li>
        </ul>
      </div>
      <div class="part-top">
        <div class="header">
          <i class="iconfont">&#xe61d;</i>
          <h2>{{$t('title.secondaryTitle.youxiaoSport')}}</h2>
        </div>
        <div class="steps">
          <div
            :class="['level', today.value !=='' && today.color != 'normal' ? today.color:'normal']"
          >
            <template v-if="today.value !== ''">
              <div class="star">
                <i class="iconfont" v-for="(starItem,i) of starsNum" :key="i">&#xe6c8;</i>
                <i class="iconfont" v-if="!Number.isInteger(star)">&#xe6c9;</i>
                <span class="text">{{$t('tag.'+statec)}}</span>
              </div>
              <div>
                <strong>{{today.value}}</strong>
                <span>{{$t('tag.bu')}}</span>
              </div>
            </template>
            <template v-else>--</template>
          </div>
          <div class="title">{{$t('tag.sports.todaySteps')}}</div>
        </div>
      </div>
      <!-- 健康报告 -->
      <div class="read part-top">
        <div class="header">
          <i class="iconfont">&#xe61d;</i>
          <h2>{{$t('title.secondaryTitle.stepsReport')}}</h2>
        </div>
        <div class="content">
          <div :class="['article',contentShow ? 'show' : 'hidden']">
            <p v-for="(item,index) in content" :key="index">{{item}}</p>
          </div>
          <div :class="['mask',contentShow ? 'show' : 'hidden']" @click="contentToggle">
            <i class="iconfont" v-show="!contentShow">&#xe632;</i>
            <i class="iconfont" v-show="contentShow">&#xe633;</i>
          </div>
        </div>
      </div>
    </div>
    <!-- 暂无数据 -->
    <p class="nodata" v-show="!showData">{{$t('tag.sports.noday')}}</p>
  </div>
</template>
<script>
const LIGHON = "ON";
export default {
  name: "daySports",
  props: {
    sendTime: {
      type: String,
      require: true,
      default: ""
    }
  },
  data() {
    return {
      id: "daySports",
      halfStar: false,
      showData: true,
      emit: {},
      // 图表
      contentShow: false,
      chart_x_time: [],
      today: [],
      stepsvalue: [],
      content: [],
      time: "",
      cal: "",
      distance: "", // 行程
      steps: "",
      star: "",
      statec: ""
    };
  },
  mounted() {
    var echartsDom = document.getElementById(this.id);
    var contentHeight = window.getComputedStyle(echartsDom).height;
    var contentWidth = window.getComputedStyle(echartsDom).width;
    echartsDom.style.height = contentHeight;
    echartsDom.style.width = contentWidth;
  },

  methods: {
    getEchartsDataInfo() {
      let postData = {
        date: this.sendTime,
        userid: this.$route.params.userID,
        friendid: this.$route.params.friendID,
        token: this.$route.params.token
      };
      this.$axios.getDaysports(postData).then(this.getEchartsDataInfoSucc);
    },
    getEchartsDataInfoSucc(res) {
      if (res.code === 0 && res.data) {
        this.showData = true;
        this.chart_x_time = [];
        this.stepsvalue = [];
        const getData = res.data;
        this.cal = getData.outlineData.cal;
        this.distance = getData.outlineData.distance;

        this.statec = getData.outlineData.statec;
        this.content = this.$t("steps.day." + this.statec);
        let startTime = getData.outlineData.startTime;
        let endTime = getData.outlineData.endTime;
        this.today = getData.outlineData.today;
        this.star = getData.outlineData.today.star;
        // if (this.star & 2 !== 0) {
        //   this.halfStar = true
        // }
        this.steps = getData.outlineData.steps;
        this.time = "(" + startTime + " -- " + endTime + ")";
        // 图表数据
        let chart = getData.stepsList;
        for (let a in chart) {
          this.chart_x_time.push(chart[a].time);
          this.stepsvalue.push(chart[a].step);
        }
        this.init();
        this.setOption(this.options);
      } else {
        this.showData = false;
      }
      this.emit.code = res.code;
      // this.emit.time = this.sendTime
      // this.emit.spFlag = this.showData
      this.$emit("daysportscode", this.emit);
    },
    init() {
      let _this = this;
      this.chart = this.$echarts.init(document.getElementById(this.id));
      window.addEventListener("resize", function() {
        _this.chart && _this.chart.resize();
      });
    },
    setOption(option) {
      if (!this.chart) {
        return;
      }
      this.chart.setOption(option);
    },
    contentToggle() {
      this.contentShow = !this.contentShow;
    },
    dispose() {
      if (!this.chart) {
        return;
      }
      this.chart.dispose();
      this.chart = null;
    }
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  computed: {
    starsNum() {
      let result = []; // 整颗的数量
      let getStarnum = Math.floor(this.star * 2) / 2; // 原数
      let getIntnum = Math.floor(this.star);
      if (getStarnum % 2 === 0) {
        // 如果是整数
        for (let i = 1; i <= getIntnum; i++) {
          result.push(LIGHON);
        }
      } else {
        // 半星
        for (let i = 1; i <= getIntnum; i++) {
          result.push(LIGHON);
        }
      }
      return result;
    },
    options() {
      return {
        series: {
          name: this.$t("components.bushu"),
          barCategoryGap: "40%",
          type: "bar",
          data: this.stepsvalue
        },
        color: "#0082d6",
        grid: {
          containLabel: true,
          top: 20,
          bottom: 10,
          left: 0,
          right: 0
        },
        xAxis: {
          type: "category",
          axisLine: {
            lineStyle: {
              color: "#54657e",
              width: 1
            }
          },
          data: this.chart_x_time,
          axisLabel: {
            formatter: function(params) {
              return params + ":00";
            }
          }
        },
        yAxis: {
          type: "value",
          splitLine: {
            show: false
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: "#54657e"
            }
          },
          axisTick: {
            show: false
          }
        },
        dataZoom: [
          {
            type: "inside",
            start: 0,
            end: 90
          }
        ],
        tooltip: {
          trigger: "axis"
          // formatter: function (params) {
          //   let time = params[0].axisValue
          //   let steps = params[0].value
          //   let tip = steps ? time + ':00<br/>' + '总共走了' + steps + '步' : time + ':00<br/>' + '还没步数哦'
          //   return tip
          // }
        }
      };
    }
  },
  components: {},
  watch: {
    sendTime: function(newval, oldval) {
      this.getEchartsDataInfo();
    }
  }
};
</script>
<style lang="stylus" scoped>
@import '~styles/variable.styl';
@import '~styles/global.styl';
</style>
