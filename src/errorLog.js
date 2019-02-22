import Vue from 'vue'
// import store from './store'
var fundebug = require('fundebug-javascript')
fundebug.apikey = '248e06b488f5a46d2d9eb84c2bc2082a6251b0015154f753894dc9340746b2ed'
// you can set only in production env show the error-log
fundebug.filters = [
  {
    name: /^TypeError$/,
    message: /^doc|nodeName$/
  },
  {
    req:
    {
      method: /^POST|GET|PUT$/
    },
    res:
    {
      status: /^422|401|302$/
    }
  }]
if (process.env.NODE_ENV !== 'production') {
  fundebug.releasestage = 'development'
  fundebug.silent = true
} else {
  fundebug.silentVideo = false
  fundebug.silentConsole = true
  fundebug.releasestage = 'production'
  var formatComponentName = function(vm) {
    if (vm.$root === vm) return 'root'
    var name = vm._isVue ? (vm.$options && vm.$options.name) || (vm.$options && vm.$options._componentTag) : vm.name
    return (name ? 'component <' + name + '>' : 'anonymous component') + (vm._isVue && vm.$options && vm.$options.__file ? ' at ' + (vm.$options && vm.$options.__file) : '')
  }

  Vue.config.errorHandler = function(err, vm, info) {
    Vue.nextTick(() => {
      var componentName = formatComponentName(vm)
      var propsData = vm.$options && vm.$options.propsData
      fundebug.notifyError(err,
        {
          metaData:
            {
              componentName: componentName,
              propsData: propsData,
              info: info
            }
        })
    })
  }
}
// Vue.config.errorHandler = function(err, vm, info, a) {
//   // Don't ask me why I use Vue.nextTick, it just a hack.
//   // detail see https://forum.vuejs.org/t/dispatch-in-vue-config-errorhandler-has-some-problem/23500
//   Vue.nextTick(() => {
//     store.dispatch('addErrorLog', {
//       err,
//       vm,
//       info,
//       url: window.location.href
//     })
//     console.error(err, info)
//   })
// }
