import {plugin,hasPlugin,log} from './core';
import {confirm} from './com';

export function checkNotify(){

    if(!hasPlugin('cordova.plugins.diagnostic')){
    	return;
    }

    plugin('cordova.plugins.diagnostic').isRemoteNotificationsEnabled(
        r => {
            if(r){
                log("[notify] ok");
                return;
            }
            confirm({
                message:'您需要打开消息通知，以防止错过重要提醒！',
                buttonLabels:['取消', '去设置']
            }).then(
                r=>{
                    if(r){
                        log("[notify] jump setting... ");
                        plugin('cordova.plugins.diagnostic').switchToSettings(
                            r => log("[notify] jump setting ok "),
                            e => log("[notify] jump setting failed ",e)
                        );
                    }else{
                        log("[notify] cancel setting ");
                    }
                },
                e=>log("[notify] error : ",e),
            );
        }, 
        e => log("[notify] error : ",e)
    );
}