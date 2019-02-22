<template>
  <div class="mstoreLayout-box">
    <navbar></navbar>
    <tags-view></tags-view>
    <div class="mstoreLayout-main-container">
      <app-main></app-main>
    </div>
  </div>
</template>
<script>
import navbar from '../layout/components/Navbar'
import TagsView from './components/TagsView'
import AppMain from '../layout/components/AppMain'
import { getSession, setSession } from '@/utils/auth'
import { getMsGYMInfor } from '@/api/mstoregym'
export default {
  name: 'mstoreLayout',
  components: {
    navbar,
    TagsView,
    AppMain
  },
  beforeRouteEnter(to, from, next) {
    // 在渲染该组件的对应路由被 confirm 前调用
    // 不！能！获取组件实例 `this`
    // 因为当守卫执行前，组件实例还没被创建
    let CURRENT_GYM_ID = getSession('CURRENT_GYM_ID')
    if (!CURRENT_GYM_ID || CURRENT_GYM_ID === '0') {
      // 从多店页面地址栏输入分店地址 跳转到那个场馆的GYM_ID必须存在并且这个那个场馆的GYM_ID不能为0
      next()
    } else {
      next(false)
    }
  },
  beforeRouteLeave(to, from, next) {
    // 导航离开该组件的对应路由时调用
    // 可以访问组件实例 `this`
    let CURRENT_GYM_ID = getSession('CURRENT_GYM_ID')
    if (to.path === '/register' || (CURRENT_GYM_ID && !(CURRENT_GYM_ID === '0'))) {
      // 从多店页面地址栏输入分店地址 跳转到那个场馆的GYM_ID必须存在并且这个那个场馆的GYM_ID不能为0
      next()
    } else {
      next(false)
    }
  },
  created() {
    let _isGetMsGYMInfor = getSession('EMPLOYEE_TYPE') // 是否获取总店信息，注意EMPLOYEE_TYPE=2不去获取
    if (_isGetMsGYMInfor === '2') {
      return false
    }
    getMsGYMInfor().then(res => {
      let data = res.data
      if (data) {
        setSession('SET_GYM_NAME', data.name)
        setSession('SET_MSTORE_LOGO', data.logo) // 设置多店log
        setSession('SET_LOGO', data.logo)
        // 健身房验证状态
        setSession('IS_AUTH_PASS', data.is_auth_pass)
        setSession('SET_LEGAL_PERSON_PHONE', data.legal_person_phone)
        setSession('gymIsPass', data.is_auth_pass)
        setSession('SET_GYM_ID', data.id) // 切换到多店，重新设置GYM_ID
      }
    }).catch(err => {
      console.log(err)
    })
  }
}
</script>
<style lang="scss" scoped>
.mstoreLayout-box{
  background-color: rgb(240, 240, 240);
  min-height: 100vh;
  overflow: hidden;
  padding-bottom: 20px;
  .mstoreLayout-main-container{
    padding: 20px;
    min-height: 95%;
    top: 50px;
    position: relative;
  }
}
</style>


