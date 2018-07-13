import React, { Component } from 'react';

import {Page} from 'react-onsenui';

import {AppCore,resetTo} from '../util/core';
import {pullHook,loginToPlay,search} from '../util/com';
import { connect } from 'react-redux';

import '../css/Search.css'


export default class Search extends Component{

	constructor(props) {
	    super(props);
		this.state = {
		};
	}


	renderToolbar(){
		return (
		  	<ons-toolbar>
		  		{/* <div className='left'><ons-back-button></ons-back-button></div>
				  <div className="center">搜索</div> */}
				<div className="center search-input-box-box">
					<div className="search-input-box">
						<div className="search-left" >
							<img src="img/back.png" />
						</div>
						<div className="search-center">
						  <input placeholder="团期/订单号" />
						</div>
						<div className="search-right">
						  取消
						</div>
					</div>
				</div>

		  	</ons-toolbar>
		);
	}

	render(){
		return (
			<Page renderToolbar={_=>this.renderToolbar()} >
				搜索页面
		    </Page>
		);
	}
}

