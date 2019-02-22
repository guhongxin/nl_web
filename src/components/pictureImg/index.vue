<template>
	<div id="takePicture">
		<div class="imgbox" v-bind:style="{ width: boxWidth + 'px', height: boxHeight + 'px' }">
      <div v-if="chooseimgbox">
        <div class="imgupicon"><i class="el-icon-upload"></i></div>
        <div class="iconfont"><br><a href="javascript:;" @click="imagecropperShow = true">本地上传</a> 或 <a href="javascript:;" @click="initVideo">拍照上传</a></div>
      </div>
      <div class="showimgbox" v-else>
        <img :src="imgName" alt="ICON">
        <div class="mockbox">
          <div class="box">
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
    <image-cropper :width="imgWidth" :height="imgHeight" :url="BaseUrl" @close="close" @crop-upload-success="cropSuccess" langType="zh" :key="imagecropperKey" v-show="imagecropperShow"></image-cropper>
    <div class="showBigImgbox" v-show="showBigImg" @click="showBigImg = false">
      <img class="ximg" :src="imgName" @click.stop="showBigImg = true" alt="ICON">
    </div>
    <div class="showBigImgbox" v-show="showCamera" @click="showCamera = false">
      <div class="photobox" @click.stop="showCamera = true">
        <div class="CimgBox" id="Cvideo">
          <video ref="videoBox" class="Cvdeio" src=""></video>
          <canvas ref="canvasBox" class="Cvdeio Coh" width="320" height="240"></canvas>
          <div class="Cpai">
            <div class="Ccen" v-bind:style="lstyleObject" @click="reset"><img src="../../assets/takepicture/p3.png" alt=""></div>
            <div class="Ccen ind2" @click="cpauses" v-show="showpause"><img src="../../assets/takepicture/p1.png" alt=""></div>
            <div class="Ccen" v-bind:style="rstyleObject" @click="allright"><img src="../../assets/takepicture/p2.png" alt=""></div>
          </div>
        </div>
      </div>
    </div>
	</div>
</template>

<script>
import ImageCropper from '@/components/ImageCropper'
import { getToken } from '@/utils/auth'
import axios from 'axios'
export default{
  name: 'pictureimg',
  components: { ImageCropper },
  props: {
    boxWidth: {
      type: Number,
      default: 220
    },
    boxHeight: {
      type: Number,
      default: 220
    },
    imgWidth: {
      type: Number,
      default: 220
    },
    imgHeight: {
      type: Number,
      default: 220
    }
  },
  data() {
    return {
      baseUrl: '/v1/gym/oss_sign_url',
      showpause: true,
      imagecropperShow: false,
      showBigImg: false,
      imagecropperKey: 0,
      chooseimgbox: true,
      imgName: '',
      showCamera: false,
      lstyleObject: {
        left: '80px',
        opacity: 0
      },
      rstyleObject: {
        left: '80px',
        opacity: 0
      },
      stream: '',
      canvas: '',
      context: '',
      L: '',
      T: '',
      CW: '',
      CH: '',
      W: 240
    }
  },
  watch: {
    showCamera(newval, oldval) {
      if (newval) {
        this.reset()
        this.initVideo()
      } else {
        if (this.stream !== '') {
          if (typeof (this.stream[0]) === 'undefined') {
            this.stream.stop()
          } else {
            this.stream[0].stop()
          }
          this.stream = ''
        }
      }
    }
  },
  mounted() {
    this.canvas = this.$refs.canvasBox
    this.context = this.canvas.getContext('2d')
    this.L = this.canvas.getBoundingClientRect().left
    this.T = this.canvas.getBoundingClientRect().top
    this.CW = this.canvas.width
    this.CH = this.canvas.height
  },
  methods: {
    getUploadURL(url = '/v1/gym/oss_sign_url', type, md5) {
      return axios.post(url, {
        type: type,
        api_token: getToken()
        // content_md5: md5
      })
    },
    initVideo() {
      let self = this
      let videoBox = this.$refs.videoBox
      navigator.getWebcam = (navigator.getUserMedia || navigator.webKitGetUserMedia || navigator.moxGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia)
      if (typeof (navigator.getWebcam) === 'undefined') {
        self.common.message('error', '设备不支持摄像头！')
        self.showCamera = false
      }
      if (navigator.mediaDevices.getUserMedia) { // 标准的API
        try {
          navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 240 }}).then(function(stream) {
            self.stream = typeof stream.stop === 'function' ? stream : stream.getTracks()
            videoBox.src = window.URL.createObjectURL(stream)
            videoBox.play()
            self.showCamera = true
          }).catch(function() {
            navigator.getWebcam({ video: true, audio: false },
              function(stream) {
                self.stream = typeof stream.stop === 'function' ? stream : stream.getTracks()
                videoBox.src = window.URL.createObjectURL(stream)
                videoBox.onloadedmetadata = function(e) {
                  videoBox.play()
                  self.showCamera = true
                }
              },
              function() {
                self.common.message('error', '你的浏览器不支持访问用户媒体设备')
                self.showCamera = false
              }
            )
          })
        } catch (e) {
          navigator.getWebcam({ video: true, audio: false },
            function(stream) {
              self.stream = typeof stream.stop === 'function' ? stream : stream.getTracks()
              videoBox.src = window.URL.createObjectURL(stream)
              videoBox.onloadedmetadata = function(e) {
                videoBox.play()
                self.showCamera = true
              }
            },
            function() {
              self.common.message('error', '未发现摄像头！')
              self.showCamera = false
            }
          )
        }
      } else { // WebKit 核心的API
        navigator.getWebcam({ 'video': { width: 320, height: 240 }},
          function(stream) {
            self.stream = typeof stream.stop === 'function' ? stream : stream.getTracks()
            videoBox.video.src = window.URL.createObjectURL(stream)
            videoBox.video.onloadedmetadata = function(e) {
              videoBox.video.play()
              self.showCamera = true
            }
          },
          function() {
            self.common.message('error', '未发现摄像头！')
            self.showCamera = false
          }
        )
      }
    },
    allright() {
      this.context.drawImage(this.$refs.videoBox, 0, 0, this.CW, this.CH)
      let dataImg = this.context.getImageData((this.CW - this.CH) / 2, 0, this.W, this.W)
      let canvas2 = document.createElement('canvas')
      canvas2.width = this.W
      canvas2.height = this.W
      var cxt2 = canvas2.getContext('2d')
      cxt2.putImageData(dataImg, 0, 0)
      var cuteimgData = convertCanvasToImage(canvas2)
      let fileReader = new FileReader()
      fileReader.readAsArrayBuffer(cuteimgData)
      let self = this
      fileReader.onload = function(evt) {
        if (evt.target.readyState === FileReader.DONE) {
          let imgFlag = evt.target.result
          let type = cuteimgData.type
          self.getUploadURL(undefined, type).then(res => {
            let xhr = new XMLHttpRequest()
            xhr.open('PUT', res.data.url)
            xhr.setRequestHeader('Content-Type', 'application/file')
            xhr.upload.onprogress = function(ess) {
              if (ess.lengthComputable) {
                let progress = Math.ceil(100 * Math.round(ess.loaded) / ess.total)
                console.log('正在提交.' + progress + '%') // 在控制台打印上传进度
              }
            }
            xhr.onload = function(e) {
              self.cropSuccess({ name: res.data.filename, url: 'https://' + res.data.bucket + '.' + res.data.endpoint + '/' })
              self.setImg(self.imgName)
              self.reset()
              self.showCamera = false
            }
            xhr.onerror = function(e) {
              self.common.message('error', '图片上传出错！请重试')
            }
            xhr.send(imgFlag)
          })
        }
      }
    },
    reset() {
      this.lstyleObject.left = '80px'
      this.lstyleObject.opacity = 0
      this.rstyleObject.left = '80px'
      this.rstyleObject.opacity = 0
      this.showpause = true
      this.context.clearRect(0, 0, this.CW, this.CH)
      this.$refs.videoBox.play()
    },
    cpauses() {
      this.$refs.videoBox.pause()
      this.lstyleObject.left = '20px'
      this.lstyleObject.opacity = 1
      this.rstyleObject.left = '140px'
      this.rstyleObject.opacity = 1
      this.showpause = false
      this.context.clearRect(0, 0, this.CW, this.CH)
    },
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
    }
  },
  computed: {
    BaseUrl() {
      let result = this.baseUrl
      return result
    }
  }
}
// Converts canvas to an image
function convertCanvasToImage(canvase) {
  var image = new Image()
  image.src = canvase.toDataURL('image/png')
  return convertBase64UrlToBlob(image.src)
}
/**
 * 将以base64的图片url数据转换为Blob
 * @param urlData
 * 用url方式表示的base64图片数据
 */
