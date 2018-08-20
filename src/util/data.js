import {log,post,trigger,AppCore,Enum,AppMeta,curRoute,resetTo,store,loadIfEmpty} from './core';
import {pollInit} from './poll';
import {getCache,setCache} from './db';

export function pubInit() {

	post(AppCore.HOST+'/api/App/app_entry',undefined,{get:1}).then(
		r=>{
			trigger('更新公开数据',r.data);
			setCache('pub_cache',JSON.stringify(r.data));
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
	let meta_cache = true;//getCache可能比post还要慢，post更新后勿要再用cache
	getCache(
		'meta_cache',
		v => meta_cache && v && metaInit(JSON.parse(v))
	);
	post('/PublicApi/get_init',undefined,{wait:1}).then(
		r=>{
			meta_cache = false;
			metaInit(r.data);
	        setCache('meta_cache',JSON.stringify(r.data));
	        updateEnum(r.data.enum_ver);
	    }
    );
    pollInit();

    if(curRoute()!=='登录页'){
    	loadIfEmpty(AppCore.HomePage);
    }
}

function enumInit(em){
    Object.assign(Enum,em);
}
function loginJump() {
    if(curRoute()==='登录页' && Enum.ver){
    	trigger('取消等待');
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
	post(AppCore.HOST+'/files/'+AppCore.TENANT+'/cache/Enum.js?ver='+ver,undefined,{wait:1,get:1}).then(
        r => {
        	enumInit(r);
            setCache('enum_cache',JSON.stringify(r));
            loginJump();
        }
    );
}
