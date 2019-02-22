<template>
<span>
  <div class="cursorbox" v-if="data" v-for="(value, index) in data" v-on:click="choose(index)" :key="index" v-bind:class="{'cursoractive': value.checked}" v-bind:style="{ 'background-color': value.checked ? value.bocolor : ''}">
    <div class="text" v-bind:style="{ 'border-top-color': value.bocolor}">{{value.text}}
      <el-dropdown v-if="value.select" trigger="click" class="dorpmy">
        <div v-if="value.select" @click="openbox(index)" class="rbutton"  v-bind:class="{'activerbutton': value.checked}" 
      v-bind:style="[{ 'color': value.checked ? 'white' : value.bocolor},
      { 'border': value.checked ? '1px solid white' : '1px solid '+value.bocolor},
      { 'background-color': value.checked ? 'none' : value.bocolor.split('(')[0]+'a('+(value.bocolor.split('(')[1]).split(')')[0]+',0.1)'}]"><span class="el-icon-setting"></span> {{value.rbtn}} </div>
        <el-dropdown-menu slot="dropdown" scope="value">
          <el-dropdown-item v-for="(item, key) in value.select" :key="key" @click.native="handleclick(item, index)">{{item.label}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div> 
    <div class="font" v-if="value.int">{{value.num | NumInt}}</div>
    <div class="font" else>{{value.num | NumFormat}}</div>
  </div>
</span>
</template>

<script>
export default {
  name: 'rectbox',
  props: {
    data: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      selectValue: '5',
      value: ''
    }
  },
  filters: {
    NumFormat: function(value) {
      value = Number(value).toFixed(2)
      if (!value) return '0.00'
      // var intPart = Number(value).toFixed(0) // 获取整数部分
      var intPart = Math.trunc(value) // 获取整数部分
      var intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') // 将整数部分逢三一断
      var floatPart = '.00' // 预定义小数部分
      var value2Array = value.split('.')
      // =2表示数据有小数位
      if (value2Array.length === 2) {
        floatPart = value2Array[1].toString() // 拿到小数部分
        if (floatPart.length === 1) { // 补0,实际上用不着
          return intPartFormat + '.' + floatPart + '0'
        } else {
          return intPartFormat + '.' + floatPart
        }
      } else {
        return intPartFormat + floatPart
      }
    },
    NumInt: function(value) {
      value = parseInt(value)
      if (!value) return '0'
      var intPart = Number(value).toFixed(0) // 获取整数部分
      var intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') // 将整数部分逢三一断
      return intPartFormat
    }
  },
  mounted() {
  },
  methods: {
    choose(index) {
      this.$emit('choose', index)
    },
    openbox(index) {
      this.$emit('openbox', index)
    },
    handleclick(obj, index) {
      obj.fatherIndex = index
      this.$emit('overChange', obj)
    }
  },
  created() {
  },
  destroyed() {
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dorpmy {
  float: right;
  margin-top: 5px;
  margin-right: 5px;
}
.rbutton {
  padding:0 4px;
  height: 22px;
  border-radius: 3.56px;
  font-size: 10px;
  text-align: center;
  line-height: 22px;
  cursor: pointer;
  transition: 0.2s all ease;
}
.rbutton:hover {
  opacity: 0.8;
}
.activerbutton {
  border-color: white;
  color: white;
  background: none;
  margin-top: 5px;
}
.cursorbox {
  width: 15.5%;
  min-width: 200px;
  height: 98px;
  box-shadow: 0 2px 5px 0 rgba(0,0,0,0.30);
  margin: 2px 10px 5px 0;
  transition: 0.1s all ease;
  float: left;
  .text {
    position: relative;
    font-size: 14px;
    color: #cccccc;
    height: 40px;
    line-height: 30px;
    box-sizing: border-box;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    padding-left: 10px;
    border-top: 6px solid #1C84C6;
  }
  .font {
    font-size: 28px;
    color: #333333;
    line-height: 58px;
    height: 58px;
    text-align: center;
  }
}
.cursoractive{
  .text {
    background-color: rgba(0, 0, 0, 0.1);
    color: #ffffff;
    line-height: 40px;
    border-top: none;
  }
  .font {
    color: #ffffff;
  }
}

</style>
