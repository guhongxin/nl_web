<template>
  <div class="searchGroupset lf">
    <el-select v-model="searchGroupValue" placeholder="批量操作">
      <el-option
          v-for="item in select"
          v-if="isBtnRoleList||btnRoleList[item.key]"
          :key="item.value"
          :label="item.label"
          :value="item.value"
          :disabled="item.disabled">
      </el-option>
    </el-select>    
  </div>
</template>

<script>
export default {
  name: 'bulkaction',
  components: {
  },
  props: {
    'select': {
      type: Array
    },
    isBtnRoleList: {
      type: Boolean,
      default() {
        return false
      }
    }
  },
  data() {
    return {
      btnRoleList: {}, // 按钮权限
    }
  },
  computed: {
    searchGroupValue: {
      get() {
        return '批量操作'
      },
      set(value) {
        this.$emit('changeBulk', value)
      }
    }
  },
  methods: {
  },
  created() {
    this.common.eachBtnRole(this.btnRoleList) // 按钮权限方法
  },
  mounted() {
    if (typeof (this.searchGroupValue) !== 'undefined') {
      this.searchGroup = this.searchGroupValue
    }
  },
  destroyed() {
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.searchGroupset {
  margin-left: 20px;
  width: 110px;
  .el-input__inner {
    background-color: #333333;
    color: white;
  }
  input::placeholder {
    color: white;
  }
}
.lf{float: left;}
</style>
