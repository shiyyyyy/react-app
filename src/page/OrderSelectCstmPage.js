import React, { Component} from 'react';
import {log,AppCore,AppMeta,loadIfEmpty,goTo,Enum,goBack} from '../util/core';
import {error,nonBlockLoading,progress,footer} from '../util/com';
import { connect } from 'react-redux';

import {Page,Button,Input,AlertDialog} from 'react-onsenui';


class OrderSelectCstmPage extends Component{

	constructor(props) {
		super(props);
		this.state = {dialog:false,data:[]};
		this.action = props.p.action;
		this.mod = '客户管理';
		this.pre_view = this.props.p.view;
	}


	renderToolbar(){
		return (
		  	<ons-toolbar>
		  	  <div className='left'><ons-back-button></ons-back-button></div>
		      <div className="center">{this.action}</div>
		  	</ons-toolbar>
		);
	}

	selectCstmDone(item){
		let data = this.pre_view.state.data;
		data['客户详情'][0] = item;
		this.pre_view.setState({data:data});
		goBack();
	}

	render(){
		return (
				<Page 
				renderToolbar={_=>this.renderToolbar()} 
				onShow={_=>loadIfEmpty(this)} >
				<div className="group-body">
					<div>
					    {
					    	this.state.data.map(item =>
								<div className="select-cstm" key={item.id} onClick={_=>this.selectCstmDone(item)}>
					      			<div className="doc-main-cell">
										<span className="cell-left-4 color-999">客户类型:</span><span className="cell-right">{Enum.CustomerType[item.cstm_type_id]}</span> 
									</div>
									<div className="doc-main-cell"> 
										<span className="cell-left-4 color-999">客户全称:</span><span className="cell-right">{item.full_name}</span>
									</div>
									<div className="doc-main-cell">
										<span className="cell-left-4 color-999">客户简称:</span><span className="cell-right">{item.short_name}</span> 
									</div>
									<div className="doc-main-cell"> 
										<span className="cell-left-4 color-999">客户编号:</span><span className="cell-right">C0{item.id}</span>
									</div>
									<div className="doc-main-cell">
										<span className="cell-left-4 color-999">创建人:</span><span className="cell-right">{item.employee_name}</span> 
									</div>
									<div className="doc-main-cell"> 
										<span className="cell-left-4 color-999">所在城市:</span><span className="cell-right">{Enum.City[item.city_id]}</span>
									</div>
								</div>
					    	)
						}
				    </div>
				  	{
				  		this.state.loading && nonBlockLoading()
				  	}

	    		</div>
			</Page>
		);
	}
}

export default connect(s=>({s:s}))(OrderSelectCstmPage)
