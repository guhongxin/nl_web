import request from '@/utils/request'

// 场馆信息修改申请
export function venueMessage(userInfo) {
  const data = userInfo
  return request({
    url: '/v1/gym/audits/gym_update',
    method: 'POST',
    data
  })
}

// 场馆信息展示（场馆详情）
export function getVenueMessage() {
  return request({
    url: '/v1/gym',
    method: 'get'
  })
}
// 场馆认证申请
export function venueApply(userInfo) {
  const data = {
    id_card_front: userInfo.id_card_front,
    id_card_back: userInfo.id_card_back,
    license: userInfo.license,
    bank_card_account_name: userInfo.accountName, // 银行卡账号
    bank_name: userInfo.openBank, // 开户行
    bank_card_no: userInfo.backAccount, // 银行卡号
    legal_person_name: userInfo.legal_person_name, // 法人姓名
    legal_person_phone: userInfo.legal_person_phone // 法人手机号
  }
  return request({
    url: '/v1/gym/audits/gym_auth',
    method: 'post',
    data
  })
}

// 手动审核
export function finishApply(id) {
  return request({
    url: '/v1/admin/audits/pass/' + id,
    method: 'post'
  })
}
