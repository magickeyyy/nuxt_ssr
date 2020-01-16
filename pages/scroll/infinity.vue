<!--
 * @Author: magckeyyy
 * @Date: 2020-01-16 10:48:05
 * @Description: 
 * @Attention: 
 -->
<template>
    <div class="better_container">
        <div class="scroll_containe">
            <div v-for="(v,i) in list" :key="i">
                <p>v.text</p>
                <img :src="v.url" alt="">
            </div>
        </div>
    </div>
</template>

<script>
    import BScroll from 'better-scroll'
    export default {
        layout() {
            return 'scroll'
        },
        data() {
            return {
                list: []
            };
        },
        mounted() {
            this.initScroll();
        },
        methods: {
            initScroll() {
                let list = this.list;
                let container = document.querySelector('.better_container');
                let scroll = new BScroll(container, {
                    infinity: {
                        fetch(count) {
                            // 获取大于 count 数量的数据，该函数是异步的，它需要返回一个 Promise。
                            // 成功获取数据后，你需要 resolve 数据数组（也可以 resolve 一个 Promise）。
                            // 数组的每一个元素是列表数据，在 render 方法执行的时候会传递这个数据渲染。
                            // 如果没有数据的时候，你可以 resolve(false)，来告诉无限滚动列表已经没有更多数据了。
                            const num = (count+1) > 500? count+1: 500;
                            const url = 'http://a4.att.hudong.com/03/25/20300001045622130690259454464.jpg';
                            const text = count + '很多内容';
                            let arr = [];
                            for(let i = 0; i < num; i++) {
                                arr.push({ url, text });
                            }
                            list.concat(arr)
                            return Promise.resolve(arr);
                        },
                        render(item, parent) {
                            // 渲染每一个元素节点，item 是数据，div 是包裹元素节点的容器。
                            // 该函数需要返回渲染后的 DOM 节点。
                            let fragment = document.createDocumentFragment();
                            for(let i = 0; i < item.length; i++){
                                let div = document.createElement('div');
                                div.innerText = item.text + i + ' : ' + ~~(Math.random() * total);
                                if(i % 500 === 0) {
                                    div.className = 'ssss'
                                }
                                let img = document.createElement('img');
                                img.src = item.url;
                                div.appendChild(img)
                                fragment.appendChild(div)
                            }
                            parent.appendChild(fragment);
                            return parent;
                        },
                        createTombstone() {
                            // 返回一个墓碑 DOM 节点。
                            let div = document.createElement('div');
                            div.innerText = '墓碑';
                            return div;
                        }
                    }
                })
            },
            createDom() {
                const url = 'http://a4.att.hudong.com/03/25/20300001045622130690259454464.jpg';
                const num = 100;
                let arr = [];
                for(let i = 0; i < num; i++) {
                    arr.push(`<div><p>${num}这么多图片</p><img src="${url}" alt="图片"/></div>`)
                }
                return arr;
            }
        }
    };
</script>

<style scoped lang="less">
.better_container{
    height: 100vh;
    overflow: hidden;
}
.scroll_containe{
    height: 900px;
}
</style>
