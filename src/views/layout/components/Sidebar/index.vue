<template>
  <scroll-bar>
    <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
    <el-menu mode="vertical" :default-active="$route.path" :collapse="isCollapse" text-color="#a3a5a6" active-text-color="#1ab394">
      <sidebar-item :routes="permission_routers"></sidebar-item>
    </el-menu>
  </scroll-bar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import ScrollBar from '@/components/ScrollBar'
import Hamburger from '@/components/Hamburger'

export default {
  components: {
    SidebarItem,
    ScrollBar,
    Hamburger
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('toggleSideBar')
    },
  },
  computed: {
    ...mapGetters([
      'permission_routers',
      'sidebar'
    ]),
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>
<style lang="scss" scoped>
.el-menu {
  background-color: #304156;
  margin-top: 56px;
}
</style>