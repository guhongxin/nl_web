$(document).ready(function() {
  getIncome()
  getOutcome()
  timeList = []
  numList = []
  inDetail()
  getTodayTime()
})

window.setInterval(function() {
  getTodayTime()
}, 10000)

// 获取时间
var today_day = ''
function getTodayTime() {
  var today_year = new Date().getFullYear()
  var today_month = new Date().getMonth() + 1
  var today_date = new Date().getDate()
  today_day = new Date().getDay()
  switch (today_day) {
    case 1:
      today_day = '周一'
      break
    case 2:
      today_day = '周二'
      break
    case 3:
      today_day = '周三'
      break
    case 4:
      today_day = '周四'
      break
    case 5:
      today_day = '周五'
      break
    case 6:
      today_day = '周六'
      break
    case 7:
      today_day = '周日'
      break
    default:
      today_day = '-'
      break
  }
  var today_time = getSec(new Date().getTime(), 6)
  $('#todayTime').html(today_year + '年' + today_month + '月' + today_date + '日' + '&nbsp;&nbsp;' + today_day + '&nbsp;' + today_time)
}

var inChart = echarts.init(document.getElementById('inChart'))

var option = {
  title: {
    show: false
  },
  grid: {
    left: '20px',
    top: '25px',
    containLabel: true
  },
  tooltip: {
    trigger: 'axis',
    formatter: function(params) {
      console.log(params)
      var res = '<b style="font-size:20px;font-weight:550;">' + params[0].data + '</b>人签到<br/>'
      res += today_day + '&nbsp;' + params[0].name
      // var myseries = option.series;
      // for (var i = 0; i < myseries.length; i++) {
      // 	for (var j = 0; j < myseries[i].data.length; j++) {
      // 		if (myseries[i].data[j].name == params.name) {
      // 			res += myseries[i].name + ' : ' + myseries[i].data[j].value + '</br>';
      // 		}
      // 	}
      // }
      return res
    }
  },
  calculable: true,
  yAxis: [
    {
      name: '人数',
      type: 'value',
      nameTextStyle: {
        color: '#fff'
      },
      axisLabel: {
        textStyle: {
          color: '#fff', // 坐标值得具体的颜色
        }
      },
      minInterval: 1
    }
  ],
  xAxis: [
    {
      name: '时间',
      type: 'category',
      splitLine: { show: false },
      nameTextStyle: {
        color: '#fff'
      },
      axisLabel: {
        textStyle: {
          color: '#fff', // 坐标值得具体的颜色
        }
      },
      // data: []
      //  data:  ["00:00","01:00","02:00","03:00","04:00","05:00","06:00","07:00","08:00","09:00","10:00","11:00","12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"]
      //          data:  ["00:00","01:00","02:00","03:00","04:00","05:00","06:00","07:00","08:00","09:00","10:00","11:00","12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"]
      //          data:  ["07:00","08:00","09:00","10:00","11:00","12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00"]
      data: ['12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00']
    }
  ],
  series: [
    {
      name: '人数',
      type: 'line',
      data: numList,
      stack: '人数',
      itemStyle: {
		normal: {
			barBorderRadius: 25,
			barBorderColor: 'transparent'
		}
      },
      data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    }
  ],
  color: ['#23C6C8']
}
inChart.setOption(option)

