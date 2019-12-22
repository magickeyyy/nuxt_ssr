/*
 * @Author: magckeyyy
 * @Date: 2019-11-12 10:01:30
 * @Description:
 * @Attention:
 */
//  部分状态后台没数据字典，前端维护   
export const orderStatus = [
	// 订单状态
	{ value: 1, label: '待支付' },
	{ value: 2, label: '已支付未确认' },
	{ value: 3, label: '已确认待出单' },
	{ value: 4, label: '已出单或预定成功' },
	{ value: 5, label: '未付款订单关闭' },
	{ value: 6, label: '取消中' },
	{ value: 7, label: '已取消' },
	{ value: 8, label: '退款中' },
	{ value: 9, label: '已退款' },
];
export const payTypeDictId = {
	ALIPAY_H5: '支付宝H5',
	ALIPAY_APP: '支付宝APP',
	ALIPAY_QRCODE: '支付宝电脑网页',
	WECHAT_H5: '微信H5',
	WECHAT_APP: '微信APP',
	WECHAT_QRCODE: '微信电脑网页',
	WECHAT_MINI: '微信小程序',
	CASHIER: '收银台',
	null: '未支付',
};
export const weekList = {
	0: '周日',
	1: '周一',
	2: '周二',
	3: '周三',
	4: '周四',
	5: '周五',
	6: '周六',
};
export const resType = {
	RESTAURANT: '餐厅',
	TICKETS: '门票',
	CHARACTERISTIC_EXPERIENCE: '特色体验',
	HOTEL: '酒店',
	BUS: '大车',
};
