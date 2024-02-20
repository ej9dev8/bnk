function isIE(){
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE ");

    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)){ // If Internet Explorer, return version number
        return true;
    }else{ // If another browser, return 0
        return false;
    }
}


$(function(){
	flag = false;

    try{
        Common.floating();
        Common.mobileCategory();
        Common.headerFixed();
        Common.mainPopupPosition();
    }catch(e){
        console.log(e);
    }

	// 전체 카테고리
	$(document).on('click','.gnb_btn',function(){
		var $this = $(this);
		$this.toggleClass('active');

		if($this.hasClass('active') == true){
			$("#categoryMenu").addClass('active');
		}else{
			$("#categoryMenu").removeClass('active');
		}

	});

	// 좌우 모바일 카테고리
	$(document).on('click','.gnb-toggle-btn',function(){
		var $this = $(this),
			window = $(window).width();

		$this.toggleClass('active');

		if($this.hasClass('active') == true){
			$("#categoryMenu").addClass('active');
		}else{
			$("#categoryMenu").removeClass('active');
		}
	});
	
	//에디터 유튜브영상 반응형
    $('.note-video-clip').wrap('<div class="note-video-iframe"></div>');
    $('.note-video-iframe').wrap('<div class="note-video-wrap"></div>');

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
});

$(window).resize(function(e){
	Common.headerFixed();
	Common.mainPopupPosition();
    e.preventDefault();
});

	
var Common = {
	init : function(){
		var $categoryMenu = null;
		var $floatingMenu = null;
		var $headerBanner = null;
	},
	//header drawer menu
	gnbCategory : function(obj){
		$categoryMenu = $('#categoryMenu');
		
		$(obj).toggleClass('active');
		
		if($(obj).hasClass('active') == true){
			$categoryMenu.addClass('active');
		}else{
			$categoryMenu.removeClass('active');
		}
	},
	//floating
	floating : function(){
		//$floatingMenu = $('#floatingMenu');
		var topBtn = $('#posTop');
		
		$(window).on('scroll',function(){
			var windowY = $(this).scrollTop();
			var posY = $('header').height();
			
			if(windowY >= posY){
				//$floatingMenu.addClass('fix');
				topBtn.fadeIn();
			}else{
				//$floatingMenu.removeClass('fix');
				topBtn.fadeOut();
			}
		});
	},
	//팝업이미지 위치설정
	mainPopupPosition : function(){
		var $popup = $('.mainPopup'),
			height = $popup.height()+20,
			len = $popup.length;
		
		for(var i=1; i<len+1; i++){
			var position = (height*i)-height;
			$('#mainPopup'+i).not('#mainPopup1').css({top:position+'px'});
		}
	},	
	//모바일 전체카테고리(스타일 1)
	moCategoryOpenFst :function(obj){
		$(obj).toggleClass('open');
		
		if($(obj).hasClass('open') == true){
			$(".category-menu-style-1").addClass('active');
			$('body').addClass('not_scroll');
		}else{
			$(".category-menu-style-1").removeClass('active');
			$('body').removeClass('not_scroll');
		}
	},
	//모바일 전체카테고리(스타일2)
    	moCategoryOpenScd :function(obj){
    		$(obj).toggleClass('open');
    		if($(obj).hasClass('open') == true){
    			$(".category-menu-style-2").addClass('active');
    			$('body').addClass('not_scroll');
    		}else{
    			$(".category-menu-style-2").removeClass('active');
    			$('body').removeClass('not_scroll');
    		}
    	},

	// 모바일 좌우 전체카테고리 닫기
	moCategoryClose : function(){
		$("#categoryMenu, .gnb-toggle-btn").removeClass('active');
	},

	//모바일 drawer menu
	mobileCategory : function(){
		$(document).on('click','a.toggle_icon', function(){
			var $this = $(this);
			var $menu = $this.parent('li');
			var $subMenu = $this.next('div.sub_menu');

			$('a.toggle_icon').text('+');
			$('.menu_wrap > li').removeClass('active');
			
			if($subMenu.is(":visible")){
				$('a.toggle_icon').text('+');
				$('.menu_wrap > li').removeClass('active');
				$('div.sub_menu').slideUp('normal');	
			}
			
			if(!$subMenu.is(":visible")){
				$this.text('ㅡ');
				$menu.addClass('active');
				$('div.sub_menu:visible').slideUp('normal');
				$subMenu.slideDown('normal');	
			}
			
		});		
	},
	//모바일 헤더 고정
	headerFixed : function(){
		if($(window).width() < 992){
			$(window).scroll(function(){
		        setTimeout(function(){
		    		Spos = $(window).scrollTop();
		    		/*var standard = $("#nav").offset().top;*/
                    var standard = $("#nav").offset().top;
		    		if(Spos > standard){
		    			$('#middle').addClass('fixed');
		    		}else{
		    			$('#middle').removeClass('fixed');
		    		}

		        },200);
			});
	    }
	},
	//모바일 검색창
    	moSearchOpen :function(){
    		$("#search_data").css({'display':'block'});
    		$("#header_input").focus();
    	},
    	//모바일 검색창
    	moSearchClose :function(){
    		$("#search_data").css({'display':'none'});
    	},
	// 주소검색
	postCode : function(obj, idName) {
		new daum.Postcode({
			oncomplete : function(data) {
				var sido = data.sido;
				var sigungu = data.sigungu;
				if(sigungu==''){
					sigungu=data.bname1;
				}
				var roadname = data.roadname;
				if(roadname==''){
					roadname=data.bname;
				}

				var roadnameExtract=data.roadAddress.substring(data.roadAddress.indexOf(sigungu)+sigungu.length)
				roadnameExtract=roadnameExtract.substring(0,roadnameExtract.indexOf(roadname)+roadname.length).trim()
				roadname=roadnameExtract

				var roadNum = data.roadAddress;
				roadNum=roadNum.substring(roadNum.indexOf(roadname)+roadname.length).trim();
				var zonecode = data.zonecode;

				$('#'+idName+'_POST').val(zonecode);
				$('#'+idName+'_FULLADDR').val(data.roadAddress);
				$('#'+idName+'_ADDR1').val(sido);
				$('#'+idName+'_ADDR2').val(sigungu);
				$('#'+idName+'_ADDR3').val(roadname);
				$('#'+idName+'_ADDR4').val(roadNum);
			}
		}).open();

		$('#'+idName+'_ADDR5').focus(); // 나머지 주소
	},
	//상단이동
	posTop : function(){
		$('html, body').stop().animate({'scrollTop':'0'},600);
	},
}

