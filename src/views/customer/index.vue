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
import customerManage from './components/customerManage'
import customerKeep from './components/customerKeep'
import customerPotential from './components/customerPotential'

export default {
  name: 'customer',
  components: {
    customerManage,
    customerKeep,
    customerPotential
  },
  data() {
    return {
      btnRoleList: {}, // tab/btn权限
      activeName: '',
      tabMapOptions: [
        { label: '会员管理', key: '2-1-1', content: 'customerManage' },
        { label: '会员维护', key: '2-1-2', content: 'customerKeep' },
        { label: '潜在客户', key: '2-1-3', content: 'customerPotential' }
      ],
    }
  },
  computed: {
  },
  methods: {
    handleClick(tab, event) {
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
$boxbr: #ffffff;
$eltabsitemFz: 18px;
$eltabsitemWt: Bold;
$borderstyl: 1px solid #cccccc;
.test{
  /deep/ .el-tabs__nav-wrap{
    background-color:  $boxbr;
    padding: 10px 20px 0px;
    border: $borderstyl;
    border-bottom: none;
  }
  /deep/ .el-tabs__item{
    font-size: $eltabsitemFz;
    font-weight: $eltabsitemWt;
  }
}
</style>
