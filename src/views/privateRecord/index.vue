<template>
  <div class="app-container documentation-container">
    <el-tabs v-model="activeName" @tab-click="handleClick"  class="tabmycalss">
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
import orderModify from './components/orderModify'
import purchaseModify from './components/purchaseModify'

export default {
  name: 'customer',
  components: {
    courseModify,
    orderModify,
    purchaseModify
  },
  data() {
    return {
      btnRoleList: {}, // tab/btn权限
      activeName: '',
      tabMapOptions: [
        { label: '课程修改', key: '7-3-1', content: 'courseModify' },
        { label: '购买修改', key: '7-3-2', content: 'orderModify' },
        { label: '预约修改', key: '7-3-3', content: 'purchaseModify' }
      ],
    }
  },
  computed: {
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event.target)
    },
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
