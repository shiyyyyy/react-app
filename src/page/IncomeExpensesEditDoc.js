import React, { Component, Fragment } from 'react';
import { log, post, trigger, AppCore, AppMeta, loadIfEmpty, get_req_data, goBack, submit, reload, Enum } from '../util/core';
import { error, nonBlockLoading, info, ErrorBoundary, confirm } from '../util/com';
import { connect } from 'react-redux';

import { Page, Button, Input, AlertDialog, AlertDialogButton } from 'react-onsenui';
import * as doc from '../util/IncomeExpensesDoc'

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


class DocPageRender extends Component {

    constructor(props) {
        super(props);
        this.state = { dialog: false, settle_amount_mod: '' };
        this.action = props.p.action;
        this.pre_view = props.p.pre_view;
        this.edit = props.p.edit || false;
    }

    afterLoad(){
        //结算信息部分
        let obj = {
            '借款结算信息': '单据信息'
            , '支出结算信息': '单据信息'
            , '资金支出结算信息': '资金支出单据信息'
            , '资金借款结算信息': '资金借款单据信息'
            , '资金退款单结算信息': '单据信息'
            , '工资单结算信息': '工资单单据信息'
            , '业务收款结算信息': '单据信息'
            , '业务退回结算信息': '单据信息'
            , '资金退回结算信息': '单据信息'
            , '资金收款结算信息': '单据信息'
        }
        let data = this.state.data
        var settle_amount_mod = ''
        Object.keys(obj).forEach(item=>{
            if (data && data[item]){
                settle_amount_mod = obj[item]
                data[item][0].rmb_total = data[obj[item]][0]['settle_amount'];
                if (data[item][0].currency_id){
                    data[item][0].rate = Enum.CurrencyRate[data[item][0].currency_id]
                    if (data[item][0].rmb_total && data[item][0].rate){
                        data[item][0].local_currency_total = (data[item][0].rmb_total / data[item][0].rate).toFixed(2);
                    }
                }
            }
        })
        // 可选币种(选择节选方式后,币种是限定的)(这里是修改时用)
        if (settle_amount_mod !== ''){
            this.state.data['可选币种'] = Enum.SettleWayCurrency[this.state.data[settle_amount_mod][0].settle_way_id]
        }
        this.setState({ data: data, settle_amount_mod: settle_amount_mod })

    }

    changeModMain(mod,key,i,val){
        let data = this.state.data
        data = this.change_settle_way(data, mod, key, val) ? this.change_settle_way(data, mod, key, val) : data
        data = this.zj_sk_settle_info_change(data, mod,key,val)?this.zj_sk_settle_info_change(data, mod,key,val):data
        data = this.price_change_rmb(data, mod, key, val) ? this.price_change_rmb(data, mod, key, val) : data
        data = this.bill_price_change(data, mod, key, i, val) ? this.bill_price_change(data, mod, key, i, val) : data
        data[mod][i][key] = val
        this.setState({ data: data })
    }

    // 选择 支付方式后 币种根据支付方式改变
    change_settle_way(data, mod, key, val) {
        if((mod === '资金收款结算信息' && key === 'settle_way_id') || (mod === '业务收款结算信息' && key === 'settle_way_id')){
            data['可选币种'] = Enum['SettleWayCurrency'][val];
        }
    }


    // 选择币种之后 汇率变换
    zj_sk_settle_info_change(data, mod, key, val) {
        if ((mod === '资金收款结算信息' && key === 'currency_id') || (mod === '业务收款结算信息' && key === 'currency_id')) {
            let data = this.state.data
            data[mod] = this.state.data[mod];
            if (data[mod][0].currency_id) {
                data[mod][0].rate = Enum.CurrencyRate[val]
                data[mod][0].settle_amount = (parseInt(data[mod][0].local_currency_total * data[mod][0].rate)*100)/100
                data[this.state.settle_amount_mod][0].settle_amount = data[mod][0].settle_amount
                data[mod][0].rmb_total = data[mod][0].settle_amount
                return data
            }
        }
    }
    // 改变本币金额 人民币总价变
    price_change_rmb(data, mod, key, val){
        if ((mod === '资金收款结算信息' && key === 'local_currency_total') || (mod === '业务收款结算信息' && key === 'local_currency_total')) {
            let data = this.state.data
            data[mod] = this.state.data[mod];
            if (data[mod][0].local_currency_total) {
                data[mod][0].settle_amount = (parseInt(val * data[mod][0].rate) * 100) / 100
                data[mod][0].rmb_total = data[mod][0].settle_amount
                data[this.state.settle_amount_mod][0].settle_amount = data[mod][0].settle_amount
                return data
            }
        }
    }
    // 改变调用单据-应收 总价&结算金额&本币金额改变(现在只有业务有这个)
    bill_price_change(data, mod, key,i, val) {
        if ((mod === '收款订单' && key === 'amount')) {
            let data = this.state.data
            data[mod] = this.state.data[mod];
            let price = 0
            data[mod].forEach((item, index) => {
                if (index == i) {
                    price += (val - 0)
                } else {
                    price += (item.amount - 0)
                }
            })

            data[this.state.settle_amount_mod ? this.state.settle_amount_mod : '单据信息'][0].settle_amount = price
            if (data && data['业务收款结算信息']) {
                // data[mod][0].settle_amount = (parseInt(val * data[mod][0].rate) * 100) / 100
                data['业务收款结算信息'][0].settle_amount = price
                data['业务收款结算信息'][0].rmb_total = price
                data['业务收款结算信息'][0].local_currency_total = (parseInt(price / data['业务收款结算信息'][0].rate) * 100) /100
                return data
            }
            if (data && data['入账详情']){
                data['入账详情'][0].amount = price
            }
        }
    }


