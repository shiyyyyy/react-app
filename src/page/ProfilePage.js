import React, { Component } from 'react';

import {trigger,post} from '../util/core';
import {pullHook,confirm} from '../util/com';
import { connect } from 'react-redux';

import '../css/ProfilePage.css'

export default class ProfilePage extends Component{

	constructor(props) {
	    super(props);
	    this.state = {state:'initial',pageList:[]};
	}
	logout(){
	    post('/Session/logout');
	    trigger('更新用户',{});
	}
	render(){
		return (
		<ons-page>
			<ons-toolbar>
			  <div className="center">我</div>
			</ons-toolbar>

			<div className="my">
				{/* 顶部个人信息 */}
				<div className="my-top-bg">
					<img src="img/avatar.png" className="user-avatar" /><br />
					<div className="user-info">
						<span >所属中心: 营销中心{}</span>
						<span >所属部门: 出境部{}</span>
						<span >员工姓名: 晚辅导{}</span>
					</div>
					<div className="user-operation">
						<div className="">退出登录</div>
						<div className="">修改密码</div>
						<div className="">修改头像</div>
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
							<span>143</span><br /><span style={{fontSize:'.266667rem'}}>今日出团</span>
						</div>
						<div className="model-box-bald-main-item-order">
							<span>131</span><br /><span style={{fontSize:'.266667rem'}}>今日回团</span>
						</div>
						<div className="model-box-bald-main-item-order">
							<span>98</span><br /><span style={{fontSize:'.266667rem'}}>明日出团</span>
						</div>
						<div className="model-box-bald-main-item-order">
							<span>248</span><br /><span style={{fontSize:'.266667rem'}}>明日回团</span>
						</div>
					</div>
				</div>
				{/* 我的账本 */}
				<div className="model-box-bald">
					<div  className="model-box-bald-title">
						<div className="model-box-bald-title-text">最近订单</div>
						<div className="model-box-bald-title-more">详情</div>
					</div>

					<div className="model-box-bald-main">
						<div className="model-box-bald-main-item-myBooks">
							<img src="img/books1.png" /><br />
							<span style={{fontSize:'.266667rem'}}>收入总计</span><br /><span >￥127843</span>
						</div>
						<div className="model-box-bald-main-item-myBooks">
							<img src="img/books2.png" /><br />
							<span style={{fontSize:'.266667rem'}}>支出总计</span><br /><span >￥89300</span>
						</div>
						<div className="model-box-bald-main-item-myBooks">
							<img src="img/books3.png" /><br />
							<span style={{fontSize:'.266667rem'}}>时时余额</span><br /><span >￥64000</span>
						</div>
						<div className="model-box-bald-main-item-myBooks">
							<img src="img/books4.png" /><br />
							<span style={{fontSize:'.266667rem'}}>冻结余额</span><br /><span >￥232456</span>
						</div>
						<div className="model-box-bald-main-item-myBooks">
							<img src="img/books5.png" /><br />
							<span style={{fontSize:'.266667rem'}}>可用余额</span><br /><span >￥7800000</span>
						</div>
					</div>
				</div>

				{/* 消息通知 */}
				<div className="model-box-bald">
					<div  className="model-box-bald-title">
						<div className="model-box-bald-title-text">消息通知</div>
						<div className="model-box-bald-title-more">更多</div>
					</div>

					<div className="model-box-bald-main-msg">
						<div className="model-box-bald-main-msg-item">
							<div className="model-box-bald-main-msg-item-left">
								<span>发布人: 王尼玛</span> <span>2018-08-24</span> <span>15:33:54</span>
								<div>标题: 王尼玛唐马儒王尼美张全蛋大队长刘木子铁蛋翠花过气老鲜肉</div>
							</div>
							<div className="model-box-bald-main-msg-item-right">
								<img src="img/msg1.png" />
							</div>
						</div>
						<div className="model-box-bald-main-msg-item">
							<div className="model-box-bald-main-msg-item-left">
								<span>发布人: 王尼玛</span> <span>2018-08-24</span> <span>15:33:54</span>
								<div>标题: 王尼玛唐马儒王尼美张全蛋大队长刘木子铁蛋翠花过气老鲜肉</div>
							</div>
							<div className="model-box-bald-main-msg-item-right">
								<img src="img/msg1.png" />
							</div>
						</div><div className="model-box-bald-main-msg-item">
							<div className="model-box-bald-main-msg-item-left">
								<span>发布人: 王尼玛</span> <span>2018-08-24</span> <span>15:33:54</span>
								<div>标题: 王尼玛唐马儒王尼美张全蛋大队长刘木子铁蛋翠花过气老鲜肉</div>
							</div>
							<div className="model-box-bald-main-msg-item-right">
								<img src="img/msg1.png" />
							</div>
						</div>
					</div>
				</div>
			</div>

				  
				  
				  
				  
			<div></div>
				  
				  
		  </ons-page>
		);
	}
};

