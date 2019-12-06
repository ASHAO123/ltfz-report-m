// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import fastClick from 'fastclick'

import VueI18n from 'vue-i18n'  
import './assets/styles/reset.css'
import './assets/styles/iconfont.css'
import './assets/styles/animate.css'
import './assets/styles/reportList.styl'
import axios from './axios'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import ModalTip from '@/pages/common/components/modaltip'
import AlertPlug from '@/pages/common/components/mixins/alertplug/alertplug.js' // 路径为@/pages/common/components/alertplugin会报错

import echarts from 'echarts'
import AMap from 'vue-amap'

Vue.prototype.$echarts = echarts
Vue.prototype.$axios = axios
Vue.use(ElementUI)
Vue.use(ModalTip)
Vue.use(AMap)
Vue.use(AlertPlug)

Vue.config.productionTip = false
fastClick.attach(document.body)

export var bus = new Vue()
// 初始化高德地图
AMap.initAMapApiLoader({
  key: '194209a4b833780d1cfdbd544c12a486',
  plugin: [],
  // 默认高德 sdk 版本为 1.4.4
  v: '1.4.4'
})
import zh from './lang/zh'
import tw from './lang/tw'

Vue.use(VueI18n)
const i18n = new VueI18n({
  locale: localStorage.getItem('locale')||'zh',
  messages: {
    zh,
    tw
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  i18n,
  router,
  components: { App },
  template: '<App/>'
})
