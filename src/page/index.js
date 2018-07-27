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
import ReservePage from './ReservePage';
import Search from './Search';

import DocPage from './DocPage';
import HoldSeatPage from './HoldSeatPage';
import RealSignUpPage from './RealSignUpPage';
import OrderSelectCstmPage from './OrderSelectCstmPage';
import NewCstmPage from './NewCstmPage';
import OrderReceivableDetail from './OrderReceivableDetail';
import OrderSettleableDetail from './OrderSettleableDetail';

import SelectItemPage from './SelectItemPage';


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
	'游客名单': TouristList,
	'录入游客名单': InputTourist,
	'实报': ShibaoPage,
	'占位': ReservePage,
	'搜索': Search,

	//团
	'占位订单':HoldSeatPage,
	'实报订单-异部':RealSignUpPage,
	'实报订单-同部':RealSignUpPage,
	'修改订单-异部':OrderEditPage,
	'修改订单-同部':OrderEditPage,
	'订单选择客户':OrderSelectCstmPage,
	'录入订单应收明细':OrderReceivableDetail,
	'录入订单应转明细':OrderSettleableDetail,

	'单据审批页': DocPage,
	'选择项目页': SelectItemPage,
	
	'占位新增客户':NewCstmPage,
	'订单新增客户':NewCstmPage,
};