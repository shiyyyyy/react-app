import moment from 'moment';
import pages from '../page';
import { actions } from '../action';
import { error } from './com';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import stateTransfer from '../state';
import { updateEnum } from './data';
import { appConst } from './const';

const pageSize = 10;
const loadDelay = 300;

let i = 0;

export const Enum = {
    Doc: {
        1: ['业务收款单', 'receipt'][i]
            , 2: ['业务支出单', 'pay'][i]
            , 3: ['业务内转单', 'business internal transfer'][i]
            , 4: ['资金内转单', 'fund internal transfer'][i]
            , 5: ['业务退款单', 'receipt refund'][i]
            , 8: ['业务借款单', 'lend'][i]
            , 11: ['调整单', 'variable'][i]
            , 12: ['扣款单', 'deduct'][i]
            , 13: ['资金收款单', 'fund receipt'][i]
            , 14: ['资金退款单', 'fund refund'][i]
            , 15: ['资金借款单', 'fund lend'][i]
            , 16: ['资金支出单', 'fund pay'][i]
            , 17: ['还款单', 'repayment'][i]
            , 18: ['工资单', 'wage'][i]
            , 19: ['资金退回单', 'fund return'][i]
            , 20: ['业务退回单', 'yw return'][i]

            , 22: ['收款关联单', 'receipt relevance'][i]
            , 23: ['支出关联单', 'expend relevance'][i]
            , 21: ['借款关联单', 'borrow relevance'][i]
    },
    Opinion: { 0: ['提交', 'submit'][i], 1: ['通过', 'accept'][i], 2: ['不通过', 'reject'][i], 3: ['取消', 'cancel'][i], 4: ['撤销', 'revoke'][i], 5: ['通过(越级审批)', 'leapfrog pass'][i], 6: ['不通过(越级审批)', 'leapfrog reject'][i] },
    Country: { AO: ['安哥拉', 'Angola'][i], AF: ['阿富汗', 'Afghanistan'][i], AL: ['阿尔巴尼亚', 'Albania'][i], DZ: ['阿尔及利亚', 'Algeria'][i], AD: ['安道尔共和国', 'Andorra'][i], AI: ['安圭拉岛', 'Anguilla'][i], AG: ['安提瓜和巴布达', 'Barbuda Antigua'][i], AR: ['阿根廷', 'Argentina'][i], AM: ['亚美尼亚', 'Armenia'][i], AU: ['澳大利亚', 'Australia'][i], AT: ['奥地利', 'Austria'][i], AZ: ['阿塞拜疆', 'Azerbaijan'][i], BS: ['巴哈马', 'Bahamas'][i], BH: ['巴林', 'Bahrain'][i], BD: ['孟加拉国', 'Bangladesh'][i], BB: ['巴巴多斯', 'Barbados'][i], BY: ['白俄罗斯', 'Belarus'][i], BE: ['比利时', 'Belgium'][i], BZ: ['伯利兹', 'Belize'][i], BJ: ['贝宁', 'Benin'][i], BM: ['百慕大群岛', 'Bermuda Is.'][i], BO: ['玻利维亚', 'Bolivia'][i], BW: ['博茨瓦纳', 'Botswana'][i], BR: ['巴西', 'Brazil'][i], BN: ['文莱', 'Brunei'][i], BG: ['保加利亚', 'Bulgaria'][i], BF: ['布基纳法索', 'Burkina-faso'][i], MM: ['缅甸', 'Burma'][i], BI: ['布隆迪', 'Burundi'][i], CM: ['喀麦隆', 'Cameroon'][i], CA: ['加拿大', 'Canada'][i], CF: ['中非共和国', 'Central African Republic'][i], TD: ['乍得', 'Chad'][i], CL: ['智利', 'Chile'][i], CN: ['中国', 'China'][i], CO: ['哥伦比亚', 'Colombia'][i], CG: ['刚果', 'Congo'][i], CK: ['库克群岛', 'Cook Is.'][i], CR: ['哥斯达黎加', 'Costa Rica'][i], CU: ['古巴', 'Cuba'][i], CY: ['塞浦路斯', 'Cyprus'][i], CZ: ['捷克', 'Czech Republic'][i], DK: ['丹麦', 'Denmark'][i], DJ: ['吉布提', 'Djibouti'][i], DO: ['多米尼加共和国', 'Dominica Rep.'][i], EC: ['厄瓜多尔', 'Ecuador'][i], EG: ['埃及', 'Egypt'][i], SV: ['萨尔瓦多', 'EI Salvador'][i], EE: ['爱沙尼亚', 'Estonia'][i], ET: ['埃塞俄比亚', 'Ethiopia'][i], FJ: ['斐济', 'Fiji'][i], FI: ['芬兰', 'Finland'][i], FR: ['法国', 'France'][i], GF: ['法属圭亚那', 'French Guiana'][i], GA: ['加蓬', 'Gabon'][i], GM: ['冈比亚', 'Gambia'][i], GE: ['格鲁吉亚', 'Georgia'][i], DE: ['德国', 'Germany'][i], GH: ['加纳', 'Ghana'][i], GI: ['直布罗陀', 'Gibraltar'][i], GR: ['希腊', 'Greece'][i], GD: ['格林纳达', 'Grenada'][i], GU: ['关岛', 'Guam'][i], GT: ['危地马拉', 'Guatemala'][i], GN: ['几内亚', 'Guinea'][i], GY: ['圭亚那', 'Guyana'][i], HT: ['海地', 'Haiti'][i], HN: ['洪都拉斯', 'Honduras'][i], HK: ['香港', 'Hongkong'][i], HR: ['克罗地亚', 'Croatia'][i], HU: ['匈牙利', 'Hungary'][i], IS: ['冰岛', 'Iceland'][i], IN: ['印度', 'India'][i], ID: ['印度尼西亚', 'Indonesia'][i], IR: ['伊朗', 'Iran'][i], IQ: ['伊拉克', 'Iraq'][i], IE: ['爱尔兰', 'Ireland'][i], IL: ['以色列', 'Israel'][i], IT: ['意大利', 'Italy'][i], JM: ['牙买加', 'Jamaica'][i], JP: ['日本', 'Japan'][i], JO: ['约旦', 'Jordan'][i], KH: ['柬埔寨', 'Kampuchea (Cambodia )'][i], KZ: ['哈萨克斯坦', 'Kazakstan'][i], KE: ['肯尼亚', 'Kenya'][i], KR: ['韩国', 'Korea'][i], KW: ['科威特', 'Kuwait'][i], KG: ['吉尔吉斯坦', 'Kyrgyzstan'][i], LA: ['老挝', 'Laos'][i], LV: ['拉脱维亚', 'Latvia'][i], LB: ['黎巴嫩', 'Lebanon'][i], LS: ['莱索托', 'Lesotho'][i], LR: ['利比里亚', 'Liberia'][i], LY: ['利比亚', 'Libya'][i], LI: ['列支敦士登', 'Liechtenstein'][i], LT: ['立陶宛', 'Lithuania'][i], LU: ['卢森堡', 'Luxembourg'][i], MO: ['澳门', 'Macao'][i], MG: ['马达加斯加', 'Madagascar'][i], MW: ['马拉维', 'Malawi'][i], MY: ['马来西亚', 'Malaysia'][i], MV: ['马尔代夫', 'Maldives'][i], ML: ['马里', 'Mali'][i], MT: ['马耳他', 'Malta'][i], MU: ['毛里求斯', 'Mauritius'][i], MX: ['墨西哥', 'Mexico'][i], MD: ['摩尔多瓦', 'Moldova'][i], MC: ['摩纳哥', 'Monaco'][i], MN: ['蒙古', 'Mongolia'][i], MS: ['蒙特塞拉特岛', 'Montserrat Is.'][i], MA: ['摩洛哥', 'Morocco'][i], MZ: ['莫桑比克', 'Mozambique'][i], NA: ['纳米比亚', 'Namibia'][i], NR: ['瑙鲁', 'Nauru'][i], NP: ['尼泊尔', 'Nepal'][i], NL: ['荷兰', 'Netherlands'][i], NZ: ['新西兰', 'New Zealand'][i], NI: ['尼加拉瓜', 'Nicaragua'][i], NE: ['尼日尔', 'Niger'][i], NG: ['尼日利亚', 'Nigeria'][i], KP: ['朝鲜', 'North Korea'][i], NO: ['挪威', 'Norway'][i], OM: ['阿曼', 'Oman'][i], PK: ['巴基斯坦', 'Pakistan'][i], PA: ['巴拿马', 'Panama'][i], PG: ['巴布亚新几内亚', 'Papua New Cuinea'][i], PY: ['巴拉圭', 'Paraguay'][i], PE: ['秘鲁', 'Peru'][i], PH: ['菲律宾', 'Philippines'][i], PL: ['波兰', 'Poland'][i], PF: ['法属玻利尼西亚', 'French Polynesia'][i], PT: ['葡萄牙', 'Portugal'][i], PR: ['波多黎各', 'Puerto Rico'][i], QA: ['卡塔尔', 'Qatar'][i], RO: ['罗马尼亚', 'Romania'][i], RU: ['俄罗斯', 'Russia'][i], LC: ['圣卢西亚', 'Saint Lueia'][i], VC: ['圣文森特岛', 'Saint Vincent'][i], SM: ['圣马力诺', 'San Marino'][i], ST: ['圣多美和普林西比', 'Sao Tome and Principe'][i], SA: ['沙特阿拉伯', 'Saudi Arabia'][i], SN: ['塞内加尔', 'Senegal'][i], SC: ['塞舌尔', 'Seychelles'][i], SL: ['塞拉利昂', 'Sierra Leone'][i], SG: ['新加坡', 'Singapore'][i], SK: ['斯洛伐克', 'Slovakia'][i], SI: ['斯洛文尼亚', 'Slovenia'][i], SB: ['所罗门群岛', 'Solomon Is.'][i], SO: ['索马里', 'Somali'][i], ZA: ['南非', 'South Africa'][i], ES: ['西班牙', 'Spain'][i], LK: ['斯里兰卡', 'Sri Lanka'][i], SD: ['苏丹', 'Sudan'][i], SR: ['苏里南', 'Suriname'][i], SZ: ['斯威士兰', 'Swaziland'][i], SE: ['瑞典', 'Sweden'][i], CH: ['瑞士', 'Switzerland'][i], SY: ['叙利亚', 'Syria'][i], TW: ['台湾省', 'Taiwan'][i], TJ: ['塔吉克斯坦', 'Tajikstan'][i], TZ: ['坦桑尼亚', 'Tanzania'][i], TH: ['泰国', 'Thailand'][i], TG: ['多哥', 'Togo'][i], TO: ['汤加', 'Tonga'][i], TT: ['特立尼达和多巴哥', 'Trinidad and Tobago'][i], TN: ['突尼斯', 'Tunisia'][i], TR: ['土耳其', 'Turkey'][i], TM: ['土库曼斯坦', 'Turkmenistan'][i], UG: ['乌干达', 'Uganda'][i], UA: ['乌克兰', 'Ukraine'][i], AE: ['阿拉伯联合酋长国', 'United Arab Emirates'][i], GB: ['英国', 'United Kiongdom'][i], US: ['美国', 'United States of America'][i], UY: ['乌拉圭', 'Uruguay'][i], UZ: ['乌兹别克斯坦', 'Uzbekistan'][i], VE: ['委内瑞拉', 'Venezuela'][i], VN: ['越南', 'Vietnam'][i], YE: ['也门', 'Yemen'][i], YU: ['南斯拉夫', 'Yugoslavia'][i], ZW: ['津巴布韦', 'Zimbabwe'][i], ZR: ['扎伊尔', 'Zaire'][i], ZM: ['赞比亚', 'Zambia'][i], },
    Continent:{AF:['非洲','Africa'][i],EU:['欧洲','Europe'][i],AS:['亚洲','Asia'][i],OA:['大洋洲','Oceania'][i],NA:['北美洲','North America'][i],SA:['南美洲','South America'][i],AN:['南极洲','Antarctica'][i]},
    CountryBelong:{AO:'AF',AF:'AS',AL:'EU',DZ:'AF',AD:'EU',AI:'SA',AG:'NA',AR:'SA',AM:'AS',AU:'OA',AT:'EU',AZ:'AS',BS:'NA',BH:'AS',BD:'AS',BB:'NA',BY:'EU',BE:'EU',BZ:'NA',BJ:'AF',BM:'NA',BO:'SA',BW:'AF',BR:'SA',BN:'AS',BG:'EU',BF:'AF',MM:'AS',BI:'AF',CM:'AF',CA:'NA',CF:'AF',TD:'AF',CL:'SA',CN:'AS',CO:'SA',CG:'AF',CK:'OA',CR:'NA',CU:'NA',CY:'AS',CZ:'EU',DK:'EU',DJ:'AF',DO:'NA',EC:'SA',EG:'AF',SV:'NA',EE:'EU',ET:'AF',FJ:'OA',FI:'EU',FR:'EU',GF:'SA',GA:'AF',GM:'AF',GE:'AS',DE:'EU',GH:'AF',GI:'EU',GR:'EU',GD:'NA',GU:'OA',GT:'NA',GN:'AF',GY:'SA',HT:'NA',HN:'NA',HK:'AS',HR:'EU',HU:'EU',IS:'EU',IN:'AS',ID:'AS',IR:'AS',IQ:'AS',IE:'EU',IL:'AS',IT:'EU',JM:'NA',JP:'AS',JO:'AS',KH:'AS',KZ:'AS',KE:'AF',KR:'AS',KW:'AS',KG:'AS',LA:'AS',LV:'EU',LB:'AS',LS:'AF',LR:'AF',LY:'AF',LI:'EU',LT:'EU',LU:'EU',MO:'AS',MG:'AF',MW:'AF',MY:'AS',MV:'AS',ML:'AF',MT:'EU',MU:'AF',MX:'NA',MD:'EU',MC:'EU',MN:'AS',MS:'NA',MA:'AF',MZ:'AF',NA:'AF',NR:'OA',NP:'AS',NL:'EU',NZ:'OA',NI:'NA',NE:'AF',NG:'AF',KP:'AS',NO:'EU',OM:'AS',PK:'AS',PA:'NA',PG:'OA',PY:'SA',PE:'SA',PH:'AS',PL:'EU',PF:'OA',PT:'EU',PR:'NA',QA:'AS',RO:'EU',RU:'EU',LC:'NA',VC:'SA',SM:'EU',ST:'AF',SA:'AS',SN:'AF',SC:'AF',SL:'AF',SG:'AS',SK:'EU',SI:'EU',SB:'OA',SO:'AF',ZA:'AF',ES:'EU',LK:'AS',SD:'AF',SR:'SA',SZ:'AF',SE:'EU',CH:'EU',SY:'AS',TW:'AS',TJ:'AS',TZ:'AF',TH:'AS',TG:'AF',TO:'OA',TT:'NA',TN:'AF',TR:'AS',TM:'AS',UG:'AF',UA:'EU',AE:'AS',GB:'EU',US:'NA',UY:'SA',UZ:'AS',VE:'SA',VN:'AS',YE:'AS',YU:'EU',ZW:'AF',ZR:'AF',ZM:'AF'},
                

    Flow: { 0: ['未进行', 'not started'][i], 1: ['未提交', 'not submitted'][i], 2: ['待审批', 'waiting'][i], 3: ['拒审批', 'rejected'][i], 4: ['审批通过', 'approved'][i] },
    //发票
    Invoice:{1:['开票','invoice'][i],3:['借票','invoice lend'][i]},
    InvoiceState:{1:['待开','making'][i],2:['已开','made'][i],3:['废票','abolish'][i]},
    InvoiceEditState:{1:['待开','making'][i],2:['已开','made'][i]},
    InvoiceBusinessType:{1:['出境','exit'][i],2:['入境','enter'][i],3:['国内','domestic'][i],4:['其他','other'][i]},
    InvoiceType:{1:['普票','common invoice'][i],2:['专票','professional invoice'][i]},

    Certificate:{1:['身份证','Id Card'][i],2:['护照','Passport'][i],3:['台证','Taiwan Entry Permit '][i],4:['港证','Hong Kong Certificate'][i]
                ,5:['军官证','Military Documents'][i]},
    Gender:{0:['男','male'][i],1:['女','female'][i]},
    OrderState:{1:['未占位','not hold'][i],2:['占位中','holding seat'][i],3:['实报中','waiting'][i],4:['已审核','approved'][i],5:['已确认'
                       ,'confirmed'][i],8:['变更中','changed'][i]},
    FundClaimState: { 0: ['未认领', 'not claim'][i], 1: ['已认领', 'claimed'][i] },
    ContractType: { 1: ['出境合同', 'outbound contract'][i], 2: ['国内合同', 'domestic contract'][i], 3: ['单项合同', 'single contract'][i] },
    InsuranceAgree: {
        1: ['自行购买', 'buy it self'][i], 2: ['放弃购买', 'abandon the purchase'][i],
        3: ['委托我社购买', 'Entrusted to buy'][i]
    },
    ElcContractState:{1:['未关联','not related'][i], 2:['已关联','related'][i], 3:['待签字','wait signed'][i], 4:['已签字','signed`'][i], 5:['已作废','abolished'][i], 6:['已盖章','stamped'][i],},
    ApplyState: { 1: ['未占位', 'not hold'][i], 2: ['已占位', 'holding seat'][i] },
};

