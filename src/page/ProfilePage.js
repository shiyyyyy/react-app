import React, { Component } from 'react';

import {Page,Switch,Icon} from 'react-onsenui';

import {trigger,post,resetTo,loadIfEmpty,i18n,clickToLog,reload,haveModAuth,AppCore,goTo} from '../util/core';
import {pullHook,confirm,nonBlockLoading} from '../util/com';
import { connect } from 'react-redux';
import moment from 'moment';


import '../css/ProfilePage.css'

class ProfilePage extends Component{

	constructor(props) {
	    super(props);
	    this.state = {state:'initial','order_mod_click':false,data:{'订单数据':{},'账户数据':{},'账户监管':[{}],'消息通知':[],'员工数据':[{}]}};
	    this.url = '/PublicApi/read_home?mod=HOME';
	    this.click_history = [];
	}


	logout(){
	    post('/Session/logout');
	}

	on_msg(){
		let url = '/PublicApi/enable_pop_window';
		let pop = 1;
		this.pop_msg(url,pop)
	}
	off_msg(){
		let url = '/PublicApi/disable_pop_window';
		let pop = 0;
		this.pop_msg(url,pop)
	}

	pop_msg(url,pop){
		trigger('加载等待');
		post(url).then(
			r=>{
				let data = this.state.data;
				// data['员工数据'][0]['enable_pop_msg'] 0关  1开
				data['员工数据'][0]['enable_pop_msg'] = pop;
				this.setState({data:data});
			}
		);
	}

	LoadMoreAccount(){
		if(!this.props.s.user.sid){
			return ; 
		}
		goTo('我的账户');
	}

	LoadMoreTodayDepOrder(params){
		if(!this.props.s.user.sid){
			return;
		}
		if(AppCore.TabPage){
			AppCore.TabPage.setState({index:1});
			if(AppCore.OrderPage){
				let search = {limit:10};
				search.dep_date_from = moment().format('YYYY-MM-DD');
				search.dep_date_to = moment().format('YYYY-MM-DD');

				AppCore.OrderPage.setState({search:search});
				AppCore.OrderPage.setState({dep_date_from:search.dep_date_from});
				AppCore.OrderPage.setState({dep_date_to:search.dep_date_to});
				if(this.state['order_mod_click']){
					reload(AppCore.OrderPage);
				}
				this.setState({order_mod_click:true});
			}
		}
	}


	LoadMoreTodayBackOrder(params){
		if(!this.props.s.user.sid){
			return;
		}
		if(AppCore.TabPage){
			AppCore.TabPage.setState({index:1});
			if(AppCore.OrderPage){

				let search = {limit:10};
				search.back_date_from = moment().format('YYYY-MM-DD');
				search.back_date_to = moment().format('YYYY-MM-DD');

				AppCore.OrderPage.setState({search:search});
				AppCore.OrderPage.setState({back_date_from:search.back_date_from});
				AppCore.OrderPage.setState({back_date_to:search.back_date_to});
				if(this.state['order_mod_click']){
					reload(AppCore.OrderPage);
				}
				this.setState({order_mod_click:true});
			}
		}
	}


	LoadMoreTorrDepOrder(params){
		if(!this.props.s.user.sid){
			return;
		}
		if(AppCore.TabPage){
			AppCore.TabPage.setState({index:1});
			if(AppCore.OrderPage){
				let search = {limit:10};
				search.dep_date_from = moment().add(1,'days').format('YYYY-MM-DD');
				search.dep_date_to = moment().add(1,'days').format('YYYY-MM-DD');
				
				AppCore.OrderPage.setState({search:search});
				AppCore.OrderPage.setState({dep_date_from:search.dep_date_from});
				AppCore.OrderPage.setState({dep_date_to:search.dep_date_to});

				if(this.state['order_mod_click']){
					reload(AppCore.OrderPage);
				}
				this.setState({order_mod_click:true});
			}
		}
	}


	LoadMoreTorrBackOrder(params){
		if(!this.props.s.user.sid){
			return;
		}
		if(AppCore.TabPage){
			AppCore.TabPage.setState({index:1});
			if(AppCore.OrderPage){
				let search = {limit:10};
				search.back_date_from = moment().add(1,'days').format('YYYY-MM-DD');
				search.back_date_to = moment().add(1,'days').format('YYYY-MM-DD');
				
				AppCore.OrderPage.setState({search:search});
				AppCore.OrderPage.setState({back_date_from:search.back_date_from});
				AppCore.OrderPage.setState({back_date_to:search.back_date_to});


				if(this.state['order_mod_click']){
					reload(AppCore.OrderPage);
				}
				this.setState({order_mod_click:true});
			}
		}
	}

