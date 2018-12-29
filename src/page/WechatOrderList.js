// 合同列表
import React, { Component, Fragment } from 'react';

import { AppCore, resetTo, loadMore, loadIfEmpty, AppMeta, plugin, trigger, post, Enum, goTo, hasPlugin, reload, resetToTab, goBack, haveModAuth, haveActionAuth } from '../util/core';
import { pullHook, loginToPlay, SearchLv2, nonBlockLoading, NoPv, info, confirm, WechatAppoint, WechatSeat, WechatDelete } from '../util/com';

import { Page, Modal, Button, Icon, Popover } from 'react-onsenui';
import { connect } from 'react-redux';

import moment from 'moment';

import '../css/GroupPage.css';
import '../css/Contract.css';
class ContractList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            state: 'initial',
            // 弹窗 开关 3个
            AppointOpen: false,
            SeatOpen: false,
            DeleteOpen: false,
            // 弹窗 输入val 2个
            Appoint: '',
            Sear: '',
            // 当前 item的index,指定弹出谁的弹窗
            cur_index: '',

            open_img: false,
            data: [],
            open_filter: '',
            //search: { dep_date_from: moment().format('YYYY-MM-DD'), dep_date_to: ''},
            search: { dep_date_from: '', dep_date_to: '' },
            dep_date_from: '',
            dep_date_to: '',
            cur_state: '',
            open_search_key: false,
            cur_select_search_filter: { text: '订单号', search: 'order_id' }
        };
        this.mod = '微信订单';
    }

    onShow() {
        loadIfEmpty(this);
    }


    //  顶部filter样式
    dep_date_cur() {
        if (this.state.open_filter === 'dep_date' || this.state.dep_date_from) {
            return true
        }
        return false
    }
    back_date_cur() {
        if (this.state.open_filter === 'back_date' || this.state.dep_date_to) {
            return true
        }
        return false
    }
    group_state_cur() {
        if (this.state.open_filter === 'group_state' || this.state.cur_state) {
            return true
        }
        return false
    }

    // filter 点击
    depDateClick() {
        this.setState({
            open_filter: '',
            search: {
                ...this.state.search,
                dep_date_from: this.state.dep_date_from || undefined,
                dep_date_to: this.state.dep_date_to || undefined
            }
        });
        reload(this);
    }

    orderStateClick(state) {
        this.setState({ cur_state: state });
    }
    orderStateSubmit() {
        let cur_state = this.state.cur_state
        this.setState({ open_filter: '', search: { ...this.state.search, apply_state: cur_state } });
        reload(this);
    }

    clear_param() {
        this.setState({
            open_filter: '',
            dep_date_from: '',
            dep_date_to: '',
            cur_state: '',
        })
    }


    // 按钮
    sureToDo(item, action) {
        let cfg = AppMeta.actions[action];
        trigger('加载等待');
        post(cfg.submit.url, { id: item.id, employee_id: item.employee_id, assitant_id: item.assitant_id }).then(
            r => info(r.message).then(
                _ => {
                    reload(this);
                }
            )
        );
    }

    // =============== 3个按钮
    AppointOpenFnc(i){
        this.setState({ cur_index: i, AppointOpen: true})
    }
    SeatOpenFnc(i) {
        this.setState({ cur_index: i, SeatOpen: true })
    }
    DeleteOpenFnc(item) {
        let action = '删除微信订单';
        confirm('是否确认删除,该操作不可逆').then(r => r && this.sureToDo(item, action));
    }
    // 2个弹窗
    AppointDialog() {
        let that = this
        let param = {
            open: that.state.AppointOpen,
            item: that.state.data[that.state.cur_index],
            confirm(val,item){
                let action = '指定订单';
                item.employee_id = val
                console.log(item)

                that.setState({ AppointOpen: false }, that.sureToDo(item, action))
            },
            close() {
                that.setState({ AppointOpen: false })
            }
        }
        return (
            <WechatAppoint param={param} />
        )
    }
    SeatDialog() {
        let that = this
        let param = {
            open: that.state.SeatOpen,
            item: that.state.data[that.state.cur_index],
            confirm(val,item) {
                let action = '占位订单-微信订单';
                item.assitant_id = val
                console.log(item)
                that.setState({ SeatOpen: false }, that.sureToDo(item, action))
            },
            close(){
                that.setState({ SeatOpen: false })
            }
        }
        return (
            <WechatSeat param={param} />
        )
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
                    <ons-col onClick={_ => this.setState({ open_filter: 'group_state' })}>
                        <span className={this.group_state_cur() ? "cur-option-type-text" : "option-type-text"}>订单状态</span>
                        {this.group_state_cur() && <Icon className="cur-option-type-item" icon="md-caret-up" />}
                        {!this.group_state_cur() && <Icon className="option-type-item" icon="md-caret-down" />}
                    </ons-col>
                </ons-row>
                <div onClick={e => e.stopPropagation()}>

                    {/* 出团日期-选择框 */
                        this.state.open_filter == 'dep_date' &&
                        <div className="dialog-box">
                            <div className="options-popup">
                                <div className="selected-date">
                                    <input type="date" className="selected-date-input" placeholder="最早出发"
                                        value={this.state.search.dep_date_from || this.state.dep_date_from} onChange={e => this.setState({ dep_date_from: e.target.value })} />
                                </div>
                                <div className="options-btn">
                                    <div className="options-reset" onClick={_ => this.setState({ dep_date_from: '', search: { ...this.state.search, dep_date_from: '' } })}>重置</div>
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
                                        value={this.state.search.dep_date_to || this.state.dep_date_to} onChange={e => this.setState({ dep_date_to: e.target.value })} />
                                </div>
                                <div className="options-btn">
                                    <div className="options-reset" onClick={_ => this.setState({ dep_date_to: '', search: { ...this.state.search, dep_date_to: '' } })}>重置</div>
                                    <div className="options-submit" onClick={_ => this.depDateClick()}>确定</div>
                                </div>
                            </div>
                        </div>
                    }
                    {this.state.open_filter === 'group_state' &&
                        <Fragment>
                            <div className="order-state">
                                {Object.keys(Enum['ApplyState']).map((item, i) =>
                                    <div className={item == (this.state.cur_state || this.state.search.state) ? 'cur-order-state' : 'order-state-item'}
                                    onClick={_ => this.orderStateClick(item)} key={item}>{Enum['ApplyState'][item]}</div>
                                )}
                            </div>
                            <div className="options-btn" style={{ backgroundColor: '#fff' }}>
                                <div className="options-reset" onClick={_ => this.setState({ cur_state: '', search: { ...this.state.search, state: '' } })}>重置</div>
                                <div className="options-submit" onClick={_ => this.orderStateSubmit()}>确定</div>
                            </div>
                        </Fragment>
                    }
                </div>
            </div>
        );
    }
    renderToolbar() {
        let search_cfg = {

            key: 'WechatOrderList',
            cb: (value, key) => {
                let search = this.state.search
                search['order_id'] = ''
                search['cstm_name'] = ''
                search[key] = value
                this.setState({ search: search });
                reload(this)
            }
        }
        return <SearchLv2 value={this.state.search.order_id || this.state.search.cstm_name}
            open_search_key={_ => this.setState({ open_search_key: true })}
            cur_select={this.state.cur_select_search_filter || ''}
            clear={e => { e.stopPropagation(); this.setState({ search: { ...this.state.search, order_id: '', cstm_name: '' } }, _ => reload(this)) }}
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
                        <div className="dialog-select-item" onClick={_ => this.setState({ open_search_key: false, cur_select_search_filter: { text: '订单号', search: 'order_id', } })}>订单号</div>
                        <div className="dialog-select-item" onClick={_ => this.setState({ open_search_key: false, cur_select_search_filter: { text: '客户姓名', search: 'cstm_name', } })}>客户姓名</div>
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
                                    <Fragment key={item.id} >
                                        <div className="contract-item" >
                                            <div className="contract-cell" style={{ borderBottom: '1px solid #d9d9d9' }}>
                                                <span className="contract-cell-left">订单号: {item.order_id === '0'?'':'D0'+item.order_id}</span>
                                                <span className="contract-cell-right">{item.company_name}-{item.department_name}-{item.employee_name}</span>
                                            </div>
                                            <div className="contract-item-main">
                                                <div className="contract-item-name">{item.pd_name}</div>
                                                <div className="contract-main-cell">
                                                    <span className="contract-cell-main">
                                                        出团日期: {item.dep_date}</span>
                                                    <span className="contract-cell-main" style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                                                        产品提供方: {item.pd_provider}</span>
                                                    <span className="contract-cell-main" style={{ textAlign: 'right' }}>
                                                        客户: {item.cstm_name}</span>
                                                </div>
                                                <div className="contract-main-cell">
                                                    <span className="contract-cell-main">
                                                        单价: {item.unit_price}</span>
                                                    <span className="contract-cell-main" style={{ textAlign: 'center' }} >
                                                        人数: {item.num_of_people}</span>
                                                    <span className="contract-cell-main" style={{ textAlign: 'right' }}>
                                                        总价: {item.total_price}</span>
                                                </div>
                                                <div className="contract-main-cell">
                                                    <span className="contract-cell-main">
                                                        接单人: {item.assitant_name}</span>
                                                    <span className="contract-cell-main" style={{ textAlign: 'right' }}>
                                                        订单状态: {Enum.ApplyState[item.apply_state]}</span>
                                                </div>
                                            </div>

                                            {<div className="order-btn">
                                                {
                                                    <button
                                                        className={((haveActionAuth('指定订单', this.mod) && item.apply_state == 1) ? "" : "btn-disabled") + " order-btn-item"}
                                                        disabled={(haveActionAuth('指定订单', this.mod) && item.apply_state == 1) ? "" : "disabled"}
                                                        onClick={_ => this.AppointOpenFnc(index)}>指定</button>
                                                }{
                                                    <button
                                                        className={((haveActionAuth('占位订单-微信订单', this.mod) && item.apply_state == 1) ? "" : "btn-disabled") + " order-btn-item"}
                                                        disabled={(haveActionAuth('占位订单-微信订单', this.mod) && item.apply_state == 1) ? "" : "disabled"}
                                                        onClick={_ => this.SeatOpenFnc(index)}>占位</button>
                                                }{
                                                    // (item.apply_state == 6) &&
                                                    <button
                                                        className={((haveActionAuth('删除微信订单', this.mod) && item.apply_state == 1) ? "" : "btn-disabled") + " order-btn-item"}
                                                        disabled={(haveActionAuth('删除微信订单', this.mod) && item.apply_state == 1) ? "" : "disabled"}
                                                        onClick={_ => this.DeleteOpenFnc(item)}>删除</button>
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
                {this.state.data && this.state.cur_index !== '' && this.state.AppointOpen && this.AppointDialog()}
                {this.state.data && this.state.cur_index !== '' && this.state.SeatOpen && this.SeatDialog()}
                {this.state.data && this.state.cur_index !== '' && this.state.DeleteOpen && this.DeleteDialog()}
            </Page>
        );
    }
}

export default connect(s => ({ s: s }))(ContractList)

