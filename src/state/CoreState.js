import {AppCore,resetTo,Enum} from '../util/core';
import {setCache} from '../util/db';
import {userInit} from '../util/data';

export const sharedData = (state = [], action) => {

  switch (action.type) {
    case '添加数据':
      return [
        ...state,
        {
          id: action.id,
          text: action.text,
          show: true
        }
      ]
    case '开关行':
      return state.map(item =>
        (item.id === action.id)
          ? {...item, show: !item.show}
          : item
      )
    default:
      return state
  }
};

export const user = (state = {}, action) => {
  switch (action.type) {
    case '更新用户':
    case '缓存加载用户':
      AppCore.sid = action.user.sid;
      AppCore.TENANT = action.user.app_name;

      if(state.sid != action.user.sid){
        if(action.user.sid){
          userInit();
        }
        if(action.type == '更新用户'){
          setCache('user_cache',JSON.stringify(action.user));
        }
      }
      return action.user;
    default:
      return state
  }
}

export const pub = (state = {slide:[],recommend:[]}, action) => {
  switch (action.type) {
    case '更新公开数据':
      return action.pub;
    default:
      return state
  }
}

export const progress = (state = false, action) => {
  switch (action.type) {
    case '加载等待':
    case '取消等待':
      return action.progress;
    default:
      return state
  }
}

export const forceUpdate = (state = {}, action) => {
  switch (action.type) {
    case '强制升级':
      return {way:action.way};
    case '强制升级开始':
      return {...state,running:true};
    default:
      return state
  }
}