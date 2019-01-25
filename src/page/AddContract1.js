// 新增合同
import React, { Component } from 'react';

import { Page, Icon } from 'react-onsenui';

import { AppCore, resetTo, AppMeta, goTo, Enum, loadIfEmpty, goBack, trigger, submit, post, get_req_data, reload } from '../util/core';
import { pullHook, loginToPlay, OpDialog, SupplierDialog, ErrorBoundary, info, footer, nonBlockLoading, confirm } from '../util/com';
import { connect } from 'react-redux';


import '../css/OrderEditPage.css';
import '../css/Contract.css';

import { ProDetail, CustomerInfo, PickSingle, ToursList, OrderReceivable, OrderShould, OrderProfits, OrderNote } from '../util/order'


class AddContract1 extends Component {

    constructor(props) {
        super(props);

        this.state = { 
            data: {},
        };
        if(this.props.p.data.contract_state==2){
            this.action = this.props.p.data.type_id == 1 ? '修改出境电子合同' : (this.props.p.data.type_id === 2?'修改国内电子合同':'修改单项电子合同')
        }else{
            this.action = this.props.p.data.type_id == 1 ? '新增出境电子合同-订单管理' : (this.props.p.data.type_id === 2?'新增国内电子合同-订单管理':'新增单项电子合同-订单管理')
        }
    }

    // 
    createPeopel(){
        return (
        this.props.s.user.company_name + "-" 
        + this.props.s.user.department_name + "-" 
        + this.props.s.user.employee_name
        )
    }
    changeZKInfo(e,key){
        let data = this.state.data
        data['签约详情'][0][key] = e.target.value
        this.setState({data: data})
    }
    emergencyContact(e,key){
        let data = this.state.data
        data['紧急联系人-合同'][0][key] = e.target.value
        this.setState({ data: data })
    }
    nextPage(){
        if(this.Verification())return;
        let data = this.state.data
        if(this.state.data.contract_state==2){
            if(this.props.p.data.type_id == 3){
                goTo('修改单项合同2', {data:data,type_id:this.props.p.data.type_id,action: this.action });
            }else{
                goTo('修改合同2', { data:data, type_id:this.props.p.data.type_id,action: this.action  });
            }
        }else{
            if(this.props.p.data.type_id == 3){
                goTo('新增单项合同2', {data:data, type_id:this.props.p.data.type_id,action: this.action });
            }else{
                goTo('新增合同2', { data:data, type_id:this.props.p.data.type_id,action: this.action  });
            }
        }
    }
    Verification(){
        let data = this.state.data
        if (!data['签约详情'][0].traveler) { info('请填写签约者姓名'); return true }
        if (!data['签约详情'][0].travelerid) { info('请填写签约者证件号'); return true }
        if (!data['签约详情'][0].travelmobile) { info('请填写签约者手机号'); return true }
        if (!data['签约详情'][0].travelemail) { info('请填写签约者邮箱'); return true }
        if (!data['签约详情'][0].addr) { info('请填写签约者地址'); return true }
        if (!data['签约详情'][0].tourist_name) { info('请填写游客姓名'); return true }
        var reg1=/^[\u4e00-\u9fa5 ]{2,20}$/; //中文
        var reg2=/^[a-zA-Z\/ ]{2,20}$/;  //英文
        var reg3=/^\d{11}$/;  //手机号
        var reg4=/^[A-Za-z0-9_.]+@[a-z0-9]+(\.[a-z]+){1,3}$/;  //邮箱
        if(!reg1.test(data['签约详情'][0].traveler)){
            if(!reg2.test(data['签约详情'][0].traveler)){info('无效的签约者姓名');return true}
        }
        if(!reg3.test(data['签约详情'][0].travelmobile)){info('无效的签约者手机号');return true}
        if(!reg4.test(data['签约详情'][0].travelemail)){info('无效的签约者邮箱');return true}
        return false
    }

    goToOrderPage(e){
        let prompt = this.state.data.contract_state == 2 ? '是否确认返回合同列表页？' :'是否确认返回订单页？'
        confirm(prompt).then(r => r && goBack())
    }
    afterLoad() {
    }


    renderToolbar() {
        return (
            <ons-toolbar>
                {/* <div className='left'><ons-back-button ></ons-back-button></div> */}
                <div className='left goBack-img-box'>
                    <img src="img/back.png" onClick={e => this.goToOrderPage()} className="goBack-img" />
                </div>
                <div className={(AppCore.os === 'ios' ? "" : "Andriod-title") + " center"}>
                        {this.state.data.contract_state === undefined?"":(this.state.data.contract_state==2? '修改合同':'新增合同')}
                </div>

            </ons-toolbar>
        );
    }


