import React, { Component} from 'react';
import {log,AppCore,AppMeta,loadIfEmpty,goTo,Enum,goBack} from '../util/core';
import {error,nonBlockLoading,progress,footer} from '../util/com';
import { connect } from 'react-redux';

import {Page,Button,Input,Dialog,Select} from 'react-onsenui';
import {addRowDialog,editRowDialog} from '../util/order'

class OrderReceivableDetail extends Component{

	constructor(props) {
		super(props);
		
		this.action = props.p.action;
		this.pre_view = this.props.p.view;
		let state  = {isAddRow:false,isEditRow:false,data:{},block_cfg:{}};
		let cfg = AppMeta.actions[this.action];
		cfg.block.forEach(function(block){
			state.data[block] = props.p.data[block]?props.p.data[block]:[];
			state.block_cfg[block] = AppMeta.blocks[block];
		});
		this.state = state;
	}


	renderToolbar(){
		return (
		  	<ons-toolbar>
		  	  <div className='left'><ons-back-button></ons-back-button></div>
		      <div className="center">{AppMeta.actions[this.action].text}</div>
		  	</ons-toolbar>
		);
	}

	addRow(block){
		let data = this.state.data;
		data['row'] = {};
		for(var field in this.state.block_cfg[block].list){
			data['row'][field] = '';
		}

		this.setState({isAdd:true});
		this.setState({AddBlock:block});
		this.setState({data:data});
	}
	addRowDone(block){
		let data = this.state.data;
		let row = data['row'];
		data[block].push(row);

		data['row'] = {};
		this.setState({isAdd:false});
		this.setState({AddBlock:''});
		this.setState({data:data});
	}
	CancelAddRow(block){
		let data = this.state.data;
		data['row'] = {};

		for(var field in this.state.block_cfg[block].list){
			data['row'][field] = '';
		}
		this.setState({isAdd:false});
		this.setState({AddBlock:''});
		this.setState({data:data});
	}

	reduceRow(block){
		let data = this.state.data;
		if(data[block].length>0){
			data[block].splice(0,1);
		}	
		this.setState({data:data});
	}
	editRow(item,i,block){
		let data = this.state.data;
		data['row'] = {};

		for(var field in this.state.block_cfg[block].list){
			data['row'][field] = item[field];
		}

		this.setState({isEdit:true});
		this.setState({EditBlock:block});
		this.setState({EditIndex:i});
		this.setState({data:data});
	}

	EditRowDone(block,index){
		let data = this.state.data;

		for(var field in this.state.block_cfg[block].list){
			data[block][index][field] = data['row'][field]?data['row'][field]:'';
		}

		data['row'] = {};
		this.setState({isEdit:false});
		this.setState({EditBlock:''});
		this.setState({data:data});
	}
	CancelEditRow(block){
		let data = this.state.data;
		data['row'] = {};
		this.setState({isEdit:false});
		this.setState({EditBlock:''});
		this.setState({data:data});
	}

	setNewValue(value,key){
		let data = this.state.data;
		if(!data['row']){
			data['row'] = {};
		}
		data['row'][key] = value;
		this.setState({data:data});
	}

	submit(){

		let receive_item = this.state.data['应收明细'];
		let data = this.pre_view.state.data;
		let receivable =0 ;
		receive_item.forEach(function(item){
			receivable += + (item.num_of_people * item.unit_price );
		});
		data['订单应收'][0] = {receive_item:receive_item,receivable:receivable,received:data['订单应收'][0]['received'],receive_diff:(receivable - data['订单应收'][0]['received'])};

		this.pre_view.setState({data:data});
		goBack();
	}



	render(){
		return (
				<Page 
				renderToolbar={_=>this.renderToolbar()} 
				>
				{
					Object.keys(this.state.block_cfg).map(block=>
					<div className="model-box" key = {block}>
						<div className="box-title">
							<div className="box-title-text">{this.state.block_cfg[block].text}</div>
							<div className="box-title-operate">
								<div className="box-title-operate-item" style={{width: '.64rem',border:'none'}}>
								<img src="img/jia.png" style={{width:'.64rem', height: '.64rem'}} onClick={_=> this.addRow(block)}/></div>
								<div className="box-title-operate-item" style={{width: '.64rem',border:'none'}}>
								<img src="img/jian.png" style={{width:'.64rem', height: '.64rem'}} onClick={_=> this.reduceRow(block)}/></div>
							</div>
						</div>
						<div className="model-main">
						{this.state.data[block].map( (item,i) => 
							<div className="model-main-item-box" key={i}>
								<div className="model-main-item" onClick={_=>this.editRow(item,i,block)}>
									<span>{i+1}</span> 
									{
										Object.keys(this.state.block_cfg[block].list).map(field => 
											(this.state.block_cfg[block]['list'][field]['type'] && Enum[this.state.block_cfg[block]['list'][field]['type']])&&
											<span key={field+i}>{this.state.block_cfg[block]['list'][field]['text']}{Enum[this.state.block_cfg[block]['list'][field]['type']][item[field]]}</span>
											)
									}
									{
										Object.keys(this.state.block_cfg[block].list).map(field => 
											!(this.state.block_cfg[block]['list'][field]['type'] && Enum[this.state.block_cfg[block]['list'][field]['type']])&&
											<span key={field+i}>{this.state.block_cfg[block]['list'][field]['text']}{[item[field]]}</span>
											)
									}
									<i></i>
								</div>
							</div>
						)}
						</div>
					</div>
					)
				}
				{/* 底部 footer */}
				<div className="doc-btn-box" style={{justifyContent: 'center'}}>
		            <div className="doc-btn-submit" onClick={_=>this.submit()}>提交</div>
				</div>
				{
					this.state.isAdd && this.state.AddBlock &&
					<div>
					 {addRowDialog(this,this.state.block_cfg[this.state.AddBlock],this.state.isAdd,this.state.AddBlock)}
					</div>
				}
				{
					this.state.isEdit && this.state.EditBlock &&
					<div>
					 {editRowDialog(this,this.state.block_cfg[this.state.EditBlock],this.state.isEdit,this.state.EditIndex,this.state.EditBlock)}
					</div>
				}
			</Page>
		);
	}
}

export default connect(s=>({s:s}))(OrderReceivableDetail)
