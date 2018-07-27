import * as ons from 'onsenui';
import React from 'react';
import {PullHook,Icon,Modal,Button,Dialog,ProgressBar} from 'react-onsenui';
import {log,reloadSilent,i18n,resetTo,goTo,AppCore} from './core';
import { connect } from 'react-redux';
import { doForceUpdate } from './update';


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

function pageCrash() {
    return (
        <ons-page>
            <ons-toolbar>
              <div className='left'><ons-back-button></ons-back-button></div>
              <div className="center">崩溃</div>
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
      return pageCrash();
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
          onLoad={ done=>reloadSilent(view,done) } >

          <Icon class="pull-hook-content" 
            spin={ refreshState[view.state.state][2] } 
            icon={ refreshState[view.state.state][1] }>
          </Icon>&nbsp;&nbsp;
          { refreshState[view.state.state][0] }
        </PullHook>
    );
}
export function error(p) {
    log(p);
    let m = {
        message: p.message || p,
        title: p.title || i18n.get('ERROR'),
        buttonLabels: p.buttonLabels || i18n.get('OK')

    };
    return ons.notification.alert(m);
}
export function info(p) {
    let m = {
        message: p.message || p,
        title: p.title || i18n.get('PROMPT'),
        buttonLabels: p.buttonLabels || i18n.get('OK')

    };
    return ons.notification.alert(m);
}
export function confirm(p) {
    let m = {
        message: p.message || p,
        title: p.title || i18n.get('PROMPT'),
        buttonLabels: p.buttonLabels || [i18n.get('CANCEL'), i18n.get('OK')]

    };
    return ons.notification.confirm(m);
}
export function prompt(p) {
    let m = {
        message: p.message || p,
        title: p.title || i18n.get('PROMPT'),
        buttonLabels: p.buttonLabels || [i18n.get('CANCEL'), i18n.get('OK')]

    };
    return ons.notification.prompt(m);
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
			<div className="order-edit-footer-box" onClick={_=>view.gysModal()}>
				<img src="img/gys.png" />
				<span>联系供应商</span>
			</div>
			<div className="order-edit-footer-box" onClick={_=>view.zsModal()} style={{lineHeight: '.32rem'}}>
				<img src="img/zs.png" />
				<span>联系总社</span>
			</div>
            { type == 'group' &&
			    <div className="pro-footer-zw" onClick={_=>view.holdSeat()}>占位</div>
            }{type == 'group' &&
			    <div className="pro-footer-sb" onClick={_=>view.realSignUp()}>实报</div>
            }
            {/* type == 'orderEdit' &&
			     <div className="order-edit-footer-save" onClick={_=>view.submit()}>临时保存</div>
             */}
            {type == 'orderEdit' &&
			    <div className="order-edit-footer-submit" onClick={_=>view.submit()}>提交实报</div>
            }

		</div>
    )
}

export function search(){
    return(
        <ons-toolbar>
			<div className="center search-input-box-box" onClick={_=>goTo('搜索')}>
			  <div className="search-input-box">
				  <input className='search-input-box-input' value="" placeholder="搜索"/>
				<img className="search-input-box-img" src="img/search.png" />
			  </div>
			</div>
		</ons-toolbar>
    )
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
	    { type === 'product' && <div className="pro-footer-zw">占位</div>}
        { type === 'product' && <div className="pro-footer-sb">实报</div>}
        { type === 'order' && <div className="order-edit-footer-save">临时保存</div>}
	    { type === 'order' && <div className="order-edit-footer-submit">提交时报</div>}
	</div>
    )
}

export function gys_dialog(view){
    return (
        // gys-弹窗
        <Dialog
		isOpen={view.state.open_supplier}
		isCancelable={true}
		onCancel={_=>view.setState({open_supplier:false})}>
			<div className="zs-popup">
			    <div className="zs-popup-avatar">
			    	<img src="img/avatar.png" />
			    </div><br />
			    <div className="zs-popup-info">
			    	<div className="">公司全称: </div>
			    	<div className="">所属部门: </div>
			    	<div className="">员工姓名: </div>
			    	<div className="">手机号码: </div>
			    </div><br />
			    <div className="zs-popup-btn">
			    	<a href="tel:13584882787">拨打电话</a>
			    </div>
			</div>
		</Dialog>
    )
}
export function zs_dialog(view){
    return (
        // zs-弹窗
		<Dialog
		isOpen={view.state.open_op}
		isCancelable={true}
		onCancel={_=>view.setState({open_op:false})}>
			<div className="zs-popup">
			    <div className="zs-popup-avatar">
			    	<img src="img/avatar.png" />
			    </div><br />
			    <div className="zs-popup-info">
			    	<div className="">所属中心: </div>
			    	<div className="">所属部门: </div>
			    	<div className="">员工姓名: </div>
			    	<div className="">手机号码: </div>
			    </div><br />
			    <div className="zs-popup-btn">
			    	<a href="tel:13584882787">拨打电话</a>
			    </div>
		    </div>
		</Dialog>
    )
}


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

