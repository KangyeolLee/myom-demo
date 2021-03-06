import { _initJoin_login } from '../actions/chatAction';

const initState = {
  authError: null,
  nickNameError: null,
}

const authReducer = (state=initState, action) => {
  switch(action.type) {
    case 'LOGIN_ERROR':
      console.log(action.err);
      return {...state, authError: 'Login Failed'}

    case 'NO_REGISTER_EMAIL_ERROR':
      console.log(action.err);
      return {...state, authError: '입력하신 이메일과 일치한 로그인 정보가 없습니다.'}
    
    case 'WRONG_PASSWORD_ERROR' :
      console.log(action.err);
      return {...state, authError: '이메일/패스워드를 확인해주세요.'}
    
    case 'LOGIN_SUCCESS':
      console.log('log in success');
      _initJoin_login();
      return {...state, authError: null}

    case 'SIGNOUT_SUCCESS':
      console.log('signout success');
      return state;

    case 'SIGNUP_SUCCESS':
      console.log('signup success');
      return {...state, authError: null, nickNameError: null }

    case 'SIGNUP_ERROR':
      console.log('signup error', action.err.message);
      return {...state, authError: action.err.message}

    case 'SIGNUP_NICKNAME_ERROR':
      console.log('nickname duplicated');
      return{...state, nickNameError: '이미 사용하고 있는 닉네임입니다.'}

    case 'DELETE_SUCCESS':
      alert('회원탈퇴에 성공하였습니다!');
      return state;
       
    case 'DELETE_ERROR':
      console.log('withdrawal failed')
      return state;
    
    case 'DELETE_RECENT_LOGIN_ERROR':
      alert('재로그인 후 시도해주세요!');
      return state;
    
    case 'PWDUPDATE_SUCCESS':
      window.location.replace('/');
      alert('비밀번호가 변경되었습니다.');
      return state;
    
    // case 'PWDUPDATE_ERROR':
    //   alert('변경할 비밀번호가 너무 짧거나 잘못되었습니다.');
    //   return state;
    
    case 'REAUTHENTICATE_ERROR':
      alert('기존의 비밀번호를 다시 입력해주세요.');
      return state; 
    
    case 'SENDRESETEMAIL_SUCCESS':
      alert('비밀번호 재설정 이메일을 발송해드렸습니다.');
      return state;

    case 'SENDRESETEMAIL_ERROR':
      alert('입력하신 이메일로 가입된 정보가 없습니다.');
      return state;
    
    case 'EMAILUSED_ERROR':
      alert('이미 가입된 이메일입니다.');
      return state;
    
    case 'EMAILINVALID_ERROR':
      alert('이미 가입됐으나 인증이 안된 이메일입니다. 이메일 인증을 해주세요.');
      return state;
    
    case 'OPERATION_ERROR':
      alert('회원가입 중 오류가 발생했습니다. 새로고침하고 다시 시도해주세요.');
      return state;
    
    case 'WEAKPWD_ERROR':
      alert('비밀번호가 보안에 취약합니다. 다시 설정해주세요.');
      return state;

    case 'SENDEMAILVERIFICATION_SUCCESS':
      alert('가입하신 이메일로 인증메일 발송되었습니다.');
      return state;
    
    case 'SENDEMAILVERIFICATION_ERROR':
      console.log('send verification email failed');
      return state;
    
    case 'PROFILEIMGREGISTER_SUCCESS':
      console.log('img register success');
      return state;
    
    case 'PROFILEIMGREGISTER_ERROR':
      alert('변경할 프로필 이미지를 등록해주세요.')
      return state;
    
    case 'EMAIL_FIND_SUCCESS':
      console.log('email find success');
      return state;
    
    case 'EMAIL_FIND_ERROR':
      console.log('email find error');
      return state;

    default:
      return state;
  }
}

export default authReducer;