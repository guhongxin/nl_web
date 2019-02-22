<template>
  <div class="searchgroup lf">
    <!-- <el-input :placeholder="placeholder" v-model="searchValue" @keyup.enter.native="bindsearch" clearable class="input-with-select"> -->
    <el-autocomplete
      popper-class="my-autocomplete"
      v-model="searchValue"
      :fetch-suggestions="querySearch"
      :placeholder="placeholder"
      @select="handleSelect" 
      @keyup.enter.native="bindsearch"
      @focus="elautocompletefocus" 
      class="input-with-select">
        <div class="scan" slot="prepend">
          <div class="qr"></div>
          <el-select v-model="defaultValue" placeholder="全部" @change="chengbind">
          <el-option v-for="(item, index) in select" :key="index" :label="item.text" :value="item.value"></el-option>
          </el-select>
        </div>
        <el-button slot="append" icon="el-icon-search" @click="bindsearch"></el-button>
      <template slot-scope="{ item }" v-if="defaultValue === 'name'">
        <div class="name">
          <span><img :src="item.head_portrait?item.head_portrait:defaulthead" alt="icon" width="30" height="30" style="vertical-align:middle;display: inline-block;border-radius:50%;"></span>
          <span>{{ item.name }}</span>
          <span class="addr">{{ item.sex===1?'(男)':'(女)' }}</span>
          <span class="addr">{{ item.phone }}</span>
        </div>
      </template>
    </el-autocomplete>
    <!-- </el-input> -->
  </div>
</template>

<script>
// import { customerList } from '@/api/customer'
import { phoneSignV2 } from '@/api/signin'
// import { debounce } from '@/utils/index.js'
export default {
  name: 'scaninput',
  components: {
  },
  props: ['select', 'defaultSelect', 'placeholder'],
  data() {
    return {
      defaultValue: '',
      searchValue: '',
      timeout: null,
      allList: [],
      listQuery: {
        page: 1,
        per_page: 100,
        column: 'name',
        value: '',
        is_vip: 1
      }
    }
  },
  computed: {
  },
  methods: {
    // getList() {
    //   this.listLoading = true
    //   customerList(this.listQuery).then(response => {
    //     this.allList = response.data
    //   })
    // },
    querySearch(queryString, cb) {
      if (this.defaultValue === 'name') {
        this.listQuery.value = queryString
        // customerList(this.listQuery).then(response => {
        //   var restaurants = response.data
        //   var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
        //   cb(results)
        // })
        phoneSignV2(this.listQuery).then(response => {
          var restaurants = response.data
          var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
          cb(results)
        })
      } else {
        cb([])
      }
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.name.indexOf(queryString) !== -1)
      }
    },
    handleSelect(item) {
      this.searchValue = item.name
      // this.$emit('chooseCustomer', item.id)
      this.$emit('chooseCustomer', item)
    },
    chengbind() {
      if (this.defaultValue === 'name') {
        // this.restaurants = this.allList
      } else {
        // this.querySearch('', () => {})
        // this.common.getClass('div', 'my-autocomplete').parentNode.removeChild('my-autocomplete')
        // console.log(document.body.removeChild(this.common.getClass('div', 'my-autocomplete')[0]))
      }
      this.$emit('changeOver', this.defaultValue)
    },
    bindsearch(e) {
      e.target.blur()
      this.$emit('kedownOver', { value: this.searchValue, type: this.defaultValue })
    },
    clear() {
      this.searchValue = ''
    },
    elautocompletefocus() {
      this.$emit('elautocompletefocus')
    }
  },
  created() {
    // this.getList()
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

<style rel="stylesheet/scss" lang="scss" scoped>
.searchgroup {
  width: 500px;
}
.lf{float: left;}
.qr{
  width: 36px;
  position: absolute;
  left: 0;
  top: 0;
  height: 36px;
  background: url("../../assets/icon/qr.png") no-repeat;
  background-size: contain;
}
.searchgroup /deep/ .el-select .el-input {
  width: 140px;
  padding-left: 36px;
}
.input-with-select /deep/ .el-input-group__prepend {
  background-color: #fff;
  overflow: hidden;
}
.input-with-select /deep/ {
  .el-input-group--append .el-input__inner, .el-input-group__prepend {
    width: 300px;
  }
}
</style>
