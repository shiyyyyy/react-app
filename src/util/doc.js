import React from 'react';


//  Doc  组件
// 基础信息组件 1
export function basis(data){
    return (
        <div className="doc-module">
			<div className="doc-title">基础信息</div>
			<div className="doc-main">
				<div className="doc-main-cell">
					<span className="cell-left-4">单据类型:</span><span className="cell-right">业务借款单|||</span>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-4">单据编号:</span><span className="cell-right">ZC0923145|||</span>
				</div>
				{/* <div className="doc-main-cell">
					<span className="cell-left-4">制单人:</span><span className="cell-right">{data['资金借款单据信息'][0].company_name}-{data['资金借款单据信息'][0].department_name}-{data['资金借款单据信息'][0].employee_name}</span>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-4">结算金额:</span><span className="cell-right">{data['资金借款单据信息'][0].invoice_total} &nbsp; &nbsp; ({data['资金借款单据信息'][0].cn_settle_amount})</span>
				</div> */}
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
					<span className="cell-left-5">结算方式:</span><span className="cell-right">国内汇款|||</span>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-5">结算银行:</span><span className="cell-right">农业银行|||</span>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-5">支票号:</span><span className="cell-right">0235-2847-5273-5589|||</span>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-5">结算币种:</span><span className="cell-right">人民币|||</span>
				</div>
				{/* <div className="doc-main-cell">
					<span className="cell-left-5">汇率:</span><span className="cell-right">{data['资金借款结算信息'][0].rate}</span>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-5">本币金额:</span><span className="cell-right">{data['资金借款结算信息'][0].invoice_total}</span>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-5">人民币金额:</span><span className="cell-right">{data['资金借款结算信息'][0].invoice_total}</span>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-5">开户行:</span><span className="cell-right">农业银行|||</span>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-5">收款方名称:</span><span className="cell-right">{data['资金借款结算信息'][0].to_user_name}</span>
				</div> */}
				<div className="doc-main-cell">
					<span className="cell-left-5">账号:</span><span className="cell-right">123434313413412341234|||</span>
				</div>
			</div>
		</div>
    )
}



// 应付明细!/调用单据 组件
// 应付明细(借款单叫 应付明细,内转单叫 转款明细)
export function cope_detail(data){
    return(
        <div className="doc-module">
        <div className="doc-title">{ 1===1 ?'转款明细':'应付明细'}</div>
        <div className="doc-main">
        {/* 这里如果返回的是数组,应该遍历 */}
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
            {/* <div className="doc-main-cell-flex-3">
            {Object.keys(this.state['订单应转']).map( item => 
                <strong>
                {item === 'receivable' ? '应转':''}
                {item === 'receivad' ? '已转':''}
                {item === 'uncollected' ? '未转':''}
                : <e>{this.state['订单应转'][item]}</e></strong>
            )}
            </div> */}
			
			{/* 转款明细没有 应付 */}
			{/* <div className="doc-main-cell-flex-3">
            {Object.keys(this.state['订单应付']).map( item => 
                <strong>
                {item === 'receivable' ? '应付':''}
                {item === 'receivad' ? '已付':''}
                {item === 'uncollected' ? '未付':''}
                : <e>{this.state['订单应付'][item]}</e></strong>
            )}
            </div> */}
            <div className="doc-main-cell-right" style={{borderBottom: '1px solid #F4F8F9'}}>本次支出: <span style={{fontSize:'.373333rem'}}>17999.00</span></div>
        {/*  */}
            <div className="doc-main-cell-right" style={{fontWeight: 'blod', fontSize: '.426667rem'}}>合计: 288888.00</div>
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
					<span className="cell-left-4">单据编号:</span><span className="cell-right">D09323</span>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-4">单据类型:</span><span className="cell-right">新疆西藏西双版纳</span>
				</div>
				<div className="doc-main-cell">
					<span className="cell-left-4">制单人:</span><span className="cell-right">门光中心-亮马桥门市-张三拿伞</span>
				</div>
				<div className="doc-main-cell-flex-3">
				{/* {Object.keys(this.state['订单应转']).map( item => 
					<strong>
					{item === 'receivable' ? '结算金额':''}
					{item === 'receivad' ? '已用金额':''}
					{item === 'uncollected' ? '超支金额':''}
					: <e>{this.state['订单应转'][item]}</e></strong>
				)} */}
				</div>
				<div className="doc-main-cell-right">本次调用: <span style={{fontSize:'.373333rem'}}>17999.00</span></div>
				<div className="doc-main-cell-right" style={{fontWeight: 'blod', fontSize: '.426667rem'}}>合计: 17999.00</div>
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


// 单据备注 
export function documents_note(data){
    return(
        <div className="doc-module">
			<div className="doc-title">单据备注</div>
			<div className="doc-main-cell-flex-3">
				<strong>收:    <e>2000</e></strong>
				<strong>付:    <e>2000</e></strong>
				<strong>利润:  <e>2000</e></strong>
			</div>
		</div>
    )
}

// 审批记录
export function record(data){
    return(
        <div className="doc-module">
            <div className="doc-title">审批记录</div>
            <div className="doc-main-cell-num" style={{color: '#000', fontWeight: '700'}}><span>操作人</span><span>审批意见</span><span>审批备注</span><span>操作时间</span></div>
            {/* {data['审批记录'].map( item => 
                <div className="doc-main-cell-num"><span>{item.employee_name}</span><span>提交</span><span>没有</span><span>{(item.create_at)}</span></div>
            )} */}
        </div>
    )
}


// 操作按钮
export function action_btn(data){
    return(
        <div className="doc-btn-box">
            <div className="doc-btn-default">备注</div>
            <div className="doc-btn-default">不通过</div>
            <div className="doc-btn-submit">通过</div>
        </div>
    )
}


// 