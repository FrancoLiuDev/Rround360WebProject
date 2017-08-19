import axios from 'axios';
import Lazy from 'lazy.js'
import {
    H360_DEL,
    H360_LIST,
    H360_LIST_NEXT,
    H360_LIST_MAX_NUM,
    CHANGE_H360_ITEM,
} from 'types';

export default {
    state: {
        //狀態旗標 0未查詢 -1服務error 1查詢中 2已查詢 3錯誤訊息
        step: 0,
        //h360 list
        list: {
            count: 0, //全部數量
            rows: []
        },
        error: null,
    },
    getters: {
        //列表是否載入中
        isListLoading(state) {
            return state.step === 1 ? true : false;
        },
        //列表是否全部載完
        isListEnd(state) {
            return state.list.count > state.list.rows.length ? false : true
        },
        //一次可載入數量
        canLoadNum(state) {
            if (state.list.count === 0) {
                return H360_LIST_MAX_NUM;
            }
            let num = state.list.count - state.list.rows.length;
            return num > H360_LIST_MAX_NUM ? H360_LIST_MAX_NUM : num;
        },
        //h360 list load offset
        listOffset(state) {
            return state.list.rows.length;
        },
    },
    mutations: {
        changeStep(state, step) {
            state.step = step;
        },
        setList(state, list) {
            state.list = list;
        },
        pushList(state, list) {
            state.list.count = list.count;
            state.list.rows = state.list.rows.concat(list.rows);
        },
        setError(state, {
            err,
            rootState,
        }) {
            state.error = err;
            let code = err.headers.code;
            if (
                code === '01.001' || code === '01.002' || code === '01.003'
            ) {
                rootState.reTaken++; //Token 過期改變rootState的reTaken觸發貞聽
            }
        },
        delAnH360(state, zipkey) {
            let key = state.list.rows.findIndex(item => item.zipkey === zipkey);
            state.list.rows.splice(key, 1);
            state.list.count -= 1;
        },
        changeH360Meta(state, { zipkey, name }) {

            let h360Item = Lazy(state.list.rows).find((item) => {
                return item.zipkey === zipkey
            })
            h360Item ? h360Item.name = name : ''
        },
    },
    actions: {
        //載入h360 list
        async [H360_LIST]({ state, commit, rootState }, payload) {
            rootState.isLoading = true; //全頁loading畫面
            commit('changeStep', 1);
            try {
                let response = await axios({
                    url: '/api/h360',
                    method: 'post',
                    baseURL: ENV_SERVER,
                    data: payload,
                });
                if (response.data.result) {
                    commit('setList', response.data.data.data);
                    commit('changeStep', 2);
                } else {
                    commit('setError', {
                        err: response.data.err,
                        rootState: rootState,
                    });
                    // let code = err.headers.code;
                    commit('changeStep', 3);
                }
            } catch (err) {
                state.error = err;
                commit('changeStep', -1);
            }
            rootState.isLoading = false; //全頁loading畫面
        },
        async [H360_LIST_NEXT]({ state, commit, rootState }, payload) {
            commit('changeStep', 1);
            try {
                let response = await axios({
                    url: '/api/h360',
                    method: 'post',
                    baseURL: ENV_SERVER,
                    data: payload,
                });
                if (response.data.result) {
                    commit('pushList', response.data.data.data);
                    commit('changeStep', 2);
                } else {
                    commit('setError', {
                        err: response.data.err,
                        rootState: rootState,
                    });
                    commit('changeStep', 3);
                }
            } catch (err) {
                state.error = err;
                commit('changeStep', -1);
            }
        },
        /**
         * 刪除H360
         */
        async [H360_DEL]({ state, commit, rootState }, payload) {
            commit('changeStep', 1);
            try {
                let response = await axios({
                    url: '/api/disable/' + payload.zipkey,
                    method: 'get',
                    baseURL: ENV_SERVER,
                });
                if (response.data.result) {
                    commit('delAnH360', payload.zipkey);
                    commit('changeStep', 2);
                } else {
                    commit('setError', {
                        err: response.data.err,
                        rootState: rootState,
                    });
                    commit('changeStep', 3);
                }
            } catch (err) {
                state.error = err;
                commit('changeStep', -1);
            }
        },
        /**
         * 變更一個列表中的H360項目內容<br>例如該h360的meta被修改
         */
        [CHANGE_H360_ITEM]({ state, commit, rootState }, { zipkey, meta }) {
            commit('changeH360Meta', { zipkey: zipkey, name: meta.name });
        },
    }
}
