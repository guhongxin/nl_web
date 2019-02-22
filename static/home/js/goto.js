/*页面强转开始*/
if (window.location.hostname == 'localhost' || window.location.hostname == 'www.dev.nlfit.cn' || window.location.hostname == 'cur.nlfit.cn') {
  console.log(window.location.hostname)
} else {
  var tmpTag = 'https:' == document.location.protocol ? false : true
  if (tmpTag) {
    var urls = window.location.href
    urls = urls.replace("http", "https")
    window.location = urls
  }
}
