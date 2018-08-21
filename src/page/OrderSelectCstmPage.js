import React, { Component,Fragment} from 'react';
import {log,AppCore,AppMeta,loadIfEmpty,goTo,Enum,goBack,loadMore,reload} from '../util/core';
import {error,nonBlockLoading,progress,footer,ProInfo,SearchLv2,pullHook} from '../util/com';
import { connect } from 'react-redux';

import {Page,Button,Input,AlertDialog,Popover} from 'react-onsenui';


class OrderSelectCstmPage extends Component{

	constructor(props) {
		super(props);
		this.state = {
			state: 'initial',
			dialog:false,
			data:[],
			filter:'',
			search:{
				short_name: '',
				full_name: ''
			},

			open_search_key: false,
			cur_select_search_filter: {search: 'short_name', text: '客户简称'},
		};
		// this.action = props.p.action;
		this.mod = '客户管理';
		this.pageSize = 20;
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
		let search_cfg = {
		key: 'Cstm',
		cb: (value, key) => {
			let search = this.state.search
			search['full_name'] = ''
			search['short_name'] = ''
			search[key] = value
			this.setState({search:search});
			reload(this)
			}	
		}
		return <SearchLv2 value={this.state.search.full_name || this.state.search.short_name} 
						open_search_key={_=>this.setState({open_search_key:true})}
						cur_select={this.state.cur_select_search_filter || ''}
						clear={e=>{e.stopPropagation();this.setState({search:{...this.state.search,full_name: '', short_name: ''}},_=>reload(this))}} 
						param={search_cfg} />
	}
	renderBottomToolbar() {
		return(
			<div className="select-cstm-btn">
				<div className="select-cstm-btn-cancel"
				onClick={_=>goBack()}>取消</div>
				<div className="select-cstm-btn-submit"
				onClick={_=>this.selectCstmDone()}>确定</div>
			</div>
		)
	}

	renderFixed() {
		if(AppCore.os){
			this.tbHeight = (AppCore.os==='ios'?56:68);
		}
		return (
		<div className="fixed-top-box" >
			<div className="money-care-books-title fixed-top" style={{ top: this.tbHeight+'px',fontSize: '.32rem' }}>
                <span className="money-care-books-title-item-4">客户类型</span>
                <span className="money-care-books-title-item-4">客户简称</span>
                <span className="money-care-books-title-item-4">手机号</span>
                <span className="money-care-books-title-item-4">创建人</span>
            </div>
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
			renderBottomToolbar={_=>this.renderBottomToolbar()}
			renderFixed={_=>this.renderFixed()}
			onShow={_=>loadIfEmpty(this)} >

				<div style={{width: '100px', height: '50px'}}></div>
				<div className="dialog-select-position" ref="anchor" style={{height:(AppCore.os==='ios'?44:56)}}></div>
				<Popover
				animation = "none"
				direction = "down"
			    isOpen={this.state.open_search_key}
			    onCancel={() => this.setState({open_search_key: false})}
			    getTarget={() => this.refs.anchor} >
			    	<div className="dialog-select-box">
			    	  <div className="dialog-select-item" onClick={_=>this.setState({open_search_key:false,cur_select_search_filter:{search: 'short_name', text: '客户简称'}})}>客户简称</div>
			    	  <div className="dialog-select-item" onClick={_=>this.setState({open_search_key:false,cur_select_search_filter:{search: 'full_name', text: '客户全称'}})}>客户全称</div>
			    	</div>
			    </Popover>
				{
					!this.state.loading && pullHook(this)
				}
				{/* 客户list */}
				<div className="money-care-books-box" style={{marginBottom:'1.333333rem'}}>

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
