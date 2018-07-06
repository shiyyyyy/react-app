import {post,log,encUrl} from '../util/core';

export default {
  '添加测试': () => {
  	return {type:'添加数据',id:123,text:'xxxxxx'};
  	// async way:
    // return dispatch => {
    // 	setTimeout(_=>dispatch({type:'添加数据',id:123,text:'xxxxxx'}),2000);
    // };
  },
  '更新用户': (user) => {
  	return {type:'更新用户',user:user};
  },
  '缓存加载用户': (user) => {
    return {type:'缓存加载用户',user:user};
  },
  '更新公开数据': (pub) => {
    return {type:'更新公开数据',pub:pub};
  }
};