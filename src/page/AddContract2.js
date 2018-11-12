// 新增合同
import React, { Component } from 'react';

import { Page, Icon } from 'react-onsenui';

import { AppCore, resetTo, AppMeta, goTo, Enum, loadIfEmpty, goBack, trigger, submit, post, get_req_data,resetToLv2Page, reload,resetToTab } from '../util/core';
import { pullHook, loginToPlay, OpDialog, SupplierDialog, ErrorBoundary, info, footer, nonBlockLoading, confirm } from '../util/com';
import { connect } from 'react-redux';


import '../css/OrderEditPage.css';
import '../css/Contract.css';

import { ProDetail, CustomerInfo, PickSingle, ToursList, OrderReceivable, OrderShould, OrderProfits, OrderNote } from '../util/order'


class AddContract2 extends Component {

    constructor(props) {
        super(props);

        this.state = {
            other_com: '',
            price: {

            },
            data:{},
        };
        this.type_Tour = this.props.p.type_id == 1 ? '旅游费用-出境' : '旅游费用-国内';
    }
    componentWillMount(){
        this.setState({ data: this.props.p.data})
    }

    changeZKPrice(e, key) {
        let data = this.state.data
        data[this.type_Tour][0][key] = e.target.value
        this.setState({ data: data })
    }
    prevPage(){
        goBack('');
    }
    nextPage() {
        if (this.Verification()) return;
        let data = this.state.data
        if(this.state.data.contract_state==2){
            goTo('修改合同3',{data:data,action: this.props.p.action});
        }else{
            goTo('新增合同3',{data:data,action: this.props.p.action});
        }
    }

    Verification(){
        let data = this.state.data
        if (!data[this.type_Tour][0].payEachAdult) { info('请填写成人费用'); return true }
        let zy = Object.keys(data['费用支付'][0]).find(item=>{
            return data['费用支付'][0][item] == 1
        })
        if (!zy) { info('请选择支付方式'); return true}
        if (!data['费用支付'][0].payDeadline) { info('请选择最晚支付时间'); return true }
        return false
    }

    // 选择支付方式
    typePay(e,key){
        let data = this.state.data
        Object.keys(data['费用支付'][0]).map(item => {
            if (item==='payOther'){

            } else if (item === 'payDeadline'){

            }else{
                data['费用支付'][0][item] = 0
            }
        })
        if(key === 'payOther'){
            data['费用支付'][0].other = 1
        }else{
            data['费用支付'][0][key] = 1
            data['费用支付'][0].other = 0
        }
        this.setState({ data: data })
    }
    // 其他支付方式 备注
    otherPayCom(e){
        let data = this.state.data
        data['费用支付'][0].payOther = e.target.value
        this.setState({ data: data})
    }
    changeDate(e){
        let data = this.state.data
        data['费用支付'][0].payDeadline = e.target.value
        this.setState({data: data})
    }
    otherPayComVal(e){
        if (this.state.data['费用支付'][0].other === 1){
            return this.state.data['费用支付'][0].payOther
        }else{
            return ''
        }
    }
    afterLoad() {

    }

