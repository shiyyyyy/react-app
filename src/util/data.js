import {plugin,hasPlugin,log,post,trigger,AppCore,Enum,AppMeta} from './core';
import {pollInit} from './poll';

export function pubInit() {
	post('/api/App/app_entry').then(
		r=>{
			trigger('更新公开数据',r.data);
		}
	);
}


export function userInit() {
	post('/PublicApi/get_init').then(r=>{

		Object.assign(AppMeta,r.data);

		let ver = r.data.enum_ver || new Date().getTime();

	    fetch(AppCore.HOST+'/files/'+AppCore.TENANT+'/cache/Enum.js?ver='+ver).then(
	        r => r.json()
	    ).then(
	        r => {
	            Object.assign(Enum,r);
	        },
	        e => log(e)
	    );

        pollInit();
    });
	
}
