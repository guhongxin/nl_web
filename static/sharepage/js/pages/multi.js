$(function () {
  if(!getQueryString('uid') || !getQueryString('sub_class_type')) {
    alert('获取URL参数失败')
    return
  }
  $.ajax({
    url: BASE_HEAD_URL + '/web_proxy/sysMedal/medalWall',
    method: 'GET',
    data: {
      uid: getQueryString('uid'),
      subClassType: getQueryString('sub_class_type')
    },
    success: function (res) {
      if(res.code == 0) {
        if(res.data.medal_type_info) {
          $('#userAvtor img').attr('src', res.data.medal_type_info.icon?res.data.medal_type_info.icon:'https://niulang-v2.oss-cn-beijing.aliyuncs.com/res/sys_medal/%E6%97%A5%E5%B8%B8%E8%AE%AD%E7%BB%83-3x.png')
          $('#title').text(res.data.medal_type_info.name?res.data.medal_type_info.name:'-')
          $('#enTitle').text(res.data.medal_type_info.name_en?res.data.medal_type_info.name_en:'-')
          $('#typeName').text(res.data.medal_type_info.medal_type_name?res.data.medal_type_info.medal_type_name:'-')
          $('#headModel').css('background-image', 'url('+ (res.data.medal_type_info.background_img?res.data.medal_type_info.background_img:res.data.medal_type_info.background_default) +')')
        }else {
          alert("获取数据失败")
        }
        $('#statistics').html('<span>'+ res.data.reached +'</span> / <span>'+ res.data.total +'</span>')
        renderHtml(res.data.medal_list)
      }
    },
    error: function (res) {
      alert("获取数据失败")
    }
  })
})
function renderHtml(result) {
  var html = ''
  for (var i = 0; i < result.length; i++) {
    html += '<li>\n' +
      '      <div><img src="'+ result[i].icon +'"></div>\n' +
      '      <span class="bottom-gray"></span>\n' +
      '      <p>'+ result[i].name +'</p>\n' +
      '    </li>'
  }
  $('#multiplayerModel').html(html)
}
/* 获取url参数 */
function getQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
}
