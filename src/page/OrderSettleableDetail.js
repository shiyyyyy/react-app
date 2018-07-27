import React, { Component} from 'react';
import {log,AppCore,AppMeta,loadIfEmpty,goTo,Enum,goBack} from '../util/core';
import {error,nonBlockLoading,progress,footer} from '../util/com';
import { connect } from 'react-redux';

import {Page,Button,Input,Dialog,Select} from 'react-onsenui';
import {addRowDialog,editRowDialog} from '../util/order'


class OrderSettleableDetail extends Component{

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
		state['block_hide'] = {'自动优惠':1,'手动优惠':1};
		let price_config = JSON.parse(this.pre_view.state.data['订单团队'][0].budget);
		state['price_config'] = [];
		price_config.forEach(function(config, index){
			state['price_config'][index] = []
			state['price_config'][index].push('价格类型:'+config.price_type)
			state['price_config'][index].push('同行价:'+config.peer_price)
			state['price_config'][index].push('直客价:'+config.zk_price)
			state['price_config'][index].push('备注:'+config.comment)
		});
		state['group_price_config'] = price_config;
		state['price_type'] = -1;
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
	reduceRow(block){
		let data = this.state.data;
		if(data[block].length>0){
			data[block].splice(0,1);
		}	
		this.setState({data:data});
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
	selectPriceType(k){
		this.setState({price_type:k});
	}
	addGroupFeeDone(){
		let price_type = this.state.price_type;
		if(price_type<0){
			error('团费类型');
     		return ;
		}
		let data = this.state.data;
		let row = data['row'];
		if(!row['num_of_people']&&row['num_of_people']<=0){
			error('请填写人数');
			return;
		}
		let price_type_config = this.state['group_price_config'][price_type];
		data['参团费用'].push({'price_type':price_type_config.price_type,'price_type_comment':price_type_config.price_type_comment
							 ,'unit_price':price_type_config.peer_price,'num_of_people':row['num_of_people']});
		data['row'] = {};
		this.setState({isAdd:false});
		this.setState({AddBlock:''});
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

	EditGroupFeeDone(index){
		let price_type = this.state.price_type;
		if(price_type<0){
			error('团费类型');
     		return ;
		}
		let data = this.state.data;
		let row = data['row'];
		if(!row['num_of_people']&&row['num_of_people']<=0){
			error('请填写人数');
			return;
		}
		let price_type_config = this.state['group_price_config'][price_type];


		data['参团费用'][index]= {'price_type':price_type_config.price_type,'price_type_comment':price_type_config.price_type_comment
							 ,'unit_price':price_type_config.peer_price,'num_of_people':row['num_of_people']};
		data['row'] = {};
		this.setState({isEdit:false});
		this.setState({EditBlock:''});
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
		let acc_item = {'参团费用':this.state.data['参团费用'],'其他费用':this.state.data['其他费用']};

        let data = this.pre_view.state.data;
        let settleable = 0;
        this.state.data['参团费用'].forEach(function(item){
        	settleable += +(item.unit_price * item.num_of_people);
        });
        this.state.data['其他费用'].forEach(function(item){
        	settleable += +(item.unit_price * item.num_of_people);
        });

		data['订单应转'][0] = {acc_item:acc_item,settleable:settleable,settled:data['订单应转'][0]['settled'],settle_diff:(settleable - data['订单应转'][0]['settled'])
								,'settle_obj_id':data['订单应转'][0]['settle_obj_id']};

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
						!this.state.block_hide[block] &&
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
								{/* 改成函数 */}
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

				{/* 弹窗 */}
				{
					this.state.isAdd && this.state.AddBlock && this.state.AddBlock !== '参团费用' &&
					<div>
					 {addRowDialog(this,this.state.block_cfg[this.state.AddBlock],this.state.isAdd,this.state.AddBlock)}
					</div>
				}
				{
					this.state.isAdd && this.state.AddBlock && this.state.AddBlock == '参团费用' &&
					<Dialog
	                isOpen={this.state.isAdd}
	                isCancelable={true}
	                onCancel={_=>this.CancelAddRow(this.state.AddBlock)}>
      				<div className="zs-popup" style={{maxHeight: ''}}>
			        	<div className="zs-popup-info">
							<div className="order-set-detail-modal-over">
				    		{
								this.state.price_config.map( (item,i)=>  
									(<div key={item} className={ ( i === this.state.price_type ?"active-order-set-detail-modal-cell":"")+" order-set-detail-modal-cell"}>
										{item.map(cell=>
											<div onClick={_=>this.selectPriceType(i)} 
											className="order-set-detail-modal-cell-item"> {cell} </div>
										)}
									</div>)
			    				)
				    		}
		    				</div>
							<div className="model-main-item" style={{backgroundColor: '#f9f9f9'}}>
								<span>人数:</span>
								<Input value={this.state.data['row']['num_of_people']} style={{verticalAlign: 'sub'}}
								onChange={ e=>this.setNewValue(e.target.value,'num_of_people') } type='number' float></Input>
							</div>
			        	</div>
						<br />
			       		<div className="zs-popup-btn">
		            	  <span onClick={_=>this.addGroupFeeDone()}>确定</span>
		            	</div>
        			</div>
   				 	</Dialog>
				}
				{
					this.state.isEdit && this.state.EditBlock && this.state.EditBlock !== '参团费用' &&
					<div>
					 {editRowDialog(this,this.state.block_cfg[this.state.EditBlock],this.state.isEdit,this.state.EditIndex,this.state.EditBlock)}
					</div>
				}
				{
					this.state.isEdit && this.state.EditBlock && this.state.EditBlock == '参团费用' &&
					<div>
					<Dialog
	                isOpen={this.state.isEdit}
	                isCancelable={true}
	                onCancel={_=>this.CancelAddRow(this.state.EditBlock)}>
      				<div className="zs-popup">
			        	<div className="zs-popup-info">
							<div className="order-set-detail-modal-over">
				    		{
								this.state.price_config.map( (item,i)=>  
								(<div key={i} className="order-set-detail-modal-cell">
									{item.map(cell=>
										<div className="order-set-detail-modal-cell-item"
										onClick={_=>this.selectPriceType(item[i])} > {cell} </div>
									)}
								</div>)
								)
				    		}
		    				</div>
							<div className="model-main-item" style={{backgroundColor: '#f9f9f9'}}>
		    					<span>人数:</span>
								<Input value={this.state.data['row']['num_of_people']} style={{verticalAlign: 'sub'}}
								onChange={ e=>this.setNewValue(e.target.value,'num_of_people') } type='number' float></Input>
							</div>
			        	</div><br />
		            	<div className="zs-popup-btn">
		            	  <span onClick={_=>this.EditGroupFeeDone(this.state.EditIndex)}>确定</span>
		            	</div>
        			</div>
   				 	</Dialog>
					</div>
				}
			</Page>
		);
	}
}

export default connect(s=>({s:s}))(OrderSettleableDetail)
