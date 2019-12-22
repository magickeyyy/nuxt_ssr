// 客户端
const CLIENT = '/client' + '/web/api';
// 后台管理系统

export const api_base = {
    // 公共基础相关接口
    uploadImg: CLIENT + '/base/image/upload',
    dict: CLIENT + '/base/dict',
    // 手机号前缀
    phonePrex: CLIENT + '/regioncellphone/list',
    // 玩乐等复合型搜索：地区、门票、餐厅灯
    complexSearch: CLIENT + '/search/destination/listForType',
    //获取城市列表（带区域，东欧、西欧）
    listAllCountryWithContinentPartition: CLIENT + '/location/listAllCountryWithContinentPartition',
    //word上传
    wordLoad: CLIENT + '/base/doc/upload',
};

export const api_customer = {
    // 账户接口
    logout: CLIENT + '/customer/logout',
    changePassword: CLIENT + '/customer/changePassword',
};

export const api_auth = {
    // 用户认证接口
    register: CLIENT + '/auth/register',
    getSms: CLIENT + '/auth/sms/register',
    checkSms: CLIENT + '/auth/sms/register/check',
    buyer: CLIENT + '/auth/register/buyer',
    login: CLIENT + '/auth/login/username',
    // 忘记密码发送邮箱验证码
    getEmailYzm: CLIENT + '/auth/email/forgetPassword',
    // 忘记密码发送邮箱
    getPwdEmail: CLIENT + '/auth/forgetPassword/email',
    // 忘记密码发送手机
    getPwdPhone: CLIENT + '/auth/forgetPassword/mobile',
    // 忘记密码发送手机验证码
    getSmsYzm: CLIENT + '/auth/sms/forgetPassword',
    // 退出
    userExist: CLIENT + '/auth/userExist',
    signUpStepInfo: CLIENT + '/auth/signUpStepInfo',
};

export const api_location = {
    // 城市国家接口
    allCountry: CLIENT + '/location/listAllCountry',
    treeByCountry: CLIENT + '/location/treeByCountry',
    // 获取全部国籍列表
    nationList: CLIENT + '/location/listAllNationality',
    // 欧洲分区及国家
    zone: CLIENT + '/location/listAllCountryWithContinentPartition',
    //所有国家
    allCity:CLIENT +'/location/listAllCity'
};

export const api_hotel = {
    // 酒店
    searchHotel: CLIENT + '/hotel/hotels',
    hotelDetail: CLIENT + '/hotel/hotelDetail',
    roomRateList: CLIENT + '/hotel/roomRateList',
    searchLogs: CLIENT + '/hotel/searchLogs',
    // 跳转酒店预定,
    bookingPre: CLIENT + '/hotel-booking/generic',
    facilities: CLIENT + '/hotel/facilities',
    booking: CLIENT + '/hotel-booking/generic/booking',
    // 酒店支付
    pay: CLIENT + '/hotel-booking/generic/pay',
};

export const api_order = {
    // 搜索酒店相关
    allHotelOrder: CLIENT + '/hotel/order/listByCustomer',
    // 酒店订单详情
    hotelOrderDetail: CLIENT + '/hotel/order/detailByCustomer',
    // 取消酒店订单
    cancelHotelOrder: CLIENT + '/hotel/order/cancelByCustomer',
    // 下载酒店
    getHotelVo: CLIENT + '/hotel/order/getVoucherDataByCustomer',
    // 获取取消酒店违约金
    getHotelDamages: CLIENT + '/hotel/order/liquidatedDamages',
    // 删除酒店订单
    delHotelOrder: CLIENT + '/hotel/order/deleteByCustomer',
    // 酒店获取已上交分房名单
    getAllotInfo: CLIENT + '/hotel/order/detailRoomingListByCustomer',
    // 酒店提交分房名单
    submitAllotInfo: CLIENT + '/hotel/order/submitRoomingListByCustomer',
    // 提交酒店分房名单前获取限制条件
    allotInfo: CLIENT + '/hotel/order/roomListCons',
    //
    allPlayOrder: CLIENT + '/play/order/list-page',
    bookingPlay: CLIENT + '/play/restaurant/booking',
    // 玩乐订单取消
    cancelPlayOrder: CLIENT + '/play/order/cancel',
    //  玩乐订单违约金查询
    cancelPolicy: CLIENT + '/play/order/cancelPolicy',
    // 玩乐订单删除
    deletePlayOrder: CLIENT + '/play/order/delete',
    // 玩乐订单详情 和另一个重合了
    playOrderInfo: CLIENT + '/play/order/info',
    // 导出玩乐voucher
    expPlayVo: CLIENT + '/play/order/voucher-export',
};

