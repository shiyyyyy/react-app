// 新增合同
import React, { Component, Fragment } from 'react';

import { Page, Icon } from 'react-onsenui';

import { plugin,hasPlugin,encUrl, AppCore, resetTo, AppMeta, goTo, Enum, loadIfEmpty, goBack, trigger, submit, post, get_req_data, reload,resetToTab,resetToLv2Page} from '../util/core';
import { pullHook, loginToPlay, OpDialog, SupplierDialog, ErrorBoundary, info, footer, nonBlockLoading, confirm } from '../util/com';
import { connect } from 'react-redux';


import '../css/OrderEditPage.css';
import '../css/Contract.css';


class AddContract4 extends Component {

    constructor(props) {
        super(props);

        this.state = {
            submitDown: false
        };
        this.action = this.props.p.action
    }
    componentWillMount(){
        let data = this.props.p.data
        // 新增 时, 没有其他约定 , 不给空数组map报错
        if(data['其他约定'] === undefined){
            data['其他约定'] = []
        }
        // 新增时, 没有choose 要给个默认
        if(!(data['争议解决'][0] && data['争议解决'][0].choose >= 0)){
            data['争议解决'][0].choose = 1
        }
        //data['争议解决'].map((item,i)=>{
        //    if(i===0){
        //        item.choose = 1
        //    }else{
        //        item.choose = 0
        //    }
        //})
        this.setState({data: data})
    }
    // 约定 && 约定备注
    yuedingSelect(item,index){
        let data = this.state.data
        if(data['发团约定'][index].agree === 1){
            data['发团约定'][index].agree = 0
        }else{
            data['发团约定'][index].agree = 1
        }
        this.setState({ data: data })
    }
    yuedingComment(e,index){
        let data = this.state.data
        data['发团约定'][index].comment = e.target.value
        this.setState({data: data})
    }
    // 争议 && 争议备注
    zhengyiSelect(item) {
        let data = this.state.data
        if(item.choose===1){
            item.choose = 0
            item.solution_detail = ''
        } else{
            item.choose = 1
        }

        this.setState({ data: data })
    }
    zhengyiComment(e, index) {
        let data = this.state.data
        data['争议解决'][index].solution_detail = e.target.value
        this.setState({ data: data })
    }


    // 预览  &&  保存合同
    PreviewContract(){
        let url;
        this.action='合同预览';
        let cfg = AppMeta.actions[this.action];
        url = cfg.read.url + '?action=' + this.action +'&id=' + this.state.data.contract_id
            +'&dataSource='+ this.state.data.dataSource;
        trigger('加载等待');
        post(url).then(
            r => {
                //返回合同的save_path
                let url = r.data.save_path;
                this.state.data.pdf_url = url;
                if(this.state.data.pdf_url && hasPlugin('cordova.InAppBrowser')){
                    plugin('cordova.InAppBrowser').open(AppCore.HOST+'/'+this.state.data.pdf_url,'_system');
                }
            }
        )
    }

    SaveContract(){
        trigger('加载等待');
        this.state.data.dataSource='app'
        submit(this,this.submit_done.bind(this));
    }
    submit_done(r){
        info('保存成功!');
        let data = this.state.data
        data['contract_id']=r.data.contract_id;
        this.setState({data:data,submitDown:true});
    }

    Verification() {
        let data = this.state.data
        if(data['发团约定'].every(item=> item.agree === 0 )){
            info('至少选择一个发团约定');
            return true
        }
        if (data['发团约定'][0].agree === 1 && data['发团约定'][0].comment === ''){
            info('请填写我社委托其他旅行社履行合同备注');
            return true
        }
        if (data['发团约定'][4].agree === 1 && data['发团约定'][4].comment === '') {
            info('请填写采用拼团方式至其他旅行社成团备注');
            return true
        }
        if(data['争议解决'].every(item=>item.choose === 0)){
            info('请选择争议解决');
            return true
        }
        let cur_zy = data['争议解决'].map(item=>item.choose === 1)
        if (cur_zy[0] === true && (data['争议解决'][0].solution_detail === '' || data['争议解决'][0].solution_detail === undefined)) {
            info('请选择争议解决');
            return true
        }
        if (cur_zy[1] === true && (data['争议解决'][1].solution_detail === '' || data['争议解决'][1].solution_detail === undefined)) {
            info('请选择争议解决');
            return true
        }
        return false
    }
    // 
    //  + -
    setMinus(key) {
        let data = this.state.data
        if (data[key].length == 0) return;
        data[key].pop()
        this.setState({ data: data })
    }
    setPlus(key) {
        let data = this.state.data;
        data[key].push({})
        this.setState({ data: data })
    }

    // 其他约定 违约责任
    editComment(e,index) {
        let data = this.state.data
        data['其他约定'][index].comment = e.target.value
        this.setState({ data: data })
    }
    afterLoad(){
    }

