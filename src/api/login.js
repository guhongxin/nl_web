import request from '@/utils/request'
import SparkMD5 from 'spark-md5'
import { setSession, setToken } from '@/utils/auth'

export function loginByUsername(username, password, gym_id) {
  const data = {
    account_id: username,
    password,
    gym_id
  }
  setSession('gymAcount', JSON.stringify(username).replace(/\"/g, ''))
  return request({
    url: '/v1/gym/login',
    method: 'post',
    data
  })
}
export function logout() {
  return request({ url: '/v1/gym/logout', method: 'post' })
}
// 忘记密码
export function forgotByPassword(username, phone, code, password, repassword) {
  const data = {
    account_id: username,
    phone: phone,
    code: code,
    password: password,
    password_confirmation: repassword
  }
  return request({
    url: '/v1/gym/forget_password',
    method: 'post',
    data
  })
}
// 忘记密码，发送手机验证码
export function getCode(phone) {
  let curtime = new Date().getTime()
  let curStr = randomWord(false, 16)
  let data = {
    phone,
    timestamp: curtime,
    nonce: curStr,
    signature: SparkMD5.hash(curtime + phone + curStr.slice(5, 13))
  }
  return request({
    url: '/v1/gym/send_phone_code/forget_password',
    method: 'post',
    data
  })
}
// 修改密码
export function editByPassword(oldpassword, newpassword, repassword) {
  const data = {
    password: oldpassword,
    new_password: newpassword,
    new_password_confirmation: repassword
  }
  return request({
    url: '/v1/gym/change_password',
    method: 'put',
    data
  })
}
export function getUserInfo(token) {
  setToken(token)
  let data = {
    token
  }
  /* return request({ // 切记此注释有妙用不可删除！
    url: '1m/user',
    method: 'get',
    data
  }) */
  return new Promise((resolve, reject) => {
    request({
      url: '/v1/gym/user',
      method: 'get',
      data
    }).then((res) => {
      let iteii = Object.assign({ data: { roles: ['admin'] }}, res.data)
      if (res.data.gym) {
        setSession('gymIsPass', JSON.stringify(res.data.gym.is_auth_pass))
        setSession('SET_GYM_NAME', JSON.stringify(res.data.gym.name).replace(/\"/g, ''))
      }
      setSession('SET_GYM_ID', JSON.stringify(res.data.gym_id))
      // setSession('gymAcount', JSON.stringify(res.data.account_id).replace(/\"/g, ''))
      if (!res.data.is_root) {
        if (!res.data.employee) {
          console.warn('login err log: is_root param is FALSE, no "res.data.employee" prototype of null !')
        }
        iteii = Object.assign({ data: { roles: ['admin', { role: res.data.employee.role.menus }] }}, res.data)
        setSession('role', JSON.stringify(res.data.employee.role.menus))
      }
      resolve(iteii)
    }).catch(err => {
      reject(err)
    })
  })
}
export function getGymInfor(token) {
  setToken(token)
  let data = {
    token
  }
  return request({
    url: '/v1/gym/gym_info',
    method: 'get',
    data
  })
}
export function register(data) {
  return request({ url: '/v1/gym/register', method: 'post', data })
}

export function sendCode(phone) {
  let curtime = new Date().getTime()
  let curStr = randomWord(false, 16)
  let data = {
    phone,
    timestamp: curtime,
    nonce: curStr,
    signature: SparkMD5.hash(curtime + phone + curStr.slice(5, 13))
  }
  return request({
    url: '/v1/gym/send_phone_code/register',
    method: 'post',
    data
  })
}

function randomWord(randomFlag, min, max) {
  let str = ''
  let range = min
  let arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']

  // 随机产生
  if (randomFlag) {
    range = Math.round(Math.random() * (max - min)) + min
  }
  for (let i = 0; i < range; i++) {
    let pos = Math.round(Math.random() * (arr.length - 1))
    str += arr[pos]
  }
  return str
}
// 超级桌面添加
export function iconOrder(userInfo) {
  return request({
    url: '/v1/gym/super_desktop',
    method: 'post',
    params: userInfo
  })
}
// 超级桌面删除
export function iconDelete(id) {
  return request({
    url: '/v1/gym/super_desktop/' + id + '?by=id',
    method: 'delete'
  })
}
// 超级桌面展示
export function iconShow(id) {
  return request({
    url: '/v1/gym/super_desktop',
    method: 'get'
  })
}
// 根据手机号码查找场馆
export function getVenueList(phone) {
  return request({
    url: '/v1/gym/gyms/' + phone,
    method: 'get'
  })
}
