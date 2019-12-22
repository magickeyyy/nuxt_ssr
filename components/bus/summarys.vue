<template>
    <div>
        <div class="plan">
            <div class="head">
                <div class="title" id="level4">行程概要</div>
                <div class="file" v-if="datas.routeAttachmentUrl">
                    <i class="iconfont iconfujian" style="color:#999999" />
                    <span class="downLoad" @click="downladFile" title="点击下载">行程附件.doc</span>
                </div>
            </div>
            <div class="topInfo">
                <div>
                    <span class="title">时间</span>
                    <span>&nbsp;上车时间：2019-12-16 12:00</span>
                </div>
                <div style="margin-top: 16px;">
                    <span class="title">地点</span>
                    <span>&nbsp;上车地点：法国</span>
                </div>
            </div>
            <div class="planList">
                <PlanShow :orderRouteVOS="datas.orderRouteVOS" />
            </div>
        </div>
    </div>
</template>

<script>
import PlanShow from '~/components/bus/PlanShow';
export default {
    components: { PlanShow },
    props: ['datas'],
    data() {
        return {};
    },
    methods: {
        downladFile() {
            window.open(this.datas.routeAttachmentUrl);
        },
    },
};
</script>

<style scoped lang="less">
.plan {
    margin-top: 12px;
    padding: 35px 51px;
    background: #fff;
    border: 1px solid rgba(237, 237, 237, 1);
    box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.03);
    border-radius: 6px;
    .head {
        overflow: auto;
        .title {
            font-size: 24px;
            font-weight: bold;
            color: rgba(17, 17, 17, 1);
            float: left;
        }
        .file {
            float: left;
            margin-left: 44px;
            color: #555555;
            font-size: 14px;
            line-height: 40px;
        }
    }
    .topInfo {
        margin-top: 46px;
        padding-bottom: 25px;
        border-bottom: 1px dashed #ebebeb;
        div {
            font-weight: bold;
            .title {
                background: #7b7b7b;
                color: #fff;
                padding: 0 4px;
            }
        }
    }
    .planList {
        padding: 22px 0;
    }
    .downLoad {
        cursor: pointer;
    }
}
</style>