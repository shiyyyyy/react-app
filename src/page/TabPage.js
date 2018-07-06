import React, { Component } from 'react';

import {clickToLog,trigger,toast} from '../util/core';

import {Tabbar,Tab} from 'react-onsenui';

import pages from '../page';


export default class TabPage extends Component{
	constructor(props) {
	    super(props);
	    this.state = {index:0};
	}

	renderTabs(){
		const Home = pages['首页'];
		const Order = pages['订单页'];
		const Group = pages['团队页'];
		const Approve = pages['审批页'];
		const Profile = pages['个人页'];
		return [
	      {
	        content: <Home key={'首页'}  />,
	        tab: <Tab label='首页' icon='md-home' />
	      },
	      {
	        content: <Order key={'订单页'} />,
	        tab: <Tab label='订单' icon='md-shopping-cart' />
	      },
	      {
	        content: <Group key={'团队页'} />,
	        tab: <Tab label='搜团' icon='md-search' />
	      },
	      {
	        content: <Approve key={'审批页'} />,
	        tab: <Tab label='审批' icon='md-shield-check' />
	      },
	      {
	        content: <Profile key={'个人页'} />,
	        tab: <Tab label='我' icon='md-account' />
	      }
	    ];
	}

	render(){
		return (
			<ons-page>
		        <Tabbar
		          swipeable={false}
		          position='bottom'
		          index={this.state.index}
		          onPreChange={(event) =>
		            {
		              if (event.index != this.state.index) {
		                this.setState({index: event.index});
		              }
		            }
		          }
		          renderTabs={_=>this.renderTabs()}
		        />
		  </ons-page>
		);
	}
};

