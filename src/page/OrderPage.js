import React, { Component } from 'react';

import {Page} from 'react-onsenui';

import {AppCore,goTo,loadPage} from '../util/core';
import {pullHook,loginToPlay} from '../util/com';
import { connect } from 'react-redux';

import '../css/OrderPage.css'
class OrderPage extends Component{

	constructor(props) {
	    super(props);
		this.state = {state:'initial',
		pageList:[],
		order_state:['全部','未提交','占位中','已审核','已确认','变更中'],
		ord_state:['未提交','占位中','已审核','已确认','变更中'],
		cur_state: 0
	};
	    this.url = '/sale/Order/read?';
		this.mod = '订单管理';
	}

	changeState(i){
		console.log(i)
		this.setState({cur_state: i})
	}
	renderToolbar(){
		return (
		  	<ons-toolbar>
		      <div className="center">订单</div>
		  	</ons-toolbar>
		);
	}

	render(){
		return (
			<Page renderToolbar={_=>this.renderToolbar()} onInfiniteScroll={done=>loadPage(this,done)}>
			{
			  	this.props.s.user.employee_id && pullHook(this)	
		    }
		    {
		    	this.props.s.user.employee_id && 
		    		<div>
						<div className="input-box">
						    <ons-search-input style={{width:'100%'}}
						      placeholder="Search"
						      onchange="ons.notification.alert('Searched for: ' + this.value)"
						    ></ons-search-input>
						</div>
						{/*  */}
						<div className="order-state">
							{this.state.order_state.map( (item, i) => 
								<div className={(i === this.state.cur_state ? 'cur-order-state' : '') + " " + 'order-state-item'} 
								onClick={this.changeState.bind(this, i)} key={i}>{item}</div>
							)}
						</div>
						{/*  */}
						<div className="order-list">
						    {this.state.pageList.map(order =>
						      <div className="order-item" key={order.id}>
								  <div className="order-number">
								  	<span style={{fontSize:'.373333rem'}}>订单号:{order.order_id}</span>
								  	<span style={{color:'#9E9E9E'}}>{order.company_name}-{order.department_name}-{order.group_employee_name}</span>
								  </div>
								  <div className="order-main">
								  {/* 以下为 group 里面拿过来的,应该可以放在函数里,但是HTML里面的东西不太一样 */}
									<div className="pro-item"  key={order.id}
									style={{backgroundColor: '#F8F8F8',borderRadius: '0',width: '100%', height:'100%',margin:'0'}}>
						      			<div className="pro-item-left" style={{width:'2.56rem',height:'2.186667rem'}}>
											<img className="img-size" src={'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1530677101117&di=5ada5f831c0373638a3f7c56dd683750&imgtype=0&src=http%3A%2F%2Fg.hiphotos.baidu.com%2Fimage%2Fpic%2Fitem%2Fb7003af33a87e95053e42ae21c385343faf2b449.jpg'} />
										</div>
						      			<div className="pro-item-right">
											<div className="pro-item-name">{order.pd_name}</div>
											<div className="pro-item-dep_city flex-j-sb">
												<span>团期: {order.dep_date}</span>
												<span>{order.pd_provider}</span>
											</div>
											<div className="pro-item-price flex-j-sb">
												<span>客户: {order.id}</span>
												<span>人数: {order.num_of_people}</span>
												<span className={'active-order-state'+(order.state*1)}>{this.state.ord_state[order.state*1]}</span>
											</div>
										</div>
									</div>
								  </div>
								  <div className="order-detail">
								  	<div className="order-detail-item">
										<div>应收:{order.id}</div>
										<div>已收:{order.employee_id}</div>
										<div>未收:{order.department_id}</div>
									</div>
								  	<div className="order-detail-item">
										<div>应转:{order.department_id}</div>
										<div>已转:{order.id}</div>
										<div>未转:{order.employee_id}</div>
									</div>
								  </div>
								  <div className="order-btn">
								  	<div className="order-btn-item">删除</div>
								  	<div className="order-btn-item">撤回</div>
								  	<div className="order-btn-item" onClick={_=>goTo('订单修改页')}>修改</div>
								  	<div className="order-btn-item">订单</div>
								  	<div className="order-btn-item">提交</div>
								  </div>
						      </div>
						    )}
					    </div>
					</div>
		    }
		    {
		  		!this.props.s.user.employee_id && loginToPlay()
		    }
		    </Page>
		);
	}
}

export default connect(s=>({s:s}),undefined)(OrderPage)
