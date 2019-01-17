import React, { Component, Fragment } from 'react';

import { Page } from 'react-onsenui';

import { AppCore, loadMore, loadIfEmpty, i18n, goTo, reload, goBack, Enum, post, encUrl } from '../util/core';
import { pullHook, loginToPlay, SearchLv2, nonBlockLoading } from '../util/com';
import { connect } from 'react-redux';

class StatisticalFund extends Component {

    constructor(props) {
        super(props);
        this.state = { state: 'initial', cur_index: 0, data: [], search: { }, };
        this.text = '统计业务资金';
        // this.pageSize = 20;

    }


    componentDidMount() {
    }

    setFilter(val){
        this.setState({ cur_index: val, data: '' }, this.loadDate)
    }

    renderFixed() {
        if (AppCore.os) {
            this.tbHeight = (AppCore.os === 'ios' ? 56 : 68);
        }
        return (
            <div className="fixed-top-box" >
                <div className="StatisticalFund-filter fixed-top" style={{ top: this.tbHeight + 'px' }}>
                    <div onClick={_=>this.setFilter(0)} 
                    className={"StatisticalFund-filter-item " + (this.state.cur_index === 0 ? 'StatisticalFund-filter-item-active':'')}
                    >全盘视角</div>
                    <div onClick={_=>this.setFilter(1)} 
                    className={"StatisticalFund-filter-item " + (this.state.cur_index === 1 ? 'StatisticalFund-filter-item-active':'')}
                    >年度视角</div>
                    <div onClick={_=>this.setFilter(2)} 
                    className={"StatisticalFund-filter-item " + (this.state.cur_index === 2 ? 'StatisticalFund-filter-item-active':'')}
                    >半年视角</div>
                    <div onClick={_=>this.setFilter(3)} 
                    className={"StatisticalFund-filter-item " + (this.state.cur_index === 3 ? 'StatisticalFund-filter-item-active':'')}
                    >季度视角</div>
                    <div onClick={_=>this.setFilter(4)} 
                    className={"StatisticalFund-filter-item " + (this.state.cur_index === 4 ? 'StatisticalFund-filter-item-active':'')}
                    >月份视角</div>
                </div>
            </div>
        )
    }


    renderToolbar() {
        return (
            <ons-toolbar>
                <div className='left'><ons-back-button></ons-back-button></div>
                <div className={(AppCore.os === 'ios' ? "" : "Andriod-title") + " center"}>{this.text}</div>
            </ons-toolbar>
        )
    }

