// 新增合同
import React, { Component } from 'react';

import { Page, Icon } from 'react-onsenui';

import { AppCore, resetTo, AppMeta, goTo, Enum, loadIfEmpty, goBack, trigger, submit, post, get_req_data,resetToLv2Page, reload,resetToTab} from '../util/core';
import { pullHook, loginToPlay, OpDialog, SupplierDialog, ErrorBoundary, info, footer, nonBlockLoading, confirm } from '../util/com';
import { connect } from 'react-redux';


import '../css/OrderEditPage.css';
import '../css/Contract.css';

import { ProDetail, CustomerInfo, PickSingle, ToursList, OrderReceivable, OrderShould, OrderProfits, OrderNote } from '../util/order'


class AddContract3 extends Component {

    constructor(props) {
        super(props);

        this.state = {
            other_com: '',
            data : {
            }
        };
    }

    componentWillMount(){
        this.setState({data: this.props.p.data})
    }

    // 选择开户行 && 保险
    selectBank(val){
        let data = this.state.data
        data['收款账户-电子合同'] = []
        data['收款账户-电子合同'][0] = {}
        data['收款账户-电子合同'][0].to_bank = val
        data['收款账户-电子合同'][0].to_account_num = val
        data['收款账户-电子合同'][0].to_user_name = val
        this.setState({data: data})
    }
    selectInsurance(val){
        let data = this.state.data
        data['保险详情'] = []
        data['保险详情'][0] = {}
        data['保险详情'][0].agree = val
        if (val === '3') {
            data['保险详情'][0].product = '旅游人身意外险(以实际保单为准)';
        } else {
            data['保险详情'][0].product = '';
        }

        this.setState({ data: data })
    }
    changeInsuranceCom(e){
        let data = this.state.data
        data['保险详情'][0].product = e.target.value
        this.setState({ data: data })
    }
    // 
    goToOrderPage(e) {
        let prompt = this.state.data.contract_state == 2 ? '是否确认返回合同列表页？' : '是否确认返回订单页？'                
        confirm(prompt).then(r => {
            if (r) {
                if (this.state.data.contract_state == 2){
                    resetToLv2Page('合同列表')
                    return
                }
                if (AppCore.TabPage) {
                    reload(AppCore.OrderPage)
                    resetToTab('订单页',1)
                }
            }
        });
    }

    prevPage(){
        goBack()
    }
    nextPage(){
        if (this.Verification())return;
        let data = this.props.p.data
        if(this.state.data.contract_state==2){
            goTo('修改合同4', { data:data,action: this.props.p.action})
        }else{
            goTo('新增合同4', { data:data,action: this.props.p.action})
        }
    }

    Verification(){
        let data = this.props.p.data
        if (!data['收款账户-电子合同'][0].to_bank) { info('请选择开户行'); return true }
        if (!this.state.data['保险详情'][0].agree && this.state.data['保险详情'][0].agree!==0) { info('请选择意外保险'); return true }
        return false
    }


    renderToolbar() {
        return (
            <ons-toolbar>
                <div className='left goBack-img-box'>
                    <img src="img/back.png" onClick={e => this.goToOrderPage()} className="goBack-img" />
                </div>
                <div className={(AppCore.os === 'ios' ? "" : "Andriod-title") + " center"}>{this.state.data.contract_state==2? '修改合同':'新增合同'}</div>

            </ons-toolbar>
        );
    }


    render() {
        return (
            <Page renderToolbar={_ => this.renderToolbar()} onShow={_ => loadIfEmpty(this, this.afterLoad)}
            >
                {!this.state.data && nonBlockLoading()}
                {Object.keys(this.state.data).length>0 &&
                    <div>
                        <div className="add-con-mod">
                            <div className="add-con-title">
                                <div>收款账户</div>
                                <div style={{lineHeight:"20px", paddingBottom:'10px'}}>甲方按照上述支付方式向乙方支付款项,除上述支付方式外,甲方不得以任何方式向第三方或和人账户支付款项,否则乙方不予认可,由此造成的损失由甲方自行承担</div>
                            </div>
                            <div className="add-con-main">
                                <div className="add-con-cell">
                                    <div className="add-con-cell-left">开户行: </div>
                                    <div className="add-con-cell-right">
                                        <select className="add-con-cell-right-select"
                                            onChange={e => this.selectBank(e.target.value)} 
                                            value={this.state.data['收款账户-电子合同'].length>0?this.state.data['收款账户-电子合同'][0].to_bank : ''}>
                                            <option value='' >请选择</option>
                                            {
                                                Object.keys(Enum['ReceivingBank']).map(_k =>
                                                    <option key={_k} value={_k}>{Enum['ReceivingBank'][_k]}</option>
                                                )
                                            }
                                        </select>  
                                    </div>
                                </div>
                                <div className="add-con-cell">
                                    <div className="add-con-cell-left">户名: </div>
                                    <div className="add-con-cell-right">
                                        <input className="add-con-cell-right-input" placeholder="请选择开户行" disabled={true}
                                        onChange={_=>false}    
                                        value={(Enum['ReceivingBankUserName'][this.state.data['收款账户-电子合同'][0].to_bank])||''} />
                                    </div>
                                </div>
                                <div className="add-con-cell">
                                    <div className="add-con-cell-left">账号: </div>
                                    <div className="add-con-cell-right">
                                        <input className="add-con-cell-right-input" placeholder="请选择开户行" disabled={true}
                                        onChange={_ => false}    
                                        value={(Enum['ReceivingAccountNum'][this.state.data['收款账户-电子合同'][0].to_bank])||''} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="add-con-mod">
                            <div className="add-con-title">意外保险</div>
                            <div className="add-con-main">
                                <div className="add-con-cell">
                                    <div className="add-con-cell-left">保险购买: </div>
                                    <div className="add-con-cell-right">
                                        <select className="add-con-cell-right-select"
                                            onChange={e => this.selectInsurance(e.target.value)} defaultChecked={this.state.data['保险详情'][0].agree}
                                            value={this.state.data['保险详情'][0].agree}>
                                            {
                                                Object.keys(Enum['InsuranceAgree']).map(_k =>
                                                    <option key={_k} value={_k}>{Enum['InsuranceAgree'][_k]}</option>
                                                )
                                            }
                                        </select>  
                                    </div>
                                </div>
                                <div className="add-con-cell">
                                    <div className="add-con-cell-left">保险产品名称: </div>
                                    <div className="add-con-cell-right">
                                        <input className="add-con-cell-right-input" placeholder="请填写备注" disabled={true}
                                            value={this.state.data['保险详情'].length > 0 ? this.state.data['保险详情'][0].product:''} 
                                            disabled={this.state.data['保险详情'].length>0?(this.state.data['保险详情'][0].agree==3):false}
                                            onChange={e => this.changeInsuranceCom(e)} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="add-con-btn-box">
                            <div className="add-con-btn" onClick={_ => this.prevPage()}>上一页</div>
                            <div className="add-con-btn" onClick={_ => this.nextPage()}>下一页</div>
                        </div>
                    </div>
                }
            </Page>
        );
    }
}

export default connect(s => ({ s: s }))(AddContract3)