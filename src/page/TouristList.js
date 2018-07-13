import React, { Component } from 'react';

import {Page} from 'react-onsenui';


import {footer} from '../util/com';


export default class OrderEditPage extends Component{

	constructor(props) {
	    super(props);
		this.state = {
			client:{
				name:'王大拿',
				mobile: '13888888888'
			},
			'接单人': [{name: '唐马儒'},{name: '唐马儒'},{name: '唐马儒'}],
				
			'游客名单': [
				{name: '汪汪汪',gender:'男',birthday:'1999-09-09',ID_card_type:'身份证', ID_num:'232323199909098888'},
				{name: '汪汪汪',gender:'男',birthday:'1999-09-09',ID_card_type:'身份证', ID_num:'232323199909098888'},			
			],
			'订单应收':{receivable: '3388', receivad: '2266', uncollected: '1122' },
			'订单应转':{receivable: '8848', receivad: '6626', uncollected: '2222' }
		};
	}


	renderToolbar(){
		return (
		  	<ons-toolbar>
		  		<div className='left'><ons-back-button></ons-back-button></div>
		      	<div className="center">游客名单</div>
		  	</ons-toolbar>
		);
	}

	render(){
		return (
			<Page renderToolbar={_=>this.renderToolbar()} >
				
				<div className="ord-edit-ord-detail">
					{/* 订单页面 HTML */}
					<div className="order-item" style={{paddingBottom: '1.013333rem'}}>
						<div className="order-number">
							<span style={{fontSize:'.373333rem'}}>订单号:RP-12334324</span>
							<span style={{color:'#9E9E9E', fontSize:'.32rem'}}>门管中心-潘家园门市-李阿斯蒂芬</span>
						</div>
						<div className="order-main">
						{/* 以下为 group 里面拿过来的,应该可以放在函数里,但是HTML里面的东西不太一样 */}
						<div className="pro-item"
						style={{backgroundColor: '#F8F8F8',borderRadius: '0',width: '100%', height:'100%',margin:'0'}}>
							<div className="pro-item-left" style={{width:'2.56rem',height:'2.186667rem'}}>
								<img className="img-size" src={'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1530677101117&di=5ada5f831c0373638a3f7c56dd683750&imgtype=0&src=http%3A%2F%2Fg.hiphotos.baidu.com%2Fimage%2Fpic%2Fitem%2Fb7003af33a87e95053e42ae21c385343faf2b449.jpg'} />
							</div>
							<div className="pro-item-right">
								<div className="pro-item-name">张家界无敌自由行,不包吃不包住不包机票,给我钱你自己去玩</div>
								<div className="pro-item-dep_city flex-j-sb">
									<span>团期: 2018-10-01</span>
									<span>亚美运通</span>
								</div>
								<div className="pro-item-price flex-j-sb" style={{fontSize: '.32rem'}}>
									<span>客户: 张全蛋</span>
									<span>人数: 2</span>
									{/* <span className={'active-order-state'+(order.state*1)}>{this.state.ord_state[order.state*1]}</span> */}
									<span>已支付</span>
								</div>
							</div>
						</div>
						</div>
					</div>
				</div>
				{/* 游客名单 */}
				<div class="model-box">
					<div className="box-title">
						<div className="box-title-text">游客名单</div>
						<div className="box-title-operate">
							<div className="box-title-operate-item" style={{width: '.64rem',border:'none'}}>
							<img src="img/jia.png" style={{width:'.64rem', height: '.64rem'}} /></div>
							<div className="box-title-operate-item" style={{width: '.64rem',border:'none'}}>
							<img src="img/jian.png" style={{width:'.64rem', height: '.64rem'}} /></div>
						</div>
					</div>
					<div className="model-main">
					{this.state['游客名单'].map( (item,i) => 
						<div className="model-main-item-box">
							<div className="model-main-item">
								<span>{i+1}</span> 
								<span>{item.name}</span> 
								<span>{item.gender}</span> 
								<span>{item.birthday}</span>
								<span>{item.ID_card_type}</span> 
								<span>{item.ID_num}</span>
								<i></i>
							</div>
						</div>
					)}
					</div>
				</div>
				{/* 底部 footer */}
				{/* {footer('临时保存','提交时报','order-edit-footer-save','order-edit-footer-submit')} */}

		    </Page>
		);
	}
}

