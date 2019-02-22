import axios from 'axios'
import {
  Message,
  Notification,
  MessageBox
} from 'element-ui'
import store from '@/store'
import { getToken, sessionClear } from '@/utils/auth'
import { showMask } from '@/utils/comm'

// create an axios instance
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 10000 // request timeout
})
const clearLogin = function(error) {
  message(error.response.data.message + ', 3秒后跳转至登陆页面')
  sessionClear()
  setTimeout(() => {
    window.location.reload()
  }, 3000)
}
// request interceptor
service.interceptors.request.use(config => {
  // Do something before request is sent
  if (!navigator.onLine) {
    Message({
      message: '当前网络差',
      type: 'error',
      customClass: 'my-message',
      duration: 3 * 1000
    })
  }
  config.headers['SaaS-Version'] = '2.5.0'
  if (store.getters.token) {
    config.headers['Authorization'] = 'Bearer ' + getToken() // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
    // config.headers['Authorization'] = 'Bearer gym5ab242df65b58' // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
  }
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone interceptor
service.interceptors.response.use(
  response => {
    // console.log(response.data)
    return response
  },
  /**
  * 下面的注释为通过response自定义code来标示请求状态，当code返回如下情况为权限有问题，登出并返回到登录页
  * 如通过xmlhttprequest 状态码标识 逻辑可写在下面error中
  */
  //  const res = response.data;
  //     if (res.code !== 20000) {
  //       Message({
  //         message: res.message,
  //         type: 'error',
  //         duration: 5 * 1000
  //       });
  //       // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
  //       if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
  //         MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
  //           confirmButtonText: '重新登录',
  //           cancelButtonText: '取消',
  //           type: 'warning'
  //         }).then(() => {
  //           store.dispatch('FedLogOut').then(() => {
  //             location.reload();// 为了重新实例化vue-router对象 避免bug
  //           });
  //         })
  //       }
  //       return Promise.reject('error');
  //     } else {
  //       return response.data;
  //     }
  error => {
    if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
      message('请求超时')
      return Promise.reject(error)
    }
    if (error.response.status === 1000) {
      message('系统繁忙')
      return Promise.reject(error)
    }
    let statusCode = error.response.data.status_code
    let errorCode = error.response.data.error_code
    if (statusCode === 401) {
      store.dispatch('FedLogOut').then(() => {
        location.reload() // 为了重新实例化vue-router对象 避免bug
      })
      return Promise.reject(error)
    }
    if (statusCode === 422) {
      if (errorCode === 20000) {
        for (let key in error.response.data.errors) {
          notify(error.response.data.errors[key][0])
        }
      } else {
        message(error.response.data.message)
      }
    }
    if (statusCode === 302) {
      if (errorCode === 52000) {
        if (!store.state.manageGyms.saasVersion) {
          store.commit('SET_SAASVERSION', true)
          MessageBox.confirm('版本已经更新，需要刷新页面，如有未保存信息，请先中断操作，刷新后再重新执行操作', '提示', {
            confirmButtonText: '立即刷新',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            window.location.reload()
          }).catch(() => {
            Message({
              dangerouslyUseHTMLString: true,
              message: '版本已经更新，需要刷新页面<a class="shuaxin" href="javascript:window.location.reload();">刷新</a>',
              type: 'info',
              duration: 0
            })
          })
        }
      }
      return Promise.reject(error)
    }
    if (statusCode === 403) {
      if (errorCode === 30003) {
        message(error.response.data.message)
      } else if (errorCode === 30002) {
        showMask()
        clearLogin(error) // 健身房禁用，或者健身房被删除
      } else {
        /* MessageBox.confirm('权限已被更改，请重新登陆', '提示', {
          confirmButtonText: '重新登录',
          type: 'warning'
        }).then(() => {
          store.dispatch('FedLogOut').then(() => {
            location.reload()
          })
        }) */
        message('无权限！')
      }
    }
    if (statusCode === 404) {
      message('数据被删除或不存在！')
    }
    if (statusCode === 500) {
      if (errorCode === 50000) {
        showMask()
        clearLogin(error)
      }
    }
    return Promise.reject(error)
  })
let message = function(info) {
  Message({
    message: info,
    type: 'error',
    duration: 3.5 * 1000
  })
}
let notify = function(info) {
  Notification({
    title: '错误',
    type: 'error',
    message: info,
    duration: 3 * 1000
  })
}
export default service
