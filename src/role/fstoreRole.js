const _import = require('../router/_import_' + process.env.NODE_ENV)
import MstoreLayout from '../views/mstoreLayout/mstoreLayout'

const fstoreRole = [{
  path: '',
  component: MstoreLayout,
  redirect: '/mstoredashboard',
  isMstore: true,
  children: [{
    path: 'mstoredashboard', // 多店管理 ---桌面
    component: _import('mstoredashboard/index'),
    name: 'mstoredashboard'
  }, {
    path: 'mstoredashboard1', // 防止左侧菜单桌面出现
    component: _import('mstoredashboard/index'),
    name: 'mstoredashboard'
  }]
}]
export default fstoreRole
