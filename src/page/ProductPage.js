import React, { Component } from 'react';

import { Input } from 'react-onsenui';
import {Carousel,CarouselItem,Page} from 'react-onsenui';

import {AppCore,share,loadIfEmpty} from '../util/core';

import '../css/ProductPage.css'
import {footer,shareWith} from '../util/com';

import {loadPdf,prePage,nextPage,zoomIn,zoomOut} from '../util/pdf';


export default class ProductPage extends Component{
	constructor(props) {
	    super(props);
		this.state = {
				year: 0,
				month: 0,
				date: 0,
				day: 0,
				weeks: [],
				cur_date:'',
			pro_info_tab: ['行程详情','费用说明','自费购物'],
			cur_tab_i: 0,
		};
		this.url = '/api/App/product/'+props.p.pd_id;
	}
	afterLoad() {
		loadPdf('http://b2b.tongyeju.com/zs-back/test.pdf',this.refs.canvas,this.refs.pdfCt.offsetWidth);
	}
	componentDidMount(){
		let date = new Date()
		let y = date.getFullYear()
		let m = date.getMonth() + 1
		let d = date.getDate()
		let day = date.getDay()
		this.calendarDrawing(y,m,d)
	}

	// ---------------------------------- 日历 组件----------------------
	calendarDrawing (year, month, date) {
		var _date = new Date()

		console.log(year + "-" + month + "-" + date)
		var day = _date.getDay() // 周几 返回几就是周几, 0 是周日

		// 这个月的第一天 是周几
		var firstDay = new Date(year - 0, month - 1, 1).getDay()
		console.log('本月第一天是周 :' + firstDay)

		// 上个月在本月显示的天数的数组
		var lastMonthDays = [];
		for (var i = firstDay - 1; i >= 0; i--) {
		  // 可以用 负的 天 来从本月算到上个月
		  console.log(new Date(year - 0, month - 1, -i).getDate())

		  // 上个月的 天 倒序
		  lastMonthDays.push({
			// 注意: 数组里面不只有天,还有月份,可以用月分可以判断样式,例如字体颜色
			'date': new Date(year - 0, month - 1, -i).getDate(),
			'month': month - 1 < 10 ? "0" + (month - 1) : '' + (month - 1),
			"year": year
		  })
		}
		// 本月 天数 数组
		var currentMonthDays = [];
		console.log(new Date(year, month, 0).getDate()) //判断天数(用下个月的0天 返回本月最后一天)
		for (var i = 1, len = new Date(year, month, 0).getDate(); i <= len; i++) {
		  currentMonthDays.push({
			'date': i < 10 ? "0" + i : "" + i,
			'month': month < 10 ? "0" + month : month,
			"year": year
		  })
		}
		// 下月 天数 数组
		var nextMonthDays = []
		var endDay = new Date(year, month, 0).getDay(); //判断本月最后一天星期几
		console.log('本月 最后一天 星期几:' + endDay)
		for (var i = 1; i < 7 - endDay; i++) {
		  nextMonthDays.push({
			'date': "0" + i,
			'month': month - 0 + 1 < 10 ? "0" + (month + 1) : '' + (month + 1),
			"year": year
		  })
		}

		var calendar = []
		calendar = calendar.concat(lastMonthDays, currentMonthDays, nextMonthDays)
		var weeks = []

		for (var i = 0; i < calendar.length; i++) {
		  if (i % 7 == 0) {
			// 7个一组 分开总数组
			weeks[parseInt(i / 7)] = new Array(7);
		  }
		  // 用 parseInt来直接实现自动添加分组数据
		  weeks[parseInt(i / 7)][i % 7] = calendar[i]
		}

		console.log(weeks)

		this.setState({
		  year: year,
		  month: month,
		  date: date,
		  weeks: weeks
		})
		console.log(this)

	  }
	//   ----------- 改变月份--------
	prevMonth(){
		console.log('prev')
		let month = this.state.month
		if(month == 1){
			month = 12
		this.setState({year: this.state.year - 1},
			this.setState({month:month},()=>{this.calendarDrawing(this.state.year,this.state.month,this.state.date)}))
		}else{
			month = month - 1
			this.setState({month:month},()=>{this.calendarDrawing(this.state.year,this.state.month,this.state.date)})
		}
	}
	nextMonth(){
		console.log('next')
		let month = this.state.month
		if(month == 12){
			month = 1
			this.setState({year: this.state.year + 1},
				this.setState({month:month},()=>{this.calendarDrawing(this.state.year,this.state.month,this.state.date)}))
		}else{
			month = month + 1
			this.setState({month:month},()=>{this.calendarDrawing(this.state.year,this.state.month,this.state.date)})
		}
	}
	// 选中日期
	selectDate(date){
		date = date.year+'-'+date.month+'-'+date.date
		this.setState({cur_date: date},()=>{console.log(this.state.cur_date)})
	}


