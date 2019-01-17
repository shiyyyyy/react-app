import * as ons from 'onsenui';
import React from 'react';
import {PullHook,Icon,Modal,Button,Dialog,ProgressBar,AlertDialog,AlertDialogButton} from 'react-onsenui';
import { log, reloadSilent, i18n, resetTo, goTo, goBack, AppCore, AppMeta, Enum, trigger, clickToLog, post,encUrl} from './core';
import { connect } from 'react-redux';
import { doForceUpdate } from './update';


import "../css/SearchPage.css";

//--------------------------component----------------------------
export function loginToPlay() {
    return (
        <div className="prompt-login">
            <div className="prompt-img-box">
                <img src="img/prompt-login.png" className="prompt-img" />
                <span>您还没有登录</span><br />
                <span>登录后可查看相关内容</span>
            </div>
            <div className="text-center">
                <button className="login-btn" onClick={_=>resetTo('登录页')}>立即登录</button>
            </div>
        </div>
    );
}

export function NoPv() {
    return (
        <div className="prompt-login">
            <div className="prompt-img-box">
                <img src="img/prompt-login.png" className="prompt-img" />
                <span>您没有权限阅读当前内容</span><br />
            </div>
        </div>
    );
}

class PageCrash extends React.Component {
    constructor(props) {
        super(props);
        this.click_history = [];
    }
    render(){
        return (
            <ons-page>
                <ons-toolbar>
                  <div className='left'><ons-back-button></ons-back-button></div>
                  <div className="center" onClick={_=>clickToLog(this)} >崩溃</div>
                </ons-toolbar>
                <div className="prompt-login">
                    <div className="prompt-img-box">
                        <img src="img/prompt-login.png" className="prompt-img" />
                        <span>页面崩溃了</span><br />
                        <span>请联系供应商</span>
                    </div>
                </div>
            </ons-page>
        );
    }
}


export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }
  
  componentDidCatch(error, errorInfo) {
    // Catch errors in any components below and re-render with error message
    this.setState({
      error: error,
      errorInfo: errorInfo
    })
    // You can also log error messages to an error reporting service here
  }
  
  render() {
    if (this.state.errorInfo) {
      // Error path
      log(this.state.error,this.state.errorInfo.componentStack);
      return <PageCrash/>;
    }
    // Normally, just render children
    return this.props.children;
  }  
}

export function shareWith(view) {
    return (
          <Modal isOpen={view.state.shareWithOpen}>
            <div className="share-cancel" onClick={_ => view.setState({shareWithOpen: false})}></div>
            <div className="share">
                <div className="share-options">
                    <div className="wx-friends" onClick={() => view.share('SESSION')}>
                        <img src="img/wx.png"/><br />
                        <span>微信好友</span>
                    </div>
                    <div className="wx-friends-circle" onClick={() => view.share('TIMELINE')}>
                        <img src="img/wx-pyq.png"/><br />
                        <span>微信朋友圈</span>
                    </div>
            </div>
            <div className="share-options-cancel" onClick={_ => view.setState({shareWithOpen: false})}>
                  取消
            </div>
                      
            </div>

          </Modal>
    );
}

const refreshState = {
    'initial' : ['准备刷新...','fa-arrow-down',false],
    'preaction' : ['松开刷新...','fa-arrow-up',false],
    'action' : ['加载中...','fa-spinner',true],
};

export function pullHook(view) {
    return (
        <PullHook
          thresholdHeight={800}
          onChange={ e=>view.setState({state:e.state}) }
          onLoad={ 
            done=>reloadSilent(view, _=>{
                view.afterLoad && view.afterLoad();
                done();
              }
            ) 
          } 
        >

          <Icon class="pull-hook-content" 
            spin={ refreshState[view.state.state][2] } 
            icon={ refreshState[view.state.state][1] }>
          </Icon>&nbsp;&nbsp;
          { refreshState[view.state.state][0] }
        </PullHook>
    );
}

function alert({s}) {
    return (
        <AlertDialog animation="none" isOpen={!!s.alert.message} isCancelable={false} modifier="rowfooter">
         <div className="alert-dialog-title">{s.alert.title}</div>
         <div className="alert-dialog-content" dangerouslySetInnerHTML={{ __html: s.alert.message }}>
           {/* {s.alert.message} */}
         </div>
         <div className="alert-dialog-footer">
         {
            s.alert.buttonLabels && s.alert.buttonLabels.map((label,i) =>
               <AlertDialogButton onClick={_=>trigger('关闭alert',i)} modifier="rowfooter" key={i}>
                 {label}
               </AlertDialogButton>
            )
         }
         </div>
       </AlertDialog>
    );
}
export const Alert = connect(s=>({s:s}))(alert);

