$(function(){	
	// prodListSlider();

});

/* ===================================
	scroll
====================================== */
$(window).scroll(function(){    
	Spos = $(window).scrollTop();
	
	if($('.prod_detail_wrap').length > 0){
		ProdDetail.detailFix();		
	}

});
var Common = {
// 제품디테일 탭메뉴 & 우측영역 고정
	detailFix: function () {
		var secPos = $('.tab-sec-wrap').offset().top;
		var secH = $('.tab-sec-wrap').outerHeight();

		var header = $('#header').height();
		var menu = $('#tab-menu-wrap').height();

		var minus = header - menu;

		if (Spos + 60 > secPos - minus) {
			$('.tab-menu-wrap').addClass('fix');
			$('.prod-info-fixed').addClass('fix');
			$("#topBanner").css("display", "none");
		} else {
			$('.tab-menu-wrap').removeClass('fix');
			$('.prod-info-fixed').removeClass('fix');
			$("#topBanner").css("display", "block");
		}

		$('.tab-menu-wrap a').each(function () {
			var $this = $(this);
			var current = $($this.attr('href'));
			var $active = $(this).parent('li');

			if (Spos + 60 > current.offset().top - minus) {
				$('.tab-menu-wrap li').removeClass('active');
				$active.addClass('active');
			} else {
				$active.removeClass('active');
			}

		});

	}
}
// //리스트
// function prodListSlider(){
//    	$('.prod_list_slide').not('.slick-initialized').slick({
//    		dots: true,
//    		arrows: true,
//    		infinite: true,
//    		speed: 600,
//    		slidesToShow: 4,
//    		slidesToScroll: 4,
//    		responsive: [{
//    			breakpoint: 1199,
//    			settings: {
//    				slidesToShow: 3,
//    				slidesToScroll: 3
//    			},
//    		},
//    		{
//    			breakpoint: 991,
//    			settings: {
//    				slidesToShow: 2,
//    				slidesToScroll: 2
//    			},
//    		},
//    		{
//    			breakpoint: 767,
//    			settings: {
//    				slidesToShow: 2,
//    				slidesToScroll: 2
//    			},
//    		}]
//    	});
// }

function toggleSelect(){
    //START Toggle Select
    $('.toggle_wrap').on('click',function(e){
    	var $this = $(this);
    	e.preventDefault();
        e.stopPropagation(); //이벤트 버블링 막기
        
        $this.find("ul.select").toggle();
    });
    $('body').click( function() { //화면 클릭 닫기
    	$(".toggle_wrap > ul.select").hide();
    });

    if($("ul.select > li").hasClass('active') == true){
    	var active = $("ul.select > li.active").text();
    	$('.toggle_wrap > p.value').text(active);
    }
    //END Toggle Select
}
/* ===================================
	UI function
====================================== */


//완제품 상세 Function
var Detail = {
	detailFix : function(){  // 제품디테일 탭메뉴 & 우측영역 고정;
		var secPos = $('.prod_detail_wrap').offset().top;
		
		if(Spos + 50 > secPos){
			$('.tab_menu_wrap').addClass('fix');
		}else{
			$('.tab_menu_wrap').removeClass('fix');
		}
	},
	detailTabMove : function(){ // 제품디테일 탭메뉴 이동
		var posY = $('.prod_detail_wrap').offset().top;
		
		$('html, body').stop().animate({scrollTop : posY+'px'},600);
		return false;
	},
	countControl : function(type){ //제품 수량 컨트롤
		var opCnt =  $("#opCnt").val();
		if(type=='-'){//수량 차감
			opCnt--;
		}else{// 수량 차증
            if($('#spQuotaOnce').length != 0){
                try{
                    var spQuotaOnce=Number( $('#spQuotaOnce').html().replace(/[^0-9]/gi,'') );
                    if(opCnt<spQuotaOnce){
                        opCnt++;
                    }
                }catch(e){}
            }else{
			    opCnt++;
            }
		}
		if(opCnt<1){
			return false;
		}
		$("#opCnt").val(opCnt);
		Detail.calculatePrice();
	},
	calculatePrice : function(){
		var spPrice= $("#spPrice").val();
		var opCnt = $("#opCnt").val();
		var priceSum = spPrice*opCnt;
		$("#priceSum").text(setComma(priceSum));
	},
	qnaPageMove : function(obj, sp_p_idx){//제품문의 페이지이동
		$.ajax({
	        url: "prodQna.do?idx="+sp_p_idx+"&page="+$(obj).attr("page"),
	        type: "GET",
	        success: function(data) {
	        	$("#tabSec3").html(data);
	        },
	        error: function(jqXHR, exception,data) {
	        	ajaxException(jqXHR, exception,data);
	        }
	    });
	},
	mobileInfoClose : function(){ //모바일 제품옵션창 닫기
		$(".prod_info_wrap").removeClass('fixed');
		$(".mobile_info_close").css({'display':"none"});
	}

}