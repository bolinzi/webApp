/**
 * @file:      mutations
 * @author:    花夏(liubiao@itoxs.com)
 * @version:   V1.0.0
 * @date:      2018/8/24 下午5:20:57
 */
import * as types from './mutation-type';
const mutations = {
    [types.SET_META](state, meta) {
        state.meta = meta;
    },
    [types.SET_PARAMS](state, params) {
        state.params = params;
    },
    [types.SET_CITY_INFO](state, cityInfo) {
        state.cityInfo = cityInfo;
    },
    [types.SET_MAP](state, map) {
        state.map = map;
    },
    [types.SET_CITY_SELECT_INFO](state, citySelectInfo) {
        state.citySelectInfo = citySelectInfo;
    },
    [types.SET_SELECT_VALUE](state, searchValue) {
        state.searchValue = searchValue;
    },
    [types.SET_CITY_CURRENT](state, cityCurrent) {
        state.cityCurrent = cityCurrent;
    }
};
export default mutations;
