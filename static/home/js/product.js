$(function () {
  if (getQueryString("ids")) {
    $('html,body').animate({
      scrollTop: $($('.myClass')[getQueryString("ids") - 1]).offset().top + '100px'
    })
  }

  // 页面滚动时
  $(window).scroll(function () {
    if ($(window).scrollTop() > 800) {
      $('.up').css('display', 'block');
    } else {
      $('.up').css('display', 'none');
    }
  });

  function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
  }
  // 动画


  // 获取当前元素到页面顶部的距离
  $(window).scroll(function () {
    var dTop = $(document).scrollTop();
    for (var i = 1; i < 10; i++) {
      var item = $('.product' + i)
      if (item.offset().top - dTop <= 400) {
        item.find('.leftanimate').css({
          'transform': 'translateX(0)',
          'opacity': 1
        })
        item.find('.rightanimate').css({
          'transform': 'translateX(0)',
          'opacity': 1
        })
      }
    }
  })

  
    // 体测部分
    $('.tice-table').find('li').click(function() {
      $(this).addClass('tice-btn-true').siblings('li').removeClass('tice-btn-true')
      
  })
 $('.btn1').click(function() {
  $('.p5-1').addClass('show').removeClass('hid')
  $('.p5-2').addClass('hid').removeClass('show')
  $('.p5-3').addClass('hid').removeClass('show')
 })
 $('.btn2').click(function() {
  $('.p5-1').addClass('hid').removeClass('show')
  $('.p5-2').addClass('show').removeClass('hid')
  $('.p5-3').addClass('hid').removeClass('show')
 })
 $('.btn3').click(function() {
  $('.p5-1').addClass('hid').removeClass('show')
  $('.p5-2').addClass('hid').removeClass('show')
  $('.p5-3').addClass('show').removeClass('hid')
 })

  //电梯导航
  // $('.def').click(function () {
  //   $(this).addClass('cli');
  //   $(this).siblings().removeClass('cli');
  // });

  // $('.jinchu').click(function () {
  //   $('html,body').animate({
  //     scrollTop: $('.product1').offset().top
  //   }, 500)
  // })
  // $('.zhineng').click(function () {
  //   $('html,body').animate({
  //     scrollTop: $('.product2').offset().top
  //   }, 500)
  // })
  // $('.guikong').click(function () {
  //   $('html,body').animate({
  //     scrollTop: $('.product3').offset().top
  //   }, 500)
  // })
  // $('.qixie').click(function () {
  //   $('html,body').animate({
  //     scrollTop: $('.product4').offset().top
  //   }, 500)
  // })
  // $('.tice').click(function () {
  //   $('html,body').animate({
  //     scrollTop: $('.product5').offset().top
  //   }, 500)
  // })
  // $('.xinlv').click(function () {
  //   $('html,body').animate({
  //     scrollTop: $('.product6').offset().top
  //   }, 500)
  // })
  // $('.shuikong').click(function () {
  //   $('html,body').animate({
  //     scrollTop: $('.product7').offset().top
  //   }, 500)
  // })
  // $('.saas').click(function () {
  //   $('html,body').animate({
  //     scrollTop: $('.product8').offset().top
  //   }, 500)
  // })
  // $('.shejiao').click(function () {
  //   $('html,body').animate({
  //     scrollTop: $('.product9').offset().top
  //   }, 500)
  // })

})
