<template>
  <div class="achievement">
    <ul class="top-box">
      <li v-for="(item, index) in data" v-bind:style="{ 'background-color': item.bgcolor}" :key="index">
        <p><span :class="item.image"></span>{{item.text}}</p>
        <div>{{item.num}}</div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'statistics',
  props: ['data'],
  data() {
    return {
    }
  },
  computed: {
  },
  methods: {
  },
  created() {
  },
  mounted() {
  },
  destroyed() {
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
ul.top-box {
  list-style: none;
  padding: 0;
  margin: 0;
  margin-left: 10px;
  overflow: hidden;
  li {
    width: 12%;
    height: 110px;
    box-shadow: 0 2px 5px 0 rgba(0,0,0,0.30);
    margin: 2px 20px 5px 0;
    transition: 0.1s all ease;
    float: left;
    background: #1C84C6;
    color: #fff;
    p {
      height: 40px;
      line-height:40px;
      margin-top: 0;
      background: rgba(0,0,0,0.1);
      font-size: 16px;
      span {
        display: inline-block;
        width: 26px;
        height: 26px;
        vertical-align: middle;
        margin: 0 5px;
      }
      .image_a {
        background: url('../../assets/icon/count_a.png') no-repeat;
        background-size: cover;
      }
      .image_b {
        background: url('../../assets/icon/count_e.png') no-repeat;
        background-size: cover;
      }
      .image_c {
        background: url('../../assets/icon/count_f.png') no-repeat;
        background-size: cover;
      }
      .image_d {
        background: url('../../assets/icon/count_g.png') no-repeat;
        background-size: cover;
      }
    }
    div {
      text-align: center;
      font-size: 28px;
    }
  }
}
</style>
