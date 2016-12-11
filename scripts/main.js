
function main() {

(function () {
   'use strict';// 严格模式
   
   // 页面滑动
  	$('a.page-scroll').click(function() {
        if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
          var target = $(this.hash);
          target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
          if (target.length) {
            $('html,body').animate({
              scrollTop: target.offset().top
            }, 900);
            return false;
          }
        }
      });

     ////我的技能
     //$(document).ready(function(e) {
     //    var index=0;
     //            if(index==0){
     //
     //                $('.chart').easyPieChart({
     //                    //barColor:'red',
     //                    //trackColor:'green',
     //                    //lineWidth:'5',
     //                    //size:'30',
     //                    easing: 'easeOut',
     //                    onStep: function(from, to, percent) {
     //                        $(this).find('.percent').text(Math.round(percent));
     //                    }
     //                });
     //
     //            }
     //            index++;
     //});

    
    // 我的技能
    $(document).ready(function(e) {

        var index=0;

        $(document).scroll(function(){
            var top = $('#skills').height()-$(window).scrollTop();
            if(top<-1000){
                if(index==0){

                    $('.chart').easyPieChart({
                        easing: 'easeOutBounce',
                        onStep: function(from, to, percent) {
                            $(this.el).find('.percent').text(Math.round(percent));
                        }
                    });

                }
                index++;
            }
        });
    });


    // 我的作品
    $(window).load(function() {
        var $container = $('.portfolio-items');
        $container.isotope({
            filter: '*',
            animationOptions: {
                duration: 750,
                easing: 'linear',
                queue: false
            }
        });
        $('.cat a').click(function() {
            $('.cat .active').removeClass('active');
            $(this).addClass('active');
            var selector = $(this).attr('data-filter');
            $container.isotope({
                filter: selector,
                animationOptions: {
                    duration: 750,
                    easing: 'linear',
                    queue: false
                }
            });
            return false;
        });

    });
}());
}
main();