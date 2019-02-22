import { editCustomer, courseBuy } from '@/api/course'

const course = {
  state: {
  },
  mutations: {
  },
  actions: {
    EditCustomer({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        editCustomer(userInfo).then(res => {
          resolve(res.data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    CourseBuy({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        courseBuy(userInfo).then(res => {
          resolve(res.data)
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
}

export default course
