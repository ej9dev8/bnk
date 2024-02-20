/*해당 코드 사용하는 위치 내에서만 불러오는 파일*/

function pwCheck(){//비밀번호 유효성 체크
	var pw = $('input[name=CU_PW]').val();
	var pwCheck = $('input[name=CU_PW_CHECK]').val();
	var regNum = /.*[0-9].*/;
	var regEng = /.*[A-Za-z].*/;
	var regExp = /[\{\}\[\]\/?.,;:|\)*~`!^\-+<>@\#$%&\\\=\(\'\"]/gi;
	if(pw==''){
		var msg = '비밀번호를 입력해주세요.';
		$("#pwCheck").text(msg);
		return msg;
	}else if(!(regNum.test(pw) && regEng.test(pw) && regExp.test(pw) && pw.length > 9 && pw.length < 21)){
		var msg = '비밀번호는 영문, 숫자, 특수문자 조합의 10~20자 사용 가능합니다.';
		$("#pwCheck").text(msg);
		return msg;
	}else{
		$("#pwCheck").text('');
		if(pwCheck!=''){
			if(pw != pwCheck){
				var msg = '비밀번호가 일치하지 않습니다.';
				$('#pwCheck2').text(msg);
				return msg;
			}else{
				$("#pwCheck2").text('');
				return "OK";
			}
		}else{
			var msg = '비밀번호 확인을 입력해주세요.';
			$("#pwCheck2").text(msg);
			return msg;
		}
	}
}