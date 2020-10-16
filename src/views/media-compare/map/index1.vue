<template src='./index.tpl.html'></template>
<script>
import { Button, Loading, Popup, Overlay, DropdownMenu, DropdownItem, CheckboxGroup, Checkbox } from 'vant';
import NavBar from '@components/nav-bar';
import BMapLib from 'BMap';
import _ from 'lodash';
let map = '';
let circle = '';
let SquareOverlay = '';
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
            // listhide: [],
            // listshow: [],
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
            center: '',
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
        // this.cityRegin();
    },
    methods: {
        /**
         * 初始化地图
         */
        intMap() {
            let Point = '';
            map = new BMapLib.Map(
                'container',
                {
                    enableMapClick: false,
                    minZoom: 10,
                    maxZoom: 18
                });
            map.disableInertialDragging();
            // map.disablePinchToZoom();
            if (this.center) {
                Point = new BMapLib.Point(this.center.lng, this.center.lat);
            } else {
                Point = new BMapLib.Point(this.citySelectInfo.longitude, this.citySelectInfo.latitude);
            }
            map.centerAndZoom(Point, this.zoom);
            this.center = Point;
            // this.getAdress();
            this.startCenter = Point;
        },
        /**
         * 转换城市坐标
         */
        coordinate() {
            this.intMap();
            let zoomCtrl = new BMapLib.ZoomControl({anchor: BMAP_ANCHOR_BOTTOM_RIGHT, offset: new BMapLib.Size(20, 20)});
            map.addControl(zoomCtrl);
            this.setCircle();
            this.resized();
            this.dragend();
            this.zoomend();
            this.getData();
            // if (this.distance) {
            //     this.isClass = 'abc';
            //     this.isCircle = true;
            //     this.setCircle();
            // }
            // if (!this.xcBtnValue && !this.fzBtnValue) {
            //     this.isBtn = '';
            // }
            // this.xcBtns.forEach(item => {
            //     if (item.value === this.xcBtnValue) {
            //         item.isActive = true;
            //     } else {
            //         item.isActive = false;
            //     }
            // });
            // this.fzBtns.forEach(item => {
            //     if (item.value === this.fzBtnValue) {
            //         item.isActive = true;
            //     } else {
            //         item.isActive = false;
            //     }
            // });
        },
        /**
         * 返回app
         */
        // goBack() {
        //     let citySelectInfo = '';
        //     this.$store.commit('SET_CITY_SELECT_INFO', citySelectInfo);
        //     this.$store.commit('SET_CITY_CURRENT', citySelectInfo);
        //     this.$jsBridge.callAndroidIOS('goBack', (data) => {});
        // },
        // /**
        //  * 坐标转地址
        //  */
        // getAdress() {
        //     // let geoc = new BMapLib.Geocoder();
        //     // geoc.getLocation(this.center, (rs) => {
        //     //     let addComp = rs.addressComponents;
        //     //     this.search = addComp.district + addComp.street;
        //     // });
        // },
        // /**
        //  * 获取区域
        //  */
        // cityRegin() {
        //     let params = {
        //         cityCode: this.$store.state.cityInfo.cityCode
        //     };
        //     this.$http
        //         .post(this.$api.POST_COMPETEMEDIA_REGION, params)
        //         .then(res => {
        //             if (+res.code !== 100200) {
        //                 this.$Toast({
        //                     message: 'res.msg',
        //                     position: 'bottom',
        //                 });
        //                 return;
        //             }
        //             let data = res.data.statDetailList;
        //             data.forEach((item) => {
        //                 item.isShow = false;
        //             });
        //             this.regionList = data;
        //             if (this.regionL[0] === 0) {
        //                 this.regionAll.isShow = true;
        //                 this.regionList.forEach(item => {
        //                     item.isShow = false;
        //                 });
        //             } else {
        //                 this.isCheck = 'abc';
        //                 this.regionAll.isShow = false;
        //                 this.regionList.forEach(item => {
        //                     this.regionL.forEach(it => {
        //                         if (it === item.areaCode) {
        //                             item.isShow = true;
        //                         }
        //                     });
        //                 });
        //             }
        //         })
        //         .finally(() => {
        //             // this.isLoading = false;
        //         });
        // }
        // ,
        // toDetail(type) {
        //     this.saveStatus();
        //     if (type === 1) {
        //         this.$router.push({
        //             path: `/media-compare/detail/${this.detailMark.buildingId}/${type}`
        //         });
        //     } else if(type === 2) {
        //         this.$router.push({
        //             path: `/media-compare/detail/${this.detailMark.coincidenceCmBuildingId}/${type}`
        //         });
        //     }
        //     this.closePopup();
        // },
        // closePopup() {
        //     this.isPopup = false;
        // },
        // toCity() {
        //     this.saveStatus();
        //     this.$router.push({
        //         path: '/media-compare/select-city'
        //         // query: { params: JSON.stringify(e.data) }
        //     });
        // },
        // toSearch() {
        //     this.saveStatus();
        //     this.$router.push({
        //         path: '/media-compare/search'
        //     });
        // },
        // /**
        //  * 存状态
        //  */
        // saveStatus() {
        //     let map = {
        //         regionL: this.regionL,
        //         distance: this.distance,
        //         xcBtnValue: this.xcBtnValue,
        //         fzBtnValue: this.fzBtnValue,
        //         center: this.center,
        //         zoom: this.zoom
        //     };
        //     this.$store.commit('SET_MAP', map);
        // },
        // /**
        //  * 多选逻辑
        //  */
        // regionCkeck(data) {
        //     if (data === 0) {
        //         this.checkBack();
        //         return;
        //     }
        //     if (this.regionL[0] === 0) {
        //         this.regionL.shift();
        //     }
        //     this.isADD = this.regionL.some(item => {
        //         return item === data;
        //     });
        //     if (!this.isADD) {
        //         this.regionL.push(data);
        //         this.regionList.forEach(item => {
        //             if (item.areaCode === data) {
        //                 item.isShow = true;
        //                 this.regionAll.isShow = false;
        //             }
        //         });
        //     } else {
        //         this.regionL.forEach((item, index) => {
        //             if (item === data) {
        //                 this.regionL.splice(index, 1);
        //                 this.regionList.forEach(item => {
        //                     if (item.areaCode === data) {
        //                         item.isShow = false;
        //                     }
        //                 });
        //             }
        //         });
        //         if (this.regionL.length === 0) {
        //             this.regionAll.isShow = true;
        //             this.regionL = [0];
        //             this.regionC = [];
        //         }
        //     }
        //     // console.log(this.regionC);
        // },
        // checkOK() {
        //     this.distance = null;
        //     this.isCircle = false;
        //     this.isClass = '';
        //     this.params.radius = '';
        //     if (this.regionL[0] === 0 ) {
        //         this.isCheck = '';
        //         this.params.areaCodes = [];
        //         map.centerAndZoom(this.startCenter, this.zoomNum);
        //         if (this.zoomNum <= 12) {
        //             this.getRegionData();
        //         }
        //         if(this.zoomNum > 12) {
        //             this.getData();
        //             this.setCircle();
        //         }
        //     } else {
        //         this.isCheck = 'abc';
        //         this.params.areaCodes = this.regionL;
        //         this.regionList.forEach(item => {
        //             if (item.areaCode === this.regionL[0]) {
        //                 this.params.lat = item.lat;
        //                 this.params.lng = item.lng;
        //             }
        //         });
        //         let point = new BMapLib.Point(this.params.lng, this.params.lat);
        //         // console.log(point);
        //         this.center = point;
        //         map.centerAndZoom(point, this.zoomNum);
        //         if (this.zoomNum <= 12) {
        //             this.getRegionData();
        //         }
        //         if(this.zoomNum > 12) {
        //             this.getData();
        //             this.setCircle();
        //         }
        //     }
        //     this.$refs.check.toggle();
        // },
        // checkBack() {
        //     this.regionL = [0];
        //     this.regionAll.isShow = true;
        //     this.regionList.forEach(item => {
        //         item.isShow = false;
        //     });
        //     this.isADD = true;
        // },
        // /**
        //  * xc筛选
        //  */
        // xcBtn(data) {
        //     this.xcBtnValue = data;
        //     this.xcBtns.forEach(item => {
        //         if (item.value === data) {
        //             item.isActive = true;
        //         } else {
        //             item.isActive = false;
        //         }
        //     });
        // },
        // /**
        //  * fz筛选
        //  */
        // fzBtn(data) {
        //     this.fzBtnValue = data;
        //     this.fzBtns.forEach(item => {
        //         if (item.value === data) {
        //             item.isActive = true;
        //         } else {
        //             item.isActive = false;
        //         }
        //     });
        // },
        // /**
        //  * 筛选关闭
        //  */
        // btnChange() {
        //     if (!this.xcBtnValue && !this.fzBtnValue) {
        //         this.isBtn = '';
        //     }
        // },
        // /**
        //  * 筛选确认
        //  */
        // confirm() {
        //     this.$refs.item.toggle();
        //     switch (this.xcBtnValue) {
        //         case null:
        //             this.xcBtnName = '全部设备数';
        //             break;
        //         case 1:
        //             this.xcBtnName = '智能屏';
        //             break;
        //         case 2:
        //             this.xcBtnName = 'LCD';
        //             break;
        //         default:
        //             break;
        //     }
        //     switch (this.fzBtnValue) {
        //         case null:
        //             this.fzBtnName = '全部设备数';
        //             break;
        //         case 1:
        //             this.fzBtnName = '智能屏';
        //             break;
        //         case 2:
        //             this.fzBtnName = 'LCD';
        //             break;
        //         default:
        //             break;
        //     }
        //     // xcBtnName
        //     this.params.xcScreenType = this.xcBtnValue;
        //     this.params.cmScreenType = this.fzBtnValue;
        //     if (this.isCircle) {
        //         this.getData();
        //         this.setCircle();
        //     } else {
        //         if (this.zoomNum <= 12) {
        //             this.getRegionData();
        //             console.log(this.zoomNum);
        //         }
        //         if(this.zoomNum > 12) {
        //             this.getData();
        //             this.setCircle();
        //         }
        //     }
        // },
        // reselt() {
        //     this.xcBtn(null);
        //     this.fzBtn(null);
        // },
        // /**
        //  * 距离选择
        //  */
        // distanceChange() {
        //     // let dome = document.getElementsByClassName('van-dropdown-menu__title', 'span');
        //     this.params.radius = this.distance;
        //     switch (this.distance) {
        //         case null:
        //             console.log(this.zoomNum);
        //             map.centerAndZoom(this.startCenter, this.zoomNum);
        //             if (this.zoomNum <= 12) {
        //                 this.getRegionData();
        //             }
        //             if(this.zoomNum > 12) {
        //                 this.getData();
        //                 this.setCircle();
        //             }
        //             this.isCircle = false;
        //             this.isClass = '';
        //             break;
        //         case 1:
        //             this.zoom = 15;
        //             map.setZoom(15);
        //             break;
        //         case 2:
        //             this.zoom = 14;
        //             map.setZoom(14);
        //             break;
        //         case 3:
        //             this.zoom = 13;
        //             map.setZoom(13);
        //             break;
        //         case 5:
        //             this.zoom = 13;
        //             map.setZoom(13);
        //             break;
        //         default:
        //             break;
        //     }
        //     if (this.distance) {
        //         this.getData();
        //         this.isClass = 'abc';
        //         this.isCheck = '';
        //         this.isCircle = true;
        //         this.regionL = [0];
        //         this.regionAll.isShow = true;
        //         this.regionList.forEach(item => {
        //             item.isShow = false;
        //         });
        //         this.setCircle();
        //     }
        // },
        // /**
        //  * 获取区级数据
        //  */
        // getRegionData() {
        //     map.clearOverlays();
        //     this.$http
        //         .post(this.$api.POST_COMPETEMEDIA_REGION, this.params)
        //         .then(res => {
        //             if (+res.code !== 100200) {
        //                 this.$Notify({
        //                     type: 'danger',
        //                     message: 'res.msg',
        //                     onClose: () => {}
        //                 });
        //                 return;
        //             }
        //             this.bottomInfo = {
        //                 cmDeviceNum: res.data.cmDeviceNum,
        //                 cmElevatorNums: res.data.cmElevatorNums,
        //                 cmPremisesNum: res.data.cmPremisesNum,
        //                 xcDeviceNum: res.data.xcDeviceNum,
        //                 xcElevatorNums: res.data.xcElevatorNums,
        //                 xcPremisesNum: res.data.xcPremisesNum
        //             };
        //             this.markRegionData = res.data.statDetailList;
        //             this.markRegionData.forEach(item => {
        //                 // 创建图片
        //                 let pt = new BMapLib.Point(item.lng, item.lat);
        //                 let opts = {
        //                     position: pt, // 指定文本标注所在的地理位置
        //                     offset: new BMapLib.Size(-110, -30) //设置文本偏移量
        //                 };
        //                 let label = new BMapLib.Label(this.setRegionLabel(item), opts); // 创建文本标注对象
        //                 label.setStyle({
        //                     color: '#666',
        //                     backgroundColor: '#fff',
        //                     border: '0',
        //                     width: 'auto',
        //                     fontSize: '12px',
        //                     opacity: '1',
        //                     verticalAlign: 'center',
        //                     borderRadius: '.6rem',
        //                     padding: '3px',
        //                 });
        //                 map.addOverlay(label);
        //                 label.addEventListener('click', () => { //点击label隐藏label
        //                     this.center = pt;
        //                     map.centerAndZoom(pt, 14);

        //                 });
        //             });
        //         })
        //         .finally(() => {
        //             this.isLoading = false;
        //         });
        // },
        // /**
        //  * 设置区级标注样式
        //  */
        // setRegionLabel(item) {
        //     let label = '<div class="region-info">'
        //     + '<div class="region-title">' + item.areaName + '</div>'
        //     + '<div class="region-xc">' + '新潮：' + item.xcDeviceNum + '</div>'
        //     + '<div class="region-fz">' + '分众：' + item.cmDeviceNum + '</div>'
        //     + '<div>';
        //     return label;
        // },
        /**
         * 获取数据
         */
        getData() {
            map.clearOverlays();
            this.markData = [];
            this.isLoading = true;
            this.params.lat = this.center.lat;
            this.params.lng = this.center.lng;
            this.params.radius = this.distance;
            this.params.xcScreenType = this.xcBtnValue;
            this.params.cmScreenType = this.fzBtnValue;
            this.$http
                .post(this.$api.POST_PREMISES_INITIAL, this.params)
                .then(res => {
                    if (+res.code !== 100200) {
                        this.$Notify({
                            type: 'danger',
                            message: 'res.msg',
                            onClose: () => {}
                        });
                        return;
                    }
                    this.bottomInfo = {
                        cmDeviceNum: res.data.cmDeviceNum,
                        cmElevatorNums: res.data.cmElevatorNums,
                        cmPremisesNum: res.data.cmPremisesNum,
                        xcDeviceNum: res.data.xcDeviceNum,
                        xcElevatorNums: res.data.xcElevatorNums,
                        xcPremisesNum: res.data.xcPremisesNum
                    };
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
                if(SouthWest.lng < item.longitude && item.longitude < NorthEast.lng && SouthWest.lat < item.latitude && item.latitude < NorthEast.lat) {
                    listshow.push(item);
                }
            });
            let list = [];
            if (listshow.length < 300) {
                list = listshow;
            } else {
                list = this.getRandomArrayElements(listshow, 300);
            }
            list.forEach(item => {
                let pt = new BMapLib.Point(item.longitude, item.latitude);
                let myIcon = new BMapLib.Icon(
                    img[item.deviceType],
                    new BMapLib.Size(14, 16)
                );
                let marker = new BMapLib.Marker(pt, { icon: myIcon }); // 创建标注
                map.addOverlay(marker);
                marker.addEventListener('click', () => {
                    this.detailMark = item;
                    if (item.releaseDeviceSource === 3) {
                        this.isPopup = true;
                    } else {
                        this.saveStatus();
                        this.$router.push({
                            path: `/media-compare/detail/${item.buildingId}/${item.releaseDeviceSource}`
                        });
                    }
                });
                if (this.zoomNum >= 16) {
                    marker.setLabel(this.setLabelStyle(item));
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
        setLabelStyle(content) {
            console.log(content);
            //左偏移  右偏移
            let offsetSize = new BMapLib.Size(0, 0);
            let labelStyle = {
                color: '#666',
                backgroundColor: '#fff',
                border: '0',
                width: 'auto',
                fontSize: '12px',
                opacity: '0.9',
                verticalAlign: 'center',
                borderRadius: '3px',
                padding: '3px',
            };
            // 用于设置样式
            // let spanA = '<span class="angle"><span>';
            let spanA = '<span><span>';
            let num = 6 * content.buildingName.length - 4;
            offsetSize = new BMapLib.Size(-num, -24);
            let label = new BMapLib.Label(content.buildingName+spanA, {
                offset: offsetSize
            });
            label.setStyle(labelStyle);
            label.addEventListener('click', () => {
                this.detailMark = content;
                if (content.releaseDeviceSource === 3) {
                    this.isPopup = true;
                } else {
                    this.$router.push({
                        path: `/media-compare/detail/${content.buildingId}/${content.releaseDeviceSource}`
                    });
                }
            });
            return label;
        },
        /**
         * 设置地图拖拽
         */
        dragend() {
            map.addEventListener('dragend', () => {
                //获得移动之后地图中心点的像素位置
                let pixel = map.pointToOverlayPixel(map.getCenter());
                //获得定位图标所在位置在地图上的地理位置，实际上定位图标的像素位置就在地图中心像素位置相应的偏移量处
                let Point = map.overlayPixelToPoint({x: pixel.x,y: pixel.y});
                this.center = Point;
                console.log(123);
                this.setCircle();
            });
        },
        /**
         * 缩放时设置按中心点位置缩放
         */
        zoomend() {
            map.addEventListener('zoomend', _.debounce(() => {
                // map.reset();
                this.zoomNum = map.getZoom();
                map.setCenter(this.center);
                map.panTo(this.center, {noAnimation: true});
                this.setCircle();
            }));
        },
        /**
         * 监听地图变化
         */
        resized() {
            map.addEventListener('resize', () => {
                // alert(123);
            });
        },
        /**
         * 自定义画圈
         */
        setCircle() {
            map.clearOverlays();
            let zoomL = map.getZoomUnits(map.getZoom());
            SquareOverlay = (center, length) => {
                this._center = center;
                this._length = length;
            };
            // 继承API的BMap.Overlay
            SquareOverlay.prototype = new BMapLib.Overlay();
            // 实现初始化方法
            SquareOverlay.prototype.initialize = () => {
                // 创建div元素，作为自定义覆盖物的容器
                let div = document.createElement("div");
                div.className = 'circle';
                // 可以根据参数设置元素外观
                div.style.width = this._length / zoomL + "px";
                div.style.height = this._length / zoomL + "px";
                // 将div添加到覆盖物容器中   
                map.getPanes().markerPane.appendChild(div);
                // 保存div实例
                this._div = div;
                // 需要将div元素作为方法的返回值，当调用该覆盖物的show、
                // hide方法，或者对覆盖物进行移除时，API都将操作此元素。
                return div;
            }
            // 实现绘制方法   
            SquareOverlay.prototype.draw = () => {
                // 根据地理坐标转换为像素坐标，并设置给容器
                let position = map.pointToOverlayPixel(this._center);
                this._div.style.left = position.x - (this._length / zoomL) / 2 + "px";
                this._div.style.top = position.y - (this._length / zoomL) / 2 + "px";
            }
            // 实现显示方法    
            SquareOverlay.prototype.show = () => {    
                if (this._div) {    
                    this._div.style.display = "";    
                }    
            }      
            // 实现隐藏方法  
            SquareOverlay.prototype.hide = () => {    
                if (this._div) {    
                    this._div.style.display = "none";    
                }    
            }
            // 添加自定义方法   
            SquareOverlay.prototype.toggle = () => {    
                if (this._div) {    
                    if (this._div.style.display == "") {    
                        this.hide();    
                    }    
                    else {    
                        this.show();    
                    }    
                }    
            }
            // 添加自定义覆盖物
            let mySquare = new SquareOverlay(map.getCenter(), 5000);
            map.addOverlay(mySquare);
        },
        /**
         * 返回中心点
         */
        centerBack() {
            map.setCenter(this.startCenter);
            // if (this.distance) {
            //     this.center = this.startCenter;
            //     this.getData();
            //     this.setCircle();
            // }
        },
        // /**
        //  * 关闭提示信息
        //  */
        // closeTips() {
        //     this.isTips = false;
        // }
    }
};
</script>
<style src='./index.less' lang='less' scoped></style>
