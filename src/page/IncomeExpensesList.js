// 合同列表
import React, { Component, Fragment } from 'react';

import { AppCore, resetTo, loadMore, loadIfEmpty, AppMeta, doc_map, trigger, post, Enum, goTo, hasPlugin, reload, goBack, haveModAuth, haveActionAuth } from '../util/core';
import { pullHook, loginToPlay, SearchLv2, nonBlockLoading, NoPv, info, confirm, OpDialogAssocInfo, OpDialogComment } from '../util/com';
import { appConst } from '../util/const';
import { Page, Modal, Button, Icon, Popover } from 'react-onsenui';
import { connect } from 'react-redux';

import moment from 'moment';

import '../css/Contract.css';
class IncomeExpensesList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            state: 'initial',
            cur_com_i: '', // 找到签名item,然后才能传url
            cur_AsIofo_i: '',
            open_Comment: false,
            open_AssocInfo: false,
            data: [],
            open_filter: '',
            search: { submit_from: '', submit_to: '', settle_way_id: ''},
            submit_from: '',
            submit_to: '',
            settle_way_id: '',
            open_search_key: false,
            cur_select_search_filter: { text: '系统编号', search: 'id' }
        };
        this.mod = '收支申请';
        // AppCore.GroupPage = this;

    }

    onShow() {
        loadIfEmpty(this);
    }

    editContract(item) {
        let action = doc_map(item)
        goTo('修改收支申请', { data: { id: item.id }, action: action, pre_view: this, edit: true });
    }
    checkContract(item) {
        let action = doc_map(item)
        goTo('修改收支申请', { data: { id: item.id }, action: action, pre_view: this, edit: false });
    }
    DeleteContract(item) {
        let action = '删除电子合同';
        let cfg = AppMeta.actions[action];
        trigger('加载等待');
        post(cfg.submit.url, { id: item.id }).then(
            r => info(r.message).then(
                _ => {
                    reload(this);
                }
            )
        );
    }
    SubmitContract(item) {
        confirm('是否确认操作？').then(r => r && this.sureToSubmit(item));
    }
    sureToSubmit(item) {
        let action = '提交电子合同';
        let cfg = AppMeta.actions[action];
        trigger('加载等待');
        post(cfg.submit.url, { id: item.id }).then(
            r => info(r.message).then(
                _ => {
                    reload(this);
                }
            )
        );
    }

    SubmitDoc(item) {
        let action = '提交单据';
        confirm('是否确认提交？').then(r => r && this.sureToDo({id:item.id}, action));
    }
    DeleteDoc(item) {
        let action = '删除单据';
        confirm('是否确认删除？').then(r => r && this.sureToDo({id:item.id,flow_id: item.flow_id}, action));
    }
    sureToDo(item, action) {
        let cfg = AppMeta.actions[action];
        trigger('加载等待');
        post(cfg.submit.url, item).then(
            r => info(r.message).then(
                _ => {
                    reload(this);
                }
            )
        );
    }

    
    depDateClick() {
        this.setState({
            open_filter: '',
            search: {
                ...this.state.search,
                submit_from: this.state.submit_from || undefined,
                submit_to: this.state.submit_to || undefined
            }
        });
        reload(this);
    }

    clear_param() {
        this.setState({
            open_filter: '',
            submit_from: '',
            submit_to: ''
        })
    }

    selectSettle_method(item){
        this.setState({ settle_way_id: item})
    }
    Settle_methodSubmit(){
        let cur_settle_way_id = this.state.settle_way_id
        this.setState({ open_filter: '', search: { ...this.state.search, settle_way_id: cur_settle_way_id } });
        reload(this);
    }
    dep_date_cur() {
        if (this.state.open_filter === 'dep_date' || this.state.submit_from) {
            return true
        }
        return false
    }
    back_date_cur() {
        if (this.state.open_filter === 'back_date' || this.state.submit_to) {
            return true
        }
        return false
    }
    Settle_method(){
        if (this.state.open_filter === 'Settle_method' || this.state.settle_way_id) {
            return true
        }
        return false
    }

    get_doc_id(row) {
        let v = row.id;
        switch (row.doc_type_id) {
            case appConst.DOC_ORDER_SK:
            case appConst.DOC_ZJ_SK:
                return v ? 'SK0' + v : '';
            case appConst.DOC_YJ:
                return v ? 'YJ0' + v : '';
            case appConst.DOC_YW_TK:
            case appConst.DOC_YJ_TK:
            case appConst.DOC_ZJ_TK:
                return v ? 'TK0' + v : '';
            case appConst.DOC_YW_JK:
            case appConst.DOC_ZJ_JK:
                return v ? 'JK0' + v : '';
            case appConst.DOC_ACC_ZC:
            case appConst.DOC_ZJ_ZC:
                return v ? 'ZC0' + v : '';
            case appConst.DOC_YC:
                return v ? 'YC0' + v : '';
            case appConst.DOC_YZ:
                return v ? 'YZ0' + v : '';
            case appConst.DOC_YW_NZ:
            case appConst.DOC_ZJ_NZ:
                return v ? 'NZ0' + v : '';
            case appConst.DOC_TZ:
                return v ? 'TZ0' + v : '';
            case appConst.DOC_KK:
                return v ? 'KK0' + v : '';
            case appConst.DOC_HK:
                return v ? 'HK0' + v : '';
            case appConst.DOC_GZ:
                return v ? 'GZ0' + v : '';
            case appConst.DOC_YW_TH:
            case appConst.DOC_ZJ_TH:
                return v ? 'TH0' + v : '';
        }
    }

    // ===============

    DialogComment(i) {
        let that = this
        if (this.state.cur_com_i !== '' && this.state.open_Comment){
            let param = {
                open_Show: this.state.open_Comment,
                main: this.state.data[this.state.cur_com_i],
                confirm(val) {
                    let data = that.state.data
                    let url = '/fin/Doc/set_comment'
                    post(url, { id: data[that.state.cur_com_i].id, '单据备注': val}).then(r=>{
                        info('备注保存成功')
                        that.setState({ open_Comment: false })
                    })
                },
                close() {
                    that.setState({ open_Comment: false })
                }
            }
            return (
                <OpDialogComment param={param} />
            )
        }
    }
    DialogAssocInfo(i) {
        let that = this
        if (this.state.cur_AsIofo_i !== '' && this.state.open_AssocInfo){
            let param = {
                open_Show: this.state.open_AssocInfo,
                url: '/fin/DocRead/read_related_msg?id=' + this.state.data[that.state.cur_AsIofo_i].id,
                main: this.state.data[that.state.cur_AsIofo_i],
                close() {
                    that.setState({ open_AssocInfo: false })
                }
            }
            return (
                <OpDialogAssocInfo param={param} />
            )
        }
    }

    renderFixed() {

        if (hasPlugin('device') && AppCore.os === 'ios') {
            this.tbHeight = 64;
        } else {
            this.tbHeight = (AppCore.os === 'ios' ? 44 : 56);
        }
        return (
            <div style={{
                backgroundColor: 'rgba(0,0,0,.65)',
                position: 'absolute',
                top: this.tbHeight,
                bottom: this.state.open_filter ? '0px' : 'auto',
                left: '0px',
                right: '0px',
                display: this.props.s.user.sid ? 'block' : 'none'
            }}
                onClick={_ => { this.clear_param() }}
            >
                <ons-row class="option-type" onClick={e => e.stopPropagation()}>
                    <ons-col onClick={_ => this.setState({ open_filter: 'dep_date' })}>
                        <span className={this.dep_date_cur() ? "cur-option-type-text" : "option-type-text"}>出团日期</span>
                        {this.dep_date_cur() && <Icon className="cur-option-type-item" icon="md-caret-up" />}
                        {!this.dep_date_cur() && <Icon className="option-type-item" icon="md-caret-down" />}
                    </ons-col>
                    <ons-col onClick={_ => this.setState({ open_filter: 'back_date' })}>
                        <span className={this.back_date_cur() ? "cur-option-type-text" : "option-type-text"}>回团日期</span>
                        {this.back_date_cur() && <Icon className="cur-option-type-item" icon="md-caret-up" />}
                        {!this.back_date_cur() && <Icon className="option-type-item" icon="md-caret-down" />}
                    </ons-col>
                    <ons-col onClick={_ => this.setState({ open_filter: 'Settle_method' })}>
                        <span className={this.Settle_method() ? "cur-option-type-text" : "option-type-text"}>结算方式</span>
                        {this.Settle_method() && <Icon className="cur-option-type-item" icon="md-caret-up" />}
                        {!this.Settle_method() && <Icon className="option-type-item" icon="md-caret-down" />}
                    </ons-col>
                </ons-row>
                <div onClick={e => e.stopPropagation()}>

                    {/* 出团日期-选择框 */
                        this.state.open_filter == 'dep_date' &&
                        <div className="dialog-box">
                            <div className="options-popup">
                                <div className="selected-date">
                                    <input type="date" className="selected-date-input" placeholder="最早出发"
                                        value={this.state.search.submit_from || this.state.submit_from} onChange={e => this.setState({ submit_from: e.target.value })} />
                                </div>
                                <div className="options-btn">
                                    <div className="options-reset" onClick={_ => this.setState({ submit_from: '', search: { ...this.state.search, submit_from: '' } })}>重置</div>
                                    <div className="options-submit" onClick={_ => this.depDateClick()}>确定</div>
                                </div>
                            </div>
                        </div>
                    }
                    {/* 回团日期-选择框 */
                        this.state.open_filter == 'back_date' &&
                        <div className="dialog-box">
                            <div className="options-popup">
                                <div className="selected-date">
                                    <input type="date" className="selected-date-input" placeholder="最晚出发"
                                        value={this.state.search.submit_to || this.state.submit_to} onChange={e => this.setState({ submit_to: e.target.value })} />
                                </div>
                                <div className="options-btn">
                                    <div className="options-reset" onClick={_ => this.setState({ submit_to: '', search: { ...this.state.search, submit_to: '' } })}>重置</div>
                                    <div className="options-submit" onClick={_ => this.depDateClick()}>确定</div>
                                </div>
                            </div>
                        </div>
                    }
                    {/* 结算方式 Settle_method */
                        this.state.open_filter == 'Settle_method' &&
                        <Fragment>
                            <div className="order-state">
                                {Object.keys(Enum['SettleWay']).map((item, i) =>
                                    <div className={item == (this.state.settle_way_id || this.state.search.settle_way_id) ? 'cur-order-state' : 'order-state-item'}
                                        onClick={_ => this.selectSettle_method(item)} key={item}>{Enum['SettleWay'][item]}</div>
                                )}
                            </div>
                            <div className="options-btn" style={{ backgroundColor: '#fff' }}>
                                <div className="options-reset" onClick={_ => this.setState({ search: { ...this.state.search, settle_way_id: '' } })}>重置</div>
                                <div className="options-submit" onClick={_ => this.Settle_methodSubmit()}>确定</div>
                            </div>
                        </Fragment>
                    }
                </div>
            </div>
        );
    }
    renderToolbar() {
        let search_cfg = {

            key: 'Contract_id',
            cb: (value, key) => {
                let search = this.state.search
                search['contract_id'] = ''
                search[key] = value
                this.setState({ search: search });
                reload(this)
            }
        }
        return <SearchLv2 value={this.state.search.id || this.state.search.settle_amount || this.state.search.settle_obj}
            open_search_key={_ => this.setState({ open_search_key: true })}
            cur_select={this.state.cur_select_search_filter || ''}
            clear={e => { e.stopPropagation(); this.setState({ search: { ...this.state.search, id: '', settle_amount: '', settle_obj: '' } }, _ => reload(this)) }}
            param={search_cfg} set_anchor={anchor => this.search_anchor = anchor} />
    }

    render() {
        return (
            <Page
                renderToolbar={_ => this.renderToolbar()}
                onInfiniteScroll={done => loadMore(this, done)}
                onShow={_ => this.onShow()}
                renderFixed={_ => this.renderFixed()}>
                <div style={{ height: this.props.s.user.sid ? "50px" : "0px" }} ></div>
                <Popover
                    animation="none"
                    direction="down"
                    isOpen={this.state.open_search_key}
                    onCancel={() => this.setState({ open_search_key: false })}
                    getTarget={() => this.search_anchor}
                >
                    <div className="dialog-select-box">
                        <div className="dialog-select-item" onClick={_ => this.setState({ open_search_key: false, cur_select_search_filter: { text: '系统编号', search: 'id', } })}>系统编号</div>
                        <div className="dialog-select-item" onClick={_ => this.setState({ open_search_key: false, cur_select_search_filter: { text: '结算对象', search: 'settle_obj', } })}>结算对象</div>
                        <div className="dialog-select-item" onClick={_ => this.setState({ open_search_key: false, cur_select_search_filter: { text: '结算金额', search: 'settle_amount', } })}>结算金额</div>
                    </div>
                </Popover>
                {
                    // this.props.s.user.sid && this.state.has_auth &&

                    <Fragment>
                        {
                            !this.state.open_filter && pullHook(this)
                        }
                        {!!this.state.data.length && this.state.loading && nonBlockLoading()}
                        <div className="pro-list">
                            {
                                this.state.data.map((item, index) =>
                                    <Fragment key={item.id}>
                                        <div className="contract-item" onClick={_ => this.checkContract(item)}>
                                            <div className="contract-cell" style={{ borderBottom: '1px solid #d9d9d9' }}>
                                                <span className="contract-cell-left">系统编号: {this.get_doc_id(item)}</span>
                                                <span className="contract-cell-right">{item.company_name}-{item.department_name}-{item.employee_name}</span>
                                            </div>
                                            <div className="contract-cell" style={{ borderBottom: '1px solid #d9d9d9' }}>
                                                <span className="contract-cell-left">{Enum.Doc[item.doc_type_id]}</span>
                                                <span className="contract-cell-right">结算金额:{item.settle_amount}</span>
                                                <span className="contract-cell-right">结算方式:{Enum['SettleWay'][item.settle_way_id]}</span>
                                            </div>
                                            <div className="contract-item-main">
                                                <div className="contract-item-name">{item.pd_name}</div>
                                                <div className="contract-main-cell">
                                                    <span className="contract-cell-main">
                                                        提交日期: {item.submit_at.split(' ')[0]}</span>
                                                    <span className="contract-cell-main" style={{ textAlign: 'center' }}>
                                                        出团日期: {item.dep_date}</span>
                                                    <span className="contract-cell-main" style={{ textAlign: 'right' }}>
                                                        部门编号: {item.code}</span>
                                                </div>
                                                <div className="contract-main-cell">
                                                    <span className="contract-cell-main">
                                                        结算对象: {item.settle_obj}</span>
                                                    <span className="contract-cell-main text-overflow" style={{ textAlign: 'center' }} >
                                                        审批状态: {Enum['Flow'][item.flow]}</span>
                                                    <span className="contract-cell-main" style={{ textAlign: 'right' }}>
                                                        待审批人: {item.approver_next}</span>
                                                </div>
                                            </div>

                                            {<div className="order-btn" onClick={e=>e.stopPropagation()}>
                                                {
                                                    <button
                                                        className={((haveActionAuth('修改单据', this.mod) && (item.flow == 1 || item.flow == 3) && (item.doc_type_id == 1||item.doc_type_id ==13)) ? "" : "btn-disabled") + " order-btn-item"}
                                                        disabled={(haveActionAuth('修改单据', this.mod) && (item.flow == 1 || item.flow == 3) && (item.doc_type_id == 1||item.doc_type_id ==13)) ? "" : "disabled"}
                                                        onClick={_ => this.editContract(item)}>修改</button>
                                                }
                                                {
                                                    <button
                                                        className={((haveActionAuth('提交单据', this.mod) && (item.flow == 1 || item.flow == 3) && (item.doc_type_id == 1||item.doc_type_id ==13)) ? "" : "btn-disabled") + " order-btn-item"}
                                                        disabled={(haveActionAuth('提交单据', this.mod) && (item.flow == 1 || item.flow == 3) && (item.doc_type_id == 1||item.doc_type_id ==13)) ? "" : "disabled"}
                                                        onClick={_ => this.SubmitDoc(item)}>提交</button>
                                                }{
                                                    <button
                                                        className={((haveActionAuth('删除单据', this.mod) && (item.flow == 1 || item.flow == 3) && (item.doc_type_id == 1||item.doc_type_id ==13)) ? "" : "btn-disabled") + " order-btn-item"}
                                                        disabled={(haveActionAuth('删除单据', this.mod) && (item.flow == 1 || item.flow == 3) && (item.doc_type_id == 1||item.doc_type_id ==13)) ? "" : "disabled"}
                                                        onClick={_ => this.DeleteDoc(item)}>删除</button>
                                                }{
                                                    <button
                                                        style={{padding: '0'}}
                                                        className={((haveActionAuth('单据关联信息', this.mod) && (item.doc_type_id == 1 || item.doc_type_id == 13)) ? "" : "btn-disabled") + " order-btn-item"}
                                                        disabled={(haveActionAuth('单据关联信息', this.mod) && (item.doc_type_id == 1 || item.doc_type_id == 13)) ? "" : "disabled"}
                                                        onClick={_ => this.setState({ open_AssocInfo: true, cur_AsIofo_i: index })}>关联信息</button>
                                                }{
                                                    <button
                                                        className={((haveActionAuth('单据备注-收支申请', this.mod) && item.flow == 4 && (item.doc_type_id == 1 || item.doc_type_id == 13)) ? "" : "btn-disabled") + " order-btn-item"}
                                                        disabled={(haveActionAuth('单据备注-收支申请', this.mod) && item.flow == 4 && (item.doc_type_id == 1 || item.doc_type_id == 13)) ? "" : "disabled"}
                                                        onClick={_ => this.setState({ open_Comment: true, cur_com_i: index })}>备注</button>
                                                }
                                            </div>}
                                        </div>

                                    </Fragment>
                                )
                            }
                        </div>
                        {this.state.loading && nonBlockLoading()}

                    </Fragment>
                }
                {
                    // this.props.s.user.sid && !this.state.has_auth && NoPv()
                }
                {
                    // !this.props.s.user.sid && loginToPlay()
                }
                {this.state.data.length > 0 && this.DialogComment()}
                {this.state.data.length > 0 && this.DialogAssocInfo()}
            </Page>
        );
    }
}

export default connect(s => ({ s: s }))(IncomeExpensesList)

