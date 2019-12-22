<template>
    <div class="layout">
        <!-- 头部 -->
        <div class="head">
            <div class="img-left">
                <img src="~assets/public_img/hotel_example.png" alt class='img' />
            </div>
            <div class="text" v-for="(item,index) in list1" :key="index">
                <p style="font-size:32px;font-weight:600;color:#111;margin-top:79px">{{item.cName}}</p>
                <p style="font-size:18px;font-weight:bold;color:rgba(17,17,17,1);">{{item.eName}}</p>
                <div class="same">
                    <p>地址：{{item.address}}</p>
                    <p>电话：{{item.phone}}</p>
                    <p>网址：{{item.url}}</p>
                </div>
            </div>
        </div>
        <!-- 底部 -->
        <div class="middle">
            <Anchor :affix="false" class="anchor" @on-select="activeLevel" style="background:rgba(252,251,252,1);">
                <AnchorLink v-for="(v,i) in list2" :key="i" :href="`?${urlData}#level${i}`" :title="v" :class="{'active':currentLevel===i}"></AnchorLink>
            </Anchor>
            <div class="word">
                <div class="left">
                    <div style="margin-bottom:26px">
                        科尔多瓦清真寺，（英文名称：Historic Centre of Cordoba），位于西班牙南部古城科尔多瓦市内，具有
                        摩尔建筑和西班牙建筑的混合风格， 是西班牙伊斯兰教最大的神圣建筑之一。分别于1984年，1994年根据
                    </div>
                    <div>

                        寺院是按阿拉伯清真寺的传统风格修建起来的。礼拜正殿建筑宏伟，装饰极为豪华，斑岩、碧玉和各种颜色
                        的大理石石柱构筑而成。这些石柱或掠夺自法国的尼姆和西班牙的塞维利亚等欧洲城市；或从迦太基的古建
                        废墟上精选而得，作为拜占廷皇帝利奥四世献给拉赫曼一世的礼物。初建时，利奥还曾从君士坦丁堡派遣熟
                        练工匠参加，并运来16吨各种玉石和象牙镶嵌图案（也称玛赛克）。经加工，石柱统一成科林思建筑的柱头
                        和4 米的标准高度。现在殿内尚存的850根石柱，将正殿分成南北19行，每行各有29个拱门的翼廊，每个拱
                        门又各有上下两层马蹄形的拱券。整座正殿玉柱林立、拱廊纵横。西班牙占领科尔多瓦后, 于1236年改为天
                        主教大教堂，象征着伊斯兰教的殿堂被封闭。

                    </div>
                </div>
                <div class="right">
                    <img src="~assets/public_img/hotel_example.png" alt="">
                </div>
            </div>
            <div class="title" id="level0">
                <div class="short"></div>
                <div class="titles">开放时间</div>
                <div class="large"></div>
            </div>
            <!-- 内容 -->
            <div class="contnet1"></div>
            <div class="title" id="level1">
                <div class="short"></div>
                <div class="titles">门票价格</div>
                <div class="large"></div>
            </div>
            <!-- 内容 -->
            <div class="contnet2"></div>
            <div class="title" id="level2">
                <div class="short"></div>
                <div class="titles">游玩时间</div>
                <div class="large"></div>
            </div>
            <!-- 内容 -->
            <div class="contnet3"></div>
            <div class="title" id="level3">
                <div class="short"></div>
                <div class="titles">到达方式</div>
                <div class="large"></div>
            </div>
            <!-- 内容 -->
            <div class="contnet4"></div>
            <div class="title" id="level4">
                <div class="short"></div>
                <div class="titles">小贴士</div>
                <div class="large special"></div>
            </div>
            <!-- 内容 -->
            <div class="contnet5"></div>
        </div>
    </div>
</template>


<script>
export default {
    data() {
        return {
            currentLevel: '',
            urlData: '',
            list1: [
                {
                    cName: '科尔多瓦大清真寺',
                    eName: 'Historic Centre of Cordoba',
                    address: 'C/Cardenal Herrero, 1, 14003. Córdoba',
                    phone: '+34 957 470 512 ',
                    url: 'http://baidu.com',
                },
            ],
            list2: ['简介', '开放时间', '门票价格', '游玩时间', '到达方式', '小贴士'],
        };
    },
    methods: {
        activeLevel(i) {
            // 锚点激活
            // this.currentLevel = Number(i.replace(/#level/i, ''));
        },
    },
};
</script>

<style lang="less">
.anchor {
    .ivu-anchor-ink {
        height: 0;
    }
    .ivu-anchor {
        display: flex;
    }
    .ivu-anchor-link-title:only-child {
        font-size: 16px;
        color: #222;
        margin: 26px auto 22px 57px;
    }
    .active {
        a {
            color: #ec0286 !important;
            border-bottom: 2px solid #ec0286;
        }
        .ivu-anchor-link-title {
            color: #ec0286 !important;
            border-bottom: 2px solid #ec0286;
        }
    }
}
</style>

<style scoped lang='less'>
.layout {
    width: 1180px;
    max-width: 1920px;
    margin: auto;
    .head {
        width: 100%;
        height: 330px;
        margin: 24px auto 13px;
        background: rgba(255, 255, 255, 1);
        border: 1px solid rgba(237, 237, 237, 1);
        box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.03);
        display: flex;
        .img {
            width: 480px;
            height: 276px;
            margin: 27px 48px 27px 30px;
        }
        .text {
            .same {
                font-size: 14px;
                font-weight: 400;
                color: rgba(119, 119, 119, 1);
                line-height: 30px;
                margin-top: 35px;
                margin-bottom: 82px;
            }
        }
    }
    .middle {
        width: 100%;
        background: rgba(255, 255, 255, 1);
        border: 1px solid rgba(237, 237, 237, 1);
        box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.03);
        margin-bottom: 12px;
        .anchor {
            height: 64px;
        }
        .word {
            display: flex;
            margin: 59px 39px 151px 40px;
            font-size: 14px;
            font-weight: 400;
            color: rgba(17, 17, 17, 1);
            .left {
                margin-right: 42px;
            }
        }
        .title {
            margin: auto 38px auto 40px;
            height: 60px;
            display: flex;
            .short {
                border: 1px dashed #ec0286;
                width: 25px;
                height: 0;
                margin-top: 29px;
            }
            .titles {
                margin: auto 6px;
                font-size: 20px;
                font-weight: 600;
                color: rgba(236, 2, 134, 1);
            }
            .large {
                border: 1px dashed #ec0286;
                width: 980px;
                height: 0;
                margin-top: 29px;
            }
            .special {
                margin-left: 20px;
            }
        }
        .contnet1 {
            margin: 57px auto 114px;
            font-size: 14px;
            font-weight: 400;
            color: rgba(17, 17, 17, 1);
        }
        .contnet2 {
            margin: 62px auto 123px;
            font-size: 14px;
            font-weight: 400;
            color: rgba(17, 17, 17, 1);
        }
        .contnet3 {
            margin: 68px auto 123px;
            font-size: 14px;
            font-weight: 400;
            color: rgba(17, 17, 17, 1);
        }
        .contnet4 {
            margin: 62px auto 103px;
            background: rgba(255, 255, 255, 1);
            border: 1px solid rgba(237, 237, 237, 1);
            box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.03);
            font-size: 14px;
            font-weight: 400;
            color: rgba(17, 17, 17, 1);
        }
        .contnet5 {
            margin: 62px auto 70px;
            font-size: 14px;
            font-weight: 400;
            color: rgba(17, 17, 17, 1);
        }
    }
}
</style>