// 获取入场记录
var inList = []
var nowdate = new Date().getTime()
function getIncome() {
  $.post('../gym/GymUserSignAction!inOrOutRecord.zk', {
    state: 'I',
    nowDate: getSec(nowdate, 5)
  }, function(data) {
    if (data.STATUS) {
      inList = data.rows
      loadIn()
    }
  }, 'json')
}
// 入场记录数据渲染
function loadIn() {
  $('#inGym').html('')
  for (var i = 0; i < inList.length; i++) {
    var gmtCreate = inList[i].gmtCreate
    var hm = getSec(gmtCreate, 6)
    var ymd = getSec(gmtCreate, 5)
    var starTime = this.parseTime(new Date(inList[i].created_at).getTime(), '{h}:{i}')
    var photo = ''
    var sex = ''
    if (inList[i].photo) {
      photo = showImgUrl + inList[i].photo + '&style=image/quality,q_70/resize,h_200,w_200'
    } else {
      photo = 'img/rentou.png'
    }
    if (inList[i].memberCardName) {
      memberCardName = inList[i].memberCardName
    } else {
      memberCardName = '未办卡'
    }
    if (inList[i].sex == 'F') {
      sex = '女'
    } else {
      sex = '男'
    }
    var phoneNum = (inList[i].phone).replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
    var box = `
			<div class="box">
				<div class="box-top">
					<b>${hm}</b><span>${ymd}</span>
			`
    if (inList[i].code) {
      box += `
							<span class="nobracelet" data-img='${photo}' data-phone='${inList[i].phone}' data-customerId="${inList[i].customerId}">已取手牌</span>
				`
    } else {
      box += `
							<a href="javascript:;" class="get-bracelet bracelet" data-img='${photo}' data-phone='${inList[i].phone}' data-customerId="${inList[i].customerId}">领取手牌</a>
				`
    }
    box += `
				</div>
				<div class="row">
					<div class="col-3 imgPosition">
						<div class="headimg" onclick="showInfo(${inList[i].phone},'${inList[i].memberCardBuyId}')">
							<img src="${photo}" alt=""/>
			`
    if (inList[i].isEmployee == 'y') {
      box += `<i><img src="images/emp.png" alt="" /></i>`
    }
    box += `</div>
					</div>
					<div class="col-7">
						<div class="top-name">
							<b>${inList[i].realName}</b>
							<span class="sex">${sex}</span>
						</div>
						<div class="top-phone">电话：<span>${phoneNum}</span></div>
						<div class="top-phone">卡种：<span>${memberCardName}</span></div>
					</div>
				</div>
			</div>
		`
    $('#inGym').append(box)
  }
}

