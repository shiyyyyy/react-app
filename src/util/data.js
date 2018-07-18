import {log,post,trigger,AppCore,Enum,AppMeta,curRoute,resetTo,store} from './core';
import {pollInit} from './poll';
import {getCache,setCache} from './db';

export function pubInit() {

	fetch(AppCore.HOST+'/api/App/app_entry').then(
		r=>r.json()
	).then(
		r=>{
			trigger('更新公开数据',r.data);
			setCache('pub_cache',JSON.stringify(r.data));
		},
		e=>{
			getCache(
				'pub_cache',
				v => v && trigger('更新公开数据',JSON.parse(v))
			);
		}
	);
}

function metaInit(meta) {
	Object.assign(AppMeta,meta);
}

export function userInit() {
	getCache(
		'enum_cache',
		v=> v && enumInit(JSON.parse(v))
	);
	getCache(
		'meta_cache',
		v => v && metaInit(JSON.parse(v))
	);
	post('/PublicApi/get_init').then(
		r=>{
			metaInit(r.data);
	        setCache('meta_cache',JSON.stringify(r.data));
	        updateEnum(r.data.enum_ver);
	    }
    );
    pollInit();
}

function enumInit(em){
    Object.assign(Enum,em);
}
function loginJump() {
    if(curRoute()==='登录页' && Enum.ver){
    	resetTo('底栏菜单');
    }
}
export function updateEnum(ver) {
	if(!ver){
		ver = new Date().getTime();
	}
	if(Enum.ver == ver){
		loginJump();
		return;
	}
	fetch(AppCore.HOST+'/files/'+AppCore.TENANT+'/cache/Enum.js?ver='+ver).then(
        r => r.json()
    ).then(
        r => {
        	enumInit(r);
            setCache('enum_cache',JSON.stringify(r));
            loginJump();
        },
        e => loginJump()
    );
}
