<template>
  <div class="app-container documentation-container">
    <span class="RRRrefresh" @click="initrRefresh(activeName)">
      <el-button icon="el-icon-refresh" circle></el-button>
    </span>
      <el-tabs v-model="activeName" @tab-click="handleClick" class="tabmycalss">
        <el-tab-pane v-for="item in tabMapOptions"  v-if="btnRoleList[item.key]" :label="item.label" :key='item.key' :name="item.key">
          <!-- <keep-alive> -->
            <component v-if='activeName==item.key' :ref="item.key" v-bind:is="item.content"></component>
          <!-- </keep-alive> -->
        </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import timeCard from './components/timeCard'
import secondCard from './components/secondCard'
import storedValCard from './components/storedValCard'
export default {
  name: 'cardManage',
  components: {
    timeCard,
    secondCard,
    storedValCard
  },
  data() {
    return {
      btnRoleList: {}, // tab/btn权限
      activeName: '',
      tabMapOptions: [
        { label: '时效卡', key: '1-4-1', content: 'timeCard' },
        { label: '次卡', key: '1-4-2', content: 'secondCard' },
        { label: '储值卡', key: '1-4-3', content: 'storedValCard' }
      ]
    }
  },
  computed: {
  },
  methods: {
    handleClick(tab, event) {},
    initrRefresh(curComponent) {
      this.$refs[curComponent][0].__init()
    }
  },
  created() {
    this.common.eachBtnRole(this.btnRoleList) // 按钮权限方法
    this.activeName = this.common.tabRole(this.btnRoleList, this.tabMapOptions)
  },
  destroyed() {
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.el-tabs__content {
  overflow: inherit;
}
</style>
