import alertplug from './alertplug.vue'
let AlertPlug = {} // 此处是弹窗空对象
let vm = null // vue实例
AlertPlug.install = (Vue, options) => {
  if (!vm) {
    // Vue.extend=》扩展实例构造器，挂载到div元素上
    const AlertPlug = Vue.extend(alertplug)
    vm = new AlertPlug({
      el: document.createElement('div')
    })
  }
  const alertPl = {
    show (options = {}) { // 参数
      vm.show = true
      if (options) {
        // options.el.appendChild(vm.$el)
        options.el = document.body.appendChild(vm.$el)
        vm.text = options.text
        vm.title = options.title
        vm.plugVal = options.plugVal
        vm.comp = options.comp
        vm.confirmMsg = options.confirmMsg
      }
      // vm.$el =><div class="alert-mask"></div>
      // console.log(vm.$el)
    },
    hide (el) {
      vm.show = false
    }
  }
  if (!Vue.prototype.$alertPl) {
    Vue.prototype.$alertPl = alertPl
  }
  Vue.mixin({
    created () {
      this.$alertPl = Vue.prototype.$alertPl
    }
  })
}
export default AlertPlug
