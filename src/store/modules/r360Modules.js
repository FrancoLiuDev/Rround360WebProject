/**
 * @file
 * R360 List VuexModules
 */

/**
 * @class R360Modules
 * @classdesc
 * R360 List VuexModules
 */

import axios from 'axios'
import {
    R360_LIST,
    R360_LIST_NEXT,
    R360_PAG,
} from 'types'

export default {
    state: {
        /**
         * 狀態機 0未查詢 -1服務error 1查詢中 2已查詢 3錯誤訊息
         * @type {Number}
         */
        step: 0,
        /**
         * 取回R360路徑狀態機 0未查詢 -1服務error 1查詢中 2已查詢 3錯誤訊息
         * @type {Number}
         */
        pagStep: 0,
        list: {
            count: 0,
            rows: [],
        },
        r360Path: '',
        errMessage: null,
        pagErrMessage: null,
    },
    getters: {
        //列表是否載入中
        isR360ListLoading(state) {
            return state.step === 1 ? true : false;
        },
        //列表是否全部載完
        isR360ListEnd(state) {
            return state.list.count == state.list.rows.length;
        },
        //h360 list load offset
        r360ListOffset(state) {
            return state.list.rows.length;
        },
        /**
         * R360路徑
         * @param  {Object} state state
         * @return {String}       R360路徑
         */
        getR360Path(state) {
            return state.r360Path + '/zoom/';
        },
    },
    mutations: {
        changeStep(state, step) {
            state.step = step
        },
        setErrMessage(state, error) {
            state.errMessage = error
            state.step = 3
        },
        setServerMessage(state, error) {
            state.errMessage = error
            state.step = -1
        },
        loading(state) {
            state.step = 1
        },
        resList(state, response) {
            if (response.status) {
                state.list = response.data.data
                state.step = 2
            } else {
                state.errMessage = response
                state.step = 3
            }
        },
        resListNext(state, response) {
            if (response.status) {
                state.list.rows.push(response.data.data.rows)
                state.step = 2
            } else {
                state.errMessage = response
                state.step = 3
            }
        },
        resR360Pag(state, response) {
            if (response.status === 200 && response.data.result) {
                state.r360Path = response.data.data
                state.pagStep = 2
            } else {
                state.pagErrMessage = response
                state.pagStep = 3
            }
        },
        pagLoading(state) {
            state.pagStep = 1
        },
        setPagErrMessage(state, error) {
            state.pagErrMessage = error
            state.pagStep = 3
        },
    },
    actions: {
        async [R360_LIST]({ state, commit, rootState }, payload) {
            if (state.step === 1) {
                return
            }
            rootState.isLoading = true; //全頁loading畫面
            commit('loading')
            try {
                let response = await axios({
                    url: ENV_R360_LIST_API,
                    method: 'post',
                    baseURL: ENV_SERVER,
                    data: payload,
                })
                commit('resList', response)
            } catch (err) {
                commit('setServerMessage', err)
            }
            rootState.isLoading = false; //全頁loading畫面
        },
        async [R360_LIST_NEXT]({ state, commit, rootState }, payload = {}) {
            if (state.step === 1) {
                return
            } else if (state.list.conut === state.list.rows.length) {
                return
            }
            payload.offset = state.list.rows.length
            commit('loading')
            try {
                let response = await axios({
                    url: ENV_R360_LIST_API,
                    method: 'post',
                    baseURL: ENV_SERVER,
                    data: payload,
                })
                commit('resListNext', response)
            } catch (err) {
                commit('setServerMessage', err)
            }
        },
        /**
         * 取得R360靜態路徑
         */
        async [R360_PAG]({ state, commit, rootState }, {
            zipkey
        }) {
            commit('pagLoading')
            state.r360Path = ''
            try {
                let response = await axios({
                    url: ENV_R360_PAG_API + zipkey,
                    method: 'get',
                    baseURL: ENV_SERVER,
                })
                commit('resR360Pag', response)
            } catch (err) {
                commit('setPagErrMessage', err)
            }
        },
    },
}