export function error(p) {
    log(p);
    let m = {
        message: p.message || p,
        title: p.title || i18n.get('ERROR'),
        buttonLabels: p.buttonLabels || [i18n.get('OK')]

    };
    return new Promise(rs=>{
        m.rs = rs;
        trigger('打开alert',m);
    });
    
    // return ons.notification.alert(m);
}
export function info(p) {
    let m = {
        message: p.message || p,
        title: p.title || i18n.get('PROMPT'),
        buttonLabels: p.buttonLabels || [i18n.get('OK')]

    };
    return new Promise(rs=>{
        m.rs = rs;
        trigger('打开alert',m);
    });
    // return ons.notification.alert(m);
}
export function confirm(p) {
    let m = {
        message: p.message || p,
        title: p.title || i18n.get('PROMPT'),
        buttonLabels: p.buttonLabels || [i18n.get('CANCEL'), i18n.get('OK')]

    };
    return new Promise(rs=>{
        m.rs = rs;
        trigger('打开alert',m);
    });
    // return ons.notification.confirm(m);
}
export function prompt(p) {
    let m = {
        message: p.message || p,
        title: p.title || i18n.get('PROMPT'),
        buttonLabels: p.buttonLabels || [i18n.get('CANCEL'), i18n.get('OK')]

    };
    return new Promise(rs=>{
        m.rs = rs;
        trigger('打开alert',m);
    });
    // return ons.notification.prompt(m);
}
export function toast(p) {
    let m = {
        message: p.message || p,
        timeout: p.timeout || 2000

    };
    return ons.notification.toast(m);
}


export function footer(type,view){
    return(
        <div className="order-edit-footer">
			<div className="order-edit-footer-box" onClick={_=>view.setState({open_supplier:true})}>
				<img src="img/gys.png" />
				<span>联系供应商</span>
			</div>
			<div className="order-edit-footer-box" onClick={_=>view.setState({open_op:true})} style={{lineHeight: '.32rem'}}>
				<img src="img/zs.png" />
				<span>联系总社</span>
			</div>
            { type == 'group' &&
			    <div className="pro-footer-zw" onClick={_=>view.holdSeat()}>占位</div>
            }{type == 'group' &&
			    <div className="pro-footer-sb" onClick={_=>view.realSignUp()}>实报</div>
            }
            {type == 'orderEdit' &&
			     <div className="order-edit-footer-save" onClick={_=>view.submit()}>临时保存</div>
             }
            {(type == 'orderEdit' || type == 'RealSignUp')&&
			    <div className="order-edit-footer-submit" onClick={_=>view.submitRealSignUp()}>提交实报</div>
            }

		</div>
    )
}
//parm.placeholder 空白提示
//parm.key localstorage区分
//parm.cb 搜索回调
// export class Search extends React.Component{
//     constructor(props){
//         super();
//         this.state = {
//             select_show: false,
//             cur_select: ""
//         }
//         this.search_criteria = {
//             pd_name: '产品名称',
//             order_id: '订单号',
//             doc_title: '单据编号',
//         }
//     }
//     goToSearch(){
//         this.props.param.placeholder = '请输入' + this.search_criteria[this.state.cur_select || this.props.param.key]
//         this.props.param.cur_select = this.state.cur_select
//         goTo('搜索', this.props.param)
//     }
//     render(){
//         return(
//             <ons-toolbar>
//                 <div className="center search-input-box-box" onClick={_=>this.goToSearch()}>
//                     <div className="search-input-box">
//                         <input className='search-input-box-input' value={this.props.value || ''} 
//                         placeholder={'请输入'+this.search_criteria[this.state.cur_select||this.props.param.key]} />
//                         <img className={this.props.value?"hide":"search-input-box-img"} src="img/search.png" />
//                         <Icon className={(!this.props.value ? 'hide' : '') +' close-search'} icon='md-close-circle'
//                         onClick={e=>this.props.clear(e)} />
//                     </div>
//                     <div className="select-search" onClick={_=>{this.setState({select_show: !this.state.select_show});_.stopPropagation();console.log(this)}}>
//                         <div className={AppCore.os==="ios"?"active-select-search-ios":"active-select-search-Android"}>
//                             {this.search_criteria[this.state.cur_select||this.props.param.key]} &nbsp;
//                             {!this.state.select_show && <Icon icon='md-caret-down' style={{fontSize:'.533333rem'}} />}
//                             {this.state.select_show && <Icon icon='md-caret-up' style={{color:'#6FC5D8',fontSize:'.533333rem'}} />}
//                         </div>
//                         <div className={this.state.select_show?(AppCore.os==="ios"?'select-search-item-ios':'select-search-item-Android'):'hide'}
//                         onClick={_=>this.setState({cur_select: 'pd_name'})}>产品名称</div>
//                         <div className={this.state.select_show?(AppCore.os==="ios"?'select-search-item-ios':'select-search-item-Android'):'hide'}
//                         onClick={_=>this.setState({cur_select: 'order_id'})}>订单号</div>
//                         <div className={this.state.select_show?(AppCore.os==="ios"?'select-search-item-ios':'select-search-item-Android'):'hide'}
//                         onClick={_=>this.setState({cur_select: 'doc_title'})}>单据编号</div>
//                     </div>
//                 </div>
//             </ons-toolbar>
//         )
//     }
// }

