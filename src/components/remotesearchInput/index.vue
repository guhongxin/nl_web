<template>
  <div class="searchgroup lf">
    <el-autocomplete
      v-model="searchValue"
      :fetch-suggestions="querySearchAsync"
      value-key = 'valueKey'
      @select="handleSelect"
      :placeholder="placeholder"
      @keyup.enter.native="bindsearch" clearable class="input-with-select" style="width:100%">
      <div class="scan" slot="prepend">
        <div class="qr"></div>
        <el-select v-model="defaultValue" placeholder="全部" @change="chengbind">
        <el-option v-for="(item, index) in select" :key="index" :label="item.text" :value="item.value"></el-option>
        </el-select>
      </div>
      <el-button slot="append" icon="el-icon-search" @click="bindsearch"></el-button>
    </el-autocomplete>
  </div>
</template>

<script>
export default {
  name: 'remotesearchInput',
  components: {},
  props: ['select', 'defaultSelect', 'placeholder', 'fun1', 'fun2'],
  data() {
    return {
      defaultValue: '',
      searchValue: '',
      restaurants: [],
      loadAll: [],
      timeout: null,
      isBeginSeach: false // 是否开始搜索
    }
  },
  computed: {},
  created() {
    this.restaurants = this.loadAll
  },
  methods: {
    chengbind() {
      if (this.defaultValue.indexOf('id') === -1) {
        this.isBeginSeach = false
        this.loadAll = []
      } else {
        // 开始搜索
        this.isBeginSeach = true
        this.loadAll = []
        this.fun1().then(res => {
          this.loadAll = []
          res.map(item => {
            let obj = {
              'value': item.id,
              'valueKey': item.name
            }
            this.loadAll.push(obj)
          })
        }).catch(err => {
          console.log('搜索失败', err)
        })
      }
      this.$emit('changeOver', this.defaultValue)
    },
    bindsearch(event) {
      event.target.blur()
      this.$emit('kedownOver', {
        value: this.searchValue,
        type: this.defaultValue
      })
    },
    clear() {
      this.searchValue = ''
    },
    querySearchAsync(queryString, cb) {
      // 输入变化
      let restaurants = this.loadAll
      let results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants
      if (!this.isBeginSeach) {
        return cb(results)
      }
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        cb(results)
      }, 1000 * Math.random())
    },
    createStateFilter(queryString) {
      return (state) => {
        return (state.valueKey.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    handleSelect(item) {
      console.log(item)
    }
  },
  mounted() {
    if (typeof this.defaultSelect !== 'undefined') {
      this.defaultValue = this.defaultSelect
    }
  },
  destroyed() {}
}
</script>

<style rel="stylesheet/scss" lang="scss">
.searchgroup {
  width: 500px;
}
.lf {
  float: left;
}
.qr {
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
