<template>
  <div style="height: 100%;position:relative;">
    <!-- <div class="edit-box">
      <el-button class="edit-button" @click="canWrite" v-show="btnRoleList['5-5-1']&&buttonIsEdit"><i class="el-icon-edit"></i> 修改信息</el-button>
      <el-button class="save-button" @click="saveMofify" type="primary" v-show="btnRoleList['5-5-1']&&(!buttonIsEdit)" :loading="loading"><i class="el-icon-check"></i> 保存修改</el-button>
      <div v-if="isEditMsg === true" class="tipMsg">{{checkMsg}}</div>
    </div> -->
    <el-row :gutter="20" style="height:100%;position:relative;padding:20px;">
      <el-col :xl="16" :lg="24">
        <div class="venue-box" style="min-height:836px;">
            <div class="title-box">
              <span>俱乐部信息</span>
              <div class="edit-box">
                <el-button class="edit-button" @click="canWrite" v-show="btnRoleList['5-5-1']&&buttonIsEdit"><i class="el-icon-edit"></i> 修改信息</el-button>
                <el-button class="save-button" @click="saveMofify" type="primary" v-show="btnRoleList['5-5-1']&&(!buttonIsEdit)" :loading="loading"><i class="el-icon-check"></i> 保存修改</el-button>
                <div class="tipMsg" :class="checkClass==='yellow'?'tipYellow':'tipred'">{{checkMsg}}</div>
              </div>
            </div>
            <el-row>
              <el-col :span="13">
                <div class="title">场馆基本信息</div>
                <div class="input-div">
                  <span>场馆名称：</span>
                  <span v-if="disabled">{{name}}</span>
                  <el-input v-model="name" id="clearinpout" placeholder="请输入场馆名称" v-if="!disabled" :maxlength="20"></el-input>
                </div>
                <div class="input-div">
                  <span>场馆电话：</span>
                  <span v-if="disabled">{{phone}}</span>
                  <el-input v-model="phone" placeholder="请输入场馆电话" v-if="!disabled" @change="phoneChange"></el-input>
                </div>
                <div class="input-div">
                  <span>营业时间：</span>
                  <span v-if="disabled">{{business_start}} 至 {{business_end}}</span>
                  <el-time-picker
                    is-range
                    v-model="time"
                    range-separator="至"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间"
                    placeholder="选择时间范围" format="HH:mm" v-if="!disabled">
                  </el-time-picker>
                </div>
                <div class="input-div">
                  <span>场馆地址：</span>
                  <span v-if="disabled">{{address}}</span>
                  <el-tooltip class="item" effect="dark" placement="right">
                    <div slot="content">1.输入后请在下拉框中选择地址<br/>2.下拉框中若无具体地址，请选择相邻地址<br/>3.切勿有重复的信息</div>
                    <input name="address" id="address" maxlength="50" 
                    class="botmar20 loe el-input__inner el-input el-input--medium" type="text" placeholder="请输入地址，比如：光谷" v-show="!disabled"/>
                  </el-tooltip>
                  <div id="searchResultPanel" style="border:1px solid #C0C0C0;height:auto; display:none;"></div>
                  <div id="z-map" class="owntext"></div>
                </div>
                <div class="input-div">
                  <span>场馆特色：</span>
                  <div class="checkbox1">
                    <el-row>
                      <el-col :span="8" v-for="(item, key) in listProject" :key="key">
                        <el-checkbox v-model="item.isCheck" @click="checked(key)" :disabled="disabled">{{item.name}}
                        </el-checkbox>
                      </el-col>
                    </el-row>
                  </div>
                </div>
                <!-- <div class="input-div">
                  <span>场馆设施：</span>
                  <div class="checkbox2">
                  <el-row>
                      <el-col :span="8" v-for="(item, key) in listFacil" :key="key">
                        <el-checkbox v-model=item.isCheck :disabled="disabled" @click="fiaclchecked(key)">{{item.name}}
                        </el-checkbox>
                      </el-col>
                    </el-row>
                  </div>
                </div> -->
              </el-col>
              <el-col :span="11">
                <div class="title">俱乐部LOGO</div>
                <ul class="ul-box" style="margin-bottom:30px;">
                  <li>
                    <moreImg :boxWidth="200" :boxHeight="200" @imgUrl="getlogoimageUrl" :imgWidth='220' :imgHeight='220' @clearimgurl="reomveLogoimg" ref="imageLogo"></moreImg>
                    <div class="div-dialog1" v-if="disabled"></div>
                  </li>
                </ul>
                <div class="title">场馆照片</div>
                <ul class="ul-box">
                  <li  v-show="(buttonIsEdit&&photo1)||(!buttonIsEdit)">
                    <moreImg :boxWidth="200" :boxHeight="118" :imgWidth='710' :imgHeight='284' @imgUrl="getimageUrl1" @clearimgurl="reomveimg1" ref="image0"></moreImg>
                    <div class="div-dialog2" v-if="disabled"></div>
                  </li>
                  <li  v-show="(buttonIsEdit&&photo2)||(!buttonIsEdit)">
                    <moreImg :boxWidth="200" :boxHeight="118" :imgWidth='710' :imgHeight='284' @imgUrl="getimageUrl2" @clearimgurl="reomveimg2" ref="image1"></moreImg>
                    <div class="div-dialog2" v-if="disabled"></div>
                  </li>
                  <li v-show="(buttonIsEdit&&photo3)||(!buttonIsEdit)">
                    <moreImg :boxWidth="200" :boxHeight="118" :imgWidth='710' :imgHeight='284' @imgUrl="getimageUrl3" @clearimgurl="reomveimg3" ref="image2"></moreImg>
                    <div class="div-dialog2" v-if="disabled"></div>
                  </li>
                  <li  v-show="(buttonIsEdit&&photo4)||(!buttonIsEdit)">
                    <moreImg :boxWidth="200" :boxHeight="118" :imgWidth='710' :imgHeight='284' @imgUrl="getimageUrl4" @clearimgurl="reomveimg4" ref="image3"></moreImg>
                    <div class="div-dialog2" v-if="disabled"></div>
                  </li>
                  <li  v-show="(buttonIsEdit&&photo5)||(!buttonIsEdit)">
                    <moreImg :boxWidth="200" :boxHeight="118" :imgWidth='710' :imgHeight='284' @imgUrl="getimageUrl5" @clearimgurl="reomveimg5" ref="image4"></moreImg>
                    <div class="div-dialog2" v-if="disabled"></div>
                  </li>
                  <li v-show="(buttonIsEdit&&photo6)||(!buttonIsEdit)">
                    <moreImg :boxWidth="200" :boxHeight="118" :imgWidth='710' :imgHeight='284' @imgUrl="getimageUrl6" @clearimgurl="reomveimg6" ref="image5"></moreImg>
                    <div class="div-dialog2" v-if="disabled"></div> 
                  </li>
                </ul>
              </el-col>
            </el-row>
        </div>
      </el-col>
      <el-col :xl="8" :lg="24">
        <div class="venue-box" style="min-height:836px;padding-bottom:50px;">
          <div class="title-box"><span>俱乐部法人信息实名认证</span></div>
          <div class="title">法人信息</div>
          <div class="div-label">
            <span>法人姓名：</span>
            <span>{{rzMsgForm.legal_person_name}}</span>
          </div>
          <div class="div-label">
            <span>联系电话：</span>
            <span>{{rzMsgForm.legal_person_phone}}</span>
          </div>
          <div class="cardMsg" v-if="isAuthen">
            <div class="title">银行卡信息</div>
            <el-form :model="rzMsgForm" :rules="rules" class="rzMsgForm cardCountBox" ref="rzMsgForm">
              <el-form-item label="账户名称：" prop="accountName">
                <div class="div">{{rzMsgForm.accountName}}</div>
              </el-form-item>
              <el-form-item label="开户行-支行：" prop="openBank">
                <div class="div">{{rzMsgForm.openBank}}</div>
              </el-form-item>
              <el-form-item label="银行账号：" prop="backAccount">
                <div class="div">{{rzMsgForm.backAccount}}</div>
              </el-form-item>
              <div class="tips countTips">注意：请确认填写信息，如信息填写错误，将无法结算打款</div>
            </el-form>
          </div>
          <div class="title div-h">实名认证</div>
          <div class="div-type">
            <span :class="isAuthen ? 'AuthenMsgGreen' : 'AuthenMsgRed'" v-if="!isAuthen">{{AuthenMsg}}</span>
            <el-button type="primary" @click="getAuthen" v-if="btnRoleList['5-5-2']&&(isAuthen === false)">点击认证</el-button>
            <el-button type="primary" @click="getAuthen" v-if="btnRoleList['5-5-2']&&(isAuthen === true)">修改认证</el-button>
          </div>
          <div class="tip">
            注：通过认证后才能在"牛啦系统"的牛啦APP中发布课程信息，如有疑问请联系客服：400-0787-520
          </div>
        </div>
      </el-col>
    </el-row>
    <!-- 提交认证 -->
    <el-dialog
      title="上传认证资料"
      :visible.sync="centerDialogVisible"
      :close-on-click-modal="false"
      width="1200px"
      class="authentication-dialog" @close="addclose">
      <div class="msgBox">
        <div class="box-left">
          <h3>上传<span>{{rzMsgForm.legal_person_name}}</span>身份证信息</h3>
          <div class="card-box">
            <div class="card-z">
              <div class="title"><b class="must-red">*</b>身份证正面</div>
              <moreImg :boxWidth="220" :boxHeight="140" @imgUrl="getIDZimageUrl" :nature='true' :imgWidth="1050" :imgHeight="768" @clearimgurl="reomveIDZimg" ref="card_front"></moreImg>
            </div>
            <div class="card-f">
              <div class="title"><b class="must-red">*</b>身份证反面</div>
              <moreImg :boxWidth="220" :boxHeight="140" @imgUrl="getIDFimageUrl" :nature='true' :imgWidth="1050" :imgHeight="768" @clearimgurl="reomveIDFimg" ref="card_back"></moreImg>
            </div>
          </div>
          <div class="div-bottom">
            <h3>上传<span>{{rzMsgForm.gym_name}}</span>场馆营业执照</h3>
            <div class="title"><b class="must-red">*</b>工商营业执照</div>
            <moreImg :boxWidth="220" :boxHeight="140" @imgUrl="getLicenseimageUrl" :nature="true" :imgWidth="1050" :imgHeight="768" @clearimgurl="reomveLicenseimg" ref="license"></moreImg>
          </div>
        </div>

        <div class="box-right">
          <h3>填写<span>{{rzMsgForm.legal_person_name}}</span>银行卡信息</h3>
          <el-form :model="rzMsgForm" :rules="rules" class="rzMsgForm" ref="rzMsgForm">
            <el-form-item label="账户名称：" prop="accountName">
              <el-input type="text" v-model="rzMsgForm.accountName" placeholder="请输入账户名称" :maxlength="20"></el-input>
            </el-form-item>
            <el-form-item label="开户行-支行：" prop="openBank">
              <el-input type="text" v-model="rzMsgForm.openBank" placeholder="请输入开户行，例：中国工商银行-广州大学城支行" :maxlength="50"></el-input>
            </el-form-item>
            <el-form-item label="银行账号：" prop="backAccount">
              <el-input v-model="rzMsgForm.backAccount" placeholder="请输入银行卡账号" type="number"></el-input>
            </el-form-item>
            <div class="tips">注意：请确认填写信息，如信息填写错误，将无法结算打款</div>
          </el-form>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button :loading="submitloading" @click="getAuthentication">提交认证</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import moreImg from '@/components/moreImg'