export class Search extends React.Component{
    constructor(props){
        super();
        this.state = {
            select_show: false,
        }
    }
    goToSearch(){
        this.props.param.placeholder = '请输入' + this.props.cur_select.text
        this.props.param.key_type = this.props.cur_select.search
        goTo('搜索', this.props.param)
    }
    // select_filter(item) {
    //     this.setState({cur_select: item['search']},_=>{
    //         let text = this.props.cur_select.text
    //         this.setState({cur_select_text: text})
    //     })        
    // }
    render(){
        return(
            <ons-toolbar>
              <div className="center search-input-box-box">
                  <div className="search-input-box">
                      <div className="search-center">
                        < input type = "text" className = "search-input-box-input"
                        placeholder={'请输入'+ (this.props.cur_select.text)}
                        value={this.props.value || ''} onChange={e=>this.setState({search:e.target.value})}
                        onClick={_=>this.goToSearch()}/>
                        <Icon className={(!this.props.value? 'hide' : '')+' close-search'} icon='md-close-circle'
                        onClick={e=>this.props.clear(e)} />
                      </div>
                  </div>
                { this.props.param.key !== 'Home' && this.props.param.key !== 'Approve' &&
                <div className="select-search" ref={anchor=>this.props.set_anchor(anchor)}
                onClick={e=>{e.stopPropagation();this.props.open_search_key();}}>
                    <div className={AppCore.os==="ios"?"active-select-search-ios":"active-select-search-Android"}>
                        {this.props.cur_select.text} &nbsp;
                        {!this.state.select_show && <Icon icon='md-caret-down' style={{fontSize:'.533333rem'}} />}
                        {this.state.select_show && <Icon icon='md-caret-up' style={{color:'#6FC5D8',fontSize:'.533333rem'}} />}
                    </div>
                </div>
                }
              </div>
            </ons-toolbar>
        )
    }
}

export class SearchLv2 extends React.Component{
    constructor(props){
        super();
        this.state = {
            select_show: false,
        }
    }
    goToSearch(){
        this.props.param.placeholder = '请输入' + this.props.cur_select.text
        this.props.param.key_type = this.props.cur_select.search
        goTo('搜索', this.props.param)
    }
    render(){
        return(
            <ons-toolbar>
              <div className="center search-input-box-box">
                  <div className="search-input-box">
                      <div className="search-left" onClick={_=>this.props.param.goBack?this.props.param.goBack():goBack()}>
                          <img src="img/back.png" />
                      </div>
                      <div className="search-center">
                        <input type="text" className="search-input-value-searchLv2" 
                        placeholder={'请输入'+ this.props.cur_select.text}
                        value={this.props.value || ''} onChange={e=>this.setState({search:e.target.value})}
                        onClick={_=>this.goToSearch()}/>
                        <Icon className={(!this.props.value? 'hide' : '')+' close-search'} icon='md-close-circle'
                        onClick={e=>this.props.clear(e)} />
                      </div>
                  </div>
                  <div className="select-search" style={{left: '1.466667rem'}} ref={anchor=>this.props.set_anchor(anchor)}
                  onClick={e=>{e.stopPropagation();this.props.open_search_key()}}>
                        <div className={AppCore.os==="ios"?"active-select-search-ios":"active-select-search-Android"}>
                            {this.props.cur_select.text} &nbsp;
                            {!this.state.select_show && <Icon icon='md-caret-down' style={{fontSize:'.533333rem'}} />}
                            {this.state.select_show && <Icon icon='md-caret-up' style={{color:'#6FC5D8',fontSize:'.533333rem'}} />}
                        </div>
                    </div>
              </div>
            </ons-toolbar>
        )
    }
}

