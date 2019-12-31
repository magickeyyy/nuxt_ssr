import PREFIX from './prefix'

export const API_HOTEL = {
    // 酒店
    searchHotel: {
        url: PREFIX + '/hotel/hotels',
        method: 'post',
    },
    hotelDetail: {
        url: PREFIX + '/hotel/hotelDetail',
        method: 'post',
    },
    roomRateList: {
        url: PREFIX + '/hotel/roomRateList',
        method: 'post',
        headers: {
            token: true
        }
    },
    searchLogs: {
        url: PREFIX + '/hotel/searchLogs',
    },
    // 跳转酒店预定,
    bookingPre: {
        url: PREFIX + '/hotel-booking/generic',
        method: 'post',
        headers: {
            token: true
        }
    },
    facilities: {
        url: PREFIX + '/hotel/facilities',
    },
    booking: {
        url: PREFIX + '/hotel-booking/generic/booking',
    },
    // 酒店支付
    pay: {
        url: PREFIX + '/hotel-booking/generic/pay',
    },
};