    // 删除 已选(应收明细/)
    reduce_list(mod, i){
        let data = this.state.data
        data[mod].splice(i,1)
        this.setState({data: data})
    }


    renderToolbar() {
        return (
            <ons-toolbar>
                <div className='left'><ons-back-button></ons-back-button></div>
                <div className={(AppCore.os === 'ios' ? "" : "Andriod-title") + " center"}>
                    {(this.edit?"修改":"查看")+this.props.p.action.slice(2)}
                </div>
            </ons-toolbar>
        );
    }

    onError(error, errorInfo) {
        this.setState({ data: undefined })
    }

    approve(opinion) {
        confirm('确认保存修改吗?').then( r =>{
            trigger('加载等待');
            submit(
                this,
                _ => info('修改成功').then(
                    _ => {
                        goBack();
                        reload(this.pre_view);
                    }
                )
            );
        })
        let data = this.state.data;
        // data['审批记录'].forEach(item => {
        //     if (item.editable) {
        //         item.opinion = opinion;
        //         item.comment = this.state.comment;
        //     }
        // });

        // this.setState({ data: data });
        
    }

    render() {

        return (
            <Page
                renderToolbar={_ => this.renderToolbar()}
                onShow={_ => loadIfEmpty(this, this.afterLoad)}>
                {
                    this.state.loading && nonBlockLoading()

                }
                {
                    this.props.p.action === '修改资金收款单' && this.state.data &&
                    <div className="doc">

                        {/* 基础信息 */}
                        {doc.basis(this.state.data['单据信息'][0])}

                        {/*入账详情-查看*/}
                        {
                            this.state.data['入账详情-查看'] &&
                            // doc.fund(this.state.data['入账详情-查看'][0])
                            doc.fund_edit(this.state.data['入账详情-查看'], this, '入账详情-查看')
                        }

                        {/* 结算信息 */}
                        {
                            this.state.data['资金收款结算信息'] &&
                            doc.billing_info_zj(this.state.data['资金收款结算信息'][0], this, '资金收款结算信息')
                        }

                        {/* 单据备注 */}
                        {doc.documents_note(this.state.data['单据备注'],this, '单据备注')}

                    </div>
                }
                {
                    this.props.p.action === '修改业务收款单' && this.state.data &&
                    <div className="doc">

                        {/* 基础信息 */}
                        {doc.basis(this.state.data['单据信息'][0])}

                        {/*入账详情*/}
                        {
                            this.state.data['入账详情'] &&
                            doc.fund_edit(this.state.data['入账详情'], this, '入账详情')
                        }

                        {/* 结算信息 */}
                        {
                            this.state.data['业务收款结算信息'] &&
                            doc.billing_info_yw(this.state.data['业务收款结算信息'][0], this, '业务收款结算信息', '汇款方名称')
                        }

                        {/* 订单信息 */}
                        {doc.receivable_detail(this.state.data['收款订单'], this, '收款订单')}

                        {/* 单据备注 */}
                        {doc.documents_note(this.state.data['单据备注'], this, '单据备注')}

                    </div>
                }
                {
                    this.props.p.action === '修改业务借款单' && this.state.data &&
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

                    </div>
                }
                {
                    this.props.p.action === '修改资金借款单' && this.state.data &&
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

                    </div>
                }
                {
                    this.props.p.action === '修改业务支出单' && this.state.data &&
                    <div className="doc">

                        {/* 基础信息 */}
                        {doc.basis(this.state.data['单据信息'][0])}

                        {/* 结算信息 */}
                        {doc.billing_info(this.state.data['支出结算信息'][0], '业务支出')}

                        {/* 汇款账号 */}
                        {doc.account_info(this.state.data['汇款账号'][0])}

                        {/*支出核算*/}
                        {doc.payable_detail(this.state.data['支出核算'])}

                        {/* 单据备注 */}
                        {doc.documents_note(this.state.data['单据备注'])}

                    </div>
                }
                {
                    this.props.p.action === '修改资金支出单' && this.state.data &&
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

                    </div>
                }
                {
                    this.props.p.action === '修改业务内转单' && this.state.data &&
                    <div className="doc">

                        {/* 基础信息 */}
                        {doc.basis(this.state.data['业务内转单据信息'][0], '业务内转')}

                        {/*内转明细*/}
                        {doc.nz_detail(this.state.data['内转核算'])}

                        {/* 单据备注 */}
                        {doc.documents_note(this.state.data['单据备注'])}

                    </div>
                }
                {
                    this.props.p.action === '修改资金内转单' && this.state.data &&
                    <div className="doc">

                        {/* 基础信息 */}
                        {doc.basis(this.state.data['单据信息'][0])}

                        {/*转款明细*/}
                        {doc.zjnz_detail(this.state.data['转款明细'])}

                        {/* 单据备注 */}
                        {doc.documents_note(this.state.data['单据备注'])}

                    </div>
                }
                {
                    this.props.p.action === '修改退业务收款单' && this.state.data &&
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

                    </div>
                }
                {
                    this.props.p.action === '修改退资金收款单' && this.state.data &&
                    <div className="doc">

                        {/* 基础信息 */}
                        {doc.basis(this.state.data['单据信息'][0])}

                        {/*退款单结算信息*/}
                        {doc.billing_info(this.state.data['资金退款单结算信息'][0])}

                        {/*退款调用收款*/}
                        {doc.tk_call_sk(this.state.data['退款调用资金收款'], '资金退款')}

                        {/*对方账户*/}
                        {doc.to_account_info(this.state.data['对方账户'][0])}

                        {/* 单据备注 */}
                        {doc.documents_note(this.state.data['单据备注'])}

                    </div>
                }
                {
                    this.props.p.action === '修改业务退回单' && this.state.data &&
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
                            doc.billing_info(this.state.data['业务退回结算信息'][0], '汇款方名称')
                        }

                        {/*业务退回调用单据*/}
                        {doc.th_call_doc(this.state.data['业务退回调用单据'][0])}

                        {/*退回核算*/}
                        {doc.th_detail(this.state.data['退回核算'])}

                        {/* 单据备注 */}
                        {doc.documents_note(this.state.data['单据备注'])}

                    </div>
                }
                {
                    this.props.p.action === '修改资金退回单' && this.state.data &&
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
                            doc.billing_info(this.state.data['资金退回结算信息'][0], '汇款方名称')
                        }

                        {/*资金退回调用单据*/}
                        {doc.th_call_doc(this.state.data['资金退回调用单据'][0])}

                        {/* 单据备注 */}
                        {doc.documents_note(this.state.data['单据备注'])}

                    </div>
                }
                {
                    this.props.p.action === '修改工资单' && this.state.data &&
                    <div className="doc">

                        {/* 基础信息 */}
                        {doc.basis(this.state.data['工资单单据信息'][0])}

                        {/* 结算信息 */}
                        {doc.billing_info(this.state.data['工资单结算信息'][0])}

                        {/* 汇款账号 */}
                        {doc.account_info(this.state.data['汇款账号'][0])}

                        {/* 单据备注 */}
                        {doc.documents_note(this.state.data['单据备注'])}

                    </div>
                }
                {
                    this.props.p.action === '修改还款单' && this.state.data &&
                    <div className="doc">

                        {/* 基础信息 */}
                        {doc.basis(this.state.data['单据信息'][0])}

                        {/* 还款调用借款 */}
                        {doc.hk_call_doc(this.state.data['还款调用借款'])}

                        {/* 单据备注 */}
                        {doc.documents_note(this.state.data['单据备注'])}

                    </div>
                }
                {
                    this.props.p.action === '修改扣款单' && this.state.data &&
                    <div className="doc">

                        {/* 基础信息 */}
                        {doc.basis(this.state.data['扣款单据信息'][0])}

                        {/* 扣款详情 */}
                        {doc.kk_info(this.state.data['扣款详情'])}

                        {/* 单据备注 */}
                        {doc.documents_note(this.state.data['单据备注'])}

                    </div>
                }
                {
                    this.props.p.action === '修改调整单' && this.state.data &&
                    <div className="doc">

                        {/* 基础信息 */}
                        {doc.basis(this.state.data['调整单据信息'][0])}

                        {/* 调整单据 */}
                        {doc.tz_call_doc(this.state.data['调整单据'][0])}

                        {/* 单据备注 */}
                        {doc.documents_note(this.state.data['单据备注'])}

                    </div>
                }

                {
                    this.state.data && this.edit && 
                    <section className="doc-approve-btn-box">
                        <button onClick={_ => this.approve()}>保存</button>
                    </section>
                }
            </Page>
        );
    }
}

const DocPageInject = connect(s => ({ s: s }))(DocPageRender)
