<template>
  <div class="dashboard-editor-container" v-bind:class="[dragOver ? 'greenborder1px' : '']">
    <div class="dragbox">
      <grid
        :draggable="true"
        :sortable="true"
        :cellWidth="cellWidth"
        :cellHeight="cellHeight"
        @click="click"
        :items="resouceList"
        @dragend="dragend"
        @dragstart="dragstart"
        @drag="drag"
        @remove="remove"
        @sort="sort">
        <template slot="cell" slot-scope="props">
          <div class="icon" v-on:dblclick="openRouter(props.item.link)">
            <div class="icon-delete-btn" @click="() => { props.remove() }"></div>
            <div class="dragiconbox" v-bind:class="[props.item.class]">
              <span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span><span class="path6"></span><span class="path7"></span><span class="path8"></span><span class="path9"></span>
            </div>
            <a draggable="false" class="dragiconboxtext"  v-html="props.item.text"></a>
          </div>
        </template>
      </grid>
      <el-alert title="请将左侧菜单栏内的功能拖拽至此，即可使用自定义桌面" type="info" show-icon :closable="false" v-if="showNothing"></el-alert>
    </div>
    <div class="rabbish" v-bind:class="[delhover ? 'delhover' : '']">
      <img v-if="!delhover" src="../../../assets/image/delete.svg" alt="">
      <img v-else src="../../../assets/image/deleteopen.svg" alt="">
      <span style="display:none">{{activeDateDesktop}}</span>
    </div>
  </div>
</template>

