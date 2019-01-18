import React, { Component, Fragment } from 'react';

import { Page, Popover } from 'react-onsenui';

import { AppCore, AppMeta, loadMore, loadIfEmpty, i18n, goTo, reload, goBack, Enum, hasPlugin, encUrl } from '../util/core';
import { pullHook, loginToPlay, SearchLv2, nonBlockLoading } from '../util/com';
import { connect } from 'react-redux';
import { appConst } from '../util/const';

class StatisticalPresentation extends Component {

    constructor(props) {
        super(props);

        this.state = {
            state: 'initial', data: [], page: 1,
            search: { ...props.p.search },
            key_type: 1, // 1是 人数 2是 流水
        };
        this.mod = props.p.mod || null;
        this.url = null
    }


    componentDidMount() {
    }

    renderFixed() {
        if (AppCore.os) {
            this.tbHeight = (AppCore.os === 'ios' ? 56 : 68);
        }
        return (
            <div className="fixed-top-box" >
                <div className="StatisticalPresentation-date" style={{ top: this.tbHeight + 'px'}}>
                    <span style={{paddingTop:'.213333rem'}}>{this.props.p.search.dep_date_from}</span>
                    <span style={{width: '1.6rem'}}><img src="img/rightDate.png" className="img-size" /></span>
                    <span style={{paddingTop:'.213333rem'}}>{this.props.p.search.dep_date_to}</span>
                    <div className="StatisticalPresentation-sort">
                        <span className={"StatisticalPresentation-sort-item "+(this.state.key_type === 2 ? 'StatisticalPresentation-sort-item-active' : '')} 
                        onClick={_=>this.setListSortType(2)}>按流水排序</span>
                        <span className={"StatisticalPresentation-sort-item "+(this.state.key_type === 1 ? 'StatisticalPresentation-sort-item-active' : '')} 
                        onClick={_=>this.setListSortType(1)}>按人数排序</span>
                    </div>
                </div>
            </div>
        )
    }

    renderToolbar() {
        return (
            <ons-toolbar>
                <div className='left'><ons-back-button></ons-back-button></div>
                <div className={(AppCore.os === 'ios' ? "" : "Andriod-title") + " center"}>{this.mod}</div>
            </ons-toolbar>
        );
    }

    pageAdd(done){
        this.setState({page: ++this.state.page})
        done()
    }

    pd_type(nav){
        let nav_type = Enum['NavToType'][nav];
        let pd_tag_type = 'PdTag';
        switch (nav_type) {
            case '0':
                pd_tag_type = 'PdTag';
                break;
            case '1':
                pd_tag_type = 'Country';
                break;
            case '2':
                pd_tag_type = 'Continent';
                break;
        }

        let pd_sub_tag_type = 'PdSubTag';
        switch (pd_tag_type) {
            case 'PdTag':
                pd_sub_tag_type = 'PdSubTag';
                break;
            case 'Country':
                pd_sub_tag_type = 'City';
                break;
            case 'Continent':
                pd_sub_tag_type = 'Country';
                break;
        }
        return [pd_tag_type, pd_sub_tag_type]
    }

    setListSortType(val){
        this.setState({ key_type: val }, _ => this.list_sort())
    }
    list_sort(){
        let data = this.state.data
        let key = this.state.cur_key
        let news = ''
        let news2 = ''
        if (this.state.key_type === 2){
            key = this.state.cur_key2
        }
        for (let i = 0, len = data['统计结果'][this.state.cur_key].length; i < len; i++) {
            for (let j = 0; j < len - 1 - i; j++) {
                if (parseInt(data['统计结果'][key][j]['result']) < parseInt(data['统计结果'][key][j + 1]['result'])) {
                    news = data['统计结果'][this.state.cur_key][j]
                    news2 = data['统计结果'][this.state.cur_key2][j]
                    data['统计结果'][this.state.cur_key][j] = data['统计结果'][this.state.cur_key][j + 1]
                    data['统计结果'][this.state.cur_key2][j] = data['统计结果'][this.state.cur_key2][j + 1]
                    data['统计结果'][this.state.cur_key][j + 1] = news
                    data['统计结果'][this.state.cur_key2][j + 1] = news2
                }
            }
        }
        this.setState({ data: data })

    }
    afterLoad(){
        this.list_sort()
    }

