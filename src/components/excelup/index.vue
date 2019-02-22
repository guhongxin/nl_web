<template>
  <div>
    <input id="excel-upload-input" type="file" accept=".xlsx, .xls" class="c-hide" @change="handkeFileChange">
    <div id="drop" @drop="handleDrop" @dragover="handleDragover" @dragenter="handleDragover">
      {{text}}
      <el-button style="margin-left:16px;" size="mini" type="primary" @click="handleUpload">选择文件</el-button>
    </div>
    <div class="biser">
      <el-button type="info" class="diue" @click="cencel">取消</el-button>
      <el-button type="primary" class="diue" @click="uploaded">上传</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      from: '',
      text: '拖拽文件到此处'
    }
  },
  computed: {
  },
  methods: {
    cencel() {
      this.text = '拖拽文件到此处'
      document.getElementById('excel-upload-input').value = ''
      this.$emit('cencel-upload', true)
    },
    uploaded() {
      if (!this.from) {
        this.common.message('error', '请选择文件')
        return false
      }
      this.$emit('on-selected-file', this.from)
    },
    handleDrop(e) {
      e.stopPropagation()
      e.preventDefault()
      const files = e.dataTransfer.files
      if (files.length !== 1) {
        this.$message.error('Only support uploading one file!')
        return
      }
      const itemFile = files[0] // only use files[0]
      this.text = itemFile.name
      this.readerData(itemFile)
      e.stopPropagation()
      e.preventDefault()
    },
    handleDragover(e) {
      e.stopPropagation()
      e.preventDefault()
      e.dataTransfer.dropEffect = 'copy'
    },
    handleUpload() {
      document.getElementById('excel-upload-input').click()
    },
    handkeFileChange(e) {
      const files = e.target.files
      const itemFile = files[0] // only use files[0]
      this.text = itemFile.name
      this.readerData(itemFile)
    },
    readerData(itemFile) {
      let from = new FormData()
      from.encoding = 'multipart/form-data'
      from.append('file', itemFile)
      this.from = from
      /* const reader = new FileReader()
      reader.onload = e => {
        const data = e.target.result
        const fixedData = this.fixdata(data)
      }
      reader.readAsArrayBuffer(itemFile) */
    },
    fixdata(data) {
      let o = ''
      let l = 0
      const w = 10240
      for (; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)))
      o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)))
      return o
    }
  }
}
</script>

<style scoped>
.biser {
  width: 100%;
  margin-top: 30px;
  text-align: center;
}
.diue {
  width: 100px;
}
#excel-upload-input{
  display: none;
  z-index: -9999;
}
#drop{
  border: 2px dashed #bbb;
  width: 600px;
  height: 160px;
  line-height: 160px;
  margin: 0 auto;
  font-size: 24px;
  border-radius: 5px;
  text-align: center;
  color: #bbb;
  position: relative;
}
</style>
