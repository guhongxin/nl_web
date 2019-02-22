$(function () {
  if (!getQueryString("id")) {
    $('#backgroundBox').fadeOut()
    alert("获取URL参数失败")
    return
  }
  var BASE_HEAD_PROTOCOL = '', BASE_HEAD_URL = '', BASE_HEAD_REPORT_URL = ''
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
  /* 获取参数q */
  $.ajax({
    url: BASE_HEAD_URL + '/web_proxy/gym/yj_exams/' + getQueryString('id'),
    type: 'get',
    success: function (res) {
      if (res.code == 0) {
        if (res.data && res.data.body && res.data.body.length > 0) {
          var gymdata = res.data.body[res.data.body.length - 1]
          if (gymdata && gymdata.gym_body_exam_data && gymdata.gym_body_exam_data['q']) {
            var queryQ = gymdata.gym_body_exam_data['q']
            console.log(queryQ);
            $.ajax({
              type: 'GET',
              url: BASE_HEAD_REPORT_URL + '/external_device/visbodyfit/v1/qr_decode',
              data: {
                "q": queryQ
              },
              success: function (data) {
                //console.log(data);
                if (data.code == 0) {
                  userBseInfo(data.customerInfo)
                  var param = {
                    token: data.token,
                    scanid: data.scanid,
                    vid: data.vid,
                  }
                  var params = {
                    token: data.token,
                    scanid: data.last_scanid,
                    vid: data.vid,
                  }
                  getbaseData(param, queryQ)
                  if (data.last_scanid) {
                    /* 上一次围度数据 */
                    $.ajax({
                      type: 'GET',
                      url: 'https://api.visbodyfit.com:30000/v1/datas/info',
                      datatype: 'JSONP',
                      data: params,
                      success: function (res) {
                        if (res.code == 0) {
                          $('#last_leftArm').text(res.LeftUpperArmGirth ? res.LeftUpperArmGirth : '--') //左上臂围
                          $('#last_rigthArm').text(res.RightUpperArmGirth ? res.RightUpperArmGirth : '--') //右上臂围
                          $('#last_xiongWei').text(res.BustGirth ? res.BustGirth : '--') //胸围
                          $('#last_yaoWei').text(res.WaistGirth ? res.WaistGirth : '--') //腰围
                          $('#last_leftThigh').text(res.LeftThighGirth ? res.LeftThighGirth : '--') //左大腿围
                          $('#last_rightThigh').text(res.RightThighGirth ? res.RightThighGirth : '--') //右大腿围
                          $('#last_leftLeg').text(res.LeftCalfGirth ? res.LeftCalfGirth : '--') //左小腿围
                          $('#last_rightLeg').text(res.RightCalfGirth ? res.RightCalfGirth : '--') //右小腿围
                          $('#last_hipWei').text(res.HipGirth ? res.HipGirth : '--') //臂围
                        } else {
                          arrorTip("获取上一次围度数据失败")
                        }
                      }
                    })
                  }
                } else {
                  arrorTip(data.errmsg ? data.errmsg : "请求失败")
                  $('#backgroundBox').fadeOut()
                }
              }
            })
          } else {
            arrorTip("获取参数Q失败")
            $('#backgroundBox').fadeOut()
          }
        } else {
          arrorTip("获取数据失败")
          $('#backgroundBox').fadeOut()
        }
      } else {
        arrorTip("获取参数Q失败")
        $('#backgroundBox').fadeOut()
      }
    }
  })

  /* 根据scanid获取其他数据 */
  function getbaseData(params, queryQ) {
    /* 围度数据 */
    $.ajax({
      type: 'GET',
      url: 'https://api.visbodyfit.com:30000/v1/datas/info',
      datatype: 'JSONP',
      data: params,
      success: function (res) {
        if (res.code == 0) {
          $('#leftArm').text(res.LeftUpperArmGirth ? res.LeftUpperArmGirth : '--') //左上臂围
          $('#rigthArm').text(res.RightUpperArmGirth ? res.RightUpperArmGirth : '--') //右上臂围
          $('#xiongWei').text(res.BustGirth ? res.BustGirth : '--') //胸围
          $('#yaoWei').text(res.WaistGirth ? res.WaistGirth : '--') //腰围
          $('#leftThigh').text(res.LeftThighGirth ? res.LeftThighGirth : '--') //左大腿围
          $('#rightThigh').text(res.RightThighGirth ? res.RightThighGirth : '--') //右大腿围
          $('#leftLeg').text(res.LeftCalfGirth ? res.LeftCalfGirth : '--') //左小腿围
          $('#rightLeg').text(res.RightCalfGirth ? res.RightCalfGirth : '--') //右小腿围
          $('#hipWei').text(res.HipGirth ? res.HipGirth : '--') //臂围
        } else {
          arrorTip("获取数据失败")
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
        //console.log(bodysInfo);
        $('#bodyComposition_weight').text(bodysInfo.Weight) //体重
        $('#bodyComposition_water').text(bodysInfo.Fluid) //身体总水分
        $('#bodyComposition_volume').text(bodysInfo.BodyFat) //体脂肪量
        $('#bodyComposition_muscle').text(bodysInfo.Muscle) //肌肉量
        /* 身体成分范围 */
        $.ajax({
          type: 'GET',
          url: 'https://api.visbodyfit.com:30000/v1/bodys/range_info',
          datatype: 'JSONP',
          data: params,
          success: function (rangeInfo) {
            //console.log(rangeInfo);
            if (rangeInfo.code == 0) {
              setRangeText('#range_weight', rangeInfo.WT)
              setRangeText('#range_water', rangeInfo.TBW)
              setRangeText('#range_volume', rangeInfo.BFM)
              setRangeText('#range_muscle', rangeInfo.LM)
              setRangeText('#range_fatrate', rangeInfo.PBF, bodysInfo.PercentBodyFat)
              setRangeText('#range_bmi', rangeInfo.BMI, bodysInfo.Bmi)
              setRangeText('#range_metabolism', rangeInfo.BMR, bodysInfo.Kcal)
              setRangeText('#range_hipratio', rangeInfo.WHR, bodysInfo.WaistToHip)
            } else {
              arrorTip("获取身体成分范围失败")
            }
          }
        })
      }
    })
    /* 身体评分 */
    $.ajax({
      type: 'GET',
      url: 'https://api.visbodyfit.com:30000/v1/score',
      datatype: 'JSONP',
      data: {
        token: params.token,
        vid: params.vid,
      },
      success: function (res) {
        //console.log(res);
        if (res.code == 0) {
          $('#bodyCore').text(res.score)
        } else {
          $('#bodyCore').text(0)
        }
      }
    })
    var fileParams = {
      "q": queryQ,
      "vid": params.vid,
      "scanid": params.scanid,
    }
    /* 人体模型 */
    $.ajax({
      type: 'GET',
      url: BASE_HEAD_REPORT_URL + '/external_device/visbodyfit/v1/get_3dfile',
      data: fileParams,
      success: function (modelInfo) {
        if (modelInfo.code == 0) {
          setPeopleModel(modelInfo.jsonUrl, modelInfo.objUrl)
        } else {
          arrorTip(modelInfo.errmsg ? modelInfo.errmsg : "请求失败")
        }
      }
    })
  }
  /* 用户基本信息渲染 */
  function userBseInfo(data) {
    $('#userName').text(data.Name)
    $('#userSex').text(data.Sex == 1 ? "男" : "女")
    $('#userAge').text(data.Age)
    $('#userHeight').text(data.Height / 10)
  }
  /* 范围判断 */
  function setRangeText(id, rangeData, date) {
    /* 渲染比例 */
    var length = null
    if (rangeData.h == 0 && rangeData.l == 0) { /* 没有范围值 */
      $(id).text('--')
      if (date) {
        length = 15
      }
    } else if (rangeData.h == 0 && rangeData.l != 0) { /* 无高标准 */
      $(id).text(Number(rangeData.l).toFixed(1) + '以上')
      if (date) {
        length = setActivelist(date, rangeData.l, undefined, id)
      }
    } else if (rangeData.h != 0 && rangeData.l == 0) { /* 无低标准 */
      $(id).text(Number(rangeData.h).toFixed(1) + '以下')
      if (date) {
        length = setActivelist(date, undefined, rangeData.h, id)
      }
    } else { /* 正常三等级 */
      $(id).text(Number(rangeData.l).toFixed(1) + '~' + Number(rangeData.h).toFixed(1))
      if (date) {
        length = setActivelist(date, rangeData.l, rangeData.h, id)
      }
    }
    if (length != 0 && length) {
      $(id).parent('li').children('div.range-box').remove()
      var rangeHtml = '<div class="range-box"><ul>'
      for (var i = 0; i < length; i++) {
        rangeHtml += '<li></li>'
      }
      rangeHtml += '</ul><i>' + date + '</i></div>'
      $(id).parent('li').append(rangeHtml)
    }
  }
})
