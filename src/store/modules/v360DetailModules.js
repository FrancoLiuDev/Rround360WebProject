import axios from 'axios'
import {
    V360_META,
} from 'types'

export default {
    state: {
        /* 0未載入 1載入中 2載入完成 -1錯誤 */
        status: 0,
        meta: {},
        message: '',
    },
    getters: {
        isV360MetaLoading(state) {
            return state.status === 2 ? false : true
        },
    },
    mutations: {
        setStatus(state, status) {
            state.status = status
        },
        setMessage(state, message) {
            state.message = message
        },
        setMetaData(state, response) {
            if (response.result) {
                state.meta = response.data.data
                state.status = 2
            } else {
                state.message = response.data
                state.status = -1
            }
        }
    },
    actions: {
        async [V360_META]({ commit }, mp4zip) {
            commit('setStatus', 1)
            try {
                let response = await axios({
                    url: ENV_V360_META_API + mp4zip,
                    method: 'get',
                    baseURL: ENV_SERVER,
                })
                commit('setMetaData', response.data)
            } catch (err) {
                commit('setMessage', err)
                commit('setStatus', -1)
            }
        },
    },
}
