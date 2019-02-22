import { getFeatures, getFacilities, getPosts } from '@/api/fitnessinfo'
const user = {
  state: {
  },
  mutations: {
  },
  actions: {
    GetFeatures({ commit }) {
      return new Promise((resolve, reject) => {
        getFeatures().then(res => {
          resolve(res.data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    GetFacilities({ commit }) {
      return new Promise((resolve, reject) => {
        getFacilities().then(res => {
          resolve(res.data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    GetPosts({ commit }) {
      return new Promise((resolve, reject) => {
        getPosts().then(res => {
          resolve(res.data)
        }).catch(err => {
          reject(err)
        })
      })
    },
  }
}

export default user

