<!--
 * @Author: magckeyyy
 * @Date: 2020-01-16 17:47:11
 * @Description: 
 * @Attention: 
 -->
<template>
    <div class="pulldown">
        <div class="wraper"></div>
    </div>
</template>

<script>
import BScroll from 'better-scroll'
import { API_HOTEL } from '~/assets/api/hotel'
export default {
    layout(context) {
        return 'scroll'
    },
    data() {
        return {
            params: {
                bookingQuantity: 1,
                checkInDate: '2020-01-17',
                checkOutDate: '2020-01-18',
                hotelName: '',
                hotelId: '',
                nationality: 'CN',
                seeOnlyGroupRooms: false,
                adultsQuantity: 1,
                childQuantity: 0,
                childAge: '',
                countryId: 16567,
                cityId: 16568,
                moreConditionSearchDTO: {},
                pageNo: 1,
                pageSize: 10,
                order: 'asc',
                sidx: ''
            }
        }
    },
    mounted() {
        this.getHotels();
    },
    methods: {
        getHotels(pageNo = 1){
            let params = {...this.params, pageNo};
            this.$axios({ ...API_HOTEL.searchHotel, params })
                .then(res => {
                    console.log(res)
                })
        },
        initScroll() {
            let container = document.querySelector('.pulldown')
            let scroll = new BScroll(container, {
                pullUpLoad: {
                    threshold: 50
                }
            })
        }
    }
}
</script>

<style scoped lang="less">
</style>
