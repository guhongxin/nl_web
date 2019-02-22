$(document).ready(function () {
  var text_l = ['体重', 'BMI', '脂肪', '肌肉', '水分', '蛋白质', '皮下脂肪', '内脏脂肪', '骨量', '基础代谢', '身体年龄', '静态心率']
  function pieer(text_list, source) {
    var winwidth = window.innerWidth
    var d_width = winwidth < 375 ? winwidth : 375	// 画布大小
    var viewboxwid = winwidth / 375
    var trasx = (winwidth - 375) / 2
    var d_hlaf = d_width / 2 // 一半
    var circle_r = 103
    var line_color = "#F0F0F0"
    var line_num = text_list.length
    var rotate_one = 360 / line_num
    var source = source
    var sourcelength = String(source).length
    var sourcetext = '综合评分'
    var text_list = text_list
    function fontalign(basefontsize, num) {
      var font_item = basefontsize, font_left = 0, num_length = String(num).length
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
    draw.transform({ scale: viewboxwid > 1.2 ? 1.2 : viewboxwid })
    $('#drawing').css({ width: d_width })
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
    console.log(line_num)
    for (var i = 0; i < line_num; i++) { // 外部文字和蜘蛛网线
      group.line(d_hlaf, d_hlaf - circle_r, d_hlaf, d_hlaf + circle_r).stroke({ width: 1, color: line_color }).transform({ rotation: rotate_one * i })
      // group.text('体重').rotate(rotate_one * i, d_hlaf, d_hlaf)
      var fontitem = text_list[i]
      var xi = d_hlaf + (circle_r + 30) * Math.cos(rad(i * rotate_one - 90)) // 计算每个文字的坐标x
      var yi = d_hlaf + (circle_r + 30) * Math.sin(rad(i * rotate_one - 90)) // 计算每个文字的坐标y
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
      var r = Math.floor(Math.random() * (circle_r - min + 1) + min)
      var mindleMin = (circle_r - min) / 3 // 正常最小值  = mindleMin + min
      var mindleMax = (mindleMin * 2) + min // 正常最大值
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
    polygon.animate(800).plot(linearr)
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
  pieer(text_l, 23.6)
})