	LoadMoreRegulatory(){
		if(!this.props.s.user.sid){
			return;
		}
		goTo('账户监管');
	}

	render(){
		return (
		<Page onShow={_=>loadIfEmpty(this)}>
			{
			  	this.props.s.user.sid && pullHook(this)	
		    }
			{
		  		this.state.loading && nonBlockLoading()
			}
			<div className="my-top-bg">
				<img src={this.props.s.user.sid && this.state.data['个人头像']?AppCore.HOST+'/'+this.state.data['个人头像']:'img/avatar.png'} className="user-avatar" onClick={_=>clickToLog(this)} /><br />
				{
					this.props.s.user.sid && 
						<div className="user-info">
							<span >所属中心: {this.props.s.user.company_name}</span>
							<span >所属部门: {this.props.s.user.department_name}</span>
							<span >员工姓名: {this.props.s.user.employee_name}</span>
						</div>
				}
				<div className="user-operation">
					{
						this.props.s.user.sid && 
							<div className="" onClick={_=>this.logout()}>退出登录</div>
					}
					{
						!this.props.s.user.sid && 
							<div className="" onClick={_=>resetTo('登录页')}>立即登录</div>
					}
				</div>
			</div>
			{/* 消息通知 设置 */}
			{ this.props.s.user.sid &&
			<div className="model-box-bald">
				<div  className="model-box-bald-title">
					<div className="model-box-bald-title-text tongzhi">通知开关</div>
				</div>
				<div className="model-box-bald-main-msgPrompt">
					<div className="model-box-bald-main-item-msg" onClick={_=>this.on_msg()}>
						<Icon className={this.state.data['员工数据'][0]['enable_pop_msg']>0?'on-icon':'hide'} icon="md-dot-circle-alt" />
						<Icon className={this.state.data['员工数据'][0]['enable_pop_msg']>0?'hide':'off-icon'} icon="md-circle-o" />
						<img src='img/on-msg.png' />
						<span>启用</span>
					</div>
					<div className="model-box-bald-main-item-msg" onClick={_=>this.off_msg()}>
						<Icon className={this.state.data['员工数据'][0]['enable_pop_msg']>0?'hide':'on-icon'} icon="md-dot-circle-alt" />
						<Icon className={this.state.data['员工数据'][0]['enable_pop_msg']>0?'off-icon':'hide'} icon="md-circle-o" />
						<img src='img/off-msg.png' />
						<span>停用</span>
					</div>
				</div>
			</div>
			}
			{/* 最近订单 */
				this.props.s.user.sid && 
				<div className="model-box-bald">
					<div className="model-box-bald-title">
						<div className="model-box-bald-title-text dingdan">最近订单</div>
						<div className="model-box-bald-title-more" onClick={_=>this.LoadMoreTodayDepOrder()}>详情</div>
					</div>

					<div className="model-box-bald-main">
						<div className="model-box-bald-main-item-order" onClick={_=>this.LoadMoreTodayDepOrder()}>
							<span>{this.state.data['订单数据'].today_dep}</span><br /><span style={{fontSize:'.266667rem'}}>今日出团</span>
						</div>
						<div className="model-box-bald-main-item-order" onClick={_=>this.LoadMoreTodayBackOrder()}>
							<span>{this.state.data['订单数据'].today_back}</span><br /><span style={{fontSize:'.266667rem'}}>今日回团</span>
						</div>
						<div className="model-box-bald-main-item-order" onClick={_=>this.LoadMoreTorrDepOrder()}>
							<span>{this.state.data['订单数据'].tomorrow_dep}</span><br /><span style={{fontSize:'.266667rem'}}>明日出团</span>
						</div>
						<div className="model-box-bald-main-item-order" onClick={_=>this.LoadMoreTorrBackOrder()}>
							<span>{this.state.data['订单数据'].tomorrow_back}</span><br /><span style={{fontSize:'.266667rem'}}>明日回团</span>
						</div>
					</div>
				</div>
			}
			{/* 我的账本 */
				this.props.s.user.sid && haveModAuth('我的账户') &&
				<div className="model-box-bald">
					<div  className="model-box-bald-title">
						<div className="model-box-bald-title-text zhangben">我的账本</div>
						<div className="model-box-bald-title-more" onClick ={_=>this.LoadMoreAccount()} >详情</div>
					</div>

					<div className="model-box-bald-main" style={{display:'block'}}>
						<div className="model-box-bald-main-bill-t">
							<div className="model-box-bald-main-item-myBooks">
								<img src="img/books1.png" />
								<div>
									<span style={{fontSize:'.266667rem'}}>收入总计</span><br /><span >￥{this.state.data['账户数据'].income || '0.00'}</span>
								</div>
							</div>
							<div className="model-box-bald-main-item-myBooks">
								<img src="img/books2.png" />
								<div><span style={{fontSize:'.266667rem'}}>支出总计</span><br /><span >￥{this.state.data['账户数据'].expense || '0.00'}</span></div>
							</div>
							<div className="model-box-bald-main-item-myBooks">
								<img src="img/books3.png" /><br />
								<div><span style={{fontSize:'.266667rem'}}>时时余额</span><br /><span >￥{this.state.data['账户数据'].balance || '0.00'}</span></div>
							</div>
							<div className="model-box-bald-main-item-myBooks">
								<img src="img/books4.png" /><br />
								<div><span style={{fontSize:'.266667rem'}}>冻结余额</span><br /><span >￥{this.state.data['账户数据'].freeze || '0.00'}</span></div>
							</div>
						</div>
						<div className="model-box-bald-main-bill-b">
							<div className="model-box-bald-main-item-myBooks" style={{marginBottom: '0'}}>
								<img src="img/books5.png" /><br />
								<div><span style={{fontSize:'.266667rem'}}>可用余额</span><br /><span >￥{this.state.data['账户数据'].avail_balance || '0.00'}</span></div>
							</div>
							<div className="model-box-bald-main-item-myBooks" style={{marginBottom: '0',color: '#7B94F3'}}>
								<img src="img/books6.png" /><br />
								<div><span style={{fontSize:'.266667rem'}}>待支金额</span><br /><span >￥{this.state.data['账户数据'].expense_to_be_approved || '0.00'}</span></div>
							</div>
							<div className="posi-ab-left"></div>
							<div className="posi-ab-right"></div>
						</div>
						
					</div>
				</div>
			}
			{/*账户监管*/
				this.props.s.user.sid && haveModAuth('账户监管') &&
				<div className="model-box-bald">
					<div  className="model-box-bald-title">
						<div className="model-box-bald-title-text jianguan">账户监管</div>
						<div className="model-box-bald-title-more" onClick = {_=>this.LoadMoreRegulatory()}>详情</div>
					</div>
					<div className="model-box-bald-main" style={{display: 'block', padding: '0 .64rem'}}>
						<div className="model-box-bald-main-item-jianguan">
							<div className="model-box-bald-main-item-jianguan-left">
								<img src="img/books1.png" />
								&nbsp;&nbsp;收入总计
							</div>
							<div className="model-box-bald-main-item-jianguan-right">
								￥{this.state.data['账户监管'][0].income || '0.00'}
							</div>
						</div>
						<div className="model-box-bald-main-item-jianguan">
							<div className="model-box-bald-main-item-jianguan-left">
								<img src="img/books2.png" />
								&nbsp;&nbsp;支出总计
							</div>
							<div className="model-box-bald-main-item-jianguan-right">
							    ￥{this.state.data['账户监管'][0].expense || '0.00'}
							</div>
						</div>
						<div className="model-box-bald-main-item-jianguan">
							<div className="model-box-bald-main-item-jianguan-left">
								<img src="img/books3.png" />
								&nbsp;&nbsp;时时余额
							</div>
							<div className="model-box-bald-main-item-jianguan-right">
								￥{this.state.data['账户监管'][0].balance || '0.00'}
							</div>
						</div>
					</div>
				</div>
			}
			{/* 
				this.props.s.user.sid && 
				<div className="model-box-bald">
					<div  className="model-box-bald-title">
						<div className="model-box-bald-title-text">消息通知</div>
						<div className="model-box-bald-title-more">更多</div>
					</div>

					<div className="model-box-bald-main-msg">
					{ 
						this.state.data['消息通知'].map((msg,i)=>
							<div className="model-box-bald-main-msg-item" key={i}>
								<div className="model-box-bald-main-msg-item-left">
									<span>发布人: {msg.publisher_name}</span> <span>{msg.create_at}</span>
									<div>{i18n.pick(msg.title)}</div>
								</div>
								<div className="model-box-bald-main-msg-item-right">
									<img src="img/msg1.png" />
								</div>
							</div>
						)

					}
					</div>
				</div>
			}	   */}
				  
		  </Page>
		);
	}
}

export default connect(s=>({s:s}))(ProfilePage)

