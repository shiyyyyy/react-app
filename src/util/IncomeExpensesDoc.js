import React from 'react';
import { Enum, goTo, convertCurrency} from '../util/core';
import { Page, Icon } from 'react-onsenui';
import {appConst} from './const';

import "../css/Doc.css";

function get_doc_id(row){
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

//  Doc  组件
// 基础信息组件 1
export function basis(data,type){
    return (
        <div className="doc-module">
			<div className="doc-title">
				<div className="jcxx">基础信息</div>
			</div>
			<div className="doc-main">
				<div className="doc-main-cell">
					<span className="cell-left-4">单据类型:</span><span className="cell-right">{Enum.Doc[data.doc_type_id]}</span>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-4">单据编号:</span><span className="cell-right">{get_doc_id(data)}</span>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-4">制单人:</span><span className="cell-right">{data.company_name}-{data.department_name}-{data.employee_name}</span>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-4">部门编号:</span><span className="cell-right">{data.code}</span>
				</div>
				<div className={(type === '业务内转' ? "doc-main-cell":"hide")}>
					<span className="cell-left-4">转出人:</span><span className="cell-right">{data.nz_pay_employee_name}</span>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-4">结算金额:</span><span className="cell-right">{data.settle_amount} &nbsp; &nbsp; {convertCurrency(data.settle_amount)}</span>
				</div>
			</div>
		</div>
    );
}

export function fund(data){
    return (
        <div className="doc-module">
			<div className="doc-title">
				<div className="rzxq">入账详情</div>
			</div>
			{data.map( (item,i) => 
			<div className="doc-main" key = {i}>
				<div className="doc-main-cell">
					<span className="cell-left-4">入账编号:</span><span className="cell-right">{item.fund_num}</span>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-4">结算方式:</span><span className="cell-right">{Enum.SettleWay[item.settle_way_id]}</span>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-4">结算银行:</span><span className="cell-right">{Enum.SettleBank[item.settle_bank_id]}</span>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-4">结算日期:</span><span className="cell-right">{item.settle_date}</span>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-4">汇款方名称:</span><span className="cell-right">{item.remitter}</span>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-4">结汇金额:</span><span className="cell-right">{item.exchange_amount}</span>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-4">已用金额:</span><span className="cell-right">{item.used}</span>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-4">未用金额:</span><span className="cell-right">{item.used_diff}</span>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-4">认领人:</span><span className="cell-right">{item.claimed_name}</span>
				</div>
				<div className="doc-main-cell-right" style={{ borderBottom: '1px solid #F4F8F9' }}>
					<span>本次收款:{item.amount}</span>
				</div>
			</div>
			)}
			<div className="doc-main-cell-right" style={{fontSize: '.426667rem'}}>合计: { Math.round(data.reduce( (acc,cur)=> cur.amount-0+acc, 0 ) * 100)/100 }</div>
		</div>
    );
}



// 结算信息组件 (内转单没有这个)  资金结算&
export function billing_info(data, view, mod, type) {
	return (
		<div className="doc-module">
			<div className="doc-title">
				<div className="jsxx">结算信息</div>
			</div>
			<div className="doc-main">
				<div className={(type === '业务支出' ? '' : 'hide') + " doc-main-cell"}>
					<span className="cell-left-5">业务类型:</span><span className="cell-right">{Enum.InvoiceBusinessType[data.business_type]}</span>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-5">结算方式:</span><span className="cell-right">{Enum.SettleWay[data.settle_way_id]}</span>
					{/* <span className="cell-left-5">结算方式:</span>
					<select selected={data.settle_way_id}
						onChange={e => view.changeModMain(mod, 'settle_way_id',0, e.target.value)}
						disabled={view.edit} >
						{Object.keys(Enum.SettleWay).map(item =>
							<option value={item} key={item}>{Enum.SettleWay[item]}</option>
						)}
					</select> */}

				</div>
				<div className="doc-main-cell">
					<span className="cell-left-5">结算银行:</span><span className="cell-right">{Enum.SettleBank[data.settle_bank_id]}</span>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-5">支票号:</span><span className="cell-right">{data.check_number}</span>
					{/* <span className="cell-left-5">支票号:</span>
					<input className="cell-right"
						value={data.check_number}
						onChange={e => view.changeModMain(mod, 'check_number', e.target.value)}
						disabled={!view.edit} /> */}
				</div>
				<div className={(type === '汇款方名称' ? '' : 'hide') + " doc-main-cell"}>
					<span className="cell-left-5">汇款方名称:</span><span className="cell-right">{data.remitter}</span>
					{/* <span className="cell-left-5">汇款方名称:</span>
					<input className="cell-right"
						value={data.remitter}
						onChange={e => view.changeModMain(mod, 'remitter', 0, e.target.value)}
						disabled={!view.edit} /> */}
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-5">结算币种:</span><span className="cell-right">{Enum.Currency[data.currency_id]}</span>
					{/* <span className="cell-left-5">结算币种:</span>
					<select selected={data.currency_id}
						onChange={e => view.changeModMain(mod, 'currency_id', 0, e.target.value)}
						disabled={!view.edit} >
						{Object.keys(Enum.Currency).map(item =>
							<option value={item} key={item}>{Enum.Currency[item]}</option>
						)}
					</select> */}
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-5">汇率:</span><span className="cell-right">{data.rate}</span>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-5">本币金额:</span><span className="cell-right">{(data.settle_amount/data.rate).toFixed(2)}</span>
					{/* <span className="cell-left-5">本币金额:</span>
					<input className="cell-right" type="number"
						value={(data.settle_amount / data.rate)}
						onChange={e => view.changeModMain(mod, 'settle_amount', 0, (e.target.value * 1))}
						disabled={!view.edit} /> */}
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-5">人民币金额:</span><span className="cell-right">{data.settle_amount}</span>
				</div>
			</div>
		</div>
	)
}

// 应收明细
export function receivable_detail(data, view, mod){
    return(
        <div className="doc-module">
        	<div className="doc-title">
				<div className="ysmx">应收明细</div>
				<div className={view.edit?"doc-title-right":"hide"}
				onClick={_ => goTo('订单管理', { view: view, mod: mod })}>添加订单</div>
			</div>
        	{
				data.map((item,i)=>
				<div className="doc-main" key={i} style={{borderBottom: '1px solid #F4F8F9'}}>
					<div className="doc-main-cell">
						<span className="cell-left-4">订单号: </span><span className="cell-right">D0{item.order_id}</span> 
						<div className={view.edit?"doc-main-cell-abso":"hide"}>
							<Icon icon="md-minus-circle-outline" onClick={i => view.reduce_list(mod, i)} />
						</div>
					</div>
					<div className="doc-main-cell">
						<span className="cell-left-4">报名人: </span><span className="cell-right">{item.employee_name}</span>
					</div>
					<div className="doc-main-cell">
						<span className="cell-left-4">供应商: </span><span className="cell-right">{item.pd_provider}</span> 
					</div>
					<div className="doc-main-cell">
						<span className="cell-left-4">产品名称: </span><span className="cell-right">{item.pd_name}</span>
					</div>
					<div className="doc-main-cell">
						<span className="cell-left-4">客户简称: </span><span className="cell-right">{item.short_name}</span> 
					</div>
					<div className="doc-main-cell-flex-3">
						<strong>应收: {item.receivable}</strong>
						<strong>已收: {item.received}</strong> 
						<strong>未收: {item.receive_diff}</strong>
					</div>
					<div className="doc-main-cell-right">
						<span>本次收款: </span>
						<input className="doc-main-cell-right-input" type="number"
						value={item.amount || ''} disabled={!view.edit} placeholder="填写收款金额"
						onChange={e=>view.changeModMain(mod, 'amount', i, e.target.value-0)} />
		            </div>
				</div>
				)
			}
			<div className="doc-main-cell-right" style={{fontSize: '.426667rem'}}>合计: {Math.round(data.reduce( (acc,cur)=> (cur.amount?cur.amount:0)-0+acc, 0 ) * 100)/100}</div>
    </div>
    )
}

// 应付明细
export function payable_detail(data){
    return(
    	<div className="doc-module">
            <div className="doc-title">
				<div className="yfmx">应付明细</div>
			</div>
        	{
				data.map((item,i)=>
				<div className="doc-main" key={i} style={{borderBottom: '1px solid #F4F8F9'}}>
					<div className="doc-main-cell">
						<span className="cell-left-4">出团日期:</span><span className="cell-right">{item.dep_date}</span> 
					</div>
					<div className="doc-main-cell">
						<span className="cell-left-4">产品名称: </span><span className="cell-right">{item.pd_name}</span>
					</div>
					<div className="doc-main-cell">
						<span className="cell-left-4">订单号: </span><span className="cell-right">D0{item.order_id}</span> 
					</div>
					<div className="doc-main-cell">
						<span className="cell-left-4">报名人: </span><span className="cell-right">{item.sign_up_employee_name}</span>
					</div>
					<div className="doc-main-cell-flex-3">
						<strong>应转: {item.settle_amount}</strong> 
						<strong>已转: {item.settled_amount}</strong>
				    	<strong>未转: {item.settle_diff}</strong> 
					</div>
					<div className="doc-main-cell">
						<span className="cell-left-4">结算对象: </span><span className="cell-right">{item.settle_obj}</span>
					</div>
					<div className="doc-main-cell-flex-3">
						<strong>应付: {item.payable}</strong> 
						<strong>已付: {item.paid}</strong>
				    	<strong>未付: {item.pay_diff}</strong> 
					</div>
					<div className="doc-main-cell-right" style={{ borderBottom: '1px solid #F4F8F9' }}>
						<span>本次支出: {item.amount}</span>					
		            </div>
				</div>
				)
			}
			<div className="doc-main-cell-right" style={{fontSize: '.426667rem'}}>合计: { Math.round(data.reduce( (acc,cur)=> cur.amount-0+acc, 0 ) * 100)/100 }</div>
    </div>
    )
}

export function account_info(data){
	return(
		<div className="doc-module">
			<div className="doc-title">
				<div className="rzxq">汇款账号</div>
			</div>
			<div className="doc-main">
				<div className="doc-main-cell">
					<span className="cell-left-5">开户行:</span><span className="cell-right">{data.to_bank}</span>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-5">收款方名称:</span><span className="cell-right">{data.to_user_name}</span>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-5">账号:</span><span className="cell-right">{data.to_account_num}</span>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-5">国家:</span><span className="cell-right">{Enum.Country[data.country]}</span>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-5">城市:</span><span className="cell-right">{Enum.City[data.city]}</span>
				</div>
			</div>
		</div>
    )
}

export function to_account_info(data){
	return(
		<div className="doc-module">
			<div className="doc-title">
				<div className="dfzh">对方账户</div>
			</div>
			<div className="doc-main">
				<div className="doc-main-cell">
					<span className="cell-left-5">开户行:</span><span className="cell-right">{data.to_bank}</span>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-5">收款方名称:</span><span className="cell-right">{data.to_user_name}</span>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-5">账号:</span><span className="cell-right">{data.to_account_num}</span>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-5">国家:</span><span className="cell-right">{Enum.Country[data.country]}</span>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-5">城市:</span><span className="cell-right">{Enum.City[data.city]}</span>
				</div>
			</div>
		</div>
    )
}


// 调用单据
export function call_documents(data){
    return(
		<div className="doc-module">
            <div className="doc-title">
				<div className="gldj">关联单据</div>
			</div>
			{data.map( item => 
				<div className="doc-main">
					<div className="doc-main-cell">							{/* 这里用的是doc_id而不是id,但是id==doc_id */}
						<span className="cell-left-4">单据编号:</span><span className="cell-right">{get_doc_id(item)}</span>
					</div>
					<div className="doc-main-cell">
						<span className="cell-left-4">单据类型:</span><span className="cell-right">{Enum.Doc[item.doc_type_id]}</span>
					</div>
					<div className="doc-main-cell">
						<span className="cell-left-4">制单人:</span><span className="cell-right">{item.company_name}-{item.department_name}-{item.employee_name}</span>
					</div>
					<div className="doc-main-cell">
						<span className="cell-left-4">部门编号:</span><span className="cell-right">{item.code}</span>
					</div>
					<div className="doc-main-cell">
						<span className="cell-left-4">结算对象:</span><span className="cell-right">{item.settle_obj}</span>
					</div>
					<div className="doc-main-cell">
						<span className="cell-left-4">结算金额:</span><span className="cell-right">{item.settle_amount}</span>
					</div>
					<div className="doc-main-cell">
						<span className="cell-left-4">已用金额:</span><span className="cell-right">{item.used}</span>
					</div>
					<div className="doc-main-cell">
						<span className="cell-left-4">超支金额:</span><span className="cell-right">{ (Math.round( (parseFloat(item.used) + parseFloat(item.amount) - parseFloat(item.settle_amount) ) * 100)/100).toFixed(2) }</span>
					</div>
					<div className="doc-main-cell-flex-3">
					</div>
					<div className="doc-main-cell-right" style={{ borderBottom: '1px solid #F4F8F9' }}>本次调用: <span style={{fontSize:'.373333rem'}}>{item.amount}</span></div>
				</div>
				)
			}
			<div className="doc-main-cell-right" style={{fontSize: '.426667rem'}}>合计: { Math.round(data.reduce( (acc,cur)=> cur.amount-0+acc, 0 ) * 100)/100 }</div>
		</div>
    )
}



// 内转明细
export function nz_detail(data){
	return(
        <div className="doc-module">
            <div className="doc-title">
				<div className="nzmx">内转明细</div>
			</div>
        {
			data.map((item,i)=>
			<div className="doc-main" key={i}>
				<div className="doc-main-cell">
					<span className="cell-left-4">出团日期: </span><span className="cell-right">{item.dep_date}</span> 
				</div>
				<div className="doc-main-cell">
					 <span className="cell-left-4">产品名称: </span><span className="cell-right">{item.pd_name}</span>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-4">订单号: </span><span className="cell-right"> D0{item.order_id}</span> 
				</div>
				<div className="doc-main-cell">
					 <span className="cell-left-4">报名人: </span><span className="cell-right">{item.employee_name}</span>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-4">开团人: </span><span className="cell-right"> {item.group_employee_name}</span> 
				</div>
				<div className="doc-main-cell">
					 <span className="cell-left-4">结算对象: </span><span className="cell-right">{item.settle_obj}</span>
				</div>
				<div className="doc-main-cell-flex-3">
					<span>应付/转: {item.payable}</span> 
					<span>已付/转: {item.paid}</span>
					<span>未付/转: {item.pay_diff}</span>
				</div>
				<div className="doc-main-cell-right" style={{ borderBottom: '1px solid #F4F8F9' }}><span>本次支出:{item.amount}</span></div>					
		    </div>
			)
		}
		<div className="doc-main-cell-right" style={{fontSize: '.426667rem'}}>合计: { Math.round(data.reduce( (acc,cur)=> cur.amount-0+acc, 0 ) * 100)/100 }</div>
    </div>
    )
}

//资金内转明细
export function zjnz_detail(data){
	return(
        <div className="doc-module">
            <div className="doc-title">
				<div className="yzmx">转款明细</div>
			</div>
        	{
				data.map((item,i)=>
				<div className="doc-main" key={i}>
					<div className="doc-main-cell">	
						<span className="cell-left-6">转入中心:</span><span className="cell-right">{item.company_name}</span> 
					</div>
					<div className="doc-main-cell"> 
						<span className="cell-left-6">转入部门:</span><span className="cell-right">{item.department_name}</span>
					</div>
					<div className="doc-main-cell">	
						<span className="cell-left-6">转入部门编号:</span><span className="cell-right">{item.department_code}</span> 
					</div>
					<div className="doc-main-cell"> 
						<span className="cell-left-6">转入金额:</span><span className="cell-right">{item.amount}</span>
					</div>
					<div className="doc-main-cell">	
						<span className="cell-left-6">转出中心: </span><span className="cell-right">{Enum.Company[item.out_company_id]}</span> 
					</div>
					<div className="doc-main-cell"> 
						<span className="cell-left-6">转出部门:</span><span className="cell-right">{Enum.Department[item.out_department_id]}</span>
					</div>
					<div className="doc-main-cell">	
						<span className="cell-left-6">转出部门编号: </span><span className="cell-right">{item.out_department_code}</span> 
					</div>
					<div className="doc-main-cell"> 
						<span className="cell-left-6">转出部门员工:</span><span className="cell-right">{Enum.Employee[item.nz_pay_employee_id]}</span>
					</div>
					<div className="doc-main-cell">	
				    	<span className="cell-left-6">转出金额:</span><span className="cell-right">{item.out_amount}</span>					
					</div>
		        </div>
				)
			}
    </div>
    )
}

//退款订单  
export function tk_detail(data){
	return(
        <div className="doc-module">
            <div className="doc-title">
				<div className="dydj">退款明细</div>
			</div>
		{
			data.map((item,i)=>
			<div className="doc-main" key={i}>
				<div className="doc-main-cell">	
					<span className="cell-left-5">出团日期:</span><span className="cell-right">{item.dep_date}</span> 
				</div>
				<div className="doc-main-cell"> 
					<span className="cell-left-5">产品名称:</span><span className="cell-right">{item.pd_name}</span>
				</div>
				<div className="doc-main-cell">	
					<span className="cell-left-5">产品提供方:</span><span className="cell-right">{item.pd_provider}</span> 
				</div>
				<div className="doc-main-cell"> 
					<span className="cell-left-5">订单号:</span><span className="cell-right">D0{item.order_id}</span>
				</div>
				<div className="doc-main-cell">	
					<span className="cell-left-5">报名人: </span><span className="cell-right">{item.employee_name}</span> 
				</div>
				<div className="doc-main-cell"> 
					<span className="cell-left-5">客户简称:</span><span className="cell-right">{item.short_name}</span>
				</div>
				<div className="doc-main-cell">	
					<span className="cell-left-5">当时收款: </span><span className="cell-right">{item.received}</span> 
				</div>
				<div className="doc-main-cell-right" style={{ borderBottom: '1px solid #F4F8F9' }}><span>本次退款:{item.amount}</span></div>					
		    </div>
			)
		}
		<div className="doc-main-cell-right" style={{fontSize: '.426667rem'}}>合计: { Math.round(data.reduce( (acc,cur)=> cur.amount-0+acc, 0 ) * 100)/100 }</div>
    </div>
    )
}

//退回核算
export function th_detail(data){
	return(
        <div className="doc-module">
            <div className="doc-title">
				<div className="thmx">退回明细</div>
			</div>
		{
			data.map((item,i)=>
			<div className="doc-main" key={i}>
				<div className="doc-main-cell">	
					<span className="cell-left-5">出团日期:</span><span className="cell-right">{item.dep_date}</span> 
				</div>
				<div className="doc-main-cell"> 
					<span className="cell-left-5">产品名称:</span><span className="cell-right">{item.pd_name}</span>
				</div>
				<div className="doc-main-cell"> 
					<span className="cell-left-5">订单号:</span><span className="cell-right">D0{item.order_id}</span>
				</div>
				<div className="doc-main-cell">	
					<span className="cell-left-5">报名人: </span><span className="cell-right">{Enum.FullEmployee[item.sign_up_employee_id]}</span> 
				</div>
				<div className="doc-main-cell">	
					<span className="cell-left-5">结算对象:</span><span className="cell-right">{item.settle_obj}</span> 
				</div>
				<div className="doc-main-cell-flex-3"> 
					<strong>应付:{item.payable}</strong>
					<strong>已付:{item.paid}</strong>
					<strong>未付:{item.pay_diff}</strong>
				</div>
				<div className="doc-main-cell-right" style={{ borderBottom: '1px solid #F4F8F9' }}> 
					<span>当时支出:{item.amount}</span>
				</div>
		    </div>
			)
		}
		<div className="doc-main-cell-right" style={{fontSize: '.426667rem'}}>合计: { Math.round(data.reduce( (acc,cur)=> cur.amount-0+acc, 0 ) * 100)/100 }</div>
    </div>
    )
}

// 退款调用收款
export function tk_call_sk(data,type){
    return(
		<div className="doc-module">
			<div className="doc-title">
				<div className="dydj">调用单据</div>
			</div>
			{data.map( (item,i)=>
			<div className="doc-main" key={i}>
				<div className="doc-main-cell">
					<span className="cell-left-4">单据类型:</span><span className="cell-right">{Enum.Doc[item.doc_type_id]}</span>
				</div>
				<div className="doc-main-cell">						{/* 这里用的是doc_id而不是id,但是id==doc_id */}
					<span className="cell-left-4">单据编号:</span><span className="cell-right">{get_doc_id(item)}</span>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-4">制单人:</span><span className="cell-right">{item.company_name}-{item.department_name}-{item.employee_name}</span>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-4">提交日期:</span><span className="cell-right">{item.submit_at}</span>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-4">结算对象:</span><span className="cell-right">{item.settle_obj}</span>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-4">结算金额:</span><span className="cell-right">{item.settle_amount}</span>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-4">已开票额:</span><span className="cell-right">{item.invoice_amount}</span>
				</div>
				<div className={(type === '资金退款' ? "doc-main-cell":"hide")}>
					<span className="cell-left-4">未开票额:</span><span className="cell-right">{item.invoice_remain}</span>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-4">审批状态:</span><span className="cell-right">{Enum.Flow[item.flow]}</span>
				</div>
				<div className={(type === '资金退款' ? "doc-main-cell":"hide")} style={{ borderBottom: '1px solid #F4F8F9' }}>
					<span className="cell-left-4">本次退款:</span><span className="cell-right">{item.amount}</span>
				</div>
			</div>
			)}
			<div className={(type === '资金退款' ? "doc-main-cell-right":"hide")} style={{fontSize: '.426667rem'}}>合计: { Math.round(data.reduce( (acc,cur)=> cur.amount-0+acc, 0 ) * 100)/100 }</div>			
		</div>
    )
}

// 资金退回调用单据
export function th_call_doc(data){
    return(
		<div className="doc-module">
			<div className="doc-title">
				<div className="dydj">调用单据</div>
			</div>
			<div className="doc-main">
				<div className="doc-main-cell">
					<span className="cell-left-4">单据类型:</span><span className="cell-right">{Enum.Doc[data.doc_type_id]}</span>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-4">单据编号:</span><span className="cell-right">{get_doc_id(data)}</span>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-4">制单人:</span><span className="cell-right">{data.company_name}-{data.department_name}-{data.employee_name}</span>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-4">提交日期:</span><span className="cell-right">{data.submit_at}</span>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-4">结算对象:</span><span className="cell-right">{data.settle_obj}</span>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-4">结算金额:</span><span className="cell-right">{data.settle_amount}</span>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-4">单据审批:</span><span className="cell-right">{Enum.Flow[data.flow]}</span>
				</div>
			</div>
		</div>
    )
}

// 资金退回调用单据
export function hk_call_doc(data){
    return(
		<div className="doc-module">
            <div className="doc-title">
				<div className="jkxq">借款详情</div>
			</div>
			{data.map( item =>
			<div className="doc-main">
				<div className="doc-main-cell">
					<span className="cell-left-4">单据类型:</span><span className="cell-right">{Enum.Doc[item.doc_type_id]}</span>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-4">单据编号:</span><span className="cell-right">{get_doc_id(item)}</span>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-4">制单人:</span><span className="cell-right">{item.company_name}-{item.department_name}-{item.employee_name}</span>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-4">部门编号:</span><span className="cell-right">{item.code}</span>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-4">结算对象:</span><span className="cell-right">{item.settle_obj}</span>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-4">结算金额:</span><span className="cell-right">{item.settle_amount}</span>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-4">可交票额:</span><span className="cell-right">{item.invoice_total}</span>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-4">未交票额:</span><span className="cell-right">{item.invoice_remain}</span>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-4">结算方式:</span><span className="cell-right">{Enum.SettleWay[item.settle_way_id]}</span>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-4">审批状态:</span><span className="cell-right">{Enum.Flow[item.flow]}</span>
				</div>
				<div className="doc-main-cell-flex-3">
				</div>
				<div className="doc-main-cell-right" style={{ borderBottom: '1px solid #F4F8F9' }}>本次还款: <span style={{fontSize:'.373333rem'}}>{item.amount}</span></div>
			</div>
			)}
			<div className="doc-main-cell-right" style={{fontSize: '.426667rem'}}>合计: { Math.round(data.reduce( (acc,cur)=> cur.amount-0+acc, 0 ) * 100)/100 }</div>
		</div>
    )
}

// 调整单据
export function tz_call_doc(data){
    return(
		<div className="doc-module">
            <div className="doc-title">
				<div className="tzdj">调整单据</div>
			</div>
			<div className="doc-main">
				<div className="doc-main-cell">
					<span className="cell-left-4">单据类型:</span><span className="cell-right">{Enum.Doc[data.doc_type_id]}</span>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-4">单据编号:</span><span className="cell-right">{get_doc_id(data)}</span>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-4">制单人:</span><span className="cell-right">{data.company_name}-{data.department_name}-{data.employee_name}</span>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-4">提交日期:</span><span className="cell-right">{data.submit_at}</span>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-4">结算对象:</span><span className="cell-right">{data.settle_obj}</span>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-4">结算金额:</span><span className="cell-right">{data.settle_amount}</span>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-4">过审日期:</span><span className="cell-right">{data.approved_at}</span>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-4">单据审批:</span><span className="cell-right">{Enum.Flow[data.flow]}</span>
				</div>
				<div className="doc-main-cell-flex-3">
				</div>
				<div className="doc-main-cell-right">金额增减: <span style={{fontSize:'.373333rem'}}>{data.amount}</span></div>
			</div>
		</div>
    )
}



export function kk_info(data){
	return(
        <div className="doc-module">
            <div className="doc-title">
				<div className="kkxq">扣款详情</div>
			</div>
			{
				data.map((item,i)=>
				<div className="doc-main" key={i}>
					<div className="doc-main-cell">
						<span className="cell-left-4">单据编号: </span><span className="cell-right">{get_doc_id(item)}</span> 
					</div>
					<div className="doc-main-cell">
						<span className="cell-left-4">被扣部门: </span><span className="cell-right">{Enum.Department[item.pay_department_id]}</span>
					</div>
					<div className="doc-main-cell">
						<span className="cell-left-4">部门编号: </span><span className="cell-right">{item.code}</span> 
					</div>
					<div className="doc-main-cell">
						<span className="cell-left-4">扣款金额: </span><span className="cell-right">{item.settle_amount}</span>
					</div>
					<div className="doc-main-cell">
					<span className="cell-left-4">扣款说明:</span><span className='cell-right-wrap'> {item.deduct_comment}</span>
					</div>
				</div>
				)
			}
		</div>
    )
}

// 单据备注 
export function documents_note(data, view, mod){
    return(
        <div className="doc-module">
			<div className="doc-title">
				<div className="djbz">单据备注</div>
			</div>
			{
				data.map((item,i)=>
				<div className="doc-main"  key={i}>
					<div className="doc-main-cell">
						<span className="cell-left-4">备注人: </span> <span className="cell-right-wrap"> {item.employee_name} &nbsp;&nbsp;&nbsp; {item.create_at}</span><br />
					</div>
					<div className="doc-main-cell">
						{/* <span className="cell-left-4">内容:  </span> <span className="cell-right-wrap">{item.comment}</span> */}
						<span className="cell-left-4">内容:  </span> 
						<input className="cell-right-wrap" value={item.comment} 
						onChange={e => view.changeModMain(mod, 'comment', i, e.target.value)} 
						disabled={!view.edit} placeholder={!view.edit?'':'请输入备注'} />
					</div>
				</div>
				)
			}
		</div>
    )
}


// 审批记录
export function record(data){
    return(
        <div className="doc-module">
            <div className="doc-title">
				<div className="spjl">审批记录</div>
			</div>
            <div className="doc-main-cell-num" style={{color: '#000', fontWeight: '700'}}><span>操作人</span><span>审批意见</span><span>审批备注</span><span>操作时间</span></div>
            {data.map((item,i) => !item.editable &&
                <div className="doc-main-cell-num" key={i}><span>{item.employee_name}</span><span>{Enum.Opinion[item.opinion]}</span><span>{item.comment}</span><span>{(item.create_at)}</span></div>
			)}
        </div>
    )
}



// ----------------------------------- 可编辑的 -------------------------------------

// 基础信息组件 1
export function basisClaim(data, price) {
	return (
		<div className="doc-module">
			<div className="doc-title">
				<div className="jcxx">基础信息</div>
			</div>
			<div className="doc-main">
				<div className="doc-main-cell">
					<span className="cell-left-4">单据类型:</span><span className="cell-right">{Enum.Doc[data.doc_type_id]}</span>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-4">单据编号:</span><span className="cell-right">{get_doc_id(data)}</span>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-4">制单人:</span><span className="cell-right">{data.company_name}-{data.department_name}-{data.employee_name}</span>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-4">部门编号:</span><span className="cell-right">{data.code}</span>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-4">结算金额:</span><span className="cell-right">{Math.round(price.reduce((acc, cur) => (cur.amount ? cur.amount : 0) - 0 + acc, 0) * 100) / 100} &nbsp; &nbsp; 
					({convertCurrency(Math.round(price.reduce((acc, cur) => (cur.amount ? cur.amount : 0) - 0 + acc, 0) * 100) / 100)})</span>
				</div>
			</div>
		</div>
	);
}

// 入账详情
export function fundClaim(data, price) {
	return (
		<div className="doc-module">
			<div className="doc-title">
				<div className="rzxq">入账详情</div>
			</div>
			{data.map((item, i) =>
				<div className="doc-main" key={i}>
					<div className="doc-main-cell">
						<span className="cell-left-4">入账编号:</span><span className="cell-right">{item.fund_num}</span>
					</div>
					<div className="doc-main-cell">
						<span className="cell-left-4">结算方式:</span><span className="cell-right">{Enum.SettleWay[item.settle_way_id]}</span>
					</div>
					<div className="doc-main-cell">
						<span className="cell-left-4">结算银行:</span><span className="cell-right">{Enum.SettleBank[item.settle_bank_id]}</span>
					</div>
					<div className="doc-main-cell">
						<span className="cell-left-4">结算日期:</span><span className="cell-right">{item.settle_date}</span>
					</div>
					<div className="doc-main-cell">
						<span className="cell-left-4">汇款方名称:</span><span className="cell-right">{item.remitter}</span>
					</div>
					<div className="doc-main-cell">
						<span className="cell-left-4">结汇金额:</span><span className="cell-right">{item.exchange_amount}</span>
					</div>
					<div className="doc-main-cell">
						<span className="cell-left-4">已用金额:</span><span className="cell-right">{item.used}</span>
					</div>
					<div className="doc-main-cell">
						<span className="cell-left-4">未用金额:</span><span className="cell-right">{item.used_diff}</span>
					</div>
					<div className="doc-main-cell">
						<span className="cell-left-4">认领人:</span><span className="cell-right">{item.claimed_name}</span>
					</div>
					<div className="doc-main-cell-right" style={{ borderBottom: '1px solid #F4F8F9' }}>
						<span>本次收款:{item.amount}</span>
					</div>
				</div>
			)}
			<div className="doc-main-cell-right" style={{ fontSize: '.426667rem' }}>合计: {Math.round(price.reduce((acc, cur) => (cur.amount ? cur.amount : 0) - 0 + acc, 0) * 100) / 100}</div>
		</div>
	);
}


// 单据备注 (可编辑)
export function documents_editNote(view) {
	return (
		<div className="doc-module">
			<div className="doc-title">
				<div className="djbz">单据备注</div>
			</div>
			<div className="doc-main">
				<div className="doc-main-cell">
					<input className="doc-main-cell-input" onChange={e => view.setState({ comment: e.target.value })}
						placeholder="请填写备注信息" />
				</div>
			</div>
		</div>
	)
}


// 应收明细
export function receivable_EditDetail(view) {
	return (
		<div className="doc-module">
			<div className="doc-title">
				<div className="ysmx">应收明细</div>
				<div className="doc-title-right"
					onClick={_ => goTo('订单管理',{view:view})}>添加订单</div>
			</div>
			{view.state && view.state.GL_SK_DOC &&
				view.state.GL_SK_DOC.map((item, i) =>
					<div className="doc-main" key={i} style={{ borderBottom: '1px solid #F4F8F9' }}>
						<div className="doc-main-cell">
							<span className="cell-left-4">订单号: </span><span className="cell-right">D0{item.order_id}</span>
							<div className="doc-main-cell-abso">
							<Icon icon="md-minus-circle-outline" onClick={i => view.reduce_GL_SK(i)} />
							</div>
						</div>
						<div className="doc-main-cell">
							<span className="cell-left-4">报名人: </span><span className="cell-right">{item.employee_name}</span>
						</div>
						<div className="doc-main-cell">
							<span className="cell-left-4">供应商: </span><span className="cell-right">{item.pd_provider}</span>
						</div>
						<div className="doc-main-cell">
							<span className="cell-left-4">产品名称: </span><span className="cell-right">{item.pd_name}</span>
						</div>
						<div className="doc-main-cell">
							<span className="cell-left-4">客户简称: </span><span className="cell-right">{item.short_name}</span>
						</div>
						<div className="doc-main-cell-flex-3">
							<strong>应收: {item.receivable}</strong>
							<strong>已收: {item.received}</strong>
							<strong>未收: {item.receive_diff}</strong>
						</div>
						<div className="doc-main-cell">
							<span className="cell-left-4">本次收款: </span>
						<input className="cell-right-input" placeholder="请填写本次收款" style={{flex:'1'}}
						onChange={e => view.GL_SK_DOC_changePrice(e, i)} type="number" />
						</div>
					</div>
				)
			}
			<div className="doc-main-cell-right" style={{ fontSize: '.426667rem' }}>合计: {Math.round(view.state.GL_SK_DOC.reduce((acc, cur) => (cur.amount?cur.amount:0) - 0 + acc, 0) * 100) / 100}</div>
		</div>
	)
}



// ====================================================== 结算信息---------------------

export function billing_info_zj(data, view, mod, type) {
	return (
		<div className="doc-module">
			<div className="doc-title">
				<div className="jsxx">结算信息</div>
			</div>
			<div className="doc-main">
				<div className="doc-main-cell">
					{/* <span className="cell-left-5">结算方式:</span><span className="cell-right">{Enum.SettleWay[data.settle_way_id]}</span> */}
					<span className="cell-left-5">结算方式:</span>
					<select selected={data.settle_way_id}
						onChange={e => view.changeModMain(mod, 'settle_way_id', 0, e.target.value)}
						disabled={!view.edit} >
						{Object.keys(Enum.SettleWay).map(item =>
							<option value={item} key={item}>{Enum.SettleWay[item]}</option>
						)}
					</select>

				</div>
				<div className="doc-main-cell">
					<span className="cell-left-5">结算银行:</span><span className="cell-right">{Enum.SettleBank[data.settle_bank_id]}</span>
				</div>
				<div className="doc-main-cell">
					{/* <span className="cell-left-5">支票号:</span><span className="cell-right">{data.check_number}</span> */}
					<span className="cell-left-5">支票号:</span>
					<input className="cell-right"
						value={data.check_number}
						onChange={e => view.changeModMain(mod, 'check_number', 0, e.target.value)}
						disabled={!view.edit} />
				</div>
				<div className={(type === '汇款方名称' ? '' : 'hide') + " doc-main-cell"}>
					{/* <span className="cell-left-5">汇款方名称:</span><span className="cell-right">{data.remitter}</span> */}
					<span className="cell-left-5">汇款方名称:</span>
					<input className="cell-right"
						value={data.remitter}
						onChange={e => view.changeModMain(mod, 'remitter', 0, e.target.value)}
						disabled={!view.edit} />
				</div>
				<div className="doc-main-cell">
					{/* <span className="cell-left-5">结算币种:</span><span className="cell-right">{Enum.Currency[data.currency_id]}</span> */}
					<span className="cell-left-5">结算币种:</span>
					<select selected={data.currency_id}
						onChange={e => view.changeModMain(mod, 'currency_id', 0, e.target.value)}
						disabled={!view.edit} >
						{view.state.data && view.state.data['可选币种'] &&
							view.state.data['可选币种'].map(cell => Object.keys(Enum.Currency)[cell]).map(item =>
								<option value={item} key={item}>{Enum.Currency[item]}</option>
							)}
					</select>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-5">汇率:</span><span className="cell-right">{data.rate}</span>
				</div>
				<div className="doc-main-cell">
					{/* <span className="cell-left-5">本币金额:</span><span className="cell-right">{(data.settle_amount/data.rate).toFixed(2)}</span> */}
					<span className="cell-left-5">本币金额:</span>
					<input className="cell-right" type="number"
						// value={(parseInt((data.settle_amount / data.rate) * 100) / 100)}
						value={data.local_currency_total || ''}
						onChange={e => view.changeModMain(mod, 'local_currency_total', 0, (e.target.value * 1))}
						disabled={!view.edit} />
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-5">人民币金额:</span><span className="cell-right">{data.settle_amount}</span>
				</div>
			</div>
		</div>
	)
}

export function billing_info_yw(data, view, mod, type) {
	return (
		<div className="doc-module">
			<div className="doc-title">
				<div className="jsxx">结算信息</div>
			</div>
			<div className="doc-main">
				<div className="doc-main-cell">
					{/* <span className="cell-left-5">结算方式:</span><span className="cell-right">{Enum.SettleWay[data.settle_way_id]}</span> */}
					<span className="cell-left-5">结算方式:</span>
					<select selected={data.settle_way_id}
						onChange={e => view.changeModMain(mod, 'settle_way_id', 0, e.target.value)}
						disabled={!view.edit} >
						{Object.keys(Enum.SettleWayNonAccount).map(item =>
							<option value={item} key={item}>{Enum.SettleWayNonAccount[item]}</option>
						)}
					</select>

				</div>
				<div className="doc-main-cell">
					<span className="cell-left-5">结算银行:</span><span className="cell-right">{Enum.SettleBank[data.settle_bank_id]}</span>
				</div>
				<div className="doc-main-cell">
					{/* <span className="cell-left-5">支票号:</span><span className="cell-right">{data.check_number}</span> */}
					<span className="cell-left-5">支票号:</span>
					<input className="cell-right"
						value={data.check_number}
						onChange={e => view.changeModMain(mod, 'check_number', 0, e.target.value)}
						disabled={!view.edit} />
				</div>
				<div className={(type === '汇款方名称' ? '' : 'hide') + " doc-main-cell"}>
					{/* <span className="cell-left-5">汇款方名称:</span><span className="cell-right">{data.remitter}</span> */}
					<span className="cell-left-5">汇款方名称:</span>
					<input className="cell-right"
						value={data.remitter}
						onChange={e => view.changeModMain(mod, 'remitter', 0, e.target.value)}
						disabled={!view.edit} />
				</div>
				<div className="doc-main-cell">
					{/* <span className="cell-left-5">结算币种:</span><span className="cell-right">{Enum.Currency[data.currency_id]}</span> */}
					<span className="cell-left-5">结算币种:</span>
					<select selected={data.currency_id}
						onChange={e => view.changeModMain(mod, 'currency_id', 0, e.target.value)}
						disabled={!view.edit} >
						{view.state.data && view.state.data['可选币种'] &&
							view.state.data['可选币种'].map(cell => Object.keys(Enum.Currency)[cell]).map(item =>
							<option value={item} key={item}>{Enum.Currency[item]}</option>
						)}
					</select>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-5">汇率:</span><span className="cell-right">{data.rate}</span>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-5">本币金额:</span><span className="cell-right">{(data.settle_amount / data.rate).toFixed(2)}</span>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-5">人民币金额:</span><span className="cell-right">{data.settle_amount}</span>
				</div>
			</div>
		</div>
	)
}

// ============================================================入账详情================
export function fund_edit(data, view, mod) {
	return (
		<div className="doc-module">
			<div className="doc-title">
				<div className="rzxq">入账详情</div>
				<div className={view.edit ? "doc-title-right":"hide"}
					onClick={_ => goTo('资金认领列表', { view: view, mod: mod })}>添加订单</div>
			</div>
			{data.map((item, i) =>
				<div className="doc-main" key={i}>
					<div className="doc-main-cell">
						<span className="cell-left-4">入账编号:</span><span className="cell-right">{item.fund_num}</span>
					</div>
					<div className="doc-main-cell">
						<span className="cell-left-4">结算方式:</span><span className="cell-right">{Enum.SettleWay[item.settle_way_id]}</span>
					</div>
					<div className="doc-main-cell">
						<span className="cell-left-4">结算银行:</span><span className="cell-right">{Enum.SettleBank[item.settle_bank_id]}</span>
					</div>
					<div className="doc-main-cell">
						<span className="cell-left-4">结算日期:</span><span className="cell-right">{item.settle_date}</span>
					</div>
					<div className="doc-main-cell">
						<span className="cell-left-4">汇款方名称:</span><span className="cell-right">{item.remitter}</span>
					</div>
					<div className="doc-main-cell">
						<span className="cell-left-4">结汇金额:</span><span className="cell-right">{item.exchange_amount}</span>
					</div>
					<div className="doc-main-cell">
						<span className="cell-left-4">已用金额:</span><span className="cell-right">{item.used}</span>
					</div>
					<div className="doc-main-cell">
						<span className="cell-left-4">未用金额:</span><span className="cell-right">{item.used_diff}</span>
					</div>
					<div className="doc-main-cell">
						<span className="cell-left-4">认领人:</span><span className="cell-right">{item.claimed_name}</span>
					</div>
					<div className="doc-main-cell-right" style={{ borderBottom: '1px solid #F4F8F9' }}>
						<span>本次收款:{item.amount}</span>
					</div>
				</div>
			)}
			<div className="doc-main-cell-right" style={{ fontSize: '.426667rem' }}>合计: {Math.round(data.reduce((acc, cur) => cur.amount - 0 + acc, 0) * 100) / 100}</div>
		</div>
	);
}