$(function () {
    var sw = $(window).width();
    if(sw>640){
        sw = 640;
    }
    $("html").css("font-size",sw/1080*32.8125+"px");

    // 页面滚动时
    $(window).scroll(function () { 
        if ($(window).scrollTop() > window.innerHeight) {
        $('.static-nav').css('position','fixed');
        $('.static-nav').css('top','0');
        $('.static-nav').css('display','block');
        $('.sild-nav').css('opacity','1');
        $('#productNav').show()
        }else{
        $('.static-nav').css('position','relative');
        $('.static-nav').css('display','none');
        $('.sild-nav').css('opacity','0');
        $('#productNav').hide()
        }
    });

// 返回顶部
    $('.return').click(function () {
        $('html,body').animate({
            // scrollTop:$('.nl-footer').offset().top 
            scrollTop:0
        },1000)
        
    })

    // 跳转
    $('.ios,.android').click(function () {
        window.location.href = 'http://android.myapp.com/myapp/detail.htm?apkName=com.yesfeeling.niulangsport&ADTAG=mobile'
    })


})