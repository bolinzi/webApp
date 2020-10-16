<template src='./index.tpl.html'></template>
<script>
import { Button, Loading, Popup, Overlay, DropdownMenu, DropdownItem, CheckboxGroup, Checkbox } from 'vant';
import NavBar from '@components/nav-bar';
import AMap from "AMap";
import _ from 'lodash';
let map = '';
let circle = '';
let SquareOverlay = '';
let massMarks = '';
export default {
    name: 'mediaCompareMap',
    components: {
        Button,
        DropdownMenu,
        DropdownItem,
        CheckboxGroup,
        Checkbox,
        NavBar,
        Popup,
        Overlay,
        Loading
    },
    props: '',
    data() {
        return {
            markData: [],
            // 记录筛选颜色
            isClass: '',
            isCheck: '',
            isBtn: 'abc',
            // 城市信息（城市页面选择）
            citySelectInfo: this.$store.state.citySelectInfo,
            // 记录地图选择状态
            mapStatus: this.$store.state.map,
            isLoading: false,
            // 中心点对应地址
            search: '',
            // 详情页点击点信息
            detailMark: {},
            isPopup: false,
            // 底部信息框
            bottomInfo: {},
            // 判断多选逻辑参数
            isADD: false,
            // 多选区域code
            regionL: [0],
            regionAll: {
                name: '不限',
                value: 0,
                isShow: true
            },
            // 区域列表
            regionList: [],
            // 地图请求参数
            params: {
                areaCodes: [],
                buildingType: 1,
                cityCode: this.$store.state.cityInfo.cityCode,
                cmScreenType: 1,
                lat: '',
                lng: '',
                radius: 3,
                xcScreenType: 1
            },
            value: 0,
            distance: 3,
            distanceOption: [
                { text: '全城', value: null },
                { text: '1公里', value: 1 },
                { text: '2公里', value: 2 },
                { text: '3公里', value: 3 },
                { text: '5公里', value: 5 },
            ],
            xcBtnValue: 1,
            fzBtnValue: 1,
            xcBtnName: '全部设备数',
            fzBtnName: '全部设备数',
            xcBtns: [
                {
                    icon: require('../../../assets/image/xc0.svg'),
                    text: '全部',
                    value: null,
                    isActive: false
                },
                {
                    icon: require('../../../assets/image/xc1.svg'),
                    text: '智能屏',
                    value: 1,
                    isActive: true
                },
                {
                    icon: require('../../../assets/image/xc2.svg'),
                    text: 'LCD',
                    value: 2,
                    isActive: false
                }
            ],
            fzBtns: [
                {
                    icon: require('../../../assets/image/fz0.svg'),
                    text: '全部',
                    value: null,
                    isActive: false
                },
                {
                    icon: require('../../../assets/image/fz1.svg'),
                    text: '智能屏',
                    value: 1,
                    isActive: true
                },
                {
                    icon: require('../../../assets/image/fz2.svg'),
                    text: 'LCD',
                    value: 2,
                    isActive: false
                }
            ],
            zoom: 13,
            zoomNum: 13,
            center: [104.07234, 30.663535],
            startCenter: '',
            point: '',
            city: this.$store.state.cityInfo,
            region: '', // 设置区
            isTips: true,
            isCircle: false,
            markRegionData: []
        };
    },
    computed: {},
    created() {},
    mounted() {
        if (this.mapStatus) {
            this.regionL = this.mapStatus.regionL;
            this.distance = this.mapStatus.distance;
            this.xcBtnValue = this.mapStatus.xcBtnValue;
            this.fzBtnValue = this.mapStatus.fzBtnValue;
            this.center = this.mapStatus.center;
            this.zoom = this.mapStatus.zoom;
        }
        this.coordinate();
        const order = [20.17, 18.67, 1.50, "cheese", "eggs", "milk", "bread"];
        const [total, subtotal, tax, ...items] = order;
        console.log(total, subtotal, tax, items);
    },
    methods: {
        /**
         * 初始化地图
         */
        intMap() {
            map = new AMap.Map("container", {
                center: this.center,
                zoom: this.zoom,
                animateEnable: false
            });
        },
        /**
         * 转换城市坐标
         */
        coordinate() {
            this.intMap();
            this.getAdress();
            this.getData();
            this.setCircle();
            this.dragend();
            this.zoomed();
        },
        /**
         * 坐标转地址
         */
        getAdress() {},
        /**
         * 获取点位数据list
         */
        getData() {
            map.clearMap();
            this.markData = [];
            let params = {
                areaCodes: [],
                buildingType: 1,
                cityCode: '510100',
                cmScreenType: 1,
                lat: this.center[1],
                lng: this.center[0],
                radius: 3,
                xcScreenType: 1
            };
            this.isLoading = true;
            this.$http
                .post(this.$api.POST_PREMISES_INITIAL, params)
                .then(res => {
                    if (+res.code !== 100200) {
                        this.$Notify({
                            type: 'danger',
                            message: 'res.msg',
                            onClose: () => {}
                        });
                        return;
                    }
                    this.markData = res.data.buildingInfos;
                    this.getBounds(this.markData);
                })
                .finally(() => {
                    this.isLoading = false;
                });
        },
        // 获取可视区域
        getBounds(markData) {
            let listshow = [];
            let bounds = map.getBounds(); // 获取可视区域
            let SouthWest = bounds.getSouthWest(); // 可视区域左下角
            let NorthEast = bounds.getNorthEast(); // 可视区域右上角
            let img = [
                require('../../../assets/image/xc0.svg'),
                require('../../../assets/image/xc1.svg'),
                require('../../../assets/image/xc2.svg'),
                require('../../../assets/image/fz0.svg'),
                require('../../../assets/image/fz1.svg'),
                require('../../../assets/image/fz2.svg'),
                require('../../../assets/image/tips.svg')
            ];
            markData.forEach(item => {
                if(
                    SouthWest.lng < item.longitude
                    && item.longitude < NorthEast.lng
                    && SouthWest.lat < item.latitude
                    && item.latitude < NorthEast.lat
                ) {
                    listshow.push(item);
                }
            });
            let list = [];
            list = listshow.length < 300?listshow:this.getRandomArrayElements(listshow, 300);
            list.forEach(item => {
                let marker = new AMap.Marker({
                    position: new AMap.LngLat(item.longitude, item.latitude),
                    offset: new AMap.Pixel(-5, -10),
                    icon: img[item.deviceType]
                });
                AMap.event.addListener(marker, "click", () => {
                  console.log(item);
                });
                map.add(marker);
                if (this.zoomNum >= 16) {
                    let num = item.buildingName.length - 4;
                    // marker.setLabel(this.setLabelStyle(item));
                     marker.setLabel({
                        direction:'top',
                        offset: new AMap.Pixel(-num, -5),  //设置文本标注偏移量
                        content: item.buildingName //设置文本标注内容
                    });
                }
            });
        },
        /**
         * 数据稀释
         */
        getRandomArrayElements(arr, count) {
            let shuffled = arr.slice(0);
            let i = arr.length;
            let min = i - count;
            let temp;
            let index;
            while (i-- > min) {
                index = Math.floor((i + 1) * Math.random());
                temp = shuffled[index];
                shuffled[index] = shuffled[i];
                shuffled[i] = temp;
            }
            return shuffled.slice(min);
        },
        /**
         * 移动
         */
        dragend() {
            AMap.event.addListener(map, 'dragend', _.debounce(() => {
                let zoom = map.getZoom(); //获取当前地图级别
                let center = map.getCenter(); //获取当前地图中心位置
                this.center = [center.lng, center.lat];
                if (circle) {
                    map.remove(circle);
                    circle = '';
                }
                this.getData();
                this.setCircle();
                // map.setFitView(); // 自动缩放地图到合适的视野级别
            }));
        },
        /**
         * 缩放
         */
        zoomed() {
            AMap.event.addListener(map, 'zoomend', _.debounce(() => {
                this.zoomNum = map.getZoom();
                map.setCenter(new AMap.LngLat(this.center[0], this.center[1]));
                if (circle) {
                    map.remove(circle);
                    circle = '';
                }
                this.getData();
                this.setCircle();
            }));
        },
        /**
         * 画圈
         */
        setCircle() {
            circle = new AMap.Circle({
                center: new AMap.LngLat(this.center[0], this.center[1]), // 圆心位置
                radius: 3000,  //半径
                strokeColor: "#F33",  //线颜色
                strokeOpacity: 0.5,  //线透明度
                strokeWeight: 3,  //线粗细度
                fillColor: "#ee2200",  //填充颜色
                fillOpacity: 0.1 //填充透明度
            });
            map.add(circle);
        },
        /**
         * 返回中心点
         */
        centerBack() {
            // map.setCenter(this.startCenter);
        }
    },
    beforeDestroy() {
        if (map) {
            map.destroy();
        }
    }
};
</script>
<style src='./index.less' lang='less' scoped></style>
