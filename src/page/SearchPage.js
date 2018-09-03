import React, { Component } from 'react';

import {Page,Icon} from 'react-onsenui';

import {AppCore,resetTo, goBack, goTo, reload} from '../util/core';

import '../css/SearchPage.css'
export default class SearchPage extends Component{

	constructor(props) {
		super(props);
		this.placeholder = this.props.p.placeholder
		this.key = this.props.p.cur_select || this.props.p.key
		
		this.key_hitory = this.key + (this.props.p.key_type || '')
		
		let history = [];
		let storage = window.localStorage;
		if(storage && storage.getItem(this.key_hitory+'History')){
			history = JSON.parse(storage.getItem(this.key_hitory+'History'))
		}
		this.state = {
			history: history,
			search:''
		};
	}

	// 清除 历史记录 && 搜索条件
	clearHistory(){
		window.localStorage.setItem(this.key_hitory+'History','')
		this.setState({history:[]})
	}
	clearSearch(){
		this.setState({search:''})
	}

	clickHistory(val){
		this.setState({search: val})
	}

	clickSearch(){
		let value = this.state.search

		if(value == '') return;
		// 添加localstorage 
		let storage = window.localStorage;
		if(storage && storage.getItem(this.key_hitory+'History')){
			var history = JSON.parse(storage.getItem(this.key_hitory+'History'))
		}else{
			var history = []
		}
		if(history.indexOf(value) === -1){
			history.push(value)
		}
		
		window.localStorage.setItem(this.key_hitory+'History',JSON.stringify(history))
		this.props.p.cb(value, this.props.p.key_type)
		
		goBack()
	}

	renderToolbar(){
		return (
		  	<ons-toolbar>
				<div className="center search-input-box-box">
					<div className="search-input-box">
						<div className="search-left" onClick={_=>goBack()}>
							<img src="img/back.png" />
						</div>
						<div className="search-center">
						  <input type="text" className="search-input-value" placeholder={this.placeholder} 
						  		value={this.state.search} onChange={e=>this.setState({search:e.target.value})}/>
							<Icon className={(this.state.search === '' ? 'hide' : '')+' close-search'} icon='md-close-circle'
							onClick={this.clearSearch.bind(this)} />
						</div>
						<div className="search-right" onClick={_ => this.clickSearch()}>
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
					<div className="model-box-bald-history-item" key={item}
					onClick={_=>this.clickHistory(item)}>{item}</div>					
					)}
				</div>
			</div>

		  </Page>
		);
	}
}

