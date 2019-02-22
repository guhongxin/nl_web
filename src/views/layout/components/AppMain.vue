<template>
  <section class="app-main">
    <!-- <transition name="fade"> -->
      <keep-alive :include="cachedViews" :key="activeDateDesktop">
        <router-view></router-view>
      </keep-alive>
    <!-- </transition> -->
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    activeDateDesktop() {
      return this.$store.getters.activeDateDesktop
    }
    /* key() {
      return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date()
    } */
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.app-main {
  padding-top: 34px;
  position: relative;
}
</style>

