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
import menberModify from './components/menberModify'
import potentialModify from './components/potentialModify'

export default {
  name: 'customer',
  components: {
    menberModify,
    potentialModify
  },
  data() {
    return {
      btnRoleList: {}, // tab/btn权限
      activeName: '',
      tabMapOptions: [
        { label: '会员修改', key: '7-1-1', content: 'menberModify' },
        { label: '潜客修改', key: '7-1-2', content: 'potentialModify' }
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
