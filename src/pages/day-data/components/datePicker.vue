<template>
  <div class="date-picker-container flex-center" :class="{'hidden-footer': footer }">
    <div class="date-picker-background flex-center"></div>

    <div class="calendar-container">
      <div class="calendar">
        <div :style="{ 'background-color': color }" class="calendar-header flex-center">
          <div>
            <!--年选择功能取消了，@click="setSelecting('year')"注释掉-->
            <!--<h3 :class="{ 'calendar-faint': selecting === 'date' }"
            @click="setSelecting('year')">-->
            <h3 :class="{ 'calendar-faint': selecting === 'date' }">
              {{ selectedYear }}
              <!--<i class="iconfont"
              v-if="selecting === 'date'">&#xe616;</i>-->
            </h3>
            <!--年选择功能取消了，所以日期点击事件也不会存在了，@click="setSelecting('date')"注释掉-->
            <!--<h2 :class="{ 'calendar-faint': selecting === 'year' }"
            @click="setSelecting('date')">-->
            <h2 :class="{ 'calendar-faint': selecting === 'year' }">
              {{ selectedMonthWord }},{{ selectedDay }} {{ abbrivatedDay }}
              <!--<i class="iconfont"
              v-if="selecting === 'year'">&#xe616;</i>-->
            </h2>
          </div>
        </div>

        <!-- Calendar -->
        <div class="calendar-body" v-if="selecting === 'date'">
          <div class="calendar-date">
            <!--左边箭头切换月份-->
            <div>
              <!-- The svg's are from the material design chevron arrows -->
              <div
                class="calendar-arrows flex left"
                @click="setByMonth(currentMonth - 1)"
                v-if="showLeftArrow"
              >
                <!-- <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <path fill="#212121" d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path>
                </svg> -->
                <i></i>
              </div>
            </div>
            <!--左边箭头切换月份-->
            <div class="calendar-current-date flex-center">
              <h4>{{ currentYear }} - {{ currentMonthWord }}</h4>
            </div>
            <!--右边箭头切换月份-->
            <div>
              <div
                class="calendar-arrows flex right"
                @click="setByMonth(currentMonth + 1)"
                v-if="showRightArrow"
              >
                <!-- <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <path fill="#212121" d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path>
                </svg> -->
                <i></i>
              </div>
            </div>
            <!--右边箭头切换月份-->
          </div>

          <table>
            <thead>
              <tr>
                <td>日</td>
                <td>一</td>
                <td>二</td>
                <td>三</td>
                <td>四</td>
                <td>五</td>
                <td>六</td>
              </tr>
            </thead>
            <!--每一天的td标签-->
            <tbody>
              <!--tr是一行，也就是一周-->
              <tr v-for="(days, index) in calendar" :key="index">
                <!--td是每一天-->
                <td
                  :style="{
                      'color': day.currentDay && ! day.selected ? color : '',
                      'background-color': day.selected ? color : ''
                     }"
                  :class="[{
                      'current-day': day.currentDay,
                      'disabled': day.disabled,
                      'selected': day.selected
                    }]"
                  v-for="(day, index) in days"
                  :key="`day-${index}-${day.day}`"
                  tabindex="0"
                  @keydown.enter="onInput"
                  @keydown.space.stop.prevent="onInput"
                  @keydown.esc="onClose"
                  @click="day.day?setByDay(day):''"
                >
                  {{ day.day }}
                  <i
                    v-show="day.day"
                    :data-date="day.day?`${currentYear}-${currentMonthWord}-${day.day}`:''"
                    :class="setDateIconColor(`${currentYear}-${currentMonthWord}-${day.day}`)"
                  ></i>
                </td>
              </tr>
            </tbody>
            <!--每一天的td标签-->
          </table>
        </div>

        <!-- Years 切换年,月份-->
        <div class="selectYearMonthContain">
          <div class="calendar-year-select" v-if="selecting === 'year'">
            <div
              :style="{ 'color': year.selected ? color : '' }"
              :class="{ 'selected': year.selected }"
              :id="`${year.year}-calendar-year`"
              v-for="year in years"
              :key="year.year"
              @click="setByYear(year.year)"
            >{{ year.year }}</div>
          </div>
          <div class="calendar-month-select" v-if="selecting === 'year'">
            <div
              :style="{ 'color': month.selected ? color : '' }"
              :class="{ 'selected': month.selected }"
              :id="`${month.month}-calendar-month`"
              v-for="month in months"
              :key="month.month"
              @click="setByselectMonth(month.month)"
            >{{ month.month+1 }}</div>
          </div>
        </div>

        <div class="calendar-footer" v-if="selecting === 'date'">
          <button :style="{ 'color': color }" @click.stop.prevent="onClose">{{$t('tag.quxiao')}}</button>

          <button :style="{ 'color': color }" @click.stop.prevent="onInput">{{$t('tag.queren')}}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * Helpers for no dependencies™
 */
