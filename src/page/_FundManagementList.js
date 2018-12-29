import React, { Component, Fragment } from 'react';

import { Page, Popover } from 'react-onsenui';

import { AppCore, loadMore, loadIfEmpty, i18n, goTo, reload, goBack, Enum, hasPlugin } from '../util/core';
import { pullHook, loginToPlay, SearchLv2, nonBlockLoading, info } from '../util/com';
import { connect } from 'react-redux';
import { appConst } from '../util/const';

class FundManagementList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            state: 'initial', data: [], search: { used: '', used_diff: '' },

            open_search_key: false,
            cur_select_search_filter: { search: 'used', text: '已用金额' },
        };
        this.mod = '资金认领';
        // this.action = '选择收款订单';
        this.pageSize = 20
        this.view = this.props.p.view
        this.view_mod = this.props.p.mod
    }

    selectDoc(doc) {
        let data = this.view.state.data
        console.log(doc)
        // 这个单据信息不应该写死,但是现在够用,等单据多了在抽象出来
        // data['单据信息'][0].settle_amount = doc.amount

        data[this.view_mod][0] = doc
        this.view.setState({data: data})
        goBack()
    }


    renderToolbar() {
        let search_cfg = {

            key: 'MyAccount',
            cb: (value, key) => {
                let search = this.state.search
                search['used'] = ''
                search['used_diff'] = ''
                search[key] = value
                this.setState({ search: search });
                reload(this)
            }
        }
        return <SearchLv2 value={this.state.search.used || this.state.search.used_diff || ''}
            open_search_key={_ => this.setState({ open_search_key: true })}
            cur_select={this.state.cur_select_search_filter || ''}
            clear={e => { e.stopPropagation(); this.setState({ search: { ...this.state.search, used: '', used_diff: '' } }, _ => reload(this)) }}
            param={search_cfg} set_anchor={anchor => this.search_anchor = anchor} />
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
                    <span className="money-care-books-title-item-4">创建人</span>
                    <span className="money-care-books-title-item-4">结算方式</span>
                    <span className="money-care-books-title-item-4">结算币种</span>
                    <span className="money-care-books-title-item-4">已用金额</span>
                    <span className="money-care-books-title-item-4">未用金额</span>
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
                                <div className="dialog-select-item" onClick={_ => this.setState({ open_search_key: false, cur_select_search_filter: { text: '已用金额', search: 'used' } })}>已用金额</div>
                                <div className="dialog-select-item" onClick={_ => this.setState({ open_search_key: false, cur_select_search_filter: { text: '未用金额', search: 'used_diff', } })}>未用金额</div>
                            </div>
                        </Popover>
                        {
                            !this.state.loading && pullHook(this)
                        }
                        <div className="money-care-books-box" ref="myAccount" style={{ marginTop: '0' }}>
                            <div className="money-care-books-main">
                                {this.state.data.map((doc, i) =>
                                    <div className="money-care-books-main-item" key={doc.id} style={{ fontSize: '.266667rem' }}
                                        onClick={_ => this.selectDoc(doc)}>
                                        <span className="money-care-books-main-item-col-4">{doc.employee_name}</span>
                                        <span className="money-care-books-main-item-col-4">{Enum.SettleWay[doc.settle_way_id]}</span>
                                        <span className="money-care-books-main-item-col-4">{Enum.Currency[doc.currency_id]}</span>
                                        <span className="money-care-books-main-item-col-4">{doc.used}</span>
                                        <span className="money-care-books-main-item-col-4">{doc.used_diff}</span>
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

export default connect(s => ({ s: s }))(FundManagementList)

