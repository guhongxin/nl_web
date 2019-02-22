<template>
  <div class="app-container documentation-container">
    <div class="find-box4">
      <div style="overflow:hidden" class="filter-container">
        <!-- <div style="width: 300px; float: left;">
          <el-input placeholder="请输入卡种名称" v-model="searchCardName" v-on:keyup.enter.native="search" class="input-with-select">
            <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
          </el-input>
        </div> -->
        <scan-input :select="searchSelect" @changeOver="scaninputselect" @kedownOver="scaninputover" :defaultSelect="chooseSelect" :placeholder="searchSelectTxt" ref="scanIputDoc"></scan-input>
        <el-button class="lf staffAdd" @click="addcard"  v-if="btnRoleList['5-1-1']"><i class="el-icon-plus"></i> 添加卡种</el-button>
        <bulk-action :select="batchOperation1" @changeBulk="searchGroup"></bulk-action>
        <span class="Rrrefresh" @click="__init">
          <el-button icon="el-icon-refresh" circle></el-button>
        </span>
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
      :key='tableKey' :data="tableList" v-loading="listLoading" element-loading-text="列表正在加载中" border fit highlight-current-row
      style="width: 100%;" class="check-table"
      @selection-change="selectionChange">
      <el-table-column align="center" type="selection" width="55px"></el-table-column>

      <el-table-column align="center" :label="'卡种名称'" width="150" prop="name">
        <template slot-scope="scope">
          <span><span v-if="scope.row.master_id" class="through">通</span>{{scope.row.name}}</span>
        </template>
      </el-table-column>

      <el-table-column column-key="type" align="center" :label="'卡种类型'" width="120" prop="type"
        :filters="[{text: '时效卡', value: 1, class: 'ctype'}, {text: '次卡', value: 2}, {text: '存储卡', value: 3}]"
        filter-placement="bottom-end" :filter-multiple="false">
        <template slot-scope="scope">
          <span>{{getcardtype_Dictionary(scope.row.type)}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="'充值金额（元）'" width="150" sortable="custom" prop="times">
        <template slot-scope="scope">
          <span>{{ scope.row.type===3 ? scope.row.times + '元' : '-'}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="'总时间'" width="150" prop="times">
        <template slot-scope="scope">
          <span>{{ scope.row.type===1 ? scope.row.times + '天' : '-'}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="'次数'" width="150" prop="times">
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
          <el-switch v-model="scope.row.saas_status" active-text="" inactive-text=""  @change="saasStatusChange(scope.row)" :disabled="scope.row.master_id?true:false"></el-switch>
        </template>
      </el-table-column>
	    <el-table-column align="center" :label="'APP销售'" width="150" prop="app_status">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.app_status" @change="appStatusChange(scope.row)" :disabled="scope.row.master_id?true:false||!IsAuthPass"></el-switch>
        </template>
      </el-table-column>

      <el-table-column width="150px" align="center" :label="'卡种封面'">
        <template slot-scope="scope">
          <span><img :src="scope.row.photo" @click="common.bigImg($event)" alt="icon" width="60" height="30" style="margin-left:35px;display: list-item;cursor:pointer;"></span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="'销售数量'" width="150" sortable="custom" prop="card_count">
        <template slot-scope="scope">
          <span>{{scope.row.card_count}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="'销售额'" width="150" sortable="custom" prop="sale">
        <template slot-scope="scope">
          <span>{{scope.row.sale}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="'排序'" width="150" prop="weight_sort" sortable="custom">
        <template slot-scope="scope">
          <span>{{scope.row.weight}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="'备注'" width="150" prop="remark">
        <template slot-scope="scope">
          <span>{{scope.row.remark}}</span>
        </template>
      </el-table-column>

      <el-table-column width="200px" align="center" 
        label="创建时间<i onclick='openDate(event)' data=[2,'created_at_sdate','created_at_edate'] class='el-icon-date' title='创建时间'></i>"
        sortable="custom" prop="created_at_sort">
        <template slot-scope="scope">
          <span>{{scope.row.created_at}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" fixed="right" :label="$t('table.actions')" min-width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope" v-if="!scope.row.master_id">
          <el-button size="mini" type="primary" plain
          @click="handleEdit(scope.$index, scope.row)"  v-if="btnRoleList['5-1-2']">编辑</el-button>
          <el-button size="mini" type="danger" plain  
          @click="handleDelete(scope.$index, scope.row)" v-if="btnRoleList['5-1-3']">删除</el-button>
          <!-- <el-dropdown trigger="click">
            <el-button size="mini" type="danger" plain  v-if="btnRoleList['5-1-3']">删除</el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="handleDelete(scope.$index, tableList)">确定</el-dropdown-item>
              <el-dropdown-item>取消</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown> -->
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

    <el-dialog
      title="卡种操作"
      :visible.sync="DialogVisible"
      :close-on-click-modal="add_edit"
      width="850px" class="addRole" @close="addclose">
      <el-form ref="formbox" autoComplete="on" :model="formData" :rules="formRules" label-width="110px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="卡种名称" prop="name">
              <el-input v-model="formData.name"  placeholder="请填写卡种名称" maxlength="12"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="卡种封面" prop="photo">
              <div>
                <el-select placeholder="请选择卡种封面" v-model="cardImg" @change="selectCard" style="width: 100%">
                  <el-option :label="item.label" :value="item.value" :key="item.value" v-for="item in selectOption"></el-option>
                </el-select>
                <div class="cardDiv" v-if="cardImgMb"><img :src="formData.photo" width="100%" height="100%"></div>
                <more-img v-if="!cardImgMb" ref="imgbox" :boxWidth="290" :boxHeight="112" :imgWidth="710" :imgHeight="284" @imgUrl="getImgUrl" @clearimgurl="cimgrul"></more-img>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
           <el-form-item label="卡种类型" prop="type">
              <el-select style="width: 100%" v-model="formData.type" :disabled="disabled" placeholder="请选择卡种类型">
                <el-option label="时效卡" :value="1"></el-option>
                <el-option label="次卡" :value="2"></el-option>
                <el-option label="储值卡" :value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="formData.type!==3" :label="formData.type == 1 ? '天数' : '次数'" prop="times">
              <span class="por">
                <!-- <el-input v-model="formData.times" v-if="formData.type === 1" :placeholder="'请填写天数'" oninput="if(value.length > 7)value = value.slice(0, 7)"></el-input> -->
                <!-- <el-input v-model="formData.times" :placeholder="'请填写次数'" oninput="if(value.length > 8)value = value.slice(0, 8)"></el-input> -->
                <el-input v-model="formData.times" :placeholder="formData.type == 1 ? '请填写天数' : '请填写次数'" oninput="if(value.length > 6)value = value.slice(0, 6)"></el-input>
                <span class="poa">{{formData.type == 1 ? '天' : '次'}}</span>
              </span>
            </el-form-item>
            <el-form-item v-else label="充值金额(元)" prop="times">
              <el-input v-model="formData.times" :placeholder="'请填写金额'"  @keyup.native="inputKeyUp3($event, 0, 99999999)"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
         <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="底价" prop="floor_price">
              <el-input v-model="formData.floor_price"  placeholder="请填写底价" type="number" @keyup.native="inputKeyUp1($event, 0, 99999999)"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="价格" prop="price">
              <el-input v-model="formData.price"  placeholder="请填写价格" type="number"  @keyup.native="inputKeyUp2($event, 0, 99999999)"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
         <el-row :gutter="20">
          <el-col :span="12">
           <el-form-item label="SAAS销售" prop="saas_status">
              <el-select style="width: 100%" v-model="formData.saas_status" placeholder="请选择SAAS市场销售">
                <el-option :label="item.label" :value="item.value" v-for="(item,index) in option" :key="index"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="APP销售" prop="app_status">
              <el-select style="width: 100%" v-model="formData.app_status" placeholder="请选择APP市场销售" :disabled="!IsAuthPass">
                <!-- <el-option label="下架" :value="1"></el-option>
                <el-option label="上架" :value="2"></el-option> -->
                <el-option :label="item.label" :value="item.value" v-for="(item,index) in option" :key="index"></el-option>
              </el-select>
              <div class="tipMsg" v-if="!IsAuthPass">注：通过认证后才能在“牛啦”APP中销售会员卡</div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="排序" prop="weight">
              <el-input v-model="formData.weight" placeholder="填写正整数,数字越大排号越前"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="formData.remark" type="textarea" placeholder="请输入备注信息" :rows="4" :maxlength="20"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <div style="text-align:center;">
          <span slot="footer" class="dialog-footer">
            <el-button v-if="subStatus === 'creat'" :loading="loading" @click="addsubmit" class="black">确 定</el-button>
            <el-button v-else :loading="loading" @click="editsubmit" class="black">更 新</el-button>
          </span>
        </div>
      </el-form>
    </el-dialog>
    <dateRange @timeChange="timeChange"></dateRange>
    <!-- 删除卡种 -->
    <delete-dialog 
      :tipMessage="deleteMessage"
      ref="deleteDialogDoc"
      @deleteSureBtn='deleteCardSure'></delete-dialog>
  </div>
</template>

<script>
import { listVipCard, editVipCard, deleteVipCard, addVipCard, batchVipTemplates } from '@/api/vipcard'
import bulkAction from '@/components/bulkAction'
import moreImg from '@/components/moreImg'
import scanInput from '@/components/scanInput'
import dateRange from '@/components/dateRange'
import deleteDialog from '@/components/deleteDialog'
// import { testNumber, testFloat2, testInteger } from '@/utils/validate'
import { testNumber, testFloat2 } from '@/utils/validate'
import { getSession } from '@/utils/auth'
import { cardtype_Dictionary } from '@/utils/comm'
var my = null
const validateName = (rule, value, callback) => {
  if (!value.toString().length) {
    callback(new Error('请输入卡种名称'))
  } else {
    callback()
  }
}
const validateTimes = (rule, value, callback) => {
  if (my.formData.type === 1) {
    if (!value.toString().length) {
      callback(new Error('请输入有效值'))
    } else {
      if (!testNumber(value)) {
        callback(new Error('请输入正整数'))
      } else if (Number(value) > 9999999) {
        callback(new Error('输入数字不能大于9999999'))
      } else {
        callback()
      }
    }
  } else if (my.formData.type === 3) {
    if (!value.toString().length) {
      callback(new Error('充值金额不能为空'))
    } else if (Number(value) === 0) {
      callback(new Error('充值金额必须大于0'))
    } else {
      callback()
    }
  } else {
    if (!value.toString().length) {
      callback(new Error('请输入有效值'))
    } else {
      if (!testNumber(value)) {
        callback(new Error('请输入正整数'))
      } else if (Number(value) > 99999999) {
        callback(new Error('输入次数字不能大于99999999'))
      } else {
        callback()
      }
    }
  }
}
const validatePrice = (rule, value, callback) => {
  if (!value.toString().length) {
    callback(new Error('价格不能为空'))
  } else {
    if (!testFloat2(value)) {
      callback(new Error('请输入正确的价格,最多保留两位小数'))
    } else if (Number(value) > 99999999) {
      callback(new Error('输入数字不能大于99999999'))
    } else if (Number(value) === 0) {
      callback(new Error('输入数字必须大于0'))
    } else {
      callback()
    }
  }
}
const validatePrice1 = (rule, value, callback) => {
  if (!value.toString().length) {
    callback(new Error('价格不能为空'))
  } else {
    if (!testFloat2(value)) {
      callback(new Error('请输入正确的价格,最多保留两位小数'))
    } else if (Number(value) > 99999999) {
      callback(new Error('输入数字不能大于99999999'))
    } else if (Number(value) === 0) {
      callback(new Error('输入数字必须大于0'))
    } else if (Number(value) < Number(my.formData.floor_price)) {
      callback(new Error(`实付金额不得低于${my.formData.floor_price}元`))
    } else {
      callback()
    }
  }
}
const validateWeight = (rule, value, callback) => {
  if (!value.toString().length) {
    callback(new Error('请输入权重'))
  } else {
    if (!testNumber(value)) {
      callback(new Error('请输入0-99999999之间的整数'))
    } else if (Number(value) > 99999999) {
      callback(new Error('输入数字不能大于99999999'))
    } else {
      callback()
    }
  }
}
export default {
  name: 'cardTypeManage',
  components: {
    bulkAction,
    moreImg,
    scanInput,
    dateRange,
    deleteDialog
  },
  data() {
    return {
      btnRoleList: {},
      disabled: false,
      deleteMessage: '确定删除该卡种吗？',
      deleteId: '',
      tags: [],
      subStatus: 'creat',
      loading: false,
      cardImg: '',
      cardImgMb: false,
      formData: {
        name: '',
        type: 1,
        times: '',
        photo: '',
        floor_price: '',
        price: '',
        app_status: 1,
        saas_status: 1,
        weight: '1',
        remark: ''
      },
      formRules: {
        name: [{ required: true, trigger: 'blur', validator: validateName }],
        times: [{ required: true, trigger: 'blur', validator: validateTimes }],
        floor_price: [{ required: true, trigger: 'blur', validator: validatePrice }],
        price: [{ required: true, trigger: 'blur', validator: validatePrice1 }],
        weight: [{ required: true, trigger: 'blur', validator: validateWeight }],
        photo: [{ required: true, message: '卡种封面不能为空' }]
      },
      DialogVisible: false,
      add_edit: false,
      searchCardName: '',
      select: '',
      searchval: '',
      tableKey: 0,
      tableList: [],
      total: null,
      listLoading: true,
      showReviewer: false,
      listQuery: {
        page: 1,
        per_page: 10,
        app_status: undefined, // APP市场状态：0.全部，1.下架，2.上架
        type: undefined, // 卡种类型：0.全部，1.时效卡，2.次卡
        saas_status: undefined, // SAAS市场状态：0.全部，1.下架，2.上架
        name: undefined // 卡种名称搜索
      },
      selectOption: [{
        label: '模版一',
        value: 1,
        href: 'https://niulang-v2.oss-cn-beijing.aliyuncs.com/2018-06-13/gym5b208cf355c911528859891.png'
      }, {
        label: '模版二',
        value: 2,
        href: 'https://niulang-v2.oss-cn-beijing.aliyuncs.com/2018-06-13/gym5b208d081faa11528859912.png'
      }, {
        label: '模板三',
        value: 3,
        href: 'https://niulang-v2.oss-cn-beijing.aliyuncs.com/2018-06-13/gym5b208d93959101528860051.png'
      }, {
        label: '模板四',
        value: 4,
        href: 'https://niulang-v2.oss-cn-beijing.aliyuncs.com/2018-06-13/gym5b208d9c6342b1528860060.png'
      }, {
        label: '自定义',
        value: 5
      }],
      option: [{
        label: '下架',
        value: 1
      }, {
        label: '上架',
        value: 2
      }],
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
      searchGroupBtn: '',
      value1: true,
      iscoach: true,
      groupOprate: {
        ids: []
      },
      searchSelect: [{
        text: '卡种名称',
        value: 'name'
      }, {
        text: '备注',
        value: 'remark'
      }],
      searchSelectTxt: '请输入卡种名称',
      IsAuthPass: 0, // 是否通过认证
      paginationShow: true
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
      return result
    }
  },
  created() {
    this.__init()
    if (getSession('gymIsPass') === '1') { // 已审核
      this.IsAuthPass = 1
    } else {
      this.IsAuthPass = 0
    }
  },
  mounted() {
    my = this
  },
  methods: {
    timeChange(param) {
      this.common.chooseTimerFilter(param, this)
    },
    selectCard(value) {
      switch (value) {
        case 1:
          this.cardImgMb = true
          this.formData.photo = this.selectOption[0].href
          break
        case 2:
          this.cardImgMb = true
          this.formData.photo = this.selectOption[1].href
          break
        case 3:
          this.cardImgMb = true
          this.formData.photo = this.selectOption[2].href
          break
        case 4:
          this.cardImgMb = true
          this.formData.photo = this.selectOption[3].href
          break
        case 5:
          this.cardImgMb = false
          break
      }
    },
    scaninputover(obj) {
      delete this.listQuery[obj.type]
      // 开始搜索
      for (let i of this.searchSelect) {
        delete this.listQuery[i.value]
      }
      if (obj.value === '') {
        delete this.tags[0]
      } else {
        let tagszh = {
          name: '卡种名称',
          remark: '备注'
        }
        this.tags[0] = { 'name': `${tagszh[ obj.type]}:${obj.value}`, 'type': obj.type }
        this.listQuery[obj.type] = obj.value
      }
      this.listQuery.page = 1
      this.pageInit()
      this.getList()
    },
    scaninputselect(value) {
      // 搜索框
      console.log(value)
      this.searchSelectTxt = value === 'name' ? '请输入卡种名称' : '请输入备注'
    },
    __init() {
      this.common.eachBtnRole(this.btnRoleList) // 按钮权限方法
      this.getList()
    },
    sortChange(data) {
      this.common.sortFilter(this, data)
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
      this.getList()
    },
    lotFilter(data, key) {
      if (key === 'type') {
        let _msg = '卡种类型：'
        let _text = ['时效卡', '次卡', '储值卡']
        this.hostFilter(data, key, 1, `${_msg}${_text[this.listQuery[key] - 1]}`)
      }
    },
    hostFilter(data, key, index, text) {
      if (data[key].length === 0) {
        delete this.tags[index]
      } else {
        this.$set(this.tags, index, { name: text, type: key })
      }
    },
    search() {
      this.listQuery.name = this.searchCardName
      this.listQuery.page = 1
      this.pageInit()
      this.getList()
    },
    // 添加/编辑弹框关闭时清楚数据
    addclose() {
      this.$nextTick(() => {
        this.$refs.formbox.resetFields()
      })
      this.loading = false
      this.cardImgMb = false
      this.cardImg = ''
      this.resetForm()
    },
    resetForm() {
      this.formData.name = ''
      this.formData.times = ''
      this.formData.photo = ''
      this.formData.floor_price = ''
      this.formData.price = ''
      this.formData.weight = '1'
      this.formData.remark = ''
      this.formData.type = 1
      // this.$refs.imgbox.deleteimgbtn()
    },
    addsubmit() {
      this.$refs.formbox.validate(valid => {
        if (valid) {
          this.loading = true
          addVipCard(this.formData).then((res) => {
            this.loading = false
            this.DialogVisible = false
            this.getList()
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    editsubmit() {
      let self = this
      this.$refs.formbox.validate(valid => {
        if (valid) {
          self.loading = true
          editVipCard(self.formData).then(response => {
            self.loading = false
            self.DialogVisible = false
            // let index = self.subStatus.split('_')[1]
            // self.$set(self.tableList, index, response.data)
            this.common.message('success', '卡种信息编辑成功')
            this.getList()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getImgUrl(url) {
      this.formData.photo = url
    },
    cimgrul(data) {
      this.formData.photo = data
    },
    addcard() {
      this.subStatus = 'creat'
      this.DialogVisible = true
      this.add_edit = false
      this.disabled = false
      this.formData.photo = ''
      this.$nextTick(() => {
        this.$refs.imgbox.deleteimgbtn()
      })
    },
    getList() {
      this.listLoading = true
      this.tableList = []
      listVipCard(this.listQuery).then(response => {
        // this.tableList = response.data
        for (let i = 0; i < response.data.length; i++) {
          this.tableList.push(response.data[i])
          switch (this.tableList[i].saas_status) {
            case 1: // 下架
              this.tableList[i].saas_status = false
              break
            case 2: // 上架
              this.tableList[i].saas_status = true
              break
          }
          switch (this.tableList[i].app_status) {
            case 1: // 下架
              this.tableList[i].app_status = false
              break
            case 2: // 上架
              this.tableList[i].app_status = true
              break
          }
        }
        this.total = Number(response.headers.pagination.split(',')[1])
        this.listLoading = false
      })
      console.log(this.tableList)
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.per_page = val
      this.getList()
    },
    handleEdit(index, row) {
      this.subStatus = 'edit_' + index
      this.formData = Object.assign({}, row)
      switch (this.formData.saas_status) {
        case false: // 下架
          this.formData.saas_status = 1
          break
        case true: // 上架
          this.formData.saas_status = 2
          break
      }
      switch (this.formData.app_status) {
        case false: // 下架
          this.formData.app_status = 1
          break
        case true: // 上架
          this.formData.app_status = 2
          break
      }
      this.DialogVisible = true
      this.add_edit = true
      this.cardImg = ''
      this.disabled = true
      this.$nextTick(() => {
        this.$refs.imgbox.setImg(row.photo)
        let _selectOption = this.selectOption.filter(item => {
          let _herf = item.href ? item.href.split('//')[1] : _herf
          return row.photo.indexOf(_herf) !== -1
        })
        this.cardImg = _selectOption[0] ? _selectOption[0].value : 5
      })
    },
    handleDelete(index, rows) {
      this.deleteId = rows.id
      this.$refs.deleteDialogDoc.dialogShow()
    },
    deleteCardSure() {
      deleteVipCard(this.deleteId).then(res => {
        this.common.message('success', '删除成功！')
        this.$refs.deleteDialogDoc.dialogClose()
        this.getList()
      }).catch((err) => {
        this.common.message('error', err.data.message)
        this.$refs.deleteDialogDoc.dialogLoadingClose()
      })
    },
    appStatusChange(param) {
      // app 上下架操作
      this.groupOprate.ids = []
      this.groupOprate.ids.push(param.id)
      this.groupOprate.attribute = 'app_status'
      this.groupOprate.value = param.app_status ? 2 : 1
      batchVipTemplates(this.groupOprate).then(res => {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        this.getList()
      }).catch(err => {
        console.log(err)
      })
    },
    saasStatusChange(param) {
      // saas 上下架操作
      this.groupOprate.ids = []
      this.groupOprate.ids.push(param.id)
      this.groupOprate.attribute = 'saas_status'
      this.groupOprate.value = param.saas_status ? 2 : 1
      batchVipTemplates(this.groupOprate).then(res => {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        this.getList()
      }).catch(err => {
        console.log(err)
      })
    },
    selectionChange(selection) {
      // 表格选中多选框
      this.groupOprate.ids = []
      for (let i = 0; i < selection.length; i++) {
        this.groupOprate.ids.push(selection[i].id)
      }
    },
    searchGroup(param) {
      // 批量操作
      if (!this.groupOprate.ids.length) {
        this.common.message('warning', '请先选择会员卡')
        return
      }
      let arr = param.split('-')
      let _infor = arr[0] + '市场批量' + (arr[1] === '1' ? '下架' : '上架')
      this.groupOprate.attribute = arr[0] + '_status'
      this.groupOprate.value = Number(arr[1])
      this.$confirm(`是否${_infor}`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        batchVipTemplates(this.groupOprate).then(res => {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.getList()
        }).catch(err => {
          console.log(err)
        })
      }).catch(() => {
        console.log('取消删除')
      })
    },
    pageInit() {
      this.paginationShow = false
      this.$nextTick(() => {
        this.paginationShow = true
      })
    },
    inputKeyUp1(e, min, max, moduleVale) {
      let doc = e.target
      let _value = this.inputformat(doc, min, max)
      this.formData.floor_price = _value
    },
    inputKeyUp2(e, min, max, moduleVale) {
      let doc = e.target
      let _value = this.inputformat(doc, min, max)
      this.formData.price = _value
    },
    inputKeyUp3(e, min, max) {
      let doc = e.target
      let _value = this.common.check(doc, min, max)
      this.formData.times = _value
    },
    inputformat(doc, min, max) {
      if (doc.value.indexOf('.') === 0) {
        doc.value = '0'
      }
      if (doc.value && doc.value.split('.')[1] && doc.value.split('.')[1].length > 2) {
        doc.value = doc.value.substring(0, doc.value.length - 1)
      }
      if (Number(doc.value) < min) {
        doc.value = '0'
      } else if (Number(doc.value) > max) {
        doc.value = doc.value.substring(0, doc.value.length - 1)
      }
      return doc.value
    },
    getcardtype_Dictionary(param) {
      return cardtype_Dictionary(param)
    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  destroyed() {
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg:#2d3a4b;
$light_gray:#eee;
.por {
  position: relative;
  .poa {
    position: absolute;
    right: 10px;
    top: -9px;
  }
}
.tipMsg {
  margin-left: -60px;
  color: rgb(255,93,51);
}
.staffAdd{
  background: rgb(51, 51, 51);
  margin-left: 20px;
  color: #fff;
}
.lf{float: left;}
.qr{
  width: 36px;
  position: absolute;
  left: 0;
  top: 0;
  height: 36px;
  background: url("../../../assets/icon/qr.png") no-repeat;
  background-size: contain;
}
.searchgroup .el-select .el-input {
  width: 140px;
  padding-left: 36px;
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
  overflow: hidden;
}
.cursorbox {
  float: left;
  width: 10%;
  height: 98px;
  box-shadow: 0 2px 5px 0 rgba(0,0,0,0.30);
  margin: 2px 5px 5px 5px;
  .text {
    font-size: 14px;
    color: #cccccc;
    height: 40px;
    line-height: 30px;
    box-sizing: border-box;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    padding-left: 10px;
    border-top: 6px solid #1C84C6;
  }
  .font {
    font-size: 28px;
    color: #333333;
    line-height: 58px;
    height: 58px;
    text-align: center;
  }
}
.through{
  width: 20px;
  height: 20px;
  display: inline-block;
  background: #1AB394;
  border-radius: 3px;
  color: #ffffff;
  line-height: 20px;
  margin-right: 3px;
  text-align: center;
}
.cursoractive {
  background-color: #1C84C6;
  .text {
    background-color: rgba(0, 0, 0, 0.1);
    color: #ffffff;
    line-height: 40px;
    border-top: none;
  }
  .font {
    color: #ffffff;
  }
}
.pagination-container {
  text-align: right;
}
.cursorbox {
  float: left;
}
.cardDiv {
  width: 290px;
  height: 112px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
.dialog-footer .black {
  border: 1px solid #000;
  background: #000;
}
</style>
