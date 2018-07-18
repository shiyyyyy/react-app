import {hasPlugin,plugin,log,i18n,AppCore} from './core';
import {toast} from './com';
import {checkNotify} from './perm';

let polling = false;
let poll_host = '';
let retry_delay = 0;
let timer;
let dev = (process.env.NODE_ENV === `development`);

//1.可反复调用,只会维持一个连接
//2.连接失败则重试，直至连接成功
//3.重试延迟不断加大，最大5分钟
//4.若返回会话不存在等消息则不再重试连接
export function pollInit() {
    hasPlugin('device') && (plugin('device').platform.toLowerCase() === 'android') && checkNotify();
    
	if(!dev && !hasPlugin('device','cordova.plugins.notification')){
		return;
	}
    let host = AppCore.HOST.substring(0,AppCore.HOST.length-8);
    let arr = host.split(':');
    poll_host = arr[0]+':'+arr[1]+':8000';
    log('[poll] init : '+poll_host);
    poll();
}

function poll(){

    if (!dev && plugin('device').platform.toLowerCase() !== 'android') {
        log("[poll] skip (not android)");
        return;
    }
    if(polling){
        log("[poll] skip (running)");
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
    retry_delay = 0;
    p.text().then(
        r=>{
            try{
                r = JSON.parse(r);
            }catch(e){
                //session id not exist etc..., disable retry
                log("[polling] stopped : "+r)
                return;
            }
            if(!r){
                //kick out, disable retry
                log("[polling] stopped : kick out");
                return;
            }
            let title = r.title && i18n.pick(r.title);

            if(AppCore.pause){
                plugin('cordova.plugins.notification').local.schedule({
                    text: title,
                    // sound: 'file://assets/media/msg.m4a',
                });
            }else{
                toast(title);
            }

            poll();
        },
        e=>log(e)
    )

}

function proc_err(e){
    polling = false;
    log("[polling] error : "+(e.message || e));
    
    // network failed etc..., retry
    timer = setTimeout( poll, retry_delay);
    if(retry_delay<5*60*1000){
        retry_delay += 5000;
    }
    
}