(function (doc, win) {
  var docEl = doc.documentElement,
    resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
    recalc = function () {
      var clientWidth = docEl.clientWidth
      if (!clientWidth) return
      if (clientWidth >= 750) {
        docEl.style.fontSize = '100px'
      } else {
        docEl.style.fontSize = 100 * (clientWidth / 750) + 'px'
      }
    }

  if (!doc.addEventListener) return
  win.addEventListener(resizeEvt, recalc, false)
  doc.addEventListener('DOMContentLoaded', recalc, false)
})(document, window)
// rem 和px转换

const dayMap = {
  0: '周日',
  1: '周一',
  2: '周二',
  3: '周三',
  4: '周四',
  5: '周五',
  6: '周六'
}

const monthMap = {
  0: '01',
  1: '02',
  2: '03',
  3: '04',
  4: '05',
  5: '06',
  6: '07',
  7: '08',
  8: '09',
  9: '10',
  10: '11',
  11: '12'
}

// Thanks, Lodash.

/**
 * https://lodash.com/docs/4.17.4#slice
 */
const slice = (array, start, end) => {
  let length = array == null ? 0 : array.length

  if (!length) {
    return []
  }

  start = start == null ? 0 : start

  end = end === undefined ? length : end

  if (start < 0) {
    start = -start > length ? 0 : length + start
  }

  end = end > length ? length : end

  if (end < 0) {
    end += length
  }

  length = start > end ? 0 : (end - start) >>> 0
  start >>>= 0

  let index = -1

  const result = new Array(length)

  while (++index < length) {
    result[index] = array[index + start]
  }

  return result
}

/**
 * https://lodash.com/docs/4.17.4#chunk
 */
const chunk = (array, size) => {
  size = Math.max(size, 0)

  const length = array == null ? 0 : array.length

  if (!length || size < 1) {
    return []
  }

  let index = 0

  let resIndex = 0

  const result = new Array(Math.ceil(length / size))

  while (index < length) {
    result[resIndex++] = slice(array, index, (index += size))
  }

  return result
}

/**
 * Actual component stuff
 */
