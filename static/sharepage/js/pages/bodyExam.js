$(document).ready(function () {
  var BASE_HEAD_PROTOCOL = 'http://'
  if (document.location.protocol == 'http:') {
    BASE_HEAD_PROTOCOL = 'http://';
  } else {
    BASE_HEAD_PROTOCOL = 'https://';
  }
  var BASE_HEAD_URL = BASE_HEAD_PROTOCOL + 'h5.nlfit.cn'
  if (window.location.host == 'www.nlfit.cn' || window.location.host == 'nlfit.cn') {
    /* online */
    BASE_HEAD_URL = (BASE_HEAD_PROTOCOL + 'h5.nlfit.cn');
  } else {
    /* test */
    BASE_HEAD_URL = (BASE_HEAD_PROTOCOL + 'h5-ceshi.nlfit.cn');
  }
  if (navigator.userAgent.indexOf('niulanger') == -1) {
    $('.download-box').show()
  } else {
    $('.download-box').hide()
  }
  var api = new $.api() // 接口文件
  var mapDataList = [{
      type: 1,
      text: 'BMI',
      unit: ''
    },
    {
      type: 2,
      text: '脂肪',
      unit: '%'
    },
    {
      type: 3,
      text: '肌肉',
      unit: '%'
    },
    {
      type: 4,
      text: '水分',
      unit: '%'
    },
    {
      type: 5,
      text: '蛋白质',
      unit: '%'
    },
    {
      type: 6,
      text: '内脏脂肪',
      unit: '%'
    },
    {
      type: 7,
      text: '骨量',
      unit: '%'
    },
    {
      type: 8,
      text: '基础代谢',
      unit: ''
    },
    {
      type: 9,
      text: '体型',
      unit: ''
    },
    {
      type: 10,
      text: '体重',
      unit: 'kg'
    },
    {
      type: 11,
      text: '身体年龄',
      unit: ''
    },
    {
      type: 12,
      text: '皮下脂肪',
      unit: '%'
    },
  ]
  /* 获取url参数 */
  function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
  }

  function biaochi(arr, itemValue, state) {
    var itemValue = itemValue ? itemValue : -1
    var lef = 0
    var state0 = state[0]
    var state1 = state[1]
    var state2 = state[2]
    // console.log(state0, state1, state2);
    if (!arr.stateStrings) {
      arr.stateStrings = []
    }
    switch (arr.stateStrings.length) {
      case 1:
        break;
      case 2:
        lef = sister(itemValue, state0, (state0 + 50), 0, 0, $('#qwe0').width())
        break;
      case 3:
        // if (arr.type == 6) {
        // 	lef = sister(itemValue, 2.1, 5.0, 7.5, 0, $('#qwe1').width())
        // 	break;
        // } else {
        lef = sister(itemValue, state0, state1, (state1 + 50), 0, $('#qwe1').width())
        break;
        // }
      case 4:
        lef = sister(itemValue, state0, state1, state2, (state2 + 50), $('#qwe2').width())
        break;
      case 5:
        lef = sister(itemValue, state0, state1, state2, state[3], $('#qwe3').width())
        break;
    }
    return lef
  }

  function sister(x, e, f, g, h, SboxWidth) {
    var x = parseFloat(x),
      e = parseFloat(e),
      f = parseFloat(f),
      g = parseFloat(g),
      h = parseFloat(h);
    var firstWidthAve = SboxWidth / e,
      secondWidthAve = SboxWidth / (f - e),
      thredWidthAve = SboxWidth / (g - f),
      fourthWidthAve = SboxWidth / (h - g),
      fivethWidthAve = SboxWidth / (100 - h),
      curleftpx = 0;

    if (x <= 0) {
      curleftpx = -10;
    } else if (x < e) {
      curleftpx = x * firstWidthAve + -10;
    } else if (x <= f) {
      curleftpx = SboxWidth + (x - e) * secondWidthAve + -10;
    } else if (x <= g) {
      curleftpx = SboxWidth * 2 + (x - f) * thredWidthAve + -10;
    } else if (x <= h) {
      curleftpx = SboxWidth * 3 + (x - g) * fourthWidthAve + -10;
    } else if (x <= h + 100) {
      curleftpx = SboxWidth * 4 + (x - h) * fivethWidthAve + -10;
    } else {
      curleftpx = SboxWidth * 5 + -10;
    }
    var soei = $('#qwe0').width() * 2
    if (curleftpx > soei) {
      curleftpx = soei - 10
    }
    return curleftpx + 'px'
  }

  function pieer(text_list, source) {
    var winwidth = window.innerWidth
    var d_width = winwidth < 375 ? winwidth : 375 // 画布大小
    var viewboxwid = winwidth / 375
    var trasx = (winwidth - 375) / 2
    var d_hlaf = d_width / 2 // 一半
    var circle_r = 103
    var line_color = "#F0F0F0"
    var line_num = text_list.length
    var rotate_one = 360 / line_num
    var source = Math.floor(source * 100) / 100
    var sourcelength = String(source).length
    var sourcetext = '综合评分'
    var text_list = text_list

    function fontalign(basefontsize, num) {
      var font_item = basefontsize,
        font_left = 0,
        num_length = String(num).length
      if (String(num).indexOf('.') > -1) {
        font_left = (((num_length - 1) * font_item) + 6.67) / 2
      } else {
        font_left = (num_length * font_item) / 2
      }
      return font_left
    }

    function rad(params) {
      return params * Math.PI / 180
    }
    var draw = SVG('drawing').size(d_width, d_width) // 定一画布
    draw.transform({
      scale: viewboxwid > 1.2 ? 1.2 : viewboxwid
    })
    $('#drawing').css({
      width: d_width
    })
    var gradient = draw.gradient('linear', function (stop) { // 线性渐变
      stop.at(0, '#27867B', 0.5)
      stop.at(1, '#97E7BB', 0.5)
    })
    gradient.from(0, 1).to(0.5, 0) // 渐变位置更改

    var panel = draw.gradient('linear', function (stop) { // 线性渐变
      stop.at(0, '#69CAB7', 0.4)
      stop.at(1, '#0C4691', 0.05)
    })
    panel.from(0, 1).to(0.5, 0) // 渐变位置更改

    var group = draw.group() // 建立分组
    var circle = group.circle(circle_r * 2).attr({ // 外部线条大圆环
      cx: d_hlaf,
      cy: d_hlaf,
      fill: '#FFFFFF',
      stroke: line_color,
      'stroke-width': 1
    })
    for (var i = 0; i < line_num; i++) { // 外部文字和蜘蛛网线
      group.line(d_hlaf, d_hlaf - circle_r, d_hlaf, d_hlaf + circle_r).stroke({
        width: 1,
        color: line_color
      }).transform({
        rotation: rotate_one * i
      })
      // group.text('体重').rotate(rotate_one * i, d_hlaf, d_hlaf)
      var fontitem = text_list[i].text
      var xi = d_hlaf + (circle_r + 30) * Math.cos(rad(i * rotate_one - 90)) // 计算文字的坐标x
      var yi = d_hlaf + (circle_r + 30) * Math.sin(rad(i * rotate_one - 90)) // 计算文字的坐标y
      group.text(fontitem).transform({
        x: xi - fontalign(12, fontitem),
        y: yi - 9
      }).font({
        size: 12,
        anchor: 'start',
      })
    }
    var group1 = draw.group()
    group1.circle((circle_r - 28) * 2).attr({ // 中间圆环
      cx: d_hlaf,
      cy: d_hlaf,
      fill: 'transparent',
      stroke: gradient,
      'stroke-width': 20,
    })
    var linec = ''
    var linearr = []
    for (var i = 0; i < line_num; i++) { // 描点
      // circle_r = 100% , ((circle_r - 10) / 2) = 0%
      var min = ((circle_r - 10) / 2) // 最小值
      // var r = Math.floor(Math.random() * (circle_r - min + 1) + min)
      var mindleMin = (circle_r - min) / 3 // 正常最小值  = mindleMin + min
      var mindleMax = (mindleMin * 2) + min // 正常最大值
      var r = ''
      if (text_list[i].point == 'lowb') {
        r = min
      }
      if (text_list[i].point == 'low') {
        r = (mindleMin / 2) + min
      }
      if (text_list[i].point == 'normal') {
        r = (mindleMax + (mindleMin + min)) / 2
      }
      if (text_list[i].point == 'high') {
        r = mindleMax + (circle_r - mindleMax) / 2
      }
      if (text_list[i].point == 'more') {
        r = circle_r
      }
      if (text_list[i].point == 'loser') {
        r = mindleMin + min
      }
      var color = '#1AB394'
      if (r < (mindleMin + min)) {
        color = '#7AB8CF'
      } else if (r <= mindleMax) {
        color = '#1AB394'
      } else {
        color = '#F8AC59'
      }
      var xi = d_hlaf + (r) * Math.cos(rad(i * rotate_one - 90)) // 计算每个点的坐标x
      var yi = d_hlaf + (r) * Math.sin(rad(i * rotate_one - 90)) // 计算每个点的坐标y
      var x = d_hlaf + min * Math.cos(rad(i * rotate_one - 90)) // 计算每个点的起始坐标x
      var y = d_hlaf + min * Math.sin(rad(i * rotate_one - 90)) // 计算每个点的起始坐标y
      group.circle(5).attr({ // 外部线条大圆环
        cx: xi,
        cy: yi,
        fill: color
      })
      linec = linec + x + ',' + y + ' '
      linearr.push([xi, yi])
    }
    var polygon = group.polygon(linec).fill(panel) // 绘制折线
    polygon.animate(800).plot(linearr) // 折线动画
    var group3 = draw.group()
    group3.circle(circle_r - 10).attr({
      cx: d_hlaf,
      cy: d_hlaf,
      fill: '#ffffff',
      stroke: line_color,
      'stroke-width': 1,
    })

    var _left = fontalign(13.39, source)
    var soure = group3.text(function (add) {
      add.tspan(source).newLine().dx(0).fill('#1AB394')
    }).transform({
      x: d_hlaf - _left,
      y: d_hlaf - 44
    })
    soure.font({
      family: 'dincondensed-bold',
      size: 36,
      anchor: 'start',
      // leading: '1.5em'
    })

    var font_left = fontalign(11, sourcetext)
    var font = group3.text(function (add) {
      add.tspan(sourcetext).newLine().dx(0).fill('#333333')
    }).transform({
      x: d_hlaf - font_left,
      y: d_hlaf + 10
    })
    font.font({
      size: 12,
      anchor: 'start',
      // leading: '1.5em'
    })
  }
  var id = getQueryString('id')
  var customerId = getQueryString('customerId')
  var typesaas = getQueryString('type')
  if (!id) {
    $('.mask').show()
    return
  }
  var root = new Vue({
    el: '#app',
    data: {
      inapp: true,
      headicon: '',
      name: '',
      examTime: '',
      agg: {},
      born: {},
      fat: {},
      weightList: [],
      dataList: [],
      WEIGHT: [],
      BMI: [],
      FAT: [],
      MUSCLE: [],
      dateX: [],
      chartData: {
        text: '',
        Data: []
      },
      chartChooseList: [{
        text: '体重',
        type: 'WEIGHT',
        choose: true
      }, {
        text: 'BMI',
        type: 'BMI',
        choose: false
      }, {
        text: '脂肪',
        type: 'FAT',
        choose: false
      }, {
        text: '肌肉',
        type: 'MUSCLE',
        choose: false
      }],
      normal: 0,
      dateShow: false,
      dateList: [],
      allData: [],
      text_l: [],
      examTimedo: false
    },
    created: function () {
      this.getapi()
    },
    mounted: function () {
      if (navigator.userAgent.indexOf('niulanger') == -1) {
          this.inapp = false // 外
          $('.body_top_box').hide()
          $('.img_404').css({
            top: '60px'
          })
          if (typesaas == 'saas') {
            $('.download-box').hide()
            $('.img_404').css({
              top: '0px'
            })
          }
        } else {
        this.inapp = true // 内
        this.show404()
      }
    },
    methods: {
      show404: function () {
        $('.body_top_box').show()
        $('.download-box').hide()
        $('.img_404').css({
          top: '0px'
        })
      },
      getapi: function () {
        var self = this
        $.ajax({
          url: BASE_HEAD_URL + '/web_proxy/gym/body_exams/share/' + id,
          type: 'get',
          success: function (res) {
            if (res.code == 102031) {
              $('.img_404').show()
              $('#otherbox').hide()
              self.examTimedo = true
              if (customerId) {
                self.examTime = '体测日期'
              } else {
                self.examTime = '无列表信息'
              }
              // self.getDataList()
            }
            $('.body_top_box').show()
            self.examTimedo = false
            var res = res.data
            var resultData = {}
            if (!res) {
              $('.mask').show()
            } else {
              var lens = res.body.length
              if (lens) {
                if (lens == 1) {
                  resultData = res.body[0]
                  self.setExamTime(resultData)
                  self.setDataList(resultData)
                }
                if (lens > 1) {
                  resultData = res.body[lens - 1]
                  self.setExamTime(res.body[lens - 1])
                  self.setDataList(res.body[lens - 1])
                }
              }
              self.setUserInfo(res.customer)
            }
            if (customerId === null) { // customerId未传值
              self.inapp = false // 没有customerId时候为推送消息，不显示切换日期按钮
              customerId = resultData.customer_id
            }
            if (customerId != 0) {
              customerId = customerId || resultData.customer_id
              self.getDataList()
            }
          },
          error: function (err) {
            $('.mask').show()
            $('#error').text(JSON.parse(err.responseText).message)
          }
        })
      },
      getDataList: function () {
        var self = this
        if (customerId) {
          $.ajax({
            url: BASE_HEAD_URL + '/web_proxy/gym/body_exams/count/' + customerId,
            type: 'get',
            success: function (res) {
              var req = res.data
              self.allData = req
              if (self.allData.body) {
                // self.allData.body.reverse()
              } else {
                self.allData.body = self.allData
              }
              self.setUserInfo(req.customer)
              req.body = req.body || req
              if (req.body.length === 1) { self.inapp = false }
              if (req.body.length) {
                $.each(req.body, function (index, item) {
                  self.WEIGHT.push(item.weight)
                  self.BMI.push(item.bmi)
                  self.FAT.push(item.fat)
                  self.MUSCLE.push(item.muscle)
                  self.dateX.push(item.examTime.split(' ')[0].substr(5, 5))
                  self.dateList.push(item.examTime)
                })
              }
              // self.dateList.reverse()
              self.chartData.text = '体重'
              self.chartData.Data = self.WEIGHT
              self.$nextTick(function () {
                self.initChart(self.options);
              })
            }
          })
        } else {
          // self.examTime = '无列表信息'
          console.log('无customerId');
        }
      },
      choose: function (index) {
        // var data = this.allData.body[(this.dateList.length - 1) - index]
        var data = this.allData.body[index]
        if (data.source == 0) {
          location.replace(location.origin + location.pathname + '?id=' + data.id + '&customerId=' + data.customer_id)
        } else if(data.source == 1){
          // this.show404()
          // $('.img_404').show()
          // $('#otherbox').hide()
          // $('.ogh').show()
          location.replace(location.origin + '/static/health/index.html?id=' + data.id + '&customerId=' + data.customer_id)
          // location.replace(location.origin + '/static/health/index.html?id=164&customerId=5024')
        }else if(data.source == 2){
          location.replace(location.origin + '/static/visfitlb/index.html?q=' + (data.gym_body_exam_data.q?data.gym_body_exam_data.q:0))
        }
        // this.setExamTime(data)
        // this.setDataList(data)

        this.dateShow = false
      },
      chooseChart: function (item) {
        this.chartData.text = item.text
        this.chartData.Data = this[item.type]
        console.log(item.type)
        for (var index = 0; index < this.chartChooseList.length; index++) {
          this.chartChooseList[index].choose = false
        }
        item.choose = true
        this.initChart(this.options)
      },
      setUserInfo: function (res) {
        var self = this
        if (!res) {
          // self.examTime = '-'
          // self.examTimedo = true
          return
        }
        this.headicon = this.isHttps(res.head_portrait || '')
        this.name = res.name
      },
      setExamTime: function (res) {
        this.examTime = res.examTime
      },
      setDataList: function (res) {
        console.log(res);
        var self = this
        self.normal = res.normal
        document.title = res.customer ? res.customer.name + '的体测报告' : '体测报告'
        if (!res.gym_body_exam_data || !res.gym_body_exam_data.controlItems) {
          console.error('res.gym_body_exam_data.controlItems无此字段')
          return
        }
        if (res.gym_body_exam_data.controlItems.length) {
          self.weightList = []
          $.each(res.gym_body_exam_data.controlItems, function (index, curent) {
            var value = ''
            if (curent.itemValue) {
              if (curent.itemValue == '无需控制') {
                value = '无需控制'
              } else {
                if (curent.itemValue.toString().indexOf('公斤') > -1) {
                  value = curent.itemValue.split('公斤')[0]
                } else {
                  value = (Math.floor(Number(curent.itemValue) * 100) / 100)
                }
                value = (Math.floor(value * 100) / 100) + 'kg'
              }
            } else {
              value = '无需控制'
            }
            var name = ''
            if (curent.itemName != '理想体重') {
              name = curent.itemName
            } else {
              name = curent.itemName
            }
            self.weightList.push({
              name: name,
              value: value
            })
          })
        }

        if (res.gym_body_exam_data.dataItems.length > 0) {
          self.text_l = []
          self.dataList = []
          $.each(res.gym_body_exam_data.dataItems, function (index, item) {
            mapDataList.forEach(function (element) {
              if (element.type == item.type) {
                var listitem = self.stateString(item.stateString)
                if (item.type == 5) { // 蛋白质
                  self.agg = listitem
                }
                if (item.type == 7) { // 骨量=无机盐
                  self.born = listitem
                }
                if (item.type == 2) { // 脂肪
                  self.fat = listitem
                }
                if (item.type == 8) { // 基础代谢
                  item.itemValue = res.calories_base ? res.calories_base : 0
                  if (!item.itemValue) {
                    listitem.point = 'lowb'
                  }
                }
                listitem.text = element.text
                item.filename = './img/bodyExam/' + listitem.filename + '/' + element.text + '@2x.png'
                item.color = listitem.color
                if (typeof (item.stateStrings) != 'object') {
                  item.stateStrings = eval('(' + item.stateStrings + ')')
                }
                if (typeof (item.stateValues) != 'object') {
                  item.stateValues = item.stateValues ? eval('(' + item.stateValues + ')') : []
                }
                var linshilie = []
                $.each(item.stateValues, function (inx, ite) {
                  ite += element.unit
                  linshilie.push(ite)
                })
                item.stateVer = linshilie

                item.listValue = self.statepercent(item)
                item.left = biaochi(item, item.itemValue, item.stateValues)
                item.check = false
                self.dataList.push(item)
                if (item.type == 9) {
                  switch (res.normal) {
                    case 0:
                    case 1:
                      listitem.point = 'high'
                      break;
                    case 2:
                      listitem.point = 'more'
                      break;
                    case 3:
                    case 6:
                      listitem.point = 'low'
                      break;
                    case 4:
                    case 5:
                    case 7:
                      listitem.point = 'normal'
                      break;
                    case 8:
                      listitem.point = 'loser'
                      break;
                    default:
                      listitem.point = 'normal'
                      break;
                  }
                }
                self.text_l.push(listitem)
              }
            })
          })
          self.setBodyShape(res.normal)
          $('#drawing').html('')
          pieer(self.text_l, res.score)
        }
      },
      isHttps: function (icon) {
        if (icon) {
          if (window.location.protocol.split(':')[0] === 'https') {
            return 'https:' + icon.split(':')[1]
          }
        }
        return icon
      },
      choosedowm: function (check, index) {
        this.dataList[index].check = !check
        this.$set(this.dataList, index, this.dataList[index])
      },
      setBodyShape: function (item) {
        var self = this
        var imglist = $('#BodyShape li')
        $.each(imglist, function (index, it) {
          var ele = $(it).find('img')
          var cursrc = ele.attr('src')
          if (cursrc.indexOf('白') != -1) {
            dand = cursrc.split('白')
            $(it).removeClass('selected')
            ele.attr('src', dand[0] + '灰' + dand[1])
          }
        })
        var current = imglist.eq(item)
        current.addClass('selected')
        var srcarr = current.find('img').attr('src').split('灰')
        current.find('img').attr('src', srcarr[0] + '白' + srcarr[1])
      },
      statepercent: function (item) {
        var value = ''
        switch (item.type) {
          case 8:
            value = item.itemValue ? (Math.floor(item.itemValue * 100) / 100) : '-'
            break;
          case 1:
          case 9:
          case 10:
          case 11:
            value = item.itemValue ? item.itemValue : '-'
            break;
          default:
            value = (Math.floor(item.itemValue * 100) / 100) + '%'
            break;
        }
        return value
      },
      stateString: function (item) {
        var filename = ''
        var color = ''
        var point = ''
        switch (item) {
          case '偏低':
          case '不达标':
            filename = '偏低'
            color = 'blue'
            point = 'low'
            break;
          case '严重不足':
            filename = '偏低'
            color = 'blue'
            point = 'lowb'
            break;
          case '标准':
          case '充足':
          case '达标':
            filename = '正常'
            color = 'green'
            point = 'normal'
            break;
          case '偏高':
            filename = '偏高'
            color = 'yellow'
            point = 'high'
            break;
          case '严重超标':
          case '严重偏高':
            filename = '超高'
            color = 'yellow'
            point = 'more'
            break;
          default:
            filename = '偏低'
            color = 'blue'
            point = 'low'
            break;
        }
        return {
          filename: filename,
          color: color,
          point: point
        }
      },
      initChart: function (options) {
        var chart = document.getElementById('mychart');
        var myChart = echarts.init(chart);
        myChart.setOption(options);
      }
    },
    computed: {
      options: function () {
        return {
          animation: true,
          grid: {
            left: 20,
            right: 20,
            x: 0,
            y: 10,
            containLabel: false
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'none'
            },
            textStyle: {
              fontSize: 14
            }
          },
          xAxis: {
            type: 'category',
            show: true,
            boundaryGap: false,
            data: this.dateX,
            splitLine: {
              show: true,
              lineStyle: {
                color: '#eee'
              }
            },
            axisLabel: {
              show: true,
              textStyle: {
                color: '#646464',
                align: 'center',
                fontSize: 14
              }
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#eee'
              }
            }
          },
          // dataZoom: [
          //     {
          //         type: 'inside',
          //         disabled: false,
          //         xAxisIndex: 0,
          //         start: 0,
          //         end: 50
          //     }
          // ],
          yAxis: {
            type: 'value',
            show: false,
            boundaryGap: false,
            splitLine: {
              show: true,
              lineStyle: {
                color: '#68717a'
              }
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: 'red'
              }
            },
            splitArea: {
              areaStyle: {
                color: 'red'
              }
            }
          },
          series: [{
            name: this.chartData.text,
            type: 'line',
            smooth: true,
            symbolSize: 10,
            // stack: '总数',
            data: this.chartData.Data,
            areaStyle: {
              normal: {
                color: ['rgba(186, 232, 222, 0.8)'],
                width: 4
              }
            },
            itemStyle: {
              normal: {
                borderWidth: 2,
                lineStyle: {
                  width: 2
                }
              }
            }
          }],
          color: ['#1AB394', '#17dee1']
        };
      }
    }
  })
})
