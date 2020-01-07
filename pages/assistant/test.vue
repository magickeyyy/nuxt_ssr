<template>
    <Scroll :on-reach-top="handleReachTop">
        <Card dis-hover v-for="(item, index) in list" :key="index" style="margin: 32px 0">
            Content {{ item }}
        </Card>
    </Scroll>
</template>

<script>
import routes from '~/assets/mock/routeList';
export default {
    asyncData() {
        const length = 1000;
        const text = '是的冯绍峰第三方';
        const img = "https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2492876497,1625400592&fm=26&gp=0.jpg";
        let list = [];
        for(let i = 0; i< length; i++) {
            list.push({img,text});
        }
        return {
            list
        }
    },
    created() {},
    mounted() {
        this.setRootFontSize();
    },
    methods: {
        setRootFontSize() {
            let htmlFontSize = (document.documentElement.clientWidth / 375) * 100 + 'px';
            document.documentElement.style.fontSize = htmlFontSize;
        },
        handleReachTop () {
            return new Promise(resolve => {
                setTimeout(() => {
                    const first = this.list[0];
                    for (let i = 1; i < 1000; i++) {
                        this.list.unshift(first - i);
                    }
                    resolve();
                }, 500);
            });
        }
    },
};
</script>

<style scoped lang="less">

</style>