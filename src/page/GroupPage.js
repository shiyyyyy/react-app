import React, { Component,Fragment } from 'react';

import {AppCore,resetTo,loadMore,loadIfEmpty,Enum,goTo,hasPlugin,reload,goBack,haveModAuth} from '../util/core';
import {pullHook,loginToPlay,Search,nonBlockLoading,NoPv} from '../util/com';

import {Page,Modal,Button,Icon} from 'react-onsenui';
import { connect } from 'react-redux';

import moment from 'moment';

import '../css/GroupPage.css'
class GroupPage extends Component{

	constructor(props) {
		super(props);

		this.state = {
			state:'initial',
			data:[],
			open_filter: '',
			search:{dep_date_from:moment().format('YYYY-MM-DD'),pd_nav:'1',pd_name:''},
			dep_date_from: moment().format('YYYY-MM-DD')
		};
		this.mod = '团队报名';
		AppCore.GroupPage = this;
		
	}

	navClick(i){
		this.setState({search:{...this.state.search,pd_nav:i,pd_tag_id:undefined,pd_subtag_id:undefined}});
	}
	tagClick(i){
		if(i){
			this.setState({search:{...this.state.search,pd_tag_id:i,pd_subtag_id:undefined}});
		}else{
			this.setState({open_filter:'',search:{...this.state.search,pd_tag_id:i,pd_subtag_id:undefined}});
			reload(this);
		}
		
	}
	subTagClick(i){
		this.setState({open_filter:'',search:{...this.state.search,pd_subtag_id:i}});
		reload(this);
	}
	cityClick(i){
		if(this.state.search.dep_city_id === i){
			this.setState({open_filter:'',search:{...this.state.search,dep_city_id: ''}});
			reload(this);
		}else if (this.state.search.dep_city_id !== i){
			this.setState({open_filter:'',search:{...this.state.search,dep_city_id: i}});
			reload(this);
		}
	}
	depDateClick(){
		this.setState({open_filter:'',
			search:{
				...this.state.search,
				dep_date_from: this.state.dep_date_from || undefined,
				dep_date_to:this.state.dep_date_to || undefined
			}
		});
		reload(this);
	}
	themeClick(i){
		if(this.state.search.theme_id === i){
			this.setState({open_filter:'',search:{...this.state.search,theme_id: ''}});
			reload(this);
		}else if (this.state.search.theme_id !== i){
			this.setState({open_filter:'',search:{...this.state.search,theme_id: i}});
			reload(this);
		}
	}

	// ====================
	tag_cur(){
		if(this.state.open_filter === 'tag' || this.state.search.pd_subtag_id || this.state.search.pd_tag_id){
			return true
		}
		return false
	}

	date_cur(){
		if(this.state.open_filter === 'date' || this.state.dep_date_from || this.state.dep_date_to){
			return true
		}
		return false
	}



	dep_city_cur(){
		if(this.state.open_filter === 'dep_city' || this.state.search.dep_city_id){
			return true
		}
		return false
	}


	theme_cur(){
		if(this.state.open_filter === 'theme' || this.state.search.theme_id){
			return true
		}
		return false
	}



	// ===============

