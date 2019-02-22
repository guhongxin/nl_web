if (document.location.protocol == 'http:') {
  var BASE_HEAD_PROTOCOL = 'http://';
} else {
  var BASE_HEAD_PROTOCOL = 'https://';
}
// if (window.location.host == 'www.nlfit.cn' || window.location.host == 'nlfit.cn') {
//   /* online */
//   var BASE_HEAD_URL = (BASE_HEAD_PROTOCOL + 'h5.nlfit.cn');
// } else if (window.location.host == 'www-ceshi.nlfit.cn') {
//   /*test*/
//   var BASE_HEAD_URL = (BASE_HEAD_PROTOCOL + 'h5-ceshi.nlfit.cn');
// } else if (window.location.hostname == 'localhost') {
//   /*128*/
//   var BASE_HEAD_URL = (BASE_HEAD_PROTOCOL + 'h5-dev.nlfit.cn');
// }

// var BASE_HEAD_URL = (BASE_HEAD_PROTOCOL + 'h5-dev.nlfit.cn');
/* 获取url参数 */
// function getQueryString(name) {
//   var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
//   var r = window.location.search.substr(1).match(reg);
//   if (r != null) return unescape(r[2]);
//   return null;
// }

// http: //h5-dev.nlfit.cn/web_proxy/gym/yj_exams/15
  // var appurl = BASE_HEAD_PROTOCOL + window.location.host + '/saas/sharepage/bodyExam.html?id=' + getQueryString('id')
  var BASE_HEAD_URL = 'http://' + 'h5-ceshi.nlfit.cn'

$.ajax({
  // url: BASE_HEAD_URL + '/web_proxy/gym/yj_exams/' + getQueryString('id'),
  url: BASE_HEAD_URL + '/web_proxy/gym/yj_exams/' + '264',
  type: 'get',
  success: function (res) {
    if (res.code == 0) {
      renderDate(res.data)
      // console.log(res.data);

    } else {
      alert("获取数据失败")
    }
  }
})

// 数据渲染


