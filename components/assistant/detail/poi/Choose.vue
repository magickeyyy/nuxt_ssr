<template>
    <div class="chooses">
        <div class="paixu">
            <span style="color:#999999;font-size:14px">排序：</span>
            <Select v-model="tui" style="width:110px;">
                <Option
                    v-for="item in selectList"
                    :value="item.value"
                    :key="item.value"
                >{{ item.label }}</Option>
            </Select>
        </div>
        <div class="filt">
            <span  class="texts">筛选：</span>
            <select v-model="all" style="width:110px;" >
                <OptionGroup label="景点类型" :max="1">
                        <Option v-for="item in list1" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </OptionGroup>
            </select>
        </div>
    </div>
</template>


<script>
export default {
    props: {
        resourceType: {
            type: Number,
            required: true,
        },
    },
    data() {
        return {
            tui: '推荐排序',
            selectList: [
                { value: '推荐排序', label: '推荐排序' },
                { value: '评分由高至低', label: '评分由高至低' },
                { value: '价格由低至高', label: '价格由低至高' },
                { value: '价格由高至低', label: '价格由高至低' },
            ],
            list1: [
                { value: '全部', label: '全部' },
                { value: '景点与地标', label: '景点与地标' },
                { value: '博物馆&艺术馆', label: '博物馆&艺术馆' },
                { value: '自然与公园', label: '自然与公园' },
                { value: '主题乐园', label: '主题乐园' },
                { value: '庆典&演唱会', label: '庆典&演唱会' },
                { value: '动物园&水族馆', label: '动物园&水族馆' },
                { value: '秀场演出', label: '秀场演出' },
            ],
        };
    },
};
</script>


<style lang="less">
.chooses{
    .paixu{
        .ivu-select-dropdown{
            position: relative;
        }
    }
}
</style>

<style lang="less" scoped>
.chooses {
    margin-left: 23px;
    background: rgba(255, 255, 255, 1);
    display: flex;
    .filt {
        .texts {
            color: #999999;
            font-size: 14px;
            margin-left: 84px;
            line-height: 30px;
        }
    }
}
</style>