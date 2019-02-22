import { editEmployee, addEmployee, employeesGroup } from '@/api/employee'

const employee = {
  state: {
  },
  mutations: {
  },
  actions: {
    EditEmployee({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        editEmployee(userInfo).then(res => {
          resolve(res.data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    AddEmployee({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        addEmployee(userInfo).then(res => {
          resolve(res.data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    EmployeesGroup({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        employeesGroup(userInfo).then(res => {
          resolve(res.data)
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
}

export default employee