export const AppMeta = {};

export const AppCore = {
    APP_NAME: 'TY_ZS',
    // FIND_HOST_URL: 'http://oss.tongyeju.com/oss3-back/api/App/get_host',
    UPDATE_META_URL: 'http://oss.tongyeju.com/app/zs-app/chcp.json',
    HOST: 'http://b2b.tongyeju.com/zs-back',
    // HOST: 'https://www.bytserp.com/zs-back',
    // HOST: 'http://localhost/zs-back',
    SHARE_HOST: 'https://www.bytserp.com/exh/'
};
export function testing() {
    return AppCore.HOST != 'https://www.bytserp.com/zs-back';
}
export function goTest() {
    AppCore.HOST = 'http://b2b.tongyeju.com/zs-back';
    AppCore.SHARE_HOST = 'http://b2b.tongyeju.com/exh/';
}
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

export function trigger(action, ...args) {
    store.dispatch(actions[action](...args));
}
//promise hint:
//1.'promise body' usage: rs(100) or rj(100)                        (return 100 will not call 'then body')
//2.'then body' usage: [return 100] or [return Promise.reject(100)] (no matter in rs or rj)
//3.[resolve 100] is ok if there is no 'then body' append
//4.[reject 100] is not ok if there is no 'then body' handle reject
//* caution: 'promise body' can call rj event if there is no handler in 'then body', and that rais a uncaught exception

