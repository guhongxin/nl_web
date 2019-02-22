/**
 * @param path 对应的是totalrole.js的对应path，必须对应
 */
const roletree = [
  // 不可选状态
  {
    label: '电脑端权限',
    id: 'apppower',
    path: ''
  },
  // 前台
  {
    id: '1',
    label: '前台功能',
    path: '/charts',
    children: [
      {
        id: '1-1',
        label: '入场签到',
        path: 'signIn',
        permissons: [
          'gym.customers.index',
          'gym.employees.index',
          'gym.sign.member',
          'gym.groupCourse.todayGroupCourse',
          'gym.sign.index',
          'gym.sign.store',
          'gym.lockers.rents.index',
          'gym.lockers.grids.renew',
          'gym.lockers.grids.repay',
          'gym.customers.phone',
          'gym.lockers.index',
          'gym.lockers.grids.rent',
          'gym.vip_cards.index',
          'gym.customers.show',
          'gym.vip_cards.store'
        ], // 后台权限
        children: [
          { label: '页面查看', id: '1-1-0', permissons: ['gym.customers.index', 'gym.employees.index', 'gym.sign.member', 'gym.groupCourse.todayGroupCourse', 'gym.sign.index', 'gym.sign.store', 'gym.lockers.rents.index', 'gym.lockers.grids.renew', 'gym.lockers.grids.repay', 'gym.customers.phone', 'gym.lockers.index', 'gym.lockers.grids.rent'], },
          { label: '前台大屏', id: '1-1-1', permissons: ['gym.sign.record', 'gym.sign.enter', 'gym.sign.rank_all', 'gym.sign.rank_month', 'gym.sign.rank_week'], },
          { label: '会员办理', id: '1-1-2', permissons: ['gym.vip_templates.index', 'gym.employees.index', 'gym.customers.phone', 'gym.customers.store', 'gym.customers.update', 'gym.vip_cards.store'], },
          { label: '潜客登记', id: '1-1-3', permissons: ['gym.customers.store'], },
          { label: '历史明细', id: '1-1-4', permissons: ['gym.sign.list'], },
          { label: '运动排行', id: '1-1-5', permissons: ['gym.sport.rank_daily', 'gym.sport.rank_month', 'gym.sport.rank_week'], },
          { label: '一键清场', id: '1-1-6', permissons: ['gym.sign.clean'], },
        ]
      },
      {
        id: '1-2',
        label: '租柜管理',
        path: 'cupboardmanage',
        permissons: [], // 后台权限
        children: [
          {
            label: '柜子租还', id: '1-2-1', permissons: ['gym.cabinetBracelet.index', 'gym.MemberCabinetRecord.index', 'gym.MemberCabinetRecord.store', 'gym.MemberCabinetRecord.areaQuery', 'gym.MemberCabinetRecord.update', 'gym.lockers.index', 'gym.lockers.grids.show', 'gym.lockers.grids.rent', 'gym.lockers.grids.disable', 'gym.lockers.grids.enable', 'gym.lockers.grids.renew', 'gym.lockers.grids.repay', 'gym.lockers.tabs', 'gym.lockers.rents.index', 'gym.customers.phone']
          },
          {
            label: '柜子管理', path: 'nil', id: '1-2-2', permissons: ['gym.cabinetBracelet.bindCabinetQuery', 'gym.cabinetBracelet.store', 'gym.cabinetBracelet.bindCabinetQuery', 'gym.lockers.index', 'gym.lockers.grids.store'],
            children: [
              { label: '页面查看', id: '1-2-2-0', permissons: ['gym.lockers.index'], },
              { label: '添加柜子区域', id: '1-2-2-1', permissons: ['gym.cabinetBracelet.store', 'gym.lockers.store', 'gym.lockers.devices'] },
              // { label: '绑定', id: '1-2-2-2', permissons: ['gym.cabinetBracelet.bindCabinetQuery'] },
              { label: '编辑', id: '1-2-2-3', permissons: ['gym.lockers.show', 'gym.lockers.update', 'gym.lockers.grids.update'] },
              { label: '删除', id: '1-2-2-4', permissons: ['gym.cabinetBracelet.destroy', 'gym.lockers.destroy'] },
            ]
          },
          {
            label: '租还记录', path: 'nil', id: '1-2-3', permissons: ['gym.employees.index', 'gym.MemberCabinetRecord.areaQuery', 'gym.lockers.index', 'gym.lockers.renews.index'],
            children: [
              { label: '页面查看', id: '1-2-3-0', permissons: ['gym.employees.index', 'gym.lockers.rents.index'] },
              { label: '导出', id: '1-2-3-1', permissons: ['gym.lockers.index', 'gym.employees.index', 'gym.lockers.rents.index', 'gym.CabinetRecordReturn.cabinetRecordReturnExcelExport'] },
            ]
          },
          {
            label: '禁用记录', path: 'nil', id: '1-2-4', permissons: ['gym.employees.index', 'gym.MemberCabinetRecord.areaQuery', 'gym.lockers.disables.index'],
            children: [
              { label: '页面查看', id: '1-2-4-0', permissons: ['gym.lockers.index'], },
              { label: '导出', id: '1-2-4-1', permissons: ['gym.lockers.index', 'gym.CabinetRecordReturn.cabinetBanRecordExcelExport'], },
            ]
          }
        ]
      },
      {
        id: '1-3',
        label: '会员开卡',
        path: 'opencard',
        name: 'opencard',
        permissons: ['gym.vip_templates.index', 'gym.employees.index', 'gym.customers.phone', 'gym.customers.store', 'gym.customers.update', 'gym.vip_cards.store'],
        children: [{ label: '页面查看', id: '1-3-0', permissons: ['gym.vip_templates.index', 'gym.employees.index', 'gym.customers.phone', 'gym.customers.store', 'gym.customers.update', 'gym.vip_cards.store'], }]
      },
      {
        id: '1-4',
        label: '会员卡管理',
        path: 'menber',
        permissons: [],
        children: [
          {
            label: '时效卡', id: '1-4-1', path: 'nil', permissons: ['gym.employees.index', 'gym.vip_cards.vip_amount', 'gym.vip_cards.index', 'gym.vip_cards.show', 'gym.sign.list', 'gym.stop_cards.index', 'gym.transfer_cards.index', 'gym.customer_vips.upload', 'gym.customer_vips.import', 'gym.customer_vips.check', 'gym.customer_vips.import.errors'],
            children: [
              { label: '页面查看', id: '1-4-1-0', permissons: ['gym.employees.index', 'gym.vip_cards.vip_amount', 'gym.vip_cards.index', 'gym.vip_cards.show', 'gym.sign.list', 'gym.stop_cards.index', 'gym.transfer_cards.index'] },
              { label: '停卡', id: '1-4-1-1', permissons: ['gym.stop_cards.show', 'gym.vip_cards.show', 'gym.employees.index', 'gym.vip_cards.stop_card', 'gym.vip_cards.update'] },
              { label: '转卡', id: '1-4-1-2', permissons: ['gym.customers.update', 'gym.customers.store', 'gym.vip_cards.show', 'gym.vip_cards.transfer_card', 'gym.customers.phone'] },
              { label: '续卡', id: '1-4-1-18', permissons: [] },
              { label: '编辑', id: '1-4-1-3', permissons: ['gym.vip_cards.show', 'gym.vip_cards.update'] },
              { label: '删除', id: '1-4-1-4', permissons: ['gym.vip_cards.destroy'] },
              { label: '批量删除', id: '1-4-1-5', permissons: ['gym.vip_cards.batch'] },
              { label: '导入数据', id: '1-4-1-6', permissons: ['gym.excel.import'] },
              { label: '导出全部', id: '1-4-1-7', permissons: ['gym.excel.export'] },
              { label: '批量锁定', id: '1-4-1-8', permissons: ['gym.vip_cards.batch'] },
              { label: '批量解锁', id: '1-4-1-9', permissons: ['gym.vip_cards.batch'] },
              // { label: '下载模板', id: '1-4-1-10', permissons: [] },
              { label: '开卡', id: '1-4-1-11', permissons: ['gym.vip_cards.active'] },
              { label: '恢复', id: '1-4-1-12', permissons: ['gym.vip_cards.restore'] },
              { label: '批量恢复', id: '1-4-1-13', permissons: ['gym.vip_cards.restore'] },
              { label: '删除全部进入回收站', id: '1-4-1-14', permissons: ['gym.vip_cards.move_to_recycle_bin'] },
              { label: '批量删除回收站', id: '1-4-1-15', permissons: ['gym.vip_cards.bat_force_del'] },
              { label: '删除全部回收站', id: '1-4-1-16', permissons: ['gym.vip_cards.clear_recycle_bin'] },
              { label: '单个删除回收站', id: '1-4-1-17', permissons: ['gym.vip_cards.force'] },
              { label: '批量开卡', id: '1-4-1-19', permissons: ['gym.customer_vips.bat_active'] },
              { label: '成员', id: '1-4-1-20', permissons: [] },
            ]
          },
          {
            label: '次卡', id: '1-4-2', path: 'nil', permissons: ['gym.employees.index', 'gym.vip_cards.vip_amount', 'gym.vip_cards.index', 'gym.vip_cards.show', 'gym.sign.list', 'gym.stop_cards.index', 'gym.transfer_cards.index', 'gym.customer_vips.upload', 'gym.customer_vips.import', 'gym.customer_vips.check', 'gym.customer_vips.import.errors'],
            children: [
              { label: '页面查看', id: '1-4-2-0', permissons: ['gym.employees.index', 'gym.vip_cards.vip_amount', 'gym.vip_cards.index', 'gym.vip_cards.show', 'gym.sign.list', 'gym.stop_cards.index', 'gym.transfer_cards.index'], },
              { label: '扣次', id: '1-4-2-1', permissons: ['gym.vip_cards.show', 'gym.vip_cards.update'] },
              { label: '转卡', id: '1-4-2-2', permissons: ['gym.customers.update', 'gym.customers.store', 'gym.vip_cards.show', 'gym.vip_cards.transfer_card', 'gym.customers.phone'] },
              { label: '续卡', id: '1-4-2-18', permissons: [] },
              { label: '编辑', id: '1-4-2-3', permissons: ['gym.vip_cards.show', 'gym.vip_cards.update'] },
              { label: '删除', id: '1-4-2-4', permissons: ['gym.vip_cards.destroy'] },
              { label: '批量删除', id: '1-4-2-5', permissons: ['gym.vip_cards.batch'] },
              { label: '导入数据', id: '1-4-2-6', permissons: ['gym.excel.import'] },
              { label: '导出全部', id: '1-4-2-7', permissons: ['gym.excel.export'] },
              { label: '批量锁定', id: '1-4-2-8', permissons: ['gym.vip_cards.batch'] },
              { label: '批量解锁', id: '1-4-2-9', permissons: ['gym.vip_cards.batch'] },
              // { label: '下载模板', id: '1-4-2-10', permissons: [] },
              { label: '开卡', id: '1-4-2-11', permissons: ['gym.vip_cards.active'] },
              { label: '恢复', id: '1-4-2-12', permissons: ['gym.vip_cards.restore'] },
              { label: '批量恢复', id: '1-4-2-13', permissons: ['gym.vip_cards.restore'] },
              { label: '删除全部进入回收站', id: '1-4-2-14', permissons: ['gym.vip_cards.move_to_recycle_bin'] },
              { label: '批量删除回收站', id: '1-4-2-15', permissons: ['gym.vip_cards.bat_force_del'] },
              { label: '删除全部回收站', id: '1-4-2-16', permissons: ['gym.vip_cards.clear_recycle_bin'] },
              { label: '单个删除回收站', id: '1-4-2-17', permissons: ['gym.vip_cards.force'] },
              { label: '批量开卡', id: '1-4-2-19', permissons: [] },
              { label: '成员', id: '1-4-2-20', permissons: [] },
            ]
          },
          {
            label: '储值卡', id: '1-4-3', path: 'nil', permissons: ['gym.employees.index', 'gym.vip_cards.vip_amount', 'gym.vip_cards.index', 'gym.vip_cards.show', 'gym.sign.list', 'gym.stop_cards.index', 'gym.transfer_cards.index', 'gym.customer_vips.upload', 'gym.customer_vips.import', 'gym.customer_vips.check', 'gym.customer_vips.import.errors'],
            children: [
              { label: '页面查看', id: '1-4-3-0', permissons: ['gym.employees.index', 'gym.vip_cards.vip_amount', 'gym.vip_cards.index', 'gym.vip_cards.show', 'gym.sign.list', 'gym.stop_cards.index', 'gym.transfer_cards.index'], },
              { label: '扣费', id: '1-4-3-1', permissons: ['gym.vip_cards.show', 'gym.user_vips.use'] },
              { label: '充值', id: '1-4-3-18', permissons: ['gym.customer_vips.renew'] },
              { label: '转卡', id: '1-4-3-2', permissons: ['gym.customers.update', 'gym.customers.store', 'gym.vip_cards.show', 'gym.vip_cards.transfer_card', 'gym.customers.phone'] },
              { label: '编辑', id: '1-4-3-3', permissons: ['gym.vip_cards.show', 'gym.vip_cards.update'] },
              { label: '删除', id: '1-4-3-4', permissons: ['gym.vip_cards.destroy'] },
              { label: '批量删除', id: '1-4-3-5', permissons: ['gym.vip_cards.batch'] },
              { label: '导入数据', id: '1-4-3-6', permissons: ['gym.excel.import'] },
              { label: '导出全部', id: '1-4-3-7', permissons: ['gym.excel.export'] },
              { label: '批量锁定', id: '1-4-3-8', permissons: ['gym.vip_cards.batch'] },
              { label: '批量解锁', id: '1-4-3-9', permissons: ['gym.vip_cards.batch'] },
              // { label: '下载模板', id: '1-4-2-10', permissons: [] },
              { label: '开卡', id: '1-4-3-11', permissons: ['gym.vip_cards.active'] },
              { label: '恢复', id: '1-4-3-12', permissons: ['gym.vip_cards.restore'] },
              { label: '批量恢复', id: '1-4-3-13', permissons: ['gym.vip_cards.restore'] },
              { label: '删除全部进入回收站', id: '1-4-3-14', permissons: ['gym.vip_cards.move_to_recycle_bin'] },
              { label: '批量删除回收站', id: '1-4-3-15', permissons: ['gym.vip_cards.bat_force_del'] },
              { label: '删除全部回收站', id: '1-4-3-16', permissons: ['gym.vip_cards.clear_recycle_bin'] },
              { label: '单个删除回收站', id: '1-4-3-17', permissons: ['gym.vip_cards.force'] },
              { label: '批量开卡', id: '1-4-3-19', permissons: [] },
              { label: '成员', id: '1-4-3-20', permissons: [] },
            ]
          }
        ],
      },
      {
        id: '1-5',
        label: '收银台',
        path: 'cashier',
        permissons: [], // 后台权限
        children: [
          { label: '快速购物', id: '1-5-1', permissons: ['gym.employees.index', 'gym.goods.barcode', 'gym.goods_orders.store', 'gym.goods.index', 'gym.customers.index'] },
          { label: '入库记录', id: '1-5-2', path: 'nil', permissons: ['gym.goods_stocks.index'],
            children: [
              { label: '页面查看', id: '1-5-2-0', permissons: ['gym.goods_stocks.index'] },
              { label: '商品入库', id: '1-5-2-1', permissons: ['gym.goods.barcode', 'gym.goods.store', 'gym.goods_stocks.store', 'gym.goods_stocks.index'] },
              // { label: '编辑', id: '1-5-2-2', permissons: [] },
              // { label: '删除', id: '1-5-2-3', permissons: [] }
            ]
          },
          { label: '商品管理', id: '1-5-4', path: 'nil', permissons: ['gym.goods.index'],
            children: [
              { label: '页面查看', id: '1-5-4-0', permissons: ['gym.goods.index'], },
              { label: '编辑', id: '1-5-4-1', permissons: ['gym.goods.update'] },
              { label: '添加商品', id: '1-5-4-3', permissons: ['gym.goods.store'] },
              { label: '入库', id: '1-5-4-2', permissons: ['gym.goods.barcode', 'gym.goods.store', 'gym.goods_stocks.store', 'gym.goods_stocks.index'] },
              { label: '库存核对', id: '1-5-4-4', permissons: ['gym.goods.check_stock', 'gym.goods.check_stock_logs.index'] },
              { label: '删除', id: '1-5-4-5', permissons: ['ym.goods.destroy'] },
            ]
          },
          { label: '收银记录', id: '1-5-3', permissons: ['gym.goods_orders.index'] },
        ]
      }
    ]
  },

  // 会籍
  {
    label: '会籍功能',
    id: '2',
    path: '/form',
    children: [
      {
        id: '2-1',
        label: '客户管理',
        path: 'createForm',
        permissons: [],
        children: [
          { label: '会员管理', id: '2-1-1', path: 'nil', permissons: ['gym.customers.index', 'gym.customers.statistics', 'gym.employees.index'],
            children: [
              { label: '页面查看', id: '2-1-1-0', permissons: ['gym.customers.index', 'gym.customers.statistics', 'gym.employees.index'], },
              { label: '详情', id: '2-1-1-1', permissons: ['gym.vip_cards.show', 'gym.vip_cards.update', 'gym.customers.index', 'gym.customers.update', 'gym.customers.store', 'gym.vip_cards.transfer_card', 'gym.customers.phone', 'gym.stop_cards.show', 'gym.employees.index', 'gym.vip_cards.stop_card'] },
              { label: '编辑', id: '2-1-1-2', permissons: ['gym.customers.update'] },
              { label: '删除', id: '2-1-1-3', permissons: ['gym.customers.destroy'] },
              { label: '分配会籍', id: '2-1-1-4', permissons: ['gym.customers.update'] },
              { label: '分配教练', id: '2-1-1-5', permissons: ['gym.customers.update'] },
              { label: '批量分配会籍', id: '2-1-1-6', permissons: ['gym.customers.bat_set_con'] },
              { label: '批量分配教练', id: '2-1-1-7', permissons: ['gym.customers.bat_set_coach'] },
              { label: '批量删除', id: '2-1-1-8', permissons: ['gym.customers.batch_destroy'] },
              // { label: '恢复', id: '2-1-1-9', permissons: ['gym.customers.restore'] },
              // { label: '批量恢复', id: '2-1-1-10', permissons: ['gym.customers.batch_Restore'] },
            ]
          },
          { label: '会员维护', id: '2-1-2', path: 'nil', permissons: ['gym.employees.index', 'gym.customers.statistics', 'gym.customers.index'],
            children: [
              { label: '页面查看', id: '2-1-2-0', permissons: ['gym.customers.statistics', 'gym.customers.index', 'gym.employees.index'], },
              { label: '分配会籍', id: '2-1-2-1', permissons: ['gym.customers.update'] },
              { label: '分配教练', id: '2-1-2-2', permissons: ['gym.customers.update'] },
              { label: '批量分配会籍', id: '2-1-2-3', permissons: ['gym.customers.bat_set_con'] },
              { label: '批量分配教练', id: '2-1-2-4', permissons: ['gym.customers.bat_set_coach'] },
              { label: '批量删除', id: '2-1-2-5', permissons: ['gym.customers.batch_destroy'] },
              { label: '会籍跟进', id: '2-1-2-6', permissons: ['gym.customers.remarks.index'] },
              { label: '教练跟进', id: '2-1-2-7', permissons: ['gym.customers.remarks.index'] }
            ]
          },
          { label: '潜在客户', id: '2-1-3', path: 'nil', permissons: ['gym.customers.statistics', 'gym.employees.index', 'gym.customers.index'],
            children: [
              { label: '页面查看', id: '2-1-3-0', permissons: ['gym.customers.statistics', 'gym.employees.index', 'gym.customers.index'], },
              { label: '编辑', id: '2-1-3-1', permissons: ['gym.customers.update', 'gym.customers.index', 'gym.customers.statistics'] },
              { label: '删除', id: '2-1-3-2', permissons: ['gym.customers.destroy', 'gym.customers.statistics', 'gym.customers.index'] },
              { label: '分配会籍', id: '2-1-3-3', permissons: ['gym.customers.update', 'gym.customers.index'] },
              { label: '分配教练', id: '2-1-3-4', permissons: ['gym.customers.update', 'gym.customers.index'] },
              { label: '批量分配会籍', id: '2-1-3-5', permissons: ['gym.customers.bat_set_con', 'gym.customers.index'] },
              { label: '批量分配教练', id: '2-1-3-6', permissons: ['gym.customers.bat_set_coach', 'gym.customers.index'] },
              { label: '批量删除', id: '2-1-3-7', permissons: ['gym.customers.batch_destroy', 'gym.customers.index'] },
              { label: '恢复', id: '2-1-3-8', permissons: ['gym.customers.restore', 'gym.customers.index'] },
              { label: '潜客登记', id: '2-1-3-9', permissons: ['gym.customers.store', 'gym.customers.statistics', 'gym.customers.index'] },
              { label: '会籍跟进', id: '2-1-3-10', permissons: ['gym.customers.remarks.index'] },
              { label: '教练跟进', id: '2-1-3-11', permissons: ['gym.customers.remarks.index'] },
              { label: '批量恢复', id: '2-1-3-12', permissons: ['gym.customers.batch_Restore', 'gym.customers.index', 'gym.customers.bat_restore'] },
              { label: '详情', id: '2-1-3-13', permissons: ['gym.customers.index', 'gym.customers.update', 'gym.customers.store', 'gym.customers.phone', 'gym.employees.index'] },
            ]
          }
        ]
      }
    ]
  },

  // 教练
  {
    id: '3',
    label: '教练功能',
    path: '/zip',
    children: [
      {
        id: '3-1',
        label: '私教课程',
        path: 'privatecourse',
        permissons: ['gym.employees.index', 'gym.courses.index', 'gym.courses.coaches.index'], // 后台权限
        children: [
          { label: '页面查看', id: '3-1-0', permissons: ['gym.employees.index', 'gym.courses.index', 'gym.courses.coaches.index'], },
          { label: '添加', id: '3-1-1', permissons: ['gym.courses.index', 'gym.employees.index', 'gym.courses.coaches.index', 'gym.courses.store'] },
          { label: '编辑', id: '3-1-2', permissons: ['gym.courses.update', 'gym.courses.coaches.index', 'gym.courses.index'] },
          { label: '删除', id: '3-1-3', permissons: ['gym.courses.destroy', 'gym.courses.coaches.index', 'gym.courses.index'] },
          { label: '排序', id: '3-1-4', permissons: ['gym.courses.sort', 'gym.courses.coaches.index'] },
          { label: '添加教练', id: '3-1-5', permissons: ['gym.employees.index', 'gym.courses.coaches.index', 'gym.courses.coaches.store'] },
          { label: '批量删除', id: '3-1-6', permissons: ['gym.courses.coaches.batdes', 'gym.courses.coaches.index'] },
          { label: '表内编辑', id: '3-1-7', permissons: ['gym.courses.coaches.update', 'gym.courses.coaches.index'] },
          { label: '表内删除', id: '3-1-8', permissons: ['gym.courses.coaches.destroy', 'gym.courses.coaches.index'] },
          { label: '表内购买', id: '3-1-9', permissons: ['gym.courses.coaches.destroy', 'gym.courses.coaches.index'] },
        ]
      },
      {
        id: '3-2',
        label: '私教购买',
        path: 'privatebuy',
        permissons: ['gym.courses.index', 'gym.employees.index', 'gym.courses.coaches.index', 'gym.customer_courses.index'], // 后台权限
        children: [
          { label: '页面查看', id: '3-2-0', permissons: ['gym.courses.index', 'gym.employees.index', 'gym.courses.coaches.index', 'gym.customer_courses.index'], },
          { label: '添加购买', id: '3-2-1', permissons: ['gym.customers.phone', 'gym.course_orders.store', 'gym.customer_courses.index', 'gym.courses.coaches.index'] },
          { label: '编辑', id: '3-2-2', permissons: ['gym.courses.coaches.index', 'gym.customer_courses.update'] },
          { label: '删除', id: '3-2-3', permissons: ['gym.customer_courses.destroy'] },
          { label: '消课', id: '3-2-4', permissons: ['gym.course_consumes.show', 'gym.customer_courses.consume'] },
          { label: '批量删除', id: '3-2-5', permissons: ['gym.customer_courses.batch'] },
        ]
      },
      {
        id: '3-3',
        label: '私教预约',
        path: 'privateorder',
        permissons: ['gym.courses.index', 'gym.course_consumes.index', 'gym.course_consumes.statistics', 'gym.employees.index'], // 后台权限
        children: [
          { label: '页面查看', id: '3-3-0', permissons: ['gym.courses.index', 'gym.course_consumes.index', 'gym.course_consumes.statistics', 'gym.employees.index'] },
          { label: '添加预约', id: '3-3-1', permissons: ['gym.customers.phone', 'gym.customers.courses', 'gym.course_consumes.store', 'gym.employees.show'] },
          { label: '取消预约', id: '3-3-2', permissons: ['gym.course_consumes.cancel', 'gym.course_consumes.index', 'gym.course_consumes.statistics'] },
          { label: '消课', id: '3-3-3', permissons: ['gym.course_consumes.show', 'gym.customer_courses.consume'] },
        ]
      },
      {
        id: '3-4',
        label: '团课管理',
        path: 'groupCourseManage',
        permissons: ['gym.groupCourse.index', 'gym.employees.index'], // 后台权限
        children: [
          {
            label: '团课排期', path: 'nil', id: '3-4-1', permissons: ['gym.groupCourse.index', 'gym.employees.index'],
            children: [
              { label: '页面查看', id: '3-4-1-0', permissons: ['gym.groupCourse.index', 'gym.employees.index'], },
              { label: '添加排期', id: '3-4-1-1', permissons: ['gym.groupCourse.store'] },
              { label: '编辑排期', id: '3-4-1-2', permissons: ['gym.groupCourse.store'] },
              { label: '刪除排期', id: '3-4-1-3', permissons: ['gym.groupCourse.destroy', 'gym.groupCourse.index'] },
              { label: '预约课程', id: '3-4-1-4', permissons: ['gym.customers.phone', 'gym.groupCourseBooking.store', 'gym.groupCourseBooking.index', 'gym.groupCourse.index'] },
              { label: '查看预约', id: '3-4-1-5', permissons: ['gym.groupCourseBooking.index', 'gym.groupCourseBooking.destroy'] },
              { label: '打印课表', id: '3-4-1-6', permissons: [] },
              { label: '批量取消', id: '3-4-1-7', permissons: ['gym.groupCourse.store'] },
              { label: '添加预约', id: '3-4-1-8', permissons: ['gym.groupCourseBooking.index'] },
              { label: '修改备注', id: '3-4-1-9', permissons: ['gym.groupCourse.store'] },
              { label: '取消预约', id: '3-4-1-10', permissons: ['gym.groupCourseBooking.index'] },
            ]
          },
          {
            label: '团课课程', path: 'nil', id: '3-4-2', permissons: ['gym.groupCourse.index', 'gym.groupCourse.store', 'gym.employees.index'],
            children: [
              { label: '页面查看', id: '3-4-2-0', permissons: ['gym.groupCourse.index'] },
              { label: '添加课程', id: '3-4-2-1', permissons: ['gym.groupCourse.store'] },
              { label: '编辑', id: '3-4-2-2', permissons: ['gym.groupCourse.store'] },
              { label: '排期', id: '3-4-2-3', permissons: ['gym.groupCourse.store'] },
              { label: '删除', id: '3-4-2-4', permissons: ['gym.groupCourse.store'] },
            ]
          },
          {
            label: '团课预约', path: 'nil', id: '3-4-3', permissons: ['gym.groupCourseBooking.index'],
            children: [
              { label: '页面查看', id: '3-4-3-0', permissons: [' gym.groupCourseBooking.index'], },
              { label: '修改备注', id: '3-4-3-1', permissons: [' gym.groupCourseBooking.index'], },
              { label: '取消预约', id: '3-4-3-2', permissons: ['gym.groupCourseBooking.index'], },
            ]
          }
        ]
      },
      {
        label: '公开课管理',
        id: '3-5',
        path: 'publicCourseManage',
        permissons: ['gym.groupCourse.index'], // 后台权限
        children: [
          { label: '页面查看', id: '3-5-0', permissons: ['gym.groupCourse.index'], },
          { label: '添加课程', id: '3-5-1', permissons: ['gym.groupCourse.index', 'gym.employees.index', 'gym.groupCourse.store'] },
          { label: '编辑课程', id: '3-5-2', permissons: ['gym.employees.index', 'gym.groupCourse.update', 'gym.groupCourse.index'] },
          { label: '刪除课程', id: '3-5-3', permissons: ['gym.groupCourse.destroy', 'gym.groupCourse.index'] },
          { label: '打印课表', id: '3-5-4', permissons: [] },
        ]
      },
      {
        label: '体测报告',
        id: '3-6',
        path: 'testreport',
        permissons: ['gym.body_exams.amount', 'gym.body_exams.index'], // 后台权限
        children: [
          { label: '页面查看', id: '3-6-0', permissons: ['gym.body_exams.amount', 'gym.body_exams.index'], },
          { label: '体测录入', id: '3-6-1', permissons: ['gym.employees.index', 'gym.customers.phone', 'gym.body_exams.show', 'gym.body_exams.store'] },
          { label: '编辑', id: '3-6-2', permissons: ['gym.body_exams.update', 'gym.body_exams.show'] },
          { label: '刪除', id: '3-6-3', permissons: ['gym.body_exams.batch', 'gym.body_exams.amount'] },
          { label: '批量删除', id: '3-6-4', permissons: ['gym.body_exams.batch', 'gym.body_exams.amount', 'gym.body_exams.index'] },
          { label: 'pc查看', id: '3-6-5', permissons: [] },
          { label: 'app查看', id: '3-6-6', permissons: [] }
        ]
      }
    ]
  },

  // 店长
  {
    label: '店长功能',
    id: '4',
    path: '/components',
    children: [
      {
        label: '员工管理',
        id: '4-1',
        path: 'staffmanage',
        permissons: [], // 后台权限
        children: [
          { label: '页面查看', id: '4-1-0', permissons: ['gym.roles.index', 'gym.statistics.employee_sale'], },
          { label: '添加员工', id: '4-1-1', permissons: ['gym.employees.store', 'gym.employees.index', 'gym.employees.statistics'] },
          { label: '编辑', id: '4-1-2', permissons: ['gym.employees.show', 'gym.employees.update'] },
          { label: '表内禁用', id: '4-1-3', permissons: ['gym.employees.disable', 'gym.employees.statistics'] },
          // { label: '批量删除', id: '4-1-4', permissons: [] },
          { label: '设置教练', id: '4-1-5', permissons: ['gym.employees.update', 'gym.employees.bat_set_coach'] },
          { label: '取消教练', id: '4-1-6', permissons: ['gym.employees.update', 'gym.employees.bat_cancel_coach'] },
          { label: '禁用', id: '4-1-7', permissons: ['gym.employees.bat_disable', 'gym.employees.index', 'gym.employees.statistics'] },
          { label: '启用', id: '4-1-8', permissons: ['gym.employees.bat_enable', 'gym.employees.index', 'gym.employees.statistics'] },
          { label: '表内启用', id: '4-1-9', permissons: ['gym.employees.index', 'gym.employees.enable', 'gym.employees.statistics'] },
          { label: '解绑App', id: '4-1-10', permissons: ['gym.employees.unbind'] }
        ]
      }
    ]
  },
  // 高级功能
  {
    label: '高级功能',
    id: '5',
    path: '/advanced',
    children: [
      {
        label: '卡种管理',
        id: '5-1',
        path: 'cardtypemanage',
        permissons: [], // 后台权限
        children: [
          { label: '页面查看', id: '5-1-0', permissons: ['gym.statistics.employee_sale'], },
          { label: '添加卡种', id: '5-1-1', permissons: ['gym.vip_templates.index', 'gym.vip_templates.store'] },
          { label: '编辑', id: '5-1-2', permissons: ['gym.vip_templates.update', 'gym.vip_templates.index'] },
          { label: '刪除', id: '5-1-3', permissons: ['gym.vip_templates.destroy', 'gym.vip_templates.index'] },
          { label: '批量app下架', id: '5-1-4', permissons: ['gym.vip_templates.batch', 'gym.vip_templates.index'] },
          { label: '批量app上架', id: '5-1-5', permissons: ['gym.vip_templates.batch', 'gym.vip_templates.index'] },
          { label: '批量saas下架', id: '5-1-6', permissons: ['gym.vip_templates.batch', 'gym.vip_templates.index'] },
          { label: '批量saas上架', id: '5-1-7', permissons: ['gym.vip_templates.batch', 'gym.vip_templates.index'] }
        ]
      },
      {
        label: '角色管理',
        id: '5-2',
        path: 'rolemanage',
        permissons: [], // 后台权限
        children: [
          { label: '页面查看', id: '5-2-0', permissons: [' login', 'gym.roles.index', ' gym.message_notices.index'], },
          { label: '添加角色', id: '5-2-1', permissons: ['gym.roles.index', 'gym.roles.store'] },
          { label: '权限分配', id: '5-2-2', permissons: ['gym.roles.update_perms', 'gym.roles.store'] },
          { label: '编辑', id: '5-2-3', permissons: ['gym.roles.update', 'gym.roles.store'] },
          { label: '刪除', id: '5-2-4', permissons: ['gym.roles.batch', 'gym.roles.store', 'gym.roles.destroy'] },
          { label: '批量刪除', id: '5-2-5', permissons: ['gym.roles.batch', 'gym.roles.store'] }
        ]
      },
      {
        label: '文章推送',
        id: '5-3',
        path: 'articalpush',
        permissons: [], // 后台权限
        children: [
          {
            label: '文章管理', id: '5-3-1', path: 'nil', permissons: ['gym.push_articles.index', 'gym.roles.index'],
            children: [
              { label: '页面查看', id: '5-3-1-0', permissons: ['login', 'gym.message_notices.index', 'GYM'] },
              { label: '添加文章', id: '5-3-1-1', permissons: ['gym.push_articles.store', 'gym.push_articles.index'] },
              { label: '编辑', id: '5-3-1-2', permissons: ['gym.push_articles.update', 'gym.push_articles.index'] },
              { label: '预览', id: '5-3-1-3', permissons: ['gym.article.show'] },
              { label: '推送', id: '5-3-1-4', permissons: ['gym.record_articles.store', 'gym.push_articles.index'] },
              { label: '删除', id: '5-3-1-5', permissons: ['gym.push_articles.destroy'] },
              { label: '批量删除', id: '5-3-1-6', permissons: ['gym.push_articles.batch', 'gym.push_articles.index'] },
            ]
          },
          {
            label: '推送记录', id: '5-3-2', path: 'nil', permissons: ['gym.record_articles.index'],
            children: [
              { label: '页面查看', id: '5-3-2-0', permissons: ['login', 'gym.message_notices.index', 'GYM'], },
              // { label: '添加文章', id: '5-3-2-1', permissons: [] },
              // { label: '编辑', id: '5-3-2-2', permissons: [] },
              { label: '文章查看', id: '5-3-2-3', permissons: [] },
              // { label: '推送', id: '5-3-2-4', permissons: [] },
              { label: '撤回', id: '5-3-2-5', permissons: ['gym.record_articles.destroy'] },
              { label: '批量删除', id: '5-3-2-6', permissons: ['gym.record_articles.batch'] },
            ]
          }
        ]
      },
      {
        label: '协议模板',
        id: '5-4',
        path: 'agreement',
        permissons: [], // 后台权限
        children: [
          {
            label: '开卡协议', path: 'nil', id: '5-4-1', permissons: ['gym.protocols.update', 'gym.vip_cards.index'],
            children: [
              { label: '页面查看', id: '5-4-1-0', permissons: ['login', 'gym.message_notices.index', 'gym.protocols.update'], },
              { label: '打印协议', id: '5-4-1-1', permissons: [] },
              { label: '编辑协议', id: '5-4-1-2', permissons: ['gym.protocols.store'] },
              { label: '协议重置', id: '5-4-1-3', permissons: ['gym.protocols.destory'] }
            ]
          },
          {
            label: '私教协议', path: 'nil', id: '5-4-2', permissons: ['gym.protocols.update'],
            children: [
              { label: '页面查看', id: '5-4-2-0', permissons: ['login', 'gym.message_notices.index', 'gym.protocols.update'], },
              { label: '打印协议', id: '5-4-2-1', permissons: [] },
              { label: '编辑协议', id: '5-4-2-2', permissons: ['gym.protocols.store'] },
              { label: '协议重置', id: '5-4-2-3', permissons: ['gym.protocols.destory'] }
            ]
          }
        ]
      },
      {
        label: '俱乐部信息',
        id: '5-5',
        path: 'venue',
        permissons: [], // 后台权限
        children: [
          { label: '页面查看', id: '5-5-0', permissons: ['login', 'gym.message_notices.index'], },
          { label: '修改信息', id: '5-5-1', permissons: ['gym.audits.gym_update'] },
          { label: '认证', id: '5-5-2', permissons: ['login', 'gym.audits.gym_auth', 'gym.audits.gym_auth'] }
        ]
      }
    ]
  },

  // 数据统计
  {
    label: '数据统计',
    id: '6',
    path: '/statistics',
    children: [
      {
        label: '门店业绩',
        id: '6-1',
        path: 'totalAll',
        permissons: ['gym.statistics.index', 'gym.statistics.employee_sale', 'gym.statistics.goods_sale'],
        children: [{ label: '页面查看', id: '6-1-0', permissons: ['gym.statistics.index', 'gym.statistics.employee_sale', 'gym.statistics.goods_sale'], }]
      },
      {
        label: '财务记录',
        id: '6-2',
        path: 'financialRecord',
        permissons: [],
        children: [
          {
            label: '会员卡订单', id: '6-2-1', path: 'nil', permissons: ['gym.finance.index'],
            children: [
              { label: '页面查看', id: '6-2-1-0', permissons: ['gym.finance.index'], },
              { label: '批量作废', id: '6-2-1-1', permissons: ['gym.finance.withdraw.check'], },
              { label: '财务核对', id: '6-2-1-2', permissons: ['gym.finance.withdraw.finance_check'], }
            ]
          },
          {
            label: '私教课订单', id: '6-2-2', path: 'nil', permissons: ['gym.finance.index'],
            children: [
              { label: '页面查看', id: '6-2-2-0', permissons: ['gym.finance.index'], },
              { label: '批量作废', id: '6-2-2-1', permissons: ['gym.finance.withdraw.check'], },
              { label: '财务核对', id: '6-2-2-2', permissons: ['gym.finance.withdraw.finance_check'], }
            ]
          },
          {
            label: '团课订单', id: '6-2-3', path: 'nil', permissons: ['gym.finance.index'],
            children: [
              { label: '页面查看', id: '6-2-3-0', permissons: ['gym.finance.index'], },
              { label: '批量作废', id: '6-2-3-1', permissons: ['gym.finance.withdraw.check'], },
              { label: '财务核对', id: '6-2-3-2', permissons: ['gym.finance.withdraw.finance_check'], }
            ]
          },
          {
            label: '购物订单', id: '6-2-4', path: 'nil', permissons: ['gym.finance.index'],
            children: [
              { label: '页面查看', id: '6-2-4-0', permissons: ['gym.finance.index'], },
              { label: '批量作废', id: '6-2-4-1', permissons: ['gym.finance.withdraw.check'], },
              { label: '财务核对', id: '6-2-4-2', permissons: ['gym.finance.withdraw.finance_check'], }
            ]
          },
          {
            label: '租柜订单', id: '6-2-5', path: 'nil', permissons: ['gym.finance.index'],
            children: [
              { label: '页面查看', id: '6-2-5-0', permissons: ['gym.finance.index'], },
              { label: '批量作废', id: '6-2-5-1', permissons: ['gym.finance.withdraw.check'], },
              { label: '财务核对', id: '6-2-5-2', permissons: ['gym.finance.withdraw.finance_check'], }
            ]
          }
        ]
      },
      {
        label: '收入提现',
        id: '6-3',
        path: 'incomePresentation',
        permissons: ['incomePresentation'],
        children: [
          { label: '页面查看', id: '6-3-0', permissons: ['Finance'], },
          { label: '申请提现', id: '6-3-1', permissons: ['gym.finance.withdraw.store'] }
        ]
      },
      {
        label: '员工业绩',
        id: '6-4',
        path: 'employeeAchievement',
        permissons: ['employeeAchievement'],
        children: [
          {
            label: '销售业绩', path: 'nil', id: '6-4-1', permissons: ['gym.statistics.salerooms.all_type_total_sale', 'gym.statistics.salerooms.run_char', 'gym.statistics.salerooms.orders', 'gym.statistics.salerooms.index'],
            children: [
              { label: '页面查看', id: '6-4-1-0', permissons: ['gym.statistics.salerooms.all_type_total_sale', 'gym.statistics.salerooms.run_char', 'gym.statistics.salerooms.orders', 'gym.statistics.salerooms.index'], },
              { label: '查看概览', id: '6-4-1-1', permissons: ['gym.statistics.salerooms.index'], },
              { label: '查看明细', id: '6-4-1-2', permissons: ['gym.statistics.salerooms.orders', 'gym.statistics.salerooms.all_type_total_sale'], }
            ]
          },
          {
            label: '私教消课', path: 'nil', id: '6-4-2', permissons: ['gym.statistics.salerooms.course_consume.columnar', 'gym.statistics.salerooms.course_consume.pie_chart', 'gym.statistics.salerooms.course_consume.index'],
            children: [
              { label: '页面查看', id: '6-4-2-0', permissons: ['gym.statistics.salerooms.course_consume.columnar', 'gym.statistics.salerooms.course_consume.pie_chart', 'gym.statistics.salerooms.course_consume.index'], },
              { label: '查看概览', id: '6-4-2-1', permissons: ['gym.statistics.salerooms.course_consume.index'], },
            ]
          }
        ]
      }
    ]
  },

  // 操作日志
  {
    label: '操作日志',
    id: '7',
    path: '/operation',
    children: [
      {
        label: '客户记录',
        id: '7-1',
        path: 'customerrecord',
        permissons: [], // 后台权限
        children: [
          { label: '会员修改', id: '7-1-1', permissons: ['gym.employees.index', 'gym.operation_logs.index', 'gym.operation_logs.children', 'gym.operation_logs.show'],
            children: [
              { label: '导出', id: '7-1-1-1', permissons: [] },
            ]
          },
          { label: '潜客修改', id: '7-1-2', permissons: ['gym.employees.index', 'gym.operation_logs.index'],
            children: [
              { label: '导出', id: '7-1-2-1', permissons: [] },
            ]
          },
        ]
      },
      {
        label: '会员卡记录',
        id: '7-2',
        path: 'cardrecord',
        permissons: ['gym.operation_logs.index', 'gym.employees.index'], // 后台权限
        children: [
          { label: '页面查看', id: '7-2-0', permissons: ['gym.operation_logs.index', 'gym.employees.index'] },
          { label: '导出', id: '7-2-1', permissons: [] },
        ]
      },
      {
        label: '私教记录',
        id: '7-3',
        path: 'privaterecord',
        permissons: [], // 后台权限
        children: [
          {
            label: '课程修改', id: '7-3-1', permissons: ['gym.employees.index', 'gym.operation_logs.index'],
            children: [
              { label: '导出', id: '7-3-1-1', permissons: [] },
            ]
          },
          {
            label: '购买修改', id: '7-3-2', permissons: ['gym.operation_logs.children', 'gym.employees.index'],
            children: [
              { label: '导出', id: '7-3-2-1', permissons: [] },
            ]
          },
          {
            label: '预约修改', id: '7-3-3', permissons: ['gym.operation_logs.children', 'gym.employees.index'],
            children: [
              { label: '导出', id: '7-3-3-1', permissons: [] },
            ]
          },
        ]
      },
      {
        label: '公开课记录',
        id: '7-4',
        path: 'publicrecord',
        permissons: [], // 后台权限
        children: [
          { label: '页面查看', id: '7-4-0', permissons: ['gym.operation_logs.index', 'gym.employees.index'] },
          { label: '导出', id: '7-4-1', permissons: [] },
        ]
      },
      {
        label: '团课记录',
        id: '7-5',
        path: 'leaguerecord',
        permissons: [], // 后台权限
        children: [
          {
            label: '课程修改', id: '7-5-1', permissons: ['gym.operation_logs.children', 'gym.employees.index'],
            children: [
              { label: '导出', id: '7-5-1-1', permissons: [] },
            ]
          },
          {
            label: '预约修改', id: '7-5-2', permissons: ['gym.operation_logs.children', 'gym.employees.index'],
            children: [
              { label: '导出', id: '7-5-2-1', permissons: [] },
            ]
          },
        ]
      }
    ]
  },
  // 营销服务
  {
    label: '营销服务',
    id: '8',
    path: 'marketing',
    children: [
      {
        label: '营销服务',
        id: '8-1',
        path: 'marketing',
        permissons: [], // 后台权限
        children: [
          { label: '页面查看', id: '8-1-0', permissons: [] },
        ]
      }
    ]
  },
  {
    label: '手机端权限',
    id: 'apppower',
    path: ''
  },
  // APP员工通道
  {
    label: '基础权限',
    id: '',
    path: 'staffentrance',
    children: [{
      label: '业绩统计',
      id: '业绩统计',
      path: 'apppower',
      permissons: ['employee.my_sales.index', 'employee.my_sales.orders', 'employee.my_sales.orders.show'], // 后台权限
    }, {
      label: '客户管理',
      id: '客户管理',
      path: 'apppower',
      permissons: ['employee.customers.update', 'employee.customers.index', 'employee.customers.remarks.index', 'employee.customers.store', 'employee.customers.remarks.store', 'employee.customers.show'], // 后台权限
    }]
  },
  {
    label: '教练权限',
    id: '',
    path: 'staffentrance',
    children: [{
      label: '私教管理（需设置为教练）',
      id: '私教管理',
      path: 'apppower',
      permissons: ['employee.courses.index', 'employee.courses.can_confirm', 'employee.courses.confirm', 'employee.courses.statistics', 'employee.courses.show'], // 后台权限
    },
    {
      label: '团课管理（需设置为教练）',
      id: '团课管理',
      path: 'apppower',
      permissons: [], // 后台权限
    }
    ]
  },
  {
    label: '店长权限',
    id: '',
    path: 'staffentrance',
    children: [{
      label: '运营实况',
      id: '运营实况',
      path: 'apppower',
      permissons: [' employee.today_sales.cusnum', 'employee.today_sales.total_fee', 'employee.today_sales.index', 'employee.today_sales.show'], // 后台权限
    }, {
      label: '数据报表',
      id: '数据报表',
      path: 'apppower',
      permissons: ['employee.statements.goods_sale', 'employee.statements.employee_sale', 'employee.statements.index'], // 后台权限
    }]
  }
]
export default roletree
