// 新增合同
import React, { Component } from 'react';

import { Page, Icon } from 'react-onsenui';

import { AppCore, resetTo, AppMeta, goTo, Enum, loadIfEmpty, goBack, trigger, submit, post, get_req_data, reload,resetToTab,resetToLv2Page } from '../util/core';
import { pullHook, loginToPlay, OpDialog, SupplierDialog, ErrorBoundary, info, footer, nonBlockLoading, confirm } from '../util/com';
import { connect } from 'react-redux';


import '../css/OrderEditPage.css';
import '../css/Contract.css';

import { ProDetail, CustomerInfo, PickSingle, ToursList, OrderReceivable, OrderShould, OrderProfits, OrderNote } from '../util/order'


class AddSingleContract2 extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data:{},
        };
    }

    componentWillMount(){
        let data = this.props.p.data
        this.setState({ data:data })
    }
    afterLoad(){
    }
    // 委托
    weituoSelect(item,index){
        let data = this.props.p.data
        if (data['委托项目'][index].choose ===1){
            data['委托项目'][index].choose = 0
        }else{
            data['委托项目'][index].choose = 1
        }
        this.setState({data:data})
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
    pervPage() {
        goBack()
    }
    nextPage() {
        if (this.Verification()) return;
        let data = this.state.data
        goTo('新增单项合同3', { data: data,action: this.props.p.action})
    }
    Verification() {
        let data = this.state.data
        if (data['委托项目'].find(item=>item.choose === 1)){
            return false
        }
        info('请至少选择一项委托项目');
        return true
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
                {this.state.data &&
                    <div>
                        <div className="add-con-mod">
                            <div className="add-con-title">订单信息</div>
                            <div className="add-con-main">
                                <div className="add-con-cell" style={{ borderBottom: '1px solid #d9d9d9' }}>
                                    <div className="add-con-cell-left">订单号: </div>
                                    <div className="add-con-cell-right">
                                        <span>D0{this.state.data['订单信息-合同'][0].order_id}</span>
                                    </div>
                                </div>
                                {/* 订单详情 */}
                                <div className="contract-item" style={{ padding: '0' }}>
                                    <div className="contract-item-main">
                                        <div className="contract-item-name">{this.state.data['订单信息-合同'][0].pd_name}    </div>
                                        <div className="contract-main-cell">
                                            <span className="contract-cell-main">
                                                创建日期: {this.state.data['订单信息-合同'][0].create_at.split(' ')[0]}</span>
                                            <span className="contract-cell-main" style={{ textAlign:    'center' }}>
                                                出团日期: {this.state.data['订单信息-合同'][0].dep_date}</span>
                                            <span className="contract-cell-main" style={{ textAlign: 'right'    }}>
                                                人数: {this.state.data['订单信息-合同'][0].num_of_people}</span>
                                        </div>
                                        <div className="contract-main-cell">
                                            <span className="contract-cell-main">
                                                合同金额: {this.state.data['订单信息-合同'][0].receivable}</span>
                                            <span className="contract-cell-main text-overflow" style={{     textAlign: 'center' }} >
                                                产品提供方: {this.state.data['订单信息-合同'][0].pd_provider}</span>
                                            <span className="contract-cell-main" style={{ textAlign: 'right'    }}>
                                                合同状态: {Enum.ElcContractState[this.state.data.contract_state]}</span>
                                        </div>
                                        <div className="model-main-item-box">
                                            {this.state.data['游客名单-合同'].map((item, index) =>
                                                <div className="model-main-item" key={index}>
                                                    <span>{index + 1}</span>
                                                    <span>{item.name}</span>
                                                    <span>{Enum.Gender[item.gender]}</span>
                                                    <span>{item.birthday}</span>
                                                    <span>{Enum.Certificate[item.certificate_type]}</span>
                                                    <span>{item.certificate_num}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="add-con-mod">
                            <div className="add-con-title">委托项目</div>
                            <div className="add-con-main">
                            {this.state.data['委托项目'] &&
                                this.state.data['委托项目'].map((item,index)=>
                                <div className="add-con-cell" style={{ display: 'block' }} key={index}>
                                    <div className="add-con-cell-left">
                                        <input type="checkbox" id={'委托项目' + index} name="yd" checked={(item.choose-0 === 1)?true:false}
                                        value={index} onChange={e => this.weituoSelect(item,index)} />
                                        <label htmlFor={'委托项目' + index}>同意</label> {item.value}
                                    </div>
                                </div>
                                )}

                            </div>
                        </div>

                        <div className="add-con-btn-box">
                            <div className="add-con-btn" onClick={_ => this.pervPage()}>上一页</div>
                            <div className="add-con-btn" onClick={_ => this.nextPage()}>下一页</div>
                        </div>
                    </div>
                }
            </Page>
        );
    }
}

export default connect(s => ({ s: s }))(AddSingleContract2)