    afterLoad(data){
        switch (this.FilterTypeArr[this.state.cur_index]) {
            case 'all':
                this.setState({ data: data })
                break;
            case 'approve_at_year':
                let count_approve_at_year = ''
                for(let i = 0, len = data['统计结果'].doc_fund_c1.length; i < len; i++){
                    for(let j = 0; j < len-1-i; j++ ){
                        if (data['统计结果'].doc_fund_c1[j].hor_axis < data['统计结果'].doc_fund_c1[j+1].hor_axis){
                            count_approve_at_year = data['统计结果'].doc_fund_c1[j]
                            data['统计结果'].doc_fund_c1[j] = data['统计结果'].doc_fund_c1[j+1]
                            data['统计结果'].doc_fund_c1[j + 1] = count_approve_at_year
                        }
                    }
                }
                this.setState({data: data})
                break;
            case 'approve_at_mid_year':
                let count_approve_at_mid_year = ''
                for (let i = 0, len = data['统计结果'].doc_fund_c1.length; i < len; i++) {
                    for (let j = 0; j < len - 1 - i; j++) {
                        if (data['统计结果'].doc_fund_c1[j].hor_axis < data['统计结果'].doc_fund_c1[j + 1].hor_axis) {
                            count_approve_at_mid_year = data['统计结果'].doc_fund_c1[j]
                            data['统计结果'].doc_fund_c1[j] = data['统计结果'].doc_fund_c1[j + 1]
                            data['统计结果'].doc_fund_c1[j + 1] = count_approve_at_mid_year
                        }
                    }
                }
                this.setState({ data: data })
                break;
            case 'approve_at_quarter':
                let count_approve_at_quarter = ''
                for (let i = 0, len = data['统计结果'].doc_fund_c1.length; i < len; i++) {
                    for (let j = 0; j < len - 1 - i; j++) {
                        if (data['统计结果'].doc_fund_c1[j].approve_at_year + data['统计结果'].doc_fund_c1[j].approve_at_quarter < data['统计结果'].doc_fund_c1[j+1].approve_at_year + data['统计结果'].doc_fund_c1[j+1].approve_at_quarter) {
                            count_approve_at_quarter = data['统计结果'].doc_fund_c1[j]
                            data['统计结果'].doc_fund_c1[j] = data['统计结果'].doc_fund_c1[j + 1]
                            data['统计结果'].doc_fund_c1[j + 1] = count_approve_at_quarter
                        }
                    }
                }
                this.setState({ data: data })
                break;
            case 'approve_at_month':
                let count_approve_at_month = ''
                for (let i = 0, len = data['统计结果'].doc_fund_c1.length; i < len; i++) {
                    for (let j = 0; j < len - 1 - i; j++) {
                        const j_num = data['统计结果'].doc_fund_c1[j].approve_at_year + (data['统计结果'].doc_fund_c1[j].approve_at_month >= 10 ? data['统计结果'].doc_fund_c1[j].approve_at_month : '0' + data['统计结果'].doc_fund_c1[j].approve_at_month)
                        const j_1_num = data['统计结果'].doc_fund_c1[j + 1].approve_at_year + (data['统计结果'].doc_fund_c1[j+1].approve_at_month >= 10 ? data['统计结果'].doc_fund_c1[j+1].approve_at_month : '0' + data['统计结果'].doc_fund_c1[j+1].approve_at_month)
                        if (j_num < j_1_num) {
                            count_approve_at_month = data['统计结果'].doc_fund_c1[j]
                            data['统计结果'].doc_fund_c1[j] = data['统计结果'].doc_fund_c1[j + 1]
                            data['统计结果'].doc_fund_c1[j + 1] = count_approve_at_month
                        }
                    }
                }
                this.setState({ data: data })
                break;
            default:
                break;
        }
    }
    // 年:approve_at_year  月approve_at_month 半年:approve_at_mid_year 季度approve_at_quarter 所有all
    FilterTypeArr = ['all','approve_at_year', 'approve_at_mid_year', 'approve_at_quarter', 'approve_at_month']
    loadDate(){
        let that = this
        let param = {'group_by':this.FilterTypeArr[this.state.cur_index] , 'chart_arr':'doc_fund_c1', mod:'业务资金统计'}
        param = encUrl(param)
        const url = `/stat/Stat/readChart/业务资金统计?${param}`
        loadIfEmpty(this)
        post(url).then(
            r => {
                that.afterLoad(r.data)
            }
        );
    }

    render() {
        return (
            <Page renderToolbar={_ => this.renderToolbar()} 
                renderFixed={_ => this.renderFixed()}
                onShow={_ => this.loadDate()}
            >
                {
                    !this.state.loading && pullHook(this)
                }
                <div style={{ width: '100px', height: '62px' }}></div>

                <div className="StatisticalFund">
                {this.state.data && this.state.data['统计结果'] && 
                this.state.data['统计结果'].doc_fund_c1.map((item,index) =>
                    <div className="StatisticalFund-item" key={index}>
                        <div className="StatisticalFund-item-title">{item.hor_axis ? item.hor_axis : ''}</div>
                        <div className="StatisticalFund-item-main">
                            <div className="StatisticalFund-item-cell">
                                <img className="StatisticalFund-item-cell-img" src="img/books1.png" />
                                <span className="StatisticalFund-item-cell-text">收入总计</span>
                                <span className="StatisticalFund-item-cell-price">{item.income}</span>
                            </div>
                            <div className="StatisticalFund-item-cell">
                                <img className="StatisticalFund-item-cell-img" src="img/books2.png" />
                                <span className="StatisticalFund-item-cell-text">支出总计</span>
                                <span className="StatisticalFund-item-cell-price">{item.expense}</span>
                            </div>
                            <div className="StatisticalFund-item-cell">
                                <img className="StatisticalFund-item-cell-img" src="img/books3.png" />
                                <span className="StatisticalFund-item-cell-text">时时余额</span>
                                <span className="StatisticalFund-item-cell-price">{item.remaining_sum}</span>
                            </div>
                        </div>
                    </div>
                )
                }
            </div>

            </Page>
        );
    }
}

export default connect(s => ({ s: s }))(StatisticalFund)

