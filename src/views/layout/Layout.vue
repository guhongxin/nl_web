<template>
	<div class="app-wrapper" :class="{hideSidebar:!sidebar.opened}">
		<navbar></navbar>
		<sidebar class="sidebar-container"></sidebar>
		<div class="main-container">
			<tags-view></tags-view>
			<app-main></app-main>
		</div>
	</div>
</template>

<script>
import { Navbar, Sidebar, AppMain, TagsView } from './components'
import { getSession } from '@/utils/auth'
export default {
  name: 'layout',
  components: {
    Navbar,
    Sidebar,
    AppMain,
    TagsView
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    }
  },
  beforeRouteLeave(to, from, next) {
    // 导航离开该组件的对应路由时调用
    // 可以访问组件实例 `this`
    let CURRENT_GYM_ID = getSession('CURRENT_GYM_ID')
    if (!/mstore/.test(to.fullPath) || !CURRENT_GYM_ID || CURRENT_GYM_ID === '0') {
      // 防止从地址栏中输入多店路径，多店路径包含'mstore'
      next()
    } else {
      next(false)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
}
</style>
