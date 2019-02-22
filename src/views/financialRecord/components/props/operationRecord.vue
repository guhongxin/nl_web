<template>
  <div class="scroll-box">
    <ul style="padding-left: 10px">
      <li v-for="(item, index) in operationList" :key="index" class="li-box">
        <span v-if="item.type === 2">
          <div style="background: #fff;height: 20px;" class="pic"><i class="el-icon-error"></i></div>
          <div class="operation-content">
            <div><span class="left-title">操作类型：</span><span class="red">作废</span></div>
            <div><span class="left-title">操作人员：</span><span>{{item.operator_name}}</span></div>
            <div><span class="left-title">备注内容：</span><span>{{item.remark}}</span></div>
            <p>{{item.created_at}}</p>
          </div>
        </span>
        <span v-if="item.type === 1">
          <div style="background: #fff;height: 20px;" class="pic"><i class="el-icon-success"></i></div>
            <div class="operation-content">
              <div><span class="left-title">操作类型：</span><span class="green">有效</span></div>
              <div><span class="left-title">操作人员：</span><span>{{item.operator_name}}</span></div>
              <div><span class="left-title">备注内容：</span><span>{{item.remark}}</span></div>
              <div><span class="left-title">修改内容：</span><span>{{item.content.replace(/\[|]/g,'').replace(/\"/g, "")}}</span></div>
              <p>{{item.created_at}}</p>
            </div>
        </span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'operation-record',
  props: {
    operationList: {
      type: Array,
      default: function() {
        return [{}]
      }
    }
  },
  data() {
    return {
    }
  },
  created() {
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.scroll-box {
  max-height: 240px;
  overflow: auto;
}
ul {
  margin: 0;
  padding: 0;
  color: #333;
  .li-box {
    list-style: none;
    margin: 0;
    border-left: 1px solid #ccc;
    padding-left: 20px;
    position:relative;
    padding-bottom: 10px;
    .pic {
      color: #41c7db;
      position: absolute;
      top: 0px;
      left: -10px;
      font-size: 20px;
      i {
        display: inherit;
      }
    }
  }
}
.operation-content {
  line-height: 20px;
  .left-title {
    display: inline-block;
    width: 80px;
  }
  .right-content {
    display: inline-block;
    width: calc(100% - 70px);
    word-break: break-all;
    word-wrap: break-word;
    vertical-align: top;
  }
  p{
    margin: 0 !important;
  }
}
.red {
  color:  #ff0000;
}
.green {
  color: #7be595;
}
</style>
