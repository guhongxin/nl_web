<template>
  <div class="modifyRegister-box">
    <div class="logo"></div>
    <div class="bg_top">修改您的SaaS ID</div>
    <div class="modifyRegister-content">
      <div class="venue-box" style="min-height:650px;margin:0px auto">
          <el-row>
            <el-col :span="13">
              <div class="title">账户基本信息</div>
              <div class="input-div">
                <span style="width:100px;display:inline-block">登录账号：</span>
                <el-input v-model="account_id" placeholder="请输入场馆名称" :disabled="true"></el-input>
              </div>
              <div class="input-div">
                <span style="width:100px;display:inline-block">法人姓名：</span>
                <el-input v-model="legal_person_name" placeholder="请输入法人姓名" :disabled="disabled" ></el-input>
              </div>
              <div class="input-div">
                <span style="width:100px;display:inline-block">法人电话：</span>
                <el-input v-model="legal_person_phone" placeholder="请输入法人电话" :disabled="disabled" @change="phoneChange" type="number"></el-input>
              </div>
              <div class="input-div">
                <span style="width:100px;display:inline-block">场馆名称：</span>
                <el-input v-model="name" id="clearinpout" placeholder="请输入场馆名称" :disabled="disabled"></el-input>
              </div>
              <div class="input-div">
                <span style="width:100px;display:inline-block">场馆电话：</span>
                <el-input v-model="phone" placeholder="请输入场馆电话" :disabled="disabled"></el-input>
              </div>
              <div class="input-div">
                <span style="width:100px;display:inline-block">营业时间：</span>
                <el-time-picker
                  is-range
                  v-model="time"
                  @change="timeChoose"
                  range-separator="至"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  placeholder="选择时间范围" :disabled="disabled">
              </el-time-picker>
              </div>
              <div class="input-div">
                <span style="width:100px;display:inline-block;">场馆地址：</span>
                <el-tooltip class="item" effect="dark" placement="right">
                  <div slot="content">1.输入后请在下拉框中选择地址<br/>2.下拉框中若无具体地址，请选择相邻地址<br/>3.切勿有重复的信息</div>
                  <input name="address" id="address" maxlength="50"
                  class="botmar20 loe el-input__inner el-input el-input--medium" type="text" placeholder="请输入地址，比如：光谷" />
                </el-tooltip>
                <div id="searchResultPanel" style="border:1px solid #C0C0C0;height:auto; display:none;"></div>
                <div id="z-map" class="owntext"></div>
              </div>
            </el-col>
            <el-col :span="11">
              <div class="title">俱乐部LOGO</div>
              <ul class="ul-box" style="margin-bottom:30px;">
                <li>
                  <moreImg :boxWidth="200" :boxHeight="200" :imgWidth="512" :imgHeight="512" @imgUrl="getlogoimageUrl" @clearimgurl="reomveLogoimg" ref="imageLogo" :token="AdminToken"></moreImg>
                  <div class="div-dialog1" v-show="disabled"></div>
                </li>
              </ul>
              <div class="title">场馆照片</div>
              <ul class="ul-box">
                <li>
                  <moreImg :boxWidth="203" :boxHeight="118"  :imgWidth="750" :imgHeight="420" @imgUrl="getimageUrl" @clearimgurl="reomveimg" ref="image0"  :token="AdminToken"></moreImg>
                  <div class="div-dialog2" v-show="disabled"></div>
                </li>
              </ul>
              <div class="title">场馆特色：</div>
                <div class="checkbox1">
                  <el-row>
                    <el-col :span="8" v-for="(item, key) in listProject" :key="key">
                      <el-checkbox v-model="item.isCheck" @click="checked(key)">{{item.name}}
                      </el-checkbox>
                    </el-col>
                  </el-row>
                </div>
            </el-col>
          </el-row>
        <div class="bottom-content">
          <el-button @click='backLogin'>取消</el-button>
          <el-button type="info" style="background-color: #333333;" @click="modifyBtnOk" :loading="btnLoading">确认</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