	renderFixed(){
		if(!this.refs.anchor){
			return;
		}
		
		if(hasPlugin('device') && AppCore.os==='ios'){
			this.tbHeight = this.tbHeight || this.refs.anchor.parentElement.getBoundingClientRect().top;
		}else{
			this.tbHeight = (AppCore.os==='ios'?44:56);
		}
		return (
			<div style={{
					backgroundColor:'rgba(0,0,0,.65)',
					position:'absolute',
					top:this.tbHeight,
					bottom:this.state.open_filter?'0px':'auto',
					left:'0px',
					right:'0px',
					display:this.props.s.user.sid?'block':'none'
				}}
				onClick={_=>{this.setState({open_filter: ''})}}
			>
				<ons-row  class="option-type" onClick={e=>e.stopPropagation()}>
				  <ons-col onClick={_=>this.setState({open_filter:'tag'})}>
				  	<span className={ this.tag_cur() ? "cur-option-type-text":"option-type-text"}>产品标签</span>
					{this.tag_cur() && <Icon className="cur-option-type-item" icon="md-caret-up"  />}
					{!this.tag_cur() && <Icon className="option-type-item" icon="md-caret-down"  />}
				  </ons-col>
				  <ons-col onClick={_=>this.setState({open_filter:'date'})}>
				  	<span className={ this.date_cur() ? "cur-option-type-text":"option-type-text"}>出发日期</span>
					{this.date_cur() && <Icon className="cur-option-type-item" icon="md-caret-up" />}
					{!this.date_cur() && <Icon className="option-type-item" icon="md-caret-down" />}
				  </ons-col>
				  <ons-col onClick={_=>this.setState({open_filter:'dep_city'})}>
				  	<span className={ this.dep_city_cur() ? "cur-option-type-text":"option-type-text"}>出发城市</span>
					{this.dep_city_cur() && <Icon className="cur-option-type-item" icon="md-caret-up" />}
					{!this.dep_city_cur() && <Icon className="option-type-item" icon="md-caret-down" />}
				  </ons-col>
				  <ons-col onClick={_=>this.setState({open_filter:'theme'})}>
				  	<span className={ this.theme_cur() ? "cur-option-type-text":"option-type-text"}>产品主题</span>
					{this.theme_cur() && <Icon className="cur-option-type-item" icon="md-caret-up" />}
					{!this.theme_cur() && <Icon className="option-type-item" icon="md-caret-down" />}
				  </ons-col>
				</ons-row>
				<div onClick={e=>e.stopPropagation()}>
				{/* 产品标签-选择框 */
					this.state.open_filter=='tag' && 

					<div className="dialog-box">
						<div className="selected">
							<ul className="select-nav select-item">
							{
								Object.keys(Enum.PdNav).map(i=>
									<li onClick={_=>this.navClick(i)} key={i} 
										className={i == this.state.search.pd_nav ? 'active-select-item' : 'select-item-main'} >
										{Enum.PdNav[i]}
									</li>
								)
							}
							</ul>
							<ul className="select-big select-item">
								<li onClick={_=>this.tagClick(undefined)}
									className={this.state.search.pd_tag_id ? 'select-item-main' : 'active-select-item'} >
									全部
								</li>
							{
								Object.keys(Enum.PdTag).map(i=>
									<li onClick={_=>this.tagClick(i)} key={i} 
										className={i == this.state.search.pd_tag_id ? 'active-select-item' : 'select-item-main'}>
										{Enum.PdTag[i]}
									</li>
								)
							}
							</ul>
							{
								this.state.search.pd_tag_id && 
									<ul className="select-sma select-item">
									<li onClick={_=>this.subTagClick(undefined)}
										className={this.state.search.pd_subtag_id ? 'select-item-main' : 'active-select-item'} >
										全部
									</li>
									{
										Object.keys(Enum.PdSubTag).filter(i=>Enum.PdSubTagBelong[i]==this.state.search.pd_tag_id).map(i=>
											<li onClick={_=>this.subTagClick(i)} key={i}
												className={i == this.state.search.pd_subtag_id ? 'active-select-item' : 'select-item-main'}>
												{Enum.PdSubTag[i]}
											</li>
										)
									}
									</ul>
							}
						</div>
					</div>	
				}
				{/* 日期-选择框 */
					this.state.open_filter=='date' && 
					<div className="dialog-box">
						<div className="options-popup">
							<div className="selected-date">
								<input type="date" className="selected-date-input" placeholder="最早出发" 
								value={this.state.dep_date_from} onChange={e=>this.setState({dep_date_from: e.target.value})} />
								至
								<input type="date" className="selected-date-input" placeholder="最晚出发" 
								value={this.state.dep_date_to} onChange={e=>this.setState({dep_date_to: e.target.value})} />
							</div>
							<div className="options-btn">
							  <div className="options-reset" onClick={_=>this.setState({dep_date_from:'',dep_date_to:''})}>重置</div>
							  <div className="options-submit" onClick={_=>this.depDateClick()}>确定</div>
							</div>
						</div>
					</div>	
				}
				{/* 出发城市-选择框 */
					this.state.open_filter=='dep_city' && 
					<div className="dialog-box">
						<div className="options-popup">
							<div className="selected-dep_city">
								{Object.keys(this.props.s.pub.dep_city).map( i => 
									<div className={ (this.state.search.dep_city_id === i ? 'active-select-item' : '') +" dep_city-item"} key={i}
									onClick={_=>this.cityClick(i)}>{this.props.s.pub.dep_city[i]}</div> 
								)}
							</div>
						</div>
					</div>	
				}
				{/* 主题-选择框 */
					this.state.open_filter=='theme' && 
					<div className="dialog-box">
						<div className="options-popup">
							<div className="selected-dep_city">
								{Object.keys(this.props.s.pub.theme).map( i => 
									<div className={ (this.state.search.theme_id === i ? 'active-select-item' : '') +" dep_city-item"} key={i}
									onClick={_=>this.themeClick(i)}>{this.props.s.pub.theme[i]}</div> 
								)}
							</div>
						</div>
					</div>	
				}
				</div>
			</div>
		);
	}
	renderToolbar(){
		let search_cfg = {
			key: this.mod,
			placeholder: '请输入产品名称',
			cb: value => {
				this.setState({open_filter:'',search:{...this.state.search,pd_name: value}});
				reload(this)
			}	
		}
		return <Search value={this.state.search.pd_name} 
						clear={e=>{e.stopPropagation();this.setState({search:{...this.state.search,pd_name: ''}},_=>reload(this))}} 
						param={search_cfg} />
	}

