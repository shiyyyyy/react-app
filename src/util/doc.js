import React from 'react';
import {Enum} from '../util/core';

import '../css/Doc.css'

//  Doc  组件
// 基础信息组件 1
export function basis(data){
    return (
        <div className="doc-module">
			<div className="doc-title">基础信息</div>
			<div className="doc-main">
				<div className="doc-main-cell">
					<span className="cell-left-4">单据类型:</span><span className="cell-right">{Enum.Doc[data.doc_type_id]}</span>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-4">单据编号:</span><span className="cell-right">{data.id}</span>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-4">制单人:</span><span className="cell-right">{data.company_name}-{data.department_name}-{data.employee_name}</span>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-4">结算金额:</span><span className="cell-right">{data.settle_amount} &nbsp; &nbsp; ({data.cn_settle_amount})</span>
				</div>
			</div>
		</div>
    );
}

export function fund(data){
    return (
        <div className="doc-module">
			<div className="doc-title">入账详情</div>
			<div className="doc-main">
				<div className="doc-main-cell">
					<span className="cell-left-4">入账编号:</span><span className="cell-right">{data.fund_num}</span>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-4">结算方式:</span><span className="cell-right">{Enum.SettleWay[data.settle_way_id]}</span>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-4">结算银行:</span><span className="cell-right">{Enum.SettleBank[data.settle_bank_id]}</span>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-4">结算日期:</span><span className="cell-right">{data.settle_date}</span>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-4">汇款方名称:</span><span className="cell-right">{data.remitter}</span>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-4">结汇金额:</span><span className="cell-right">{data.exchange_amount}</span>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-4">已用金额:</span><span className="cell-right">{data.used}</span>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-4">未用金额:</span><span className="cell-right">{data.used_diff}</span>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-4">认领人:</span><span className="cell-right">{data.claimed_name}</span>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-4">本次收款:</span><span className="cell-right">{data.amount}</span>
				</div>
			</div>
		</div>
    );
}

// 基础信息组件 2
export function basis1(data){
    return (
        <div className="doc-module">
			<div className="doc-title">基础信息</div>
			<div className="doc-main">
				<div className="doc-main-cell">
					<span className="cell-left-4">单据类型:</span><span className="cell-right">资金内转单</span>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-4">单据编号:</span><span className="cell-right">ZC0923145</span>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-4">制单人:</span><span className="cell-right">门管中心-亮马桥门市-张三</span>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-4">转出信息:</span><span className="cell-right">门管中心-亮马桥门市-张三</span>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-4">转入信息:</span><span className="cell-right">门管中心-亮马桥门市-李思思</span>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-4">结算金额:</span><span className="cell-right">2768432.00 &nbsp; &nbsp; (三十二亿两千八百六十四万佰八十五万玖仟陆佰肆拾叁)</span>
				</div>
			</div>
		</div>
    );
}

// 结算信息组件 (内转单没有这个)
export function billing_info(data) {
    return(
		<div className="doc-module">
			<div className="doc-title">结算信息</div>
			<div className="doc-main">
				<div className="doc-main-cell">
					<span className="cell-left-5">结算方式:</span><span className="cell-right">{Enum.SettleWay[data.settle_way_id]}</span>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-5">结算银行:</span><span className="cell-right">{Enum.SettleBank[data.settle_bank_id]}</span>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-5">支票号:</span><span className="cell-right">{data.check_number}</span>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-5">结算币种:</span><span className="cell-right">{Enum.Currency[data.currency_id]}</span>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-5">汇率:</span><span className="cell-right">{data.rate}</span>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-5">本币金额:</span><span className="cell-right">{(data.settle_amount/data.rate).toFixed(2)}</span>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-5">人民币金额:</span><span className="cell-right">{data.settle_amount}</span>
				</div>
			</div>
		</div>
    )
}

// 应收明细
export function receivable_detail(data){
    return(
        <div className="doc-module">
        <div className="doc-title">应收明细</div>
        	{
				data.map((item,i)=>
				<div className="doc-main" key={i} style={{borderBottom: '1px solid #F4F8F9'}}>
					<div className="doc-main-cell">
						<span className="cell-left-4">订单号: </span><span className="cell-right">D0{item.order_id}</span> 
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
					<div className="doc-main-cell">
						<span className="cell-left-4">应收: {item.receivable}</span>
						<span className="cell-left-4">已收: {item.received}</span> 
						<span className="cell-left-4">未收: {item.receive_diff}</span>
					</div>
					<div className="doc-main-cell-right">
						<span>本次收款: {item.amount}</span>
		            </div>
				</div>
				)
			}
			<div className="doc-main-cell-right" style={{fontSize: '.426667rem'}}>合计: {data[0].amount}</div>
    </div>
    )
}

