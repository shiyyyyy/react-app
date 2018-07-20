import * as ons from 'onsenui';
import React from 'react';
import {PullHook,Icon,Modal,Button} from 'react-onsenui';
import {log,reloadSilent,i18n,resetTo,goTo,AppCore} from './core';
import { connect } from 'react-redux';


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
			<div className="order-edit-footer-box" onClick={_=>view.zsModal()}>
				<img src="img/zs.png" />
				<span>联系总社</span>
			</div>
            { type == 'product' &&
			    <div className="pro-footer-zw">占位</div>
            }{type == 'product' &&
			    <div className="pro-footer-sb">实报</div>
            }
            { type == 'orderEdit' &&
			    <div className="order-edit-footer-save">临时保存</div>
            }{type == 'orderEdit' &&
			    <div className="order-edit-footer-submit">提交时报</div>
            }

		</div>
    )
}

export function search(){
    return(
        <ons-toolbar ref="tb">
			<div className="center search-input-box-box" onClick={_=>goTo('搜索')}>
			  <div className="search-input-box">
				  <input className='search-input-box-input' value="" placeholder="搜索"/>
				<img className="search-input-box-img" src="img/search.png" />
			  </div>
			</div>
		</ons-toolbar>
    )
}

export function GYS_modal(view){
    return (
        // gys-弹窗
        view.state.gys_modal &&
        <div className="zs-modal" onClick={_=>view.gysModalHide()}>
            <div className="zs-popup" onClick={_=>{_.stopPropagation()}}>
                <div className="zs-popup-avatar">
                    <img src="img/avatar.png" />
                </div><br />
                <div className="zs-popup-info">
                    <div className="">公司全称: 张阿道夫撒旦法</div>
                    <div className="">所属部门: 张阿道夫撒旦法</div>
                    <div className="">员工姓名: 张阿道夫撒旦法</div>
                    <div className="">手机号码: 13434343434343</div>
                </div><br />
                <div className="zs-popup-btn">
                    <a href="tel:13434343434">拨打电话</a>
                </div>
            </div>
        </div>
    )
}
export function ZS_modal(view){
    return (
        // zs-弹窗
		view.state.zs_modal &&
		<div className="zs-modal" onClick={_=>view.zsModalHide()}>
			<div className="zs-popup" onClick={_=>{_.stopPropagation()}}>
				<div className="zs-popup-avatar">
					<img src="img/avatar.png" />
				</div><br />
				<div className="zs-popup-info">
					<div className="">所属中心: 张阿道夫撒旦法</div>
					<div className="">所属部门: 张阿道夫撒旦法</div>
					<div className="">员工姓名: 张阿道夫撒旦法</div>
					<div className="">手机号码: 13434343434343</div>
				</div><br />
				<div className="zs-popup-btn">
					<a href="tel:13434343434">拨打电话</a>
				</div>
			</div>
		</div>
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

export function nonBlockLoading() {
    return (
        <div className="after-list text-center">
          <ons-icon icon="fa-spinner" size="26px" spin></ons-icon>
        </div>
    );
}

