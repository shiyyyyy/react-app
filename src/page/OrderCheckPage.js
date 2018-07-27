import React, { Component } from 'react';

import {Page} from 'react-onsenui';

import {AppCore,resetTo, goTo} from '../util/core';
import {pullHook,loginToPlay,zs_dialog, gys_dialog } from '../util/com';
import { connect } from 'react-redux';

import '../css/OrderCheckPage.css'
import {ProDetail,CustomerInfo,PickSingle,ToursList,OrderReceivable,OrderShould,OrderProfits,OrderNote} from '../util/order'


export default class OrderCheckPage extends Component{

	constructor(props) {
	    super(props);
		this.state = {
			client:{
				name:'王大拿',
				mobile: '13888888888',
			},
			'接单人': [{name: '唐马儒'},{name: '唐马儒'},{name: '唐马儒'}],
				
			'游客名单': [
				{name: '汪汪汪',gender:'男',birthday:'1999-09-09',ID_card_type:'身份证', ID_num:'232323199909098888'},
				{name: '汪汪汪',gender:'男',birthday:'1999-09-09',ID_card_type:'身份证', ID_num:'232323199909098888'},			
			],
			'订单应收':{receivable: '3388', receivad: '2266', uncollected: '1122' },
			'订单应转':{receivable: '8848', receivad: '6626', uncollected: '2222' },
			'订单备注': '你好我是店主,你买的牛肉是去年10月19号的,坏了都'
		};
	}


	renderToolbar(){
		return (
		  	<ons-toolbar>
		  		<div className='left'><ons-back-button></ons-back-button></div>
		      	<div className="center">查看订单</div>
		  	</ons-toolbar>
		);
	}

	render(){
		return (
			<Page renderToolbar={_=>this.renderToolbar()} >
				
				{/* 订单页面 HTML */}
				{ <ProDetail view={this.state}> </ProDetail>}
				{/* 客户信息 */}
				{ <CustomerInfo view={this.state} check='check' > </CustomerInfo> }
				{/* 接单人 */}
				{ <PickSingle view={this.state} check='check' > </PickSingle> }
				{/* 游客名单 */}
				{ <ToursList view={this.state} check='check' > </ToursList> }
				{/* 订单应收 */}
				{ <OrderReceivable view={this.state} check='check' > </OrderReceivable> }
				{/* 订单应转 */}
				{ <OrderShould view={this.state} check='check' > </OrderShould> }
				{/* 订单利润 */}
				{ <OrderProfits view={this.state} check='check' > </OrderProfits> }
				{/* 订单备注 */}
				{ <OrderNote view={this.state} check='check' > </OrderNote> }
				{/* 底部 footer */}
				<div className="order-check-footer">
					<div className="order-check-footer-btn-default" onClick={_=>this.setState({open_supplier:true})}>
					<div><img src="img/gys1.png" /> </div> <span>联系供应商</span></div>
					<div className="order-check-footer-btn-submit" onClick={_=>this.setState({open_op:true})}>
					<div><img src="img/zs1.png" /> </div> <span>联系总社</span></div>
				</div>

				{gys_dialog(this)}
				{zs_dialog(this)}
		    </Page>
		);
	}
}