import { getVenueMessage, venueApply, finishApply } from '@/api/senior'
import { parseTime } from '@/utils/index'
// 火星坐标转百度坐标
const bd_encrypt = function(gg_lat, gg_lon) {
  let x_pi = 3.14159265358979324 * 3000.0 / 180.0
  let x = gg_lon
  let y = gg_lat
  let z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi)
  let theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi)
  let bd_lon = z * Math.cos(theta) + 0.0065
  let bd_lat = z * Math.sin(theta) + 0.006
  // console.log(bd_lat + ',' + bd_lon)
  return { lat: bd_lat, lon: bd_lon }
}
var map = ''
export default {
  name: 'venueMessage',
  components: {
    moreImg
  },
  data() {
    const validateBackAccount = (rule, value, callback) => {
      let num = /^\d*$/ // 全数字
      // let strBin = '10,18,30,35,37,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,58,60,62,65,68,69,80,84,87,88,94,95,98,99'
      if (value.length < 16 || value.length > 24) {
        callback(new Error('行卡号长度必须在16到24之间'))
      } else if (!num.exec(value)) {
        callback(new Error('银行卡号必须全为数字'))
      } else {
        callback()
      }
      // if (strBin.indexOf(value.substring(0, 2)) === -1) {
      //   callback(new Error('银行卡号开头6位不符合规范'))
      // } else
    }
    return {
      btnRoleList: {}, // tab/btn权限
      disabled: true,
      buttonIsEdit: true,
      loading: false,
      submitloading: false,
      id: 34,
      checkMsg: '',
      checkClass: '',
      AuthenMsg: '', // 认证状态
      isAuthen: false, // false:未认证
      isEditMsg: false,
      listProject: [], // 场馆特色
      listFacil: [], // 场馆设施
      feature: [], // 场馆特色
      facility: [], // 场馆设施
      name: '', // 场馆名称
      phone: '', // 场馆电话
      time: [new Date(2016, 9, 10, 8, 40), new Date(2016, 9, 10, 9, 40)], // 场馆营业时间
      business_start: '',
      business_end: '',
      address: '', // 场馆地址
      logo: '', // 场馆Logo
      images: [], // 场馆照片
      centerDialogVisible: false,
      allFormData: {
        province: '',
        gps_lat: '',
        gps_lon: ''
      },
      rzMsgForm: { // 认证信息
        gym_name: '', // 健身房名字
        legal_person_name: '', // 法人姓名
        legal_person_phone: '', // 法人手机号
        accountName: '', // 账户名称
        openBank: '', // 开户行
        backAccount: '', // 银行卡号
        id_card_front: '', // 身份证正面照
        id_card_back: '', // 身份证反面照
        license: '' // 营业执照
      },
      photo1: '',
      photo2: '',
      photo3: '',
      photo4: '',
      photo5: '',
      photo6: '',
      rules: {
        accountName: [{ required: true, message: '请填写账户名称' }],
        openBank: [{ required: true, message: '请填写开户行' }],
        backAccount: [{ required: true, validator: validateBackAccount }]
      },
      bmOnce: true
    }
  },
  computed: {
  },
  created() {
    this.common.eachBtnRole(this.btnRoleList) // 按钮权限方法
    this.init()
    this.getData()
  },
  mounted() {
    var self = this
    var province = ''
    var city = ''
    function G(id) {
      return document.getElementById(id)
    }
    var Bm = setInterval(function() {
      if (typeof (BMap) !== 'undefined') {
        clearInterval(Bm)
        map = new BMap.Map('z-map')
        var top_right_navigation = new BMap.NavigationControl({
          anchor: BMAP_ANCHOR_TOP_RIGHT,
          type: BMAP_NAVIGATION_CONTROL_ZOOM
        })
        map.centerAndZoom('北京', 10) // 初始化地图,设置城市和地图级别。
        map.enableScrollWheelZoom() // 启用滚轮放大缩小，默认禁用
        var ac = new BMap.Autocomplete({ // 建立一个自动完成的对象
          'input': 'address',
          'location': map,
          'onSearchComplete': function(result) {
            // 处理结果
            if (self.bmOnce) {
              self.bmOnce = false
              ac.hide()
            }
          }
        })
        ac.addEventListener('onhighlight', function(e) { // 鼠标放在下拉列表上的事件
          var str = ''
          var _value = e.fromitem.value
          var value = ''
          if (e.fromitem.index > -1) {
            value = _value.province + _value.city + _value.district + _value.street + _value.business
          }
          str = 'FromItem<br />index = ' + e.fromitem.index + '<br />value = ' + value

          value = ''
          if (e.toitem.index > -1) {
            _value = e.toitem.value
            value = _value.province + _value.city + _value.district + _value.street + _value.business
          }
          str += '<br />ToItem<br />index = ' + e.toitem.index + '<br />value = ' + value
          G('searchResultPanel').innerHTML = str
        })
        var myValue
        ac.addEventListener('onconfirm', function(e) { // 鼠标点击下拉列表后的事件
          var _value = e.item.value
          myValue = _value.province + _value.city + _value.district + _value.street + _value.business
          // city = _value.city
          // province = _value.province ? _value.province : city
          self.allFormData.province = _value.province
          self.allFormData.city = _value.city
          self.allFormData.district = _value.district
          G('searchResultPanel').innerHTML = 'onconfirm<br />index = ' + e.item.index + '<br />myValue = ' + myValue
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
              alert('该地址信息缺失，请选择相近地址')
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
            ban_city_district(itemInfo, self.allFormData)
            // self.allFormData.province = itemInfo.province || self.allFormData.province
            self.allFormData.gps_lat = gggps.lat
            self.allFormData.gps_lon = gggps.lon
            marker.addEventListener('dragend', function(e) {
              geoc.getLocation(e.point, function(rs) {
                var addComp = rs.addressComponents
                document.getElementById('address').value = addComp.province + addComp.city + addComp.district + addComp.street + addComp.streetNumber
                if (addComp.province.length === 0) {
                  city = addComp.city
                } else {
                  city = addComp.city
                  province = addComp.province
                }
                self.allFormData.city = addComp.city
                self.allFormData.province = addComp.province ? addComp.province : addComp.city
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
          var local = new BMap.LocalSearch(map, { // 智能搜索
            onSearchComplete: myFun
          })
          local.search(myValue)
        }
        // bd_decrypt(116.404, 39.915);
        var x_pi = 3.14159265358979324 * 3000.0 / 180.0
        // var gg_lat, gg_lon, bd_lat, bd_lon
        // 百度坐标转火星坐标(gcj02)
        var bd_decrypt = function(bd_lat, bd_lon) {
          var x = bd_lon - 0.0065
          var y = bd_lat - 0.006
          var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi)
          var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi)
          var gg_lon = z * Math.cos(theta)
          var gg_lat = z * Math.sin(theta)
          return { lon: gg_lon, lat: gg_lat }
        }
        var ban_city_district = function(params, obj) {
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
      }
    }, 30)
  },
  methods: {
    getlogoimageUrl(imgname) {
      this.logo = imgname
    },
    reomveLogoimg(data) {
      this.logo = data
    },
    getimageUrl1(imgname) {
      this.photo1 = imgname
    },
    reomveimg1(data) {
      this.photo1 = data
    },
    getimageUrl2(imgname) {
      this.photo2 = imgname
    },
    reomveimg2(data) {
      this.photo2 = data
    },
    getimageUrl3(imgname) {
      this.photo3 = imgname
    },
    reomveimg3(data) {
      this.photo3 = data
    },
    getimageUrl4(imgname) {
      this.photo4 = imgname
    },
    reomveimg4(data) {
      this.photo4 = data
    },
    getimageUrl5(imgname) {
      this.photo5 = imgname
    },
    reomveimg5(data) {
      this.photo5 = data
    },
    getimageUrl6(imgname) {
      this.photo6 = imgname
    },
    reomveimg6(data) {
      this.photo6 = data
    },
    getIDZimageUrl(imgname) {
      this.rzMsgForm.id_card_front = imgname
    },
    reomveIDZimg(data) {
      this.rzMsgForm.id_card_front = data
    },
    getIDFimageUrl(imgname) {
      this.rzMsgForm.id_card_back = imgname
    },
    reomveIDFimg(data) {
      this.rzMsgForm.id_card_back = data
    },
    getLicenseimageUrl(imgname) {
      this.rzMsgForm.license = imgname
    },
    reomveLicenseimg(data) {
      this.rzMsgForm.license = data
    },
    // 添加/编辑弹框关闭时清楚数据
    addclose() {
      this.$refs.rzMsgForm.resetFields()
      this.loading = false
      this.$refs.card_front.deleteimgbtn()
      this.$refs.card_back.deleteimgbtn()
      this.$refs.license.deleteimgbtn()
    },
    // 获得场馆详情
    getData() {
      getVenueMessage().then((res) => {
        this.allFormData.province = res.data.gym.province
        this.allFormData.gps_lat = res.data.gym.gps_lat
        this.allFormData.gps_lon = res.data.gym.gps_lon
        this.rzMsgForm.legal_person_name = res.data.gym.legal_person_name
        this.rzMsgForm.legal_person_phone = res.data.gym.legal_person_phone
        if (res.data.gym.gps_lat && res.data.gym.gps_lon) {
          let gpsold = bd_encrypt(res.data.gym.gps_lat, res.data.gym.gps_lon)
          let point = new BMap.Point(116.404, 39.915)
          point = new BMap.Point(gpsold.lon, gpsold.lat)
          let marker = new BMap.Marker(point)
          map.addOverlay(marker) // 添加标注
          setTimeout(function() {
            map.centerAndZoom(point, 18)
          }, 200)
        }
        // 场馆是否认证&基本信息是否审核
        if (res.data.gym.base_info_audit_id) {
          this.checkMsg = '状态：审核中'
          this.checkClass = 'yellow'
        }
        // 场馆是否认证
        if (res.data.gym.is_auth_pass === 3) {
          this.AuthenMsg = '未认证'
          this.isAuthen = false
        } else {
          if (res.data.gym.auth_audit_id) { // auth_audit_id>0,审核中
            this.AuthenMsg = '审核中'
          } else {
            this.isAuthen = true
          }
        }
        // 俱乐部基础信息
        if (res.data.gym) {
          this.isEditMsg = false
          this.name = res.data.gym.name
          this.phone = res.data.gym.phone
          this.rzMsgForm.gym_name = res.data.gym.name
          document.getElementById('address').value = res.data.gym.address
          // 营业时间
          this.address = res.data.gym.address
          let start = new Date(2018, 3, 3, parseInt(res.data.gym.business_start.split(':')[0]), parseInt(res.data.gym.business_start.split(':')[1]))
          let end = new Date(2018, 3, 3, parseInt(res.data.gym.business_end.split(':')[0]), parseInt(res.data.gym.business_end.split(':')[1]))
          this.time = [start, end]
          this.business_start = res.data.gym.business_start
          this.business_end = res.data.gym.business_end
          // 场馆logo
          this.logo = res.data.gym.logo
          this.$nextTick(() => {
            this.$refs.imageLogo.setImg(res.data.gym.logo)
            if (res.data.gym.images !== null) {
              let imgPhones = []
              for (let i = 0; i < res.data.gym.images.length; i++) {
                if (res.data.gym.images[i] !== '') {
                  imgPhones.push(res.data.gym.images[i])
                }
              }
              if (imgPhones[0]) {
                this.$refs.image0.setImg(imgPhones[0])
                this.photo1 = imgPhones[0]
              } else {
                this.$refs.image0.deleteimgbtn()
                this.photo1 = ''
              }
              if (imgPhones[1]) {
                this.$refs.image1.setImg(imgPhones[1])
                this.photo2 = imgPhones[1]
              } else {
                this.$refs.image1.deleteimgbtn()
                this.photo2 = ''
              }
              if (imgPhones[2]) {
                this.$refs.image2.setImg(imgPhones[2])
                this.photo3 = imgPhones[2]
              } else {
                this.$refs.image2.deleteimgbtn()
                this.photo3 = ''
              }
              if (imgPhones[3]) {
                this.$refs.image3.setImg(imgPhones[3])
                this.photo4 = imgPhones[3]
              } else {
                this.$refs.image3.deleteimgbtn()
                this.photo4 = ''
              }
              if (imgPhones[4]) {
                this.$refs.image4.setImg(imgPhones[4])
                this.photo5 = imgPhones[4]
              } else {
                this.$refs.image4.deleteimgbtn()
                this.photo5 = ''
              }
              if (imgPhones[5]) {
                this.$refs.image5.setImg(imgPhones[5])
                this.photo6 = imgPhones[5]
              } else {
                this.$refs.image5.deleteimgbtn()
                this.photo6 = ''
              }
            } else {
              this.images = []
            }
          })
          for (let i = 0; i < this.listProject.length; i++) {
            if ((parseInt(this.listProject[i].value) & res.data.gym.feature) === parseInt(this.listProject[i].value)) {
              this.listProject[i].isCheck = true
            }
          }
          // 场馆设施
          for (let i = 0; i < this.listFacil.length; i++) {
            if (this.listFacil[i].value & res.data.gym.facility > 0) {
              this.listFacil[i].isCheck = true
            }
          }
          // 认证信息
          this.rzMsgForm.id_card_front = res.data.gym.id_card_front // 身份证正面
          this.rzMsgForm.id_card_back = res.data.gym.id_card_back // 身份证反面
          this.rzMsgForm.license = res.data.gym.license // 营业执照
          this.$refs.card_front.setImg(res.data.gym.id_card_front)
          this.$refs.card_back.setImg(res.data.gym.id_card_back)
          this.$refs.license.setImg(res.data.gym.license)
          this.rzMsgForm.accountName = res.data.gym.bank_card.name // 账户
          this.rzMsgForm.openBank = res.data.gym.bank_card.bank // 开户行
          this.rzMsgForm.backAccount = res.data.gym.bank_card.no // 银行账号
        }
      }).catch(() => {
      })
    },
    canWrite() {
      this.disabled = !this.disabled
      this.buttonIsEdit = !this.buttonIsEdit
    },
    // 保存修改
    saveMofify() {
      this.images = []
      if (this.photo1) {
        this.images.push(this.photo1)
      }
      if (this.photo2) {
        this.images.push(this.photo2)
      }
      if (this.photo3) {
        this.images.push(this.photo3)
      }
      if (this.photo4) {
        this.images.push(this.photo4)
      }
      if (this.photo5) {
        this.images.push(this.photo5)
      }
      if (this.photo6) {
        this.images.push(this.photo6)
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
      if (!this.time) {
        this.common.message('warning', '场馆营业时间不能为空')
        return false
      }
      let curcity = document.getElementById('address').value
      if (!curcity.length) {
        this.common.message('warning', '场馆地址不能为空')
        return false
      }
      console.log(this.images)
      if (!this.allFormData.province || !this.allFormData.gps_lat || !this.allFormData.gps_lon) {
        this.common.message('error', '请填写正确的场馆地址，且必须从下拉框中选择地址')
        return false
      }
      for (let value of this.listProject) {
        if (value.isCheck) {
          this.feature.push(value.value)
        }
      }
      for (let value of this.listFacil) {
        if (value.isCheck) {
          this.facility.push(value.value)
        }
      }
      if (!this.feature.length) {
        this.common.message('warning', '请选择俱乐部特色')
        return false
      }
      let reg = /^1[0-9]\d{9}$|^0\d{2,3}-?\d{7,8}$/
      if (this.phone) {
        if (!reg.test(this.phone)) {
          this.common.message('warning', '请输入正确的场馆电话号码')
          return false
        }
      }
      this.allFormData.logo = this.logo
      this.allFormData.images = this.images
      this.allFormData.name = this.name
      this.allFormData.phone = this.phone
      this.allFormData.address = curcity
      this.allFormData.feature = this.feature
      this.allFormData.business_start = parseTime(this.time[0], '{h}:{i}')
      this.allFormData.business_end = parseTime(this.time[1], '{h}:{i}')
      this.loading = true
      this.$store.dispatch('VenueMessage', this.allFormData).then((res) => {
        this.common.message('success', '场馆修改信息已提交，等待审核')
        this.loading = false
        this.disabled = true
        this.buttonIsEdit = true
        // this.id = res.data.id
        this.centerDialogVisible = false
        this.getData()
      }).catch(() => {
        this.loading = false
      })
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
      this.$store.dispatch('GetFacilities').then((res) => {
        for (let key in res) {
          // 场馆设施
          this.listFacil.push({ name: res[key], value: key, isCheck: false })
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    checked(index) {
      thios.listProject = []
      this.listProject[index].isCheck ? this.listProject[index].isCheck = false : this.listProject[index].isCheck = true
    },
    fiaclchecked(index) {
      this.listFacil = []
      this.listFacil[index].isCheck ? this.listFacil[index].isCheck = false : this.listFacil[index].isCheck = true
    },
    // 点击修改认证
    getAuthen() {
      this.centerDialogVisible = true
      this.getData()
    },
    // 提交认证
    getAuthentication() {
      // this.loading = true
      if (!this.rzMsgForm.id_card_front.length) {
        this.common.message('warning', '请上传身份证正面照')
        return
      }
      if (!this.rzMsgForm.id_card_back.length) {
        this.common.message('warning', '请上传身份证反面照')
        return
      }
      if (!this.rzMsgForm.license.length) {
        this.common.message('warning', '请上传营业执照')
        return
      }
      if (!this.rzMsgForm.accountName.trim().length) {
        this.common.message('warning', '请填写账户名称')
        return
      }
      if (!this.rzMsgForm.openBank.trim().length) {
        this.common.message('warning', '请填写开户行')
        return
      }
      if (!this.rzMsgForm.backAccount.trim().length) {
        this.common.message('warning', '请填写银行账号')
        return
      }
      if (this.rzMsgForm.backAccount.length < 16 || this.rzMsgForm.backAccount.length > 19) {
        this.common.message('warning', '银行卡号长度必须在16到19之间')
        return
      }
      let num = /^\d*$/ // 全数字
      if (!num.exec(this.rzMsgForm.backAccount)) {
        this.common.message('warning', '银行卡号必须全为数字')
        return
      }
      let strBin = '10,18,30,35,37,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,58,60,62,65,68,69,84,87,88,94,95,98,99'
      if (strBin.indexOf(this.rzMsgForm.backAccount.substring(0, 2)) === -1) {
        this.common.message('warning', '银行卡号开头6位不符合规范')
        return
      }
      this.submitloading = true
      venueApply(this.rzMsgForm).then((res) => {
        this.submitloading = false
        this.AuthenMsg = '审核中'
        this.common.message('success', '认证信息已提交，等待审核')
        this.centerDialogVisible = false
        this.getData()
      }).catch(() => {
        this.submitloading = false
      })
    },
    phoneChange(value) {
      let reg = /^1[0-9]\d{9}$|^0\d{2,3}-?\d{7,8}$/
      if (value) {
        if (!reg.test(value)) {
          this.common.message('warning', '请输入正确的场馆电话号码')
        }
      }
    }
  },
  filters: {
  },
  destroyed() {
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.cardMsg {
  margin-top: 40px;
}
.cardMsg /deep/ .el-form-item__label {
  color: #000;
  font-weight: normal;
  font-size: 16px;
  text-align: right;
  width: 130px;
}
.cardCountBox {
  /deep/ .el-form-item__label {
    text-align: left;
  }
  .countTips {
    font-size: 12px;
    margin-left: 12px;
    color: #1878E1;
  }
}
.cardMsg {
  .div {
    font-size: 16px;
  }
}
.owntext {
    width: 320px;
    height: 180px;
    margin-left: 80px;
    margin-top: 15px;
}
.title-box {
  border-bottom: 1px solid #ddd;
  padding-bottom: 20px;
  margin: 0 -20px 20px -20px;
  span {
    font-weight: 700;
    margin-bottom: 30px;
    font-size: 22px;
    margin-left: 20px;
  }
  .edit-box {
    // border: 1px solid #ddd;
    // margin: 20px 20px 0 20px;
    // padding: 20px 20px;
    float: right;
    margin-right: 20px;
    margin-top: -5px;
    .edit-button {
      background: #000;
      color: #fff;
    }
  }
}
.venue-box {
  border: 1px solid #cccccc;
  padding: 20px 20px 0 20px;
  // margin: 20px 20px 20px 20px;
  // margin-top: 20px;
  margin-bottom: 20px;
  background-color: #fff;
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
      div{
        margin-bottom: 10px;
      }
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
      i, div{
        color: #ddd;
      }
    }
    .div-dialog1 {
      width: 200px;
      height: 200px;
      position: absolute;
      top: 0;
      left: 0;
      background: rgba(245,247,250,0.1);
    }
    .div-dialog2 {
      width: 203px;
      height: 118px;
      overflow: hidden;
      position: absolute;
      top: 0;
      left: 0;
      background: rgba(245,247,250,0.1);
    }
  }
  .div-label {
    line-height: 60px;
    font-size: 16px;
  }
  .div-h {
    margin-top: 60px;
  }
  .div-type {
    font-size: 20px;
    span {
      font-weight: bold;
      margin-right: 20px;
    }
    .AuthenMsgRed {
      color: #F14C30;
    }
    .AuthenMsgGreen {
      color: #1ab394;
    }
  }
  .tip {
    color: #1878E1;
    font-size: 12px;
    margin-top: 40px;
  }
}
.dialog-footer {
  button {
    color: #fff;
  }
}
.authentication-dialog {
  .msgBox {
    overflow: hidden;
    h3 {
      font-size: 20px;
      color: #333;
      span {
        color: #1AB394;
      }
    }
    .box-left {
      float: left;
      padding-left: 30px;
      border-right: 1px solid #ddd;
      width: 50%;
      font-size: 18px;
      color: #333;
      .title {
        margin-bottom: 10px;
        margin-top: 20px;
        .must-red {
          color: #f66c99;
          font-weight: normal;
          margin-right: 5px;
        }
      }
      .div-bottom {
        margin-top: 60px;
      }
      .card-box {
        overflow: hidden;
        .card-z {
          float: left;
          margin-right: 20px;
        }
        .card-f {
          float: left;
        }
      }
    }
    .box-right {
      float: left;
      padding-left: 30px;
      .tips {
        color: #1878E1;
        margin-left: 138px;
        margin-top: -20px;
      }
      .rzMsgForm {
        width: 500px;
      }
    }
  }
}
.tipMsg {
  display: inline-block;
  color: #F14C30;
}
.tipYellow {
  display: inline-block;
  color: #1ab394;
}
.tipRed {
  display: inline-block;
  color: #F14C30;
}
</style>
