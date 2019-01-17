import React, { Component } from 'react';

import { Page, Icon } from 'react-onsenui';
import { log, AppCore, AppMeta, loadIfEmpty, goTo, Enum, goBack } from '../util/core';
import { info } from '../util/com';

export default class StatisticsDate extends Component {

    constructor(props) {
        super(props);

        this.state = {
            search: {
                dep_date_from: '',
                dep_date_to: '',
            }
        };
    }

    submit() {
        let mod = this.props.p.mod || null;
        // if (this.props.p && this.props.p.action === '高级资金搜索') {
            
        // } else {
        //     // 普通 搜索 条件 (全部都是必填)
        //     let flag = Object.keys(this.state.search).some(item => this.state.search[item] === '')
        //     if (flag) {
        //         info('请填写全部搜索条件');
        //         return;
        //     }
        //     action = '资金查询'
        // }
        goTo('统计呈现', { search: { ...this.state.search }, mod: mod });
    }


    renderToolbar() {
        return (
            <ons-toolbar>
                <div className='left'><ons-back-button></ons-back-button></div>
                <div className={(AppCore.os === 'ios' ? "" : "Andriod-title") + " center"}>{this.props.p.mod}</div>
            </ons-toolbar>
        );
    }

    render() {
        return (
            <Page renderToolbar={_ => this.renderToolbar()} >
                <div className="StatisticsDate">
                    <div className="StatisticsDate-input-box" style={{ marginTop: '0' }}>
                        <div className="StatisticsDate-input-cell">
                            <img className="StatisticsDate-input-cell-left-img" src="img/tongji_icon/start.png" />
                            <span className="StatisticsDate-input-cell-left">
                                起始日期:
                            </span>
                            <span className="StatisticsDate-input-cell-right">
                                <input type="date" value={this.state.search.dep_date_from}
                                    onChange={e => this.setState({ search: { ...this.state.search, dep_date_from: e.target.value } })}
                                    placeholder="出团日起" />
                            </span>
                        </div>
                        <div className="StatisticsDate-input-cell">
                            <img className="StatisticsDate-input-cell-left-img" src="img/tongji_icon/end.png" />
                            <span className="StatisticsDate-input-cell-left">
                                结束日期:
                            </span>
                            <span className="StatisticsDate-input-cell-right">
                                <input type="date" value={this.state.search.dep_date_to}
                                    onChange={e => this.setState({ search: { ...this.state.search, dep_date_to: e.target.value } })}
                                    placeholder="出团日止" />
                            </span>
                        </div>
                    </div>
                    {/* 游客名单 */}
                    <div className="enter-tour-list-btn" style={{ justifyContent: 'center' }}>
                        <button className="enter-tour-list-btn-submit" onClick={this.submit.bind(this)}>呈现数据</button>
                    </div>
                </div>
            </Page>
        );
    }
}

