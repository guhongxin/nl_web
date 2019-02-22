var BASE_HEAD_PROTOCOL = '',
  BASE_HEAD_URL = ''
if (document.location.protocol == 'http:') {
  BASE_HEAD_PROTOCOL = 'http://';
} else {
  BASE_HEAD_PROTOCOL = 'https://';
}
if (window.location.host == 'www.nlfit.cn' || window.location.host == 'nlfit.cn') {
  /* online */
  BASE_HEAD_URL = (BASE_HEAD_PROTOCOL + 'h5.nlfit.cn');
} else if (window.location.host == 'www-ceshi.nlfit.cn') {
  /*test*/
  BASE_HEAD_URL = (BASE_HEAD_PROTOCOL + 'h5-ceshi.nlfit.cn');
} else if (window.location.hostname == 'localhost') {
  /*128*/
  BASE_HEAD_URL = (BASE_HEAD_PROTOCOL + 'h5-dev.nlfit.cn');
  // BASE_HEAD_URL = (BASE_HEAD_PROTOCOL + 'h5-ceshi.nlfit.cn');
}
/* 获取url参数 */
function getQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
}
var appurl = BASE_HEAD_PROTOCOL + window.location.host + '/saas/static/health/index.html?id=' + getQueryString('id')
$.ajax({
  url: BASE_HEAD_URL + '/web_proxy/gym/yj_exams/' + getQueryString('id'),
  type: 'get',
  success: function (res) {
    if (res.code == 0) {
      renderDate(res.data)
    } else {
      alert("获取数据失败")
    }
  }
})

