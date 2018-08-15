import React, { Component} from 'react';
import {log,AppCore,AppMeta,loadIfEmpty,goTo,goBack,trigger,submit,Enum} from '../util/core';
import {error,nonBlockLoading,progress,footer ,ErrorBoundary ,info,ProInfo,confirm} from '../util/com';
import { connect } from 'react-redux';

import {Page,Icon,Button,Input,AlertDialog,Dialog} from 'react-onsenui';

import '../css/OrderPage.css'

export default class HoldSeatWrap extends Component {
    constructor(props) {
		super(props);
    }

    render() {
	  return (
	  		<ErrorBoundary><HoldSeatPageInject p={this.props.p} /></ErrorBoundary>
	  )
  }  
}

class HoldSeatPageRender extends Component{

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
		goTo('占位新增客户',{action:'占位新增客户',view:this,pro_info: this.state.data['团队详情'][0]});
	}

	selectAssitant(){
		goTo('选择项目页',{items:this.state.data['接单人详情'],cb:this.selectAssitantDone.bind(this),key:'接单人',pro_info: this.state.data['团队详情'][0]})
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
		confirm('是否确认操作？').then(r=>r && this.sureToSubmit());
	}

	sureToSubmit(){
		let data = this.state.data;
		let assitant_id = data['接单人'].id;
		this.setState({data:{'group_id':data.group_id,'cstm_id':data['客户详情'][0].id
	    			,'num_of_people':data['num_of_people'],'assitant_id':assitant_id}});
		trigger('加载等待');
		submit(this,this.submitDone.bind(this));
	}

	submitDone(r){
		info(r.message).then(
			_=>{
				goBack();
			}
		)
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
				{ !this.state.data['接单人详情'] && nonBlockLoading() }
				{/* 订单 HTML */}
				{this.state.data && this.state.data['团队详情'] &&
					<ProInfo pro_info={this.state.data['团队详情'][0]} />
				}
				{
					this.state.data&&this.state.data['客户详情']&&this.state.data['接单人']&&

					<div>
						<div className="model-box">
							<div className="box-title">
								<div className="kehu">客户信息</div>
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
								<div className="jiedanren">接单人</div>
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
								<div className="youke">游客</div>
							</div>
							<div className="model-main">
								<div className="model-main-box">
									<div className="model-main-item people-num-box">
										<span>人数</span>
										<input type="number" value={this.state.data['num_of_people'] >= 0?this.state.data['num_of_people']:'0'} 
										onChange={ e => this.setNumber(e.target.value-0) } className="people-num" />
										<div className="plus-minus">
											<Icon icon="md-minus-circle-outline" style={{color: '#EE8585'}}
											onClick={e => this.setNumber( (this.state.data.num_of_people-1>=0?this.state.data.num_of_people-1:0) )} />
											<Icon icon="md-plus-circle-o" style={{color: '#6FC5D8'}}
											onClick={e => this.setNumber( (this.state.data.num_of_people-0)+1 ) } />
										</div>
									</div>				
								</div>
							</div>
						</div>

						{/* 底部 footer */}
						{/* <div className="order-edit-footer">
		            		<button  onClick={_=>this.cancel()}>取消</button>
		            		<button  onClick={_=>this.submitOrder()}>提交</button>
						</div> */}
						{/* 底部 footer */}
						<div className="add-cstm-btn" style={{padding: '.64rem .32rem'}}>
							<div onClick={_=>this.cancel()} className="add-cstm-btn-cancel">取消</div>
		            		<div onClick={_=>this.submitOrder()} className="add-cstm-btn-submit">提交</div>
		        		    {/* <div className="doc-btn-submit" onClick={_=>this.submit()}>提交</div> */}
						</div>
					</div>
				}
			</Page>
		);
	}
}

const HoldSeatPageInject = connect(s=>({s:s}))(HoldSeatPageRender)
