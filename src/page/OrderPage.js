import React, { Component } from 'react';

import {Page,AlertDialog} from 'react-onsenui';

import {AppCore,goTo,loadMore,loadIfEmpty,testing,AppMeta,post,trigger,reload} from '../util/core';
import {pullHook,loginToPlay,search,nonBlockLoading,info} from '../util/com';
import { connect } from 'react-redux';

import '../css/OrderPage.css'
class OrderPage extends Component{

	constructor(props) {
	    super(props);
		this.state = {
			state:'initial',
			data:[],
			order_state:['全部','未提交','占位中','已审核','已确认','变更中'],
			ord_state:['未提交','占位中','已审核','已确认','变更中'],
			cur_state: 0,
			is_delete:false,
			is_revoke:false,
			delete_order:{},
			revoke_order:{},
		};
		this.mod = '订单管理';
	}

	EditOrder(order){
		if(order.order_yb){
             goTo('修改订单-异部',{data:order,action:'修改订单-异部'});
        }else{
             goTo('修改订单-同部',{data:order,action:'修改订单-同部'});
        }
	}

	DeteleOrder(order){
		this.setState({is_delete:true});
		this.setState({delete_order:order});
	}

	SureToDelete(){
		if(!this.state.is_delete||!this.state.delete_order.id){
			this.setState({is_delete:false});
			this.setState({delete_order:{}});
		}else{
			let action = '删除订单';
			let cfg = AppMeta.actions[action];
			trigger('加载等待');
			post(cfg.submit.url, {id:this.state.delete_order.id}).then(
		        r => info(r.message).then(
					_=>{
			           this.setState({is_delete:false});
					   this.setState({delete_order:{}});
					   reload(this);
					}
				)
		    );
		}
	}

	CancelToDelete(){
		this.setState({is_delete:false});
		this.setState({delete_order:{}});
	}

	RevokeOrder(order){
		this.setState({is_revoke:true});
		this.setState({revoke_order:order});
	}

	SureToRevoke(){
		if(!this.state.is_revoke||!this.state.revoke_order.id){
			this.setState({is_revoke:false});
			this.setState({revoke_order:{}});
		}else{
			let action = '撤回订单';
			let cfg = AppMeta.actions[action];
			trigger('加载等待');
			post(cfg.submit.url, {id:this.state.revoke_order.id}).then(
		        r => info(r.message).then(
					_=>{
			           this.setState({is_revoke:false});
					   this.setState({revoke_order:{}});
					   reload(this);
					}
				)
		    );
		}
	}

	CancelToRevoke(){
		this.setState({is_revoke:false});
		this.setState({revoke_order:{}});
	}
	HoldSeat(order){
		let action = '占位订单-订单管理';
		let cfg = AppMeta.actions[action];
		trigger('加载等待');
		post(cfg.submit.url, {id:order.id}).then(
	        r => info(r.message).then(
				_=>{
				   reload(this);
				}
			)
	    );
	}

	RealSignUp(order){
		let action = '实报订单-订单管理';
		let cfg = AppMeta.actions[action];
		trigger('加载等待');
		post(cfg.submit.url, {id:order.id}).then(
	        r => info(r.message).then(
				_=>{
				   reload(this);
				}
			)
	    );
	}


