import React, { Component } from 'react';

import {Page} from 'react-onsenui';

import {AppCore,resetTo,AppMeta,goTo,Enum,loadIfEmpty,goBack,trigger,submit} from '../util/core';
import {pullHook,loginToPlay, footer_ctrl,zs_dialog, gys_dialog} from '../util/com';
import { connect } from 'react-redux';


import '../css/OrderEditPage.css';
import {footer} from '../util/com';

import {ProDetail,CustomerInfo,PickSingle,ToursList,OrderReceivable,OrderShould,OrderProfits,OrderNote} from '../util/order'

class OrderEditPage extends Component{

	constructor(props) {
	    super(props);
<<<<<<< .mine
		this.state = {
			client:{
				name:'王大拿',
				mobile: '13888888888'
			},
			'接单人': [{name: '唐马儒'},{name: '唐马儒'},{name: '唐马儒'}],
				
			'游客名单': [
				{name: '汪汪汪',gender:'1',birthday:'1999-09-09',ID_card_type:'身份证', ID_num:'232323199909098888'},
				{name: '喵喵喵',gender:'2',birthday:'2222-09-09',ID_card_type:'户口本', ID_num:'343434343434343434'},			
			],
			'订单应收':{receivable: '3388', receivad: '2266', uncollected: '1122' },
			'订单应转':{receivable: '8848', receivad: '6626', uncollected: '2222' },
			'订单备注': '你好我是店主,你买的牛肉去年10月0号的,坏了时'
		};
||||||| .r91
		this.state = {
			client:{
				name:'王大拿',
				mobile: '13888888888'
			},
			'接单人': [{name: '唐马儒'},{name: '唐马儒'},{name: '唐马儒'}],
				
			'游客名单': [
				{name: '汪汪汪',gender:'1',birthday:'1999-09-09',ID_card_type:'身份证', ID_num:'232323199909098888'},
				{name: '喵喵喵',gender:'2',birthday:'2222-09-09',ID_card_type:'户口本', ID_num:'343434343434343434'},			
			],
			'订单应收':{receivable: '3388', receivad: '2266', uncollected: '1122' },
			'订单应转':{receivable: '8848', receivad: '6626', uncollected: '2222' }
		};
=======
		
		this.state = {'data':{'comment':''},'group_id':props.p.data.id,'inited':false};
		this.action = props.p.action;
		let cfg = AppMeta.actions[this.action];
		this.text = cfg.text;
>>>>>>> .r92
	}

	afterLoad(){
		let data = this.state.data;
		data['订单参团'] = data['订单参团']?data['订单参团']:[];
		data['订单应收'] = data['订单应收']?data['订单应收']:[{'receivable':0,'received':0,'receive_diff':0,'receive_item':[]}];
		data['订单应转'] = data['订单应转']?data['订单应转']:[{'settleable':0,'settled':0,'settle_diff':0,'acc_item':[],'settle_obj_id':data['订单团队'][0].manager_department_id}];
		data['订单利润'] = [{'receivable':0,'settleable':0,'profit':0,profit_rate:'NaN'}];
		data['客户详情'] = data['客户详情']?data['客户详情']:[{short_name:'',full_name:''}];
		data['接单人']   = data['订单详情'][0]['assitant_id']?{'assitant_id':data['订单详情'][0]['assitant_id']}:{};
		if(this.action=='修改订单-异部'){
            data.order_yb = true;
        }else{
           data.order_yb = false;
        }
        
		this.setState({data:data,inited:true});
	}

	selectCstm(){
		goTo('订单选择客户',{action:'订单选择客户',view:this});
	}

	addCstm(){
		goTo('订单新增客户',{action:'订单新增客户',view:this});
	}

	selectAssitant(){
		goTo('选择项目页',{items:this.state.data['可接单人'],cb:this.selectAssitantDone.bind(this),key:'接单人'})
	}

	selectAssitantDone(value){
		let data = this.state.data;
		data['接单人'].id = value;
		data['接单人'].name = this.state.data['可接单人'][value];
		this.setState({data:data});
		goBack();
	}

