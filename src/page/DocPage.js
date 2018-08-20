import React, { Component,Fragment} from 'react';
import {log,post,trigger,AppCore,AppMeta,loadIfEmpty,get_req_data,goBack,submit,reload} from '../util/core';
import {error,nonBlockLoading,info,ErrorBoundary} from '../util/com';
import { connect } from 'react-redux';

import {Page,Button,Input,AlertDialog,AlertDialogButton} from 'react-onsenui';
import * as doc from '../util/doc'

export default class DocPageWrap extends Component {
    constructor(props) {
    	super(props);
    }

    render() {
	  return (
	  		<ErrorBoundary><DocPageInject p={this.props.p} /></ErrorBoundary>
	  )
  }  
}


class DocPageRender extends Component{

	constructor(props) {
		super(props);
		this.state = {dialog:false};
		this.action = props.p.action;
		this.pre_view = props.p.pre_view;
	}

	renderToolbar(){
		return (
		  	<ons-toolbar>
		  	  <div className='left'><ons-back-button></ons-back-button></div>
		      <div className={(AppCore.os === 'ios'?"":"Andriod-title")+" center"}>{this.props.p.action}</div>
		  	</ons-toolbar>
		);
	}

	onError(error, errorInfo){
		this.setState({data:undefined})
	}

	approve(opinion){
		let data = this.state.data;
	    data['审批记录'].forEach(item=>{
	        if(item.editable){
	            item.opinion = opinion;
	            item.comment = this.state.comment;
	        }
	    });

	    this.setState({dialog:false,data:data});
	    trigger('加载等待');
	    submit(
	    	this, 
	    	_ => info('审批完成').then(
				_=>{
    				goBack();
    				reload(this.pre_view);
    				trigger('加载等待');
				}
			) 
	    );
	}

