import { addVipCard } from '@/api/vipcard'
const card = {
  state: {
  },
  mutations: {
  },
  actions: {
    AddVipCard({ commit }, data) {
      return new Promise((resolve, reject) => {
        addVipCard(data).then(res => {
          resolve(res.data)
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
}

export default card

