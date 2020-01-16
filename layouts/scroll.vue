
<template>
    <nuxt class="scroll"></nuxt>
</template>
<script>
    export default {
        data() {
            return {

            };
        },
        mounted() {
            this.setRootSize();
        },
        methods: {
            setRootSize() {
                document.documentElement.style.fontSize = document.documentElement.clientWidth / 375 * 100 + 'px!important';
                document.body.style.fontSize = '16px';
            }
        }
    };
</script>