// 应付明细
export function payable_detail(data){
    return(
    	<div className="doc-module">
        <div className="doc-title">应付明细</div>
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
						<span className="cell-left-4">报名人: </span><span className="cell-right">{item.employee_name}</span>
					</div>
					<div className="doc-main-cell-flex-3">
						<strong className="cell-left-4">应转: {item.settle_amount}</strong> 
						<strong className="cell-left-4">已转: {item.settled_amount}</strong>
						<strong className="cell-left-4">未转: {item.settle_diff}</strong> 
					</div>
					<div className="doc-main-cell">
						<span className="cell-left-4">结算对象: </span><span className="cell-right">{item.settle_obj}</span>
					</div>
					<div className="doc-main-cell-flex-3">
						<strong className="cell-left-4">应付: {item.payable}</strong> 
						<strong className="cell-left-4">已付: {item.paid}</strong>
				    	<strong className="cell-left-4">未付: {item.pay_diff}</strong> 
					</div>
					<div className="doc-main-cell-right">
						<span>本次支出: {item.amount}</span>					
		            </div>
				</div>
				)
			}
			<div className="doc-main-cell-right" style={{fontSize: '.426667rem'}}>合计: { data.reduce( (acc,cur)=> cur.amount-0+acc, 0 ) }</div>
    </div>
    )
}

export function account_info(data){
	return(
		<div className="doc-module">
			<div className="doc-title">汇款账号</div>
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
			<div className="doc-title">对方账户</div>
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
			<div className="doc-title">调用单据</div>
			<div className="doc-main">
				<div className="doc-main-cell">
					<span className="cell-left-4">单据编号:</span><span className="cell-right">{data.doc_id}</span>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-4">单据类型:</span><span className="cell-right">{Enum.Doc[data.doc_type_id]}</span>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-4">制单人:</span><span className="cell-right">{data.company_name}-{data.department_name}-{data.employee_name}</span>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-4">部门编号:</span><span className="cell-right">{data.code}</span>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-4">结算对象:</span><span className="cell-right">{data.settle_obj}</span>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-4">结算金额:</span><span className="cell-right">{data.settle_amount}</span>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-4">已用金额:</span><span className="cell-right">{data.used}</span>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-4">超支金额:</span><span className="cell-right">{data.excess_amount}</span>
				</div>
				<div className="doc-main-cell-flex-3">
				</div>
				<div className="doc-main-cell-right">本次调用: <span style={{fontSize:'.373333rem'}}>{data.amount}</span></div>
			</div>
		</div>
    )
}


// 退款明细
export function refund_detail(data){
    return(
        <div className="doc-module">
			<div className="doc-title">退款明细</div>
			<div className="doc-main">
				<div className="doc-main-cell">
					<span className="cell-left-4">订单号:</span><span className="cell-right">D09323</span>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-4">报名人:</span><span className="cell-right">门光中心-亮马桥门市-张三拿伞</span>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-4">供应商:</span><span className="cell-right">南亚风琴</span>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-4">产品名称:</span><span className="cell-right">新疆西藏西双版纳</span>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-4">出团日期:</span><span className="cell-right">2018-09-08</span>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-4">当时收款:</span><span className="cell-right">9500</span>
				</div>
				<div className="doc-main-cell-right" style={{borderBottom: '1px solid #F4F8F9'}}>本次支出: <span style={{fontSize:'.373333rem'}}>17999.00</span></div>
				<div className="doc-main-cell-right" style={{fontWeight: 'blod', fontSize: '.426667rem'}}>合计: 17999.00</div>
			</div>
		</div>
    )
}

