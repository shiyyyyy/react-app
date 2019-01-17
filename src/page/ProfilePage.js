import React, { Component, Fragment } from 'react';

import {Page,Switch,Icon} from 'react-onsenui';

import { trigger, post, resetTo, loadIfEmpty, i18n, clickToLog, reload, haveModAuth, haveActionAuth, AppCore, goTo, testing} from '../util/core';
import {pullHook,confirm,nonBlockLoading} from '../util/com';
import { connect } from 'react-redux';
import moment from 'moment';


import '../css/ProfilePage.css'

class ProfilePage extends Component{

	constructor(props) {
	    super(props);
		this.state = {
			state: 'initial', 'order_mod_click': false
	    			,data:{'订单数据':{},'账户数据':{},'账户监管':[{}],'消息通知':[]
	    			,'员工数据':[{}]}
	    			,'has_account_auth':false
					,'has_regulatory_auth':false
					,'has_claimFunds_auth': false
					,'has_claimFundsSenior_auth': false
					,'has_contract_auth': false
					, 'has_doc_apply_auth': false
					,'has_wechat_auth': false};
	    this.url = '/PublicApi/app_profile_page';
	    this.click_history = [];
	}

	onShow(){
		loadIfEmpty(this);
		let has_account_auth = haveModAuth('我的账户');
		this.setState({has_account_auth:has_account_auth});
		let has_regulatory_auth = haveModAuth('账户监管');
		this.setState({has_regulatory_auth:has_regulatory_auth});
		let has_claimFunds_auth = haveActionAuth('搜索资金','资金认领');
		this.setState({ has_claimFunds_auth: has_claimFunds_auth });
		let has_claimFundsSenior_auth = haveActionAuth('高级搜索资金', '资金认领');
		this.setState({ has_claimFundsSenior_auth: has_claimFundsSenior_auth });

		let has_contract_auth = haveModAuth('电子合同-订单');
		this.setState({ has_contract_auth: has_contract_auth });
		let has_doc_apply_auth = haveModAuth('收支申请');
		this.setState({ has_doc_apply_auth: has_doc_apply_auth });
		let has_wechat_auth = haveModAuth('微信订单');
		this.setState({ has_wechat_auth: has_wechat_auth });

		// 数据统计
		let has_same_trade_statistics = haveModAuth('同业采购统计');
		this.setState({ has_same_trade_statistics: has_same_trade_statistics });
		let has_business_capital_statistics = haveModAuth('业务资金统计');
		this.setState({ has_business_capital_statistics: has_business_capital_statistics });
		let has_pro_tag_statistics = haveModAuth('产品标签统计');
		this.setState({ has_pro_tag_statistics: has_pro_tag_statistics });
		let has_retail_sales_customers_statistics = haveModAuth('门市收客统计');
		this.setState({ has_retail_sales_customers_statistics: has_retail_sales_customers_statistics });

	}


	logout(){
		trigger('加载等待');
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

	otherFuc(target, act, md){
		let action = act || null
		let mod = md || null
		goTo(target, {action,mod})
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
			<Page onShow={_ => this.onShow()} >
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
							<Fragment>
								<div className="" onClick={_=>this.logout()}>退出登录</div>
								{
									<div onClick={_ => goTo('我的二维码')}>
										<span >我的二维码</span>
									</div>
								}
							</Fragment>
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
			{ /* 其他功能 */
				this.props.s.user.sid && 
				<div className="model-box-bald">
					<div className="model-box-bald-title">
						<div className="model-box-bald-title-text dingdan">其他功能</div>
						{/* <div className="model-box-bald-title-more" onClick={_ => this.LoadMoreTodayDepOrder()}>详情</div> */}
					</div>
					<div className="model-box-bald-main" style={{justifyContent:'start', position: 'relative'}}>
					{this.state.has_claimFunds_auth && 
						<div className="other-fuc-item" onClick={_ => this.otherFuc("资金认领")}>
							<img className="other-img" src="img/books2.png" />
							<div>资金认领</div>
						</div>
					}
					{this.state.has_claimFundsSenior_auth && 
							<div className="other-fuc-item" onClick={_ => this.otherFuc("资金认领", { action: '高级资金搜索' })}>
								<img className="other-img" src="img/books2.png" />
								<div>高级认领</div>
							</div>
					}
					{this.state.has_contract_auth &&
						<div className="other-fuc-item" onClick={_=>this.otherFuc("合同列表")}>
							<img className="other-img" src="img/doc_icon/rzxq.png" />
							<div>合同列表</div>
						</div>
					}
					{this.state.has_doc_apply_auth &&
						<div className="other-fuc-item" onClick={_ => this.otherFuc("收支申请列表")}>
							<img className="other-img" src="img/doc_icon/tzdj.png" />
							<div>收支申请</div>
						</div>
					}
					{this.state.has_wechat_auth &&
						<div className="other-fuc-item" onClick={_ => this.otherFuc("微信订单")}>
							<img className="other-img" src="img/dingdan.png" />
							<div>微信订单</div>
						</div>
					}

					{/* 加载蒙层 */}
					{this.state.loading && 
						<div className="fixed-mod"><Icon className="fa fa-spinner fixed-mod-icon pull-hook-content" spin /></div>
					}

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
				this.props.s.user.sid && this.state.has_account_auth  &&
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
				this.props.s.user.sid && this.state.has_regulatory_auth &&
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


			{ /* 数据统计 */
				this.props.s.user.sid && (this.state.has_same_trade_statistics || this.state.has_business_capital_statistics || this.state.has_pro_tag_statistics || this.state.has_retail_sales_customers_statistics) &&
				<div className="model-box-bald">
					<div className="model-box-bald-title">
						<div className="model-box-bald-title-text dingdan">数据统计</div>
						{/* <div className="model-box-bald-title-more" onClick={_ => this.LoadMoreTodayDepOrder()}>详情</div> */}
					</div>
					<div className="model-box-bald-main" style={{justifyContent:'start', position: 'relative'}}>
					{this.state.has_same_trade_statistics &&
						<div className="other-fuc-item" onClick={_=>this.otherFuc("统计时间选择", null, '同业采购统计')}>
							<img className="other-img" src="img/tongji_icon/caigou.png" />
							<div>同业采购</div>
						</div>
					}
					{this.state.has_business_capital_statistics && 
						<div className="other-fuc-item" onClick={_ => this.otherFuc("统计业务资金")}>
							<img className="other-img" src="img/tongji_icon/zijin.png" />
							<div>业务资金</div>
						</div>
					}
					{this.state.has_pro_tag_statistics &&
						<div className="other-fuc-item" onClick={_=>this.otherFuc("统计时间选择", null, '产品标签统计')}>
							<img className="other-img" src="img/tongji_icon/xianlu.png" />
							<div>线路区域</div>
						</div>
					}
					{this.state.has_retail_sales_customers_statistics &&
						<div className="other-fuc-item" onClick={_ => this.otherFuc("统计时间选择", null, '门市收客统计')}>
							<img className="other-img" src="img/tongji_icon/menke.png" />
							<div>门市收客</div>
						</div>
					}

						{/* 加载蒙层 */}
						{this.state.loading && 
							<div className="fixed-mod"><Icon className="fa fa-spinner fixed-mod-icon pull-hook-content" spin /></div>
						}

					</div>

				</div>
			}
			
				  
		  </Page>
		);
	}
}

export default connect(s=>({s:s}))(ProfilePage)