	addTourist(){
		let data = this.state.data;
		data['订单参团'].push({name:'虚拟游客',certificate_type:1});
		this.setState({data:data});
	}

	reduceTourist(){
		let data = this.state.data;
		if(data['订单参团'].length>0){
			data['订单参团'].splice(0,1);
		}	
		this.setState({data:data});
	}

	entryReceivable(){
		goTo('录入订单应收明细',{view:this,data:{'应收明细':this.state.data['订单应收'][0].receive_item},action:'录入订单应收明细'});
	}

	entrySettleable(){
		goTo('录入订单应转明细',{view:this,data:this.state.data['订单应转'][0].acc_item,action:'录入订单应转明细'});
	}
	submit(){
		let data = this.state.data;
		data['订单详情'] = [{'assitant_id':data['接单人'].id}];
		data['订单备注'] = [{'comment':data['comment'],'editable':true}];
		this.setState({data:data});
		trigger('加载等待');
	    submit(this,_=>goBack());
	}

	renderToolbar(){
		return (
		  	<ons-toolbar>
		  		<div className='left'><ons-back-button></ons-back-button></div>
		      	<div className="center">{this.text}</div>
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
			<Page renderToolbar={_=>this.renderToolbar()} onShow={_=>loadIfEmpty(this,this.afterLoad)}>
				{

					this.state.inited &&
					<div>
					<div className="ord-edit-ord-detail">
						{/* 订单 HTML */}
						<div className="order-item" style={{paddingBottom: '1.013333rem'}}>
							<div className="order-number">
								<span style={{fontSize:'.373333rem'}}>订单号:</span>
								<span style={{color:'#9E9E9E', fontSize:'.32rem'}}></span>
							</div>
							<div className="order-main">
							{/* 团队信息 */}
							<div className="pro-item"
							style={{backgroundColor: '#F8F8F8',borderRadius: '0',width: '100%', height:'100%',margin:'0'}}>
								<div className="pro-item-left" style={{width:'2.56rem',height:'2.186667rem'}}>
									<img className="img-size"/>
								</div>
								<div className="pro-item-right">
									<div className="pro-item-name"></div>
									<div className="pro-item-dep_city flex-j-sb">
										<span>团期: 2018-10-01</span>
										<span>亚美运通</span>
									</div>
									<div className="pro-item-price flex-j-sb" style={{fontSize: '.32rem'}}>
										<span>客户: 张全蛋</span>
										<span>人数: 2</span>
										{/* <span className={'active-order-state'+(order.state*1)}>{this.state.ord_state[order.state*1]}</span> */}
										<span>已支付</span>
									</div>
								</div>
							</div>
							</div>
						</div>
					</div>
					{/* 客户信息 */}
					<div className="model-box">
						<div className="box-title">
							<div className="box-title-text">客户信息</div>
							<div className="box-title-operate">
								<button onClick={_=>this.selectCstm()} className='alert-dialog-button'>
					              选择客户
					            </button>
					            <button onClick={_=>this.addCstm()} className='alert-dialog-button'>
					              新增客户
					            </button>
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
									<input type='number' value={this.state.data['客户详情'][0].mobile?this.state.data['客户详情'][0].mobile:''} 
									readOnly /></div>						
							</div>
						</div>
					</div>
					{/* 接单人 */}
					<div className="model-box">
						<div className="box-title">
							<div className="box-title-text">接单人</div>
							<div className="box-title-operate">
								<button onClick={_=>this.selectAssitant()} className='alert-dialog-button'>
					              选择接单人
					            </button>
							</div>
						</div>
						<div className="model-main">
							<div className="model-main-box">
								<div className="model-main-item">
									<span>姓名: </span>
									<input type="text" value={this.state.data['接单人'].name?this.state.data['接单人'].name:''} 
									readOnly/></div>				
							</div>
						</div>
					</div>
					{/* 游客名单 */}
					<div className="model-box">
						<div className="box-title">
							<div className="box-title-text">游客名单</div>
							<div className="box-title-operate">
								<div className="box-title-operate-item" style={{width: '.64rem',border:'none'}}>
								<img src="img/jia.png" style={{width:'.64rem', height: '.64rem'}} onClick={() => this.addTourist()}/></div>
								<div className="box-title-operate-item" style={{width: '.64rem',border:'none'}}>
								<img src="img/jian.png" style={{width:'.64rem', height: '.64rem'}} onClick={() => this.reduceTourist()}/></div>
							</div>
						</div>
						<div className="model-main">
						{this.state.data['订单参团'].map( (item,i) => 
							<div className="model-main-item-box" key={i}>
								<div className="model-main-item">
									<span>{i+1}</span> 
									<span>{item.name}</span> 
									<span>{item.gender}</span> 
									<span>{item.birthday}</span>
									<span>{Enum.Certificate[item.certificate_type]}</span> 
									<span>{item.certificate_num}</span>
									<i></i>
								</div>
							</div>
						)}
						</div>
					</div>
					{/* 订单应收 */}
					<div className="model-box">
						<div className="box-title">
							<div className="box-title-text">订单应收</div>
							<div className="box-title-operate">
								<button className="box-title-operate-item" style={{color:'#6FC5D8',border:'1px solid #6FC5D8'}} onClick={_=>this.entryReceivable()}>录入明细</button>
							</div>
						</div>
						<div className="model-main">
							<div className="model-main-item-box">
								<div className="model-main-item flex-j-sb">
								<span>应收:{this.state.data['订单应收'][0].receivable}</span> 
								<span>已收:{this.state.data['订单应收'][0].received}</span> 
								<span>未收:{this.state.data['订单应收'][0].receive_diff}</span> 
								</div>
							</div>
						</div>
					</div>
					{/* 订单应转 */}
					{	this.state.data.order_yb &&
						<div className="model-box">
							<div className="box-title">
								<div className="box-title-text">订单应转</div>
								<div className="box-title-operate">
									<button className="box-title-operate-item" style={{color:'#6FC5D8',border:'1px solid #6FC5D8'}} onClick={_=>this.entrySettleable()}>录入明细</button>
								</div>
							</div>
							<div className="model-main">
								<div className="model-main-item-box">
									<div className="model-main-item flex-j-sb">
									<span>应转:{this.state.data['订单应转'][0].settleable}</span> 
									<span>已转:{this.state.data['订单应转'][0].settled}</span> 
									<span>未转:{this.state.data['订单应转'][0].settle_diff}</span> 
									</div>
								</div>
							</div>
						</div>
					}
					{/* 订单利润 */}
					<div className="model-box">
						<div className="box-title">
							<div className="box-title-text">订单利润</div>
						</div>
						<div className="model-main">
							<div className="model-main-item-box">
								<div className="model-main-item flex-j-sb">
								<span>应收:{this.state.data['订单利润'][0].receivable}</span> 
								<span>应转:{this.state.data['订单利润'][0].settleable}</span> 
								<span>利润:{this.state.data['订单利润'][0].profit}</span> 
								<span>利润率:{this.state.data['订单利润'][0].profit_rate}</span>
								</div>
							</div>
						</div>
					</div>
					{/* 订单备注 */}
					<div className="model-box" style={{marginBottom: '1.653333rem'}}>
						<div className="box-title">
							<div className="box-title-text">订单备注</div>
						</div>
						<div className="model-main">
							<div className="model-main-item-box">
								<div className="model-main-item">
									<input type='text' style={{fontSize: '.373333rem', color: '#000'}} value={this.state.data['comment']}>{this.state.data['comment']}</input>
								</div>
							</div>
						</div>
					</div>
					{/* 底部 footer */}
					{footer('orderEdit',this)}
					</div>
				}
		    </Page>
		);
	}
}

export default connect(s=>({s:s}))(OrderEditPage)