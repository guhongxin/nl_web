<template>
  <div>
    <el-dialog
      :before-close="closeSeatModel"
      title="席位管理" top="8vh" :visible.sync="dialogVisible"
      width="1000px" append-to-body class="seat-dialog">
      <div class="form-box">
        <div class="title-box">
          <div class="lf list">场地列表</div>
          <div class="title-box-head">
            <div class="lf message">场地席位设置</div>
            <el-button v-show="!isEdit && tabList && tabList.length>0" type="success" class="save black-btn" @click="toCanEdit">编辑</el-button>
            <el-button v-show="isEdit" type="success" class="save black-btn edit-btn" @click="submitSave">保存</el-button>
          </div>
        </div>
        <div class="tabs-box cliseer" v-loading="loadingFlag">
          <el-tabs :tab-position="tabPosition" type="card" @tab-click="handleClick" v-model="activeName" ref="tabPane">
            <el-tab-pane disabled>
              <div class="div-btn-box" slot="label">
                <el-button type="primary" class="button black-btn" @click="addListBtn">添加</el-button>
                <el-button type="primary" class="button black-btn" @click="deleteListBtn">删除</el-button>
              </div>
            </el-tab-pane>
            <el-tab-pane label="课程名称" disabled>
              <div slot="label" class="firstTab">
                <span>场地名称</span>
              </div>
            </el-tab-pane>

            <el-tab-pane v-for="(item, index) in tabList" :key="index"
                         :name="item.activeName">
              <div slot="label">
                <span class="spanTitle" :title="item.name">{{item.name}}</span>
              </div>
              <div class="right-data">
                <div class="base-setting">
                  <el-form :inline="true">
                    <el-form-item label="场地名称：" style="width: 30%;">
                      <div v-show="!isEdit">{{baseSettingObj.siteName}}</div>
                      <el-input v-show="isEdit" v-model="baseSettingObj.siteName" :maxlength="10" style="width: 120px;"></el-input>
                    </el-form-item>
                    <el-form-item label="席位数量：" style="width: 20%;">
                      <div v-show="!isEdit">{{baseSettingObj.total}}</div>
                      <el-input v-show="isEdit" v-model="baseSettingObj.total" style="width: 60px;" @blur="changeSeatNum" type="number"></el-input>
                    </el-form-item>
                    <el-form-item label="设置列数：" style="width: 20%;">
                      <div v-show="!isEdit">{{baseSettingObj.col_num}}</div>
                      <el-input v-show="isEdit" v-model="baseSettingObj.col_num" style="width: 60px;" @blur="changeSeatNum"
                                type="number"></el-input>
                    </el-form-item>
                    <span class="text">有效：<span>{{rigthDetailArr.length - baseSettingObj.disabled_num}}</span></span>
                    <span class="text">禁用：<span style="color: #F14C30">{{baseSettingObj.disabled_num}}</span></span>
                  </el-form>
                </div>
                <div class="sit-box">
                  <div class="sit-title">前台大屏幕</div>
                  <div class="sit-content">
                    <div class="sit-tab">
                      <div><img :src="sitWhite">有效</div>
                      <!--<div><img :src="sitGray">已售</div>-->
                      <div><img :src="sitRed">禁用</div>
                    </div>
                    <p class="sit-info">提示：鼠标单击席位可进行查看和编辑</p>
                    <ul class="sit-list">
                      <li v-for="(item, index) in rigthDetailArr" :key="index" @click="openSeatModel(item, index)">
                        <img :src="item.status===0?sitWhite:sitRed">
                        <span :class="[item.status===0?'black':'white']">{{item.show_no||item.show_no===0?item.show_no:item.id}}</span>
                      </li>
                    </ul>
                  </div>
                  <div v-if="!isEdit" class="sit-box-model"></div>
                </div>
              </div>
            </el-tab-pane>
            <div class="placeholder-text" v-if="!tabList || tabList.length <= 0">暂无数据，现在创建一个吧！</div>
          </el-tabs>
        </div>
      </div>
    </el-dialog>
    <!-- 席位信息 -->
    <el-dialog
      title="场地席位信息" :visible.sync="seatDialogVisible"
      width="400px" top="12vh" class="seat-detail">
      <el-form label-width="80px">
        <el-form-item label="默认序号:">
          {{seatBaseInfo.id}}
        </el-form-item>
        <el-form-item label="显示编号:">
          {{seatBaseInfo.rol_num}}排
          <el-input v-model="seatBaseInfo.show_no" style="margin-left: 10px;width: 120px;"></el-input>
        </el-form-item>
        <el-form-item label="状态信息:">
          <el-radio-group v-model="seatBaseInfo.status">
            <el-radio :label="0">启用</el-radio>
            <el-radio :label="1">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注:">
          <el-input v-model="seatBaseInfo.remark" :maxlength="125" placeholder="填写启用和禁用原因"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center">
        <el-button type="success" class="black-btn" @click="changeItemInfo">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import sitRed from '@/assets/icon/sit-red.png'
  import sitGray from '@/assets/icon/sit-gray.png'
  import sitWhite from '@/assets/icon/sit-white.png'
  import { gethallsList, addhallsTemplate, deletehallsTemplate, edithallsTemplate } from '@/api/course'

  export default {
    name: 'seat-management',
    data() {
      return {
        sitRed, sitGray, sitWhite,
        dialogVisible: false,
        seatDialogVisible: false,
        loadingFlag: false,
        btnRequestFlag: false,
        tabPosition: 'left',
        activeName: 'index-0',
        tabList: [], // 左侧tab数据
        indexNow: -1, // 当前索引
        // rigthBaseArr: [], // 右侧座位初始数据
        rigthDetailArr: [], // 右侧座位数据
        baseSettingObj: { // 右侧顶部数据
          el: null,
          siteName: '',
          total: 40,
          col_num: 8,
          disabled_num: 0,
          id: 0
        },
        seatBaseInfo: {
          id: 1,
          show_no: '',
          remark: '',
          status: 0,
          rol_num: 1,
        },
        seatIndex: 0,
        isEdit: false // 当前状态
      }
    },
    methods: {
      openModel() {
        this.tabList = []
        this.dialogVisible = true
        this.isEdit = false
        this.getTemplateList()
      },
      // 点击左侧tab
      handleClick(tab, event) {
        if (this.indexNow === Number(tab.index) - 2) {
          return
        }
        this.isEdit = false
        this.indexNow = Number(tab.index) - 2
        // console.log(this.indexNow)
        this.clickChangeDetail()
      },
      /* 数量、列数变化 */
      changeSeatNum() {
        if (Number(this.baseSettingObj.total) <= 0) {
          this.baseSettingObj.total = 1
        } else if (Number(this.baseSettingObj.col_num) <= 0) {
          this.baseSettingObj.col_num = 1
        }
        if (Number(this.baseSettingObj.col_num) > Number(this.baseSettingObj.total)) {
          this.$message.info('列数不能大于席位数')
          this.baseSettingObj.col_num = this.baseSettingObj.total
        }
        if (Number(this.baseSettingObj.col_num) > 30) {
          this.$message.info('列数不能大于30')
          this.baseSettingObj.col_num = 30
        }
        if (Number(this.baseSettingObj.total) > 200) {
          this.$message.info('席位数量不能大于200')
          this.baseSettingObj.total = 200
        }
        let width = Number(this.baseSettingObj.col_num) * 37
        this.$nextTick(() => {
          if (this.baseSettingObj.el) {
            this.baseSettingObj.el.style.width = width + 'px'
          }
        })
        /* 赋值 */
        if (this.baseSettingObj.total < this.rigthDetailArr.length) {
          this.rigthDetailArr = this.rigthDetailArr.slice(0, this.baseSettingObj.total)
        } else if (this.baseSettingObj.total > this.rigthDetailArr.length) {
          let length = Number(this.baseSettingObj.total - this.rigthDetailArr.length)
          let init = this.rigthDetailArr.length
          for (let i = 0; i < length; i++) {
            this.rigthDetailArr.push({
              id: Number(init) + i + 1,
              remark: '',
              show_no: '',
              status: 0
            })
          }
        }
        this.computedDisabled()
      },
      /* 打开详情model */
      openSeatModel(row, index) {
        this.seatDialogVisible = true
        this.seatBaseInfo.id = row.id
        this.seatBaseInfo.show_no = row.show_no
        this.seatBaseInfo.remark = row.remark
        this.seatBaseInfo.status = row.status
        this.seatBaseInfo.rol_num = Math.ceil((index + 1) / this.baseSettingObj.col_num)
        this.seatIndex = index
      },
      /* 添加模板 */
      addListBtn() {
        this.$confirm('确认添加一个席位模板?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let seats = []
          for (let i = 0; i < 40; i++) {
            seats.push({
              id: i + 1,
              status: 0,
              remark: '',
              show_no: '',
            })
          }
          let data = {
            name: '单车房-模板',
            seat_num: 40,
            column_num: 8,
            seats
          }
          this.loadingFlag = true
          addhallsTemplate(data).then(res => {
            this.$message.success('操作成功')
            this.getTemplateList(this.tabList.length)
          }).catch(res => {
            this.loadingFlag = false
          })
        }).catch(res => {})
      },
      /* 删除模板 */
      deleteListBtn() {
        if (this.indexNow >= 0) {
          this.$confirm('此操作将永久删除该模板, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.loadingFlag = true
            deletehallsTemplate(this.tabList[this.indexNow].id).then(res => {
              this.$message.success('操作成功')
              this.getTemplateList(0)
            }).catch(res => {
              this.loadingFlag = false
            })
          }).catch(res => {})
        } else {
          this.$message.info('请选择模板')
        }
      },
      /* 获取模板列表 */
      getTemplateList(flag) {
        this.loadingFlag = true
        gethallsList().then(res => {
          this.isEdit = false
          res.data.forEach(function(v, i) {
            v.activeName = 'index-' + i
          })
          this.tabList = res.data
          if (res.data.length > 0) {
            if (flag) {
              this.activeName = 'index-' + (flag)
              this.indexNow = flag
            } else {
              this.activeName = 'index-0'
              this.indexNow = 0
            }
          } else {
            this.activeName = null
            this.indexNow = -1
          }
          this.clickChangeDetail()
          this.loadingFlag = false
        }).catch(res => {
          this.loadingFlag = false
        })
      },
      /* 点击左边赋值 */
      clickChangeDetail() {
        let nowDetail = this.tabList[this.indexNow]
        if (nowDetail) {
          this.baseSettingObj.id = nowDetail.id
          this.baseSettingObj.siteName = nowDetail.name
          this.baseSettingObj.total = Number(nowDetail.seat_num)
          this.baseSettingObj.col_num = Number(nowDetail.column_num)
          this.rigthDetailArr = nowDetail.seats
          this.$nextTick(() => {
            this.baseSettingObj.el = this.$refs.tabPane.$el.getElementsByClassName('sit-list')[this.indexNow]
            this.changeSeatNum()
          })
        } else {
          this.baseSettingObj.id = 0
        }
      },
      /* 计算禁用数 */
      computedDisabled() {
        let num = 0
        this.rigthDetailArr.forEach(function(v, i) {
          if (v.status === 1) {
            ++num
          }
        })
        this.baseSettingObj.disabled_num = num
      },
      /* 切换成可编辑 */
      toCanEdit() {
        this.isEdit = true
      },
      /* 提交场地信息 */
      submitSave() {
        if (!this.baseSettingObj.id) {
          this.$message.info('请选择席位模板')
          return
        }
        let data = {
          name: this.baseSettingObj.siteName,
          seat_num: this.baseSettingObj.total,
          column_num: this.baseSettingObj.col_num,
          seats: this.rigthDetailArr
        }
        this.loadingFlag = true
        edithallsTemplate(this.baseSettingObj.id, data).then(res => {
          this.isEdit = false
          this.$message.success('操作成功')
          this.getTemplateList(this.indexNow)
        }).catch(res => {
          this.loadingFlag = false
        })
      },
      /* 修改单个位置信息 */
      changeItemInfo() {
        if (this.seatBaseInfo.show_no && this.seatBaseInfo.show_no.length > 4) {
          this.$message.info('编号长度不能超过4')
          return
        }
        var reg = /^[a-zA-Z0-9]+$/
        if (this.seatBaseInfo.show_no && !reg.test(this.seatBaseInfo.show_no)) {
          this.$message.info('编号只允许数字和字母')
          return
        }
        this.rigthDetailArr[this.seatIndex] = {
          id: this.seatBaseInfo.id,
          show_no: this.toTrim(this.seatBaseInfo.show_no),
          remark: this.toTrim(this.seatBaseInfo.remark),
          status: this.seatBaseInfo.status,
        }
        this.computedDisabled()
        this.seatDialogVisible = false
      },
      closeSeatModel() {
        this.dialogVisible = false
        this.$emit('closeSeatModel')
      },
      toTrim(s) {
        return s.replace(/(^\s*)|(\s*$)/g, '')
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .seat-dialog {
    /deep/ .el-dialog__body {
      padding: 0;
      .black-btn {
        background: #333333;
        border-radius: 3.52px;
        border: none;
        &.edit-btn {
          background: #409eff;
        }
      }
      .el-tabs__item.is-active {
        border-left: 2px solid #1AB394;
      }
      .right-data {
        padding-right: 10px;
        box-sizing: border-box;
        .base-setting {
          font-size: 0;
          padding: 15px 0;
          .el-form-item {
            margin: 0;
            .el-form-item__label {
              padding: 0;
            }
            input {
              width: 100%;
              padding: 0 5px;
            }
          }
          .text {
            width: 15%;
            font-size: 16px;
            line-height: 36px;
            text-align: center;
            display: inline-block;
          }
        }
        .sit-box {
          padding: 15px 10px 0 10px;
          position: relative;
          .sit-title {
            background: #F7F9FA;
            border: 1px solid #CCCCCC;
            height: 70px;
            line-height: 70px;
            font-size: 20px;
            color: #333333;
            text-align: center;
          }
          .sit-content {
            background: #F0F0F0;
            border: 1px solid #CCCCCC;
            border-top: none;
            padding-top: 30px;
            max-height: 500px;
            overflow-y: auto;
            .sit-tab {
              display: flex;
              width: 100%;
              justify-content: center;
              align-items: center;
              > div {
                display: flex;
                margin: 0 15px;
                justify-content: center;
                align-items: center;
              }
              img {
                width: 20px;
                height: 20px;
                margin-right: 5px;
              }
            }
            .sit-info {
              font-size: 14px;
              color: #1878E1;
              text-align: center;
            }
            .sit-list {
              list-style: none;
              font-size: 0;
              margin: 0 auto;
              padding: 0;
              overflow-x: hidden;
              li {
                display: inline-block;
                width: 30px;
                height: 30px;
                margin: 3px;
                font-size: 12px;
                position: relative;
                cursor: pointer;
                img {
                  display: block;
                  height: 100%;
                }
                span {
                  position: absolute;
                  width: 100%;
                  text-align: center;
                  top: 8px;
                  word-break: break-all;
                  line-height: 12px;
                  &.white {
                    color: white;
                  }
                }
              }
            }
          }
          .sit-box-model {
            cursor: not-allowed;
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: calc(100% - 15px);
            background-color: rbga(240, 240, 240, 0.1);
          }
        }
      }
      .tabs-box.cliseer {
        .placeholder-text {
          font-size: 16px;
          color: #999999;
          text-align: center;
          line-height: 300px;
          user-select: none;
        }
      }
    }
  }
  .seat-detail {
    /deep/ .el-dialog__footer {
      .black-btn {
        background: #333333;
        border-radius: 3.52px;
        padding: 10px 60px;
      }
    }
  }
  .title-box {
    color: #333;
    font-size: 16px;
    font-weight: 600;
    line-height: 50px;
    overflow: hidden;
    border: 1px solid #cccccc;
    .save {
      float: right;
      margin-top: 8px;
      margin-right: 20px;
      cursor: pointer;
    }
    .list {
      width: 240px;
      height: 50px;
      border-right: 1px solid #cccccc;
      background: #E7EAEC;
      padding-left: 15px;
      box-sizing: border-box;
    }
    .message {
      padding-left: 15px;
    }
  }
</style>
