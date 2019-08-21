import React, { Component } from 'react'
import M from 'materialize-css';
import './profitsManage.css';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

class ProfitsManage extends Component {
  componentDidMount() {
    M.AutoInit();
  }

  render() {
    const data = [
      { name: '2019-04', uv: 400, pv: 2400, amt: 2400},
      { name: '2019-05', uv: 300, pv: 2400, amt: 2400},
      { name: '2019-06', uv: 200, pv: 2400, amt: 2400},
      { name: '2019-07', uv: 100, pv: 2400, amt: 2400},
      { name: '2019-08', uv: 500, pv: 2400, amt: 2400}
    ];
    const renderLineChart = (
      <LineChart width={958} height={300} data={data}>
        <Line type='monotone' dataKey='uv' stroke='red' />
        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
      </LineChart>
    )
    return (
      <div className="profitsManage">
        <div className="row">
          <h4>수익관리</h4>
          <div className="profits_details collection s12">
            <div className="collection-wrapper col s6">
              <i className="material-icons large">attach_money</i>
              <div>
                <p>출금가능 수익금</p>
                <h5>0원</h5>
              </div>          
            </div>

            <div className="collection-wrapper col s3 center">
              <h5>예상 수익금</h5>
              <p>0원</p>
            </div>

            <div className="collection-wrapper col s3 center">
              <h5>출금 완료 수익금</h5>
              <p>0원</p>
            </div>
          </div>

          <p className="right">일별 | 월별</p>
          <div className="recharts s12">
            { renderLineChart }
          </div>

          <div className="col s12">
            <ul className="tabs">
              <li className="tab col s3"><a href="#profitsLog">수익금 내역</a></li>
              <li className="tab col s3"><a href="#depositsLog">출금내역</a></li>
              <li className="tab col s3"><a href="#taxDetails">월별 수수료 세금계산서</a></li>
            </ul>
          </div>

          <div id="profitsLog">
            <div className="input-field col s1">
              <select name="" id="profits_range">
                <option value="1">전체</option>
                <option value="2">완료</option>
                <option value="3">진행중</option>
                <option value="4">취소</option>
              </select>
            </div>
            <div className="collection col s12">
              <div className="collection-wrapper">
                <i className="material-icons large">info_outline</i>
                <p>내역이 없습니다</p>
              </div>
            </div>
          </div>

          <div id="depositsLog">
            <div className="collection">
              <div className="collection-wrapper">
                <i className="material-icons large">info_outline</i>
                <p>내역이 없습니다</p>
              </div>
            </div>
          </div>

          <div id="taxDetails">
            <div className="collection">
              <div className="collection-wrapper">
                <i className="material-icons large">info_outline</i>
                <p>내역이 없습니다</p>
              </div>
            </div>
          </div>
        </div>

        <div className="collection row grey lighten-4">
          <div className="col s12 warning">
            <span><i style={{fontSize: '18px'}} className="material-icons left">error_outline</i> 꼭 확인해주세요!</span><br/>
            <span><i style={{fontSize: '18px'}} className="material-icons left">check</i> 할인 쿠폰을 적용해서 구매한 의뢰인에게는 쿠폰 금액 제외한 금액으로 세금계산서를 발행해야 합니다.</span><br/>
            <span><i style={{fontSize: '18px'}} className="material-icons left">check</i> 크몽이 전문가에게 할인된 쿠폰 금액에 대해 보전하여 수익금으로 정산하기 때문에 매출 신고 시에는 전체 판매 금액으로 신고해야 합니다.</span><br/>
            <span>(적립캐시 사용은 할인쿠폰 적용과 무관하니 일반 거래건과 동일하게 진행해주시길 바랍니다.)</span><br/><br/>
            <span><i style={{fontSize: '18px'}} className="material-icons left">error_outline</i> 매출신고 방법 안내!</span><br/>
            <span><i style={{fontSize: '18px'}} className="material-icons left">check</i> 크몽은 전문가의 매출 신고방법을 따로 안내해 드리지 않으며 매출 신고와 관련된 문의사항은 국세청이나 세무사무실에 문의바랍니다.</span><br/>
            <span><i style={{fontSize: '18px'}} className="material-icons left">check</i> 월별 출금내역은 세무 신고 시의 참고이며 반드시 귀사의 회계자료와 비교 후 처리하시기 바랍니다.</span><br/>
          </div>
        </div>
      </div>
    )
  }
}

export default ProfitsManage;