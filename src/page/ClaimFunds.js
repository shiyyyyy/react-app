import React, { Component } from 'react';

import { Page, Icon } from 'react-onsenui';
import { log, AppCore, AppMeta, loadIfEmpty, goTo, Enum, goBack } from '../util/core';
import { info } from '../util/com';

export default class ClaimFunds extends Component {

    constructor(props) {
        super(props);

        this.state = {
            search : {
                settle_date_from: '',
                settle_date_to: '',
                settle_way_id: '',
                currency_id: '',
                remitter: '',
                arrived_amount: '',
            }
        };
    }

    submit() {
        let flag = Object.keys(this.state.search).some(item=>this.state.search[item]==='')
        if(flag){
            info('请填写全部搜索条件');
            return;
        }
        // goTo('资金认领结果', { settle_date_from: '2018-09-24',settle_date_to: '2018-10-31',settle_way_id: 1,currency_id: 2,remitter: '10000',arrived_amount: '10000',action: '资金查询',limit: 30,page: 1, })
        goTo('资金认领结果', {...this.state.search});
    }


    renderToolbar() {
        return (
            <ons-toolbar>
                <div className='left'><ons-back-button></ons-back-button></div>
                <div className={(AppCore.os === 'ios' ? "" : "Andriod-title") + " center"}>搜索资金</div>
            </ons-toolbar>
        );
    }

    render() {
        return (
            <Page renderToolbar={_ => this.renderToolbar()} >

                <div className="doc-module" style={{ marginTop: '0' }}>
                    <div className="doc-main">
                        <div className="doc-main-cell">
                            <span className="cell-left-5">到账日起:</span>
                            <span className="cell-right">
                                <input type="date" value={this.state.search.settle_date_from} 
                                onChange={e => this.setState({ search:{...this.state.search, settle_date_from: e.target.value} })}
                                placeholder="到账日起" />
                            </span>
                        </div>
                        <div className="doc-main-cell">
                            <span className="cell-left-5">到账日止:</span>
                            <span className="cell-right">
                                <input type="date" value={this.state.search.settle_date_to} 
                                onChange={e => this.setState({ search:{...this.state.search, settle_date_to: e.target.value }})}
                                placeholder="到账日止" />
                            </span>
                        </div>
                        <div className="doc-main-cell">
                            <span className="cell-left-5">结算方式:</span>
                            <span className="cell-right">
                                <select onChange={e => this.setState({ search: { ...this.state.search, settle_way_id: e.target.value - 0 }})}>
                                    <option>请选择</option>
                                    {Object.keys(Enum.SettleWay).map((item, i) =>
                                        <option value={item} key={item} 
                                        selected={item == this.state.search.settle_way_id}>{Enum.SettleWay[item]}</option>
                                    )}
                                </select>
                            </span>
                        </div>
                        <div className="doc-main-cell">
                            <span className="cell-left-5">币种:</span>
                            <span className="cell-right">
                                <select onChange={e => this.setState({ search: { ...this.state.search, currency_id: e.target.value - 0 }})}>
                                    <option>请选择</option>
                                    {Object.keys(Enum.Currency).map((item, i) =>
                                        <option value={item} key={item} 
                                            selected={item == this.state.search.currency_id}>{Enum.Currency[item]}</option>
                                    )}
                                </select>
                            </span>
                        </div>
                        <div className="doc-main-cell">
                            <span className="cell-left-5">汇款方名称:</span>
                            <span className="cell-right">
                                <input type="text" value={this.state.search.remitter} 
                                onChange={e => this.setState({ search:{...this.state.search, remitter: e.target.value }})}
                                placeholder="汇款方名称" />
                            </span>
                        </div>
                        <div className="doc-main-cell">
                            <span className="cell-left-5">到账金额:</span>
                            <span className="cell-right">
                                <input type="number" value={this.state.search.arrived_amount} 
                                onChange={e => this.setState({ search:{...this.state.search, arrived_amount: e.target.value }})}
                                placeholder="到账金额" />
                            </span>
                        </div>
                    </div>
                </div>
                {/* 游客名单 */}
                <div className="enter-tour-list-btn" style={{ justifyContent: 'center'}}>
                    <button className="enter-tour-list-btn-submit" onClick={this.submit.bind(this)}>确定</button>
                </div>
            </Page>
        );
    }
}

