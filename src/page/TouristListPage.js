import React, { Component } from 'react';

import {Page} from 'react-onsenui';


import {footer,ErrorBoundary,info} from '../util/com';
import {AppCore,resetTo, goBack ,loadIfEmpty,AppMeta,Enum,goTo,trigger,post} from '../util/core';
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
		this.state = {'data':{},'inited':false};
		this.action = props.p.action;
		let cfg = AppMeta.actions[this.action];
		this.text = cfg.text;
	}


	renderToolbar(){
		return (
		  	<ons-toolbar>
		  		<div className='left'><ons-back-button></ons-back-button></div>
		      	<div className="center">{this.text}</div>
		  	</ons-toolbar>
		);
	}

	cancel(){
		goBack();
	}

	submit(){
		let data = this.state.data;
		let order_id = data['订单详情'][0]['id'];
		let cfg = AppMeta.actions[this.action];

		trigger('加载等待');
	    post(cfg.submit.url, {id:order_id,data:{'游客名单':data['游客名单']}}).then(
	        r => {
			    info(r.message).then(
					_=>{
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

	checkTourist(item,check){
		goTo('录入游客名单',{item: item,check:check})
	}

	render(){
		return (
			<Page renderToolbar={_=>this.renderToolbar()} onShow={_=>loadIfEmpty(this,this.afterLoad)}>
			{
				this.state.inited &&
				<div>
				<div className="ord-edit-ord-detail">
					{/* 订单页面 HTML */}
					<div className="order-item" style={{paddingBottom: '1.013333rem'}}>
							<div className="order-number">
								<span style={{fontSize:'.373333rem'}}>订单号:D0{this.state.data['订单详情'][0]['id']}</span>
								<span style={{color:'#9E9E9E', fontSize:'.32rem'}}></span>
							</div>
							<div className="order-main">
							{/* 团队信息 */}
							<div className="pro-item"
							style={{backgroundColor: '#F8F8F8',borderRadius: '0',width: '100%', height:'100%',margin:'0'}}>
								<div className="pro-item-left" style={{width:'2.56rem',height:'2.186667rem'}}>
									<img className="img-size"/>
								</div>
								<div className="pro-item-right">
									<div className="pro-item-name"></div>
									<div className="pro-item-dep_city flex-j-sb">
										<span>团期: {this.state.data['订单详情'][0]['dep_date']}</span>
										<span>供应商:{this.state.data['订单详情'][0]['pd_provider']}</span>
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
							<div className="box-title-text">游客名单</div>
							<div className="box-title-operate">
								{/* <div className="box-title-operate-item" style={{width: '.64rem',border:'none'}}>
								<img src="img/jia.png" style={{width:'.64rem', height: '.64rem'}} onClick={() => this.addTourist()}/></div>
								<div className="box-title-operate-item" style={{width: '.64rem',border:'none'}}>
								<img src="img/jian.png" style={{width:'.64rem', height: '.64rem'}} onClick={() => this.reduceTourist()}/></div> */}
							</div>
						</div>
						<div className="model-main">
						{this.state.data['游客名单'].map( (item,i) => 
							<div className="model-main-item-box" key={i} onClick={_=>this.checkTourist(item,'check')}>
								<div className="model-main-item">
									<span>{i+1}</span> 
									<span>{item.name}</span> 
									<span>{item.gender}</span> 
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
				<div className="doc-btn-box" style={{padding: '0 1.333333rem'}}>
					<div onClick={_=>this.cancel()} className="doc-btn-default">取消</div>
            		<div onClick={_=>this.submit()} className="doc-btn-submit">提交</div>
        		    {/* <div className="doc-btn-submit" onClick={_=>this.submit()}>提交</div> */}
				</div>
				</div>
			}
		    </Page>
		);
	}
}

const TouristListPageInject = connect(s=>({s:s}))(TouristListPageRender)
