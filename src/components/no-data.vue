<template>
    <div class="no-data">
        <img :src="img" :alt="text">
        <p class="text">{{text}}</p>
    </div>
</template>
<script>
export default {
    name: 'noData',
    components: {},
    props: {
        img: {
            type: String,
            default: require('../assets/image/no-data.svg')
        },
        text: {
            type: String,
            default: '当前数据为空'
        }
    },
    data() {
        return {};
    },
    computed: {},
    created() {},
    mounted() {},
    methods: {}
};
</script>
<style lang="less" scoped>
.no-data {
    text-align: center;
    .text {
        margin: .6rem 0 0;
        font-size: .28rem;
        text-align: center;
        color: #999;
    }
}
</style>
