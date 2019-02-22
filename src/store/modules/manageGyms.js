// 场馆列表
import { msgymsList, addMsgyms } from '@/api/mstoregym'
const manageGyms = {
  state: {
    gymsList: [],
    activeDateDesktop: '',
    saasVersion: false
  },
  mutations: {
    GET_MANAGEGYMS: (state, gymsList) => {
      state.gymsList = gymsList
    },
    SET_DATEDESKTOP: (state, DateDesktop) => {
      state.activeDateDesktop = DateDesktop
    },
    SET_SAASVERSION: (state, versionState) => {
      state.saasVersion = versionState
    },
  },
  actions: {
    get_manage_gyms({ commit }) {
      msgymsList().then(res => {
        let data = res.data
        commit('GET_MANAGEGYMS', data)
      })
    },
    add_manage_gyms({ commit }, data) {
      return new Promise((resolve, reject) => {
        addMsgyms(data).then(res => {
          resolve({ success: true, res: res.data })
        }).catch((err) => {
          reject(err)
        })
      })
    },
    set_datedesktop({ commit }) {
      let _time = new Date().getTime() + ''
      commit('SET_DATEDESKTOP', _time)
    }
  }
}

export default manageGyms
