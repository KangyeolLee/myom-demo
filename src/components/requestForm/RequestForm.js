import React, { Component } from 'react';
import './requestForm.css'
import RequestStep1 from './RequestStep1'
import RequestStep2 from './RequestStep2'
import RequestStep3 from './RequestStep3'
import { sendRequest } from '../../store/actions/requestFormAction';
import { connect } from 'react-redux'

class RequestForm extends Component {
	state = {
		currentStep: 1,
		tripLocation: '',
		editStyle: [
			{id: 1, value: '시네마틱형', isChecked: false},
			{id: 2, value: '다이나믹형', isChecked: false},
			{id: 3, value: '다큐멘터리형', isChecked: false},
			{id: 4, value: '브이로그형', isChecked: false},
			{id: 5, value: '예능형', isChecked: false},
			{id: 6, value: '기타 :', isChecked: false},
		],
		editFeeling: [
			{id: 1, value: '감각적인', isChecked: false},
			{id: 2, value: '사실적인', isChecked: false},
			{id: 3, value: '잔잔한', isChecked: false},
			{id: 4, value: '색감좋은', isChecked: false},
			{id: 5, value: '감성적인', isChecked: false},
			{id: 6, value: '이목끄는', isChecked: false},
			{id: 7, value: '트렌디한', isChecked: false},
			{id: 8, value: 'B급병맛', isChecked: false},
			{id: 9, value: '신나는', isChecked: false},
		],
		// hasReference: [
		// 	{id: 1, value: 'on', isChecked: false},
		// 	{id: 2, value: 'on', isChecked: false},
    // ],
    hasReference: '',
		referenceLink: '',
		purpose: [
			{id: 1, value: '개인소장', isChecked: false},
			{id: 2, value: 'SNS 업로드', isChecked: false},
			{id: 3, value: '홍보영상', isChecked: false},
			{id: 4, value: '기타 : ', isChecked: false},
    ],
    musicFree: '',
		// musicFree: [
		// 	{id: 1, value: '무료음원', isChecked: false},
		// 	{id: 2, value: '유료음원', isChecked: false},
		// ],
		// whatKindOfMusic: [
		// 	{id: 1, value: '신나는', isChecked: false},
		// 	{id: 2, value: '감성적인', isChecked: false},
		// 	{id: 3, value: '잔잔한', isChecked: false},
		// 	{id: 4, value: '트렌디한', isChecked: false},
		// ],
		wantMusic: '',
		// editTechnique: [
		// 	{id: 1, value: '모션그래픽', isChecked: false},
		// 	{id: 2, value: '색 보정', isChecked: false},
		// 	{id: 3, value: '밝기 조정', isChecked: false},
		// 	{id: 4, value: '더빙', isChecked: false},
		// 	{id: 5, value: '3D', isChecked: false},
		// ],
		// subtitle: [
		// 	{id: 1, value: '자막없이 해주세요.', isChecked: false},
		// 	{id: 2, value: '오프닝과 엔딩, 장소별 이름정도', isChecked: false},
		// 	{id: 3, value: '여행지의 정보는 들어갔으면 좋겠어요.', isChecked: false},
		// 	{id: 4, value: '멘트들이 어느정도 자막화됐으면 좋을 것 같아요.', isChecked: false},
		// 	{id: 5, value: '기타', isChecked: false},
		// ],
		// subtitle_font: '',
		// essential_cut: [
		// 	{id: 1, value: '예', isChecked: false},
		// 	{id: 2, value: '아니요', isChecked: false},
    // ],
    essential_cut: '',
		edit_order: [
			{id: 1, value: '시간의 흐름', isChecked: false},
			{id: 2, value: '색감 맞춰서', isChecked: false},
			{id: 3, value: '편집자님께 맡길게요.', isChecked: false},
		],
		// etc_requests: '',
  }
  componentDidMount() {
    const inputs = document.querySelector('.input-field input');
    inputs.focus();
    inputs.select();
  }
  componentDidUpdate(prevProps, prevState) {
    if(prevState.currentStep !== this.state.currentStep) {
      const helperTexts = [...document.querySelectorAll('.progress-helper-text')];
      helperTexts.map((text, index) => {
        if(index < this.state.currentStep) {
          text.style.display = 'block';
        }

        if(index === this.state.currentStep-1) text.classList.add('active');
        else text.classList.remove('active');
      })

      // const inputs = document.querySelector('.input-field input');
      // if(inputs) {
      //   console.log(inputs);
      //   inputs.focus();
      //   inputs.select();
      // } else return;
    }
  }
  handleTrueOrFalse = (e) => {
    const original_id = e.target.id;
    const state_key = original_id.split('-')[0];
    const value = original_id.split('-')[1];

    this.setState({
      [state_key]: value,
    });
  }
	handleChange = (e) => {
		this.setState({
			[e.target.id] : e.target.value
		})
	}

