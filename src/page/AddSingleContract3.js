// 新增合同
import React, { Component, Fragment } from 'react';

import { Page, Icon } from 'react-onsenui';

import { AppCore, resetTo, AppMeta, goTo, Enum, loadIfEmpty, goBack, trigger, submit, post, get_req_data, reload ,plugin,hasPlugin,resetToTab,resetToLv2Page} from '../util/core';
import { pullHook, loginToPlay, OpDialog, SupplierDialog, ErrorBoundary, info, footer, nonBlockLoading, confirm } from '../util/com';
import { connect } from 'react-redux';


import '../css/OrderEditPage.css';
import '../css/Contract.css';

import { ProDetail, CustomerInfo, PickSingle, ToursList, OrderReceivable, OrderShould, OrderProfits, OrderNote } from '../util/order'


class AddSingleContract3 extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: {}
        };
        this.action = this.props.p.action
    }

    componentWillMount(){
        let data = this.props.p.data
        this.setState({data:data})
    }

    // 具体说明 违约责任
    editComment(e,index,key){
        let data = this.state.data
        data[key][index].context = e.target.value
        this.setState({data:data})
    }
    //  + -
    setMinus(key){
        let data = this.state.data
        if (data[key].length == 1) {
            info('最少填写一条' + key);
            return
        }
        data[key].pop()
        this.setState({data: data})
    }
    setPlus(key) {
        let data = this.state.data
        data[key].push({})
        this.setState({ data: data })
    }
    // 合同
    changeContractPriec(val,key){
        let data = this.state.data
        data['合同金额'][0][key] = val
        this.setState({data: data})
    }
    // 银行
    selectBank(val) {
        let data = this.state.data
        data['收款账户-电子合同'] = []
        data['收款账户-电子合同'][0] = {}
        data['收款账户-电子合同'][0].to_bank = val
        data['收款账户-电子合同'][0].to_account_num = val
        data['收款账户-电子合同'][0].to_user_name = val
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
    pervPage() {
        goBack()
    }

    // 预览  &&  保存合同
    PreviewContract(){
        let url;
        this.action='合同预览';
        let cfg = AppMeta.actions[this.action];
        url = cfg.read.url + '?action=' + this.action +'&id=' + this.state.data.contract_id
            +'&dataSource='+ this.state.data.dataSource;
        trigger('加载等待');
        post(url).then(
            r => {
                //返回合同的save_path
                let url = r.data.save_path;
                this.state.data.pdf_url = url;
                if(this.state.data.pdf_url && hasPlugin('cordova.InAppBrowser')){
                    plugin('cordova.InAppBrowser').open(AppCore.HOST+'/'+this.state.data.pdf_url,'_system');
                }
            }
        )
    }

    SaveContract(){
        if(this.Verification())return;
        trigger('加载等待');
        this.state.data.dataSource='app'
        submit(this,this.submit_done.bind(this));
    }
    submit_done(r){
        info('保存成功!');
        let data = this.state.data
        data['contract_id']=r.data.contract_id;
        this.setState({data:data,submitDown:true});
    }

    Verification() {
        let data = this.state.data
        if (data['具体说明'][0].context === '' || data['具体说明'][0].context === undefined) { info('请填写具体说明'); return true }
        if (data['违约责任'][0].context === '' || data['违约责任'][0].context === undefined) { info('请填写违约责任'); return true }
        if (data['合同金额'][0].settleWay === '' || data['合同金额'][0].settleWay === undefined) { info('请填写合同金额支付方式'); return true }
        if (data['合同金额'][0].payDeadline === '' || data['合同金额'][0].payDeadline === undefined) { info('请填写合同金额最晚付款时间'); return true }
        if (data['收款账户-电子合同'][0].to_bank === '' || data['收款账户-电子合同'][0].to_bank === undefined){info('请选择收款账户');return true}
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
            <Page renderToolbar={_ => this.renderToolbar()}
            >
                {!this.state.data && nonBlockLoading()}
                {Object.keys(this.state.data).length > 0 &&
                    <div>
                        <div className="add-con-mod">
                            <div className="add-con-title">
                                <div>具体说明</div>
                                <div className="add-con-title-num">
                                    <Icon icon="md-minus-circle-outline" style={{ color: '#EE8585' }}
                                    onClick={e => this.setMinus("具体说明")} />
                                    <Icon icon="md-plus-circle-o" style={{ color: '#6FC5D8' }}
                                    onClick={e => this.setPlus("具体说明")} />
                                </div>
                            </div>
                            <div className="add-con-main" style={{paddingBottom:'6px'}}>
                            {
                             this.state.data['具体说明'].map((item,index)=>
                                <div className="add-con-cell" style={{ display: 'block',border: 'none'  }} key={index}>
                                    <div className="add-con-cell-text-box">
                                        <input value={item.context}
                                        onChange={e => this.editComment(e,index,'具体说明')}
                                        className="add-con-cell-contenteditable" />
                                    </div>
                                </div>
                            )}
                            </div>
                        </div>

                        <div className="add-con-mod">
                            <div className="add-con-title">
                                <div>违约责任</div>
                                <div className="add-con-title-num">
                                    <Icon icon="md-minus-circle-outline" style={{ color: '#EE8585' }}
                                        onClick={e => this.setMinus("违约责任")} />
                                    <Icon icon="md-plus-circle-o" style={{ color: '#6FC5D8' }}
                                        onClick={e => this.setPlus('违约责任')} />
                                </div>    
                            </div>
                            <div className="add-con-main" style={{paddingBottom:'6px'}}>
                            {
                                this.state.data['违约责任'].map((item, index) =>
                                <div className="add-con-cell" style={{ display: 'block', border: 'none' }} key={index}>
                                    <div className="add-con-cell-text-box">
                                        <input
                                            value={item.context}
                                            onChange={e => this.editComment(e,index,'违约责任')} className="add-con-cell-contenteditable"
                                         />
                                    </div>
                                </div>
                            )}
                            </div>
                        </div>

                        <div className="add-con-mod">
                            <div className="add-con-title">合同金额</div>
                            <div className="add-con-main">
                                <div className="add-con-cell">
                                    <div className="add-con-cell-left">委托事项总金额: </div>
                                    <div className="add-con-cell-right">
                                        <input className="add-con-cell-right-input" disabled={true}
                                            value={this.state.data['合同金额'][0].amount} />
                                    </div>
                                </div>
                                <div className="add-con-cell">
                                    <div className="add-con-cell-left">委托事项预付费: </div>
                                    <div className="add-con-cell-right">
                                        <input className="add-con-cell-right-input" type="number"
                                        onChange={e=>this.changeContractPriec(e.target.value-0,'prepaid_amount')}
                                        placeholder="请输入委托事项预付费" />
                                    </div>
                                </div>
                                <div className="add-con-cell">
                                    <div className="add-con-cell-left">支付方式: </div>
                                    <div className="add-con-cell-right">
                                        <input className="add-con-cell-right-input" 
                                        onChange={e => this.changeContractPriec(e.target.value,'settleWay')}
                                        value={this.state.data['合同金额'][0].settleWay||''}
                                        placeholder="请输入支付方式"  />
                                    </div>
                                </div>
                                <div className="add-con-cell">
                                    <div className="add-con-cell-left">全款费用最晚支付时间: </div>
                                    <div className="add-con-cell-right">
                                        <input className="add-con-cell-right-input" type="date"
                                        onChange={e => this.changeContractPriec(e.target.value,'payDeadline')}
                                        value={this.state.data['合同金额'][0].payDeadline||''}
                                        placeholder="请选择全款费用最晚支付时间"  />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="add-con-mod">
                            <div className="add-con-title">
                                <div>收款账户</div>
                                <div style={{ lineHeight: "20px", paddingBottom: '10px' }}>甲方按照上述支付方式向乙方支付款项,除上述支付方式外,甲方不得以任何方式向第三方或和人账户支付款项,否则乙方不予认可,由此造成的损失由甲方自行承担</div>
                            </div>
                            <div className="add-con-main">
                                <div className="add-con-cell">
                                    <div className="add-con-cell-left">开户行: </div>
                                    <div className="add-con-cell-right">
                                        <select className="add-con-cell-right-select"
                                            onChange={e => this.selectBank(e.target.value)}
                                            value={this.state.data['收款账户-电子合同'].length > 0 ? this.state.data['收款账户-电子合同'][0].to_bank : ''}>
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
                                            value={Enum['ReceivingBankUserName'][this.state.data['收款账户-电子合同'][0].to_bank] || ''} />
                                    </div>
                                </div>
                                <div className="add-con-cell">
                                    <div className="add-con-cell-left">账号: </div>
                                    <div className="add-con-cell-right">
                                        <input className="add-con-cell-right-input" placeholder="请选择开户行" disabled={true}
                                            value={Enum['ReceivingAccountNum'][this.state.data['收款账户-电子合同'][0].to_bank] || ''} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="add-con-btn-box">
                        {this.state.submitDown &&
                            <Fragment>
                                <div className="add-con-btn" onClick={_ => this.PreviewContract()}>预览合同</div>
                                <div className="add-con-btn" onClick={_ => this.goToOrderPage()}>完成</div>
                            </Fragment>
                        }
                        {!this.state.submitDown &&
                            <Fragment>
                                <div className="add-con-btn" onClick={_ => goBack()}>上一页</div>
                                <div className="add-con-btn" onClick={_ => this.SaveContract()}>保存合同</div>
                            </Fragment>
                        }
                        </div>
                    </div>
                }
            </Page>
        );
    }
}

export default connect(s => ({ s: s }))(AddSingleContract3)