export function post(url, body, cfg) {
    cfg = cfg || {};
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

    log('[http] ' + url);

    return new Promise((rs, rj) => {
        let req;
        if(cfg.get){
            req = fetch(url, {method:'GET'});
        }else{
            req = fetch(url, {
                method:'POST',
                // cache: "no-cache",
                body: JSON.stringify(body),
            });
        }
        req.then(
            r => r.text()
        ).then(
            r => {
                try {
                    r = JSON.parse(r);
                } catch (e) {
                    error(r);
                    return;
                }
                if (!r.success) {
                    if (r.message == -1) {
                        trigger('更新用户', {});
                        return;
                    }
                    error(r.message);
                    cfg.rj && rj();
                    return;
                }
                r.enum && Enum.ver && updateEnum(r.enum);
                rs(r);
                return cfg.wait;
            },
            e => {
                log(e);
                error('网络连接失败');
            }
        ).then(
            wait => {
                !wait && store.getState().progress && trigger('取消等待');
            }
        );
    });
}

let navigator;
export function curRoute() {
    if (navigator){
        return navigator.routes[navigator.routes.length - 1].key;
    }
    return false
}

export function setNav(nav) {
    navigator = nav;
}

export function goTo(key, p) {

    navigator.pushPage({
        page: pages[key],
        key: key,
        p: p || {}
    });
}
export function goBack() {
    return navigator.popPage();
}
export function resetToLv2Page(key) {

    navigator.popPage().then(
        r => {
            resetToLv2Page(key, navigator);
        },
        e => {
            if (key != curRoute()) {
                navigator.pushPage({
                    page: pages[key],
                    key: key
                });
            }
        }
    );
}

