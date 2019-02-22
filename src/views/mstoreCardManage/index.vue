<template>
  <div class="app-container documentation-container">
    <span class="RRRrefresh" @click="initrRefresh(activeName)">
      <el-button icon="el-icon-refresh" circle></el-button>
    </span>
      <el-tabs v-model="activeName" @tab-click="handleClick" class="el-tab-box tabmycalss">
        <el-tab-pane v-for="item in tabMapOptions"  v-if="btnRoleList[item.key]" :label="item.label" :key='item.key' :name="item.key">
          <!-- <keep-alive> -->
            <component v-if='activeName==item.key' :ref="item.key" v-bind:is="item.content"></component>
          <!-- </keep-alive> -->
        </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
// 多店---通卡管理
import timeCard from './components/timeCard'
import secondCard from './components/secondCard'
export default {
  name: 'mstoreCardManage',
  components: {
    timeCard,
    secondCard
  },
  data() {
    return {
      btnRoleList: {}, // tab/btn权限
      activeName: '',
      tabMapOptions: [
        { label: '时效卡', key: '1-4-1', content: 'timeCard' },
        { label: '次卡', key: '1-4-2', content: 'secondCard' }
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
  destroyed() {}
}
</script>
<style lang="scss" scoped>
.documentation-container{
  overflow: hidden;
  padding: 0px;
}
.RRRrefresh{
  top: 45px;
}
// .el-tab-box{
//   overflow: hidden;
//   /deep/ .el-tabs__item{
//     font-size: 20px;
//   }
// }
</style>
