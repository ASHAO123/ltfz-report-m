import listPlug from './listPlug.vue'
listPlug.install = function (Vue) {
  // Vue.extend=》扩展实例构造器，挂载到div元素上
  // const List = Vue.extend(listPlug)
  Vue.component('listPlug', listPlug)
}
export default listPlug
