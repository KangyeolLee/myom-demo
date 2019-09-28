import React, { Component } from 'react'
import { connect } from 'react-redux';
import { createService } from '../../store/actions/serviceFormAction';
import M from 'materialize-css';
import CreateServiceStep1 from './CreateServiceStep1';
import CreateServiceStep2 from './CreateServiceStep2';
import CreateServiceStep3 from './CreateServiceStep3';
import './createService.css'
import CreateServiceStep4 from './CreateServiceStep4';

class CreateService extends Component {
  state = {
    currentStep: 1,
    priority1: '', 
    priority2: '', 
    priority3: '',
    service_title: '',
    service_content: '',
    files: [
      {thumbnail_file: '', thumbnail_file_preview: ''},
      {sub_file1: '', sub_file1_preview: '',},
      {sub_file2: '', sub_file2_preview: '',},
      {sub_file3: '', sub_file3_preview: '',},
      {sub_file4: '', sub_file4_preview: '',},
      {sub_file5: '', sub_file5_preview: '',},
    ],
    basic_price: 11,
    basic_intro: '',
    basic_working: '',
    basic_modify: '',
    pro_price: 17,
    pro_intro: '',
    pro_working: '',
    pro_modify: '',
  }
  componentDidMount() {
    M.AutoInit();
  }
  componentDidUpdate(prevProps, prevState) {
    if(prevState.currentStep !== this.state.currentStep) {
      // M.AutoInit();
      M.CharacterCounter.init(document.querySelectorAll('.has-character-counter'));
    }
    if(prevState.currentStep !== this.state.currentStep && this.state.currentStep === 4) {
      M.Chips.init(document.querySelector('#basic-options'), {
        data: [
          { tag: '자막' },
          { tag: '음악' },
          { tag: '컷편집' },
        ],
        limit: 5,
        onChipDelete: () => {
          const chips = [...document.querySelectorAll('#basic-options .chip')];
          const filter = chips.filter(item => item.className === 'chip');
          const chip_value = filter.map(item => item.innerText.split('\n')[0]);

          this.setState({
            basic_chips: chip_value,
          })
        },
      });

      M.Chips.init(document.querySelector('#pro-options'), {
        data: [
          { tag: '자막' },
          { tag: '음악' },
          { tag: '컷편집' },
          { tag: '기본 색보정' },
        ],
        limit: 8,
        onChipDelete: () => {
          const chips = [...document.querySelectorAll('#pro-options .chip')];
          const filter = chips.filter(item => item.className === 'chip');
          const chip_value = filter.map(item => item.innerText.split('\n')[0]);

          this.setState({
            pro_chips: chip_value,
          })
        },
      });

      const chips = [...document.querySelectorAll('.chip')];
      chips.forEach(item => { 
        item.classList.add('initial');
        item.removeAttribute('tabindex');
      });
    }
  }
  handleSubmit = (e) => {
    e.preventDefault();
    const required_all = [...document.querySelectorAll('._required')];
    let current_required = required_all.filter(item => !(this.state[item.id]) && !(this.state.files[0][item.id]));
    console.log(current_required)
    if(current_required.length) {
      this.setState({
        need: true,
      })
      return;
    }

    this.props.createService(this.state);
  }
  handleChips = (e) => {
    if(e.keyCode === 13 && e.target.id === 'basic_additional') {
      const chips = [...document.querySelectorAll('#basic-options .chip')];
      const filter = chips.filter(item => item.className === 'chip');
      const chip_value = filter.map(item => item.innerText.split('\n')[0]);

      this.setState({
        basic_chips: chip_value,
      })
    }
    else if(e.keyCode === 13 && e.target.id === 'pro_additional') {
      const chips = [...document.querySelectorAll('#pro-options .chip')];
      const filter = chips.filter(item => item.className === 'chip');
      const chip_value = filter.map(item => item.innerText.split('\n')[0]);

      this.setState({
        pro_chips: chip_value,
      })
    }
  }
  handleKeyPress = (e) => {
    if(e.charCode === 13) e.preventDefault();
  }
  handleChange = (e) => {
    e.preventDefault();

    this.setState({
      [e.target.id]: e.target.value,
    })
  }
  handleRange = name => (e, value) => {
    e.preventDefault();
    this.setState({
      [name]: value,
    })
  }
  handleUpload = (e) => {
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];
    let target_id = e.target.id;

