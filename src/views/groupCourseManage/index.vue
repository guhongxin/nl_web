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
import leagueDate from './components/leagueDate'
import leagueLecture from './components/leagueLecture'
import leagueOrder from './components/leagueOrder'
export default {
  name: 'groupCourseManage',
  components: {
    leagueDate,
    leagueLecture,
    leagueOrder
  },
  data() {
    return {
      btnRoleList: {}, // tab/btn权限
      activeName: '',
      tabMapOptions: [
        { label: '团课排期', key: '3-4-1', content: 'leagueDate' },
        { label: '团课课程', key: '3-4-2', content: 'leagueLecture' },
        { label: '团课预约', key: '3-4-3', content: 'leagueOrder' }
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
    console.log(this.btnRoleList)
    this.activeName = this.common.tabRole(this.btnRoleList, this.tabMapOptions)
  },
  destroyed() {
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
</style>
