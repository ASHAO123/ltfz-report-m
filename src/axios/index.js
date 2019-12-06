import axios from 'axios'
import qs from 'qs'
axios.defaults.timeout = 30000
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
// 腕上健康
axios.defaults.baseURL = 'https://www01.lantianfangzhou.com/r5s/init/'

// 生命监护
// axios.defaults.baseURL = 'https://rulong.lantianfangzhou.com/all/public/api/init/'


// 腕上健康测试--2019-8-2
// axios.defaults.baseURL = 'http://test12.lantianfangzhou.com/api/init/'

// POST传参序列化
axios.interceptors.request.use((config) => {
  if (config.method === 'post') {
    config.data = qs.stringify(config.data)
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

// 返回状态判断
axios.interceptors.response.use((res) => {
  if (res.data.code === 2001) {
    return Promise.reject(res)
  }

  return res
}, (error) => {
  // 其他错误，如404
  return Promise.reject(error)
})

export function fetch(url, params) {
  return new Promise((resolve, reject) => {
    axios.post(url, params)
      .then(response => {
        resolve(response.data)
      }, err => {
        reject(err)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
/**
 * 业务逻辑，个组件调用相应方法
 */
export default {
  getCurrentInit(params) { // 当前初始化
    return fetch('/headimg', params)
  },
  getCurrentWarn(params) { // 当前心率预警
    return fetch('/warning', params)
  },
  getCurrentHomePage(params) { // 首页九宫格
    return fetch('/homepage', params)
  },
  getCurrentHeartrate(params) { // 心率详情
    return fetch('/heartrate', params)
  },
  getCurrentBloodpressure(params) { // 血压详情
    return fetch('/bloodpressure', params)
  },
  getCurrentBloodsugar(params) { // 血糖详情
    return fetch('/bloodsugar', params)
  },
  getCurrentSp(params) { // 血氧详情
    return fetch('/sp', params)
  },
  getCurrentTemperature(params) { // 体温详情
    return fetch('/temperature', params)
  },
  getCurrentViscera(params) { // 脏腑详情
    return fetch('/viscera', params)
  },
  getCurrentCardiopulmonary(params) { // 心肺详情
    return fetch('/cardiopulmonary', params)
  },
  getCurrentUsersleep(params) { // 睡眠详情
    return fetch('/usersleep', params)
  },
  getCurrentFatiguemonitoring(params) { // 疲劳详情
    return fetch('/fatiguemonitoring', params)
  },
  getCurrentSteps(params) { // 运动详情
    return fetch('/steps', params)
  },
  getOnlineHeartRate(params) { // 心律
    return fetch('/hrhy', params)
  },
  remodeOnlineHeart(params) {
    return fetch('/deletehrhy', params)
  },
  getDayDateStart(params) { // 日报数据上下限制
    return fetch('/datestart', params)
  },
  // 日历
  getCalendar(params) {
    return fetch('/getcalendar', params)
  },
  // 日报心率
  getDayheartrate(params) {
    return fetch('/dayheartrate', params)
  },
  // 日报预警
  getDaywarn(params) {
    return fetch('/daywarning', params)
  },
  // 日报血压
  getDaybloodpressure(params) {
    return fetch('/daybp', params)
  },
  // 日报血糖
  getDaybloodsugar(params) {
    return fetch('/daybs', params)
  },
  // 日报血氧
  getDaybloodoxygen(params) {
    return fetch('/daysp', params)
  },
  // 日报体温
  getDaybodytempera(params) {
    return fetch('/daytem', params)
  },
  // 日报脏腑
  getDayviscera(params) {
    return fetch('/dayvis', params)
  },
  // 日报心肺
  getDayheartlung(params) {
    return fetch('/daycar', params)
  },
  // 日报睡眠
  getDaysleep(params) {
    return fetch('/dayusersleep', params)
  },
  // 日报疲劳
  getDayweary(params) {
    return fetch('/dayfat', params)
  },
  // 日报运动
  getDaysports(params) {
    return fetch('/daysteps', params)
  },
  // 周报默认周期值周报开始周报开始周报开始周报开始
  getWeekdefault(params) {
    return fetch('/weekstart', params)
  },
  // 周报列表
  getWeeklist(params) {
    return fetch('/datelist', params)
  },
  // 周报心率
  getWeekheartrate(params) {
    return fetch('/weekheartrate', params)
  },
  // 周报血压
  getWeekbloodpressure(params) {
    return fetch('/weekbp', params)
  },
  // 周报血糖
  getWeekbloodsugar(params) {
    return fetch('/weekbs', params)
  },
  // 周报血氧
  getWeekbloodoxygen(params) {
    return fetch('/weeksp', params)
  },
  // 周报体温
  getWeekbodytempera(params) {
    return fetch('/weektem', params)
  },
  // 周报脏腑
  getWeekviscera(params) {
    return fetch('/weekvis', params)
  },
  // 周报心肺
  getWeekheartlung(params) {
    return fetch('/weekcar', params)
  },
  // 周报睡眠
  getWeeksleep(params) {
    return fetch('/weekusersleep', params)
  },
  // 周报疲劳
  getWeekweary(params) {
    return fetch('/weekfat', params)
  },
  // 周报运动
  getWeeksports(params) {
    return fetch('/weekstps', params)
  },
  // 月报默认周期值月报开始月报开始月报开始月报开始
  getMonthdefault(params) {
    return fetch('/monthstart', params)
  },
  // 月报列表
  getMonthlist(params) {
    return fetch('/monthlist', params)
  },
  // 月报心率
  getMonthheartrate(params) {
    return fetch('/monthheartrate', params)
  },
  // 月报血压
  getMonthbloodpressure(params) {
    return fetch('/monthbp', params)
  },
  // 月报血糖
  getMonthbloodsugar(params) {
    return fetch('/monthbs', params)
  },
  // 月报血氧
  getMonthbloodoxygen(params) {
    return fetch('/monthsp', params)
  },
  // 月报体温
  getMonthbodytempera(params) {
    return fetch('/monthtem', params)
  },
  // 月报脏腑
  getMonthviscera(params) {
    return fetch('/monthvis', params)
  },
  // 月报心肺
  getMonthheartlung(params) {
    return fetch('/monthcar', params)
  },
  // 月报睡眠
  getMonthsleep(params) {
    return fetch('/monthusersleep', params)
  },
  // 月报疲劳
  getMonthweary(params) {
    return fetch('/monthfat', params)
  },
  // 月报运动
  getMonthsports(params) {
    return fetch('/monthsteps', params)
  },
  // 年报默认周期值年报开始年报开始年报开始年报开始
  getYeardefault(params) {
    return fetch('/yearstart', params)
  },
  // 年报列表
  getYearlist(params) {
    return fetch('/yearlist', params)
  },
  // 年报心率
  getYearheartrate(params) {
    return fetch('/yearheartrate', params)
  },
  // 年报血压
  getYearbloodpressure(params) {
    return fetch('/yearbp', params)
  },
  // 年报血糖
  getYearbloodsugar(params) {
    return fetch('/yearbs', params)
  },
  // 年报血氧
  getYearbloodoxygen(params) {
    return fetch('/yearsp', params)
  },
  // 年报体温
  getYearbodytempera(params) {
    return fetch('/yeartem', params)
  },
  // 年报脏腑
  getYearviscera(params) {
    return fetch('/yearvis', params)
  },
  // 年报心肺
  getYearheartlung(params) {
    return fetch('/yearcar', params)
  },
  // 年报睡眠
  getYearsleep(params) {
    return fetch('/yearusersleep', params)
  },
  // 年报疲劳
  getYearweary(params) {
    return fetch('/yearfat', params)
  },
  // 年报运动
  getYearsports(params) {
    return fetch('/yearsteps', params)
  },
  // 位置信息
  getMap(params) {
    return fetch('/address', params)
  },
  // 心电
  getEcg(params) {
    return fetch('/ecg', params)
  }
}
