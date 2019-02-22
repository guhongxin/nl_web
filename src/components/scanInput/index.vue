<template>
  <div class="searchgroup lf">
    <el-input :placeholder="placeholder" v-model="searchValue" @keyup.enter.native="bindsearch" clearable class="input-with-select">
    <div class="scan" slot="prepend">
        <div class="qr"></div>
        <el-select v-model="defaultValue" placeholder="全部" @change="chengbind">
        <el-option v-for="(item, index) in select" :key="index" :label="item.text" :value="item.value"></el-option>
        </el-select>
    </div>
    <el-button slot="append" icon="el-icon-search" @click="bindsearch"></el-button>
    </el-input>
  </div>
</template>

<script>
export default {
  name: 'scaninput',
  components: {
  },
  props: ['select', 'defaultSelect', 'placeholder'],
  data() {
    return {
      defaultValue: '',
      searchValue: ''
    }
  },
  computed: {
  },
  methods: {
    chengbind() {
      this.$emit('changeOver', this.defaultValue)
    },
    bindsearch(event) {
      this.$emit('kedownOver', { value: this.searchValue, type: this.defaultValue })
    },
    clear() {
      this.searchValue = ''
    }
  },
  created() {
  },
  mounted() {
    if (typeof (this.defaultSelect) !== 'undefined') {
      this.defaultValue = this.defaultSelect
    }
  },
  destroyed() {
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.searchgroup {
  width: 500px;
}
.qr{
  width: 36px;
  position: absolute;
  left: 0;
  top: 0;
  height: 36px;
  background: url("../../assets/icon/qr.png") no-repeat;
  background-size: contain;
}
.searchgroup .el-select .el-input {
  width: 140px;
  padding-left: 36px;
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
  overflow: hidden;
}
</style>
