import {plugin,hasPlugin,log,post,trigger} from './core';
import {error} from './com';
import {pollInit} from './poll';

let db;


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
            getCache(
                'pub_cache',
                v => v && trigger('更新公开数据',JSON.parse(v))
            );
    	},
    	e=>error(e)
	);

}

export function setCache(key,val) {
    db && db.sqlBatch(
        [
            ['delete from kv where k=?',[key]],
            ['insert into kv values (?,?)', [key,val]]
        ],
        r=>0,
        e=>error(e)
    );
}

export function getCache(key,cb) {
    db && db.executeSql('select * from kv where k=?', [key],
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
