/**
 * @file:      getters
 * @author:    花夏(liubiao@itoxs.com)
 * @version:   V1.0.0
 * @date:      2018/8/24 下午5:19:26
 */
const getters = {
    meta(state) {
        return state.meta;
    },
    params(state) {
        return state.params;
    },
    cityInfo(state) {
        return state.cityInfo;
    },
    map(state) {
        return state.map;
    },
    citySelectInfo(state) {
        return state.citySelectInfo;
    },
    searchValue(state) {
        return state.searchValue;
    },
    cityCurrent(state) {
        return state.cityCurrent;
    }
};
export default getters;
