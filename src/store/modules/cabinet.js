import { addCabinetArea, getAllCabinet, cabinetStates, useCabinet, noUseCabinet, renewCabinet, backCabinet, getMessageByPhone, rentCabinetMessage, bindCabinet, bindCabinetSure } from '@/api/cabinet'

// 添加柜子区域
const cabinet = {
  state: {
  },
  mutations: {
  },
  actions: {
    AddCabinetArea({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        addCabinetArea(userInfo).then(res => {
          resolve(res.data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    GetAllCabinet({ commit }) {
      return new Promise((resolve, reject) => {
        getAllCabinet().then(res => {
          resolve(res.data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    CabinetStates({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        cabinetStates(userInfo).then(res => {
          resolve(res.data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    UseCabinet({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        useCabinet(userInfo).then(res => {
          resolve(res.data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    NoUseCabinet({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        noUseCabinet(userInfo).then(res => {
          resolve(res.data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    RenewCabinet({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        renewCabinet(userInfo).then(res => {
          resolve(res.data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    BackCabinet({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        backCabinet(userInfo).then(res => {
          resolve(res.data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    GetMessageByPhone({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        getMessageByPhone(userInfo).then(res => {
          resolve(res.data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    RentCabinetMessage({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        rentCabinetMessage(userInfo).then(res => {
          resolve(res.data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    BindCabinet({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        bindCabinet(userInfo).then(res => {
          resolve(res.data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    BindCabinetSure({ commit }, id, grid, userInfo) {
      return new Promise((resolve, reject) => {
        bindCabinetSure(id, grid, userInfo).then(res => {
          resolve(res.data)
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
}

export default cabinet
