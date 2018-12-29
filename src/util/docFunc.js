
import { log, post, trigger, AppCore, AppMeta, loadIfEmpty, get_req_data, goBack, submit, reload, Enum } from '../util/core';


export function calc_fund(view, data) {
    var amount = 0;
    if (data['入账详情']
        && data['入账详情'][0]['fund_id'] != undefined
        && data['入账详情'][0]['fund_id'] != '0') {
        // angular.forEach(data['入账详情'], function (i) {
        //     i.amount = i.amount ? parseFloat(i.amount).toFixed(2) : 0;
        //     amount += + i.amount;
        // });
        data['入账详情'].forEach( item => {
            item.amount = item.amount ? parseFloat(item.amount).toFixed(2) : 0;
            amount += + item.amount;
        })
    } else {
        // angular.forEach({ '资金收款结算信息': '单据信息' }, function (blk, settle_blk) {
        //     angular.forEach(scope.data[settle_blk], function (i) {
        //         i.rmb_total = scope.data[blk][0]['settle_amount'];
        //         if (i.currency_id) {
        //             i.rate = scope.isEdit ? (EnumSrvc.CurrencyRate[i.currency_id]) : i.rate;
        //             if (i.rmb_total
        //                 && i.rate) {
        //                 i.local_currency_total = (i.rmb_total / i.rate).toFixed(2);
        //                 amount += + i.rmb_total;
        //             }
        //         }
        //     });
        // });
        let obj = { '资金收款结算信息': '单据信息' }
        Object.keys(obj).forEach( item => {
            data[item].forEach( i => {
                i.rmb_total = data[obj[item]][0]['settle_amount'];
                if (i.currency_id) {
                    i.rate = Enum.CurrencyRate[i.currency_id];
                    if (i.rmb_total
                        && i.rate) {
                        i.local_currency_total = (i.rmb_total / i.rate).toFixed(2);
                        amount += + i.rmb_total;
                    }
                }
            })
        })
    }

    if (data['单据信息']) {
        data['单据信息'][0]['settle_amount'] = amount.toFixed(2);
        // 获取金额中文大写
        // var cn_amount = $rootScope.convertCurrency(amount.toFixed(2));
        // scope.data['单据信息'][0]['cn_settle_amount'] = cn_amount;
    }
}