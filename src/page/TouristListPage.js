import React, { Component } from 'react';

import {Page} from 'react-onsenui';


import { footer, ErrorBoundary, info, nonBlockLoading, confirm, BlackPrompt, BlackList} from '../util/com';
import { AppCore, resetTo, goBack, loadIfEmpty, AppMeta, Enum, goTo, trigger, post} from '../util/core';
import { connect } from 'react-redux';

export default class TouristListWrap extends Component {
    constructor(props) {
    	super(props);
    }

    render() {
	  return (
	  		<ErrorBoundary><TouristListPageInject p={this.props.p} /></ErrorBoundary>
	  )
  }  
}

class TouristListPageRender extends Component{

	constructor(props) {
		super(props);
		this.state = {
			'data':{},'inited':false,
			BlackPromptShow: false,
			BlackListShow: false,
			BlackUserNameArr: [],
		};
		this.action = props.p.action;
		let cfg = AppMeta.actions[this.action];
		this.text = cfg.text;
	}


	renderToolbar(){
		return (
		  	<ons-toolbar>
		  		<div className='left'><ons-back-button></ons-back-button></div>
		      	<div className={(AppCore.os === 'ios'?"":"Andriod-title")+" center"}>{this.text}</div>
		  	</ons-toolbar>
		);
	}

	cancel(){
		goBack();
	}

	// 不管多少游客,至少给出一个手机号(现在不需要)
	// minTouriListMobile(){
	// 	var regex = /^1[34578][0-9]{9}$/
	// 	if(JSON.stringify(this.state.data['游客名单']) !== '{}'){
	// 		return this.state.data['游客名单'].find(item=>{
	// 			return regex.test(item.mobile)
	// 		})
	// 	}
	// }

	submit(){
		confirm('是否确认操作？').then(r => r && this.BlackListVer())
	}
	sureToRealSignUp(){
		let data = this.state.data;
		let order_id = data['订单详情'][0]['id'];
		let cfg = AppMeta.actions[this.action];
							// if(!this.minTouriListMobile()){
							// 	info('至少要有一位游客的手机号');
							// 	return
							// }
		trigger('加载等待');
		post(cfg.submit.url, { id: order_id, data: { '游客名单': data['游客名单'] } }).then(
			r => {
				info(r.message).then(
					_ => {
						goBack();
					}
				);
			}
		);
	}

	afterLoad(){
		let data = this.state.data;
		data['游客名单'] = data['游客名单']?data['游客名单']:[];
		data['订单详情'] = data['订单详情']?data['订单详情']:[];
        
		this.setState({data:data,inited:true});
	}

	addTourist(){
		let data = this.state.data;
		data['游客名单'].push({name:'虚拟游客',certificate_type:1});
		this.setState({data:data});
	}

	reduceTourist(){
		let data = this.state.data;
		if(data['游客名单'].length>0){
			data['游客名单'].splice(0,1);
		}	
		this.setState({data:data});
	}

	editTourist(item,i,block){
		goTo('录入游客名单',{action:'录入游客名单',view:this,item: item,i:i,block:block})
	}

	BlackListVer() {
		// 判断黑名单
		let that = this
		let data = this.state.data;
		let trouList = data['游客名单']
		post('/sale/TouristBlacklist/tourist_check', { tourist_data: trouList }).then(
			r => {
				if (r.data.length > 0) {
					that.setState({ BlackUserNameArr: r.data, BlackPromptShow: true })
				} else {
					that.sureToRealSignUp()
				}
			}
		)
	}
	BlackPromptDialog() {
		let that = this
		let param = {
			show: this.state.BlackPromptShow,
			blackUser: this.state.BlackUserNameArr,
			submit(val) {
				that.setState({ BlackListShow: true })
			},
			close(val) {
				that.setState({ BlackPromptShow: false })
				confirm('是否继续修改订单？').then((r,e) => {
					if(r){
						that.state.BlackUserNameArr.map(item => {
							let blackList = that.state.data['游客名单'].filter(cell => {
								if (cell.name === item) {
									cell.tourist_blacklist = 1
								}
							})
						})
						that.sureToRealSignUp()
					}
				})
			}
		}
		return (<BlackPrompt param={param} />)
	}
	BlackListDialog() {
		let that = this
		let param = {
			show: this.state.BlackListShow,
			tourist_name: this.state.BlackUserNameArr || '',
			close(val) {
				that.setState({ BlackListShow: false })
			}
		}
		return (<BlackList param={param} />)
	}