<script>
import { iconDelete, iconShow, iconOrder } from '@/api/login'
import { mapState } from 'vuex'
let self
export default {
  name: 'dashboard-admin',
  components: {
  },
  data() {
    return {
      dragOver: false,
      eleDustbin: '',
      resouceList: [],
      windowWidth: window.innerWidth - 220,
      windowHeight: window.innerHeight - 90,
      cellWidth: 140,
      cellHeight: 140,
      showNothing: false,
      isdrag: false,
      lastAction: [],
      curSortList: [],
      rabbish: '',
      delhover: false,
      curdragbox: null,
      DELDATA_link: ''
    }
  },
  mounted() {
    this.eleDustbin = document.getElementsByClassName('dashboard-editor-container')[0]
    this.rabbish = document.getElementsByClassName('icon-rabbish')[0]
    window.onresize = () => {
      this.windowWidth = window.innerWidth - 220
      this.windowHeight = window.innerHeight - 90
    }
    this.bindDragEnter()
    this.bindondragover()
    this.bindondragleave()
    this.bindondrop()
  },
  created() {
    this.getIcon()
    self = this
  },
  watch: {
    resouceList: {
      handler(curVal, oldVal) {
        if (!curVal.length) {
          this.showNothing = true
        } else {
          this.showNothing = false
        }
      },
      immediate: true
    }
  },
  methods: {
    click({ items, index }) {
      let value = ''
      value = items.find(v => v.index === index)
      console.log('click', value)
    },
    openRouter(link) {
      this.$router.push({ path: link })
    },
    dragstart(event) {
      if (event.event.path) {
        for (let value of event.event.path) {
          if (value.className === 'icon') {
            this.curdragbox = value
            return
          }
        }
      } else {
        if (event.event.target.parentNode.getAttribute('class') === 'icon') {
          this.curdragbox = event.event.target.parentNode
        } else {
          this.curdragbox = event.event.target.parentNode.parentNode
        }
      }
    },
    drag(event) {
      this.isdrag = true
      let curX = parseInt(this.windowWidth) - parseInt(event.event.positionX)
      let curY = parseInt(this.windowHeight) - parseInt(event.event.positionY)
      // console.log(this.curdragbox)
      if (curX <= 260 && curY <= 260) {
        this.delhover = true
        this.curdragbox.style.opacity = 0.5
      } else {
        this.delhover = false
        this.curdragbox.style.opacity = 1
      }
      // console.log('drag', event)
    },
    dragend(event) {
      if (this.isdrag) {
        let curList = []
        for (let value of event.items) {
          curList.push(value.item)
        }
        if (this.lastAction[this.lastAction.length - 1] === 'sort') {
          this.curSortList = curList
        }
        this.isdrag = false
        if (this.delhover) {
          this.delhover = false
          // this.DELDATA_link = event.items[event.items - 1].item.link
          for (let value of this.curdragbox.childNodes) {
            if (value.className === 'icon-delete-btn') {
              value.click()
              // 删除
              this.lastAction.push('del')
              let index = event.index
              let id = this.resouceList[index].id
              this.deleteIcon(id)
            }
          }
        }
        console.log('dragend', event)
      }
    },
    remove(event) {
      let curList = []
      for (let value of event.items) {
        curList.push(value.item)
      }
      setTimeout(() => {
        this.resouceList = curList
      }, 0)
      console.log('remove', event)
    },
    deleteIcon(id) {
      iconDelete(id).then(res => {
        console.log('删除成功')
        this.getIcon()
      }).catch(() => {
        this.common.message('warning', '操作失败')
      })
    },
    sort(event) { // 排序事件
      console.log('sort', event)
      this.curSortList = []
      for (let value of event.items) {
        this.curSortList.push(value.item)
      }
      this.lastAction.push('sort')
      return false
    },
    // handleSetLineChartData(type) {
    //   this.lineChartData = lineChartData[type]
    // },
    bindDragEnter: function(ev) {
      const self = this
      this.eleDustbin.ondragenter = function(ev) {
        // 拖拽元素进入目标元素头上的时候
        self.dragOver = true
        return true
      }
    },
    bindondragover: function(ev) {
      const self = this
      this.eleDustbin.ondragover = function(ev) {
        // 拖拽元素在目标元素头上移动的时候
        self.dragOver = true
        ev.preventDefault()
        return true
      }
    },
    bindondragleave: function(ev) {
      const self = this
      this.eleDustbin.ondragleave = function(ev) {
        // 拖拽元素在目标元素离开的时候
        self.dragOver = false
        return true
      }
    },
    bindondrop: function(ev) {
      const self = this
      this.eleDustbin.ondrop = function(ev) {
        // 移动拖动的元素到所选择的放置目标节点
        let same = false
        let data = JSON.parse(ev.dataTransfer.getData('text'))
        let curClass = data.link.split('/')
        data.class = 'icon-' + curClass[curClass.length - 1]
        let curResource = self.resouceList
        for (let i = 0; i < curResource.length; i++) {
          if (curResource[i].text === data.text) {
            same = true
            self.$message({
              message: '列表中已有此功能',
              type: 'warning',
              duration: 1500
            })
          }
        }
        if (!same) {
          // self.removeAllDragDom()
          setTimeout(() => {
            if (self.lastAction[self.lastAction.length - 2] === 'del') {
              if (!document.getElementsByClassName('v-grid-item-wrapper').length) {
                self.resouceList = []
                self.curSortList = []
              } else {
                // self.curSortList.splice(self.curSortList.length - 1, 1)
                self.resouceList = self.curSortList
                self.resouceList.push(data)
                data.order = 1
                data.name = data.text
                data.url = data.link
                self.addIconOrder(data)
              }
            } else {
              self.resouceList = self.curSortList
              self.resouceList.push(data)
              data.order = 1
              data.name = data.text
              data.url = data.link
              self.addIconOrder(data)
            }
          }, 0)
          self.lastAction.push('drop')
        }
        self.dragOver = false
        return true
      }
    },
    addIconOrder(data) {
      iconOrder(data).then(res => {
        this.resouceList[this.resouceList.length - 1].id = res.data.id
        console.log('成功')
      }).catch(() => {
        this.common.message('warning', '操作失败')
      })
    },
    removeAllDragDom() {
      let allDomDragBox = document.getElementsByClassName('icon-delete-btn')
      if (allDomDragBox.length) {
        for (let value of allDomDragBox) {
          value.click()
        }
      }
    },
    getIcon() {
      iconShow().then(res => {
        for (let i = 0; i < res.data.length; i++) {
          let icon = JSON.parse(res.data[i].note).icon
          this.$set(this.resouceList, i, {
            class: 'icon-' + JSON.parse(res.data[i].note).url.split('/')[2],
            link: JSON.parse(res.data[i].note).url,
            text: JSON.parse(res.data[i].note).name,
            icon: icon.replace(/\"/g, "'"),
            id: res.data[i].id
          })
          this.curSortList = this.resouceList
        }
      }).catch(() => {
        this.common.message('warning', '操作失败')
      })
    }
  },
  computed: mapState({
    activeDateDesktop: state => {
      self.getIcon()
      return state.manageGyms.activeDateDesktop
    }
  })
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.greenborder1px {border: 1px solid #00fd61;}
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(255, 255, 255);
  height: calc(100vh - 84px);
  position: relative;

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}
.delhover {
  background: #eeeeee;
}
.rabbish {
  position: absolute;
  right: 20px;
  bottom: 20px;
  background: #fff;
  width: 150px;
  height: 150px;
  text-align: center;
  line-height: 150px;
  border-radius: 5px;
  font-size: 30px;
  img {
    margin-top: 43px;
    width: 60px;
  }
}
.icon {
    position: relative;
    margin: 14px;
    height: 110px;
    width: 160px;
    border-radius: 10px;
    color: #333;
    font-weight: 900;
    font-size: 12px;
    line-height: 52px;
    text-align: center;
    transition: all .3s;
}
.dragiconbox {
  width: 160px;
  height: 80px;
  font-size: 65px;
}
.dragiconboxtext {
  display: block;
  height: 30px;
  line-height: 30px;
  font-size: 14px;
  overflow: hidden;
}
.icon-dnd-list, .icon-download {  // 公开课管理
  background: url('../../../assets/desktop_icon/gkegl.png') no-repeat 100%;
  background-position: 40px 0px;
}
.icon-tinymce, .icon-keyboard {  // 入场签到
  background: url('../../../assets/desktop_icon/rcqd.png') no-repeat 100%;
  background-position: 40px 0px;
}
.icon-markdown, .icon-line {  // 租柜管理
  background: url('../../../assets/desktop_icon/zggl.png') no-repeat 100%;
  background-position: 40px 0px;
}
.icon-customer, .icon-create-form {  // 会员管理
  background: url('../../../assets/desktop_icon/hygl.png') no-repeat 100%;
  background-position: 40px 0px;
}
.icon-avatar-upload {  // 会员卡管理
  background: url('../../../assets/desktop_icon/hykgl.png') no-repeat 100%;
  background-position: 40px 0px;
}
.icon-splitpane {  // 会员卡设置
  background: url('../../../assets/desktop_icon/hyksz.png') no-repeat 100%;
  background-position: 40px 0px;
}
.v-grid-item-dragging .icon {
  animation-name: shake;
  animation-duration: 0.07s;
  animation-iteration-count: infinite;
  animation-direction: alternate;
}
.icon .icon-delete-btn {
    display: none;
    position: absolute;
    width: 8px;
    height: 8px;
    border-radius: 7px;
    right: 6px;
    top: 6px;
    border: 1px solid hsla(0,0%,100%,.4);
    background: hsla(0,0%,100%,.2);
    cursor: pointer;
}
.dragbox {
  height: calc(100vh - 148px);
}
@keyframes shake {
  from {
    transform: rotate(-1deg);
  }
  to {
    transform: rotate(1deg);
  }
}
</style>
