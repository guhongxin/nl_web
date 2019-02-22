$(function () {
  if (!getQueryString('token') || !getQueryString('uid')) {
    alert('未获取到url参数')
    return
  }
  $.ajax({
    type: 'POST',
    url: BASE_HEAD_URL + '/web_proxy/MainTrendShare',
    data: {
      "token": getQueryString('token')
    },
    success: function (res) {
      if (res.code == 0) {
        $('.add-follow').attr("href","javascript:testApp('niulangsport://com.yesfeeling.niulangsport/personDetails?uid="+ getQueryString('uid') +"')");
        renderData(res.data);
        /* 底部分享 个人详情 */
        $('#shareUsername').text(res.data.ownUserInfoRsp.user_info.nick);
        $('#shareUserAvatar').attr('src', res.data.ownUserInfoRsp.user_info.head_url)
      }
    }
  })

  /* 操作数据 渲染 */
  function renderData(res) {
    //console.log(res);
    /* 性别 */
    if (res.ownUserInfoRsp.user_info.sex == 1) {
      $('#userSex').removeClass('female').addClass('male');
    } else if (res.ownUserInfoRsp.user_info.sex == 2) {
      $('#userSex').removeClass('male').addClass('female');
    }
    /* 修改用户信息 */
    if (res.userBackgroundRsp.background && res.userBackgroundRsp.background != '') {
      $('#bigestBackground').css({
        'background': 'url("' + res.userBackgroundRsp.background + '") center no-repeat',
        'backgroundSize': '100%'
      })
    }
    $('#userName').text(res.ownUserInfoRsp.user_info.nick);
    /*name*/
    $('#userAddress').text(res.ownUserInfoRsp.user_info.address);
    /*address*/
    $('#uidCode').text('ID: ' + res.ownUserInfoRsp.user_info.uid);
    /*uidCode*/
    $('#userAvatar').attr('src', res.ownUserInfoRsp.user_info.head_url);
    /*logo*/
    /*简介*/
    if (!res.ownUserInfoRsp.user_info.user_signature || res.ownUserInfoRsp.user_info.user_signature == '') {
      $('#userSignature').text('这个人很懒，什么都没有留下~~');
    } else {
      $('#userSignature').text(res.data.ownUserInfoRsp.user_info.user_signature);
    }
    /* 关注 粉丝 动态数 */
    $('#numForArticle').text(res.ownUserInfoRsp.user_info.ext.article_num);
    $('#numForFans').text(res.ownUserInfoRsp.user_info.ext.fan_num);
    $('#numForFollow').text(res.ownUserInfoRsp.user_info.ext.follow_num);

    /* 健身日记 */
    var fitnessDiary = {};
    if (res.trendListRsp.details) {
      $.each(res.trendListRsp.details, function (i, v) {
        if (!fitnessDiary[getChangeData(v.trend.timestamp)]) {
          fitnessDiary[getChangeData(v.trend.timestamp)] = [];
        }
        fitnessDiary[getChangeData(v.trend.timestamp)].push(v);
      })
      var fitnessDiaryDetail = '', pictureList = '';
      $.each(fitnessDiary, function (i, v) {
        var everyDayDetail = '';
        /* 循环当天的 动态 */
        $.each(v, function (index, item) {
          var imgCon = '';
          /* 判断是图片还是视频 */
          if (item.trend.medias.medias[0].image) {
            imgCon = '<img src="' + item.trend.medias.medias[0].image.url + '">';
            pictureList += ('<li>' +
              '<img src="' + item.trend.medias.medias[0].image.url + '">' +
              '<span class="some-logo ' + (item.trend.medias.medias[0].video ? "video" : "picture") + '"></span></li>');
          } else {
            imgCon = '<br/>';
          }
          everyDayDetail +=
            ('<dd class="everyItem-content">' +
              '<span class="time">' + getChangeTime(item.trend.timestamp) + '</span>' +
              '<span class="light-dian"></span>' +
              '<div class="item-detail">' +
              '<p>' + item.trend.content.txt + '</p>' + imgCon +
              '<div>' +
              '<span class="zan-data flex-center">' +
              '<img src="img/detail/yizan@2x.png" alt="">' +
              '<span class="ligthgray-text">' + item.like_total + '</span>' +
              '</span>' +
              '<span class="ping-data flex-center">' +
              '<img src="img/detail/pinglunxiangqing@2x.png" alt="">' +
              '<span class="ligthgray-text">' + item.reply_total + '</span>' +
              '</span>' +
              '</div>' +
              '</div>' +
              '</dd>')
        })

        /* 每天的内容字符串拼接 */
        /* 判断今日、昨天 */
        var realTime = '';
        if (i == GetDateStr(-1)) {
          realTime = '昨天';
        } else if (i == GetDateStr(0)) {
          realTime = '今天';
        } else {
          realTime = i;
        }
        fitnessDiaryDetail +=
          ('<li>' +
            '<dl>' +
            '<dt class="everyItem-header">' + realTime + '</dt>' + everyDayDetail +
            '<dd class="everyItem-content">' +
            '<span class="time"></span>' +
            '<span class="light-dian"></span>' +
            '<div class="item-detail last-total">' + v.length + '条动态</div>' +
            '</dd>' +
            '</dl>' +
            '<div class="item-lightline"></div>' +
            '</li>');
      })
      $('#fitnessDiaryDetail').html(fitnessDiaryDetail);
      $('#pictureList').html(pictureList);
      getLine()
    } else {
      $('#fitnessDiaryDetail').html('<div class="empty-box">这个人很懒，什么都没有留下 ~ ~</div>');
      $('#pictureList').html('<div class="empty-box">这个人很懒，什么都没有留下 ~ ~</div>');
    }
  }

  /* 四舍五入 */
  function getTime(res) {
    return Math.round(res / 60)
  }

  /* 时间转换 */
  function add0(m) {
    return m < 10 ? '0' + m : m
  }

  // yyyy-mm-dd
  function getChangeData(data) {
    var time = new Date(data);
    var y = time.getFullYear();
    var m = time.getMonth() + 1;
    var d = time.getDate();
    return y + '-' + add0(m) + '-' + add0(d)
  }

  // hh-mm
  function getChangeTime(data) {
    var time = new Date(data);
    var y = time.getFullYear();
    var m = time.getMonth() + 1;
    var d = time.getDate();
    var h = time.getHours();
    var mm = time.getMinutes();
    var s = time.getSeconds();
    return add0(h) + ':' + add0(mm);
  }

  /* 获取时间 */

  /* -1 ， -2 */
  function GetDateStr(AddDayCount) {
    var dd = new Date();
    dd.setDate(dd.getDate() + AddDayCount);//获取AddDayCount天后的日期
    var y = dd.getFullYear();
    var m = dd.getMonth() + 1;//获取当前月份的日期
    m < 10 ? m = ('0' + m) : '';
    var d = dd.getDate();
    d < 10 ? d = ('0' + d) : ''
    return y + "-" + m + "-" + d;
  }

  /* 定位设置灰线 */
  function getLine() {
    $.each($('.everydata-list li'), function (i, v) {
      var everyItemContent = $(v).find('.everyItem-content');
      //console.log(everyItemContent);
      var itemHeigth = $(everyItemContent[0]).outerHeight();
      $(this).children('.item-lightline').css(
        'height', itemHeigth * (everyItemContent.length - 1) + 5 + 'px')
    })
  }

  window.onresize = function (ev) {
    getLine()
  }
})

/* 获取url参数 */
function getQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
}