    goToOrderPage(e) {
        let prompt = this.state.data.contract_state == 2 ? '是否确认返回合同列表页？' : '是否确认返回订单页？'        
        confirm(prompt).then(r => {
            if (r) {
                if (this.state.data.contract_state == 2){
                    resetToLv2Page('合同列表')
                    return
                }
                if (AppCore.TabPage) {
                    reload(AppCore.OrderPage)
                    resetToTab('订单页',1)
                }
            }
        });
    }
    renderToolbar() {
        return (
            <ons-toolbar>
                <div className='left goBack-img-box'>
                    <img src="img/back.png" onClick={e => this.goToOrderPage()} className="goBack-img" />
                </div>
                <div className={(AppCore.os === 'ios' ? "" : "Andriod-title") + " center"}>{this.state.data.contract_state==2? '修改合同':'新增合同'}</div>

            </ons-toolbar>
        );
    }


    render() {
        return (
            <Page renderToolbar={_ => this.renderToolbar()} 
            // onShow={_ => loadIfEmpty(this, this.afterLoad)}
            >
                {!this.state.data && nonBlockLoading()}
                {Object.keys(this.state.data).length>0 &&
                    <div>
                        {/* 发图约定 */}
                        <div className="add-con-mod">
                            <div className="add-con-title">
                                <div>发团约定</div>
                                <div style={{ lineHeight: "20px", paddingBottom: '10px' }}>最低成团人数<span style={{textDecoration:'underline'}}>{20}</span>人,如未达到最低出团人数,旅客是否愿意按照下列方式解决</div>
                            </div>
                            <div className="add-con-main">
                                {this.state.data &&
                                this.state.data['发团约定'].map((item,index)=>
                                <div className="add-con-cell" style={{ display: 'block' }} key={index}>
                                    <div className="add-con-cell-left">
                                        <input type="checkbox" id={'发团约定' + index} name="yd" checked={(item.agree-0)===1?true:false}
                                        value={index} onChange={e => this.yuedingSelect(item,index)} />
                                        <label htmlFor={'发团约定'+index}>同意</label> {item.solution}
                                    </div>
                                    <div className={(item.agree-0) === 1?'':'hide'}>
                                        <input onChange={e => this.yuedingComment(e,index)} value={item.comment || ''} className="add-com-next-input"
                                            placeholder={"请填写备注信息"} />
                                    </div>
                                </div>
                                )}
                            </div>
                        </div>
                        {/* 争议解决 */}
                        <div className="add-con-mod">
                            <div className="add-con-title">
                                <div>争议解决</div>
                                <div style={{ lineHeight: "20px", paddingBottom: '10px' }}>本合同履行过程中发生争议,由双方协商解决;亦可向合同当地的旅游质监执法机构、消费者协会等有关部门或者机构申请调解解决<br />争议解决方式选择: 协商或调解不成的,按下列方式解决</div>
                            </div>
                            <div className="add-con-main">
                                {this.state.data &&
                                this.state.data['争议解决'].map((item, index) =>
                                    <div className="add-con-cell" style={{ display: 'block' }} key={index}>
                                        <div className="add-con-cell-left">
                                        <input type="checkbox" id={'争议解决' + index} name="zy" value={index}
                                            checked={(item.choose - 0) === 1 ? true : false}
                                            onChange={e => this.zhengyiSelect(item,index)} />
                                            <label htmlFor={'争议解决'+index}>同意</label> {item.solution}
                                        </div>
                                        <div className={(item.choose - 0) === 1 ? '' : 'hide'}>
                                        <input onChange={e => this.zhengyiComment(e, index)} value={item.solution_detail || ''} className="add-com-next-input"
                                                placeholder={"请填写备注信息"} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 其他约定 */}
                        <div className="add-con-mod">
                            <div className="add-con-title">
                                <div>其他约定</div>
                                <div className="add-con-title-num">
                                    <Icon icon="md-minus-circle-outline" style={{ color: '#EE8585' }}
                                        onClick={e => this.setMinus("其他约定")} />
                                    <Icon icon="md-plus-circle-o" style={{ color: '#6FC5D8' }}
                                        onClick={e => this.setPlus("其他约定")} />
                                </div>
                            </div>
                            <div className="add-con-main" style={{paddingBottom:'6px'}}>
                            {this.state.data['其他约定'] && 
                                this.state.data['其他约定'].map((item, index) =>
                                <div className="add-con-cell" style={{ display: 'block',border:'none' }} key={index}>
                                    <div className="add-con-cell-text-box">
                                        <input value={item.comment||''} onChange={e => this.editComment(e, index)} className="add-con-cell-contenteditable"
                                        />
                                    </div>
                                </div>
                            )}
                            </div>
                        </div>

                        <div className="add-con-btn-box">
                        {this.state.submitDown &&
                        <Fragment>
                            <div className="add-con-btn" onClick={_ => this.PreviewContract()}>预览合同</div>
                            <div className="add-con-btn" onClick={_ => this.goToOrderPage()}>完成</div>
                        </Fragment> 
                        }
                        {!this.state.submitDown &&
                        <Fragment>
                            <div className="add-con-btn" onClick={_ => goBack()}>上一页</div>
                            <div className="add-con-btn" onClick={_ => this.SaveContract()}>保存合同</div>
                        </Fragment> 
                        }
                        </div>
                    </div>
                }
            </Page>
        );
    }
}

export default connect(s => ({ s: s }))(AddContract4)