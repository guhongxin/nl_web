import Vue from 'vue'
import Router from 'vue-router'
const _import = require('./_import_' + process.env.NODE_ENV)
import test from '../test/test.vue'
import totalrole from '@/role/totalrole'
import multistoreRole from '@/role/multistoreRole'
import fstoreRole from '@/role/fstoreRole'
// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
/** note: submenu only apppear when children.length>=1
*   detail see  https://panjiachen.github.io/vue-element-admin-site/#/router-and-nav?id=sidebar
**/

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    roles: ['admin','editor']     will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if fasle ,the page will no be cached(default is false)
  }
**/
export const constantRouterMap = [
  { path: '/register', component: _import('register/index'), hidden: true, name: 'register' },
  { path: '/forgot', component: _import('forgot/index'), hidden: true },
  { path: '/modifyRegister', component: _import('modifyRegister/index'), hidden: true, name: 'modifyRegister' },
  { path: '/registerProgress', component: _import('registerProgress/index'), hidden: true, name: 'registerProgress' },
  { path: '/login', component: _import('login/index'), hidden: true },
  { path: '/authredirect', component: _import('login/authredirect'), hidden: true },
  { path: '/404', component: _import('errorPage/404'), hidden: true },
  { path: '/401', component: _import('errorPage/401'), hidden: true },
  { path: '/test', component: test, hidden: true },
  { path: '/oneEnterPage', component: _import('oneEnterPage/oneEnterPage'), hidden: true }
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap // 非登陆即可使用路由
})

export const asyncRouterMap = totalrole // 全部权限

export const asyncmultistoreRole = multistoreRole // 多店权限
export const asyncfstoreRole = fstoreRole // 多店分店
