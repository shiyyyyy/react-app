import React, { Component } from 'react';

import {clickToLog,trigger,toast,AppCore, goTo} from '../util/core';

import {Tabbar,Tab} from 'react-onsenui';

import pages from '../page';

import { ErrorBoundary } from '../util/com';

import '../index.css';

export default class TabPageWrap extends Component {
    constructor(props) {
    	super(props);
    }

    render() {
	  return (
	  		<ErrorBoundary><TabPage p={this.props.p} /></ErrorBoundary>
	  )
  }  
}

class TabPage extends Component{
	constructor(props) {
	    super(props);
			this.state = {index:0};
	    AppCore.TabPage = this;
	}

	renderTabs(){
		const Home = pages['首页'];
		const Order = pages['订单页'];
		const Group = pages['团队页'];
		const Approve = pages['审批页'];
		const Profile = pages['个人页'];
		return [
	      {
	        content: <Home key={'首页'} />,
	        tab: <Tab page={'首页'} key={'首页'}>
						<input type="radio" style={{display: 'none'}} />
						<button className="tabbar__button">
							<div className="tabbar__icon">
								<i className={(this.state.index === 0 ? 'active-tabbar-home-img':'tabbar-home-img')+ " "+"tabbar-img"}></i>
							</div>
							<div className={(this.state.index===0?"active-tabbar-label":"tabbar-label")+" "+"tabbar__label"}>首页</div>
							<div className="tabbar__badge notification"></div>
						</button>
					</Tab>
	      },
	      {
	        content: <Order key={'订单页'} />,
	        tab:<Tab  page={'订单页'} key={'订单页'}>
						<input type="radio" style={{display: 'none'}} />
						<button className="tabbar__button">
							<div className="tabbar__icon">
								<i className={(this.state.index === 1 ? 'active-tabbar-order-img':'tabbar-order-img')+ " "+"tabbar-img"}></i>
							</div>
							<div className={(this.state.index===1?"active-tabbar-label":"tabbar-label")+" "+"tabbar__label"}>订单</div>
							<div className="tabbar__badge notification"></div>
						</button>
					</Tab>
	      },
	      {
	        content: <Group key={'团队页'} />,
	        tab: <Tab page={'团队页'} key={'团队页'}>
						<input type="radio" style={{display: 'none'}} />
						<button className="tabbar__button">
							<div className="tabbar__icon">
								<i className={(this.state.index === 2 ? 'active-tabbar-search-img':'tabbar-search-img')+ " "+"tabbar-img"}></i>
							</div>
							<div className={(this.state.index===2?"active-tabbar-label":"tabbar-label")+" "+"tabbar__label"}>搜团</div>
							<div className="tabbar__badge notification"></div>
						</button>
					</Tab>
	      },
	      {
	        content: <Approve key={'审批页'} />,
	        tab: <Tab page={'审批页'} key={'审批页'}>
						<input type="radio" style={{display: 'none'}} />
						<button className="tabbar__button">
							<div className="tabbar__icon">
								<i className={(this.state.index === 3 ? 'active-tabbar-approval-img':'tabbar-approval-img')+ " "+"tabbar-img"}></i>
							</div>
							<div className={(this.state.index===3?"active-tabbar-label":"tabbar-label")+" "+"tabbar__label"}>审批</div>
							<div className="tabbar__badge notification"></div>
						</button>
					</Tab>
	      },
	      {
	        content: <Profile key={'个人页'} />,
	        tab: <Tab page={'个人页'} key={'个人页'}>
					<input type="radio" style={{display: 'none'}} />
					<button className="tabbar__button">
						<div className="tabbar__icon">
							<i className={(this.state.index === 4 ? 'active-tabbar-my-img':'tabbar-my-img')+ " "+"tabbar-img"}></i>
						</div>
						<div className={(this.state.index===4?"active-tabbar-label":"tabbar-label")+" "+"tabbar__label"}>我的</div>
						<div className="tabbar__badge notification"></div>
					</button>
				</Tab>
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
		              if (Number.isInteger(event.index) && event.index != this.state.index) {
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

