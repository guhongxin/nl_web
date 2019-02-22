<template>
  <div class="chartRecordItem-box">
    <div class="chartRecord-head">
      <div class="contact-infor">
        <img :src="contactImg" class="contact-img">
        <span class="contact-name">
          {{contactName}}
        </span>
      </div>
      <div class="contact-time">{{contactTime}}</div>
    </div>
    <div class="chartRecord-content">
      <p class="leave-message" v-if='leaveMessage'>
        留言:
        <span class="leave-message-contact">
          {{leaveMessage}}
        </span>
      </p>
      <div class="voice-box" v-if="audioSrc&&audioSrc.length>0&&audioSrc[0].Length">
        语音:
        <template v-if="audioSrc.length>0" v-for="(item, key) in audioSrc">
          <!-- <audio-item v-if='item.Url' 
            :audioSrc="item.Url" 
            :audioArm="item.arm"
            :key="key"
            :timeLenth ="item.Length"></audio-item> -->
          <audio-item1
            :audioSrc="item.Url" 
            :audioArm="item.arm"
            :key="key"
            :timeLenth ="item.Length"></audio-item1>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
import AudioItem1 from '../audioItem1/audioItem1'
export default {
  name: 'chartRecordItem',
  props: {
    contactName: {
      type: String
    },
    contactImg: {
      type: String
    },
    contactTime: {
      type: String
    },
    leaveMessage: {
      type: [String, Object],
      default() {
        return ''
      }
    },
    audioSrc: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      isPlay: false,
      audioDuration: null,
      dt: [0, 1, 2],
      timers: null
    }
  },
  created() {
  },
  methods: {},
  components: {
    AudioItem1
  }
}
</script>
<style lang="scss" scoped>
  .chartRecordItem-box{
    padding: 20px 20px;
    width: 100%;
    border-bottom: 1px solid #DDDDDD;
    .chartRecord-head {
      height: 40px;
      width: 100%;
      .contact-infor{
        display: inline-block;
        .contact-img{
          width: 40px;
          height: 40px;
          border-radius: 50%;
          vertical-align: middle;
        }
        .contact-name{
          color: #464646;
          margin-left: 15px;
        }
      }
      .contact-time{
        float: right;
        line-height: 40px;
        color: #999999;
        margin-right: 15px;
      }
    }
    .chartRecord-content{
      padding: 15px 55px;
      .leave-message{
        .leave-message-contact{
          margin-left: 10px;
        }
      }
      .voice-box{
        margin-top: 30px;
        .voiceControl-box{
          background-color: #1AB394;
          height: 40px;
          min-width: 120px;
          border-radius: 5px;
          margin-left: 10px;
          display: inline-block;
          vertical-align: middle;
          padding-left: 10px;
          padding-right: 10px;
          position: relative;
          img{
            width: 20px;
            height: 20px;
          }
          .voice0{
            position: absolute;
            left: 0px;
            top: 10px;
          }
          .voice1{
            position: absolute;
            left: 5px;
            top: 10px;
          }
          .voice2{
            position: absolute;
            left: 10px;
            top: 10px;
          }
          .voice-time{
            color: #ffffff;
            position: absolute;
            top: 8px;
            left: 32px;
          }
        }
      }
    }

  }
</style>


