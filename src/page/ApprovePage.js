import React, { Component,Fragment } from 'react';

import {Page} from 'react-onsenui';

import {AppCore,resetTo,loadMore,loadIfEmpty,i18n,goTo,reload,goBack} from '../util/core';
import {pullHook,loginToPlay,Search,nonBlockLoading} from '../util/com';
import { connect } from 'react-redux';

class ApprovePage extends Component{

	constructor(props) {
		super(props);
		
	    this.state = {state:'initial',data:[],search:{title:''}};
		this.mod = '审批任务';
		//this.docArr = [ '业务借款单','业务内转单','业务退款单','业务支出单','资金借款单','资金内转单','资金退款单','资金支出单',]
		AppCore.ApprovePage = this;
	}


	componentDidMount() {
	}

	is_approvable(task){
    	let actions = ['资金收款审批','业务借款审批','业务支出审批','业务内转审批','退业务收款审批','业务退回审批','工资审批','扣款审批',
					   '业务收款审批','资金借款审批','资金支出审批','资金内转审批','退资金收款审批','资金退回审批','还款审批','调整审批'];
    	if(actions.indexOf(task.action) === -1){
    		return false;
    	}

    	return true;
	}

    approve(task){
		let actions = ['资金收款审批','业务借款审批','业务支出审批','业务内转审批','退业务收款审批','业务退回审批','工资审批','扣款审批',
					   '业务收款审批','资金借款审批','资金支出审批','资金内转审批','退资金收款审批','资金退回审批','还款审批','调整审批'];
    	if(actions.indexOf(task.action) === -1){
    		return;
    	}
    	goTo('单据审批页',{data:{id:task.assoc_id},action:task.action,pre_view:this});

	}



	renderToolbar(){
		let search_cfg = { 
			key: 'Approve',
			options:[
				{text: '单据编号', search: 'title'},
				{text: '团号', search: 'group_id'},
				{text: '供应商', search: 'pd_provider'}
			],
			cb: (value, key) => {
				let search = this.state.search
				search['title'] = ''
				search['group_id'] = ''
				search['pd_provider'] = ''
				search[key] = value
				this.setState({search:search});
				reload(this)
			}	
		}
		return <Search  value={this.state.search.title || this.state.search.group_id || this.state.search.pd_provider} 
						clear={e=>{e.stopPropagation();this.setState({search:{ limit: 10, mod: this.mod, title: "",group_id:'',pd_provider:'' }},_=>reload(this))}} 
						param={search_cfg} />
	}

	render(){
		return (
			<Page renderToolbar={_=>this.renderToolbar()} 
			onInfiniteScroll={done=>loadMore(this,done)} onShow={_=>loadIfEmpty(this)}>
		    {
		    	this.props.s.user.sid && 
	    		<Fragment>
	    			{
	    				!this.state.loading && pullHook(this)
	    			}
					<div className="model-box-bald" style={{margin: '.32rem 0'}}>
						
						<div className="model-box-bald-main-msg">
						{this.state.data.map((task,i) =>
						  	<div className="model-box-bald-main-msg-item" key={task.id}  onClick={_=>this.approve(task)}>
						  		<div className="model-box-bald-main-msg-item-left">
								  <span>发布人: {task.publisher_name}</span> &nbsp;&nbsp;&nbsp; <span>{task.create_at}</span>
								  <div>标题: {i18n.pick(task.title)}</div>
						 		 </div>
						  		<div className="model-box-bald-main-msg-item-right">
								  <span className={this.is_approvable(task) ? "":"lose"}>审批</span>
						  		</div>
					  		</div>
					    )}
						</div>
					</div>
				  	{
				  		this.state.loading && nonBlockLoading()
				  	}
				</Fragment>
		    }
		    {
		  		!this.props.s.user.sid && loginToPlay()
		    }

		    </Page>
		);
	}
}

export default connect(s=>({s:s}))(ApprovePage)

