import React, { Component } from 'react';

import {AppCore,resetTo,loadPage,Enum} from '../util/core';
import {pullHook,loginToPlay} from '../util/com';

import {Page} from 'react-onsenui';
import { connect } from 'react-redux';

import '../css/GroupPage.css'
class GroupPage extends Component{

	constructor(props) {
	    super(props);
	    this.state = {state:'initial',pageList:[],pd_nav:'1',pd_tag:'0',pd_subTag:'0'};
	    this.url = '/op/Group/read?';
		this.mod = '团队管理';
	}

	setNav(i){
		this.setState({pd_nav: i,pd_tag: '0'})
	}
	setTag(i){
		this.setState({pd_tag: i})
		// 如果i==='0' 则直接搜索,i=其他则展开3级列表
		if(i === '0'){

		}
	}
	setSubTag(i){
		this.setState({pd_subTag: i})
		// 选中3级菜单,就搜索
		
	}
	renderToolbar(){
		return (
		  	<ons-toolbar>
			<div>
		      <div className="header-img"><img src="img/back.png" /></div>
			  <div className=""></div>
			  <div className=""></div>
			</div>
		  	</ons-toolbar>
		);
	}

	preHandler(e){
		console.log(e.target)
		e.preventDefault()
		e.returnValue=false

	}
	preHandler1(e){
		console.log(1)
		e.preventDefault()
		e.returnValue=false
	}

    onShow() {
    	this.props.s.user.employee_id &&
    	this.state.pageList.length == 0 &&
    	loadPage(this)
    }

	render(){
		return (
			<Page renderToolbar={_=>this.renderToolbar()} onInfiniteScroll={done=>loadPage(this,done)} onShow={_=>this.onShow()}>
			{
			  	!this.state.search && this.props.s.user.employee_id && pullHook(this)	
		    }
		    {
		    	this.props.s.user.employee_id && 

	    		<div className="group-body" onTouchMove={this.preHandler1.bind(this)}>
					<div className="group-modal"
					onTouchMove={this.preHandler.bind(this)}
					>
						<div className="input-box">
						    <ons-search-input style={{width:'100%'}}
						      placeholder="Search"
						      onchange="ons.notification.alert('Searched for: ' + this.value)"
						    ></ons-search-input>
						</div>
						<ons-row  class="option-type">
						  <ons-col onClick={_=>this.setState({search:'tag'})}>产品标签</ons-col>
						  <ons-col onClick={_=>this.setState({search:'date'})}>出发日期</ons-col>
						  <ons-col onClick={_=>this.setState({search:'city'})}>出发城市</ons-col>
						  <ons-col onClick={_=>this.setState({search:'theme'})}>产品主题</ons-col>
						</ons-row>

						{/* 产品标签-选择框 */
							this.state.search=='tag' && (

								<div className="dialog-box">
									<div className="text-center options-popup">
										<div className="selected">
											<ul className="select-nav select-item">
											{
												Object.keys(Enum.PdNav).map(i=>
													<li onClick={this.setNav.bind(this,i)} key={i} 
													className={i === this.state.pd_nav ? 'active-select-item' : '' + " " + 'select-item-main'}
													>{Enum.PdNav[i]}</li>
												)
											}
											</ul>
											<ul className="select-big select-item">
											{
												['0'].concat(Object.keys(Enum.PdTag)).map(i=>
													<li onClick={this.setTag.bind(this, i)} key={i} 
													className={i === this.state.pd_tag ? 'active-select-item' : '' + " " + 'select-item-main'}
													>{ i === '0' ? '不限' : Enum.PdTag[i]}</li>
												)
											}
											</ul>
											{(this.state.pd_nav && (this.state.pd_tag && this.state.pd_tag !== '0')) && (
												<ul className="select-sma select-item">
												{
													['0'].concat(Object.keys(Enum.PdTag)).map(i=>
														<li onClick={this.setSubTag.bind(this, i)} key={i}
														className={i === this.state.pd_subTag ? 'active-select-item' : '' + " " + 'select-item-main'}
														>{ i === '0' ? '不限' : Enum.PdSubTag[i]}</li>
													)
												}
												</ul>
											)}

										</div>
										{/* <div className="options-btn">
										  <div className="options-reset">重置</div>
										  <div className="options-submit">确定</div>
										</div> */}
									</div>
								</div>	
							)
						}
					</div>
					<div className="pro-list">
					    {
					    	this.state.pageList.map(item =>
								<div className="pro-item" key={item.id}>
					      			<div className="pro-item-left">
										<img className="img-size" src={'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1530677101117&di=5ada5f831c0373638a3f7c56dd683750&imgtype=0&src=http%3A%2F%2Fg.hiphotos.baidu.com%2Fimage%2Fpic%2Fitem%2Fb7003af33a87e95053e42ae21c385343faf2b449.jpg'} />
										<div className="pro-item-pro_id">产品编号: {item.product_id}</div>
									</div>
					      			<div className="pro-item-right">
										<div className="pro-item-name">{item.pd_name}</div>
										<div className="pro-item-date">发团日期: {item.dep_date}</div>
										<div className="pro-item-dep_city flex-j-sb">
											<span>{item.dep_city_id}出发</span>
											<span>供应商: {item.pd_provider}</span>
										</div>
										<div className="pro-item-price flex-j-sb">
											<img className="img-hot1" src={'img/hot1.png'} />
											<span style={{fontSize: '.48rem'}}>￥{item.zk_price} <span style={{fontSize: '.373333rem'}}>起</span></span>
										</div>
									</div>
								</div>
					    	)
					    }
				    </div>
				  	{
				  		!this.state.loading &&
							<div className="after-list text-center">
						      <ons-icon icon="fa-spinner" size="26px" spin></ons-icon>
						    </div>
				  	}
	    		</div>
		    }
		    {
		  		!this.props.s.user.employee_id && loginToPlay()
		    }
		    </Page>
		);
	}
}

export default connect(s=>({s:s}),undefined)(GroupPage)

