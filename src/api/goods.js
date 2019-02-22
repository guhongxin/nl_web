import request from '@/utils/request'

// 查询商品列表
export function getGoodsList(query) {
  return request({
    url: '/v1/gym/goods',
    method: 'get',
    params: query
  })
}
export function goodsList(query) {
  return request({
    url: '/v1/gym/goods_stocks',
    method: 'get',
    params: query
  })
}
// 查询商品收银记录列表
export function goodsRecordList(query) {
  return request({
    url: '/v1/gym/goods_orders',
    method: 'get',
    params: query
  })
}
// 根据ID获取商品信息
export function searchGoodsInfoById(id) {
  return request({
    url: '/v1/gym/goods/' + id,
    method: 'get'
  })
}
// 根据条形码获取商品信息
export function searchGoodsInfoByBarcode(barcode) {
  return request({
    url: '/v1/gym/goods/barcode/' + barcode,
    method: 'get'
  })
}
// 根据条形码获取商品信息
export function addGoods(query) {
  return request({
    url: '/v1/gym/goods',
    method: 'post',
    data: query
  })
}
// 商品入库管理 - 添加
export function addItemGoods(query) {
  return request({
    url: '/v1/gym/goods_stocks',
    method: 'post',
    data: query
  })
}
// 商品入库管理 - 删除
export function deleteGoods(id) {
  return request({
    url: '/v1/gym/goods/' + id,
    method: 'delete'
  })
}
// 商品入库管理 - 编辑
export function editGoods(query) {
  return request({
    url: '/v1/gym/goods/' + query.id,
    method: 'put',
    data: query
  })
}
// 商品出库
export function outGoods(query) {
  return request({
    url: '/v1/gym/goods_orders',
    method: 'post',
    data: query
  })
}
// 商品核对
export function checkGoods(id, query) {
  return request({
    url: '/v1/gym/goods/' + id + '/check_stock',
    method: 'post',
    data: query
  })
}
// 商品核对详情
export function checkDetails(id) {
  return request({
    url: '/v1/gym/goods/' + id + '/check_stock_logs',
    method: 'get'
  })
}
