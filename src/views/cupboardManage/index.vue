<template>
  <div class="app-container documentation-container">
    <span class="RRRrefresh" @click="initrRefresh(activeName)">
      <el-button icon="el-icon-refresh" circle></el-button>
    </span>
    <el-tabs v-model="activeName" @tab-click="handleClick" class="tabmycalss">
      <el-tab-pane v-for="item in tabMapOptions" v-if="btnRoleList[item.key]" :label="item.label" :key='item.key' :name="item.key">
        <!-- <keep-alive> -->
          <component v-if='activeName==item.key' :ref="item.key" v-bind:is="item.content"></component>
        <!-- </keep-alive> -->
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import cabinetManage from './components/cabinetManage'
import cabinetReturn from './components/cabinetReturn'
import disableRecord from './components/disableRecord'
import rentRecord from './components/rentRecord'

export default {
  name: 'cupboardManage',
  components: {
    cabinetManage,
    cabinetReturn,
    disableRecord,
    rentRecord
  },
  data() {
    return {
      btnRoleList: {}, // tab/btn权限
      activeName: '',
      tabMapOptions: [
        { label: '柜子租还', content: 'cabinetReturn', key: '1-2-1' },
        { label: '柜子管理', content: 'cabinetManage', key: '1-2-2' },
        { label: '租还记录', content: 'rentRecord', key: '1-2-3' },
        { label: '禁用记录', content: 'disableRecord', key: '1-2-4' }
      ]
    }
  },
  computed: {
  },
  methods: {
    handleClick(tab, event) {
      // console.log(tab, event.target)
    },
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

<style rel="stylesheet/scss" lang="scss" scoped>
// $boxbr: #ffffff;
// $eltabsitemFz: 20px;
// $eltabsitemWt: Bold;
// $borderstyl: 1px solid #cccccc;
// .test1{
//   /deep/ .el-tabs__nav-wrap{
//     background-color:  $boxbr;
//     padding: 10px 20px 0px;
//     border: $borderstyl;
//     border-bottom: none;
//   }
//   /deep/ .el-tabs__item{
//     font-size: $eltabsitemFz;
//     font-weight: $eltabsitemWt;
//   }
// }
</style>