	//   --------------------------------------------------------
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

	render(){
		return (
			<Page renderToolbar={_=>this.renderToolbar()} renderModal={_=>shareWith(this)} onInit={_=>loadIfEmpty(this)} >
				{
				  	!this.state.data &&
					<div className="after-list text-center">
				      <ons-icon icon="fa-spinner" size="26px" spin></ons-icon>
				    </div>
				}
				{
					this.state.data &&
				
				    <div>
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
			      	    <span key={index} style={{cursor: 'pointer'}} onClick={this.setIndex.bind(this, 'picIdx',index)}>
			      	      {this.state.picIdx === index ? '\u25CF' : '\u25CB'}
			      	    </span>
			      	  ))}
			      	</div>
						{/* banner下 产品信息 */}
						<div className="pro-header-info">
							<div className="pro-name">{this.state.data['产品详情'].pd_name}</div>
							<div className="pro-price">
								<div className="pro-price-zk_price">￥{this.state.data['产品团期'][0].zk_price * 1} <span style={{fontSize: '.373333rem', fontWeight: 'normal'}}>起</span></div>
								<div className="pro-price-dep_city">{this.state.data['产品详情'].dep_city_name}出发</div>
							</div>
							<div className="pro-sale">
								<div className="pro-sale-price">{this.state.data['产品团期'][0].peer_price}</div>
								<div className="pro-sale-supplier">供应商: {this.state.data['产品详情'].pd_provider}</div>
							</div>
						</div>
						

						{/* 团期日历 */}
						<div className="calendar">
    						<div className="calendar-panel">
    						  <div className="prevImg" onClick={this.prevMonth.bind(this)}>
    						    <img src="img/prev.png" />
    						  </div>
							  <div className="time-other">{this.state.month === 1 ? (this.state.year -1) : this.state.year}年{this.state.month === 1 ? 12 : (this.state.month - 1)}月</div>
    						  <div className="time">{this.state.year}年{this.state.month}月</div>
							  <div className="time-other">{this.state.month === 12 ? (this.state.year + 1): this.state.year}年{this.state.month === 12 ? 1 : (this.state.month + 1)}月</div>
    						  <div className="nextImg" onClick={this.nextMonth.bind(this)}>
							  	<img src="img/next.png" />
    						  </div>
    						</div>
    						<div className="calendar-header">
    						  <div>日</div>
    						  <div>一</div>
    						  <div>二</div>
    						  <div>三</div>
    						  <div>四</div>
    						  <div>五</div>
    						  <div>六</div>
    						</div>
    						<div className="calendar-body">
							{this.state.weeks.map( item =>
								<div>
    						    	<div className="calender-body-date-week">
									{item.map( cell =>
									<div className="calender-body-date-week-item">
											<div className={'week-item-date'+" "+(this.state.month === (cell.month-0) ? '' : 'not-cur-month')+' '+
											(this.state.cur_date === (cell.year+'-'+cell.month+'-'+cell.date) ? 'active-week-item-date':'')}>{cell.date}</div>
											{this.state.data['产品团期'].map( main => 
												<div onClick={this.selectDate.bind(this, cell)}
												className={(main.dep_date === (cell.year +"-"+ cell.month +"-"+ cell.date) ? '':'hide')+' '+'exist'}>
												<span className={'main-seat-surplus' +' '+ (this.state.month === (cell.month-0) ? '':'hide')+' '+
											(this.state.cur_date === (cell.year+'-'+cell.month+'-'+cell.date) ? 'active-main-seat-surplus':'')}>余 {main.seat_surplus}</span><br />
												<span className={'main-zk-price' +' '+ (this.state.month === (cell.month-0) ? '':'hide')+' '+
											(this.state.cur_date === (cell.year+'-'+cell.month+'-'+cell.date) ? 'active-main-zk-price':'')}>￥{main.zk_price * 1 || 0}</span>
												</div>
											)}
										</div>
									)}
    						    	</div>
    						  	</div>
							)}
    						</div>
  						</div>

						{/* 行程亮点 */}
						<div className="tour-highlights">
							<div className="tour-highlights-title">行程亮点</div>
							<pre className="tour-highlights-item">{this.state.data['产品详情'].product_modular['产品特色']}</pre>
						</div>


