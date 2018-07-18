import React, { Component } from 'react';

import {Page,Icon} from 'react-onsenui';

import {AppCore,resetTo, goBack} from '../util/core';
import {pullHook,loginToPlay,search,proList} from '../util/com';
import { connect } from 'react-redux';

import '../css/Search.css'


export default class Search extends Component{

	constructor(props) {
	    super(props);
		this.state = {
			history: [],
			search:''
		};
	}
	componentWillMount(){
		let storage = window.localStorage;
		if(storage && storage.getItem('history')){
			var history = JSON.parse(storage.getItem('history'))
		}else{
			var history = []
		}
		this.setState({history})
	}

	// 清除 历史记录 && 搜索条件
	clearHistory(){
		window.localStorage.setItem('history','')
		this.setState({history:[]})
	}
	clearSearch(){
		this.setState({search:''})
		document.getElementsByClassName('search-input-value')[0].value = ''
	}

	searchPro(e){
		let value = this.state.search
		// 搜索
		if(value == '') return;
		// 添加localstorage 
		let storage = window.localStorage;
		if(storage && storage.getItem('history')){
			var history = JSON.parse(storage.getItem('history'))
		}else{
			var history = []
		}
		if(history.indexOf(value) !== -1) return;
		history.push(value)
		window.localStorage.setItem('history',JSON.stringify(history))
		this.setState({history})
	}
	changeSeaarch(e){
		this.setState({search: e.target.value})
	}
	


	renderToolbar(){
		return (
		  	<ons-toolbar>
		  		{/* <div className='left'><ons-back-button></ons-back-button></div>
				  <div className="center">搜索</div> */}
				<div className="center search-input-box-box">
					<div className="search-input-box">
						<div className="search-left" onClick={_=>goBack()}>
							<img src="img/back.png" />
						</div>
						<div className="search-center">
						  <input className="search-input-value" placeholder="团期/订单号" defaultValue={this.state.search} onChange={this.changeSeaarch.bind(this)}/>
							<Icon className={(this.state.search === '' ? 'hide' : '')+' close-search'} icon='md-close-circle'
							onClick={this.clearSearch.bind(this)} />
						</div>
						<div className="search-right" onClick={this.searchPro.bind(this)}>
						  搜索
						</div>
					</div>
				</div>

		  	</ons-toolbar>
		);
	}

	render(){
		return (
			<Page renderToolbar={_=>this.renderToolbar()} >

			{/* 历史记录 */}
			<div className="model-box-bald">
				<div  className="model-box-bald-title">
					<div className="model-box-bald-title-text">历史记录</div>
					<div className="model-box-bald-title-delete" 
					onClick={this.clearHistory.bind(this)}><Icon icon='md-delete' /></div>
				</div>
				
				<div className="model-box-bald-history">
					{this.state.history.map( item =>
					<div className="model-box-bald-history-item">{item}</div>					
					)}
				</div>
			</div>

			{/* 搜索结果 */}
			{/* {proList('search',this.state.data)} */}





		  </Page>
		);
	}
}

