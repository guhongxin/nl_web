$(document).ready(function () {
  var BASE_HEAD_PROTOCOL = ''
  var BASE_HEAD_URL = ''
  if (document.location.protocol == 'http:') {
    BASE_HEAD_PROTOCOL = 'http://';
  } else {
    BASE_HEAD_PROTOCOL = 'https://';
  }
  if (window.location.host == 'www.nlfit.cn' || window.location.host == 'nlfit.cn') {
    /* online */
    BASE_HEAD_URL = (BASE_HEAD_PROTOCOL + 'h5.nlfit.cn');
  } else {
    /* test */
    BASE_HEAD_URL = (BASE_HEAD_PROTOCOL + 'h5-ceshi.nlfit.cn');
  }
  /* 获取url参数 */
  function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
  }

  function Health() {
    this.api = {}
    this.userEle = {
      // 头部
      user_date: $('#user_date'),
      choose_date: $('#choose_date'),
      user_headIocn: $('#user_headIocn'),
      user_name: $('#user_name'),
      user_sex: $('#user_sex'),
      user_age: $('#user_age'),
      user_height: $('#user_height')
    }
    this.bodylist1El = $('#bodylist1El')
    this.bodylist2El = $('#bodylist2El')
    this.analysis1 = $('#analysis1')
    this.analysis2 = $('#analysis2')
    this.examTime = $('#examTime')
    this.assFat = $('#assFat')
    this.assFat_one = $('#assFat_one')
    this.assFat_two = $('#assFat_two')
    this.datalist = $('#datalist')
    this.inapp = true
    this.customerId = getQueryString('customerId')
    this.init()
  }

  $.extend(Health.prototype, {
    // 初始化所以动作
    init: function () {
      this.inappFun()
      this.getData(this.api)
      this.binddate()
    },
    binddate: function () {
      this.userEle.choose_date.click(function () {
        if ($(this).attr('data-show') == 0) {
          $('.dataliset').show()
          $(this).attr('data-show', 1)
        } else {
          $('.dataliset').hide()
          $(this).attr('data-show', 0)
        }
      })
    },
    inappFun: function () {
      if (navigator.userAgent.indexOf('niulanger') == -1) {
        this.inapp = false // 外
        this.userEle.user_date.show()
        this.userEle.choose_date.hide()
      } else {
        this.inapp = true // 内
        this.userEle.user_date.hide()
        this.userEle.choose_date.show()
      }
    },

    getDataList: function () {
      var self = this
      if (self.customerId) {
        $.ajax({
          url: BASE_HEAD_URL + '/web_proxy/gym/body_exams/count/' + self.customerId,
          type: 'get',
          success: function (res) {
            var req = res.data.body ? res.data.body : res.data
            var htmlli = ''
            if (req.length) {
              $.each(req, function (index, item) {
                htmlli += '<li data-id=' + item.id + ' data-cutomerid=' + item.customer_id + ' data-source=' + item.source + ' q='+ (item.gym_body_exam_data.q?item.gym_body_exam_data.q:0) +'>' + item.examTime + '</li>'
              })
            }
            self.datalist.html(htmlli)
            var lilist = self.datalist.find('li')
            $.each(lilist, function (index, item) {
              $(item).click(function () {
                if ($(item).attr('data-source') == 1) {
                  location.replace(location.origin + '/static/health/index.html?id=' + $(item).attr('data-id') + '&customerId=' + $(item).attr('data-cutomerid'))
                }
                if ($(item).attr('data-source') == 0) {
                  location.replace(location.origin + '/static/sharepage/bodyExam.html?id=' + $(item).attr('data-id') + '&customerId=' + $(item).attr('data-cutomerid'))
                }
                if ($(item).attr('data-source') == 2) {
                  location.replace(location.origin + '/static/visfitlb/index.html?q=' + $(item).attr('q'))
                }
              })
            })
          }
        })
      } else {
        self.examTime = '无用户信息'
      }
    },
    // 获取数据
    getData: function (api) {
      // url = './mock.json'
      url = BASE_HEAD_URL + '/web_proxy/gym/yj_exams/' + getQueryString('id')
      var self = this
      this.ajax(url, {}, function (res) {
        var resfult = res.data.body || res.data
        var len = resfult.length
        if (len) {
          if (len > 1) {
            resfult = res.data.body[1]
          }
          if (len == 1) {
            resfult = res.data.body[0]
          }
        }
        self.customerId = resfult.customer_id || getQueryString('customerId')
        self.getTimeList()
        self.setUserInfo(res.data)
        if (resfult.gym_body_exam_data) {
          api = resfult.gym_body_exam_data.data.composition
          self.setrotate(resfult.gym_body_exam_data.data.measurement.score)
          self.healthList(api)
          self.getAssessData(api) // 设置腰臀比
          self.bodyrect(api) // 体型评估
          self.fatControl(api) // 脂肪调节
          self.muscelControl(api) // 肌肉调节
        } else {
          alert('旧版体测数据无法展示')
        }
        self.examTime.text(resfult.examTime)
      }, function () {
        self.getTimeList()
      })
    },
    getTimeList: function () { // app内请求时间选择列表
      if (this.inapp) {
        this.getDataList()
      }
    },
    setUserInfo: function (info) {
      var infer = info.customer || {}
      var user = {}
      if (info) {
        if(info.body.length > 1) {
          user = info.body[1]
        } else {
          user = info.body[0]
        }
      }

      var ele = this.userEle
      ele.user_name.text(infer.name)
      ele.user_date.text(user.examTime)
      ele.choose_date.text(user.examTime)
      ele.user_headIocn.attr('src', infer.head_portrait || 'https://www.nlfit.cn/static/superscreen/img/rentou.png')
      var sex_font = '-'
      switch (infer.sex) {
        case 1:
          sex_font = '男'
          break
        case 2:
          sex_font = '女'
          break
        default:
          sex_font = '-'
      }
      ele.user_sex.text(sex_font)
      ele.user_age.text(user.age)
      ele.user_height.text(user.height)
    },
    // 对数据进行过滤
    healthList: function (res) {
      var healthList = res
      /** 体成分结构 ---start */
      var result = this.getHealdatafilter(healthList)
      var topArr = ["体重", "脂肪量", "去脂体重", "无机盐", "肌肉量", "蛋白质", "身体水分"];
      var topResult = this.filterList(result, topArr) // 过滤topArr数据
      this.getHalffilter(healthList, topResult) // 二次过滤获取范围值
      this.getfinel(topResult) // 三次过滤获取最终值
      $.each(topResult, function (index, item) {
        if (item.type == 'weight') {
          var cuese = {}
          cuese = topResult[0]
          topResult[0] = item
          topResult[index] = cuese
        }
      })
      this.setEleView(topResult, 'bodylist1El') // 添加视图
      /** 体成分结构 ---end */

      /** 阶段分析(肌肉量) ---start */
      var segmental = this.segmentalFat(healthList)
      this.getHalffilter(healthList, segmental, true, 'segmental_fat')
      this.getfinel(segmental)
      this.setEleSegmentalView(segmental, 'analysis1')
      /** 阶段分析(肌肉量) ---end */

      /** 阶段分析(脂肪量) ---start */
      var segmental2 = this.segmentalSmm(healthList)
      this.getHalffilter(healthList, segmental2, true, 'segmental_smm')
      this.getfinel(segmental2)
      this.setEleSegmentalView(segmental2, 'analysis2')
      /** 阶段分析(脂肪量) ---end */

      /** 身体参数 ---start */
      var result2 = this.getHealdatafilter(healthList)
      var topArr2 = ["体脂率", "骨骼肌", "内脏脂肪", "基础代谢", "总能量消耗", "BMI", "身体年龄", "健壮指数"];
      var topResult2 = this.filterList(result2, topArr2) // 过滤topArr数据
      this.getHalffilter(healthList, topResult2) // 二次过滤获取范围值
      this.getfinel(topResult2) // 三次过滤获取最终值
      this.setEleView(topResult2, 'bodylist2El') // 添加视图\
      /** 身体参数 ---end */


      /** 风险评估 ---start */
      var assess = healthList.evaluation
      var assessArr = []
      for (var key in assess) {
        assessArr.push(assess[key])
      }
      var assessFat = $('#assess_fat>li')
      var assessAbdominalFat = $('#assess_abdominal_fat>li')
      var assessWeakness = $('#assess_weakness>li')
      var assessNutrition = $('#assess_nutrition>li')


      for (var i = 1; i <= assessFat.length; i++) {
        if (i == assessArr[1]) {
          $(assessFat[i - 1]).siblings().removeClass('active')
          $(assessFat[i - 1]).addClass('active')
        }
      }
      for (var i = 1; i <= assessAbdominalFat.length; i++) {
        if (i == assessArr[0]) {
          $(assessAbdominalFat[i - 1]).siblings().removeClass('active')
          $(assessAbdominalFat[i - 1]).addClass('active')
        }
      }
      for (var i = 1; i <= assessWeakness.length; i++) {
        if (i == assessArr[3]) {
          $(assessWeakness[i - 1]).siblings().removeClass('active')
          $(assessWeakness[i - 1]).addClass('active')
        }
      }
      for (var i = 1; i <= assessNutrition.length; i++) {
        if (i == assessArr[2]) {
          $(assessNutrition[i - 1]).siblings().removeClass('active')
          $(assessNutrition[i - 1]).addClass('active')
        }
      }
      /** 风险评估 ---end */

    },
    setrotate(data) {
      var rad = 0,
        color = '#2fbcb7',
        text = '健康'
      switch (data) {
        case 1:
          rad = 180;
          color = '#2fbcb7';
          text = '无风险';
          break;
        case 2:
          rad = 270;
          color = '#f6d142';
          text = '低风险';
          break;
        case 3:
          rad = 0;
          color = '#ee6d00';
          text = '中风险';
          break;
        case 4:
          rad = 90;
          color = '#f14238';
          text = '高风险';
          break;
      }
      var domfont = $('#rotateFont')
      domfont.css({
        color: color
      })
      domfont.text(text)
      $('.rotate').css({
        'transform': 'rotate(' + rad + 'deg)'
      })
    },
    setEleSegmentalView: function (res, ele) {
      var itemdom = ''
      for (var i = 0; i < res.length; i++) {
        itemdom += this.domList(res[i], 'obj')
      }
      this[ele].html(itemdom)
    },
    segmentalFat: function (res) {
      var list = []
      for (var item in res.segmental_fat) {
        if (item == 'tr') {
          continue
        }
        list.push({
          type: item,
          value: res.segmental_fat[item]
        })
      }
      return list
    },
    segmentalSmm: function (res) {
      var list = []
      for (var item in res.segmental_smm) {
        if (item == 'tr') {
          continue
        }
        list.push({
          type: item,
          value: res.segmental_smm[item]
        })
      }
      return list
    },
    setEleView: function (res, ele) {
      var itemdom = ''
      for (var i = 0; i < res.length; i++) {
        itemdom += this.domList(res[i])
      }
      this[ele].html(itemdom)
    },
    domList: function (item, type) {
      var color = '',
        font = ''
      switch (item.state) {
        case 1:
          color = 'blue'
          font = '偏低'
          break;
        case 2:
          color = 'green'
          font = '正常'
          break;
        case 3:
          color = 'yellow'
          font = '偏高'
          break;
        default:
          color = 'gary'
          font = '-'
      }
      // res.segmental_fat.la // 左臂
      // res.segmental_fat.ra // 右臂
      // res.segmental_fat.ll // 左腿
      // res.segmental_fat.rl // 右腿
      var claser = ''
      switch (item.type) {
        case 'la':
          claser = 'analysis_lt ' + color;
          break;
        case 'ra':
          claser = 'analysis_rt ' + color;
          break;
        case 'll':
          claser = 'analysis_lb ' + color;
          break;
        case 'rl':
          claser = 'analysis_rb ' + color;
          break;
      }
      item.unit = item.unit || ''
      var scope = ''
      if (item.scope) {
        scope = item.scope[0] + ' - ' + item.scope[1]
      } else {
        scope = '-'
      }
      var comm = '<div class="font">\
                    <div class="font_top">' + item.value + '<span>' + item.unit + '</span></div>\
                    <div class="font_mid">' + scope + ' <span>' + item.unit + '</span></div>\
                    <div class="font_bot">' + font + '</div>\
                  </div>'
      var dom = ''
      if (type == 'obj') {
        dom = '<div class="' + claser + '">' + comm + '</div>'
      } else {
        dom = '<div class="card ' + color + '">\
                    <div class="title"><span>' + item.text + '</span></div>' + comm + '</div>'
      }
      return dom
    },
    filterList: function (result, arr) {
      var topResult = []
      $.each(result, function (index, item) {
        if (arr.indexOf(item.text) >= 0) {
          topResult.push(item)
        }
      })
      return topResult
    },
    getfinel: function (res) {
      for (var i = 0; i < res.length; i++) {
        var number = Number(res[i].value)
        if (!res[i].scope) {
          res[i].state = 4
          continue
        }
        if (number < res[i].scope[0]) {
          res[i].state = 1
        } else if (number >= res[i].scope[0] && number <= res[i].scope[1]) {
          res[i].state = 2
        } else if (number > res[i].scope[1]) {
          res[i].state = 3
        } else {
          res[i].state = 4
        }
      }
    },
    getHalffilter: function (obj, res, type, str) {
      for (var item in obj.prv) {
        if (!type) {
          $.each(res, function (index, current) {
            if (current.type == item) {
              current.scope = obj.prv[item]
              if (current.type == 'vfi') {
                current.scope[0] = 1
                current.scope[1] = 9
              }
            }
          })
        } else {
          $.each(res, function (index, current) {
            for (var nex in obj.prv[str]) {
              if (current.type == nex) {
                current.scope = obj.prv[str][nex]
              }
            }
          })
        }
      }
    },
    getHealdatafilter: function (obj) {
      var self = this
      var arr = []
      for (var item in obj) {
        if (item == "evaluation" || item == "figure_map" || item == "grade" || item == "prv" || item == "segmental_fat" || item == "segmental_smm") {
          continue
        }
        arr.push({
          type: item,
          value: obj[item],
          text: self.fontMap(item).text,
          unit: self.fontMap(item).unit,
        })
      }
      return arr
    },
    fontMap: function (str) {
      var text = ''
      var unit = ''
      switch (str) {
        case 'bmi':
          text = 'BMI'
          break;
        case 'weight':
          text = '体重'
          unit = 'kg'
          break;
        case 'ffm':
          text = '去脂体重'
          unit = 'kg'
          break;
        case 'tbw':
          text = '身体水分'
          unit = 'kg'
          break;
        case 'muscle':
          text = '肌肉量'
          unit = 'kg'
          break;
        case 'protein':
          text = '蛋白质'
          unit = 'kg'
          break;
        case 'minerals':
          text = '无机盐'
          unit = 'kg'
          break;
        case 'bfm':
          text = '脂肪量'
          unit = 'kg'
          break;
        case 'pbf':
          text = '体脂率'
          unit = '%'
          break;
        case 'smm':
          text = '骨骼肌'
          unit = 'kg'
          break;
        case 'vfi':
          text = '内脏脂肪'
          unit = ''
          break;
        case 'smm_control':
          text = '骨骼肌调节量'
          unit = 'kg'
          break;
        case 'bfm_control':
          text = '体脂肪调节量'
          unit = 'kg'
          break;
        case 'bmr':
          text = '基础代谢率'
          unit = 'kcal'
          break;
        case 'cbc':
          text = '总能量消耗'
          unit = 'kcal'
          break;
        case 'body_age':
          text = '身体年龄'
          unit = '岁'
          break;
      }

      return {
        "text": text,
        "unit": unit
      }
    },
    getAssessData: function (data) {
      this.assFat.text(data.whfr)
      var itreml = data.prv.whfr[0]
      var itremr = data.prv.whfr[1]
      this.assFat_one.text(itreml)
      this.assFat_two.text(itremr)
      var len = this.setActivelist(data.whfr, itreml, itremr)
      for (var i = 0; i < len; i++) {
        $($('.chi li')[i]).addClass('active')
      }
    },
    setActivelist: function (data, data1, data2) {
      var itemone = data1 / 7
      var itemtwo = (data2 - data1) / 7
      var itemthe = data2 / 7
      var leng = 0
      if (data <= data1) {
        leng = Math.round(data / itemone)
      }
      if (data > data1 && data <= data2) {
        leng = 7 + Math.round((data - data1) / itemtwo)
      }
      if (data > data2 && data <= data * 2) {
        leng = 14 + Math.round((data - data2) / itemthe)
      }
      if (data > data * 2) {
        leng = 20
      }
      return leng
    },
    bodyrect: function (data) {
      $($('.bodyxing li')[data.figure - 1]).addClass('green')
    },
    fatControl: function (data) {
      var doe = '-' + data.bfm_control
      $('#fatcontrol').text(doe)
      var totle = Math.round((Number(data.bfm) - Number(data.bfm_control)) * 100) / 100
      $('#evalfat').text(data.bfm + '' + doe + '=' + totle)
      var itemval = totle / 20
      var s = Math.round(data.bfm / itemval)
      for (var i = 0; i < s; i++) {
        $($('#fatList li')[i]).addClass('active')
      }
    },
    muscelControl: function (data) {
      var doe = '+' + data.smm_control
      $('#muscelControl').text(doe)
      var totle = Math.round((Number(data.muscle) + Number(data.smm_control)) * 100) / 100
      $('#muscelfat').text(data.muscle + '' + doe + '=' + totle)
      var itemval = totle / 20
      var s = Math.round(data.muscle / itemval)
      for (var i = 0; i < s; i++) {
        $($('#muscelList li')[i]).addClass('active')
      }
    },
    // 综合请求
    ajax: function (url, data, cb, errcb) {
      $.ajax({
        url: url,
        type: 'get',
        data: {},
        success: function (res) {
          cb(res)
        },
        error: function (err) {
          console.log(err)
          errcb()
        }
      })
    }
  })
  new Health()
})