						{/* tab 信息 */}
						<div className="pro-tab">
							<div className="pro-tab-title">
								{this.state.pro_info_tab.map( (item,i) => 
									<div className={i === this.state.cur_tab_i ? 'cur-pro-tab' : '' + " " + 'pro-tab-title-item'}
									onClick={this.setTabIndex.bind(this,i)}>{item}</div>
								)}
							</div>
							{/* main - 行程详情 */}
							{
								this.state.cur_tab_i === 0 &&
								<div className="pro-tab-main-details">
									<div className="pro-tab-main-details-pad-left">
									{this.state.data['产品详情'].product_modular['行程详情'].map( (item,i) => 
										<div className="details-every-day">
											<div className="every-day-title">{item.title} <div className="how-days">{'D' + (i+1)}</div> </div>
											<div className={"every-day-visit" + ' ' + (typeof item.description == 'undefined' ? 'hide':'')}>游览:<br /><pre>{item.description}</pre> <div className="how-days"><img className="how-days-img" src="img/lvyou.png" /></div></div>
											<div className="every-day-dining">
												<span className="every-day-dining-title">用餐</span> <br />
												<span className="meal-box-text">早餐 <img className="meal-box-img" src={item.breakfast === true ? 'img/dui.png' : 'img/cuo.png'} /></span>
												<span className="meal-box-text">午餐 <img className="meal-box-img" src={item.lunch === true ? 'img/dui.png' : 'img/cuo.png'} /></span>
												<span className="meal-box-text">晚餐 <img className="meal-box-img" src={item.dinner === true ? 'img/dui.png' : 'img/cuo.png'} /></span>
												<div className="how-days"><img className="how-days-img" src="img/yongcan.png" /></div>
											</div>
											<div className={"every-day-hotel" + ' ' + (typeof item.accommodation == 'undefined' ? 'hide':'')}>{item.accommodation}<div className="how-days"><img className="how-days-img" src="img/zhusu.png" /></div></div>
											<div className={"every-day-traffic" + ' ' + (typeof item.traffic_comment == 'undefined' ? 'hide':'')}>{item.traffic_comment}<div className="how-days"><img className="how-days-img" src="img/jiaotong.png" /></div></div>
										</div>

									)}
									</div>
								</div>
							}
							{/* main - 费用说明 */}
							{
								this.state.cur_tab_i === 1 &&
								<div className="pro-tab-main-explain">
									<div className="pro-tab-main-fee-includes">
										<div className="pro-tab-main-fee-title">费用包含:</div>
										<pre disabled="disabled" className="pro-tab-main-fee-text">
										{this.state.data['产品详情'].product_modular['费用包含']}</pre>
									</div>
									<div className="pro-tab-main-not-includes">
										<div className="pro-tab-main-fee-title">费用不含:</div>
										<pre disabled="disabled" className="pro-tab-main-fee-text">
										{this.state.data['产品详情'].product_modular['费用不含']}</pre>
									</div>
									<div className="pro-tab-main-not-includes">
									<div className="pro-tab-main-fee-title">服务说明:</div>
										<pre disabled="disabled" className="pro-tab-main-fee-text">
										{this.state.data['产品详情'].product_modular['服务说明']}</pre>
									</div>
								</div>
							}
							{/* main - 自费购物 */}
							{
								this.state.cur_tab_i === 2 &&
								<div className="pro-tab-main-explain">
									<div className="pro-tab-main-fee-includes">
										<div className="pro-tab-main-fee-title">购物场所:</div>
										<pre disabled="disabled" className="pro-tab-main-fee-text">
										{this.state.data['产品详情'].product_modular['购物场所']}</pre>
									</div>
									<div className="pro-tab-main-not-includes">
										<div className="pro-tab-main-fee-title">温馨提示:</div>
										<pre disabled="disabled" className="pro-tab-main-fee-text">
										{this.state.data['产品详情'].product_modular['温馨提示']}</pre>
									</div>
								</div>
							}

						</div>

						<div ref="pdfCt">
						  <button onClick={_=>prePage()}>上一页</button>
						  <button onClick={_=>nextPage()}>下一页</button>
						  <button onClick={_=>zoomIn()}>放大</button>
						  <button onClick={_=>zoomOut()}>缩小</button>
						  <button onClick={_=>this.sw()}>切换</button>
						</div>
						<div style={{overflow:'scroll'}}>
							<canvas ref="canvas"></canvas>
						</div>
						{footer('占位','实报','pro-footer-zw','pro-footer-sb')}

				    </div>
				}
			</Page>
		);
	}
};