    reader.onloadend = () => {
      this.setState(prevState => ({
        files: prevState.files.map( item => 
          item.hasOwnProperty(target_id) 
            ? { [target_id]: file, [target_id + '_preview']: reader.result } 
            : item
        )
      }))
    }

    if(file) {
      reader.readAsDataURL(file);
      e.target.value = '';
    }
  }
  deleteImage = (e) => {
    e.preventDefault();
    let target_id = e.target.id;
    this.setState(prevState => ({
      files: prevState.files.map( item => 
        item.hasOwnProperty(target_id) 
          ? { [target_id]: '', [target_id + '_preview']: '' } 
          : item
      )
    }))
  }
  _next = () => {
    const required_all = [...document.querySelectorAll('._required')];
    let current_required = required_all.filter(item => !(this.state[item.id]) && !(this.state.files[0][item.id]));
    console.log(current_required)
    if(current_required.length) {
      this.setState({
        need: true,
      })
      return;
    }

    let currentStep = this.state.currentStep;
    currentStep = currentStep >= 3 ? 4 : currentStep + 1;
    this.setState({
      currentStep,
      need: false,
    })
  }
  _prev = () => {
    let currentStep = this.state.currentStep;
    currentStep = currentStep <= 1 ? 1 : currentStep - 1;
    this.setState({
      currentStep,
    })
  }

  render() {
    console.log(this.state);
    return (
      <div className="container createService">
        <div className="row">
          <div style={{height: '.8rem'}} className="progress col s8 offset-s2">
            <div style={{width: Math.floor(25 * this.state.currentStep) + '%'}} className="determinate"></div>
          </div>
        </div>

        <form className='row'>
          <div className="card col s8 offset-s2">
            <CreateServiceStep1 currentStep={this.state.currentStep} 
              need={this.state.need}
              priority1={this.state.priority1} 
              priority2={this.state.priority2} 
              priority3={this.state.priority3}
              handleChange={this.handleChange} />
            <CreateServiceStep2 currentStep={this.state.currentStep}
              need={this.state.need}
              handleKeyPress={this.handleKeyPress}
              handleChange={this.handleChange} 
              service_title={this.state.service_title} 
              service_content={this.state.service_content} />
            <CreateServiceStep3 currentStep={this.state.currentStep}
              need={this.state.need}
              handleUpload={this.handleUpload}
              deleteImage={this.deleteImage}
              files={this.state.files} />
            <CreateServiceStep4 currentStep={this.state.currentStep}
              need={this.state.need}
              handleChips={this.handleChips}
              handleKeyPress={this.handleKeyPress}
              handleChange={this.handleChange}
              handleRange={this.handleRange} 
              basic_price={this.state.basic_price} 
              basic_intro={this.state.basic_intro} 
              basic_working={this.state.basic_working}
              basic_modify={this.state.basic_modify} 
              pro_price={this.state.pro_price}
              pro_intro={this.state.pro_intro}
              pro_working={this.state.pro_working}
              pro_modify={this.state.pro_modify} />
            
          </div>

          <div className="card col s8 offset-s2 z-depth-0 hidden">
            { this.state.currentStep < 4 ? <div onClick={this._next} className="btn blue darken-4 right">다음</div> : null }
            { this.state.currentStep !== 1 ? <div onClick={this._prev} className="btn grey darken-2 left">이전</div> : null }
            { this.state.currentStep === 4 ? <div onClick={this.handleSubmit} className='btn red lighten-3 right'>등록</div> : null }
          </div>
          
          
        </form>
      </div>
    )
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    createService: (serviceData) => dispatch(createService(serviceData)),
  }
}
export default connect(null, mapDispatchToProps)(CreateService);