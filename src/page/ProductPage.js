import React, { Component,Fragment } from 'react';

import { Input, Icon,Dialog } from 'react-onsenui';
import {Carousel,CarouselItem,Page} from 'react-onsenui';

import {plugin,hasPlugin,AppCore,share,loadIfEmpty,testing,log,goTo,Enum,goBack} from '../util/core';

import '../css/ProductPage.css'
import {shareWith,nonBlockLoading,info,ErrorBoundary,error,OpDialog, SupplierDialog} from '../util/com';

import {loadPdf,prePage,nextPage,zoomIn,zoomOut} from '../util/pdf';

import Calendar from '../util/calendar';
import { connect } from 'react-redux';

export default class ProductPageWrap extends Component {
    constructor(props) {
    	super(props);
    }

    render() {
	  return (
	  		<ErrorBoundary><ProductPageInject p={this.props.p} /></ErrorBoundary>
	  )
  }  
}

class ProductPageRender extends Component{
	constructor(props) {
	    super(props);
		this.state = {
			open_supplier: false,
			open_op: false,
			picIdx: 0,
			// selected_group:props.p.group_id,
			selected_group:'',
			numPages:1,
			curPage:1,
		};
		this.url = '/api/App/product/'+props.p.pd_id;
	}

	downloadPdf(){
	    if(this.pdf_url && hasPlugin('cordova.InAppBrowser')){
	        plugin('cordova.InAppBrowser').open(AppCore.HOST+'/'+this.pdf_url,'_system');
	    }
	}

	afterLoad() {
		let attach = this.state.data['产品详情'].attach;
		try{
			attach = JSON.parse(attach);
		}catch(e){
			error('文档加载失败');
			return;
		}
		
		if(!attach.length){
			return;
		}
		let url = attach[attach.length-1].save_path;
		this.pdf_url = url;
		loadPdf(
			AppCore.HOST+'/'+url,
			this.refs.canvas,
			this.refs.pdfCt.offsetWidth,
			numPages=>{
				this.setState({numPages:numPages})
			}
		);

	}

	handleChange(key,e) {
		let state = {};
		state[key] = e.activeIndex;
		this.setState(state);
	}
	setIndex(key,index) {
		let state = {};
		state[key] = index;
		this.setState(state);
	}


	//  切换 菜单显示隐藏 --------------------------------------------------------
	toggleMenu(){
		this.setState({menu_show: !this.state.menu_show})
	}
	
	share(scene){
		this.setState({shareWithOpen:false});
		let argv = [
			scene,this.state.data['产品详情'].pd_name,
			this.state.data['产品详情'].product_modular['产品特色'] || this.state.data['产品详情'].pd_name,
			encodeURI(AppCore.HOST+'/'+this.state.data['产品详情'].product_modular['产品图片'][0].thumbnail),
			AppCore.SHARE_HOST+'?pd='+this.props.p.pd_id
		];
		share(...argv);
	}

	renderToolbar(){
		return (
			  <ons-toolbar>
			 	  <div className='left'><ons-back-button></ons-back-button></div>
			      <div className="center">产品</div>
			      <div className="right">
			      	<ons-toolbar-button onClick={_=>this.setState({shareWithOpen:true})}>分享</ons-toolbar-button>
		      	  </div>
			  </ons-toolbar>
		);
	}
	renderFixed(){
		return (
	      <div style={{position: 'absolute',bottom:'0px',left:'0px',right:'0px'}}>

	        <div className="order-edit-footer">
				<div className="order-edit-footer-box" onClick={_=>this.setState({open_supplier:true})}>
					<img src="img/gys.png" />
					<span>联系供应商</span>
				</div>
				<div className="order-edit-footer-box" onClick={_=>this.setState({open_op:true})}>
					<img src="img/zs.png" />
					<span>联系总社</span>
				</div>
			    <div className="pro-footer-zw" onClick={_=>this.holdSeat()}>占位</div>
			    <div className="pro-footer-sb" onClick={_=>this.realSignUp()}>实报</div>
			</div>
	      </div>
		);
	}


	holdSeat(){
		let id = this.state.selected_group;
		if(!id||id ===0) {
			error('请选择团期');
			return;
		}
		goTo('占位订单',{data:{id:id},action:'占位订单'});
	}

	realSignUp(){
		let groups = this.state.data['产品团期'];

		let id = this.state.selected_group;

		// 优化代码
		let group = {};
		// if(!id||id ===0) {
		// 	error('请选择团期');
		// 	return;
		// }
		groups.find(function(item){
			if(item['id'] == id){
				group = item;
			}
		});
		if(!group.id){
			error('请选择团期');
			return;
		}
		if(group.manager_department_id != this.props.s.user.department_id){
            //$rootScope.trigger('实报订单-异部',meta,store_id,data);
            goTo('实报订单-异部',{data:group,action:'实报订单-异部'});
        }else{
            goTo('实报订单-同部',{data:group,action:'实报订单-同部'});
        }
	}

