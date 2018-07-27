import React, { Component,Fragment } from 'react';

import { Input, Icon,Dialog } from 'react-onsenui';
import {Carousel,CarouselItem,Page} from 'react-onsenui';

import {AppCore,share,loadIfEmpty,testing,log,goTo,Enum,goBack} from '../util/core';

import '../css/ProductPage.css'
<<<<<<< .mine
import {shareWith,nonBlockLoading,gys_dialog,zs_dialog, footer_ctrl} from '../util/com';
||||||| .r78
import {shareWith,nonBlockLoading} from '../util/com';
=======
import {shareWith,nonBlockLoading,info} from '../util/com';
>>>>>>> .r82

import {loadPdf,prePage,nextPage,zoomIn,zoomOut} from '../util/pdf';

import Calendar from '../util/calendar';


export default class ProductPage extends Component{
	constructor(props) {
	    super(props);
		this.state = {
			open_supplier: false,
			open_op: false,
			picIdx: 0,
			menu_show: true
		};
		this.url = '/api/App/product/'+props.p.pd_id;
	}

	afterLoad() {
		let attach = this.state.data['产品详情'].attach;
		attach = JSON.parse(attach);
		if(!attach.length){
			return;
		}
		let url = attach[attach.length-1].save_path;
		loadPdf(AppCore.HOST+'/'+url,this.refs.canvas,this.refs.pdfCt.offsetWidth);
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
	      	{	this.state.open_menu &&
	      		<div className="pdf-ctrl">
					<div className={(this.state.menu_show ? "pdf-ctrl-item-show":"pdf-ctrl-item-hide")} onClick={_=>zoomOut()}> <Icon icon='md-minus-circle' /></div>
					<div className={(this.state.menu_show ? "pdf-ctrl-item-show":"pdf-ctrl-item-hide")} onClick={_=>zoomIn()}> <Icon icon='md-plus-circle' /></div>

					<div className={(this.state.menu_show ? "":"hide")+" pdf-ctrl-item-page"}>
						<div className="pdf-ctrl-item-page-box">{1}/{20}页</div>
					</div>
					<div className={(this.state.menu_show ? "pdf-ctrl-item-show":"pdf-ctrl-item-hide")} onClick={_=>prePage()}> <Icon icon='md-caret-left-circle' /></div>
					<div className={(this.state.menu_show ? "pdf-ctrl-item-show":"pdf-ctrl-item-hide")} onClick={_=>nextPage()}> <Icon icon='md-caret-right-circle' /></div>
					
					<div className="pdf-ctrl-item1" onClick={_=>this.toggleMenu()}> 
						<Icon className={ this.state.menu_show ?'hide':''} icon='md-menu' />
						<Icon className={ this.state.menu_show ?'':'hide'} icon='md-format-clear-all' />
					</div>
				</div>
			}

<<<<<<< .mine
	        { footer_ctrl('product', this) }
||||||| .r78
	        <div className="order-edit-footer">
				<div className="order-edit-footer-box" onClick={_=>this.setState({open_supplier:true})}>
					<img src="img/gys.png" />
					<span>联系供应商</span>
				</div>
				<div className="order-edit-footer-box" onClick={_=>this.setState({open_op:true})}>
					<img src="img/zs.png" />
					<span>联系总社</span>
				</div>
			    <div className="pro-footer-zw">占位</div>
			    <div className="pro-footer-sb">实报</div>
			</div>
=======
	        <div className="order-edit-footer">
				<div className="order-edit-footer-box" onClick={_=>this.setState({open_supplier:true})}>
					<img src="img/gys.png" />
					<span>联系供应商</span>
				</div>
				<div className="order-edit-footer-box" onClick={_=>this.setState({open_op:true})}>
					<img src="img/zs.png" />
					<span>联系总社</span>
				</div>
			    <div className="pro-footer-zw" onClick={_=>goTo('选择项目页',{items:Enum.City,cb:this.selectCity.bind(this)})}>占位</div>
			    <div className="pro-footer-sb">实报</div>
			</div>
>>>>>>> .r82
	      </div>
		);
	}
	scrollPage(e){
		let open_menu = this.refs.pdfCt.offsetTop-this.refs.anchor.parentElement.scrollTop < window.innerHeight - 250;
		this.setState({open_menu:open_menu});
		
	}

	selectCity(id){
		console.log(this);
		goBack();
		info(id);
	}

	render(){
		return (
			<Page 
				renderToolbar={_=>this.renderToolbar()} 
				renderModal={_=>shareWith(this)} 
				renderFixed={_=>this.renderFixed()}
				onScroll={e=>this.scrollPage(e)}
				onInit={_=>loadIfEmpty(this,this.afterLoad)} >
				<div ref="anchor"></div>

				{
				  	!this.state.data && nonBlockLoading()
				}

				{
					this.state.data &&
				
				    <Fragment>
					  	<Carousel onPostChange={e=>this.handleChange('picIdx',e)} index={this.state.picIdx} swipeable autoScroll overscrollable>
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
				      	<div className="swiper-ctlr">
				      	  {
				      	  	this.state.data['产品详情'].product_modular['产品图片'].map(
				      	  		(item, index) => 
						      	    <span className={this.state.picIdx === index ?'active-banner-page':'other-banner-page'} key={index} 
						      	    	style={{cursor: 'pointer'}} onClick={this.setIndex.bind(this, 'picIdx',index)}>
						      	    </span>
					      	)
				      	  }
				      	</div>
						{/* banner下 产品信息 */}
						<div className="pro-header-info">
							<div className="pro-name">{this.state.data['产品详情'].pd_name}</div>
							<div className="pro-price">
								<div className="pro-price-zk_price">￥{(this.state.data['产品团期'][0] && this.state.data['产品团期'][0].zk_price) * 1} 
									<span style={{fontSize: '.373333rem', fontWeight: 'normal'}}>起</span>
								</div>
								<div className="pro-price-dep_city">{this.state.data['产品详情'].dep_city_name}出发</div>
							</div>
							<div className="pro-sale">
								<div className="pro-sale-price">{ (this.state.data['产品团期'][0] && this.state.data['产品团期'][0].peer_price) }</div>
								<div className="pro-sale-supplier">供应商: {this.state.data['产品详情'].pd_provider}</div>
							</div>
						</div>
						

						{/* 团期日历 */}
						<Calendar groups={this.state.data['产品团期']}></Calendar>

						{/* 行程亮点 */}
						<div className="tour-highlights">
							<div className="tour-highlights-title">行程亮点</div>
							<pre className="tour-highlights-item">{this.state.data['产品详情'].product_modular['产品特色']}</pre>
						</div>
						{/* pdf */}
						<div style={{overflow:'scroll'}} className="PDF-view" ref="pdfCt">
							<canvas ref="canvas" className="pdf-canvas"></canvas>
						</div>
				    </Fragment>
				}

<<<<<<< .mine
		        { gys_dialog(this) }
		        { zs_dialog(this) }
||||||| .r78
		        <Dialog
		          isOpen={this.state.open_supplier}
		          isCancelable={true}
		          onCancel={_=>this.setState({open_supplier:false})}>
				  	<div className="zs-popup">
						<div className="zs-popup-avatar">
							<img src="img/avatar.png" />
						</div><br />
						<div className="zs-popup-info">
							<div className="">公司全称: 张阿道夫撒旦法</div>
							<div className="">所属部门: 张阿道夫撒旦法</div>
							<div className="">员工姓名: 张阿道夫撒旦法</div>
							<div className="">手机号码: 13434343434343</div>
						</div><br />
						<div className="zs-popup-btn">
							<a href="tel:13434343434">拨打电话</a>
						</div>
					</div>
		        </Dialog>
=======
		        <Dialog
		          isOpen={this.state.open_supplier}
		          isCancelable={true}
		          onCancel={_=>this.setState({open_supplier:false})}>
				  	<div className="zs-popup">
						<div className="zs-popup-avatar">
							<img src="img/avatar.png" />
						</div><br />
						<div className="zs-popup-info">
							<div className="">公司全称: </div>
							<div className="">所属部门: </div>
							<div className="">员工姓名: </div>
							<div className="">手机号码: </div>
						</div><br />
						<div className="zs-popup-btn">
							<a href="tel:13584882787">拨打电话</a>
						</div>
					</div>
		        </Dialog>
>>>>>>> .r82

<<<<<<< .mine
||||||| .r78
		        <Dialog
		          isOpen={this.state.open_op}
		          isCancelable={true}
		          onCancel={_=>this.setState({open_op:false})}>
				  	<div className="zs-popup">
						<div className="zs-popup-avatar">
							<img src="img/avatar.png" />
						</div><br />
						<div className="zs-popup-info">
							<div className="">所属中心: 张阿道夫撒旦法</div>
							<div className="">所属部门: 张阿道夫撒旦法</div>
							<div className="">员工姓名: 张阿道夫撒旦法</div>
							<div className="">手机号码: 13434343434343</div>
						</div><br />
						<div className="zs-popup-btn">
							<a href="tel:13434343434">拨打电话</a>
						</div>
					</div>
		        </Dialog>
=======
		        <Dialog
		          isOpen={this.state.open_op}
		          isCancelable={true}
		          onCancel={_=>this.setState({open_op:false})}>
				  	<div className="zs-popup">
						<div className="zs-popup-avatar">
							<img src="img/avatar.png" />
						</div><br />
						<div className="zs-popup-info">
							<div className="">所属中心: </div>
							<div className="">所属部门: </div>
							<div className="">员工姓名: </div>
							<div className="">手机号码: </div>
						</div><br />
						<div className="zs-popup-btn">
							<a href="tel:13584882787">拨打电话</a>
						</div>
					</div>
		        </Dialog>
>>>>>>> .r82
			</Page>
		);
	}
};
