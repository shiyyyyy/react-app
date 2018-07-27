

export const appConst = {

    //单据
    /* 单据类型 */
    DOC_SEARCH_SK:'1',  // 收款单
    DOC_SEARCH_ZC:'2',   // 支出单
    DOC_SEARCH_NZ:'3',   // 内转单
    DOC_SEARCH_TK:'4',   // 退款单
    DOC_SEARCH_YJ:'5',  // 押金单
    DOC_SEARCH_JK:'6',  // 借款单
    DOC_SEARCH_YC:'7',   // 预存单
    DOC_SEARCH_YZ:'8',  // 预支单
    DOC_SEARCH_TZ:'9',  // 调整单
    DOC_SEARCH_KK:'10', // 扣款单
    DOC_SEARCH_HK:'11', // 还款单
    DOC_SEARCH_GZ:'12', // 工资单
    DOC_SEARCH_TH:'13', // 退回单

    /* 单据类型细分 */
    DOC_ORDER_SK:'1',//订单收款
    DOC_ACC_ZC:'2',//核算支出
    DOC_YW_NZ:'3',//业务内转
    DOC_ZJ_NZ:'4',//资金内转
    DOC_YW_TK:'5',//业务收款退款
    DOC_YJ_TK:'6',//押金退款
    DOC_YJ:'7',//押金单
    DOC_YW_JK:'8',//借款单
    DOC_YC:'9',//预存单
    DOC_YZ:'10',//预支单
    DOC_TZ:'11',//调整单
    DOC_KK:'12',//扣款单
    DOC_ZJ_SK:'13',//资金收款
    DOC_ZJ_TK:'14',//资金退款
    DOC_ZJ_JK:'15',//资金借款
    DOC_ZJ_ZC:'16',//资金支出
    DOC_HK:'17',//还款
    DOC_GZ:'18',//工资
    DOC_ZJ_TH:'19',//资金退回
    DOC_YW_TH:'20',//业务退回

    //核算
    ACCOUNTING_TICKET_AIR:'1',//机票核算
    ACCOUNTING_VISA:'3',//送签核算
    ACCOUNTING_GROUP:'4',//团队核算
    ACCOUNTING_INSURE:'5',//保险核算
    ACCOUNTING_LOCAL:'6',//地接核算

    ACCOUNTING_ORDER: '7',
    ACCOUNTING_ORDER_SETTLE:'8',
    ACCOUNTING_ORDER_PAY:'9',


    //账期
    PAYMENT_BEFORE_START:'1', // 出团前
    PAYMENT_AFTER_END:'2',// 回团后
    PAYMENT_START_NEXT:'3',// 出团后次月
    PAYMENT_END_NEXT:'4',// 回团后次月

    //客户
    CUSTOMER_MS:'1',
    CUSTOMER_DS:'2',
    CUSTOMER_ZK:'3',

    //团队日志
    GROUP_LOG_PRODUCT:'1',
    GROUP_LOG_MANAGER:'2',
    GROUP_LOG_STATE:'3',
    GROUP_LOG_SEAT_TOTAL:'4',
    GROUP_LOG_DEP_DATE:'5',
    GROUP_LOG_BACK_DATE:'6',
    GROUP_LOG_CLOSE_DATE:'7',
    GROUP_LOG_PEER_PRICE:'8',

    //证件类型
    ID_CARD:'1',
    PASSPORT:'2',
    TW_PASSPORT:'3',
    HK_PASSPORT:'4',

    //发票类型
    INVOICE_MAKE:'1',
    //INVOICE_RECEIVE:'2',
    INVOICE_LEND:'3',
    
    INVOICE_MAKING:'1',
    INVOICE_MADE:'2',
    INVOICE_ABOLISH:'3',

    //审批流程
    FLOW_NOT_INIT: '0',
    FLOW_NOT_SUBMIT: '1',
    FLOW_WAIT:'2',
    FLOW_REJECT:'3',
    FLOW_APPROVED:'4',
    FLOW_CANCEL:'5',

    //产品来源
    PD_SRC_TY:'1',
    PD_SRC_ZY:'2',
    PD_SRC_API:'3',

    // 设为起价
    BOTTOM_TRUE: 1,
    BOTTOM_FALSE: 0,

    ORDER_YB:'1',
    ORDER_TB:'0',

    //分支条件类型
    TYPE_COND:'1',
    AMOUNT_COND:'2',

    //合同属性
    PAP_CONTRACT:1,
    ELC_CONTRACT:2,
    //合同类型
    CONTRACT_CJ:'1',
    CONTRACT_GN:'2',
    CONTRACT_DX:'3',
    //限制类型
    LIMIT_RESEVER:'1',
    LIMIT_PAY:'2',
    //扣款公式类型
    KK_FORMULA_DX:'1',
    KK_FORMULA_JT:'2',
    //是否
    YES:'1',
    NO:'0',
    //产品模板
    PD_TEMP_TEAMTOUR:'1',
    PD_TEMP_ONLYVISA:'2',
    PD_TEMP_ONLYTRAFFIC:'3',
    PD_TEMP_ONLYBOOKING:'4',
    PD_TEMP_ONLYTICKETS:'5',
    PD_TEMP_LOCALTOUR:'6',

    //团期类型
    REGULAR_INVOICE:'1',
    DALIY_LEAVE:'2',
    WEEKLY_LEAVE:'3',

    //订单状态
    ORDER_NOT_HOLD:'1',
    ORDER_HOLDING:'2',
    ORDER_WAITING:'3',
    ORDER_APPROVED:'4',
    ORDER_CONFIRMED:'5',
    ORDER_CHANGING:'8',

    GROUPWAY_TY:'1',
    GROUP_WAY_SELF_ORG:'2',
    GROUP_WAY_SELF_EMP:'3',
    GROUPWAY_EVENT:'4',

    ORDER_NORMAL:'1',
    ORDER_EVENT:'2',

    //发票类型InvoiceType
    COMMON_INVOICE:'1',//普票
    PERFESSIONAL_INVOICE:'2',//专票

}