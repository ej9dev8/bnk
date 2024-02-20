// datepicker
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
}

$.datepicker.setDefaults({
        dateFormat: 'yy-mm-dd',
        changeMonth: true, // 월을 바꿀수 있는 셀렉트 박스를 표시한다.
        changeYear: true, // 년을 바꿀 수 있는 셀렉트 박스를 표시한다.
        minDate: '-100y', // 현재날짜로부터 100년이전까지 년을 표시한다.
        yearRange: 'c-100:c+100', // 년도 선택 셀렉트박스를 현재 년도에서 이전, 이후로 얼마의 범위를 표시할것인가.
        prevText: '이전 달',
        nextText: '다음 달',
        monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
        monthNamesShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
        dayNames: ['일', '월', '화', '수', '목', '금', '토'],
        dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
        dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'],
        showMonthAfterYear: true,
        yearSuffix: '년'

    });
$(function(){
 $('.datepicker').datepicker();
});