export class ProInfo extends React.Component{
    render(){
        return(
            <div className="select-item-pro-header-box">
				<div className="select-item-pro-header-info">
					<div className="pro-name">{this.props.pro_info.pd_name}</div>
					<div className="pro-price">
						<div className="pro-price-zk_price">￥{this.props.pro_info.zk_price} 
							<span style={{fontSize: '.373333rem', fontWeight: 'normal'}}>起/人</span>
						</div>
						<div className="pro-price-dep_city">{Enum.City[this.props.pro_info.dep_city_id]}出发</div>
					</div>
					<div className="pro-sale">
						<div className="pro-sale-price">选择班期:{this.props.pro_info.dep_date}</div>
						<div className="pro-sale-supplier">供应商: {this.props.pro_info.pd_provider}</div>
					</div>
				</div>
			</div>
        )
    }
}

export function footer_ctrl(type ,view){
    return(
    <div className="order-edit-footer">
		<div className="order-edit-footer-box" onClick={_=>view.setState({open_supplier:true})}>
			<img src="img/gys.png" />
			<span>联系供应商</span>
		</div>
		<div className="order-edit-footer-box" onClick={_=>view.setState({open_op:true})}>
			<img src="img/zs.png" />
			<span>联系总社</span>
		</div>
	    { type === 'product' && <div className="pro-footer-zw" onClick={_=>view.holdSeat()}>占位</div>}
        { type === 'product' && <div className="pro-footer-sb" onClick={_=>view.realSignUp()}>实报</div>}
        { type === 'order' && <div className="order-edit-footer-save" onClick={_=>view.submit()}>临时保存</div>}
	    { type === 'order' && <div className="order-edit-footer-submit" onClick={_=>view.submit()}>提交时报</div>}
	</div>
    )
}

export class SupplierDialog extends React.Component{
    render(){
        return (
            // gys-弹窗
            <Dialog
            animation="none" 
            isOpen={this.props.supplier_ctrl.open_supplier}
            isCancelable={true}
            onCancel={this.props.supplier_ctrl.cancelCb}>
                <div className="zs-popup">
                    <div className="zs-popup-avatar">
                        <img src={this.props.supplier_info.pass_photo?AppCore.HOST+'/'+this.props.supplier_info.pass_photo:'img/avatar1.png'} />
                    </div><br />
                    <div className="zs-popup-info-f">
                        <div className="zs-popup-info-item">公司全称: {this.props.supplier_info.full_name}</div>
                        <div className="zs-popup-info-item">公司简称: {this.props.supplier_info.short_name}</div>
                        <div className="zs-popup-info-item">员工姓名: {this.props.supplier_info.name}</div>
                        <div className="zs-popup-info-item">手机号码: {this.props.supplier_info.mobile}</div>
                    </div><br />
                    <div className="zs-popup-btn">
                        {/* <span href={this.props.supplier_info.name} >拨打电话</span> */}
                        <a href={'tel:'+this.props.supplier_info.mobile}>拨打电话</a>
                    </div>
                </div>
            </Dialog>
        )
    }
}

export class OpDialog extends React.Component{
    render(){
        return (
            // zs-弹窗
		<Dialog
        animation="none" 
		isOpen={this.props.op_ctrl.open_op}
		isCancelable={true}
		onCancel={this.props.op_ctrl.cancelCb}>
			<div className="zs-popup">
			    <div className="zs-popup-avatar">
                <img src={this.props.op_info.pass_photo?AppCore.HOST+'/'+this.props.op_info.pass_photo:'img/avatar1.png'} />
			    </div><br />
			    <div className="zs-popup-info-f">
			    	<div className="zs-popup-info-item">所属中心: {this.props.op_info.company_name}</div>
			    	<div className="zs-popup-info-item">所属部门: {Enum.Department[this.props.op_info.department_id]}</div>
			    	<div className="zs-popup-info-item">员工姓名: {this.props.op_info.name}</div>
			    	<div className="zs-popup-info-item">手机号码: {this.props.op_info.mobile}</div>
			    </div><br />
			    <div className="zs-popup-btn">
			    	{/* <span href="tel:13584882787">拨打电话</span> */}
                    <a href={'tel:'+this.props.op_info.mobile}>拨打电话</a>
			    </div>
		    </div>
		</Dialog>
        )
    }
}

