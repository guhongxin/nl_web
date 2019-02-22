<template>
  <div class="hamhover" :class="[isActive?'hamhover-padding':'']" @click="toggleClick">
    <div :class="[isActive?'noActiveBj':'isActiveBj']">

    </div>
    <!-- <svg t="1492500959545" @click="toggleClick" class="wscn-icon hamburger" :class="{'is-active':isActive}" style="" viewBox="0 0 1024 1024"
      version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1691" xmlns:xlink="http://www.w3.org/1999/xlink" width="64" height="64">
      <path d="M966.8023 568.849776 57.196677 568.849776c-31.397081 0-56.850799-25.452695-56.850799-56.850799l0 0c0-31.397081 25.452695-56.849776 56.850799-56.849776l909.605623 0c31.397081 0 56.849776 25.452695 56.849776 56.849776l0 0C1023.653099 543.397081 998.200404 568.849776 966.8023 568.849776z"
        p-id="1692"></path>
      <path d="M966.8023 881.527125 57.196677 881.527125c-31.397081 0-56.850799-25.452695-56.850799-56.849776l0 0c0-31.397081 25.452695-56.849776 56.850799-56.849776l909.605623 0c31.397081 0 56.849776 25.452695 56.849776 56.849776l0 0C1023.653099 856.07443 998.200404 881.527125 966.8023 881.527125z"
        p-id="1693"></path>
      <path d="M966.8023 256.17345 57.196677 256.17345c-31.397081 0-56.850799-25.452695-56.850799-56.849776l0 0c0-31.397081 25.452695-56.850799 56.850799-56.850799l909.605623 0c31.397081 0 56.849776 25.452695 56.849776 56.850799l0 0C1023.653099 230.720755 998.200404 256.17345 966.8023 256.17345z"
        p-id="1694"></path>
    </svg> -->
  </div>
</template>

<script>
export default {
  name: 'hamburger',
  props: {
    isActive: {
      type: Boolean,
      default: false
    },
    toggleClick: {
      type: Function,
      default: null
    }
  }
}

</script>

<style lang="scss" scoped>
.hamburger {
	display: inline-block;
	cursor: pointer;
	width: 20px;
	height: 20px;
	transform: rotate(90deg);
	transition: .38s;
	transform-origin: 50% 50%;
}
.hamburger.is-active {
	transform: rotate(0deg);
}
.noActiveBj{
  width: 100%;
  height: 34px;
  margin-top: 15px;
  background: url('../../assets/image/unfold.png') no-repeat center;
  background-size: contain;
}
.isActiveBj{
  width: 14px;
  height: 14px;
  margin: 25px auto;
  background: url('../../assets/image/shrink.png') no-repeat center;
  background-size: contain;
}
.hamhover{
  cursor: pointer;
  width: 100%;
  height: 60px;
  overflow: hidden;
  position: absolute;
  background-color: #25282b;
  z-index: 2;
  top: 52px;
}
.hamhover-padding{
  padding: 0px 20px;
}
// .hamhover+ul{
//   margin-top: 56px;
// }
</style>
