<template src="./index.tpl.html"></template>
<script>
    import { Swipe, SwipeItem } from 'vant';
    import NavBar from '@components/nav-bar';
    import NoData from '@components/no-data';
    import videojs from 'video.js';
    import 'video.js/dist/video-js.min.css';
    /**
     * 页面需要接收的参数
     * projectId：必须，
     * type: 必须，{xc = 新潮, fz = 分众}
     * formMiniPrograms：传递代表从小程序过来的，自行添加底部安全区域
     */
    const getQueryString = name => {
        let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        let r = window.location.search.substr(1).match(reg);
        if (r !== null) {
            return unescape(r[2]);
        }
        return null;
    };

    // const platform = {
    //     isiOS: function() {
    //         let u = navigator.userAgent;
    //         let iOs = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); // ios终端
    //         return iOs;
    //     },
    //     isAndroid: function() {
    //         let u = navigator.userAgent;
    //         let android = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; // android终端
    //         return android;
    //     }
    // };

    // const setupWebViewJavascriptBridge = callback => {
    //     if (window.WebViewJavascriptBridge) {
    //         return callback(window.WebViewJavascriptBridge);
    //     }
    //     if (window.WVJBCallbacks) {
    //         return window.WVJBCallbacks.push(callback);
    //     }
    //     window.WVJBCallbacks = [callback];
    //     let WVJBIframe = document.createElement('iframe');
    //     WVJBIframe.style.display = 'none';
    //     WVJBIframe.src = 'https://__bridge_loaded__';
    //     document.documentElement.appendChild(WVJBIframe);
    //     setTimeout(function() {
    //         document.documentElement.removeChild(WVJBIframe);
    //     }, 0);
    // };
    export default {
        components: {
            Swipe,
            SwipeItem,
            NavBar,
            NoData
        },
        data() {
            return {
                color: ['rgb(255,182,51)', 'rgb(65,208,153)', 'rgb(0,153,255)'],
                formMiniPrograms: !!getQueryString('formMiniPrograms'),
                pageType: '', // 是新潮还是分众，xc || fz
                r: null, // 页面整体数据，为了绑定的时候简单点，就简写成r, 应看作 result
                launchRankList: [],
                caseList: [],
                launchAndcaseParams: {
                    pageNum: 1,
                    pageSize: 3,
                    pageSizeZero: false,
                    projectId: this.$route.params.id,
                    tradeCode: ''
                },
                tradeActiveIdx: 0,
                caseCategoryVisble: false, // 控制案例分类选择弹窗
                videoPlayVisble: false, // 控制视频弹窗
                noMoreCase: false, // 是否还有更多案例
                caseLoading: false, // 案例加载状态
                tabOffsetLeftArr: [],
                toastVisble: false, // toast显示与否
                message: '', // toast显示的信息
                toastTimer: null, // toast自动消失的计时器
                video: {},
                tolletPrevTime: 0, // 上一次点击的时间
                clickCount: 0,
                player: null,
                fixedCaseData: false, // 控制案例是否浮动定位
                noData: false, // 是否没数据
            };
        },
        watch: {
            toastVisble: function(nval) {
                if (nval) {
                    this.toastTimer = setTimeout(() => {
                        this.toastVisble = false;
                    }, 3000);
                }
            }
        },
        mounted() {
            if (this.$route.params.type === '1') {
                this.pageType = 'xc';
                this.getResult();
            } else if (this.$route.params.type === '2') {
                this.pageType = 'fz';
                this.getFZResult();
            }
        },
        computed: {
            getModalHeight() {
                return `${(Math.ceil(this.launchRankList.length / 3) * 47 + 49)
                    / 50}rem`;
            }
        },
        methods: {
            navClickLeft() {
                if (this.videoPlayVisble) {
                    this.closeVideo();
                } else {
                    this.$router.back();
                }
            },
            choseTradeCode(item, i) {
                this.clickCount++;
                let handle = () => {
                    this.tradeActiveIdx = i;
                    this.launchAndcaseParams.pageNum = 1;
                    this.launchAndcaseParams.pageSize = 3;
                    this.launchAndcaseParams.tradeCode = item.tradeCode;
                    this.noMoreCase = false;
                    // this.caseList = [] 自行判断是否需要在加载时置空上一次的数据
                    this.getTopLaunchAndCase();
                    this.caseCategoryVisble = false; // 关闭弹窗
                    // 滚动tabbar
                    let tcsl = window.$('.tab-container').scrollLeft();
                    let speed = Math.floor(
                        Math.abs(tcsl - this.tabOffsetLeftArr[i]) / 10
                    );
                    let time = null;
                    if (tcsl > this.tabOffsetLeftArr[i]) {
                        time = setInterval(() => {
                            tcsl -= speed;
                            if (tcsl <= this.tabOffsetLeftArr[i]) {
                                tcsl = this.tabOffsetLeftArr[i];
                            }
                            window.$('.tab-container').scrollLeft(tcsl);
                            if (tcsl <= this.tabOffsetLeftArr[i]) {
                                clearInterval(time);
                            }
                        }, 10);
                    } else {
                        time = setInterval(() => {
                            tcsl += speed;
                            if (tcsl >= this.tabOffsetLeftArr[i]) {
                                tcsl = this.tabOffsetLeftArr[i];
                            }
                            window.$('.tab-container').scrollLeft(tcsl);
                            if (tcsl >= this.tabOffsetLeftArr[i]) {
                                clearInterval(time);
                            }
                        }, 10);
                    }
                };
                if (this.tradeActiveIdx === i) {
                    let now = new Date().getTime();
                    if (now - this.tolletPrevTime > 2000) {
                        this.tolletPrevTime = now;
                        handle();
                    }
                } else {
                    handle();
                }
            },
            handleCase(item) {
                if (item.viewUrl) {
                    this.videoPlayVisble = true;
                    this.video = item;
                    this.$nextTick(() => {
                      this.player = videojs('videoJS', {
                        preload: 'auto',
                        autoplay: true,
                        controls: true,
                        controlBar: {
                          children: [
                            {name: 'playToggle'}, // 播放/暂停按钮
                            {name: 'currentTimeDisplay'}, // 视频当前已播放时间
                            {name: 'progressControl'}, // 播放进度条
                            {name: 'durationDisplay'}, // 视频播放总时间
                          ]
                        }
                      });
                      this.player.on('ready', function() {
                        // console.log('ready')
                        this.play();
                        // this.addClass('my-example');
                      });
                    });
                } else {
                    this.message = '暂无视频';
                    this.toastVisble = true;
                }
            },
            // 关闭弹窗时销毁videojs的安装
            closeVideo() {
                this.videoPlayVisble = false;
                this.video = {};
                this.player.dispose();
            },
            // 获取新潮的轮播图到车产的数据
            getResult() {
                this.$http({
                    method: 'GET',
                    url: `${this.$api.GET_XC_DETAIL}?projectId=${this.$route.params.id}`
                }).then(res => {
                    this.r = res.data;
                    this.launchRankList = res.data.launchRankList;
                    // 如果有分类，获取第一个分类的案例
                    if (this.launchRankList.length) {
                        this.launchAndcaseParams.tradeCode
                            = res.data.launchRankList[0].tradeCode;
                        this.getTopLaunchAndCase();
                    }
                    this.drawCharts();
                    this.$nextTick(() => {
                        const caseData = this.$refs.caseData;
                        const header = this.$refs.header.$el;
                        if (caseData) {
                            this.openListener(
                                caseData.getBoundingClientRect().top - header.getBoundingClientRect().height,
                                () => {
                                    this.fixedCaseData = true;
                                },
                                () => {
                                    this.fixedCaseData = false;
                                }
                            );
                        }
                    });
                }).catch(err => {
                    // if (err.status === 404) {
                    //     this.noData = true;
                    // }
                });
            },
            openListener(distance, active, blur) {
                document.querySelector('.container').addEventListener('scroll', e => {
                    let windowScrollTop
                        = this.$refs.container.scrollTop;
                        // || document.body.scrollTop;
                    console.log(distance, windowScrollTop);
                    if (distance <= windowScrollTop ) {
                        active && active();
                    } else {
                        blur && blur();
                    }
                });
            },
            // 获取分众的轮播图到车产的数据
            getFZResult() {
                this.$http({
                    method: 'GET',
                    url: `${this.$api.GET_FZ_DETAIL}?projectId=${this.$route.params.id}`
                }).then(res => {
                    this.r = res.data;
                });
            },
            // 获取 案例和top投放数据
            getTopLaunchAndCase() {
                this.caseLoading = true;
                this.$http({
                    method: 'post',
                    url: `${this.$api.GET_CASE_LIST}?projectId=${this.$route.params.id}`,
                    data: this.launchAndcaseParams
                })
                    .then(res => {
                        this.caseLoading = false;
                        let data = res.data;
                        // 设置投放分类
                        if (this.launchRankList.length) {
                            this.$nextTick(() => {
                                // 计算出每个tab距离左边的滚动距离，方便弹窗点击时，跳转到这个距离
                                let ol = [];
                                let firstOl = window.$(
                                    window.$('.tab-slide')[0]
                                )[0].offsetLeft;
                                for (
                                    let i = 0;
                                    i < window.$('.tab-slide').length;
                                    i++
                                ) {
                                    ol.push(
                                        window.$(window.$('.tab-slide')[i])[0]
                                            .offsetLeft - firstOl
                                    );
                                }
                                this.tabOffsetLeftArr = ol;
                            });
                        }
                        // 设置案例
                        /**
                         * 1. 判断是重置，还是追加数据
                         * 2. 如果是追加数据
                         * 2.1 判断有没有数据需要追加，有追加，没有就设置为加载完了状态
                         */
                        let _caseList = data.pageEntity.data;
                        if (this.launchAndcaseParams.pageNum === 1) {
                            this.caseList = _caseList;
                        } else if (_caseList && _caseList.length) {
                            this.caseList = this.caseList.concat(_caseList);
                        } else {
                            this.noMoreCase = true;
                            this.launchAndcaseParams.pageNum--;
                        }
                        this.launchAndcaseParams.pageSize = 9;
                        this.launchAndcaseParams.pageNum++;
                    })
                    .catch(() => {
                        this.caseLoading = false;
                    });
            },
            // 从所有数据中计算出渲染界面需要的数据
            computedData(dataName) {
                if (
                    this.r
                    && this.r.premisesKyun
                    && this.r.premisesKyun[dataName]
                ) {
                    let data = JSON.parse(this.r.premisesKyun[dataName]);
                    return data.premisesTagDetailDtoList;
                }
                return [];
            },
            drawCharts() {
                const radius = ['70%', '100%'];
                const labelLine = {
                    show: false
                };
                const itemStyle = {
                    borderWidth: 1,
                    borderColor: '#fff'
                };
                this.$nextTick(() => {
                    if (this.computedData('education').length) {
                        // 设置教育分布图表
                        let eduChart = window.echarts.init(
                            document.getElementById('eduChart')
                        );
                        let eduOption = {
                            color: this.color,
                            series: [
                                {
                                    type: 'pie',
                                    radius: radius,
                                    labelLine: labelLine,
                                    itemStyle: itemStyle,
                                    animation: false,
                                    data: this.computedData('education').map(item =>
                                        (item.val * 100).toFixed(2)
                                    )
                                }
                            ]
                        };
                        eduChart.setOption(eduOption);
                    }
                    if (this.computedData('consumption').length) {
                        // 设置消费能力图表
                        let conChart = window.echarts.init(
                            document.getElementById('consumptionChart')
                        );
                        let conOption = {
                            color: this.color,
                            series: [
                                {
                                    type: 'pie',
                                    radius: radius,
                                    labelLine: labelLine,
                                    itemStyle: itemStyle,
                                    animation: false,
                                    data: this.computedData(
                                        'consumption'
                                    ).map(item => (item.val * 100).toFixed(2))
                                }
                            ]
                        };
                        conChart.setOption(conOption);
                    }
                });
            }
        }
    };
</script>
<style src="./index.less" lang="less" scoped></style>
