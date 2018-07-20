import React, { Component } from 'react';

import {Page} from 'react-onsenui';

import {AppCore,resetTo} from '../util/core';
import {pullHook,loginToPlay} from '../util/com';
import { connect } from 'react-redux';

import {footer,ZS_modal,GYS_modal} from '../util/com';


export default class ShibaoPage extends Component{

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

	// 设置modal显示隐藏 和 footer 连动(还有两个按钮的事件没加上)
	zsModal(){
		if(this.state.zs_modal || this.state.gys_modal) return;
		this.setState({zs_modal: true})
	}
	zsModalHide(){
		this.setState({zs_modal: false})
	}

	gysModal(){
		if(this.state.zs_modal || this.state.gys_modal) return;		
		this.setState({gys_modal: true})		
	}
	gysModalHide(){
		this.setState({gys_modal: false})		
	}


	renderToolbar(){
		return (
		  	<ons-toolbar>
		  		<div className='left'><ons-back-button></ons-back-button></div>
		      	<div className="center">实报</div>
		  	</ons-toolbar>
		);
	}

	render(){
		return (
			<Page renderToolbar={_=>this.renderToolbar()} >
				{/* banner下 产品信息 */}
                <div className="pro-header-info">
						<div className="pro-name">南亚风情自由行</div>
						<div className="pro-price">
							<div className="pro-price-zk_price">￥68888 <span style={{fontSize: '.373333rem', fontWeight: 'normal'}}>起</span></div>
							<div className="pro-price-dep_city">北京出发</div>
						</div>
						<div className="pro-sale">
							<div className="pro-sale-price">2018-09-08</div>
							<div className="pro-sale-supplier">供应商: 亚美运通</div>
						</div>
					</div>
				{/* 客户信息 */}
				<div class="model-box">
					<div className="box-title">
						<div className="box-title-text">客户信息</div>
						<div className="box-title-operate">
							<div className="box-title-operate-item" style={{color:'#6FC5D8',border:'1px solid #6FC5D8'}}>选择客户</div>
							<div className="box-title-operate-item">新增客户</div>
						</div>
					</div>
					<div className="model-main">
					{this.state['接单人'].map( item => 
						<div className="model-main-box">
							<div className="model-main-item">
								<span>姓名: </span>
								<input type="text" value={this.state.client.name} disabled
								onChange={ e=>this.setState({'client.name':e.target.value}) } /></div>
							<div className="model-main-item">
								<span>电话: </span>
								<input type='number' value={this.state.client.mobile} disabled
								onChange={ e => this.setState({'client.mobile':e.target.value}) }/></div>						
							</div>
					)}
					</div>
				</div>
				{/* 接单人 */}
				<div class="model-box">
					<div className="box-title">
						<div className="box-title-text">接单人</div>
						<div className="box-title-operate">
							<div className="box-title-operate-item" style={{color:'#6FC5D8',border:'1px solid #6FC5D8'}}>选择客户</div>
						</div>
					</div>
					<div className="model-main">
					{this.state['接单人'].map( item =>
						<div className="model.main-item-box">
							<div className="model-main-item">
								<span>姓名: </span>
								<input type="text" value={this.state['接单人'].name} disabled
								onChange={ e => this.setState({'接单人["name"]': e.target.value})} /></div>
						</div>
					)}
					</div>
				</div>
				{/* 游客名单 */}
				<div class="model-box">
					<div className="box-title">
						<div className="box-title-text">游客名单</div>
						<div className="box-title-operate">
							<div className="box-title-operate-item" style={{width: '.64rem',border:'none'}}>
							<img src="img/jia.png" style={{width:'.64rem', height: '.64rem'}} /></div>
							<div className="box-title-operate-item" style={{width: '.64rem',border:'none'}}>
							<img src="img/jian.png" style={{width:'.64rem', height: '.64rem'}} /></div>
						</div>
					</div>
					<div className="model-main">
					{this.state['游客名单'].map( (item,i) => 
						<div className="model-main-item-box">
							<div className="model-main-item">
								<span>{i+1}</span> 
								<span>{item.name}</span> 
								<span>{item.gender}</span> 
								<span>{item.birthday}</span>
								<span>{item.ID_card_type}</span> 
								<span>{item.ID_num}</span>
								<i></i>
							</div>
						</div>
					)}
					</div>
				</div>
				{/* 订单应收 */}
				<div class="model-box">
					<div className="box-title">
						<div className="box-title-text">订单应收</div>
						<div className="box-title-operate">
							<div className="box-title-operate-item" style={{color:'#6FC5D8',border:'1px solid #6FC5D8'}}>录入明细</div>
						</div>
					</div>
					<div className="model-main">
						<div className="model-main-item-box">
							<div className="model-main-item flex-j-sb">
							{Object.keys(this.state['订单应收']).map( item => 
								<strong>
								{item === 'receivable' ? '应收':''}
								{item === 'receivad' ? '已收':''}
								{item === 'uncollected' ? '未收':''}
								: <e>{this.state['订单应收'][item]}</e></strong>
							)}
								{/* <strong>已收: <e>{item.received}</e></strong>
								<strong>未收: <e>{item.uncollected}</e></strong> */}
							</div>
						</div>
					</div>
				</div>
				{/* 订单应转 */}
				<div class="model-box">
					<div className="box-title">
						<div className="box-title-text">订单应转</div>
						<div className="box-title-operate">
							<div className="box-title-operate-item" style={{color:'#6FC5D8',border:'1px solid #6FC5D8'}}>录入明细</div>
						</div>
					</div>
					<div className="model-main">
						<div className="model-main-item-box">
							<div className="model-main-item flex-j-sb">
							{Object.keys(this.state['订单应转']).map( item => 
								<strong>
								{item === 'receivable' ? '应转':''}
								{item === 'receivad' ? '已转':''}
								{item === 'uncollected' ? '未转':''}
								: <e>{this.state['订单应转'][item]}</e></strong>
							)}
							</div>
						</div>
					</div>
				</div>
				{/* 订单备注 */}
				<div class="model-box" style={{marginBottom: '1.493333rem'}}>
					<div className="box-title">
						<div className="box-title-text">订单备注</div>
					</div>
					<div className="model-main">
						<div className="model-main-item-box">
							<div className="model-main-item">
								<span style={{fontSize: '.373333rem', color: '#000'}}>申请大床房</span>
							</div>
						</div>
					</div>
				</div>
				{/* 底部 footer */}
				{footer('orderEdit',this)}{ZS_modal(this)}{GYS_modal(this)}

		    </Page>
		);
	}
}

