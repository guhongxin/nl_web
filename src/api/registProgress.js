import request from '@/utils/request'
export function registerAudit() {
  return request({
    url: '/v1/gym/audits/register_audit',
    method: 'get'
  })
}
export function modifyRegister1(param) {
  return request({
    url: '/v1/gym/audits/update_register_audit',
    method: 'POST',
    data: param
  })
}
export function checkAccount(str) {
  return request({
    url: '/v1/gym/check_account/' + str,
    method: 'POST'
  })
}
export function sendPhoneCodeCheck(param) {
  return request({
    url: '/v1/gym/send_phone_code/check',
    method: 'POST',
    data: param
  })
}
export function checkVenueName(param) {
  return request({
    url: '/v1/gym/check_name',
    method: 'POST',
    data: param
  })
}
