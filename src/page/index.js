import LogPage from './LogPage';
import InitPage from './InitPage';
import LoginPage from './LoginPage';
import HomePage from './HomePage';
import OrderPage from './OrderPage';
import OrderEditPage from './OrderEditPage';
import OrderCheckPage from './OrderCheckPage';
import GroupPage from './GroupPage';
import ProductPage from './ProductPage';
import ApprovePage from './ApprovePage';
import ProfilePage from './ProfilePage';
import TabPage from './TabPage';
import TouristList from './TouristList';
import InputTourist from './InputTourist';
import ShibaoPage from './ShibaoPage';
import reservePage from './reservePage';
import Search from './Search';


import DocYWJK from './DocYWJK';
import DocZJJK from './DocZJJK';

import DocYWNZ from './DocYWNZ';
import DocYWZC from './DocYWZC';
import DocYWTK from './DocYWTK';
import DocZJNZ from './DocZJNZ';
import DocZJZC from './DocZJZC';
import DocZJTK from './DocZJTK';


export default {
	'日志页': LogPage,
	'初始页': InitPage,
	'登录页': LoginPage,
	'首页': HomePage,
	'订单页': OrderPage,
	'订单修改页': OrderEditPage,
	'订单查看页': OrderCheckPage,
	'团队页': GroupPage,
	'产品详情页': ProductPage,
	'审批页': ApprovePage,
	'个人页': ProfilePage,
	'底栏菜单': TabPage,
	'业务借款单': DocYWJK,
	'资金借款单': DocZJJK,
	'游客名单': TouristList,
	'录入游客名单': InputTourist,
	'实报': ShibaoPage,
	'占位': reservePage,
	'搜索': Search,

		'业务内转单':DocYWNZ,
		'业务支出单':DocYWZC,
		'业务退款单':DocYWTK,
		'资金内转单':DocZJNZ,
		'资金支出单':DocZJZC,
		'资金退款单':DocZJTK,

	
};