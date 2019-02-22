$(function () {
  if(!getQueryString('token') || !getQueryString('trendId') || !getQueryString('trendUid')){
    alert('未获取到url参数')
    return
  }

  /* 请求数据 必须为数字 */
  $.ajax({
    type: 'POST',
    url: BASE_HEAD_URL + '/web_proxy/TrendShare',
    data:{
      token: getQueryString('token'),
      trend_id: Number(getQueryString('trendId')),
      to_uid: Number(getQueryString('trendUid'))
    },
    success:function (res) {
      //console.log(res.data);
      if(res.code == 0){
        var APP_schema = "javascript:testApp('niulangsport://com.yesfeeling.niulangsport/communityDetails?trendId="+ getQueryString('trendId') + "&trendUid=" + res.data.trendInfoRsp.detail.trend.uid +"')"
        $('.add-follow').attr("href", APP_schema);
        $('.add-follow').click(function () {
          var d = new Date();
          var u = navigator.userAgent;
          var t0 = d.getTime();
          var down_url = 'http://android.myapp.com/myapp/detail.htm?apkName=com.yesfeeling.niulangsport&ADTAG=mobile';
          if(/MicroMessenger/gi.test(u)) {
            // 引导用户在浏览器中打开
            window.location.href = down_url;
            return;
          }
          if(openApp(APP_schema)) {
            openApp(APP_schema);
          }else {
            var delay = setInterval(function() {
              var d = new Date();
              var t1 = d.getTime();
              if (t1 - t0 < 3000 && t1 - t0 > 2000) {
                alert('请下载APP');
                window.location.href = down_url;
              }
              if (t1 - t0 >= 3000) {
                clearInterval(delay);
              }
            },3000)
          }
        })
        getCommunityInfo(res.data.trendInfoRsp.detail.trend.uid);
        renderData(res.data);
        $('#shareUsername').text(res.data.ownUserInfoRsp.user_info.nick);
        $('#shareUserAvatar').attr('src',res.data.ownUserInfoRsp.user_info.head_url);
      }
    }
  })

  /* 请求用户数据 */
  function getUserInfo(userList,replyList) {
    //console.log(userList);
    var user_list = '';
    for(var i = 0;i < userList.length;i++){
      user_list += userList[i]
      if(i !== (userList.length -1) ){
        user_list += ','
      }
    }
    $.ajax({
      type: 'POST',
      url: BASE_HEAD_URL + '/web_proxy/TrendShareGetUserInfo',
      data:{
        token: getQueryString('token'),
        user_list: user_list
      },
      success:function (res) {
        if(res.code == 0){
          var user_infos = res.data.user_infos;
          var replyContent = '';
          $.each(replyList, function (i,v) {
            var relayItem = '';
            if(v.replyto_id) {
              relayItem = '回复 <span class="hightlight">'+ (filterGetUserinfor(v.replyto_uid)?filterGetUserinfor(v.replyto_uid).nick:"--") +'</span>：';
            }
            replyContent +=
              ('<li>' +
                '<div class="base-info">' +
                '<img src="'+ (filterGetUserinfor(v.uid)?filterGetUserinfor(v.uid).head_url:"./img/avtor.jpg") +'" alt="">' +
                '<div>' +
                '<p>'+ (filterGetUserinfor(v.uid)?filterGetUserinfor(v.uid).nick:"") +'</p>' +
                '<p>'+ timeChange(v.timestamp) +'</p>' +
                '</div>' +
                '</div>' +
                '<div class="commont-text">'+ relayItem + v.content.text.txt + '</div>' +
                '</li>')
          })
          $('#replyContent').html(replyContent);
        }

        /* 筛选数组 获取用户信息 */
        function filterGetUserinfor(uid) {
          for(var i = 0;i < user_infos.length;i++){
            if(user_infos[i].uid == uid){
              return user_infos[i]
            }else {
              continue
            }
          }
        }
      }
    })
  }

  /* 操作数据 渲染 */
  function renderData(res) {
    /* 修改图片 */
    var detailImgList = '';
    if(res.trendInfoRsp.detail.trend.medias && res.trendInfoRsp.detail.trend.medias.medias) {
      $.each(res.trendInfoRsp.detail.trend.medias.medias, function (i,v) {
        if(v.video && v.video.url) {
          detailImgList += '<li style="width: 100%"><video class="video-box" poster="'+(v.image && v.image.url?v.image.url: '' )+'" controls="controls" src="'+ ( v.video.url ) +'">您的浏览器不支持 video 标签。</video></li>';
        }else if(v.image && v.image.url) {
          detailImgList += '<li class="img-item"><img class="item_img" src="'+ (v.image?v.image.url:'') +'" height="100%"></li>';
        }
      })
    }
    $('#imgListBox').html(detailImgList);
    imgLayout();
    /* 修改用户信息 */
    $('#userMessDeatil').html(res.trendInfoRsp.detail.trend.content?res.trendInfoRsp.detail.trend.content.txt:''); /*内容*/
    $('#messTime').html(timeChange(res.trendInfoRsp.detail.trend.timestamp)); /*时间*/
    if(!res.trendInfoRsp.detail.trend.position) {
      $('.address-btn').css('display', 'none')
    }else {
      $('.address-btn').html('<i class="dingwei"></i>' + (res.trendInfoRsp.detail.trend.position.addr?res.trendInfoRsp.detail.trend.position.addr:''))
    }
    $('#likeTotal').html(res.trendInfoRsp.detail.like_total?res.trendInfoRsp.detail.like_total:0); /*赞数*/
    $('#replyTotal').html(res.trendInfoRsp.detail.reply_total?res.trendInfoRsp.detail.reply_total:0); /*回复数*/
    /* 评论数 */
    if(res.replyListRsp.replys && res.replyListRsp.replys.length > 0){
      $('#totalReplyNum').text('全部 '+ (res.trendInfoRsp.detail.reply_total?res.trendInfoRsp.detail.reply_total:0) +' 条评论')
    }else {
      $('#totalReplyNum').text('暂无评论')
    }
    var userArr = [];
    if(res.replyListRsp.replys){
      for(var i = 0;i < res.replyListRsp.replys.length;i++){
        if(res.replyListRsp.replys[i].replyto_id){
          userArr.push(res.replyListRsp.replys[i].replyto_id)
          userArr.push(res.replyListRsp.replys[i].uid)
        }else {
          userArr.push(res.replyListRsp.replys[i].uid)
        }
      }
    }
    if(userArr.length > 0 ) {
      getUserInfo(userArr,res.replyListRsp.replys)
    }
  }

  /*判断详情图片数量显示排布*/
  function imgLayout() {
    var imgList = $('.img-list > li.img-item');
    if (imgList.length > 4 || imgList.length == 3) {
      imgList.css('width', '33.3%')
    } else if (imgList.length == 4 || imgList.length == 2) {
      imgList.css('width', '50%')
    } else {
      imgList.css({
        width: '100%',
        padding: '0'
      })
    }
    imgList.css({
      height: imgList.css('width')
    })
  }
  /* 单独获取发帖人信息 */
  function getCommunityInfo(uid) {
    $.ajax({
      type: 'POST',
      url: BASE_HEAD_URL + '/web_proxy/TrendShareGetUserInfo',
      data:{
        token: getQueryString('token'),
        user_list: uid.toString()
      },
      success:function (res) {
        if(res.code == 0){
          $('#userName').text(res.data.user_infos[0].nick); /*name*/
          $('#userAvatar').attr('src' ,res.data.user_infos[0].head_url); /*logo*/
          /* 性别 */
          if(res.data.user_infos[0].sex == 1) {
            $('#userSex').removeClass('female').addClass('male');
          }else if(res.data.user_infos[0].sex == 2){
            $('#userSex').removeClass('male').addClass('female');
          }
        }
      }
    })
  }

  /* 时间转换 */
  function add0(m){return m<10?'0'+m:m }
  function timeChange(data) {
    var time = new Date(data);
    var y = time.getFullYear();
    var m = time.getMonth()+1;
    var d = time.getDate();
    var h = time.getHours();
    var mm = time.getMinutes();
    var s = time.getSeconds();
    return y+'-'+add0(m)+'-'+add0(d)+' '+add0(h)+':'+add0(mm)
    /*+':'+add0(s);*/
  }

  /* 获取url参数 */
  function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
  }

  /* open APP */
  function openApp(src) {
    // 通过iframe的方式试图打开APP，如果能正常打开，会直接切换到APP，并自动阻止a标签的默认行为
    // 否则打开a标签的href链接
    var ifr = document.createElement('iframe');
    ifr.src = src;
    ifr.style.display = 'none';
    document.body.appendChild(ifr);
    window.setTimeout(function(){
      document.body.removeChild(ifr);
    },2000);
  }
})
