import React, { Component } from 'react';

import {clickToLog,post,AppCore,reload,goBack,goTo,loadIfEmpty} from '../util/core';

import {Carousel,CarouselItem,Page} from 'react-onsenui';
import { connect } from 'react-redux';

import { Search } from '../util/com'


import '../css/HomePage.css'


class HomePage extends Component{
	constructor(props) {
	    super(props);
		this.click_history = [];

	    this.state = {
			picIdx: 0,
			navIdx: 0,
			icon:[{1: "欧洲",
					2: "北美洲",
					3: "中南美",
					4: "大洋洲",},{
					5: "中东非",
					6: "东南亚",
					7: "日韩朝鲜",
					8: "越柬老缅",},{
					9: "印度马代",
					10: "蒙古中亚",
					11: "港澳台",
					12: "中国",},{
					13: "全球游轮",
				    14: '南北极'}],
			search: {
				pd_name: ''
			},
			data:[],
		};
		this.url = '/api/App/app_home_data';
	}

    onShow() {
    	 this.timer && clearInterval(this.timer);
	  	 this.timer = setInterval(_=>{
	  	 	let picIdx = this.state.picIdx + 1;
	  	 	let navIdx = this.state.navIdx + 1;
	  	 	if(picIdx>3){
	  	 		picIdx = 0;
	  	 	}
	  	 	if(navIdx>1){
	  			navIdx = 0;
	  	 	}
	  		this.setState({picIdx:picIdx/*,navIdx:navIdx*/,group_mod_click: false});
	  	 },5000);
	  	 loadIfEmpty(this);
    }

    onHide() {
  	    this.timer && clearInterval(this.timer);
  	    this.timer = 0;
    }

    handleChange(key,e) {
    	let state = {};
    	state[key] = e.activeIndex;
		this.setState(state);
	}

    setIndex(key,index) {
    	let state = {};
    	state[key] = index;
		this.setState(state);
	}

	Serach(){
		if(!this.props.s.user.sid){
			return;
		}
		if(AppCore.TabPage){
			AppCore.TabPage.setState({index:2});
			if(AppCore.GroupPage){
				let search = this.state.search;

				AppCore.GroupPage.setState({search:search});
				reload(AppCore.GroupPage);
			}
		}
	}

	searchProductType(tag_id){
		if(!this.props.s.user.sid){
			if(AppCore.TabPage){
				AppCore.TabPage.setState({index:2});
			}
			return;
		}
		if(AppCore.TabPage){
			AppCore.TabPage.setState({index:2});
			if(AppCore.GroupPage){

				let search = {limit:10};
				search.pd_nav = '1'
				search.pd_tag_id = tag_id

				AppCore.GroupPage.setState({search:search});

				if(this.state['group_mod_click']){
					reload(AppCore.GroupPage);
				}
				this.setState({group_mod_click:true});
			}
		}
	}

	goToGroup(item){
		if(!this.props.s.user.sid){
			if(AppCore.TabPage){
				AppCore.TabPage.setState({index:2});
			}
			return
		}
		if(item){
			goTo('产品详情页',{group_id: item.id, pd_id: item.pd_id})
			return
		}
		if(AppCore.TabPage){
			AppCore.TabPage.setState({index:2});
			if(AppCore.GroupPage){

				let search = {limit:10};
			
				AppCore.GroupPage.setState({search:search});

				if(this.state['group_mod_click']){
					reload(AppCore.GroupPage);
				}
				this.setState({group_mod_click:true});
			}
		}
	}

	renderToolbar(){
		let search_cfg = {
			key: 'home',
			placeholder: '请输入产品名称',
			cb: value =>{
				this.setState({search:{pd_name: value, limit: 10}});
				this.Serach();
			}
		}
		return <Search value={this.state.search.pd_name} 
					   clear={e=>{e.stopPropagation();this.setState({search:{pd_name: '', limit: 10}},_=>reload(this))}} 
					   param={search_cfg} />
	}

