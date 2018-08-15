import React, { Component } from 'react';

import {Page} from 'react-onsenui';

import {AppCore,resetTo,AppMeta,goTo,Enum,loadIfEmpty,goBack,trigger,submit} from '../util/core';

import {pullHook,loginToPlay, footer_ctrl,footer,OpDialog, SupplierDialog,nonBlockLoading} from '../util/com';

import { connect } from 'react-redux';

import '../css/OrderCheckPage.css'
import {ProDetail,CustomerInfo,PickSingle,ToursList,OrderReceivable,OrderShould,OrderProfits,OrderNote} from '../util/order'


export default class OrderCheckPage extends Component{

	constructor(props) {
		super(props);
		
		this.state = {'data':{'comment':''},'group_id':props.p.data.id,'inited':false,'open_op':false,'open_supplier':false};
		this.action = props.p.action;
		// let cfg = AppMeta.actions[this.action];
		// this.text = cfg.text;
		this.text = '查看订单';
	}

	afterLoad(){
		let data = this.state.data;
		data['订单参团'] = data['订单参团']?data['订单参团']:[];
		data['订单应收'] = (data['订单应收']&&data['订单应收'].length>0)?data['订单应收']:[{'receivable':0,'received':0,'receive_diff':0,'receive_item':[]}];
		data['订单应转'] = (data['订单应转']&&data['订单应转'].length>0)?data['订单应转']:[{'settleable':0,'settled':0,'settle_diff':0,'acc_item':[],'settle_obj_id':data['订单团队'][0].manager_department_id}];
		

		let receivable = data['订单应收'][0]['receivable'];
		let settleable = data['订单应转'][0]['settleable'];
		let profit = Math.round((receivable - settleable)*100)/100;
		let profit_rate = (receivable == 0) ?'NaN':(Math.round((profit/receivable)*10000)/100+'%');
		data['订单利润'] = [{'receivable':receivable,'settleable':settleable,'profit':profit,'profit_rate':profit_rate}];

		data['客户详情'] = data['客户详情']?data['客户详情']:[{short_name:'',full_name:''}];
		data['接单人']   = data['订单详情'][0]['assitant_id']?{'assitant_id':data['订单详情'][0]['assitant_id']}:{};
		if(this.action=='查看订单-销售-异部'){
			data.order_yb = true;
		}else{
		   data.order_yb = false;
		}
		
		this.setState({data:data,inited:true});
	}

	checkTourist(item,check){
		goTo('查看游客名单',{item: item, check: check})
	}


	renderToolbar(){
		return (
			  <ons-toolbar>
				  <div className='left'><ons-back-button></ons-back-button></div>
				  <div className="center">{this.text}</div>
			  </ons-toolbar>
		);
	}

	SupplierDialog(){
		let supplier_ctrl = {
			open_supplier : this.state.open_supplier,
			cancelCb : () => {
				this.setState({open_supplier: false})
			}
		}
		return ( <SupplierDialog supplier_ctrl={supplier_ctrl} supplier_info={this.state.data['开团人详情'][0] || ''} /> )
	}
	OpDialog(){
		if (this.state.data && this.state.data['接单人详情']){
			var assitant = this.state.data['接单人详情'].find(curAssitant.bind(this))
			function curAssitant(item) {
				return item.id === this.state.data['订单详情'][0].assitant_id
			}
			let op_ctrl = {
			open_op : this.state.open_op,
			cancelCb : () => {
				this.setState({open_op: false})
				}
			}
			return ( <OpDialog op_ctrl={op_ctrl} op_info={assitant || ''} /> )
		}
	}

