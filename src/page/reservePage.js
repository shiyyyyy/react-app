import React, { Component } from 'react';

import {Page} from 'react-onsenui';

import {AppCore,resetTo, goTo} from '../util/core';

import {pullHook,loginToPlay, footer_ctrl,zs_dialog, gys_dialog} from '../util/com';

import { connect } from 'react-redux';

import {ProInfo,CustomerInfo,PickSingle,ToursList,OrderReceivable,OrderShould,OrderProfits,OrderNote} from '../util/order'


export default class ReservePage extends Component{

	constructor(props) {
	    super(props);
		this.state = {
			client:{
				name:'王大拿',
				mobile: '13888888888'
			},
			'接单人': [{name: '唐马儒'},{name: '唐马儒'},{name: '唐马儒'}],
				
			'游客名单': [
				{name: '汪汪汪',gender:'男',birthday:'1999-09-09',ID_card_type:'身份证', ID_num:'232323199909098888'},
				{name: '汪汪汪',gender:'男',birthday:'1999-09-09',ID_card_type:'身份证', ID_num:'232323199909098888'},			
			],
			'订单应收':{receivable: '3388', receivad: '2266', uncollected: '1122' },
			'订单应转':{receivable: '8848', receivad: '6626', uncollected: '2222' }
		};
	}


	renderToolbar(){
		return (
		  	<ons-toolbar>
		  		<div className='left'><ons-back-button></ons-back-button></div>
		      	<div className="center">占位</div>
		  	</ons-toolbar>
		);
	}
	renderFixed(){
		return (
			<div style={{position: 'absolute',bottom:'0px',left:'0px',right:'0px'}}>
	    	    { footer_ctrl('order', this) }
	    	</div>
		)
	}

	render(){
		return (
			<Page renderToolbar={_=>this.renderToolbar()} renderFixed={_=>this.renderFixed()} >
				{/* 添加游客 弹窗 */}
				{/* <div className="tourist-modal">
					<div className="tourist-popup">
						<div className="tourist-popup-title">游客信息</div>
						<div className="tourist-popup-info">
							<div className="tourist-popup-info-item">
								<div className="tourist-popup-info-item-left">游客姓名:</div> 
								<div className="tourist-popup-info-item-right">
								<input type="text" value="" placeholder="输入姓名" /></div>
							</div>
							<div className="tourist-popup-info-item">
								<div className="tourist-popup-info-item-left">游客性别:</div> 
								<div className="tourist-popup-info-item-right">
								女<input type="radio" value="" name="sex" /> 男<input type="radio" value="" name="sex" /></div>
							</div>
							<div className="tourist-popup-info-item">
								<div className="tourist-popup-info-item-left">出生年月:</div> 
								<div className="tourist-popup-info-item-right">
								<input type="date" value="" /></div>
							</div>
							<div className="tourist-popup-info-item">
								<div className="tourist-popup-info-item-left">证件类型:</div> 
								<div className="tourist-popup-info-item-right">
									<select>
										<option value="身份证">身份证</option>
										<option value="户口本">户口本</option>
										<option value="军官证">军官证</option>
									</select>
								</div>
							</div>
							<div className="tourist-popup-info-item">
								<div className="tourist-popup-info-item-left">证件号码:</div> 
								<div className="tourist-popup-info-item-right">
								<input type="text" value="" placeholder="" /></div>
							</div>
						</div><br />
						<div className="tourist-popup-btn">拨打电话</div>
					</div>
				</div> */}
				{/* banner下 产品信息 */}
				{ <ProInfo view={this.state}> </ProInfo>}
				{/* 客户信息 */}
				{ <CustomerInfo view={this.state} > </CustomerInfo> }
				{/* 接单人 */}
				{ <PickSingle view={this.state} > </PickSingle> }
				{/* 游客名单 */}
				{ <ToursList view={this.state} > </ToursList> }
				{/* 底部 footer */}

				{/* 弹窗 */}
				{ gys_dialog(this) }
		        { zs_dialog(this) }
		    </Page>
		);
	}
}

