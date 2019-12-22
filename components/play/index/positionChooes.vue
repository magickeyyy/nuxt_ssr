<template>
    <div class="position">
        <ul class="position_group_content">
            <li v-for="(it, i) in listData" :key="i">
                <Icon type="ios-arrow-down" class="icon_down" />
                <div class="position_title">{{it.nameCn}}</div>
                <ul>
                    <li v-for="(ij, j) in it.children" :key="j+'_city'" @click="toListPage(ij)">
                        <span :title='ij.nameCn'>{{ij.nameCn}}</span>
                    </li>
                </ul>
            </li>
            <!-- <li>
                <div class="position_title">东欧</div>
            </li>-->
        </ul>
    </div>
</template>

<script>
export default {
    name: 'position',
    props: ['listData'],
    data() {
        return {};
    },
    methods: {
        toListPage(v) {
            this.mixin_m_SStorage('set','play_search',{
                keywords: '', // 搜索关键字
                countryId: v.id,
                countryCn: v.nameCn,
                cityId: '',
                cityCn: '',
                resourceType: 1,
                sort: 1,
                showCity: true,
            })
            this.$router.push('/play/list')
        }
    }
};
</script>

<style scoped lang="less">
.position {
    width: 1180px;
    height: 110px;
    background: rgba(255, 255, 255, 1);
    position: absolute;
    left: 50%;
    bottom: 0;
    transform: translateX(-50%);
    z-index: 99;
    .position_group_content {
        display: -webkit-flex;
        display: flex;
        flex-flow: row nowrap;
        > li {
            position: relative;
            .icon_down {
                position: absolute;
                right: 40px;
                top: 64px;
            }
            width: 25%;
            padding: 29px 56px;
            > ul {
                display: -webkit-flex;
                display: flex;
                align-content: flex-start;
                flex-flow: row wrap;
                height: 25px;
                overflow: hidden;
                > li {
                    padding-right: 20px;
                    line-height: 30px;
                    font-size: 14px;
                }
                > li span:hover {
                    cursor: pointer;
                    color: #ea037c;
                }
            }
        }
        > li:hover {
            background-image: linear-gradient(180deg, #ea037c 0, #ea037c 6px, #fff 6px, #fff 100%);
            box-shadow: 0px 6px 10px 0px rgba(0, 0, 0, 0.1);
            ul {
                height: auto;
            }
        }
        .position_title {
            font-size: 14px;
            margin-bottom: 6px;
            font-family: PingFang SC;
            font-weight: bold;
            color: rgba(234, 3, 124, 1);
        }
    }
}
</style>
