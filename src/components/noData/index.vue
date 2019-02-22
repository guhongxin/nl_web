<template>
  <div class="noData">
    <div class="table-cell">
      <span class="icon-暂无数据 icon"></span>
      <p>暂无聊天记录</p>
    </div>
  </div>
</template>
<script>
export default {
  name: 'noData',
  // mounted() {
  //   this.$nextTick(() => {
  //     this.boxHt()
  //   })
  // },
  // methods: {
  //   boxHt() {
  //     // 菜单距离顶部高度
  //     let topHt = document.querySelector('.topNav').offsetTop
  //     // Nav高度
  //     let navHeight = document.querySelector('.topNav').offsetHeight
  //     // 可见区域高度
  //     let ht = document.documentElement.clientHeight
  //     document.querySelector('.noData').style.height = (ht - navHeight - topHt) + 'px'
  //   }
  // }
}
</script>
<style lang="scss" scoped>
.noData {
    width: 100%;
    text-align: center;
    display: table;
}
.table-cell {
    display: table-cell;
    text-align: center;
    vertical-align: middle;
}
.icon {
    font-size: 20px;
}
p {
    margin-top: 4px;
    font-size: 16px;
    color: #CCCCCC;  
    letter-spacing: 4px;
}
</style>