/* 数据渲染 */
function renderDate(res) {
  console.log(res);

  $('#QR').qrcode({
    render: 'canvas',
    width: 100,
    height: 100,
    text: appurl
  })

  // 判断该用户是不是首次体测
  console.log(res.body.length);

  var data, agoData;
  if (res.body.length == 1) {
    data = res.body[0].gym_body_exam_data.data
  } else if (res.body.length == 2) {
    data = res.body[1].gym_body_exam_data.data
    agoData = res.body[0].gym_body_exam_data.data || {}
  }

// 拿到data下的composition和measurement
  if (data) { 
    var data1 = data.composition
    var data2 = data.measurement

    if (data.girth) {
      var data3 = data.girth
      // 身体围度
      $('#left_top>p:first-child').text(data3.la ? data3.la : '-')
      $('#right_top>p:first-child').text(data3.ra ? data3.ra : '-')
      $('#chest>p:first-child').text(data3.chest ? data3.chest : '-')
      $('#waistline>p:first-child').text(data3.waist ? data3.waist : '-')
      $('#hipline>p:first-child').text(data3.hip ? data3.hip : '-')
      $('#whr>p:first-child').text(data3.whr ? data3.whr : '-')
      $('#left_thigh>p:first-child').text(data3.lt ? data3.lt : '-')
      $('#right_thigh>p:first-child').text(data3.rt ? data3.rt : '-')
      $('#left_crus>p:first-child').text(data3.lc ? data3.lc : '-')
      $('#right_crus>p:first-child').text(data3.rc ? data3.rc : '-')
    } else {
      $('#left_top>p:first-child').text('-')
      $('#right_top>p:first-child').text('-')
      $('#chest>p:first-child').text('-')
      $('#waistline>p:first-child').text('-')
      $('#hipline>p:first-child').text('-')
      $('#whr>p:first-child').text('-')
      $('#left_thigh>p:first-child').text('-')
      $('#right_thigh>p:first-child').text('-')
      $('#left_crus>p:first-child').text('-')
      $('#right_crus>p:first-child').text('-')
    }
    // console.log(data);
    
    $('.user-id span').text(data2.id ? data2.id : '-')
    $('.report-data span').text(data2.start_time ? data2.start_time.slice(0, 10) : '-')
    $('.report-time span').text(data2.start_time ? data2.start_time.slice(11) : '-')
    $('.user-age span').text(data2.age ? data2.age : '-')
    if (data2.gender) {
      $('.user-sex span').text(data2.gender == 1 ? '男' : '女')
    } else {
      $('.user-sex span').text('-')
    }
    $('.user-height span').text(data2.height ? data2.height : '-')
    // 体成分分析

    $('#weight p:first-child').text(data1.weight ? data1.weight : '-')
    if (data1.prv.weight) {
      $('#weight p:last-child').text('（ ' + data1.prv.weight[0] + '~' + data1.prv.weight[1] + ' ）')
    } else {
      $('#weight p:last-child').text('--')
    }

    $('#nofat_weight p:first-child').text(data1.ffm ? data1.ffm : '-')
    if (data1.prv.ffm) {
      $('#nofat_weight p:last-child').text('（ ' + data1.prv.ffm[0] + '~' + data1.prv.ffm[1] + ' ）')
    } else {
      $('#nofat_weight p:last-child').text('--')
    }

    $('#muscle p:first-child').text(data1.muscle ? data1.muscle : '-')
    if (data1.prv.muscle) {
      $('#muscle p:last-child').text('（ ' + data1.prv.muscle[0] + '~' + data1.prv.muscle[1] + ' ）')
    } else {
      $('#muscle p:last-child').text('--')
    }

    $('#fat_weight p:first-child').text(data1.bfm ? data1.bfm : '-')
    if (data1.prv.bfm) {
      $('#fat_weight p:last-child').text('（ ' + data1.prv.bfm[0] + '~' + data1.prv.bfm[1] + ' ）')
    } else {
      $('#fat_weight p:last-child').text('--')
    }

    $('#protein p:first-child').text(data1.protein ? data1.protein : '-')
    if (data1.prv.protein) {
      $('#protein p:last-child').text('（ ' + data1.prv.protein[0] + '~' + data1.prv.protein[1] + ' ）')
    } else {
      $('#protein p:last-child').text()
    }

    $('#mineral p:first-child').text(data1.minerals ? data1.minerals : '-')
    if (data1.prv.minerals) {
      $('#mineral p:last-child').text('（ ' + data1.prv.minerals[0] + '~' + data1.prv.minerals[1] + ' ）')
    } else {
      $('#mineral p:last-child').text('--')
    }

    $('#water p:first-child').text(data1.tbw ? data1.tbw : '-')
    if (data1.prv.tbw) {
      $('#water p:last-child').text('（ ' + data1.prv.tbw[0] + '~' + data1.prv.tbw[1] + ' ）')
    } else {
      $('#water p:last-child').text('--')
    }
    $('#infat p:first-child').text(data1.vfi ? data1.vfi : '-')
    if (data1.prv.vfi) {
      $('#infat p:last-child').text('（ ' + 1 + '~' + 9 + ' ）')
    } else {
      $('#infat p:last-child').text('--')
    }

    // 健康评估


    $('#metabolism').text(data1.bmr ? parseInt(data1.bmr) : '-')
    $('#body_age').text(data1.body_age ? parseInt(data1.body_age) : '-')
    $('#energy').text(data1.cbc ? parseInt(data1.cbc) : '-')

    switch (data2.score) {
      case 1:
        $('#score').text('健康')
        break;
      case 2:
        $('#score').text('低风险')
        break;
      case 3:
        $('#score').text('中风险')
        break;
      case 4:
        $('#score').text('高风险')
        break;
      default:
        $('#score').text('--')
        break;
    }
    // 身体评估
    $('#body_bmi span:nth-child(3)').text('（' + data1.prv.bmi[0] + '~' + data1.prv.bmi[1] + '）')
    $('#bmi_text').text(data1.bmi ? data1.bmi : '-')
    planLength(data1.prv.bmi[0], data1.prv.bmi[1], data1.bmi, $('#bmi_bar'))

    $('#body_weight span:nth-child(3)').text('（' + data1.prv.weight[0] + '~' + data1.prv.weight[1] + '）')
    $('#weight_text').text(data1.weight ? data1.weight : '-')
    planLength(data1.prv.weight[0], data1.prv.weight[1], data1.weight, $('#weight_bar'))

    $('#body_smm span:nth-child(3)').text('（' + data1.prv.smm[0] + '~' + data1.prv.smm[1] + '）')
    $('#smm_text').text(data1.smm ? data1.smm : '-')
    planLength(data1.prv.smm[0], data1.prv.smm[1], data1.smm, $('#smm_bar'))

    $('#body_bfm span:nth-child(3)').text('（' + data1.prv.bfm[0] + '~' + data1.prv.bfm[1] + '）')
    $('#bfm_text').text(data1.bfm ? data1.bfm : '-')
    planLength(data1.prv.bfm[0], data1.prv.bfm[1], data1.bfm, $('#bfm_bar'))

    $('#body_pbf span:nth-child(3)').text('（' + data1.prv.pbf[0] + '~' + data1.prv.pbf[1] + '）')
    $('#pbf_text').text(data1.pbf ? data1.pbf : '-')
    planLength(data1.prv.pbf[0], data1.prv.pbf[1], data1.pbf, $('#pbf_bar'))
    // 历史记录


    if (res.body.length == 1) {
      // 只有一次体测数据
      // console.log('一次体测');
      
      $('#weight_one').text('-')
      $('#pbf_one').text('-')
      $('#smm_one').text('-')
      $('#time_one').text('-')

      $('#weight_two').text(data1.weight ? data1.weight : '-')
      $('#pbf_two').text(data1.pbf ? data1.pbf : '-')
      $('#smm_two').text(data1.smm ? data1.smm : '-')
      $('#time_two').text(data2.start_time ? data2.start_time : '-')

      $('#weight_difference').text('-')
      $('#pbf_difference').text('-')
      $('#smm_difference').text('-')
      $('#time_difference').text('-')
    } else if (res.body.length == 2) {
      // console.log('二次体测');
      
      var agoData2 = agoData.composition || {}
      var agoData3 = agoData.measurement || {}

      $('#weight_one').text(agoData2.weight ? agoData2.weight : '-')
      $('#pbf_one').text(agoData2.pbf ? agoData2.pbf : '-')
      $('#smm_one').text(agoData2.smm ? agoData2.smm : '-')
      $('#time_one').text(agoData3.start_time ? agoData3.start_time : '-')

      $('#weight_two').text(data1.weight ? data1.weight : '-')
      $('#pbf_two').text(data1.pbf ? data1.pbf : '-')
      $('#smm_two').text(data1.smm ? data1.smm : '-')
      $('#time_two').text(data2.start_time ? data2.start_time : '-')
      // 差值
      var weightBad = '-', pbfBad = '-', smmBad = '-'
      if (data1.weight && agoData2.weight) {
        weightBad = Math.round((Number(data1.weight) - Number(agoData2.weight)) * 10) / 10
      }
      if (data1.pbf && agoData2.pbf){
        pbfBad = Math.round((Number(data1.pbf) - Number(agoData2.pbf)) * 10) / 10
      }
      if (data1.smm && agoData2.smm){
        smmBad = Math.round((Number(data1.smm) - Number(agoData2.smm)) * 10) / 10
      }
      //  计算时间差
      var date = '', date2 = '', time1 = '', days = '-'
      if (data2.start_time) {
        date = new Date(data2.start_time + ':000')
        date2 = new Date(agoData3.start_time + ':000')
        time1 = date.getTime() - date2.getTime();
        days = Math.floor(time1 / (24 * 3600 * 1000)) 
      }
      $('#weight_difference').text(weightBad)
      $('#pbf_difference').text(pbfBad)
      $('#smm_difference').text(smmBad)
      // console.log(agoData3);
      if(JSON.stringify(agoData3) == "{}") {
        $('#time_difference').text('-' + ' DAY')
      }else{
      $('#time_difference').text(days == '-'? days : days + ' DAY')
    }
    }

    // 调节建议
    $('#adjust_fat>span:first-child').text(data1.bfm ? data1.bfm : '-')
    $('#adjust_fat>span:last-child').text(data1.bfm_control ? "-"+data1.bfm_control : '-')
    $('#adjust_muscle>span:first-child').text(data1.muscle ? data1.muscle : '-')
    $('#adjust_muscle>span:last-child').text(data1.smm_control ? '+'+data1.smm_control : '-')


    // 节段脂肪
    $('#fat_lt>p:first-child').text(data1.segmental_fat.la + 'kg')
    if (data1.segmental_fat.la < data1.prv.segmental_fat.la[0]) {
      $('#fat_lt>p:last-child').text('偏低')
    } else if (data1.segmental_fat.la > data1.prv.segmental_fat.la[1]) {
      $('#fat_lt>p:last-child').text('偏高')
    } else if (data1.segmental_fat.la >= data1.prv.segmental_fat.la[0] && data1.segmental_fat.la <= data1.prv.segmental_fat.la[1]) {
      $('#fat_lt>p:last-child').text('正常')
    }

    $('#fat_lb>p:first-child').text(data1.segmental_fat.ll + 'kg')
    if (data1.segmental_fat.ll < data1.prv.segmental_fat.ll[0]) {
      $('#fat_lb>p:last-child').text('偏低')
    } else if (data1.segmental_fat.ll > data1.prv.segmental_fat.ll[1]) {
      $('#fat_lb>p:last-child').text('偏高')
    } else if (data1.segmental_fat.ll >= data1.prv.segmental_fat.ll[0] && data1.segmental_fat.ll <= data1.prv.segmental_fat.ll[1]) {
      $('#fat_lb>p:last-child').text('正常')
    }

    $('#fat_mid>p:first-child').text(data1.segmental_fat.tr + 'kg')
    if (data1.segmental_fat.tr < data1.prv.segmental_fat.tr[0]) {
      $('#fat_mid>p:last-child').text('偏低')
    } else if (data1.segmental_fat.tr > data1.prv.segmental_fat.tr[1]) {
      $('#fat_mid>p:last-child').text('偏高')
    } else if (data1.segmental_fat.tr >= data1.prv.segmental_fat.tr[0] && data1.segmental_fat.tr <= data1.prv.segmental_fat.tr[1]) {
      $('#fat_mid>p:last-child').text('正常')
    }

    $('#fat_rt>p:first-child').text(data1.segmental_fat.ra + 'kg')
    if (data1.segmental_fat.ra < data1.prv.segmental_fat.ra[0]) {
      $('#fat_rt>p:last-child').text('偏低')
    } else if (data1.segmental_fat.ra > data1.prv.segmental_fat.ra[1]) {
      $('#fat_rt>p:last-child').text('偏高')
    } else if (data1.segmental_fat.ra >= data1.prv.segmental_fat.ra[0] && data1.segmental_fat.ra <= data1.prv.segmental_fat.ra[1]) {
      $('#fat_rt>p:last-child').text('正常')
    }

    $('#fat_rb>p:first-child').text(data1.segmental_fat.rl + 'kg')
    if (data1.segmental_fat.rl < data1.prv.segmental_fat.rl[0]) {
      $('#fat_rb>p:last-child').text('偏低')
    } else if (data1.segmental_fat.rl > data1.prv.segmental_fat.rl[1]) {
      $('#fat_rb>p:last-child').text('偏高')
    } else if (data1.segmental_fat.rl >= data1.prv.segmental_fat.rl[0] && data1.segmental_fat.rl <= data1.prv.segmental_fat.rl[1]) {
      $('#fat_rb>p:last-child').text('正常')
    }

    $('#smm_lt>p:first-child').text(data1.segmental_smm.la + 'kg')
    if (data1.segmental_smm.la < data1.prv.segmental_smm.la[0]) {
      $('#smm_lt>p:last-child').text('偏低')
    } else if (data1.segmental_fat.la > data1.prv.segmental_fat.la[1]) {
      $('#smm_lt>p:last-child').text('偏高')
    } else if (data1.segmental_fat.la >= data1.prv.segmental_fat.la[0] && data1.segmental_fat.la <= data1.prv.segmental_fat.la[1]) {
      $('#smm_lt>p:last-child').text('正常')
    }

    $('#smm_lb>p:first-child').text(data1.segmental_smm.ll + 'kg')
    if (data1.segmental_smm.ll < data1.prv.segmental_smm.ll[0]) {
      $('#smm_lb>p:last-child').text('偏低')
    } else if (data1.segmental_fat.ll > data1.prv.segmental_fat.ll[1]) {
      $('#smm_lb>p:last-child').text('偏高')
    } else if (data1.segmental_fat.ll >= data1.prv.segmental_fat.ll[0] && data1.segmental_fat.ll <= data1.prv.segmental_fat.ll[1]) {
      $('#smm_lb>p:last-child').text('正常')
    }

    $('#smm_mid>p:first-child').text(data1.segmental_smm.tr + 'kg')
    if (data1.segmental_smm.tr < data1.prv.segmental_smm.tr[0]) {
      $('#smm_mid>p:last-child').text('偏低')
    } else if (data1.segmental_fat.tr > data1.prv.segmental_fat.tr[1]) {
      $('#smm_mid>p:last-child').text('偏高')
    } else if (data1.segmental_fat.tr >= data1.prv.segmental_fat.tr[0] && data1.segmental_fat.tr <= data1.prv.segmental_fat.tr[1]) {
      $('#smm_mid>p:last-child').text('正常')
    }

    $('#smm_rt>p:first-child').text(data1.segmental_smm.ra + 'kg')
    if (data1.segmental_smm.ra < data1.prv.segmental_smm.ra[0]) {
      $('#smm_rt>p:last-child').text('偏低')
    } else if (data1.segmental_fat.ra > data1.prv.segmental_fat.ra[1]) {
      $('#smm_rt>p:last-child').text('偏高')
    } else if (data1.segmental_fat.ra >= data1.prv.segmental_fat.ra[0] && data1.segmental_fat.ra <= data1.prv.segmental_fat.ra[1]) {
      $('#smm_rt>p:last-child').text('正常')
    }

    $('#smm_rb>p:first-child').text(data1.segmental_smm.rl + 'kg')
    if (data1.segmental_smm.rl < data1.prv.segmental_smm.rl[0]) {
      $('#smm_rb>p:last-child').text('偏低')
    } else if (data1.segmental_fat.rl > data1.prv.segmental_fat.rl[1]) {
      $('#smm_rb>p:last-child').text('偏高')
    } else if (data1.segmental_fat.rl >= data1.prv.segmental_fat.rl[0] && data1.segmental_fat.rl <= data1.prv.segmental_fat.rl[1]) {
      $('#smm_rb>p:last-child').text('正常')
    }

  } else {
    alert("获取数据失败")
  }



  // 进度条渲染方法

  function planLength(min, max, rol, el) {
    var barlength = 0
    if (rol < min) {
      barlength = rol / ((min - 0) * 3) * 100
    } else if (rol > max) {
      barlength = 66 + (rol - max) / ((100 - max) * 3)
    } else if (rol > min && rol < max) {
      barlength = 33 + (rol - min) / ((max - min) * 3) * 100
    }
    el.css('width', barlength + '%')
  }


}
