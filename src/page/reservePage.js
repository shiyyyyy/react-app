import React, { Component } from 'react';

import {Page} from 'react-onsenui';

import {AppCore,resetTo} from '../util/core';
import {pullHook,loginToPlay} from '../util/com';
import { connect } from 'react-redux';

import {footer} from '../util/com';


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

	render(){
		return (
			<Page renderToolbar={_=>this.renderToolbar()} >
				{/* 添加游客 弹窗 */}
				<div className="tourist-modal">
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
				</div>
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
								<input type="text" value={this.state.client.name} 
								onChange={ e=>this.setState({'client.name':e.target.value}) } /></div>
							<div className="model-main-item">
								<span>电话: </span>
								<input type='number' value={this.state.client.mobile} 
								onChange={ e => this.setState({'client.mobile':e.target.value}) }/></div>						
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
                {/* 接单人 */}
				<div class="model-box" style={{marginBottom:'1.493333rem'}}>
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
								<input type="text" value={this.state['接单人'].name} 
								onChange={ e => this.setState({'接单人["name"]': e.target.value})} /></div>
						</div>
					)}
					</div>
				</div>
				{/* 底部 footer */}
				{footer('orderEdit',this)}
		    </Page>
		);
	}
}