// 内转明细
export function nz_detail(data){
	return(
        <div className="doc-module">
        <div className="doc-title">内转明细</div>
        <div className="doc-main">
        	{
				data.map((item,i)=>
					<div key={i}>
					<span>出团日期:{item.dep_date}</span> &nbsp;&nbsp;&nbsp; <span>产品名称:{item.pd_name}</span>
					<span>订单号: D0{item.order_id}</span> &nbsp;&nbsp;&nbsp; <span>报名人:{item.employee_name}</span>
					<span>开团人: {item.group_employee_name}</span> &nbsp;&nbsp;&nbsp; <span>结算对象:{item.settle_obj}</span>
					<span>应付/转: {item.payable}</span> &nbsp;&nbsp;&nbsp; <span>已付/转:{item.paid}</span>
				    <span>未付/转:{item.pay_diff}</span>&nbsp;&nbsp;&nbsp; <span>本次支出:{item.amount}</span>					
		            </div>
				)
			}
        </div>
    </div>
    )
}

//资金内转明细
export function zjnz_detail(data){
	return(
        <div className="doc-module">
        <div className="doc-title">转款明细</div>
        <div className="doc-main">
        	{
				data.map((item,i)=>
					<div key={i}>
					<span>转入中心:{item.company_name}</span> &nbsp;&nbsp;&nbsp; <span>转入部门:{item.department_name}</span>
					<span>转入部门编号:{item.department_code}</span> &nbsp;&nbsp;&nbsp; <span>转入金额:{item.amount}</span>
					<span>转出中心: {Enum.Company[item.out_company_id]}</span> &nbsp;&nbsp;&nbsp; <span>转出部门:{Enum.Department[item.out_department_id]}</span>
					<span>转出部门编号: {item.out_department_code}</span> &nbsp;&nbsp;&nbsp; <span>转出部门员工:{Enum.Employee[item.nz_pay_employee_id]}</span>
				    <span>转出金额:{item.out_amount}</span>					
		            </div>
				)
			}
        </div>
    </div>
    )
}

//退款订单
export function tk_detail(data){
	return(
        <div className="doc-module">
        <div className="doc-title">退款明细</div>
        <div className="doc-main">
        	{
				data.map((item,i)=>
					<div key={i}>
					<span>出团日期:{item.dep_date}</span> &nbsp;&nbsp;&nbsp; <span>产品名称:{item.pd_name}</span>
					<span>产品提供方:{item.pd_provider}</span>&nbsp;&nbsp;&nbsp;<span>订单号: D0{item.order_id}</span>
					<span>报名人:{item.employee_name}</span>&nbsp;&nbsp;&nbsp;<span>客户简称: {item.short_name}</span>
					<span>当时收款:{item.received}</span>&nbsp;&nbsp;&nbsp;<span>本次退款:{item.amount}</span>				
		            </div>
				)
			}
        </div>
    </div>
    )
}

//退回核算
export function th_detail(data){
	return(
        <div className="doc-module">
        <div className="doc-title">退回明细</div>
        <div className="doc-main">
        	{
				data.map((item,i)=>
					<div key={i}>
					<span>出团日期:{item.dep_date}</span> &nbsp;&nbsp;&nbsp; <span>产品名称:{item.pd_name}</span>
					<span>订单号: D0{item.order_id}</span> &nbsp;&nbsp;&nbsp; <span>报名人:{Enum.FullEmployee[item.sign_up_employee_id]}</span>
					<span>结算对象:{item.settle_obj}</span><span>应付: {item.payable}</span> &nbsp;&nbsp;&nbsp; <span>已付:{item.paid}</span>
				    <span>未付:{item.pay_diff}</span>&nbsp;&nbsp;&nbsp; <span>当时支出:{item.amount}</span>					
		            </div>
				)
			}
        </div>
    </div>
    )
}

// 退款调用收款
export function tk_call_sk(data){
    return(
		<div className="doc-module">
			<div className="doc-title">调用单据</div>
			<div className="doc-main">
				<div className="doc-main-cell">
					<span className="cell-left-4">单据类型:</span><span className="cell-right">{Enum.Doc[data.doc_type_id]}</span>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-4">单据编号:</span><span className="cell-right">{data.doc_id}</span>
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
					<span className="cell-left-4">已开票额:</span><span className="cell-right">{data.invoice_amount}</span>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-4">已开票额:</span><span className="cell-right">{Enum.Flow[data.flow]}</span>
				</div>
			</div>
		</div>
    )
}

