import React, { Component,Fragment } from 'react';

import {Page,Icon} from 'react-onsenui';

import {AppCore,resetTo,AppMeta,goTo,Enum,loadIfEmpty,goBack,trigger,submit} from '../util/core';

import {pullHook,ProInfo, footer_ctrl,footer,nonBlockLoading} from '../util/com';

import { connect } from 'react-redux';

export default class SelectItemPage extends Component{

	constructor(props) {
		super(props);

		this.pro_info = this.props.p.pro_info || '';
		// this.order_detail = this.props.p.order_detail
	    this.state = {page:1};
	}

	componentDidMount() {
	}

	getRenderItems(){
		if(this.props.p && this.props.p.items){
			if(this.state.filter){
				return this.props.p.items.filter(k=> k.name.indexOf(this.state.filter) !== -1);
			}else{
				return this.props.p.items;
			}
		}else if(this.props.p && this.props.p.newcstm){
			if(this.state.filter){
				return Object.keys(this.props.p.newcstm).filter(k=> this.props.p.newcstm[k].indexOf(this.state.filter) !== -1);
			}else{
				return Object.keys(this.props.p.newcstm);
			}
		}

	}

	loadMore(done){
		if(this.state.filter){
			done && done();
			return;
		}
		this.setState({loading:true});
		setTimeout(_=>{
			this.setState({loading:false,page:this.state.page+1});
			done && done();
		},200);
	}

	submit(){
		if(this.props.p && this.props.p.items){
			this.props.p.cb(this.state.cur_item,this.props.p.key)				
		}else if(this.props.p && this.props.p.newcstm){
			this.props.p.cb(this.state.cur_cstm,this.props.p.key)
		}
	}

	renderFixed(){
		return(
			<div className="select-cstm-btn">
				<div className="select-cstm-btn-cancel"
				onClick={_=>goBack()}>取消</div>
				<div className="select-cstm-btn-submit"
				onClick={_=>this.submit()}>确定</div>
			</div>
		)
	}

	renderToolbar(){
		return (
	        <ons-toolbar>
	        	<div className='left'><ons-back-button></ons-back-button></div>
				<div className="center search-input-box-box">
				  <div className="search-input-box">
					  <input className='search-input-box-input' onChange={e=>this.setState({filter:e.target.value,page:1})} 
					  style={{padding:'0'}} />
					<img className="search-input-box-img" src="img/search.png" style={{left: '6px'}} />
				  </div>
				</div>
			</ons-toolbar>
		);
	}

	render(){
		return (
			<Page renderToolbar={_=>this.renderToolbar()} onInfiniteScroll={done=>this.loadMore(done)} 
			renderFixed={_=>this.renderFixed()}>
				{/* 订单 HTML */}
				{this.pro_info && 
					<ProInfo pro_info={this.pro_info } />
				}
				{/* 订单人 */}
		    	<div className="select-single-box">
				{/* 接单人页面 */}
		    	{ this.props.p.items &&
		    		this.getRenderItems().map( k=> 
		    			(<div key={k}  onClick={_=>this.setState({cur_item:k.id})} 
						className="select-single-item"> 
							<div className="select-single-item-left">
								<img className="select-single-item-img" 
								src={k.pass_photo?AppCore.HOST+'/'+k.pass_photo:'img/avatar.png'} />
								<span className="select-single-item-userInfo">
									<span className="select-single-item-name">{k.name}</span>
									<br />
									<span className="select-single-item-mobile">{k.mobile}</span>
								</span>
							</div>
							  {/* <div></div> */}
							<Icon icon="md-check-circle" className={this.state.cur_item === k.id?"select-single-item-icon":"hide"} />
						 </div>)
	    			)
				}
				{/* 新增客户选择页面(城市 类型) */}
		    	{ this.props.p && this.props.p.newcstm &&
		    		this.getRenderItems().map( k=> 
		    			(<div key={k}  onClick={_=>this.setState({cur_cstm:k})} 
						className="select-single-item"> 
							<div className="select-single-item-left" onClick={_=>console.log(this)}>
								{/* <img className="select-single-item-img" 
								src={k.pass_photo?AppCore.HOST+'/'+k.pass_photo:'img/avatar.png'} /> */}
								<span className="select-single-item-userInfo">
									<span className="select-single-item-name">{this.props.p.newcstm[k]}</span>
									<br />
									{/* <span className="select-single-item-mobile">{k.mobile}</span> */}
								</span>
							</div>
							  {/* <div></div> */}
							<Icon icon="md-check-circle" className={this.state.cur_cstm === k?"select-single-item-icon":"hide"} />
						 </div>)
	    			)
		    	}
		    	</div>
				
		    	{this.state.loading && nonBlockLoading()}
		    </Page>
		);
	}
}


