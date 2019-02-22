$(document).ready(function() {
  /* 获取url参数 */
  function haveHttps() {
    if(window.location.protocol == 'https:') {
      return true
    } else {
      return false
    }
  }
  /* 工具方法库 */
  function Methods() {
    this.description = '工具类'
  }
  $.extend(Methods.prototype, {
    _ajax: function(type, data, url, cb, cb1) {
      var self = this
      $.ajax({
        type: type,
        url: this.baseUrl + url,
        data: data,
        success: cb,
        beforeSend: function(request) {
          // var token = self.getCookie('Admin-Token')
          var token = self.getCookie('Admin-Token')
          request.setRequestHeader('Authorization', 'Bearer ' + token)
        },
        error: cb1
      })
    },
    getCookie: function(name) {
      /* var arr = ''
      var reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
      if (arr = document.cookie.match(reg)) {
        return unescape(arr[2])
      } else { return null } */
      return sessionStorage.getItem(name) ? sessionStorage.getItem(name) : localStorage.getItem(name) 
    },
    parseTime: function(time, cFormat) {
      if (arguments.length === 0) {
        return null
      }
      var format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
      var date
      if (typeof time === 'object') {
        date = time
      } else {
        if (('' + time).length === 10) time = parseInt(time) * 1000
        date = new Date(time)
      }
      var formatObj = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay()
      }
      var time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, function(result, key) {
        var value = formatObj[key]
        if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
        if (result.length > 0 && value < 10) {
          value = '0' + value
        }
        return value || 0
      })
      return time_str
    }
  })

  /* 页面逻辑方法 */
  function superControl() {
    // this.baseUrl = 'https://www.nlfit.cn'
    this.baseUrl = '../..'
    this.$el = {
      inGym: $('#inGym'), // 入场记录LISTBOX
      outGym: $('#outGym'), // 出场记录LISTBOX
      rankAll: $('#rankAll'), // 总签到记录LISTBOX
      rankMonth: $('#rankMonth'), // 月签到记录LISTBOX
      rankWeek: $('#rankWeek'), // 周签到记录LISTBOX
      charts: document.getElementById('inChart')
    }
    this.inChart = ''
    this.rankUnit = {
      glod: 'img/gold.png',
      silver: 'img/silver.png',
      copper: 'img/copper.png'
    }
    Methods.call(this)
    this.init()
  }
  var meth = new Methods()
  superControl.prototype = meth
  superControl.prototype.constructor = superControl
  $.extend(superControl.prototype, {
    // 页面初始化方法
    init: function() {
      this.getsingIn()
      this.getsingOut()
      this.getTodayIn()
      this.inChart = echarts.init(this.$el.charts)
      var self = this
      window.addEventListener('resize', function() {
        self.inChart.resize()
      })
      this.getAllRankData()
      this.getMonthRankData()
      this.getWeekRankData()
    },
    wrap: function() {
      this.getsingIn()
      this.getsingOut()
      this.getTodayIn()
    },
    // 统一处理回调请求
    // timeRepeat(func, self) {
    //   setTimeout(function() {
    //     func(self)
    //   }, 1000)
    // },
    // 获取入场签到数据
    getsingIn: function(self) {
      var self = self ? self : this
      self.mixajax(0, function(res) {
        var super_inGym = JSON.stringify(res)
        sessionStorage.setItem('super_inGym', super_inGym)
        self.$el.inGym.html(self.formatsign(res, 'created_at'))
        // self.timeRepeat(self.getsingIn, self)
      }, function(err) {
        var res = JSON.parse(sessionStorage.getItem('super_inGym')) 
        self.$el.inGym.html(self.formatsign(res, 'created_at'))
        // self.timeRepeat(self.getsingIn, self)
      })
    },
    // 获取出场签到数据
    getsingOut: function (self) {
      var self = self ? self : this
      self.mixajax(1, function(res) {
        var super_outGym = JSON.stringify(res)
        sessionStorage.setItem('super_outGym', super_outGym)
        self.$el.outGym.html(self.formatsign(res, 'out_date'))
        // self.timeRepeat(self.getsingOut, self)
      }, function(err) {
        var res  = JSON.parse(sessionStorage.getItem('super_outGym'))
        self.$el.outGym.html(self.formatsign(res, 'out_date'))
        // self.timeRepeat(self.getsingOut, self)
      })
    },
    formatsign(res, date) {
      var templateList = ''
      if(res) {
        for (var i = 0; i < res.length; i++) {
          var item = res[i]
          var itemTime = this.parseTime(new Date(item[date]).getTime(), '{h}:{i}')
          var headIcon = item.customer ? item.customer.head_portrait ? item.customer.head_portrait : 'img/rentou.png' : ''
          var seximg = item.customer ? item.customer.sex === 1 ? 'img/male.svg' : 'img/female.svg' : ''
          var name = item.customer ? item.customer.name : ''
          var cardname = item.customervip ? item.customervip.card_name : '-'
          templateList += this.baseTemplte(itemTime, headIcon, seximg, name, cardname)
        }
      }
      return templateList
    },
    // 获取今日入场折线图数据
    getTodayIn: function(self) {
      var self = self ? self : this
      self._ajax('get', undefined, '/v1/gym/sign/enter', function(res) {
        var super_PolyLine = JSON.stringify(res)
        sessionStorage.setItem('super_PolyLine', super_PolyLine)
        var time = []
        var num = []
        for (var i = 0; i < res.length; i++) {
          time.push(res[i].hours)
          num.push(res[i].num)
        }
        self.initCharts(num, time)
        // self.timeRepeat(self.getTodayIn, self)
      }, function(err) {
        var res = JSON.parse(sessionStorage.getItem('super_PolyLine'))
        var time = []
        var num = []
        if (res) {
          for (var i = 0; i < res.length; i++) {
            time.push(res[i].hours)
            num.push(res[i].num)
          }
        }
        self.initCharts(num, time)
        // self.timeRepeat(self.getTodayIn, self)
      })
    },
    baseTemplte: function(itemTime, headIcon, seximg, name, cardname) {
      var tem = `<div class="box">
                  <div class="row">
                    <div class="imgPosition">
                      <div class="headimg">
                        <img src="${headIcon}" alt="" onclick="bigImg(event)"/>
                      </div>
                      <span class="sex">
                        <img src="${seximg}" alt="">
                      </span>
                    </div>
                    <div class="col-6">
                      <div class="top-name">
                        <span>${name}</span>
                      </div>
                      <div class="top-phone">卡种：
                        <span>${cardname}</span>
                      </div>
                    </div>
                    <div class="col-2">
                      <span>${itemTime}</span>
                    </div>
                  </div>
                </div>`
      return tem
    },
    // 签到混合请求
    mixajax(num, cb, cb1) {
      this._ajax('get', { status: num }, '/v1/gym/sign/record', cb, cb1)
    },
    // 总排行数据
    getAllRankData: function() {
      var self = this
      this.rankmixajax('all', function(res) {
        var super_rankAll = JSON.stringify(res)
        sessionStorage.setItem('super_rankAll', super_rankAll)
        self.$el.rankAll.html(self.formatAllrank(res))
      }, function(err) {
        var res = JSON.parse(sessionStorage.getItem('super_rankAll'))
        self.$el.rankAll.html(self.formatAllrank(res))
      })
    },
    // 格式化总排行数据
    formatAllrank(res) {
      var ranklistdata = ''
      if(res) {
        for (var i = 0; i < res.length; i++) {
          var headicon = res[i].head_portrait ? res[i].head_portrait : 'img/rentou.png'
          var name = res[i].name
          var signcount = res[i].sign_count
          ranklistdata += this.rankBaseTemplte(headicon, name, signcount, i)
        }
      }
      return ranklistdata
    },
    // 月数据
    getMonthRankData: function() {
      var self = this
      this.rankmixajax('month', function(res) {
        var super_rankMonth = JSON.stringify(res)
        sessionStorage.setItem('super_rankMonth', super_rankMonth)
        self.$el.rankMonth.html(self.formatOtherrank(res))
      }, function(err){
        var res = JSON.parse(sessionStorage.getItem('super_rankMonth'))
        self.$el.rankMonth.html(self.formatOtherrank(res))
      })
    },
    // 周数据
    getWeekRankData: function() {
      var self = this
      this.rankmixajax('week', function(res) {
        var super_rankWeek = JSON.stringify(res)
        sessionStorage.setItem('super_rankWeek', super_rankWeek)
        self.$el.rankWeek.html(self.formatOtherrank(res))
      }, function(err) {
        var res = JSON.parse(sessionStorage.getItem('super_rankWeek'))
        self.$el.rankWeek.html(self.formatOtherrank(res))
      })
    },
    // 格式化其他排行数据
    formatOtherrank(res) {
      var ranklistdata = ''
      if (res) {
        for (var i = 0; i < res.length; i++) {
          if (res[i].customer){
            var headicon = res[i].customer.head_portrait ? res[i].customer.head_portrait : 'img/rentou.png'
            var name = res[i].customer.name
            var signcount = res[i].sign_count
            ranklistdata += this.rankBaseTemplte(headicon, name, signcount, i)
          }
        }
      }
      return ranklistdata
    },
    // 排行混合请求
    rankmixajax(type, cb, cb1) {
      var typedata = ''
      switch (type) {
        case 'all':
          typedata = 'rank_all'
          break
        case 'month':
          typedata = 'rank_month'
          break
        case 'week':
          typedata = 'rank_week'
          break
      }
      this._ajax('get', undefined, '/v1/gym/sign/' + typedata, cb, cb1)
    },
    rankBaseTemplte: function(headicon, name, signcount, i) {
      var brand = ''
      switch (i) {
        case 0:
          brand = `<span class="rank-medal">
                    <img src="${this.rankUnit.glod}" alt="">
                  </span>`
          break
        case 1:
          brand = `<span class="rank-medal">
                    <img src="${this.rankUnit.silver}" alt="">
                  </span>`
          break
        case 2:
          brand = `<span class="rank-medal">
                    <img src="${this.rankUnit.copper}" alt="">
                  </span>`
          break
        default:
          brand = `<span>${i + 1}</span>`
          break
      }
      var tem = `<div class="box">
                  <div class="row">
                    <div class="imgPosition">
                      <div class="headimg">
                        <img src="${headicon}" alt="" onclick="bigImg(event)"/>
                      </div>
                    </div>
                    <div class="col-6">
                      <div class="top-name">
                        <span>${name}</span>
                      </div>
                      <div class="top-phone">签到：<span>${signcount}</span>次</div>
                    </div>
                    <div class="col-2">
                      ${brand}
                    </div>
                  </div>
                </div>`
      return tem
    },
    initCharts: function(num, time) {
      var option = {
        title: {
          show: false
        },
        grid: {
          left: '40px',
          top: '25px',
          right: '60px',
          containLabel: true
        },
        tooltip: {
          axisPointer: {
            type: 'shadow'
          },
          trigger: 'axis',
          formatter: function(params) {
            var a = params[0].data ? params[0].data:0
            var res = '<b style="font-size:20px;font-weight:550;">' + a +'</b>人入场<br/>'
            // res += today_day + '&nbsp;' + params[0].name
            res += params[0].name
            return res
          }
        },
        calculable: true,
        yAxis: [
          {
            name: '人数',
            type: 'value',
            nameTextStyle: {
              color: '#fff',
            },
            minInterval: 1,
            axisLabel: {
              textStyle: {
                color: '#fff', // 坐标值得具体的颜色
              }
            },
            nameLocation: 'end',
            nameGap: 9,
          }
        ],
        xAxis: [
          {
            boundaryGap: false,
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
            // data:  ["07:00","08:00","09:00","10:00","11:00","12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00"]
            data: time
          }
        ],
        series: [
          {
            name: '人数',
            type: 'line',
            data: num,
            stack: '人数',
            symbol: 'circle',
            symbolSize: 16,
            itemStyle: {
              normal: {
                barBorderRadius: 25,
                barBorderColor: 'transparent',
                lineStyle: {
                  width: 4,
                  // shadowColor: 'rgba(0,0,0,0.4)',
                  shadowBlur: 5,
                  shadowOffsetY: 5
                }
              }
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: 'rgba(35, 198, 200, 0.4)'
                }, {
                  offset: 1,
                    color: 'rgba(35, 198, 200, 0.1)'
                }])
              }
            },
          }
        ],
        color: ['#23C6C8']
      }
      this.inChart.setOption(option)
    }
  })

  var a = new superControl()
  /* setInterval(function() {
    a.wrap()
  }, 1000) */

 /* websocket */
  function Scoket() {
    this.loacal = window.location.hostname
    this.whows = haveHttps() ? 'wss' : 'ws'
    // this.loacal = '192.168.1.250:18887'
    this.gymid = meth.getCookie('SET_GYM_ID')
    this.token = meth.getCookie('Admin-Token')
    this.lockReconnect = false // 避免重复连接
    this.tt = undefined
    this.heartbeat_interval = 50000 // 心跳时间
    this.recvHeart = true
    this.ws = null // websocket实例
    this.date = new Date().getTime()
    this.initSocket()
  }
  $.extend(Scoket.prototype, {
    initSocket: function () {
      var self = this
      var webSocketLink = new WebSocket(self.whows + '://' + this.loacal + '/saas/push/listen?gym_id=' + this.gymid + '&token=' + this.token)
      self.ws = webSocketLink
      var saty = this.satusRe(webSocketLink.readyState)
      if (saty == 'link') {
      }
      if (saty == 'close') {
      }
      webSocketLink.onopen = function(res) {
        // 已经建立连接
        self.recvHeart = true;
        self.open(res);

      }
      webSocketLink.onclose = function(res) {
        console.log((new Date().getTime() - self.date) / 1000)
        self.date = new Date().getTime()
        if (self.heartbeat_tm) {
          clearTimeout(self.heartbeat_tm);
          self.heartbeat_tm = null;
        }
        // 已经关闭连接
        console.log('websocket链接关闭')
        self.close(res)
      }
      webSocketLink.onmessage = function(res) {
        // 收到服务器消息，使用res.data提取
        // console.log(res.data)
        self.message(res, self)
      }
      webSocketLink.onerror = function(evt) {
        // 产生异常
        console.log('websocket产生异常')
        self.reconnect()
        console.log(evt)
        setInterval(function () {
          a.wrap()
        }, 600000)
      }
    },
    open: function(params) {
      this.heartCheck()
    },
    close: function(params) {
      this.reconnect()
    },
    message: function(params, self) {
      if (params.data) {
        var info = JSON.parse(params.data)
        switch (info.Code) {
          case 0:
            self.success(info)
            break;
          case -1:
            console.error(info)
            break;
          case 1:
            alert('鉴权失败，请关闭页面重新登录saas平台')
            break;
          case 10:
            alert('建立的连接太多了, 建议关闭一些页面')
            break;
          default:
            break;
        }
      } else {
        self.recvHeart = true;
      }
    },
    success: function(params) {
      if (params.Msg) {
        if (params.Msg.Type == 2) {
          if (params.Msg.Data & 1 > 0) { // Data = 5进场
            // 进场请求
            a.getsingIn()
          }
          if (params.Msg.Data == 2) { // Data = 2出场
            // 出场请求
            a.getsingOut()
          }
          if (params.Msg.Data & 4 > 0)  {
            // 折线图
            a.getTodayIn()
          }
        }
      }
    },
    satusRe: function(status) {
      console.log(status)
      switch (status) {
        case 1:
          console.info('成功链接')
          break;
        case 2:
          console.info('通过关闭握手，正在关闭连接')
          break;
        case 3:
          console.info('连接已经关闭或无法打开')
          break;
        default:
          return false
      }
    },
    reconnect: function(params) {
      var self = this;
      if (self.lockReconnect) { return }
      self.lockReconnect = true
      // 没链接上会一直重连，设置延迟避免请求过多
      self.tt && clearTimeout(self.tt)
      self.tt = setTimeout(function() {
        self.initSocket()
        self.lockReconnect = false
      }, 4000)
    },
    heartCheck: function() {
      var self = this
      if (!self.recvHeart) {
        self.ws.close();
        return;
      }
      self.recvHeart = false;
        //这里发送一个心跳，后端收到后，返回一个心跳消息，
        self.ws.send("")
        self.heartbeat_tm = setTimeout(function () {
           self.heartCheck();
        }, self.heartbeat_interval);
    }
  })
  new Scoket()
})
function bigImg(ele) {
  var url = event.target.getAttribute('src')
  var text = "<div style='position: fixed; top:0; left:0; right:0; bottom:0;z-index:1002;background-color: rgba(0,0,0,0.7);' onclick='javascript:try{this.parentNode.removeNode(this)} catch (err) {this.parentNode.remove(this)}'><img src=" + url + " style='max-width: 700px;margin: 10% auto 0 auto;display: block;' /></div>"
  var other = document.createElement('span')
  other.innerHTML = text
  try {
    document.body.appendChild(other)
  } catch (err) {
    document.body.append(other)
  }
}