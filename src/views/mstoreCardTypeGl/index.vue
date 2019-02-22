<template>
  <div class="mstoreCardTypeGl">
    <div class="mstoreCardTypeGl-box">
      <div class="filter-container">
        <scan-input :select="searchSelect" :defaultSelect="searchSelect[0].value" @kedownOver="searchlist" ref="scanIputDoc"></scan-input>
        <el-button class="lf staffAdd" @click="addcard"><i class="el-icon-plus"></i> 添加卡种</el-button>
        <bulk-action :select="batchOperation1" @changeBulk="searchGroup"></bulk-action>
      </div>
    </div>
    <div class="tagbox" v-if="tags.length">
      <div class="tablesmall" v-if="common.getClass('span', 'mar10').length">共查找到<span v-text="total"></span>条</div>
      <span class="mar10" v-if="tag" v-for="(tag, index) in tags" :key="index">
        <el-tag
        v-if="tag"
        closable
        :type="tag.type"
        @close="tagclose(tag, index)">
        {{tag.name}}
      </el-tag>
      </span>
    </div>
    <el-table @filter-change="filterChange" 
      @sort-change="sortChange" stripe 
      :key='tableKey' 
      :data="tableList" v-loading="listLoading" element-loading-text="列表正在加载中" border fit highlight-current-row
      style="width: 100%;" class="check-table"
      @selection-change="selectionChange">
      <el-table-column align="center" type="selection" width="55px"></el-table-column>

      <el-table-column align="center" :label="'卡种名称'" width="150" prop="name">
        <template slot-scope="scope">
         <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>

      <el-table-column column-key="type" align="center" :label="'卡种类型'" width="120" prop="type"
        :filters="[{text: '时效卡', value: '1', class: 'ctype'}, {text: '次卡', value: '2'}]"
        filter-placement="bottom-end" :filter-multiple="false">
        <template slot-scope="scope">
          <span>{{scope.row.type === 1 ? '时效卡' : '次卡'}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="'支持的分店（包括“售卡”与“使用”）'" width="300" prop="times">
        <template slot-scope="scope">
          <span v-for="(item, key) in scope.row.gyms" :key="key">
            {{item.name}}
          </span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="'总时间'" width="150" sortable="custom" prop="times_sort">
        <template slot-scope="scope">
          <span>{{ scope.row.type===1 ? scope.row.times + '天': '-'}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="'次数'" width="150" sortable="custom" prop="times_sort">
        <template slot-scope="scope">
          <span>{{ scope.row.type===2 ? scope.row.times + '次': '-'}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="'价格(元)'" width="150" sortable="custom" prop="price_sort">
        <template slot-scope="scope">
          <span>{{scope.row.price}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="'底价(元)'" width="150" sortable="custom" prop="floor_price_sort">
        <template slot-scope="scope">
          <span>{{scope.row.floor_price}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="'SAAS销售'" width="150" prop="saas_status">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.saas_status" :active-value='2' :inactive-value="1"  @change="saasStatusChange(scope.$index, scope.row)"></el-switch>
        </template>
      </el-table-column>
	    <el-table-column align="center" :label="'APP销售'" width="150" prop="app_status">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.app_status" @change="appStatusChange(scope.$index, scope.row)" :disabled="!IsAuthPass" :active-value='2' :inactive-value="1"></el-switch>
        </template>
      </el-table-column>

      <el-table-column width="150px" align="center" :label="'卡种封面'">
        <template slot-scope="scope">
          <span><img :src="scope.row.photo" @click="common.bigImg($event)" alt="icon" width="60" height="30" style="margin-left:35px;display: list-item;cursor:pointer;"></span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="'备注'" width="150" prop="remark">
        <template slot-scope="scope">
          <span>{{scope.row.remark}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="'销售数量'" width="150" sortable="custom" prop="sale_num_sort">
        <template slot-scope="scope">
          <span>{{scope.row.sale_num}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="'销售额'" width="150" sortable="custom" prop="sale_total_sort">
        <template slot-scope="scope">
          <span>{{scope.row.sale_total}}</span>
        </template>
      </el-table-column>

      <el-table-column width="200px" align="center" label="添加时间<i class='el-icon-date'></i>" sortable="custom" prop="id_sort">
        <template slot-scope="scope">
          <span>{{scope.row.created_at}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" fixed="right" :label="$t('table.actions')" min-width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="primary"
            @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="info" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination 
        v-if="paginationShow"
        background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
        :page-sizes="[10,20,30,50]" :page-size="listQuery.per_page" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <card-type-porp
      ref="cardTypePorpDoc"
      :v-if="cardTypePorpShow"
      :title="cardTypeTitle"
      :widthSize="'800px'"
      :IsAuthPass="IsAuthPass"
      :isAddCardType="isAddCardType"
      :dialogVisible="cardTypePorpShow"
      @dialogClosed="cardTypePorpClosed"
      @cardTypePorpBtnOk="cardTypePorpBtnOk"></card-type-porp>
    <!-- 删除卡模板 -->
    <delete-dialog 
      :tipMessage="'确定要删除选中的卡模板?'"
      ref="deleteDialogDoc"
      @deleteSureBtn='deleteCardSure'></delete-dialog>
  </div>
</template>
<script>
// 多店---卡种管理
import scanInput from '@/components/scanInput'
import bulkAction from '@/components/bulkAction'
import CardTypePorp from './components/cardTypePorp'
import { msCardTypeList, deletemsCardType, msCardTypeBtUp, msCardTypeBtDown, msCardTypesingleUp, msCardTypesingleDown } from '@/api/mstoreCardType'
import { getSession } from '@/utils/auth'
import deleteDialog from '@/components/deleteDialog'
export default {
  name: 'mstoreCardTypeGl',
  data() {
    return {
      searchSelect: [{
        text: '卡种名称',
        value: 'name_like'
      }, {
        text: '备注',
        value: 'remark_like'
      }],
      tableList: [],
      tableKey: 0,
      listLoading: false,
      paginationShow: true,
      listQuery: {
        page: 1,
        per_page: 10
      },
      total: 0,
      IsAuthPass: 0, // 是否通过认证
      isAddCardType: true, // 是否添加或者编辑卡种 true-添加卡种 false-编辑
      batchOperation: [{
        label: '批量app下架',
        value: 'app-1',
        key: '5-1-4'
      }, {
        label: '批量app上架',
        value: 'app-2',
        key: '5-1-5'
      }, {
        label: '批量saas下架',
        value: 'saas-1',
        key: '5-1-6'
      }, {
        label: '批量saas上架',
        value: 'saas-2',
        key: '5-1-7'
      }],
      cardTypePorpShow: false,
      cardTypeTitle: '',
      tags: [],
      groupOprate: {
        ids: []
      },
      deleteId: 0 // 要删除的卡种id
    }
  },
  methods: {
    searchlist(obj) {
      if (obj.value === '') {
        delete this.tags[0]
      } else {
        let tagszh = {
          name_like: '卡种名称:',
          remark_like: '备注:'
        }
        this.$set(this.tags, 0, { 'name': `${tagszh[obj.type]}${obj.value}`, 'type': obj.type })
      }
      delete this.listQuery.name_like
      delete this.listQuery.remark_like
      this.listQuery[obj.type] = obj.value
      this.listQuery.page = 1
      this.pageInit()
      this.cardTypeList()
    },
    tagclose(tag, index) {
      this.common.tagFilter(this, tag, index, this.searchSelect)
    },
    filterChange(data) {
      for (let key in data) {
        this.listQuery[key] = data[key][0]
        this.lotFilter(data, key)
      }
      this.listQuery.page = 1
      this.pageInit()
      this.cardTypeList()
    },
    lotFilter(data, key) {
      if (key === 'type') {
        this.hostFilter(data, key, 1, data[key][0] === '1' ? '卡类型：时效卡' : '卡类型：次卡')
      }
    },
    hostFilter(data, key, index, text) {
      if (data[key].length === 0) {
        delete this.tags[index]
      } else {
        this.$set(this.tags, index, { name: text, type: key })
      }
    },
    sortChange(data) {
      this.common.sortFilter(this, data)
      this.cardTypeList()
    },
    selectionChange(selection) {
      // 表格选中多选框
      this.groupOprate.ids = []
      for (let i = 0; i < selection.length; i++) {
        this.groupOprate.ids.push(selection[i].id)
      }
    },
    handleSizeChange(val) {
      this.listQuery.per_page = val
      this.cardTypeList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.cardTypeList()
    },
    addcard() {
      // 添加卡种
      this.cardTypeTitle = '添加卡种'
      this.isAddCardType = true
      this.cardTypePorpShow = true
    },
    cardTypePorpClosed() {
      // 关闭卡种操作弹窗
      this.isAddCardType = true
      this.cardTypePorpShow = false
    },
    searchGroup(param) {
      // 批量操作
      if (!this.groupOprate.ids.length) {
        this.common.message('warning', '请先选择会员卡')
        return
      }
      let arr = param.split('-')
      let _infor = arr[0] + '市场批量' + (arr[1] === '1' ? '下架' : '上架')
      if (arr[0] === 'app') {
        this.groupOprate.type = 2
      } else {
        this.groupOprate.type = 1
      }
      this.$confirm(`是否${_infor}`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (_infor.indexOf('下架') !== -1) {
          msCardTypeBtDown(this.groupOprate).then(res => {
            this.$message({
              message: '批量下架成功',
              type: 'success'
            })
            this.cardTypeList()
          })
        } else {
          msCardTypeBtUp(this.groupOprate).then(res => {
            this.$message({
              message: '批量上架成功',
              type: 'success'
            })
            this.cardTypeList()
          })
        }
      }).catch(() => {
        console.log('取消删除')
      })
    },
    cardTypeList() {
      // 多店卡种列表
      this.listLoading = true
      msCardTypeList(this.listQuery).then(res => {
        let data = res.data
        this.listLoading = false
        this.tableList = data
        this.total = Number(res.headers.pagination.split(',')[1])
      }).catch(err => {
        console.log(err)
        this.listLoading = false
      })
    },
    handleEdit(row) {
      // 编辑多店卡种模板
      this.cardTypeTitle = '编辑卡种'
      this.isAddCardType = false
      this.cardTypePorpShow = true
      this.$nextTick(() => {
        this.$refs.cardTypePorpDoc.getInitVal(row)
      })
    },
    handleDelete(row) {
      // 删除多店卡种模板
      this.deleteId = row.id
      this.$nextTick(() => {
        this.$refs.deleteDialogDoc.dialogShow()
      })
    },
    deleteCardSure() {
      deletemsCardType(this.deleteId).then(res => {
        if (res) {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.$refs.deleteDialogDoc.dialogClose()
          this.cardTypeList()
        }
      }).catch(err => {
        console.log(err)
        this.$refs.deleteDialogDoc.dialogLoadingClose()
      })
    },
    pageInit() {
      // 分页器初始化
      this.paginationShow = false
      this.$nextTick(() => {
        this.paginationShow = true
      })
    },
    cardTypePorpBtnOk() {
      // 通卡卡种弹窗操作点击确认按钮
      this.isAddCardType = true
      this.cardTypePorpShow = false
      this.listQuery.page = 1
      this.pageInit()
      this.cardTypeList()
    },
    appStatusChange(index, row) {
      // 表格里面app销售
      let middleIsPost = row.app_status === 2 ? 1 : 2
      let obj = {
        id: row.id,
        type: 2
      }
      if (row.app_status === 2) {
        msCardTypesingleUp(obj).then(res => {
          this.$message({
            message: '上架成功',
            type: 'success'
          })
          this.cardTypeList()
        }).catch(err => {
          console.log(err)
        })
      } else {
        msCardTypesingleDown(obj).then(res => {
          this.$message({
            message: '下架成功',
            type: 'success'
          })
          this.cardTypeList()
        }).catch(err => {
          console.log(err)
          row.app_status = middleIsPost
          this.$set(this.tableList, index, row)
        })
      }
    },
    saasStatusChange(index, row) {
      // 表格里面sass销售
      let middleIsPost = row.saas_status === 2 ? 1 : 2
      let obj = {
        id: row.id,
        type: 1
      }
      if (row.saas_status === 2) {
        msCardTypesingleUp(obj).then(res => {
          this.$message({
            message: '上架成功',
            type: 'success'
          })
          this.cardTypeList()
        }).catch(err => {
          console.log(err)
        })
      } else {
        msCardTypesingleDown(obj).then(res => {
          this.$message({
            message: '下架成功',
            type: 'success'
          })
          this.cardTypeList()
        }).catch(err => {
          console.log(err)
          row.saas_status = middleIsPost
          this.$set(this.tableList, index, row)
        })
      }
    }
  },
  computed: {
    chooseSelect() {
      return this.searchSelect[0].value
    },
    batchOperation1() {
      let result = []
      if (!this.IsAuthPass) {
        // 不通过
        this.batchOperation.map(item => {
          let obj = {}
          if (item.label.indexOf('app') !== -1) {
            obj = Object.assign({}, item, { disabled: true })
          } else {
            obj = Object.assign({}, item)
          }
          result.push(obj)
        })
      } else {
        // 通过
        return this.batchOperation
      }
      console.log('result', result)
      return result
    }
  },
  created() {
    if (getSession('gymIsPass') === '1') { // 已审核
      this.IsAuthPass = 1
    } else {
      this.IsAuthPass = 0
    }
    this.cardTypeList()
  },
  components: {
    scanInput,
    bulkAction,
    CardTypePorp,
    deleteDialog
  }
}
</script>

<style lang="scss" scoped>
.mstoreCardTypeGl-box{
  width: 100%;
  background-color: #ffffff;
  border: 1px solid #CCCCCC;
  margin-bottom: 20px;
  padding: 20px;
  overflow: hidden;
}
.mstoreCardTypeGl{
  .pagination-container{
    margin-top: 0px;
    text-align: right;
    padding: 30px 15px 20px;
  }
  .staffAdd{
    background: rgb(51, 51, 51);
    margin-left: 20px;
    color: #fff;
  }
}
</style>

