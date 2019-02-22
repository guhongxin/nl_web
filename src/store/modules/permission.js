import { asyncRouterMap, constantRouterMap, asyncmultistoreRole, asyncfstoreRole } from '@/router'
import { getSession } from '@/utils/auth'
/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.indexOf(role) >= 0)
  } else {
    return true
  }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap
 * @param roles
 */
function filterAsyncRouter(asyncRouterMap, roles) {
  const accessedRouters = asyncRouterMap.filter(route => {
    if (hasPermission(roles, route)) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, roles)
      }
      return true
    }
    return false
  })
  return accessedRouters
}
/* isroot 就把所有的权限开放 */
function alltrue(arr) {
  for (let item of arr) {
    item.check = true
    if (item.children && item.children.length) {
      alltrue(item.children)
    }
  }
}

function eachRole(arr, path) {
  for (let item of arr) {
    if (item.path === path) {
      item.check = true
    }
    if (item.children && item.children.length) {
      eachRole(item.children, path)
    }
  }
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        const { roles, employee_type } = data
        let accessedRouters = []
        if (roles.indexOf('admin') >= 0) {
          if (getSession('IS_ROOT') === 'true') {
            alltrue(asyncRouterMap)
            accessedRouters = asyncRouterMap
          }
          if (getSession('IS_ROOT') === 'false') {
            let itemrole = JSON.parse(getSession('role'))
            for (let currole of itemrole) {
              if (currole.path) {
                eachRole(asyncRouterMap, currole.path)
              }
            }
            accessedRouters = asyncRouterMap
          }
        } else {
          accessedRouters = filterAsyncRouter(asyncRouterMap, roles)
        }
        let _msstore = [3, 5, 6]
        if (_msstore.indexOf(employee_type) !== -1) {
          // 总店
          accessedRouters = [...asyncmultistoreRole, ...accessedRouters]
        }
        let _fstore = [2]
        if (_fstore.indexOf(employee_type) !== -1) {
          // 分店
          accessedRouters = [...asyncfstoreRole, ...accessedRouters]
        }
        console.log('no BOSS role setting it`s here')
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    }
  }
}

export default permission
