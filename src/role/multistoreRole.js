const _import = require('../router/_import_' + process.env.NODE_ENV)
import MstoreLayout from '../views/mstoreLayout/mstoreLayout'

const multistoreRole = [{
  path: '',
  component: MstoreLayout,
  redirect: '/mstoredashboard',
  isMstore: true,
  children: [{
    path: 'mstoredashboard', // 多店管理 ---桌面
    component: _import('mstoredashboard/index'),
    name: 'mstoredashboard'
  }, {
    path: 'mstoreSuperAdmin', // 多店管理 --- 超级管理员
    component: _import('mstoreSuperAdmin/index'),
    name: 'mstoreSuperAdmin'
  }, {
    path: 'mstoreCardManage', // 多店管理 --- 通卡管理
    component: _import('mstoreCardManage/index'),
    name: 'mstoreCardManage'
  }, {
    path: 'mstoreCardTypeGl', // 多店管理 --- 卡种管理
    component: _import('mstoreCardTypeGl/index'),
    name: 'mstoreCardTypeGl'
  }, {
    path: 'mstoreCustomerGl', // 多店管理 --- 会员管理
    component: _import('mstoreCustomerGl/index'),
    name: 'mstoreCustomerGl'
  }]
}]
export default multistoreRole
