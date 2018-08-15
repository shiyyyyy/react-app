import React, { Component,Fragment } from 'react';

import {Page} from 'react-onsenui';

import {AppCore,loadMore,loadIfEmpty,i18n,goTo,reload,goBack,Enum} from '../util/core';
import {pullHook,loginToPlay,SearchLv2,nonBlockLoading} from '../util/com';
import { connect } from 'react-redux';

class RegulatoryDetailPage extends Component{

	constructor(props) {
        super(props);
		this.item = this.props.p.item
	    this.state = {state:'initial',data:[], search:{code:''},};
		this.text = '账户明细';
		this.pageSize = 20;
	}


	componentDidMount() {
	}


	renderToolbar(){
        return(
            <ons-toolbar>
                <div className='left'><ons-back-button></ons-back-button></div>
                <div className="center">{this.text}</div>
            </ons-toolbar>
        )
    }
    

	render(){
		return (
            <Page renderToolbar={_=>this.renderToolbar()} onShow={_=>loadIfEmpty(this)}>
		    {
		    	this.props.s.user.sid && 
                <div className="reg-detail-body">
                    <div className="reg-detail-main">
                        <div className="reg-detail-main-header">
                            <span>部门名称: {this.item.company_name}-{this.item.name}</span>
                            <br />
                            <span>部门领导: {this.item.leader_names}</span>
                        </div>
                        <div className="reg-detail-main-row">
                            <div className="reg-detail-main-income">
                                <div className="xj-income">现金收</div>
                                <div style={{color: '#FD8621'}}>{this.item.cash_income}</div>
                                <div><span>占比: </span>{((this.item.cash_income/this.item.income)*100).toFixed(2)+'%'}</div>
                            </div>
                            <div className="reg-detail-main-income">
                                <div className="nz-income">内转收</div>
                                <div style={{color: '#28BE00'}}>{this.item.non_cash_income}</div>
                                <div><span>占比: </span>{((this.item.non_cash_income/this.item.income)*100).toFixed(2)+'%'}</div>
                            </div>
                            <div className="reg-detail-main-total">
                                收入总计: {this.item.income}
                            </div>
                        </div>
                        <div className="reg-detail-main-row">
                            <div className="reg-detail-main-row">
                                <div className="reg-detail-main-income">
                                    <div className="xj-exp">现金支</div>
                                    <div style={{color: '#FF466D'}}>{this.item.cash_expense}</div>
                                    <div><span>占比: </span>{((this.item.cash_expense/this.item.expense)*100).toFixed(2)+'%'}</div>
                                </div>
                                <div className="reg-detail-main-income">
                                    <div className="nz-exp">内转支</div>
                                    <div style={{color: '#1290EB'}}>{this.item.non_cash_expense}</div>
                                    <div><span>占比: </span>{((this.item.non_cash_expense/this.item.expense)*100).toFixed(2)+'%'}</div>
                                </div>
                                <div className="reg-detail-main-total">
                                    支出总计: {this.item.expense}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }

		    </Page>
		);
	}
}

export default connect(s=>({s:s}))(RegulatoryDetailPage)

