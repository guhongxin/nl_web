<template>
  <el-dialog :title="title?title:'操作详情'" :visible.sync="dialogVisible" width="700px">
    <el-table :data="ext" border style="width: 100%" v-if="keyArr">
      <el-table-column
        :label="item.label" min-width="120" v-for="(item, index) in keyArr" :key="index">
        <template slot-scope="scope">
          <span>{{computedValue(item, scope.row, index)}}</span>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
  import { cardtype_Dictionary } from '@/utils/comm'

  export default {
    name: 'operation-record',
    data() {
      return {
        dialogVisible: false,
        keyArr: null,
        ext: []
      }
    },
    methods: {
      openModel(keyArr, ext) {
        this.dialogVisible = true
        this.keyArr = keyArr
        this.ext = ext
      },
      computedValue(item, row, index) {
        let text = row
        var objkeyArr
        if (typeof item.key === 'string') {
          objkeyArr = item.key.split('.')
        } else {
          objkeyArr = item.key[0].split('.')
        }
        for (let i = 0; i < objkeyArr.length; i++) {
          text = text[objkeyArr[i]]
          if (!text) text = ''
        }
        if (item.type === 'fit_type') {
          text = this.getCourseType(text)
        }
        if (item.type === 'card_type') {
          text = cardtype_Dictionary(text)
        }
        if (item.type === 'phone' && !text) {
          text = '未绑定'
        }
        if (item.type === 'course_time') {
          let text2 = row
          for (let i = 0; i < item.key[1].split('.').length; i++) {
            text2 = text2[item.key[1].split('.')[i]]
            if (!text2) text2 = ''
          }
          text = text + '至' + text2
        }
        return text
      },
      getCourseType(val) {
        switch (val) {
          case 'Z': {
            return '增肌'
          }
          case 'J': {
            return '减脂'
          }
          case 'S': {
            return '塑型'
          }
          default:
            return ''
        }
      }
    },
    props: ['title']
  }
</script>

<style scoped>

</style>
