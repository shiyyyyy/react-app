import {hasPlugin,plugin,AppCore,log,trigger} from './core';
import {confirm,info,toast} from './com';

let update_cfg_ok;
let update_meta;
let fileTransfer;

export function updateOnInit() {
    if(!hasPlugin('chcp')){
        return;
    }

    let options = {
      'config-file': AppCore.UPDATE_META_URL
    };

    plugin('chcp').configure(options, e=>{
        if (e) {
          log('[chcp] configure err : '+e.code+' '+ e.description);
        } else {
            update_cfg_ok = true;
            updateAfterInit();
        }
    });
}

export function updateAfterInit(force){
    if(!update_cfg_ok){
        return;
    }
    if(!hasPlugin('cordova.file','FileTransfer','cordova.plugins.fileOpener2','cordova.InAppBrowser','chcp')){
        return;
    }
    
    fetch(AppCore.UPDATE_META_URL+'?_='+ (new Date().getTime())).then(
        r => r.json()
    ).then(
        r => {
            update_meta = r;

            plugin('chcp').getVersionInfo( (e, ver) => {

                logVer(ver);

                _update(ver,force);
            });
        },
        e => log('[chcp] fetch meta err : ',e)
    );
}

function _update(ver,force){

    if(AppCore.os === 'android'){

        log('[android update] local : '+ver.appVersion+' store : '+update_meta.store_ver_android);

        //包升级必执行
        if(update_meta.store_ver_android > ver.appVersion){
            //API接口版本需强制升级
            if(ver.currentWebVersion < update_meta.min_api_ver){
                log('[android update] : force to min_api_ver '+update_meta.min_api_ver);
                trigger('强制升级','open_apk');
            }else{
                log('[android update] : download apk?' );
                confirm('发现新版本，现在升级吗？').then(
                    _ => { _ && open_apk()}
                );
            }
            return;
        }
    }

    if(AppCore.os === 'ios'){

        log('[ios update] local : '+ver.appVersion+' store : '+update_meta.store_ver_ios);

        //包升级必执行
        if(update_meta.store_ver_ios > ver.appVersion){
            //API接口版本需强制升级
            if(ver.currentWebVersion < update_meta.min_api_ver){
                log('[ios update] : force to min_api_ver '+update_meta.min_api_ver);
                trigger('强制升级','open_ipa');
            }else{
                log('[ios update] go to app store?');
                confirm('发现新版本，现在升级吗？').then(
                    _ => { _ && open_ipa()}
                );
            }
            return;
        }
    }

    //API接口版本需强制升级
    if(ver.currentWebVersion < update_meta.min_api_ver){
        trigger('强制升级','chcp');
        return;
    }

    //热更新视配置而定
    let policy = AppCore.os === 'ios' ? update_meta.update_ios : update_meta.update_android;
    if(force || policy){
        log('[chcp] : updating...' );
        chcpUpdate(policy);
    }else{
        log('[chcp] : update is not allowed right now' );
    }
}

export function doForceUpdate(way) {
    trigger('强制升级开始');
    switch(way){
        case 'open_apk':
            open_apk();
            break;
        case 'open_ipa':
            open_ipa();
            break;
        case 'chcp':
            chcpUpdate(2);
            break;
    }
}

function chcpUpdate(policy){

    plugin('chcp').fetchUpdate( 
        (e,data) => {
            if (e) {
                log('[chcp] fetch error : '+e.code+' '+ e.description);
                return;
            }

            plugin('chcp').getVersionInfo( (e, ver) => logVer(ver) );
            if(policy == 2){
                plugin('chcp').installUpdate( e => install_cb(e) );
                info('应用升级完成');
            }else{
                confirm('已为您节约流量下载了极速升级包，现在升级吗？').then(
                    _ => { _ && plugin('chcp').installUpdate( e => install_cb(e) ) }
                );
            }
        }
    );
}

function install_cb(e) {
    if (e) {
        log('[chcp] install error : '+e.code+' '+ e.description);
    } else {
        log('[chcp] install succeed');
    }
}

function open_apk() {
    fetch(update_meta.store_url_android+(AppCore.org || '')).then(
        r => r.json()
    ).then(
        r => {
            let url = r.data;
            log('[android update] download ' + url);
            toast('正在后台下载新版本');
            let file_path = plugin('cordova.file').externalCacheDirectory+'zs.apk';
            log('[android update] store to ' + file_path);
            if(!fileTransfer){
                fileTransfer = new (plugin('FileTransfer'))();
            }
            fileTransfer.download(
                url,
                file_path,
                entry => {
                    log('[android update] download ok : ' + entry.toURL());
                    plugin('cordova.plugins.fileOpener2').open(
                        entry.toURL(), 
                        'application/vnd.android.package-archive',
                        {
                            error:e=>log('[fileOpener2] opne apk err : ',e),
                            success:r=>log('[android update] open file ok ')
                        }
                    );
                }, 
                e => {
                    log('[fileTransfer] download err : ',e);
                }
            );
        },
        e => log(e)
    );
}

function open_ipa() {
    fetch(update_meta.store_url_ios+(AppCore.org || '')).then(
        r => r.json()
    ).then(
        r => {
            let url = r.data;
            log('[ios update] open ' + url);
            plugin('cordova.InAppBrowser').open(url,'_system');
        },
        e => log(e)
    );
}

function logVer(ver){
    log('[ver] current : ' + ver.currentWebVersion);
    log('[ver] previous : ' + ver.previousWebVersion);
    log('[ver] ready install : ' + ver.readyToInstallWebVersion);
    log('[ver] app : ' + ver.appVersion);
    log('[ver] app build : ' + ver.buildVersion);
}


