import request from '@/utils/request'
/* 卡成员 */
// 卡成员列表
export function cardMemberList(id, param) {
  return request({
    url: `/api/v2/gym/vip-cards/${id}/members`,
    method: 'GET',
    params: param
  })
}
// 新增卡成员
export function addcardMember(param) {
  return request({
    url: `/api/v2/gym/card-members`,
    method: 'POST',
    data: param
  })
}
// 删除卡成员
export function deletecardMember(id) {
  return request({
    url: `/api/v2/gym/card-members/${id}`,
    method: 'DELETE'
  })
}
// 修改卡成员
export function modifycardMember(id, param) {
  return request({
    url: `/api/v2/gym/card-members/${id}`,
    method: 'PUT',
    data: param
  })
}
