import * as ons from 'onsenui';
import React from 'react';
import {PullHook,Icon,Modal,Button} from 'react-onsenui';
import {log,reload,i18n,resetTo,goTo} from './core';



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
                      {/* <Button onClick={() => view.share('SESSION')}>
                        微信好友
                      </Button> */}
                    </div>
                    <div className="wx-friends-circle" onClick={() => view.share('TIMELINE')}>
                        <img src="img/wx-pyq.png"/><br />
                        <span>微信朋友圈</span>
                      {/* <Button onClick={() => view.share('TIMELINE')}>
                        微信朋友圈
                      </Button> */}
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
          onLoad={ done=>reload(view,done) } >

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
export function toast(p) {
    let m = {
        message: p.message || p,
        timeout: p.timeout || 2000

    };
    return ons.notification.toast(m);
}


export function footer(text1,text2,class1,class2){
    return(
        <div className="order-edit-footer">
			<div className="">
				<img src="img/gys.png" />
				<span>联系供应商</span>
			</div>
			<div className="">
				<img src="img/zs.png" />
				<span>联系总社</span>
			</div>
			<div className={class1}>{text1}</div>
			<div className={class2}>{text2}</div>
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

