import React, { Component } from 'react';

import {Page} from 'react-onsenui';

import {AppCore,resetTo, goTo} from '../util/core';
import {pullHook,loginToPlay, footer_ctrl,zs_dialog, gys_dialog} from '../util/com';
import { connect } from 'react-redux';

import {ProInfo,CustomerInfo,PickSingle,ToursList,OrderReceivable,OrderShould,OrderProfits,OrderNote} from '../util/order'


export default class OrderEditPage extends Component{

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
		      	<div className="center">实报</div>
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
				{/* banner下 产品信息 */}
                { <ProInfo view={this.state}> </ProInfo>}
				{/* 客户信息 */}
				{ <CustomerInfo view={this.state} > </CustomerInfo> }
				{/* 接单人 */}
				{ <PickSingle view={this.state} > </PickSingle> }
				{/* 游客名单 */}
				{ <ToursList view={this.state} > </ToursList> }
				{/* 订单应收 */}
				{ <OrderReceivable view={this.state} > </OrderReceivable> }
				{/* 订单应转 */}
				{ <OrderShould view={this.state} > </OrderShould> }
				{/* 订单利润 */}
				{/* { <OrderProfits view={this.state} > </OrderProfits> } */}
				{/* 订单备注 */}
				{ <OrderNote view={this.state} > </OrderNote> }
				{/* 底部 footer */}

				{/* 弹窗 */}
				{ gys_dialog(this) }
		        { zs_dialog(this) }
		    </Page>
		);
	}
}

