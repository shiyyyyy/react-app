import React, { Component,Fragment } from 'react';

import {Page} from 'react-onsenui';

import {AppCore,loadMore,loadIfEmpty,i18n,goTo,reload,goBack,Enum,hasPlugin} from '../util/core';
import {pullHook,loginToPlay,SearchLv2,nonBlockLoading} from '../util/com';
import { connect } from 'react-redux';
import {appConst} from '../util/const';

class MyAccountPage extends Component{

	constructor(props) {
		super(props);
		
	    this.state = {state:'initial',data:[], search:{id:'',settle_amount: ''},};
		this.mod = '我的账户';
		this.pageSize = 20;
	}


	componentDidMount() {
	}


	renderToolbar(){
		let search_cfg = {
			
			key: 'MyAccount',
			cb: (value, key) => {
				let search = this.state.search
				search['id'] = ''
				search['settle_amount'] = ''
				search[key] = value
				this.setState({search:search});
				reload(this)
			}	
		}
		return <SearchLv2 value={this.state.search.id || this.state.search.settle_amount} 
						clear={e=>{e.stopPropagation();this.setState({search:{...this.state.search,id: '', settle_amount: ''}},_=>reload(this))}} 
						param={search_cfg} />
	}

	get_doc_id(row){
		let v = row.id;
		switch(row.doc_type_id){
			case appConst.DOC_ORDER_SK:
			case appConst.DOC_ZJ_SK:
				return v?'SK0'+v:'';
			case appConst.DOC_YJ:
				return v?'YJ0'+v:'';
			case appConst.DOC_YW_TK:
			case appConst.DOC_YJ_TK:
			case appConst.DOC_ZJ_TK:
				return v?'TK0'+v:'';
			case appConst.DOC_YW_JK:
			case appConst.DOC_ZJ_JK:
				return v?'JK0'+v:'';
			case appConst.DOC_ACC_ZC:
			case appConst.DOC_ZJ_ZC:
				return v?'ZC0'+v:'';
			case appConst.DOC_YC:
				return v?'YC0'+v:'';
			case appConst.DOC_YZ:
				return v?'YZ0'+v:'';
			case appConst.DOC_YW_NZ:
			case appConst.DOC_ZJ_NZ:
				return v?'NZ0'+v:'';
			case appConst.DOC_TZ:
				return v?'TZ0'+v:'';
			case appConst.DOC_KK:
				return v?'KK0'+v:'';
			case appConst.DOC_HK:
				return v?'HK0'+v:'';
			case appConst.DOC_GZ:
				return v?'GZ0'+v:'';
			case appConst.DOC_YW_TH:
			case appConst.DOC_ZJ_TH:
				return v?'TH0'+v:'';
		}
	}

	renderFixed(){
		if(!this.refs.myAccount){
			return;
		}
		
		if(AppCore.os){
			this.tbHeight = (AppCore.os==='ios'?56:68);
		}
		return (
		<div className="fixed-top-box" >
			<div className="money-care-books-title fixed-top" style={{ top: this.tbHeight+'px',fontSize: '.32rem' }}>
                <span className="money-care-books-title-item-4">单据类型</span>
                <span className="money-care-books-title-item-4">单据编号</span>
                <span className="money-care-books-title-item-4">结算金额</span>
                <span className="money-care-books-title-item-4">余额增减</span>
            </div>
		</div>
		)
	}

	render(){
		return (
			<Page renderToolbar={_=>this.renderToolbar()} renderFixed={_=>this.renderFixed()}
			onInfiniteScroll={done=>loadMore(this,done)} onShow={_=>loadIfEmpty(this)}>
		    {
		    	this.props.s.user.sid && 
	    		<Fragment>
					<div style={{width: '100%', height: '62px'}}></div>
	    			{
	    				!this.state.loading && pullHook(this)
					}
					<div className="money-care-books-box" ref="myAccount" style={{marginTop: '0'}}>
						<div className="money-care-books-main">
						{this.state.data.map((doc,i) =>
						  	<div className="money-care-books-main-item" key={doc.id} style={{fontSize: '.266667rem'}}>
								<span className="money-care-books-main-item-col-4">{Enum.Doc[doc.doc_type_id]}</span>
								<span className="money-care-books-main-item-col-4">{this.get_doc_id(doc)}</span>
								<span className="money-care-books-main-item-col-4">{doc.settle_amount}</span>
								<span className="money-care-books-main-item-col-4">{doc.change_amount}</span>
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

export default connect(s=>({s:s}))(MyAccountPage)