// 获取出场记录
var outList = []
function getOutcome() {
  $.post('../gym/GymUserSignAction!inOrOutRecord.zk', {
    state: 'O',
    nowDate: getSec(nowdate, 5)
  }, function(data) {
    checkLogin(data)
    msgLoading('close')
    if (data.STATUS) {
      outList = data.rows
      loadOut()
    } else {
      alerts(data.INFO, 1000)
    }
  }, 'json')
}
// 出场记录数据渲染
function loadOut() {
  $('#outGym').html('')
  for (var i = 0; i < outList.length; i++) {
    var gmtModify = outList[i].gmtModify
    var hm = getSec(gmtModify, 6)
    var ymd = getSec(gmtModify, 5)
    var photo = ''
    var sex = ''
    if (outList[i].photo) {
      photo = showImgUrl + outList[i].photo
    } else {
      photo = 'img/rentou.png'
    }
    if (outList[i].memberCardName) {
      memberCardName = outList[i].memberCardName
    } else {
      memberCardName = '未办卡'
    }
    if (outList[i].sex == 'F') {
      sex = '女'
    } else {
      sex = '男'
    }
    var phoneNum = (outList[i].phone).replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
    var box = `
			<div class="box">
				<div class="box-top">
					<b>${hm}</b><span>${ymd}</span>
			`
    if (outList[i].code) {
      box += `
							<a href="javascript:;" class="return-bracelet" data-mark='${outList[i].mark}' data-gmtstart='${outList[i].gmt_start}' data-gmtend='${outList[i].gmt_end}' data-img='${outList[i].photo}' data-code='${outList[i].code}' data-area='${outList[i].area}' data-number='${outList[i].number}' data-phone='${outList[i].phone}' data-customerId="${outList[i].customerId}">归还手牌</a>
				`
    } else {
      box += `
							<span class="nobracelet" data-img='${outList[i].photo}' data-phone='${outList[i].phone}' data-customerId="${outList[i].customerId}">已还手牌</span>
				`
    }
    box += `
				</div>
				<div class="row">
					<div class="col-3 imgPosition">
						<div class="headimg" onclick="showInfo(${outList[i].phone},'${outList[i].memberCardBuyId}')">
							<img src="${photo}" alt="" />
			`
    if (outList[i].isEmployee == 'y') {
      box += `<i><img src="images/emp.png" alt="" /></i>`
    }
    box += `</div>
					</div>
					<div class="col-7">
						<div class="top-name">
							<b>${outList[i].realName}</b>
							<span class="sex">${sex}</span>
						</div>
						<div class="top-phone">电话：<span>${phoneNum}</span></div>
						<div class="top-phone">卡种：<span>${memberCardName}</span></div>
					</div>
				</div>
			</div>
		`
    $('#outGym').append(box)
  }
}
$('#outGym').on('click', ' .return-bracelet', function() {
  clearCard1()
  clearCard3()
  clearCard4()
  var area = $(this).attr('data-area')
  var number = $(this).attr('data-number')
  var caseNumber = area + '区 - ' + number + '号'
  var phone = $(this).attr('data-phone')
  $('#nowNum1').text(caseNumber)
  $('#nowNum1').attr('data-code', $(this).attr('data-code'))
  $('#nowNum3').text(caseNumber)
  var photo = $(this).attr('data-img')
  if (photo !== 'undefined') {
    $('#userIcon1').attr('src', showImgUrl + photo)
    $('#userIcon3').attr('src', showImgUrl + photo)
  } else {
    $('#userIcon1').attr('src', 'img/rentou.png')
    $('#userIcon3').attr('src', 'img/rentou.png')
  }
  var realName = $($(this).parents('.box').find('b')[1]).text()
  if (realName !== 'undefined') {
    $('#userName1').text(realName)
    $('#userName3').text(realName)
  } else {
    $('#userName1').text('-')
    $('#userName3').text('-')
  }
  if (phone) {
    $('#userPhone1').text(phone)
    $('#userPhone3').text(phone)
  } else {
    $('#userPhone1').text('-')
    $('#userPhone3').text('-')
  }
  $.post('../gym/GymMemberCabinetRecordAction!searchByPhoneOrCodeOrBracelet.zk', {
    code: phone
  }, function(data) {
    checkLogin(data)
    if (data.STATUS) {
      var caseInfo = data.map
      var gmtEnd = caseInfo.gmtEnd
      var gmtStart = caseInfo.gmtStart
      $('#endTime1').text(getSec(gmtEnd, 1))
      $('#endTime3').text(getSec(gmtEnd, 1))
      $('#returnTime').text(getSec(gmtEnd, 5))
      var getOverdueDay = getOverdueDays(gmtEnd)
      if (getOverdueDay == -1) {
        $('#yuqiTime').text(0)
      } else {
        $('#yuqiTime').text(getOverdueDay)
      }
      $('#startTime1').text(getSec(gmtStart, 1))
      $('#startTime3').text(getSec(gmtStart, 1))
      if (caseInfo.realPay) {
        $('#realPay1').text(caseInfo.realPay)
      }
      if (caseInfo.charterPay) {
        $('#charterPay1').text(caseInfo.charterPay)
      }
    } else {
      alerts(data.INFO, 1000)
      return false
    }
  }, 'json')
  var mark = $(this).attr('data-mark')
  if (mark !== 'undefined') {
    $('#borrowTips1').text(mark)
    $('#borrowTips3').text(mark)
  }
  $('#editCard1').dialog('open')
//	customerId = $(this).attr('data-customerId');
})