	render(){
		return (
			<Page renderToolbar={_=>search()} onInfiniteScroll={done=>loadMore(this,done)} onShow={_=>loadIfEmpty(this)}>
			{
			  	this.props.s.user.sid && pullHook(this)	
		    }
		    {
		    	this.props.s.user.sid && 
	    		<div>
					<div className="order-state">
						{this.state.order_state.map( (item, i) => 
							<div className={i == this.state.cur_state ? 'cur-order-state' :  'order-state-item'} 
							onClick={_=>this.setState({cur_state:i})} key={i}>{item}</div>
						)}
					</div>

					<div className="order-list">
					    {this.state.data.map(order =>
					      <div className="order-item" key={order.id}>
							  <div className="order-number">
							  	<span style={{fontSize:'.373333rem'}}>订单号:D0{order.order_id}</span>
							  	<span style={{color:'#9E9E9E'}}>{order.company_name}-{order.department_name}-{order.group_employee_name}</span>
							  </div>
							  <div className="order-main" onClick={_=>goTo('订单查看页')}>
							  {/* 以下为 group 里面拿过来的,应该可以放在函数里,但是HTML里面的东西不太一样 */}
								<div className="pro-item"  key={order.id}
								style={{backgroundColor: '#F8F8F8',borderRadius: '0',width: '100%', height:'100%',margin:'0'}}>
					      			<div className="pro-item-left" style={{width:'2.56rem',height:'2.186667rem'}}>
										<img className="img-size" src={AppCore.HOST+'/'+order.thumb} />
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
									<div>应收:{order.receivable}</div>
									<div>已收:{order.received}</div>
									<div>未收:{order.receive_diff}</div>
								</div>
							  	<div className="order-detail-item">
									<div>应转:{order.settle_amount}</div>
									<div>已转:{order.settled_amount}</div>
									<div>未转:{order.settle_diff}</div>
								</div>
							  </div>
							  {	
							  	testing() &&
								<div className="order-btn">
								{   
									// (order.state ==1) &&
									<button className={(order.state ==1 ? "":"btn-disabled")+" order-btn-item"}
									disabled={ order.state ==1 ?"":"disabled"}	
									onClick={_=>this.DeteleOrder(order)}>删除</button>
								}{
									// (order.revoke_enable ==1) &&
									<button className={(order.revoke_enable ==1 ? "":"btn-disabled")+" order-btn-item"}
									disabled={ order.revoke_enable ==1 ?"":"disabled"}
									onClick={_=>this.RevokeOrder(order)}>撤回</button>
								}{
									// ((order.state ==1 || order.state ==2)&&order.settle_change_flow==0 ) &&
									<button className={(( (order.state ==1 || order.state ==2)&&order.settle_change_flow==0) ? "":"btn-disabled")+" order-btn-item"}
									disabled={ ((order.state ==1 || order.state ==2)&&order.settle_change_flow==0) ?"":"disabled"}
									onClick={_=>this.EditOrder(order)}>修改</button>
								}{
									//<button className={( ? "":"btn-disabled")+" order-btn-item"} onClick={_=>goTo('订单名单')}>名单</button>
								}{	
									// (order.state ==1) &&
									<button className={(order.state ==1 ? "":"btn-disabled")+" order-btn-item"}
									disabled={ order.state ==1 ?"":"disabled"}
									onClick={_=>this.HoldSeat(order)}>占位</button>
								}
								{
									// (order.state ==1 || order.state ==2)&&
									<button className={((order.state ==1 || order.state ==2) ? "":"btn-disabled")+" order-btn-item"}
									disabled={ (order.state ==1 || order.state ==2) ?"":"disabled"}
									onClick={_=>this.RealSignUp(order)}>实报</button>
								}
								</div>
							  }

					      </div>
					    )}
				    </div>
				  	{
				  		this.state.loading && nonBlockLoading()
				  	}
				</div>
		    }
		    {
		  		!this.props.s.user.sid && loginToPlay()
		    }
		   	<AlertDialog
		          isOpen={this.state.is_delete}
		          isCancelable={false}>
		          <div className='alert-dialog-title'>确认删除吗</div>
		          <div className='alert-dialog-footer'>
		            <button onClick={_=>this.CancelToDelete()} className='alert-dialog-button'>
		              取消
		            </button>
		            <button onClick={_=>this.SureToDelete()} className='alert-dialog-button'>
		              确定
		            </button>
		          </div>
		    </AlertDialog>

		   	<AlertDialog
		          isOpen={this.state.is_revoke}
		          isCancelable={false}>
		          <div className='alert-dialog-title'>确认撤销吗</div>
		          <div className='alert-dialog-footer'>
		            <button onClick={_=>this.CancelToRevoke()} className='alert-dialog-button'>
		              取消
		            </button>
		            <button onClick={_=>this.SureToRevoke()} className='alert-dialog-button'>
		              确定
		            </button>
		          </div>
		    </AlertDialog>

		    </Page>
		);
	}
}

export default connect(s=>({s:s}))(OrderPage)
