<template>
  <div class="report_item_wrapper">
    <div class="report_header">
      <div class="item_title">
        <i class="iconfont">&#xe611;</i>
        <span>{{$t('title.sports')}}</span>

        <span class="srart_end_time" v-show="echartShows">{{time}}</span>
      </div>
      <div class="item_warn"></div>
    </div>
    <div class="echarts_wrapper" v-show="echartShows">
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
            <template v-if="dailyAveCal!==''">
              <strong>{{dailyAveCal}}</strong>
              <i>{{$t('tag.cal')}}</i>
            </template>
            <template v-else>--</template>
          </div>
          <p class="title">{{$t('tag.sports.dailyCal')}}</p>
        </div>
        <!-- 平均、最高、最低值 -->
        <ul>
          <li class="item">
            <span class="value">
              <template v-if="weekSteps!==''">
                <strong>{{weekSteps}}</strong>
                <i>{{$t('components.'+sumUnit)}}</i>
              </template>
              <template v-else>--</template>
            </span>
            <p class="title">{{$t('tag.sports.weekbu')}}</p>
          </li>
          <li class="item">
            <span class="value">
              <template v-if="weekDistance!==''">
                <strong>{{weekDistance}}</strong>
                <i>{{$t('tag.mile')}}</i>
              </template>
              <template v-else>--</template>
            </span>
            <p class="title">{{$t('tag.sports.weekmile')}}</p>
          </li>
          <li class="item">
            <span class="value">
              <template v-if="dailyAveSteps!==''">
                <strong>{{dailyAveSteps}}</strong>
                <i>{{$t('tag.bu')}}</i>
              </template>
              <template v-else>--</template>
            </span>
            <p class="title">{{$t('tag.sports.dailyavebu')}}</p>
          </li>
        </ul>
      </div>
      <div class="part-top">
        <div class="header">
          <i class="iconfont">&#xe61d;</i>
          <h2>{{$t('title.secondaryTitle.youxiaoSport')}}</h2>
        </div>
        <div class="steps">
          <div :class="['level', effectiveSteps !=='' && color != 'normal' ? color:'normal']">
            <template v-if="effectiveSteps !== ''">
              <div>
                <strong>{{effectiveSteps}}</strong>
                <span>{{$t('components.'+effectUnit)}}</span>
              </div>
              <div>
                <strong>{{day}}</strong>
                <span>{{$t('tag.sports.daydabiao')}}</span>
              </div>
            </template>
            <template v-else>--</template>
          </div>
          <div class="title">{{$t('tag.sports.youxiao')}}</div>
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
            <p>{{content}}</p>
          </div>
          <div :class="['mask',contentShow ? 'show' : 'hidden']" @click="contentToggle">
            <i class="iconfont" v-show="!contentShow">&#xe632;</i>
            <i class="iconfont" v-show="contentShow">&#xe633;</i>
          </div>
        </div>
      </div>
    </div>
    <!-- 暂无数据 -->
    <div class="nodata" v-show="!echartShows">{{$t('tag.sports.noweek')}}</div>
  </div>
</template>
<script>
export default {
  name: "weekSteps",
  props: {
    sendTime: {
      type: String,
      require: true,
      default: ""
    }
  },
  data() {
    return {
      emit: {},
      echartShows: true,
      id: "weekSteps",
      contentShow: false,
      // 图表
      chart_x_time: [],
      content: "",
      statec: "",
      state: "",
      time: "",
      dailyAveCal: "", // 日平均热量
      effectiveSteps: "", // 有效运动量
      trueunit: "", // 有效运动单位
      day: "", // 达标天数
      weekSteps: "", // 周总步数
      sunit: "", // 总步数单位
      weekDistance: "", // 周行程
      munit: "", // 行程单位
      dailyAveSteps: "", // 平均步数
      color: "",
      steps: [],
      sumUnit: "",
      effectUnit: ""
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
        week: this.sendTime,
        userid: this.$route.params.userID,
        friendid: this.$route.params.friendID,
        token: this.$route.params.token
      };
      this.$axios.getWeeksports(postData).then(this.getEchartsDataInfoSucc);
    },
    getEchartsDataInfoSucc(res) {
      this.emit.code = res.code;
      // this.emit.time = this.sendTime
      this.$emit("stepcode", this.emit);
      console.log("步数模块：" + res.code);
      if (res.code === 0 && res.data) {
        this.echartShows = true;
        this.warnings = 0;
        const getData = res.data;
        this.dailyAveSteps = getData.outlineData.dailyAveSteps;
        this.state = getData.outlineData.state;
        this.dailyAveCal = getData.outlineData.dailyAveCal;
        this.effectiveSteps = getData.outlineData.sum_true_step;
        this.day = getData.outlineData.day;
        this.weekSteps = getData.outlineData.weekSteps;
        this.weekDistance = getData.outlineData.weekDistance;
        let startTime = getData.outlineData.startTime;
        let endTime = getData.outlineData.endTime;
        this.day = getData.outlineData.day;
        this.color = getData.outlineData.color;
        this.time = "(" + startTime + "-" + endTime + ")";

        this.sumUnit = getData.outlineData.sunitstate;
        this.effectUnit = getData.outlineData.trueunitstate;

        this.statec = getData.outlineData.statec;
        this.content =
          this.$t("steps.week.a1") +
          this.dailyAveSteps +
          this.$t("steps.week.a2") +
          this.dailyAveCal +
          this.$t("steps.week." + this.statec);
        // 图表数据
        this.chart_x_time = [];
        this.steps = [];
        let stepsList = getData.stepsList;
        for (let i in stepsList) {
          this.chart_x_time.push(stepsList[i].time);
          this.steps.push(stepsList[i].steps);
        }

        this.init();
        this.setOption(this.options);
      } else {
        this.echartShows = false;
      }
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
    options() {
      return {
        series: {
          name: this.$t("components.bushu"),
          barCategoryGap: "40%",
          type: "bar",
          data: this.steps
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
          data: this.chart_x_time
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
            end: 100
          }
        ],
        tooltip: {
          trigger: "axis"
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
