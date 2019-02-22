<template>
  <div class="big-box" style="margin-right:-2px;overflow-y:auto;">
    <div class="out-box" style="width:100%;overflow-x:hidden;">
      <div class="inner-box" v-for="(item,index) in courseList" 
      :key="index" :class="{'active':ind === item.id}" @click="changeBg(item.id,item)">
        <p class="name"><span class="courseName" :title="item.name">{{item.name}}</span><span class="money">￥{{item.price}}</span></p>
        <p>{{getCourseTime(item.start_at)}} - {{getCourseTime(item.end_at)}}</p>
        <p :title="item.address" class="address">{{item.address}}</p>
        <!-- <p>{{item.coach?item.coach.name:''}}<span class="isCT" :class="[ item.isCT === true ? 'mant' : '', item.group === '已成团' ? 'chengt' : '' ]">{{item.group}}</span>
          <span class="number" :class="[ item.isCT === true ? 'mant' : '', item.group === '已成团' ? 'chengt' : '' ]">{{item.apply_num===null ? '0' : item.apply_num}}/{{item.max_person}}</span>
        </p> -->
        <p>{{item.coach?item.coach.name:''}}<span class="isCT" :class="'color' + item.business_status">{{getOrderStatus(item.business_status)}}</span>
          <span class="number" :class="'color' + item.business_status">{{item.apply_num===null ? '0' : item.apply_num}}/{{item.max_person}}</span>
        </p>
      </div>
    </div>
  </div>
</template>
<script>
import { parseTime } from '@/utils/index'
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
        nowDay: '',
        nowWeek: ''
      }
    }
  },
  mounted() {
  },
  methods: {
    getCourseTime(val) {
      if (val) {
        return parseTime(new Date(val), '{h}:{i}')
      }
    },
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
      this.courseMsgToParent.nowDay = item.time_start // 上课开始时间
      this.courseMsgToParent.nowWeek = item.week
      this.$emit('childToParent', this.courseMsgToParent)
    },
    getOrderStatus(val) {
      switch (val) {
        case 1: {
          return '待成团'
        }
        case 2: {
          return '待进行'
        }
        case 3: {
          return '进行中'
        }
        case 4: {
          return '未成团'
        }
        case 5: {
          return '已完成'
        }
        default:
          return ''
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.big-box {
  height: calc(100% - 160px);
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
  background-color: #ffffff;
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
.color1 {
  color: rgb(255, 204, 0);
}
.color2 {
  color: rgb(0, 121, 245);
}
.color3 {
  color: rgb(59, 59, 59);
}
.color4 {
  color: rgb(255, 0, 0);
}
.color5 {
  color: rgb(78, 220, 113);
}
</style>
