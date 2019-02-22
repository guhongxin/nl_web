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
import goodsOut from './components/goodsOut'
import storage from './components/storage'
import cashierRecord from './components/cashierRecord'
import goodsManage from './components/goodsManage'
export default {
  name: 'cardManage',
  components: {
    goodsOut,
    storage,
    cashierRecord,
    goodsManage
  },
  data() {
    return {
      btnRoleList: {}, // tab/btn权限
      activeName: '',
      tabMapOptions: [
        { label: '快速购物', key: '1-5-1', content: 'goodsOut' },
        { label: '商品管理', key: '1-5-4', content: 'goodsManage' },
        { label: '入库记录', key: '1-5-2', content: 'storage' },
        { label: '收银记录', key: '1-5-3', content: 'cashierRecord' },
      ]
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
</style>