let x_pi = 3.14159265358979324 * 3000.0 / 180.0
// var gg_lat, gg_lon, bd_lat, bd_lon
// 百度坐标转火星坐标(gcj02)
let bd_decrypt = function(bd_lat, bd_lon) {
  let x = bd_lon - 0.0065
  let y = bd_lat - 0.006
  let z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi)
  let theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi)
  let gg_lon = z * Math.cos(theta)
  let gg_lat = z * Math.sin(theta)
  return { lon: gg_lon, lat: gg_lat }
}
let ban_city_district = function(params, obj) {
  switch (obj.city) {
    case '北京市':
    case '天津市':
    case '上海市':
    case '重庆市':
      obj.province = obj.city
      obj.city = obj.district
      break
    case '香港':
      obj.province = '香港特别行政区'
      obj.city = obj.district
      break
    case '澳门':
      obj.province = '澳门特别行政区'
      obj.city = obj.district
      break
    default:
      obj.province = params.province
  }
}
import moreImg from '@/components/moreImg'
import { modifyRegister1 } from '@/api/registProgress'
import axios from 'axios'
export default {
  name: 'modifyRegister',
  data() {
    return {
      account_id: '', // 登录账号
      disabled: false,
      listProject: [], // 场馆特色
      listFacil: [], // 场馆设施
      feature: [], // 场馆特色
      facility: [], // 场馆设施
      name: '', // 场馆名称
      phone: '', // 场馆电话
      time: [new Date(2016, 9, 10, 8, 40), new Date(2016, 9, 10, 9, 40)], // 场馆营业时间
      logo: '', // 场馆Logo
      images: [], // 场馆照片
      legal_person_name: '',
      legal_person_phone: '',
      centerDialogVisible: false,
      allFormData: {},
      AdminToken: '',
      $routeParam: null,
      bmOnce: true,
      btnLoading: false
    }
  },
  created() {
    this.init()
  },
  mounted() {
    let province = ''
    let city = ''
    let self = this
    let _account_id = this.$route.params.account ? this.$route.params.account.account_id : 0
    this.AdminToken = this.$route.params.AdminToken
    if (_account_id) {
      this.$routeParam = this.$route.params
      // 初始设置位置信息
      this.allFormData.city = this.$routeParam.city
      this.allFormData.district = this.$routeParam.district
      this.allFormData.province = this.$routeParam.province
      this.allFormData.gps_lat = this.$routeParam.gps_lat
      this.allFormData.gps_lon = this.$routeParam.gps_lon
      // 设置场馆相关信息
      this.account_id = _account_id
      this.name = this.$routeParam.name
      this.phone = this.$routeParam.phone
      let _t = this.getTime(this.$routeParam.business_start, this.$routeParam.business_end)
      this.$set(this.time, 0, new Date(...(_t[0])))
      this.$set(this.time, 1, new Date(...(_t[1])))
      this.logo = this.$routeParam.logo
      this.$refs.imageLogo.setImg(this.logo)
      this.images.splice(1, 1, this.$routeParam.images[0])
      this.$refs['image0'].setImg(this.images[0])
      this.feature = this.$routeParam.feature
      this.legal_person_name = this.$routeParam.legal_person_name
      this.legal_person_phone = this.$routeParam.legal_person_phone
      // 省 经纬度
      this.province = this.$routeParam.province
      this.gps_lat = this.$routeParam.gps_lat
      this.gps_lon = this.$routeParam.gps_lon
      // 页面初始化
      setTimeout(() => {
        // 在地图上描点
        this.setMap(this.gps_lat, this.gps_lon)
        document.getElementById('address').value = this.$routeParam.address
        // 场馆特色
        // let listProjectNumb = 0
        // for (let i = 0; i < this.$routeParam.feature.length; i++) {
        //   listProjectNumb = listProjectNumb + Number(this.$routeParam.feature[i])
        // }
        // for (let i = 0; i < this.listProject.length; i++) {
        //   if ((parseInt(this.listProject[i].value) & listProjectNumb) === parseInt(this.listProject[i].value)) {
        //     this.listProject[i].isCheck = true
        //   }
        // }
        for (let i = 0; i < this.listProject.length; i++) {
          if ((parseInt(this.listProject[i].value) | this.feature) === this.feature) {
            this.listProject[i].isCheck = true
          }
        }
      }, 300)
    }
    function G(id) {
      return document.getElementById(id)
    }
    var Bm = setInterval(function() {
      if (typeof (BMap) !== 'undefined') {
        clearInterval(Bm)
        window.map = new BMap.Map('z-map')
        var top_right_navigation = new BMap.NavigationControl({
          anchor: BMAP_ANCHOR_TOP_RIGHT,
          type: BMAP_NAVIGATION_CONTROL_ZOOM
        })
        map.centerAndZoom('北京', 10) // 初始化地图,设置城市和地图级别。
        map.enableScrollWheelZoom() // 启用滚轮放大缩小，默认禁用
        var ac = new BMap.Autocomplete({
          // 建立一个自动完成的对象
          input: 'address',
          location: map,
          'onSearchComplete': function(result) {
            // 处理结果
            if (self.bmOnce) {
              self.bmOnce = false
              ac.hide()
            }
          }
        })
        ac.addEventListener('onhighlight', function(e) {
          // 鼠标放在下拉列表上的事件
          var str = ''
          var _value = e.fromitem.value
          var value = ''
          if (e.fromitem.index > -1) {
            value =
              _value.province +
              _value.city +
              _value.district +
              _value.street +
              _value.business
          }
          str =
            'FromItem<br />index = ' +
            e.fromitem.index +
            '<br />value = ' +
            value

          value = ''
          if (e.toitem.index > -1) {
            _value = e.toitem.value
            value =
              _value.province +
              _value.city +
              _value.district +
              _value.street +
              _value.business
          }
          str +=
            '<br />ToItem<br />index = ' +
            e.toitem.index +
            '<br />value = ' +
            value
          G('searchResultPanel').innerHTML = str
        })
        var myValue
        ac.addEventListener('onconfirm', function(e) {
          // 鼠标点击下拉列表后的事件
          var _value = e.item.value
          myValue =
            _value.province +
            _value.city +
            _value.district +
            _value.street +
            _value.business
          // city = _value.city
          // province = _value.province ? _value.province : city
          self.allFormData.province = _value.province
          self.allFormData.city = _value.city
          self.allFormData.district = _value.district
          G('searchResultPanel').innerHTML =
            'onconfirm<br />index = ' +
            e.item.index +
            '<br />myValue = ' +
            myValue
          setPlace()
        })
        /*eslint no-unused-vars: 0*/
        var marker
        var geoc = new BMap.Geocoder()
        var gps_lat = 0
        var gps_lon = 0
        var setPlace = function() {
          map.clearOverlays() // 清除地图上所有覆盖物
          function myFun() {
            var itemInfo = local.getResults().getPoi(0)
            if (!itemInfo) {
              alert('地址信息不全，请选择相邻地址')
              return
            }
            var pp = itemInfo.point // 获取第一个智能搜索的结果
            map.centerAndZoom(pp, 18)
            marker = new BMap.Marker(pp)
            map.addOverlay(marker) // 添加标注
            marker.enableDragging()
            gps_lat = marker.point.lat
            gps_lon = marker.point.lng
            let gggps = bd_decrypt(gps_lat, gps_lon)
            // self.allFormData.province = itemInfo.province || self.allFormData.province
            ban_city_district(itemInfo, self.allFormData)
            self.allFormData.gps_lat = gggps.lat
            self.allFormData.gps_lon = gggps.lon
            marker.addEventListener('dragend', function(e) {
              geoc.getLocation(e.point, function(rs) {
                var addComp = rs.addressComponents
                document.getElementById('address').value =
                  addComp.province +
                  addComp.city +
                  addComp.district +
                  addComp.street +
                  addComp.streetNumber
                if (addComp.province.length === 0) {
                  city = addComp.city
                } else {
                  city = addComp.city
                  province = addComp.province
                }
                self.allFormData.city = addComp.city
                self.allFormData.province = addComp.province
                  ? addComp.province
                  : addComp.city
                self.allFormData.district = addComp.district
                ban_city_district(addComp, self.allFormData)
                gps_lat = marker.point.lat
                gps_lon = marker.point.lng
                let gggps = bd_decrypt(gps_lat, gps_lon)
                self.allFormData.gps_lat = gggps.lat
                self.allFormData.gps_lon = gggps.lon
              })
            })
          }
          /* eslint no-undef: 0 */
          var local = new BMap.LocalSearch(map, {
            // 智能搜索
            onSearchComplete: myFun
          })
          local.search(myValue)
        }
      }
    }, 30)
  },
  beforeRouteEnter(to, from, next) {
    if (from.path === '/') {
      next({ path: '/login' })
    } else {
      next()
    }
  },
  methods: {
    timeChoose(data) {
      this.allFormData.business_start = this.getHHMM(data[0])
      this.allFormData.business_end = this.getHHMM(data[1])
    },
    getlogoimageUrl(imgname) {
      this.logo = imgname
    },
    reomveLogoimg(data) {
      this.logo = data
    },
    getimageUrl(imgname) {
      this.images.push(imgname)
    },
    reomveimg(index, data) {
      this.images.splice(index, 1)
    },
    getTime(startTime, endTime) {
      let result = []
      let _startTime = startTime.split(':')
      let _endTime = endTime.split(':')
      let date = new Date()
      let year = date.getFullYear()
      let month = date.getMonth() + 1
      let day = date.getDate()
      let startHH = Number(_startTime[0])
      let startMM = Number(_startTime[1])
      let endHH = Number(_endTime[0])
      let endMM = Number(_endTime[1])
      let _statArry = [year, month, day, startHH, startMM]
      let _endArry = [year, month, day, endHH, endMM]
      result.push(_statArry)
      result.push(_endArry)
      return result
    },
    backLogin() {
      this.$router.push('/login')
    },
    modifyBtnOk() {
      if (!this.legal_person_name) {
        this.common.message('warning', '法人姓名不能为空')
        return false
      }
      if (!this.legal_person_phone) {
        this.common.message('warning', '法人电话不能为空')
        return false
      }
      if (!(/^1[0-9]{10}$/.test(this.legal_person_phone))) {
        this.common.message('warning', '请输入正确的法人电话号码')
      }
      if (!this.logo.length) {
        this.common.message('warning', '场馆LOGO不能为空')
        return false
      }
      if (!this.images.length) {
        this.common.message('warning', '场馆图片不能为空')
        return false
      }
      if (!this.name) {
        this.common.message('warning', '场馆名字不能为空')
        return false
      }
      if (!this.allFormData.province || !this.allFormData.gps_lat || !this.allFormData.gps_lon) {
        this.common.message('error', '请填写正确的场馆地址，且必须从下拉框中选择地址')
        return false
      }
      if (!this.time) {
        this.common.message('warning', '场馆营业时间不能为空')
        return false
      }
      let curcity = document.getElementById('address').value
      if (!curcity.length) {
        this.common.message('warning', '场馆地址不能为空')
        return false
      }
      // 获取选中的场馆特色
      this.listProject
      let _feature = []
      for (let j = 0; j < this.listProject.length; j++) {
        if (this.listProject[j].isCheck) {
          _feature.push(this.listProject[j].value)
        }
      }
      if (_feature.length === 0) {
        this.common.message('error', '请选择场馆特色')
        return false
      }
      this.btnLoading = true
      this.allFormData.account_id = this.account_id
      this.allFormData.logo = this.logo
      this.allFormData.images = this.images
      this.allFormData.name = this.name
      this.allFormData.phone = this.phone
      this.allFormData.address = curcity
      this.allFormData.feature = _feature
      this.allFormData.facility = this.$routeParam.facility
      this.allFormData.business_start = this.getHHMM(this.time[0])
      this.allFormData.business_end = this.getHHMM(this.time[1])
      this.allFormData.legal_person_name = this.legal_person_name
      this.allFormData.legal_person_phone = this.legal_person_phone
      let _service = axios.create({
        baseURL: process.env.BASE_API, // api的base_url
        timeout: 5000 // request timeout
      })
      // request interceptor
      _service.interceptors.request.use(config => {
        config.headers['Authorization'] = 'Bearer ' + this.AdminToken
        return config
      }, error => {
        Promise.reject(error)
      })
      // respone interceptor
      _service.interceptors.response.use(
        response => {
          return response
        },
        error => {
          let err = error.response
          let statusCode = err.data.status_code
          let errorCode = err.data.error_code
          if (statusCode === 422) {
            if (errorCode === 20000) {
              for (let key in err.data.errors) {
                this.$message.error(err.data.errors[key][0])
              }
            } else {
              this.$message.error(err.data.message)
            }
          }
          return Promise.reject(err)
        }
      )
      // _service.post('/v1/gym/audits/update_register_audit', this.allFormData).then(res => {
      _service.post('/v1/gym/update_register', this.allFormData).then(res => {
        if (res) {
          this.$message({
            message: '恭喜你，修改注册信息成功',
            type: 'success',
            duration: 2000
          })
          let p = setTimeout(() => {
            clearTimeout(p)
            this.btnLoading = false
            this.$router.push('/login')
          }, 2500)
        }
      }).catch(err => {
        this.btnLoading = false
        console.log('请求错误', err)
      })
    },
    getHHMM(param) {
      let result = ''
      let date = new Date(param)
      let hour = date.getHours() > 9 ? date.getHours() : '0' + date.getHours()
      let min = date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes()
      result = hour + ':' + min
      return result
    },
    setMap(lat, lon) {
      if (lat && lon) {
        let gpsold = bd_decrypt(lat, lon)
        let point = new BMap.Point(116.404, 39.915)
        point = new BMap.Point(gpsold.lon, gpsold.lat)
        let marker = new BMap.Marker(point)
        window.map.addOverlay(marker) // 添加标注
        setTimeout(function() {
          window.map.centerAndZoom(point, 18)
        }, 200)
      }
    },
    init() {
      this.$store.dispatch('GetFeatures').then((res) => {
        for (let key in res) {
          // 场馆特色
          this.listProject.push({ name: res[key], value: key, isCheck: false })
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    phoneChange(value) {
      if (!(/^1[0-9]{10}$/.test(value))) {
        this.common.message('warning', '请输入正确的法人电话号码')
      }
    }
  },
  components: {
    moreImg
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" >
.modifyRegister-box {
  .logo{
    width: 200px;
    margin-left:20px;
    height: 58px;
    background: url(../../assets/logo_img/LOGO.png) no-repeat;
    background-position: left;
    background-size: 200px;
  }
  .bg_top{
    width: 100%;
    height: 140px;
    background: url(../../assets/logo_img/reg-bg-top.png) no-repeat 100% 100%;
    background-size: cover;
    color: #fff;
    font-size: 36px;
    text-align: center;
    line-height: 140px;
  }
  .modifyRegister-content{
    width: 80%;
    margin: 0px auto;
    margin-top: 60px;
    .venue-box {
      border: 1px solid #ddd;
      padding: 20px 20px 0 20px;
      margin: 20px 20px 0 20px;
      .title {
        font-weight: 700;
        margin-bottom: 30px;
        font-size: 20px;
      }
      .input-div {
        margin-bottom: 20px;
        position: relative;
        .checkbox1 {
          display: inline-block;
          margin-left: 10px;
          vertical-align: top;
        }
        .checkbox2 {
          display: inline-block;
          margin-left: 10px;
          vertical-align: top;
          div {
            margin-bottom: 10px;
          }
        }
        .eye-icon {
          width: 37px;
          height: 36px;
          background: url(/static/superscreen/img/eye.png) center no-repeat;
          background-size: cover;
          display: inline-block;
        }
      }
      .ul-box {
        overflow: hidden;
        margin: 0;
        padding: 0;
        li {
          list-style: none;
          width: 40%;
          max-width: 214px;
          min-height: 100px;
          float: left;
          margin-right: 15px;
          margin-bottom: 15px;
          text-align: center;
          color: #ddd;
          position: relative;
          i,
          div {
            color: #ddd;
          }
        }
        .div-dialog1 {
          width: 200px;
          height: 200px;
          position: absolute;
          top: 0;
          left: 0;
          background: rgba(245, 247, 250, 0.8);
        }
        .div-dialog2 {
          width: 203px;
          height: 118px;
          position: absolute;
          top: 0;
          left: 0;
          background: rgba(245, 247, 250, 0.8);
        }
      }
      .div-label {
        line-height: 60px;
      }
      .div-h {
        margin-top: 60px;
      }
      .div-type {
        font-size: 20px;
        span {
          color: #f14c30;
          font-weight: bold;
          margin-right: 20px;
        }
      }
      .tip {
        color: #1878e1;
        font-size: 14px;
        margin-top: 40px;
      }
      .owntext{
        height: 200px;
        width: 405px;
        margin-top: 15px;
      }
    }
    .bottom-content{
      text-align: center;
      margin-bottom: 20px;
    }
    .errInputStyle{
      position: relative;
      .el-input__inner{
        border-color: #f56c6c;
      }
    }
    .el-form-item__error{
      position: absolute;
      left: 103px;
    }
  }
}
</style>


