import React, { Component,Fragment } from 'react';

import { Page, AlertDialog, Icon, Popover, ActionSheet} from 'react-onsenui';

import {AppCore,goTo,loadMore,loadIfEmpty,testing,AppMeta,post,trigger,reload,Enum,goBack,haveModAuth,haveActionAuth,hasPlugin} from '../util/core';
import {pullHook,loginToPlay,Search,nonBlockLoading,info,NoPv,confirm} from '../util/com';
import { connect } from 'react-redux';

import '../css/OrderPage.css'
class OrderPage extends Component{

	constructor(props) {
		super(props);
		
		this.state = {
			state:'initial',
			data:[],
			order_state:['全部','未提交','占位中','已审核','已确认','变更中'],
			//ord_state:['未提交','占位中','已审核','已确认','变更中'],
			cur_state: 0,
			search:{
				id: ''
			},
			has_auth:false,
			selectConShow: false, // 选择合同类型 控制器
			contract_order: '', // 选择合同的订单

			dep_date_from:'',
			dep_date_to:'',
			back_date_from:'',
			back_date_to:'',

			open_search_key: false,
			cur_select_search_filter: {text: '订单号', search: 'id'},
		};
		this.mod = '订单管理';
		AppCore.OrderPage = this;
	}

	onShow(){
		loadIfEmpty(this);
		let has_auth = haveModAuth(this.mod);
		this.setState({has_auth:has_auth});
	}

	checkOrder(order){
		if(order.order_kind == 2){
			goTo('订单查看页',{data:order,action:'查看订单-销售-活动'});
		}else if(order.order_yb){
            goTo('订单查看页',{data:order,action:'查看订单-销售-异部'});
        }else{
            goTo('订单查看页',{data:order,action:'查看订单-销售-同部'});
        }
	}
	EditOrder(order){
		if(order.order_kind == 2){
			goTo('修改订单-活动',{data:order,action:'修改订单-异部'});
		}else if(order.order_yb && order.order_yb == '1'){
            goTo('修改订单-异部',{data:order,action:'修改订单-异部'});
        }else if(order.order_yb && order.order_yb == '0'){
            goTo('修改订单-同部',{data:order,action:'修改订单-同部'});
        }
	}

	DeteleOrder(order){
		confirm('确认删除吗？').then(r=>r && this.SureToDelete(order))
	}

	SureToDelete(order){

		let action = '删除订单';
		let cfg = AppMeta.actions[action];
		trigger('加载等待');
		post(cfg.submit.url, {id:order.id}).then(
	        r => info(r.message).then(
				_=>reload(this)
			)
	    );
	}

	// 选择合同类型弹窗 && 跳转页面
	selectContract(){
		return(
			< ActionSheet isCancelable = { true} isOpen = { this.state.selectConShow } 
			onCancel = { _=>this.selectConColse() } modifier="contract-style-box" 
			onDeviceBackButton = {_=>this.selectConColse()}>
				<div className="contract-style" onClick={_=>this.contractType(1)}>出境合同</div>
				<div className="contract-style" onClick={_=>this.contractType(2)}>国内合同</div>
				<div className="contract-style" onClick={_=>this.contractType(3)}>单项合同</div>
			</ActionSheet >
		)
	}
	selectConColse(){
		this.setState({ selectConShow: false })
	}
	contractType(type){
		this.setState({ selectConShow: false })
		let order = this.state.contract_order
		let data = {
			type_id: type,
			order_id:order.id
		}
		if (!order)return;
		goTo('新增合同1',{data})
	}
	RevokeOrder(order){
		confirm('确认撤回吗？').then(r=>r && this.SureToRevoke(order))
	}

	SureToRevoke(order){

		let action = '撤回订单';
		let cfg = AppMeta.actions[action];
		trigger('加载等待');
		post(cfg.submit.url, {id:order.id}).then(
	        r => info(r.message).then(
				_=>reload(this)
			)
	    );
	}

	HoldSeat(order){
		confirm('是否确认操作？').then(r=>r && this.SureToHoldSeat(order))
	}

