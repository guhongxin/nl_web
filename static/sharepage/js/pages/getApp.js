var BASE_HEAD_PROTOCOL = ''
var BASE_HEAD_URL = ''
if (document.location.protocol == 'http:') {
  BASE_HEAD_PROTOCOL = 'http://';
} else {
  BASE_HEAD_PROTOCOL = 'https://';
}
if (window.location.host == 'www.nlfit.cn' || window.location.host == 'nlfit.cn'){
  /* online */
  var BASE_HEAD_URL = (BASE_HEAD_PROTOCOL + 'h5.nlfit.cn');
}else {
  /* test */
  var BASE_HEAD_URL = (BASE_HEAD_PROTOCOL + 'h5-ceshi.nlfit.cn');
}
function testApp(url) {
  var timeout, t = 1000, hasApp = true;
  setTimeout(function () {
    if (!hasApp) {
      //未安装app
      /*if (browser.versions.ios) {
        window.location.href = 'https://itunes.apple.com/cn/app/di-di-da-che-zhi-jian-shang/id554499054?ls=1&mt=8';  //ios下载地址
      } else {
        window.location.href = 'http://img-ys011.didistatic.com/static/apprel/theone/android/didi_psngr_5.2.5.apk';    //安卓下载地址
      }*/
    }
    document.body.removeChild(ifr);
  }, 2000)

  var t1 = Date.now();
  var ifr = document.createElement("iframe");
  ifr.setAttribute('src', url);
  ifr.setAttribute('style', 'display:none');
  document.body.appendChild(ifr);
  timeout = setTimeout(function () {
    var t2 = Date.now();
    if (!t1 || t2 - t1 < t + 100) {
      hasApp = false;
    }
  }, t);

  //判断访问终端
  var browser = {
    versions: function () {
      var u = navigator.userAgent, app = navigator.appVersion;
      return {
        trident: u.indexOf('Trident') > -1, //IE内核
        presto: u.indexOf('Presto') > -1, //opera内核
        webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
        gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1,//火狐内核
        mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
        ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
        android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
        iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
        iPad: u.indexOf('iPad') > -1, //是否iPad
        weixin: u.indexOf('MicroMessenger') > -1, //是否微信 （2015-01-22新增）
        qq: u.match(/\sQQ/i) == " qq" //是否QQ
      };
    }(),
    language: (navigator.browserLanguage || navigator.language).toLowerCase()
  }
}
