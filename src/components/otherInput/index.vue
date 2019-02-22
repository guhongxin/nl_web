<template>
  <div class="otherSearch">
    <div class="sm"></div>
    <el-input placeholder="请输入手机号码/扫描APP上个人条形码" v-model="searchval" class="input-with-select">
    </el-input>
  </div>
</template>

<script>
export default {
  name: 'otherinput',
  components: {
  },
  data() {
    return {
      searchval: '',
    }
  },
  computed: {
  },
  methods: {
  },
  created() {
  },
  destroyed() {
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.otherSearch {
  width: 330px;
  display: inline-block;
}
.sm{
  width: 36px;
  display: inline-block;
  height: 36px;
  background: url("../../assets/icon/qr.png") no-repeat;
  background-size: contain;
  vertical-align: middle;
  margin-right: -4px;
  margin-top: -3px;
  border-radius: 5px 0 0 5px;
}
.otherSearch .el-select .el-input {
  width: 180px;
  padding-left: 0px;
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
  overflow: hidden;
}
</style>
