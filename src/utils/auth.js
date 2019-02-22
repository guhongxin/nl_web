// import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'

export function getToken() {
  return sessionStorage.getItem(TokenKey)
}

// export function setToken(token) {
//   localStorage.setItem(TokenKey, token)
//   return sessionStorage.setItem(TokenKey, token)
// }

export function setToken(token) {
  return sessionStorage.setItem(TokenKey, token)
}

export function removeToken() {
  return sessionStorage.removeItem(TokenKey)
}

export function setSession(key, value) {
  return sessionStorage.setItem(key, value)
}

export function getSession(key) {
  return sessionStorage.getItem(key)
}

export function removeSession(key) {
  return sessionStorage.removeItem(key)
}
export function sessionClear() {
  return sessionStorage.clear()
}
