<template src="./index.tpl.html"></template>
<script>
import { Button, Loading } from 'vant';
import SVGA from 'svgaplayerweb';
export default {
    name: 'mediaCompareIndex',
    components: {
        Button,
        Loading
    },
    props: '',
    data() {
        return {
            svgaImg: 'https://blmpcrm.obs.cn-east-2.myhuaweicloud.com/startup.svga',
            scale: false,
            isScreen: false,
            isBtn: false,
            dataInfo: {},
            citySelectInfo: '',
            cityCurrent: '',
            data: '',
            cityName: ''
        };
    },
    filters: {
        mumFormatOfComma: value => {
            if(!value) {
               return 0;
            }
            // 获取整数部分
            let intPart = Number(value) - Number(value) % 1;
            // 将整数部分逢三一断
            return intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
        },
         mumFormatOfTenThousand: value => {
            if(value < 10000) {
               return value;
            }
            let intPart = Number(value) - Number(value) % 1;
            // 将整数部分逢三一断
            return (intPart / 10000).toFixed(2) + '万';
        }
    },
    computed: {},
    created() {
        if (this.$store.state.citySelectInfo) {
            this.citySelectInfo = this.$store.state.citySelectInfo;
            this.getData();
        } else {
            this.citySelectInfo = {
                cityCode: 110100,
                cityName: '北京市',
                latitude: '39.915175',
                longitude: '116.403901'
            };
            this.$jsBridge.callAndroidIOS('getCity', (data) => {
                let current = data;
                this.cityCurrent = JSON.parse(current);
                this.citySelectInfo = JSON.parse(data);
                this.getData();
            });
        }
        // if (this.$store.state.cityCurrent) {  正式使用
        //     this.citySelectInfo = this.$store.state.citySelectInfo;
        //     this.getData();
        // } else {
        //     // this.citySelectInfo = {
        //     //     cityCode: 110100,
        //     //     cityName: '北京市',
        //     //     latitude: '39.915175',
        //     //     longitude: '116.403901'
        //     // };
        //     this.$jsBridge.callAndroidIOS('getCity', (data) => {
        //         let current = data;
        //         this.cityCurrent = JSON.parse(current);
        //         this.citySelectInfo = JSON.parse(data);
        //         this.getData();
        //     });
        // }
    },
    mounted() {
        // this.setFill();
        this.svga();
        setTimeout(() => {
            this.isScreen = true;
        }, 2000);
        setTimeout(() => {
            this.isBtn = true;
        }, 4000);
    },
    methods: {
        getData() {
            this.$http({
                method: 'GET',
                url: this.$api.GET_PREMISES_OVERVIEW,
                params: {
                    cityName: this.citySelectInfo.cityName
                }
            }).then(res => {
                if (+res.code !== 100200) {
                    this.$Notify({
                        type: 'danger',
                        message: 'res.msg',
                        onClose: () => {
                            // let citySelectInfo = '';
                            // this.$store.commit('SET_CITY_SELECT_INFO', citySelectInfo);
                            // this.$store.commit('SET_CITY_CURRENT', citySelectInfo);
                            // this.$jsBridge.callAndroidIOS('goBack', (data) => {});
                        }
                    });
                    return;
                }
                this.cityName = res.data.cityName.substr(0, res.data.cityName.length - 1);
                this.dataInfo = res.data;
                let cityInfo = {
                    cityCode: res.data.cityCode,
                    cityName: res.data.cityName
                };
                this.$store.commit('SET_CITY_INFO', cityInfo);
            })
            .catch(() => {
                // let citySelectInfo = '';
                // this.$store.commit('SET_CITY_SELECT_INFO', citySelectInfo);
                // this.$store.commit('SET_CITY_CURRENT', citySelectInfo);
                // this.$jsBridge.callAndroidIOS('goBack', (data) => {
                // });
            });
        },
        info() {
            let map = '';
            this.$store.commit('SET_MAP', map);
            this.$store.commit('SET_CITY_CURRENT', this.cityCurrent);
            this.$store.commit('SET_CITY_SELECT_INFO', this.citySelectInfo);
            this.$router.push({
                path: '/media-compare/map'
            });
        },
        svga() {
            let me = this;
            let player = new SVGA.Player('#startup');
            let parser = new SVGA.Parser('#startup');
            parser.load(this.svgaImg, videoItem => {
                    player.loops = 1;
                    // 动画结束都是否清楚内容，注意，这里如果不设置 默认true
                    player.clearsAfterStop = false;
                    player.setVideoItem(videoItem);
                    player.startAnimation();
                    me.scale = true;
                }
            );
        },
        // 适配不同屏
        setFill() {
            let canvas = document.getElementById('startup');
            let w = window.innerWidth;
            let h = window.innerHeight;
            let screenProportion = h / w;
            let svgaProportion = 16 / 9;
            if (screenProportion > svgaProportion) {
                // 长屏幕
                canvas.style.width = h / svgaProportion + 'px';
                canvas.style.left = (w - h / svgaProportion) / 2 + 'px';
            } else {
                canvas.style.height = w * svgaProportion + 'px';
                canvas.style.top = (h - w * svgaProportion) / 2 + 'px';
            }
        }
    }
};
</script>
<style src="./index.less" lang="less" scoped></style>
