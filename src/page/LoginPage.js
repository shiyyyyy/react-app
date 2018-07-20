import React, { Component } from 'react';

import { Input,ProgressCircular,Icon, Page, Modal } from 'react-onsenui';

import {AppCore,clickToLog,resetTo,post,encUrl,trigger,store} from '../util/core';

import { connect } from 'react-redux';

import '../css/LoginPage.css'

export default class LoginPage extends Component{
	constructor(props) {
	    super(props);
	    this.state = {
	    	ios_tkn:AppCore.ios_tkn,
	    	product_code:AppCore.APP_NAME,
	    	account:'',
	    	password:''
	    };
	    this.click_history = [];

	}

	login(){

		trigger('加载等待');
		// setTimeout(_=>{
	        post('/Session/login?'+encUrl({app:1,user:this.state.user}),this.state).then(
	          r=>{
	            trigger('更新用户',r.user);
	            return '保持等待';
	          }
	        );
    	// },2000)

	}

	renderToolbar(){
		return (
		  <ons-toolbar>
		      <div className="center" onClick={_=>clickToLog(this)}>用户登录</div>
		  </ons-toolbar>
		);
	}

	goTest(){
		let page = this;
	    page.click_history.push(new Date().getTime());
	    if (page.click_history.length >= 5) {
	        let interval = page.click_history[4] - page.click_history[0];
	        if (interval < 2000) {
	        	AppCore.HOST = 'http://b2b.tongyeju.com/zs-back';
	            page.setState({testing:true});
	        }
	        page.click_history.splice(0, page.click_history.length);
	    }
	}


	render(){
		return (
			<Page 
				renderToolbar={_=>this.renderToolbar()} >

			    <div className="login">
					<div className="login-top-bg">
						<img src="img/avatar.png" className="user-img" onClick={_=>this.goTest()} />
						{
							AppCore.HOST == 'http://b2b.tongyeju.com/zs-back' && 
							<p>已进入测试模式</p>
						}
						
					</div>
					<div className="login-input-box">

						<p>
							<img src="img/user.png"/>
			    	  		<input value={this.state.account} onChange={ e=>this.setState({account:e.target.value}) } 
			    	  		type="text" placeholder="账号" className="login-input"/>
			    	   	</p>
						<p>
							<img src="img/password.png"/>
			    	  		<input value={this.state.password} onChange={ e=>this.setState({password:e.target.value}) } 
			    	  		type="password" placeholder="密码" className="login-input"/>
		    			</p>
						<div className="login-btn-box">
							<button onClick={_=>this.login()}>登录</button>
						</div>
					</div>
			    </div>
			  
			</Page>
		);
	}
}
