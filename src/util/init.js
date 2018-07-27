import {updateOnInit,updateAfterInit} from './update';
import {AppCore,log,goBack,plugin,hasPlugin} from './core';
import {toast} from './com';
import {apnsInit} from './apns';
import {dbInit} from './db';
import {pubInit} from './data';

import ons from 'onsenui';

document.getElementsByTagName("html")[0].style.fontSize = document.documentElement.clientWidth / 10 + 'px';

let exiting;

let dev = (process.env.NODE_ENV === `development`);

//no delay ( browser and device )
pubInit();
AppCore.os = ons.platform.isAndroid()?'android':'ios';

//no delay ( browser only )
if(dev){
	dbInit();
}

//delayed ( device only )
function init() {

    if(hasPlugin('device')){
    	AppCore.os = plugin('device').platform.toLowerCase();
    	log(AppCore.os);
    }

	dbInit();
	apnsInit();
	updateOnInit();
	//每15分钟任务
	setInterval(
		_=>{
			log('[cron] start');
			updateAfterInit();
			log('[cron] end');
		},
		15*60*1000
	);

    document.addEventListener("pause", pause, false);
    document.addEventListener("resume", resume, false);
    document.addEventListener("backbutton", backbutton, false);
}

document.addEventListener('deviceready', init, false);

function pause(evt) {
	log('pause');
	AppCore.pause = true;
}

function resume(evt) {
	log('resume');
	AppCore.pause = false;
}

function backbutton(evt) {
	if(exiting){
		return;
	}
	goBack().then(
		r => {},
		e => {
			exiting=true;
			toast('再按一次退出应用，退出后无法接收消息').then(_=>{exiting=false});
		}
	);
    throw 'prevent backbutton';
}