	render(){
		return (
			<Page renderToolbar={_=>this.renderToolbar()} onShow={_=>loadIfEmpty(this,this.afterLoad)}>
				{ !this.state.data['客户详情'] && nonBlockLoading() }
				{
					this.state.inited &&
					<div>
					<div className="ord-edit-ord-detail" >
						{/* 订单 HTML */}
						<div className="order-item" style={{paddingBottom: '1.013333rem'}}>
							<div className="order-number">
								<span className="gouwuche" style={{fontSize:'.373333rem'}}> D0{this.state.data['订单详情'][0]['id']}</span>
								<span style={{color:'#9E9E9E', fontSize:'.32rem'}}></span>
							</div>
							<div className="order-main">
							{/* 团队信息 */}
							<div className="pro-item"
							style={{backgroundColor: '#F8F8F8',borderRadius: '0',width: '100%', height:'100%',margin:'0'}}>
								<div className="pro-item-left" style={{width:'2.56rem',height:'2.186667rem'}}>
									<img className="img-size" src={AppCore.HOST+'/'+this.state.data['订单详情'][0]['thumb']} />
								</div>
								<div className="pro-item-right">
									<div className="pro-item-name">{this.state.data['订单详情'][0]['pd_name']}</div>
									{/* <div className="pro-item-dep_city flex-j-sb">
										<span>产品名称: {this.state.data['订单详情'][0]['pd_name']}</span>
									</div> */}
									<div className="pro-item-dep_city flex-j-sb">
										<span>团期: {this.state.data['订单详情'][0]['dep_date']}</span>
										<span>供应商:{this.state.data['订单详情'][0]['pd_provider']}</span>
									</div>
									<div className="pro-item-price flex-j-sb" style={{fontSize: '.32rem'}}>
										<span>客户:{this.state.data['订单详情'][0]['short_name']}</span>
										<span>人数:{this.state.data['订单详情'][0]['num_of_people']}</span>
										<span>{Enum.OrderState[this.state.data['订单详情'][0]['state']]}</span>
									</div>
								</div>
							</div>
							</div>
						</div>
					</div>
					{/* 客户信息 */}
					<div className="model-box">
						<div className="box-title">
							<div className="kehu">客户信息</div>
							<div className="box-title-operate">
								{/* <div onClick={_=>this.selectCstm()} style={{color:'#6FC5D8',border:'1px solid #6FC5D8'}} className='box-title-operate-item'>
								  选择客户
								</div>
								<div onClick={_=>this.addCstm()} style={{color:'#6FC5D8',border:'1px solid #6FC5D8'}} className='box-title-operate-item'>
								  新增客户
								</div> */}
							</div>
						</div>
						<div className="model-main">
							<div className="model-main-box">
								<div className="model-main-item">
									<span>姓名: </span>
									<input type="text" value={this.state.data['客户详情'][0].short_name?this.state.data['客户详情'][0].short_name:''} 
									readOnly/></div>
								<div className="model-main-item">
									<span>电话: </span>
									<input value={this.state.data['客户详情'][0].mobile?this.state.data['客户详情'][0].mobile:''} 
									readOnly /></div>						
							</div>
						</div>
					</div>
					{/* 接单人 */}
					<div className="model-box">
						<div className="box-title">
							<div className="jiedanren">接单人</div>
							<div className="box-title-operate">
								{/* <div onClick={_=>this.selectAssitant()} style={{color:'#6FC5D8',border:'1px solid #6FC5D8'}} className='box-title-operate-item'>
								  选择接单人
								</div> */}
							</div>
						</div>
						<div className="model-main">
							<div className="model-main-box">
								<div className="model-main-item">
									<span>姓名: </span>
									<input type="text" value={this.state.data['订单详情'][0]['assitant_name']?this.state.data['订单详情'][0]['assitant_name']:''} 
									readOnly/></div>				
							</div>
						</div>
					</div>
					{/* 游客名单 */}
					<div className="model-box">
						<div className="box-title">
							<div className="youke">游客名单</div>
							{/* <div className="box-title-operate">
								<div className="box-title-operate-item" style={{width: '.64rem',border:'none'}}>
								<img src="img/jia.png" style={{width:'.64rem', height: '.64rem'}} onClick={() => this.addTourist()}/></div>
								<div className="box-title-operate-item" style={{width: '.64rem',border:'none'}}>
								<img src="img/jian.png" style={{width:'.64rem', height: '.64rem'}} onClick={() => this.reduceTourist()}/></div>
							</div> */}
						</div>
						<div className="model-main">
						{this.state.data['订单参团'].map( (item,i) => 
							<div className="model-main-item-box" key={item.id} onClick={_=>this.checkTourist(item, 'check')}>
								<div className="model-main-item">
									<span>{i+1}</span> 
									<span>{item.name}</span> 
									<span>{Enum.Gender[item.gender]}</span> 
									<span>{item.birthday}</span>
									<span>{Enum.Certificate[item.certificate_type]}</span> 
									<span>{item.certificate_num}</span>
									<span>{item.mobile}</span> 
									<span>{item.comment}</span>
									<i></i>
								</div>
							</div>
						)}
						</div>
					</div>
					{/* 订单应收 */}
					<div className="model-box">
						<div className="box-title">
							<div className="yingshou">订单应收</div>
							{/* <div className="box-title-operate">
								<div className="box-title-operate-item" style={{color:'#6FC5D8',border:'1px solid #6FC5D8'}} onClick={_=>this.entryReceivable()}>录入明细</div>
							</div> */}
						</div>
						<div className="model-main">
							<div className="model-main-item-box">
								<div className="model-main-item flex-j-sb">
								<span>应收:<span>{this.state.data['订单应收'][0].receivable}</span></span> 
								<span>已收:<span>{this.state.data['订单应收'][0].received}</span></span> 
								<span>未收:<span>{this.state.data['订单应收'][0].receive_diff}</span></span> 
								</div>
							</div>
						</div>
					</div>
					{/* 订单应转 */}
					{	this.state.data.order_yb &&
						<div className="model-box">
							<div className="box-title">
								<div className="yingzhuan">订单应转</div>
								{/* <div className="box-title-operate">
									<div className="box-title-operate-item" style={{color:'#6FC5D8',border:'1px solid #6FC5D8'}} onClick={_=>this.entrySettleable()}>录入明细</div>
								</div> */}
							</div>
							<div className="model-main">
								<div className="model-main-item-box">
									<div className="model-main-item flex-j-sb">
									<span>应转:<span>{this.state.data['订单应转'][0].settleable}</span> </span> 
									<span>已转:<span>{this.state.data['订单应转'][0].settled}</span> </span> 
									<span>未转:<span>{this.state.data['订单应转'][0].settle_diff}</span> </span> 
									</div>
								</div>
							</div>
						</div>
					}
					{/* 订单利润 */}
					{	
						this.state.data.order_yb &&
						<div className="model-box">
						<div className="box-title">
							<div className="lirun">订单利润</div>
						</div>
						<div className="model-main">
							<div className="model-main-item-box">
								<div className="model-main-item flex-j-sb over-x-auto">
								<span>应收:<span>{this.state.data['订单利润'][0].receivable}</span></span> 
								<span>应转:<span>{this.state.data['订单利润'][0].settleable}</span></span> 
								<span>利润:<span>{this.state.data['订单利润'][0].profit}</span></span> 
								<span>利润率:<span>{this.state.data['订单利润'][0].profit_rate}</span></span>
								</div>
							</div>
						</div>
					</div>
					}
					{/* 订单备注 */}
					<div className="model-box" style={{marginBottom: '1.653333rem'}}>
						<div className="box-title">
							<div className="beizhu">订单备注</div>
						</div>
						<div className="model-main">
							<div className="model-main-item-box">
								<div className="model-main-item">
									<input disabled="true" type='text' style={{fontSize: '.373333rem', color: '#000'}} value={this.state.data['comment']}
									>{this.state.data['comment']}</input>
								</div>
							</div>
						</div>
					</div>
					{/* 底部 footer */}
					<div className="order-check-footer">
						<div className="order-check-footer-btn-default"
						onClick={_=>this.setState({open_supplier:true})}>联系供应商</div>
						<div className="order-check-footer-btn-submit"
						onClick={_=>this.setState({open_op:true})}>联系总社</div>
					</div>
				</div>
				}
				{ this.state.data && this.state.data['开团人详情'] && this.SupplierDialog()}
				{ this.state.data && this.state.data['接单人详情'] && this.OpDialog()}
			</Page>
		);
	}
}

