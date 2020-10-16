<template>
    <div id="app">
        <router-view/>
    </div>
</template>
<script>
import fontSize from '@libs/fontSize';
fontSize(document, window);
export default {
    data() {
        const { meta } = this.$route;
        return {
            meta
        };
    },
    created() {},
    methods: {}
};
</script>
<style src="./app.less" lang="less"></style>
