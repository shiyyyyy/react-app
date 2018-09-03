import React, { Component,Fragment } from 'react';

import {AppCore,resetTo,loadMore,loadIfEmpty,Enum,goTo,hasPlugin,reload,goBack,haveModAuth} from '../util/core';
import {pullHook,loginToPlay,Search,nonBlockLoading,NoPv} from '../util/com';

import {Page,Modal,Button,Icon,Popover} from 'react-onsenui';
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
			// 选择框里选择的当前样式(不是搜索的)city && theme
			dialog_city: '',
			dialog_theme: '',
			search:{dep_date_from:moment().format('YYYY-MM-DD'),dep_date_to:'',pd_nav:'1',pd_name:''},
			dep_date_from: moment().format('YYYY-MM-DD'),
			dep_date_to: '',
			pd_nav:'',
			pd_tag_id: '',
			pd_subtag_id: '',
			flag_tag: false,
			flag_subtag: false,
			
			has_auth:false,
			pd_tag_type:'PdTag',
			pd_sub_tag_type:'PdSubTag',
			n_1:'PdSubTagBelong',
			open_search_key:false,
			cur_select_search_filter:{text: '产品名称', search: 'pd_name'}
		};
		this.mod = '团队报名';
		AppCore.GroupPage = this;

	}

	onShow(){
		loadIfEmpty(this);
		let has_auth = haveModAuth(this.mod);
		this.setState({has_auth:has_auth});
	}

	navClick(i){
		let nav_type = Enum['NavToType'][i];
		let pd_tag_type = 'PdTag';
        switch(nav_type){
	        case '0':
	        	pd_tag_type = 'PdTag';
	            break;
	        case '1':
	        	pd_tag_type = 'Country';
	            break;
	        case '2':
	        	pd_tag_type = 'Continent';
	            break;
	    }
		// this.setState({search:{...this.state.search,pd_nav:i,pd_tag_id:undefined,pd_subtag_id:undefined},pd_tag_type:pd_tag_type});
		this.setState({ pd_nav: i, pd_tag_id: '', pd_subtag_id: '', pd_tag_type: pd_tag_type, flag_tag: true, flag_subtag: false});
	}
	tagClick(i){
		let pd_tag_type = this.state.pd_tag_type;
		let n_1 = 'PdSubTagBelong';
		let pd_sub_tag_type = 'PdSubTag';
		switch(pd_tag_type){
			case 'PdTag':
				n_1 = 'PdSubTagBelong';
				pd_sub_tag_type = 'PdSubTag';
				break;
			case 'Country':
				n_1 = 'CityCountry';
				pd_sub_tag_type = 'City';
				break;
			case 'Continent':
				n_1 = 'CountryBelong';
				pd_sub_tag_type = 'Country';
				break;
		}
		if(i){
			// this.setState({n_1:n_1,pd_sub_tag_type:pd_sub_tag_type,search:{...this.state.search,pd_tag_id:i,pd_subtag_id:undefined}});
			this.setState({ n_1: n_1, pd_sub_tag_type: pd_sub_tag_type, pd_tag_id: i, pd_subtag_id: '', flag_tag: false});
		}else{
			// this.setState({n_1:n_1,pd_sub_tag_type:pd_sub_tag_type,open_filter:'',search:{...this.state.search,pd_tag_id:i,pd_subtag_id:undefined}});
			this.setState({n_1:n_1,pd_sub_tag_type:pd_sub_tag_type,pd_tag_id:'',pd_subtag_id:'',flag_tag:true});
			// reload(this);
		}
		
	}
	subTagClick(i){
		// this.setState({open_filter:'',search:{...this.state.search,pd_subtag_id:i}});
		// reload(this);
		if(i){
			this.setState({ pd_subtag_id: i, flag_subtag: false});
		}else{
			this.setState({pd_subtag_id:'',flag_subtag:true});
		}
	}

	tagSubmit(){
		this.setState({
			open_filter:'',
			search:{
			...this.state.search,
			pd_nav: this.state.pd_nav || this.state.search.pd_nav,
			pd_tag_id: this.state.pd_tag_id || (this.state.flag_tag?'':this.state.search.pd_tag_id),
			pd_subtag_id: this.state.flag_tag ?'':(this.state.pd_subtag_id || (this.state.flag_subtag?'':this.state.search.pd_subtag_id)),
		}
		}, _ => this.setState({ pd_nav: '', pd_tag_id: '', pd_subtag_id: '', flag_tag: this.state.flag_tag, flag_subtag: this.state.flag_subtag}))
		reload(this)
	}
	clearTag(){
		this.setState({
			pd_nav: '',
			pd_tag_id: '',
			pd_subtag_id: '',
			flag_tag: false,
			flag_subtag: false,
			search:{
			...this.state.search,
			pd_nav: '',
			pd_tag_id: '',
			pd_subtag_id: '',}
		})
	}

	cityClick(i){
		this.setState({dialog_city: i})
	}
	citySubmit(){
		let cur_city = this.state.dialog_city
		this.setState({open_filter:'',search:{...this.state.search,dep_city_id: cur_city}});
		reload(this);
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
		this.setState({dialog_theme: i});
	}

	themeSubmit(){
		let cur_theme = this.state.dialog_theme
		this.setState({open_filter:'',search:{...this.state.search,theme_id: cur_theme}});
		reload(this);
	}


	clear_param(){
		this.setState({
			open_filter: '',
			pd_nav:'',
			pd_tag_id:'',
			pd_subtag_id:'',
			flag_tag: false,
			flag_subtag: false,
			dialog_city: '',
			dialog_theme: '',
			dep_date_from:'',
			dep_date_to:''
		})
	}
	// ====================
	tag_cur(){
		if (this.state.open_filter === 'tag' || this.state.search.pd_nav || this.state.search.pd_subtag_id || this.state.search.pd_tag_id) {
			return true
		}
		return false
	}

	date_cur(){
		if (this.state.open_filter === 'date' || this.state.dep_date_from || this.state.dep_date_to || this.state.search.dep_date_from || this.state.search.dep_date_to) {
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
		if (this.state.open_filter === 'theme' || this.state.search.theme_id) {
			return true
		}
		return false
	}



	// ===============

	renderFixed(){
		
		if(hasPlugin('device') && AppCore.os==='ios'){
			this.tbHeight = 64;
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
				onClick={_=>{this.clear_param()}}
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
					<Fragment>
					<div className="dialog-box">
						<div className="selected">
							<ul className="select-nav select-item">
							{
								Object.keys(Enum.PdNav).map(i=>
									<li onClick={_=>this.navClick(i)} key={i} 
										className={i == (this.state.pd_nav || this.state.search.pd_nav) ? 'active-select-item' : 'select-item-main'} >
										{Enum.PdNav[i]}
									</li>
								)
							}
							</ul>
							<ul className="select-big select-item">
								<li onClick={_=>this.tagClick(undefined)}
									className={!(this.state.pd_tag_id || (this.state.flag_tag?false:this.state.search.pd_tag_id)) ? 'active-select-item':'select-item-main'} >
									全部
								</li>
							{
								Object.keys(Enum[this.state.pd_tag_type]).map(i=>
									<li onClick={_=>this.tagClick(i)} key={i} 
										className={i == (this.state.pd_tag_id || (this.state.flag_tag?false:this.state.search.pd_tag_id)) ? 'active-select-item' : 'select-item-main'}>
										{Enum[this.state.pd_tag_type][i]}
									</li>
								)
							}
							</ul>
							{
								(this.state.pd_tag_id || (this.state.flag_tag ? false : this.state.search.pd_tag_id)) &&
									<ul className="select-sma select-item">
									<li onClick={_=>this.subTagClick(undefined)}
										className={!(this.state.pd_subtag_id || (this.state.flag_subtag?false:this.state.search.pd_subtag_id)) ? 'active-select-item':'select-item-main'} >
										全部
									</li>
									{
										Object.keys(Enum[this.state.pd_sub_tag_type]).filter(i=>Enum[this.state.n_1][i]==(this.state.pd_tag_id || this.state.search.pd_tag_id)).map(i=>
											<li onClick={_=>this.subTagClick(i)} key={i}
												className={i == (this.state.pd_subtag_id || (this.state.flag_subtag?false:this.state.search.pd_subtag_id))? 'active-select-item' : 'select-item-main'}>
												{Enum[this.state.pd_sub_tag_type][i]}
											</li>
										)
									}
									</ul>
							}
						</div>
					</div>
					<div className="options-btn" style={{backgroundColor: '#fff'}}>
						<div className="options-reset" onClick={_=>this.clearTag()}>重置</div>
						<div className="options-submit" onClick={_=>this.tagSubmit()}>确定</div>
					</div>
					</Fragment>	
				}
				{/* 日期-选择框 */
					this.state.open_filter=='date' && 
					<div className="dialog-box">
						<div className="options-popup">
							<div className="selected-date">
								<input type="date" className="selected-date-input" placeholder="最早出发" 
								value={this.state.search.dep_date_from || this.state.dep_date_from} onChange={e=>this.setState({dep_date_from: e.target.value})} />
								至
								<input type="date" className="selected-date-input" placeholder="最晚出发" 
								value={this.state.search.dep_date_to || this.state.dep_date_to} onChange={e=>this.setState({dep_date_to: e.target.value})} />
							</div>
							<div className="options-btn">
							  <div className="options-reset" onClick={_=>this.setState({dep_date_from:'',dep_date_to:'',search:{...this.state.search,dep_date_from:'',dep_date_to:''}})}>重置</div>
							  <div className="options-submit" onClick={_=>this.depDateClick()}>确定</div>
							</div>
						</div>
					</div>	
				}
				{/* 出发城市-选择框 */
					this.state.open_filter=='dep_city' && 
					<Fragment>
						<div className="dialog-box">
							<div className="options-popup">
								<div className="selected-dep_city">
									{Object.keys(this.props.s.pub.dep_city).map( i => 
										<div className={ ((this.state.dialog_city || this.state.search.dep_city_id) === i ? 'active-select-item' : '') +" dep_city-item"} key={i}
										onClick={_=>this.cityClick(i)}>{this.props.s.pub.dep_city[i]}</div> 
									)}
								</div>
							</div>
						</div>	
						<div className="options-btn" style={{backgroundColor: '#fff'}}>
						  <div className="options-reset" onClick={_=>this.setState({dialog_city:'',search:{...this.state.search,dep_city_id:''}})}>重置</div>
						  <div className="options-submit" onClick={_=>this.citySubmit()}>确定</div>
						</div>
					</Fragment>
				}
				{/* 主题-选择框 */
					this.state.open_filter=='theme' && 
					<Fragment>
						<div className="dialog-box">
							<div className="options-popup">
								<div className="selected-dep_city">
									{Object.keys(this.props.s.pub.theme).map( i => 
										<div className={ ((this.state.dialog_theme || this.state.search.theme_id) === i ? 'active-select-item' : '') +" dep_city-item"} key={i}
										onClick={_=>this.themeClick(i)}>{this.props.s.pub.theme[i]}</div> 
									)}
								</div>
							</div>
						</div>	
						<div className="options-btn" style={{backgroundColor: '#fff'}}>
						  <div className="options-reset" onClick={_=>this.setState({dialog_theme:'', search:{...this.state.search, theme_id: ''}})}>重置</div>
						  <div className="options-submit" onClick={_=>this.themeSubmit()}>确定</div>
						</div>
					</Fragment>
				}
				</div>
			</div>
		);
	}
	renderToolbar(){
		let search_cfg = { 
			key: 'Group',
			cb: (value, key) => {
				let search = this.state.search
				search['pd_name'] = ''
				search['group_num'] = ''
				search['pd_provider'] = ''
				search[key] = value
				this.setState({search:search});
				reload(this)
			},	
		}
		return <Search value={this.state.search.pd_name || this.state.search.group_num || this.state.search.pd_provider} 
						open_search_key={_=>this.setState({open_search_key:true})}
						cur_select={this.state.cur_select_search_filter || ''}
						clear={e=>{e.stopPropagation();this.setState({search:{...this.state.search,pd_name: '',group_num:'',pd_provider:''}},_=>reload(this))}} 
						param={search_cfg} set_anchor={anchor=>this.search_anchor=anchor} />
	}

	render(){
		return (
			<Page 
				renderToolbar={_=>this.renderToolbar()} 
				onInfiniteScroll={done=>loadMore(this,done)} 
				onShow={_=>this.onShow()}
				renderFixed={_=>this.renderFixed()}>
				<div style={{height:this.props.s.user.sid?"50px":"0px"}} ></div>
			    <Popover
				  animation = "none"
				  direction = "down"
			      isOpen={this.state.open_search_key}
			      onCancel={() => this.setState({open_search_key: false})}
			      getTarget={() => this.search_anchor}
			    >
			        <div className="dialog-select-box">
			          <div className="dialog-select-item" onClick={_=>this.setState({open_search_key:false,cur_select_search_filter:{text: '产品名称', search: 'pd_name'}})}>产品名称</div>
			          <div className="dialog-select-item" onClick={_=>this.setState({open_search_key:false,cur_select_search_filter:{text: '团号', search: 'group_num'}})}>团号</div>
			          <div className="dialog-select-item" onClick={_=>this.setState({open_search_key:false,cur_select_search_filter:{text: '供应商', search: 'pd_provider'}})}>供应商</div>
			        </div>
			    </Popover>
			    {
			    	this.props.s.user.sid && this.state.has_auth && 

		    		<Fragment>
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
										{item.theme.map( (cell,i) => 
											<div className="pro-item-theme" key={i}>{cell || ''}</div>
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
			    	this.props.s.user.sid && !this.state.has_auth && NoPv()
			    }
			    {
			  		!this.props.s.user.sid && loginToPlay()
			    }
		    </Page>
		);
	}
}

export default connect(s=>({s:s}))(GroupPage)