	handleSubmit = (e) => {
		e.preventDefault();
	}
	
	handleCheck = (e) => {
		let chkElementName = e.target.closest('div').id;
		let checkElements = this.state[chkElementName];
		checkElements.forEach(chkElement => {
			if(chkElement.value === e.target.value)
				chkElement.isChecked = e.target.checked
		})
		this.setState({
			chkElementName : checkElements
		})
	}

	_submit = () => {
		this.props.sendRequest(this.state, this.props.history, this.props.match.params.id);
	}
	_next = () => {
		const required_all = [...document.querySelectorAll('._required')];
		let current_required = required_all.filter(item => !(this.state[item.id]));
		if(current_required.length){
			this.setState({
				need: true,
			})
			return;
		}

		let currentStep = this.state.currentStep;
		currentStep = currentStep >= 2? 3 : currentStep +1 ;
		this.setState({
			currentStep,
			need: false,
		})
	}

	_prev = () => {
		let currentStep = this.state.currentStep;
		currentStep = currentStep <= 1? 1: currentStep -1;
		this.setState({
			currentStep,
		})
	}

	render(){ 
		return(
			<div className="requestForm container notoSans" >
        <div className="row progress-bar"> 
          <div className="progress col s12">
            <div style={{width: (50 * (this.state.currentStep-1)) + '%'}} className="determinate"></div>
            <span className='progress-helper-text active'>STEP1</span>
            <span className='progress-helper-text'>STEP2</span>
            <span className='progress-helper-text'>STEP3</span>
          </div>
        </div>

        <div className="row">
          <form onSubmit={this.handleSubmit} className='col s12'>
						<RequestStep1
							currentStep = {this.state.currentStep}
							need = {this.state.need}
							tripLocation = {this.state.tripLocation}
							handleChange = {this.handleChange}
							editStyle = {this.state.editStyle} 
							editFeeling = {this.state.editFeeling}
							handleCheck = {this.handleCheck}/>

						<RequestStep2
							currentStep = {this.state.currentStep}
							need={this.state.need}
							handleChange = {this.handleChange}
							handleCheck = {this.handleCheck}
              handleTrueOrFalse={this.handleTrueOrFalse}
							hasReference = {this.state.hasReference}
							referenceLink = {this.state.referenceLink} 
							purpose = {this.state.purpose} />

            <RequestStep3
              currentStep = {this.state.currentStep}
              need={this.state.need}
              handleChange = {this.handleChange}
              handleCheck = {this.handleCheck}
              handleTrueOrFalse={this.handleTrueOrFalse}
              musicFree = {this.state.musicFree}
              wantMusic = {this.state.wantMusic}
              essential_cut = { this.state.essential_cut }
              edit_order = {this.state.edit_order} />
											
						
            <div className="btn-wrapper row">
              <div className="col s12">
              { this.state.currentStep < 3 ? <button onClick={this._next} className='btn myomColor-background right'>다음</button> : null }
              { this.state.currentStep !== 1 ? <button onClick={this._prev} className='btn myomColor-background left'>이전</button> : null }
              { this.state.currentStep === 3 ? <button onClick={this._submit} className='btn myomColor-background right'>제출하기</button> : null }
              </div>
            </div>

						
					</form>	
        </div>

			</div>
		)
	}
}

const mapDispatchToProps = (dispatch) => {
	return{
		sendRequest: (requestData, history, purchased_id) => dispatch(sendRequest(requestData , history, purchased_id))
	}
}

export default connect(null,mapDispatchToProps)(RequestForm);