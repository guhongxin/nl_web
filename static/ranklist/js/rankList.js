// import { setInterval } from "timers";
$(document).ready(function() {
  function haveHttps() {
    if (window.location.protocol == 'https:') {
      return true
    } else {
      return false
    }
  }
  function Methods() {
    this.description = '工具类'
  }
  $.extend(Methods.prototype, {
    _ajax: function(type, data, url, cb, cb1) {
      var self = this
      $.ajax({
        type: type,
        url: this.baseUrl + url,
        // url: this.baseUrl,
        data: data,
        success: cb,
        beforeSend: function(request) {
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
    }
  })
  var data = { per_page: 99, page: 1 }
  var numDay = 1
  var numWeek = 1
  var numMonth = 1
  function rankControl() {
    // this.baseUrl = 'http://www.nlfit.cn'
    this.baseUrl = '../..'
    // this.baseUrl = './1.json'
    this.$el = {
      rankTopDay: $('#rankTopDay'), // 入场记录LISTBOX
      rankTopWeek: $('#rankTopWeek'), // 出场记录LISTBOX
      rankTopMonth: $('#rankTopMonth'), // 总签到记录LISTBOX
      rankMonth: $('#rankMonth'), // 月签到记录LISTBOX
      rankWeek: $('#rankWeek'), // 周签到记录LISTBOX
      rankDay: $('#rankDay') // 周签到记录LISTBOX
    }
    this.itemType = 'rank_daily'
    this.inChart = ''
    this.rankUnit = {
      glod: 'img/gold.png',
      silver: 'img/silver.png',
      copper: 'img/copper.png'
    }
    Methods.call(this)
    this.init()
  }
  // rankControl.prototype = new Methods()
  // rankControl.prototype.constructor = rankControl
  var meth = new Methods()
  rankControl.prototype = meth
  rankControl.prototype.constructor = rankControl
  $.extend(rankControl.prototype, {
    // 页面初始化方法
    init: function() {
      this.getWeekDayData()
      this.getMonthRankData()
      this.getWeekRankData()
    },
    // 统一处理回调请求
    timeRepeat(func, self) {
      setTimeout(function () {
        func(self)
      }, 5000)
    },
    // 月数据
    getMonthRankData: function(self) {
      var self = self ?self:this
      self.rankmixajax('month', function(res) {
        var monthRankData = JSON.stringify(res)
        self.itemType = 'rank_month'
        sessionStorage.setItem('monthRankData', monthRankData)
        self.$el.rankMonth.html(self.formatOtherrank(res))
        self.$el.rankTopMonth.html(self.formatToprank('month', res))
        // self.timeRepeat(self.getMonthRankData, self)
      }, function(err) {
        var res = JSON.parse(sessionStorage.getItem('monthRankData'))
        self.$el.rankMonth.html(self.formatOtherrank(res))
        self.$el.rankTopMonth.html(self.formatToprank('month', res))
        // self.timeRepeat(self.getMonthRankData, self)
      })
    },
    // 周数据
    getWeekRankData: function(self) {
      var self = self ?self:this
      self.rankmixajax('week', function(res) {
        var rankWeekData = JSON.stringify(res)
        self.itemType = 'rank_week'
        sessionStorage.setItem('rankWeekData', rankWeekData)
        self.$el.rankWeek.html(self.formatOtherrank(res))
        self.$el.rankTopWeek.html(self.formatToprank('week', res))
        // self.timeRepeat(self.getWeekRankData, self)
      }, function(err) {
        var res = JSON.parse(sessionStorage.getItem('rankWeekData'))
        self.$el.rankWeek.html(self.formatOtherrank(res))
        self.$el.rankTopWeek.html(self.formatToprank('week', res))
        // self.timeRepeat(self.getWeekRankData, self)
      })
    },
    // 日数据
    getWeekDayData: function(self) {
      var self = self ?self:this
      self.rankmixajax('rank_daily', function(res) {
        var rankDayData = JSON.stringify(res)
        self.itemType = 'rank_daily'
        sessionStorage.setItem('rankDayData', rankDayData)
        self.$el.rankDay.html(self.formatOtherrank(res))
        self.$el.rankTopDay.html(self.formatToprank('day', res))
        // self.timeRepeat(self.getWeekDayData, self)
      }, function() {
        var res = JSON.parse(sessionStorage.getItem('rankDayData'))
        self.$el.rankDay.html(self.formatOtherrank(res))
        self.$el.rankTopDay.html(self.formatToprank('day', res))
        // self.timeRepeat(self.getWeekDayData, self)
      })
    },
    // 加载日数据
    appendWeekDayData: function () {
      var self = this
      this.rankmixajax('rank_daily', function (res) {
        // sessionStorage.setItem('appendRankDayData', appendRankDayData)
        self.$el.rankDay.append(self.formatOtherrank(res))
        sessionStorage.setItem('appendRankDayData', self.$el.rankDay.html())
      }, function(err) {
        // var res = JSON.parse(sessionStorage.getItem('appendRankDayData'))
        // self.$el.rankDay.append(self.formatOtherrank(res))
        var res = sessionStorage.getItem('appendRankDayData')
        self.$el.rankDay.html(res)
      })
    },
    // 加载周数据
    appendWeekRankData: function () {
      var self = this
      this.rankmixajax('week', function (res) {
        // sessionStorage.setItem('appendRankWeekData', appendRankWeekData)
        self.$el.rankWeek.append(self.formatOtherrank(res))
        sessionStorage.setItem('appendRankWeekData', self.$el.rankWeek.html())
      }, function(err) {
        // var res = JSON.parse(sessionStorage.getItem('appendRankWeekData'))
        // self.$el.rankWeek.append(self.formatOtherrank(res))
        var res = sessionStorage.getItem('appendRankWeekData')
        self.$el.rankWeek.html(res)
      })
    },
    // 加载月数据
    appendMonthRankData: function () {
      var self = this
      this.rankmixajax('month', function (res) {
        self.$el.rankMonth.append(self.formatOtherrank(res))
        sessionStorage.setItem('appendRankMonthData', self.$el.rankMonth.html())
      }, function (err) {
        // var res = JSON.parse(sessionStorage.getItem('appendRankMonthData'))
        // self.$el.rankMonth.append(self.formatOtherrank(res))
        var res = sessionStorage.getItem('appendRankMonthData')
        self.$el.rankMonth.html(res)
      })
    },
    // 排行混合请求
    rankmixajax(type, cb, cb1) {
      var typedata = ''
      switch (type) {
        case 'rank_daily':
          typedata = 'rank_daily'
          break
        case 'week':
          typedata = 'rank_week'
          break
        case 'month':
          typedata = 'rank_month'
          break
      }
      this.itemType = typedata
      this._ajax('get', data, '/v1/gym/sports/' + typedata, cb, cb1)
    },
    formatOtherrank(res) {
      var templateList = ''
      var item = ''
      var name = ''
      var rank = 1
      var headIcon = ''
      var calorie = ''
      var calorie_sec = ''
      if (res) {
        if (res.data) {
          if (res.data.rank_info && res.data.rank_info.length !== 0) {
            if (res.data.rank_info.length > 3 & data.page === 1) {
              for (var i = 3; i < res.data.rank_info.length; i++) {
                item = res.data.rank_info[i]
                name = item.name ? item.name : '-'
                rank = item.rank
                headIcon = item.head_portrait
                calorie = item.calorie.toFixed(0)
                calorie_sec = (item.calorie_sec / 60).toFixed(0)
                templateList += this.baseTemplte(calorie, headIcon, calorie_sec, name, rank)
              }
            } else if (res.data.rank_info.length > 3 & data.page > 1) {
              for (var j = 0; j < res.data.rank_info.length; j++) {
                item = res.data.rank_info[j]
                name = item.name ? item.name : '-'
                rank = item.rank
                headIcon = item.head_portrait
                calorie = item.calorie.toFixed(0)
                calorie_sec = (item.calorie_sec / 60).toFixed(0)
                templateList += this.baseTemplte(calorie, headIcon, calorie_sec, name, rank)
              }
            }
            return templateList
          }
        }
      }
    },
    baseTemplte: function(calorie, headIcon, calorie_sec, name, rank) {
      var currentClass = ''
      if (this.itemType == 'rank_daily') {currentClass = 'bgreat1'}
      if (this.itemType == 'rank_week') {currentClass = 'bgreat2'}
      if (this.itemType == 'rank_month') {currentClass = 'bgreat3'}
      var icon = this.isHttps(headIcon)
      var tem = ` <li>
                    <i class="bgreat ${currentClass}"></i>
                    <div class="otherfont">${rank + ((data.page - 1) * data.per_page)}</div>
                    <div class="tableicon">
                        <img src="${icon ? icon : '../superscreen/img/rentou.png'}" alt="HEAD">
                    </div>
                    <div class="tablenam">${name}</div>
                    <div class="tablekcal">${calorie}
                        <span>大卡</span>
                    </div>
                    <div class="tablekcal">${calorie_sec}
                        <span>分钟</span>
                    </div>
                </li>`
      return tem
    },
    isHttps: function(icon) {
      if (icon) {
        if (icon.indexOf('http') < 0) {
          return
        }
        if (icon) {
          if (window.location.protocol.split(':')[0] === 'https') {
            return 'https:' + icon.split(':')[1]
          }
        }
      }
      return icon
    },
    // top前3名
    formatToprank(type, res) {
      // 榜单列表长度大于等于3
      if (res) {
        if (res.data) {
          if (res.data.rank_info && res.data.rank_info.length >= 3) {
            for (var i = 0; i < 3; i++) {
              var item = res.data.rank_info[i]
              this.listShow(type, item)
            }
          } else if (res.data.rank_info.length !== 0 & res.data.rank_info.length < 3) { // 榜单列表数大于0小于3
            for (var i = 0; i < res.data.rank_info.length; i++) {
              var item = res.data.rank_info[i]
              this.listShow(type, item)
            }
          } else {
            $('.headiconone img').attr('src', '../superscreen/img/rentou.png')
          }
        }
      }
    },
    listShow(type,item) {
      var name = item.name ? item.name : '-'
      var rank = item.rank
      var headIcon = item.head_portrait ? this.isHttps(item.head_portrait): '../superscreen/img/rentou.png'
      var calorie = item.calorie.toFixed(0)
      var calorie_sec = (item.calorie_sec / 60).toFixed(0)
      if (type === 'day' & rank === 1) {
        $('#rankTopDay .item2').find('.headtext').text(name)
        $('#rankTopDay .item2').find('.rl .headfootnum').text(calorie)
        $('#rankTopDay .item2').find('.rr .headfootnum').text(calorie_sec)
        $('#rankTopDay .item2').find('.headiconone img').attr('src', headIcon)
      } else if (type === 'day' & rank === 2) {
        $('#rankTopDay .item1').find('.headtext').text(name)
        $('#rankTopDay .item1').find('.rl .headfootnum').text(calorie)
        $('#rankTopDay .item1').find('.rr .headfootnum').text(calorie_sec)
        $('#rankTopDay .item1').find('.headiconone img').attr('src', headIcon)
      } else if (type === 'day' & rank === 3) {
        $('#rankTopDay .item3').find('.headtext').text(name)
        $('#rankTopDay .item3').find('.rl .headfootnum').text(calorie)
        $('#rankTopDay .item3').find('.rr .headfootnum').text(calorie_sec)
        $('#rankTopDay .item3').find('.headiconone img').attr('src', headIcon)
      }
      if (type === 'week' & rank === 1) {
        $('#rankTopWeek .item5').find('.headtext').text(name)
        $('#rankTopWeek .item5').find('.rl .headfootnum').text(calorie)
        $('#rankTopWeek .item5').find('.rr .headfootnum').text(calorie_sec)
        $('#rankTopWeek .item5').find('.headiconone img').attr('src', headIcon)
      } else if (type === 'week' & rank === 2) {
        $('#rankTopWeek .item4').find('.headtext').text(name)
        $('#rankTopWeek .item4').find('.rl .headfootnum').text(calorie)
        $('#rankTopWeek .item4').find('.rr .headfootnum').text(calorie_sec)
        $('#rankTopWeek .item4').find('.headiconone img').attr('src', headIcon)
      } else if (type === 'week' & rank === 3) {
        $('#rankTopWeek .item6').find('.headtext').text(name)
        $('#rankTopWeek .item6').find('.rl .headfootnum').text(calorie)
        $('#rankTopWeek .item6').find('.rr .headfootnum').text(calorie_sec)
        $('#rankTopWeek .item6').find('.headiconone img').attr('src', headIcon)
      }
      if (type === 'month' & rank === 1) {
        $('#rankTopMonth .item8').find('.headtext').text(name)
        $('#rankTopMonth .item8').find('.rl .headfootnum').text(calorie)
        $('#rankTopMonth .item8').find('.rr .headfootnum').text(calorie_sec)
        $('#rankTopMonth .item8').find('.headiconone img').attr('src', headIcon)
      } else if (type === 'month' & rank === 2) {
        $('#rankTopMonth .item7').find('.headtext').text(name)
        $('#rankTopMonth .item7').find('.rl .headfootnum').text(calorie)
        $('#rankTopMonth .item7').find('.rr .headfootnum').text(calorie_sec)
        $('#rankTopMonth .item7').find('.headiconone img').attr('src', headIcon)
      } else if (type === 'month' & rank === 3) {
        $('#rankTopMonth .item9').find('.headtext').text(name)
        $('#rankTopMonth .item9').find('.rl .headfootnum').text(calorie)
        $('#rankTopMonth .item9').find('.rr .headfootnum').text(calorie_sec)
        $('#rankTopMonth .item9').find('.headiconone img').attr('src', headIcon)
      }
    }
  })
  var s = new rankControl()
  var weekDayper_page  = 1 //初始日每页基数
  var WeekRankper_page  = 1 //初始周每页基数
  var weekMonthper_page  = 1 //初始月每页基数

  var rankMonthSetInter = null 
  var rankWeekSetInter  = null 
  var rankDaySetInter  = null
  var rankMonthHt = 0 
  var rankWeekHt  = 0 
  var rankDayHt  = 0
  // 定时器
  setInterval(function() {
    scrollInit('#rankMonth', '#rankMonthRank')
    scrollInit('#rankWeek', '#rankWeekRank')
    scrollInit('#rankDay', '#rankDayRank')
  }, 4000)
  function scrollInit( doc1, doc2) {
    var rankHt  = $(doc1).height()
    var parentNodeHt = $(doc2).height()
    if( rankHt <= parentNodeHt ) {
      return
    }
    var maxNub = Math.floor(parentNodeHt/94) //最多能容纳多少行
    var nub = Math.ceil(rankHt/94)
    for (var i=0; i< nub - maxNub + 1; i++){
      // if (i === nub - 4){
      //   $(doc2).scrollTop(0)
      //   for (var j=0;j<5000;j++){}
      //   return
      // } 
      scrollToLocation(doc2, 94, i)
    }
  }
  function scrollToLocation(doc, space, Numb) {
    $(doc).animate({
	    scrollTop: space*Numb
	  }, 2000);//2秒滑动到指定位置
  }
  $('#rankDay').hover(function () {
  
  
  },function(){

  })
  $('#rankWeek').hover(function () {
  
  },function() {

  })
  $('#rankMonth').hover(function () {
   
  },function() {
   
  })
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
      webSocketLink.onopen = function (res) {
        // 已经建立连接
        self.recvHeart = true;
        self.open(res);

      }
      webSocketLink.onclose = function (res) {
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
      webSocketLink.onmessage = function (res) {
        // 收到服务器消息，使用res.data提取
        // console.log(res.data)
        self.message(res, self)
      }
      webSocketLink.onerror = function (evt) {
        // 产生异常
        console.log('websocket产生异常')
        self.reconnect()
        console.log(evt)
        setInterval(function () {
          s.init()
        }, 600000)
      }
    },
    open: function (params) {
      this.heartCheck()
    },
    close: function (params) {
      this.reconnect()
    },
    message: function (params, self) {
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
    success: function (params) {
      if (params.Msg) {
        if (params.Msg.Type == 1) {
          if (params.Msg.Data == 1) {
            // 日榜单
            s.getWeekDayData()
          } else if (params.Msg.Data == 2) {
            // 周榜单
            s.getWeekRankData()
          } else if (params.Msg.Data == 4) {
            // 月榜单
            s.getMonthRankData()
          }
        }
      }
    },
    satusRe: function (status) {
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
    reconnect: function (params) {
      var self = this;
      if (self.lockReconnect) { return }
      self.lockReconnect = true
      // 没链接上会一直重连，设置延迟避免请求过多
      self.tt && clearTimeout(self.tt)
      self.tt = setTimeout(function () {
        self.initSocket()
        self.lockReconnect = false
      }, 4000)
    },
    heartCheck: function () {
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
/*   var weekTimer = setInterval(function () {
    s.getWeekRankData()
  }, 10000)
  var monthTimer = setInterval(function () {
    s.getMonthRankData()
  }, 10000) */
  // 滚动加载
  // $('#rankDay').scroll(function () {
  //   var self = this
  //   scrollLoad(self, 'daliy')
  // });
  // $('#rankWeek').scroll(function () {
  //   var self = this
  //   scrollLoad(self, 'week')
  // });
  // $('#rankMonth').scroll(function () {
  //   var self = this
  //   scrollLoad(self, 'month')
  // });
  // 清除定时器
  /* $('#rankDay').mouseover(function () {
    clearInterval(dayTimer)
  })
  $('#rankWeek').mouseover(function () {
    clearInterval(weekTimer)
  })
  $('#rankMonth').mouseover(function () {
    clearInterval(monthTimer)
  })
  // 开启定时器
  $('#rankDay').mouseout(function () {
    dayTimer = setInterval(function () {
      s.getWeekDayData()
    }, 10000)
  })
  $('#rankWeek').mouseout(function () {
    weekTimer = setInterval(function () {
      s.getWeekRankData()
    }, 10000)
  })
  $('#rankMonth').mouseout(function () {
    monthTimer = setInterval(function () {
      s.getMonthRankData()
    }, 10000)
  })

  function scrollLoad(self, type) {
    var sheight = $(self)[0].scrollHeight
    var top = $(self)[0].scrollTop
    var height = $(self).height()
    var IntP = Math.ceil(top + height)
    
    if (IntP === sheight) {
      console.log('到底了')
      if (type == 'daliy') {
        weekDayper_page = weekDayper_page + 1
        data = {
          per_page: 10,
          page: weekDayper_page
        }
        s.appendWeekDayData()
      }
      if (type == 'week') {
        WeekRankper_page  = WeekRankper_page + 1
        data = {
          per_page: 10,
          page: WeekRankper_page
        }
        s.appendWeekRankData()
      }
      if (type == 'month') {
        weekMonthper_page = weekMonthper_page + 1
        data = {
          per_page: 10,
          page: weekMonthper_page
        }
        s.appendMonthRankData()
      }
    }
  } */
})

