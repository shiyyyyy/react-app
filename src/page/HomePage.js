import React, { Component } from 'react';

import {clickToLog,post,AppCore} from '../util/core';

import {Carousel,CarouselItem,Page} from 'react-onsenui';
import { connect } from 'react-redux';


import '../css/HomePage.css'

class HomePage extends Component{
	constructor(props) {
	    super(props);
	    this.click_history = [];
	    this.state = {
			picIdx: 0,
			navIdx: 0,
			icon:[{1: "欧洲",
					2: "北美洲",
					3: "中南美",
					4: "大洋洲",},{
					5: "中东非",
					6: "东南亚",
					7: "日韩朝鲜",
					8: "越柬老缅",},{
					9: "印度马代",
					10: "蒙古中亚",
					11: "港澳台",
					12: "中国",},{
					13: "全球游轮"}]
		};

	}

    onShow() {
    	 this.timer && clearInterval(this.timer);
	  	 this.timer = setInterval(_=>{
	  	 	let picIdx = this.state.picIdx + 1;
	  	 	let navIdx = this.state.navIdx + 1;
	  	 	if(picIdx>3){
	  	 		picIdx = 0;
	  	 	}
	  	 	if(navIdx>1){
	  			navIdx = 0;
	  	 	}
	  		this.setState({picIdx:picIdx,navIdx:navIdx});
	  	 },5000);
    }

    onHide() {
  	    this.timer && clearInterval(this.timer);
  	    this.timer = 0;
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

	renderToolbar(){
		return (
		  	<ons-toolbar>
		      <div className="center" onClick={_=>clickToLog(this)}>首页</div>
		  	</ons-toolbar>
		);
	}

	render(){
		return (
	      <Page onShow={_=>this.onShow()} onHide={_=>this.onHide()} renderToolbar={_=>this.renderToolbar()} >

	        <Carousel onPostChange={e=>this.handleChange('picIdx',e)} index={this.state.picIdx} swipeable autoScroll overscrollable>
	          {this.props.s.pub.slide.map((item, index) => (
	            <CarouselItem key={index}>
	              <div style={{height: "5.333333rem", width: '100%'}}>
	                <img src={AppCore.HOST+'/'+item.img} className="img-size"></img>
	              </div>
	              </CarouselItem>
	          ))}
	        </Carousel>
	        <div className="swiper-ctlr">
	          {this.props.s.pub.slide.map((item, index) => (
	            <span key={index} style={{cursor: 'pointer'}} onClick={this.setIndex.bind(this, 'picIdx',index)}>
	              {this.state.picIdx === index ? '\u25CF' : '\u25CB'}
	            </span>
	          ))}
	        </div>


	        <Carousel onPostChange={e=>this.handleChange('navIdx',e)} index={this.state.navIdx} swipeable autoScroll overscrollable>
	            {
		          	[0,2].map(i => 
		              <CarouselItem key={i}>
					  <div>
								<div style={{display:'flex', margin: '15px 0'}}>
									{
										Object.keys(this.state.icon[i]).map(id=>
											<div className="w-25 text-center" style={{position:"relative"}} key={id}>
											<div style={{height:'2.5rem'}}><img className="banner-scale-img" src={'img/menu_icon/'+id+'.png'} /></div>
											<span className="banner-text">{this.state.icon[i][id]}</span>
											</div>
										)
									}
								</div>
								<div style={{display:'flex', margin: '15px 0'}}>
									{
										Object.keys(this.state.icon[i+1]).map(id=>
											<div className="w-25 text-center" style={{position:"relative"}} key={id}>
											<div style={{height:'2.5rem'}}><img className="banner-scale-img" src={'img/menu_icon/'+id+'.png'} /></div>
											<span className="banner-text">{this.state.icon[i+1][id]}</span>
											</div>
										)
									}
								</div>
						</div>
		              </CarouselItem>
		            )
	            }
	        </Carousel>
	        <div className="swiper-ctlr" style={{cursor: 'pointer', left: '0', right: '0', top: '12rem'}}>
	          {[0,2].map((i, index) => (
	            <span key={index} onClick={this.setIndex.bind(this, 'navIdx',index)}>
	              {this.state.navIdx === index ? '\u25CF' : '\u25CB'}
	            </span>
	          ))}
	        </div>
					
			{/* 热卖推介 */}
			<div className="list-item list-item-middle">
				<div className="list-left-border"></div>
				<div className="list-content">热卖推介</div>
				<div className="list-more">更多 <img className="posi-ab" style={{top:'1px',right:'0',bottom:'0'}} src='img/more.png'></img></div>
			</div>

			<div className="flex-j-sb flex-wrap" style={{padding: '.32rem'}}>
			{this.props.s.pub.recommend.map((item, index) => (
				<div className="content-item" key={index}>
					<div className="content-item-top"><img src={AppCore.HOST+'/'+item.img} className="img-size"></img></div>
					<div className="content-item-bottom">
						<div className="flex-j-sb line-h-40">
							<span style={{fontSize: '.48rem', fontWeight: 'bold'}}>￥{item.zk_price * 1}</span>
							<span style={{fontSize: '.373333rem', color: '#666'}}>{item.dep_date}</span>
						</div>
						<div className="text-overflow-2" style={{fontSize: '.373333rem', width: '100%'}}>{item.pd_name}</div>
					</div>
				</div>
			))}
			</div>


		  </Page>
		);
	}
}


export default connect(s=>({s:s}),undefined)(HomePage)