export function resetTo(key) {
    navigator.popPage().then(
        r => {
            resetTo(key, navigator);
        },
        e => {
            if(key != curRoute()){
                navigator.replacePage({
                    page: pages[key],
                    key: key
                });
            }
        }
    );
}
export function resetToTab(key,index) {
    navigator.popPage().then(
        r => {
            resetToTab(key, index, navigator);
        },
        e => {
            if (key != curRoute()) {
                AppCore.TabPage.setState({ index: index })
            }
        }
    );
}


export function share(scene, title, des, thumb, link) {
    if (!hasPlugin('Wechat')) {
        error('请在手机上使用该功能');
        return;
    }
    scene = plugin('Wechat').Scene[scene];
    if (scene === undefined) {
        error('不支持分享至' + scene);
        return;
    }
    let param = { scene: scene };
    param.message = {
        title: title,
        description: des,
        thumb: thumb,
        media: {
            type: plugin('Wechat').Type.WEBPAGE,
            webpageUrl: link
        }
    }
    plugin('Wechat').share(param,
        r => log('[share] ok ' + link),
        e => log('[share] failed ' + e)
    );
}

export function shareImage(scene, title, des, img) {
    if (!hasPlugin('Wechat')) {
        error('请在手机上使用该功能');
        return;
    }
    scene = plugin('Wechat').Scene[scene];
    if (scene === undefined) {
        error('不支持分享至' + scene);
        return;
    }
    let param = { scene: scene };
    param.message = {
        title: title,
        description: des,
        media: {
            type: plugin('Wechat').Type.IMAGE,
            image: img
        }
    }
    plugin('Wechat').share(param,
        r => log('[share] ok '),
        e => log('[share] failed ' + e)
    );
}
//-------------------------util---------------------------
export function encUrl(p) {
    if (!p) {
        return '';
    }
    return Object.keys(p).filter(k=>p[k]!==undefined&&p[k]!=='')
        .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(p[k]))
        .join('&');
}