//  import axios from 'axios'
export default {
  props: {
    color: {
      type: String,
      required: false,
      default: '#3596ea'
    },

    format: {
      type: Function,
      required: false
    },

    min: {
      type: String,
      required: false
    },

    max: {
      type: String,
      required: false
    },

    value: {
      type: String,
      required: false
    },

    footer: {
      type: Boolean,
      required: false,
      default: false
    },

    current: {
      type: String,
      default: ''
    }

  },

  mounted () {
    this.getDateStatecolor()
    document.body.appendChild(this.$el)
  },

  computed: {
    /**
     * Returns if there was any initial date settings.
     *
     * @return {Boolean}
     */
    initialDate () {
      return !!(this.value || this.min)
    },

    /**
     * The date property, converted to a date.
     *
     * @return {Date}
     */
    specifiedDate () {
      return new Date(this.value)
    },

    /**
     * Returns a formatted date e.g. 2016-4-19. This is emiited on the input event.
     *
     * @return {String}
     */
    calculatedDate () {
      const day =
        this.selectedDay >= 10 ? this.selectedDay : `0${this.selectedDay}`

      const month =
        this.selectedMonth + 1 >= 10
          ? this.selectedMonth + 1
          : `0${this.selectedMonth + 1}`

      return `${this.selectedYear}-${month}-${day}`
    },

    /**
     * Returns an abbreviation of a day e.g. Sun, Mon, etc.
     *
     * @return {String}
     */
    abbrivatedDay () {
      // dayMap是一个包括周天—周一的七个数据组成的对象
      return dayMap[this.selectedDayOfWeek]
    },

    /**
     * Returns the currently viewed month as a word.
     *
     * @return {String}
     */
    currentMonthWord () {
      // monthMap是01-12月份的对象
      return monthMap[this.currentMonth]
    },

    /**
     * Returns the selected month as a word.
     *
     * @return {String}
     */
    selectedMonthWord () {
      // monthMap是01-12月份的对象
      return monthMap[this.selectedMonth]
    },
    /**
     * The minimum date the calendar will allow you to select.
     *
     * @return {Date}
     */
    minDate () {
      if (this.min) {
        const minDateSplit = this.min.split('-')
        // 如果设置了最小值，返回最小值日期格式
        return new Date(minDateSplit[0], minDateSplit[1], minDateSplit[2])
      }
    },

    /**
     * The maximum date the calendar will allow you to select.
     *
     * @return {Date}
     */
    maxDate () {
      if (this.max) {
        const maxDateSplit = this.max.split('-')
        // 如果设置了最大值，返回最大值日期格式
        return new Date(maxDateSplit[0], maxDateSplit[1], maxDateSplit[2])
      }
    },

    /**
     * Determines if the left arrow for the current date should be shown.
     *
     * @return {Boolean}
     */
    //      决定左边切换月份箭头是否显示
    showLeftArrow () {
      // Show the left arrow when there is either no mininum date, or when the
      // minimum year and minimum month are the same as the current year and
      // current month.
      if (!this.min) return true

      if (
        this.minDate.getFullYear() === this.currentYear &&
        this.minDate.getMonth() - 1 === this.currentMonth
      ) {
        return false
      }

      return true
    },

    /**
     * Determines if the right arrow for the current date should be shown.
     *
     * @return {Boolean}
     */
    //      决定右边切换月份箭头是否显示
    showRightArrow () {
      // Show the right arrow when there is either no maximum date, or when
      // the maximum year and maximum month are the same as the current
      // year and current month.
      if (!this.max) return true

      if (
        this.maxDate.getFullYear() === this.currentYear &&
        this.maxDate.getMonth() - 1 === this.currentMonth
      ) {
        return false
      }

      return true
    },

    /**
     * Computes a formatted array of days for a given month and year.
     *
     * @return {Array}
     */
    calendar () {
      // The calendar's output is a function of all of the days in a given
      // month, chunked into an array of arrays, each containing 5 or 6
      // and 7 elements respectively.
      const days = []

      // Padding for the first row, e.g. if the month's first day starts on
      // Friday, the first array will be ['', '', '', '', '', '1', '2']
      //      getDay()返回的是0-6
      const startOfMonthDay = new Date(
        this.currentYear,
        this.currentMonth,
        1
      ).getDay()

      for (let i = 0, len = startOfMonthDay; i < len; i++) {
        days.push('')
      }

      // Create an array containing all days in the current month
      //      getDate()返回1-31之间一个整数
      const daysInMonth =
        32 - new Date(this.currentYear, this.currentMonth, 32).getDate()

      for (let i = 0, len = daysInMonth; i < daysInMonth; i++) {
        days.push(i + 1)
      }
      //    到这里结束这个数组形如['','','','1','2',....'31']

      // Map the days from numbers to objects that have current day,
      // selected, and disabled properties for the view.
      const today = new Date()
      /**
       * 遍历一遍days数组，
       * 找出今天(在我们这个项目里其实是昨天)，所以day === today.getDate()-1
       * 可选择天(也就是1-31号)，
       * disabled天，也就是被限定的日期
       */
      const dayObjects = days.map(day => {
        const currentDay =
          day === today.getDate() &&
          this.currentMonth === today.getMonth() &&
          this.currentYear === today.getFullYear()

        const selected =
          this.selectedDay === day &&
          this.currentMonth === this.selectedMonth &&
          this.currentYear === this.selectedYear

        const disabled = this.dayDisabled(day)
        console.log("currentDay"+currentDay+ "selected"+selected)
        return { day, currentDay, selected, disabled }
      })

      // Chunk all of the days into an array of arrays, by seven.
      return chunk(dayObjects, 7)
    },

    /**
     * Computes a list of years.
     *
     * @return {Array}
     */
    years () {
      // Set the first year of the array.
      // 若是存在最小值限定，那么firstYear为最小值年份，否则为当前年
      let firstYear

      if (this.min) {
        firstYear = this.minDate.getFullYear()
      } else if (this.value) {
        firstYear = this.specifiedDate.getFullYear()
      } else {
        firstYear = new Date().getFullYear()
      }

      // Create a range of years to loop through which is either the maximum
      // date minus the first year, or simply 10.
      // 若是存在最大值限定，那么年份的选择也被限定了，否则默认为10年
      let through = this.max ? this.maxDate.getFullYear() + 1 - firstYear : 10

      let years = []

      for (let i = firstYear, len = firstYear + through; i < len; i++) {
        years.push(i)
      }

      return years.map(year => {
        return { year, selected: year === this.selectedYear }
      })
    },

    months () {
      let months = []

      for (let i = 0, len = 12; i < len; i++) {
        months.push(i)
      }

      return months.map(month => {
        return { month, selected: month === this.selectedMonth }
      })
    }
  },

  created () {
    // 默认body.style.overflow = 'hidden'
    this.hideBodyOverflow(true)

    this.setDate()

    this.setEscapeEvent()

    this.postTime = this.currentYear + '-' + this.currentMonthWord
  },

  data: () => ({
    selecting: 'date',
    currentMonth: '',
    currentYear: '',
    selectedDayOfWeek: '',
    selectedDay: '',
    selectedMonth: '',
    selectedYear: '',
    postTime: '',
    stateColorArr: [],
    noDatadate: []
  }),

  methods: {
    /**
     * Changes the display to the calendar or years depending on the value.
     *setSelecting函数写的是选择年月，现在的要求是不让用户选择年月下拉框
     * 要是以后需要加上这个需求了，只要在年标题那里加上click事件就好了。
     * 方法这些我都不动，只把年标题那个click事件取消掉。
     */
    setSelecting (value) {
      this.selecting = value

      // If the user is selecting a year, we want to go to the selected year
      // minus two (as does the material design date picker).
      if (value === 'year') {
        this.$nextTick(() => {
          const container = document.querySelector('.calendar-year-select')
          const el = document.getElementById(
            `${this.selectedYear}-calendar-year`
          )

          container.scrollTop = el.offsetTop - 100 - 76
        })
      }

      if (value === 'date') {
        // console.log('切换到date')
        /**
         *
         */
        if (
          this.min &&
          this.selectedYear === this.minDate.getFullYear() &&
          this.selectedMonth < this.minDate.getMonth() - 1
        ) {
          this.selectedMonth = this.minDate.getMonth() - 1
          this.currentMonth = this.minDate.getMonth() - 1
        }

        if (
          this.max &&
          this.selectedYear === this.maxDate.getFullYear() &&
          this.selectedMonth > this.maxDate.getMonth() - 1
        ) {
          this.selectedMonth = this.maxDate.getMonth() - 1
          this.currentMonth = this.maxDate.getMonth() - 1
        }

        //        this.getDateStatecolor ()
      }
    },

    /**
     * Set the date by the given day.
     *
     * @param {Object}
     */
    setByDay (day) {
      if (day.disabled) return
      /**
       * !!!!!!!!!!!!!!!!!!!!!!!!!
       * !!!现在的情况是，允许用户点击没有数据的日期，
       * !!!假设以后要禁止用户点击该日期，可在这里执行
       * !!!this.noDatadate数组保存的就是没有数据的天数[8,10,15]
       */
      //      if(this.noDatadate.indexOf(day.day) != -1){
      //        return
      //      }

      this.selectedYear = this.currentYear

      this.selectedDay = day.day

      this.selectedMonth = this.currentMonth

      this.selectedDayOfWeek = new Date(
        this.selectedYear,
        this.selectedMonth,
        day.day
      ).getDay()

      if (this.footer) {
        this.onInput()
      }
    },

    /**
     * Set the date by the given month.
     *
     * @param {[String, Number]}
     */
    setByMonth (month) {
      this.selectedDay = 1

      if (month === 12) {
        this.currentYear = this.currentYear + 1
        this.selectedYear = this.selectedYear + 1

        this.currentMonth = 0
        this.selectedMonth = 0

        this.getDateStatecolor()

        return
      }

      if (month === -1) {
        this.currentYear = this.currentYear - 1
        this.selectedYear = this.selectedYear - 1

        this.currentMonth = 11
        this.selectedMonth = 11

        this.getDateStatecolor()

        return
      }

      this.currentMonth = month
      this.selectedMonth = month
      /* 每次点击三角切换月份的时候，请求后台的数据 */
      this.getDateStatecolor()
    },

    /**
     * Set the date by the given year.
     *
     * @param {[String, Number]}
     */

    setByselectMonth (month) {
      this.selectedMonth = month
      this.currentMonth = month
      this.selectedDay = 1
    },

    setByYear (year) {
      this.selectedYear = year

      this.currentYear = year

      //      this.selecting = 'date'
    },

    /**
     * Set the initial date for the calendar.
     */
    setDate () {
      // If a date property has been passed to the component, that will be
      // used instead of the current day.
      //    date
      let date
      //    value是外部组件v-model值
      if (this.min && this.min && !this.value) {
        date = new Date(this.min)
      } else if (this.value && this.value) {
        date = new Date(this.value)
      } else {
        date = new Date()
      }

      //      if (this.initialDate) {
      //        this.selectedDay = date.getDate() + 1
      //      } else {
      //        this.selectedDay = date.getDate()
      //      }
      //    selectedDay初始为外部v-model值(若有的话),若无，则为new date今天
      this.selectedDay = date.getDate()
      //    selectedDayOfWeek为初始值处于周几
      this.selectedDayOfWeek = date.getDay()
      //    selectedMonth为初始值处于第几月
      this.selectedMonth = date.getMonth()

      this.currentMonth = date.getMonth()
      //    selectedYear为初始值处于第几年
      this.selectedYear = date.getFullYear()

      this.currentYear = date.getFullYear()
    },
    //  设置处于disabled状态的日期
    dayDisabled (day) {
      // A day is disabled when the minimum month and minimum year are equal
      // to the current month and year and the day is less than the min date's day
      if (
        this.min &&
        (this.minDate.getMonth() - 1 === this.currentMonth &&
          this.minDate.getFullYear() === this.currentYear) &&
        day < this.minDate.getDate()
      ) {
        return true
      }

      //  Or when the maximum month and maximum year are equal to the current
      //  month and year and the day is greater than the max date's day
      if (
        this.max &&
        (this.maxDate.getMonth() - 1 === this.currentMonth &&
          this.maxDate.getFullYear() === this.currentYear) &&
        day > this.maxDate.getDate()
      ) {
        return true
      }

      return false
    },

    //      YearMonthDisabled (){
    //      if(this.min &&
    //          (this.selectedYear === this.minDate.getFullYear() &&
    //            this.selectedMonth < this.minDate.getMonth() -1 )){
    //        return true
    //      }
    //
    //      if (this.max &&
    //          (this.selectedYear ===  this.maxDate.getFullYear() &&
    //            this.selectedMonth > this.maxDate.getMonth() - 1 )) {
    //        return true
    //      }
    //
    //      return false
    //    },

    // Misc methods that have nothing to do with calendar stuff.

    /**
     * Hides the overflow of the body when the date picker is active.
     *  日历active时，body溢出隐藏
     * @param  {Boolean}
     */
    hideBodyOverflow (show) {
      const bodyEl = document.querySelector('body')

      if (show === true) {
        bodyEl.style.overflow = 'hidden'

        return
      }

      bodyEl.style.overflow = ''
    },

    /**
     * Close the date picker if the escape key is pressed.
     * 按下esc键，关闭日历
     */
    setEscapeEvent () {
      document.addEventListener('keydown', event => {
        if (event.keyCode === 27 || event.key === 'Escape') {
          this.onClose()
        }
      })
    },

    /**
     * When the "Ok" button is pressed, or enter is pressed, emit the input
     * event and close the date picker.
     * 点击确认按钮后执行事件
     */
    onInput () {
      const date = this.format
        ? this.format(this.calculatedDate)
        : this.calculatedDate

      this.$emit('input', date)
      this.$emit('onnn', date)
      console.log('date===' + date)

      this.onClose()
    },

    /**
     * Emit a close event so the developer can close the date picker as they
     * see fit.
     * 触发close事件，body溢出为可溢出
     */
    onClose () {
      this.hideBodyOverflow(false)

      this.$emit('close')
    },

    closeSelectYearMonth () {
      this.selecting = 'date'
    },
    /**
     *日历颜色接口
     */
    getDateStatecolor () {
      let _this = this
      let postTime = _this.currentYear + '-' + _this.currentMonthWord
      //      axios.post('/api/getDateStatecolor',{})
      //        axios.post('https://rulong.lantianfangzhou.com/all/public/api/init/getcalendar',{
      //        'userid': _this.$route.params.userID,
      //          'friendid': _this.$route.params.friendID,
      //          'token': _this.$route.params.token,
      //        'date': postTime
      //      })
      //      .then(this.getDateStatecolorSucc)

      let datepickerData = {
        userid: _this.$route.params.userID,
        friendid: _this.$route.params.friendID,
        token: _this.$route.params.token,
        date: postTime,
        current: this.current
      }
      this.$axios.getCalendar(datepickerData).then(this.getDateStatecolorSucc)
    },
    getDateStatecolorSucc (res) {
      //      res = res.data
      this.noDatadate = []

      if (res.code === 0 && res.data) {
        this.stateColorArr = res.data

        this.stateColorArr.map(item => {
          if (
            item.date.slice(0, 7) ===
            `${this.currentYear}-${this.currentMonthWord}`
          ) {
            if (item.dayMark === '') {
              this.noDatadate.push(Number(item.date.slice(8)))
            }
          }
        })
        //        console.log(this.noDatadate)
      }
    },
    // 根据对应日期，给颜色点赋class值
    setDateIconColor (date) {
      const dateRegExp = new RegExp(`${date}$`)
      const item = this.stateColorArr.find(it => dateRegExp.test(it.date))
      return item ? item.dayMark : ''
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~styles/variable.styl';

*, *::before, *::after {
  box-sizing: inherit;
}

div, h2, h3, h4, table, tbody, thead, tr, td, button {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 100%;
  font: inherit;
  vertical-align: baseline;
}

button {
  border-radius: 2px;
  cursor: pointer;
  display: inline-block;
  font-size: 0.32rem;
  padding: 0 0.32rem;
  outline: none;
  user-select: none;
}

.flex {
  display: flex;
}

.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.date-picker-container, .date-picker-background {
  overflow-y: auto;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.date-picker-container {
  line-height: 1.5;
  z-index: 9998;
}

.date-picker-background {
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9999;
}

.calendar-faint {
  opacity: 0.75;
}

.calendar-container {
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 12px 52px rgba(0, 0, 0, 0.25);
  cursor: initial;
  position: relative;
  user-select: text;
  width: 7rem;
  z-index: 10001;
  user-select: none;
}

.calendar {
  // height: 10rem;
  position: relative;
  padding-bottom:0.6rem;
}

.hidden-footer .calendar {
  height: 8rem;
}

.calendar-header {
  border-top-left-radius: 2px;
  border-top-right-radius: 2px;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.3rem 0.3rem;
}

.calendar-header h2, .calendar-header h3 {
  cursor: default;
}

.calendar-header h2.calendar-faint, .calendar-header h3.calendar-faint {
  cursor: pointer;
}

.calendar-header h2 {
  font-size: 0.4rem;
  line-height: 0.4rem;
  margin-top: 3px;
}

.calendar-header h3 {
  font-size: 0.8rem;
  font-weight: 300;
}

.calendar-body {
  padding: 0.2rem;
}

.calendar-date {
  display: flex;
  flex-flow: row nowrap;
  justify-content:space-around;
  align-items:center;
}
.right>i,.left>i{
  width:.14rem;
  height:.14rem;
  border:solid #333;
  border-width:0 .02rem .02rem 0;
  margin:0 .28rem;
}
.right>i{
  transform:rotate(-45deg);
}
.left>i {
  transform:rotate(135deg)
}
.calendar-date .calendar-arrows.left {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.calendar-current-date {
  cursor: default;
  text-align: center;
}

.calendar-date .calendar-arrows.right {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.calendar-date > div {
  width: 33.333%;
}

.calendar-date h4 {
  font-size: 0.3rem;
  font-weight: 500;
}

.calendar-arrows {
  cursor: pointer;
  padding: 0 8px;
}

.calendar-body table {
  border-spacing: 2px;
  border-collapse: separate;
  cursor: default;
  font-size: 0.28rem;
  margin-top: 0.1rem;
  table-layout: fixed;
  text-align: center;
  width: 100%;
}

.calendar-body table thead {
  color: #757575;
}

.calendar-body table thead td, .calendar-body table thead td {
  cursor: default !important;
}

.calendar-body tr {
  height: 0.9rem;
  vertical-align: middle;
}

.calendar-body td {
  border-radius: 50%;
  cursor: pointer;
  vertical-align: middle;
  transition: background-color 0.15s;
  width: 0.9rem;
}

.calendar-body td:focus {
  outline: none;
}

.calendar-body tbody td:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

.calendar-body td:empty {
  background-color: transparent !important;
  cursor: default;
}

.calendar-body td.current-day {
  font-weight: bold;
}

.calendar-body td.disabled {
  color: #c5c5c5!important;
  cursor: default;
  pointer-events: none;
}

.calendar-body td.selected {
  border-radius: 50%;
  color: #fff;
  cursor: pointer;
}

.calendar-year-select, .calendar-month-select {
  width: 50%;
  float: left;
  box-shadow: inset 0 -1px 1px rgba(0, 0, 0, 0.075);
  height: 3.2rem;
  overflow-y: scroll;
  text-align: center;
}

.hidden-footer .calendar-year-select, .hidden-footer .calendar-month-select {
  height: 3.78rem;
}

.calendar-year-select div, .calendar-month-select div {
  cursor: pointer;
  padding: 8px 0;
  transition: background-color 0.15s;
}

.calendar-year-select div:hover, .calendar-month-select div:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

.calendar-year-select .selected, .calendar-month-select .selected {
  font-size: 24px;
}

.calendar-footer {
  position: absolute;
  bottom: 0.2rem;
  right: 0.2rem;
}

.calendar-footer button {
  background-color: transparent;
  border: 1px solid transparent;
  box-shadow: none;
}

.calendar-fade-enter-active, .calendar-fade-leave-active {
  transition: opacity 0.15s;
}

.calendar-fade-enter, .calendar-fade-leave-to {
  opacity: 0;
}

.calendar-body tbody td {
  position: relative;
}

.calendar-body tbody td i {
  position: absolute;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  bottom: 5px;
  left: 50%;
  margin-left: -2px;
}

.calendar-body tbody td i.normal {
  background: #00d900;
}

.calendar-body tbody td i.abnormal {
  background: #ea3535;
}
.calendar-body tbody td.disabled i {
  display:none;
}
.selectYearMonthContain {
  overflow: hidden;
  width: 100%;
}
</style>
