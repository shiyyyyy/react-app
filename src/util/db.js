import {plugin,hasPlugin,log,post,trigger,store} from './core';
import {error} from './com';
import {pollInit} from './poll';

let db;
let cache_task = {};

export function dbInit(){
    if(!hasPlugin('sqlitePlugin')){
        db = window.openDatabase('zs.db', '1.0', 'SNS DB', 5 * 1024 * 1024);
        if(!db.__proto__.executeSql){
            db.__proto__.executeSql = function(sql,param,rs,rj) {
                this.transaction(function (tx) {
                    tx.executeSql(sql,param,(t,r)=>rs(r),e=>rj(e));
                });
            };
        }
        if(!db.__proto__.sqlBatch){
            db.__proto__.sqlBatch = function(sqls,rs,rj) {
                this.transaction(function (tx) {

					sqls.forEach(function(sql) {
		            	if(!Array.isArray(sql)){
		            		sql = [sql,[]];
		            	}
		                tx.executeSql(sql[0],sql[1]);
					});

                },e=>rj(e),_=>rs(_)); 
            };
        }
    }else{
	  	db = plugin('sqlitePlugin').openDatabase({
	    	name: 'zs.db',
	    	location: 'default',
	  	});
    }

    db.executeSql("create table if not exists kv (k,v)",[],
    	_=>{
            db.executeSql('select * from kv where k=?', ['user_cache'],
              rs => {
                if(!rs.rows.length){
                    return;
                }

                let user = rs.rows.item(0).v;
                user = JSON.parse(user);
                trigger('缓存加载用户',user);
              },
              e => error(e)
            );
            if(!store.getState().pub.slide.length){
                log('[db] using pub cache');
                getCache(
                    'pub_cache',
                    v => v && trigger('更新公开数据',JSON.parse(v))
                );
            }
            Object.keys(cache_task).forEach(
                k => setCache( k, cache_task[k] )
            );
            cache_task = {};
    	},
    	e=>error(e)
	);

}

export function setCache(key,val) {
    if(!db){
        log('[db] not ready in setCache');
        cache_task[key] = val;
        return;
    }
    db.sqlBatch(
        [
            ['delete from kv where k=?',[key]],
            ['insert into kv values (?,?)', [key,val]]
        ],
        r=>0,
        e=>error(e)
    );
}

export function getCache(key,cb) {
    if(!db){
        log('[db] not ready in getCache');
        return;
    }
    db.executeSql('select * from kv where k=?', [key],
      rs => {
        if(rs.rows.length){
            let v = rs.rows.item(0).v;
            cb(v);
        }else{
            cb();
        }
      },
      e => error(e)
    );
}
