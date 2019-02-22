import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'// progress bar style
import { getSession } from '@/utils/auth'

NProgress.configure({ showSpinner: false })// NProgress Configuration

// permissiom judge function
function hasPermission(roles, permissionRoles) {
  if (roles.indexOf('admin') >= 0) return true // admin permission passed directly
  if (!permissionRoles) return true
  return roles.some(role => permissionRoles.indexOf(role) >= 0)
}

const whiteList = ['/login', '/authredirect', '/register', '/forgot', '/registerProgress', '/modifyRegister', '/oneEnterPage']// no redirect whitelist
window.RENUMBER = 0
window.TIMEPOUT = 60 * 30 // 防止缓存，定时切换路由时刷新当前页面
function startCount() {
  window.RENUMBER += 1
  if (window.RENUMBER === window.TIMEPOUT) {
    window.RENUMBER = window.TIMEPOUT
  } else {
    setTimeout(startCount, 1000) // setTimeout是超时调用，使用递归模拟间歇调用
  }
}
setTimeout(startCount, 1000) // 1s后执行
router.beforeEach((to, from, next) => {
  if (window.RENUMBER === window.TIMEPOUT) { // 时间到路由切换时候刷新页面
    window.location.reload()
  }
  NProgress.start() // start progress bar
  if (getSession('IS_CHECK_PASS') === '1') {
    if (getSession('Admin-Token')) { // determine if there has token
      /* has token*/
      if (to.path === '/login') {
        next({ path: '/' })
        NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
      } else {
        console.log('EMPLOYEE_TYPE', getSession('EMPLOYEE_TYPE'))
        let _employeeType = getSession('EMPLOYEE_TYPE')
        let _admin = '2356'
        if (!_employeeType || _admin.indexOf(getSession('EMPLOYEE_TYPE')) === -1) {
          // 不是多店
          if (!store.getters.roles.length) { // 判断当前用户是否已拉取完user_info信息
            if (!store.state.manageGyms.saasVersion) {
              store.dispatch('GetUserInfo').then(res => { // 拉取user_info
                const roles = res.data.roles // note: roles must be a array! such as: ['editor','develop']
                const employee_type = res.employee.type // 用户类型 0: 未知, 1: 普通员工, 2: 分店管理, 3: 总店管理, 4: 分店超级管理, 5: 总店超级管理
                store.dispatch('get_manage_gyms') // 获取场馆列表
                store.dispatch('GenerateRoutes', { roles, employee_type }).then(() => { // 根据roles权限生成可访问的路由表
                  router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
                  next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
                })
              }).catch((err) => {
                let _response = err.response
                if (_response && _response.status === 302) {
                  next({ path: '/oneEnterPage' })
                } else {
                  store.dispatch('FedLogOut').then(() => {
                    Message.error('Verification failed, please login again')
                    next({ path: '/login' })
                  })
                }
              })
            }
          } else {
            // 没有动态改变权限的需求可直接next() 删除下方权限判断 ↓
            if (hasPermission(store.getters.roles, to.meta.roles)) {
              next()//
            } else {
              next({ path: '/401', replace: true, query: { noGoBack: true }})
            }
            // 可删 ↑
          }
        } else {
          // 是多店
          if (!store.getters.roles.length) {
            store.dispatch('get_manage_gyms') // 获取场馆列表
            store.dispatch('noUserInfo').then(res => {
              const roles = store.getters.roles // note: roles must be a array! such as: ['editor','develop']
              const employee_type = Number(getSession('EMPLOYEE_TYPE'))
              store.dispatch('GenerateRoutes', { roles, employee_type }).then(() => { // 根据roles权限生成可访问的路由表
                router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
                next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
              })
            })
          } else {
            next()
          }
        }
      }
    } else {
      /* has no token*/
      if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
        next()
      } else {
        next('/login') // 否则全部重定向到登录页
        NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next()
    } else {
      next('/login') // 否则全部重定向到登录页
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
