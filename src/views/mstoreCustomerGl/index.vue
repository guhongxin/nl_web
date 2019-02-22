<template>
  <div class="mstoreCustomerGl">
    <div class="mstoreCustomerGl-box">
      <h3>会员管理</h3>
      <div class="boxser">
        <rectbox :data="boxlist" v-on:choose="curChoose" v-on:openbox="curOpenbox" @overChange="curOverChange"></rectbox>
      </div>
      <div class="filter-container">
        <scan-input :select="searchSelect" :defaultSelect="searchSelect[0].value" @kedownOver="searchlist" ref="scanIputDoc"></scan-input>
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
    <el-table @filter-change="filterChange" stripe 
      class="check-table"
      @selection-change="selectionChange"
      @sort-change="sortChange"
      :key='tableKey' 
      :data="tableList" 
      v-loading="listLoading" 
      element-loading-text="列表正在加载中"
      border
      fit highlight-current-row
      style="width: 100%;">
      <el-table-column align="center" type="selection" width="55px"></el-table-column>
      <el-table-column align="center" :label="'姓名'" width="180px">
        <template slot-scope="scope">
          <span>{{scope.row.name?scope.row.name:'-'}}</span>
        </template>
      </el-table-column>
      <el-table-column width="55px" align="center" :label="'头像'">
        <template slot-scope="scope">
          <span><img :src="scope.row.head_portrait?scope.row.head_portrait:defaulthead" @click="common.bigImg($event)" alt="icon" width="30" height="30" style="display: list-item;border-radius:50%;"></span>
        </template>
      </el-table-column>
      <el-table-column column-key="sex" align="center" :label="'性别'" width="90" prop="scope.row.sex"
      :filters="[{text: '男', value: '1', class: 'csex'}, {text: '女', value: '2', class: 'csex'}]"
      filter-placement="bottom-end" :filter-multiple="false">
        <template slot-scope="scope">
          <span>{{scope.row.sex === 1 ? '男' : scope.row.sex === 2 ? '女' : '未知'}}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" :label="'手机'" prop="scope.row.phone">
        <template slot-scope="scope">
          <span>{{scope.row.phone}}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" :label="'是否注册APP'" prop="is_register_app" column-key="is_app"
      :filters="[{text: '已注册', value: '1', class: 'cis_app'}, {text: '未注册', value: '0', class: 'cis_app'}]"
      filter-placement="bottom-end" :filter-multiple="false">
        <template slot-scope="scope">
          <span v-if="scope.row.is_register_app" style="color:rgb(26, 179, 148)">已注册</span>
          <span v-else style="color: rgb(241, 76, 48)">未注册</span>
        </template>
      </el-table-column>
      <el-table-column column-key="consultant" align="center" :label="'所属会籍'" width="120" prop="consultant">
        <template slot-scope="scope">
          <span>{{scope.row.consultant?scope.row.consultant.name:'未分配'}}</span>
        </template>
      </el-table-column>
      <el-table-column column-key="coach" align="center" :label="'所属教练'" width="120" prop="coach">
        <template slot-scope="scope">
          <span>{{scope.row.coach?scope.row.coach.name:'未分配'}}</span>
        </template>
      </el-table-column>
      <el-table-column width="160px" align="center" label="创建时间<i class='el-icon-date'></i>" sortable prop="created_at">
        <template slot-scope="scope">
          <span>{{scope.row.created_at}}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" :label="'时效卡'">
        <template slot-scope="scope">
          <div class="more-tag" v-if="scope.row.limitation_card&&scope.row.limitation_card.length">
            <div class="bg-tag" style="width:90px;" v-if="scope.row.limitation_card.length>1" ></div>
            <el-tag class="tags-styl tags-wz" style="width:90px;">{{scope.row.limitation_card[0]?common.customFormat(scope.row.limitation_card[0].end_date, 'yyyy-MM-dd'):'-'}}</el-tag>
          </div>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" :label="'次卡'">
        <template slot-scope="scope">
          <div class="more-tag" v-if="scope.row.times_card&&scope.row.times_card.length">
            <div class="bg-tag" style="width:90px;" v-if="scope.row.times_card.length>1"></div>
            <el-tag class="tags-styl tags-wz" style="width:90px;">剩余{{scope.row.times_card[0]?(scope.row.times_card[0].total_times - scope.row.times_card[0].use_times):'-'}}次</el-tag>
          </div>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" :label="'私教次数'">
        <template slot-scope="scope">
          <el-tag class="tags-styl">剩余{{scope.row.course_residue?scope.row.course_residue:0}}次</el-tag>
        </template>
      </el-table-column>
      <el-table-column column-key="channel" align="center" :label="'来源渠道'" width="120" prop="channel" 
        :filters="purposeList"
        filter-placement="bottom-end" :filter-multiple="false">
        <template slot-scope="scope">
          <span>{{getchannel(scope.row.channel)}}</span>
        </template>
      </el-table-column>
      <el-table-column column-key="purpose" align="center" :label="'健身目的'" width="120" prop="purpose" 
      :filters="[{text: '减脂', value: '0', class: 'cpurpose'}, {text: '增肌', value: '1'}, {text: '塑形',value: '2'}]"
      filter-placement="bottom-end" :filter-multiple="false"> 
        <template slot-scope="scope">
          <span>{{scope.row.purpose === 0 ? '减脂' : scope.row.purpose === 1 ? '增肌' : '塑形'}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="'签到次数'" width="110" sortable prop="sign_count">
        <template slot-scope="scope">
          <span>{{scope.row.sign_count}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="'备注'" width="90" prop="scope.row.remark">
        <template slot-scope="scope">
          <span>{{scope.row.remark?scope.row.remark:'-'}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" fixed="right" :label="$t('table.actions')" min-width="150" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="customerDetailsBtn(scope.row)">{{$t('table.details')}}</el-button>
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
    <!-- 客户详情弹窗 -->
    <customer-details-popups :title="'客户详情'"
      v-if="popupsCustomerDetailsVisible"
      :dialogVisible="popupsCustomerDetailsVisible"
      :widthSize="'900px'"
      ref='popupsDetailsCustomerDoc'
      @popupsClosed="popupsClosedcustomerDetails"
      @stopCardCardTj="stopCardCardTj">
    </customer-details-popups>
  </div>
</template>
<script>
// 多店---会员管理
import rectbox from '@/components/rectbox'
import scanInput from '@/components/scanInput'
import bulkAction from '@/components/bulkAction'
import { msCustomerList, msCustomerNumb } from '@/api/mstorecustomer'
import { channelDictionary } from '@/utils/comm'
import CustomerDetailsPopups from './components/customerDetailsPopups'
export default {
  name: 'mstoreCustomerGl',
  components: {
    rectbox,
    scanInput,
    bulkAction,
    CustomerDetailsPopups
  },
  data() {
    return {
      boxlist: [{
        text: '全部会员',
        num: 0,
        type: 'all',
        checked: true,
        bocolor: 'rgb(28, 132, 198)'
      }, {
        text: '私教会员',
        num: 0,
        type: 'bind_coach',
        checked: false,
        bocolor: 'rgb(81, 169, 202)'
      },
      // {
      //   text: '未过期会员',
      //   num: 0,
      //   type: 'unexpired',
      //   checked: false,
      //   bocolor: 'rgb(65, 189, 190)'
      // },
      {
        text: '新增加会员',
        num: 0,
        type: 'new',
        checked: false,
        bocolor: 'rgb(26, 179, 148)',
        rbtn: '最近5天',
        select: [{
          label: '最近5天'
        }, {
          label: '最近30天'
        }, {
          label: '最近90天'
        }]
      },
      {
        text: '即将失效',
        num: 0,
        type: 'expiring_lease',
        checked: false,
        bocolor: 'rgb(248, 172, 89)',
        rbtn: '最近5天',
        select: [{
          label: '最近5天'
        }, {
          label: '最近30天'
        }, {
          label: '最近90天'
        }]
      }, {
        text: '已失效',
        num: 0,
        type: 'expired',
        checked: false,
        bocolor: 'rgb(241, 76, 48)',
        rbtn: '全部',
        select: [{
          label: '全部'
        }, {
          label: '最近5天'
        }, {
          label: '最近30天'
        }, {
          label: '最近90天'
        }]
      },
      {
        text: '最近生日',
        num: 0,
        type: 'birthday',
        checked: false,
        bocolor: 'rgb(177, 197, 211)',
        rbtn: '最近5天',
        select: [{
          label: '最近5天'
        }, {
          label: '最近30天'
        }, {
          label: '最近90天'
        }]
      }],
      // , {
      //   text: '回收站',
      //   num: 0,
      //   type: 'trashed',
      //   checked: false,
      //   bocolor: '#CCCCCC'
      // }],
      searchSelect: [{
        text: '手机号码',
        value: 'phone_like'
      }, {
        text: '姓名',
        value: 'name_like'
      }, {
        text: '会员卡号',
        value: 'card_no_like'
      }, {
        text: '备注',
        value: 'remark_like'
      }],
      tableKey: 0,
      tableList: null,
      listLoading: false,
      paginationShow: true,
      listQuery: {
        page: 1,
        per_page: 10,
        status: 0,
        new_value: undefined,
        expiring_lease: undefined,
        birthday: undefined
      },
      total: 0,
      purposeList: [{
        text: '无', value: '0', class: 'cchannel'
      }, {
        text: '电话收集', value: '1', class: 'cchannel'
      }, {
        text: '拉人到店', value: '2', class: 'cchannel'
      }, {
        text: '自然访问', value: '3', class: 'cchannel'
      }, {
        text: '会员介绍', value: '4', class: 'cchannel'
      }, {
        text: '朋友介绍', value: '5', class: 'cchannel'
      }, {
        text: 'App', value: '6', class: 'cchannel'
      }, {
        text: '内购', value: '7', class: 'cchannel'
      }, {
        text: '宣传单', value: '8', class: 'cchannel'
      }, {
        text: '网络推广', value: '9', class: 'cchannel'
      }, {
        text: '团购', value: '10', class: 'cchannel'
      }, {
        text: '杂志期刊', value: '11', class: 'cchannel'
      }, {
        text: '新闻媒体', value: '12', class: 'cchannel'
      }, {
        text: '户外广告', value: '13', class: 'cchannel'
      }, {
        text: '其它', value: '14', class: 'cchannel'
      }],
      tags: [],
      listCount: {
        all: 3, // 全部会员
        bind_coach: 3, // 私教客户
        unexpired: 3, // 未过期
        new: 3,
        new_value: 5, // 新增加会员
        expiring_lease: 5, // 即将到期
        expired: 3, // 已过期
        birthday: 5, // 最近生日
        trashed: 3 // 回收站
      },
      popupsCustomerDetailsVisible: false // 详情弹窗
    }
  },
  methods: {
    curOverChange(obj) {
      // 右上角 筛选结果条件触发
      this.boxlist[obj.fatherIndex].rbtn = obj.label
      this.curChoose(obj.fatherIndex)
    },
    curChoose(index) {
      for (let v of this.boxlist) {
        v.checked = false
      }
      this.boxlist[index].checked = true

      delete this.listQuery.status
      delete this.listQuery.new_value
      delete this.listQuery.expiring_lease
      delete this.listQuery.birthday
      delete this.listQuery.expired

      let _scope_value = this.boxlist[index].rbtn ? this.boxlist[index].rbtn.replace(/[^0-9]/ig, '') : ''
      let _scopeValue = _scope_value.length > 0 ? _scope_value : '0'
      if (this.boxlist[index].type === 'new') {
        // 新增
        this.listCount['new_value'] = Number(_scopeValue)
        this.listQuery.status = 1
        this.listQuery.new_value = Number(_scopeValue)
      } else if (this.boxlist[index].type === 'trashed') {
        // 回收站
        this.listCount['trashed'] = 3
        this.listQuery.status = 5
      } else if (this.boxlist[index].type === 'all') {
        // 所有
        this.listCount['all'] = 3
      } else if (this.boxlist[index].type === 'bind_coach') {
        // 私教会员
        this.listCount['bind_coach'] = 3
        this.listQuery.status = 4
      } else if (this.boxlist[index].type === 'unexpired') {
        // 未过期的会员
        this.listCount['unexpired'] = 3
        this.listQuery.status = 7
      } else if (this.boxlist[index].type === 'expired') {
        // 已过期
        this.listCount['expired'] = Number(_scopeValue)
        this.listQuery.status = 3
        this.listQuery['expired'] = Number(_scopeValue)
      } else if (this.boxlist[index].type === 'birthday') {
        // 最近多少天内过生日的会员
        this.listCount['birthday'] = Number(_scopeValue)
        this.listQuery.status = 6
        this.listQuery['birthday'] = Number(_scopeValue)
      } else if (this.boxlist[index].type === 'expiring_lease') {
        // 最近多少天内到期的会员
        this.listCount['expiring_lease'] = Number(_scopeValue)
        this.listQuery.status = 2
        this.listQuery['expiring_lease'] = Number(_scopeValue)
      }
      this.getList()
      this.getCount()
    },
    curOpenbox(index) {
      // console.log(this.boxlist[index].text)
    },
    searchlist(obj) {
      let _key = ['phone_like', 'name_like', 'card_no_like', 'remark_like']
      if (obj.value === '') {
        delete this.tags[0]
      } else {
        let tagszh = {
          phone_like: '手机号码:',
          name_like: '姓名:',
          card_no_like: '会员卡号:',
          remark_like: '备注:'
        }
        this.$set(this.tags, 0, { 'name': `${tagszh[obj.type]}${obj.value}`, 'type': obj.type })
      }
      _key.map(item => {
        delete _key[item]
      })
      this.listQuery[obj.type] = obj.value
      this.listQuery.page = 1
      this.pageInit()
      this.getList()
    },
    tagclose(tag, index) {
      this.common.tagFilter(this, tag, index, this.searchSelect)
    },
    __init() {
      this.getList()
      this.getCount()
    },
    filterChange(data) {
      for (let key in data) {
        if (data[key].length !== 0) {
          if (data[key][0].split(',')) {
            this.listQuery[key] = data[key][0].split(',')[0]
          } else {
            this.listQuery[key] = data[key][0]
          }
          this.lotFilter(data, key)
        } else {
          this.lotFilter(data, key)
          delete this.listQuery[key]
        }
      }
      this.listQuery.page = 1
      this.pageInit()
      this.getList()
    },
    lotFilter(data, key) {
      if (key === 'sex') {
        this.hostFilter(data, key, 1, this.listQuery[key] === '1' ? '性别：男' : this.listQuery[key] === '2' ? '性别：女' : '性别：未知')
      }
      if (key === 'channel') {
        let prefix = '来源渠道：'
        let obj = this.purposeList.find(item => {
          return item.value === this.listQuery[key]
        })
        this.hostFilter(data, key, 3, prefix + (obj ? obj.text : ''))
      }
      if (key === 'purpose') {
        let text = ''
        let prefix = '健身目的：'
        switch (this.listQuery[key]) {
          case '0': text = '减脂'; break
          case '1': text = '增肌'; break
          case '2': text = '塑形'; break
          default: text = '无'
        }
        this.hostFilter(data, key, 4, prefix + text)
      }
      if (key === 'is_app') {
        this.hostFilter(data, key, 2, this.listQuery[key] === '1' ? '是否注册app：已注册' : '是否注册app：未注册')
      }
    },
    hostFilter(data, key, index, text) {
      if (data[key].length === 0) {
        delete this.tags[index]
      } else {
        this.$set(this.tags, index, { name: text, type: key })
      }
    },
    selectionChange(selection) {
      this.groupOprate.ids = []
      for (let i = 0; i < selection.length; i++) {
        this.groupOprate.ids.push(selection[i].id)
      }
    },
    sortChange(data) {
      this.common.sortFilter(this, data)
    },
    handleSizeChange(val) {
      console.log('this.listQuery.per_page', val)
      this.listQuery.per_page = val
      this.getList()
    },
    handleCurrentChange(val) {
      console.log('this.listQuery.page', val)
      this.listQuery.page = val
      this.getList()
    },
    getList() {
      this.listLoading = true
      msCustomerList(this.listQuery).then(res => {
        let data = res.data
        this.listLoading = false
        this.tableList = data
        this.total = Number(res.headers.pagination.split(',')[1])
      }).catch(err => {
        console.log(err)
        this.listLoading = false
      })
    },
    getCount() {
      let obj = this.listCount
      let self = this
      msCustomerNumb(obj).then(response => {
        let res = response.data
        for (let i = 0; i < self.boxlist.length; i++) {
          let item = self.boxlist[i]
          for (let key in res) {
            if (item.type === key) {
              if (typeof (res[key]) === 'object') {
                let count = 0
                count = res[key][1]
                self.boxlist[i].num = count
              } else {
                self.boxlist[i].num = res[key]
              }
            }
          }
        }
      })
    },
    getchannel(param) {
      // 通道转换
      return channelDictionary(param)
    },
    pageInit() {
      // 分页器初始化
      this.paginationShow = false
      this.$nextTick(() => {
        this.paginationShow = true
      })
    },
    /**
     * 会员详情弹窗
     */
    customerDetailsBtn(row) {
      // 打开
      this.popupsCustomerDetailsVisible = true
      this.$nextTick(() => {
        this.$refs.popupsDetailsCustomerDoc.setDefaultVule(row)
      })
    },
    popupsClosedcustomerDetails() {
      // 关闭
      this.__init()
      this.popupsCustomerDetailsVisible = false
    },
    stopCardCardTj() {
      // 提交停卡 关闭详情
      this.popupsCustomerDetailsVisible = false
      this.__init()
    },
  },
  computed: {},
  created() {
    this.__init()
  },
}
</script>
<style lang="scss" scoped>
.mstoreCustomerGl{
  /deep/ .is-scrolling-none{
    border-bottom: 1px solid #CCCCCC;
  }
  .mstoreCustomerGl-box{
    width: 100%;
    background-color: #ffffff;
    border: 1px solid #CCCCCC;
    margin-bottom: 20px;
    h3{
      font-size: 20px;
      padding-left: 20px;
      color: #333333;
    }
    .boxser{
      padding: 20px;
      border: none;
      border-top: 1px solid #CCCCCC;
      border-bottom: 1px solid #CCCCCC;
      overflow: hidden;
    }
    .filter-container{
      overflow: hidden;
      padding: 10px 20px;
      
    }
  }
  .pagination-container{
    margin-top: 0px;
    text-align: right;
    padding: 30px 15px 20px;
  }
}
.more-tag{
  position: relative;
  height: 40px;
  margin: 4px auto;
  z-index: 1;
  .tags-wz{
    z-index: 2;
    position: absolute;
    top: 6px;
    left: 10px;
  }
  .bg-tag{
    width: 58px;
    height: 28px;
    border-radius: 4px;
    background-color: rgba(26,179,148,0.10);
    border: 1px solid #1AB394;
    position: absolute;
    top: 2px;
    left: 14px;
    z-index: 1;
  }
}
.tags-styl{
  border: 1px solid #1AB394;
  background-color: #EAF7F5;
}
</style>