/*---------------------------------
	Layer Modal
-----------------------------------*/
if($('.layerModal').length > 0){
	$('body').append('<div class="overlayBg"></div>');
}
var overlay = $('.overlayBg');
overlay.hide();

//레이어 모달창 열기
function modalOpen(layer){
	$('#'+layer).show();
	$('.overlayBg').show();
	$('html, body').css({'overflow-y':'hidden'});
}

//레이어 모달창 닫기
function modalClose(layer){
	$('#'+layer).hide();
	$('.overlayBg').hide();
	$('html, body').css({'overflow-y':'visible'});
}

/*---------------------------------
	Action
-----------------------------------*/
//form 파라미터화 
function getParams(fname){
	var formObj=document.forms[fname];
	var flength=formObj.length;
	var param='';
	for(var i=0;i<flength;i++){
		if(formObj[i]==null||formObj[i].name==''){
			continue;
		}
		var val=formObj[i].value;
		val=encodeURIComponent(val);
		param+=formObj[i].name+'='+val+'&';
	}
	param=param.substr(0,param.length-1);
	return param;
}

//쿠키설정
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

//쿠키조회?
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) != -1) {
        	('c == ' + c.substring(name.length,c.length));

        	return c.substring(name.length,c.length);
		}
    }
    return "";
}

/*//한글입력불가
$(".notHangul").keyup(function(event){
	if (!(event.keyCode >=37 && event.keyCode<=40)) {
		if(event.keyCode!=16 && event.keyCode!=50 && event.keyCode!=110){
			var inputVal = $(this).val();
			$(this).val(inputVal.replace(/[^a-z0-9@.]/gi,''));
		}
    }
});*/

/*//한글만 가능
$(".onlyHangul").keyup(function(event){
    if (!(event.keyCode >=37 && event.keyCode<=40)) {
        var inputVal = $(this).val();
        $(this).val(inputVal.replace(/[a-z0-9]/gi,''));
    }
});*/



//콤마찍기
function comma(str) {
	str = String(str);
	return str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
}

//콤마풀기
function uncomma(str) {
	str = String(str);
	return str.replace(/[^\d]+/g, '');
}

//input box에서 사용자 입력시 바로 콤마를 찍어주기 위한 함수도 추가 한다.
function inputNumberFormat(obj) {
	obj.value = comma(uncomma(obj.value));
}