	render(){
		return (
			<Page renderToolbar={_=>this.renderToolbar()} onShow={_=>loadIfEmpty(this,this.afterLoad)}>

			{
			  	!this.state.inited && nonBlockLoading()
			}
			{
				this.state.inited &&
				<div>
				<div className="ord-edit-ord-detail">
					{/* 订单页面 HTML */}
					<div className="order-item" style={{paddingBottom: '1.013333rem'}}>
							<div className="order-number">
								<span style={{fontSize:'.373333rem'}}>D0{this.state.data['订单详情'][0]['id']}</span>
								<span style={{color:'#9E9E9E', fontSize:'.32rem'}}></span>
							</div>
							<div className="order-main">
							{/* 团队信息 */}
							<div className="pro-item"
							style={{backgroundColor: '#F8F8F8',borderRadius: '0',width: '100%', height:'100%',margin:'0'}}>
								<div className="pro-item-left" style={{width:'2.56rem',height:'2.186667rem'}}>
									<img className="img-size" src={AppCore.HOST+'/'+this.state.data['订单详情'][0]['thumb']}/>
								</div>
								<div className="pro-item-right">
									<div className="pro-item-name">产品名称: {this.state.data['订单详情'][0]['pd_name']}</div>
									<div className="pro-item-dep_city flex-j-sb">
										<span>团期: {this.state.data['订单详情'][0]['dep_date']}</span>
										<span>供应商:{this.state.data['订单详情'][0]['pd_provider']}</span>
									</div>
									<div className="pro-item-price flex-j-sb" style={{fontSize: '.32rem'}}>
										<span>客户:{this.state.data['订单详情'][0]['short_name']}</span>
										<span>人数:{this.state.data['订单详情'][0]['num_of_people']}</span>
										<span>{Enum.OrderState[this.state.data['订单详情'][0]['state']]}</span>
									</div>
									<div className="pro-item-price flex-j-sb" style={{fontSize: '.32rem'}}>
									</div>
								</div>
							</div>
							</div>
					</div>
				</div>
				{/* 游客名单 */}
				<div className="model-box">
						<div className="box-title">
							<div className="youke">游客名单</div>
						</div>
						<div className="model-main">
						{this.state.data['游客名单'].map( (item,i) => 
							<div className="model-main-item-box" key={i} onClick={_=>this.editTourist(item,i,'游客名单')}>
								<div className="model-main-item">
									<span>{i+1}</span> 
									<span>{item.name}</span> 
									<span>{item.gender >= 0 ? Enum.Gender[item.gender] :''}</span> 
									<span>{item.birthday}</span>
									<span>{Enum.Certificate[item.certificate_type]}</span> 
									<span>{item.certificate_num}</span>
									<span>{item.mobile}</span> 
									<span>{item.comment}</span>
									<i></i>
								</div>
							</div>
						)}
						</div>
				</div>
				<div className="enter-tour-list-btn" style={{marginBottom: '50px'}}>
					<div onClick={_=>this.cancel()} className="enter-tour-list-btn-default">取消</div>
            		<div onClick={_=>this.submit()} className="enter-tour-list-btn-submit">提交</div>
        		    {/* <div className="doc-btn-submit" onClick={_=>this.submit()}>提交</div> */}
				</div>
				</div>
			}
				{this.state.data && this.BlackPromptDialog()}
				{this.state.data && this.state.BlackListShow && this.BlackListDialog()}
		    </Page>
		);
	}
}

const TouristListPageInject = connect(s=>({s:s}))(TouristListPageRender)
