import React, { Component} from 'react';
import {log,AppCore,AppMeta,loadIfEmpty,goTo,goBack,trigger,submit,Enum} from '../util/core';
import {error,nonBlockLoading,progress,footer,ProInfo} from '../util/com';
import { connect } from 'react-redux';

import {Page,Button,Input,AlertDialog,Dialog} from 'react-onsenui';

class NewCstmPage extends Component{

	constructor(props) {
		super(props);
		
		this.action = props.p.action;
		this.pre_view = props.p.view;
		this.pro_info = props.p.pro_info || '';
		let action_cfg = AppMeta.actions[this.action];
		let list = AppMeta.blocks[action_cfg['block'][0]]?AppMeta.blocks[action_cfg['block'][0]].list:{};
		this.state = {'data':{},'inited':false,'list':list};
	}

	cancel(){
		goBack();
	}

	submit(){
		trigger('加载等待');
	    submit(this,this.submit_done.bind(this));
	}

	submit_done(r){
		let cstm  = r.data[0];
		let data = this.pre_view.state.data;
		data['客户详情'][0] = cstm;
		data['客户详情'][0].cstm_id = cstm.id;
		goBack();
	}

	renderToolbar(){
		return (
		  	<ons-toolbar>
		  	  <div className='left'><ons-back-button></ons-back-button></div>
		      <div className={(AppCore.os === 'ios'?"":"Andriod-title")+" center"}>{AppMeta.actions[this.action]['text'] || '新增客户'}</div>
		  	</ons-toolbar>
		);
	}

	setNewValue(value,key){
		let data = this.state.data;
		data[key] = value;
		this.setState({data:data});
	}

	selectItem(value,key){
		let data = this.state.data;
		data[key] = value;
		this.setState({data:data});
		goBack();
	}

	render(){
		return (
				<Page 
				renderToolbar={_=>this.renderToolbar()}>
				{/* 订单 HTML */}
				{this.pro_info && 
					<ProInfo pro_info={this.pro_info } />
				}
				{
					this.state.list&&
					<div className="add-cstm-box">
						{
							Object.keys(this.state.list).map( key => 
								(this.state.list[key]['type'] && Enum[this.state.list[key]['type']]) &&
									<div className="add-cstm-cell" key={key}
									onClick={_=>goTo('选择项目页',{newcstm:Enum[this.state.list[key]['type']],cb:this.selectItem.bind(this),key:key})}>
										<span className="add-cstm-left">{this.state.list[key]['text']}</span>
										<span className="add-cstm-right-select">{this.state.data[key]?Enum[this.state.list[key]['type']][this.state.data[key]]:''}</span>			
									</div>
								)
						}
						{
							Object.keys(this.state.list).map( key => 
								(!this.state.list[key]['type'] || !Enum[this.state.list[key]['type']]) &&
									<div className="add-cstm-cell" key={key}>
										<span className="add-cstm-left">{this.state.list[key]['text']}</span>
										<input className="add-cstm-right-input" value={this.state.data[key]?this.state.data[key]:''} 
										onChange={ e => this.setNewValue(e.target.value,key) } placeholder={ '请输入'+this.state.list[key]['text'] } />
									</div>				
							)
						}

						{/* 底部 footer */}
						<div className="add-cstm-btn">
							<div className="add-cstm-btn-cancel"
							onClick={_=>goBack()}>取消</div>
							<div className="add-cstm-btn-submit"
							onClick={_=>this.submit()}>确定</div>
						</div>
					</div>
				}
			</Page>
		);
	}
}

export default connect(s=>({s:s}))(NewCstmPage)
