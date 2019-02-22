<template>
  <div class="menu-wrapper">
    <!-- <template v-for="item in routes" v-if="!item.hidden&&item.children">
      <router-link draggable="true" class="dragEle libar" v-if="item.children.length===1 && !item.children[0].children&&!item.alwaysShow" :to="resolvePath(item.path, item.children[0].path)" :key="item.children[0].name" >
        <el-menu-item :index="item.path+'/'+item.children[0].path" :class="{'submenu-title-noDropdown':!isNest}" style="color:#fff;">
          <svg-icon v-if="item.children[0].meta&&item.children[0].meta.icon" :icon-class="item.children[0].meta.icon"></svg-icon>
          <span v-if="item.children[0].meta&&item.children[0].meta.title">{{generateTitle(item.children[0].meta.title)}}</span>
        </el-menu-item>
      </router-link>

      <el-submenu v-else-if="item.check" :index="item.name||item.path" :key="item.name" class="libar">
        <template slot="title">
          <svg-icon v-if="item.meta&&item.meta.icon" :icon-class="item.meta.icon"></svg-icon>
          <span v-if="item.meta&&item.meta.title" style="color:#fff;">{{generateTitle(item.meta.title)}}</span>
        </template>

        <template v-for="child in item.children" v-if="child.check&&!child.hidden">
          <sidebar-item :is-nest="true" class="nest-menu" v-if="child.children&&child.children.length>0" :routes="[child]" :key="child.path"></sidebar-item>

          <router-link v-else :to="resolvePath(item.path, child.path)" :key="child.name" class="dragEle" draggable="true" >
            <el-menu-item :index="item.path+'/'+child.path" style="padding-left:55px;">
              <svg-icon v-if="child.meta&&child.meta.icon" :icon-class="child.meta.icon"></svg-icon>
              <span v-if="child.meta&&child.meta.title">{{generateTitle(child.meta.title)}}</span>
            </el-menu-item>
          </router-link>

        </template>
      </el-submenu>

    </template> -->
    <template v-for="item in routes" v-if="!item.hidden&&item.children">
      <component v-bind="linkProps(item,item.children[0])" v-if="item.children.length===1 && !item.children[0].children&&!item.alwaysShow">
      <!-- <router-link draggable="true" class="dragEle libar" v-if="item.children.length===1 && !item.children[0].children&&!item.alwaysShow" :to="resolvePath(item.path, item.children[0].path)" :key="item.children[0].name" > -->
        <el-menu-item :index="item.path+'/'+item.children[0].path" :class="{'submenu-title-noDropdown':!isNest}" style="color:#fff;">
          <svg-icon v-if="item.children[0].meta&&item.children[0].meta.icon" :icon-class="item.children[0].meta.icon"></svg-icon>
          <span v-if="item.children[0].meta&&item.children[0].meta.title">{{generateTitle(item.children[0].meta.title)}}</span>
        </el-menu-item>
      <!-- </router-link> -->
      </component>
      <el-submenu v-else-if="item.check" :index="item.name||item.path" :key="item.name" class="libar">
        <template slot="title">
          <svg-icon v-if="item.meta&&item.meta.icon" :icon-class="item.meta.icon"></svg-icon>
          <span v-if="item.meta&&item.meta.title" style="color:#fff;">{{generateTitle(item.meta.title)}}</span>
        </template>

        <template v-for="child in item.children" v-if="child.check&&!child.hidden">
          <sidebar-item :is-nest="true" class="nest-menu" v-if="child.children&&child.children.length>0" :routes="[child]" :key="child.path"></sidebar-item>
          <component v-bind="linkProps(item,child)">
          <!-- <router-link v-else :to="resolvePath(item.path, child.path)" :key="child.name" class="dragEle" draggable="true"> -->
            <el-menu-item :index="item.path+'/'+child.path" style="padding-left:55px;">
              <svg-icon v-if="child.meta&&child.meta.icon" :icon-class="child.meta.icon"></svg-icon>
              <span v-if="child.meta&&child.meta.title">{{generateTitle(child.meta.title)}}</span>
            </el-menu-item>
          <!-- </router-link> -->
          </component>
        </template>
      </el-submenu>

    </template>
  </div>
</template>

<script>
import path from 'path'
import { generateTitle } from '@/utils/i18n'
import { isExternal } from '@/utils'
// import { getSession } from '@/utils/auth'
// import { iconOrder } from '@/api/login'
export default {
  name: 'SidebarItem',
  props: {
    routes: {
      type: Array
    },
    isNest: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // gymType: getSession('EMPLOYEE_TYPE'),
      // gymType1: 4
    }
  },
  mounted() {
    this.bindDragStrar()
  },
  methods: {
    generateTitle,
    bindDragStrar() {
      const dragList = document.getElementsByClassName('dragEle')
      // const data = {}
      for (let i = 0; i < dragList.length; i++) {
        dragList[i].addEventListener('dragstart', function(ev) {
          let current = ev.target
          let currentInfo = {
            link: current.getAttribute('href').split('#')[1],
            text: current.innerText,
            icon: current.childNodes[0].innerHTML
          }
          ev.dataTransfer.effectAllowed = 'link'
          ev.dataTransfer.setData('text', JSON.stringify(currentInfo))
          /* data.name = currentInfo.text
          data.icon = currentInfo.icon
          data.url = currentInfo.link
          data.order = i
          iconOrder(data).then(res => {
            console.log('成功')
          }).catch(() => {
            this.common.message('warning', '操作失败')
          }) */
          return true
        })
      }
    },
    resolvePath(basepath, routePath) {
      if (this.isExternalLink(routePath)) {
        return routePath
      }
      return path.resolve(basepath, routePath)
    },
    isExternalLink(routePath) {
      return isExternal(routePath)
    },
    linkProps(item, data) {
      if (this.isExternalLink(data.path)) {
        return {
          is: 'a',
          href: data.path,
          target: '_blank',
          rel: 'noopener',
          class: 'aother'
        }
      }
      return {
        is: 'router-link',
        to: item.path + '/' + data.path,
        draggable: true,
        key: data.name,
        class: 'dragEle'
      }
    }
    // addIconOrder(data) {
    //   iconOrder(data).then(res => {
    //     console.log('成功')
    //   }).catch(() => {
    //     this.common.message('warning', '操作失败')
    //   })
    // }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
/* .libar {
  border-bottom: 5px solid #33373A;
} */
.libar:last-child {
  border-bottom: none!important;
}
.aother {
  background-color: #25282b;
}
.aother {
  .el-menu-item:focus, .el-menu-item:hover {
    background-color: black !important;
  }
}
</style>