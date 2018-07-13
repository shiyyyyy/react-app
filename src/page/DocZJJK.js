import React, { Component } from 'react';
import {loadIfEmpty} from '../util/core';

import {Page} from 'react-onsenui';
// import {substr, split} from '../util/com';
import * as doc from '../util/doc';


export default class DocZJJK extends Component{

	constructor(props) {
	    super(props);
	    this.state = {
			'订单应付':{receivable: '3388', receivad: '2266', uncollected: '1122' },
			'订单应转':{receivable: '8848', receivad: '6626', uncollected: '2222' },
			'订单利润':{receivable: '8848', receivad: '6626', uncollected: '2222' },
		}
	    this.action = '资金借款审批';
	}

	renderToolbar(){
		return (
		  	<ons-toolbar>
		  	  <div className='left'><ons-back-button></ons-back-button></div>
		      <div className="center">资金借款单</div>
		  	</ons-toolbar>
		);
	}

	render(){
		return (
			<Page renderToolbar={_=>this.renderToolbar()} onShow={_=>loadIfEmpty(this)}>
				{
				  	this.state.loading &&
					<div className="after-list text-center">
				      <ons-icon icon="fa-spinner" size="26px" spin></ons-icon>
				    </div>
				}
				{
					this.state.data &&
					<div className="doc">

						{/* 基础信息 */}
						{doc.basis(this.state.data)}

						{/* 结算信息 */}
						{doc.billing_info(this.state.data)}

						{/* 调用单据 */}
						{doc.call_documents(this.state.data)}

						{/* 单据备注 */}
						{doc.documents_note(this.state.data)}

						{/* 审批记录 */}
						{doc.record(this.state.data)}

						{/* 操作按钮 */}
						{doc.action_btn()}

					</div>
				}

		    </Page>
		);
	}
};
