/**
 * @file
 * V360 List VuexModules
 */

/**
 * @class V360Modules
 * @classdesc
 * V360 List VuexModules
 */

import axios from 'axios'
import {
    V360_LIST,
    V360_DEL,
    V360_SET_ITEM_STATE,
} from 'types'

export default {
    state: {
        /* 0未載入 1載入中 2載入完成 -1錯誤 */
        status: 0,
        list: {
            count: 0,
            rows: [],
        },
        message: '',
    },
    getters: {
        isV360ListLoading(state) {
            // return state.status === 1 ? true : false
            return false
        },
    },
    mutations: {
        setStatus(state, status) {
            state.status = status
        },
        setList2(state, response) {
            if (response.data.result) {
                state.list = response.data.data.data
                state.status = 2
            } else {
                state.message = response.data
                state.status = -1
            }
        },
        delV360(state, { response, mp4zip }) {
            if (response.data.result) {
                let key = state.list.rows.findIndex(item => item.mp4key === mp4zip)
                state.list.rows.splice(key, 1);
                state.list.count -= 1;
                state.status = 2
            } else {
                state.message = response.data
                state.status = -1
            }
        },
        setMessage(state, message) {
            state.message = message
        },
        changeH360ListItemState(state, {
            mp4key,
            status,
        }) {
            let key = state.list.rows.findIndex(item => item.mp4key === mp4key)
            if (key !== -1 && state.list.rows[key]) {
                state.list.rows[key].status = status
            }
        },
    },
    actions: {
        async [V360_LIST]({ commit }) {
            commit('setStatus', 1)
            try {
                let response = await axios({
                    url: ENV_V360_LIST_API,
                    method: 'get',
                    baseURL: ENV_SERVER,
                })

                commit('setList2', response)
            } catch (err) {
                commit('setMessage', err)
                commit('setStatus', -1)
            }
        },
        async [V360_DEL]({ commit }, mp4zip) {
            commit('setStatus', 1)
            try {
                let response = await axios({
                    url: ENV_V360_DEL_API + mp4zip,
                    method: 'get',
                    baseURL: ENV_SERVER,
                })
                commit('delV360', {
                    mp4zip,
                    response,
                })
            } catch (err) {
                commit('setMessage', err)
                commit('setStatus', -1)
            }
        },
        [V360_SET_ITEM_STATE]({ state, commit, rootState }, payload) {
            commit('changeH360ListItemState', payload)
        },
    }
}