// 一天中有多个团 弹框选择
export class MultiGroupDialog extends React.Component{
    constructor(props){
        super(props)
        this.props.MG_ctrl.groupId_arr
    }
    filterArr(){
        return this.props.MG_info.filter(item => this.props.MG_ctrl.groupId_arr.indexOf(item.id) !== -1)
    }
    render(){
        return (
		<Dialog
        animation="none" 
		isOpen={this.props.MG_ctrl.open_MG}
		isCancelable={true}
		onCancel={this.props.MG_ctrl.selectCb}>
			<div className="zs-popup">
                <div className="popup-title">请选择</div>
                {
                    this.filterArr().map(item => 
                    <div className="popup-main" key={item.id}
                    onClick={()=> this.props.MG_ctrl.selectCb(item.id, item.dep_date)}>
                        <span>{item.dep_date}</span>
                        <span>余: {item.seat_surplus}</span>
                        <span style={{ 'color': '#e43c3c' }}>￥{item.zk_price * 1}</span>
                    </div>
                    )
                }
		    </div>
		</Dialog>
        )
    }
}

//  签名弹窗 图片

export class OpDialogImg extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <Dialog
                animation="none"
                isOpen={this.props.imgInfo.open_img}
                isCancelable={true}
                onCancel={this.props.imgInfo.closeImg}>
                <div className="zs-popup">
                    <div className="popup-title">客户签名</div>
                    <div className="popup-main">
                        <img src={AppCore.HOST+'/'+this.props.imgInfo.open_img_url || 'img/avatar1.png'} className="dialog-img" />
                    </div>
                </div>
            </Dialog>
        )
    }
}

// 备注信息 弹框
export class OpDialogComment extends React.Component {
    constructor(props) {
        super(props)
        this.state={
            comment: '',
            propup: false,
        }
    }
    commentChange(val){
        this.setState({comment: val})
    }
    confirm(){
        if(!this.state.comment){
            this.setState({propup: true})
            return;
        }
        this.setState({ propup: false })
        this.props.param.confirm(this.state.comment)
    }
    render() {
        return (
            <Dialog
                animation="none"
                isOpen={this.props.param.open_Show}
                isCancelable={true}
                onCancel={this.props.param.close}>
                <div className="zs-popup">
                    <div className="popup-title">单据备注</div>
                    <div className="popup-main">
                            <input onChange={e => this.commentChange(e.target.value)}
                                className="add-con-cell-contenteditable" style={{margin: '4px 0'}} 
                                placeholder={this.state.propup?"请填写备注在保存":'请填写备注'}/>
                    </div>
                    <div className="zs-popup-btn-box">
                        <div className="zs-popup-btn-submit">
                            <span onClick={_ => this.confirm()} >确定</span>
                        </div>
                        <div className="zs-popup-btn-cancel">
                            <span onClick={_ => this.props.param.close()} >取消</span>
                        </div>
                    </div>
                </div>
            </Dialog>
        )
    }
}
//  关联信息 弹窗
export class OpDialogAssocInfo extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: []
        }
    }
    componentDidMount(){
        let url = this.props.param.url
        post(url).then(r => {
            let data = this.state.data
            data = r.data
            this.setState({ data: data })
        })
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.param.url !== this.props.param.url){
            let url = this.props.param.url
            post(url).then(r => {
                let data = this.state.data
                data = r.data.ref_doc_id.split(',')
                this.setState({ data: data })
            })
        }
    }
    render() {
        return (
            <Dialog
                animation="none"
                isOpen={this.props.param.open_Show}
                isCancelable={true}
                onCancel={this.props.param.close}>
                {
                    // this.state.data.length>0 && 
                    <div className="zs-popup">
                        <div className="popup-title">关联信息</div>
                        <div className="popup-main" style={{ display: 'block' }}>
                            <div>关联单据: {this.state.data.ref_doc_id || '无'}</div>
                            <div>关联调用单据: {this.state.data.ref_tz_doc_id_see || '无'}</div>
                            <div>关联发票: {this.state.data.ref_invoice_id || '无'}</div>
                        </div>
                    </div>
                }
            </Dialog>
        )
    }
}

