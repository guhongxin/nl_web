<template>
  <div class="chatRecordItem2">
    <template>
      <div>
        <div class="voice-box" @click="playAudioBtn">
          <template v-if="!isPlay">
            <img
              class="voice0"
              :src="require('../../assets/image/voice0.png')" />
            <img
              class="voice1"
              :src="require('../../assets/image/voice1.png')" />
            <img
              class="voice2"
              :src="require('../../assets/image/voice2.png')" />
          </template>
          <img :src="require('../../assets/image/voice5.gif')" v-else class="voice5" />
            <!-- <span class="voice-time">{{audioDuration}}<sup>〞</sup></span> -->
          <span class="voice-time">{{timeLenth}}<sup>〞</sup></span>
        </div>
      </div>
    </template>
  </div>
</template>
<script>
export default {
  name: 'chatRecordItem2',
  props: {
    audioSrc: {
      type: String
    },
    timeLenth: {},
    audioArm: {}
  },
  data() {
    return {
      plas: false,
      dt: [1, 2, 3],
      audioDuration: 0,
      isPlay: false
    }
  },
  mounted() {},
  methods: {
    playAudioBtn() {
      // 时长为零的禁止点击
      if (this.timeLenth === 0 || !this.audioArm) {
        return false
      }
      let that = this
      if (this.audioArm.isPlaying()) {
        this.audioArm.stop()
        this.audioArm.onStop(function() {
          // 停止播放
          that.isPlay = false
        })
      } else {
        this.audioArm.play()
        that.isPlay = true
        this.audioArm.onPlay(function() {
          // 开始播放
        })
      }
      this.audioArm.onEnded(function() {
        that.isPlay = false
        // 播放结束
      })
    },
    speakerDz() {
      let i = -1
      let that = this
      this.dt = [1]
      this.timers = setInterval(function() {
        i = (i + 1) % 4
        if (i < 2) {
          that.dt.push(i)
        } else {
          that.dt.pop()
        }
      }, 100)
    },
    speakerStop() {
      this.dt = [0, 1, 2]
      clearInterval(this.timers)
    }
  },
  destroyed() {
    let that = this
    if (!this.audioArm) {
      return false
    }
    this.audioArm.stop()
    this.audioArm.onStop(function() {
      // 停止播放
      that.speakerStop()
    })
  }
}
</script>
<style lang="scss" scoped>
.chatRecordItem2{
  display: inline-block;
  vertical-align: middle;
  .contacts{
    height: 20px;
    font-size: 18px;
    color: #333333;
    vertical-align: top;
    line-height: 20px;
    span{
      color: #999999;
      font-size: 12px;
      line-height: 20px;
      margin-right: 15px;
      float: right;
    }
  }
  .voice-box{
    width: 147px;
    height: 40px;
    border-radius: 4px;
    background-color: #1AB394;
    // margin-top: 12px;
    position: relative;
    display: inline-block;
    // vertical-align: bottom;
    img{
      width: 17px;
      height: 17px;
      position: absolute;
      top: 11.5px;
    }
    .voice0{
      left: 2px;
    }
    .voice1{
      left: 6px;
    }
    .voice2{
      left: 10px;
    }
    .voice5{
      left: 2px;
    }
    .voice-time{
      color: #ffffff;
      font-size: 16px;
      position: absolute;
      right: 14px;
      top: 8px;
    }
  }
  .chat-text{
    color: #333333;
    font-size: 14px;
    margin-top: 12px;
  }
}
</style>
