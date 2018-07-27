import React, { Component} from 'react';
import {log,AppCore,AppMeta,loadIfEmpty,goTo,goBack,trigger,submit,Enum} from '../util/core';
import {error,nonBlockLoading,progress,footer} from '../util/com';
import { connect } from 'react-redux';

import {Page,Button,Input,AlertDialog,Dialog} from 'react-onsenui';

class NewCstmPage extends Component{

	constructor(props) {
		super(props);
		
		this.action = props.p.action;
		this.pre_view = props.p.view;
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
		      <div className="center">{AppMeta.actions[this.action]['text']}</div>
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
				{
					this.state.list&&
					<div>
						{
							Object.keys(this.state.list).map( key => 
								(!this.state.list[key]['type'] || !Enum[this.state.list[key]['type']]) &&
								<div className="model-box" key={key}>
									<div className="model-main">
										<div className="model-main-box">
											<div className="model-main-item" style={{display: 'flex'}}>
												<span className="add-cstm-left">{this.state.list[key]['text']}</span>
												<input className="add-cstm-right" value={this.state.data[key]?this.state.data[key]:''} 
												onChange={ e => this.setNewValue(e.target.value,key) } />
											</div>				
										</div>
									</div>
								</div>
							)
						}
						{
							Object.keys(this.state.list).map( key => 
									(this.state.list[key]['type'] && Enum[this.state.list[key]['type']]) &&
									<div className="model-box" key={key}>
										<div className="model-main">
											<div className="model-main-box">
												<div className="model-main-item" onClick={_=>goTo('选择项目页',{items:Enum[this.state.list[key]['type']],cb:this.selectItem.bind(this),key:key})}>
													<span className="add-cstm-left">{this.state.list[key]['text']}</span>
													<span className="add-cstm-right">{this.state.data[key]?Enum[this.state.list[key]['type']][this.state.data[key]]:''}</span>			
												</div>
											</div>
										</div>
									</div>
								)
						}

						{/* 底部 footer */}
						<div className="doc-btn-box" style={{justifyContent: 'center'}}>
		            		<div className="doc-btn-submit" onClick={_=>this.submit()}>提交</div>
						</div>
					</div>
				}
			</Page>
		);
	}
}

export default connect(s=>({s:s}))(NewCstmPage)
