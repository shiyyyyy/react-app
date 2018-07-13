import React, { Component } from 'react';

import {AppCore,resetTo,loadMore,loadIfEmpty,Enum,goTo} from '../util/core';
import {pullHook,loginToPlay,search} from '../util/com';

import {Page} from 'react-onsenui';
import { connect } from 'react-redux';

import '../css/GroupPage.css'
class GroupPage extends Component{

	constructor(props) {
	    super(props);
		this.state = {state:'initial',data:[],pd_nav:'1'};
		this.mod = '团队报名';
	}

	render(){
		return (
			<Page renderToolbar={_=>search()} onInfiniteScroll={done=>loadMore(this,done)} onShow={_=>loadIfEmpty(this)}>
			{
			  	!this.state.search && this.props.s.user.employee_id && pullHook(this)	
		    }
		    {
		    	this.props.s.user.employee_id && 

	    		<div className="group-body">
					<div className="group-modal" style={{height:this.state.search?'100%':'auto'}}>
						<ons-row  class="option-type">
						  <ons-col onClick={_=>this.setState({search:'tag'})}>产品标签</ons-col>
						  <ons-col onClick={_=>this.setState({search:'date'})}>出发日期</ons-col>
						  <ons-col onClick={_=>this.setState({search:'dep_city'})}>出发城市</ons-col>
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
													<li onClick={_=>this.setState({pd_nav:i,pd_tag:undefined,pd_subTag:undefined})} key={i} 
														className={i == this.state.pd_nav ? 'active-select-item' : 'select-item-main'} >
														{Enum.PdNav[i]}
													</li>
												)
											}
											</ul>
											<ul className="select-big select-item">
												<li onClick={_=>this.setState({pd_tag:undefined,pd_subTag:undefined})}
													className={this.state.pd_tag ? 'select-item-main' : 'active-select-item'} >
													全部
												</li>
											{
												Object.keys(Enum.PdTag).map(i=>
													<li onClick={_=>this.setState({pd_tag:i,pd_subTag:undefined})} key={i} 
														className={i == this.state.pd_tag ? 'active-select-item' : 'select-item-main'}>
														{Enum.PdTag[i]}
													</li>
												)
											}
											</ul>
											{
												this.state.pd_tag && 
													<ul className="select-sma select-item">
													{
														Object.keys(Enum.PdSubTag).filter(i=>Enum.PdSubTagBelong[i]==this.state.pd_tag).map(i=>
															<li onClick={_=>this.setState({pd_subTag:i})} key={i}
																className={i == this.state.pd_subTag ? 'active-select-item' : 'select-item-main'}>
																{Enum.PdSubTag[i]}
															</li>
														)
													}
													</ul>
											}

										</div>
										{/* <div className="options-btn">
										  <div className="options-reset">重置</div>
										  <div className="options-submit">确定</div>
										</div> */}
									</div>
								</div>	
							)
						}
						{/* 日期-选择框 */
							this.state.search=='date' && (
								<div className="dialog-box">
									<div className="text-center options-popup">
										<div className="selected-date">
											<input type="date" className="selected-date-input" placeholder="最早出发日期" name="start"/>
											至
											<input type="date" className="selected-date-input" placeholder="最晚出发日期" name="end"/>
										</div>
										<div className="options-btn">
										  <div className="options-reset">重置</div>
										  <div className="options-submit">确定</div>
										</div>
									</div>
								</div>	
							)
						}
						{/* 出发城市-选择框 */
							this.state.search=='dep_city' && (
								<div className="dialog-box">
									<div className="text-center options-popup">
										<div className="selected-dep_city">
											{Object.keys(this.props.s.pub.dep_city).map( i => 
												<div className="dep_city-item" key={i}>{this.props.s.pub.dep_city[i]}</div> 
											)}
										</div>
									</div>
								</div>	
							)
						}
						{/* 主题-选择框 */
							this.state.search=='theme' && (
								<div className="dialog-box">
									<div className="text-center options-popup">
										<div className="selected-dep_city">
											{Object.keys(this.props.s.pub.theme).map( i => 
												<div className="dep_city-item" key={i}>{this.props.s.pub.theme[i]}</div> 
											)}
										</div>
									</div>
								</div>	
							)
						}
						<div style={{height:'100%',backgroundColor:'rgba(0,0,0,.3)'}} onClick={_=>this.setState({search:''})}></div>
					</div>
					<div className="pro-list">
					    {
					    	this.state.data.map(item =>
								<div className="pro-item" key={item.id} onClick={_=>goTo('产品详情页',{pd_id:item.product_id})}>
					      			<div className="pro-item-left">
										<img className="img-size" src={AppCore.HOST+'/'+item.thumb} />
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
				  		this.state.loading &&
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

