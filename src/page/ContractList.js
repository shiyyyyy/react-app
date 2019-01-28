// 合同列表
import React, { Component, Fragment } from 'react';

import { AppCore, resetTo, loadMore, loadIfEmpty, AppMeta,plugin, trigger, post,Enum, goTo, hasPlugin, reload,resetToTab, goBack, haveModAuth,haveActionAuth} from '../util/core';
import { pullHook, loginToPlay, SearchLv2, nonBlockLoading, NoPv, info, confirm, OpDialogImg } from '../util/com';

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
            cur_index: '', // 找到签名item,然后才能传url
            open_img: false,
            data: [],
            open_filter: '',
            //search: { dep_date_from: moment().format('YYYY-MM-DD'), dep_date_to: ''},
            search: { dep_date_from: '', dep_date_to: ''},
            dep_date_from: '',
            dep_date_to: '',
            open_search_key: false,
            cur_select_search_filter: { text: '合同编号', search: 'contract_id' }
        };
         this.mod = '电子合同-订单';
    }

    onShow() {
        loadIfEmpty(this);
    }

    editContract(item) {
        goTo('修改合同1', {data: item});
    }

    PreviewContract(item){
        let url;
        item.action='合同预览';
        let cfg = AppMeta.actions[item.action];
        url = cfg.read.url + '?action=' + item.action +'&id=' + item.id;
        trigger('加载等待');
        post(url).then(
            r => {
                //返回合同的save_path
                let url = r.data.save_path;
                item.pdf_url = url;
                if(item.pdf_url && hasPlugin('cordova.InAppBrowser')){
                    plugin('cordova.InAppBrowser').open(AppCore.HOST+'/'+item.pdf_url,'_system');
                }
            }
        )
    }
    InquireSign(item){
        let action = '查询电子合同签名状态';
        let cfg = AppMeta.actions[action];
        trigger('加载等待');
        post(cfg.submit.url, {id:item.id}).then(
            r => info(r.message).then(
                _=>{
                    reload(this);
                }
            )
        );
    }
    SeeContractSign(index){
        this.setState({ open_img: true, cur_index: index })
    }
    DeleteContract(item){
        let action = '删除电子合同';
        confirm('是否确认删除？').then(r=>r && this.sureToDo(item,action));
    }
    SubmitContract(item){
        let action = '提交电子合同';
        confirm('是否确认提交？').then(r=>r && this.sureToDo(item,action));
    }
    SignByProof(item){
        let action = '盖章电子合同';
        confirm('是否确认盖章？').then(r=>r && this.sureToDo(item,action));
    }
    RevokeContract(item){
        let action = '取消电子合同';
        confirm('是否确认撤回？').then(r=>r && this.sureToDo(item,action));
    }
    AbolishContract(item){
        let action = '作废电子合同';
        confirm('是否确认作废？').then(r=>r && this.sureToDo(item,action));
    }
    sureToDo(item,action){
        let cfg = AppMeta.actions[action];
        trigger('加载等待');
        post(cfg.submit.url, {id:item.id}).then(
            r => info(r.message).then(
                _=>{
                    reload(this);
                }
            )
        );
    }
    UploadContract(item){
        confirm('是否确认下载？').then(r=>r && this.sureToUpload(item));
    }
    sureToUpload(item){
        //返回合同的save_path
        let url = item.attach;
        item.pdf_url = url;
        if(item.pdf_url && hasPlugin('cordova.InAppBrowser')){
            plugin('cordova.InAppBrowser').open(AppCore.HOST+'/'+item.pdf_url,'_system');
        }
    }
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

    clear_param() {
        this.setState({
            open_filter: '',
            dep_date_from: '',
            dep_date_to: ''
        })
    }

    dep_date_cur() {
        if (this.state.open_filter === 'dep_date' || this.state.dep_date_from ) {
            return true
        }
        return false
    }
    back_date_cur() {
        if (this.state.open_filter === 'back_date' || this.state.dep_date_to ) {
            return true
        }
        return false
    }

    // ===============

    DialogImg(i){
        let that = this
        let imgInfo = {
            open_img: that.state.open_img,
            open_img_url: that.state.data[that.state.cur_index].attach_signpic,
            closeImg(){
                that.setState({ open_img: false})
            }
        }
        return (
            <OpDialogImg imgInfo={imgInfo} />
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
                                    <div className="options-reset" onClick={_ => this.setState({ dep_date_from: '', search: { ...this.state.search, dep_date_from: ''} })}>重置</div>
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
                </div>
            </div>
        );
    }
    renderToolbar() {
        let search_cfg = {

            key: 'Contract_id',
            goBack: () => {
                goBack()
                //goTo('底栏菜单')
                //setTimeout(() => {
                //    AppCore.TabPage.setState({ index: 4 })
                //}, 0);
            },
            cb: (value, key) => {
                let search = this.state.search
                search['contract_id'] = ''
                search[key] = value
                this.setState({ search: search });
                reload(this)
            }
        }
        return <SearchLv2 value={this.state.search.Contract_id}
            open_search_key={_ => this.setState({ open_search_key: true })}
            cur_select={this.state.cur_select_search_filter || ''}
            clear={e => { e.stopPropagation(); this.setState({ search: { ...this.state.search, id: '', settle_amount: '' } }, _ => reload(this)) }}
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
                        <div className="dialog-select-item" onClick={_ => this.setState({ open_search_key: false, cur_select_search_filter: { text: '合同编号', search: 'contract_id', } })}>合同编号</div>
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
                                this.state.data.map((item,index) =>
                                <Fragment key={item.id} >
                                    <div className="contract-item" >
                                        <div className="contract-cell" style={{borderBottom: '1px solid #d9d9d9'}}>
                                            <span className="contract-cell-left">合同编号: {item.contract_num}</span>
                                            <span className="contract-cell-right">电子合同签约者: {item.traveler}</span>
                                        </div>
                                        <div className="contract-cell" style={{borderBottom: '1px solid #d9d9d9'}}>
                                            <span className="contract-cell-left">订单号: D0{item.order_id}</span>
                                            <span className="contract-cell-right">{item.company_name}-{item.department_name}-{item.employee_name}</span>
                                        </div>
                                        <div className="contract-item-main">
                                            <div className="contract-item-name">{item.pd_name}</div>
                                            <div className="contract-main-cell">
                                                <span className="contract-cell-main">
                                                创建日期: {item.create_at.split(' ')[0]}</span>
                                                <span className="contract-cell-main" style={{textAlign:'center'}}>
                                                出团日期: {item.dep_date}</span>
                                                <span className="contract-cell-main" style={{textAlign:'right'}}>
                                                人数: {item.num_of_people}</span>
                                            </div>
                                            <div className="contract-main-cell">
                                                <span className="contract-cell-main">
                                                合同金额: {item.amount}</span>
                                                <span className="contract-cell-main text-overflow" style={{textAlign:'center'}} >
                                                产品提供方: {item.pd_provider}</span>
                                                <span className="contract-cell-main" style={{textAlign:'right'}}>
                                                合同状态: {Enum.ElcContractState[item.contract_state]}</span>
                                            </div>
                                        </div>

                                        {<div className="order-btn">
                                            {
                                                (item.contract_state == 2) &&
                                                <button
                                                    className={((haveActionAuth('修改电子合同', this.mod) && item.contract_state == 2) ? "" : "btn-disabled") + " order-btn-item"}
                                                    disabled={(haveActionAuth('修改电子合同', this.mod) && item.contract_state == 2) ? "" : "disabled"}
                                                    onClick={_ => this.editContract(item)}>修改</button>
                                            }{
                                                (item.contract_state == 2) &&
                                                <button
                                                    className={((haveActionAuth('删除电子合同', this.mod) && item.contract_state == 2) ? "" : "btn-disabled") + " order-btn-item"}
                                                    disabled={(haveActionAuth('删除电子合同', this.mod) && item.contract_state == 2) ? "" : "disabled"}
                                                    onClick={_ => this.DeleteContract(item)}>删除</button>
                                            }{
                                                (item.contract_state == 2) &&
                                                <button
                                                    className={((haveActionAuth('合同预览', this.mod) && item.contract_state == 2) ? "" : "btn-disabled") + " order-btn-item"}
                                                    disabled={(haveActionAuth('合同预览', this.mod) && item.contract_state == 2) ? "" : "disabled"}
                                                    onClick={_ => this.PreviewContract(item)}>预览</button>
                                            }{
                                                (item.contract_state == 2) &&
                                                <button
                                                    className={((haveActionAuth('提交电子合同', this.mod) && item.contract_state == 2) ? "" : "btn-disabled") + " order-btn-item"}
                                                    disabled={(haveActionAuth('提交电子合同', this.mod) && item.contract_state == 2) ? "" : "disabled"}
                                                    onClick={_ => this.SubmitContract(item)}>提交</button>
                                            }{
                                                (item.contract_state == 3) &&
                                                <button
                                                    className={((haveActionAuth('查询电子合同签名状态', this.mod) && item.contract_state == 3) ? "" : "btn-disabled") + " order-btn-item"}
                                                    disabled={(haveActionAuth('查询电子合同签名状态', this.mod) && item.contract_state == 3) ? "" : "disabled"}
                                                    onClick={_ => this.InquireSign(item)}>查询</button>
                                            }{
                                        (item.contract_state == 4 || item.contract_state == 5 || item.contract_state == 6) &&
                                        <button
                                            className={((item.contract_state == 4 || item.contract_state == 5 || item.contract_state == 6) ? "" : "btn-disabled") + " order-btn-item"}
                                            disabled={(item.contract_state == 4 || item.contract_state == 5 || item.contract_state == 6) ? "" : "disabled"}
                                                    onClick={_ => this.SeeContractSign(index)}>签名</button>
                                            }{
                                                (item.contract_state == 4) &&
                                                <button
                                                    className={((haveActionAuth('盖章电子合同', this.mod) && item.contract_state == 4) ? "" : "btn-disabled") + " order-btn-item"}
                                                    disabled={(haveActionAuth('盖章电子合同', this.mod) && item.contract_state == 4) ? "" : "disabled"}
                                                    onClick={_ => this.SignByProof(item)}>盖章</button>
                                            }{
                                                (item.contract_state == 3 || item.contract_state == 4) &&
                                                <button
                                                    className={((haveActionAuth('取消电子合同', this.mod) && (item.contract_state == 3 || item.contract_state == 4)) ? "" : "btn-disabled") + " order-btn-item"}
                                                    disabled={(haveActionAuth('取消电子合同', this.mod) && (item.contract_state == 3 || item.contract_state == 4)) ? "" : "disabled"}
                                                    onClick={_ => this.RevokeContract(item)}>撤回</button>
                                        }{
                                        (item.contract_state == 5 ||item.contract_state == 6) &&
                                            <button
                                                className={((item.contract_state == 5 || item.contract_state == 6) ? "" : "btn-disabled") + " order-btn-item"}
                                                disabled={(item.contract_state == 5 || item.contract_state == 6) ? "" : "disabled"}
                                                onClick={_ => this.UploadContract(item)}>下载</button>
                                        }{
                                        (item.contract_state == 6) &&
                                        <button
                                            className={((haveActionAuth('作废电子合同', this.mod) && item.contract_state == 6) ? "" : "btn-disabled") + " order-btn-item"}
                                            disabled={(haveActionAuth('作废电子合同', this.mod) && item.contract_state == 6) ? "" : "disabled"}
                                            onClick={_ => this.AbolishContract(item)}>作废</button>
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
                {this.state.data && this.state.cur_index !== '' && this.DialogImg()}
            </Page>
        );
    }
}

export default connect(s => ({ s: s }))(ContractList)

