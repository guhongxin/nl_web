var BASE_HEAD_PROTOCOL = '', BASE_HEAD_URL = '', BASE_HEAD_REPORT_URL = '', isApp = true
if (navigator.userAgent.indexOf('niulanger') == -1) {
  isApp = false // 外
} else {
  isApp = true // 内
}
if (document.location.protocol == 'http:') {
  BASE_HEAD_PROTOCOL = 'http://';
} else {
  BASE_HEAD_PROTOCOL = 'https://';
}
if (window.location.host == 'www.nlfit.cn' || window.location.host == 'nlfit.cn') {
  /* online */
  BASE_HEAD_URL = (BASE_HEAD_PROTOCOL + 'h5.nlfit.cn');
  BASE_HEAD_REPORT_URL = (BASE_HEAD_PROTOCOL + 'd.nlfit.cn');
} else if (window.location.host == 'www-ceshi.nlfit.cn') {
  /* test */
  BASE_HEAD_URL = (BASE_HEAD_PROTOCOL + 'h5-ceshi.nlfit.cn');
  BASE_HEAD_REPORT_URL = (BASE_HEAD_PROTOCOL + 'd-ceshi.nlfit.cn');
} else {
  /* 128 */
  BASE_HEAD_URL = (BASE_HEAD_PROTOCOL + 'h5-dev.nlfit.cn');
  BASE_HEAD_REPORT_URL = (BASE_HEAD_PROTOCOL + 'd.dev.nlfit.cn');
}
/* 时间选择 */
$('#dataTime').off('click').on('click', function (e) {
  e.stopPropagation()
  $('#datalist').fadeToggle(200)
})
$(document).on('click', function () {
  $('#datalist').fadeOut(200)
})
/* 页面swiper初始化 */
var mySwiper = new Swiper('#swiperContainer', {
  pagination: {
    el: '.swiper-pagination',
    clickable: true
  }
})
var mySwipers = new Swiper('#bodyComposition', {
  direction: 'vertical',
  on: {
    slideChangeTransitionEnd: function (swiper) {
      $('.body-composition-tab > .item').eq(this.activeIndex).addClass('active').siblings('.item').removeClass('active')
    }
  }
})
$('.swiper-pagination-bullet').each(function (i, v) {
  if (i == 0) {
    $(this).text('围度信息')
  } else {
    $(this).text('身体成分')
  }
})
$('.body-composition-tab > .item').off('click').on('click', function (v) {
  $(this).addClass('active').siblings('.item').removeClass('active')
  mySwipers.slideTo($(this).index(), 300);
})
var uid = getQueryString('uid')
var params2 = {
  "q": getQueryString('q'),
  "uid": uid ? Number(uid) : undefined,
}
/* 绑定用户 */
$.ajax({
  type: 'GET',
  url: BASE_HEAD_REPORT_URL + '/external_device/visbodyfit/v1/qr_decode',
  data: params2,
  success: function (data) {
    if (data.code == 0) {
      if (data.customerInfo.HeadPortrait) {
        $('.user-avator').attr('src', data.customerInfo.HeadPortrait)
      }
      $('#userName').text(data.customerInfo.Name)
      $('#dataTime').text(data.date && data.date[0] ? data.date[0] : '')
      $('#datalist').html('')
      if (data.date && data.date[0]) {
        /* 请求近7条数据 */
        if (isApp) {
          $('#dataTime').text(data.date[0])
          $('#datalist').fadeOut(200)
          $('#modelLoad').fadeIn(100)
          var percenterParam = {
            "token": data.token,
            "scanid": data.scanid,
            "date": data.date[0].replace(/-/g, ""),
            "vid": data.vid
          }
          getPercente(percenterParam)
          getDataList(data.customerInfo.Id)
        } else {
          $('#dataTime').off('click')
          $('#dataTime').text(data.date[0])
          $('#datalist').fadeOut(200)
          $('#modelLoad').fadeIn(100)
          var percenterParam = {
            "token": data.token,
            "scanid": data.scanid,
            "date": data.date[0].replace(/-/g, ""),
            "vid": data.vid
          }
          getPercente(percenterParam)
        }
      } else {
        arrorTip("时间参数为空")
      }
    } else {
      arrorTip(data.errmsg ? data.errmsg : "请求失败")
    }
  }
})
/* 获取体测数据 */
function getExamDate(percenterParam) {
  var params = {
    "token": percenterParam.token,
    "vid": percenterParam.vid,
  }
  var modelPrams = {
    "q": getQueryString('q'),
    "vid": percenterParam.vid,
  }
  if (isFirst) {
    params.scanid = percenterParam.scanid
    modelPrams.scanid = percenterParam.scanid
    isFirst = false
  } else {
    params.date = percenterParam.date
    modelPrams.date = percenterParam.date
  }
  /* 人体模型 */
  $.ajax({
    type: 'GET',
    url: BASE_HEAD_REPORT_URL + '/external_device/visbodyfit/v1/get_3dfile',
    data: modelPrams,
    success: function (modelInfo) {
      if (modelInfo.code == 0) {
        setPeopleModel(modelInfo.jsonUrl, modelInfo.objUrl)
      } else {
        arrorTip(modelInfo.errmsg ? modelInfo.errmsg : "请求失败")
      }
    }
  })
  /* 围度数据 */
  $.ajax({
    type: 'GET',
    url: 'https://api.visbodyfit.com:30000/v1/datas/info',
    datatype: 'JSONP',
    data: params,
    success: function (res) {
      if (res.code == 0) {
        $('#leftArm').text(res.LeftUpperArmGirth) //左上臂围
        $('#rigthArm').text(res.RightUpperArmGirth) //右上臂围
        $('#xiongWei').text(res.BustGirth) //胸围
        $('#yaoWei').text(res.WaistGirth) //腰围
        $('#leftThigh').text(res.LeftThighGirth) //左大腿围
        $('#rightThigh').text(res.RightThighGirth) //右大腿围
        $('#leftLeg').text(res.LeftCalfGirth) //左小腿围
        $('#rightLeg').text(res.RightCalfGirth) //右小腿围
        $('#hipWei').text(res.HipGirth) //臂围
      } else {
        arrorTip(res.errmsg ? res.errmsg : "请求失败")
      }
    }
  })
  /* 身体成分 */
  $.ajax({
    type: 'GET',
    url: 'https://api.visbodyfit.com:30000/v1/bodys/info',
    datatype: 'JSONP',
    data: params,
    success: function (bodysInfo) {
      // console.log(bodysInfo);
      $('#bodyWeight').text(bodysInfo.Weight)//体重
      $('#PercentBodyFat').text(bodysInfo.PercentBodyFat)//体脂率
      $('#bodyBMI').text(bodysInfo.Bmi)//BMI
      $('#bodyKcal').text(bodysInfo.Kcal)//基础代谢
      $('#bodyWaistToHip').text(bodysInfo.WaistToHip)//腰臀比
      $('#bodyFluid').text(bodysInfo.Fluid)//水分含量
      $('#bodyMuscle').text(bodysInfo.Muscle)//肌肉含量
      /* 身体成分范围 */
      $.ajax({
        type: 'GET',
        url: 'https://api.visbodyfit.com:30000/v1/bodys/range_info',
        datatype: 'JSONP',
        data: params,
        success: function (rangeInfo) {
          /* 渲染比例 */
          setPercent('#bodyWeight', bodysInfo.Weight, rangeInfo.WT)
          setPercent('#PercentBodyFat', bodysInfo.PercentBodyFat, rangeInfo.PBF)
          setPercent('#bodyBMI', bodysInfo.Bmi, rangeInfo.BMI)
          setPercent('#bodyKcal', bodysInfo.Kcal, rangeInfo.BMR)
          setPercent('#bodyWaistToHip', bodysInfo.WaistToHip, rangeInfo.WHR)
          setPercent('#bodyFluid', bodysInfo.Fluid, rangeInfo.TBW)
          setPercent('#bodyMuscle', bodysInfo.Muscle, rangeInfo.LM)
        }
      })
    }
  })
}
/* 请求报告进度 */
function getPercente(percenterParam) {
  var params3 = {
    "token": percenterParam.token,
    "scanid": percenterParam.scanid
  }
  $.ajax({
    type: 'GET',
    url: 'https://api.visbodyfit.com:30000/v1/progress',
    datatype: 'JSONP',
    data: params3,
    success: function (res) {
      if (res.code == 0) {
        if (res.progress >= 100) {
          /* 数据生成成功 */
          if ($('#loading').length && $('#loading').length > 0) {
            $('#loading').fadeOut(1000, function () {
              $('#loading').remove()
              getExamDate(percenterParam)
            })
          } else {
            getExamDate(percenterParam)
          }
        } else {
          $('#loadingText span').text(res.progress)
          setTimeout(function () {
            getPercente(percenterParam)
          }, 2000)
        }
      } else {
        arrorTip("请求报告进度失败")
      }
    }
  })
}
/* 获取时间选择 */
function getDataList(customerId) {
  if (customerId) {
    $.ajax({
      url: BASE_HEAD_URL + '/web_proxy/gym/body_exams/count/' + customerId,
      type: 'GET',
      success: function (res) {
        var req = res.data.body ? res.data.body : res.data
        var htmlli = ''
        if (req.length) {
          $.each(req, function (index, item) {
            htmlli += '<li data-id=' + item.id + ' data-cutomerid=' + item.customer_id + ' data-source=' + item.source + ' q='+ (item.gym_body_exam_data.q?item.gym_body_exam_data.q:0)  +'>' + item.examTime + '</li>'
            if(getQueryString('q') === item.gym_body_exam_data.q) {
              $('#dataTime').text(item.examTime)
            }
          })
        }
        $('#datalist').html(htmlli)
        var lilist = $('#datalist').find('li')
        $.each(lilist, function (index, item) {
          $(item).off('click').on('click', function () {
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
}
/* 获取URL参数 */
function getQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
}
/* 百分比等级封装 */
function setPercent(id, date, range) {
  var html = '<div class="percent-box">'
  if (range.h == 0 && range.l == 0) { /*没有范围值*/
  } else if (range.h == 0 && range.l != 0) { /*无高标准*/
    html += '<div class="title"><span class="two">低标准</span><span class="two">正常</span></div>'
    html += addGrade(11, 22, setActivelist(date, range.l, undefined, id))
    html += '<div class="base-title"><span class="two"></span><span class="two">' + range.l.toFixed(1) + '</span></div>'
  } else if (range.h != 0 && range.l == 0) { /*无低标准*/
    html += '<div class="title"><span class="two">正常</span><span class="two">高标准</span></div>'
    html += addGrade(11, 22, setActivelist(date, undefined, range.h, id))
    html += '<div class="base-title"><span class="two"></span><span class="two">' + range.h.toFixed(1) + '</span></div>'
  } else { /* 正常三等级 */
    html += '<div class="title"><span class="three">低标准</span><span class="three">正常</span><span class="three">高标准</span></div>'
    html += addGrade(7, 21, setActivelist(date, range.l, range.h, id))
    html += '<div class="base-title"><span class="three"></span><span class="three">' + range.l.toFixed(1) + '</span><span class="three">' + range.h.toFixed(1) + '</span></div>'
  }
  html += '</div>'
  $(id).parent().parent().next('.percentage-registration').html(html)
}
/* 添加等级模块 */
function addGrade(a, b, l) {
  var gradeH = '<ul class="percent-light clearfix">'
  for (var i = 0; i < b; i++) {
    if (i < l) {
      gradeH += '<li class="active">' + (i + 1) + '</li>';
    } else {
      gradeH += '<li>' + (i + 1) + '</li>';
    }
    if ((i + 1) % a == 0 && i != (b - 1)) {
      gradeH += '<li class="center-line"></li>';
    }
  }
  gradeH += '</ul>'
  return gradeH
}
/* 计算高亮长度 */
function setActivelist(data, data1, data2, id) {
  var leng = 0
  var logoText = ''
  if (data1 && data2) {
    var itemone = data1 / 7
    var itemtwo = (data2 - data1) / 7
    var itemthe = data2 / 7
    if (data <= data1) {
      leng = Math.ceil(data / itemone)
      logoText = '偏低'
    }
    if (data > data1 && data <= data2) {
      leng = 7 + Math.ceil((data - data1) / itemtwo)
    }
    if (data > data2 && data <= data * 2) {
      leng = 14 + Math.ceil((data - data2) / itemthe)
      logoText = '偏高'
    }
    if (data > data * 2) {
      leng = 20
      logoText = '偏高'
    }
    if (leng >= 21) {
      leng = 21
    }
  } else if (!data1 && data2) { /* 无低标准 */
    var itemone = data2 / 11
    if (data <= data2) {
      leng = Math.ceil(data / itemone)
    } else {
      leng = 11 + Math.ceil((data - data2) / itemone)
      logoText = '偏高'
    }
    if (leng >= 22) {
      leng = 22
    }
  } else if (data1 && !data2) { /* 无高标准 */
    var itemone = data1 / 11
    if (data <= data1) {
      leng = Math.ceil(data / itemone)
      logoText = '偏低'
    } else {
      leng = 11 + Math.ceil((data - data1) / itemone)
    }
    if (leng >= 22) {
      leng = 22
    }
  }
  var _index = $(id).closest('.swiper-slide').index()
  if (logoText != '') {
    $('.body-composition-tab > .item').eq(_index).prepend('<span class="sologo">' + logoText + '</span>')
  }
  return leng
}
/* 错误弹窗提示 */
function arrorTip(text) {
  $('body').append('<div id="toastModel"><div class="icon"><div class="icon_box"><div class="line_left"></div><div class="line_right"></div></div></div><p>' + text + '</p></div>')
  $('#toastModel').fadeIn()
  setTimeout(function () {
    $('#toastModel').fadeOut(500, function () {
      $('#toastModel').remove()
    })
  }, 1500)
}
