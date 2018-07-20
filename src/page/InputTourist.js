import React, { Component } from 'react';

import {Page,Icon} from 'react-onsenui';


import {footer} from '../util/com';


export default class InputTourist extends Component{

	constructor(props) {
	    super(props);
		this.state = {
			name: '',
			gender: '1',
			birthday: '',
			id_card_type: '身份证',
			ID_CARD_TYPE: ['身份证','军官证','户口本'],
			card_num: '',
			card_validity: '',
			mobile: '',
			note: '',
		};
	}

	submit(){
		console.log(this)
	}

	reset(){
		console.log(this)
	}
	
    

	renderToolbar(){
		return (
		  	<ons-toolbar>
		  		<div className='left'><ons-back-button></ons-back-button></div>
		      	<div className="center">录入游客名单</div>
		  	</ons-toolbar>
		);
	}

	render(){
		return (
			<Page renderToolbar={_=>this.renderToolbar()} >
				
				<div className="doc-module">
                    <div className="doc-main">
                        <div className="doc-main-cell">
					    	<span className="cell-left-5">游客姓名:</span>
							<span className="cell-right">
							<input type="text" value={this.state.name} onChange={e=>this.setState({name: e.target.value})} /></span>
					    </div>
                        <div className="doc-main-cell">
					    	<span className="cell-left-5">游客性别:</span>
							<span className="cell-right">
								<span onClick={e=>this.setState({gender: '1'})}>
								男<Icon className={(this.state.gender === '1' ? "hide":"")+" off-icon" } icon="md-circle-o" />
								  <Icon className={(this.state.gender === '1' ? "":"hide")+" on-icon" } icon="md-dot-circle-alt" />
								</span>
								<span onClick={e=>this.setState({gender: '2'})}>
								女<Icon className={(this.state.gender === '1' ? "":"hide")+" off-icon" } icon="md-circle-o" />
								  <Icon className={(this.state.gender === '1' ? "hide":"")+" on-icon" } icon="md-dot-circle-alt" />
								</span>
							</span>
					    </div>
                        <div className="doc-main-cell">
					    	<span className="cell-left-5">游客生日:</span>
							<span className="cell-right">
							<input type="date" value={this.state.birthday} onChange={e=>this.setState({birthday: e.target.value})} /></span>
					    </div>
                        <div className="doc-main-cell">
					    	<span className="cell-left-5">证件类型:</span>
                            <span className="cell-right">
                                <select onChange={e=>this.setState({id_card_type: e.target.value})}>
									{this.state.ID_CARD_TYPE.map( (item,i) => 
										<option value={item} key={i}>{item}</option>
									)}
                                </select>
                            </span>
					    </div>
                        <div className="doc-main-cell">
					    	<span className="cell-left-5">证件号码:</span>
							<span className="cell-right">
								<input type="text" value={this.state.card_num} onChange={e=>this.setState({card_num: e.target.value})} />
							</span>
					    </div>
                        <div className="doc-main-cell">
					    	<span className="cell-left-5">证件有效期:</span>
							<span className="cell-right">
								<input type="date" value={this.state.card_validity} onChange={e=>this.setState({card_validity: e.target.value})} />
							</span>
					    </div>
                        <div className="doc-main-cell">
					    	<span className="cell-left-5">游客手机:</span>
							<span className="cell-right">
								<input type="number" value={this.state.mobile} onChange={e=>this.setState({mobile: e.target.value})} />
							</span>
					    </div>
                        <div className="doc-main-cell">
					    	<span className="cell-left-5">添加备注:</span>
							<span className="cell-right">
								<input type="text" value={this.state.note} onChange={e=>this.setState({note: e.target.value})} />
							</span>
					    </div>
                    </div>
				</div>
				{/* 游客名单 */}
				<div className="enter-tour-list-btn">
                    <div className="enter-tour-list-btn-default" onClick={this.reset.bind(this)}>取消</div>
                    <div className="enter-tour-list-btn-submit" onClick={this.submit.bind(this)}>确定</div>
				</div>
				{/* 底部 footer */}
				{/* {footer('临时保存','提交时报','order-edit-footer-save','order-edit-footer-submit')} */}

		    </Page>
		);
	}
}

