import React, { Component } from 'react';

import {Page} from 'react-onsenui';

import {AppCore,resetTo,loadPage} from '../util/core';
import {pullHook,loginToPlay} from '../util/com';
import { connect } from 'react-redux';

class ApprovePage extends Component{

	constructor(props) {
	    super(props);
	    this.state = {state:'initial',pageList:[]};
	    this.url = '/comm/MsgFlow/read?';
	    this.mod = '审批任务';
	}

	componentDidMount() {

	}

	renderToolbar(){
		return (
		  	<ons-toolbar>
		      <div className="center">审批任务</div>
		  	</ons-toolbar>
		);
	}

	render(){
		return (
			<Page renderToolbar={_=>this.renderToolbar()} onInfiniteScroll={done=>loadPage(this,done)}>
			{
			  	this.props.s.user.employee_id && pullHook(this)	
		    }
		    {
		    	this.props.s.user.employee_id && 
		    		<div>
						<div className="input-box">
						    <ons-search-input style={{width:'100%'}}
						      placeholder="Search"
						      onchange="ons.notification.alert('Searched for: ' + this.value)"
						    ></ons-search-input>
						</div>
						<ons-list>
						    {this.state.pageList.map(task =>
						      <ons-list-item key={task.id}>
						      	{task.title}
						      </ons-list-item>
						    )}
					    </ons-list>
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

