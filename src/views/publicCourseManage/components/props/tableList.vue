<template>
  <div>
    <div class="big-box" style="margin-right:-2px;height:100%;overflow-y:auto;">
      <div class="out-box" style="width:100%;overflow-x:hidden;">
        <div class="inner-box" style="border-left:-1px;" v-for="(item,index) in courseList" 
        :key="index" :class="{'active':ind === item.id}" @click="changeBg(item.id,item)">
          <p class="name" :title="item.name">{{item.name}}</p>
          <p>{{item.time_start.split(':')[0] + ':' + item.time_start.split(':')[1]}} - {{item.time_end.split(':')[0] + ':' + item.time_end.split(':')[1]}}</p>
          <p :title="item.address">{{item.coach_name}}.{{item.address}}<span></span></p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'noData',
  props: {
    courseList: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  data() {
    return {
      ind: '',
      courseMsgToParent: {
        courseId: '',
        courseMsg: {},
        groupFull: false,
        nowDay: '',
        nowWeek: ''
      }
    }
  },
  mounted() {
  },
  methods: {
    clearInd() {
      this.ind = ''
    },
    setInd(id) {
      this.ind = id
    },
    changeBg(id, item) {
      this.ind = id
      this.courseMsgToParent.courseId = id
      this.courseMsgToParent.courseMsg = Object.assign({}, item)
      this.courseMsgToParent.groupFull = item.isCT // 是否满团
      this.courseMsgToParent.nowDay = item.time_start // 上课开始时间
      this.courseMsgToParent.nowWeek = item.week
      this.$emit('childToParent', this.courseMsgToParent)
    }
  }
}
</script>
<style lang="scss" scoped>
.big-box {
  height: 100%;
}
.big-box::-webkit-scrollbar {/*滚动条整体样式*/
    width: 0;     /*高宽分别对应横竖滚动条的尺寸*/
    height: 100%;
}
.big-box::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
    border-radius: 1px;
    box-shadow: inset 0 0 1px rgba(0,0,0,0);
    background: rgba(0,0,0,0.2);
}
.big-box::-webkit-scrollbar-track {/*滚动条里面轨道*/
    box-shadow: inset 0 0 1px rgba(0,0,0,0);
    border-radius: 0;
    background: transparent;
}
div.inner-box.active {
  background: rgba(238,103,35,0.3);
}
div.inner-box:hover {
  background: rgba(238,103,35,0.3);
}
div.inner-box {
  border: 1px solid #cccccc;
  border-top: none;
  padding: 15px 10px;
  background-color: #fff;
  p.name {
    font-weight: bold;
    font-size: 18px;
    color: #000;
  }
  p.address {
    width: 160px;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  p {
    position: relative;
    color: #999;
    span.courseName {
      display: inline-block;
      // width: 150px;
      // overflow: hidden;
      // text-overflow:ellipsis;
      // white-space: nowrap;
    }
    span.money {
      position: absolute;
      top: -25px;
      right: -3px;
    }
    .isCT {
      position: absolute;
      top: 0;
      right: 46px;
    }
    .mant {
      color: #F7732D;
    }
    .chengt {
      color: #85B31A;
    }
    .number {
      position: absolute;
      top: 0;
      right: -3px;
    }
    .active {
      color: #F7732D;
    }
    .money {
      color: #1AB394;
    }
  }
}
</style>