function renderDate(res) {
  // console.log(res);
  var baseData = res.customer
  var bodyData = res.body[0]
  var bodyInfo = res.body[0].gym_body_exam_data
  console.log(bodyInfo);

  // console.log(res.customer);
  $('.name-num>span').text(baseData.name ? baseData.name : '-')
  if (bodyInfo.sex) {
    if (bodyInfo.sex == 1) {
      $('.man').removeClass('hid').addClass('show')
    } else if (bodyInfo.sex == 2) {
      $('.woman').removeClass('hid').addClass('show')
    }
  } else {
    $('.man').removeClass('hid').addClass('show')
  }
  $('.height>i').text(bodyData.height ? bodyData.height : '-')
  $('.time>i').text(bodyData.created_at ? bodyData.created_at : '-')
  $('.age>i').text(bodyData.age ? bodyData.age : '-')

  // 人体成分
  var pFat = Math.round(bodyInfo.Fat / bodyInfo.Weight * 100) + '%'
  var pBone = Math.round(bodyInfo.Bone / bodyInfo.Weight * 100) + '%'
  var pPro = Math.round(bodyInfo.Protein / bodyInfo.Weight * 100) + '%'
  var pWat = Math.round(bodyInfo.Water / bodyInfo.Weight * 100) + '%'
  $('#p-fat').text(pFat)
  $('#p-bone').text(pBone)
  $('#p-pro').text(pPro)
  $('#p-wat').text(pWat)

  $('.one-color').text(bodyInfo.Fat ? retainTwo(bodyInfo.Fat) : '-')
  $('.two-color').text(bodyInfo.Bone ? retainTwo(bodyInfo.Bone) : '-')
  $('.three-color').text(bodyInfo.Protein ? retainTwo(bodyInfo.Protein) : '-')
  $('.four-color>span').text(bodyInfo.Water ? retainTwo(bodyInfo.Water) : '-')

  $('#body-scope1').text(retainTwo(bodyInfo.FatMin) + '~' + retainTwo(bodyInfo.FatMax))
  $('#body-scope2').text(retainTwo(bodyInfo.BoneMin) + '~' + retainTwo(bodyInfo.BoneMax))
  $('#body-scope3').text(retainTwo(bodyInfo.ProteinMin) + '~' + retainTwo(bodyInfo.ProteinMax))
  $('#body-scope4').text(retainTwo(bodyInfo.WaterMin) + '~' + retainTwo(bodyInfo.WaterMax))

  $('.body-weight>p').text(bodyInfo.Weight ? retainTwo(bodyInfo.Weight) : '-')
  $('.body-fat-weight>p').text(bodyInfo.LBM ? retainTwo(bodyInfo.LBM) : '-')
  $('.body-muscle>p').text(bodyInfo.Muscle ? retainTwo(bodyInfo.Muscle) : '-')
  $('.body-wet #wet1').text(bodyInfo.Water ? retainTwo(bodyInfo.Water) : '-')
  $('.body-wet #wet2').text(bodyInfo.ECW ? retainTwo(bodyInfo.ECW) : '-')
  $('.body-cell>P').text(bodyInfo.ICW ? retainTwo(bodyInfo.IC) : '-')

  // 进度条部分

  if (bodyInfo.MuscleMin || bodyInfo.MuscleMin == 0) {
    $('#muscle-norm').text(bodyInfo.MuscleMin + '~' + bodyInfo.MuscleMax)
  } else {
    $('#muscle-norm').text('--')
  }
  if (bodyInfo.SMMMin || bodyInfo.SMMMin == 0) {
    $('#skeletal-norm').text(bodyInfo.SMMMin + '~' + bodyInfo.SMMMax)
  } else {
    $('#skeletal-norm').text('--')
  }
  if (bodyInfo.ProteinMin || bodyInfo.ProteinMin) {
    $('#protein-norm').text(bodyInfo.ProteinMin + '~' + bodyInfo.ProteinMax)
  } else {
    $('#protein-norm').text('--')
  }

  if (bodyInfo.FatMin || bodyInfo.FatMin == 0) {
    $('#fat-norm').text(bodyInfo.FatMin + '~' + bodyInfo.FatMax)
  } else {
    $('#fat-norm').text('--')
  }

  if (bodyInfo.PBFMin || bodyInfo.PBFMin == 0) {
    $('#pbf-norm').text(bodyInfo.PBFMin + '~' + bodyInfo.PBFMax)
  } else {
    $('#pbf-norm').text('--')
  }
  if (bodyInfo.VFIMin || bodyInfo.VFIMin == 0) {
    $('#vfi-norm').text(bodyInfo.VFIMin + '~' + bodyInfo.VFIMax)
  } else {
    $('#vfi-norm').text('--')
  }
  if (bodyInfo.TR_fatMin || bodyInfo.TR_fatMin == 0) {
    $('#TR_fat-norm').text(bodyInfo.TR_fatMin + '~' + bodyInfo.TR_fatMax)
  } else {
    $('#TR_fat-norm').text('--')
  }

  if (bodyInfo.BMIMin || bodyInfo.BMIMin == 0) {
    $('#bmi-norm').text(bodyInfo.BMIMin + '~' + bodyInfo.BMIMax)
  } else {
    $('#bmi-norm').text('--')
  }
  if (bodyInfo.WHRMin || bodyInfo.WHRMin == 0) {
    $('#whr-norm').text(bodyInfo.WHRMin + '~' + bodyInfo.WHRMax)
  } else {
    $('#whr-norm').text('--')
  }

  // 节段分析
  $('#l-lt').text(bodyInfo.LA_muscle ? retainTwo(bodyInfo.LA_muscle) : '-')
  $('#l-lb').text(bodyInfo.LL_muscle ? retainTwo(bodyInfo.LL_muscle) : '-')
  $('#l-rt').text(bodyInfo.RA_muscle ? retainTwo(bodyInfo.RA_muscle) : '-')
  $('#l-rb').text(bodyInfo.RL_muscle ? retainTwo(bodyInfo.RL_muscle) : '-')
  $('#l-mid').text(bodyInfo.TR_muscle ? retainTwo(bodyInfo.TR_muscle) : '-')

  $('#r-lt').text(bodyInfo.LA_fat ? retainTwo(bodyInfo.LA_fat) : '-')
  $('#r-lb').text(bodyInfo.LL_fat ? retainTwo(bodyInfo.LL_fat) : '-')
  $('#r-rt').text(bodyInfo.RA_fat ? retainTwo(bodyInfo.RA_fat) : '-')
  $('#r-rb').text(bodyInfo.RL_fat ? retainTwo(bodyInfo.RL_fat) : '-')
  $('#r-mid').text(bodyInfo.TR_fat ? retainTwo(bodyInfo.TR_fat) : '-')

  // 右侧
  $('#score').text(bodyInfo.Score ? retainTwo(bodyInfo.Score) : '-')
  $('#body-age').text(bodyInfo.BodyAge ? parseInt(bodyInfo.BodyAge) : '-')
  // 体重管理
  $('#standard-weight').text(bodyInfo.Standard_weight ? retainTwo(bodyInfo.Standard_weight) : '-')
  $('#weight-control').text(bodyInfo.Weight_control ? retainTwo(bodyInfo.Weight_control) : '-')
  $('#fat-control').text(bodyInfo.Fat_control ? bodyInfo.Fat_control : '-')
  $('#muscle-control').text(bodyInfo.Muscle_control ? bodyInfo.Muscle_control : '-')

  // 骨骼肌
  $('#ske-ssm').text(bodyInfo.SMM ? bodyInfo.SMM : '-')
  // 上肢发达
  if (bodyInfo) {
    var degree = developed()
    if (degree == 1) {
      $('#upLimb1').attr("checked", "checked")
    } else if (degree == 2) {
      $('#upLimb2').attr("checked", "checked")
    } else if (degree == 3) {
      $('#upLimb3').attr("checked", "checked")
    }
  }
  //下肢发达
  if (bodyInfo) {
    var degreeB = developedB()
    if (degreeB == 1) {
      $('#lowLimb1').attr("checked", "checked")
    } else if (degreeB == 2) {
      $('#lowLimb2').attr("checked", "checked")
    } else if (degreeB == 3) {
      $('#lowLimb3').attr("checked", "checked")
    }
  }

  // 判断左右平衡

  if (bodyInfo) {
    // 先计算单侧平均肌肉
    var LRb = bodyInfo.Muscle / 2
    // 计算最大值和最小值 在这个范围之内的是平衡
    var LRbMin = LRb * 0.9
    var LRbMax = LRb * 1.1
    var LRbMid = bodyInfo.LA_muscle + bodyInfo.LL_muscle
    if (LRbMid >= LRbMin && LRbMid <= LRbMax) {
      $('#balance').attr("checked", "checked")
    } else {
      $('#unbalance').attr("checked", "checked")
    }

  }



  // 判断骨骼肌范围
  if (bodyInfo.SMM) {
    if (bodyInfo.SMM < bodyInfo.SMMMin) {
      $('#lv1').attr("checked", "checked")
    } else if (bodyInfo.SMM > bodyInfo.SMMMax) {
      $('#lv3').attr("checked", "checked")
    } else if (bodyInfo.SMM >= bodyInfo.SMMMin && bodyInfo.SMM <= bodyInfo.SMMMax) {
      $('#lv2').attr("checked", "checked")
    }
  } else {
    $('#lv2').attr("checked", "checked")
  }
  // 肥胖分析
  if (bodyInfo.BMI) {
    var bmiN = Number(bodyInfo.BMI)
    // console.log(bmiN);

    if (bmiN < 18.5) {
      $('#bmi1').attr("checked", "checked")
    } else if (bmiN > 24 && bmiN <= 30) {
      $('#bmi3').attr("checked", "checked")
      if (bmiN > 30 && bmiN <= 35) {
        $('#bmi4').attr("checked", "checked")
      } else if (bmiN > 35 && bmiN <= 40) {
        $('#bmi5').attr("checked", "checked")
      } else if (bmiN > 40) {
        $('#bmi6').attr("checked", "checked")
      }
    } else if (bmiN >= 18.5 && bmiN <= 24) {
      $('#bmi2').attr("checked", "checked")
    }
  } else {
    $('#bmi2').attr("checked", "checked")
  }
  // 代谢量
  $('#bmr').text(bodyInfo.BMR ? bodyInfo.BMR : '-')
  // 腰臀比
  if (bodyInfo.WHR) {
    if (bodyInfo.WHR < bodyInfo.WHRMin) {
      $('#shape1').attr("checked", "checked")
    } else if (bodyInfo.WHR > bodyInfo.WHRMax) {
      $('#shape3').attr("checked", "checked")
    } else if (bodyInfo.WHR <= res.bodyInfo.WHRMax && bodyInfo.WHR >= bodyInfo.WHRMin) {
      $('#shape2').attr("checked", "checked")
    }

  } else {
    $('#shape2').attr("checked", "checked")
  }

  // 体型判定
  if (bodyInfo.BodyType) {
    var type_num = Number(bodyInfo.BodyType) + 1
    if (type_num <= 9 && type_num >= 1) {
      $(".body-type>li:nth-child(" + type_num + ")").removeClass('def').addClass('opt')
    } else {
      $('.body-type>li:nth-child(5)').removeClass('def').addClass('opt')
    }
  } else {
    $('.body-type>li:nth-child(5)').removeClass('def').addClass('opt')
  }




  // 渲染进度条

  setKedu(bodyInfo.MuscleMin, bodyInfo.MuscleMax, bodyInfo.Muscle, $('#muscle_plan'), 1)
  setKedu(bodyInfo.SMMMin, bodyInfo.SMMMax, bodyInfo.SMM, $('#smm_plan'), 1)
  setKedu(bodyInfo.ProteinMin, bodyInfo.ProteinMax, bodyInfo.Protein, $('#protein_plan'), 1)

  setKedu(bodyInfo.FatMin, bodyInfo.FatMax, bodyInfo.Fat, $('#fat_plan'), 1)
  setKedu(bodyInfo.PBFMin, bodyInfo.PBFMax, bodyInfo.PBF, $('#pbf_plan'), 1)
  setKedu(bodyInfo.VFIMin, bodyInfo.VFIMax, bodyInfo.VFI, $('#vfi_plan'), 1)
  // setKedu(res, res, res, $('#tr_fat_plan'))

  setKedu(bodyInfo.BMIMin, bodyInfo.BMIMax, bodyInfo.BMI, $('#bmi_plan'), 1)
  setKedu(bodyInfo.WHRMin, bodyInfo.WHRMax, bodyInfo.WHR, $('#whr_plan'), 2)

  function setKedu(min, max, date, el, dig) {
    var itemone = Number(((max - min) / 3).toFixed(dig))
    var keduArr = [Number((min - itemone * 3).toFixed(dig))]
    for (var i = 0; i < 9; i++) {
      keduArr[i + 1] = Number((keduArr[i] + itemone).toFixed(dig))
    }
    keduArr[3] = min
    keduArr[6] = max
    $.each(el.find('span'), function (i, v) {
      $(v).text(keduArr[i])
    })

    var backWidth = 0
    if (date <= keduArr[0]) {
      backWidth = 15
    } else if (date >= keduArr[keduArr.length - 1]) {
      backWidth = 95
    } else {
      var allWidth = keduArr[keduArr.length - 1] - keduArr[0]
      var selfWidth = date - keduArr[0]
      var selfPercent = ((selfWidth / allWidth) * 0.9 + 0.05) * 100
    }
    el.siblings('div').css('width', selfPercent + '%')

    // console.log(el.siblings('div').css('width', selfPercent + '%'));



  }
  standardSM(bodyInfo.sex, bodyInfo.height)
  // 计算标准肌肉
  // 传入的参数为身高和性别 1男 2女
  function standardSM(gender, h) {
    var SM = ''
    var h = Number(h)
    if (gender == 1) {
      SM = 0.00344 * h * h - 0.37678 * h + 14.40021
    } else if (gender == 2) {
      SM = 0.00351 * h * h - 0.4661 * h + 23.04821
    }
    // 保留2位小数
    SM = parseFloat(SM)
    SM = Math.round(SM * 100) / 100
    return SM
  }
  // 保留两位小数
  function retainTwo(num) {
    var result = parseFloat(num)
    result = Math.round(num * 100) / 100
    return result
  }
  //上肢发达程度计算公式
  function developed() {
    var degree = 1
    if (bodyInfo) {
      var balanceTop = bodyInfo.LA_muscle + bodyInfo.RA_muscle
      var devMin = bodyInfo.Muscle * 0.05
      var devMax = bodyInfo.Muscle * 0.15

      console.log(balanceTop);
      console.log(devMin);
      console.log(devMax);
      if (balanceTop > devMax) {
        degree = 3
      } else if (balanceTop < devMin) {
        degree = 1
      } else if (balanceTop >= devMin && balanceTop <= devMax) {
        degree = 2
      }
    } else {
      degree = 1
    }
    console.log(degree);
    return degree
  }
  // 下肢发达程度计算公式

  function developedB() {
    var degreeB = 1
    if (bodyInfo) {
      var balanceTop = bodyInfo.LL_muscle + bodyInfo.RL_muscle
      var devMin = bodyInfo.Muscle * 0.25
      var devMax = bodyInfo.Muscle * 0.35

      console.log(balanceTop);
      console.log(devMin);
      console.log(devMax);
      if (balanceTop > devMax) {
        degreeB = 3
      } else if (balanceTop < devMin) {
        degreeB = 1
      } else if (balanceTop >= devMin && balanceTop <= devMax) {
        degreeB = 2
      }
    } else {
      degreeB = 1
    }
    console.log(degreeB);
    return degreeB
  }


  function CloseWebPage() {
    window.close()
  }

}