	render(){
		return (
			<Page onShow={_=>this.onShow()} onHide={_=>this.onHide()} renderToolbar={_=>this.renderToolbar()} >

				<div className="home-search-bottom"></div>

				<div className="posi-rela">
				<Carousel onPostChange={e=>this.handleChange('navIdx',e)} index={this.state.navIdx} 
				swipeable autoScroll overscrollable autoScrollRatio={0.25}>
	        	    {
		      	    	[0,2].map(i => 
		      	        <CarouselItem key={i}>
						  <div className="type-item-box">
									<div className="type-item-row">
										{
											Object.keys(this.state.icon[i]).map(id=>
												<div className="type-item" key={id} onClick={_=>this.searchProductType(id)}>
													<div><img className="banner-scale-img" src={'img/menu_icon/'+id+'.png'} /></div>
													<span className="banner-text">{this.state.icon[i][id]}</span>
												</div>
											)
										}
									</div>
									<div className="type-item-row">
										{
											Object.keys(this.state.icon[i+1]).map(id=>
												<div className="type-item" key={id} onClick={_=>this.searchProductType(id)}>
													<div><img className="banner-scale-img" src={'img/menu_icon/'+id+'.png'} /></div>
													<span className="banner-text">{this.state.icon[i+1][id]}</span>
												</div>
											)
										}
									</div>
							</div>
		      	        </CarouselItem>
		      	      )
	        	    }
	        	</Carousel>
	        	<div className="swiper-ctrl" style={{cursor: 'pointer', left: '0', right: '0', top: '5.146667rem'}}>
	        	  {[0,2].map((i, index) => (
	        	    <span key={index} onClick={this.setIndex.bind(this, 'navIdx',index)} 
								className={this.state.navIdx === index ? 'active-type-page' : 'other-type-page'}>
	        	    </span>
	        	  ))}
	        	</div>
				</div>


				{/* 轮播图 */}
			    <div className="model-box-bald-title">
					<div className="model-box-bald-title-text zhuanxian">北青专线</div>
					<div className="model-box-bald-title-more" onClick={_=>this.goToGroup()}>更多</div>
				</div>
				<div className="posi-rela" style={{marginBottom: '.32rem'}}>
					<Carousel onPostChange={e=>this.handleChange('picIdx',e)} index={this.state.picIdx} 
					swipeable autoScroll overscrollable autoScrollRatio={0.25}>
	        	    {
		        	  	this.props.s.pub.slide.map(
		        	  		(item, index) => 
			        	    <CarouselItem key={item.id}>
			        	      <div style={{height: "4.666667rem", width: '100%'}} onClick={_=>this.goToGroup(item)}>
			        	        <img src={AppCore.HOST+'/'+item.img} className="img-size"></img>
			        	      </div>
			        	    </CarouselItem>
			        	)
	        	    }
		        	</Carousel>
		        	<div className="swiper-ctrl">
		        	  {
		        	  	this.props.s.pub.slide.map(
		        	  		(item, index) => 
			        	    <span key={item.id} onClick={this.setIndex.bind(this, 'picIdx',index)}
							className={this.state.picIdx === index ? 'active-banner-page' : 'other-banner-page'}>
			        	    </span>
			        	  )
		        	  }
		        	</div>
				</div>

					
				{/* 热卖推介 */}
				<div className="model-box-bald-title">
					<div className="model-box-bald-title-text hot">出境推介</div>
					<div className="model-box-bald-title-more" onClick={_=>this.goToGroup()}>更多</div>
				</div>
					
				<div className="flex-j-sb flex-wrap" style={{padding: '0 .32rem .32rem .32rem'}}>
				{
					this.props.s.pub.recommend.map( (item, index) => 
						<div className={index>7?"hide":"content-item"} key={item.id} onClick={_=>this.goToGroup(item)}>
							<div className="content-item-top">
								<img src={AppCore.HOST+'/'+item.img} className="img-size"></img>
								<div className="content-item-top-row">产品编号: P022887</div>
							</div>
							<div className="content-item-bottom">
								<div className="content-item-bottom-title">{item.pd_name}</div>
								<div className="content-item-bottom-groupDate">最近班期: {item.dep_date}</div>
								<div className="center-sb" style={{ height: '.906667rem'}}>
									<span className="content-item-bottom-price">￥{item.zk_price * 1}<span>起/人</span></span>
									<span className="content-item-bottom-gys">{item.pd_provider}</span>
								</div>
							</div>
						</div>
					)
				}
				</div>


				{/* 热卖推介 */}
				<div className="model-box-bald-title">
					<div className="model-box-bald-title-text hot">国内推介</div>
					<div className="model-box-bald-title-more" onClick={_=>this.goToGroup()}>更多</div>
				</div>
					
				<div className="flex-j-sb flex-wrap" style={{padding: '0 .32rem .32rem .32rem'}}>
				{
					this.props.s.pub.recommend.map( (item, index) => 
						<div className={index>7?"hide":"content-item"} key={item.id} onClick={_=>this.goToGroup(item)}>
							<div className="content-item-top">
								<img src={AppCore.HOST+'/'+item.img} className="img-size"></img>
								<div className="content-item-top-row">产品编号: P022887</div>
							</div>
							<div className="content-item-bottom">
								<div className="content-item-bottom-title">{item.pd_name}</div>
								<div className="content-item-bottom-groupDate">最近班期: {item.dep_date}</div>
								<div className="center-sb" style={{ height: '.906667rem'}}>
									<span className="content-item-bottom-price">￥{item.zk_price * 1}<span>起/人</span></span>
									<span className="content-item-bottom-gys">{item.pd_provider}</span>
								</div>
							</div>
						</div>
					)
				}
				</div>


				{/* 站内新闻 */}
				{	
					this.props.s.user.sid &&
					<div>
						<div className="model-box-bald-title">
							<div className="model-box-bald-title-text xinwen">站内新闻</div>
							<div className="model-box-bald-title-more">更多</div>
						</div>
							
						<div className="flex-j-sb flex-wrap" style={{padding: '0 .32rem .32rem .32rem'}}>
						{
							this.state.data.news && this.state.data.news.map((item, index) => (
								<div className="xinwen-item" key = {index}>
									<i className="xinwen-bg msg4"></i>
									<span className="xinwen-msg">{item.title}</span>
									<span className="xinwen-daate">{item.create_at}</span>
								</div>
							))
						}
						</div>
					</div>
				}


				{/* 公告通知 */}
				{	
					this.props.s.user.sid &&
					<div>
						<div className="model-box-bald-title">
							<div className="model-box-bald-title-text gonggao">公告通知</div>
							<div className="model-box-bald-title-more">更多</div>
						</div>
							
						<div className="flex-j-sb flex-wrap" style={{padding: '0 .32rem .32rem .32rem'}}>
						{
							this.state.data.announce && this.state.data.announce.map((item, index) => (
								<div className="xinwen-item" key = {index}>
									<i className="xinwen-bg msg4"></i>
									<span className="xinwen-msg">{item.title}</span>
									<span className="xinwen-daate">{item.create_at}</span>
								</div>
							))
						}
						</div>
					</div>
				}
		  </Page>
		);
	}
}

// const HomePageInject = connect(s=>({s:s}))(HomePageRender)
export default connect(s=>({s:s}))(HomePage)