    goToOrderPage(e) {
        let prompt = this.state.data.contract_state == 2 ? '是否确认返回合同列表页？' : '是否确认返回订单页？'        
        confirm(prompt).then(r => {
            if(r){
                if (this.state.data.contract_state == 2){
                    resetToLv2Page('合同列表')
                    return
                }
                if (AppCore.TabPage) {
                    // AppCore.TabPage.setState({ index: 1 })
                     reload(AppCore.OrderPage)
                     resetToTab('订单页',1)
                    //resetTo('订单页')
                }
            }
        });
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
            <Page renderToolbar={_ => this.renderToolbar()}
            //onShow={_ => loadIfEmpty(this, this.afterLoad)}
            >
                {!this.state.data && nonBlockLoading()}
                {
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
                                <div className="contract-item" style={{padding: '0'}}>
                                    <div className="contract-item-main">
                                        <div className="contract-item-name">{this.state.data['订单信息-合同'][0].pd_name}</div>
                                        <div className="contract-main-cell">
                                            <span className="contract-cell-main">
                                                创建日期: {this.state.data['订单信息-合同'][0].create_at.split(' ')[0]}</span>
                                            <span className="contract-cell-main" style={{ textAlign: 'center' }}>
                                                出团日期: {this.state.data['订单信息-合同'][0].dep_date}</span>
                                            <span className="contract-cell-main" style={{ textAlign: 'right' }}>
                                                人数: {this.state.data['订单信息-合同'][0].num_of_people}</span>
                                        </div>
                                        <div className="contract-main-cell">
                                            <span className="contract-cell-main">
                                                合同金额: {this.state.data['订单信息-合同'][0].receivable}</span>
                                            <span className="contract-cell-main text-overflow" style={{ textAlign: 'center' }} >
                                                产品提供方: {this.state.data['订单信息-合同'][0].pd_provider}</span>
                                            <span className="contract-cell-main" style={{ textAlign: 'right' }}>
                                                合同状态: {Enum.ElcContractState[this.state.data.contract_state]}</span>
                                        </div>
                                        <div className="model-main-item-box">
                                        {this.state.data['游客名单-合同'] &&
                                            this.state.data['游客名单-合同'].map((item,index)=>
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
                            <div className="add-con-title">旅游费用</div>
                            <div className="add-con-main">
                                <div className="add-con-cell">
                                    <div className="add-con-cell-left">成人费用: </div>
                                    <div className="add-con-cell-right">

                                        <input className="add-con-cell-right-input" type="number" placeholder="请输入成人费用"
                                               value={this.state.data[this.type_Tour][0].payEachAdult}
                                               onChange={e => this.changeZKPrice(e, "payEachAdult")} />
                                    </div>
                                </div>
                                <div className="add-con-cell">
                                    <div className="add-con-cell-left">儿童不满14岁费用: </div>
                                    <div className="add-con-cell-right">
                                        <input className="add-con-cell-right-input" type="number" placeholder="请输入儿童费用"
                                        value={this.state.data[this.type_Tour][0].payEachChild}
                                        onChange={e => this.changeZKPrice(e, "payEachChild")} />
                                    </div>
                                </div>
                                {this.props.p.type_id == 1 &&
                                <div className="add-con-cell">
                                    <div className="add-con-cell-left">导游服务费: </div>
                                    <div className="add-con-cell-right">
                                        <input className="add-con-cell-right-input" type="number" placeholder="请输入导游服务费"
                                            value={this.state.data[this.type_Tour][0].payGuide}
                                            onChange={e => this.changeZKPrice(e, "payGuide")} />
                                    </div>
                                </div>
                                }
                                <div className="add-con-cell">
                                <div className="add-con-cell-only-right">费用合计: {this.state.data['合同金额'][0].amount}</div>
                                </div>
                            </div>
                        </div>
                        <div className="add-con-mod">
                            <div className="add-con-title">费用支付</div>
                            <div className="add-con-main">
                                <div className="add-con-cell">
                                    <div className="add-con-cell-left">
                                    <input type="radio" id="cash" name="pay" value={'cash'} 
                                           checked={this.state.data['费用支付'][0].cash==1?true:''}
                                           onChange={e => this.typePay(e,'cash')} />
                                        <label htmlFor="cash">现金</label>
                                    </div>
                                </div>
                                <div className="add-con-cell">
                                    <div className="add-con-cell-left">
                                    <input type="radio" id="check" name="pay" value={'check'}
                                           checked={this.state.data['费用支付'][0].check==1?true:''}
                                           onChange={e => this.typePay(e,'check')} />
                                        <label htmlFor="check">支票</label>
                                    </div>
                                </div>
                                <div className="add-con-cell">
                                    <div className="add-con-cell-left">
                                    <input type="radio" id="credit" name="pay" value={'credit'}
                                           checked={this.state.data['费用支付'][0].credit==1?true:''}
                                           onChange={e => this.typePay(e,'credit')} />
                                        <label htmlFor="credit">刷卡</label>
                                    </div>
                                </div>
                                <div className="add-con-cell">
                                    <div className="add-con-cell-left">
                                    <input type="radio" id="payOther" name="pay" value={'payOther'}
                                           checked={this.state.data['费用支付'][0].other==1?true:''}
                                           onChange={e => this.typePay(e,'payOther')} />
                                        <label htmlFor="payOther">其他</label>
                                    </div>
                                    <div className="add-con-cell-right" >
                                        <input onChange={e => this.otherPayCom(e)} value={this.otherPayComVal(this)}
                                        placeholder={!(this.state.data['费用支付'][0].other === 1) ? "" : "请填写支付方式"}
                                        disabled={!(this.state.data['费用支付'][0].other === 1)} />
                                    </div>
                                </div>
                                <div className="add-con-cell">
                                    <div className="add-con-cell-left">最晚支付时间:</div>
                                    <div className="add-con-cell-right">
                                    <input onChange={e => this.changeDate(e)} value={this.state.data['费用支付'][0].payDeadline||''} type="date"
                                        placeholder={"请选择最晚支付时间"} />
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

export default connect(s => ({ s: s }))(AddContract2)