//  ======================    微信订单 弹窗  WechatOrderList  ================================//
// Appoint 指定 按钮 弹窗
export class WechatAppoint extends React.Component {
    constructor(){
        super()
        this.state = {
            val: '',
            data: {},
        }
    }
    componentDidMount() {
        let that = this
        let url = `/sale/OrderApply/get_creater?action=指定订单&employee_id=${this.props.param.item.employee_id}`

        post(url).then(r => {
            that.setState({ data: r.data['可报名人'] })
        })
    }
    change(val){
        this.setState({ val: val })
    }
    close(){
        this.setState({val: ''})
        this.props.param.close()
    }
    render(){
        return(
            <Dialog
                animation="none"
                isOpen={this.props.param.open}
                isCancelable={true}
                onCancel={this.close.bind(this)}>
                {
                    // Object.keys(this.state.data).length > 0 && 
                    <div className="wechatOrder">
                        <div className="wechatOrder-title">指定</div>
                        <div className="wechatOrder-input">
                            <span>报名人：</span>
                            {JSON.stringify(this.state.data) === '{}' &&
                                <span>订单暂无报名人</span>
                            }
                            {JSON.stringify(this.state.data) !== '{}' &&
                                <select className="order-receivable-modal-info-item-right-select"
                                    onChange={e => this.change(e.target.value)}
                                    value={this.state.val ? this.state.val : this.props.param.item.employee_name}>
                                    <option value='' >请选择报名人</option>
                                    {
                                        Object.keys(this.state.data).map(_k =>
                                            <option key={_k} value={_k}>{this.state.data[_k]}</option>
                                        )
                                    }
                                </select> 
                            }
                            
                        </div>
                        <div className="wechatOrder-confirm" 
                        onClick={_ => this.props.param.confirm(this.state.val,this.props.param.item)}>确定</div>
                    </div>
                }
            </Dialog>
        )
    }  
}
// seat占位 微信订单
export class WechatSeat extends React.Component {
    constructor() {
        super()
        this.state = {
            val: '',
            data: {},
        }
    }
    componentDidMount(){
        let that = this
        let url = `/sale/OrderApply/get_assitant?action=占位订单-微信订单&group_id=${this.props.param.item.group_id}`
        post(url).then(r => {
            that.setState({data: r.data['可接单人']})
        })
    }
    change(val) {
        this.setState({ val: val })
    }
    close() {
        this.setState({ val: '' })
        this.props.param.close()
    }
    render() {
        return (
            <Dialog
                animation="none"
                isOpen={this.props.param.open}
                isCancelable={true}
                onCancel={this.close.bind(this)}>
                {
                    // Object.keys(this.state.data).length>0 && 
                    <div className="wechatOrder">
                        <div className="wechatOrder-title">占位</div>
                        <div className="wechatOrder-input">
                            <span>接单人：</span>
                            {JSON.stringify(this.state.data) === '{}' && 
                            <span>订单暂无接单人</span>
                            }
                            {JSON.stringify(this.state.data) !== '{}' && 
                                <select className="order-receivable-modal-info-item-right-select"
                                    onChange={e => this.change(e.target.value)}
                                    value={this.state.val ? this.state.val : this.props.param.item.assitant_name}>
                                    <option value='' >请选择接单人</option>
                                    {
                                        Object.keys(this.state.data).map(_k =>
                                            <option key={_k} value={_k}>{this.state.data[_k]}</option>
                                        )
                                    }
                                </select>  
                            }
                        </div>
                        <div className="wechatOrder-confirm"
                            onClick={_ => this.props.param.confirm(this.state.val, this.props.param.item)}>确定</div>
                    </div>
                }
            </Dialog>
        )
    }
}

// ==================================黑名单 提示弹窗 && 当前黑名单列表==================================
// 黑名单提示
export class BlackPrompt extends React.Component {
    constructor() {
        super()
        this.state = {}
    }

