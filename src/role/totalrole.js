
const _import = require('../router/_import_' + process.env.NODE_ENV)
// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading
const sale_url = process.env.NODE_ENV === 'development' ? 'http://localhost:1028' : '/sale/index.html'
/* Layout */
import Layout from '../views/layout/Layout'

const totalrole = [
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [{
      path: 'dashboard',
      component: _import('dashboard/index'),
      name: 'dashboard',
      meta: { title: 'dashboard', icon: 'icon-前台', noCache: false }
    }]
  },
  // 前台
  {
    path: '/charts',
    component: Layout,
    redirect: 'noredirect',
    name: 'charts',
    depict: '前台',
    check: false,
    alwaysShow: true,
    meta: {
      title: 'charts',
      icon: 'icon-前台'
    },
    children: [
      {
        path: 'signIn', depict: '入场签到', check: false, component: _import('checkin/index'), name: 'checkin', meta: { title: 'checkin', noCache: true },
      },
      {
        path: 'cupboardmanage', depict: '租柜管理', check: false, component: _import('cupboardManage/index'), name: 'cupboardmanage', meta: { title: 'cupboardmanage', noCache: true },
      },
      {
        path: 'opencard', depict: '会员办理', check: false, component: _import('openCard/index'), name: 'opencard', meta: { title: 'opencard', noCache: true },
      },
      {
        path: 'menber', depict: '会员卡管理', check: false, component: _import('cardManage/index'), name: 'cardmanage', meta: { title: 'cardmanage', noCache: true },
      },
      {
        path: 'cashier', depict: '收银台', check: false, component: _import('cashier/index'), name: 'cashier', meta: { title: 'cashier', noCache: true },
      }
    ]
  },

  // 会籍
  {
    path: '/form',
    component: Layout,
    redirect: 'noredirect',
    name: 'form',
    alwaysShow: true,
    depict: '会籍',
    check: false,
    meta: {
      title: 'form',
      icon: 'icon-会籍'
    },
    children: [
      {
        path: 'createForm', depict: '客户管理', check: false, component: _import('customer/index'), name: 'customer', meta: { title: 'customer', noCache: true },
      }
    ]
  },

  // 教练
  {
    path: '/zip',
    component: Layout,
    redirect: 'noredirect',
    name: 'zip',
    depict: '教练',
    check: false,
    alwaysShow: true,
    meta: { title: 'zip', icon: 'icon-教练' },
    children: [
      {
        path: 'privatecourse', depict: '私教课程', check: false, component: _import('privateCourse/components/privateCourse'), name: 'privatecourse', meta: { title: 'privatecourse', noCache: true },
      },
      {
        path: 'privatebuy', depict: '私教购买', check: false, component: _import('privateBuy/components/privateBuy'), name: 'privatebuy', meta: { title: 'privatebuy', noCache: true },
      },
      {
        path: 'privateorder', depict: '私教预约', check: false, component: _import('privateOrder/components/privateOrder'), name: 'privateorder', meta: { title: 'privateorder', noCache: true },
      },
      {
        path: 'groupCourseManage', depict: '团课管理', check: false, component: _import('groupCourseManage/index'), name: 'groupCourseManage', meta: { title: 'groupCourseManage', noCache: true },
      },
      {
        path: 'publicCourseManage', depict: '公开课管理', check: false, component: _import('publicCourseManage/components/publicCourseManage'), name: 'publicCourseManage', meta: { title: 'publicCourseManage', noCache: true },
      },
      {
        path: 'testreport', depict: '体测报告', check: false, component: _import('testReport/components/testReport'), name: 'testreport', meta: { title: 'testreport', noCache: true },
      }
    ]
  },

  // 店长
  {
    path: '/components',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true,
    depict: '店长',
    check: false,
    name: 'components',
    meta: {
      title: 'components',
      icon: 'icon-店长'
    },
    children: [
      {
        path: 'staffmanage', depict: '员工管理', check: false, component: _import('staffManage/components/staffManage'), name: 'staffmanage', meta: { title: 'staffmanage', noCache: true },
      }
    ]
  },
  // 高级功能
  {
    path: '/advanced',
    component: Layout,
    redirect: 'noredirect',
    name: 'advanced',
    alwaysShow: true,
    depict: '高级功能',
    check: false,
    meta: {
      title: 'advanced',
      icon: 'icon-高级设置'
    },
    children: [
      {
        path: 'cardtypemanage', depict: '卡种管理', check: false, component: _import('cardTypeManage/components/cardTypeManage'), name: 'cardtypemanage', meta: { title: 'cardtypemanage', noCache: true },
      },
      {
        path: 'rolemanage', depict: '角色管理', check: false, component: _import('roleManage/components/roleManage'), name: 'rolemanage', meta: { title: 'rolemanage', noCache: true },
      },
      {
        path: 'articalpush', depict: '文章推送', check: false, component: _import('articlePush/index'), name: 'articalpush', meta: { title: 'articalpush', noCache: true },
      },
      {
        path: 'agreement', depict: '协议模板', check: false, component: _import('articlePush/protocol'), name: 'agreement', meta: { title: 'agreement', noCache: true },
      },
      {
        path: 'venue', depict: '俱乐部信息', check: false, component: _import('venueMessage/components/venueMessage'), name: 'venue', meta: { title: 'venue', noCache: true },
      }
    ]
  },

  // 数据统计
  {
    path: '/statistics',
    component: Layout,
    redirect: 'noredirect',
    name: 'statistics',
    alwaysShow: true,
    depict: '数据统计',
    check: false,
    meta: {
      title: 'statistics',
      icon: 'icon-数据统计'
    },
    children: [
      {
        path: 'totalAll', depict: '门店业绩', check: false, component: _import('statistics/components/admin/index'), name: 'totalAll', meta: { title: 'totalAll', noCache: true },
      },
      {
        path: 'financialRecord', depict: '财务记录', check: false, component: _import('financialRecord/index'), name: 'financialRecord', meta: { title: 'financialRecord', noCache: true }
      },
      {
        path: 'incomePresentation', depict: '收入提现', check: false, component: _import('incomePresentation/index'), name: 'incomePresentation', meta: { title: 'incomePresentation', noCache: true }
      },
      {
        path: 'employeeAchievement', depict: '员工业绩', check: false, component: _import('employeeAchievement/index'), name: 'employeeAchievement', meta: { title: 'employeeAchievement', noCache: true }
      }
    ]
  },

  // 操作日志
  {
    path: '/operation',
    component: Layout,
    redirect: 'noredirect',
    name: 'operation',
    alwaysShow: true,
    depict: '操作日志',
    check: false,
    meta: {
      title: 'operation',
      icon: 'icon-操作日志'
    },
    children: [
      {
        path: 'customerrecord', depict: '客户记录', check: false, component: _import('customerRecord/index'), name: 'customerrecord', meta: { title: 'customerrecord', noCache: true },
      },
      {
        path: 'cardrecord', depict: '会员卡记录', check: false, component: _import('cardRecord/components/cardRecord'), name: 'cardrecord', meta: { title: 'cardrecord', noCache: true },
      },
      {
        path: 'privaterecord', depict: '私教记录', check: false, component: _import('privateRecord/index'), name: 'privaterecord', meta: { title: 'privaterecord', noCache: true },
      },
      {
        path: 'publicrecord', depict: '公开课记录', check: false, component: _import('publicRecord/components/publicRecord'), name: 'publicrecord', meta: { title: 'publicrecord', noCache: true },
      },
      {
        path: 'leaguerecord', depict: '团课记录', check: false, component: _import('leagueRecord/index'), name: 'leaguerecord', meta: { title: 'leaguerecord', noCache: true },
      }
    ]
  },
  {
    path: 'marketing',
    component: Layout,
    depict: '营销服务',
    meta: {
      title: 'marketing',
      icon: 'icon-营销服务',
    },
    redirect: 'noredirect',
    check: false,
    children: [
      {
        depict: '营销服务',
        path: sale_url,
        meta: { title: 'marketing', icon: 'el-icon-menu' }
      }
    ]
  },
  {
    path: '',
    component: Layout,
    depict: '视频教程',
    meta: {
      title: 'course',
      icon: 'icon-视频教程',
    },
    redirect: 'noredirect',
    check: false,
    children: [
      {
        depict: '视频教程',
        path: 'http://v.qq.com/vplus/3b13b31da1c4d02ea0b6c87bb849e22c/foldervideos/ozj00150194j90t',
        meta: { title: 'course', icon: 'el-icon-info' }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true, name: '404' }
]
export default totalrole