// 入场详情渲染
var timeList = []
var numList = []
var borderWidth = ''
function inDetail() {
  $.post('../gym/GymUserSignAction!inRecordStatistics.zk', {
  }, function(data) {
    checkLogin(data)
    msgLoading('close')
    if (data.STATUS) {
      var businessHours = data.businessHours
      var hours = businessHours.split(':')
      var startTime = Number(hours[0])
      var endTime = Number(hours[1].split('-')[1])
      var timeNumList = []
      for (var i = startTime; i <= endTime; i++) {
        timeNumList.push(i)
      }
      var rows = data.rows

      for (var j = 0; j < timeNumList.length; j++) {
        numList[j] = 0
      }
      for (var j = 0; j < timeNumList.length; j++) {
        for (var k = 0; k < rows.length; k++) {
          if (timeNumList[j] == Number(rows[k].hours)) {
            numList[j] = rows[k].totalCount
          }
        }
      }
      for (var i = 0; i < timeNumList.length; i++) {
        timeList.push(timeNumList[i] + ':00')
      }
      if (timeList.length <= 10) {
        borderWidth = 30
      } else if (timeList.length <= 15 && timeList.length > 10) {
        borderWidth = 20
      } else if (timeList.length <= 24 && timeList.length > 15) {
        borderWidth = 10
      }
      inChart.setOption({
        yAxis: {
          data: timeList
        },
        series: [{
          itemStyle: {
		            	normal: {
				            barBorderWidth: borderWidth
		            	}
		            },
          data: numList
        }]
      })
    } else {
      alerts(data.INFO, 1000)
    }
  }, 'json')
}

// 点击显示大图
function layerOpen(ele) {
  layer.open({
	  type: 1,
	  title: false,
	  closeBtn: 0,
	  area: '516px',
	  skin: 'layui-layer-nobg', // 没有背景色
	  shadeClose: true,
	  content: ele
  })
}
$('#memberIcon').click(function() {
  var src = $(this).attr('data-src')
  var imgbox = $('#imgbox')
  imgbox.find('img').attr('src', '/fatburn_new/file/FileAction!loadFile.zk?key=' + src)
  layerOpen(imgbox)
})

// 设置时间
var nowDate = new Date().getTime()
var nowTime = getSec(nowDate, 1)
var endTime = getSec(nowDate, 5) + ' 23:59:59'

window.addEventListener('resize', function() {
  inChart.resize()
})

// 获取对应时间的年月日时分秒,index对应说明: 1=>年月日时分秒 2=>月份 3=>日期 4=>星期 5=>年月日 6=>时分 7=>时分秒 8=>年 9=>年月日拼接完整格式
function getSec(val, index) {
  var _date = new Date(val)
  var nowYear = _date.getFullYear()
  var nowMonth = _date.getMonth() + 1
  var nowDate = _date.getDate()
  var nowHours = _date.getHours()
  var nowMinutes = _date.getMinutes()
  var nowSeconds = _date.getSeconds()
  var nowDay = _date.getDay()
  if (nowMonth < 10) {
    nowMonth = '0' + nowMonth
  }
  if (nowDate < 10) {
    nowDate = '0' + nowDate
  }
  if (nowHours < 10) {
    nowHours = '0' + nowHours
  }
  if (nowMinutes < 10) {
    nowMinutes = '0' + nowMinutes
  }
  if (nowSeconds < 10) {
    nowSeconds = '0' + nowSeconds
  }
  if (index == 1) {
    return nowYear + '-' + nowMonth + '-' + nowDate + ' ' + nowHours + ':' + nowMinutes + ':' + nowSeconds
  } else if (index == 2) {
    return nowMonth
  } else if (index == 3) {
    return nowDate
  } else if (index == 4) {
    return nowDay
  } else if (index == 5) {
    return nowYear + '-' + nowMonth + '-' + nowDate
  } else if (index == 6) {
    return nowHours + ':' + nowMinutes
  } else if (index == 7) {
    return nowHours + ':' + nowMinutes + ':' + nowSeconds
  } else if (index == 8) {
    return nowYear
  } else if (index == 9) {
    return nowYear + '-' + nowMonth + '-' + nowDate + ' 00:00:00'
  }
  return nowYear + '-' + nowMonth + '-' + nowDate + ' ' + nowHours + ':' + nowMinutes + ':' + nowSeconds
}
