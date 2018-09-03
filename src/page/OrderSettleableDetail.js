import React, { Component} from 'react';
import {log,AppCore,AppMeta,loadIfEmpty,goTo,Enum,goBack,sumbitCheck} from '../util/core';
import {error,nonBlockLoading,progress,footer,ProInfo} from '../util/com';
import { connect } from 'react-redux';

import {Page,Button,Input,Dialog,Icon,Select} from 'react-onsenui';
import {addRowDialog,editRowDialog} from '../util/order'


class OrderSettleableDetail extends Component{

	constructor(props) {
		super(props);
		
		this.action = props.p.action;
		this.pre_view = this.props.p.view;
		let state  = {isAddRow:false,isEditRow:false,isAddOther:false,data:{row:{}},block_cfg:{}};
		let cfg = AppMeta.actions[this.action];
		cfg.block.forEach(function(block){
			state.data[block] = props.p.data[block]?props.p.data[block]:[];
			state.block_cfg[block] = AppMeta.blocks[block];
		});
		state['block_hide'] = {'自动优惠':1,'手动优惠':1,'人数金额总计':1};
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

		state['err_msg'] = false
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
	reduceRow(e,block,i){
		e.stopPropagation();
		let data = this.state.data;
		if(data[block].length>= (i+1)){
			data[block].splice(i,1);
		}	
		this.setState({data:data});
	}
	addRow(block){
		let data = this.state.data;
		data['row'] = {};
		// for(var field in this.state.block_cfg[block].list){
		// 	data['row'][field] = '';
		// }
		data['row'].comment = "";
		data['row'].num_of_people = '';
		data['row'].settle_item_id = "";
		data['row'].total = 0;
		data['row'].unit_price = '';
		data['row'].price_type = "";
		data['row'].price_type_comment = "";
		if(block === '参团费用'){
			this.setState({isAdd:true});
		}else if(block === '其他费用'){
			this.setState({isAddOther:true});
		}
		this.setState({AddBlock:block});
		this.setState({data:data});
	}
	addRowOther(block){
		let data = this.state.data;
		data['row'] = {};
		// for(var field in this.state.block_cfg[block].list){
		// 	data['row'][field] = '';
		// }
		data['row'].comment = "";
		data['row'].num_of_people = '';
		data['row'].settle_item_id = "";
		data['row'].total = 0;
		data['row'].unit_price = '';
		data['row'].price_type_comment = "";
		if(block === '参团费用'){
			this.setState({isAdd:true});
		}else if(block === '其他费用'){
			this.setState({isAddOther:true});
		}
		this.setState({AddBlock:block});
		this.setState({data:data});
	}
	selectPriceType(k){
		this.setState({price_type:k});
	}
	addGroupFeeDone(){
		let price_type = this.state.price_type;
		if(price_type<0){
			this.setState({err_msg: true, err_text: '请选择价格类型'})
     		return ;
		}
		let data = this.state.data;
		let row = data['row'];
		if(!row['num_of_people']&&row['num_of_people']<=0){
			this.setState({ err_msg: true, err_text: '请填写人数' })
			return;
		}
		
		let price_type_config = this.state['group_price_config'][price_type];
		let total = row['num_of_people'] * price_type_config.peer_price;
		data['参团费用'].push({'price_type':price_type_config.price_type,'price_type_comment':price_type_config.comment
							 ,'unit_price':price_type_config.peer_price,'num_of_people': row['num_of_people'],'total':total});
		data['row'] = {};
		this.setState({isAdd:false});
		this.setState({AddBlock:''});
		this.setState({data:data});
	}

	addRowDone(block){
		let data = this.state.data;
		let row = data['row'];
		if(!row.settle_item_id){
			this.setState({err_msg: true, err_text: '请选择结算项目'})
			return
		}
		row['total'] = row.unit_price * row.num_of_people

		data[block].push(row);

		data['row'] = {};
		this.setState({price_type:-1});
		this.setState({isAddOther:false});
		this.setState({AddBlock:''});
		this.setState({data:data});
	}
	CancelAddRow(block){
		let data = this.state.data;
		data['row'] = {};

		for(var field in this.state.block_cfg[block].list){
			data['row'][field] = '';
		}
		if(block === '参团费用'){
			this.setState({isAdd:false});
		}else if(block === '其他费用'){
			this.setState({isAddOther:false});
		}
		this.setState({AddBlock:'',err_msg: false});
		this.setState({data:data});
	}
	editRow(item,i,block){
		let data = this.state.data;
		data['row'] = {};

		data['row'].comment = item.comment;
		data['row'].num_of_people = item.num_of_people;
		data['row'].price_type = item.price_type;
		data['row'].price_type_comment = item.price_type_comment;
		data['row'].settle_item_id = item.settle_item_id;
		data['row'].total = item.total;
		data['row'].unit_price = item.unit_price;

		if(block == '参团费用'){
			let price_type = -1;
			let group_price_config = this.state['group_price_config'];
			group_price_config.forEach(function(config, index){
				if(data['row']['price_type'] == config['price_type'] 
					&& data['row']['unit_price'] == config['peer_price']
					&& data['row']['price_type_comment'] == config['comment']){
					price_type = index;
				}
			});

			this.setState({'price_type':price_type});
		}

		this.setState({isEdit:true});
		this.setState({EditBlock:block});
		this.setState({EditIndex:i});
		this.setState({data:data});
	}

	editField(field,value){
		let data = this.state.data;
		if(field === 'price_type'){
			this.setState({price_type: value});
			if (value >= 0){
				let price_type_config = this.state.group_price_config[value];
				console.log(price_type_config)
				data['row']['price_type'] = value;
				data['row']['price_type_comment'] = price_type_config['comment'] || '';
				data['row']['unit_price'] = price_type_config['peer_price'];
				data['row']['total'] = data['row']['unit_price'] * (data['row']['num_of_people'] || 0);
			}else{
				data['row']['total'] =  0;
				data['row']['price_type_comment'] = ''
			}
		}else{
			data['row'][field] = value;
		}

		this.setState({data:data})
	}

	EditGroupFeeDone(index){
		let price_type = this.state.price_type;
		if (price_type < 0){
			this.setState({err_msg: true,err_text: '请填写价格类型'})
     		return ;
		}
		let data = this.state.data;
		let row = data['row'];
		if(!row['num_of_people']&&row['num_of_people']<=0){
			this.setState({ err_msg: true, err_text: '请填写人数' })
			return;
		}
		let price_type_config = this.state['group_price_config'][price_type];

		let total = row['num_of_people'] * price_type_config.peer_price;
		data['参团费用'][index] = {
			'price_type':price_type_config.price_type,
			'price_type_comment':price_type_config.comment,
			'unit_price':price_type_config.peer_price,
			'num_of_people':row['num_of_people'],
			'total':total
		};
		data['row'] = {};
		this.setState({isEdit:false});
		this.setState({EditBlock:''});
		this.setState({data:data});
	}


	EditRowDone(index){
		let data = this.state.data;
		if(!data['row'].settle_item_id){
			this.setState({ err_msg: true, err_text: '请选择结算项目' })
			return
		}

		data['其他费用'][index].num_of_people = data['row'].num_of_people || '';
		data['其他费用'][index].settle_item_id = data['row'].settle_item_id || '';
		data['其他费用'][index].price_type_comment = data['row'].price_type_comment || '';
		data['其他费用'][index].total = (data['row'].unit_price * data['row'].num_of_people) || '';
		data['其他费用'][index].unit_price = data['row'].unit_price || '';
		
		data['row'] = {};
		this.setState({isEdit:false});
		this.setState({EditBlock:''});
		this.setState({data:data});
	}
	CancelEditRow(block){
		let data = this.state.data;
		data['row'] = {};
		this.setState({isEdit:false,err_msg: false});
		this.setState({EditBlock:''});
		this.setState({data:data});
	}

	setNewValue(value,key){

		let data = this.state.data;

		data['row'][key] = value;
		this.setState({data:data});
	}

	submit(){
		let rq_field = sumbitCheck(this,AppMeta.actions[this.action]);
		if(rq_field){
            error('缺少'+rq_field);
            return;
		}
		let acc_item = {'参团费用':this.state.data['参团费用'],'其他费用':this.state.data['其他费用']};

        let data = this.pre_view.state.data;
        let settleable = 0;
        this.state.data['参团费用'].forEach(function(item){
        	settleable += +(item.unit_price * item.num_of_people);
        });
        this.state.data['其他费用'].forEach(function(item){
			item.total = item.unit_price * item.num_of_people;
        	settleable += +(item.unit_price * item.num_of_people);
		});

		data['订单应转'][0] = data['订单应转'][0] || {};
		data['订单应转'][0]['acc_item'] = acc_item;
		data['订单应转'][0]['settled'] = data['订单应转'][0]['settled'] || 0;
		data['订单应转'][0]['settle_diff'] = settleable - data['订单应转'][0]['settled'];
		data['订单应转'][0]['settle_obj_id'] = data['订单应转'][0]['settle_obj_id'];

		let receivable =(data['订单应收']&&data['订单应收'].length>0)?data['订单应收'][0]['receivable']:0;
		let profit = Math.round((receivable - settleable)*100)/100;
		let profit_rate = (receivable == 0) ?'NaN':(Math.round((profit/receivable)*10000)/100+'%');
		data['订单利润'] = [{'receivable':receivable,'settleable':settleable,'profit':profit,'profit_rate':profit_rate}];
		
		this.pre_view.setState({data:data});
		goBack();
	}

	// 改成函数
	cellFun(item,i,block,field){
		let title = this.state.block_cfg[block]['list'][field]
		let value = Enum[this.state.block_cfg[block]['list'][field]['type']]
		if( !(title['type'] && value) ) return;
		return(
			<span className="money-care-books-main-item-col-5" key={field+i}>{value[item[field]]}</span>
		)
	}
	cellFun1(item,i,block,field){
		let title = this.state.block_cfg[block]['list'][field]
		let value = Enum[this.state.block_cfg[block]['list'][field]['type']]
		if( title['type'] && value ) return;
		if(field === 'price_type_comment'){
			return;
		}
		return(
			<span className="money-care-books-main-item-col-5" key={field+i}>
				{field === 'total'?(item.unit_price*item.num_of_people):[item[field]]}
			</span>
		)
	}


	render(){
		return (
				<Page 
				renderToolbar={_=>this.renderToolbar()} 
				>
				{this.state.data && this.props.p.view.state.data['订单团队'] && 
					<ProInfo pro_info={this.props.p.view.state.data['订单团队'][0]} />
				}
				{/* 参团费用 */}
				{
					<div className="model-box" >
						<div className="box-title">
							<div className="box-title-text">参团费用: &nbsp;&nbsp; {this.state.data['参团费用'].reduce( (total,cell)=>{return total + cell.num_of_people*cell.unit_price},0)}</div>
							<div className="box-title-operate">
								<div className="box-title-operate-item" style={{width: '.64rem',border:'none'}}>
								<Icon icon="md-plus-circle-o" style={{fontSize: '.64rem', color: '#6FC5D8'}}
								onClick={() => this.addRow('参团费用')}/></div>
							</div>
						</div>
						<div className="money-care-books-box" style={{margin:'0'}} >
							<div className="money-care-books-title" style={{padding: '0 .32rem'}}>
								<span className="money-care-books-title-item-5">结算项目</span>
                        		<span className="money-care-books-title-item-5">单价</span>
                        		<span className="money-care-books-title-item-5">人数</span>
                        		<span className="money-care-books-title-item-5">合计</span>
                        		<span className="money-care-books-title-item-5">操作</span>
							</div>
							<div className="money-care-books-main">
								{this.state.data['参团费用'].map( (item,i) => 
								<div className="money-care-books-main-item" key={i} style={{padding: '0 .32rem'}}
								onClick={_=>this.editRow(item,i,'参团费用')}>
									<span className="money-care-books-main-item-col-5">{item.price_type}</span>
									<span className="money-care-books-main-item-col-5">{item.unit_price}</span>
									<span className="money-care-books-main-item-col-5">{item.num_of_people}</span>
									<span className="money-care-books-main-item-col-5">{item.total}</span>
									<Icon icon="md-minus-circle-outline" className='last-icon-ctrl'
									onClick={e=>this.reduceRow(e,'参团费用',i)} />
								</div>
								)}
							</div>
						</div>
					</div>
				}
				{/* 其他费用 */}
				{
					<div className="model-box" >
						<div className="box-title">
							<div className="box-title-text">其他费用: &nbsp;&nbsp; {this.state.data['其他费用'].reduce( (total,cell)=>{return total + cell.num_of_people*cell.unit_price},0)}</div>
							<div className="box-title-operate">
								<div className="box-title-operate-item" style={{width: '.64rem',border:'none'}}>
								<Icon icon="md-plus-circle-o" style={{fontSize: '.64rem', color: '#6FC5D8'}}
								onClick={() => this.addRowOther('其他费用')}/></div>
							</div>
						</div>
						<div className="money-care-books-box" style={{margin:'0'}}>
							<div className="money-care-books-title" style={{padding: '0 .32rem'}}>
								<span className="money-care-books-title-item-5">结算项目</span>
                        		<span className="money-care-books-title-item-5">单价</span>
                        		<span className="money-care-books-title-item-5">人数</span>
                        		<span className="money-care-books-title-item-5">合计</span>
                        		<span className="money-care-books-title-item-5">操作</span>
							</div>
							<div className="money-care-books-main">
								{this.state.data['其他费用'].map( (item,i) => 
								<div className="money-care-books-main-item" key={i} style={{padding: '0 .32rem'}}
								onClick={_=>this.editRow(item,i,'其他费用')}>
									<span className="money-care-books-main-item-col-5">{Enum['SettleItem'][item.settle_item_id]}</span>
									<span className="money-care-books-main-item-col-5">{item.unit_price}</span>
									<span className="money-care-books-main-item-col-5">{item.num_of_people}</span>
									<span className="money-care-books-main-item-col-5">{item.total}</span>
									<Icon icon="md-minus-circle-outline" className='last-icon-ctrl'
									onClick={e=>this.reduceRow(e,'其他费用',i)} />
									{/* {
										Object.keys(this.state.block_cfg[block].list).map(field => this.cellFun(item,i,block,field))
									}{
										Object.keys(this.state.block_cfg[block].list).map(field => {
											let isShow = false;
											if(block === '其他费用' || block === '其他费用'){
												isShow = true;
											}
											return(
											<Icon icon="md-minus-circle-outline" className={ isShow ?'last-icon-ctrl':'hide'}
											onClick={e=>this.reduceRow(e,block,i)} key={field+1} />)
										})
									}
									{
										Object.keys(this.state.block_cfg[block].list).map(field => this.cellFun1(item,i,block,field))
									} */}
								</div>
								)}
							</div>
						</div>
					</div>
				}
				{/* 底部 footer */}
				<div className="add-cstm-btn">
					<div className="add-cstm-btn-cancel"
					onClick={_=>goBack()}>取消</div>
					<div className="add-cstm-btn-submit"
					onClick={_=>this.submit()}>确定</div>
				</div>

	{/* ====================================== 其他费用 添加 dialog==================================== */}
				{
					<Dialog
    				isOpen={this.state.isAddOther}
    				isCancelable={true}
    				onCancel={this.CancelAddRow.bind(this,'其他费用')}>
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
    				        	  <input className="order-receivable-modal-info-item-right" value={this.state.data['row']?this.state.data['row'].price_type_comment:''} 
    				        	  onChange={ e => this.setNewValue(e.target.value,'price_type_comment')} type='text' placeholder='请输入备注' />   
    				        	</div>
    				        </div>
    				        <div className="order-receivable-modal-btn">
    				          <span className="order-receivable-modal-btn-cancel" onClick={_=>this.CancelAddRow('其他费用')}>取消</span>
    				          <span className="order-receivable-modal-btn-submit" onClick={_=>this.addRowDone('其他费用')}>确定</span>
    				        </div>
							{this.state.err_msg &&
							<div className="dialog-err-msg">
								<div className="dialog-err-msg-title">错误提示</div>
								<div className="dialog-err-msg-text">{this.state.err_text}</div>
								<div className="dialog-err-msg-btn" onClick={_ => this.setState({ err_msg: false })}>确定</div>
							</div>
							}
    				    </div>
    				</Dialog>
				}
	{/* ======================================参团费用 添加 dialog==================================== */}
				{
					this.state.isAdd && this.state.AddBlock && this.state.AddBlock == '参团费用' &&
					<Dialog
	                isOpen={this.state.isAdd}
	                isCancelable={true}
	                onCancel={_=>this.CancelAddRow('参团费用')}>
      				<div className="order-receivable-modal" style={{maxHeight: ''}} >
			        	<div className="order-receivable-modal-info">
                			<div className="order-receivable-modal-info-item" style={{borderTop: '1px solid #f1f1f1'}}>
                			    <span className="order-receivable-modal-info-item-left">价格类型:</span>
                			    <select className="order-receivable-modal-info-item-right-select"
                			     onChange={e => this.editField('price_type',e.target.value)} >
                			      <option value = {-1}>请选择</option>
                			      {
                			        this.state.group_price_config.map( (item,i) => 
                			          <option  key = {i} value = {i}>{(item.price_type) + "  ￥" + (item.peer_price)}</option>
                			        )
                			      }
                			    </select>  
								<Icon icon="md-caret-down" style={{fontSize:'20px'}} />     
		    				</div>
							<div className="order-receivable-modal-info-item">
								<span className="order-receivable-modal-info-item-left">人数: </span>
								{/* <Input value={ this.state.num_people >= 0 ? this.state.num_people : 0 } style={{verticalAlign: 'sub'}} */}
								<input value={ this.state.data.row.num_of_people >= 0 ? this.state.data.row.num_of_people : 0 } style={{verticalAlign: 'sub'}}
								className="order-receivable-modal-info-item-right" placeholder="请输入人数"
								onChange={ e=>this.editField('num_of_people',e.target.value)} type='number'  />
							</div>
							<div className="order-receivable-modal-info-item">
								<span className="order-receivable-modal-info-item-left">合计: </span>
								<span className="order-receivable-modal-info-item-right">
									￥{ (this.state.data.row.unit_price||0) *(this.state.data.row.num_of_people || 0 )} 
								</span>
							</div>
							<div className="order-receivable-modal-info-item" style={{height: 'auto'}}>
								<span className="order-receivable-modal-info-item-left">备注: </span>
								<span className="order-receivable-modal-info-item-right order-receivable-modal-info-note">
									{ this.state.data.row.price_type_comment ? this.state.data.row.price_type_comment:''} 
								</span>
							</div>
			        	</div>
						<div className="order-receivable-modal-btn">
              				<div className="order-receivable-modal-btn-cancel" 
              				onClick={_=>this.setState({isAdd: false})}>取消</div>
              				<div className="order-receivable-modal-btn-submit" 
              				onClick={_=>this.addGroupFeeDone()}>确定</div>
            			</div>
						{this.state.err_msg &&
						<div className="dialog-err-msg">
							<div className="dialog-err-msg-title">错误提示</div>
							<div className="dialog-err-msg-text">{this.state.err_text}</div>
							<div className="dialog-err-msg-btn" onClick={_ => this.setState({ err_msg: false })}>确定</div>
						</div>
						}
        			</div>
   				 	</Dialog>
				}
	{/* ======================================其他费用 更改 dialog==================================== */}

			{this.state.isEdit && this.state.EditBlock && this.state.EditBlock == '其他费用' &&
				<Dialog
    			isOpen={this.state.isEdit}
    			isCancelable={true}
    			onCancel={_=>this.CancelEditRow('其他费用')}>
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
							  value={ this.state.data.row.price_type_comment ? this.state.data.row.price_type_comment : '' }
							  onChange={ e => this.setNewValue(e.target.value,'price_type_comment')} type='text' />
    			        	</div>
    			        </div>
    			        <div className="order-receivable-modal-btn">
    			          <div className="order-receivable-modal-btn-cancel" 
    			          onClick={_=>this.CancelEditRow('其他费用')}>取消</div>
    			          <div className="order-receivable-modal-btn-submit" 
    			          onClick={_=>this.EditRowDone(this.state.EditIndex)}>确定</div>
    			        </div>
						{this.state.err_msg &&
						<div className="dialog-err-msg">
							<div className="dialog-err-msg-title">错误提示</div>
							<div className="dialog-err-msg-text">{this.state.err_text}</div>
							<div className="dialog-err-msg-btn" onClick={_ => this.setState({ err_msg: false })}>确定</div>
						</div>
						}
    			    </div>
    			</Dialog>
				}
	{/* ======================================参团费用 更改 dialog==================================== */}
				{
					this.state.isEdit && this.state.EditBlock && this.state.EditBlock == '参团费用' &&
					<div>
					<Dialog
	                isOpen={this.state.isEdit}
	                isCancelable={true}
	                onCancel={_=>this.CancelEditRow(this.state.EditBlock)}>
      				<div className="order-receivable-modal" style={{maxHeight: ''}}>
			        	<div className="order-receivable-modal-info">
                			<div className="order-receivable-modal-info-item" style={{borderTop: '1px solid #f1f1f1'}}>
                			    <span className="order-receivable-modal-info-item-left">价格类型:</span>
                			    <select className="order-receivable-modal-info-item-right-select"
                			     onChange={e => this.editField('price_type', e.target.value)} value = {this.state.price_type}>
                			      <option value = {-1}>请选择</option>
                			      {
                			        this.state.group_price_config.map( (item,i) => 
                			          <option  key = {i} value = {i} selected={this.state.data.row.cur_type-0 === i}
									  >{(item.price_type) + "  ￥" + (item.peer_price)}</option>
                			        )
                			      }
                			    </select>
								<Icon icon="md-caret-down" style={{fontSize:'20px'}} />      
		    				</div>
							<div className="order-receivable-modal-info-item">
								<span className="order-receivable-modal-info-item-left">人数: </span>
								<Input value={ this.state.data.row.num_of_people > 0 ? this.state.data.row.num_of_people : 0 } style={{verticalAlign: 'sub'}}
								className="order-receivable-modal-info-item-right" 
								onChange={ e=>this.editField('num_of_people',e.target.value)} type='number' float></Input>
							</div>
							<div className="order-receivable-modal-info-item">
								<span className="order-receivable-modal-info-item-left">合计: </span>
								<span className="order-receivable-modal-info-item-right">
									￥{ (this.state.data.row.unit_price||0) *(this.state.data.row.num_of_people || 0 )} 
								</span>
							</div>
							<div className="order-receivable-modal-info-item" style={{height: 'auto'}}>
								<span className="order-receivable-modal-info-item-left">备注: </span>
								<span className="order-receivable-modal-info-item-right order-receivable-modal-info-note">
									{ this.state.data.row.price_type_comment ? this.state.data.row.price_type_comment:''} 
								</span>
							</div>
			        	</div>
						<div className="order-receivable-modal-btn">
              				<div className="order-receivable-modal-btn-cancel" 
              				onClick={_=>this.setState({isEdit: false})}>取消</div>
              				<div className="order-receivable-modal-btn-submit" 
              				onClick={_=>this.EditGroupFeeDone(this.state.EditIndex)}>确定</div>
            			</div>
						{this.state.err_msg  &&
						<div className="dialog-err-msg">
							<div className="dialog-err-msg-title">错误提示</div>
							<div className="dialog-err-msg-text">{this.state.err_text}</div>
							<div className="dialog-err-msg-btn" onClick={_=>this.setState({err_msg: false})}>确定</div>
						</div>
						}
        			</div>
   				 	</Dialog>
					</div>
				}
			</Page>
		);
	}
}

export default connect(s=>({s:s}))(OrderSettleableDetail)
