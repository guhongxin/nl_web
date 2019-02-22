<template>
    <div class="vipCard-style">
			<div class="vipCard">
				<!-- <h3 class="cardTitle">你还未购卡</h3>
				<p>购买会员卡可以在线预约私教课程</p>
				<p style="margin-top: 0px;">快去健身房逛逛吧</p>
				<div class="GoBtn" @click="goBtn">立即前往</div> -->
				<h3 class="cardTitle">开卡</h3>
				<p>点击“立即前往”可为会员开卡</p>
				<div class="GoBtn" @click="goBtn">立即前往</div>
			</div>
    </div>
</template>
<script>
export default {
  name: 'VipCardStyle1',
  methods: {
    goBtn() {
      this.$emit('goOpenCard')
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.vipCard-style {
  flex: 1;
  .vipCard {
    height: 188px;
    border-radius: 10px;
		background:-webkit-gradient(linear,left bottom, left top, from(#48434E), to(#575A61));
    position: relative;
		overflow: hidden;
		.cardTitle{
			font-size: 20px;
			font-weight: 500;
			color: #fff;
			margin-top: 20px;
			margin-left: 20px;
		}
		p{
			font-size: 14px;
			color: rgba($color: #fff, $alpha: 0.7);
			margin: -12px 0px 0px 20px;
		}
		.GoBtn{
			width: 120px;
			height: 35px;
			text-align: center;
			line-height: 35px;
			border: 1px solid #fff;
			color: #fff;
			border-radius: 5px;
			position: absolute;
			right: 10px;
			bottom: 10px;
			// margin: 10px auto;
			cursor: pointer;
		}
  }

}
</style>

