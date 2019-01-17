import React, { Component, Fragment } from 'react';

import { Page, Popover } from 'react-onsenui';

import { AppCore, loadMore, loadIfEmpty, i18n, goTo, reload, goBack, post, Enum, encUrl, trigger } from '../util/core';
import { pullHook, loginToPlay, SearchLv2, nonBlockLoading, info } from '../util/com';
import { connect } from 'react-redux';
import { appConst } from '../util/const';

class ClaimFundsDone extends Component {

    constructor(props) {
        super(props);

        this.state = {
            state: 'initial', data: {}, 
            select_id: '',
            search: { ...this.props.p.search },
            loading: false
        };
        this.pageSize = 30;
        this.url = '/fin/Fund/search_fund';
        this.action = this.props.p.action
    }

    componentDidMount(){
        this.setState({ search: { ...this.props.p.search, action: this.action}})
    }

    renderToolbar() {
        return (
            <ons-toolbar>
                <div className='left'><ons-back-button></ons-back-button></div>
                <div className={(AppCore.os === 'ios' ? "" : "Andriod-title") + " center"}>搜索结果</div>
            </ons-toolbar>
        )
    }

    selectClaimFunds(item){
        this.setState({select_id: item.id})
    }    

    btnDisabled(){
        let ClaimDoc = this.state.data['搜索资金结果'].find(k => k.id === this.state.select_id);
        if (ClaimDoc===undefined){
            return false;
        }
        if(ClaimDoc.state === '1'){
            return true
        }else{
            return false
        }
    }

    gotoClaimDoc(target){
        if(this.state.select_id === ''){
            info('请选择要认领的单据');
            return;
        }
        var target_id;
        switch (target){
            case '资金收款单-认领':
                target_id='DOC_ZJ_SK';
                break;
            case '业务收款单-认领':
                target_id='DOC_ORDER_SK';
                break;
            case '资金退回单-认领':
                target_id='DOC_ZJ_TH';
                break;
            case '业务退回单-认领':
                target_id='DOC_YW_TH';
                break;
        } 
        let ClaimDoc = this.state.data['搜索资金结果'].find(k => k.id === this.state.select_id)
        let data = { ...ClaimDoc}
        
        var params = {};
        var docblk = '单据信息';
        var fundblk = '入账详情';
        // var new_action = '新增资金收款单';
        var fund_info = JSON.parse(JSON.stringify(data));
        fund_info.amount = fund_info.used_diff;
        params[docblk] = [{
            'doc_type_id': appConst[target_id],
            'employee_name': this.props.s.user.employee_name,
            'code': this.props.s.user.department_code,
            'settle_obj': this.props.s.user.department_name,
            'settle_amount': fund_info.used_diff,
            'company_name': this.props.s.user.company_name,
            'department_name': this.props.s.user.department_name,
        }];
        params[fundblk] = [fund_info];
  
        // $rootScope.trigger(new_action, meta, null, params);
        goTo('认领单据页', { params, action:target,view: this })
    }

    loadInit(){
        this.url = this.url.indexOf('?')>0?this.url.split('?')[0] : '/fin/Fund/search_fund';
        this.url = this.url + "?" + encUrl({ ...this.state.search, limit: 30,page: this.state.page })
        loadIfEmpty(this)
    }
    infiniteScroll(done){
        let that = this;
        // if (this.lastIndex === this.state.data['搜索资金结果'].length){
        //     done && done();
        //     return;
        // }
        this.setState({ loading: true });
        this.url = this.url.split('?')[0] || '/fin/Fund/search_fund'
        let url = this.url + "?" + encUrl({ ...this.state.search })
        post(url).then(
            r => {
                // that.lastIndex = that.state.data['搜索资金结果'].length;
                let data = {}
                data['搜索资金结果'] = this.state.data['搜索资金结果']
                data['搜索资金结果'] = r.data['搜索资金结果']
                that.setState({ loading: false, data: data }, done);
            }
        )
    }


    renderFixed() {

        if (AppCore.os) {
            this.tbHeight = (AppCore.os === 'ios' ? 56 : 68);
        }
        return (
            <div className="fixed-top-box" >
                <div className="money-care-books-title fixed-top" style={{ top: this.tbHeight + 'px', fontSize: '.266667rem' }}>
                    <span className="money-care-books-title-item-6">汇款方名称</span>
                    <span className="money-care-books-title-item-6">到账日期</span>
                    <span className="money-care-books-title-item-6">结算币种</span>
                    <span className="money-care-books-title-item-6">结算金额</span>
                    <span className="money-care-books-title-item-6">认领状态</span>
                    <span className="money-care-books-title-item-6">认领人</span>
                </div>
            </div>
        )
    }

    render() {
        return (
            <Page renderToolbar={_ => this.renderToolbar()} renderFixed={_ => this.renderFixed()}
                onInfiniteScroll={done => this.infiniteScroll(done)} onShow={_ => this.loadInit()}>
                {
                    this.props.s.user.sid && this.state.data['搜索资金结果'] &&
                    <Fragment>
                        <div style={{ width: '100px', height: '62px' }}></div>

                        {
                            !this.state.loading && pullHook(this)
                        }
                        <div className="money-care-books-box" ref="myAccount" style={{ marginTop: '0' }}>
                            <div className="money-care-books-main" style={{ height: '12.133333rem', overflow:'auto'}}>
                                {this.state.data['搜索资金结果'] && this.state.data['搜索资金结果'].map((doc, i) =>
                                    <div className={"money-care-books-main-item " + (this.state.select_id === doc.id ?'active-money-care-books-main-item':'')} 
                                    key={doc.id} style={{ fontSize: '.266667rem' }} 
                                    onClick={_=>this.selectClaimFunds(doc)}>
                                        <span className="money-care-books-main-item-col-6">{doc.remitter}</span>
                                        <span className="money-care-books-main-item-col-6">{doc.settle_date}</span>
                                        <span className="money-care-books-main-item-col-6">{Enum.Currency[doc.currency_id]}</span>
                                        <span className="money-care-books-main-item-col-6">{doc.exchange_amount}</span>
                                        <span className="money-care-books-main-item-col-6">{Enum.FundClaimState[doc.state]}</span>
                                        <span className="money-care-books-main-item-col-6">{doc.claimed_name}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="btn-4">
                            <button className="btn-4-item" disabled={this.btnDisabled()} onClick={_ => this.gotoClaimDoc('资金收款单-认领')}>资金收款</button>
                            <button className="btn-4-item" disabled={this.btnDisabled()} onClick={_ => this.gotoClaimDoc('业务收款单-认领')}>业务收款</button>
                            {/*<button className="btn-4-item" disabled={this.btnDisabled()} onClick={_ => this.gotoClaimDoc('资金退回单-认领')}>资金退回</button>
                            <button className="btn-4-item" disabled={this.btnDisabled()} onClick={_ => this.gotoClaimDoc('业务退回单-认领')}>业务退回</button>*/}
                        </div>
                        {
                            this.state.loading && nonBlockLoading()
                        }

                    </Fragment>
                }
                {
                    !this.props.s.user.sid && loginToPlay()
                }
            </Page>
        );
    }
}

export default connect(s => ({ s: s }))(ClaimFundsDone)

