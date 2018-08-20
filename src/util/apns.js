import {plugin,hasPlugin,log,AppCore} from './core';
import {checkNotify} from './perm';

export function apnsInit(){
    if(!hasPlugin('PushNotification')){
        return;
    }

    if (AppCore.os !== 'ios') {
        return;
    }


    const options = {
        ios: {
            alert: "true",
            badge: false,
            sound: "true"
        }
    };
    const push = plugin('PushNotification').init(options);

    push.on('registration', data => {
        log("[apns] registed, token : "+data.registrationId);
        AppCore.ios_tkn=data.registrationId;
        //check permission
        setTimeout(checkNotify,3000);
    });

    //trigger event fired correctly
    if(hasPlugin('cordova.plugins.notification')){
        plugin('cordova.plugins.notification').local.on('trigger',notic=>log('[apns] received ',notic));
    }
    //notification event never fired, due to local-notification plugin compatible problem
    push.on('notification', data => {
        if(data.additionalData.foreground && hasPlugin('cordova.plugins.notification')){
            plugin('cordova.plugins.notification').local.schedule({
                text: data.message,
            });
        }
        log('[apns] received ',data);
    });

    push.on('error', e => log("[apns] error : "+(e.message || e)) );

    log("[apns] initialized");
}

