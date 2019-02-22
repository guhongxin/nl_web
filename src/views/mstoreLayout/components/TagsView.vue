<template>
  <div class="tags-view-container">
    <scroll-pane class='tags-view-wrapper' ref='scrollPane'>
      <router-link ref='tag' class="tags-view-item" :class="isActive(tag)?'active':''" v-for="tag in isShowtage(visitedViews)"
        :to="tag.path" :key="tag.path">
        {{tag.title}}
      </router-link>
    </scroll-pane>
  </div>
</template>

<script>
import ScrollPane from '@/components/ScrollPane'
import { getSession } from '@/utils/auth'
export default {
  components: { ScrollPane },
  data() {
    return {
      visitedViews: [{
        path: '/',
        title: '我的桌面',
        isShow: '2356',
        name: 'mstoredashboard'
      }, {
        path: '/mstoreSuperAdmin',
        title: '超级管理员',
        isShow: '5',
        name: 'mstoreSuperAdmin'
      }, {
        path: '/mstoreCardTypeGl',
        title: '通卡卡种管理',
        isShow: '356',
        name: 'mstoreCardTypeGl'
      }, {
        path: '/mstoreCardManage',
        title: '通卡管理',
        isShow: '356',
        name: 'mstoreCardManage'
      }, {
        path: '/mstoreCustomerGl',
        title: '通卡会员管理',
        isShow: '356',
        name: 'mstoreCustomerGl'
      }],
      gymType: getSession('EMPLOYEE_TYPE'),
    }
  },
  methods: {
    isActive(route) {
      return route.path === this.$route.path || route.name === this.$route.name
    },
    isShowtage() {
      let result = []
      result = this.visitedViews.filter(item => {
        return item.isShow.indexOf(this.gymType) !== -1
      })
      return result
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.tags-view-container {
  position: fixed;
  width: 100%;
  z-index: 1000;
  top: 50px;
  .tags-view-wrapper {
    background: #fff;
    height: 34px;
    border-bottom: 1px solid #d8dce5;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .12), 0 0 3px 0 rgba(0, 0, 0, .04);
    .tags-view-item {
      display: inline-block;
      position: relative;
      height: 26px;
      line-height: 26px;
      border: 1px solid #d8dce5;
      color: #495060;
      background: #fff;
      padding: 0 8px;
      font-size: 12px;
      margin-left: 5px;
      margin-top: 4px;
      &:first-of-type {
        margin-left: 15px;
      }
      &.active {
        background-color: #42b983;
        color: #fff;
        border-color: #42b983;
        &::before {
          content: '';
          background: #fff;
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          position: relative;
          margin-right: 2px;
        }
      }
    }
  }
  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 2;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, .3);
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }
}
</style>

<style rel="stylesheet/scss" lang="scss">
//reset element css of el-icon-close
.tags-view-wrapper {
  .tags-view-item {
    .el-icon-close {
      width: 16px;
      height: 16px;
      vertical-align: 2px;
      border-radius: 50%;
      text-align: center;
      transition: all .3s cubic-bezier(.645, .045, .355, 1);
      transform-origin: 100% 50%;
      &:before {
        transform: scale(.6);
        display: inline-block;
        vertical-align: -3px;
      }
      &:hover {
        background-color: #b4bccc;
        color: #fff;
      }
    }
  }
}
</style>
