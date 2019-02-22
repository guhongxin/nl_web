import { testInput } from '@/api/coach'

const coach = {
  state: {
  },
  mutations: {
  },
  actions: {
    TestInput({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        testInput(userInfo).then(res => {
          resolve(res.data)
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
}

export default coach
