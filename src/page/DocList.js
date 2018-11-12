import React, { Component, Fragment } from 'react';

import { Page, Popover } from 'react-onsenui';

import { AppCore, loadMore, loadIfEmpty, i18n, goTo, reload, goBack, Enum, hasPlugin } from '../util/core';
import { pullHook, loginToPlay, SearchLv2, nonBlockLoading, info } from '../util/com';
import { connect } from 'react-redux';
import { appConst } from '../util/const';

class DocList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            state: 'initial', data: [], search: { order_id: '', short_name: '' },

            open_search_key: false,
            cur_select_search_filter: { search: 'order_id', text: '订单号' },
        };
        this.mod = '订单管理';
        // this.action = '选择收款订单';
        this.pageSize = 20
        this.view = this.props.p.view
    }


    componentDidMount() {
    }

    selectDoc(doc){
        if(this.view.state.GL_SK_DOC.find(item=> item.order_id === doc.order_id)){
            info('该订单已认领');
            return
        };
        let GL_SK_DOC = this.view.state.GL_SK_DOC;
        GL_SK_DOC.push(doc)
        this.view.props.p.params['单据信息'][0]['settle_obj_id'] = doc.cstm_id
        this.view.setState({ GL_SK_DOC })
        goBack()
    }


    renderToolbar() {
        let search_cfg = {

            key: 'MyAccount',
            cb: (value, key) => {
                let search = this.state.search
                search['order_id'] = ''
                search['short_name'] = ''
                search[key] = value
                this.setState({ search: search });
                reload(this)
            }
        }
        return <SearchLv2 value={this.state.search.order_id || this.state.search.short_name || ''}
            open_search_key={_ => this.setState({ open_search_key: true })}
            cur_select={this.state.cur_select_search_filter || ''}
            clear={e => { e.stopPropagation(); this.setState({ search: { ...this.state.search, order_id: '', short_name: '' } }, _ => reload(this)) }}
            param={search_cfg} set_anchor={anchor => this.search_anchor = anchor} />
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

    renderFixed() {
        if (!this.refs.myAccount) {
            return;
        }

        if (AppCore.os) {
            this.tbHeight = (AppCore.os === 'ios' ? 56 : 68);
        }
        return (
            <div className="fixed-top-box" >
                <div className="money-care-books-title fixed-top" style={{ top: this.tbHeight + 'px', fontSize: '.32rem' }}>
                    <span className="money-care-books-title-item-4">订单号</span>
                    <span className="money-care-books-title-item-4">报名人</span>
                    <span className="money-care-books-title-item-4">客户简称</span>
                    <span className="money-care-books-title-item-4">未收</span>
                </div>
            </div>
        )
    }

    render() {
        return (
            <Page renderToolbar={_ => this.renderToolbar()} renderFixed={_ => this.renderFixed()}
                onInfiniteScroll={done => loadMore(this, done)} onShow={_ => loadIfEmpty(this)}>
                {
                    this.props.s.user.sid &&
                    <Fragment>
                        <div style={{ width: '100px', height: '62px' }}></div>

                        <Popover
                            animation="none"
                            direction="down"
                            isOpen={this.state.open_search_key}
                            onCancel={() => this.setState({ open_search_key: false })}
                            getTarget={() => this.search_anchor}
                        >
                            <div className="dialog-select-box">
                                <div className="dialog-select-item" onClick={_ => this.setState({ open_search_key: false, cur_select_search_filter: { text: '订单号', search: 'order_id' } })}>订单号</div>
                                <div className="dialog-select-item" onClick={_ => this.setState({ open_search_key: false, cur_select_search_filter: { text: '客户简称', search: 'short_name', } })}>客户简称</div>
                            </div>
                        </Popover>
                        {
                            !this.state.loading && pullHook(this)
                        }
                        <div className="money-care-books-box" ref="myAccount" style={{ marginTop: '0' }}>
                            <div className="money-care-books-main">
                                {this.state.data.map((doc, i) =>
                                    <div className="money-care-books-main-item" key={doc.id} style={{ fontSize: '.266667rem' }}
                                    onClick={_=>this.selectDoc(doc)}>
                                        <span className="money-care-books-main-item-col-4">D0{doc.order_id}</span>
                                        <span className="money-care-books-main-item-col-4">{doc.employee_name}</span>
                                        <span className="money-care-books-main-item-col-4">{doc.short_name}</span>
                                        <span className="money-care-books-main-item-col-4">{doc.receive_diff}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        {
                            this.state.loading && nonBlockLoading()
                        }
                    </Fragment>
                }
                {
                    !this.props.s.user.sid && loginToPlay()
                }

            </Page>
        );
    }
}

export default connect(s => ({ s: s }))(DocList)

