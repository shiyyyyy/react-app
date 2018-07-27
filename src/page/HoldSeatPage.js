import React, { Component} from 'react';
import {log,AppCore,AppMeta,loadIfEmpty,goTo,goBack,trigger,submit,Enum} from '../util/core';
import {error,nonBlockLoading,progress,footer,info} from '../util/com';
import { connect } from 'react-redux';

import {Page,Button,Input,AlertDialog,Dialog} from 'react-onsenui';

class HoldSeatPage extends Component{

	constructor(props) {
		super(props);
		
		this.state = {add_new_cstm:false,'data':{},'group_id':props.p.data.id};
		this.action = props.p.action;
	}

	afterLoad(){
		let data = this.state.data;
		data['客户详情'] = [{short_name:'',full_name:''}];
		data['接单人']= {};
		data['num_of_people'] = 0;
		data.group_id = this.state.group_id;
		this.setState({data:data});
	}

	selectCstm(){
		goTo('订单选择客户',{action:'订单选择客户',view:this});
	}

	addCstm(){
		goTo('占位新增客户',{action:'占位新增客户',view:this});
	}

	selectAssitant(){
		goTo('选择项目页',{items:this.state.data['可接单人'],cb:this.selectAssitantDone.bind(this),key:'接单人'})
	}

	selectAssitantDone(value){
		let data = this.state.data;
		data['接单人'].id = value;
		data['接单人'].name = this.state.data['可接单人'][value];
		this.setState({data:data});
		goBack();
	}

	cancel(){
		goBack();
	}

	submitOrder(){
		let data = this.state.data;
		if(!data['客户详情'][0].id){
			error('请填写客户信息');
			return ;
		}
		if(!data['接单人'].id){
			error('请选择接单人');
			return ;
		}
		if(!data['num_of_people']||data['num_of_people']<=0){
			error('请填写人数信息');
			return ;
		}
	    this.setState({data:{'group_id':data.group_id,'cstm_id':data['客户详情'][0].id
	    			,'num_of_people':data['num_of_people'],'assitant_id':1}},this.submit);
	}

	submit(){
		trigger('加载等待');
	    // submit(this,_=>goBack());
	    submit(this,r=>this.submitDone(r));
	}
	submitDone(r){
		// 占位确定:提示信息
		info(r.message).then( _=>
			{
				goBack();
				// this.state.pre_view
			})
	}
	setNumber(value){
		let data  = this.state.data;
		data.num_of_people = value;
		this.setState({data:data});
	}

	renderToolbar(){
		return (
		  	<ons-toolbar>
		  	  <div className='left'><ons-back-button></ons-back-button></div>
		      <div className="center">{this.props.p.action}</div>
		  	</ons-toolbar>
		);
	}



	render(){
		return (
				<Page 
				renderToolbar={_=>this.renderToolbar()} 
				onShow={_=>loadIfEmpty(this,this.afterLoad)} >
				{
					this.state.data&&this.state.data['客户详情']&&this.state.data['接单人']&&
					<div>
						<div className="model-box">
							<div className="box-title">
								<div className="box-title-text">客户信息</div>
								<div className="box-title-operate">
									<div onClick={_=>this.selectCstm()} className='box-title-operate-item' style={{color:'#6FC5D8',border:'1px solid #6FC5D8'}}>
						              选择客户
						            </div>
						            <div onClick={_=>this.addCstm()} className='box-title-operate-item' style={{color:'#6FC5D8',border:'1px solid #6FC5D8'}}>
						              新增客户
						            </div>
								</div>
							</div>
							<div className="model-main">
								<div className="model-main-box">
									<div className="model-main-item">
										<span>姓名: </span>
										<input type="text" value={this.state.data['客户详情'][0].short_name?this.state.data['客户详情'][0].short_name:''} 
										readOnly/></div>
									<div className="model-main-item">
										<span>电话: </span>
										<input type='number' value={this.state.data['客户详情'][0].mobile?this.state.data['客户详情'][0].mobile:''} 
										readOnly /></div>						
								</div>
							</div>
						</div>
						<div className="model-box">
							<div className="box-title">
								<div className="box-title-text">接单人</div>
								<div className="box-title-operate">
									<div onClick={_=>this.selectAssitant()} className='box-title-operate-item' style={{color:'#6FC5D8',border:'1px solid #6FC5D8'}}>
						              选择接单人
						            </div>
								</div>
							</div>
							<div className="model-main">
								<div className="model-main-box">
									<div className="model-main-item">
										<span>姓名: </span>
										<input type="text" value={this.state.data['接单人'].name?this.state.data['接单人'].name:''} 
										readOnly/></div>				
								</div>
							</div>
						</div>
						{/* 人数 */}
						<div className="model-box">
							<div className="box-title">
								<div className="box-title-text">游客</div>
							</div>
							<div className="model-main">
								<div className="model-main-box">
									<div className="model-main-item">
										<span>人数</span>
										<input type="number" value={this.state.data['num_of_people']?this.state.data['num_of_people']:''} onChange={ e => this.setNumber(e.target.value) }
										/></div>				
								</div>
							</div>
						</div>

						{/* 底部 footer */}
						{/* <div className="order-edit-footer">
		            		<button  onClick={_=>this.cancel()}>取消</button>
		            		<button  onClick={_=>this.submitOrder()}>提交</button>
						</div> */}
						{/* 底部 footer */}
						<div className="doc-btn-box" style={{padding: '0 1.333333rem'}}>
							<div onClick={_=>this.cancel()} className="doc-btn-default">取消</div>
		            		<div onClick={_=>this.submitOrder()} className="doc-btn-submit">提交</div>
		        		    {/* <div className="doc-btn-submit" onClick={_=>this.submit()}>提交</div> */}
						</div>
					</div>
				}
			</Page>
		);
	}
}

export default connect(s=>({s:s}))(HoldSeatPage)
