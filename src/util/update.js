import {hasPlugin,plugin,AppCore,log} from './core';
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

export function updateAfterInit(){
    if(!update_cfg_ok){
        return;
    }
    if(!hasPlugin('device','cordova.file','FileTransfer','cordova.plugins.fileOpener2','cordova.InAppBrowser','chcp')){
        return;
    }
    
    fetch(AppCore.UPDATE_META_URL+'?_='+ (new Date().getTime())).then(
        r => r.json()
    ).then(
        r => {
            update_meta = r;

            plugin('chcp').getVersionInfo( (e, ver) => {

                logVer(ver);

                _update(ver);
            });
        },
        e => log(e)
    );
}

function _update(ver){

    if(plugin('device').platform.toLowerCase() === 'android'){

        log('[android update] local : '+ver.buildVersion+' store : '+update_meta.store_ver_android);

        //包升级必执行
        if(update_meta.store_ver_android > ver.buildVersion){
            log('[android update] : download apk?' );
            confirm('发现新版本，现在升级吗？').then(
                _ => { _ && open_apk()}
            );
            return;
        }
    }

    if(plugin('device').platform.toLowerCase() === 'ios'){

        log('[ios update] local : '+ver.buildVersion+' store : '+update_meta.store_ver_ios);

        //包升级必执行
        if(this.cfg.store_ver_ios > ver.buildVersion){
            log('[ios update] go to app store?');
            confirm('发现新版本，现在升级吗？').then(
                _ => { _ && open_ipa()}
            );
            return;
        }
    }

    //热更新视配置而定
    let policy = (plugin('device').platform.toLowerCase() === 'ios') ? update_meta.update_ios : update_meta.update_android;
    if(policy){
        log('[chcp] : updating...' );
        chcpUpdate(policy);
    }else{
        log('[chcp] : update is not allowed right now' );
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
                confirm('发现新版本，现在升级吗？').then(
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
        r => r.text()
    ).then(
        url => {
            log('[android update] download ' + url);
            toast('正在后台下载新版本');
            let file_path = plugin('cordova.file').externalCacheDirectory+'cj.apk';
            log('[android update] store to ' + file_path);
            if(!fileTransfer){
                fileTransfer = new (plugin('FileTransfer'))();
            }
            fileTransfer.download(
                url,
                file_path
            ).then(
                entry => {
                    log('[android update] download ok : ' + entry.toURL());
                    plugin('cordova.plugins.fileOpener2').open(entry.toURL(), 'application/vnd.android.package-archive')
                      .then(
                        r=>log('[android update] open file ok '),
                        e=>log(e)
                      );
                }, 
                e => {
                    log(e);
                }
            );
        },
        e => log(e)
    );
}

function open_ipa() {
    fetch(update_meta.store_url_ios+(AppCore.org || '')).then(
        r => r.text()
    ).then(
        url => {
            log('[ios update] open ' + url);
            plugin('cordova.InAppBrowser').create(url,'_system');
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