	render(){
		return (
			<Page 
				renderToolbar={_=>this.renderToolbar()} 
				onInfiniteScroll={done=>loadMore(this,done)} 
				onShow={_=>loadIfEmpty(this)}
				renderFixed={_=>this.renderFixed()}>

			    {
			    	this.props.s.user.sid && haveModAuth(this.mod) && 

		    		<Fragment>
		    			<div style={{height:"50px"}} ref="anchor"></div>
						{
						  	!this.state.open_filter && pullHook(this)	
					    }
					    {!!this.state.data.length && this.state.loading && nonBlockLoading()}
				        <div className="pro-list">
							{
								this.state.data.map(item =>
								<div className="pro-item" key={item.id} onClick={_=>goTo('产品详情页',{pd_id:item.product_id,group_id:item.id})}>
							  		<div className="pro-item-left">
										<img className="img-size" src={AppCore.HOST+'/'+item.thumb} />
										<div className="pro-item-pro_id">产品编号: P0{item.product_id}</div>
									</div>
							  		<div className="pro-item-right">
										<div className="pro-item-name">{item.pd_name}</div>
										<div className="pro-item-dep_city flex-j-sb">
											<span className="pro-item-gys">供应商: {item.pd_provider}</span>
											<span className="pro-item-recently">最近班期: {item.dep_date}</span>
											{/* <span>供应商: {item.pd_provider}</span> */}
										</div>
										<div className="pro-item-price flex-j-sb">
											<span className="pro-item-dep">{Enum.City[item.dep_city_id]}出发</span>
											<span style={{fontSize: '.426667rem', color: '#F29A0A',fontWeight:'bold'}}>￥{(item.zk_price * 1) || '0.00'}<span style={{fontSize: '.373333rem',fontWeight: 'normal'}}>起/人</span></span>
										</div>
										{/* <div className="pro-item-theme">发团日期: {item.dep_date}</div> */}
										{['亲子','蜜月','夕阳红'].map( (cell,i) => 
											<div className="pro-item-theme" key={i}>{cell}</div>
										)}
									</div>
								</div>
								)
							}
						</div>
					  	{this.state.loading && nonBlockLoading()}

		    		</Fragment>
			    }
			    {
			    	this.props.s.user.sid && !haveModAuth(this.mod) && NoPv()
			    }
			    {
			  		!this.props.s.user.sid && loginToPlay()
			    }
		    </Page>
		);
	}
}

export default connect(s=>({s:s}))(GroupPage)

