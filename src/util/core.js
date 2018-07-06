import moment from 'moment';
import pages from '../page';
import {actions} from '../action';
import {error} from './com';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import stateTransfer from '../state';

const pageSize = 10;

export const Enum = {};

export const AppCore = {
    APP_NAME: 'TY_ZS',
    // FIND_HOST_URL: 'http://oss.tongyeju.com/oss3-back/api/App/get_host',
    UPDATE_META_URL: 'http://oss.tongyeju.com/app/zs-app/chcp.json',
    HOST: 'http://b2b.tongyeju.com/zs-back',
    // HOST: 'https://www.bytserp.com/zs-back',
    // HOST: 'http://localhost:8080/zs-back',
};

//-------------------------core----------------------------

const middleware = [thunk];
if (process.env.NODE_ENV === `development`) {
  const { logger } = require(`redux-logger`);
  middleware.push(logger);
}

export const store = createStore(
  stateTransfer,
  undefined,
  applyMiddleware(...middleware)
);

//redux usage:
//mapStateToProps : state => { prop1:state.sharedData1, prop2:state.sharedData2... }
//mapDispatchToProps : dispatch => { fun1:p=>dispatch(getAction()), fun2:p=>dispatch(getAction())... }
//export default connect(mapStateToProps,mapDispatchToProps)(Component) : 
//  component will have props(prop1,prop2...,fun1,fun2...), props can changed by fun1,fun2... when props changed, component auto refresh
//don't use such component if you don't have sharedData

//alternative way :
//1. mapDispatchToProps -> trigger : trigger('事件名',参数1,参数2...)
//2. expose sharedData : export default connect(s=>({s:s}),undefined)(Component)
//3. use sharedData : this.props.s.data1  this.props.s.data2 ...
//4. dispatch event : trigger('事件1')  trigger('事件2')

export function trigger(action,...args) {
    store.dispatch(actions[action](...args));
}

export function post(url, body) {
    body = body || {};
    if (url.indexOf('http') !== 0) {
        if (!AppCore.HOST) {
            resetTo('登录页');
            return new Promise(_ => {});
        }
        url = AppCore.HOST + url;
    }

    if (AppCore.sid) {
        body.sid = AppCore.sid;
    }

    log('[http] '+url);

    return new Promise((rs, rj) => {
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(body),
        }).then(
            r => r.text()
        ).then(
            r => {
                try{
                    r = JSON.parse(r);
                }catch(e){
                    error(r)
                    return;
                }
                if (!r.success) {
                    if (r.message == -1) {
                        trigger('更新用户',{});
                        return;
                    }
                    error(r.message);
                    return;
                }
                rs(r);
            },
            e => error(e)
        );
    });
}

let navigator;
export function setNav(nav){
    navigator = nav;
}

export function goTo(key) {
  navigator.pushPage({
    page: pages[key],
    key: key
  });
}

export function goBack() {
  return navigator.popPage();
}

export function resetTo(key) {
    navigator.popPage().then(
        r => {
            resetTo(key, navigator);
        },
        e => {
            navigator.replacePage({
                page: pages[key],
                key: key
            });
        }
    );
}


//-------------------------util---------------------------
export function encUrl(p) {
    return Object.keys(p)
        .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(p[k]))
        .join('&');
}

export function log(...args) {
    console.log(...args);
    if (!localStorage.log || localStorage.log.length > 10240) {
        localStorage.log = '';
    }
    let txt = '';
    let ts = moment().format('MM-dd hh:mm:ss');
    args.forEach(v => {
        txt += ts + '  ' + JSON.stringify(v) + "\n";
    });
    localStorage.log += txt;
}

export function clickToLog(page) {
    page.click_history.push(new Date().getTime());
    if (page.click_history.length >= 5) {
        let interval = page.click_history[4] - page.click_history[0];
        if (interval < 2000) {
            goTo('日志页');
        }
        page.click_history.splice(0, page.click_history.length);
    }
}

export function hasPlugin(...args) {
    return args.every(
        p => {
            let r = plugin(p);
            if (!r) {
                log('[plugin] ' + p + ' not exist');
            }
            return !!r;
        }
    );
}

export function plugin(p) {
    return p.split('.').reduce((obj, k) => obj && obj[k], window);
}

const eq = {};

export function bind(e,fun) {
    if(!eq[e]){
        eq[e] = [];
    }
    eq[e].push(fun);
}

export function unbind(e,fun) {
    if(!eq[e]){
        return;
    }
    let i = eq[e].indexOf(fun);
    if(i !== -1){
        eq[e].splice(i,1);
    }
}

export function emit(e) {
    if(!eq[e]){
        return;
    }
    eq[e].forEach(f=>f());
}

function _loadPage(view,done){
  
  if(view.lastIndex == view.state.pageList.length){
    view.setState({loading:false});
    done();
    return;
  }
  
  view.lastIndex = view.state.pageList.length;
  let url = view.url+encUrl({start:view.state.pageList.length+1,limit:pageSize,mod:view.mod});
  post(url).then(
    r => {
      view.setState({loading:false,pageList:[...view.state.pageList,...r.data]},done);
    }
  )
}

export function loadPage(view,done){
    view.setState({loading:true});
    setTimeout(_=>_loadPage(view,done),500);
}

export function reload(view,done) {
    let url = view.url+encUrl({start:1,limit:pageSize,mod:view.mod});

    post(url).then(
        r => {
          view.setState({pageList:r.data},done);
        }
    )
}

//------------------------i18n---------------------------
const _i18n = {
    lang: 0,
    c: {
        //菜单
        'HOME': ['首页', 'Home'],
        'LOGOUT': ['退出', 'Logout'],
        'ACTION': ['操作', 'Action'],
        //通用
        'ERR_REQ': ['请求失败', 'Request Failed'],
        'ERR_SYS': ['系统错误', 'System Error'],
        'ERR_NW': ['网络连接失败', 'network connect failed'],
        'ERROR': ['错误', 'Error '],
        'PROMPT': ['系统提示', 'Prompt'],
        'OK': ['确定', 'OK'],
        'CANCEL': ['取消', 'cancel'],

        'SAVE': ['保存', 'Save'],
        'MORE': ['更多', 'More'],
    }
}

export const i18n = {

    get: (code) => {
        return _i18n.c[code][_i18n.lang];
    },

    pick: (str) => {
        let arr = str.split('$$');
        if (arr.length > 1) {
            return arr[_i18n.lang];
        }
        return str;
    }

}