export const api_play = {
    tags: CLIENT + '/play/label/search-condition',
    // 玩乐资源分类搜索
    searchAll: CLIENT + '/search/playSearch',
    // 餐厅资源详情
    resDetail: CLIENT + '/play/resource/restaurantDetail',
    // 门票、特色资源详情
    otherDetail: CLIENT + '/play/resource/detail',
    rate: CLIENT + '/play/resource/detail-rating',
    commentList: CLIENT + '/play/comment/list',
    // 跳转餐厅订单填写页，订单信息
    restaurant: CLIENT + '/play/restaurant',
    // 玩乐餐厅预定
    booking: CLIENT + '/play/restaurant/booking',
    // 玩乐特色、门票预定
    bokingOther: CLIENT + '/play/resource/booking',
    // 跳转特色、门票填写订单页，订单信息
    resource: CLIENT + '/play/resource/index',
    // 特色、门票价格日历
    otherLinkage: CLIENT + '/play/resource/linkage',
    // 玩乐餐厅价格日历
    linkage: CLIENT + '/play/restaurant/linkage',
    // 首页最近浏览
    listBrowseLog: CLIENT + '/play/browseLog/listBrowseLog',
    pay: CLIENT + '/play/resource/pay',
    // 首页经常预订
    resourceReserve: CLIENT + '/play/resource-reserve/list-limit',
    // 玩乐搜索餐厅、门票、资源总数
    searchTota: CLIENT + '/play/search/searchTotal',
    // 订单详情和/play/order/info是一摸一样的
    orderDetail: CLIENT + '/play/order/detail',
    // 玩乐等复合型搜索：地区、门票、餐厅灯
    listForType: CLIENT + '/search/destination/listForType',
};

export const api_personal = {
    comment: CLIENT + '/play/comment/comment',
};

export const api_pay = {
    // 获取可用支付方式
    payWay: CLIENT + '/availablePayment',
}

export const api_bus = {
    //大车首页列表
    busList: CLIENT + '/bus/list',
    detail: CLIENT + '/bus/booking/index',
    // 大车价格日历
    linkage: CLIENT + '/bus/booking/linkage',

    // 大车订单详情
    orderDetail: CLIENT + '/bus/order/orderDetail',
    //上传出团通知书
    groupAttachment: CLIENT + '/bus/order/groupAttachment/upload',
    //查询可用国家
    busCountry: CLIENT + '/bus/location-combox',
    //查询大车可用城市：
    busCity: CLIENT + '/bus/city-combox',
    //查询国家对应车型
    busType: CLIENT + '/bus/bus-combox',
    //查询大车热门城市
    hotCity: CLIENT + '/bus/hot-city',
    // 大车订单列表
    listOrder: CLIENT + '/bus/order/listOrder',
    //确认付款
    pay: CLIENT + '/bus/booking/pay',
    //大车预定
    busBooking: CLIENT + '/bus/booking/order',
    busOrderCancel: CLIENT + '/bus/order/cancel',
    busOrderCancelRul: CLIENT + '/bus/order/cancel/policy',
    busChangorder: CLIENT + '/bus/order/orderAttachement',
};
export const api_assistant = {
    //行程列表
    page: CLIENT + '/travelAssistant/trip/page',
    //复制
    copy:CLIENT+'/travelAssistant/trip/copy',
    //删除
    deletes:CLIENT+'/travelAssistant/trip/delete',
    //搜索
    search:CLIENT+'/travelAssistant/poi/searchInCity'
};
