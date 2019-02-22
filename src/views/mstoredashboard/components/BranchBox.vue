<template>
  <el-col :lg="4" :md="6" :sm="12" style="margin-bottom:10px;">
    <div class="branchBox" :style="{'backgroundColor': data.hasAddBranch?'#B1C5D3':'#D7E0E6'}">
      <div class="noAdd" v-if="!data.hasAddBranch" @click="changeGym(data)"> 
        <img :src="data.logo" />
        <span class="gym-name-box" :title="data.name">{{data.name}}</span>
      </div>
      <div v-else class="hasAdd" @click="addBtn"> 
        <img :src="data.url" />
        <span>{{data.branchName}}</span>
      </div>
    </div>
  </el-col>
</template>
<script>
import { setSession, getSession } from '@/utils/auth'
import { changegym } from '@/api/mstoregym'
export default {
  name: 'branchBox',
  props: {
    data: {
      type: Object
    }
  },
  methods: {
    addBtn() {
      this.$emit('addBranchStore')
    },
    changeGym(param) {
      // 切换场馆
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      setSession('CURRENT_GYM_ID', param.id)

      changegym(param.id).then(res => {
        let data = res.data
        setSession('IS_AUTH_PASS', data.is_auth_pass)
        setSession('IS_CHECK_PASS', data.is_check_pass)
        setSession('SET_GYM_NAME', data.name)
        setSession('SET_LEGAL_PERSON_PHONE', data.legal_person_phone)
        setSession('SET_LOGO', data.logo)
        setSession('gymIsPass', JSON.stringify(data.is_auth_pass))
        setSession('SET_GYM_ID', data.id) // 切换场馆，重新设置GYM_ID
        this.avater = getSession('SET_LOGO')
        this.msavater = getSession('SET_MSTORE_LOGO')
        this.CURRENT_GYM_ID = getSession('CURRENT_GYM_ID') ? Number(getSession('CURRENT_GYM_ID')) : 0
        this.$store.dispatch('set_datedesktop')
        this.$router.push({ path: '/dashboard' })
        loading.close()
      }).catch(err => {
        console.log(err)
        let _path = this.$route.path
        if (/mstore/.test(_path)) {
          this.currentGym = 0
        } else {
          this.currentGym = Number(getSession('SET_GYM_ID'))
        }
        loading.close()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.branchBox{
  height: 80px;
  border-radius: 4px;
  .noAdd{
    padding: 10px;
    cursor: pointer;
    img{
      width: 60px;
      height: 60px;
      border-radius: 30px;
      vertical-align: middle;
    }
    .gym-name-box{
      font-size: 18px;
      color: #000000;
      vertical-align: middle;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 60%;
      display: inline-block;
    }
  }
  .hasAdd{
    text-align: center;
    padding: 25px;
    cursor: pointer;
    img{
      width: 30px;
      height: 30px;
      border-radius: 30px;
      vertical-align: middle;
    }
    span{
      font-size: 18px;
      color: #FFFFFF;
    }
  }
}
</style>