function convertBase64UrlToBlob(urlData) {
  var bytes = window.atob(urlData.split(',')[1]) // 去掉url的头，并转换为byte
  // 处理异常,将ascii码小于0的转换为大于0
  var ab = new ArrayBuffer(bytes.length)
  var ia = new Uint8Array(ab)
  for (var i = 0; i < bytes.length; i++) {
    ia[i] = bytes.charCodeAt(i)
  }
  return new Blob([ab], { type: 'image/png', name: '1.png' })
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.clese {
  font-size: 20px;
  position: absolute;
  right: 0px;
  top: 0px;
}
.ind2 {
  z-index: 2;
}
.ind1 {
  z-index: 1;
}
.Cpai {
  height: 34px;
  width: 240px;
  overflow: hidden;
  position: absolute;
  bottom: 10px;
  left: 0;
  font-size: 14px;
}
.Cvdeio {
    width: 320px;
    height: 240px;
    margin-left: -40px;
}
.Coh {
    position: absolute;
    top: 0;
    left: 0;
}
.CimgBox {
    position: absolute;
    width: 240px;
    height: 240px;
    left: 0;
    top: 0;
    overflow: hidden;
    transition: .25s all ease;
}
.Ccen {
    position: absolute;
    left: 80px;
    width: 80px;
    height: 34px;
    cursor: pointer;
    text-align: center;
    transition: 0.25s all ease;
}
.photobox {
  border: 1px solid #ffffff;
  height: 240px;
  width: 240px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-left: -120px;
  margin-top: -120px;
}
.imgbox {
  border: 1px dashed #d9d9d9;
  border-radius: 4px;
  transition: ease 0.2s;
  &:hover {
    border: 1px dashed #409EFF;
  }
}
.el-icon-upload {
  font-size: 67px;
  color: #c0c4cc;
}
.imgupicon {
  width: 67px;
  margin: 63.5px auto 0 auto;
}
.iconfont {
  font-size: 12px;
  color: #999999;
  text-align: center;
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
    .box {
      height: 36px;
      margin-top: 50%;
      background-color: transparent;
      padding: 0;
      position: relative;
      top: -18px;
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