    close() {
        this.props.param.close()
    }
    render() {
        return (
            <Dialog
                animation="none"
                isOpen={this.props.param.show}
                isCancelable={true}
                onCancel={this.close.bind(this)}
            >
                {
                    // Object.keys(this.state.data).length>0 && 
                    <div className="BlockPrompt">
                        <div className="BlockPrompt-title">游客黑名单：</div>
                        <div className="BlockPrompt-input">
                            警告！游客名单
                            {this.props.param.blackUser.map( (item,index) => 
                                <span style={{ color: 'red' }}>{item}<span className={index === this.props.param.blackUser.length-1?'hide':''}>、</span></span>
                            )}
                            与黑名单中姓名一致，有旅游诈骗嫌疑请点击查看核对信息，如无问题请关闭。
                        </div>
                        <div className="BlockPrompt-btn" >
                            <div className="BlockPrompt-btn-submit" onClick={_ => this.props.param.submit(this.state.val)}>查看</div>    
                            <div className="BlockPrompt-btn-close" onClick={_ => this.props.param.close(this.state.val)}>关闭</div>    
                        </div>
                    </div>
                }
            </Dialog>
        )
    }
}
// 当前黑名单列表
export class BlackList extends React.Component {
    constructor() {
        super()
        this.state = {data:[]}
    }
    componentDidMount() {
        let that = this
        let param = this.props.param.tourist_name
        let url = '/sale/TouristBlacklist/read_see?'+encUrl({tourist_name:param})
            post(url).then(
                r => {
                    that.setState({ data: r.data['核对游客黑名单'] })
                }
            )
    }

    close() {
        this.props.param.close()
    }
    render() {
        return (
            <Dialog
                animation="none"
                isOpen={this.props.param.show}
                isCancelable={true}
                onCancel={this.close.bind(this)}>
                {
                    this.state.data && 
                    <div className="Blacklist">
                        <div className="Blacklist-title">游客黑名单：</div>
                        <div className="Blacklist-list-box">
                            {this.state.data.map( item =>
                                <div className="Blacklist-list-item">
                                    <div className="Blacklist-list-cell">
                                        <span className="Blacklist-list-cell-left">姓名: </span>
                                        <span className="Blacklist-list-cell-right">{item.tourist_name}</span>
                                    </div>
                                    <div className="Blacklist-list-cell">
                                        <span className="Blacklist-list-cell-left">性别: </span>
                                        <span className="Blacklist-list-cell-right">{Enum['Gender'][item.gender]}</span>
                                    </div>
                                    <div className="Blacklist-list-cell">
                                        <span className="Blacklist-list-cell-left">出生日期: </span>
                                        <span className="Blacklist-list-cell-right">{item.birthday}</span>
                                    </div>
                                    <div className="Blacklist-list-cell">
                                        <span className="Blacklist-list-cell-left">手机号码: </span>
                                        <span className="Blacklist-list-cell-right">{item.mobile}</span>
                                    </div>
                                    <div className="Blacklist-list-cell">
                                        <span className="Blacklist-list-cell-top">备注: </span>
                                        <span className="Blacklist-list-cell-btm">{item.comment}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="Blacklist-btn"
                            onClick={_ => this.props.param.close()}>关闭</div>
                    </div>
                }
            </Dialog>
        )
    }
}


// ===========================================================================

function progress({s}) {
    return (
        <Modal isOpen={s.progress} style={{backgroundColor:'transparent'}}>
            <div className="progress-box">
              <ons-icon icon="fa-spinner" size="26px" spin></ons-icon>
            </div>
        </Modal>
    );
}

export const Progress = connect(s=>({s:s}))(progress);

export function forceUpdate({s}) {
    return (
        <Dialog
          isOpen={!!s.forceUpdate.way}
          isCancelable={false}>
          <div style={{textAlign: 'center', margin: '20px'}}>
            <p style={{opacity: 0.5}}>{s.forceUpdate.running ? '应用正在升级，请稍等' : '应用需要升级才可使用'}</p>
            <p style={{height:"20px"}}>
                { 
                    s.forceUpdate.running &&
                    <ProgressBar indeterminate />
                }
            </p>
            <p>
              <Button disabled={!!s.forceUpdate.running} onClick={_=>doForceUpdate(s.forceUpdate.way)}>升级</Button>
            </p>
          </div>
        </Dialog>
    );
}

export const ForceUpdate = connect(s=>({s:s}))(forceUpdate);

export function nonBlockLoading() {
    return (
        <div className="after-list text-center">
          <ons-icon icon="fa-spinner" size="26px" spin></ons-icon>
        </div>
    );
}

