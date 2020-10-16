<template src="./index.tpl.html"></template>
<script>
import NavBar from '@components/nav-bar';
import { IndexBar, Overlay, Loading, IndexAnchor, Cell } from 'vant';
export default {
    name: 'mediaCompareSelectCity',
    components: {
        NavBar,
        IndexBar,
        IndexAnchor,
        Cell,
        Overlay,
        Loading
    },
    props: '',
    data() {
        return {
            cityData: {},
            total: '',
            indexList: [],
            cityCurrent: {},
            isLoading: false
        };
    },
    computed: {},
    created() {},
    mounted() {
        if (this.$store.state.cityCurrent) {
            this.cityCurrent = this.$store.state.cityCurrent;
        } else {
            this.$jsBridge.callAndroidIOS('getCity', (data) => {
                this.cityCurrent = JSON.parse(data);
                this.$store.commit('SET_CITY_CURRENT', this.cityCurrent);
            });
        }
        this.cityList();
    },
    methods: {
        cityList() {
            this.isLoading = true;
            let params = {
                cityName: ''
            };
            let cityData = {};
            this.indexList = [];
            this.$http
                .post(this.$api.POST_COMPETEMEDIA_LIST, params)
                .then(res => {
                    if (+res.code !== 100200) {
                        this.$Notify({
                            type: 'danger',
                            message: 'res.msg',
                            onClose: () => {}
                        });
                        return;
                    }
                    let data = res.data;
                    this.total = res.data.length;
                    data.forEach((item) => {
                        let flag = this.indexList.some(value=>{
                            return item.spelling === value;
                        });
                        if (!flag) {
                            this.indexList.push(item.spelling);
                        }
                        if (!cityData[item.spelling]) {
                            cityData[item.spelling] = [];
                        }
                        cityData[item.spelling].push(item);
                    });
                    this.cityData = cityData;
                })
                .finally(() => {
                    this.isLoading = false;
                });
        },
        navClickLeft() {
            this.$router.go(-1);
        },
        navClickRight() {
            console.log('navClickRight');
        },
        selectCity(data) {
            let citySelectInfo = data;
            this.$store.commit('SET_CITY_SELECT_INFO', citySelectInfo);
            this.$router.push({
                path: '/media-compare/index'
            });
        }
    }
};
</script>
<style src="./index.less" lang="less" scoped></style>
