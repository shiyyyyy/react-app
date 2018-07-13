import React, { Component } from 'react';

import * as doc from '../util/doc'

export default class DocYWNZ extends Component{

	constructor(props) {
		super(props);
		this.state = {
			'订单应付':{receivable: '3388', receivad: '2266', uncollected: '1122' },
			'订单应转':{receivable: '8848', receivad: '6626', uncollected: '2222' },
			'订单利润':{receivable: '8848', receivad: '6626', uncollected: '2222' },
		}
		this.action = '业务内转单';

	}
	render(){
		return (
			<ons-page>
			  	<ons-toolbar>
			  	  <div className='left'><ons-back-button></ons-back-button></div>
			      <div className="center">业务内转单</div>
			  	</ons-toolbar>

					<div className="doc">
						{/* 基础信息 */}
						{doc.basis1(this.state.data)}
						
						{/* 转款明细 */}
						{doc.cope_detail(this.state.data)}
						{/* <div className="doc-module">
							<div className="doc-title">转款明细</div>
							<div className="doc-main">
								<div className="doc-main-cell">
									<span className="cell-left-4">订单号:</span><span className="cell-right">D09323</span>
								</div>
								<div className="doc-main-cell">
									<span className="cell-left-4">报名人:</span><span className="cell-right">门光中心-亮马桥门市-张三拿伞</span>
								</div>
								<div className="doc-main-cell">
									<span className="cell-left-4">供应商:</span><span className="cell-right">南亚风琴</span>
								</div>
								<div className="doc-main-cell">
									<span className="cell-left-4">产品名称:</span><span className="cell-right">新疆西藏西双版纳</span>
								</div>
								<div className="doc-main-cell">
									<span className="cell-left-4">出团日期:</span><span className="cell-right">2018-09-08</span>
								</div>
								<div className="doc-main-cell-flex-3">
								{Object.keys(this.state['订单应转']).map( item => 
									<strong>
									{item === 'receivable' ? '应转':''}
									{item === 'receivad' ? '已转':''}
									{item === 'uncollected' ? '未转':''}
									: <e>{this.state['订单应转'][item]}</e></strong>
								)}
								</div>
								<div className="doc-main-cell-right" style={{borderBottom: '1px solid #F4F8F9'}}>本次支出: <span style={{fontSize:'.373333rem'}}>17999.00</span></div>

								<div className="doc-main-cell">
									<span className="cell-left-4">订单号:</span><span className="cell-right">D09323</span>
								</div>
								<div className="doc-main-cell">
									<span className="cell-left-4">报名人:</span><span className="cell-right">门光中心-亮马桥门市-张三拿伞</span>
								</div>
								<div className="doc-main-cell">
									<span className="cell-left-4">供应商:</span><span className="cell-right">南亚风琴</span>
								</div>
								<div className="doc-main-cell">
									<span className="cell-left-4">产品名称:</span><span className="cell-right">新疆西藏西双版纳</span>
								</div>
								<div className="doc-main-cell">
									<span className="cell-left-4">出团日期:</span><span className="cell-right">2018-09-08</span>
								</div>
								<div className="doc-main-cell-flex-3">
								{Object.keys(this.state['订单应转']).map( item => 
									<strong>
									{item === 'receivable' ? '应转':''}
									{item === 'receivad' ? '已转':''}
									{item === 'uncollected' ? '未转':''}
									: <e>{this.state['订单应转'][item]}</e></strong>
								)}
								</div>
								<div className="doc-main-cell-right" style={{borderBottom: '1px solid #F4F8F9'}}>本次支出: <span style={{fontSize:'.373333rem'}}>17999.00</span></div>
								
								<div className="doc-main-cell-right" style={{fontWeight: 'blod', fontSize: '.426667rem'}}>合计: 288888.00</div>
							</div>
						</div> */}

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
