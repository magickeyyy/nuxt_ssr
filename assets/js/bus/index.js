/*
 * @Author: magckeyyy
 * @Date: 2019-11-12 19:05:14
 * @Description:
 * @Attention:
 */
// 大车订单状态转后台
export const BusOrderStateToServer = [
    { value: 'TO_BE_PAID', label: '待支付' },
    { value: 'TO_BE_CONFIRMED', label: '待确认' },
    { value: 'CONFIRMED', label: '已确认' },
    { value: 'GOT_FINAL', label: '获取final' },
    { value: 'CANCELING', label: '取消中' },
    { value: 'CANCELED', label: '已取消' },
    { value: 'AUTO_CANCELED', label: '超时关闭' },
    {value: 'GROUP_PUSHED', label: '已推送出团通知书'},
    {value: 'PAY_SUCCESS', label: '支付成功'},
    {value: 'COMPLETED', label: '订单已完成'}
];
// 大车订单状态转前台
export const BusOrderStateToCilent = {
    TO_BE_PAID: '待支付',
    TO_BE_CONFIRMED: '待确认',
    CONFIRMED: '已确认',
    GOT_FINAL: '获取final',
    CANCELING: '取消中',
    CANCELED: '已取消',
    AUTO_CANCELED: '超时关闭',
    GROUP_PUSHED:'已推送出团通知书',
    PAY_SUCCESS:'支付成功',
    COMPLETED:'订单已完成'
};
