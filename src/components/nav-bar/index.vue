<template src="./index.tpl.html"></template>
<script>
import { NavBar } from 'vant';
export default {
    name: 'navBar',
    components: {
        NavBar
    },
    props: {
        bgColor: {
            type: String,
            default: '#ee4844'
        },
        color: {
            type: String,
            default: '#fff'
        },
        showRight: {
            type: Boolean,
            default: true
        },
        rightText: {
            type: String,
            default: '取消'
        }
    },
    data() {
        return {};
    },
    computed: {},
    created() {},
    mounted() {},
    methods: {
        onClickLeft() {
            this.$emit('NavClickLeft');
        },
        onClickRight() {
            this.$emit('NavClickRight');
        }
    }
};
</script>
<style src="./index.less" lang="less" scoped></style>
