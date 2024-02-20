// 장바구니 Function
var Cart = {
	// 장바구니 상품 삭제
	delete : function(type, idx) {
		var formData = '';
		var confirmMsg = '해당 상품을 삭제하시겠습니까?';
		if(type=='all'){
			$.each($('input[name="chkIdx"]'), function(key, val) { // 테이블
				formData += $(this).val()+',';
				confirmMsg = '전체 상품을 삭제하시겠습니까?';
			});
		}else if(type=='eachCheck'){
			$.each($('input[name="chkIdx"]:checked'), function(key, val) { // 테이블
				formData += $(this).val()+',';
			});
		}else{
			formData = idx;
		}

		if(formData == ''){
			alert('삭제하실 상품을 선택해주세요.');
			return false;
		}

		if (confirm(confirmMsg)) {
			$.ajax({
				url : "/order/cart/delete.rest",
				data : {"cartSpIdx":formData},
				type : 'POST',
				success : function(data) {
					if(data == 'OK'){
						var idxArr = formData.split(',');
						for(var i=0; i<idxArr.length; i++){
							$("#cart_"+idxArr[i]).remove();
						}
					}
				},
				error : function(data, status, er) {
					alert("에러발생, 관리자에게 문의하세요 [" + status + "_" + er + "]");
				}
			});
		}
	}
	, countControl : function(type, obj){
		var spIdx = $(obj).attr('spIdx');
		var spOnce = $('#cart_count_'+spIdx).attr('spOnce');	//1회 구매제한
		var spDay = $('#cart_count_'+spIdx).attr('spDay');	//1일 구매제한


		var cnt = $("#cart_count_"+spIdx).val();
		if(type=='-'){//수량 차감
			cnt--;
		}else{// 수량 차증
			cnt++;
		}
		if(cnt<1){
			return false;
		}

		var quota = Math.min(spOnce, spDay);
		if(cnt > quota){//구매제한보다 수량이 클 경우
			alert($("#sp_name_"+spIdx).text()+"의 최대 구매 가능 수량은 " + quota +"개 입니다.");
			return false;
		}
		$(".ctCount_"+spIdx).val(cnt);
		Cart.orderPrice();
		Cart.totalPrice();
		Cart.totalPriceSum();
	}
	//주문금액
	, orderPrice : function (){
		$.each($('input[name="chkIdx"]'), function(key, val) {
			var spIdx = $(this).val();

			var productPrice = $('#cart_price_'+spIdx).val();
			var ctCount = $("#cart_count_"+spIdx).val();

			//개별 주문금액 수정
			$('.cart_order_price_'+spIdx).text(setComma(productPrice*ctCount));
		});
	}
	//총합계
	, totalPrice : function(){
		var leng = $('input[name="chkIdx"]:checked').length;
		var totalProduct = 0;
		var totalOrder = 0;
		$.each($('input[name="chkIdx"]:checked'), function(key, val) {
			var spIdx = $(this).val();
			var productPrice = $('#cart_price_'+spIdx).val();
			var ctCount = $("#cart_count_"+spIdx).val();

			//상품 총합
			totalProduct += parseInt(productPrice*ctCount);
			//배송비 -
			//총합계
			totalOrder +=parseInt(productPrice*ctCount);
		});
		//주문금액
		$("#cartsSize").text(leng);
		$("#totalProduct").text(setComma(totalProduct));
		//배송비 -
		//총 합계
		$("#totalOrder").text(setComma(totalOrder));
	}
	//배송비 계산
	, deliverySum : function(){

	}
	// 결제예상금액
	, totalPriceSum : function(){
		var totalProductSum = 0;
		var totalDiscountSum = 0;
		var totalOrderSum = 0;
		$.each($('input[name="chkIdx"]'), function(key, val) {
			var spIdx = $(this).val();
			var pPrice = $('#cart_price_'+spIdx).attr('pPrice');
			var spPrice = $('#cart_price_'+spIdx).val();
			var ctCount = $("#cart_count_"+spIdx).val();
			//총 합계
			totalProductSum += parseInt(pPrice*ctCount);
			totalDiscountSum += parseInt((pPrice-spPrice)*ctCount);
		});

		$("#totalProductSum").text(setComma(totalProductSum));		//총 상품금액
		$("#totalDiscountSum").text(setComma(totalDiscountSum));		//총 기본할인금액
		$("#totalOrderSum").text(setComma(totalProductSum-totalDiscountSum));			//최종 결제금액
	},
	toOrder : function(type, idx){
		var spArr = [];
		var cntArr = [];

		var confirmMsg = '해당 상품을 주문하시겠습니까?';
		if(type=='all'){
			$.each($('input[name="chkIdx"]'), function(key, val) {
				var spIdx = $(this).val();
				spArr[key] = spIdx;
				var ctCnt = $("#cart_count_"+spIdx).val();
				cntArr[key] = ctCnt;
			});
			confirmMsg = '전체 상품을 주문하시겠습니까?';
		}else if(type=='eachCheck'){
			$.each($('input[name="chkIdx"]:checked'), function(key, val) {
				var spIdx = $(this).val();
				spArr[key] = spIdx;
				var ctCnt = $("#cart_count_"+spIdx).val();
				cntArr[key] = ctCnt;
			});
		}else{
			spArr[0] = idx;
			var ctCnt = $("#cart_count_"+idx).val();
			cntArr[0] = ctCnt;
		}

		if(spArr.length == 0){
			alert('주문하실 상품을 선택해주세요.');
			return false;
		}

		if(confirm(confirmMsg)){
			$("input[name=opSpIdx]").val(spArr);
			$("input[name=opCnt]").val(cntArr);
			document.cartForm.action = '/order/order'
			document.cartForm.submit();
		}
	}
}

