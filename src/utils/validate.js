/**
 * Created by jiachenpan on 16/11/18.
 */
import { Message } from 'element-ui'

/* 合法uri*/
export function validateURL(textval) {
  const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return urlregex.test(textval)
}

/* 小写字母*/
export function validateLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/* 大写字母*/
export function validateUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/* 大小写字母*/
export function validatAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

/**
 * validate email
 * @param email
 * @returns {boolean}
 */
export function validateEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(email)
}
/**
 * validate 身份证
 * @param 身份证
 * @returns {boolean}
 */
export function validateSfcode(sfcode) {
  const re = /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/
  return re.test(sfcode)
}

/**
 * validate phone
 * @param phone
 * @returns {boolean}
 */
export function testphone(phone) {
  if (!phone) {
    Message({
      message: '手机号码不能为空',
      type: 'warning'
    })
    return false
  }
  if (!/^1[0-9]{10}$/.test(phone)) {
    Message({
      message: '手机号码输入有误',
      type: 'warning'
    })
    return false
  }
  return true
}
/**
 * validate Number
 * @param mun
 * @returns {Number}
 */
export function testNumber(mun) {
  const re = /^[1-9]\d*$/
  return re.test(mun)
}

/**
 * validate Float2
 * @param mun
 * @returns {Float}
 */
export function testFloat2(mun) {
  const re = /(^[1-9](\d+)?(\.\d{1,2})?$)|(^(0){1}$)|(^\d\.\d{1,2}?$)/
  return re.test(mun)
}
export function testNumberInt(mun) {
  const re = /^([0-9]\d*|[0]{1,9})$/
  return re.test(mun)
}
/**
 * validate Integer
 * @param mun
 * @returns {Integer}
 */
export function testInteger(mun) {
  const re = /^-?[1-9]\d*$/
  return re.test(mun)
}