	SureToHoldSeat(order){
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
		confirm('是否确认操作？').then(r=>r && this.SureToRealSignUp(order))
	}
	SureToRealSignUp(order){
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

	orderStateClick(state){
		this.setState({cur_state: state});
	}
	orderStateSubmit(){
		let cur_state = this.state.cur_state
		this.setState({open_filter:'',search:{...this.state.search,state: cur_state}});
		reload(this);
	}


	depDateClick(){
		this.setState({open_filter:'',
			search:{
				...this.state.search,
				dep_date_from: this.state.dep_date_from || '',
				dep_date_to:this.state.dep_date_to || ''
			}
		});
		reload(this);
	}

	backDateClick(){
		this.setState({open_filter:'',
			search:{
				...this.state.search,
				back_date_from: this.state.back_date_from || '',
				back_date_to:this.state.back_date_to || ''
			}
		});
		reload(this);
	}

	clear_param(){
		this.setState({
			open_filter: '',
			cur_state: '',
			dep_date_from: '',
			dep_date_to: '',
			back_date_from: '',
			back_date_to: ''
		})
	}

	// 
	dep_date_cur(){
		if(this.state.open_filter === 'dep_date' || this.state.search.dep_date_from || this.state.dep_date_to){
			return true;
		}
		return false
	}
	back_date_cur(){
		if(this.state.open_filter === 'back_date' || this.state.search.back_date_from || this.state.back_date_to){
			return true;
		}
		return false
	}
	group_state_cur(){
		if(this.state.open_filter === 'group_state' || this.state.cur_state){
			return true
		}
		return false
	}

	// 

	renderFixed(){
		
		if(hasPlugin('device') && AppCore.os==='ios'){
			this.tbHeight = 64;
		}else{
			this.tbHeight = (AppCore.os==='ios'?44:56);
		}
		return (
			<div style={{
					backgroundColor:'rgba(0,0,0,.65)',
					position:'absolute',
					top:this.tbHeight,
					bottom:this.state.open_filter?'0px':'auto',
					left:'0px',
					right:'0px',
					display:this.props.s.user.sid?'block':'none'
				}}
				onClick={_=>{this.clear_param()}}
			>
				<ons-row  class="option-type" onClick={e=>e.stopPropagation()}>
					<ons-col onClick={_=>this.setState({open_filter:'dep_date'})}>
						<span className={ this.dep_date_cur() ? "cur-option-type-text":"option-type-text"}>出团日期</span>
						{this.dep_date_cur() && <Icon className="cur-option-type-item" icon="md-caret-up"  />}
						{!this.dep_date_cur() && <Icon className="option-type-item" icon="md-caret-down"  />}
					</ons-col>
					<ons-col onClick={_=>this.setState({open_filter:'back_date'})}>
						<span className={ this.back_date_cur() ? "cur-option-type-text":"option-type-text"}>回团日期</span>
						{this.back_date_cur() && <Icon className="cur-option-type-item" icon="md-caret-up" />}
						{!this.back_date_cur() && <Icon className="option-type-item" icon="md-caret-down" />}
					</ons-col>
					<ons-col onClick={_=>this.setState({open_filter:'group_state'})}>
						<span className={ this.group_state_cur() ? "cur-option-type-text":"option-type-text"}>订单状态</span>
						{this.group_state_cur() && <Icon className="cur-option-type-item" icon="md-caret-up" />}
						{!this.group_state_cur() && <Icon className="option-type-item" icon="md-caret-down" />}
					</ons-col>
				</ons-row>
				<div onClick={e=>e.stopPropagation()}>
					{ this.state.open_filter === 'dep_date' && 
						<div className="dialog-box">
							<div className="options-popup">
								<div className="selected-date">
									<input type="date" className="selected-date-input" placeholder="最早出发" 
									value={this.state.search.dep_date_from || this.state.dep_date_from} onChange={e=>this.setState({dep_date_from: e.target.value})} />
									至
									<input type="date" className="selected-date-input" placeholder="最晚出发" 
									value={this.state.search.dep_date_to || this.state.dep_date_to} onChange={e=>this.setState({dep_date_to: e.target.value})} />
								</div>
								<div className="options-btn">
								  <div className="options-reset" onClick={_=>this.setState({dep_date_from:'',dep_date_to:'',search:{...this.state.search,dep_date_from:'',dep_date_to:''}})}>重置</div>
								  <div className="options-submit" onClick={_=>this.depDateClick()}>确定</div>
								</div>
							</div>
						</div>	
					}
					{ this.state.open_filter === 'back_date' && 
						<div className="dialog-box">
							<div className="options-popup">
								<div className="selected-date">
									<input type="date" className="selected-date-input" placeholder="最早回团" 
									value={this.state.search.back_date_from || this.state.back_date_from} onChange={e=>this.setState({back_date_from: e.target.value})} />
									至
									<input type="date" className="selected-date-input" placeholder="最晚回团" 
									value={this.state.search.back_date_to || this.state.back_date_to} onChange={e=>this.setState({back_date_to: e.target.value})} />
								</div>
								<div className="options-btn">
								  <div className="options-reset" onClick={_=>this.setState({back_date_from:'',back_date_to:'',search:{...this.state.search,back_date_from:'',back_date_to:''}})}>重置</div>
								  <div className="options-submit" onClick={_=>this.backDateClick()}>确定</div>
								</div>
							</div>
						</div>	
					}
					{ this.state.open_filter === 'group_state' && 
					<Fragment>
						<div className="order-state">
							{Object.keys(Enum['OrderState']).map( (item, i) => 
								<div className={item == (this.state.cur_state || this.state.search.state) ? 'cur-order-state' :  'order-state-item'} 
								onClick={_=>this.orderStateClick(item)} key={item}>{Enum['OrderState'][item]}</div>
							)}
						</div>
						<div className="options-btn" style={{backgroundColor: '#fff'}}>
						  <div className="options-reset" onClick={_=>this.setState({cur_state:'', search:{...this.state.search,state: ''}})}>重置</div>
						  <div className="options-submit" onClick={_=>this.orderStateSubmit()}>确定</div>
						</div>
					</Fragment>
					}
				</div>
			</div>
		);
	}

	renderToolbar(){
		let search_cfg = {
			key: 'Order',
			// options:[
			// 	{text: '订单号', search: 'id'},
			// 	{text: '团号', search: 'group_num'},
			// 	{text: '产品名称', search: 'pd_name'},
			// 	{text: '供应商', search: 'pd_provider'}
			// ],
			cb: (value, key) => {
				let search = this.state.search
				search['id'] = ''
				search['group_num'] = ''
				search['pd_name'] = ''
				search['pd_provider'] = ''
				search[key] = value
				this.setState({search:search});
				reload(this)
			}	
		}
		return <Search value={this.state.search.id || this.state.search.group_num || this.state.search.pd_name || this.state.search.pd_provider} 
						open_search_key={_=>this.setState({open_search_key:true})}
						cur_select={this.state.cur_select_search_filter || ''}
						clear={e=>{e.stopPropagation();this.setState({search:{...this.state.search,id: '', limit: 10, mod: this.mod,id:'',group_id:'',pd_name:'',pd_provider:''}},_=>reload(this))}} 
						param={search_cfg} set_anchor={anchor=>this.search_anchor=anchor} />
	}

	render(){
		return (
			<Page 
				renderToolbar={_=>this.renderToolbar()} 
				onInfiniteScroll={done=>loadMore(this,done)} 
				onShow={_=>this.onShow()}
				renderFixed={_=>this.renderFixed()}>
			<div style={{height:this.props.s.user.sid?"50px":"0px"}} ></div>
			<Popover
			  animation = "none"
			  direction = "down"
			  isOpen={this.state.open_search_key}
			  onCancel={() => this.setState({open_search_key: false})}
			  getTarget={() => this.search_anchor}
			>
			    <div className="dialog-select-box">
			      <div className="dialog-select-item" onClick={_=>this.setState({open_search_key:false,cur_select_search_filter:{text: '订单号', search: 'id'}})}>订单号</div>
			      <div className="dialog-select-item" onClick={_=>this.setState({open_search_key:false,cur_select_search_filter:{text: '团号', search: 'group_num'}})}>团号</div>
			      <div className="dialog-select-item" onClick={_=>this.setState({open_search_key:false,cur_select_search_filter:{text: '产品名称', search: 'pd_name'}})}>产品名称</div>
			      <div className="dialog-select-item" onClick={_=>this.setState({open_search_key:false,cur_select_search_filter:{text: '供应商', search: 'pd_provider'}})}>供应商</div>
			    </div>
			</Popover>
		    {
		    	this.props.s.user.sid && this.state.has_auth && 
	    		<Fragment>
					{
					  	this.props.s.user.sid && pullHook(this)	
				    }
					<div className="order-list">
					    {this.state.data.map(order =>
					      <div className="order-item" key={order.id}>
							  <div className="order-number">
							  	<span style={{fontSize:'.373333rem'}}
								className="gouwuche"> D0{order.order_id}</span>
							  	<span style={{color:'#9E9E9E'}}>{order.company_name}-{order.department_name}-{order.employee_name}</span>
							  </div>
							  <div className="order-main" onClick={_=>this.checkOrder(order)}>
							  {/* 以下为 group 里面拿过来的,应该可以放在函数里,但是HTML里面的东西不太一样 */}
								<div className="pro-item"  key={order.id}
								style={{backgroundColor: '#F8F8F8',borderRadius: '0',width: '100%', height:'100%',margin:'0'}}>
					      			<div className="pro-item-left" style={{width:'2.56rem',height:'2.186667rem'}}>
										<img className="img-size" src={AppCore.HOST+'/'+order.thumb} />
									</div>
					      			<div className="pro-item-right">
										<div className="pro-item-name">{order.pd_name}</div>
										<div className="pro-item-dep_city flex-j-sb">
											<span style={{width: '37.5%'}}>出团: {order.dep_date}</span>
											<span style={{width: '37.5%'}}>回团: {order.back_date}</span>
											<span style={{width: '25%', whiteSpace: 'nowrap', overflow:'auto', textAlign:'right'}}>{order.pd_provider}</span>
										</div>
										<div className="pro-item-price flex-j-sb">
											<span>客户: {order.short_name}</span>
											<span>人数: {order.num_of_people}</span>
											<span className={'active-order-state'+(order.state*1)}>{Enum['OrderState'][order.state]}</span>
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
							  	// testing() &&
								<div className="order-btn">
								{   
									// (order.state ==1) &&
									<button className={((haveActionAuth('删除订单',this.mod) && order.state ==1) ? "":"btn-disabled")+" order-btn-item"}
									disabled={ (haveActionAuth('删除订单',this.mod) && order.state ==1) ?"":"disabled"}	
									onClick={_=>this.DeteleOrder(order)}>删除</button>
								}{
									// (order.revoke_enable ==1) &&
									<button className={((haveActionAuth('撤回订单',this.mod) && order.revoke_enable ==1) ? "":"btn-disabled")+" order-btn-item"}
									disabled={ (haveActionAuth('撤回订单',this.mod) && order.revoke_enable ==1 )?"":"disabled"}
									onClick={_=>this.RevokeOrder(order)}>撤回</button>
								}{
									// ((order.state ==1 || order.state ==2)&&order.settle_change_flow==0 ) &&
									<button className={(( (order.state ==1 || order.state ==2)&&order.settle_change_flow==0 && haveActionAuth('修改订单',this.mod)) ? "":"btn-disabled")+" order-btn-item"}
									disabled={ ((order.state ==1 || order.state ==2)&&order.settle_change_flow==0 && haveActionAuth('修改订单',this.mod)) ?"":"disabled"}
									onClick={_=>this.EditOrder(order)}>修改</button>
								}{
									<button className={( (haveActionAuth('订单名单',this.mod) && order.tourist_lock_state==0) ? "":"btn-disabled")+" order-btn-item"}
									disabled={(haveActionAuth('订单名单',this.mod) && order.tourist_lock_state==0) ?"":"disabled"} onClick={_=>goTo('订单名单',{data:{id:order.id},action:'订单名单'})}>名单</button>
								}{	
									// (order.state ==1) &&
									<button className={((haveActionAuth('占位订单-订单管理',this.mod) && order.state ==1) ? "":"btn-disabled")+" order-btn-item"}
									disabled={( haveActionAuth('占位订单-订单管理',this.mod) && order.state ==1) ?"":"disabled"}
									onClick={_=>this.HoldSeat(order)}>占位</button>
								}
								{
									// (order.state ==1 || order.state ==2)&&
									<button className={((haveActionAuth('实报订单-订单管理',this.mod) && (order.state ==1 || order.state ==2)) ? "":"btn-disabled")+" order-btn-item"}
									disabled={ (haveActionAuth('实报订单-订单管理',this.mod) && (order.state ==1 || order.state ==2) )?"":"disabled"}
									onClick={_=>this.RealSignUp(order)}>实报</button>
								}
								{
									haveActionAuth('新增电子合同-订单管理','订单管理')&&
									<button className={(((order.state ==3 || order.state ==4 || order.state ==5) && order.contract_id ==0 && order.pap_contract_id ==0 && (order.settle_change_flow ==0 || order.settle_change_flow ==4)) ? "":"btn-disabled")+" order-btn-item"}
									 disabled={ ((order.state ==3 || order.state ==4 || order.state ==5) && order.contract_id ==0 && order.pap_contract_id ==0 && (order.settle_change_flow ==0 || order.settle_change_flow ==4))?"":"disabled"}
									onClick={_=>this.setState({selectConShow: true, contract_order: order})}>合同</button>
								}
								</div>
							  }

					      </div>
					    )}
				    </div>
				  	{
				  		this.state.loading && nonBlockLoading()
				  	}
				</Fragment>
		    }
		   	{
		    	this.props.s.user.sid && !this.state.has_auth && NoPv()
		    }
		    {
		  		!this.props.s.user.sid && loginToPlay()
			}
			{this.state.selectConShow && this.selectContract()}

		    </Page>
		);
	}
}

export default connect(s=>({s:s}))(OrderPage)
