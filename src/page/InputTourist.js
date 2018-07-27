import React, { Component } from 'react';

import {Page,Icon} from 'react-onsenui';
import {log,AppCore,AppMeta,loadIfEmpty,goTo,Enum,goBack} from '../util/core';

import {footer} from '../util/com';


export default class InputTourist extends Component{

	constructor(props) {
		super(props);
		
		this.action = this.props.p.action
		this.pre_view = this.props.p.view
		this.item = this.props.p.item
		this.tourist_index = this.props.p.i

		this.state = {
			name: '',
			gender: Enum.Gender[0],
			birthday: '',
			certificate_type: '1',
			certificate_num: '',
			mobile: '',
			comment: '',
		};

		console.log(Enum.Gender[0])
		console.log(this)
	}

	componentWillMount(){
		if(this.item.name){
			this.setState({
				name: this.item.name,
				gender: this.item.gender || Enum.Gender[0],
				birthday: this.item.birthday,
				certificate_type: this.item.certificate_type || Enum.Certificate[0],
				certificate_num: this.item.certificate_num,
				mobile: this.item.mobile,
				comment: this.item.comment,
			})
		}

				console.log(Enum.Gender[0])
		console.log(this)
	}

	submit(){
			let addTourist = this.state
			let data = this.pre_view.state.data

			data['订单参团'][this.tourist_index] = addTourist
	
			this.pre_view.setState({data:data})
			goBack();
	}

	reset(){
		console.log(this)
		console.log(Enum)
		// goBack()
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
				
				<div className="doc-module" style={{marginTop: '0'}}>
                    <div className="doc-main">
                        <div className="doc-main-cell">
					    	<span className="cell-left-5">游客姓名:</span>
							<span className="cell-right">
							<input type="text" value={this.state.name} onChange={e=>this.setState({name: e.target.value})} /></span>
					    </div>
                        <div className="doc-main-cell">
					    	<span className="cell-left-5">游客性别:</span>
							<span className="cell-right">
								<span onClick={e=>this.setState({gender: Enum.Gender[0]})}>
								男<Icon className={(this.state.gender === Enum.Gender[0] ? "hide":"")+" off-icon" } icon="md-circle-o" />
								  <Icon className={(this.state.gender === Enum.Gender[0] ? "":"hide")+" on-icon" } icon="md-dot-circle-alt" />
								</span>
								<span onClick={e=>this.setState({gender: Enum.Gender[1]})}>
								女<Icon className={(this.state.gender === Enum.Gender[0] ? "":"hide")+" off-icon" } icon="md-circle-o" />
								  <Icon className={(this.state.gender === Enum.Gender[0] ? "hide":"")+" on-icon" } icon="md-dot-circle-alt" />
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
                                <select onChange={e=>this.setState({certificate_type: e.target.value})}>
									{Object.keys(Enum.Certificate).map( (item,i) => 
										<option value={item} key={i} 
										selected={ Enum.Certificate[item] === this.props.p.certificate_type }>{Enum.Certificate[item]}</option>
									)}
                                </select>
                            </span>
					    </div>
                        <div className="doc-main-cell">
					    	<span className="cell-left-5">证件号码:</span>
							<span className="cell-right">
								<input type="text" value={this.state.certificate_num} onChange={e=>this.setState({certificate_num: e.target.value})} />
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
								<input type="text" value={this.state.comment} onChange={e=>this.setState({comment: e.target.value})} />
							</span>
					    </div>
                    </div>
				</div>
				{/* 游客名单 */}
				<div className="enter-tour-list-btn">
                    <div className="enter-tour-list-btn-default" onClick={this.reset.bind(this)}>取消</div>
                    <div className="enter-tour-list-btn-submit" onClick={this.submit.bind(this)}>确定</div>
				</div>
		    </Page>
		);
	}
}

