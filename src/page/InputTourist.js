import React, { Component } from 'react';

import {Page,Icon} from 'react-onsenui';
import {log,AppCore,AppMeta,loadIfEmpty,goTo,Enum,goBack} from '../util/core';
import {info} from '../util/com';

export default class InputTourist extends Component{

	constructor(props) {
		super(props);
		
		this.action = this.props.p.action
		this.pre_view = this.props.p.view
		this.item = this.props.p.item
		this.tourist_index = this.props.p.i
		this.block = this.props.p.block;
		this.check =  this.props.p.check || false

		this.state = {
			name: '',
			gender: '',
			birthday: '',
			certificate_type: '',
			certificate_num: '',
			mobile: '',
			comment: '',
			id:'',
		};
	}

	componentWillMount(){
		if(this.item.name){
			this.setState({
				name: this.item.name,
				gender: this.item.gender,
				birthday: this.item.birthday,
				certificate_type: this.item.certificate_type,
				certificate_num: this.item.certificate_num,
				mobile: this.item.mobile,
				comment: this.item.comment,
				id: this.item.id
			})
		}
	}

	submit(){
			// 判断手机号
			if(!this.check){
				var phone = this.state.mobile
				var regex = /^1[34578][0-9]{9}$/
				if(!regex.test(phone)){
					info('手机号错误')
					return;
				}
			}

			let addTourist = this.state
			let data = this.pre_view.state.data

			data[this.block][this.tourist_index] = addTourist
			this.pre_view.setState({data:data})
			goBack();
	}

	reset(){
		goBack()
	}
	
    

	renderToolbar(){
		return (
		  	<ons-toolbar>
		  		<div className='left'><ons-back-button></ons-back-button></div>
		      	<div className="center">{this.check?'查看游客名单':'录入游客名单'}</div>
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
								<input type="text" value={this.state.name} onChange={e=>this.setState({name: e.target.value})} 
								disabled={this.check} placeholder="请填写姓名" />
							</span>
					    </div>
                        <div className="doc-main-cell">
					    	<span className="cell-left-5">游客性别:</span>
							<span className="cell-right">
								{/* <span onClick={e=>this.setState({gender: Enum.Gender[0]})}>
								男<Icon className={(this.state.gender === Enum.Gender[0] ? "hide":"")+" off-icon" } icon="md-circle-o" />
								  <Icon className={(this.state.gender === Enum.Gender[0] ? "":"hide")+" on-icon" } icon="md-dot-circle-alt" />
								</span>
								<span onClick={e=>this.setState({gender: Enum.Gender[1]})}>
								女<Icon className={(this.state.gender === Enum.Gender[0] ? "":"hide")+" off-icon" } icon="md-circle-o" />
								  <Icon className={(this.state.gender === Enum.Gender[0] ? "hide":"")+" on-icon" } icon="md-dot-circle-alt" />
								</span> */}
								<span onClick={e=>{if(this.check){return}; this.setState({gender: 0} )}}>
									<label htmlFor={Enum.Gender[0]}>男</label>
									<input type="radio" value={0} name="gender" id={Enum.Gender[0]} disabled={this.check}
									className="ver-sub" checked={this.state.gender === 0} />
								</span>
								<span onClick={e=>{if(this.check){return}; this.setState({gender:1}) }} style={{marginLeft: '.426667rem'}}>
									<label htmlFor={Enum.Gender[1]}>女</label>
									<input type="radio" value={1} name="gender" id={Enum.Gender[1]} disabled={this.check}
									className="ver-sub" checked={this.state.gender === 1} />
								</span>
							</span>
					    </div>
                        <div className="doc-main-cell">
					    	<span className="cell-left-5">游客生日:</span>
							<span className="cell-right">
							<input type="date" value={this.state.birthday} onChange={e=>this.setState({birthday: e.target.value})} 
							disabled={this.check} /></span>
					    </div>
                        <div className="doc-main-cell">
					    	<span className="cell-left-5">证件类型:</span>
                            <span className="cell-right">
                                <select onChange={e=>this.setState({certificate_type: e.target.value-0})} disabled={this.check}>
									<option>请选择</option>
									{Object.keys(Enum.Certificate).map( (item,i) => 
										<option value={item} key={item} selected={ item-0 === this.state.certificate_type }>{Enum.Certificate[item]}</option>
									)}
                                </select>
                            </span>
					    </div>
                        <div className="doc-main-cell">
					    	<span className="cell-left-5">证件号码:</span>
							<span className="cell-right">
								<input type="text" value={this.state.certificate_num} onChange={e=>this.setState({certificate_num: e.target.value})} 
								disabled={this.check} placeholder="请填写证件号" />
							</span>
					    </div>
                        <div className="doc-main-cell">
					    	<span className="cell-left-5">游客手机:</span>
							<span className="cell-right">
								<input type="number" value={this.state.mobile} onChange={e=>this.setState({mobile: e.target.value})} 
								disabled={this.check} placeholder="请填写手机号" />
							</span>
					    </div>
                        <div className="doc-main-cell">
					    	<span className="cell-left-5">添加备注:</span>
							<span className="cell-right">
								<input type="text" value={this.state.comment} onChange={e=>this.setState({comment: e.target.value})} 
								disabled={this.check} placeholder="请填写备注" />
							</span>
					    </div>
                    </div>
				</div>
				{/* 游客名单 */}
				<div className={this.check?"hide":"enter-tour-list-btn"}>
                    <button className="enter-tour-list-btn-default" onClick={this.reset.bind(this)} disabled={this.check} >取消</button>
                    <button className="enter-tour-list-btn-submit" onClick={this.submit.bind(this)} disabled={this.check} >确定</button>
				</div>
		    </Page>
		);
	}
}