//금액 숫자 입력 콤마 추가
function setComma(n){
	var reg = /(^[+-]?\d+)(\d{3})/; // 정규식
	n += ''; // 숫자를 문자열로 반환
	while(reg.test(n)){
		n = n.replace(reg,'$1'+','+'$2');
	}
	return n;
}

// 배열 합계
function arraySum(array){
	var result = 0;
	var len = array.length;
	for(var i=0; i < len; i++){
		result += array[i]; 
	}
	return result;
}

//숫자만입력
function onlyNum(obj){
	var val = $(obj).val();
	obj.value = val.replace(/[^0-9\.\,\-]/gi, '');
}
//자동 하이픈 입력 (핸드폰)
function autoHipenTel(obj) {
    var str = $(obj).val();
    str = str.replace(/[^0-9]/g, '');

    var tmp = '';
    if( str.length < 4){
        tmp = str;
    } else if(str.length < 7){
        tmp += str.substr(0, 3);
        tmp += '-';
        tmp += str.substr(3);
    } else if(str.length == 7){
        tmp += str.substr(0, 3);
        tmp += '-';
        tmp += str.substr(3);
    } else if(str.length == 8){
        tmp += str.substr(0, 3);
        tmp += '-';
        tmp += str.substr(3, 4);
        tmp += '-';
        tmp += str.substr(7);
    } else if(str.length == 9){
        tmp += str.substr(0, 2);
        tmp += '-';
        tmp += str.substr(2, 3);
        tmp += '-';
        tmp += str.substr(5);
    } else if(str.length == 10){
        if(str.indexOf('02') == 0) {
            tmp += str.substr(0, 2);
            tmp += '-';
            tmp += str.substr(2, 4);
            tmp += '-';
            tmp += str.substr(6);
        } else {
            tmp += str.substr(0, 3);
            tmp += '-';
            tmp += str.substr(3, 3);
            tmp += '-';
            tmp += str.substr(6);
        }
    } else if(str.length == 12){ //인터넷 팩스번호
        tmp += str.substr(0, 4);
        tmp += '-';
        tmp += str.substr(4, 4);
        tmp += '-';
        tmp += str.substr(8);
    } else {
        tmp += str.substr(0, 3);
        tmp += '-';
        tmp += str.substr(3, 4);
        tmp += '-';
        tmp += str.substr(7);
    }
    $(obj).val(tmp);
}

// char 삭제
function removeChar(event){
	event = event || window.event;
	var key = (event.which) ? event.which : event.keyCode;
	
	if(key == 8 || key == 46 || key == 37 || key == 39){

	}else{
		event.target.value = event.target.value.replace(/[^0-9]/g, "");
	}	
}

/*//자동 하이픈 입력 (핸드폰)
function autoHipenTel(obj) {
	var str = $(obj).val();
	str = str.replace(/[^0-9]/g, '');
	
	var tmp = '';
	if( str.length < 4){
		tmp = str;
	} else if(str.length < 7){
		tmp += str.substr(0, 3);
		tmp += '-';
		tmp += str.substr(3);
	} else if(str.length == 7){
		tmp += str.substr(0, 3);
		tmp += '-';
		tmp += str.substr(3);
	} else if(str.length == 8){
		tmp += str.substr(0, 3);
		tmp += '-';
		tmp += str.substr(3, 4);
		tmp += '-';
		tmp += str.substr(7);
	} else if(str.length == 9){
		tmp += str.substr(0, 2);
		tmp += '-';
		tmp += str.substr(2, 3);
		tmp += '-';
		tmp += str.substr(5);
	} else if(str.length == 10){
		if(str.indexOf('02') == 0) {
			tmp += str.substr(0, 2);
			tmp += '-';
			tmp += str.substr(2, 4);
			tmp += '-';
			tmp += str.substr(6);
		} else {
			tmp += str.substr(0, 3);
			tmp += '-';
			tmp += str.substr(3, 3);
			tmp += '-';
			tmp += str.substr(6);
		}
	} else if(str.length == 12){ //인터넷 팩스번호
		tmp += str.substr(0, 4);
		tmp += '-';
		tmp += str.substr(4, 4);
		tmp += '-';
		tmp += str.substr(8);
	} else {				
		tmp += str.substr(0, 3);
		tmp += '-';
		tmp += str.substr(3, 4);
		tmp += '-';
		tmp += str.substr(7);
	}
	$(obj).val(tmp);
}*/

