import React from 'react'
import firebase from 'firebase/app';

const ProviderRegisterStep1 = (props) => {
  if(props.currentStep !== 1) return null;

  const noEnter = (e) => {
    if(e.keyCode === 13) e.preventDefault();
  }

  return (
    <div className="row ProviderRegisterStep1">
      <h5 className="left col s10 offset-s1 scorehvy">프로필 소개란</h5>

      <div className="profile-area input-field file-field col s10 offset-s1">   
      {
        (props.profileImg)
          ? (
            <div className="btn-floating grey lighten-2 z-depth-0 col m5 s12">
              <img className='profile-img' src={props.profileImg} alt="프로필 이미지"/>
              <input id='profile-img' onChange={(e) => props.handleImgUpload(e)} type="file" className='img-uploader required'/>
            </div>
          )
          : (
            <div className="btn-floating grey lighten-2 z-depth-0 col s4">
              {
                (props.profile.profileImgURL === '/img/defaults/userProfile.jpeg')
                  ? <img src="/img/defaults/userProfile.jpeg" alt="유저 기본 프로필 이미지" className="profile-img"/>
                  : <img src='/img/defaults/lazy-loading.png' data-src={firebase.storage().refFromURL(props.profile.profileImgURL).getDownloadURL().then(url => {
                    const profile = document.getElementById('original-downloadedImg');
                    profile.src = url;
                  })} className="profile-img" id='original-downloadedImg' alt='유저 프로필 이미지' />
              }
              {/* <img src={props.profile.profileImgURL === '/img/defaults/userProfile.jpeg' ? '/img/defaults/userProfile.jpeg' : '/img/defaults/lazy-loading.png'} alt="프로필 이미지" className="profile-img" id='original-downloadedImg'/> */}
              {/* <i className="material-icons large">person</i> */}
              <input onChange={(e) => props.handleImgUpload(e)} type="file" className='img-uploader required'/>
            </div>
          )
      }
          
        <div className="profileImg-desc col m7 s12 right">
          <p>
            <strong className='scorelt' style={{fontWeight: 'bolder'}}>프로필 사진을 설정해주세요!</strong><font color='red'> (5MB 이하)</font><br/>
            프로필 사진은 소비자에게 노출되는 항목이므로 신뢰도를 줄 수 있는 사진을 추천 드립니다. <br/>
            개인 프로필 사진이나, 본인을 잘 나타낼 수 있는 섬네일 이미지 등을 골라보세요!
          </p>
        </div>
        {
          (!props.profileImg && props.need)
            ? <span className='right red-text'>프로필 이미지를 꼭 선택해주세요!</span>
            : null
        }
      </div>

      <div className="input-field col s10 offset-s1">
        <textarea id='intro' value={props.intro} onChange={props.handleChange} type="text" className='materialize-textarea required'/>
        <label htmlFor="intro" className={props.intro ? 'active' : ''}>한 줄 소개</label>
        {
          (!props.intro && props.need)
            ? <span className='right red-text'>한 줄 소개를 꼭 작성해주세요!</span>
            : null
        }
      </div>

      <h5 style={{marginBottom: '1.5rem'}} className="left col s10 offset-s1 scorehvy">본인 편집영상의 느낌 및 분위기</h5>
      <div className="input-field col s10 offset-s1">
        <label id='personal-feeling-label' htmlFor="personal-feeling" className='active'>자신만의 느낌</label>
        <input onKeyDown={(e) => noEnter(e)} placeholder='예시) 센스있는, 신나는, 따뜻한 ...' type="text" id='personal_feelings' onChange={props.handleChange} value={props.personal_feelings}/>
        <span className="helper-text red-text">본인이 생각하는 자신 영상의 특징이나 강점이 있다면 적어주세요!</span>
      </div>

    </div>
  )
}

export default ProviderRegisterStep1;