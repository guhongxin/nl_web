import request from '@/utils/request'

// 数据统计
export function statisticsData(userInfo) {
  return request({
    url: '/v1/gym/statistics',
    method: 'GET',
    params: userInfo
  })
}
// 日收入统计
export function dayIncomeData(date) {
  return request({
    url: '/api/v2/gym/statistics/stores/day/income/' + date,
    method: 'get'
  })
}
// 周收入统计
export function weekIncomeData(year, week) {
  return request({
    url: '/api/v2/gym/statistics/stores/week_of_year/income/' + year + '/' + week,
    method: 'get'
  })
}
// 月收入统计
export function monthIncomeData(year, month) {
  return request({
    url: '/api/v2/gym/statistics/stores/month/income/' + year + '/' + month,
    method: 'get'
  })
}
// 年收入统计
export function yearIncomeData(year) {
  return request({
    url: '/api/v2/gym/statistics/stores/year/income/' + year,
    method: 'get'
  })
}
// 查询员工业绩
export function getStatisticsList(query) {
  return request({
    url: '/v1/gym/statistics/employee_sale',
    method: 'get',
    params: query
  })
}

// 购物业绩
export function getShopList(query) {
  return request({
    url: '/v1/gym/statistics/goods_sale',
    method: 'get',
    params: query
  })
}

// 财务记录模块--财务订单查询
export function getFinanceList(query) {
  return request({
    url: '/v1/gym/finance',
    method: 'get',
    params: query
  })
}

// 提现记录
export function getWithdrawList(id, query) {
  return request({
    url: '/v1/gym/finance/withdraw/' + id,
    method: 'get',
    params: query
  })
}

// 当前健身房收入金额汇总
export function financeAccount(id) {
  return request({
    url: '/v1/gym/finance/' + id + '/bizAccount',
    method: 'get'
  })
}

// 申请提现
export function getFinanceWithdraw(query) {
  return request({
    url: '/v1/gym/finance/withdraw',
    method: 'post',
    data: query
  })
}

// 批量作废
export function groupFinanceCansle(query) {
  return request({
    url: '/v1/gym/finance/bat',
    method: 'post',
    data: query
  })
}

// 订单信息
export function financeMessage(id) {
  return request({
    url: '/v1/gym/finance/' + id + '/check',
    method: 'get'
  })
}

// 财务核对
export function financeChecks(id, query) {
  return request({
    url: '/v1/gym/finance/' + id + '/check',
    method: 'post',
    data: query
  })
}

// 会员卡相关订单统计
export function cardStatistics() {
  return request({
    url: '/v1/gym/finance/statistics',
    method: 'post'
  })
}

// 员工业绩--不同业务的总销售额
export function totalTypeSale(query) {
  return request({
    url: '/api/v2/gym/statistics/salerooms/all_type_total_sale',
    method: 'get',
    params: query
  })
}

// 员工业绩--总业绩走势
export function saleRunChar(query) {
  return request({
    url: '/api/v2/gym/statistics/salerooms/run_char',
    method: 'get',
    params: query
  })
}

// 员工业绩--订单列表
export function orderLists(query) {
  return request({
    url: '/api/v2/gym/statistics/salerooms/orders',
    method: 'get',
    params: query
  })
}

// 员工业绩--销售业绩列表
export function salesPerformance(query) {
  return request({
    url: '/api/v2/gym/statistics/salerooms',
    method: 'get',
    params: query
  })
}

// 员工业绩--私教消课--饼状图
export function privateCanslePie(query) {
  return request({
    url: '/api/v2/gym/statistics/salerooms/course_consume/pie_chart',
    method: 'get',
    params: query
  })
}

// 员工业绩--私教消课--柱状图
export function privateCansleBar(query) {
  return request({
    url: '/api/v2/gym/statistics/salerooms/course_consume/columnar',
    method: 'get',
    params: query
  })
}

// 员工业绩--私教消课--订单列表
export function privateCansleTable(query) {
  return request({
    url: '/api/v2/gym/statistics/salerooms/course_consume',
    method: 'get',
    params: query
  })
}
