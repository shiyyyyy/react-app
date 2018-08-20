import React, { Component} from 'react';
import {log,AppCore,AppMeta,loadIfEmpty,goTo,Enum,goBack,sumbitCheck} from '../util/core';
import {error,nonBlockLoading,progress,footer,ProInfo} from '../util/com';
import { connect } from 'react-redux';

import {Page,Button,Input,Dialog,Select,Icon} from 'react-onsenui';
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
		      <div className={(AppCore.os === 'ios'?"":"Andriod-title")+" center"}>{AppMeta.actions[this.action].text}</div>
		  	</ons-toolbar>
		);
	}

	addRow(block){
		let data = this.state.data;
		data['row'] = {};

		data['row'].comment = '';
		data['row'].settle_item_id = '';
		data['row'].num_of_people = '';
		data['row'].unit_price = '';
		data['row'].total = '';

		this.setState({isAdd:true});
		this.setState({AddBlock:block});
		this.setState({data:data});
	}
	addRowDone(block){
		let data = this.state.data;
		let row = data['row'];
		row['total'] = (row.unit_price * row.num_of_people) || '';
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

	reduceRow(e,block,i){
		e.stopPropagation();
		let data = this.state.data;
		if(data[block].length>0){
			data[block].splice(i,1);
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

	EditRowDone(index){
		let data = this.state.data;

		// for(var field in this.state.block_cfg[block].list){
		// 	data[block][index][field] = data['row'][field]?data['row'][field]:'';
		// }
		data['应收明细'][index].num_of_people = data['row'].num_of_people || '';
		data['应收明细'][index].settle_item_id = data['row'].settle_item_id || '';
		data['应收明细'][index].comment = data['row'].comment || '';
		data['应收明细'][index].total = (data['row'].unit_price * data['row'].num_of_people) || '';
		data['应收明细'][index].unit_price = data['row'].unit_price || '';

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
		let rq_field = sumbitCheck(this,AppMeta.actions[this.action]);
		if(rq_field){
            error('缺少'+rq_field);
            return;
        }
		let receive_item = this.state.data['应收明细'];
		let data = this.pre_view.state.data;
		let receivable =0 ;
		receive_item.forEach(function(item){
			receivable += + (item.num_of_people * item.unit_price );
		});
		data['订单应收'][0] = {receive_item:receive_item,receivable:receivable,received:data['订单应收'][0]['received'],receive_diff:(receivable - data['订单应收'][0]['received'])};
		let settleable = (data['订单应转']&&data['订单应转'].length>0)?data['订单应转'][0]['settleable']:0;
		let profit = Math.round((receivable - settleable)*100)/100;
		let profit_rate = (receivable == 0) ?'NaN':(Math.round((profit/receivable)*10000)/100+'%');
		data['订单利润'] = [{'receivable':receivable,'settleable':settleable,'profit':profit,'profit_rate':profit_rate}];

		this.pre_view.setState({data:data});
		goBack();
	}



	render(){
		return (
			<Page 
			renderToolbar={_=>this.renderToolbar()} 
			>
				{this.state.data && this.props.p.view.state.data['订单团队'] && 
					<ProInfo pro_info={this.props.p.view.state.data['订单团队'][0]} />
				}
				{
					Object.keys(this.state.block_cfg).map(block=>
					<div className="model-box" key = {block}>
						<div className="box-title">
							<div className="box-title-text">{this.state.block_cfg[block].text}: &nbsp;&nbsp; {this.state.data[block].reduce( (total,cell)=>{return total + cell.num_of_people*cell.unit_price},0)}</div>
							<div className="box-title-operate">
								<div className="box-title-operate-item" style={{width: '.64rem',border:'none'}}>
								<Icon icon="md-plus-circle-o" style={{fontSize: '.64rem', color: '#6FC5D8'}}
								onClick={() => this.addRow(block)}/></div>
								{/* <div className="box-title-operate-item" style={{width: '.64rem',border:'none'}}>
								<Icon icon="md-minus-circle-outline" style={{fontSize: '.64rem', color: '#EE8585'}}
								onClick={() => this.reduceRow(block)}/></div> */}
							</div>
						</div>
						<div className="money-care-books-box" style={{margin:'0'}}>
							<div className="money-care-books-title"  style={{padding: '0 .32rem'}}>
								<span className="money-care-books-title-item-5">结算项目</span>
                        		<span className="money-care-books-title-item-5">人数</span>
                        		<span className="money-care-books-title-item-5">单价</span>
                        		<span className="money-care-books-title-item-5">合计</span>
                        		<span className="money-care-books-title-item-5">操作</span>
							</div>
							<div className="money-care-books-main">
								{this.state.data['应收明细'].map( (item,i) => 
								<div className="money-care-books-main-item" key={i} style={{padding: '0 .32rem'}}
								onClick={_=>this.editRow(item,i,'应收明细')}>
									<span className="money-care-books-main-item-col-5">{Enum['SettleItem'][item.settle_item_id]}</span>
									<span className="money-care-books-main-item-col-5">{item.num_of_people}</span>
									<span className="money-care-books-main-item-col-5">{item.unit_price}</span>
									<span className="money-care-books-main-item-col-5">{item.total}</span>
									<Icon icon="md-minus-circle-outline" className='last-icon-ctrl'
									onClick={e=>this.reduceRow(e,'应收明细',i)} />
								</div>
								)}
							</div>
							{/* <div className="money-care-books-main">
							{this.state.data[block].map( (item,i) => 
								<div className="money-care-books-main-item" key={i} style={{padding: '0 .32rem'}}
								onClick={_=>this.editRow(item,i,block)}>
									{
										Object.keys(this.state.block_cfg[block].list).map(field => 
											(this.state.block_cfg[block]['list'][field]['type'] && Enum[this.state.block_cfg[block]['list'][field]['type']])&&
											<span className="money-care-books-main-item-col-5" key={field+i}>
											{Enum[this.state.block_cfg[block]['list'][field]['type']][item[field]]}</span>
											)
									}
									{
										Object.keys(this.state.block_cfg[block].list).map(field => 
											!(this.state.block_cfg[block]['list'][field]['type'] && Enum[this.state.block_cfg[block]['list'][field]['type']])&&
											<span className="money-care-books-main-item-col-5" key={field+i}>
											{field === 'total'?(item.unit_price*item.num_of_people):
											(field === 'comment'?'':[item[field]])}
												<Icon icon="md-minus-circle-outline" className={field === 'comment'?'':'hide'}
												style={{fontSize: '0.64rem', color: 'rgb(238, 133, 133)'}} 
												onClick={e=>this.reduceRow(e,block,i)}/>
											</span>
											)
									}
								</div>
							)}
							</div> */}
						</div>
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
				{/* {
					this.state.isAdd && this.state.AddBlock &&
					<div>
					 {addRowDialog(this.state.data['row'],this.state.block_cfg[this.state.AddBlock],this.state.isAdd,this.state.AddBlock,this.CancelAddRow.bind(this),this.setNewValue.bind(this),this.addRowDone.bind(this))}
					</div>
				} */}
				{/* ====================================== 应收明细 添加 dialog==================================== */}
				{
					<Dialog
    				isOpen={this.state.isAdd}
    				isCancelable={true}
    				onCancel={this.CancelAddRow.bind(this,'应收明细')}>
    				  <div className="order-receivable-modal">
    				      {/* <div className="zs-popup-avatar">
    				        <img src="img/avatar.png" />
    				      </div><br /> */}
    				      <div className="order-receivable-modal-info">
						  		<div className="order-receivable-modal-info-item">
								  <span className="order-receivable-modal-info-item-left">结算项目:</span>
                    			  <select className="order-receivable-modal-info-item-right-select" style={{flex:'none'}}
                    			  onChange={e => this.setNewValue(e.target.value,'settle_item_id')} value = {this.state.data.row?this.state.data.row['settle_item_id']:''}>
                    			      <option value = '' >请选择</option>
                    			    {
                    			      Object.keys(Enum['SettleItem']).map( _k =>
                    			        <option  key = {_k} value = {_k}>{Enum['SettleItem'][_k]}</option>
                    			      )
                    			    }
                    			  </select>  
								  <Icon icon="md-caret-down" style={{fontSize:'20px'}} />    
    				        	</div> 
								<div className="order-receivable-modal-info-item">
    				        	  <span className="order-receivable-modal-info-item-left">单价:</span>
    				        	  <input className="order-receivable-modal-info-item-right" value={this.state.data['row']?this.state.data['row'].unit_price: ''} 
    				        	  onChange={ e => this.setNewValue(e.target.value,'unit_price')} type='number' placeholder='请输入单价' />   
    				        	</div>
								<div className="order-receivable-modal-info-item">
    				        	  <span className="order-receivable-modal-info-item-left">人数:</span>
								  <input className="order-receivable-modal-info-item-right" value={this.state.data['row']?this.state.data['row'].num_of_people:''} 
    				        	  onChange={ e => this.setNewValue(e.target.value,'num_of_people')} type='number' placeholder='请输入人数' />   
    				        	</div>
								<div className="order-receivable-modal-info-item">
    				        	  <span className="order-receivable-modal-info-item-left">备注:</span>
    				        	  <input className="order-receivable-modal-info-item-right" value={this.state.data['row']?this.state.data['row'].comment:''} 
    				        	  onChange={ e => this.setNewValue(e.target.value,'comment')} type='text' placeholder='请输入备注' />   
    				        	</div>
    				        </div>
    				        <div className="order-receivable-modal-btn">
    				          <span className="order-receivable-modal-btn-cancel" onClick={_=>this.CancelAddRow('应收明细')}>取消</span>
    				          <span className="order-receivable-modal-btn-submit" onClick={_=>this.addRowDone('应收明细')}>确定</span>
    				        </div>
    				    </div>
    				</Dialog>
				}
				{
					this.state.isEdit && this.state.EditBlock &&
					<div>
					 {editRowDialog(this.state.data['row'],this.state.block_cfg[this.state.EditBlock],this.state.isEdit,this.state.EditIndex,this.state.EditBlock,this.CancelEditRow.bind(this),this.setNewValue.bind(this),this.EditRowDone.bind(this))}
					</div>
				}
				{/* ======================================应收明细 更改 dialog==================================== */}

			{this.state.isEdit && this.state.EditBlock && this.state.EditBlock == '应收明细' &&
				<Dialog
    			isOpen={this.state.isEdit}
    			isCancelable={true}
    			onCancel={_=>this.CancelEditRow('应收明细')}>
    			  	<div className="order-receivable-modal">
    			        <div className="order-receivable-modal-info">
					  		<div className="order-receivable-modal-info-item" style={{borderTop: '1px solid #f1f1f1'}}>
                			    <span className="order-receivable-modal-info-item-left">价格类型:</span>
                			    <select className="order-receivable-modal-info-item-right-select" style={{flex:'none'}}
                    			  onChange={e => this.setNewValue(e.target.value,'settle_item_id')} value = {this.state.data.row?this.state.data.row['settle_item_id']:''}>
                    			      <option value = '' >请选择</option>
                    			    {
                    			      Object.keys(Enum['SettleItem']).map( _k =>
                    			        <option  key = {_k} value = {_k}>{Enum['SettleItem'][_k]}</option>
                    			      )
                    			    }
                    			  </select>  
								<Icon icon="md-caret-down" style={{fontSize:'20px'}} />     
		    				</div>
							<div className="order-receivable-modal-info-item">
    			        	  <span className="order-receivable-modal-info-item-left">人数:</span>
							  <input className="order-receivable-modal-info-item-right" 
							  value={ this.state.data.row.num_of_people ? this.state.data.row.num_of_people : '' }
							  onChange={ e => this.setNewValue(e.target.value,'num_of_people')}
    			        	  type='number' />
    			        	</div>
							<div className="order-receivable-modal-info-item">
    			        	  <span className="order-receivable-modal-info-item-left">单价:</span>
							  <input className="order-receivable-modal-info-item-right" 
							  value={ this.state.data.row.unit_price ? this.state.data.row.unit_price : '' } 
							  onChange={ e => this.setNewValue(e.target.value,'unit_price')} type='number' />
    			        	</div>
							<div className="order-receivable-modal-info-item">
    			        	  <span className="order-receivable-modal-info-item-left">备注:</span>
							  <input className="order-receivable-modal-info-item-right" 
							  value={ this.state.data.row.comment ? this.state.data.row.comment : '' }
							  onChange={ e => this.setNewValue(e.target.value,'comment')} type='text' />
    			        	</div>
    			        </div>
    			        <div className="order-receivable-modal-btn">
    			          <div className="order-receivable-modal-btn-cancel" 
    			          onClick={_=>this.CancelEditRow('应收明细')}>取消</div>
    			          <div className="order-receivable-modal-btn-submit" 
    			          onClick={_=>this.EditRowDone(this.state.EditIndex)}>确定</div>
    			        </div>
    			    </div>
    			</Dialog>
			}
			</Page>
		);
	}
}

export default connect(s=>({s:s}))(OrderReceivableDetail)
