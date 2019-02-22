<template>
	<div id="aaa">
		<div class="imgbox" v-bind:style="{width: boxWidth + 'px', height: boxHeight + 'px'}">
      <div class="boxclic" v-if="chooseimgbox" @click="imagecropperShow = true">
        <div class="imgupicon"><i class="el-icon-upload"></i></div>
        <div class="iconfont"><a href="javascript:;" @click="imagecropperShow = true">上传图片</a></div>
      </div>
      <div class="showimgbox" v-else>
        <img :src="imgName" alt="ICON">
        <div class="mockbox">
          <div class="boxserbtn">
            <span @click="showBigImg = true">
              <i class="el-icon-zoom-in"></i>
            </span>
            <span @click="deleteimgbtn">
              <i class="el-icon-delete"></i>
            </span>
          </div>
        </div>
      </div>
    </div>
    <image-cropper 
      v-bind:width.sync="imgWidth" 
      v-bind:height.sync="imgHeight" 
      :nature="nature" 
      :url="baseUrl" 
      @close='close' 
      @crop-upload-success="cropSuccess" 
      langType="zh"
      :isToken="isToken"
      :token="token"
      :key="imagecropperKey" 
      v-show="imagecropperShow"
      @uploadErro="uploadErro"></image-cropper>
    <div class="showBigImgbox" v-show="showBigImg" @click="showBigImg = false">
      <img class="ximg" :src="imgName" @click.stop="showBigImg = true" alt="ICON">
    </div>
	</div>
</template>

<script>
import ImageCropper from '@/components/ImageCropper'
export default{
  name: 'test',
  props: {
    boxWidth: {
      type: Number,
      default: 230
    },
    boxHeight: {
      type: Number,
      default: 110
    },
    imgWidth: {
      type: Number,
      default: 230
    },
    imgHeight: {
      type: Number,
      default: 110
    },
    nature: {
      type: Boolean,
      default: false
    },
    isToken: {
      type: Boolean,
      default() {
        return false
      }
    },
    baseUrl: {
      type: String,
      default: '/v1/gym/oss_sign_url'
    },
    token: {
      type: String,
      default: ''
    }
  },
  components: { ImageCropper },
  data() {
    return {
      imagecropperShow: false,
      showBigImg: false,
      imagecropperKey: 0,
      chooseimgbox: true,
      imgName: ''
    }
  },
  mounted() {
  },
  methods: {
    cropSuccess(resData) {
      this.imagecropperShow = false
      this.imagecropperKey += 1
      this.chooseimgbox = false
      this.imgName = resData.url + resData.name
      this.$emit('imgUrl', this.imgName)
    },
    close() {
      this.imagecropperShow = false
    },
    deleteimgbtn() {
      this.chooseimgbox = true
      this.imgName = ''
      this.$emit('clearimgurl', '')
    },
    setImg(url) {
      this.chooseimgbox = false
      this.imgName = url
    },
    uploadErro() {
      this.$emit('uploadErro')
    }

  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.imgbox {
  border: 1px dashed #d9d9d9;
  border-radius: 4px;
  transition: ease 0.2s;
  &:hover {
    border: 1px dashed #409EFF;
  }
}
.el-icon-upload {
  font-size: 44px;
  color: #c0c4cc;
}
.boxclic {
  position: relative;
  top: calc(50% - 28px);
}
.imgupicon {
  width: 44px;
  margin:0 auto 0 auto;
  position: relative;
}
.iconfont {
  font-size: 12px;
  color: #999999;
  text-align: center;
  height: 12px;
  line-height: 12px;
  &>a{
    color: #409EFF;
  }
}
.showimgbox {
  position: relative;
  width: 100%;
  height: 100%;
  &:hover .mockbox {
    display: block;
  }
  img {
    display: block;
    float: left;
    width: 100%;
    height: 100%;
  }
  .mockbox {
    display: none;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba($color: #000000, $alpha: 0.7);
    color: white;
    font-size: 30px;
    transition: 0.2s all ease;
    .boxserbtn {
      height: 36px;
      position: relative;
      top: calc(50% - 18px);
      text-align: center;
      span {
        cursor: pointer;
        transition: 0.2s all ease;
      }
      span:nth-child(1):hover {
        color: #E6A23C;
      }
      span:nth-child(2):hover {
        color: #F56C6C;
      }
    }
  }
}
.showBigImgbox {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba($color: #000000, $alpha: 0.7);
  z-index: 30;
  text-align: center;
}
.ximg {
  max-width: 750px;
  margin-top: 35vh;
  box-sizing: border-box;
  transition: 0.2s ease all;
  border: 1px solid transparent;
}
.ximg:hover {
  border: 1px solid #fff;
}
</style>
