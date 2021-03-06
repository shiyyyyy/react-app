import React, { Component } from 'react';

import * as doc from '../util/doc'

export default class DocZJNZ extends Component{

	constructor(props) {
		super(props);
		this.state = {
			'订单应付':{receivable: '3388', receivad: '2266', uncollected: '1122' },
			'订单应转':{receivable: '8848', receivad: '6626', uncollected: '2222' },
			'订单利润':{receivable: '8848', receivad: '6626', uncollected: '2222' },
		}
		this.action = '资金内转单'
	}
	render(){
		return (
			<ons-page>
			  	<ons-toolbar>
			  	  <div className='left'><ons-back-button></ons-back-button></div>
			      <div className="center">资金内转单</div>
			  	</ons-toolbar>

					<div className="doc">
						{/* 基础信息 */}
						{doc.basis1(this.state.data)}

						{/* 单据备注 */}
						{doc.documents_note(this.state.data)}

						{/* 审批记录 */}
						{doc.record(this.state.data)}

						{/* 操作按钮 */}
						{doc.action_btn()}

					</div>

		  </ons-page>
		);
	}
};