// 资金退回调用单据
export function th_call_doc(data){
    return(
		<div className="doc-module">
			<div className="doc-title">调用单据</div>
			<div className="doc-main">
				<div className="doc-main-cell">
					<span className="cell-left-4">单据类型:</span><span className="cell-right">{Enum.Doc[data.doc_type_id]}</span>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-4">单据编号:</span><span className="cell-right">{data.id}</span>
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
					<span className="cell-left-4">已开票额:</span><span className="cell-right">{Enum.Flow[data.flow]}</span>
				</div>
			</div>
		</div>
    )
}

// 资金退回调用单据
export function hk_call_doc(data){
    return(
		<div className="doc-module">
			<div className="doc-title">借款详情</div>
			<div className="doc-main">
				<div className="doc-main-cell">
					<span className="cell-left-4">单据类型:</span><span className="cell-right">{Enum.Doc[data.doc_type_id]}</span>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-4">单据编号:</span><span className="cell-right">{data.id}</span>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-4">制单人:</span><span className="cell-right">{data.company_name}-{data.department_name}-{data.employee_name}</span>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-4">部门编号:</span><span className="cell-right">{data.code}</span>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-4">结算对象:</span><span className="cell-right">{data.settle_obj}</span>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-4">结算金额:</span><span className="cell-right">{data.settle_amount}</span>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-4">可交票额:</span><span className="cell-right">{data.invoice_total}</span>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-4">未交票额:</span><span className="cell-right">{data.invoice_remain}</span>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-4">结算方式:</span><span className="cell-right">{Enum.SettleWay[data.settle_way_id]}</span>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-4">审批状态:</span><span className="cell-right">{Enum.Flow[data.flow]}</span>
				</div>
				<div className="doc-main-cell-flex-3">
				</div>
				<div className="doc-main-cell-right">本次还款: <span style={{fontSize:'.373333rem'}}>{data.amount}</span></div>
			</div>
		</div>
    )
}

// 调整单据
export function tz_call_doc(data){
    return(
		<div className="doc-module">
			<div className="doc-title">借款详情</div>
			<div className="doc-main">
				<div className="doc-main-cell">
					<span className="cell-left-4">单据类型:</span><span className="cell-right">{Enum.Doc[data.doc_type_id]}</span>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-4">单据编号:</span><span className="cell-right">{data.id}</span>
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
			<div className="doc-title">扣款详情</div>
			{
				data.map((item,i)=>
				<div key={i}>
					<span >单据编号: {item.id}</span> &nbsp;&nbsp;&nbsp; <span>被扣部门:{Enum.Department[item.pay_department_id]}</span>
					<span>部门编号: {item.code}</span> &nbsp;&nbsp;&nbsp; <span>扣款金额:{item.settle_amount}</span>
					<div>扣款说明: {item.deduct_comment}</div>
				</div>
				)
			}
		</div>
    )
}

// 单据备注 
export function documents_note(data){
    return(
        <div className="doc-module">
			<div className="doc-title">单据备注</div>
			{
				data.map((item,i)=>
				<div className="doc-main"  key={i}>
					<div className="doc-main-cell">
						<span className="cell-left-4">备注人: </span> <span className="cell-right" style={{whiteSpace: 'normal',lineHeight: '.533333rem', padding: '.213333rem .426667rem .213333rem 0'}}> {item.employee_name} &nbsp;&nbsp;&nbsp; {item.create_at}</span><br />
					</div>
					<div className="doc-main-cell">
						<span className="cell-left-4">内容:  </span> <span className="cell-right" style={{whiteSpace: 'normal',lineHeight: '.533333rem', padding: '.213333rem .426667rem .213333rem 0'}}>{item.comment}</span>
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
            <div className="doc-title">审批记录</div>
            <div className="doc-main-cell-num" style={{color: '#000', fontWeight: '700'}}><span>操作人</span><span>审批意见</span><span>审批备注</span><span>操作时间</span></div>
            {data.map((item,i) => !item.editable &&
                <div className="doc-main-cell-num" key={i}><span>{item.employee_name}</span><span>{Enum.Opinion[item.opinion]}</span><span>{item.comment}</span><span>{(item.create_at)}</span></div>
			)}
        </div>
    )
}


// 操作按钮
export function action_btn(view){
    return(
        <div className="doc-btn-box">
            <div className="doc-btn-default">备注</div>
            <button className="doc-btn-submit" onClick={_=>view.approve(0)}>不通过</button>
            <button className="doc-btn-submit" onClick={_=>view.approve(1)}>通过</button>
        </div>
    )
}


// 