import React, { Component} from 'react';
import {log,AppCore,AppMeta,loadIfEmpty,goTo,Enum,goBack,loadMore,reload} from '../util/core';
import {error,nonBlockLoading,progress,footer,ProInfo} from '../util/com';
import { connect } from 'react-redux';

import {Page,Button,Input,AlertDialog} from 'react-onsenui';


class OrderSelectCstmPage extends Component{

	constructor(props) {
		super(props);
		this.state = {dialog:false,data:[],filter:''};
		this.action = props.p.action;
		this.pro_info = this.props.p.pro_info || ''
		//this.mod = '客户管理';
		this.pre_view = this.props.p.view;

	}


	getRenderItems(){
		if(this.state.filter){
			// 一次性全返回 
			return this.state.data.filter( item => item.short_name.indexOf(this.state.filter) !== -1);

			// 根据 filter 发送请求
			return reload(this,_=>this.state.data)
		}else{
		    return this.state.data
		}
	}


	renderToolbar(){
		return (
		  	<ons-toolbar>
		  	  <div className='left'><ons-back-button></ons-back-button></div>
		      <div className="center">{this.action}</div>
		  	</ons-toolbar>
		);
	}
	renderFixed(){
		return(
			<div className="select-cstm-btn">
				<div className="select-cstm-btn-cancel"
				onClick={_=>goBack()}>取消</div>
				<div className="select-cstm-btn-submit"
				onClick={_=>this.selectCstmDone()}>确定</div>
			</div>
		)
	}

	selectCstmDone(){
		let data = this.pre_view.state.data;
		data['客户详情'][0] = this.state.cur_item;
		this.pre_view.setState({data:data});
		goBack();
	}


	render(){
		return (
			<Page 
			renderToolbar={_=>this.renderToolbar()} 
			onInfiniteScroll={done=>loadMore(this,done)} 
			renderFixed={_=>this.renderFixed()}
			onShow={_=>loadIfEmpty(this)} >
				{/* 订单 HTML */}
				{this.pro_info && 
					<ProInfo pro_info={this.pro_info } />
				}
				{/* 客户list */}
				<div className="money-care-books-box" style={{marginBottom:'1.333333rem'}}>
					<div className="money-care-books-title">
						<span className="money-care-books-title-item-4">客户类型</span>
                        <span className="money-care-books-title-item-4">客户简称</span>
                        <span className="money-care-books-title-item-4">手机号</span>
                        <span className="money-care-books-title-item-4">创建人</span>
					</div>
					<div className="money-care-books-main">
					    {
					    	this.state.data.map( item =>
								<div className={( ((this.state.cur_item&&this.state.cur_item.id) || '') === item.id ? "active-money-care-books-main-item":"")+" money-care-books-main-item"} 
								key={item.id} onClick={_=>this.setState({cur_item: item})}>
									<span className="money-care-books-main-item-col-4">{Enum.CustomerType[item.cstm_type_id]}</span>
									<span className="money-care-books-main-item-col-4">{item.short_name}</span>
									<span className="money-care-books-main-item-col-4">{item.mobile}</span>
									<span className="money-care-books-main-item-col-4">{item.employee_name}</span>
								</div>
					    	)
						}
				    </div>
	    		</div>
				{
					this.state.loading && nonBlockLoading()
				}
			</Page>
		);
	}
}

export default connect(s=>({s:s}))(OrderSelectCstmPage)
