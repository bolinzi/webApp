<template src="./index.tpl.html"></template>
<script>
import NavBar from '@components/nav-bar';
import NoData from '@components/no-data';
import {Loading, Overlay } from 'vant';
import {
    Search,
    Col,
    Row,
    Tag,
    Dialog,
    Cell
} from 'vant';
export default {
    name: 'mediaCompareSearch',
    components: {
        NavBar,
        Search,
        Col,
        Row,
        Tag,
        Dialog,
        Cell,
        NoData,
        Overlay,
        Loading
    },
    props: '',
    data() {
        return {
            buildingSvg: require('../../../assets/image/building.svg'),
            addressSvg: require('../../../assets/image/address.svg'),
            searchValue: '',
            // 0:搜索无结果 1: 初次加载 2: 搜索有结果 摩玛新城
            renderState: 0,
            searchList: [],
            adressList: [],
            isLoading: false
        };
    },
    computed: {},
    created() {
        if (this.$store.state.searchValue) {
            this.searchValue = this.$store.state.searchValue;
            this.onSearch();
        }
    },
    mounted() {
        // this.getAdress();
    },
    methods: {
        navClickLeft() {
            let data = '';
            this.$store.commit('SET_SELECT_VALUE', data);
            this.$router.go(-1);
        },
        navClickRight() {
            this.onSearch();
        },
        getAdress() {
            let params = {
                queryCondition: this.searchValue,
                region: this.$store.state.cityInfo.cityName,
                ak: 'YYdw7DAI0Dg0nzZvhqlWnrXQ84Vm0OkG'
            };
            this.$http({
                    method: 'GET',
                    url: this.$api.GET_BAIDU_SEARCH,
                    params: params
                })
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
                    this.adressList = data;
                    if (this.searchList.length || this.adressList.length) {
                        this.renderState = 2;
                    } else {
                        this.renderState = 0;
                    }
                });
        },
        onSearch() {
            if (!this.searchValue) {
                this.$Toast({
                    message: '请输入内容',
                    position: 'bottom',
                });
                return;
            }
            let params = {
                cityId: this.$store.state.cityInfo.cityCode,
                keywords: this.searchValue
            };
            this.isLoading = true;
            this.$http
                .post(this.$api.POST_PREMISES_FINDPROJECTS, params)
                .then(res => {
                    if (+res.code !== 100200) {
                        this.$Notify({
                            type: 'danger',
                            message: 'res.msg',
                            onClose: () => {}
                        });
                        return;
                    }
                    this.searchList = res.data;
                    this.getAdress();
                })
                .finally(() => {
                    this.isLoading = false;
                });
        },
        toPage(item) {
            this.$store.commit('SET_SELECT_VALUE', this.searchValue);
            this.$router.push({
                path: `/media-compare/detail/${item.projectId}/${item.type}`
            });
        },
        toMap(item) {
            let mapStatus = this.$store.state.map;
            mapStatus.center = item.location;
            this.$store.commit('SET_MAP', mapStatus);
            this.$router.push({
                path: '/media-compare/map'
            });
        },
        clearHistory() {
            Dialog.confirm({
                message: '清空历史记录？',
                beforeClose: (action, done) => {
                    if (action === 'confirm') {
                        setTimeout(done, 1000);
                    } else {
                        done();
                    }
                }
            });
        }
    }
};
</script>
<style src="./index.less" lang="less" scoped></style>
