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
import openCardOrder from './components/openCardOrder'
import privateCourseOrder from './components/privateCourseOrder'
import groupCourseOrder from './components/groupCourseOrder'
import shopOrder from './components/shopOrder'
import cupborderOrder from './components/cupborderOrder'
export default {
  name: 'financialRecord',
  components: {
    openCardOrder,
    privateCourseOrder,
    groupCourseOrder,
    shopOrder,
    cupborderOrder
  },
  data() {
    return {
      btnRoleList: {}, // tab/btn权限
      activeName: '',
      tabMapOptions: [
        { label: '会员卡订单', key: '6-2-1', content: 'openCardOrder' },
        { label: '私教课订单', key: '6-2-2', content: 'privateCourseOrder' },
        { label: '团课订单', key: '6-2-3', content: 'groupCourseOrder' },
        { label: '购物订单', key: '6-2-4', content: 'shopOrder' },
        { label: '租柜订单', key: '6-2-5', content: 'cupborderOrder' }
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
</style>
