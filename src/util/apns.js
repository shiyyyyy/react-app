import {plugin,hasPlugin,log,AppCore} from './core';
import {checkNotify} from './perm';

export function apnsInit(){
    if(!hasPlugin('device','PushNotification')){
        return;
    }

    if (plugin('device').platform.toLowerCase() !== 'ios') {
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
        checkNotify();
    });

    push.on('notification', data => {

        log('[apns] received ',data);
    });

    push.on('error', e => log("[apns] error : "+(e.message || e)) );

    log("[apns] initialized");
}

