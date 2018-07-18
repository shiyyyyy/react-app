import React, { Component } from 'react';

import {Page} from 'react-onsenui';

import {trigger,post,resetTo,loadIfEmpty,i18n} from '../util/core';
import {pullHook,confirm,nonBlockLoading} from '../util/com';
import { connect } from 'react-redux';



import '../css/ProfilePage.css'

class ProfilePage extends Component{

	constructor(props) {
	    super(props);
	    this.state = {state:'initial',data:{'订单数据':{},'账户数据':{},'消息通知':[]}};
	    this.url = '/PublicApi/read_home?mod=HOME';
	}


	logout(){
	    post('/Session/logout');
	}

	render(){
		return (
		<Page onShow={_=>loadIfEmpty(this)}>

			<div className="my">
				{
				  	this.props.s.user.employee_id && pullHook(this)	
			    }
				{
			  		this.state.loading && nonBlockLoading()
				}
				<div className="my-top-bg">
					<img src="img/avatar.png" className="user-avatar" /><br />
					{
						this.props.s.user.employee_id && 
							<div className="user-info">
								<span >所属中心: {this.props.s.user.company_name}</span>
								<span >所属部门: {this.props.s.user.department_name}</span>
								<span >员工姓名: {this.props.s.user.employee_name}</span>
							</div>
					}
					<div className="user-operation">
						{
							this.props.s.user.employee_id && 
								<div className="" onClick={_=>this.logout()}>退出登录</div>
						}
						{
							!this.props.s.user.employee_id && 
								<div className="" onClick={_=>resetTo('登录页')}>立即登录</div>
						}
					</div>
				</div>
				{/* 最近订单 */}
				<div className="model-box-bald">
					<div  className="model-box-bald-title">
						<div className="model-box-bald-title-text">最近订单</div>
						<div className="model-box-bald-title-more">详情</div>
					</div>

					<div className="model-box-bald-main">
						<div className="model-box-bald-main-item-order">
							<span>{this.state.data['订单数据'].today_dep}</span><br /><span style={{fontSize:'.266667rem'}}>今日出团</span>
						</div>
						<div className="model-box-bald-main-item-order">
							<span>{this.state.data['订单数据'].today_back}</span><br /><span style={{fontSize:'.266667rem'}}>今日回团</span>
						</div>
						<div className="model-box-bald-main-item-order">
							<span>{this.state.data['订单数据'].tomorrow_dep}</span><br /><span style={{fontSize:'.266667rem'}}>明日出团</span>
						</div>
						<div className="model-box-bald-main-item-order">
							<span>{this.state.data['订单数据'].tomorrow_back}</span><br /><span style={{fontSize:'.266667rem'}}>明日回团</span>
						</div>
					</div>
				</div>
				{/* 我的账本 */}
				<div className="model-box-bald">
					<div  className="model-box-bald-title">
						<div className="model-box-bald-title-text">我的账本</div>
						<div className="model-box-bald-title-more">详情</div>
					</div>

					<div className="model-box-bald-main" style={{display:'block'}}>
						<div className="model-box-bald-main-bill-t">
							<div className="model-box-bald-main-item-myBooks">
								<img src="img/books1.png" />
								<div>
									<span style={{fontSize:'.266667rem'}}>收入总计</span><br /><span >￥{this.state.data['账户数据'].income}</span>
								</div>
							</div>
							<div className="model-box-bald-main-item-myBooks">
								<img src="img/books2.png" />
								<div><span style={{fontSize:'.266667rem'}}>支出总计</span><br /><span >￥{this.state.data['账户数据'].expense}</span></div>
							</div>
							<div className="model-box-bald-main-item-myBooks">
								<img src="img/books3.png" /><br />
								<div><span style={{fontSize:'.266667rem'}}>时时余额</span><br /><span >￥{this.state.data['账户数据'].balance}</span></div>
							</div>
							<div className="model-box-bald-main-item-myBooks">
								<img src="img/books4.png" /><br />
								<div><span style={{fontSize:'.266667rem'}}>冻结余额</span><br /><span >￥{this.state.data['账户数据'].freeze}</span></div>
							</div>
						</div>
						<div className="model-box-bald-main-bill-b">
							<div className="model-box-bald-main-item-myBooks" style={{marginBottom: '0'}}>
								<img src="img/books5.png" style={{width: '.96rem',height: '.96rem'}} /><br />
								<div><span style={{fontSize:'.266667rem'}}>可用余额</span><br /><span >￥{this.state.data['账户数据'].avail_balance
								}</span></div>
							</div>
							<div className="posi-ab-left"></div>
							<div className="posi-ab-right"></div>
						</div>
						
					</div>
				</div>

				{/* 消息通知 */
					this.props.s.user.employee_id && 
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
					}
			</div>
				  
				  
		  </Page>
		);
	}
}

export default connect(s=>({s:s}),undefined)(ProfilePage)

