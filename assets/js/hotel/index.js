/*
 * @Author: magckeyyy
 * @Date: 2019-11-14 18:55:25
 * @Description:
 * @Attention:
 */

//  游海团组酒店有网络状态字段候选
export const YHInternetType = {
    NO: '无网络',
    FREE: '免费网络',
    NOT_SURE: '不确定',
    CHARGE: '付费网络',
};

// 酒店订单状态
export const HotelOrderStatus = [
    { value: 'CREATED', label: '待支付' },
    { value: 'PAYED', label: '已支付未确认' },
    // 好巧订单没有这个状态,好巧订单订单状态同步如果预订成功以后直接是SUCCESS,团组酒店如果二次确认成功是CONFIRMED,提交分房名单以后是SUCCESS
    { value: 'CONFIRMED', label: '已确认待出单' },
    { value: 'SUCCESS', label: '已出单或预定成功' },
    { value: 'COMPLETED', label: '订单已完成' },
    { value: 'CANCELING', label: '取消中' },
    { value: 'CANCELED', label: '已取消' },
    { value: 'REFUNDING', label: '退款中' },
    { value: 'REFUND_FAIL', label: '退款失败' },
    { value: 'REFUNDED', label: '已退款' },
    { value: 'CLOSED', label: '未付款订单关闭' },
];

// 订单页入住人信息性别
export const SEX = [
    { value: 'MALE', label: '男' },
    { value: 'FEMALE', label: '女' },
];

// 订单页面是否是成人
export const ADULT = [
    { value: 1, label: '成人' },
    { value: 0, label: '儿童' },
];

//
export const HotelPayType = [
    // 11-支付宝H5、12-支付宝APP、13-支付宝电脑网页、21-微信H5、22-微信APP、23-微信电脑网页
    { value: 11, label: '支付宝H5' },
    { value: 12, label: '支付宝APP' },
    { value: 13, label: '支付宝电脑网页' },
    { value: 21, label: '微信H5' },
    { value: 22, label: '微信APP' },
    { value: 23, label: '微信电脑网页' },
];

// 订单类型
export const HotelOrderType = {
    GROUP: '团房预定',
    HAOQIAO_BOOKING: '散客预定',
};

// 酒店预定儿童年龄,0-17
export const ChildrenAgeList = [
    '小于1岁',
    '1岁',
    '2岁',
    '3岁',
    '4岁',
    '5岁',
    '6岁',
    '7岁',
    '8岁',
    '9岁',
    '10岁',
    '11岁',
    '12岁',
    '13岁',
    '14岁',
    '15岁',
    '16岁',
    '17岁',
];

// 团组酒店分房名单房型床型
export const HotelRBtype = [
    { value: 'SINGLE', label: '单人间' }, // 入住人数：1
    { value: 'TWIN', label: '双人间' }, // 入住人数：2
    { value: 'DOUBLE', label: '大床房' }, // 入住人数：2
    { value: 'TRIPLE', label: '三人间' }, // 入住人数：3
];

// 团组酒店入住人性别
export const TravellerSex = [
    { value: 'MALE', label: '男' },
    { value: 'FEMALE', label: '女' },
];