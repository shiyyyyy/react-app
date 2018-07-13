import React, { Component } from 'react';

import {Page} from 'react-onsenui';

import {AppCore,resetTo,loadMore,loadIfEmpty,i18n,goTo} from '../util/core';
import {pullHook,loginToPlay,search} from '../util/com';
import { connect } from 'react-redux';

class ApprovePage extends Component{

	constructor(props) {
	    super(props);
	    this.state = {state:'initial',data:[]};
		this.mod = '审批任务';

		this.docArr = [ '业务借款单','业务内转单','业务退款单','业务支出单','资金借款单','资金内转单','资金退款单','资金支出单',]
	}

	componentDidMount() {

	}

    approve(task){
    	switch(task.action){
    		case '资金借款审批':
    			goTo('资金借款单',{data:{id:task.assoc_id}});
				break;
			// case '业务借款单':
    		// 	goTo('业务借款单',{data:{id:task.assoc_id}});
			// 	break;
			// case '业务内转单':
    		// 	goTo('业务内转单',{data:{id:task.assoc_id}});
			// 	break;
			// case '业务退款单':
    		// 	goTo('业务退款单',{data:{id:task.assoc_id}});
			// 	break;
			// case '业务支出单':
    		// 	goTo('业务支出单',{data:{id:task.assoc_id}});
			// 	break;
			// case '资金内转单':
    		// 	goTo('资金内转单',{data:{id:task.assoc_id}});
			// 	break;
			// case '资金退款单':
    		// 	goTo('资金退款单',{data:{id:task.assoc_id}});
			// 	break;
			// case '资金支出单':
    		// 	goTo('资金支出单',{data:{id:task.assoc_id}});
    		// 	break;

    	}
    }

	render(){
		return (
			<Page renderToolbar={_=>search()} onInfiniteScroll={done=>loadMore(this,done)} onShow={_=>loadIfEmpty(this)}>
			{
			  	this.props.s.user.employee_id && pullHook(this)	
			}
		    {
		    	this.props.s.user.employee_id && 
		    		<div>
						<div className="model-box-bald" style={{margin: '.32rem 0'}}>
							
							<div className="model-box-bald-main-msg">
							{this.state.data.map((task,i) =>
							  	// <div className="model-box-bald-main-msg-item" key={task.id} onClick={_=>this.approve(task)}>
							  	<div className="model-box-bald-main-msg-item" key={task.id} onClick={_=>goTo(this.docArr[i])}>
							  		<div className="model-box-bald-main-msg-item-left">
									  <span>发布人: {task.publisher_name}</span> &nbsp;&nbsp;&nbsp; <span>{task.create_at}</span>
									  <div>标题: {i18n.pick(task.title)}</div>
							 		 </div>
							  		<div className="model-box-bald-main-msg-item-right">
									  <img src="img/msg1.png" />
							  		</div>
						  		</div>
						    )}
							</div>
						</div>
					  	{
					  		this.state.loading &&
								<div className="after-list text-center">
							      <ons-icon icon="fa-spinner" size="26px" spin></ons-icon>
							    </div>
					  	}
					</div>
		    }
		    {
		  		!this.props.s.user.employee_id && loginToPlay()
		    }
		    </Page>
		);
	}
}

export default connect(s=>({s:s}),undefined)(ApprovePage)

