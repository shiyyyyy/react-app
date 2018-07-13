import React, { Component } from 'react';

import {Page} from 'react-onsenui';


import {footer} from '../util/com';


export default class OrderEditPage extends Component{

	constructor(props) {
	    super(props);
		this.state = {
            mobile: '13866664444',
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
		      	<div className="center">录入游客名单</div>
		  	</ons-toolbar>
		);
	}

	render(){
		return (
			<Page renderToolbar={_=>this.renderToolbar()} >
				
				<div className="doc-module">
                    <div className="doc-main">
                        <div className="doc-main-cell">
					    	<span className="cell-left-5">游客姓名:</span><span className="cell-right"><input type="date" value="zhangsan" /></span>
					    </div>
                        <div className="doc-main-cell">
					    	<span className="cell-left-5">游客性别:</span><span className="cell-right">女<input type="radio" name="xb" /> 男<input type="radio" name="xb" /></span>
					    </div>
                        <div className="doc-main-cell">
					    	<span className="cell-left-5">游客生日:</span><span className="cell-right"><input type="date" /></span>
					    </div>
                        <div className="doc-main-cell">
					    	<span className="cell-left-5">证件类型:</span>
                            <span className="cell-right">
                                <select>
                                    <option>身份证</option>
                                    <option>户口本</option>
                                    <option>军官证</option>
                                </select>
                            </span>
					    </div>
                        <div className="doc-main-cell">
					    	<span className="cell-left-5">证件号码:</span><span className="cell-right"><input type="text" /></span>
					    </div>
                        <div className="doc-main-cell">
					    	<span className="cell-left-5">证件有效期:</span><span className="cell-right"><input type="date" /></span>
					    </div>
                        <div className="doc-main-cell">
					    	<span className="cell-left-5">游客手机:</span><span className="cell-right"><input type="number" /></span>
					    </div>
                        <div className="doc-main-cell">
					    	<span className="cell-left-5">添加备注:</span><span className="cell-right"><input type="text" /></span>
					    </div>
                    </div>
				</div>
				{/* 游客名单 */}
				<div className="enter-tour-list-btn">
                    <div className="enter-tour-list-btn-default">取消</div>
                    <div className="enter-tour-list-btn-submit">确定</div>
				</div>
				{/* 底部 footer */}
				{/* {footer('临时保存','提交时报','order-edit-footer-save','order-edit-footer-submit')} */}

		    </Page>
		);
	}
}

