import {hasPlugin,plugin,log,i18n,AppCore} from './core';
import {toast} from './com';
import {checkNotify} from './perm';

let polling = false;
let poll_host = '';
let retry_delay = 0;
let timer;
let dev = (process.env.NODE_ENV === `development`);

//1.可反复调用,只会维持一个连接
//2.获取消息后立即重连，连接失败或者消息格式错误则重试
//3.重试延迟不断加大，最大5分钟
export function pollInit() {
    AppCore.os === 'android' && checkNotify();
    
	if(!dev && !hasPlugin('cordova.plugins.notification')){
		return;
	}
    
    let host = AppCore.HOST.substring(0,AppCore.HOST.length-8);
    let arr = host.split(':');
    poll_host = arr[0]+':'+arr[1]+':8000';
    log('[poll] init : '+poll_host);
    poll();
    
}

function poll(){

    if (!dev && AppCore.os !== 'android') {
        log("[poll] skip (not android)");
        return;
    }
    if(polling){
        log("[poll] skip (running)");
        return;
    }
    if(!AppCore.sid){
        log("[poll] skip (user logout)");
        return;
    }

    if(timer){
        clearTimeout(timer);
        timer = null;
    }

    polling = true;
    log("[poll] started");

    fetch(poll_host+'/get_msg?app=1&sid='+AppCore.sid ).then(
        proc_msg,
        proc_err
    );
}

function proc_msg(p){
    polling = false;
    
    p.text().then(
        r=>{
            try{
                r = JSON.parse(r);
            }catch(e){
                proc_err(r);
                return;
            }

            if(!r || !r.title){
                proc_err(r);
                return;
            }

            let title = r.title && i18n.pick(r.title);

            // if(AppCore.pause){
                if(hasPlugin('cordova.plugins.notification')){
                    plugin('cordova.plugins.notification').local.schedule({
                        text: title,
                        // sound: 'file://assets/media/msg.m4a',
                    });
                }

            // }else{
            //     toast(title);
            // }

            retry_delay = 0;
            poll();
        },
        e=>proc_err(e)
    )

}

function proc_err(e){
    polling = false;
    log("[polling] error : "+(e && e.message || e));
    
    // network failed etc..., retry
    timer = setTimeout( poll, retry_delay);
    if(retry_delay<5*60*1000){
        retry_delay += 5000;
    }
    
}