function parse_query_string(query) {
    var vars = query.split("&");
    var query_string = {};
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        var key = decodeURIComponent(pair[0]);
        var value = decodeURIComponent(pair[1]);
        // If first entry with this name
        if (typeof query_string[key] === "undefined") {
            query_string[key] = decodeURIComponent(value);
            // If second entry with this name
        } else if (typeof query_string[key] === "string") {
            var arr = [query_string[key], decodeURIComponent(value)];
            query_string[key] = arr;
            // If third or later entry with this name
        } else {
            query_string[key].push(decodeURIComponent(value));
        }
    }
    return query_string;
}

export function getQuery() {
    let query = window.location.search.substring(1);
    return parse_query_string(query);
}

export function log(...args) {
    console.log(...args);
    if (!localStorage.log || localStorage.log.length > 10240) {
        localStorage.log = '';
    }
    let txt = '';
    let ts = moment().format('MM-DD HH:mm:ss');
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

export function bind(e, fun) {
    if (!eq[e]) {
        eq[e] = [];
    }
    eq[e].push(fun);
}

export function unbind(e, fun) {
    if (!eq[e]) {
        return;
    }
    let i = eq[e].indexOf(fun);
    if (i !== -1) {
        eq[e].splice(i, 1);
    }
}

export function emit(e) {
    if (!eq[e]) {
        return;
    }
    eq[e].forEach(f => f());
}

function _loadMore(view, done) {

    view.lastIndex = view.state.data.length;

    let param = {
        ...view.state.search,
        start: view.state.data.length + 1,
        limit: pageSize,
        //mod: view.mod,
        front_enum: Enum.ver
    };

    let url;
    if (view.url) {
        param['mod'] = view.mod;
        url = view.url + '?' + encUrl(param);
    } else if (view.mod) {
        let cfg = get_mod_cfg(view.mod);
        param['mod'] = view.mod;
        url = cfg.read.url + '?' + encUrl(param);
    }else if (view.action) {
        let cfg = AppMeta.actions[view.action];
        let read_param = get_read_param(view.action,cfg,view.props.data);

        param = {...param,...read_param};

        url = cfg.read.url + '?' + encUrl(param);
    } else {
        return;
    }
    post(url).then(
        r => {
            view.setState({ loading: false, data: [...view.state.data, ...r.data] }, done);
        }
    )
}

export function loadMore(view, done) {
    if (view.lastIndex == view.state.data.length) {
        done && done();
        return;
    }
    view.setState({ loading: true });
    setTimeout(_ => _loadMore(view, done), loadDelay);
}

export function loadIfEmpty(view, done) {
    if (!AppCore.sid || view.state.loading || view.state.filled) {
        return;
    }
    if(view.mod && !haveModAuth(view.mod)){
        return;
    }
    reload(view, done);
}

export function reload(view, done) {
    view.setState({ loading: true });
    setTimeout(_ => _reload(view, done), loadDelay);
}

export function reloadSilent(view, done) {
    setTimeout(_ => _reload(view, done), loadDelay);
}

function _reload(view, done) {
    let url;
    if (view.url) {
        url = view.url;
    } else if (view.mod) {
        let cfg = get_mod_cfg(view.mod);
        if(!cfg){
            return ;
        }
        url = cfg.read.url + '?' + encUrl({ ...view.state.search, limit: view.pageSize || pageSize, mod: view.mod, front_enum: Enum.ver });
    } else if (view.action) {
        let cfg = AppMeta.actions[view.action];
        if(!cfg){
            return ;
        }
        let param = get_read_param(view.action, cfg, view.props.p.data);

        url = cfg.read.url + '?' + encUrl(param);
    } else {
        return;
    }

    post(url,undefined,{rj:1}).then(
        r => {
            view.setState({ filled: true, loading: false, data: r.data }, done);
            view.lastIndex = 0;
        },
        e =>{
            if(!view.mod){
                goBack();
            }
        }
    )
}

export function submit(view, done) {
    let cfg = AppMeta.actions[view.action];

    post(cfg.submit.url, get_req_data(cfg.submit.data, view.state.data)).then(
        r => {
            done && done(r);
        }
    );
}

export function sumbitCheck(view,cfg){
    let rq_empty = false;
    let blocks = cfg.block.filter(function(item,index){
        return (!cfg.ro||!cfg.ro[index])&&(!view.block_hide||!view.block_hide[item]||view.block_hide[item]!='1');
    });
    blocks.forEach(function(key){
        let block_cfg = AppMeta.blocks[key];
        let rq_list = [];
        Object.keys(block_cfg.list).forEach(function(field){
            let cfg = block_cfg.list[field];
            let ro = !cfg.ro ? block_cfg.ro:cfg.ro;
            if(cfg.rq && !ro){
                let _cfg = {field:field};
                if(cfg.type&&Enum[cfg.type]){
                    _cfg['cfg'] = cfg;
                }
                rq_list.push(_cfg);
            }
        });
        let data = view.state.data[key];
        data.forEach(function(item){
            rq_list.forEach(function(_cfg){
                if(!_cfg.cfg&&!item[_cfg.field]&&!rq_empty){
                    rq_empty = block_cfg.list[_cfg.field].text;
                }
                if(_cfg.cfg&&(item[_cfg.field]===undefined||!Enum[_cfg.cfg.type][item[_cfg.field]])){
                    rq_empty = block_cfg.list[_cfg.field].text;
                }
            })
        });
    });
    return rq_empty;
}

export function haveModAuth(mod){  
    if(AppMeta.mods){
        let cfg = AppMeta.mods[mod];
        if(cfg.public == 1 ){
            return true;
        }
    }
    for (var lv1 in AppMeta.menu) {
        for (var lv2 in AppMeta.menu[lv1]) {
            if (lv2 === mod) {
                return true;
            }
        }
    }
    return false;
}

export function haveActionAuth(action,mod){
    if(!AppMeta.menu){
        return true;
    }
    let cfg;
    for (var lv1 in AppMeta.menu) {
        for (var lv2 in AppMeta.menu[lv1]) {
            if (lv2 === mod) {
                cfg = AppMeta.menu[lv1][lv2];
                break;
            }
        }
        if(cfg){
            break;
        }
    }
    if(!cfg || !cfg.action){
        return false;
    }
    if(cfg.action[action]){
        return true;
    }
    return false;
}

function get_mod_cfg(mod) {

    if (AppMeta.mods[mod].read) {
        return AppMeta.mods[mod];
    }

    let cfg;
    for (var lv1 in AppMeta.menu) {
        for (var lv2 in AppMeta.menu[lv1]) {
            if (lv2 === mod) {
                cfg = AppMeta.menu[lv1][lv2];
                break;
            }
        }
        if (cfg) {
            break;
        }
    }
    return cfg;
}

function get_read_param(action, cfg, data) {
    var param = { action: action, front_enum: Enum.ver };

    if (cfg.mod) {
        param.mod = cfg.mod;
    }
    if (data && data.search) {
        Object.assign(param, data.search);
    }

    if (cfg.read.data) {
        Object.assign(param, get_req_data(cfg.read.data, data));
    }
    return param;
}

export function get_req_data(cfg, data) {
    if (!cfg) {
        return data;
    }

    if (typeof(cfg) === 'string') {
        return data[cfg];
    }
    let rst = {};
    Object.keys(cfg).forEach(function(k) {
        let item = cfg[k];

        //'订单信息.id'
        if (item.indexOf('.') > 0) {

            let fd = item.split(' '); //fields
            let flt = item.split('|'); //filter

            if (fd.length > 1) {
                fd[fd.length - 1] = fd[fd.length - 1].split('|')[0];
            } else {
                fd = [flt[0]];
            }
            if (flt.length > 1) {
                flt = flt[1];
            } else {
                flt = undefined;
            }
            let blk = fd[0].split('.')[0]; //block
            fd[0] = fd[0].split('.')[1];

            let pk; //picked value
            if (fd.length > 1) {
                pk = data[blk].map(function(_item) {
                    let d = {};
                    fd.forEach(function(f) {
                        d[f] = _item[f];
                    });
                    return d;
                });
            } else {
                pk = data[blk].map(i => i[fd[0]]);
            }

            if (flt) { //filter : '订单详情.flow_id|first'
                switch (flt) {
                    case 'first':
                        rst[k] = data[blk][0][fd[0]];
                        break;
                    default:
                        data[blk].forEach(function(_item) {
                            if (_item[flt]) {
                                rst[k] = _item[fd[0]];
                            }
                        });
                        break;
                }
            } else {
                if ( !isNaN( parseInt(k) ) ) { //['订单详情.id']无映射
                    rst[blk] = pk;
                } else { //['订单详情.id':'id_arr']映射
                    rst[k] = pk;
                }
            }
        } else {

            if ( !isNaN( parseInt(k) ) ) { //['id']无映射
                rst[item] = data[item];
            } else { //['id':'uid']映射
                rst[k] = data[item];
            }
        }
    });

    return rst;
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

// 将人民币金额变成大写
export function convertCurrency(money) {
    //汉字的数字
    var cnNums = new Array('零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖');
    //基本单位
    var cnIntRadice = new Array('', '拾', '佰', '仟');
    //对应整数部分扩展单位
    var cnIntUnits = new Array('', '万', '亿', '兆');
    //对应小数部分单位
    var cnDecUnits = new Array('角', '分', '毫', '厘');
    //整数金额时后面跟的字符
    var cnInteger = '整';
    //整型完以后的单位
    var cnIntLast = '元';
    //最大处理的数字
    var maxNum = 999999999999999.9999;
    //金额整数部分
    var integerNum;
    //金额小数部分
    var decimalNum;
    //输出的中文金额字符串
    var chineseStr = '';
    //分离金额后用的数组，预定义
    var parts;
    if (money == '') { return '零元整'; }
    money = parseFloat(money);
    if (money >= maxNum) {
        //超出最大处理数字
        return '';
    }
    if (money == 0) {
        chineseStr = cnNums[0] + cnIntLast + cnInteger;
        return chineseStr;
    }
    if (money < 0) {
        money = Math.abs(money);
        chineseStr = '负' + chineseStr;
    }
    //转换为字符串
    money = money.toString();
    if (money.indexOf('.') == -1) {
        integerNum = money;
        decimalNum = '';
    } else {
        parts = money.split('.');
        integerNum = parts[0];
        decimalNum = parts[1].substr(0, 4);
    }
    //获取整型部分转换
    if (parseInt(integerNum, 10) > 0) {
        var zeroCount = 0;
        var IntLen = integerNum.length;
        for (var i = 0; i < IntLen; i++) {
            var n = integerNum.substr(i, 1);
            var p = IntLen - i - 1;
            var q = p / 4;
            var m = p % 4;
            if (n == '0') {
                zeroCount++;
            } else {
                if (zeroCount > 0) {
                    chineseStr += cnNums[0];
                }
                //归零
                zeroCount = 0;
                chineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
            }
            if (m == 0 && zeroCount < 4) {
                chineseStr += cnIntUnits[q];
            }
        }
        chineseStr += cnIntLast;
    }
    //小数部分
    if (decimalNum != '') {
        var decLen = decimalNum.length;
        for (var i = 0; i < decLen; i++) {
            var n = decimalNum.substr(i, 1);
            if (n != '0') {
                chineseStr += cnNums[Number(n)] + cnDecUnits[i];
            }
        }
    }
    if (chineseStr == '') {
        chineseStr += cnNums[0] + cnIntLast + cnInteger;
    } else if (decimalNum == '') {
        chineseStr += cnInteger;
    }
    return chineseStr;
}
// ---------------------------------------------------------
export function doc_map(data) {
    switch (data.doc_type_id) {
        case appConst.DOC_ORDER_SK:
            return '修改业务收款单';
        case appConst.DOC_ZJ_SK:
            return '修改资金收款单';
        case appConst.DOC_YJ:
            return '修改押金单';
        case appConst.DOC_YW_TK:
            return '修改退业务收款单';
        case appConst.DOC_YJ_TK:
            return '修改退押金单';
        case appConst.DOC_ZJ_TK:
            return '修改退资金收款单';
        case appConst.DOC_YW_JK:
            return '修改业务借款单';
        case appConst.DOC_ZJ_JK:
            return '修改资金借款单';
        case appConst.DOC_ACC_ZC:
            return '修改业务支出单';
        case appConst.DOC_ZJ_ZC:
            return '修改资金支出单';
        case appConst.DOC_YC:
            return '修改预存单';
        case appConst.DOC_YZ:
            return '修改预支单';
        case appConst.DOC_YW_NZ:
            return '修改业务内转单';
        case appConst.DOC_ZJ_NZ:
            return '修改资金内转单';
        case appConst.DOC_TZ:
            return '修改调整单';
        case appConst.DOC_HK:
            return '修改还款单';
        case appConst.DOC_GZ:
            return '修改工资单';
        case appConst.DOC_ZJ_TH:
            return '修改资金退回单';
        case appConst.DOC_YW_TH:
            return '修改业务退回单';
        case appConst.DOC_KK:
            return '修改扣款单';

        case appConst.DOC_ZJJK_ZYW:
            return '修改资金借款转业务单';
        case appConst.DOC_ZJZC_ZYW:
            return '修改资金支出转业务单';
        case appConst.DOC_ZJSK_ZYW:
            return '修改资金收款转业务单';
        default:
            break;
    }
}