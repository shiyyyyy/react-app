import React, { Component,Fragment } from 'react';

import {Page,Popover} from 'react-onsenui';

import {AppCore,loadMore,loadIfEmpty,i18n,goTo,reload,goBack,Enum} from '../util/core';
import {pullHook,loginToPlay,SearchLv2,nonBlockLoading} from '../util/com';
import { connect } from 'react-redux';

class RegulatoryPage extends Component{

	constructor(props) {
		super(props);
		
	    this.state = {
			state:'initial',data:[], search:{code:'', income: '', expense:''},
		
			open_search_key: false,
			cur_select_search_filter: {search: 'name', text: '部门名称'},
		};
		this.mod = '账户监管';
		this.pageSize = 20;
	}


	componentDidMount() {
	}


	renderToolbar(){
		let search_cfg = {
			key: 'Regulatory',
			cb: (value, key) => {
				let search = this.state.search
				search['code'] = ''
				search['name'] = ''
				search[key] = value
				this.setState({search:search});
				reload(this)
			}		
		}
		return <SearchLv2 value={this.state.search.code || this.state.search.name} 
					open_search_key={_=>this.setState({open_search_key:true})}
					cur_select={this.state.cur_select_search_filter || ''}
			clear={e => { e.stopPropagation(); this.setState({ search: { ...this.state.search, code: '', name: ''}},_=>reload(this))}} 
					param={search_cfg} set_anchor={anchor=>this.search_anchor=anchor} />
	}

	renderFixed(){
		if(!this.refs.regulatory){
			return;
		}
		
		if(AppCore.os){
			this.tbHeight = (AppCore.os==='ios'?56:68);
		}
		return (
		<div className="fixed-top-box">	
			<div className="money-care-books-title fixed-top" style={{ top: this.tbHeight+'px', fontSize: '.32rem' }}>
                <span className="money-care-books-title-item-4">业务部门</span>
                <span className="money-care-books-title-item-4">收入总计</span>
                <span className="money-care-books-title-item-4">支出总计</span>
                <span className="money-care-books-title-item-4">可用余额</span>
            </div>
		</div>	
		)
	}

	render(){
		return (
			<Page 
			renderToolbar={_=>this.renderToolbar()} 
			renderFixed={_=>this.renderFixed()}
			onInfiniteScroll={done=>loadMore(this,done)} 
			onShow={_=>loadIfEmpty(this)} >
		    {
		    	this.props.s.user.sid && 
	    		<Fragment>
					<div style={{width: '100px', height: '62px'}}></div>

					<Popover
					animation = "none"
					direction = "down"
			      	isOpen={this.state.open_search_key}
			      	onCancel={() => this.setState({open_search_key: false})}
			      	getTarget={() => this.search_anchor}
			    	>
			        	<div className="dialog-select-box">
			        	  <div className="dialog-select-item" onClick={_=>this.setState({open_search_key:false,cur_select_search_filter:{search: 'name', text: '部门名称'}})}>部门名称</div>
			        	  <div className="dialog-select-item" onClick={_=>this.setState({open_search_key:false,cur_select_search_filter:{search: 'code', text: '部门代码'}})}>部门代码</div>
			        	</div>
			    	</Popover>
	    			{
	    				!this.state.loading && pullHook(this)
	    			}
					<div className="money-care-books-box" ref="regulatory" style={{marginTop: '0'}}>
						<div className="money-care-books-main">
						{this.state.data.map((department,i) =>
						  	<div className="money-care-books-main-item" key={department.id} style={{fontSize: '.266667rem'}}
							  onClick={_=>goTo('账户详情',{item: department})}>
								<span className="money-care-books-main-item-col-4" style={{lineHeight: '.32rem', color: '#000'}}>{department.company_name}<br />
									<span style={{fontSize: '.213333rem', color: '#333'}}>{department.name}</span>
								</span>
								<span className="money-care-books-main-item-col-4" style={{color: '#E3900C'}}>{department.income}</span>
								<span className="money-care-books-main-item-col-4" style={{color: '#DA0202'}}>{department.expense}</span>
								<span className="money-care-books-main-item-col-4" style={{color: '#00B42D'}}>{department.avail_balance}</span>
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

export default connect(s=>({s:s}))(RegulatoryPage)

