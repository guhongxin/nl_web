import Vue from 'vue'
import 'normalize.css/normalize.css'// A modern alternative to CSS resets

import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.scss' // global css
import App from './App'
import router from './router'
import store from './store'

import i18n from './lang' // Internationalization
import './common' // 通用方法
import './icons' // icon
// import './errorLog'// error log
import './permission' // permission control
// import './mock' // simulation data
import * as filters from './filters' // global filters

import Grid from './components/vue-js-grid/src' // drag
Vue.use(Grid)
if (process.env.NODE_ENV === 'production') {
  Vue.prototype.staticurl = '/'
} else {
  Vue.prototype.staticurl = '/'
}

Vue.prototype.baseimgurl = 'http://niulang-v2.oss-cn-beijing.aliyuncs.com/'
Vue.prototype.defaulthead = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNTI2MDA1Mzc4ODUxIiBjbGFzcz0iaWNvbiIgc3R5bGU9IiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjQ1MTEiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iNDgiIGhlaWdodD0iNDgiPjxkZWZzPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+PC9zdHlsZT48L2RlZnM+PHBhdGggZD0iTTUxMy42NTUzOTA4MiAzNjYuNjgxMjAxNzhtLTExMi45ODQwNjQgMGExMTIuOTg0MDY0IDExMi45ODQwNjQgMCAxIDAgMjI1Ljk2ODEyOCAwIDExMi45ODQwNjQgMTEyLjk4NDA2NCAwIDEgMC0yMjUuOTY4MTI4IDBaIiBwLWlkPSI0NTEyIiBmaWxsPSIjN2RjNWViIj48L3BhdGg+PHBhdGggZD0iTTUxMy42NTUzOTA4MiA1MTguOTEwNDA3MTFjLTEwNC40MzUyNTY4OSAwLTE4OS4wOTY4NDYyMiA4NC42NjUyMzAyMi0xODkuMDk2ODQ2MjMgMTg5LjA5OTI3MzQ4IDAgMTA0LjQzNjQ3MDUyIDg0LjY2MDM3NTcgNzYuMTE2NDIzMTEgMTg5LjA5Njg0NjIzIDc2LjExNjQyMzExIDEwNC40MzY0NzA1MiAwIDE4OS4xMDA0ODcxMSAyOC4zMjAwNDc0MSAxODkuMTAwNDg3MS03Ni4xMTY0MjMxMSAwLjAwMTIxMzYzLTEwNC40MzQwNDMyNS04NC42NjQwMTY1OS0xODkuMDk5MjczNDgtMTg5LjEwMDQ4NzEtMTg5LjA5OTI3MzQ4eiIgcC1pZD0iNDUxMyIgZmlsbD0iIzdkYzVlYiI+PC9wYXRoPjxwYXRoIGQ9Ik01MTMuNjU3ODE4MDggMzIuNjU1MTMyNDVjLTI2NS4zMDQyOTE1NSAwLjAwMzY0MDg5LTQ4MC4zODEzMDcyNSAyMTUuMDgwNjU2NTktNDgwLjM4MTMwNzI2IDQ4MC4zODEzMDcyNSAwIDI2NS4zMTE1NzMzMyAyMTUuMDc1ODAyMDggNDgwLjM4NjE2MTc4IDQ4MC4zODEzMDcyNiA0ODAuMzg5ODAyNjcgMjY1LjMwNDI5MTU1LTAuMDAzNjQwODkgNDgwLjM4MDA5MzYzLTIxNS4wODA2NTY1OSA0ODAuMzgwMDkzNjItNDgwLjM4OTgwMjY3IDAuMDAxMjEzNjMtMjY1LjMwNDI5MTU1LTIxNS4wNjk3MzM5Mi00ODAuMzc2NDUyNzUtNDgwLjM4MDA5MzYyLTQ4MC4zODEzMDcyNXogbTAgOTAxLjI2MDc4MTAzYy0yMzIuNDUyNTUxMTEgMC4wMTA5MjI2Ny00MjAuODkyODIzNy0xODguNDM2NjMxNy00MjAuODg2NzU1NTYtNDIwLjg4NTU0MTkzLTAuMDA2MDY4MTUtMjMyLjQ1MDEyMzg1IDE4OC40MzQyMDQ0NS00MjAuODc5NDczNzggNDIwLjg4NDMyODMtNDIwLjg4MDY4NzQgMjMyLjQ2MTA0NjUyIDAgNDIwLjg5MjgyMzcgMTg4LjQ0MjY5OTg1IDQyMC44ODkxODI4MSA0MjAuODgwNjg3NCAwLjAwNjA2ODE1IDIzMi40NTg2MTkyNS0xODguNDMxNzc3MTggNDIwLjg5MTYxMDA4LTQyMC44ODY3NTU1NSA0MjAuODg1NTQxOTN6IiBwLWlkPSI0NTE0IiBmaWxsPSIjN2RjNWViIj48L3BhdGg+PC9zdmc+'
Vue.use(Element, {
  size: 'medium', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  template: '<App/>',
  components: { App }
})
