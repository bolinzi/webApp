/**
 * @file:      api 公共模块
 * @author:    柏林(735815255@qq.com)
 * @version:   V1.0.0
 * @date:      2020/8/27 下午3:15:49
 */
'use strict';
let CONTEXT_PATH = `${process.env.VUE_APP_CONTEXT_PATH}`;

export default {
    // 启动页数据
    GET_PREMISES_OVERVIEW: CONTEXT_PATH + '/media/premises/overview',
    // 地图初始化首页
    POST_PREMISES_INITIAL: CONTEXT_PATH + '/media/premises/initial',
    // 通过楼盘名称或地址查询楼盘信息
    POST_PREMISES_FINDPROJECTS: CONTEXT_PATH + '/premises/findProjects',
    // 新潮详情
    GET_XC_DETAIL: CONTEXT_PATH + '/wlh/premises/xc',
    // 分众详情
    GET_FZ_DETAIL: CONTEXT_PATH + '/wlh/premises/cm',
    // 获取案例
    GET_CASE_LIST: CONTEXT_PATH + '/premises/xc/launch',
    // 获取城市信息
    POST_COMPETEMEDIA_LIST: CONTEXT_PATH + '/competeMedia/list',
    // 获取城市列表
    POST_COMPETEMEDIA_REGION: CONTEXT_PATH + '/competeMedia/getRegionStatistics',
    // 百度地址搜索
    GET_BAIDU_SEARCH: CONTEXT_PATH + '/competeMedia/baiduMap'

};
