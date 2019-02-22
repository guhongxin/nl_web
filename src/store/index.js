import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import errorLog from './modules/errorLog'
import permission from './modules/permission'
import tagsView from './modules/tagsView'
import user from './modules/user'
import card from './modules/cardManage'
import fitinfo from './modules/fitinfo'
import getters from './getters'
import senior from './modules/senior'
import coach from './modules/coach'
import cabinet from './modules/cabinet'
import employee from './modules/employee'
import course from './modules/course'
import manageGyms from './modules/manageGyms' // 获取场馆
Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    errorLog,
    permission,
    tagsView,
    user,
    fitinfo,
    coach,
    card,
    senior,
    cabinet,
    employee,
    course,
    manageGyms
  },
  getters
})

export default store
