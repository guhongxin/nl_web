// 多店卡模板
import request from '@/utils/request'

// 多店卡模板列表
export function msCardTypeList(param) {
  return request({
    url: '/api/v2/gym/hq/card-templates/unities',
    method: 'GET',
    params: param
  })
}

// 删除多店卡模板列表
export function deletemsCardType(id) {
  return request({
    url: `/api/v2/gym/hq/card-templates/unities/${id}`,
    method: 'DELETE'
  })
}

// 新增多店卡模板列表
export function addmsCardType(data) {
  return request({
    url: '/api/v2/gym/hq/card-templates/unities',
    method: 'POST',
    data: data
  })
}

// 编辑多店卡模板列表
export function editmsCardType(data) {
  return request({
    url: `/api/v2/gym/hq/card-templates/unities/${data.id}`,
    method: 'PUT',
    data: data
  })
}

// 编辑多店卡模板批量上线
export function msCardTypeBtUp(data) {
  return request({
    url: `/api/v2/gym/hq/card-templates/unities/batch-up`,
    method: 'POST',
    data: data
  })
}

// 编辑多店卡模板批量上线
export function msCardTypeBtDown(data) {
  return request({
    url: `/api/v2/gym/hq/card-templates/unities/batch-down`,
    method: 'POST',
    data: data
  })
}

// 多店卡模板单个上线
export function msCardTypesingleUp(data) {
  return request({
    url: `/api/v2/gym/hq/card-templates/unities/${data.id}/up`,
    method: 'PUT',
    data: data
  })
}

// 多店卡模板单个下线
export function msCardTypesingleDown(data) {
  return request({
    url: `/api/v2/gym/hq/card-templates/unities/${data.id}/down`,
    method: 'PUT',
    data: data
  })
}
