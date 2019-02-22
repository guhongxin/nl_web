<template>
  <div class="app-container documentation-container">
      <el-tabs v-model="activeName" @tab-click="handleClick" class="tabmycalss">
        <el-tab-pane v-for="item in tabMapOptions" v-if="btnRoleList[item.key]" :label="item.label" :key='item.key' :name="item.key">
          <!-- <keep-alive> -->
            <component v-if='activeName==item.key' v-bind:is="item.content"></component>
          <!-- </keep-alive> -->
        </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import courseModify from './components/courseModify'
import purchaseModify from './components/purchaseModify'

export default {
  name: 'leagueRecord',
  components: {
    courseModify,
    purchaseModify
  },
  data() {
    return {
      btnRoleList: {}, // tab/btn权限
      activeName: '',
      tabMapOptions: [
        { label: '课程修改', key: '7-5-1', content: 'courseModify' },
        { label: '预约修改', key: '7-5-2', content: 'purchaseModify' }
      ]
    }
  },
  computed: {
  },
  methods: {
    handleClick(tab, event) { }
  },
  created() {
    this.common.eachBtnRole(this.btnRoleList) // 按钮权限方法
    this.activeName = this.common.tabRole(this.btnRoleList, this.tabMapOptions)
  },
  destroyed() {
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
