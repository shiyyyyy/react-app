import React, { Component } from 'react';

import {AppCore,resetTo,loadMore,loadIfEmpty,Enum,goTo} from '../util/core';
import {pullHook,loginToPlay,search,nonBlockLoading,proList} from '../util/com';

import {Page,Modal,Button} from 'react-onsenui';
import { connect } from 'react-redux';

import '../css/GroupPage.css'
class GroupPage extends Component{

	constructor(props) {
	    super(props);
		this.state = {
			state:'initial',
			data:[],
			pd_nav:'1',
			search: '',
			// modal top offsetHeight
			modalTop: 100,
		};
		this.mod = '团队报名';
	}

	// 设置 modal top  
	componentWillReceiveProps(){
		let headHeight = document.getElementById('head').offsetHeight;
		this.setState({modalTop: headHeight + 50})
	}
	// 重置/确定 时间
	resetDate(){
		console.log("reset")
		this.setState({startDate:undefined,endDate:undefined})
		document.getElementById('startDate').value = ''
		document.getElementById('endDate').value = ''
	}
	submitDate(){
		console.log("submit")
		console.log(this.state.startDate, this.state.endDate)
		if(!(this.state.startDate && this.state.endDate)) return;
	}


	filterModal(){
		return (
	      <Modal isOpen={!!this.state.search} style={{top: this.state.modalTop+'px'}} onClick={_=>{this.setState({search: ''})}}>
	      	<div onClick={(e)=>{e.stopPropagation()}}>
			{/* 产品标签-选择框 */
				this.state.search=='tag' && (

					<div className="dialog-box">
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
									<li onClick={_=>this.setState({pd_subTag:undefined})}
										className={this.state.pd_subTag ? 'select-item-main' : 'active-select-item'} >
										全部
									</li>
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
							  <div className="options-submit">重置</div>
							  <div className="options-submit">确定</div>
							</div> */}
					</div>	
				)
			}
			{/* 日期-选择框 */
				this.state.search=='date' && (
					<div className="dialog-box">
						<div className="text-center options-popup">
							<div className="selected-date">
								<input type="date" className="selected-date-input" placeholder="最早出发日期" name="start" 
								value={this.state.startDate} onChange={e=>this.setState({startDate: e.target.value})} id="startDate" />
								至
								<input type="date" className="selected-date-input" placeholder="最晚出发日期" name="end" 
								value={this.state.endDate} onChange={e=>this.setState({endDate: e.target.value})} id="endDate" />
							</div>
							<div className="options-btn">
							  <div className="options-reset" onClick={this.resetDate.bind(this)}>重置</div>
							  <div className="options-submit" onClick={this.submitDate.bind(this)}>确定</div>
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
									<div className="dep_city-item" key={i}
									onClick={_=>this.setState({dep_city: i})}>{this.props.s.pub.dep_city[i]}</div> 
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
									<div className="dep_city-item" key={i}
									onClick={_=>this.setState({theme: i})}>{this.props.s.pub.theme[i]}</div> 
								)}
							</div>
						</div>
					</div>	
				)
			}
			</div>
	      </Modal>
		);
	}


	render(){
		return (
			<Page 
				renderToolbar={_=>search()} 
				onInfiniteScroll={done=>loadMore(this,done)} 
				onShow={_=>loadIfEmpty(this)}
				renderModal={_=>this.filterModal()}>
			{
			  	!this.state.search && this.props.s.user.sid && pullHook(this)	
		    }
		    {
		    	this.props.s.user.sid && 

	    		<div className="group-body">
					<div className="group-modal" id="group-tab">
						<ons-row  class="option-type">
						  <ons-col onClick={_=>this.setState({search:'tag'})}>产品标签</ons-col>
						  <ons-col onClick={_=>this.setState({search:'date'})}>出发日期</ons-col>
						  <ons-col onClick={_=>this.setState({search:'dep_city'})}>出发城市</ons-col>
						  <ons-col onClick={_=>this.setState({search:'theme'})}>产品主题</ons-col>
						</ons-row>
					</div>
					{proList('group',this.state.data)}
				  	{
				  		this.state.loading && nonBlockLoading()
				  	}

	    		</div>
		    }
		    {
		  		!this.props.s.user.sid && loginToPlay()
		    }
		    </Page>
		);
	}
}

export default connect(s=>({s:s}))(GroupPage)