	SupplierDialog(){
		let supplier_ctrl = {
			open_supplier : this.state.open_supplier,
			cancelCb : () => {
				this.setState({open_supplier: false})
			}
		}
		return ( <SupplierDialog supplier_ctrl={supplier_ctrl} supplier_info={this.state.data['发布人详情'][0] || ''} /> )
	}
	OpDialog(){
		let op_ctrl = {
			open_op : this.state.open_op,
			cancelCb : () => {
				this.setState({open_op: false})
			}
		}
		return ( <OpDialog op_ctrl={op_ctrl} op_info={this.state.data['接单人详情'][0] || ''} /> )
	}


	render(){
		return (
			<Page 
				renderToolbar={_=>this.renderToolbar()} 
				renderModal={_=>shareWith(this)} 
				renderFixed={_=>this.renderFixed()}

				onInit={_=>loadIfEmpty(this,this.afterLoad)} >
				<div ref="anchor"></div>

				{
				  	!this.state.data && nonBlockLoading()
				}

				{
					this.state.data &&
				
				    <Fragment>
						  <Carousel onPostChange={e=>this.handleChange('picIdx',e)} index={this.state.picIdx} 
						  swipeable autoScroll overscrollable autoScrollRatio={0.25}>
				      	    {
				      	    	this.state.data['产品详情'].product_modular['产品图片'].map(
				      	    		(item, index) => 
						      	      <CarouselItem key={index}>
						      	        <div style={{height: "5.333333rem", width: '100%'}}>
						      	          <img src={AppCore.HOST+'/'+item.path} className="img-size"></img> 
						      	        </div>
						      	      </CarouselItem>
				      	    	)
				      	    }
			      	    </Carousel>
				      	<div className="swiper-ctlr" style={{top: '4.16rem'}}>
				      	  {
				      	  	this.state.data['产品详情'].product_modular['产品图片'].map(
				      	  		(item, index) => 
						      	    <span className={this.state.picIdx === index ?'active-banner-page':'other-banner-page'} key={index} 
						      	    	style={{cursor: 'pointer'}} onClick={this.setIndex.bind(this, 'picIdx',index)}>
						      	    </span>
					      	)
				      	  }
				      	</div>

						{/* 除了banner 剩下的全部 */}
						<div className="pro-body">
							{/* banner下 产品信息 */}
							<div className="pro-header-box">
								<div className="pro-header-info">
									<div className="pro-name">{this.state.data['产品详情'].pd_name}</div>
									<div className="pro-price">
										<div className="pro-price-zk_price">￥{((this.state.data['产品团期'][0] && this.state.data['产品团期'][0].zk_price) * 1) || '0.00'} 
											<span style={{fontSize: '.373333rem', fontWeight: 'normal'}}>起/人</span>
										</div>
										<div className="pro-price-dep_city">{this.state.data['产品详情'].dep_city_name}出发</div>
									</div>
									<div className="pro-sale">
										<div className="pro-sale-price">{ this.state.data['产品详情'].pd_nav_name }</div>
										<div className="pro-sale-supplier">供应商: {this.state.data['产品详情'].pd_provider}</div>
									</div>
								</div>
							</div>

							{/* 团期日历 */}
							<Calendar groups={this.state.data['产品团期']} view={this}></Calendar>

							{/* 行程亮点 */}
							<div className="tour-highlights">
								<div className="tour-highlights-title">行程亮点</div>
								<pre className="tour-highlights-item">{this.state.data['产品详情'].product_modular['产品特色']}</pre>
							</div>

							<div className="tour-detail-title">行程详情</div>

							{/* pdf */}
							<div className="PDF-view" ref="pdfCt">
								<div className="PDF-box-ctrl">
									<div className="PDF-ctrl-left">
										<Icon icon='md-download' onClick={_=>this.downloadPdf()} />
										<Icon icon='md-zoom-in' onClick={_=>zoomIn()} />
										<Icon icon='md-zoom-out' onClick={_=>zoomOut()} />
									</div>
									<div className="PDF-ctrl-right">
										<Icon icon='md-arrow-left' onClick={_=>this.setState({curPage:prePage()})} />
										<span className="pdf-ctrl-item-page-box">{this.state.curPage}/{this.state.numPages}页</span>
										<Icon icon='md-arrow-right' onClick={_=>this.setState({curPage:nextPage()})} />
									</div>
								</div>
								<div className="canvas-box">
									<canvas ref="canvas" className="pdf-canvas"></canvas>
								</div>
							</div>
						</div>
				    </Fragment>
				}

				{ this.state.data && this.state.data['发布人详情'] && this.SupplierDialog()}
				{ this.state.data && this.state.data['接单人详情'] && this.OpDialog()}
			</Page>
		);
	}
};

const ProductPageInject = connect(s=>({s:s}))(ProductPageRender)
