import React, { Component } from 'react';

import { Popover } from 'react-onsenui';

import {updateAfterInit} from '../util/update';

export default class LogPage extends Component{
	constructor(props) {
	    super(props);
	    this.state = {
	    	open_menu:false,
	    	log:localStorage.log
	    };
	}

	updateApp(){
		updateAfterInit(true);
		this.setState({open_menu:false});
	}

	clearLog(){
		localStorage.log='';
		this.setState({open_menu:false,log:localStorage.log});
	}

	refreshLog(){
		this.setState({open_menu:false,log:localStorage.log});
	}

	render(){
		return (
			<ons-page>
			  	<ons-toolbar>
			  	  <div className='left'><ons-back-button></ons-back-button></div>
			      <div className="center">隐藏页</div>
			      <div className="right" ref="menu" >
			      	<ons-toolbar-button onClick={_=>this.setState({open_menu:true})}>功能</ons-toolbar-button>
		      	  </div>
			  	</ons-toolbar>
		        <Popover
								animation = "none"
		        	  direction="down"
		            isOpen={this.state.open_menu}
		            onCancel={_=>this.setState({open_menu:false})}
		            isCancelable={true}
		            getTarget={_=>this.refs.menu}
		        >
			      <ons-list>
			        <ons-list-item tappable onClick={_=>this.updateApp()}>
			          <div className="center">强制升级</div>
			        </ons-list-item>
			        <ons-list-item tappable onClick={_=>{}}>
			          <div className="center">自定义分享</div>
			        </ons-list-item>
			        <ons-list-item tappable onClick={_=>this.clearLog()}>
			          <div className="center">清空日志</div>
			        </ons-list-item>
			        <ons-list-item tappable onClick={_=>this.refreshLog()}>
			          <div className="center">刷新日志</div>
			        </ons-list-item>
			      </ons-list>
		        </Popover>
			  	<textarea style={{width:'100%',height:'100%'}} onChange={_=>0} value={this.state.log}>
			  		
			  	</textarea>
		  </ons-page>
		);
	}
};
