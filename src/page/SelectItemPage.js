import React, { Component,Fragment } from 'react';

import {Page} from 'react-onsenui';

import {AppCore,resetTo,goTo} from '../util/core';
import {search,nonBlockLoading} from '../util/com';
import { connect } from 'react-redux';

export default class SelectItemPage extends Component{

	constructor(props) {
	    super(props);
	    this.state = {page:1};
	}

	componentDidMount() {
	}

	getRenderItems(){
		if(this.state.filter){
			return Object.keys(this.props.p.items).filter(k=>this.props.p.items[k].indexOf(this.state.filter) !== -1);
		}else{
			return Object.keys(this.props.p.items).slice(0,this.state.page*50);
		}
		
	}

	loadMore(done){
		if(this.state.filter){
			done && done();
			return;
		}
		this.setState({loading:true});
		setTimeout(_=>{
			this.setState({loading:false,page:this.state.page+1});
			done && done();
		},200);
	}

	renderToolbar(){
		return (
	        <ons-toolbar>
	        	<div className='left'><ons-back-button></ons-back-button></div>
				<div className="center search-input-box-box">
				  <div className="search-input-box">
					  <input className='search-input-box-input' onChange={e=>this.setState({filter:e.target.value,page:1})}/>
					<img className="search-input-box-img" src="img/search.png" />
				  </div>
				</div>
			</ons-toolbar>
		);
	}

	render(){
		return (
			<Page renderToolbar={_=>this.renderToolbar()} onInfiniteScroll={done=>this.loadMore(done)} >
		    <ons-list>
		    {
		    	this.getRenderItems().map(
		    		k=> 
		    			(<ons-list-item key={k} tappable onClick={_=>this.props.p.cb(k,this.props.p.key)} > {this.props.p.items[k]} </ons-list-item>)
	    		)
		    }
		    </ons-list>
		    {this.state.loading && nonBlockLoading()}
		    </Page>
		);
	}
}


