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

import InputTourist from './InputTourist';
import SearchPage from './SearchPage';

import DocPage from './DocPage';
import HoldSeatPage from './HoldSeatPage';
import RealSignUpPage from './RealSignUpPage';
import OrderSelectCstmPage from './OrderSelectCstmPage';
import NewCstmPage from './NewCstmPage';
import OrderReceivableDetail from './OrderReceivableDetail';
import OrderSettleableDetail from './OrderSettleableDetail';
import TouristListPage from './TouristListPage';

import SelectItemPage from './SelectItemPage';
import MyAccountPage from './MyAccountPage';
import RegulatoryPage from './RegulatoryPage';
import RegulatoryDetailPage from './RegulatoryDetailPage';
import QrCodePage from './QrCodePage';

import ClaimFunds from './ClaimFunds';
import ClaimFundsDone from './ClaimFundsDone';

import ClaimDoc from './ClaimDoc';
import OrderManagementList from './OrderManagementList';
// import FundManagementList from './FundManagementList';

import ContractList from './ContractList';
import AddContract1 from './AddContract1';
import AddContract2 from './AddContract2';
import AddContract3 from './AddContract3';
import AddContract4 from './AddContract4';
import AddSingleContract2 from './AddSingleContract2';
import AddSingleContract3 from './AddSingleContract3';

import IncomeExpensesList from './IncomeExpensesList';
import IncomeExpensesEditDoc from './IncomeExpensesEditDoc';

import WechatOrderList from './WechatOrderList';
// 数据统计 页面
import StatisticsDate from './StatisticsDate';
import StatisticalPresentation from './StatisticalPresentation';
import StatisticalFund from './StatisticalFund';


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
	'录入游客名单': InputTourist,
	'查看游客名单': InputTourist,
	'搜索': SearchPage,

	//团
	'占位订单':HoldSeatPage,
	'实报订单-异部':RealSignUpPage,
	'实报订单-同部':RealSignUpPage,
	'修改订单-活动':OrderEditPage,
	'修改订单-异部':OrderEditPage,
	'修改订单-同部':OrderEditPage,
	'订单名单': TouristListPage,
	'订单选择客户':OrderSelectCstmPage,
	'录入订单应收明细':OrderReceivableDetail,
	'录入订单应转明细':OrderSettleableDetail,

	'单据审批页': DocPage,
	'选择项目页': SelectItemPage,
	
	'占位新增客户':NewCstmPage,
	'订单新增客户':NewCstmPage,

	'我的账户':MyAccountPage,
	'账户监管':RegulatoryPage,
	'账户详情': RegulatoryDetailPage,

	'我的二维码':QrCodePage,

	'资金认领': ClaimFunds,
	'资金认领结果': ClaimFundsDone,

	'认领单据页': ClaimDoc,
	'订单管理': OrderManagementList,
	// '资金认领列表': FundManagementList,

	'合同列表': ContractList,
	'新增合同1': AddContract1,
	'新增合同2': AddContract2,
	'新增合同3': AddContract3,
	'新增合同4': AddContract4,
	'新增单项合同2': AddSingleContract2,
	'新增单项合同3': AddSingleContract3,
	'修改合同1': AddContract1,
	'修改合同2': AddContract2,
	'修改合同3': AddContract3,
	'修改合同4': AddContract4,
	'修改单项合同2': AddSingleContract2,
	'修改单项合同3': AddSingleContract3,

	'收支申请列表': IncomeExpensesList,
	'修改收支申请': IncomeExpensesEditDoc,

	'微信订单': WechatOrderList,

	'统计时间选择': StatisticsDate,
	'统计呈现': StatisticalPresentation,
	'统计业务资金': StatisticalFund,

};