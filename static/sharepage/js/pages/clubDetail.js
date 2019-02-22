$(function () {
  if(!getQueryString('token') || !getQueryString('gymId')){
    alert('未获取到url参数')
    return
  }

  /* 请求数据 必须为数字 */
  $.ajax({
    type: 'POST',
    url: BASE_HEAD_URL + '/web_proxy/GymShare',
    data:{
      token: getQueryString('token'),
      gymId: Number(getQueryString('gymId'))
    },
    success:function (res) {
      if (res.code == 0 && res.data.gym_info) {
        /*$('.add-follow').attr("href","javascript:testApp('niulangsport://com.yesfeeling.niulangsport/gymDetails?gymId="+ getQueryString('gymId') +"')");*/
        var APP_schema = "javascript:testApp('niulangsport://com.yesfeeling.niulangsport/communityDetails?gymId="+ getQueryString('gymId') +"')"
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
        /*"&gymName="+ res.data.gym_info.name +*/
        renderData(res.data.gym_info)
        $('#shareAvatar').attr('src', res.data.ownUserInfoRsp.user_info.head_url)
        $('#shareName').text(res.data.ownUserInfoRsp.user_info.nick)
      }
    }
  })


  /* 渲染数据 */
  function renderData(res) {
    //console.log(res);
    var imsLIst = JSON.parse(res.images);
    var imgListHtml = '';
    if (imsLIst && imsLIst.length) {
      $.each(imsLIst, function (i, v) {
        imgListHtml += '<div class="swiper-slide"><img src="' + v + '" alt=""></div>';
      })
    }
    $('#imgList').html(imgListHtml);
    initLoop()

    $('#clubLogo').attr('src', res.logo)
    $('#clubName').text(res.name)
    $('#clubAddress').text(res.address)
    $('#clubOpentime').text('营业时间  ' + res.business_start + '~' + res.business_end)
    $('#clubTel').text(res.phone)
    $('#clickTel').attr('href', 'tel:' + res.phone);
    var needX = getCombBySum(res.feature);
    //console.log(needX);
    $.each($('.club-feature ul li'), function (i,v) {
      if(needX.indexOf(i) >= 0){
        $(v).css('display','inline-block');
      }
    })
  }

  /* 获取url参数 */
  function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
  }
  function getCombBySum(sum, tolerance, targetCount) {
    var array = [1, 2, 4, 8, 16, 32, 64, 128, 256, 512];
    var util = {
      getCombination: function (arr, num) {
        var r = [];
        (function f(t, a, n) {
          if (n == 0) {
            return r.push(t);
          }
          for (var i = 0, l = a.length; i <= l - n; i++) {
            f(t.concat(a[i]), a.slice(i + 1), n - 1);
          }
        })([], arr, num);
        return r;
      },
      getArrayIndex: function (array) {
        var i = 0,
          r = [];
        for (i = 0; i < array.length; i++) {
          r.push(i);
        }

        return r;
      }
    };
    var logic = {
      init: function (array, sum) {
        var _array = array.concat(),
          r = [],
          i = 0;
        _array.sort(function (a, b) {
          return a - b;
        });
        for (i = 0; i < _array.length; i++) {
          if (_array[i] <= sum) {
            r.push(_array[i]);
          } else {
            break;
          }
        }

        return r;
      },
      core: function (array, sum, arrayIndex, count, r) {
        var i = 0,
          k = 0,
          combArray = [],
          _sum = 0,
          _cca = [],
          _cache = [];

        if (count == _returnMark) {
          return;
        }
        combArray = util.getCombination(arrayIndex, count);
        for (i = 0; i < combArray.length; i++) {
          _cca = combArray[i];
          _sum = 0;
          _cache = [];
          for (k = 0; k < _cca.length; k++) {
            _sum += array[_cca[k]];
            _cache.push(array[_cca[k]]);
          }
          if (Math.abs(_sum - sum) <= _tolerance) {
            r.push(_cache);
          }
        }

        logic.core(array, sum, arrayIndex, count - 1, r);
      }

    };
    var r = [], _array = [], _targetCount = 0, _tolerance = 0, _returnMark = 0;
    _targetCount = targetCount || _targetCount;
    _tolerance = tolerance || _tolerance;
    _array = logic.init(array, sum);
    if (_targetCount) {
      _returnMark = _targetCount - 1;
    }
    logic.core(_array, sum, util.getArrayIndex(_array), (_targetCount || _array.length), r);
    //console.log(r);
    var indexArr = [];
    if(r[0]){
      for(var iA = 0;iA < r[0].length;iA++){
        indexArr.push(array.indexOf(r[0][iA]))
      }
    }
    return indexArr;
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

function initLoop() {
  var mySwiper = new Swiper('.swiper-container', {
    autoplay: true,
    // 如果需要分页器
    pagination: {
      el: '.swiper-pagination',
    }
  })
}
