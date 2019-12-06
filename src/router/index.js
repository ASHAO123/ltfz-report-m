import Vue from 'vue'
import Router from 'vue-router'
import CurrentData from '@/pages/current-data/CurrentData.vue'
import CurrentHeartrate from '@/pages/current-data/components/CurrentHeartrate.vue'
import CurrentBlood from '@/pages/current-data/components/CurrentBlood.vue'
import CurrentSugar from '@/pages/current-data/components/CurrentSugar.vue'
import CurrentTemperature from '@/pages/current-data/components/CurrentTemperature.vue'
import CurrentOxygen from '@/pages/current-data/components/CurrentOxygen.vue'
import CurrentCardiopulmonary from '@/pages/current-data/components/CurrentCardiopulmonary.vue'
import CurrentSleep from '@/pages/current-data/components/CurrentSleep.vue'
import CurrentFat from '@/pages/current-data/components/CurrentFat.vue'
import CurrentViscera from '@/pages/current-data/components/CurrentViscera.vue'
import CurrentSteps from '@/pages/current-data/components/CurrentSteps.vue'
import Ecg from '@/pages/ecg/ecg.vue'
import hrhy from '@/pages/online-heartRate/onlineheart.vue'

import DayData from '@/pages/day-data/DayData.vue'
import WeekData from '@/pages/week-data/WeekData.vue'
import MonthData from '@/pages/month-data/MonthData.vue'
import YearData from '@/pages/year-data/YearData.vue'
import aMap from '@/pages/common/components/map.vue'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/report/current/:device/:userID/:token/:friendID',
      name: 'CurrentData',
      component: CurrentData,
      children: [
        {
          path: '/report/heartrate/:device/:userID/:token/:friendID',
          name: 'CurrentHeartrate',
          component: CurrentHeartrate
        },
        {
          path: '/report/bloodpressure/:device/:userID/:token/:friendID',
          name: 'CurrentBlood',
          component: CurrentBlood
        },
        {
          path: '/report/bloodsugar/:device/:userID/:token/:friendID',
          name: 'CurrentSugar',
          component: CurrentSugar
        },
        {
          path: '/report/temperature/:device/:userID/:token/:friendID',
          name: 'CurrentTemperature',
          component: CurrentTemperature
        },
        {
          path: '/report/sp/:device/:userID/:token/:friendID',
          name: 'CurrentOxygen',
          component: CurrentOxygen
        },
        {
          path: '/report/cardiopulmonary/:device/:userID/:token/:friendID',
          name: 'CurrentCardiopulmonary',
          component: CurrentCardiopulmonary
        },
        {
          path: '/report/usersleep/:device/:userID/:token/:friendID',
          name: 'CurrentSleep',
          component: CurrentSleep
        },
        {
          path: '/report/fatiguemonitoring/:device/:userID/:token/:friendID',
          name: 'CurrentFat',
          component: CurrentFat
        },
        {
          path: '/report/viscera/:device/:userID/:token/:friendID',
          name: 'CurrentViscera',
          component: CurrentViscera
        },
        {
          path: '/report/steps/:device/:userID/:token/:friendID',
          name: 'CurrentSteps',
          component: CurrentSteps
        }
      ]
    },
    {
      path: '/report/day/:device/:userID/:token/:friendID',
      name: 'DayData',
      component: DayData
    },
    {
      path: '/report/week/:device/:userID/:token/:friendID',
      name: 'WeekData',
      component: WeekData
    },
    {
      path: '/report/month/:device/:userID/:token/:friendID',
      name: 'MonthData',
      component: MonthData
    },
    {
      path: '/report/year/:device/:userID/:token/:friendID',
      name: 'YearData',
      component: YearData
    },
    {
      path: '/report/aMap/:device/:userID/:token/:friendID',
      name: 'aMap',
      component: aMap
    },
    {
      path: '/report/ecg/:device/:userID/:token/:friendID',
      name: 'Ecg',
      component: Ecg
    },
    {
      path: '/report/hrhy/:device/:userID/:token/:friendID',
      name: 'hrhy',
      component: hrhy
    }
  ],
  mode: 'history',
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  }
})
