import { loginByUsername, forgotByPassword, getCode, logout, getUserInfo, editByPassword, register, sendCode } from '@/api/login'
import { getSession, setToken, removeToken, setSession, removeSession } from '@/utils/auth'

const user = {
  state: {
    user: '',
    status: '',
    code: '',
    token: getSession('Admin-Token'),
    gym_name: '',
    gym_logo: '',
    gym_id: '',
    avatar: '',
    introduction: '',
    roles: [],
    setting: {
      articlePlatform: []
    },
    userName: '',
    userPassword: '',
  },

  mutations: {
    SET_CODE: (state, code) => {
      state.code = code
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction
    },
    SET_SETTING: (state, setting) => {
      state.setting = setting
    },
    SET_STATUS: (state, status) => {
      state.status = status
    },
    SET_GYM_NAME: (state, name) => {
      state.gym_name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_LOGO: (state, logo) => {
      state.gym_logo = logo
    },
    SET_USERNAME: (state, username) => {
      state.username = username
    },
    SET_GYM_ID: (state, gymid) => {
      state.gym_id = gymid
    },
    SET_USER_NAME: (state, name) => {
      state.userName = name
    },
    SET_USER_PASSWORD: (state, password) => {
      state.userPassword = password
    }
  },

  actions: {
    Register({ commit }, regInfo) {
      return new Promise((resolve, reject) => {
        register(regInfo).then(res => {
          resolve(res.data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 用户名登录
    LoginByUsername({ commit }, userInfo) {
      const username = userInfo.username.trim()
      const gym_id = userInfo.gym_id ? userInfo.gym_id : undefined
      commit('SET_USER_NAME', username)
      commit('SET_USER_PASSWORD', userInfo.password)
      return new Promise((resolve, reject) => {
        loginByUsername(username, userInfo.password, gym_id).then(response => {
          const data = response.data
          commit('SET_TOKEN', data.token)
          if (data.account.gym) {
            setSession('SET_GYM_NAME', data.account.gym.name)
            setSession('SET_MSTORE_LOGO', data.account.gym.logo) // 设置多店log
            setSession('SET_LOGO', data.account.gym.logo)
            // 健身房验证状态
            setSession('IS_AUTH_PASS', data.account.gym.is_auth_pass)
            setSession('SET_LEGAL_PERSON_PHONE', data.account.gym.legal_person_phone)
            setSession('gymIsPass', data.account.gym.is_auth_pass)
          }
          if (data.account.employee) {
            setSession('EMPLOYEE_TYPE', data.account.employee.type)
          }
          setSession('SET_GYM_ID', data.account.gym_id)
          setSession('SET_USERNAME', data.account.name)
          setToken(response.data.token)
          resolve(data)
        }).catch(error => {
          console.log('kkk', error)
          reject(error)
        })
      })
    },
    // 忘记密码
    ForgotByPassword({ commit }, userInfo) {
      const username = userInfo.username.trim()
      const phone = userInfo.phone.trim()
      const code = userInfo.code.trim()
      const password = userInfo.password.trim()
      const repassword = userInfo.repassword.trim()
      return new Promise((resolve, reject) => {
        forgotByPassword(username, phone, code, password, repassword).then(response => {
          resolve({ success: true })
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 发送手机验证码
    GetCode({ commit }, phone) {
      return new Promise((resolve, reject) => {
        getCode(phone).then(response => {
          const data = response.data
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 修改密码
    EditByPassword({ commit }, userInfo) {
      const oldpassword = userInfo.oldpassword.trim()
      const newpassword = userInfo.newpassword.trim()
      const repassword = userInfo.repassword.trim()
      return new Promise((resolve, reject) => {
        editByPassword(oldpassword, newpassword, repassword).then(response => {
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取用户信息
    GetUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getUserInfo(state.token).then(response => {
          if (!response.data) { // 由于mockjs 不支持自定义状态码只能这样hack
            reject('error')
          }
          setSession('IS_ROOT', response.is_root)
          // setSession('EMPLOYEE_TYPE', response.employee.type)
          commit('SET_ROLES', response.data.roles)
          if (response.gym) {
            commit('SET_GYM_NAME', response.gym.name)
          }
          commit('SET_AVATAR', response.avatar)
          commit('SET_INTRODUCTION', response.introduction)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 没有用户信息，但是超级管理员
    noUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        setSession('IS_ROOT', true) // 权限
        commit('SET_ROLES', 'admin') // 角色
        resolve()
      })
    },
    // 第三方验证登录
    // LoginByThirdparty({ commit, state }, code) {
    //   return new Promise((resolve, reject) => {
    //     commit('SET_CODE', code)
    //     loginByThirdparty(state.status, state.email, state.code).then(response => {
    //       commit('SET_TOKEN', response.data.token)
    //       setToken(response.data.token)
    //       resolve()
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeSession('IS_CHECK_PASS')
          removeSession('IS_ROOT')
          removeSession('SET_GYM_NAME')
          removeSession('SET_LOGO')
          removeSession('SET_MSTORE_LOGO')
          removeSession('SET_USERNAME')
          removeSession('role')
          removeToken()
          sessionStorage.clear()
          localStorage.clear()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeSession('IS_CHECK_PASS')
        removeSession('IS_ROOT')
        removeSession('SET_GYM_NAME')
        removeSession('SET_LOGO')
        removeSession('SET_MSTORE_LOGO')
        removeSession('SET_USERNAME')
        removeSession('role')
        removeToken()
        sessionStorage.clear()
        localStorage.clear()
        resolve()
      })
    },

    // 动态修改权限
    ChangeRoles({ commit }, role) {
      return new Promise(resolve => {
        commit('SET_TOKEN', role)
        setToken(role)
        getUserInfo(role).then(response => {
          const data = response.data
          commit('SET_ROLES', data.roles)
          commit('SET_GYM_NAME', data.name)
          commit('SET_AVATAR', data.avatar)
          commit('SET_INTRODUCTION', data.introduction)
          resolve()
        })
      })
    },
    SendCode({ commit }, phone) {
      return new Promise((resolve, reject) => {
        sendCode(phone).then(response => {
          const data = response.data
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export default user
