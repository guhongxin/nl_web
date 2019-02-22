<template>
  <div class="mstoredashboard">
    <div class="mstoredashboard-box" v-if="ismstoreGl(EMPLOYEE_TYPE)" >
      <h3>总店管理</h3>
      <div class="total-gl">
        <total-gl-box v-for="(item, key) in IshowtotalGl(totalGlList)"
          :key="key"
          :data="item"></total-gl-box>
      </div> 
    </div>
    <div class="mstoredashboard-box">
      <h3>分店管理</h3>
      <div class="branch-list-box">
        <el-row :gutter="20">
          <branch-box
            v-for="(item, key) in branchList"
            :key="key"
            :data="item"
            @addBranchStore="addBranchStore">
          </branch-box>
        </el-row>
      </div>
    </div>
    <add-branch-store
      v-if="addBranchStoreShow"
      :dialogVisible="addBranchStoreShow"
      :widthSize="'600px'"
      @dialogClosed="addBranchStoreClosed"
      @addBStoreBtn="addBStoreBtn"></add-branch-store>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import BranchBox from './components/BranchBox'
import TotalGlBox from './components/totalGlBox'
import AddBranchStore from './components/addBranchStore'
import { getSession } from '@/utils/auth'
export default {
  name: 'mstoredashboard',
  components: {
    BranchBox,
    TotalGlBox,
    AddBranchStore
  },
  data() {
    return {
      totalGlList: [{
        ahref: '#/mstoreSuperAdmin',
        src: require('../../assets/image/super-damin.png'),
        name: '超级管理员',
        bocolor: '#1878E1',
        isshow: '5'
      }, {
        ahref: '#/mstoreCardTypeGl',
        src: require('../../assets/image/vip-card.png'),
        name: '通卡卡种管理',
        bocolor: '#54B2D5',
        isshow: '356'
      }, {
        ahref: '#/mstoreCardManage',
        src: require('../../assets/image/card.png'),
        name: '通卡管理',
        bocolor: '#1AB394',
        isshow: '356'
      }, {
        ahref: '#/mstoreCustomerGl',
        src: require('../../assets/image/customer.png'),
        name: '通卡会员管理',
        bocolor: '#F8AC59',
        isshow: '356'
      }],
      addBranchStoreShow: false,
      EMPLOYEE_TYPE: getSession('EMPLOYEE_TYPE')
    }
  },
  created() {},
  methods: {
    addBranchStore() {
      this.addBranchStoreShow = true
    },
    addBranchStoreClosed() {
      this.addBranchStoreShow = false
    },
    addBStoreBtn() {
      this.addBranchStoreShow = false
    },
    ismstoreGl(param) {
      let str = '356'
      return str.indexOf(param) !== -1
    },
    IshowtotalGl(param) {
      let result = []
      result = param.filter(item => {
        return item.isshow.indexOf(this.EMPLOYEE_TYPE) !== -1
      })
      return result
    }
  },
  computed: mapState({
    branchList: state => {
      let result = []
      result = [...state.manageGyms.gymsList]
      let str = '5'
      if (str.indexOf(getSession('EMPLOYEE_TYPE')) !== -1) {
        result.push({
          url: require('../../assets/image/add.png'),
          branchName: '添加分店',
          hasAddBranch: true
        })
      }
      return result
    }
  })
}
</script>
<style lang="scss" scoped>
.mstoredashboard{
  width: 100%;
  .mstoredashboard-box{
    background-color: #ffffff;
    border: 1px solid #CCCCCC;
    margin-bottom: 20px;
    h3{
      font-size: 20px;
      padding-left: 20px;
      color: #333333;
    }
    .total-gl{
      border-top: 3px solid #D7E0E6;
      padding: 20px;
    }
    .branch-list-box{
      border-top: 3px solid #D7E0E6;
      padding: 28px 15px 18px;
      overflow: hidden;
    }
  }
}
</style>