    loadDate(){
        // url = cfg.perm_read[0] + '?' + encUrl({ ...view.state.search, mod: view.mod });
        if(this.mod === '同业采购统计'){
            this.setState({cur_key: 'industry_c1', cur_key2: 'industry_c2'})
            this.url = '/stat/Stat/readChart/同业采购统计?' + encUrl({ ...this.state.search, group_by: 'supplier_id', chart_arr: 'industry_c1,industry_c2', mod: this.mod })
        }
        if (this.mod === '产品标签统计') {
            this.setState({ cur_key: 'product_c1', cur_key2: 'product_c2'})
            this.url = '/stat/Stat/readChart/产品标签统计?' + encUrl({ ...this.state.search, group_by: 'pd_subtag_id', chart_arr: 'product_c1,product_c2', mod: this.mod })
        }
        if (this.mod === '门市收客统计') {
            this.setState({ cur_key: 'store_c1', cur_key2: 'store_c2'})
            this.url = '/stat/Stat/readChart/门市收客统计?' + encUrl({ ...this.state.search, group_by: 'department_id', chart_arr: 'store_c1,store_c2', mod: this.mod })
        }
        loadIfEmpty(this, this.afterLoad)
    }

    render() {
        return (
            <Page renderToolbar={_ => this.renderToolbar()} renderFixed={_ => this.renderFixed()}
                onInfiniteScroll={done => this.pageAdd(done)} 
                onShow={_ => this.loadDate()}
            >
                {
                    this.props.s.user.sid &&
                    <Fragment>
                        {
                            !this.state.loading && pullHook(this)
                        }
                        <div style={{ width: '100px', height: '70px' }}></div>

                        <div className="StatisticalPresentation" style={{ marginTop: '0' }}>
                            {/* 同业采购 用 */}
                            {this.mod === '同业采购统计' && this.state.data && this.state.data['统计结果'] &&
                                <div className="StatisticalPresentation-main">
                                {this.state.data['统计结果'].industry_c1.map((item, i) =>{
                                    return (
                                        <div key={item.hor_axis} className={this.state.page * 20 >= i ? "StatisticalPresentation-two-item":'hide'}>
                                            <div className="StatisticalPresentation-two-num">{i + 1}</div>
                                            <div className="StatisticalPresentation-two-name">
                                                <div style={{ color: '#333' }}>{Enum['Supplier'][item.hor_axis] || '青旅自组'}</div>
                                                <div style={{ color: '#999' }}>流水: {this.state.data['统计结果'].industry_c2[i].result}</div>
                                            </div>
                                            <div className="StatisticalPresentation-two-num_people">人数: {item.result}</div>
                                        </div>
                                    )
                                }
                                )}
                                </div>
                            }
                            
                            {/* 线路区域 用 */}
                            {this.mod === '产品标签统计' && this.state.data && this.state.data['统计结果'] &&
                                <div className="StatisticalPresentation-main">
                                {this.state.data['统计结果'].product_c1.map((item, i) =>
                                    <div key={item.hor_axis} className={this.state.page * 20 >= i ? "StatisticalPresentation-two-item" : 'hide'}>
                                        <div className="StatisticalPresentation-two-num">{i+1}</div>
                                        <div className="StatisticalPresentation-two-name">
                                            <div style={{ color: '#333' }}>{Enum[this.pd_type(item.nav)[0]][item.tag] + '-' + Enum[this.pd_type(item.nav)[1]][item.hor_axis]}</div>
                                            <div style={{ color: '#999' }}>流水: {this.state.data['统计结果'].product_c2[i].result}</div>
                                        </div>
                                        <div className="StatisticalPresentation-two-num_people">人数: {item.result}</div>
                                    </div>
                                    )}
                                </div>
                            }

                            {/* 门市收客 用 */}
                            {this.mod === '门市收客统计' && this.state.data && this.state.data['统计结果'] && 
                                <div className="StatisticalPresentation-main">
                                {this.state.data['统计结果'].store_c1.map((item, i) =>
                                    <div key={item.hor_axis} className={this.state.page * 20 >= i ? "StatisticalPresentation-two-item" : 'hide'}>
                                        <div className="StatisticalPresentation-two-num">{i+1}</div>
                                        <div className="StatisticalPresentation-two-name">
                                            <div style={{ color: '#333' }}>{Enum['Department'][item.hor_axis]}</div>
                                            <div style={{ color: '#999' }}>流水: {this.state.data['统计结果'].store_c2[i].result}</div>
                                        </div>
                                        <div className="StatisticalPresentation-two-num_people">人数: {item.result}</div>
                                    </div>
                                    )}
                                </div>
                            }
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

export default connect(s => ({ s: s }))(StatisticalPresentation)

