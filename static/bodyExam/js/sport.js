$(function () {
  var BASE_HEAD_PROTOCOL = '', BASE_HEAD_URL = '';
  if (document.location.protocol == 'http:') {
    BASE_HEAD_PROTOCOL = 'http://';
  } else {
    BASE_HEAD_PROTOCOL = 'https://';
  }
  if (window.location.host == 'www.nlfit.cn' || window.location.host == 'nlfit.cn') {
    /* online */
    BASE_HEAD_URL = (BASE_HEAD_PROTOCOL + 'h5.nlfit.cn');
  } else if (window.location.host == 'www-ceshi.nlfit.cn') {
    /* test */
    BASE_HEAD_URL = (BASE_HEAD_PROTOCOL + 'h5-ceshi.nlfit.cn');
  } else {
    /* 128 */
    // BASE_HEAD_URL = (BASE_HEAD_PROTOCOL + 'h5-dev.nlfit.cn');
    BASE_HEAD_URL = (BASE_HEAD_PROTOCOL + 'h5-ceshi.nlfit.cn');
  }
  var paramId = ""
  if (getQueryString('id')) {
    paramId = getQueryString('id')
  } else {
    alert("获取参数失败")
    return
  }
  $.ajax({
    url: BASE_HEAD_URL + '/web_proxy/sport/report/' + paramId,
    type: 'GET',
    success: function (res) {
      if (res.code == 0) {
        renderBaseDtat(res.data)
      } else {
        alert("数据请求失败" + res.message)
      }
    }
  })
  /* 渲染数据 */
  function renderBaseDtat(result) {
    if (result.sec || result.sec == 0) {
      if (result.sec >= 60) {
        $('#sportTime').html(result.sport_date + "&nbsp;&nbsp;&nbsp;运动时间" + Number(result.sec / 60).toFixed(0) + "分钟")
      } else {
        $('#sportTime').html(result.sport_date + "&nbsp;&nbsp;&nbsp;运动时间" + result.sec + "秒")
      }
    }
    if (result.calorie) {
      if (result.calorie >= 1000) {
        $('#calorieData').text(Number(result.calorie / 1000).toFixed(0))
        $('#calorieData').next('span').text("消耗（大卡）")
      } else {
        $('#calorieData').text(result.calorie)
        $('#calorieData').next('span').text("消耗（卡）")
      }
    }
    $('#userAvtor').attr('src', result.head_url)
    if (result.medal_list && result.medal_list.length && result.medal_list.length == 3) {
      var medalist = result.medal_list, canvasHtml = '';
      var typeName = [
        {
          name: "F",
          img: './img/canvas/instrument2x.png'
        }, {
          name: "A",
          img: './img/canvas/paobuji@2x.png'
        }, {
          name: "W",
          img: './img/canvas/walk2x.png'
        }
      ]
      for (var i = 0; i < medalist.length; i++) {
        canvasHtml += '<li>' +
          '<div class="statistical-box">' +
          '<canvas class="canvas" width="64" height="64" imgs="' + typeName[i].img + '" percent="' + (medalist[i].amount / medalist[i].max_amount).toFixed(2) + '"></canvas>' +
          '<p class="canvas-introduction">' +
          typeName[i].name + medalist[i].level + '<span>' + medalist[i].name + '</span>' +
          '</p>' +
          '</div>' +
          '</li>'
      }
      $('#canvasList').html(canvasHtml)
      /* 渲染canvas */
      var canvasArr = document.getElementsByClassName('canvas')
      var imgArr = [
        './img/canvas/instrument2x.png',
        './img/canvas/aerobic2x.png',
        './img/canvas/walk2x.png'
      ]
      for (var i = 0; i < canvasArr.length; i++) {
        drawCanvas(canvasArr[i], canvasArr[i].getAttribute('percent'), canvasArr[i].getAttribute('imgs'))
      }
    } else {
      alert("运动等级数据获取失败")
    }
    if (result.record_list && result.record_list.length) {
      var recordList = result.record_list, recordHtml = '';
      for (var i = 0; i < recordList.length; i++) {
        recordHtml += '<li class="clearfix">' +
          '        <img src="' + computedImg(recordList[i].sport_content_type) + '" alt="">' +
          '        <div>' +
          '          <p>' + getDeviceData(recordList[i].sport_type).name + '</p>' +
          '          <p>' + computedReport(recordList[i]) + '</p>' +
          '        </div>' +
          '        <span class="rigth-data">' +
          '          <span class="conden-num">' + (recordList[i].calorie < 1000 ? recordList[i].calorie : Number(recordList[i].calorie / 1000).toFixed(0)) + '</span>' +
          '          <span>' + (recordList[i].calorie < 1000 ? "卡" : "大卡") + '</span>' +
          '        </span>' +
          '      </li>'
      }
      $('#sportListBox').html(recordHtml)
    } else {
      //alert("运动项目数据获取失败")
      $('#sportListBox').html('<div class="empty-box">无运动数据~~</div>')
    }
  }
  function drawCanvas(doc, data, imgSrc) {
    var ctx = doc.getContext('2d')
    ctx.save()
    ctx.clearRect(0, 0, doc.width, doc.height)
    ctx.translate(doc.width / 2, doc.height / 2)
    ctx.save()
    // 画外环
    ctx.rotate(134 * Math.PI / 180)
    ctx.beginPath()
    ctx.arc(0, 0, 30, 0, 1.5 * Math.PI, false)
    ctx.strokeStyle = '#EEEEEE'
    ctx.lineWidth = 2
    ctx.stroke()
    drawCanvasProgress(ctx, Number(data))
    ctx.restore()
    // 画中心图片
    var img = new Image()
    img.src = imgSrc
    img.onload = function () {
      ctx.save()
      ctx.translate(doc.width / 2, doc.height / 2)
      ctx.translate(-8.5, -10.5)
      ctx.beginPath()
      ctx.drawImage(img, 0, 0, 17, 21)
      ctx.restore()
    }
    ctx.restore()
  }
  function drawCanvasProgress(obj, data) {
    // 画进度
    obj.beginPath()
    obj.arc(0, 0, 30, 0, data * 1.5 * Math.PI, false)
    obj.strokeStyle = '#1AB394'
    obj.lineWidth = 2
    obj.stroke()
  }
  function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
  }
  function getDeviceData(type_id) {
    var device = deviceArr.filter(function (v, i) {
      return type_id == v.id
    })
    if (device.length == 1) {
      return device[0]
    } else {
      return {
        name: '无此数据',
        id: 0
      }
    }
  }
  function computedImg(sport_content_type) {
    if (sport_content_type == 0) {
      return "./img/canvas/walk.png"
    } else if (sport_content_type == 1) {
      return "./img/canvas/danche.png"
    } else if (sport_content_type == 2) {
      return "./img/canvas/qixie.png"
    }
    return ""
  }
  function computedReport(res) {
    if (res.sport_content_type == 0) {
      return res.amount + " 步"
    } else if (res.sport_content_type == 1) {
      return Number(res.amount / 100000).toFixed(2) + " 公里"
    } else if (res.sport_content_type == 2) {
      return res.amount + " 个"
    }
    return ""
  }
})
