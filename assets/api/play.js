import PREFIX from './prefix'
export const API_PLAY = {
    tags: {
        url: PREFIX + '/play/label/search-condition',
    },
    // 玩乐资源分类搜索
    searchAll: {
        url: PREFIX + '/search/playSearch',
        method: 'post'
    },
    // 餐厅资源详情
    resDetail: {
        url: PREFIX + '/play/resource/restaurantDetail',
    },
    // 门票、特色资源详情
    otherDetail: {
        url: PREFIX + '/play/resource/detail',
    },
    rate: {
        url: PREFIX + '/play/resource/detail-rating',
    },
    commentList: {
        url: PREFIX + '/play/comment/list',
        method: 'post',
    },
    // 跳转餐厅订单填写页，订单信息
    restaurant: {
        url: PREFIX + '/play/restaurant',
        method: 'post',
        headers: {
            token: true
        },
    },
    // 玩乐餐厅预定
    booking: {
        url: PREFIX + '/play/restaurant/booking',
        method: 'post',
        headers: {
            token: true
        },
    },
    // 玩乐特色、门票预定
    bokingOther: {
        url: PREFIX + '/play/resource/booking',
        method: 'post',
        headers: {
            token: true
        },
    },
    // 跳转特色、门票填写订单页，订单信息
    resource: {
        url: PREFIX + '/play/resource/index',
        method: 'post',
        headers: {
            token: true
        },
    },
    // 特色、门票价格日历
    otherLinkage: {
        url: PREFIX + '/play/resource/linkage',
        method: 'post',
        headers: {
            token: true
        },
    },
    // 玩乐餐厅价格日历
    linkage: {
        url: PREFIX + '/play/restaurant/linkage',
        method: 'post',
        headers: {
            token: true
        },
    },
    // 首页最近浏览
    listBrowseLog: {
        url: PREFIX + '/play/browseLog/listBrowseLog',
    },
    pay: {
        url: PREFIX + '/play/resource/pay',
    },
    // 首页经常预订
    resourceReserve: {
        url: PREFIX + '/play/resource-reserve/list-limit',
    },
    // 玩乐搜索餐厅、门票、资源总数
    searchTota: {
        url: PREFIX + '/play/search/searchTotal',
    },
    // 订单详情和/play/order/info是一摸一样的
    orderDetail: {
        url: PREFIX + '/play/order/detail',
    },
    // 玩乐等复合型搜索：地区、门票、餐厅灯
    listForType: {
        url: PREFIX + '/search/destination/listForType',
    },
};