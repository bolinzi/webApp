/**
 * @file:      actions
 * @author:    花夏(liubiao@itoxs.com)
 * @version:   V1.0.0
 * @date:      2018/8/24 下午5:15:26
 */
import * as types from './mutation-type';

const actions = {
    [types.SET_META]({ commit }) {
        return new Promise(resolve => {
            commit(types.SET_META);
            resolve();
        });
    },
    [types.SET_PARAMS]({ commit }) {
        return new Promise(resolve => {
            commit(types.SET_PARAMS);
            resolve();
        });
    },
    [types.SET_CITY_INFO]({ commit }) {
        return new Promise(resolve => {
            commit(types.SET_CITY_INFO);
            resolve();
        });
    },
    [types.SET_MAP]({ commit }) {
        return new Promise(resolve => {
            commit(types.SET_MAP);
            resolve();
        });
    },
    [types.SET_CITY_SELECT_INFO]({ commit }) {
        return new Promise(resolve => {
            commit(types.SET_CITY_SELECT_INFO);
            resolve();
        });
    },
    [types.SET_SELECT_VALUE]({ commit }) {
        return new Promise(resolve => {
            commit(types.SET_SELECT_VALUE);
            resolve();
        });
    },
    [types.SET_CITY_CURRENT]({ commit }) {
        return new Promise(resolve => {
            commit(types.SET_CITY_CURRENT);
            resolve();
        });
    }
};
export default actions;