    render() {
        return (
            <Page renderToolbar={_ => this.renderToolbar()} onShow={_ => loadIfEmpty(this, this.afterLoad)}
            >
                {!this.state.data['签约详情'] && nonBlockLoading()}
                {Object.keys(this.state.data).length>0 && 
                <div>
                    <div className="add-con-mod">
                        <div className="add-con-title">合同信息</div>
                        <div className="add-con-main">
                            <div className="add-con-cell">
                                <div className="add-con-cell-left">合同类型: </div>
                                <div className="add-con-cell-right">
                                    <input className="add-con-cell-right-input" disabled={true}
                                    onChange={_ => false}
                                    value={Enum.ContractType[this.state.data['电子合同编辑'][0].type_id]} />
                                </div>
                            </div>
                            <div className="add-con-cell">
                                <div className="add-con-cell-left">合同编号: </div>
                                <div className="add-con-cell-right">
                                    <input className="add-con-cell-right-input" disabled={true}
                                    value={this.state.data['电子合同编辑'][0].contract_num} onChange={_ => false} />
                                </div>
                            </div>
                            <div className="add-con-cell">
                                <div className="add-con-cell-left">创建人: </div>
                                <div className="add-con-cell-right">
                                    <input className="add-con-cell-right-input" disabled={true}
                                    value={this.createPeopel()} onChange={_=>false} />
                                </div>
                            </div>
                            <div className="add-con-cell">
                                <div className="add-con-cell-left">合同状态: </div>
                                <div className="add-con-cell-right">
                                    <input className="add-con-cell-right-input" disabled={true}
                                    value={Enum.ElcContractState[this.state.data['电子合同编辑'][0].contract_state]} onChange={_=>false} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="add-con-mod">
                        <div className="add-con-title">签约信息</div>
                        <div className="add-con-main">
                            <div className="add-con-cell">
                                <div className="add-con-cell-left">直客签约者姓名: </div>
                                <div className="add-con-cell-right">
                                    <input className="add-con-cell-right-input" placeholder="请输入直客签约者姓名"
                                    value={this.state.data['签约详情'][0].traveler ||''} onChange={e=>this.changeZKInfo(e,"traveler")} />
                                </div>
                            </div>
                            <div className="add-con-cell">
                                <div className="add-con-cell-left">签约者证件号: </div>
                                <div className="add-con-cell-right">
                                    <input className="add-con-cell-right-input" placeholder="请输入签约者证件号"
                                    value={this.state.data['签约详情'][0].travelerid ||''} onChange={e=>this.changeZKInfo(e,"travelerid")} />
                                </div>
                            </div>
                            <div className="add-con-cell">
                                <div className="add-con-cell-left">签约者手机号: </div>
                                <div className="add-con-cell-right">
                                    <input className="add-con-cell-right-input" type="number" placeholder="请输入签约者手机号"
                                    value={this.state.data['签约详情'][0].travelmobile  ||''} onChange={e=>this.changeZKInfo(e,"travelmobile")} />
                                </div>
                            </div>
                            <div className="add-con-cell">
                                <div className="add-con-cell-left">邮箱: </div>
                                <div className="add-con-cell-right">
                                    <input className="add-con-cell-right-input" placeholder="请输入邮箱"
                                    value={this.state.data['签约详情'][0].travelemail ||''} onChange={e=>this.changeZKInfo(e,"travelemail")} />
                                </div>
                            </div>
                            <div className="add-con-cell">
                                <div className="add-con-cell-left">地址: </div>
                                <div className="add-con-cell-right">
                                    <input className="add-con-cell-right-input" placeholder="请输入地址"
                                    value={this.state.data['签约详情'][0].addr ||''} onChange={e=>this.changeZKInfo(e,"addr")} />
                                </div>
                            </div>
                            <div className="add-con-cell">
                                <div className="add-con-cell-left">旅游者姓名: </div>
                                <div className="add-con-cell-right">
                                    <input className="add-con-cell-right-input" placeholder="请输入旅游者姓名"
                                    value={this.state.data['签约详情'][0].tourist_name || ''} onChange={e => this.changeZKInfo(e, "tourist_name")} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {!(this.action === '新增单项电子合同-订单管理' || this.action === '修改单项电子合同') && 
                        <div className="add-con-mod">
                            <div className="add-con-title">紧急联系人</div>
                            <div className="add-con-main">
                                <div className="add-con-cell">
                                    <div className="add-con-cell-left">紧急联系人姓名: </div>
                                    <div className="add-con-cell-right">
                                        <input className="add-con-cell-right-input" placeholder="请输入紧急联系人姓名"
                                            value={this.state.data['紧急联系人-合同'][0].name || ''} onChange={e => this.emergencyContact(e, "name")} />
                                    </div>
                                </div>
                                <div className="add-con-cell">
                                    <div className="add-con-cell-left">紧急联系人手机: </div>
                                    <div className="add-con-cell-right">
                                        <input className="add-con-cell-right-input" type="number" placeholder="请输入紧急联系人手机"
                                            value={this.state.data['紧急联系人-合同'][0].mobile || ''} onChange={e => this.emergencyContact(e, "mobile")} />
                                    </div>
                                </div>
                                <div className="add-con-cell">
                                    <div className="add-con-cell-left">紧急联系人电话: </div>
                                    <div className="add-con-cell-right">
                                        <input className="add-con-cell-right-input" type="number" placeholder="请输入紧急联系人电话"
                                            value={this.state.data['紧急联系人-合同'][0].telephone || ''} onChange={e => this.emergencyContact(e, "telephone")} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    }

                    <div className="add-con-btn" onClick={_=>this.nextPage()}>下一页</div>
                </div>
                }
            </Page>
        );
    }
}

export default connect(s => ({ s: s }))(AddContract1)