	render(){

		return (
			<Page 
				renderToolbar={_=>this.renderToolbar()} 
				onShow={_=>loadIfEmpty(this)}>
				{
				  	this.state.loading && nonBlockLoading()

				}
				{
					this.props.p.action === '资金收款审批' && this.state.data &&
					<div className="doc">

						{/* 基础信息 */}
						{doc.basis(this.state.data['单据信息'][0])}

						{/*入账详情-查看*/}
						{
							this.state.data['入账详情-查看'] &&
							// doc.fund(this.state.data['入账详情-查看'][0])
							doc.fund(this.state.data['入账详情-查看'])
						}

						{/* 结算信息 */}
						{
							this.state.data['资金收款结算信息'] &&
							doc.billing_info(this.state.data['资金收款结算信息'][0],'汇款方名称')
						}

						{/* 单据备注 */}
						{doc.documents_note(this.state.data['单据备注'])}

						{/* 审批记录 */}
						{doc.record(this.state.data['审批记录'])}

					</div>
				}
				{
					this.props.p.action === '业务收款审批' && this.state.data &&
					<div className="doc">

						{/* 基础信息 */}
						{doc.basis(this.state.data['单据信息'][0])}

						{/*入账详情-查看*/}
						{
							this.state.data['入账详情-查看'] &&
							// doc.fund(this.state.data['入账详情-查看'][0])
							doc.fund(this.state.data['入账详情-查看'])
						}

						{/* 结算信息 */}
						{
							this.state.data['业务收款结算信息'] &&
							doc.billing_info(this.state.data['业务收款结算信息'][0],'汇款方名称')
						}

						{/* 订单信息 */}
						{doc.receivable_detail(this.state.data['收款订单'])}

						{/* 单据备注 */}
						{doc.documents_note(this.state.data['单据备注'])}

						{/* 审批记录 */}
						{doc.record(this.state.data['审批记录'])}

					</div>
				}
				{
					this.props.p.action === '业务借款审批' && this.state.data &&
					<div className="doc">

						{/* 基础信息 */}
						{doc.basis(this.state.data['单据信息'][0])}

						{/* 结算信息 */}
						{doc.billing_info(this.state.data['借款结算信息'][0])}

						{/* 汇款账号 */}
						{doc.account_info(this.state.data['汇款账号'][0])}

						{/*应付明细*/}
						{doc.payable_detail(this.state.data['借款核算'])}

						{/* 单据备注 */}
						{doc.documents_note(this.state.data['单据备注'])}

						{/* 审批记录 */}
						{doc.record(this.state.data['审批记录'])}

					</div>
				}
				{
					this.props.p.action === '资金借款审批' && this.state.data &&
					<div className="doc">

						{/* 基础信息 */}
						{doc.basis(this.state.data['资金借款单据信息'][0])}

						{/*支出关联单据*/}
						{
							this.state.data['支出关联单据'] &&
							// this.state.data['支出关联单据'][0] &&
							doc.call_documents(this.state.data['支出关联单据'])
						}

						{/* 结算信息 */}
						{doc.billing_info(this.state.data['资金借款结算信息'][0])}

						{/* 汇款账号 */}
						{doc.account_info(this.state.data['汇款账号'][0])}

						{/* 单据备注 */}
						{doc.documents_note(this.state.data['单据备注'])}

						{/* 审批记录 */}
						{doc.record(this.state.data['审批记录'])}

					</div>
				}
				{
					this.props.p.action === '业务支出审批' && this.state.data &&
					<div className="doc">

						{/* 基础信息 */}
						{doc.basis(this.state.data['单据信息'][0])}

						{/* 结算信息 */}
						{doc.billing_info(this.state.data['支出结算信息'][0],'业务支出')}

						{/* 汇款账号 */}
						{doc.account_info(this.state.data['汇款账号'][0])}

						{/*支出核算*/}
						{doc.payable_detail(this.state.data['支出核算'])}

						{/* 单据备注 */}
						{doc.documents_note(this.state.data['单据备注'])}

						{/* 审批记录 */}
						{doc.record(this.state.data['审批记录'])}

					</div>
				}
				{
					this.props.p.action === '资金支出审批' && this.state.data &&
					<div className="doc">

						{/* 基础信息 */}
						{doc.basis(this.state.data['资金支出单据信息'][0])}

						{/*支出关联单据*/}
						{
							this.state.data['支出关联单据'] &&
							// this.state.data['支出关联单据'][0] &&
							doc.call_documents(this.state.data['支出关联单据'])
						}

						{/* 结算信息 */}
						{doc.billing_info(this.state.data['资金支出结算信息'][0])}

						{/* 汇款账号 */}
						{doc.account_info(this.state.data['汇款账号'][0])}

						{/* 单据备注 */}
						{doc.documents_note(this.state.data['单据备注'])}

						{/* 审批记录 */}
						{doc.record(this.state.data['审批记录'])}

					</div>
				}
				{
					this.props.p.action === '业务内转审批' && this.state.data &&
					<div className="doc">

						{/* 基础信息 */}
						{doc.basis(this.state.data['业务内转单据信息'][0], '业务内转')}

						{/*内转明细*/}
						{doc.nz_detail(this.state.data['内转核算'])}

						{/* 单据备注 */}
						{doc.documents_note(this.state.data['单据备注'])}

						{/* 审批记录 */}
						{doc.record(this.state.data['审批记录'])}

					</div>
				}
				{
					this.props.p.action === '资金内转审批' && this.state.data &&
					<div className="doc">

						{/* 基础信息 */}
						{doc.basis(this.state.data['单据信息'][0])}

						{/*转款明细*/}
						{doc.zjnz_detail(this.state.data['转款明细'])}

						{/* 单据备注 */}
						{doc.documents_note(this.state.data['单据备注'])}

						{/* 审批记录 */}
						{doc.record(this.state.data['审批记录'])}

					</div>
				}
				{
					this.props.p.action === '退业务收款审批' && this.state.data &&
					<div className="doc">

						{/* 基础信息 */}
						{doc.basis(this.state.data['单据信息'][0])}

						{/* 退款单结算信息 */}
						{doc.billing_info(this.state.data['退款单结算信息'][0])}

						{/* 退款调用收款 */}
						{doc.tk_call_sk(this.state.data['退款调用收款'])}

						{/* 退款订单 */}
						{doc.tk_detail(this.state.data['退款订单'])}

						{/* 对方账户 */}
						{doc.to_account_info(this.state.data['对方账户'][0])}

						{/* 单据备注 */}
						{doc.documents_note(this.state.data['单据备注'])}

						{/* 审批记录 */}
						{doc.record(this.state.data['审批记录'])}

					</div>
				}
				{
					this.props.p.action === '退资金收款审批' && this.state.data &&
					<div className="doc">

						{/* 基础信息 */}
						{doc.basis(this.state.data['单据信息'][0])}

						{/*退款单结算信息*/}
						{doc.billing_info(this.state.data['资金退款单结算信息'][0])}

						{/*退款调用收款*/}
						{doc.tk_call_sk(this.state.data['退款调用资金收款'],'资金退款')}

						{/*对方账户*/}
						{doc.to_account_info(this.state.data['对方账户'][0])}

						{/* 单据备注 */}
						{doc.documents_note(this.state.data['单据备注'])}

						{/* 审批记录 */}
						{doc.record(this.state.data['审批记录'])}

					</div>
				}
				{
					this.props.p.action === '业务退回审批' && this.state.data &&
					<div className="doc">

						{/* 基础信息 */}
						{doc.basis(this.state.data['单据信息'][0])}

						{/*入账详情-查看*/}
						{
							this.state.data['入账详情-查看'] &&
							doc.fund(this.state.data['入账详情-查看'])
						}

						{/*业务退回结算信息*/}
						{
							this.state.data['业务退回结算信息'] &&
							doc.billing_info(this.state.data['业务退回结算信息'][0],'汇款方名称')
						}

						{/*业务退回调用单据*/}
						{doc.th_call_doc(this.state.data['业务退回调用单据'][0])}

						{/*退回核算*/}
						{doc.th_detail(this.state.data['退回核算'])}

						{/* 单据备注 */}
						{doc.documents_note(this.state.data['单据备注'])}

						{/* 审批记录 */}
						{doc.record(this.state.data['审批记录'])}

					</div>
				}
				{
					this.props.p.action === '资金退回审批' && this.state.data &&
					<div className="doc">

						{/* 基础信息 */}
						{doc.basis(this.state.data['单据信息'][0])}

						{/*入账详情-查看*/}
						{
							this.state.data['入账详情-查看'] &&
							doc.fund(this.state.data['入账详情-查看'])
						}

						{/*资金退回结算信息*/}
						{
							this.state.data['资金退回结算信息'] &&
							doc.billing_info(this.state.data['资金退回结算信息'][0],'汇款方名称')
						}

						{/*资金退回调用单据*/}
						{doc.th_call_doc(this.state.data['资金退回调用单据'][0])}

						{/* 单据备注 */}
						{doc.documents_note(this.state.data['单据备注'])}

						{/* 审批记录 */}
						{doc.record(this.state.data['审批记录'])}

					</div>
				}
				{
					this.props.p.action === '工资审批' && this.state.data &&
					<div className="doc">

						{/* 基础信息 */}
						{doc.basis(this.state.data['工资单单据信息'][0])}

						{/* 结算信息 */}
						{doc.billing_info(this.state.data['工资单结算信息'][0])}

						{/* 汇款账号 */}
						{doc.account_info(this.state.data['汇款账号'][0])}

						{/* 单据备注 */}
						{doc.documents_note(this.state.data['单据备注'])}

						{/* 审批记录 */}
						{doc.record(this.state.data['审批记录'])}

					</div>
				}
				{
					this.props.p.action === '还款审批' && this.state.data &&
					<div className="doc">

						{/* 基础信息 */}
						{doc.basis(this.state.data['单据信息'][0])}

						{/* 还款调用借款 */}
						{doc.hk_call_doc(this.state.data['还款调用借款'])}

						{/* 单据备注 */}
						{doc.documents_note(this.state.data['单据备注'])}

						{/* 审批记录 */}
						{doc.record(this.state.data['审批记录'])}

					</div>
				}
				{
					this.props.p.action === '扣款审批' && this.state.data &&
					<div className="doc">

						{/* 基础信息 */}
						{doc.basis(this.state.data['扣款单据信息'][0])}

						{/* 扣款详情 */}
						{doc.kk_info(this.state.data['扣款详情'])}

						{/* 单据备注 */}
						{doc.documents_note(this.state.data['单据备注'])}

						{/* 审批记录 */}
						{doc.record(this.state.data['审批记录'])}

					</div>
				}
				{
					this.props.p.action === '调整审批' && this.state.data &&
					<div className="doc">

						{/* 基础信息 */}
						{doc.basis(this.state.data['调整单据信息'][0])}

						{/* 调整单据 */}
						{doc.tz_call_doc(this.state.data['调整单据'][0])}

						{/* 单据备注 */}
						{doc.documents_note(this.state.data['单据备注'])}

						{/* 审批记录 */}
						{doc.record(this.state.data['审批记录'])}
						
					</div>
				}

				{
					this.state.data &&
					<section className="doc-approve-btn-box">
						<button onClick={_=>this.setState({dialog:true})}>审批</button>
					</section>
				}
		        <AlertDialog isOpen={this.state.dialog} isCancelable={false} modifier="rowfooter">
		          <div className='alert-dialog-title'>审批意见</div>
		          <div className='alert-dialog-content'>
		            <Input value={this.state.comment} onChange={ e=>this.setState({comment:e.target.value}) }  modifier="underbar" float></Input>
		          </div>
		          <div className='alert-dialog-footer'>
		            <AlertDialogButton onClick={_=>this.setState({dialog:false})} modifier="rowfooter" >
		              取消
		            </AlertDialogButton>
		            <AlertDialogButton onClick={_=>this.approve(2)} modifier="rowfooter" >
		              不通过
		            </AlertDialogButton>
		            <AlertDialogButton onClick={_=>this.approve(1)} modifier="rowfooter" >
		              通过
		            </AlertDialogButton>
		          </div>
		        </AlertDialog>
		    </Page>
		);
	}
}

const DocPageInject = connect(s=>({s:s}))(DocPageRender)
