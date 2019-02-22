$(function() {
    
    var getThreeArr = function(allarr) { // 数组过滤方法
        var mapMet = {
          method: {
            filetThree: function(arr, params, query) {
                var newarr = arr.filter(function(item, index) {
                if (index >= params && index < query) {
                  return item
                }
              })
              return newarr
            }
          },
          query: {
            num: 3, // 每3个计数一次
            comarr: [], // 最后的二维数组
            indexs: parseInt(allarr.length / 3) // 循环次数
          }
        }
        var quy = mapMet.query
        if (allarr.length % 3 !== 0) { // 循环总次数
          quy.indexs += 1
        }
        for (var index = 0; index < quy.indexs; index++) { // 遍历生产二维数组
          quy.comarr.push(mapMet.method.filetThree(allarr, quy.num * index, quy.num * (index + 1)))
        }
        return quy.comarr
    }
    var dataList = [
        { ids: '1', num: '01', color:'#b2aad6', img: './img/17pic.png', title: '进出场系统（智能门禁）', descript: '独一无二的身份识别，避免他人冒用、防止进场尾随，并且降低了前台工作量、加快了会员入场速度、也避免了高峰期拥堵'},
        { ids: '2', num: '02', color:'#f4a984', img: './img/52pic.png', title: '签课系统（前台一体机）', descript: '可以减少前台人员的繁杂工作，将入场身份认证、会员私教消课认证、储值消费与功能融为一体'},
        { ids: '3', num: '03', color:'#47cbea', img: './img/16pic.png', title: '柜控系统（智能储物柜）', descript: '会员可通过二维码或指静脉等识别方式，自主领取、更换、归还储物柜；告别钥匙号码牌，大大降低人力成本'},
        { ids: '4', num: '04', color:'#f59868', img: './img/49pic.png', title: '器械系统（器械智能化升级）', descript: '运动数据可视化、系统会完整记录用户的健身数据（如：卡路里消耗等）、并作为日后训练参考、同时还支援一键分享朋友圈'},
        { ids: '5', num: '05', color:'#45c1a6', img: './img/15pic.png', title: '体测系统（智能体测仪）', descript: '牛啦智能体测仪是目前国内市场中唯一的互联网智能体测仪，该体测仪在基本身体成分分析的基础上，加入了心肺功能评估和血压监测项目'},
        { ids: '6', num: '06', color:'#6dcce3', img: './img/18pic.png', title: '心率系统（智能私教监测仪）', descript: '牛啦智能私教监测仪能通过心率监测机和心率带，实时监测反馈会员在运动时的建议和心率区间'}, 
        { ids: '7', num: '07', color:'#f59868', img: './img/48pic.png', title: '水控系统（智能淋浴）', descript: '精确的节能控制技术，节约用水，可大幅降低俱乐部成本；使用人、使用事件、使用水阀的历史记录均可即时查询'},
        { ids: '8', num: '08', color:'#45c1a6', img: './img/21pic_00.png', title: 'SaaS运营管理系统', descript: '功能强大，免安装，简单易用；省去了高昂的服务器维护费用，支持自动升级最新功能随时使用'},
        { ids: '9', num: '09', color:'#6dcce3', img: './img/23pic.png', title: '在线社交系统（牛啦 APP）', descript: '帮助俱乐部增加曝光量；帮助俱乐部获取潜在客户；帮助俱乐部提升会员的体验与乐趣性；加强俱乐部与会员间的互动'},
    ]
    var completeArr = getThreeArr(dataList)
    var productListBox = $('#productList')
    var domlist = function(item) {
        var domall = ''
        for (var i = 0; i < item.length; i++) {            
            var dom = `<li>
                            <div class="img" style="background-image:url(${item[i].img});">
                                <i>${item[i].num}</i>
                            </div>
                            <div class="text">
                                <h5>${item[i].title}</h5>
                                <p>${item[i].descript}</p>
                                    <p><a class="toAnother" ids="${item[i].ids}">more >></a> </p>     
                            </div>
                        </li>`
            domall += dom
        }
        return domall
    }
    productListBox.html(domlist(completeArr[0]))
    $('.productMove').css({'transform': 'translateX(0)', 'opacity': 1})
    // 绑定点击事件
    $('.toAnother').off('click').on('click',function(e){
        console.log($(this).attr('ids'))
        window.location.href = "product.html?ids="+$(this).attr('ids')
    })
    // 定义定时器动态替换里边的内容
    var indexlunbo = 0
    window.lunbo = function(index, self) {
        $('#pageIndex li').removeClass('activeLi')
        $(self).addClass('activeLi')
        
        productListBox.html(domlist(completeArr[index]))
        $('.productMove').css({'transform': 'translateX(0)', 'opacity': 1})
        // console.log(index);
        $('.toAnother').off('click').on('click',function(e){
            console.log($(this).attr('ids'))
            window.location.href = "product.html?ids="+$(this).attr('ids')
        })
    }

    for(var i = 0; i <completeArr.length; i++) {
        $('#pageIndex').append('<li onclick="lunbo('+ i +', this)"></li>')
        $('#pageIndex li').eq(0).addClass('activeLi')
    }
    function loeee() {
        if (indexlunbo>=completeArr.length){
            indexlunbo = 0
        }
        lunbo(indexlunbo++)
        $('#pageIndex li').removeClass('activeLi')
        var ies = indexlunbo
        $('#pageIndex li').eq(ies-1).addClass('activeLi')
        setTimeout(function() {
            $('.productMove').css({'transform': 'translateX(100%)', 'opacity': 0})
        }, 4000)
    }

    var stween = setInterval(loeee, 4500)
    



    //电梯导航
    $('.def').click(function () {
        $(this).addClass('cli');
        $(this).siblings().removeClass('cli');  
    });

    $('.hangye').click(function () {
        $('html,body').animate({
            scrollTop:$('.manage').offset().top 
        },500)
        
    })
    $('.jiejue').click(function () {
        $('html,body').animate({
            scrollTop:$('.precept').offset().top 
        },500)
        
    })
    $('.gongsi').click(function () {
        $('html,body').animate({
            scrollTop:$('.introduce').offset().top 
        },500)
        
    })
    $('.yingyong').click(function () {
        $('html,body').animate({
            scrollTop:$('.scene').offset().top 
        },500)
        
    })
    $('.lianxi').click(function () {
        $('html,body').animate({
            scrollTop:$('.footer').offset().top 
        },500)
        
    })


    $('.liaojie').click(function () {
        var scroll_top = window.innerHeight
        // console.log(scroll_top);
        $('html,body').animate({
            scrollTop:scroll_top 
        },500)     
    }) 


//动画
    // 获取当前元素到页面顶部的距离
    var eTop = $('.details').offset().top;
    var wTop = $(window).height();
    $(window).scroll(function () {
        var dTop = $(document).scrollTop();   
          if(dTop + wTop > eTop){
            // console.log('出来');
            $('.details').animate({left:'10%'},1000)
    }
    })  
})