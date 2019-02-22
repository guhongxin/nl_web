<template>
  <div class="grid-content bg-purple" style="margin-bottom:5px;">
    <div class="div-top">
      <img :src="data.employee?(data.employee.head_portrait?data.employee.head_portrait:defaulthead):defaulthead" alt="" class="avater"/>
      <div class="timeMsg">
        <span>创建日期</span><br>
        <span>{{data.created_at}}</span>
      </div>
      <el-checkbox v-model="checked" class="checkbox" @change="change(data)"></el-checkbox>
    </div>
    <div class="content">
      <img :src="data.image" alt="" width='100%'>
    </div>
    <div class="artical">
      <p v-text="data.title.length > 30 ? data.title.slice(0,30) : data.title" :title="data.title"></p>
      <div v-text="data.intro.length > 30 ? data.intro.slice(0,54) : data.intro" :title="data.intro"></div>
    </div>
    <div class="bottom">
      <span v-text="data.article_log?data.article_log.push_count:'0'"></span>次推送
      <div class="bottom-icon">
        <el-tooltip class="item" effect="dark" content="编辑" placement="top">
          <i class="el-icon-edit-outline" @click="editBtn" v-if="editBtnShow"></i>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="查看" placement="top">
          <i class="el-icon-view"  @click="viewBtn" v-if="viewBtnShow"></i>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="推送" placement="top">
          <i class="share-icon" @click="shareBtn" v-if="shareBtnShow"></i>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="删除" placement="top">
          <i class="el-icon-delete"  @click="deleteBtn" v-if="deleteBtnShow"></i>
        </el-tooltip>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'imageCard',
  props: {
    data: {
      type: Object
    },
    editBtnShow: {
      type: Boolean,
      default() {
        return true
      }
    },
    viewBtnShow: {
      type: Boolean,
      default() {
        return true
      }
    },
    shareBtnShow: {
      type: Boolean,
      default() {
        return true
      }
    },
    deleteBtnShow: {
      type: Boolean,
      default() {
        return true
      }
    }
  },
  data() {
    return {
      checked: false
    }
  },
  created() {},
  methods: {
    editBtn() {
      // 编辑文章
      this.$emit('editBtn')
    },
    viewBtn() {
      // 查看
      this.$emit('viewBtn')
    },
    shareBtn() {
      // 分享
      this.$emit('shareBtn')
    },
    deleteBtn() {
      // 删除文章
      this.$emit('deleteBtn')
    },
    change(data) {
      this.$emit('selection-change')
    }
  }
}
</script>
<style lang="scss" scoped>
.bg-purple {
  border: 1px solid #cccccc;
  height: 317px;
  background: #fff;
  overflow: hidden;
  color: #333;
  .div-top {
    height: 48px;
    // background: #f5f5f5;
    line-height: 48px;
    padding: 6px;
    font-size: 14px;
    .avater {
      width: 30px;
      height: 30px;
      border-radius: 50%;
    }
    .timeMsg {
      line-height: 16px;
      display: inline-block;
      margin-left: 5px;
    }
    /deep/ .el-checkbox__inner{
      width: 20px;
      height: 20px;
      &::after{
        left: 7px;
        top: 4px;
      }
    }
    .checkbox {
      float: right;
      top: -5px;
    }
  }
  .content {
    height: 145px;
    border-top: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
    padding-top: 0;
    img {
      margin-top: -5px;
      height: 100%;
    }
  }
  .artical {
    font-size: 12px;
    padding: 10px;
    height: 85px;
    p {
      margin: 0;
      font-size: 12px;
      font-weight: bold;
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    div {
      margin-top: 8px;
      height: 51px;
      line-height: 18px;
      color: #666;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  .bottom {
    font-size: 14px;
    padding: 10px;
    height: 40px;
    color: #666;
    // background: #f5f5f5;
    border-top: 1px solid #ddd;
    height: 39px;
    .bottom-icon {
      float: right;
      i {
        margin-left: 10px;
        cursor: pointer;
      }
      .share-icon{
        width: 14px;
        height: 14px;
        display: inline-block;
        background-image: url('../../../../assets/image/share-incon.png');
        background-size: cover;
      }
    }
  }
}
</style>

