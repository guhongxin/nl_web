import { venueMessage } from '@/api/senior'

const senior = {
  state: {
  },
  mutations: {
  },
  actions: {
    VenueMessage({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        venueMessage(userInfo).then(res => {
          resolve(res.data)
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
}

export default senior
