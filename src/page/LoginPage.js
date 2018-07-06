import React, { Component } from 'react';

import { Input } from 'react-onsenui';

import {AppCore,clickToLog,resetTo,post,encUrl,trigger} from '../util/core';


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
        post('/Session/login?'+encUrl({app:1,user:this.state.user}),this.state).then(
          r=>{
            trigger('更新用户',r.user);
            resetTo('底栏菜单');
          }
        );
	}

	render(){
		return (
			<ons-page>
			  <ons-toolbar>
			      <div className="center" onClick={_=>clickToLog(this)}>用户登录</div>
			  </ons-toolbar>
			  <div className="login">
					<div className="login-top-bg">
						<p>北京青年旅行社</p>
						<img src="img/avatar.png" className="user-img" />
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
			</ons-page>
		);
	}
};
