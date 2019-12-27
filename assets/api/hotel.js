import PREFIX from './prefix'

export const API_HOTEL = {
    // 酒店
    searchHotel: {
        url: PREFIX + '/hotel/hotels',
        method: 'post',
        headers: {
            token: true
        }
    },
    hotelDetail: {
        url: PREFIX + '/hotel/hotelDetail',
    },
    roomRateList: {
        url: PREFIX + '/hotel/roomRateList',
    },
    searchLogs: {
        url: PREFIX + '/hotel/searchLogs',
    },
    // 跳转酒店预定,
    bookingPre: {
        url: PREFIX + '/hotel-booking/generic',
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