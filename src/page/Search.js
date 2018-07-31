import React, { Component } from 'react';

import {Page,Icon} from 'react-onsenui';

import {AppCore,resetTo, goBack, goTo} from '../util/core';
import {pullHook,loginToPlay,search,proList} from '../util/com';
import { connect } from 'react-redux';

import '../css/Search.css'


export default class Search extends Component{

	constructor(props) {
		super(props);
		this.placeholder = this.props.p.placeholder
		this.type = this.props.p.key
		this.cb = this.props.p.cb

		this.state = {
			history: [],
			search:''
		};
	}
	componentWillMount(){
		// placeholder

		// 历史记录
		let storage = window.localStorage;
		if(storage && storage.getItem(this.type+'History')){
			var history = JSON.parse(storage.getItem(this.type+'History'))
		}else{
			var history = []
		}
		this.setState({history})
	}

	// 清除 历史记录 && 搜索条件
	clearHistory(){
		window.localStorage.setItem(this.type+'History','')
		this.setState({history:[]})
	}
	clearSearch(){
		this.setState({search:''})
		document.getElementsByClassName('search-input-value')[0].value = ''
	}

	clickSearch(val){
		// 有val的是点击历史记录,用val,没有val是点击搜索,用this.state.search
		let value = val || this.state.search
		// 搜索
		if(value == '') return;
		// 添加localstorage 
		let storage = window.localStorage;
		if(storage && storage.getItem(this.type+'History')){
			var history = JSON.parse(storage.getItem(this.type+'History'))
		}else{
			var history = []
		}
		if(history.indexOf(value) === -1){
			history.push(value)
		}
		
		window.localStorage.setItem(this.type+'History',JSON.stringify(history))
		this.setState({history})

		// 调用回调函数搜索
		this.cb(value)
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
						  <input className="search-input-value" placeholder={this.placeholder} defaultValue={this.state.search} onChange={this.changeSeaarch.bind(this)}/>
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
					onClick={_=>this.clickSearch(item)}>{item}</div>					
					)}
				</div>
			</div>

			{/* 搜索结果 */}

			{/* 搜产品 */}
			{/* {proList('search',this.state.data)} */}

		  </Page>
		);
	}
}