/*//이메일 autocomplete
function autoEmail(a,b){
	*//*
		a : input의 ID
		b : 입력되는 input의 값
	*//*
	var mailId = b.split('@'); // 메일계정의 ID만 받아와서 처리하기 위함
	var mailList = [
		'@naver.com'
		, '@gmail.com'
		, '@daun.net'
		, '@nate.com'
		, '@hotmail.com'
		, '@yahoo.com'
		, '@empas.com'
		, '@korea.com'
		, '@dreamwiz.com'
	]; // 메일목록

	for(var i=0; i < mailList.length; i++ ){
		var email = mailId[0] +mailList[i]
		mailList[i] = email;
	}

	$('#'+a).autocomplete({
		source : mailList,
		select : function(event, ui){
			('ui == ' + ui.item.label);
			('ui == ' + ui.item.value);
			('ui == ' + ui.item.test);
		}, focus : function(event, ui){
			return false;
		}
	}).autocomplete('instance')._renderItem = function(ul, item) { // UI 변경 부
		return $('<li>') //기본 tag가 li
			.append('<div>' + item.value + '</div>') // 원하는 모양의 HTML 만들면 됨
			.appendTo(ul);
	};
}*/

/*// datepicker
$(function() {
	// 한국어 언어설정
	$.datepicker.setDefaults($.datepicker.regional['ko']);

	// 기간 검색
	$(".inquiry_datepicker").datepicker(
		{
			showButtonPanel : false,
			dateFormat : "yy-mm-dd",
			onClose : function(selectedDate) {
				var eleId = $(this).attr("id");
				var optionName = "";

				if (eleId.indexOf("from") > 0) {
					eleId = eleId.replace("from", "to");
					optionName = "minDate";
				} else {
					eleId = eleId.replace("to", "from");
					optionName = "maxDate";
				}

				$("#" + eleId).datepicker("option", optionName,
					selectedDate);
				$(".month_btn").find("button[type='button']").removeClass(
					"active");

			}
		});

	$(".ti-calendar").dateclick(); // DateClick
	$(".month_btn").schDate(); // 기간버튼 엑티브
});

// datepicker DateClick
jQuery.fn.dateclick = function() {
	var $obj = $(this);
	$obj.click(function() {
		this.fixFocusIE = true;
		$(this).parent().find("input").focus();
	});
}

// datepicker Search Date
jQuery.fn.schDate = function() {
	var $obj = $(this);
	var $chk = $obj.find("button[type=button]");
	$chk.click(function() {
		$(this).addClass('active').siblings().removeClass('active');
	});
};

// datepicker 기간설정
function setMonthDate(start, obj) {
	$('.month_btn').children().removeClass('active');
	$(obj).addClass('active');

	var num = start.substring(0, 1);
	var str = start.substring(1, 2);

	var today = new Date();

	var $this = $(obj);
	var from = $this.parent('.month_btn').next('.date_input_wrap').find(
		'input[id$="_from"]'); // 시작일
	var to = $this.parent('.month_btn').next('.date_input_wrap').find(
		'input[id$="_to"]'); // 종료일

	var endDate = $.datepicker.formatDate('yy-mm-dd', today);
	to.val(endDate);

	if (str == 'd') { // 일
		today.setDate(today.getDate() - num);
	} else if (str == 'w') { // 주
		today.setDate(today.getDate() - (num * 7));
	} else if (str == 'm') { // 달
		today.setMonth(today.getMonth() - num);
		today.setDate(today.getDate() + 1);
	}

	var startDate = $.datepicker.formatDate('yy-mm-dd', today);
	from.val(startDate);

	// 종료일은 시작일 이전 날짜 선택하지 못하도록 비활성화
	to.datepicker("option", "minDate", startDate);

	// 시작일은 종료일 이후 날짜 선택하지 못하도록 비활성화
	from.datepicker("option", "maxDate", endDate);
}*/

/*var Footer = {
    familySite : function() {
        var url = $('#familySelect option:selected').val();
        if(url != '') {
            window.open(url);
        }
    }
}*/

/*$(function() {
	$( ".datepicker" ).datepicker({
	});
});*/

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&amp;]" + name + "=([^&amp;#]*)"),
    results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}



function agreement(type){
	/**약관 모달*/
	$.ajax({
		url:'/agreement/type?agmType='+type
		,type:'post'
	}).done(function(res){
		$('#Agreement').html(res);
		$("#agreementModal").show();
	});
}
