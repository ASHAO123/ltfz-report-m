import warnList from './warnList.vue'
warnList.install = function (Vue) {
  // Vue.extend=》扩展实例构造器，挂载到div元素上
  const List = Vue.extend(warnList)
  // let myList = new List()

  // Vue.mixin({
  //   created () {
  //     this.$alertPl = Vue.prototype.$alertPl
  //   }
  // })
  Vue.component('warnList', List)
}
export default warnList