// 주문 Function
var Order = {
	//배송상품
	synchronize2 : function(type){
		if(type=='new'){
			$('input[name=O_DEL_NAME]').val('');
			$('input[name=O_DEL_PHONE]').val('');
			$('input[name=O_DEL_ADDR1]').val('');
			$('input[name=O_DEL_ADDR2]').val('');
			$('input[name=O_DEL_ADDR3]').val('');
			$('input[name=O_DEL_ADDR4]').val('');
			$('input[name=O_DEL_ADDR5]').val('');
			$('input[name=O_DEL_POST]').val('');
		}else{
			var oName = $('input[name=O_NAME]').val();
			var oPhone = $('input[name=O_PHONE]').val();
			var oAddr1 = $('input[name=O_ADDR1]').val();
			var oAddr2 = $('input[name=O_ADDR2]').val();
			var oAddr3 = $('input[name=O_ADDR3]').val();
			var oAddr4 = $('input[name=O_ADDR4]').val();
			var oAddr5 = $('input[name=O_ADDR5]').val();
			var oPost = $('input[name=O_POST]').val();
			var oFullAddr = $('input[name=O_FULLADDR]').val();
			$('input[name=O_DEL_NAME]').val(oName);
			$('input[name=O_DEL_PHONE]').val(oPhone);
			$('input[name=O_DEL_POST]').val(oPost);
			$('input[name=O_DEL_ADDR1]').val(oAddr1);
			$('input[name=O_DEL_ADDR2]').val(oAddr2);
			$('input[name=O_DEL_ADDR3]').val(oAddr3);
			$('input[name=O_DEL_ADDR4]').val(oAddr4);
			$('input[name=O_DEL_ADDR5]').val(oAddr5);
			$('input[name=O_DEL_FULLADDR]').val(oFullAddr);
		}
	},
	// 결제수단 안내문구
	payMethod : function() {
		$.each($('input[name=PAY_METHOD]'), function(key, val){
			if($(this).prop('checked') == true){
				$('.order_pay_method_guide > li').eq(key).show().siblings().hide();
			}
		});
	}
}

