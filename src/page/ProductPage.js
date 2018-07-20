import React, { Component } from 'react';

import { Input, Icon } from 'react-onsenui';
import {Carousel,CarouselItem,Page} from 'react-onsenui';

import {AppCore,share,loadIfEmpty} from '../util/core';

import '../css/ProductPage.css'
import {footer,shareWith} from '../util/com';

import {loadPdf,prePage,nextPage,zoomIn,zoomOut} from '../util/pdf';

import Calendar from '../util/calendar';


export default class ProductPage extends Component{
	constructor(props) {
	    super(props);
		this.state = {
			zs_modal: false,
			gys_modal: false,
				menu_show: false,
				menu_box_show: false,
				picIdx: 0,
			pro_info_tab: ['行程详情','费用说明','自费购物'],
			cur_tab_i: 0,
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

	setTabIndex(i){
		this.setState({cur_tab_i: i})
	}

	// 设置modal显示隐藏 和 footer 连动(还有两个按钮的事件没加上)
	zsModal(){
		if(this.state.zs_modal || this.state.gys_modal) return;
		this.setState({zs_modal: true})
	}
	zsModalHide(){
		this.setState({zs_modal: false})
	}

	gysModal(){
		if(this.state.zs_modal || this.state.gys_modal) return;		
		this.setState({gys_modal: true})		
	}
	gysModalHide(){
		this.setState({gys_modal: false})		
	}
	//  切换 菜单显示隐藏 --------------------------------------------------------
	toggleMenu(){
		this.setState({menu_show: !this.state.menu_show})
	}
	
	share(scene){
		this.setState({shareWithOpen:false});
		share(scene,'奇丽江南：苏沪杭+乌镇西栅+大小西湖+周庄环镇水上游+拙政园+上海迪士尼乐园双高5日',
			'经典景点：江南四大园林之首拙政园、包船游大小西湖，双王牌水乡乌镇西栅，周庄环镇水上游；美味舌尖：赠送杭州农家乐特色茶点茶宴，贴心服务，超值礼遇；品质承诺：我们承诺只有两项夜间自费项目，自愿参加不参加统一用车送回宾馆；',
			'https://www.bytserp.com/zs-back/files/TY_ZS/thumbnail/%E8%BF%AA%E5%A3%AB%E5%B0%BC201806191101513801.png',
			'https://www.bytserp.com/exh/?pd=1');
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
	      <div style={{position: 'absolute',bottom:'0px',left:'0px',right:'0px', zIndex: (this.state.gys_modal || this.state.zs_modal ? "-1" : "auto") }}>
	      	{	this.state.open_menu &&
	      		<div className="pdf-ctrl">
					<div className={(this.state.menu_show === false ? "pdf-ctrl-item-show":"pdf-ctrl-item-hide")} onClick={_=>zoomOut()}> <Icon icon='md-minus-circle' /></div>
					<div className={(this.state.menu_show === false ? "pdf-ctrl-item-show":"pdf-ctrl-item-hide")} onClick={_=>zoomIn()}> <Icon icon='md-plus-circle' /></div>

					<div className={(this.state.menu_show === false ? "":"hide")+" pdf-ctrl-item-page"}>
						<div className="pdf-ctrl-item-page-box">{1}/{20}页</div>
					</div>
					<div className={(this.state.menu_show === false ? "pdf-ctrl-item-show":"pdf-ctrl-item-hide")} onClick={_=>prePage()}> <Icon icon='md-caret-left-circle' /></div>
					<div className={(this.state.menu_show === false ? "pdf-ctrl-item-show":"pdf-ctrl-item-hide")} onClick={_=>nextPage()}> <Icon icon='md-caret-right-circle' /></div>
					
					<div className="pdf-ctrl-item1" onClick={_=>this.toggleMenu()}> 
						<Icon className={ this.state.menu_show === false ?'hide':''} icon='md-menu' />
						<Icon className={ this.state.menu_show === false ?'':'hide'} icon='md-format-clear-all' />
					</div>
				</div>
			}
				{footer('product', this)}
	      </div>
		);
	}
	scrollPage(e){
		let open_menu = this.refs.pdfCt.offsetTop-e.target.scrollTop < window.innerHeight - 250;
		this.setState({open_menu:open_menu});
		
	}

	render(){
		return (
			<Page 
				renderToolbar={_=>this.renderToolbar()} 
				renderModal={_=>shareWith(this)} 
				renderFixed={_=>this.renderFixed()}
				onScroll={e=>this.scrollPage(e)}
				onInit={_=>loadIfEmpty(this,this.afterLoad)} >
			<div style={{overflowY: (this.state.gys_modal || this.state.zs_modal ? "hidden" : "auto"),width: '100%', height: '100%' }}>
				{
				  	!this.state.data &&
					<div className="after-list text-center">
				      <ons-icon icon="fa-spinner" size="26px" spin></ons-icon>
				    </div>
				}
				{
					// gys-弹窗
					this.state.gys_modal &&
					<div className="zs-modal" onClick={_=>this.gysModalHide()}>
						<div className="zs-popup" onClick={_=>{_.stopPropagation()}}>
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
					</div>
				}
				{
					// zs-弹窗
					this.state.zs_modal &&
					<div className="zs-modal" onClick={_=>this.zsModalHide()}>
						<div className="zs-popup" onClick={_=>{_.stopPropagation()}}>
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
					</div>
				}

				{
					this.state.data &&
				
				    <div className="posi-rela">
					  	<Carousel onPostChange={e=>this.handleChange('picIdx',e)} index={this.state.picIdx} swipeable autoScroll overscrollable>
				      	    {this.state.data['产品详情'].product_modular['产品图片'].map((item, index) => (
				      	      <CarouselItem key={index}>
				      	        <div style={{height: "5.333333rem", width: '100%'}}>
				      	          {/* <img src={AppCore.HOST+'/'+item.img} className="img-size"></img> */}
				      	          <img src={'https://www.bytserp.com/zs-back/'+item.path} className="img-size"></img>
				      	        </div>
				      	        </CarouselItem>
				      	    ))}
			      	    </Carousel>
				      	<div className="swiper-ctlr">
				      	  {this.state.data['产品详情'].product_modular['产品图片'].map((item, index) => (
				      	    <span className={this.state.picIdx === index ?'active-banner-page':'other-banner-page'} key={index} style={{cursor: 'pointer'}} onClick={this.setIndex.bind(this, 'picIdx',index)}>
				      	      {/* {this.state.picIdx === index ? '\u25CF' : '\u25CB'} */}
				      	    </span>
				      	  ))}
				      	</div>
						{/* banner下 产品信息 */}
						<div className="pro-header-info">
							<div className="pro-name">{this.state.data['产品详情'].pd_name}</div>
							<div className="pro-price">
								<div className="pro-price-zk_price">￥{(this.state.data['产品团期'][0] && this.state.data['产品团期'][0].zk_price) * 1} <span style={{fontSize: '.373333rem', fontWeight: 'normal'}}>起</span></div>
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
				    </div>
				}
			</div>
			</Page>
		);
	}
};
