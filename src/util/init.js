import {updateOnInit,updateAfterInit} from './update';
import {AppCore,log,goBack} from './core';
import {toast} from './com';
import {apnsInit} from './apns';
import {dbInit} from './db';
import {pubInit} from './data';

document.getElementsByTagName("html")[0].style.fontSize = document.documentElement.clientWidth / 10 + 'px';

//dev or device
pubInit();

let exiting;

let dev = (process.env.NODE_ENV === `development`);

//dev only
if(dev){
	dbInit();
}

document.addEventListener('deviceready', init, false);

//device only
function init() {
	dbInit();
	apnsInit();
	updateOnInit();
	//4小时检查一次更新
	setInterval(_=>updateAfterInit(),4*60*60*1000);

    document.addEventListener("pause", pause, false);
    document.addEventListener("resume", resume, false);
    document.addEventListener("backbutton", backbutton, false);
}

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
			toast('再按一次退出应用').then(_=>{exiting=false});
		}
	);
    throw 'prevent backbutton';
}