// 클레임 Function
var Claim = {
	// 회원 주문 취소신청
	cancelApply: function () {
		var chkLen = $("input[name='product_chk']:checked").length;
		if (chkLen == 0) {
			alert("상품을 선택해주세요");
		} else {
			var reason = $("#sp_op_cancel_reason").val().trim();
			if (reason == '') {
				alert('취소 사유를 입력해주세요.');
				$("#sp_op_cancel_reason").focus();
				return;
			}

			var param = "";
			$.each($("input[name='product_chk']:checked"), function (key, val) {
				var idx = $(this).attr("idx");
				if (key == (chkLen - 1)) {
					param = param + idx;
				} else {
					param = param + idx + "/";
				}
			});

			var delprice = $("#delVal").text().replace(/,/gi, '');
			var o_idx = $("#sp_o_idx").val();
			var o_code = $("#sp_o_code").val();
			$.ajax({
				url: "orderCancel.ajax",
				data: {
					"idx": o_idx,
					"param": param,
					"delprice": parseInt(delprice),
					"reason": reason
				},
				type: 'POST',
				success: function (data) {
					location.href = "./cancelDetail.do?code=" + o_code;
				},
				error: function (data, status, er) {
					alert("에러발생, 관리자에게 문의하세요 [" + status + "_" + er + "]");
				}
			});
		}
	},

	cancel_card: function (code) {
		if (confirm("카드 결제 취소는 상품 개별 취소가 불가능합니다. \n정말 취소하시겠습니까?") == true) {
			location.href = "cancel_card.do?code=" + code;
		}
	},
	// 비회원 주문 취소신청
	cancelNonMemApply: function () {
		var chkLen = $("input[name='product_chk']:checked").length;
		if (chkLen == 0) {
			alert("상품을 선택해주세요");
		} else {
			var reason = $("#sp_op_cancel_reason").val().trim();
			if (reason == '') {
				alert('취소 사유를 입력해주세요.');
				$("#sp_op_cancel_reason").focus();
				return;
			}

			var param = "";
			$.each($("input[name='product_chk']:checked"), function (key, val) {
				var idx = $(this).attr("idx");
				if (key == (chkLen - 1)) {
					param = param + idx;
				} else {
					param = param + idx + "/";
				}
			});

			var delprice = $("#delVal").text().replace(/,/gi, '');
			var o_idx = $("#sp_o_idx").val();
			var o_code = $("#sp_o_code").val();
			$.ajax({
				url: "orderCancel.ajax",
				data: {
					"idx": o_idx,
					"param": param,
					"delprice": parseInt(delprice),
					"reason": reason
				},
				type: 'POST',
				success: function (data) {
					location.href = "./cancelDetailNonMem.do?code=" + o_code;
				},
				error: function (data, status, er) {
					alert("에러발생, 관리자에게 문의하세요 [" + status + "_" + er + "]");
				}
			});
		}

		location.href = "./cancelDetailNonMem.do";
	},
}

var Point = {
	setDiscount : function(){
		var point = uncomma($("#POINT_AMOUNT").val());
		$("#discountVal").text(comma(point));
		var pay_discount = 0;
		pay_discount += point;
		//쿠폰도 추가

		// 상품주문금액
		var pay_price = $("input[name=PAY_PRICE]").val();
		// 총 결제금액
		var pay_total = $("input[name=PAY_TOTAL]").val();

		pay_total = Number(pay_total) - Number(pay_discount);
		$("input[name=PAY_TOTAL]").val(pay_total);
		$("#buyVal").text(comma(pay_total));
		$("#totalVal").text(comma(pay_total));
	},

	usePoint : function(){//주문 상품 금액, 총 결제금액, obj
		// 사용 가능 포인트
		var usablePoint = uncomma($("#usablePoint").text());
		// 입력한 포인트
		var point = uncomma($("#POINT_AMOUNT").val());

		if(usablePoint < point){
			alert("사용할 수 있는 포인트는 " + comma(usablePoint) + "P 입니다.");
			$("#POIN_AMOUNT").val(0);
			return false;
		}

		//포인트 적용
		Point.setDiscount();
	}
}