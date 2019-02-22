<template>
  <div class="totalGlBox">
    <a :href="data.ahref" class="super-admin-box" :style="{'backgroundColor': data.bocolor}">
      <img :src="data.src"/>
      <span>{{data.name}}</span>
    </a>
  </div>
</template>
<script>
export default {
  name: 'totalGlBox',
  props: {
    data: {
      type: Object
    }
  }
}
</script>
<style lang="scss" scoped>
.totalGlBox{
  display: inline-block;
  margin-right: 20px;
}
a{
  display: inline-block;
  height: 100px;
  width: 250px;
  border-radius: 4px;
  padding: 30px 20px;
  img{
    width: 40px;
    height: 40px;
    vertical-align: middle;
  }
  span{
    font-size: 20px;
    color: #FFFFFF;
    vertical-align: middle;
  }
}
</style>

