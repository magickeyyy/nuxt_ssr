<!--
 * @Author: magckeyyy
 * @Date: 2019-12-16 17:56:37
 * @Description: 玩乐价格日历
 * @Attention: 
 -->
<template>
    <div class="priceCalendar">
        <div class="head">
            <svg class="icon"
                 aria-hidden="true"
                 @click="changeMonth(-1)">
                <use xlink:href="#iconlast"></use>
            </svg>
            <p>{{params.year}}年{{params.month}}月</p>
            <svg class="icon"
                 aria-hidden="true"
                 @click="changeMonth(1)">
                <use xlink:href="#iconnext"></use>
            </svg>
        </div>
        <ul class="week">
            <li>一</li>
            <li>二</li>
            <li>三</li>
            <li>四</li>
            <li>五</li>
            <li>六</li>
            <li>七</li>
        </ul>
        <ul class="price">
            <li v-for="(v,i) in list"
                :key="i"
                :class="[{'active':active(v)},{'disabled':!v.canBooking||v.stock<=0}]"
                @click="select(v,i)">
                <div v-if="v.date">
                    <p>{{v.date}}</p>
                    <p v-if="v.prepayPrice"><span>&yen;{{v.prepayPrice}}</span>起</p>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    data() {
        return {};
    },
};
</script>

<style scoped lang="less">
</style>
